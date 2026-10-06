"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowCounterClockwise,
  Check,
  Download,
  FileText,
  Play,
  SpinnerGap,
  WarningCircle,
} from "@phosphor-icons/react";
import { Header } from "./Header";
import { EXAMPLES, STAGES, useSolver, type Solver } from "./use-solver";
import type { Problem, SolverEvent } from "~/lib/solver-stream";

const TABS = ["Overview", "Python", "Agent trace"];
function expression(coefficients: Record<string, number>) {
  return (
    Object.entries(coefficients)
      .filter(([, value]) => value !== 0)
      .map(
        ([name, value], i) =>
          (value < 0 ? (i ? " − " : "−") : i ? " + " : "") +
          Math.abs(value) +
          " " +
          name,
      )
      .join("") || "0"
  );
}
function Model({ problem }: { problem: Problem }) {
  return (
    <div className="math-model">
      <div className="model-objective">
        <span>
          {problem.direction === "maximize" ? "Maximise" : "Minimise"}{" "}
          {problem.objective_name}
        </span>
        <p>{expression(problem.objective_coefficients)}</p>
      </div>
      <dl className="variable-definitions">
        {problem.variables.map((v) => (
          <div key={v.name}>
            <dt>{v.name}</dt>
            <dd>
              {v.description}
              {v.unit ? " · " + v.unit : ""}
            </dd>
          </div>
        ))}
      </dl>
      <h3>Subject to</h3>
      {problem.constraints.length ? (
        problem.constraints.map((c, i) => (
          <div className="equation" key={i}>
            <code>
              {expression(c.coefficients)}{" "}
              {c.operator === "<=" ? "≤" : c.operator === ">=" ? "≥" : "="}{" "}
              {c.rhs}
            </code>
            <span>{c.description || c.name}</span>
          </div>
        ))
      ) : (
        <p>No explicit constraints provided.</p>
      )}
      <h3 className="bounds-title">Variable bounds</h3>
      {problem.variables.map((v) => {
        const b = problem.variable_bounds[v.name];
        return (
          <div className="equation" key={v.name}>
            <code>
              {b
                ? b.lower +
                  " ≤ " +
                  v.name +
                  (b.upper !== null ? " ≤ " + b.upper : "")
                : v.name + ": not specified"}
            </code>
          </div>
        );
      })}
      <p className="model-footnote">
        Continuous linear programme. Review these assumptions before solving.
      </p>
    </div>
  );
}
function Empty({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="empty-output">
      <FileText size={30} />
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
function eventText(e: SolverEvent): string {
  switch (e.type) {
    case "stage":
      return e.message;
    case "code":
      return "Initial Python code received.";
    case "code_revised":
      return "Python code revised (iteration " + e.iteration + ").";
    case "critic":
      return (
        "Review " +
        e.iteration +
        ": " +
        (e.approved ? "approved. " : "changes requested. ") +
        e.feedback
      );
    case "execution":
      return (
        (e.retry ? "Retry: " : "") +
        (e.success ? "Python execution completed." : "Python execution failed.")
      );
    case "presentation":
      return "Explanation received.";
    case "lp_model":
      return "Generated LP model received.";
    case "error":
      return e.message;
    case "message":
      return e.text;
    case "ready":
      return "Structured problem confirmed.";
  }
}
function Overview({ s }: { s: Solver }) {
  if (s.stage === 0)
    return s.problem ? (
      <div className="understand">
        <h3>Your confirmed problem</h3>
        <p className="explanation">
          The conversation has produced a structured model. Inspect Formulate,
          then choose Solve model when you’re ready.
        </p>
        <dl>
          <div>
            <dt>Goal</dt>
            <dd>
              {s.problem.direction} {s.problem.objective_name}
            </dd>
          </div>
          <div>
            <dt>Decisions</dt>
            <dd>{s.problem.variables.map((v) => v.name).join(", ")}</dd>
          </div>
          <div>
            <dt>Constraints</dt>
            <dd>{s.problem.constraints.length} explicit constraints</dd>
          </div>
        </dl>
      </div>
    ) : (
      <div className="understand">
        <h3>A good answer starts with a clear problem.</h3>
        <p>
          Describe your goal in your own words. The agent will ask for any
          missing details and confirm the model with you.
        </p>
        <dl>
          <div>
            <dt>Goal</dt>
            <dd>What should be maximised or minimised?</dd>
          </div>
          <div>
            <dt>Decisions</dt>
            <dd>Which quantities can you choose?</dd>
          </div>
          <div>
            <dt>Limits</dt>
            <dd>What resources, capacities or requirements apply?</dd>
          </div>
        </dl>
        <p className="explanation">
          The model, Python code and explanation will appear here as the agents
          work.
        </p>
      </div>
    );
  if (s.stage === 1)
    return s.problem ? (
      <>
        <Model problem={s.problem} />
        {s.pipeline.model != null && (
          <details className="output-disclosure">
            <summary>Generated LP representation</summary>
            <pre className="code-output">
              {JSON.stringify(s.pipeline.model, null, 2)}
            </pre>
          </details>
        )}
      </>
    ) : (
      <Empty title="No model yet">
        Describe your problem and confirm the agent’s summary first.
      </Empty>
    );
  if (s.stage === 2)
    return s.pipeline.reviews.length ? (
      <div className="review-output">
        {s.pipeline.reviews.map((r, i) => (
          <section key={i} className="review-entry">
            <h3>
              {r.approved ? <Check size={20} /> : <WarningCircle size={20} />}
              Review {r.iteration} ·{" "}
              {r.approved ? "Approved" : "Changes requested"}
            </h3>
            <p>{r.feedback}</p>
            {r.issues.length > 0 && (
              <ul>
                {r.issues.map((issue, j) => (
                  <li key={j}>{issue}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <p className="model-footnote">
          The critic reviews generated code. Check the execution output as well;
          review approval does not guarantee an optimal result.
        </p>
      </div>
    ) : (
      <Empty title="Waiting for the code critic">
        After formulation, the critic checks the generated code against your
        problem.
      </Empty>
    );
  if (s.stage === 3)
    return s.pipeline.executions.length ? (
      <div>
        {s.pipeline.executions.map((e, i) => (
          <section className="execution-entry" key={i}>
            <h3>
              {e.retry ? "Retry" : "Execution"} ·{" "}
              {e.success ? "Completed" : "Failed"}
            </h3>
            <pre className="code-output">
              {e.output || "No output returned."}
            </pre>
          </section>
        ))}
        <p className="model-footnote">
          Completed means the code ran. Read the solver’s status to see whether
          a feasible optimum was found.
        </p>
      </div>
    ) : (
      <Empty title="No execution output yet">
        The Python runner will report its result here, including any errors or
        retries.
      </Empty>
    );
  return s.pipeline.presentation ? (
    <div className="presentation">
      <h3>The agent’s explanation</h3>
      <p>{s.pipeline.presentation}</p>
      <p className="model-footnote">
        Compare this explanation with the raw execution output before using the
        result.
      </p>
    </div>
  ) : (
    <Empty title="Your explanation will appear here">
      Once execution finishes, the presentation agent relates the output to your
      original problem.
    </Empty>
  );
}
function Output({ s }: { s: Solver }) {
  const [tab, setTab] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const stage = STAGES[s.stage]!;
  return (
    <section className="stage-detail" aria-label="Stage output">
      <div className="detail-heading">
        <div>
          <h2>{stage.heading}</h2>
          <p>{stage.description}</p>
        </div>
      </div>
      <div className="output-tabs" role="tablist" aria-label="Output format">
        {TABS.map((label, i) => (
          <button
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={"output-tab-" + i}
            aria-controls={"output-panel-" + i}
            aria-selected={tab === i}
            tabIndex={tab === i ? 0 : -1}
            key={label}
            onClick={() => setTab(i)}
            onKeyDown={(e) => {
              let next = i;
              if (e.key === "ArrowRight") next = (i + 1) % 3;
              else if (e.key === "ArrowLeft") next = (i + 2) % 3;
              else if (e.key === "Home") next = 0;
              else if (e.key === "End") next = 2;
              else return;
              e.preventDefault();
              setTab(next);
              tabs.current[next]?.focus();
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {TABS.map((label, i) => (
        <div
          key={label}
          className="output-body"
          id={"output-panel-" + i}
          role="tabpanel"
          aria-labelledby={"output-tab-" + i}
          hidden={tab !== i}
          tabIndex={0}
        >
          {i === 0 ? (
            <Overview s={s} />
          ) : i === 1 ? (
            s.pipeline.code ? (
              <>
                <pre className="code-output">
                  <code>{s.pipeline.code}</code>
                </pre>
                {s.pipeline.revisions.length > 0 && (
                  <details className="output-disclosure">
                    <summary>
                      {s.pipeline.revisions.length} code revisions
                    </summary>
                    {s.pipeline.revisions.map((r, j) => (
                      <div key={j}>
                        <h3>Iteration {r.iteration}</h3>
                        <pre className="code-output">{r.code}</pre>
                      </div>
                    ))}
                  </details>
                )}
              </>
            ) : (
              <Empty title="No Python code yet">
                Solve a confirmed model to generate its Python implementation.
              </Empty>
            )
          ) : s.pipeline.trace.length ? (
            <ol className="transcript">
              {s.pipeline.trace.map((e, j) => (
                <li key={j}>
                  <span>{String(j + 1).padStart(2, "0")}</span>
                  <p>{eventText(e)}</p>
                </li>
              ))}
            </ol>
          ) : (
            <Empty title="No solver events yet">
              The agent trace will record the actual events from your run.
            </Empty>
          )}
        </div>
      ))}
    </section>
  );
}
export default function Workspace() {
  const s = useSolver();
  const input = useRef<HTMLTextAreaElement>(null);
  const p = s.pipeline;
  const conversation = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = conversation.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [s.messages]);
  const completed = [
    !!s.problem,
    !!p.code,
    p.reviews.at(-1)?.approved === true,
    p.executions.at(-1)?.success === true,
    !!p.presentation,
  ];
  const current = [
    "",
    "formulation",
    "critic",
    "execution",
    "presentation",
  ].indexOf(p.stage ?? "");
  const newProblem = () => {
    s.reset();
    input.current?.focus();
  };
  return (
    <div className="lp-app proof">
      <a className="skip-link" href="#workspace">
        Skip to workspace
      </a>
      <Header />
      <main id="workspace" className="proof-layout">
        <aside className="proof-rail">
          <div className="rail-title">
            <FileText size={21} />
            <strong>Problem workspace</strong>
          </div>
          <nav className="stage-nav" aria-label="Agent stages">
            {STAGES.map((stage, i) => (
              <button
                type="button"
                key={stage.name}
                className={"stage-button" + (s.stage === i ? " active" : "")}
                aria-current={s.stage === i ? "step" : undefined}
                onClick={() => {
                  s.setStage(i);
                  if (window.matchMedia("(max-width:1100px)").matches)
                    document
                      .querySelector(".stage-detail")
                      ?.scrollIntoView({ block: "start" });
                }}
              >
                <span className="stage-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="stage-name">
                  {stage.name}
                  <small>{stage.agent}</small>
                </span>
                <span className="stage-state">
                  {s.busy && (s.busy === "chat" ? i === 0 : i === current) ? (
                    <SpinnerGap
                      size={17}
                      className="working"
                      aria-label="Working"
                    />
                  ) : completed[i] ? (
                    <Check size={15} aria-label="Output available" />
                  ) : s.stage === i ? (
                    <ArrowRight size={16} />
                  ) : null}
                </span>
              </button>
            ))}
          </nav>
          <div className="rail-note">
            <h3>Every step is inspectable.</h3>
            <p>
              The statement, the maths, the code, and the answer. Follow each
              decision as it happens.
            </p>
          </div>
          <details className="workspace-help">
            <summary>How it works</summary>
            <p>
              Describe a continuous linear programming problem. Answer the
              agent’s questions and confirm its summary, then solve the model.
            </p>
            <p>
              Messages are sent to the configured AI service. This workspace is
              kept in this tab’s memory; export a run before leaving or
              reloading.
            </p>
          </details>
        </aside>
        <div className="proof-main">
          <div className="proof-title">
            <div>
              <h1>From problem to proof.</h1>
              <p>
                A clear statement. A checked model. An answer you can explain.
              </p>
            </div>
            <button
              className="text-button"
              type="button"
              disabled={!!s.busy || (!s.messages.length && !s.input)}
              onClick={newProblem}
            >
              <ArrowCounterClockwise size={16} />
              New problem
            </button>
          </div>
          <div className="proof-document">
            <div className="document-heading">
              <strong>
                {s.problem ? s.problem.objective_name : "Untitled problem"}
              </strong>
              <span>Linear programming</span>
            </div>
            <div className="proof-columns">
              <section className="prompt-panel">
                <div className="section-heading">
                  <h2>Your problem</h2>
                  <FileText size={19} />
                </div>
                {s.messages.length === 0 ? (
                  <>
                    <label className="field-label" htmlFor="example">
                      Start with an example
                    </label>
                    <select
                      id="example"
                      defaultValue=""
                      disabled={!!s.busy}
                      onChange={(e) => {
                        const example = EXAMPLES[Number(e.target.value)];
                        if (e.target.value !== "" && example) {
                          s.setInput(example.text);
                          input.current?.focus();
                        }
                        e.target.value = "";
                      }}
                    >
                      <option value="">Choose an example…</option>
                      {EXAMPLES.map((e, i) => (
                        <option value={i} key={e.title}>
                          {e.title}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <div
                    ref={conversation}
                    className="conversation"
                    role="log"
                    aria-label="Problem conversation"
                    aria-live="polite"
                  >
                    {s.messages.map((m, i) => (
                      <article className={"message " + m.role} key={i}>
                        <h3>
                          {m.role === "user" ? "You" : "Elicitation agent"}
                        </h3>
                        <p>{m.content}</p>
                      </article>
                    ))}
                  </div>
                )}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    s.send();
                  }}
                >
                  <label className="field-label" htmlFor="problem-input">
                    {s.messages.length
                      ? "Reply or refine your problem"
                      : "Describe what you want to optimise"}
                  </label>
                  <textarea
                    ref={input}
                    id="problem-input"
                    className={s.messages.length ? "reply-input" : ""}
                    value={s.input}
                    onChange={(e) => s.setInput(e.target.value)}
                    disabled={!!s.busy}
                    placeholder="What are you deciding, and what limits do you need to work within?"
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        !e.shiftKey &&
                        !e.nativeEvent.isComposing
                      ) {
                        e.preventDefault();
                        s.send();
                      }
                    }}
                  />
                  <div className="prompt-note">
                    Enter to send · Shift + Enter for a new line
                  </div>
                  <button
                    className="primary run-button"
                    type="submit"
                    disabled={!!s.busy || !s.input.trim()}
                  >
                    {s.busy === "chat" ? (
                      <>
                        <SpinnerGap className="working" size={18} />
                        Understanding…
                      </>
                    ) : (
                      <>
                        {s.messages.length
                          ? "Send reply"
                          : "Understand problem"}
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
                {s.problem && (
                  <div className="solve-action">
                    <p>
                      Model confirmed. Review the formulation, then run the
                      solver.
                    </p>
                    <button
                      className="primary run-button"
                      disabled={!!s.busy}
                      onClick={s.solve}
                    >
                      {s.busy === "solve" ? (
                        <>
                          <SpinnerGap className="working" size={18} />
                          Solving…
                        </>
                      ) : (
                        <>
                          <Play size={17} weight="fill" />
                          {s.pipeline.trace.length
                            ? "Solve again"
                            : "Solve model"}
                        </>
                      )}
                    </button>
                  </div>
                )}
                {s.error && (
                  <div className="request-error" role="alert">
                    <h3>
                      <WarningCircle size={18} />
                      Request needs attention
                    </h3>
                    <p>{s.error}</p>
                  </div>
                )}
                {!s.busy && s.retryChat && (
                  <button
                    className="text-button"
                    onClick={() => void s.retry()}
                  >
                    Try message again <ArrowRight size={16} />
                  </button>
                )}
                {s.busy && (
                  <button className="text-button stop-button" onClick={s.stop}>
                    Stop waiting
                  </button>
                )}
              </section>
              <Output s={s} />
            </div>
            <div className="proof-assumptions">
              <FileText size={17} />
              <span>
                {s.problem
                  ? "Assumptions stay visible: check variable bounds and resource limits in Formulate."
                  : "Confirm the problem with the agent before any solver run begins."}
              </span>
            </div>
          </div>
          <footer className="workspace-footer">
            <span role="status" aria-live="polite">
              {s.status}
            </span>
            <button
              className="text-button"
              onClick={s.download}
              disabled={!!s.busy || !s.messages.length}
            >
              <Download size={17} />
              Export run
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
}
