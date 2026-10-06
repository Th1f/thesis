import { z } from "zod";

export const problemSchema = z.object({
  direction: z.enum(["maximize", "minimize"]),
  objective_name: z.string(),
  objective_coefficients: z.record(z.number().finite()),
  variables: z
    .array(
      z.object({
        name: z.string().min(1),
        description: z.string(),
        unit: z.string().optional(),
      }),
    )
    .min(1),
  constraints: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      coefficients: z.record(z.number().finite()),
      operator: z.enum(["<=", ">=", "="]),
      rhs: z.number().finite(),
    }),
  ),
  variable_bounds: z.record(
    z.object({
      lower: z.number().finite(),
      upper: z.number().finite().nullable(),
    }),
  ),
});
export type Problem = z.infer<typeof problemSchema>;
export const eventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("message"), text: z.string() }),
  z.object({ type: z.literal("ready"), problem: problemSchema }),
  z.object({
    type: z.literal("stage"),
    name: z.enum(["formulation", "critic", "execution", "presentation"]),
    message: z.string(),
  }),
  z.object({
    type: z.literal("code"),
    code: z.string(),
    language: z.string().optional(),
  }),
  z.object({
    type: z.literal("code_revised"),
    code: z.string(),
    iteration: z.number(),
  }),
  z.object({ type: z.literal("lp_model"), model: z.unknown() }),
  z.object({
    type: z.literal("critic"),
    iteration: z.number(),
    approved: z.boolean(),
    feedback: z.string(),
    issues: z.array(z.string()),
  }),
  z.object({
    type: z.literal("execution"),
    output: z.string(),
    success: z.boolean(),
    retry: z.boolean().optional(),
  }),
  z.object({ type: z.literal("presentation"), text: z.string() }),
  z.object({ type: z.literal("error"), message: z.string() }),
]);
export type SolverEvent = z.infer<typeof eventSchema>;
export type Message = { role: "user" | "assistant"; content: string };
export type Pipeline = {
  stage: string | null;
  code: string | null;
  model: unknown;
  revisions: Array<{ code: string; iteration: number }>;
  reviews: Array<{
    iteration: number;
    approved: boolean;
    feedback: string;
    issues: string[];
  }>;
  executions: Array<{ output: string; success: boolean; retry?: boolean }>;
  presentation: string | null;
  error: string | null;
  trace: SolverEvent[];
};
export const initialPipeline = (): Pipeline => ({
  stage: null,
  code: null,
  model: null,
  revisions: [],
  reviews: [],
  executions: [],
  presentation: null,
  error: null,
  trace: [],
});
export function applyEvent(p: Pipeline, e: SolverEvent): Pipeline {
  const next = { ...p, trace: [...p.trace, e] };
  switch (e.type) {
    case "stage":
      return { ...next, stage: e.name };
    case "code":
      return { ...next, code: e.code };
    case "code_revised":
      return { ...next, code: e.code, revisions: [...p.revisions, e] };
    case "lp_model":
      return { ...next, model: e.model };
    case "critic":
      return { ...next, reviews: [...p.reviews, e] };
    case "execution":
      return { ...next, executions: [...p.executions, e] };
    case "presentation":
      return { ...next, presentation: e.text };
    case "error":
      return { ...next, error: e.message };
    default:
      return next;
  }
}
/** Decode every event, including a final line without a newline. Never hide stream corruption. */
export async function readEvents(
  response: Response,
  onEvent: (event: SolverEvent) => void,
) {
  if (!response.ok)
    throw new Error(
      `Request failed (${response.status}). Check the service connection and try again.`,
    );
  if (!response.body)
    throw new Error("The service returned no stream. Try again.");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "",
    count = 0;
  const parse = (line: string) => {
    if (!line.trim()) return;
    let event: SolverEvent;
    try {
      event = eventSchema.parse(JSON.parse(line));
    } catch {
      throw new Error(
        "The service returned an unreadable response. Please try again.",
      );
    }
    count++;
    onEvent(event);
  };
  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      let end: number;
      while ((end = buffer.indexOf("\n")) !== -1) {
        parse(buffer.slice(0, end));
        buffer = buffer.slice(end + 1);
      }
      if (done) break;
    }
    parse(buffer);
    if (!count)
      throw new Error(
        "The service returned an empty response. Please try again.",
      );
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
