# LP Model Evaluator
<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
The user selected the interactive problem solver as the primary workflow: enter a problem and follow the agent steps. Research/evaluation and portfolio demonstration are secondary contexts inferred from the repository and related portfolio notes.

## Product Purpose
Turn a natural-language optimisation problem into a reviewed mathematical formulation, executable code, and explained solution. Dataset evaluation compares predictions with ground truth, including flexible variable-name matching.

## Capabilities and Constraints
Next.js 15 / React 19 / TypeScript, tRPC, Prisma, LangChain and a separate Python runner. Five solver stages: elicitation, formulation, code critic (with revisions), execution, presentation. The user selected Proof on 2026-10-06 and authorized its promotion. The workspace now connects to the existing chat and solve endpoints. Examples only prefill the statement; no fixture results ship. The AI conversation must emit a confirmed structured model before solving. Work remains in tab memory; JSON export preserves a run. Dataset history uses the existing database. No new deployment requested.

## Evidence on Hand
src/app/_components/proof; src/lib/solver-stream.ts; src/app/api/solver/chat/route.ts; src/app/api/solver/solve/route.ts; src/app/_components/SolverEvaluator.tsx; README.md. Public repository https://github.com/Th1f/thesis.

## Product Principles
- Make a problem easy to enter.
- Reveal actual agent output and retain revisions.
- Keep assumptions, constraints and results inspectable.
- Never imply that completed execution guarantees an optimal solution.
- Distinguish UI verification with controlled responses from a live model/runner test.

## Brand Commitments
LP Model Evaluator. Proof is the selected design: a bright document workbench, cobalt actions, Public Sans typography, ordered stage navigation. Evaluation, baseline and history remain accessible.
