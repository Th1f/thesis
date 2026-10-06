# Proof — selected LP solver design
Mode: Operate. User selection on 2026-10-06: “okay do the proof design.”
Code-led promotion of the previously reviewed Proof prototype. Contour, Relay, fixture replay and the visual picker have been removed. The preview URL redirects to /.

## Direction contract
THESIS: Expose the passage from words to an inspectable solution.
OWN-WORLD: White documents on a cool paper background, cobalt actions, navy text, Public Sans. Border separation, generous reading space, quiet state changes.
STORY: Describe a problem, clarify and confirm it, inspect its model, then run formulation/review/execution/presentation. Every displayed result comes from an API event. Examples prefill text only.
FIRST VIEWPORT: 240px ordered stage rail; a white document with problem intake on the left and stage output on the right. At 1100px columns stack; at 760px the stage navigation becomes a compact horizontal sequence. Mobile stage selection brings output into view. The primary action stays beside the problem.
SIGNATURE INTERACTION: Move among five agent stages while preserving the problem and conversation. Inspect model, actual Python revisions, execution attempts and chronological events. Keyboard-accessible output tabs; immediate frequent actions, a restrained busy spinner respecting reduced motion.
FINISH: Independent review and canonical DESIGN.md/design.json after promotion. Original Proof prototype screenshots are references for the selected visual language; current desktop/mobile captures are the review evidence.

## Validation and boundaries
Browser integration is verified with controlled NDJSON responses, including clarification, ready, solve, revisions, error, retry and cancellation. Unit tests exercise fragmented UTF-8 streams and malformed events. Live model and Python runner execution require configured services and have not been claimed as verified. No push or deployment requested. Figma MCP quota was exhausted during the preceding design work; no LP Figma artifact exists.

## Detector
One post-promotion detector run reported font-size and color documentation advisories against the old multi-prototype DESIGN.md. These are passed to the reviewer and documenter for the now-authorized Proof system. Do not rerun the detector to manufacture a clean result.
