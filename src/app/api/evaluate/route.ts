import { ChatOpenAI } from "@langchain/openai";
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

const evaluatorModel = new ChatOpenAI({
  apiKey: env.DEEPSEEK_API_KEY,
  model: "deepseek-chat",
  temperature: 0.1,
  configuration: { baseURL: "https://api.deepseek.com/v1" },
});

const userModel = new ChatOpenAI({
  apiKey: env.DEEPSEEK_API_KEY,
  model: "deepseek-chat",
  temperature: 0.3,
  configuration: { baseURL: "https://api.deepseek.com/v1" },
});

export async function POST(req: Request) {
  try {
    const { document } = await req.json();

    if (!document || typeof document !== "string") {
      return NextResponse.json({ error: "Invalid document" }, { status: 400 });
    }

    const evaluatorSystemPrompt = new SystemMessage(
      `You are an expert operations research AI formulating Mixed Integer Linear Programming (MILP) problems.
A user will come to you with a business problem. Ask them questions one-by-one to understand the problem fully (variables, their types, constraints, objective).
DO NOT ask them to formulate the problem — they do not know math or coding. Elicit the information conversationally.

CRITICAL INSTRUCTIONS:
1. VARIABLE NAMES: Use the EXACT shortest noun phrase from the text (e.g. "color printers", NOT "cp", NOT "color printers production"). Never use snake_case — always use spaces.
2. VARIABLE TYPES — for each variable, ask whether it must be a whole number:
   - "integer": countable discrete items (trucks, machines, people). Ask "does this need to be a whole number?"
   - "binary": yes/no decisions (open a factory or not). Ask "is this a yes-or-no choice?"
   - "continuous": fractional amounts (kg, hours, dollars).
3. CONSTRAINT DIRECTIONS: For "direction", extract the exact trigger phrase from the problem description (e.g., "at most", "less than", "budget").
4. CONSTRAINT TYPES — use the correct type:
   - "upperbound"/"lowerbound" for a SINGLE variable bound. NEVER put "+" or two variable names in the var field.
   - "sum" when a limit applies to the TOTAL of ALL variables (e.g. "at most 150 total"). No "var" or "terms" field.
   - "xby" when one variable is a MULTIPLE of another. The "param" field holds the multiplier word (e.g. "four", "twice").
   - "xy" for direct variable comparisons with no multiplier.
   - "linear" for mixed-coefficient constraints with numeric RHS.
5. When a sentence mentions bounds on MULTIPLE variables, create a SEPARATE entry for EACH — do not skip any.
6. NO DUPLICATES: Before outputting JSON, do a SELF-CHECK — remove entries that share the same type, operator, and limit.
7. DO NOT output the final JSON until you have all variable types, constraints, and coefficients confirmed.
8. NEVER add non-negativity constraints (lower bound = 0). These are implicit and not part of the output.
9. NEVER say goodbye or use farewell phrases. Output the JSON immediately when done.
10. When you have all the information, output ONLY valid JSON using this exact schema:

{
  "var_declarations": [
    { "name": "exact_variable_name_from_text", "type": "continuous" | "integer" | "binary" }
  ],
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
      `You are a small business owner who needs help planning your business. Here is your situation:
<document>
${document}
</document>

You have NEVER heard of linear programming, optimization, or operations research. You do not know what "constraints", "variables", "objective function", "maximize", "minimize", or "coefficients" mean in a mathematical sense. You only understand your own business in plain everyday language.

CRITICAL INSTRUCTIONS:
1. Answer ONLY what is asked. Be concise and use plain, non-technical business language.
2. If asked about "decision variables" or "constraints", respond with confusion (e.g. "I'm not sure what you mean by that — can you explain?") and then answer in your own words about your business.
3. Never use LP or math jargon. Say things like "I need to figure out how many to make", NOT "the decision variable is...".
4. Refer to numbers and limits using everyday phrases: "we can't spend more than...", "we need at least...", "I want to make as much money as possible", etc.
5. When asked about multiple items with the same rule (e.g. "at least 5 apples and 10 pears"), state ALL of them — do not drop any.
6. Do NOT volunteer all information at once. Answer one question at a time, naturally.
7. If the expert says something that sounds like math or jargon you don't recognise, ask them to explain in simpler terms before answering.`,
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
          /have a (great|good|wonderful|nice)|good(bye| luck|-bye)|best of luck|it was a pleasure|thanks? for (your|the)|all the best|take care|see you|enjoy your|you('re| are) welcome/i.test(
            text,
          );

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
