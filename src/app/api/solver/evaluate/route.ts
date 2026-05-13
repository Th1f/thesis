import { ChatOpenAI } from "@langchain/openai";
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
  return String(v ?? "")
    .replace(/[$%,]/g, "")
    .trim();
}

function postProcess(parsed: any): any {
  if (!Array.isArray(parsed.const_declarations)) return parsed;
  let cs: any[] = parsed.const_declarations;

  // 1. Normalise limit values — strip $, %, commas
  cs = cs.map((c) =>
    c.limit !== undefined ? { ...c, limit: normalizeLimit(c.limit) } : c,
  );

  // 2. Remove implicit non-negativity lower bounds (lb = 0)
  cs = cs.filter(
    (c) =>
      !(
        c.type === "lowerbound" &&
        c.operator === "GREATER_OR_EQUAL" &&
        normalizeLimit(c.limit) === "0"
      ),
  );

  // 3. Remove constraints whose limit is still not numeric (e.g. "null", free-text)
  cs = cs.filter(
    (c) => XY_LIKE.has(c.type) || (!isNaN(Number(c.limit)) && c.limit !== ""),
  );

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
    if (
      c.type === "upperbound" ||
      c.type === "lowerbound" ||
      c.type === "linear"
    ) {
      const varStr = String(c.var ?? "");
      if (varStr.includes("+") || Array.isArray(c.vars)) {
        const { var: _v, vars: _vs, terms: _t, ...rest } = c;
        return { ...rest, type: "sum" };
      }
    }
    return c;
  });

  // 7. Normalise snake_case variable names to spaced names
  const toSpaced = (s: any) =>
    typeof s === "string" ? s.replace(/_/g, " ") : s;
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

  // Normalise var_declarations if present
  const varDecls = Array.isArray(parsed.var_declarations)
    ? (parsed.var_declarations as any[]).map((v) => ({
        name: typeof v.name === "string" ? v.name.replace(/_/g, " ") : v.name,
        type: v.type ?? "continuous",
      }))
    : undefined;

  return {
    ...(varDecls ? { var_declarations: varDecls } : {}),
    ...parsed,
    const_declarations: cs,
  };
}

const elicitationModel = new ChatOpenAI({
  apiKey: env.DEEPSEEK_API_KEY,
  model: "deepseek-chat",
  temperature: 0.1,
  configuration: { baseURL: "https://api.deepseek.com/v1" },
});

const userSimModel = new ChatOpenAI({
  apiKey: env.DEEPSEEK_API_KEY,
  model: "deepseek-chat",
  temperature: 0.3,
  configuration: { baseURL: "https://api.deepseek.com/v1" },
});

const ELICITATION_SYSTEM = `You are an expert operations research AI formulating Mixed Integer Linear Programming (MILP) problems.
A user will come to you with a business problem. Ask them questions one-by-one to understand:
  - The objective (maximise/minimise what, with which exact coefficients per variable)
  - Every decision variable (use EXACT phrases from the text, never abbreviate)
  - The TYPE of each variable: must it be a whole number (integer), a yes/no choice (binary: 0 or 1), or can it be any amount (continuous)?
  - Every constraint (type, exact coefficients for each variable, RHS value, operator)
  - Non-negativity or other bounds

CRITICAL EXTRACTION RULES:
1. VARIABLE NAMES: Use the EXACT shortest noun phrase from the document (e.g. "color printers", NOT "cp", NOT "color printers production"). Never use snake_case — use spaces.
2. VARIABLE TYPES — ask the user if each quantity must be a whole number:
   - "integer": counts of discrete items (e.g. trucks, machines, people). Ask "does this have to be a whole number?"
   - "binary": yes/no decisions (e.g. whether to open a factory). Ask "is this a yes-or-no decision?"
   - "continuous": amounts that can be fractional (e.g. kg of fertilizer, hours, dollars).
3. DIRECTION FIELD: Use the exact trigger phrase from the problem text (e.g. "at most", "budget", "less than").
4. COEFFICIENT ACCURACY: Ask for the exact numerical coefficient for every variable in every constraint.
5. CONSTRAINT TYPES — use the EXACT correct type (these are strictly defined):
   - "upperbound"/"lowerbound": a SINGLE variable bound against a NUMERIC limit. e.g. "at most 3 billboards" → type "upperbound", var "billboards", limit "3". NEVER use upperbound/lowerbound when the limit is another variable name.
   - "sum": a numeric limit on the SUM of ALL decision variables (e.g. "at most 150 total"). No "var" or "terms" field.
   - "linear": general linear constraint with DIFFERENT numeric coefficients per variable and a numeric RHS. e.g. "750x + 1000y <= 20000".
   - "xy": one variable compared DIRECTLY to another variable with NO multiplier and NO percentage. Fields: x_var, y_var, operator.
   - "xby": one variable is a WHOLE-NUMBER MULTIPLE of another single variable. Fields: x_var, param (multiplier word), y_var.
   - "ratio": a variable must be at most/least X% OF THE TOTAL of ALL decision variables. Fields: var, limit (percentage string e.g. "30%"), operator.
6. RATIO vs XBY — KEY DISTINCTION:
   - Use "ratio" ONLY when the constraint is "X <= P% of (sum of ALL variables)".
   - Use "xby" ONLY when the constraint is "X <= N * Y" where Y is a SPECIFIC OTHER variable.
   - Use "xy" ONLY when the constraint is "X <= Y" with NO multiplier and NO percentage.
7. When a sentence mentions bounds on MULTIPLE variables, create a SEPARATE entry for EACH.
8. Do NOT output JSON until every variable type, constraint, and coefficient is confirmed.
9. SELF-CHECK before outputting: re-read every sentence and verify each constraint is captured.
10. NEVER add non-negativity constraints (lower bound = 0). These are implicit.
11. NEVER say goodbye. When ready, output the JSON immediately.

When ready, output ONLY valid JSON (no markdown fences, no explanation):
{
  "var_declarations": [
    {
      "name": "exact_variable_name",
      "type": "continuous" | "integer" | "binary"
    }
  ],
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
      "limit": "numeric limit as string",
      "var": "exact_variable_name",
      "operator": "LESS_OR_EQUAL" | "GREATER_OR_EQUAL" | "EQUAL"
    },
    {
      "type": "sum",
      "direction": "trigger phrase",
      "limit": "numeric limit as string",
      "operator": "LESS_OR_EQUAL" | "GREATER_OR_EQUAL" | "EQUAL"
    },
    {
      "type": "linear",
      "direction": "trigger phrase",
      "limit": "numeric limit as string",
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
      "direction": "trigger phrase",
      "x_var": "exact_variable_name",
      "param": "multiplier word from text (e.g. 'twice', 'third', 'four times')",
      "y_var": "exact_variable_name",
      "operator": "LESS_OR_EQUAL" | "GREATER_OR_EQUAL" | "EQUAL"
    },
    {
      "type": "ratio",
      "direction": "trigger phrase",
      "var": "exact_variable_name (the constrained variable)",
      "limit": "percentage as string (e.g. '30%', '40%')",
      "operator": "LESS_OR_EQUAL" | "GREATER_OR_EQUAL" | "EQUAL"
    }
  ]
}
Return ONLY valid JSON. No markdown, no explanation.`;

const USER_SIM_SYSTEM = (document: string) =>
  `You are a small business owner who needs help planning your business. Here is your situation:
<document>
${document}
</document>

You have NEVER heard of linear programming, optimisation, or operations research. You do not know what "constraints", "variables", "objective function", "maximise", "minimise", or "coefficients" mean in a mathematical sense. You only understand your own business in plain everyday language.

RULES:
1. Answer ONLY what is asked. Be concise and use plain, non-technical business language.
2. If asked about "decision variables", "constraints", or other LP/math jargon, respond with confusion (e.g. "Sorry, I'm not sure what you mean — can you put that differently?") and then answer in your own words about your business.
3. Never use LP or math jargon yourself. Say things like "I need to figure out how many to produce", NOT "the decision variable is...".
4. Refer to numbers and limits using everyday phrases: "we can't spend more than...", "we need to make at least...", "I want to earn as much as possible", etc.
5. When a sentence mentions multiple items with the same rule (e.g. "at least 5 apples and 10 pears"), state ALL of them — do not drop any.
6. Do NOT volunteer all information at once — answer one question at a time, naturally.
7. If the expert says something that sounds like a mathematical formula or technical term you don't recognise, ask them to explain in simpler terms before answering.`;

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
          /have a (great|good|wonderful|nice)|good(bye| luck|-bye)|best of luck|it was a pleasure|thanks? for (your|the)|all the best|take care|see you|enjoy your|you('re| are) welcome/i.test(
            text,
          );

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
