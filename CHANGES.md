# Session Changes — 2026-04-17

## Summary

This session focused on three main areas:
1. Migrating the LLM provider from Groq to Cerebras
2. Building and iteratively improving the multi-agent LP solver pipeline (`/solver`)
3. Improving accuracy of both evaluators from **61% → 67.35%** (and further improvements queued)

---

## 1. LLM Provider Migration: Groq → Cerebras

### Files changed
- `src/env.js` — replaced `GROQ_API_KEY` schema + `runtimeEnv` binding with `CEREBRAS_API_KEY`
- `package.json` / `package-lock.json` — added `@langchain/cerebras` dependency
- `src/app/api/chat/route.ts`
- `src/app/api/evaluate/route.ts`
- `src/app/api/solver/chat/route.ts`
- `src/app/api/solver/evaluate/route.ts`
- `src/app/api/solver/solve/route.ts`

### What changed
All five API routes had their imports and model constructors swapped:

```ts
// Before
import { ChatGroq } from "@langchain/groq";
new ChatGroq({ apiKey: env.GROQ_API_KEY, model: "llama-3.3-70b-versatile" })

// After
import { ChatCerebras } from "@langchain/cerebras";
new ChatCerebras({ apiKey: env.CEREBRAS_API_KEY, model: "llama3.1-8b" })
```

Model assignments:
| Role | Model |
|---|---|
| Evaluator / Elicitation agent | `llama3.1-8b` |
| User simulation | `llama3.1-8b` |
| Formulation / Critic / Presenter | `llama3.1-8b` |
| Baseline chat | `llama3.1-8b` |

---

## 2. New Files: Multi-Agent Solver Pipeline

These files did not exist on the last commit and are entirely new.

### `src/app/solver/page.tsx`
Tab-based page for the solver. Two tabs:
- **Solve a Problem** — interactive multi-agent LP solver chat
- **Accuracy Testing** — batch evaluator against NL4Opt ground truth

### `src/app/_components/SolverChat.tsx`
Interactive elicitation chat UI. Streams agent turns and renders the final LP structure + solution once the elicitation agent emits `<LP_READY>`.

### `src/app/_components/SolverEvaluator.tsx`
Batch evaluator for the multi-agent pipeline. Streams through a JSONL dataset, calls `/api/solver/evaluate`, computes TP/FP/FN, displays precision/recall/F1, and downloads a mismatch report.

### `src/app/api/solver/chat/route.ts`
Elicitation agent (single turn). Uses `llama3.1-8b` to ask focused questions about the LP problem. Emits `<LP_READY>` JSON block when the problem is fully elicited.

### `src/app/api/solver/solve/route.ts`
Four-stage pipeline: **Formulation → Code Critic (up to 3 iterations) → Execution → Presentation**.
- Generates `scipy.optimize.linprog` Python code
- Critic reviews for correctness, revises if needed
- Executes the code in a subprocess
- Presenter explains the result in plain English

### `src/app/api/solver/evaluate/route.ts`
Batch evaluation route. Runs a two-agent conversation (elicitation agent + user simulation) against each problem in the dataset, then post-processes and emits the structured result.

---

## 3. Evaluation Loop Bug Fix

### Problem
The evaluator LLM and user simulation LLM would enter an infinite "have a great day" loop — the evaluator would finish gathering information and sign off with a farewell instead of outputting JSON. The user sim would mirror it, and both kept exchanging pleasantries until `MAX_TURNS`.

### Fix applied to both `evaluate/route.ts` and `solver/evaluate/route.ts`

```ts
const isFarewell = (text: string) =>
  /have a (great|good|wonderful|nice)|good(bye| luck|-bye)|best of luck|..../i.test(text);

const FORCE_JSON_MSG =
  "You have all the information you need. Output ONLY the final JSON now.";

// Inside the loop — before passing to user sim:
if (isFarewell(elicitContent) || i === MAX_TURNS - 1) {
  elicitHistory.push(new HumanMessage(FORCE_JSON_MSG));
  // force JSON immediately, skip user turn
  break;
}
```

Also added to both evaluator system prompts:
> "NEVER say goodbye, sign off, or use farewell phrases. When ready, output the JSON immediately."

---

## 4. Accuracy Improvements

### Baseline: 61.82% precision (run 1)

#### Round 1 fixes → 67.35% precision (run 2)

**`src/app/_components/SolverEvaluator.tsx` + `Evaluator.tsx`**

| Change | Reason |
|---|---|
| Added `normalizeVarName()` | Strip quantifier prefixes (`"number of wired headphones"` → `"wired headphones"`) |
| Added `tokenize()` + Jaccard similarity (threshold 0.5) | Handle paraphrased variable names |
| Added subset-containment check | All tokens of shorter name found in longer name → match |
| Added underscore→space normalisation | `clothing_company` → `clothing company` |
| Replaced inline `xy`-only matching with `constraintsMatch()` | Unified matcher for all constraint types |
| Added `XY_LIKE = {xy, xby, ratio}` family | `xby` ↔ `ratio` ↔ `xy` are interchangeable — matched on operator + variable pair only |
| Added `limitsMatch()` | Strips `$`, `%`, `,` before comparing limit strings |

**`src/app/api/evaluate/route.ts` + `solver/evaluate/route.ts`**

Post-processing pipeline applied to every parsed JSON before emitting as result:

| Step | What it does |
|---|---|
| 1 | Normalise limit values — strip `$`, `%`, `,` |
| 2 | Remove implicit non-negativity lower bounds (`lowerbound`, `GREATER_OR_EQUAL`, limit `"0"`) |
| 3 | Remove constraints with non-numeric limits (`"null"`, free-text) |
| 4 | Convert `linear` with all-`"1"` coefficients → `sum` (drop `terms` field) |
| 5 | Remove spurious `terms` field from `sum` constraints |
| 6 | Convert `upperbound`/`lowerbound` whose `var` contains `"+"` → `sum` |
| 7 | Normalise snake_case variable names to spaced names |
| 8 | Deduplicate on structural key |

Prompt additions (both routes):
- Added `xby` constraint type to schema with `param` field
- Rule: "NEVER add non-negativity constraints (lower bound = 0)"
- Rule: "Use `xby`, NOT `lowerbound`, for multiplier relationships"
- Rule: "`sum` type has NO `var` or `terms` field"
- Rule: "When a sentence mentions bounds on multiple variables, create a SEPARATE entry for EACH"

User simulation prompt additions:
- "Use the SHORTEST exact noun phrase from your document when naming variables"
- "When a sentence mentions multiple items, state ALL of them"

---

## 5. Duplicate / Over-generation Fix in Baseline Evaluator

### `src/app/api/evaluate/route.ts`
Added deduplication rules to the system prompt:
- "ONE CONSTRAINT PER SENTENCE — do not split a single constraint into multiple entries"
- "NO DUPLICATES — self-check before outputting JSON"

Also added server-side post-processing deduplication to catch cases where the prompt alone wasn't enough.

---

## Accuracy Summary

| Run | Precision | Recall | Notes |
|---|---|---|---|This
| Baseline (run 1) | 61.82% | 69.39% | Original Groq pipeline |
| After fixes (run 2) | 67.35% | 67.35% | Cerebras + post-processing + prompt improvements |
| Further improvements queued | — | — | Combined-var→sum, snake_case fix, per-sentence multi-bound rule |
