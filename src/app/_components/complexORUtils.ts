export interface ComplexORConstraint {
  name?: string;
  expression?: string;
  sense?: string;
  direction?: string;
  rhs?: string | number;
  limit?: string | number;
  description?: string;
}

export interface ComplexORObjective {
  sense?: string;
  direction?: string;
  function?: string;
  expression?: string;
}

export interface ComplexORFormulation {
  n_variables?: number;
  n_constraints?: number;
  variables?: Array<{ name: string; type?: string; description?: string }>;
  parameters?: Array<{ name?: string; value?: unknown; description?: string }>;
  objective?: ComplexORObjective;
  constraints?: ComplexORConstraint[];
}

export interface ComplexOREntry {
  index?: number;
  problem_id?: string;
  description?: string;
  problem_statement?: string;
  document?: string;
  background?: string;
  problem_type?: string;
  objective_type?: string;
  objective?: ComplexORObjective;
  constraints?: ComplexORConstraint[];
  formulation?: ComplexORFormulation;
}

// ─── Format Helpers ───────────────────────────────────────────────────────────

function senseToOperator(
  sense: string,
): "LESS_OR_EQUAL" | "GREATER_OR_EQUAL" | "EQUAL" {
  const s = (sense ?? "").trim().toLowerCase();
  if (s === "<=" || s === "le" || s === "leq" || s === "less_or_equal")
    return "LESS_OR_EQUAL";
  if (s === ">=" || s === "ge" || s === "geq" || s === "greater_or_equal")
    return "GREATER_OR_EQUAL";
  return "EQUAL";
}

function extractObjectiveDirection(entry: ComplexOREntry): string {
  const candidates = [
    entry.objective_type,
    entry.objective?.sense,
    entry.objective?.direction,
    entry.formulation?.objective?.sense,
    entry.formulation?.objective?.direction,
  ];
  for (const c of candidates) {
    if (c) {
      const lower = c.toLowerCase();
      if (lower.includes("max")) return "maximize";
      if (lower.includes("min")) return "minimize";
    }
  }
  return "minimize";
}

function extractConstraints(entry: ComplexOREntry): ComplexORConstraint[] {
  return entry.formulation?.constraints ?? entry.constraints ?? [];
}

function extractDocument(entry: ComplexOREntry): string {
  return entry.description ?? entry.problem_statement ?? entry.document ?? "";
}

export function convertComplexOREntry(
  entry: ComplexOREntry,
): Record<string, unknown> {
  const document = extractDocument(entry);
  const direction = extractObjectiveDirection(entry);
  const rawConstraints = extractConstraints(entry);

  const const_declarations = rawConstraints.map((c) => ({
    type: "linear",
    operator: senseToOperator(c.sense ?? c.direction ?? "<="),
    limit: String(c.rhs ?? c.limit ?? ""),
    expression: c.expression ?? "",
    description: c.description ?? "",
  }));

  return {
    document,
    obj_declaration: { type: "objective", direction },
    const_declarations,
  };
}

// ─── Data Loading ─────────────────────────────────────────────────────────────

export function loadComplexORData(
  text: string,
  filename: string,
): Record<string, Record<string, unknown>> {
  const content: Record<string, Record<string, unknown>> = {};
  try {
    if (filename.endsWith(".jsonl")) {
      text
        .split(/\r?\n/)
        .filter(Boolean)
        .forEach((line, i) => {
          const entry = JSON.parse(line) as ComplexOREntry;
          const key = String(entry.problem_id ?? entry.index ?? i);
          content[key] = convertComplexOREntry(entry);
        });
    } else {
      const parsed = JSON.parse(text) as unknown;
      if (Array.isArray(parsed)) {
        (parsed as ComplexOREntry[]).forEach((entry, i) => {
          const key = String(entry.problem_id ?? entry.index ?? i);
          content[key] = convertComplexOREntry(entry);
        });
      } else if (parsed && typeof parsed === "object") {
        Object.entries(parsed as Record<string, ComplexOREntry>).forEach(
          ([key, entry]) => {
            content[key] = convertComplexOREntry(entry);
          },
        );
      }
    }
  } catch (e) {
    console.error("Failed to parse ComplexOR data:", e);
  }
  return content;
}

// ─── Evaluation ───────────────────────────────────────────────────────────────

export function normalizeComplexORLimit(v: unknown): string {
  return String(v ?? "")
    .replace(/[$%,\s]/g, "")
    .trim();
}

export function complexORConstraintsMatch(
  truth: Record<string, unknown>,
  predicted: Record<string, unknown>,
): boolean {
  const tLimit = normalizeComplexORLimit(truth.limit);
  if (tLimit === "") return false;
  return (
    truth.operator === predicted.operator &&
    tLimit === normalizeComplexORLimit(predicted.limit)
  );
}

export interface ComplexOREvalResult {
  tp: number;
  fp: number;
  fn: number;
  isObjMatched: boolean;
  matchedConstraints: Record<string, unknown>[];
  mismatchedConstraints: Record<string, unknown>[];
}

export function evaluateComplexORTask(
  predicted: Record<string, unknown>,
  truth: Record<string, unknown>,
): ComplexOREvalResult {
  let tp = 0,
    fp = 0,
    fn = 0;
  const truthConsts =
    (truth.const_declarations as Record<string, unknown>[]) ?? [];
  const predConsts =
    (predicted.const_declarations as Record<string, unknown>[]) ?? [];
  const matchedConstraints: Record<string, unknown>[] = [];
  const mismatchedConstraints: Record<string, unknown>[] = [];

  predConsts.forEach((pc) => {
    const match = truthConsts.find((tc) => complexORConstraintsMatch(tc, pc));
    if (match) {
      tp++;
      matchedConstraints.push(pc);
    } else {
      fp++;
      mismatchedConstraints.push(pc);
    }
  });

  truthConsts.forEach((tc) => {
    if (!predConsts.some((pc) => complexORConstraintsMatch(tc, pc))) fn++;
  });

  const predDir = (
    predicted.obj_declaration as Record<string, unknown> | undefined
  )?.direction as string | undefined;
  const truthDir = (
    truth.obj_declaration as Record<string, unknown> | undefined
  )?.direction as string | undefined;
  const isObjMatched = !!(
    predDir &&
    truthDir &&
    predDir.toLowerCase() === truthDir.toLowerCase()
  );
  if (isObjMatched) tp++;
  else fp++;

  return {
    tp,
    fp,
    fn,
    isObjMatched,
    matchedConstraints,
    mismatchedConstraints,
  };
}
