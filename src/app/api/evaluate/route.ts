import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { env } from "../../../env";
import { NextResponse } from "next/server";

const model = new ChatGroq({
  apiKey: env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.1,
});

export async function POST(req: Request) {
  try {
    const { document } = await req.json();

    if (!document || typeof document !== "string") {
      return NextResponse.json({ error: "Invalid document" }, { status: 400 });
    }

    const systemPrompt = new SystemMessage(
      `You are an expert operations research AI mimicking a test suite designed to evaluate the NL4Opt dataset.
Your task is to take a natural language description of an LP problem and formulate it into a structured semantic representation.

CRITICAL INSTRUCTIONS:
1. VARIABLES: You MUST extract the exact phrases used for variables from the text (e.g. "color printers", "black and white printers"). Do NOT use single letters, abbreviations, or snake_case like "color_printers". Use the exact text span.
2. CONSTRAINT DIRECTIONS: For "direction", extract the exact text span that triggers the constraint from the problem description (e.g., "at most", "less than", "budget").

You MUST output valid JSON only, using this exact schema:
{
  "obj_declaration": {
    "type": "objective",
    "direction": "maximize" or "minimize",
    "name": "objective name (e.g., 'profit')",
    "terms": { "exact_variable_name_from_text": "coefficient_as_string" }
  },
  "const_declarations": [
    // Use "upperbound" or "lowerbound" when a single variable is constrained directly
    {
      "type": "upperbound" or "lowerbound",
      "direction": "trigger phrase (e.g., 'at most')",
      "limit": "integer limit as string",
      "var": "exact_variable_name_from_text",
      "operator": "LESS_OR_EQUAL" or "GREATER_OR_EQUAL" or "EQUAL"
    },
    // Use "sum" for constraints on the total number of ALL items
    {
      "type": "sum",
      "direction": "trigger phrase",
      "limit": "integer limit as string",
      "operator": "LESS_OR_EQUAL" or "GREATER_OR_EQUAL" or "EQUAL"
    },
    // Use "linear" for standard constraints where items have weights/coefficients
    {
      "type": "linear",
      "direction": "trigger phrase (e.g., 'budget')",
      "limit": "integer limit as string",
      "operator": "LESS_OR_EQUAL" or "GREATER_OR_EQUAL" or "EQUAL",
      "terms": { "exact_variable_name_from_text": "coefficient_as_string" }
    },
    // Use "xy" for simple constraints comparing two variables directly (e.g., var1 < var2)
    {
      "type": "xy",
      "direction": "trigger phrase (e.g., 'less than')",
      "x_var": "exact_variable_name_from_text",
      "y_var": "exact_variable_name_from_text",
      "operator": "LESS_OR_EQUAL" or "GREATER_OR_EQUAL" or "EQUAL"
    },
    // Use "ratio" for fractional or ratio constraints (e.g., one item must be twice another)
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

    const result = await model.invoke([
      systemPrompt,
      new HumanMessage(document),
    ]);
    const content = result.content as string;

    const jsonString = content
      .replace(/^```[a-z]*\n?/, "")
      .replace(/```\s*$/, "")
      .trim();

    try {
      const parsed = JSON.parse(jsonString);
      return NextResponse.json(parsed);
    } catch (parseError) {
      console.error("Failed to parse LLM output as JSON:", jsonString);
      return NextResponse.json(
        { error: "LLM failed to output valid JSON" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Evaluation API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
