"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Metrics {
  tp: number;
  fp: number;
  fn: number;
}

interface Mismatch {
  prompt: string;
  truth: any;
  predicted: any;
  conversation: Array<{ role: string; text: string }> | null;
}

interface CurrentLog {
  prompt: string;
  response: string | null;
  truth: string | null;
  conversation: Array<{ role: string; text: string }> | null;
}

// ─── Variable-name matching ───────────────────────────────────────────────────
const STOPWORDS = new Set([
  "the","a","an","of","in","by","for","to","at","on","with","from","per",
  "each","made","produced","grown","invested","trips","trip","amount",
  "number","quantity","total","count","units","unit","hectares","hectare",
  "acres","acre","production","manufacturing",
]);

function normalizeVarName(name: string): string {
  return name
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b(the|a|an)\s+/gi, "")
    .replace(/\b(number|amount|quantity|count|total|units?|hectares?|acres?|production|trips?)\s*(of\s+)?/gi, "")
    .replace(/\b(invested\s+in(\s+the)?|grown|made\s+by|produced\s+by)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(s: string): Set<string> {
  return new Set(s.split(/\s+/).filter((t) => t.length > 1 && !STOPWORDS.has(t)));
}

function varNamesMatch(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a.toLowerCase() === b.toLowerCase()) return true;
  const na = normalizeVarName(a);
  const nb = normalizeVarName(b);
  if (na === nb) return true;
  const ta = tokenize(na);
  const tb = tokenize(nb);
  if (ta.size === 0 || tb.size === 0) return false;
  const intersection = [...ta].filter((t) => tb.has(t)).length;
  const union = new Set([...ta, ...tb]).size;
  // Jaccard threshold
  if (union > 0 && intersection / union >= 0.5) return true;
  // Subset check: all tokens of the shorter name appear in the longer
  const [shorter, longer] = ta.size <= tb.size ? [ta, tb] : [tb, ta];
  return shorter.size > 0 && [...shorter].every((t) => longer.has(t));
}

// ─── Constraint matching ──────────────────────────────────────────────────────
const XY_LIKE = new Set(["xy", "xby", "ratio"]);

function limitsMatch(a: any, b: any): boolean {
  return String(a ?? "").replace(/[$%,]/g, "").trim() ===
         String(b ?? "").replace(/[$%,]/g, "").trim();
}

function constraintsMatch(tc: any, pc: any): boolean {
  const tcXy = XY_LIKE.has(tc.type);
  const pcXy = XY_LIKE.has(pc.type);
  if (tcXy !== pcXy) return false;
  if (tcXy) {
    // xy / xby / ratio all match on operator + variable pair
    return (
      tc.operator === pc.operator &&
      varNamesMatch(tc.x_var, pc.x_var) &&
      varNamesMatch(tc.y_var, pc.y_var)
    );
  }
  if (tc.type !== pc.type) return false;
  return tc.operator === pc.operator && limitsMatch(tc.limit, pc.limit);
}

// ─── Evaluation helpers (identical formula to baseline Evaluator) ─────────────
function evaluateTask(
  predicted: any,
  truth: any,
): {
  tp: number;
  fp: number;
  fn: number;
  matchedConstraints: any[];
  mismatchedConstraints: any[];
  isObjMatched: boolean;
} {
  let tp = 0;
  let fp = 0;
  let fn = 0;

  const truthConsts: any[] = truth.const_declarations ?? [];
  const predConsts: any[] = predicted.const_declarations ?? [];
  const matchedConstraints: any[] = [];
  const mismatchedConstraints: any[] = [];

  predConsts.forEach((pc: any) => {
    const match = truthConsts.find((tc: any) => constraintsMatch(tc, pc));
    if (match) {
      tp += 1;
      matchedConstraints.push(pc);
    } else {
      fp += 1;
      mismatchedConstraints.push(pc);
    }
  });

  // Count missed ground-truth constraints (false negatives)
  truthConsts.forEach((tc: any) => {
    const found = predConsts.some((pc: any) => constraintsMatch(tc, pc));
    if (!found) fn += 1;
  });

  let isObjMatched = false;
  if (
    predicted.obj_declaration?.direction &&
    truth.obj_declaration?.direction &&
    predicted.obj_declaration.direction.toLowerCase() ===
      truth.obj_declaration.direction.toLowerCase()
  ) {
    tp += 1;
    isObjMatched = true;
  } else {
    fp += 1;
  }

  return { tp, fp, fn, matchedConstraints, mismatchedConstraints, isObjMatched };
}

function renderHighlightedJSON(predicted: any, matchData: any) {
  if (!predicted || Object.keys(predicted).length === 0) return "{ }";
  const objDirection = predicted.obj_declaration?.direction ?? "missing";
  const objColor = matchData.isObjMatched ? "text-green-400" : "text-red-400";

  return (
    <div className="flex flex-col gap-2">
      <span className="text-gray-400">{"{"}</span>
      <div className="pl-4">
        <span className="text-blue-300">"obj_declaration":</span> {"{"}
        <div className="pl-4">
          <span className="text-blue-300">"direction":</span>{" "}
          <span className={objColor}>"{objDirection}"</span>
          <div className="text-[10px] italic text-gray-500">
            // Objective direction {matchData.isObjMatched ? "matched ✓" : "mismatched ✗"}
          </div>
        </div>
        <span className="text-gray-400">{"}, "}</span>
      </div>
      <div className="pl-4">
        <span className="text-blue-300">"const_declarations":</span> [
        {(predicted.const_declarations ?? []).map((pc: any, idx: number) => {
          const isMatch = matchData.matchedConstraints.some((mc: any) =>
            constraintsMatch(mc, pc),
          );
          return (
            <div
              key={idx}
              className={`my-1 rounded-r border-l-2 p-2 pl-4 ${
                isMatch
                  ? "border-green-500/50 bg-green-900/20"
                  : "border-red-500/50 bg-red-900/20"
              }`}
            >
              <span className={isMatch ? "text-green-300" : "text-red-300"}>
                {JSON.stringify(pc, null, 2)}
              </span>
              <div
                className={`mt-1 text-[10px] italic ${isMatch ? "text-green-500" : "text-red-500"}`}
              >
                // {isMatch ? "Match ✓" : "Mismatch ✗"}
              </div>
            </div>
          );
        })}
        ]
      </div>
      <span className="text-gray-400">{"}"}</span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function SolverEvaluator() {
  const [fileContent, setFileContent] = useState<Record<string, any> | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [metrics, setMetrics] = useState<Metrics>({ tp: 0, fp: 0, fn: 0 });
  const [currentLog, setCurrentLog] = useState<CurrentLog>({
    prompt: "",
    response: null,
    truth: null,
    conversation: null,
  });
  const [mismatches, setMismatches] = useState<Mismatch[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      try {
        let content: Record<string, any> = {};
        if (file.name.endsWith(".jsonl")) {
          text.split(/\r?\n/).filter(Boolean).forEach((line) => {
            Object.assign(content, JSON.parse(line));
          });
        } else {
          content = JSON.parse(text);
        }
        setFileContent(content);
        setTotalItems(Object.keys(content).length);
      } catch {
        alert("Invalid file format");
      }
    };
    reader.readAsText(file);
  };

  const startEvaluation = async () => {
    if (!fileContent) return;
    setIsEvaluating(true);
    setProgress(0);
    setMetrics({ tp: 0, fp: 0, fn: 0 });
    setMismatches([]);

    let cTp = 0, cFp = 0, cFn = 0;
    const keys = Object.keys(fileContent);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]!;
      const task = fileContent[key];
      const document: string = task.document;
      const truthSubset = {
        obj_declaration: task.obj_declaration,
        const_declarations: task.const_declarations,
      };

      setCurrentLog({
        prompt: document,
        response: null,
        truth: JSON.stringify(truthSubset, null, 2),
        conversation: null,
      });

      try {
        const res = await fetch("/api/solver/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ document }),
        });

        if (res.ok && res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          let conversation: Array<{ role: string; text: string }> = [];
          let finalResult: any = null;

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
                if (event.type === "turn") {
                  conversation = [...conversation, { role: event.role, text: event.text }];
                  setCurrentLog((prev) => ({ ...prev, conversation }));
                } else if (event.type === "result") {
                  finalResult = event.result;
                  setCurrentLog((prev) => ({
                    ...prev,
                    response: JSON.stringify(finalResult, null, 2),
                  }));
                }
              } catch {}
            }
          }

          if (finalResult) {
            const { tp, fp, fn } = evaluateTask(finalResult, task);
            if (fp > 0 || fn > 0 || Object.keys(finalResult).length === 0) {
              setMismatches((prev) => [
                ...prev,
                { prompt: document, truth: truthSubset, predicted: finalResult, conversation },
              ]);
            }
            cTp += tp;
            cFp += fp;
            cFn += fn;
            setMetrics({ tp: cTp, fp: cFp, fn: cFn });
          }
        }
      } catch (err) {
        console.error("Evaluation failed for task", key, err);
      }

      setProgress(i + 1);
    }

    setIsEvaluating(false);
  };

  const downloadResults = () => {
    const precision = cTp + cFp > 0 ? ((cTp / (cTp + cFp)) * 100).toFixed(2) : "0.00";
    const recall = cTp + cFn > 0 ? ((cTp / (cTp + cFn)) * 100).toFixed(2) : "0.00";
    const results = {
      summary: {
        timestamp: new Date().toISOString(),
        system: "multi-agent-v2",
        total_items: totalItems,
        true_positives: metrics.tp,
        false_positives: metrics.fp,
        false_negatives: metrics.fn,
        precision_percent: parseFloat(precision),
        recall_percent: parseFloat(recall),
      },
      mismatches: mismatches.map((m, idx) => ({
        index: idx + 1,
        prompt: m.prompt,
        ground_truth: m.truth,
        predicted: m.predicted,
        conversation: m.conversation,
      })),
    };
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solver_eval_${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cTp = metrics.tp, cFp = metrics.fp, cFn = metrics.fn;
  const precision = cTp + cFp > 0 ? (cTp / (cTp + cFp)) * 100 : 0;
  const recall    = cTp + cFn > 0 ? (cTp / (cTp + cFn)) * 100 : 0;
  const f1        = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return (
    <div className="mt-4 mb-4 flex w-full max-w-6xl flex-col items-center rounded-xl border border-gray-700 bg-gray-800/60 p-6 shadow-lg backdrop-blur-sm">
      <h2 className="mb-1 text-2xl font-bold tracking-wide text-white">
        Multi-Agent Pipeline Evaluator
      </h2>
      <p className="mb-4 text-xs text-gray-400">
        Tests the new elicitation agent against NL4Opt ground truth (TP / (TP + FP))
      </p>

      {/* File upload + run */}
      <div className="mb-6 flex w-full items-center gap-4">
        <input
          type="file"
          accept=".json,.jsonl"
          onChange={handleFileUpload}
          disabled={isEvaluating}
          className="block w-full text-sm text-gray-300 transition-all file:mr-4 file:rounded-md file:border-0 file:bg-gray-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-600"
        />
        <button
          onClick={startEvaluation}
          disabled={!fileContent || isEvaluating}
          className="rounded-lg bg-blue-600 px-6 py-2 font-bold whitespace-nowrap text-white shadow shadow-blue-500/30 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isEvaluating ? "Evaluating…" : "Start Evaluation"}
        </button>
      </div>

      {totalItems > 0 && (
        <div className="w-full">
          {/* Progress bar */}
          <div className="mb-2 flex justify-between font-mono text-sm text-gray-400">
            <span>Progress: {progress} / {totalItems}</span>
            <span>{isEvaluating ? "Running…" : "Complete"}</span>
          </div>
          <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-gray-700">
            <div
              className="h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] transition-all duration-300"
              style={{ width: `${(progress / totalItems) * 100}%` }}
            />
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="rounded-xl border border-gray-600 bg-gray-700/50 p-4">
              <div className="font-mono text-3xl font-bold text-green-400">{cTp}</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">True Positives</div>
            </div>
            <div className="rounded-xl border border-gray-600 bg-gray-700/50 p-4">
              <div className="font-mono text-3xl font-bold text-red-400">{cFp}</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">False Positives</div>
            </div>
            <div className="rounded-xl border border-gray-600 bg-gray-700/50 p-4">
              <div className="font-mono text-3xl font-bold text-orange-400">{cFn}</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">False Negatives</div>
            </div>
            <div className="rounded-xl border-2 border-blue-500 bg-gray-700/50 p-4 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <div className="font-mono text-3xl font-bold text-blue-400">{precision.toFixed(2)}%</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-blue-200">Precision</div>
              <div className="mt-1 font-mono text-[10px] text-blue-400/50">TP / (TP + FP)</div>
            </div>
          </div>

          {/* Secondary metrics */}
          <div className="mt-3 grid grid-cols-2 gap-4 text-center">
            <div className="rounded-xl border border-gray-600 bg-gray-700/30 p-3">
              <div className="font-mono text-2xl font-bold text-purple-400">{recall.toFixed(2)}%</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Recall</div>
              <div className="font-mono text-[10px] text-gray-500">TP / (TP + FN)</div>
            </div>
            <div className="rounded-xl border border-gray-600 bg-gray-700/30 p-3">
              <div className="font-mono text-2xl font-bold text-teal-400">{f1.toFixed(2)}%</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">F1 Score</div>
              <div className="font-mono text-[10px] text-gray-500">2·P·R / (P+R)</div>
            </div>
          </div>

          {/* Download */}
          {!isEvaluating && progress === totalItems && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={downloadResults}
                className="rounded-lg bg-green-700 px-5 py-2 font-bold text-white shadow shadow-green-500/30 transition-all hover:bg-green-600"
              >
                Download Results (JSON)
              </button>
            </div>
          )}

          {/* Live log */}
          {currentLog.prompt && (
            <div className="mt-6 w-full rounded-xl border border-gray-600 bg-gray-900/80 p-5 text-left shadow-inner">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
                Live Interaction Log
              </h3>
              <div className="mb-3 rounded-lg bg-gray-800 p-3">
                <div className="mb-1 text-xs font-bold text-blue-400">Word Problem:</div>
                <div className="text-sm text-gray-200">{currentLog.prompt}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-800 p-3">
                  <div className="mb-1 text-xs font-bold text-yellow-400">Agent Transcript:</div>
                  <div className="custom-scrollbar max-h-52 space-y-1 overflow-y-auto font-mono text-xs text-gray-300">
                    {currentLog.conversation ? (
                      currentLog.conversation.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`rounded p-1.5 ${
                            msg.role === "Evaluator"
                              ? "bg-blue-900/30 border border-blue-800/40"
                              : "bg-green-900/30 border border-green-800/40"
                          }`}
                        >
                          <span
                            className={`font-bold ${
                              msg.role === "Evaluator" ? "text-blue-400" : "text-green-400"
                            }`}
                          >
                            {msg.role}:{" "}
                          </span>
                          <span className="whitespace-pre-wrap">{msg.text}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500">Awaiting conversation…</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-rows-2 gap-3">
                  <div className="rounded-lg bg-gray-800 p-3">
                    <div className="mb-1 text-xs font-bold text-purple-400">Ground Truth JSON:</div>
                    <div className="custom-scrollbar max-h-24 overflow-y-auto font-mono text-xs whitespace-pre-wrap text-gray-300">
                      {currentLog.truth ?? "Loading…"}
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-800 p-3">
                    <div className="mb-1 text-xs font-bold text-green-400">Predicted JSON:</div>
                    <div className="custom-scrollbar max-h-24 overflow-y-auto font-mono text-xs whitespace-pre-wrap text-gray-300">
                      {currentLog.response ?? "Awaiting response…"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mismatches */}
          {!isEvaluating && mismatches.length > 0 && (
            <div className="mt-6 w-full rounded-xl border border-red-900/50 bg-gray-900/80 p-5 text-left shadow-inner">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-red-500">
                Mismatches ({mismatches.length})
              </h3>
              <div className="custom-scrollbar flex max-h-[600px] flex-col gap-5 overflow-y-auto pr-1">
                {mismatches.map((m, idx) => (
                  <div key={idx} className="rounded-lg border border-gray-700 bg-gray-800 p-4">
                    <div className="mb-3">
                      <span className="text-xs font-bold text-blue-400">Prompt: </span>
                      <span className="text-sm text-gray-300">{m.prompt}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <div className="mb-1 text-xs font-bold text-yellow-400">Transcript:</div>
                        <div className="custom-scrollbar max-h-52 space-y-1 overflow-y-auto rounded bg-gray-900 p-2 font-mono text-xs text-gray-300">
                          {m.conversation ? (
                            m.conversation.map((msg, i) => (
                              <div
                                key={i}
                                className={`rounded p-1 ${
                                  msg.role === "Evaluator" ? "bg-blue-900/20" : "bg-green-900/20"
                                }`}
                              >
                                <span
                                  className={`font-bold ${
                                    msg.role === "Evaluator" ? "text-blue-400" : "text-green-400"
                                  }`}
                                >
                                  {msg.role}:{" "}
                                </span>
                                <span className="whitespace-pre-wrap">{msg.text}</span>
                              </div>
                            ))
                          ) : (
                            "No transcript"
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 text-xs font-bold text-purple-400">Ground Truth:</div>
                        <div className="custom-scrollbar max-h-52 overflow-y-auto rounded bg-gray-900 p-2 font-mono text-xs whitespace-pre-wrap text-gray-300">
                          {JSON.stringify(m.truth, null, 2)}
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 text-xs font-bold text-red-400">
                          Predicted — Highlights:
                        </div>
                        <div className="custom-scrollbar max-h-52 overflow-y-auto rounded bg-gray-900 p-2 font-mono text-xs text-gray-300">
                          {renderHighlightedJSON(
                            m.predicted,
                            evaluateTask(m.predicted, m.truth),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
