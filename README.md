# LP Model Evaluator — Proof

A problem-first workspace for linear programming. Describe a problem, confirm the agent’s summary, inspect the model, and follow formulation, code review, Python execution and explanation.

## Run locally

Use Node.js 24 and npm. Copy `.env.example` to `.env` and fill in your own values:

- `DEEPSEEK_API_KEY`: used by the existing chat and solver agents.
- `DATABASE_URL`: PostgreSQL connection for saved evaluation history.
- `PYTHON_RUNNER_URL`: URL of the Python runner (defaults to `http://localhost:8000`).

Run `npm install`, then `npm run dev`. Installation generates the Prisma client. Start the existing Python runner separately (see `services/python-runner`); code execution requires it. Apply the existing Prisma migrations to your development database with `npm run db:migrate` before saving evaluation history.

For a production build, use `npm run build` and `npm start`. The build generates Prisma into its standard package location, keeping its runtime external to the Next.js bundle and avoiding a Windows home-directory trace. The database schema and stored data are unchanged.

## Workspace

- `/`: Proof solver workspace.
- `/evaluation`: NL4Opt, ComplexOR, baseline and saved evaluation history.
- The previous `/solver` and `/prototypes/lp` URLs redirect to the workspace.

Examples only fill the problem input. Responses and results come from the configured services. The agent must confirm a structured problem before **Solve model** becomes available. **Stop waiting** cancels the browser request; already-started server work may continue. Runs remain in this tab’s memory; **Export run** downloads the conversation, model and received outputs before leaving or reloading.

## Verification

`npm run typecheck` checks TypeScript. `npm run test:solver` runs the stream-decoding and pipeline regression tests with Node 24. Browser integration was checked with Playwright MCP and controlled endpoint responses; that verifies the UI contract without spending AI credits, but does not establish live provider or Python-runner availability.

## Railway deployment

Live workspace: https://proof-web-production-e992.up.railway.app/

The Railway project `thesis` contains:
- `proof-web`: this Next.js application, public port 8080.
- `thesis`: the existing Python runner, reached privately at `http://thesis.railway.internal:8000`.
- `Postgres`: persistent evaluation history.

Configure these variables on `proof-web`:
- `DEEPSEEK_API_KEY`: secret, set through Railway variables.
- `DATABASE_URL=${{Postgres.DATABASE_URL}}`: Railway reference to the database.
- `PYTHON_RUNNER_URL=http://thesis.railway.internal:8000`
- `NODE_ENV=production`
- `PORT=8080`

The Docker image excludes local environment files and uses non-secret placeholders only during the build. Startup applies the existing Prisma migrations before listening on `0.0.0.0:$PORT`. The Railway configuration also declares a migration pre-deploy command and a root-page health check. Startup migration is retained because the initial CLI deployment did not apply the declared pre-deploy hook.

For updates, run `railway up --service proof-web --detach` from this repository after linking the `thesis` project. Always name `proof-web` so an upload cannot replace the Python runner. View app logs with `railway logs --service proof-web`.

Deployment verification on 2026-10-06: a real Playwright MCP workflow on the public URL completed clarification, formulation, review, Python execution and explanation. The workshop result was 30 chairs, 5 desks, optimum 1550. Production history was verified by saving, listing and reading a temporary record with nested messages, then removing that test record. Interactive solver conversations still remain in browser tab memory; PostgreSQL stores evaluation runs explicitly saved to History.


## Variable-name matching

### Matching predicted and ground-truth variables

When comparing a predicted LP model against a ground-truth model, variable names must be matched flexibly. The same variable may be expressed differently by the LLM versus the benchmark — e.g. `"number of pears produced"` vs `"pears"`. The matching pipeline handles this through four sequential checks.

---

## Pipeline: `varNamesMatch(a, b)`

The function returns `true` as soon as any check passes. Checks are ordered from strictest to most lenient.

```
Input: two variable name strings  a, b
         ↓
[1] Exact match (case-insensitive)
         ↓ fail
[2] Normalize → exact match
         ↓ fail
[3] Tokenize (with stemming)
         ↓
[4] Jaccard similarity ≥ 0.5
         ↓ fail
[5] Subset check (shorter ⊆ longer)
```

---

## Step 1 — Exact Case-Insensitive Match

```ts
if (a.toLowerCase() === b.toLowerCase()) return true;
```

Handles trivial casing differences.

| a | b | Result |
|---|---|---|
| `"Pears"` | `"pears"` | **match** |
| `"Tower 0"` | `"tower 0"` | **match** |

---

## Step 2 — Normalize Then Compare

`normalizeVarName()` strips noise words before the exact comparison is retried:

- Underscores → spaces
- Lowercase everything
- Remove articles: `the`, `a`, `an`
- Remove quantity nouns: `number of`, `amount of`, `quantity of`, `count`, `total`, `units`, `hectares`, `acres`, `production`, `trips`
- Remove verb phrases: `invested in`, `grown`, `made by`, `produced by`
- Collapse whitespace

| Input | Normalized |
|---|---|
| `"number of pears"` | `"pears"` |
| `"total units produced"` | `""` → falls through |
| `"hectares of corn"` | `"corn"` |
| `"amount invested in bonds"` | `"bonds"` |

**Example:** `"number of pears"` vs `"pears"`
```
normalize("number of pears") → "pears"
normalize("pears")           → "pears"
"pears" === "pears"  →  true ✓
```

---

## Step 3 — Tokenize (with Stemming)

If normalization still differs, both strings are split into token sets. Each token is:
1. Split on whitespace
2. Filtered — must be length > 1 and not in the stopword list
3. **Stemmed** — common English suffixes are stripped

### Stopword List

```
the, a, an, of, in, by, for, to, at, on, with, from, per,
each, made, produced, grown, invested, trips, trip, amount,
number, quantity, total, count, units, unit, hectares, hectare,
acres, acre, production, manufacturing
```

### Stemming Rules

Applied in priority order:

| Rule | Condition | Example |
|---|---|---|
| `ies → y` | length > 4 | `factories → factory`, `berries → berry` |
| `ves → f` | length > 4 | `halves → half`, `leaves → leaf` |
| `ses/xes/zes → drop s` | — | `buses → bus`, `boxes → box` |
| `s → drop s` | length > 2 | `pears → pear`, `workers → worker` |
| no change | — | `corn`, `farm` |

**Example:** `"pear"` vs `"pears"`
```
tokenize("pear")  → stem("pear")  = "pear"  → { "pear" }
tokenize("pears") → stem("pears") = "pear"  → { "pear" }
```

---

## Step 4 — Jaccard Similarity ≥ 0.5

```ts
intersection / union >= 0.5
```

Measures overlap between token sets. A threshold of 0.5 means at least half the combined vocabulary must be shared.

**Example:** `"color printer"` vs `"color printers"`
```
ta = { "color", "printer" }
tb = { "color", "printer" }   ← "printers" stemmed to "printer"
intersection = 2, union = 2
score = 1.0 ≥ 0.5  →  true ✓
```

**Example:** `"apple farm"` vs `"apple orchard"`
```
ta = { "apple", "farm" }
tb = { "apple", "orchard" }
intersection = 1, union = 3
score = 0.33 < 0.5  →  false, continue to step 5
```

---

## Step 5 — Subset Check (shorter ⊆ longer)

```ts
const [shorter, longer] = ta.size <= tb.size ? [ta, tb] : [tb, ta];
return shorter.size > 0 && [...shorter].every((t) => longer.has(t));
```

Every token in the shorter name must appear in the longer name. This handles cases where the LLM uses an abbreviated name.

**Example:** `"pear"` vs `"pear production in orchard"`
```
normalize removes "production" → "pear in orchard"
tokenize: stop-words remove "in" → { "pear", "orchard" }

ta (shorter) = { "pear" }
tb (longer)  = { "pear", "orchard" }
"pear" ∈ tb  →  true ✓
```

**Example:** `"apple"` vs `"orange"`
```
ta = { "apple" }
tb = { "orange" }
"apple" ∈ { "orange" }  →  false ✗
```

---

## Full Example Traces

### "pears" vs "pear"
| Step | Check | Result |
|---|---|---|
| 1 | `"pears" === "pear"` | fail |
| 2 | `normalize` → both `"pear"` vs `"pear"` — wait, `"pears"` normalizes to `"pears"` | fail |
| 3 | `stem("pears") = "pear"` → `ta = tb = {"pear"}` | — |
| 4 | Jaccard = 1/1 = 1.0 ≥ 0.5 | **match ✓** |

### "number of workers" vs "worker"
| Step | Check | Result |
|---|---|---|
| 1 | not equal | fail |
| 2 | `normalize("number of workers") = "workers"` vs `"worker"` | fail |
| 3 | `stem("workers") = "worker"`, `stem("worker") = "worker"` → both `{"worker"}` | — |
| 4 | Jaccard = 1.0 ≥ 0.5 | **match ✓** |

### "color printers" vs "black and white printer"
| Step | Check | Result |
|---|---|---|
| 1 | not equal | fail |
| 2 | normalize → same strings | fail |
| 3 | `ta = {"color", "printer"}`, `tb = {"black", "white", "printer"}` | — |
| 4 | intersection=1, union=4 → 0.25 < 0.5 | fail |
| 5 | shorter=`{"color","printer"}`, `"color" ∉ tb` | **no match ✗** |

---

## Limitation

The stemmer is a **rule-based suffix stripper**, not a full linguistic stemmer. It does not handle:

- Irregular plurals: `"geese"` ≠ `"goose"`, `"mice"` ≠ `"mouse"`
- Verb forms: `"running"` ≠ `"run"`, `"produced"` ≠ `"produce"`
- Synonyms: `"revenue"` ≠ `"income"`

These cases would require a proper NLP stemmer (e.g. Porter, Snowball) or embedding-based similarity.
