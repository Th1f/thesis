import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, BaseMessage, SystemMessage } from "@langchain/core/messages";
import { StateGraph, START, END } from "@langchain/langgraph";
import { env } from "../../../env";
import { NextResponse } from "next/server";

// Define the state for the graph
interface State {
  messages: BaseMessage[];
}
const model = new ChatOpenAI({
  apiKey: env.DEEPSEEK_API_KEY,
  model: "deepseek-chat",
  temperature: 0.7,
  configuration: { baseURL: "https://api.deepseek.com/v1" },
});

async function callModel(state: State) {
  const result = await model.invoke(state.messages);
  return { messages: [result] };
}
const workflow = new StateGraph<State>({
  channels: {
    messages: {
      value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
      default: () => [],
    },
  },
})
  .addNode("agent", callModel)
  .addEdge(START, "agent")
  .addEdge("agent", END);

const app = workflow.compile();

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request body, expected 'messages' array." },
        { status: 400 },
      );
    }
    const systemPrompt = new SystemMessage(
      `You are an expert operations research AI designed to solve linear programming word problems, matching the objective of the NL4Opt competition dataset. 
Your task is to take a natural language description of a linear programming (LP) problem and formulate it mathematically.
When given a word problem, you must output:
1. Objective: Identify the objective name and direction (e.g., Maximize Profit).
2. Decision Variables: List the variables with clear definitions.
3. Constraints: List all constraints mathematically using the variables.
4. Formulation: The final mathematical meaning representation (canonical formulation).
Be highly precise and mathematically formal.`
    );

    const langchainMessages = [
      systemPrompt,
      ...messages.map((m: any) => {
        if (m.sender === "user") {
          return new HumanMessage(m.content);
        } else {
          return new AIMessage(m.content);
        }
      })
    ];

    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    (async () => {
      try {
        const events = await app.streamEvents(
          { messages: langchainMessages },
          { version: "v2" },
        );

        for await (const event of events) {
          if (event.event === "on_chat_model_stream") {
            const chunk = event.data.chunk;
            if (chunk && chunk.content) {
              await writer.write(encoder.encode(chunk.content));
            }
          }
        }
      } catch (error) {
        console.error("Agent error:", error);
        await writer.write(encoder.encode("\n\n[Error generating response]"));
      } finally {
        await writer.close();
      }
    })();

    // Return the readable end of the stream
    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
