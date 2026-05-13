// Shared evaluation utilities used by SolverEvaluator and TestHistory

export const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "of",
  "in",
  "by",
  "for",
  "to",
  "at",
  "on",
  "with",
  "from",
  "per",
  "each",
  "made",
  "produced",
  "grown",
  "invested",
  "trips",
  "trip",
  "amount",
  "number",
  "quantity",
  "total",
  "count",
  "units",
  "unit",
  "hectares",
  "hectare",
  "acres",
  "acre",
  "production",
  "manufacturing",
]);

export function normalizeVarName(name: string): string {
  return name
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b(the|a|an)\s+/gi, "")
    .replace(
      /\b(number|amount|quantity|count|total|units?|hectares?|acres?|production|trips?)\s*(of\s+)?/gi,
      "",
    )
    .replace(/\b(invested\s+in(\s+the)?|grown|made\s+by|produced\s+by)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stem(t: string): string {
  if (t.endsWith("ies") && t.length > 4) return t.slice(0, -3) + "y";
  if (t.endsWith("ves") && t.length > 4) return t.slice(0, -3) + "f";
  if (t.endsWith("ses") || t.endsWith("xes") || t.endsWith("zes"))
    return t.slice(0, -2);
  if (t.endsWith("s") && t.length > 2) return t.slice(0, -1);
  return t;
}

export function tokenize(s: string): Set<string> {
  return new Set(
    s
      .split(/\s+/)
      .filter((t) => t.length > 1 && !STOPWORDS.has(t))
      .map(stem),
  );
}

export function varNamesMatch(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a.toLowerCase() === b.toLowerCase()) return true;
  const na = normalizeVarName(a);
  const nb = normalizeVarName(b);
  if (na === nb) return true;
  const ta = tokenize(na);
  const tb = tokenize(nb);
  if (ta.size === 0 || tb.size === 0) return false;
  const intersection = [...ta].filter((t) => tb.has(t)).length;
  const union = new Set([...ta, ...tb]).size;
  if (union > 0 && intersection / union >= 0.5) return true;
  const [shorter, longer] = ta.size <= tb.size ? [ta, tb] : [tb, ta];
  return shorter.size > 0 && [...shorter].every((t) => longer.has(t));
}

export const XY_LIKE = new Set(["xy", "xby"]);

export function limitsMatch(a: unknown, b: unknown): boolean {
  return (
    String(a ?? "")
      .replace(/[$%,]/g, "")
      .trim() ===
    String(b ?? "")
      .replace(/[$%,]/g, "")
      .trim()
  );
}

export function constraintsMatch(
  tc: Record<string, unknown>,
  pc: Record<string, unknown>,
): boolean {
  const tcRatio = tc.type === "ratio";
  const pcRatio = pc.type === "ratio";
  if (tcRatio || pcRatio) {
    if (tc.operator !== pc.operator) return false;
    if (tcRatio && pcRatio) {
      return (
        varNamesMatch(tc.var as string, pc.var as string) &&
        limitsMatch(tc.limit, pc.limit)
      );
    }
    // Truth is ratio, predicted is xby/xy — accept if operator + x_var matches the ratio var
    if (tcRatio && !pcRatio) {
      return (
        varNamesMatch(tc.var as string, (pc.x_var ?? pc.var) as string) &&
        limitsMatch(tc.limit, pc.limit)
      );
    }
    return (
      varNamesMatch(pc.var as string, (tc.x_var ?? tc.var) as string) &&
      limitsMatch(tc.limit, pc.limit)
    );
  }

  const tcXy = XY_LIKE.has(tc.type as string);
  const pcXy = XY_LIKE.has(pc.type as string);
  if (tcXy !== pcXy) return false;
  if (tcXy) {
    return (
      tc.operator === pc.operator &&
      varNamesMatch(tc.x_var as string, pc.x_var as string) &&
      varNamesMatch(tc.y_var as string, pc.y_var as string)
    );
  }

  const typeMatch = tc.type === "linear" || tc.type === pc.type;
  if (!typeMatch) return false;
  return tc.operator === pc.operator && limitsMatch(tc.limit, pc.limit);
}

export interface VarTypeResult {
  correct: number;
  total: number;
  accuracy: number;
  details: Array<{
    name: string;
    predicted: string;
    truth: string;
    match: boolean;
  }>;
}

export function evaluateVarTypes(
  predicted: Record<string, unknown>,
  truth: Record<string, unknown>,
): VarTypeResult {
  const predVars =
    (predicted.var_declarations as Array<{ name: string; type: string }>) ?? [];
  const truthVars =
    (truth.var_declarations as Array<{ name: string; type: string }>) ?? [];
  if (truthVars.length === 0)
    return { correct: 0, total: 0, accuracy: 0, details: [] };

  const details = truthVars.map((tv) => {
    const pv = predVars.find((p) => varNamesMatch(p.name, tv.name));
    const match = pv !== undefined && pv.type === tv.type;
    return {
      name: tv.name,
      predicted: pv?.type ?? "missing",
      truth: tv.type,
      match,
    };
  });

  const correct = details.filter((d) => d.match).length;
  return {
    correct,
    total: truthVars.length,
    accuracy: truthVars.length > 0 ? correct / truthVars.length : 0,
    details,
  };
}

export interface EvalResult {
  tp: number;
  fp: number;
  fn: number;
  matchedConstraints: Record<string, unknown>[];
  mismatchedConstraints: Record<string, unknown>[];
  isObjMatched: boolean;
  varTypeResult?: VarTypeResult;
}

export function evaluateTask(
  predicted: Record<string, unknown>,
  truth: Record<string, unknown>,
): EvalResult {
  let tp = 0;
  let fp = 0;
  let fn = 0;

  const truthConsts =
    (truth.const_declarations as Record<string, unknown>[]) ?? [];
  const predConsts =
    (predicted.const_declarations as Record<string, unknown>[]) ?? [];
  const matchedConstraints: Record<string, unknown>[] = [];
  const mismatchedConstraints: Record<string, unknown>[] = [];

  predConsts.forEach((pc) => {
    const match = truthConsts.find((tc) => constraintsMatch(tc, pc));
    if (match) {
      tp += 1;
      matchedConstraints.push(pc);
    } else {
      fp += 1;
      mismatchedConstraints.push(pc);
    }
  });

  truthConsts.forEach((tc) => {
    const found = predConsts.some((pc) => constraintsMatch(tc, pc));
    if (!found) fn += 1;
  });

  let isObjMatched = false;
  const predDir = (
    predicted.obj_declaration as Record<string, unknown> | undefined
  )?.direction as string | undefined;
  const truthDir = (
    truth.obj_declaration as Record<string, unknown> | undefined
  )?.direction as string | undefined;
  if (predDir && truthDir && predDir.toLowerCase() === truthDir.toLowerCase()) {
    tp += 1;
    isObjMatched = true;
  } else {
    fp += 1;
  }

  const hasTruthVarDecls = Array.isArray(truth.var_declarations as unknown[]);
  const varTypeResult = hasTruthVarDecls
    ? evaluateVarTypes(predicted, truth)
    : undefined;

  return {
    tp,
    fp,
    fn,
    matchedConstraints,
    mismatchedConstraints,
    isObjMatched,
    varTypeResult,
  };
}

export function renderHighlightedJSON(
  predicted: Record<string, unknown>,
  matchData: EvalResult,
) {
  if (!predicted || Object.keys(predicted).length === 0) {
    return <span className="text-gray-500">{"{ }"}</span>;
  }
  const objDecl = predicted.obj_declaration as
    | Record<string, unknown>
    | undefined;
  const objDirection = (objDecl?.direction as string) ?? "missing";
  const objColor = matchData.isObjMatched ? "text-green-400" : "text-red-400";
  const constDecls =
    (predicted.const_declarations as Record<string, unknown>[]) ?? [];
  const varDecls =
    (predicted.var_declarations as Array<{ name: string; type: string }>) ?? [];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-gray-400">{"{"}</span>

      {varDecls.length > 0 && (
        <div className="pl-4">
          <span className="text-blue-300">"var_declarations":</span> [
          {varDecls.map((v, idx) => {
            const detail = matchData.varTypeResult?.details.find((d) =>
              varNamesMatch(d.name, v.name),
            );
            const color = detail
              ? detail.match
                ? "text-green-300"
                : "text-red-300"
              : "text-yellow-300";
            const label = detail
              ? detail.match
                ? "Match ✓"
                : `Mismatch ✗ (truth: ${detail.truth})`
              : "no ground truth";
            return (
              <div
                key={idx}
                className={`my-1 rounded-r border-l-2 p-2 pl-4 ${
                  detail
                    ? detail.match
                      ? "border-green-500/50 bg-green-900/20"
                      : "border-red-500/50 bg-red-900/20"
                    : "border-yellow-500/50 bg-yellow-900/10"
                }`}
              >
                <span className={color}>{JSON.stringify(v, null, 2)}</span>
                <div
                  className={`mt-1 text-[10px] italic ${detail ? (detail.match ? "text-green-500" : "text-red-500") : "text-yellow-600"}`}
                >
                  // {label}
                </div>
              </div>
            );
          })}
          ],
        </div>
      )}

      <div className="pl-4">
        <span className="text-blue-300">"obj_declaration":</span> {"{"}
        <div className="pl-4">
          <span className="text-blue-300">"direction":</span>{" "}
          <span className={objColor}>"{objDirection}"</span>
          <div className="text-[10px] text-gray-500 italic">
            // {matchData.isObjMatched ? "matched ✓" : "mismatched ✗"}
          </div>
        </div>
        <span className="text-gray-400">{"}, "}</span>
      </div>
      <div className="pl-4">
        <span className="text-blue-300">"const_declarations":</span> [
        {constDecls.map((pc, idx) => {
          const isMatch = matchData.matchedConstraints.some((mc) =>
            constraintsMatch(mc, pc),
          );
          return (
            <div
              key={idx}
              className={`my-1 rounded-r border-l-2 p-2 pl-4 ${
                isMatch
                  ? "border-green-500/50 bg-green-900/20"
                  : "border-red-500/50 bg-red-900/20"
              }`}
            >
              <span className={isMatch ? "text-green-300" : "text-red-300"}>
                {JSON.stringify(pc, null, 2)}
              </span>
              <div
                className={`mt-1 text-[10px] italic ${isMatch ? "text-green-500" : "text-red-500"}`}
              >
                // {isMatch ? "Match ✓" : "Mismatch ✗"}
              </div>
            </div>
          );
        })}
        ]
      </div>
      <span className="text-gray-400">{"}"}</span>
    </div>
  );
}
