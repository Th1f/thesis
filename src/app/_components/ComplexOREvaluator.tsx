"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import {
  loadComplexORData,
  evaluateComplexORTask,
  complexORConstraintsMatch,
  normalizeComplexORLimit,
  type ComplexOREvalResult,
} from "./complexORUtils";

// ─── Highlighted JSON Renderer ────────────────────────────────────────────────
function renderComplexORHighlightedJSON(
  predicted: Record<string, unknown>,
  matchData: ComplexOREvalResult,
) {
  if (!predicted || Object.keys(predicted).length === 0) {
    return <span className="text-gray-500">{"{ }"}</span>;
  }
  const objDecl = predicted.obj_declaration as Record<string, unknown> | undefined;
  const objDirection = (objDecl?.direction as string) ?? "missing";
  const objColor = matchData.isObjMatched ? "text-green-400" : "text-red-400";
  const constDecls = (predicted.const_declarations as Record<string, unknown>[]) ?? [];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-gray-400">{"{"}</span>
      <div className="pl-4">
        <span className="text-blue-300">"obj_declaration":</span> {"{"}
        <div className="pl-4">
          <span className="text-blue-300">"direction":</span>{" "}
          <span className={objColor}>"{objDirection}"</span>
          <div className="text-[10px] italic text-gray-500">
            // {matchData.isObjMatched ? "matched ✓" : "mismatched ✗"}
          </div>
        </div>
        <span className="text-gray-400">{"}, "}</span>
      </div>
      <div className="pl-4">
        <span className="text-blue-300">"const_declarations":</span> [
        {constDecls.map((pc, idx) => {
          const isMatch = matchData.matchedConstraints.some((mc) =>
            complexORConstraintsMatch(mc, pc),
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
              <div className={`mt-1 text-[10px] italic ${isMatch ? "text-green-500" : "text-red-500"}`}>
                // {isMatch ? "Match ✓" : "Mismatch ✗"}{" "}
                <span className="text-gray-600">
                  (op:{String(pc.operator ?? "?")} limit:{normalizeComplexORLimit(pc.limit)})
                </span>
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

// ─── Types ────────────────────────────────────────────────────────────────────
interface Metrics {
  tp: number;
  fp: number;
  fn: number;
}

interface MismatchEntry {
  prompt: string;
  truth: Record<string, unknown>;
  predicted: Record<string, unknown>;
  conversation: Array<{ role: string; text: string }> | null;
}

interface CurrentLog {
  prompt: string;
  response: string | null;
  truth: string | null;
  conversation: Array<{ role: string; text: string }> | null;
}

interface CaseResult {
  caseIndex: number;
  problemText: string;
  hasMismatch: boolean;
  tp: number;
  fp: number;
  fn: number;
  groundTruth: string;
  predicted: string;
  messages: Array<{ role: string; text: string }>;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ComplexOREvaluator() {
  const [fileContent, setFileContent] = useState<Record<string, Record<string, unknown>> | null>(null);
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
  const [mismatches, setMismatches] = useState<MismatchEntry[]>([]);
  const [allCases, setAllCases] = useState<CaseResult[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const saveRun = api.testHistory.saveRun.useMutation({
    onSuccess: () => setIsSaved(true),
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      try {
        const content = loadComplexORData(text, file.name);
        if (Object.keys(content).length === 0) {
          alert("No valid ComplexOR problems found. Check the file format.");
          return;
        }
        setFileContent(content);
        setTotalItems(Object.keys(content).length);
        setIsSaved(false);
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
    setAllCases([]);
    setIsSaved(false);

    let cTp = 0, cFp = 0, cFn = 0;
    const casesBuffer: CaseResult[] = [];
    const keys = Object.keys(fileContent);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]!;
      const task = fileContent[key]!;
      const document = task.document as string;
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

      let conversation: Array<{ role: string; text: string }> = [];
      let finalResult: Record<string, unknown> | null = null;

      try {
        const res = await fetch("/api/complexor/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ document }),
        });

        if (res.ok && res.body) {
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
                const event = JSON.parse(line) as {
                  type: string;
                  role?: string;
                  text?: string;
                  result?: Record<string, unknown>;
                };
                if (event.type === "turn") {
                  conversation = [...conversation, { role: event.role!, text: event.text! }];
                  setCurrentLog((prev) => ({ ...prev, conversation }));
                } else if (event.type === "result") {
                  finalResult = event.result!;
                  setCurrentLog((prev) => ({
                    ...prev,
                    response: JSON.stringify(finalResult, null, 2),
                  }));
                }
              } catch {}
            }
          }
        }
      } catch (err) {
        console.error("ComplexOR evaluation failed for task", key, err);
      }

      const result = finalResult ?? {};
      const { tp, fp, fn, isObjMatched: _o, matchedConstraints: _m, mismatchedConstraints: _mm } =
        evaluateComplexORTask(result, truthSubset as Record<string, unknown>);
      const hasMismatch = fp > 0 || fn > 0 || Object.keys(result).length === 0;

      if (hasMismatch) {
        setMismatches((prev) => [
          ...prev,
          {
            prompt: document,
            truth: truthSubset as Record<string, unknown>,
            predicted: result,
            conversation,
          },
        ]);
      }

      casesBuffer.push({
        caseIndex: i,
        problemText: document,
        hasMismatch,
        tp,
        fp,
        fn,
        groundTruth: JSON.stringify(truthSubset),
        predicted: JSON.stringify(result),
        messages: conversation,
      });

      cTp += tp;
      cFp += fp;
      cFn += fn;
      setMetrics({ tp: cTp, fp: cFp, fn: cFn });
      setProgress(i + 1);
    }

    setAllCases(casesBuffer);
    setIsEvaluating(false);
  };

  const cTp = metrics.tp, cFp = metrics.fp, cFn = metrics.fn;
  const precision = cTp + cFp > 0 ? (cTp / (cTp + cFp)) * 100 : 0;
  const recall    = cTp + cFn > 0 ? (cTp / (cTp + cFn)) * 100 : 0;
  const f1        = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  const isDone    = !isEvaluating && progress > 0 && progress === totalItems;

  const downloadResults = () => {
    const results = {
      summary: {
        timestamp: new Date().toISOString(),
        system: "complexor-multi-agent",
        dataset: "ComplexOR",
        total_items: totalItems,
        true_positives: cTp,
        false_positives: cFp,
        false_negatives: cFn,
        precision_percent: parseFloat(precision.toFixed(2)),
        recall_percent: parseFloat(recall.toFixed(2)),
        f1_percent: parseFloat(f1.toFixed(2)),
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
    a.download = `complexor_eval_${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-4 mb-4 flex w-full max-w-6xl flex-col items-center rounded-xl border border-gray-700 bg-gray-800/60 p-6 shadow-lg backdrop-blur-sm">
      <h2 className="mb-1 text-2xl font-bold tracking-wide text-white">
        ComplexOR Dataset Evaluator
      </h2>
      <p className="mb-4 text-xs text-gray-400">
        Evaluates the multi-agent pipeline against ComplexOR ground truth — matches on constraint sense operator + RHS value
      </p>

      {/* File upload + run */}
      <div className="mb-6 flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center">
        <input
          type="file" aria-label="Evaluation dataset"
          accept=".json,.jsonl"
          onChange={handleFileUpload}
          disabled={isEvaluating}
          className="block w-full text-sm text-gray-300 transition-all file:mr-4 file:rounded-md file:border-0 file:bg-gray-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-600"
        />
        <button
          onClick={startEvaluation}
          disabled={!fileContent || isEvaluating}
          className="rounded-lg bg-emerald-600 px-6 py-2 font-bold whitespace-nowrap text-white shadow shadow-emerald-500/30 transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isEvaluating ? "Evaluating…" : "Start Evaluation"}
        </button>
      </div>

      {/* Format hint */}
      {!fileContent && (
        <div className="mb-4 w-full rounded-lg border border-gray-600/50 bg-gray-900/40 p-3 text-xs text-gray-400">
          <span className="font-semibold text-gray-300">Accepted formats: </span>
          JSON array <code className="text-emerald-400">[{"{"}"description":"...", "objective_type":"maximize", "formulation":{"{"}"constraints":[...]{"}"}{"}"}]</code>
          {" "}or JSONL. Each entry needs a <code className="text-emerald-400">description</code> and
          {" "}<code className="text-emerald-400">constraints</code> with <code className="text-emerald-400">sense</code> (&lt;= / &gt;= / ==) and <code className="text-emerald-400">rhs</code>.
        </div>
      )}

      {totalItems > 0 && (
        <div className="w-full">
          {/* Progress bar */}
          <div className="mb-2 flex justify-between font-mono text-sm text-gray-400">
            <span>Progress: {progress} / {totalItems}</span>
            <span>{isEvaluating ? "Running…" : "Complete"}</span>
          </div>
          <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-gray-700">
            <div
              className="h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] transition-all duration-300"
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
            <div className="rounded-xl border-2 border-emerald-500 bg-gray-700/50 p-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <div className="font-mono text-3xl font-bold text-emerald-400">{precision.toFixed(2)}%</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-emerald-200">Precision</div>
              <div className="mt-1 font-mono text-[10px] text-emerald-400/50">TP / (TP + FP)</div>
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

          {/* Action buttons */}
          {isDone && (
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                onClick={downloadResults}
                className="rounded-lg bg-green-700 px-5 py-2 font-bold text-white shadow shadow-green-500/30 transition-all hover:bg-green-600"
              >
                Download Results (JSON)
              </button>
              {!isSaved ? (
                <button
                  onClick={() =>
                    saveRun.mutate({
                      datasetType: "complexor",
                      totalCases: totalItems,
                      tp: cTp,
                      fp: cFp,
                      fn: cFn,
                      precision,
                      recall,
                      f1,
                      testCases: allCases,
                    })
                  }
                  disabled={saveRun.isPending}
                  className="rounded-lg bg-purple-600 px-5 py-2 font-bold text-white shadow shadow-purple-500/30 transition-all hover:bg-purple-700 disabled:opacity-50"
                >
                  {saveRun.isPending ? "Saving…" : "Save to History"}
                </button>
              ) : (
                <span className="rounded-lg border border-green-600 bg-green-900/30 px-5 py-2 text-sm font-semibold text-green-400">
                  Saved to History ✓
                </span>
              )}
            </div>
          )}

          {/* Live log */}
          {currentLog.prompt && (
            <div className="mt-6 w-full rounded-xl border border-gray-600 bg-gray-900/80 p-5 text-left shadow-inner">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
                Live Interaction Log
              </h3>
              <div className="mb-3 rounded-lg bg-gray-800 p-3">
                <div className="mb-1 text-xs font-bold text-emerald-400">Problem Description:</div>
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
                          <span className={`font-bold ${msg.role === "Evaluator" ? "text-blue-400" : "text-green-400"}`}>
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
                    <div className="mb-1 text-xs font-bold text-emerald-400">Predicted JSON:</div>
                    <div className="custom-scrollbar max-h-24 overflow-y-auto font-mono text-xs whitespace-pre-wrap text-gray-300">
                      {currentLog.response ?? "Awaiting response…"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mismatches */}
          {isDone && mismatches.length > 0 && (
            <div className="mt-6 w-full rounded-xl border border-red-900/50 bg-gray-900/80 p-5 text-left shadow-inner">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-red-500">
                Mismatches ({mismatches.length})
              </h3>
              <div className="custom-scrollbar flex max-h-[600px] flex-col gap-5 overflow-y-auto pr-1">
                {mismatches.map((m, idx) => (
                  <div key={idx} className="rounded-lg border border-gray-700 bg-gray-800 p-4">
                    <div className="mb-3">
                      <span className="text-xs font-bold text-emerald-400">Problem: </span>
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
                                className={`rounded p-1 ${msg.role === "Evaluator" ? "bg-blue-900/20" : "bg-green-900/20"}`}
                              >
                                <span className={`font-bold ${msg.role === "Evaluator" ? "text-blue-400" : "text-green-400"}`}>
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
                        <div className="mb-1 text-xs font-bold text-red-400">Predicted — Highlights:</div>
                        <div className="custom-scrollbar max-h-52 overflow-y-auto rounded bg-gray-900 p-2 font-mono text-xs text-gray-300">
                          {renderComplexORHighlightedJSON(
                            m.predicted,
                            evaluateComplexORTask(m.predicted, m.truth),
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
