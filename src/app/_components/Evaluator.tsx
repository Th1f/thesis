"use client";

import { useState } from "react";

export function Evaluator() {
  const [fileContent, setFileContent] = useState<Record<string, any> | null>(
    null,
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [metrics, setMetrics] = useState({ tp: 0, fp: 0 });
  const [currentLog, setCurrentLog] = useState<{
    prompt: string;
    response: string | null;
    truth: string | null;
  }>({ prompt: "", response: null, truth: null });
  const [mismatches, setMismatches] = useState<
    Array<{
      prompt: string;
      truth: any;
      predicted: any;
    }>
  >([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        try {
          let content = {};
          if (file.name.endsWith(".jsonl")) {
            const lines = text
              .split(/\r?\n/)
              .filter((line) => line.trim() !== "");
            lines.forEach((line) => {
              Object.assign(content, JSON.parse(line));
            });
          } else {
            content = JSON.parse(text);
          }
          setFileContent(content);
          setTotalItems(Object.keys(content).length);
        } catch (err) {
          console.error(err);
          alert("Invalid file format");
        }
      };
      reader.readAsText(file);
    }
  };

  const startEvaluation = async () => {
    if (!fileContent) return;
    setIsEvaluating(true);
    setProgress(0);
    setMetrics({ tp: 0, fp: 0 });
    setMismatches([]);

    let currentTp = 0;
    let currentFp = 0;

    const keys = Object.keys(fileContent);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!key) continue;
      const task = fileContent[key];
      const document = task.document;

      const truthSubset = {
        obj_declaration: task.obj_declaration,
        const_declarations: task.const_declarations,
      };

      setCurrentLog({
        prompt: document,
        response: null,
        truth: JSON.stringify(truthSubset, null, 2),
      });

      try {
        const response = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ document }),
        });

        if (response.ok) {
          const result = await response.json();
          setCurrentLog({
            prompt: document,
            response: JSON.stringify(result, null, 2),
            truth: JSON.stringify(truthSubset, null, 2),
          });
          const { tp, fp } = evaluateTask(result, task);

          if (fp > 0 || Object.keys(result).length === 0) {
            setMismatches((prev) => [
              ...prev,
              {
                prompt: document,
                truth: truthSubset,
                predicted: result,
              },
            ]);
          }

          currentTp += tp;
          currentFp += fp;
          setMetrics({ tp: currentTp, fp: currentFp });
        }
      } catch (e) {
        console.error("Evaluation failed for task", key, e);
      }
      setProgress(i + 1);
    }

    setIsEvaluating(false);
  };

  const evaluateTask = (predicted: any, truth: any) => {
    let tp = 0;
    let fp = 0;

    const truthConsts = truth.const_declarations || [];
    const predConsts = predicted.const_declarations || [];
    const matchedConstraints: any[] = [];
    const mismatchedConstraints: any[] = [];

    predConsts.forEach((pc: any) => {
      const match = truthConsts.find((tc: any) => {
        if (tc.type !== pc.type) return false;

        if (tc.type === "xy") {
          return (
            tc.operator === pc.operator &&
            tc.x_var === pc.x_var &&
            tc.y_var === pc.y_var
          );
        } else {
          // Default to linear
          const predLimit = String(pc.limit).trim();
          const truthLimit = String(tc.limit).trim();
          return tc.operator === pc.operator && truthLimit === predLimit;
        }
      });
      if (match) {
        tp += 1;
        matchedConstraints.push(pc);
      } else {
        fp += 1;
        mismatchedConstraints.push(pc);
      }
    });

    // Evaluate objective direction
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

    return { tp, fp, matchedConstraints, mismatchedConstraints, isObjMatched };
  };

  const renderHighlightedJSON = (predicted: any, matchData: any) => {
    if (!predicted || Object.keys(predicted).length === 0) return "{ }";

    // Highlight Objective
    const objDirection = predicted.obj_declaration?.direction || "missing";
    const objColor = matchData.isObjMatched ? "text-green-400" : "text-red-400";

    return (
      <div className="flex flex-col gap-2">
        <div>
          <span className="text-gray-400">{"{"}</span>
        </div>
        <div className="pl-4">
          <span className="text-blue-300">"obj_declaration":</span> {"{"}
          <div className="pl-4">
            <span className="text-blue-300">"direction":</span>{" "}
            <span className={objColor}>"{objDirection}"</span>,
            <div className="text-[10px] text-gray-500 italic">
              // Note: Objective direction{" "}
              {matchData.isObjMatched ? "matched!" : "mismatched!"}
            </div>
          </div>
          <span className="text-gray-400">{"},"}</span>
        </div>

        <div className="pl-4">
          <span className="text-blue-300">"const_declarations":</span> [
          {predicted.const_declarations?.map((pc: any, idx: number) => {
            const isMatch = matchData.matchedConstraints.some((mc: any) => {
              if (mc.type === "xy") {
                return (
                  mc.operator === pc.operator &&
                  mc.x_var === pc.x_var &&
                  mc.y_var === pc.y_var &&
                  mc.type === pc.type
                );
              }
              return (
                mc.limit === pc.limit &&
                mc.operator === pc.operator &&
                mc.type === pc.type
              );
            });
            const constColor = isMatch
              ? "border-green-500/50 bg-green-900/20"
              : "border-red-500/50 bg-red-900/20";
            const textColor = isMatch ? "text-green-300" : "text-red-300";
            return (
              <div
                key={idx}
                className={`my-2 border-l-2 pl-4 ${constColor} rounded-r p-2`}
              >
                <span className={textColor}>{JSON.stringify(pc, null, 2)}</span>
                <div
                  className={`mt-1 text-[10px] italic ${isMatch ? "text-green-500" : "text-red-500"}`}
                >
                  // Constraint {isMatch ? "Match ✓" : "Mismatch ✗"}
                </div>
              </div>
            );
          })}
          ]
        </div>
        <div>
          <span className="text-gray-400">{"}"}</span>
        </div>
      </div>
    );
  };

  const precision =
    metrics.tp + metrics.fp > 0
      ? (metrics.tp / (metrics.tp + metrics.fp)) * 100
      : 0;

  return (
    <div className="mt-4 mb-4 flex w-full max-w-6xl flex-col items-center rounded-xl border border-gray-700 bg-gray-800/60 p-6 shadow-lg backdrop-blur-sm transition-all duration-1000 ease-in-out">
      <h2 className="mb-4 text-2xl font-bold tracking-wide text-white">
        NL4Opt Dataset Evaluator
      </h2>

      <div className="mb-6 flex w-full items-center gap-4">
        <input
          type="file"
          accept=".json,.jsonl"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-300 transition-all file:mr-4 file:rounded-md file:border-0 file:bg-gray-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-600"
          disabled={isEvaluating}
        />
        <button
          onClick={startEvaluation}
          disabled={!fileContent || isEvaluating}
          className="rounded-lg bg-blue-600 px-6 py-2 font-bold whitespace-nowrap text-white shadow shadow-blue-500/30 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isEvaluating ? "Evaluating..." : "Start Evaluation"}
        </button>
      </div>

      {totalItems > 0 && (
        <div className="animate-fade-in-up w-full">
          <div className="mb-2 flex justify-between font-mono text-sm text-gray-400">
            <span>
              Progress: {progress} / {totalItems}
            </span>
            <span>
              {isEvaluating ? "Running Evaluation..." : "Evaluation Complete"}
            </span>
          </div>
          <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-gray-700">
            <div
              className="h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] transition-all duration-300"
              style={{ width: `${(progress / totalItems) * 100}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="rounded-xl border border-gray-600 bg-gray-700/50 p-6">
              <div className="font-mono text-4xl font-bold tracking-wider text-green-400">
                {metrics.tp}
              </div>
              <div className="translate-y-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
                True Positives
              </div>
            </div>
            <div className="rounded-xl border border-gray-600 bg-gray-700/50 p-6">
              <div className="font-mono text-4xl font-bold tracking-wider text-red-400">
                {metrics.fp}
              </div>
              <div className="translate-y-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
                False Positives
              </div>
            </div>
            <div className="rounded-xl border-2 border-blue-500 bg-gray-700/50 p-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <div className="font-mono text-4xl font-bold tracking-wider text-blue-400">
                {precision.toFixed(2)}%
              </div>
              <div className="translate-y-2 text-sm font-semibold tracking-wider text-blue-200 uppercase">
                Accuracy Output
              </div>
              <div className="mt-3 font-mono text-xs text-blue-400/50">
                TP / (TP + FP)
              </div>
            </div>
          </div>

          {/* Live Evaluation Log */}
          {currentLog.prompt && (
            <div className="mt-8 w-full rounded-xl border border-gray-600 bg-gray-900/80 p-6 text-left shadow-inner">
              <h3 className="mb-4 text-sm font-bold tracking-widest text-gray-500 uppercase">
                Live Interaction Log
              </h3>

              <div className="mb-4 rounded-lg bg-gray-800 p-4">
                <div className="mb-2 text-xs font-bold text-blue-400">
                  Word Problem (Prompt):
                </div>
                <div className="text-sm font-medium text-gray-200">
                  {currentLog.prompt}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-800 p-4">
                  <div className="mb-2 text-xs font-bold text-purple-400">
                    Ground Truth JSON:
                  </div>
                  <div className="custom-scrollbar max-h-60 overflow-y-auto font-mono text-xs whitespace-pre-wrap text-gray-300">
                    {currentLog.truth ? currentLog.truth : "Loading..."}
                  </div>
                </div>

                <div className="rounded-lg bg-gray-800 p-4">
                  <div className="mb-2 text-xs font-bold text-green-400">
                    LLM JSON Response (Live Parse):
                  </div>
                  <div className="custom-scrollbar max-h-60 overflow-y-auto font-mono text-xs whitespace-pre-wrap text-gray-300">
                    {currentLog.response
                      ? currentLog.response
                      : "Awaiting response..."}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mismatches Log (Shown after evaluation) */}
          {!isEvaluating && mismatches.length > 0 && (
            <div className="mt-8 w-full rounded-xl border border-red-900/50 bg-gray-900/80 p-6 text-left shadow-inner">
              <h3 className="mb-4 text-sm font-bold tracking-widest text-red-500 uppercase">
                Evaluation Mismatches ({mismatches.length})
              </h3>

              <div className="custom-scrollbar flex max-h-[600px] flex-col gap-6 overflow-y-auto pr-2">
                {mismatches.map((mismatch, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-gray-700 bg-gray-800 p-4"
                  >
                    <div className="mb-4">
                      <span className="text-xs font-bold text-blue-400">
                        Prompt:{" "}
                      </span>
                      <span className="text-sm text-gray-300">
                        {mismatch.prompt}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="mb-2 text-xs font-bold text-purple-400">
                          Ground Truth:
                        </div>
                        <div className="custom-scrollbar max-h-60 overflow-y-auto rounded bg-gray-900 p-2 font-mono text-xs whitespace-pre-wrap text-gray-300">
                          {JSON.stringify(mismatch.truth, null, 2)}
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 text-xs font-bold text-red-400">
                          Predicted (LLM) - Highlights:
                        </div>
                        <div className="custom-scrollbar max-h-60 overflow-y-auto rounded bg-gray-900 p-2 font-mono text-xs whitespace-pre-wrap text-gray-300">
                          {renderHighlightedJSON(
                            mismatch.predicted,
                            evaluateTask(mismatch.predicted, mismatch.truth),
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
