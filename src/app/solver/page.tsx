"use client";

import { useState } from "react";
import Link from "next/link";
import { SolverChat } from "../_components/SolverChat";
import { SolverEvaluator } from "../_components/SolverEvaluator";

type Tab = "solve" | "test";

export default function SolverPage() {
  const [tab, setTab] = useState<Tab>("solve");

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#212121] to-[#36373f] px-4 pb-12 text-white">
      {/* Header */}
      <div className="flex w-full max-w-7xl items-center justify-between pt-8 pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Multi-Agent LP Solver</h1>
          <p className="mt-1 text-sm text-gray-400">
            Elicitation → Formulation → Code Critic → Execution → Presentation
          </p>
        </div>
        <Link
          href="/"
          className="rounded-lg border border-gray-600 bg-gray-700/60 px-4 py-2 text-sm font-semibold text-gray-200 transition-all hover:bg-gray-600"
        >
          ← Back to Baseline
        </Link>
      </div>

      {/* Architecture Overview */}
      <div className="mb-6 flex w-full max-w-7xl items-center justify-center gap-2 text-xs text-gray-400">
        {[
          { label: "1 · Elicitation", color: "bg-blue-700" },
          { label: "2 · Formulation", color: "bg-purple-700" },
          { label: "3 · Code Critic", color: "bg-yellow-700" },
          { label: "4 · Execution", color: "bg-green-700" },
          { label: "5 · Presentation", color: "bg-teal-700" },
        ].map((step, i, arr) => (
          <div key={i} className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 font-semibold text-white ${step.color}`}>
              {step.label}
            </span>
            {i < arr.length - 1 && <span className="text-gray-600">→</span>}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex w-full max-w-7xl gap-1 rounded-xl border border-gray-700 bg-gray-800/40 p-1">
        <button
          onClick={() => setTab("solve")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
            tab === "solve"
              ? "bg-blue-600 text-white shadow"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Solve a Problem
        </button>
        <button
          onClick={() => setTab("test")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
            tab === "test"
              ? "bg-blue-600 text-white shadow"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Accuracy Testing (TP / (TP + FP))
        </button>
      </div>

      {/* Tab Content */}
      {tab === "solve" ? (
        <SolverChat />
      ) : (
        <SolverEvaluator />
      )}
    </main>
  );
}
