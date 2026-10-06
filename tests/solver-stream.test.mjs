import test from "node:test";
import assert from "node:assert/strict";
import {
  readEvents,
  initialPipeline,
  applyEvent,
  problemSchema,
} from "../src/lib/solver-stream.ts";

test("NDJSON handles split UTF-8, CRLF and a final unterminated event", async () => {
  const bytes = new TextEncoder().encode(
    '{"type":"message","text":"café"}\r\n\n{"type":"stage","name":"critic","message":"Checking"}',
  );
  const stream = new ReadableStream({
    start(c) {
      for (const byte of bytes) c.enqueue(Uint8Array.of(byte));
      c.close();
    },
  });
  const events = [];
  await readEvents(new Response(stream), (e) => events.push(e));
  assert.equal(events[0].text, "café");
  assert.equal(events[1].name, "critic");
});
test("bad transport, malformed events and empty streams fail visibly", async () => {
  for (const response of [
    new Response("Bad gateway", { status: 502 }),
    new Response("broken\n"),
    new Response(""),
  ]) {
    await assert.rejects(() => readEvents(response, () => {}));
  }
});
test("retains revisions, failed execution attempts and unapproved reviews", () => {
  let p = initialPipeline();
  for (const e of [
    { type: "code", code: "original", language: "python" },
    {
      type: "critic",
      approved: false,
      iteration: 1,
      feedback: "Wrong sign",
      issues: ["objective"],
    },
    { type: "code_revised", code: "fixed", iteration: 1 },
    { type: "execution", success: false, output: "error" },
    { type: "execution", success: true, output: "solved", retry: true },
    { type: "error", message: "Presentation unavailable" },
  ])
    p = applyEvent(p, e);
  assert.equal(p.code, "fixed");
  assert.equal(p.revisions.length, 1);
  assert.equal(p.reviews[0].approved, false);
  assert.equal(p.executions.length, 2);
  assert.equal(p.error, "Presentation unavailable");
  assert.equal(p.presentation, null);
});
test("a malformed ready model cannot unlock solving", () => {
  assert.equal(
    problemSchema.safeParse({ direction: "maximize", variables: [] }).success,
    false,
  );
});
