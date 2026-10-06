"use client";
import { useState } from "react";
import { Header } from "../_components/proof/Header";
import { SolverEvaluator } from "../_components/SolverEvaluator";
import { ComplexOREvaluator } from "../_components/ComplexOREvaluator";
import { TestHistory } from "../_components/TestHistory";
import { Evaluator } from "../_components/Evaluator";
import { ChatPanel } from "../_components/ChatPanel";
const VIEWS = ["NL4Opt", "ComplexOR", "Baseline", "History"];
export default function EvaluationPage() {
  const [view, setView] = useState(0);
  return (
    <div className="lp-app proof">
      <a className="skip-link" href="#evaluation">
        Skip to evaluation
      </a>
      <Header />
      <main id="evaluation" className="evaluation-main">
        <div className="proof-title">
          <div>
            <h1>Measure the model.</h1>
            <p>
              Run dataset evaluations, compare the baseline, or revisit saved
              test runs.
            </p>
          </div>
        </div>
        <nav className="evaluation-nav" aria-label="Evaluation tools">
          {VIEWS.map((v, i) => (
            <button
              key={v}
              aria-current={view === i ? "page" : undefined}
              onClick={() => setView(i)}
            >
              {v}
            </button>
          ))}
        </nav>
        <div className="evaluation-content">
          {view === 0 ? (
            <SolverEvaluator />
          ) : view === 1 ? (
            <ComplexOREvaluator />
          ) : view === 2 ? (
            <>
              <Evaluator />
              <ChatPanel />
            </>
          ) : (
            <TestHistory />
          )}
        </div>
      </main>
    </div>
  );
}
