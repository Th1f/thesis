# Variable Name Matching in LP Model Evaluation

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
