/**
 * filter_hard_nl4opt.mjs
 *
 * Downloads NL4Opt train.jsonl from the official competition repo,
 * scores each problem by complexity, and writes the top N hardest
 * problems to hard_nl4opt.jsonl in the project root.
 *
 * Run from the project root:
 *   node scripts/filter_hard_nl4opt.mjs
 *
 * Optional: set TOP_N to control output size (default 40)
 */

import { writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const TRAIN_URL =
  "https://raw.githubusercontent.com/nl4opt/nl4opt-competition/main/generation_data/train.jsonl";

const OUTPUT_FILE = join(ROOT, "hard_nl4opt.jsonl");

// How many problems to keep (raise/lower to fit your rate limits)
const TOP_N = 20;

// Constraint types that make a problem harder
const COMPLEX_TYPES = new Set(["xby", "ratio", "xy"]);

/**
 * Assign a hardness score to a problem.
 * Higher = harder.
 */
function hardnessScore(problem) {
  const constraints = Array.isArray(problem.const_declarations)
    ? problem.const_declarations
    : [];
  const vars = Array.isArray(problem.vars) ? problem.vars : [];

  let score = 0;

  // Complex constraint types are the strongest signal
  for (const c of constraints) {
    if (COMPLEX_TYPES.has(c.type)) score += 3;
  }

  // More constraints = harder
  score += constraints.length;

  // More variables beyond 2 = harder
  score += Math.max(0, vars.length - 2) * 2;

  // Linear constraints with many terms are harder
  for (const c of constraints) {
    if (c.type === "linear" && c.terms) {
      score += Object.keys(c.terms).length - 1;
    }
  }

  return score;
}

async function main() {
  console.log("Downloading NL4Opt train.jsonl from GitHub…");

  const res = await fetch(TRAIN_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status} — could not fetch train.jsonl`);

  const text = await res.text();
  const lines = text.split(/\r?\n/).filter(Boolean);

  console.log(`Total problems in train.jsonl: ${lines.length}`);

  // Parse and score every problem
  const scored = [];
  let parseErrors = 0;

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      const key = Object.keys(entry)[0];
      const problem = entry[key];
      const score = hardnessScore(problem);
      scored.push({ line, score, key, problem });
    } catch {
      parseErrors++;
    }
  }

  if (parseErrors > 0) {
    console.warn(`Skipped ${parseErrors} lines that failed to parse.`);
  }

  // Sort descending by hardness, take top N
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, TOP_N);

  // Print a summary of what was selected
  console.log(`\nTop ${TOP_N} hardest problems selected:`);
  console.log("─".repeat(60));
  const typeCounts = {};
  for (const { problem, score } of top) {
    const constraints = problem.const_declarations ?? [];
    for (const c of constraints) {
      typeCounts[c.type] = (typeCounts[c.type] ?? 0) + 1;
    }
    const vars = (problem.vars ?? []).length;
    const types = [...new Set(constraints.map((c) => c.type))].join(", ");
    console.log(
      `  score=${score}  vars=${vars}  constraints=${constraints.length}  types=[${types}]`,
    );
  }
  console.log("─".repeat(60));
  console.log("\nConstraint type distribution across selected problems:");
  for (const [type, count] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type.padEnd(12)} ${count}`);
  }

  // Write output — one JSON object per line, same format as test.jsonl
  const output = top.map((t) => t.line).join("\n") + "\n";
  await writeFile(OUTPUT_FILE, output, "utf-8");

  console.log(`\nSaved ${TOP_N} hard problems → hard_nl4opt.jsonl`);
  console.log("Upload this file in the NL4Opt evaluator tab to test on harder problems.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
