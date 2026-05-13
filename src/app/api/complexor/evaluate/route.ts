/**
 * /api/complexor/evaluate
 *
 * Evaluation route for the ComplexOR dataset.
 * Uses a general-purpose system prompt that does not impose the NL4Opt constraint-type
 * taxonomy — it asks for objective direction and each constraint's sense operator + RHS.
 * Matching is done on operator + RHS value rather than NL4Opt-style type/variable matching.
 *
 * Streaming events (NDJSON):
 *   { type: "turn",   role: "Evaluator"|"User", text: string }
 *   { type: "result", result: { obj_declaration, const_declarations } }
 *   { type: "error",  message: string }
 */

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

// ─── Post-processing ──────────────────────────────────────────────────────────

function normalizeLimit(v: unknown): string {
  return String(v ?? "").replace(/[$%,]/g, "").trim();
}

function postProcess(parsed: unknown): unknown {
  const p = parsed as Record<string, unknown>;
  if (!Array.isArray(p.const_declarations)) return parsed;
  let cs = p.const_declarations as Record<string, unknown>[];

  // Normalize limit values
  cs = cs.map((c) =>
    c.limit !== undefined ? { ...c, limit: normalizeLimit(c.limit) } : c,
  );

  // Remove constraints with empty or non-numeric limits
  cs = cs.filter(
    (c) => !isNaN(Number(c.limit)) && String(c.limit ?? "").trim() !== "",
  );

  // Remove implicit non-negativity lower bounds
  cs = cs.filter(
    (c) =>
      !(
        (c.operator === "GREATER_OR_EQUAL" || c.operator === ">=") &&
        normalizeLimit(c.limit) === "0"
      ),
  );

  // Deduplicate on operator + limit
  const seen = new Set<string>();
  cs = cs.filter((c) => {
    const key = `${String(c.operator)}|${normalizeLimit(c.limit)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { ...p, const_declarations: cs };
}

// ─── Models ───────────────────────────────────────────────────────────────────

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

// ─── Prompts ──────────────────────────────────────────────────────────────────

const ELICITATION_SYSTEM = `You are an expert operations research AI helping formulate complex optimisation problems.
A user will come to you with a business or engineering optimisation problem. Ask them questions one-by-one to understand:
  - The objective: what to maximise or minimise, and the exact coefficients per variable.
  - Every decision variable (use exact phrases from the problem text).
  - Every constraint: its sense operator (<= or >= or =) and the right-hand-side (RHS) numeric value.
  - Any variable bounds.

CRITICAL RULES:
1. Ask ONE clear question at a time.
2. Identify ALL constraints — re-read the problem carefully before committing to JSON.
3. For every constraint, confirm the exact RHS numeric value. Do not estimate.
4. Do NOT include non-negativity constraints (x >= 0) — these are implicit in LP.
5. NEVER say goodbye or use farewell phrases. When ready, output the JSON immediately.
6. Self-check: before outputting JSON, scan every sentence of the problem to confirm all constraints are captured.

When ready, output ONLY valid JSON (no markdown fences, no explanation):
{
  "obj_declaration": {
    "direction": "maximize" | "minimize",
    "name": "short objective name"
  },
  "const_declarations": [
    {
      "type": "linear",
      "operator": "LESS_OR_EQUAL" | "GREATER_OR_EQUAL" | "EQUAL",
      "limit": "RHS value as a plain numeric string",
      "description": "one-line description of the constraint"
    }
  ]
}
Return ONLY valid JSON. No markdown, no explanation.`;

const USER_SIM_SYSTEM = (document: string) =>
  `You are a business owner or manager who needs help planning your operations. Here is your situation:
<document>
${document}
</document>

You have NEVER heard of linear programming, optimisation, or operations research. You do not know what "constraints", "variables", "objective function", "maximise", "minimise", "coefficients", or "RHS" mean in a mathematical sense. You only understand your own business or project in plain everyday language.

Follow these rules:
1. Answer ONLY what is asked. Be concise and use plain, non-technical language.
2. If asked about "decision variables", "constraints", "objective", or any LP/math jargon, respond with confusion (e.g. "I'm not familiar with that term — what do you mean?") and then describe your situation in your own words.
3. Never use LP or math terminology yourself. Say things like "I want to spend as little as possible" or "we can't go over our budget", NOT "the objective is to minimise cost".
4. State exact numbers from your problem when asked, but frame them naturally: "our budget is $5000", "we need at least 10 units", etc.
5. When a sentence mentions multiple rules or limits, state ALL of them — do not drop any.
6. Do NOT volunteer all information at once — answer one question at a time, naturally.
7. If the expert uses a term or formula you don't recognise, ask them to explain in plain language before answering.`;

// ─── Route ────────────────────────────────────────────────────────────────────

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

        const elicitHistory: BaseMessage[] = [new SystemMessage(ELICITATION_SYSTEM)];
        const userHistory: BaseMessage[] = [new SystemMessage(USER_SIM_SYSTEM(document))];
        const MAX_TURNS = 24;
        let finalJsonString: string | null = null;

        const isFarewell = (text: string) =>
          /have a (great|good|wonderful|nice)|good(bye| luck|-bye)|best of luck|it was a pleasure|thanks? for (your|the)|all the best|take care|see you|enjoy your|you('re| are) welcome/i.test(
            text,
          );

        const FORCE_JSON_MSG =
          "You have all the information needed. Output ONLY the final JSON now — no goodbye, no explanation.";

        try {
          let currentMsg =
            "Hi, I need some help planning my business. I have a situation I'd like to figure out — can you ask me some questions to help me work through it?";
          sendEvent({ type: "turn", role: "User", text: currentMsg });

          for (let i = 0; i < MAX_TURNS; i++) {
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
              sendEvent({ type: "turn", role: "Evaluator", text: "*** Generated JSON ***" });
              break;
            }

            if (isFarewell(elicitContent) || i === MAX_TURNS - 1) {
              elicitHistory.push(new HumanMessage(FORCE_JSON_MSG));
              const forced = await elicitationModel.invoke(elicitHistory);
              finalJsonString = (forced.content as string)
                .replace(/^```[a-z]*\n?/m, "")
                .replace(/```\s*$/m, "")
                .trim();
              sendEvent({ type: "turn", role: "Evaluator", text: "*** Generated JSON (forced) ***" });
              break;
            }

            sendEvent({ type: "turn", role: "Evaluator", text: elicitContent });

            userHistory.push(new HumanMessage(elicitContent));
            const userResp = await userSimModel.invoke(userHistory);
            const userContent = userResp.content as string;
            userHistory.push(new AIMessage(userContent));

            currentMsg = userContent;
            sendEvent({ type: "turn", role: "User", text: userContent });
          }

          if (!finalJsonString) throw new Error("No JSON produced");

          const parsed = JSON.parse(finalJsonString) as unknown;
          sendEvent({ type: "result", result: postProcess(parsed) });
        } catch (err) {
          console.error("ComplexOR evaluate stream error:", err);
          sendEvent({ type: "error", message: "Evaluation failed or returned invalid JSON." });
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
    console.error("ComplexOR evaluate API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
