import { ChatGroq } from "@langchain/groq";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { StateGraph, START, END } from "@langchain/langgraph";
import { env } from "../../../env";
import { NextResponse } from "next/server";

// Define the state for the graph
interface State {
  messages: BaseMessage[];
}
const model = new ChatGroq({
  apiKey: env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant", // Use a fast and standard model
  temperature: 0.7,
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

    // Convert raw messages to Langchain message objects
    const langchainMessages = messages.map((m: any) => {
      if (m.sender === "user") {
        return new HumanMessage(m.content);
      } else {
        return new AIMessage(m.content);
      }
    });

    // Create a TransformStream to stream responses to the client
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Start the graph execution asynchronously to allow immediate streaming
    (async () => {
      try {
        const events = await app.streamEvents(
          { messages: langchainMessages },
          { version: "v2" },
        );

        for await (const event of events) {
          // Listen for chat model stream events
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
