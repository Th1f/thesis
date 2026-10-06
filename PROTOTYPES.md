# Proof selection and integration record

The user selected **Proof** on 2026-10-06 and authorized its promotion. The former three-way exploration is complete. Contour, Relay, the Proof fixture prototype, sample replay and the comparison picker have been removed. `/prototypes/lp` now redirects to `/`.

## Current routes

| Route | Purpose |
| --- | --- |
| `/` | Real solver workspace: describe and clarify a problem, inspect a confirmed model, then solve and inspect five agent stages. |
| `/evaluation` | Existing NL4Opt, ComplexOR, baseline and database history workflows inside the Proof shell. |
| `/prototypes/lp` | Redirect to the solver workspace. |

Examples only fill the problem text. Conversation and solve output come from the existing chat/solve NDJSON APIs. The workspace preserves actual code revisions, execution attempts and chronological events; output tabs support keyboard navigation. New problem, retry, stop waiting and JSON export operate on the current run. Workspace state remains in tab memory.

The selected visual canon is in `DESIGN.md` and `.impeccable/design.json`; the direction contract is in `.impeccable/lp-prototypes.md`. Proof uses self-hosted Public Sans, cobalt actions, cool paper, navy text and flat white documents. There are no raster assets.

## Verification and limits

- Production build and TypeScript checks passed; four stream/reducer unit tests passed.
- Playwright MCP checks with controlled responses verified stages, revisions, outputs, keyboard behavior, errors, retry, cancellation, export and responsive layouts.
- History checks covered failure, empty, list and detail recovery. Independent review findings were fixed: mobile dataset upload rows now stack; history list/detail errors now have explicit messages and retry. The review verdict was ship for those scored fixes.
- One detector run raised font-size and color documentation advisories against the former prototype canon. The design documentation now records the intentional Proof tokens. No additional detector pass was run.
- Follow-up on 2026-10-06: one real Playwright MCP workflow passed with the user-provided DeepSeek credential and existing Railway runner. The workshop example returned 30 chairs, 5 desks and an optimum of 1550. Production PostgreSQL history subsequently passed create/list/read with nested messages and test-record cleanup; the earlier controlled tests are separate evidence.
- Existing APIs, evaluation capabilities and database models/data remain unchanged. Prisma now uses the standard `@prisma/client` import to avoid the Windows custom-runtime build tracing error.
- Figma was unavailable because the preceding quota had been exhausted; no LP Figma artifact exists.

Live deployment: [Proof workspace](https://proof-web-production-e992.up.railway.app/). Deployed through Railway CLI. Source branch: `codex/lp-design-prototypes`. See README.md for hosting details.
