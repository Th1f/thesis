"use client";

import { useState, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface CriticReview {
  iteration: number;
  approved: boolean;
  feedback: string;
  issues: string[];
}

interface PipelineState {
  stage: string | null;
  code: string | null;
  codeRevisions: Array<{ code: string; iteration: number }>;
  lpModel: any;
  criticReviews: CriticReview[];
  executionOutput: string | null;
  executionSuccess: boolean | null;
  presentationText: string | null;
  error: string | null;
}

const INITIAL_PIPELINE: PipelineState = {
  stage: null,
  code: null,
  codeRevisions: [],
  lpModel: null,
  criticReviews: [],
  executionOutput: null,
  executionSuccess: null,
  presentationText: null,
  error: null,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function StageIndicator({ label, status }: { label: string; status: "pending" | "running" | "done" | "error" }) {
  const colours = {
    pending: "bg-gray-700 text-gray-400",
    running: "bg-blue-700/60 text-blue-200 animate-pulse",
    done: "bg-green-800/60 text-green-300",
    error: "bg-red-800/60 text-red-300",
  };
  const icons = { pending: "○", running: "◌", done: "✓", error: "✗" };
  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold ${colours[status]}`}>
      <span>{icons[status]}</span>
      <span>{label}</span>
    </div>
  );
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2 rounded-lg border border-gray-600 bg-gray-950">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-bold text-blue-300 hover:bg-gray-800/50"
      >
        <span>{label}</span>
        <span>{open ? "▲ hide" : "▼ show"}</span>
      </button>
      {open && (
        <pre className="custom-scrollbar max-h-72 overflow-auto p-3 font-mono text-[11px] text-green-300 leading-relaxed whitespace-pre-wrap">
          {code}
        </pre>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function SolverChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [problem, setProblem] = useState<any>(null);
  const [pipeline, setPipeline] = useState<PipelineState>(INITIAL_PIPELINE);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Build a plain-text summary of the conversation for the solve route
  const buildConversationSummary = (msgs: ChatMessage[]) =>
    msgs.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n\n");

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/solver/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok || !res.body) throw new Error("Chat request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);
            if (event.type === "message") {
              assistantText = event.text as string;
              // Strip the <LP_READY>…</LP_READY> block from display
              const display = assistantText.replace(/<LP_READY>[\s\S]*?<\/LP_READY>/, "").trim();
              setMessages((prev) => {
                const updated = [...prev];
                if (updated[updated.length - 1]?.role === "assistant") {
                  updated[updated.length - 1] = { role: "assistant", content: display };
                } else {
                  updated.push({ role: "assistant", content: display });
                }
                return updated;
              });
            } else if (event.type === "ready") {
              setProblem(event.problem);
            } else if (event.type === "error") {
              setMessages((prev) => [
                ...prev,
                { role: "assistant", content: `⚠ ${event.message}` },
              ]);
            }
          } catch {}
        }
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠ Error: ${err.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startSolve = async () => {
    if (!problem || isSolving) return;
    setIsSolving(true);
    setPipeline(INITIAL_PIPELINE);

    const summary = buildConversationSummary(messages);

    try {
      const res = await fetch("/api/solver/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, conversationSummary: summary }),
      });

      if (!res.ok || !res.body) throw new Error("Solve request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);
            setPipeline((prev) => applyPipelineEvent(prev, event));
          } catch {}
        }
      }
    } catch (err: any) {
      setPipeline((prev) => ({ ...prev, error: err.message }));
    } finally {
      setIsSolving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const stageStatus = (name: string): "pending" | "running" | "done" | "error" => {
    const stages = ["formulation", "critic", "execution", "presentation"];
    const current = pipeline.stage;
    if (!current) return "pending";
    const ci = stages.indexOf(current);
    const ni = stages.indexOf(name);
    if (ni < ci) return "done";
    if (ni === ci) return isSolving ? "running" : "done";
    return "pending";
  };

  return (
    <div className="flex w-full max-w-7xl gap-4">
      {/* ── Left: Chat Panel ─────────────────────────────────────────────── */}
      <div className="flex w-1/2 flex-col rounded-xl border border-gray-700 bg-gray-800/60 shadow-lg backdrop-blur-sm">
        <div className="border-b border-gray-700 px-4 py-3">
          <h2 className="text-lg font-bold text-white">Elicitation Agent</h2>
          <p className="text-xs text-gray-400">
            Describe your optimisation problem and I will ask you questions to formulate it.
          </p>
        </div>

        {/* Messages */}
        <div className="custom-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto p-4 min-h-[400px] max-h-[520px]">
          {messages.length === 0 && (
            <div className="flex flex-1 items-center justify-center text-center text-sm text-gray-500">
              <div>
                <div className="mb-2 text-3xl">🔢</div>
                <p>Describe your linear optimisation problem to get started.</p>
                <p className="mt-1 text-xs text-gray-600">
                  e.g. "I run a furniture factory and want to maximise profit…"
                </p>
              </div>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-gray-700 px-4 py-2.5 text-sm text-gray-400">
                <span className="animate-pulse">Thinking…</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Ready banner */}
        {problem && (
          <div className="mx-4 mb-2 rounded-lg border border-green-500/40 bg-green-900/20 px-3 py-2 text-xs text-green-300">
            <span className="font-bold">LP problem extracted.</span>{" "}
            {problem.variables?.length ?? 0} variables, {problem.constraints?.length ?? 0} constraints.
            Ready to generate solution.
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-700 p-3">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || isSolving}
              rows={2}
              placeholder="Describe your problem or answer the agent's questions…"
              className="flex-1 resize-none rounded-lg bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
            <div className="flex flex-col gap-2">
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading || isSolving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send
              </button>
              {problem && (
                <button
                  onClick={startSolve}
                  disabled={isSolving}
                  className="rounded-lg bg-green-700 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isSolving ? "Solving…" : "Solve ▶"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Pipeline Panel ─────────────────────────────────────────── */}
      <div className="flex w-1/2 flex-col gap-3 rounded-xl border border-gray-700 bg-gray-800/60 p-4 shadow-lg backdrop-blur-sm">
        <div className="border-b border-gray-700 pb-3">
          <h2 className="text-lg font-bold text-white">Solution Pipeline</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <StageIndicator label="1 · Formulation" status={stageStatus("formulation")} />
            <StageIndicator label="2 · Code Critic" status={stageStatus("critic")} />
            <StageIndicator label="3 · Execution" status={stageStatus("execution")} />
            <StageIndicator label="4 · Presentation" status={stageStatus("presentation")} />
          </div>
        </div>

        <div className="custom-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto max-h-[580px]">
          {!pipeline.stage && !isSolving && (
            <div className="flex flex-1 items-center justify-center text-center text-sm text-gray-500">
              <div>
                <div className="mb-2 text-3xl">⚙</div>
                <p>The pipeline will run once the problem is formulated and you click <strong>Solve</strong>.</p>
              </div>
            </div>
          )}

          {/* Formulation */}
          {pipeline.code && (
            <div className="rounded-lg border border-blue-700/40 bg-blue-900/10 p-3">
              <div className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-400">
                Stage 1 — Formulation
              </div>
              <CodeBlock code={pipeline.code} label="Generated Python Code (scipy.optimize)" />
              {pipeline.lpModel && (
                <CodeBlock
                  code={JSON.stringify(pipeline.lpModel, null, 2)}
                  label="LP Model JSON"
                />
              )}
            </div>
          )}

          {/* Code Revisions */}
          {pipeline.codeRevisions.map((rev, i) => (
            <div key={i} className="rounded-lg border border-yellow-700/40 bg-yellow-900/10 p-3">
              <div className="mb-1 text-xs font-bold uppercase tracking-wider text-yellow-400">
                Code Revised — iteration {rev.iteration}
              </div>
              <CodeBlock code={rev.code} label="Revised Python Code" />
            </div>
          ))}

          {/* Critic Reviews */}
          {pipeline.criticReviews.length > 0 && (
            <div className="rounded-lg border border-purple-700/40 bg-purple-900/10 p-3">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                Stage 2 — Code Critic
              </div>
              {pipeline.criticReviews.map((r, i) => (
                <div
                  key={i}
                  className={`mb-2 rounded-lg border p-2 text-xs ${
                    r.approved
                      ? "border-green-700/50 bg-green-900/20 text-green-300"
                      : "border-red-700/50 bg-red-900/20 text-red-300"
                  }`}
                >
                  <div className="mb-1 font-bold">
                    Iteration {r.iteration} — {r.approved ? "✓ Approved" : "✗ Rejected"}
                  </div>
                  <p className="mb-1 text-gray-300">{r.feedback}</p>
                  {r.issues.length > 0 && (
                    <ul className="list-inside list-disc text-[10px] text-gray-400">
                      {r.issues.map((iss, j) => <li key={j}>{iss}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Execution */}
          {pipeline.executionOutput !== null && (
            <div
              className={`rounded-lg border p-3 ${
                pipeline.executionSuccess
                  ? "border-green-700/40 bg-green-900/10"
                  : "border-red-700/40 bg-red-900/10"
              }`}
            >
              <div
                className={`mb-1 text-xs font-bold uppercase tracking-wider ${
                  pipeline.executionSuccess ? "text-green-400" : "text-red-400"
                }`}
              >
                Stage 3 — Execution {pipeline.executionSuccess ? "✓ Success" : "✗ Failed"}
              </div>
              <pre className="custom-scrollbar max-h-40 overflow-auto rounded bg-gray-950 p-2 font-mono text-[11px] text-gray-200 whitespace-pre-wrap">
                {pipeline.executionOutput}
              </pre>
            </div>
          )}

          {/* Presentation */}
          {pipeline.presentationText && (
            <div className="rounded-lg border border-teal-700/40 bg-teal-900/10 p-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-teal-400">
                Stage 4 — Solution
              </div>
              <p className="text-sm leading-relaxed text-gray-100 whitespace-pre-wrap">
                {pipeline.presentationText}
              </p>
            </div>
          )}

          {/* Error */}
          {pipeline.error && (
            <div className="rounded-lg border border-red-700/50 bg-red-900/20 p-3 text-sm text-red-300">
              <span className="font-bold">Error: </span>{pipeline.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Reducer helper ───────────────────────────────────────────────────────────
function applyPipelineEvent(prev: PipelineState, event: any): PipelineState {
  switch (event.type) {
    case "stage":
      return { ...prev, stage: event.name };
    case "code":
      return { ...prev, code: event.code };
    case "lp_model":
      return { ...prev, lpModel: event.model };
    case "code_revised":
      return {
        ...prev,
        code: event.code,
        codeRevisions: [...prev.codeRevisions, { code: event.code, iteration: event.iteration }],
      };
    case "critic":
      return {
        ...prev,
        criticReviews: [
          ...prev.criticReviews,
          {
            iteration: event.iteration,
            approved: event.approved,
            feedback: event.feedback,
            issues: event.issues ?? [],
          },
        ],
      };
    case "execution":
      return {
        ...prev,
        executionOutput: event.output,
        executionSuccess: event.success,
      };
    case "presentation":
      return { ...prev, presentationText: event.text };
    case "error":
      return { ...prev, error: event.message };
    default:
      return prev;
  }
}
