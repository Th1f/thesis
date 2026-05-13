import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { env } from "../../../../env";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// ─── Models ──────────────────────────────────────────────────────────────────
const bigModel = new ChatOpenAI({
  apiKey: env.DEEPSEEK_API_KEY,
  model: "deepseek-chat",
  temperature: 0.1,
  configuration: { baseURL: "https://api.deepseek.com/v1" },
});

const criticModel = new ChatOpenAI({
  apiKey: env.DEEPSEEK_API_KEY,
  model: "deepseek-chat",
  temperature: 0.05,
  configuration: { baseURL: "https://api.deepseek.com/v1" },
});

// ─── System Prompts ───────────────────────────────────────────────────────────
const FORMULATION_SYSTEM = `You are an expert linear programming engineer.
Given a structured LP problem in JSON, generate production-quality Python code using scipy.optimize.linprog that solves it exactly.

OUTPUT FORMAT — you MUST include both blocks:

<PYTHON_CODE>
from scipy.optimize import linprog

# ── Problem Description ────────────────────────────────────────────────────────
# [One-line summary of what is being solved]

# Decision variables (in order used throughout):
variable_names = [...]  # exact names from problem

# ── Objective ─────────────────────────────────────────────────────────────────
# [direction]: [expression]
# linprog minimises → negate coefficients when maximising
c = [...]

# ── Inequality constraints  (A_ub @ x <= b_ub) ────────────────────────────────
A_ub = [
    [...],  # constraint name: description
]
b_ub = [...]

# ── Equality constraints (if any) ─────────────────────────────────────────────
# A_eq = []; b_eq = []

# ── Variable bounds [(lower, upper)] ──────────────────────────────────────────
bounds = [...]

# ── Solve ──────────────────────────────────────────────────────────────────────
result = linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=bounds, method='highs')

if result.success:
    is_max = ...  # True or False
    obj_value = -result.fun if is_max else result.fun
    print("Status: Optimal solution found")
    print(f"Optimal value: {obj_value:.4f}")
    print("\\nDecision Variables:")
    for name, val in zip(variable_names, result.x):
        print(f"  {name} = {val:.4f}")
    if A_ub:
        print("\\nConstraint slack (how far from the limit):")
        import numpy as np
        slack = b_ub - (np.array(A_ub) @ result.x)
        constraint_names = [...]  # short names matching A_ub rows
        for cname, s in zip(constraint_names, slack):
            print(f"  {cname}: slack = {s:.4f}")
else:
    print(f"No optimal solution: {result.message}")
</PYTHON_CODE>

<LP_JSON>
{
  "optimize": "objective_expression_string",
  "opType": "max" | "min",
  "variables": {"var_name": {"obj_coeff": number, "constraint_label": coeff, ...}},
  "constraints": {"constraint_label": {"max": rhs} | {"min": rhs} | {"equal": rhs}}
}
</LP_JSON>

RULES:
- Use EXACT variable names from the problem JSON.
- For maximisation: negate ALL c coefficients; set is_max = True.
- Every constraint must appear correctly in A_ub/b_ub OR A_eq/b_eq.
- Variable count must be identical across c, every row of A_ub/A_eq, and bounds.
- Do NOT use markdown fences inside the blocks.`;

const CRITIC_SYSTEM = `You are a rigorous LP code reviewer specialising in scipy.optimize.linprog.

Given a Python scipy solution and the original LP problem JSON, check for:
1. Correct negation of objective coefficients for maximisation problems.
2. Every declared constraint correctly mapped into A_ub/b_ub (<=) or A_eq/b_eq (=).
   - >= constraints must be multiplied by -1 and placed in A_ub.
3. Consistent variable count across c, all A rows, and bounds.
4. Non-negativity bounds set correctly.
5. variable_names list matches the order used in c, A_ub, etc.
6. No Python syntax errors (indentation, missing imports, etc.).
7. is_max flag matches the objective direction.

OUTPUT ONLY this block:
<REVIEW>
{
  "approved": true | false,
  "feedback": "brief overall verdict",
  "issues": ["issue description", ...],
  "revised_code": "complete corrected Python code if approved is false, otherwise null"
}
</REVIEW>

If there are no issues set approved to true and revised_code to null.`;

const PRESENTER_SYSTEM = `You are an expert at explaining mathematical optimisation results to a non-technical business audience.

Given the LP problem context and the raw solver output, write a clear, friendly explanation that includes:
1. The recommended decision (e.g., "Produce 10 chairs and 5 tables per day").
2. The optimal objective value in plain terms (e.g., "This gives a maximum daily profit of $1 500").
3. Which constraints are binding (slack ≈ 0) and what that means practically.
4. One or two actionable insights or caveats.

Write in plain English. No LaTeX, no code. Use the variable descriptions and units from the problem context.`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function extractBlock(text: string, tag: string): string | null {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
  const m = text.match(re);
  return m ? m[1]!.trim() : null;
}

function extractJsonBlock(text: string, tag: string): any {
  const raw = extractBlock(text, tag);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const PYTHON_RUNNER_URL =
  process.env.PYTHON_RUNNER_URL ?? "http://localhost:8000";

async function runPython(
  code: string,
): Promise<{ success: boolean; output: string }> {
  const res = await fetch(`${PYTHON_RUNNER_URL}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
    signal: AbortSignal.timeout(35_000),
  });
  if (!res.ok) {
    return { success: false, output: `Runner HTTP error: ${res.status}` };
  }
  const data = (await res.json()) as { success: boolean; output: string };
  return data;
}

// ─── Route ───────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { problem, conversationSummary } = (await req.json()) as {
      problem: any;
      conversationSummary: string;
    };

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const enq = (data: object) =>
          controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));

        try {
          const problemStr = JSON.stringify(problem, null, 2);

          // ── Stage 1: Formulation ──────────────────────────────────────────
          enq({
            type: "stage",
            name: "formulation",
            message: "Generating Python LP code…",
          });

          const formPrompt = `Conversation context:\n${conversationSummary}\n\nExtracted LP structure:\n${problemStr}\n\nGenerate the scipy Python code and LP JSON model.`;
          const formResp = await bigModel.invoke([
            new SystemMessage(FORMULATION_SYSTEM),
            new HumanMessage(formPrompt),
          ]);
          const formText =
            typeof formResp.content === "string" ? formResp.content : "";

          let pythonCode = extractBlock(formText, "PYTHON_CODE");
          const lpJson = extractJsonBlock(formText, "LP_JSON");

          if (!pythonCode) {
            enq({
              type: "error",
              message: "Formulation agent did not produce Python code.",
            });
            controller.close();
            return;
          }

          enq({ type: "code", code: pythonCode, language: "python" });
          if (lpJson) enq({ type: "lp_model", model: lpJson });

          // ── Stage 2: Code Critic (up to 3 iterations) ────────────────────
          enq({
            type: "stage",
            name: "critic",
            message: "Running code critic…",
          });

          for (let iter = 1; iter <= 3; iter++) {
            const criticPrompt = `Original LP problem:\n${problemStr}\n\nConversation context:\n${conversationSummary}\n\nPython code to review:\n\`\`\`python\n${pythonCode}\n\`\`\``;
            const criticResp = await criticModel.invoke([
              new SystemMessage(CRITIC_SYSTEM),
              new HumanMessage(criticPrompt),
            ]);
            const criticText =
              typeof criticResp.content === "string" ? criticResp.content : "";
            const review = extractJsonBlock(criticText, "REVIEW");

            if (!review) {
              enq({
                type: "critic",
                iteration: iter,
                approved: false,
                feedback: "Critic returned unparseable output — continuing.",
                issues: [],
              });
              continue;
            }

            enq({
              type: "critic",
              iteration: iter,
              approved: review.approved ?? false,
              feedback: review.feedback ?? "",
              issues: review.issues ?? [],
            });

            if (review.approved) break;

            // Apply fix
            if (review.revised_code) {
              pythonCode = review.revised_code as string;
              enq({ type: "code_revised", code: pythonCode, iteration: iter });
            } else {
              // Ask formulation agent to fix
              const fixPrompt = `${formPrompt}\n\nCode critic found issues (iteration ${iter}):\n${review.feedback}\n\nIssues:\n${(review.issues as string[]).join("\n")}\n\nRegenerate the corrected Python code.`;
              const fixResp = await bigModel.invoke([
                new SystemMessage(FORMULATION_SYSTEM),
                new HumanMessage(fixPrompt),
              ]);
              const fixText =
                typeof fixResp.content === "string" ? fixResp.content : "";
              const revisedCode = extractBlock(fixText, "PYTHON_CODE");
              if (revisedCode) {
                pythonCode = revisedCode;
                enq({
                  type: "code_revised",
                  code: pythonCode,
                  iteration: iter,
                });
              }
            }
          }

          // ── Stage 3: Execution ────────────────────────────────────────────
          enq({
            type: "stage",
            name: "execution",
            message: "Executing Python solver…",
          });

          let execResult = await runPython(pythonCode);
          enq({
            type: "execution",
            output: execResult.output,
            success: execResult.success,
          });

          // If execution failed, attempt one auto-fix
          if (!execResult.success) {
            const errorFixPrompt = `The Python code threw a runtime error:\n${execResult.output}\n\nCode:\n\`\`\`python\n${pythonCode}\n\`\`\`\n\nLP problem:\n${problemStr}\n\nFix the code so it runs without errors.`;
            const fixResp = await bigModel.invoke([
              new SystemMessage(FORMULATION_SYSTEM),
              new HumanMessage(errorFixPrompt),
            ]);
            const fixText =
              typeof fixResp.content === "string" ? fixResp.content : "";
            const fixedCode = extractBlock(fixText, "PYTHON_CODE");
            if (fixedCode) {
              pythonCode = fixedCode;
              enq({ type: "code_revised", code: pythonCode, iteration: 4 });
              execResult = await runPython(pythonCode);
              enq({
                type: "execution",
                output: execResult.output,
                success: execResult.success,
                retry: true,
              });
            }

            if (!execResult.success) {
              enq({
                type: "error",
                message: "Python solver failed after auto-fix attempt.",
              });
              controller.close();
              return;
            }
          }

          // ── Stage 4: Presentation ─────────────────────────────────────────
          enq({
            type: "stage",
            name: "presentation",
            message: "Generating plain-English explanation…",
          });

          const presentPrompt = `Problem context (conversation summary):\n${conversationSummary}\n\nVariable details:\n${JSON.stringify(problem.variables, null, 2)}\n\nSolver output:\n${execResult.output}\n\nExplain this result to the user.`;
          const presentResp = await bigModel.invoke([
            new SystemMessage(PRESENTER_SYSTEM),
            new HumanMessage(presentPrompt),
          ]);
          const presentText =
            typeof presentResp.content === "string" ? presentResp.content : "";
          enq({ type: "presentation", text: presentText });
        } catch (err: any) {
          enq({
            type: "error",
            message: err.message ?? "Solver pipeline failed",
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Solve API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
