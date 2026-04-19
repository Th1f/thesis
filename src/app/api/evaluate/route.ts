import { ChatCerebras } from "@langchain/cerebras";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  BaseMessage,
} from "@langchain/core/messages";
import { env } from "../../../env";
import { NextResponse } from "next/server";

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

const evaluatorModel = new ChatCerebras({
  apiKey: env.CEREBRAS_API_KEY,
  model: "llama3.1-8b",
  temperature: 0.1,
});

const userModel = new ChatCerebras({
  apiKey: env.CEREBRAS_API_KEY,
  model: "llama3.1-8b",
  temperature: 0.3,
});

export async function POST(req: Request) {
  try {
    const { document } = await req.json();

    if (!document || typeof document !== "string") {
      return NextResponse.json({ error: "Invalid document" }, { status: 400 });
    }

    const evaluatorSystemPrompt = new SystemMessage(
      `You are an expert operations research AI mimicking a test suite designed to formulate NL4Opt dataset problems into LP structures.
A user will come to you with a business problem. You must ask them questions one-by-one to understand the problem fully (variables, constraints, objective).
DO NOT ask them to formulate the problem, they do not know how to code or use math. You must elicit the information conversationally, for example: "What quantities are you trying to decide?" or "Are there any limits on..."

CRITICAL INSTRUCTIONS:
1. VARIABLE NAMES: Use the EXACT shortest noun phrase from the text (e.g. "color printers", NOT "cp", NOT "color printers production"). Never use snake_case — always use spaces.
2. CONSTRAINT DIRECTIONS: For "direction", extract the exact trigger phrase from the problem description (e.g., "at most", "less than", "budget").
3. CONSTRAINT TYPES — use the correct type:
   - "upperbound"/"lowerbound" for a SINGLE variable bound. NEVER put "+" or two variable names in the var field.
   - "sum" when a limit applies to the TOTAL of ALL variables (e.g. "at most 150 total", "minimum of 100 lamps"). No "var" or "terms" field.
   - "xby" when one variable is a MULTIPLE of another (e.g. "at least four times"). Use "xby" NOT "lowerbound" with a number. The "param" field holds the multiplier word (e.g. "four", "twice").
   - "xy" for direct variable comparisons with no multiplier.
   - "linear" for mixed-coefficient constraints with numeric RHS.
4. When a sentence mentions bounds on MULTIPLE variables, create a SEPARATE entry for EACH — do not skip any.
5. NO DUPLICATES: Before outputting JSON, do a SELF-CHECK — remove entries that share the same type, operator, and limit.
6. DO NOT output the final JSON until you have all the necessary information.
7. NEVER add non-negativity constraints (lower bound = 0). These are implicit and not part of the output.
8. NEVER say goodbye or use farewell phrases. Output the JSON immediately when done.
9. When you have all the information, output ONLY valid JSON using this exact schema:

{
  "obj_declaration": {
    "type": "objective",
    "direction": "maximize" or "minimize",
    "name": "objective name (e.g., 'profit')",
    "terms": { "exact_variable_name_from_text": "coefficient_as_string" }
  },
  "const_declarations": [
    {
      "type": "upperbound" or "lowerbound",
      "direction": "trigger phrase (e.g., 'at most')",
      "limit": "integer limit as string",
      "var": "exact_variable_name_from_text",
      "operator": "LESS_OR_EQUAL" or "GREATER_OR_EQUAL" or "EQUAL"
    },
    {
      "type": "sum",
      "direction": "trigger phrase",
      "limit": "integer limit as string",
      "operator": "LESS_OR_EQUAL" or "GREATER_OR_EQUAL" or "EQUAL"
    },
    {
      "type": "linear",
      "direction": "trigger phrase (e.g., 'budget')",
      "limit": "integer limit as string",
      "operator": "LESS_OR_EQUAL" or "GREATER_OR_EQUAL" or "EQUAL",
      "terms": { "exact_variable_name_from_text": "coefficient_as_string" }
    },
    {
      "type": "xy",
      "direction": "trigger phrase (e.g., 'less than')",
      "x_var": "exact_variable_name_from_text",
      "y_var": "exact_variable_name_from_text",
      "operator": "LESS_OR_EQUAL" or "GREATER_OR_EQUAL" or "EQUAL"
    },
    {
      "type": "xby",
      "direction": "trigger phrase (e.g., 'at most', 'at least')",
      "x_var": "exact_variable_name_from_text",
      "param": "multiplier word from text (e.g., 'twice', 'three times', 'four')",
      "y_var": "exact_variable_name_from_text",
      "operator": "LESS_OR_EQUAL" or "GREATER_OR_EQUAL" or "EQUAL"
    },
    {
      "type": "ratio",
      "direction": "trigger phrase (e.g., 'half as many')",
      "x_var": "exact_variable_name_from_text",
      "y_var": "exact_variable_name_from_text",
      "operator": "LESS_OR_EQUAL" or "GREATER_OR_EQUAL" or "EQUAL",
      "limit_ratio": "ratio limit as string"
    }
  ]
}
Return ONLY valid JSON. No markdown formatting, no explanations.`,
    );

    const userSystemPrompt = new SystemMessage(
      `You are a business owner who needs help with an optimization problem. Here is your problem document:
<document>
${document}
</document>

You do not know how to formulate mathematical models. An expert will ask you questions to help formulate your problem.
CRITICAL INSTRUCTIONS:
1. Answer ONLY what they ask. Be concise.
2. When naming variables, use the SHORTEST exact noun phrase from your document (e.g. "wired headphones", NOT "wired headphones production").
3. When a sentence mentions multiple items with the same constraint (e.g. "at least 5 apples and 10 pears"), state ALL of them — do not drop any.
4. DO NOT give away the entire problem at once. Give information bit by bit.
5. Do not try to fix the problem — if the expert gets something wrong, just answer naturally.`,
    );

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (data: any) => {
          controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
        };

        const evaluatorHistory: BaseMessage[] = [evaluatorSystemPrompt];
        const userHistory: BaseMessage[] = [userSystemPrompt];
        const MAX_TURNS = 20;
        let finalJsonString: string | null = null;

        const isFarewell = (text: string) =>
          /have a (great|good|wonderful|nice)|good(bye| luck|-bye)|best of luck|it was a pleasure|thanks? for (your|the)|all the best|take care|see you|enjoy your|you('re| are) welcome/i
            .test(text);

        const FORCE_JSON_MSG =
          "You have all the information you need. Output ONLY the final JSON now. No goodbye, no explanation — just the JSON object.";

        try {
          let currentMessage =
            "Hi, I have a business problem I want to optimize. Can you help me figure it out by asking me questions?";
          sendEvent({ type: "turn", role: "User", text: currentMessage });

          for (let i = 0; i < MAX_TURNS; i++) {
            // Evaluator Turn
            evaluatorHistory.push(new HumanMessage(currentMessage));
            const evaluatorResponse =
              await evaluatorModel.invoke(evaluatorHistory);
            const evaluatorContent = evaluatorResponse.content as string;
            evaluatorHistory.push(new AIMessage(evaluatorContent));

            // Check if evaluator output JSON
            const maybeJson = evaluatorContent
              .replace(/^```[a-z]*\n?/, "")
              .replace(/```\s*$/, "")
              .trim();

            if (maybeJson.startsWith("{") && maybeJson.endsWith("}")) {
              finalJsonString = maybeJson;
              sendEvent({
                type: "turn",
                role: "Evaluator",
                text: "*** Generated Validation JSON ***",
              });
              break;
            }

            // Farewell detected — force JSON immediately instead of looping
            if (isFarewell(evaluatorContent) || i === MAX_TURNS - 1) {
              evaluatorHistory.push(new HumanMessage(FORCE_JSON_MSG));
              const forcedResponse =
                await evaluatorModel.invoke(evaluatorHistory);
              finalJsonString = (forcedResponse.content as string)
                .replace(/^```[a-z]*\n?/, "")
                .replace(/```\s*$/, "")
                .trim();
              sendEvent({
                type: "turn",
                role: "Evaluator",
                text: "*** Generated Validation JSON ***",
              });
              break;
            }

            sendEvent({
              type: "turn",
              role: "Evaluator",
              text: evaluatorContent,
            });

            // User Turn
            userHistory.push(new HumanMessage(evaluatorContent));
            const userResponse = await userModel.invoke(userHistory);
            const userContent = userResponse.content as string;
            userHistory.push(new AIMessage(userContent));

            currentMessage = userContent;
            sendEvent({ type: "turn", role: "User", text: userContent });
          }

          if (!finalJsonString) {
            throw new Error("No JSON found");
          }
          const parsed = JSON.parse(finalJsonString);
          sendEvent({ type: "result", result: postProcess(parsed) });
        } catch (err) {
          console.error("Failed during evaluation stream:", err);
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
    console.error("Evaluation API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
