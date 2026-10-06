"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { evaluateTask, renderHighlightedJSON } from "./evalUtils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ConversationMessage {
  id: number;
  msgOrder: number;
  role: string;
  content: string;
}

interface TestCase {
  id: number;
  caseIndex: number;
  problemText: string;
  hasMismatch: boolean;
  tp: number;
  fp: number;
  fn: number;
  groundTruth: string;
  predicted: string;
  messages: ConversationMessage[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(date: Date) {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MetricPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      {label}: {value}
    </span>
  );
}

// ─── Case Detail ─────────────────────────────────────────────────────────────
function CaseDetail({ tc }: { tc: TestCase }) {
  let predicted: Record<string, unknown> = {};
  let truth: Record<string, unknown> = {};
  try { predicted = JSON.parse(tc.predicted) as Record<string, unknown>; } catch {}
  try { truth = JSON.parse(tc.groundTruth) as Record<string, unknown>; } catch {}

  const matchData = evaluateTask(predicted, truth);

  return (
    <div className="mt-3 rounded-lg border border-gray-600 bg-gray-900/60 p-4">
      {/* Problem text */}
      <div className="mb-4 rounded-lg bg-gray-800 p-3">
        <div className="mb-1 text-xs font-bold text-blue-400">Problem Text:</div>
        <div className="text-sm leading-relaxed text-gray-200">{tc.problemText}</div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Conversation transcript */}
        <div>
          <div className="mb-1 text-xs font-bold text-yellow-400">
            Conversation Transcript ({tc.messages.length} turns):
          </div>
          <div className="custom-scrollbar max-h-72 space-y-1 overflow-y-auto rounded bg-gray-900 p-2 font-mono text-xs">
            {tc.messages.length > 0 ? (
              tc.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded p-1.5 ${
                    msg.role === "Evaluator"
                      ? "border border-blue-800/40 bg-blue-900/30"
                      : "border border-green-800/40 bg-green-900/30"
                  }`}
                >
                  <span className={`font-bold ${msg.role === "Evaluator" ? "text-blue-400" : "text-green-400"}`}>
                    {msg.role}:{" "}
                  </span>
                  <span className="whitespace-pre-wrap text-gray-300">{msg.content}</span>
                </div>
              ))
            ) : (
              <span className="text-gray-500">No transcript recorded</span>
            )}
          </div>
        </div>

        {/* Ground truth */}
        <div>
          <div className="mb-1 text-xs font-bold text-purple-400">Ground Truth:</div>
          <div className="custom-scrollbar max-h-72 overflow-y-auto rounded bg-gray-900 p-2 font-mono text-xs whitespace-pre-wrap text-gray-300">
            {JSON.stringify(truth, null, 2)}
          </div>
        </div>

        {/* Predicted with highlights */}
        <div>
          <div className="mb-1 text-xs font-bold text-red-400">Predicted — Highlights:</div>
          <div className="custom-scrollbar max-h-72 overflow-y-auto rounded bg-gray-900 p-2 font-mono text-xs text-gray-300">
            {renderHighlightedJSON(predicted, matchData)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Case Row ────────────────────────────────────────────────────────────────
function CaseRow({ tc }: { tc: TestCase }) {
  const [expanded, setExpanded] = useState(false);
  const excerpt = tc.problemText.length > 120
    ? tc.problemText.slice(0, 120) + "…"
    : tc.problemText;

  return (
    <div className={`rounded-lg border ${tc.hasMismatch ? "border-red-800/40" : "border-green-800/30"} bg-gray-800/60`}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-gray-700/40"
      >
        {/* Index + badge */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="font-mono text-xs text-gray-500">#{tc.caseIndex + 1}</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
            tc.hasMismatch ? "bg-red-900/60 text-red-400" : "bg-green-900/60 text-green-400"
          }`}>
            {tc.hasMismatch ? "Mismatch" : "Pass"}
          </span>
        </div>

        {/* Problem excerpt */}
        <span className="flex-1 text-xs text-gray-300">{excerpt}</span>

        {/* Per-case metrics */}
        <div className="ml-2 flex shrink-0 gap-1.5 text-[10px]">
          <span className="text-green-400">TP:{tc.tp}</span>
          <span className="text-red-400">FP:{tc.fp}</span>
          <span className="text-orange-400">FN:{tc.fn}</span>
        </div>

        {/* Expand toggle */}
        <span className="ml-2 shrink-0 text-gray-500 transition-transform" style={{ transform: expanded ? "rotate(180deg)" : "none" }}>
          ▼
        </span>
      </button>

      {expanded && <CaseDetail tc={tc} />}
    </div>
  );
}

// ─── Run Card ────────────────────────────────────────────────────────────────
function RunCard({ runId, onDeleted }: { runId: number; onDeleted: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: runs } = api.testHistory.listRuns.useQuery();
  const run = runs?.find((r) => r.id === runId);

  const { data: runDetail, isLoading: detailLoading, error: detailError, refetch: retryDetail } = api.testHistory.getRun.useQuery(
    { id: runId },
    { enabled: expanded },
  );

  const deleteRun = api.testHistory.deleteRun.useMutation({
    onSuccess: onDeleted,
  });

  if (!run) return null;

  const precision = run.tp + run.fp > 0 ? (run.tp / (run.tp + run.fp)) * 100 : 0;
  const recall = run.tp + run.fn > 0 ? (run.tp / (run.tp + run.fn)) * 100 : 0;
  const mismatches = runDetail?.testCases.filter((tc) => tc.hasMismatch).length ?? 0;

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/40 overflow-hidden">
      {/* Summary row */}
      <div className="flex items-center gap-3 p-4">
        {/* Run ID + date */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-white">Run #{run.id}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
              run.datasetType === "complexor"
                ? "bg-emerald-900/60 text-emerald-400"
                : "bg-blue-900/60 text-blue-400"
            }`}>
              {run.datasetType === "complexor" ? "ComplexOR" : "NL4Opt"}
            </span>
            <span className="text-xs text-gray-500">{formatDate(run.createdAt)}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-2">
            <MetricPill label="P" value={`${precision.toFixed(1)}%`} color="bg-blue-900/60 text-blue-300" />
            <MetricPill label="R" value={`${recall.toFixed(1)}%`} color="bg-purple-900/60 text-purple-300" />
            <MetricPill label="F1" value={`${run.f1.toFixed(1)}%`} color="bg-teal-900/60 text-teal-300" />
            <MetricPill label="TP" value={String(run.tp)} color="bg-green-900/60 text-green-300" />
            <MetricPill label="FP" value={String(run.fp)} color="bg-red-900/60 text-red-300" />
            <MetricPill label="FN" value={String(run.fn)} color="bg-orange-900/60 text-orange-300" />
          </div>
          <div className="mt-1 text-[10px] text-gray-500">
            {run.totalCases} cases tested
            {expanded && runDetail && ` · ${mismatches} mismatches`}
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => { setExpanded((v) => !v); setConfirmDelete(false); }}
            className="rounded-lg border border-gray-600 bg-gray-700/60 px-3 py-1.5 text-xs font-semibold text-gray-200 transition-all hover:bg-gray-600"
          >
            {expanded ? "Hide Cases ▲" : "View Cases ▼"}
          </button>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="rounded-lg border border-red-800/50 bg-red-900/20 px-3 py-1.5 text-xs font-semibold text-red-400 transition-all hover:bg-red-900/40"
            >
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-xs text-red-400">Sure?</span>
              <button
                onClick={() => deleteRun.mutate({ id: runId })}
                disabled={deleteRun.isPending}
                className="rounded bg-red-700 px-2 py-1 text-xs font-bold text-white hover:bg-red-600 disabled:opacity-50"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded bg-gray-600 px-2 py-1 text-xs font-bold text-white hover:bg-gray-500"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expanded case list */}
      {expanded && (
        <div className="border-t border-gray-700 bg-gray-900/40 p-4">
          {detailLoading ? (
            <div className="flex items-center justify-center py-8 text-sm text-gray-500">
              Loading cases…
            </div>
          ) : detailError ? (<div className="request-error" role="alert"><h3>This run could not be loaded</h3><p>Try loading the run again.</p><button className="text-button" onClick={() => void retryDetail()}>Retry run</button></div>) : runDetail ? (
            <div className="flex flex-col gap-2">
              {/* Case filter summary */}
              <div className="mb-2 flex items-center gap-4 text-xs text-gray-500">
                <span>{runDetail.testCases.length} total cases</span>
                <span className="text-green-400">
                  {runDetail.testCases.filter((tc) => !tc.hasMismatch).length} passed
                </span>
                <span className="text-red-400">
                  {mismatches} mismatched
                </span>
              </div>
              {runDetail.testCases.map((tc) => (
                <CaseRow key={tc.id} tc={tc} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No data available.</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function TestHistory() {
  const { data: runs, isLoading, error, refetch } = api.testHistory.listRuns.useQuery();

  return (
    <div className="mt-4 mb-4 flex w-full max-w-6xl flex-col rounded-xl border border-gray-700 bg-gray-800/60 p-6 shadow-lg backdrop-blur-sm">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-wide text-white">Test History</h2>
          <p className="mt-0.5 text-xs text-gray-400">
            Saved evaluation runs with conversations and mismatch details
          </p>
        </div>
        <button
          onClick={() => void refetch()}
          className="rounded-lg border border-gray-600 bg-gray-700/60 px-3 py-1.5 text-xs font-semibold text-gray-200 transition-all hover:bg-gray-600"
        >
          Refresh
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-500">
          Loading history…
        </div>
      ) : error ? (<div className="request-error" role="alert"><h3>History could not be loaded</h3><p>The history service is unavailable. Your saved runs may still be there.</p><button className="text-button" onClick={() => void refetch()}>Try again</button></div>) : !runs || runs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 py-16 text-center">
          <div className="text-4xl text-gray-700">📋</div>
          <div className="mt-3 text-sm font-semibold text-gray-400">No test runs saved yet</div>
          <div className="mt-1 text-xs text-gray-600">
            Run an evaluation and click "Save to History" to record it here.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="text-xs text-gray-500">{runs.length} run{runs.length !== 1 ? "s" : ""} saved</div>
          {runs.map((run) => (
            <RunCard key={run.id} runId={run.id} onDeleted={() => void refetch()} />
          ))}
        </div>
      )}
    </div>
  );
}
