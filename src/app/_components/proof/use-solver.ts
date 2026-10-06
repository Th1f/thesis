"use client";
import { useEffect, useRef, useState } from "react";
import {
  applyEvent,
  initialPipeline,
  readEvents,
  type Message,
  type Problem,
} from "~/lib/solver-stream";

export const STAGES = [
  {
    name: "Understand",
    agent: "Elicitation",
    heading: "First, understand the problem.",
    description:
      "Clarify the goal, decisions and constraints before building the model.",
  },
  {
    name: "Formulate",
    agent: "Formulation",
    heading: "A model you can inspect.",
    description:
      "Follow the objective, constraints and bounds into solver-ready code.",
  },
  {
    name: "Review",
    agent: "Code critic",
    heading: "Check before you execute.",
    description: "Inspect the critic’s feedback and every code revision.",
  },
  {
    name: "Execute",
    agent: "Execution",
    heading: "From model to solution.",
    description:
      "Read the Python runner’s output, including unsuccessful attempts.",
  },
  {
    name: "Explain",
    agent: "Presentation",
    heading: "The answer, in plain language.",
    description: "Connect the solver’s result back to your original problem.",
  },
];
export const EXAMPLES = [
  {
    title: "Furniture workshop",
    text: "A workshop makes chairs and desks. A chair earns $40 profit and a desk earns $70. Each chair needs 2 hours of cutting and 3 hours of assembly. Each desk needs 4 hours of cutting and 2 hours of assembly. We have 80 cutting hours and 100 assembly hours available. How many of each should we produce to maximise profit? Use continuous, non-negative quantities.",
  },
  {
    title: "Bakery production",
    text: "A bakery makes muffin batches and croissant batches. Profit is $3 per muffin batch and $5 per croissant batch. Each muffin batch uses 2 units of flour and 3 minutes of oven time. Each croissant batch uses 4 units of flour and 2 minutes of oven time. We have 240 units of flour and 220 minutes of oven time. Maximise profit using continuous, non-negative quantities.",
  },
];
const stageIndex: Record<string, number> = {
  formulation: 1,
  critic: 2,
  execution: 3,
  presentation: 4,
};
export function useSolver() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [problem, setProblem] = useState<Problem | null>(null);
  const [pipeline, setPipeline] = useState(initialPipeline);
  const [busy, setBusy] = useState<"chat" | "solve" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryChat, setRetryChat] = useState<Message[] | null>(null);
  const [stage, setStage] = useState(0);
  const [notice, setNotice] = useState("");
  const active = useRef<AbortController | null>(null);
  useEffect(
    () => () => {
      active.current?.abort();
    },
    [],
  );

  function reset() {
    active.current?.abort();
    active.current = null;
    setMessages([]);
    setInput("");
    setProblem(null);
    setPipeline(initialPipeline());
    setBusy(null);
    setError(null);
    setRetryChat(null);
    setStage(0);
    setNotice("");
  }
  function stop() {
    active.current?.abort();
    active.current = null;
    setBusy(null);
    if (busy === "chat") setProblem(null);
    setNotice("Stopped waiting. Work already sent to the server may continue.");
  }
  async function request(kind: "chat" | "solve", history: Message[]) {
    if (active.current) return;
    const controller = new AbortController();
    active.current = controller;
    setBusy(kind);
    setError(null);
    setNotice("");
    let timedOut = false,
      receivedMessage = false,
      receivedResult = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 240_000);
    try {
      const response = await fetch("/api/solver/" + kind, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          kind === "chat"
            ? { messages: history }
            : {
                problem,
                conversationSummary: history
                  .map((m) => m.role + ": " + m.content)
                  .join("\n"),
              },
        ),
        signal: controller.signal,
      });
      await readEvents(response, (event) => {
        if (active.current !== controller) return;
        if (event.type === "error") throw new Error(event.message);
        if (kind === "chat") {
          if (event.type === "message") {
            receivedMessage = true;
            const content = event.text
              .replace(/<LP_READY>[\s\S]*?<\/LP_READY>/g, "")
              .trim();
            setMessages([
              ...history,
              ...(content ? [{ role: "assistant" as const, content }] : []),
            ]);
          }
          if (event.type === "ready") {
            setProblem(event.problem);
            setStage(1);
          }
        } else {
          setPipeline((p) => applyEvent(p, event));
          if (event.type === "stage") setStage(stageIndex[event.name] ?? 1);
          if (event.type === "presentation" && event.text.trim())
            receivedResult = true;
        }
      });
      if (active.current !== controller) return;
      if (kind === "chat" && !receivedMessage)
        throw new Error(
          "The agent did not return a reply. Try the message again.",
        );
      if (kind === "solve" && !receivedResult)
        throw new Error(
          "The run ended before an explanation arrived. You can inspect the partial output and retry.",
        );
      setRetryChat(null);
      setNotice(
        kind === "solve"
          ? "Run complete. Inspect each step or export this run."
          : "",
      );
    } catch (err) {
      if (active.current !== controller) return;
      const message = timedOut
        ? "The request timed out. The server may still be working; wait a moment before retrying."
        : err instanceof Error
          ? err.message
          : "The request failed. Please try again.";
      setError(message);
      if (kind === "solve") setPipeline((p) => ({ ...p, error: message }));
      else {
        setProblem(null);
        setRetryChat(history);
      }
    } finally {
      clearTimeout(timeout);
      if (active.current === controller) {
        active.current = null;
        setBusy(null);
        if (busy === "chat") setProblem(null);
      }
    }
  }
  function send() {
    const content = input.trim();
    if (!content || active.current) return;
    const history = [...messages, { role: "user" as const, content }];
    setMessages(history);
    setInput("");
    setProblem(null);
    setPipeline(initialPipeline());
    setStage(0);
    setRetryChat(history);
    void request("chat", history);
  }
  function solve() {
    if (!problem || active.current) return;
    setPipeline(initialPipeline());
    setStage(1);
    void request("solve", messages);
  }
  function download() {
    const blob = new Blob(
      [
        JSON.stringify(
          { exportedAt: new Date().toISOString(), messages, problem, pipeline },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = "lp-solver-run.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Run exported.");
  }
  const status =
    busy === "chat"
      ? "Understanding your problem…"
      : busy === "solve"
        ? STAGES[stageIndex[pipeline.stage ?? "formulation"] ?? 1]?.agent +
          " is working…"
        : error
          ? "Request needs attention"
          : notice ||
            (problem
              ? "Model confirmed. Ready to solve."
              : messages.length
                ? "Continue the conversation to confirm your model."
                : "Describe a problem to begin.");
  return {
    messages,
    input,
    setInput,
    problem,
    pipeline,
    busy,
    error,
    retryChat,
    stage,
    setStage,
    notice,
    status,
    reset,
    stop,
    send,
    solve,
    download,
    retry: () => retryChat && request("chat", retryChat),
  };
}
export type Solver = ReturnType<typeof useSolver>;
