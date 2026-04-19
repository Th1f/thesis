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

const elicitationModel = new ChatCerebras({
  apiKey: env.CEREBRAS_API_KEY,
  model: "llama3.1-8b",
  temperature: 0.15,
});

const ELICITATION_SYSTEM = `You are an expert operations research assistant specialising in linear programming (LP).
Your role is to gather ALL information needed to formulate a complete LP optimisation problem through focused, natural conversation with the user.

WHAT YOU MUST EXTRACT — work through these systematically:
1. OBJECTIVE  — What are they optimising? (profit, cost, time…) Is it maximise or minimise?
                 Ask for the EXACT value/profit per unit for every variable.
2. VARIABLES  — What quantities can they control? (e.g. "number of chairs produced").
                 Use the EXACT phrases the user uses — never abbreviate to single letters.
3. CONSTRAINTS — Every resource limit, requirement, or relationship.
                 For each one: get the coefficient for EVERY variable and the right-hand-side number.
4. BOUNDS     — Are the variables non-negative? Any explicit upper limits?

CONVERSATION RULES:
- ALWAYS assume that the user does not know anything about linear optimization
- ALWAYS elicitate in simple terms 
- Ask ONE focused topic at a time. Never ask more than two questions at once.
- Always ask for SPECIFIC NUMBERS when a quantity is mentioned.
- Restate what you have understood and ask the user to confirm before proceeding.
- If the user gives vague answers, probe deeper ("How much exactly?", "What is the limit?").
- Do NOT assume any coefficient unless the user has stated it explicitly.
- When you are confident you have a complete, consistent formulation, summarise it for the user and ask them to confirm it is correct.

WHEN COMPLETE — after the user confirms the summary — output this EXACT block (no other text after it):
<LP_READY>
{
  "direction": "maximize" | "minimize",
  "objective_name": "profit" | "cost" | etc,
  "objective_coefficients": { "exact variable name from user": numeric_coefficient },
  "variables": [
    { "name": "exact variable name", "description": "what it represents", "unit": "unit if known" }
  ],
  "constraints": [
    {
      "name": "short constraint label",
      "description": "plain-English description",
      "coefficients": { "exact variable name": numeric_coefficient },
      "operator": "<=" | ">=" | "=",
      "rhs": numeric_value
    }
  ],
  "variable_bounds": { "exact variable name": { "lower": 0, "upper": null } }
}
</LP_READY>

Do NOT emit <LP_READY> until the user has explicitly confirmed the summary is correct.`;

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const history: BaseMessage[] = [
      new SystemMessage(ELICITATION_SYSTEM),
      ...messages.map((m) =>
        m.role === "user"
          ? new HumanMessage(m.content)
          : new AIMessage(m.content),
      ),
    ];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const enqueue = (data: object) =>
          controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));

        try {
          const response = await elicitationModel.invoke(history);
          const text =
            typeof response.content === "string" ? response.content : "";

          enqueue({ type: "message", text });

          // Detect LP_READY signal
          const readyMatch = text.match(/<LP_READY>([\s\S]*?)<\/LP_READY>/);
          if (readyMatch) {
            try {
              const problem = JSON.parse(readyMatch[1]!.trim());
              enqueue({ type: "ready", problem });
            } catch {
              enqueue({
                type: "error",
                message: "Agent signalled ready but the LP JSON was malformed.",
              });
            }
          }
        } catch (err: any) {
          enqueue({
            type: "error",
            message: err.message ?? "Elicitation failed",
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
    console.error("Solver chat error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
