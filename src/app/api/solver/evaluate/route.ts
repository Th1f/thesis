/**
 * /api/solver/evaluate
 *
 * Batch evaluation route for the NEW multi-agent elicitation pipeline.
 * Uses an improved elicitation system prompt against the same NL4Opt ground-truth
 * format, so accuracy can be directly compared to the baseline /api/evaluate route.
 *
 * Streaming events (NDJSON):
 *   { type: "turn",   role: "Evaluator"|"User", text: string }
 *   { type: "result", result: { obj_declaration, const_declarations } }
 *   { type: "error",  message: string }
 */

import { ChatCerebras } from "@langchain/cerebras";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  BaseMessage,
} from "@langchain/core/messages";
import { env } from "../../../../env";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// ─── Post-processing pipeline ─────────────────────────────────────────────────
const XY_LIKE = new Set(["xy", "xby", "ratio"]);

function normalizeLimit(v: any): string {
  return String(v ?? "").replace(/[$%,]/g, "").trim();
}

function postProcess(parsed: any): any {
  if (!Array.isArray(parsed.const_declarations)) return parsed;
  let cs: any[] = parsed.const_declarations;

  // 1. Normalise limit values — strip $, %, commas
  cs = cs.map((c) => (c.limit !== undefined ? { ...c, limit: normalizeLimit(c.limit) } : c));

  // 2. Remove implicit non-negativity lower bounds (lb = 0)
  cs = cs.filter(
    (c) => !(c.type === "lowerbound" && c.operator === "GREATER_OR_EQUAL" && normalizeLimit(c.limit) === "0"),
  );

  // 3. Remove constraints whose limit is still not numeric (e.g. "null", free-text)
  cs = cs.filter((c) => XY_LIKE.has(c.type) || (!isNaN(Number(c.limit)) && c.limit !== ""));

  // 4. Convert linear with all-"1" coefficients → sum (drop terms)
  cs = cs.map((c) => {
    if (c.type !== "linear" || !c.terms) return c;
    const vals = Object.values(c.terms) as string[];
    if (vals.length > 0 && vals.every((v) => String(v).trim() === "1")) {
      const { terms: _t, ...rest } = c;
      return { ...rest, type: "sum" };
    }
    return c;
  });

  // 5. Remove spurious terms field from sum constraints
  cs = cs.map((c) => {
    if (c.type === "sum" && c.terms) {
      const { terms: _t, ...rest } = c;
      return rest;
    }
    return c;
  });

  // 6. Convert bounds/linear whose var contains "+" or "vars" array → sum
  cs = cs.map((c) => {
    if (c.type === "upperbound" || c.type === "lowerbound" || c.type === "linear") {
      const varStr = String(c.var ?? "");
      if (varStr.includes("+") || Array.isArray(c.vars)) {
        const { var: _v, vars: _vs, terms: _t, ...rest } = c;
        return { ...rest, type: "sum" };
      }
    }
    return c;
  });

  // 7. Normalise snake_case variable names to spaced names
  const toSpaced = (s: any) => (typeof s === "string" ? s.replace(/_/g, " ") : s);
  cs = cs.map((c) => ({
    ...c,
    ...(c.var !== undefined ? { var: toSpaced(c.var) } : {}),
    ...(c.x_var !== undefined ? { x_var: toSpaced(c.x_var) } : {}),
    ...(c.y_var !== undefined ? { y_var: toSpaced(c.y_var) } : {}),
  }));

  // 8. Deduplicate
  const seen = new Set<string>();
  cs = cs.filter((c: any) => {
    const key = XY_LIKE.has(c.type)
      ? `${c.type}|${c.operator}|${c.x_var}|${c.y_var}`
      : `${c.type}|${c.operator}|${normalizeLimit(c.limit)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { ...parsed, const_declarations: cs };
}

const elicitationModel = new ChatCerebras({
  apiKey: env.CEREBRAS_API_KEY,
  model: "llama3.1-8b",
  temperature: 0.1,
});

const userSimModel = new ChatCerebras({
  apiKey: env.CEREBRAS_API_KEY,
  model: "llama3.1-8b",
  temperature: 0.3,
});

// ─── Improved elicitation prompt ─────────────────────────────────────────────
// Key improvements over baseline:
// 1. Explicit instruction to probe for EVERY coefficient, not just variable names.
// 2. Separate passes for "is the formulation complete?" before committing to JSON.
// 3. Stricter instruction on using exact text spans for variable/direction names.
// 4. Handles ratio and xy constraint types explicitly.
const ELICITATION_SYSTEM = `You are an expert operations research AI formulating NL4Opt dataset problems into LP structures.
A user will come to you with a business problem. Ask them questions one-by-one to understand:
  - The objective (maximise/minimise what, with which exact coefficients per variable)
  - Every decision variable (use EXACT phrases from the text, never abbreviate)
  - Every constraint (type, exact coefficients for each variable, RHS value, operator)
  - Non-negativity or other bounds

CRITICAL EXTRACTION RULES:
1. VARIABLE NAMES: Use the EXACT shortest noun phrase from the document (e.g. "color printers", NOT "cp", NOT "color printers production"). Never use snake_case — use spaces.
2. DIRECTION FIELD: Use the exact trigger phrase from the problem text (e.g. "at most", "budget", "less than").
3. COEFFICIENT ACCURACY: Ask for the exact numerical coefficient for every variable in every constraint.
4. CONSTRAINT TYPES — use the correct type:
   - "upperbound"/"lowerbound" for a SINGLE variable bound (var <= limit or var >= limit). NEVER put two variable names or "+" in the var field.
   - "sum" when a limit applies to the TOTAL of ALL decision variables combined (e.g. "at most 150 total", "minimum of 100 lamps"). The "sum" type has NO "var" or "terms" field.
   - "linear" for general linear constraints with mixed (non-1) coefficients and a numeric RHS.
   - "xby" when one variable is a MULTIPLE of another (e.g. "at most twice", "at least four times"). Use "xby", NOT "lowerbound" with a numeric multiplier. The "param" field holds the multiplier word (e.g. "twice", "four").
   - "xy" for direct variable comparisons with no multiplier (x_var OP y_var).
   - "ratio" for fractional multipliers (e.g. "half as many").
5. When a sentence mentions bounds on MULTIPLE variables (e.g. "at least 5 apples and 10 pears"), create a SEPARATE constraint entry for EACH variable — do not skip any.
6. Do NOT output JSON until you are confident every constraint and coefficient has been identified.
7. Before outputting JSON, do a SELF-CHECK: re-read every sentence of the problem and confirm each constraint is captured.
8. NEVER add non-negativity constraints (lower bound = 0). These are implicit in LP and are NOT part of the output.
9. NEVER say goodbye or use farewell phrases. When ready, output the JSON immediately.

When ready, output ONLY valid JSON (no markdown fences, no explanation):
{
  "obj_declaration": {
    "type": "objective",
    "direction": "maximize" | "minimize",
    "name": "objective name (e.g. 'profit')",
    "terms": { "exact_variable_name": "coefficient_as_string" }
  },
  "const_declarations": [
    {
      "type": "upperbound" | "lowerbound",
      "direction": "trigger phrase",
      "limit": "integer limit as string",
      "var": "exact_variable_name",
      "operator": "LESS_OR_EQUAL" | "GREATER_OR_EQUAL" | "EQUAL"
    },
    {
      "type": "sum",
      "direction": "trigger phrase",
      "limit": "integer limit as string",
      "operator": "LESS_OR_EQUAL" | "GREATER_OR_EQUAL" | "EQUAL"
    },
    {
      "type": "linear",
      "direction": "trigger phrase",
      "limit": "integer limit as string",
      "operator": "LESS_OR_EQUAL" | "GREATER_OR_EQUAL" | "EQUAL",
      "terms": { "exact_variable_name": "coefficient_as_string" }
    },
    {
      "type": "xy",
      "direction": "trigger phrase",
      "x_var": "exact_variable_name",
      "y_var": "exact_variable_name",
      "operator": "LESS_OR_EQUAL" | "GREATER_OR_EQUAL" | "EQUAL"
    },
    {
      "type": "xby",
      "direction": "trigger phrase (e.g., 'at most', 'at least')",
      "x_var": "exact_variable_name",
      "param": "multiplier word from text (e.g., 'twice', 'three times', 'four')",
      "y_var": "exact_variable_name",
      "operator": "LESS_OR_EQUAL" | "GREATER_OR_EQUAL" | "EQUAL"
    },
    {
      "type": "ratio",
      "direction": "trigger phrase",
      "x_var": "exact_variable_name",
      "y_var": "exact_variable_name",
      "operator": "LESS_OR_EQUAL" | "GREATER_OR_EQUAL" | "EQUAL",
      "limit_ratio": "ratio as string"
    }
  ]
}
Return ONLY valid JSON. No markdown, no explanation.`;

const USER_SIM_SYSTEM = (document: string) =>
  `You are a business owner who needs help with an optimisation problem. Your problem is:
<document>
${document}
</document>

You do not know how to write mathematical models. An expert will ask you questions to help.
RULES:
1. Answer ONLY what is asked. Be concise.
2. When naming variables, use the SHORTEST exact noun phrase from your document (e.g. "wired headphones", NOT "wired headphones production" or "number of wired headphones").
3. When a sentence mentions multiple items with the same constraint (e.g. "at least 5 apples and 10 pears"), state ALL of them — do not drop any.
4. Do NOT volunteer all information at once — answer one question at a time.
5. If the expert states something wrong, just answer naturally; do not correct their formulation.`;

// ─── Route ───────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { document } = (await req.json()) as { document: string };

    if (!document || typeof document !== "string") {
      return NextResponse.json({ error: "Invalid document" }, { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (data: object) =>
          controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));

        const elicitHistory: BaseMessage[] = [
          new SystemMessage(ELICITATION_SYSTEM),
        ];
        const userHistory: BaseMessage[] = [
          new SystemMessage(USER_SIM_SYSTEM(document)),
        ];
        const MAX_TURNS = 22;
        let finalJsonString: string | null = null;

        const isFarewell = (text: string) =>
          /have a (great|good|wonderful|nice)|good(bye| luck|-bye)|best of luck|it was a pleasure|thanks? for (your|the)|all the best|take care|see you|enjoy your|you('re| are) welcome/i
            .test(text);

        const FORCE_JSON_MSG =
          "You have all the information you need. Output ONLY the final JSON now. No goodbye, no explanation — just the JSON object.";

        try {
          let currentMsg =
            "Hi, I have a business problem I want to optimise. Can you help me by asking questions?";
          sendEvent({ type: "turn", role: "User", text: currentMsg });

          for (let i = 0; i < MAX_TURNS; i++) {
            // ── Elicitation agent turn ──────────────────────────────────────
            elicitHistory.push(new HumanMessage(currentMsg));
            const elicitResp = await elicitationModel.invoke(elicitHistory);
            const elicitContent = elicitResp.content as string;
            elicitHistory.push(new AIMessage(elicitContent));

            const stripped = elicitContent
              .replace(/^```[a-z]*\n?/m, "")
              .replace(/```\s*$/m, "")
              .trim();

            if (stripped.startsWith("{") && stripped.endsWith("}")) {
              finalJsonString = stripped;
              sendEvent({
                type: "turn",
                role: "Evaluator",
                text: "*** Generated JSON ***",
              });
              break;
            }

            // Farewell detected or last turn — force JSON immediately
            if (isFarewell(elicitContent) || i === MAX_TURNS - 1) {
              elicitHistory.push(new HumanMessage(FORCE_JSON_MSG));
              const forced = await elicitationModel.invoke(elicitHistory);
              finalJsonString = (forced.content as string)
                .replace(/^```[a-z]*\n?/m, "")
                .replace(/```\s*$/m, "")
                .trim();
              sendEvent({
                type: "turn",
                role: "Evaluator",
                text: "*** Generated JSON (forced) ***",
              });
              break;
            }

            sendEvent({ type: "turn", role: "Evaluator", text: elicitContent });

            // ── User simulation turn ────────────────────────────────────────
            userHistory.push(new HumanMessage(elicitContent));
            const userResp = await userSimModel.invoke(userHistory);
            const userContent = userResp.content as string;
            userHistory.push(new AIMessage(userContent));

            currentMsg = userContent;
            sendEvent({ type: "turn", role: "User", text: userContent });
          }

          if (!finalJsonString) throw new Error("No JSON produced");

          const parsed = JSON.parse(finalJsonString);
          sendEvent({ type: "result", result: postProcess(parsed) });
        } catch (err) {
          console.error("Solver evaluate stream error:", err);
          sendEvent({
            type: "error",
            message: "Evaluation failed or returned invalid JSON.",
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Solver evaluate API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
