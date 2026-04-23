// Shared evaluation utilities used by SolverEvaluator and TestHistory

export const STOPWORDS = new Set([
  "the","a","an","of","in","by","for","to","at","on","with","from","per",
  "each","made","produced","grown","invested","trips","trip","amount",
  "number","quantity","total","count","units","unit","hectares","hectare",
  "acres","acre","production","manufacturing",
]);

export function normalizeVarName(name: string): string {
  return name
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b(the|a|an)\s+/gi, "")
    .replace(/\b(number|amount|quantity|count|total|units?|hectares?|acres?|production|trips?)\s*(of\s+)?/gi, "")
    .replace(/\b(invested\s+in(\s+the)?|grown|made\s+by|produced\s+by)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(s: string): Set<string> {
  return new Set(s.split(/\s+/).filter((t) => t.length > 1 && !STOPWORDS.has(t)));
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

export const XY_LIKE = new Set(["xy", "xby", "ratio"]);

export function limitsMatch(a: unknown, b: unknown): boolean {
  return String(a ?? "").replace(/[$%,]/g, "").trim() ===
         String(b ?? "").replace(/[$%,]/g, "").trim();
}

export function constraintsMatch(tc: Record<string, unknown>, pc: Record<string, unknown>): boolean {
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
  if (tc.type !== pc.type) return false;
  return tc.operator === pc.operator && limitsMatch(tc.limit, pc.limit);
}

export interface EvalResult {
  tp: number;
  fp: number;
  fn: number;
  matchedConstraints: Record<string, unknown>[];
  mismatchedConstraints: Record<string, unknown>[];
  isObjMatched: boolean;
}

export function evaluateTask(predicted: Record<string, unknown>, truth: Record<string, unknown>): EvalResult {
  let tp = 0;
  let fp = 0;
  let fn = 0;

  const truthConsts = (truth.const_declarations as Record<string, unknown>[]) ?? [];
  const predConsts = (predicted.const_declarations as Record<string, unknown>[]) ?? [];
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
  const predDir = (predicted.obj_declaration as Record<string, unknown> | undefined)?.direction as string | undefined;
  const truthDir = (truth.obj_declaration as Record<string, unknown> | undefined)?.direction as string | undefined;
  if (predDir && truthDir && predDir.toLowerCase() === truthDir.toLowerCase()) {
    tp += 1;
    isObjMatched = true;
  } else {
    fp += 1;
  }

  return { tp, fp, fn, matchedConstraints, mismatchedConstraints, isObjMatched };
}

export function renderHighlightedJSON(predicted: Record<string, unknown>, matchData: EvalResult) {
  if (!predicted || Object.keys(predicted).length === 0) {
    return <span className="text-gray-500">{"{ }"}</span>;
  }
  const objDecl = predicted.obj_declaration as Record<string, unknown> | undefined;
  const objDirection = (objDecl?.direction as string) ?? "missing";
  const objColor = matchData.isObjMatched ? "text-green-400" : "text-red-400";
  const constDecls = (predicted.const_declarations as Record<string, unknown>[]) ?? [];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-gray-400">{"{"}</span>
      <div className="pl-4">
        <span className="text-blue-300">"obj_declaration":</span> {"{"}
        <div className="pl-4">
          <span className="text-blue-300">"direction":</span>{" "}
          <span className={objColor}>"{objDirection}"</span>
          <div className="text-[10px] italic text-gray-500">
            // {matchData.isObjMatched ? "matched ✓" : "mismatched ✗"}
          </div>
        </div>
        <span className="text-gray-400">{"}, "}</span>
      </div>
      <div className="pl-4">
        <span className="text-blue-300">"const_declarations":</span> [
        {constDecls.map((pc, idx) => {
          const isMatch = matchData.matchedConstraints.some((mc) => constraintsMatch(mc, pc));
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
              <div className={`mt-1 text-[10px] italic ${isMatch ? "text-green-500" : "text-red-500"}`}>
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
