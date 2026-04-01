import { ChatGroq } from "@langchain/groq";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  BaseMessage,
} from "@langchain/core/messages";
import { env } from "../../../env";
import { NextResponse } from "next/server";

const evaluatorModel = new ChatGroq({
  apiKey: env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.1,
});

const userModel = new ChatGroq({
  apiKey: env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant",
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
1. VARIABLES: You MUST extract the exact phrases used for variables from the text (e.g. "color printers", "black and white printers"). Do NOT use single letters, abbreviations, or snake_case like "color_printers". Use the exact text span.
2. CONSTRAINT DIRECTIONS: For "direction", extract the exact text span that triggers the constraint from the problem description (e.g., "at most", "less than", "budget").
3. DO NOT output the final JSON until you have all the necessary information.
4. When you have all the information, output ONLY valid JSON using this exact schema:

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
1. Answer ONLY what they ask. Be concise and natural.
2. DO NOT give away the entire problem at once. Give information bit by bit based on the expert's questions.
3. Keep your answers brief and use exact phrases from your document where possible.
4. Do not try try to fix the problem, if the they got it wrong just ignore it.`,
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
            } else if (i === MAX_TURNS - 1) {
              evaluatorHistory.push(
                new HumanMessage(
                  "Please output the exact JSON structure now based on what we've discussed so we can finish. Output ONLY JSON.",
                ),
              );
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
          sendEvent({ type: "result", result: parsed });
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
