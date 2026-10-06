---
name: LP Model Evaluator — Proof
description: A bright document workbench for inspectable optimisation.
colors:
  proof-bg: "#f6f8fb"
  proof-surface: "#fff"
  proof-ink: "#172b42"
  proof-muted: "#5f6c7b"
  proof-line: "#d9e0e9"
  proof-accent: "#2452cc"
  proof-accent-hover: "#1c43ac"
  proof-soft: "#edf2ff"
  proof-rail: "#fafbfd"
  proof-input: "#fcfdff"
  proof-assumptions: "#fafcff"
  proof-error-bg: "#fff3ed"
  proof-error-ink: "#903d1b"
  evaluation-success: "#216445"
  evaluation-warning: "#815e12"
  evaluation-error: "#a83232"
typography:
  body:
    fontFamily: "Public Sans Variable, sans-serif"
    fontSize: "14px"
    lineHeight: 1.6
  display:
    fontFamily: "Public Sans Variable, sans-serif"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: 1.14
    letterSpacing: "-0.035em"
  display-mobile:
    fontFamily: "Public Sans Variable, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.14
    letterSpacing: "-0.035em"
  section:
    fontFamily: "Public Sans Variable, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.025em"
  stage-heading:
    fontFamily: "Public Sans Variable, sans-serif"
    fontSize: "21px"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Public Sans Variable, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.6
  document-title:
    fontFamily: "Public Sans Variable, sans-serif"
    fontSize: "15px"
    fontWeight: 600
  empty-title:
    fontFamily: "Public Sans Variable, sans-serif"
    fontSize: "17px"
    fontWeight: 600
  conversation:
    fontFamily: "Public Sans Variable, sans-serif"
    fontSize: "13px"
    lineHeight: 1.6
  label:
    fontFamily: "Public Sans Variable, sans-serif"
    fontSize: "12px"
    lineHeight: 1.6
  annotation:
    fontFamily: "Public Sans Variable, sans-serif"
    fontSize: "11px"
    lineHeight: 1.6
  brand:
    fontFamily: "Public Sans Variable, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.4
  brand-sub-mobile:
    fontFamily: "Public Sans Variable, sans-serif"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.4
  monogram:
    fontFamily: "Public Sans Variable, sans-serif"
    fontSize: "36px"
    fontWeight: 750
    lineHeight: 1
    letterSpacing: "-0.04em"
  objective:
    fontFamily: "Public Sans Variable, sans-serif"
    fontSize: "28px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.03em"
  objective-mobile:
    fontFamily: "Public Sans Variable, sans-serif"
    fontSize: "25px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.03em"
  input:
    fontFamily: "Public Sans Variable, sans-serif"
    fontSize: "14px"
    lineHeight: 1.8
  input-mobile:
    fontFamily: "Public Sans Variable, sans-serif"
    fontSize: "16px"
    lineHeight: 1.8
  code:
    fontFamily: "ui-monospace, monospace"
    fontSize: "12px"
    lineHeight: 1.85
  equation:
    fontFamily: "ui-monospace, monospace"
    fontSize: "14px"
rounded:
  control: "8px"
  document: "12px"
spacing:
  compact: "8px"
  control-gap: "10px"
  label: "12px"
  row: "16px"
  inset: "20px"
  section: "24px"
  panel: "28px"
  rail: "32px"
  workspace: "36px"
  main: "40px"
components:
  button-primary:
    backgroundColor: "{colors.proof-accent}"
    textColor: "{colors.proof-surface}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
  button-primary-hover:
    backgroundColor: "{colors.proof-accent-hover}"
    textColor: "{colors.proof-surface}"
  button-text:
    textColor: "{colors.proof-ink}"
    typography: "{typography.label}"
    padding: "9px 0"
  input-problem:
    backgroundColor: "{colors.proof-input}"
    textColor: "{colors.proof-ink}"
    typography: "{typography.input}"
    rounded: "{rounded.control}"
    padding: "14px"
  stage-active:
    backgroundColor: "{colors.proof-soft}"
    textColor: "{colors.proof-accent}"
    rounded: "{rounded.control}"
    padding: "16px 12px"
  document:
    backgroundColor: "{colors.proof-surface}"
    textColor: "{colors.proof-ink}"
    rounded: "{rounded.document}"
  error:
    backgroundColor: "{colors.proof-error-bg}"
    textColor: "{colors.proof-error-ink}"
    rounded: "{rounded.control}"
    padding: "16px"
---

# Design System: LP Model Evaluator — Proof

## Overview

**Creative North Star: "Proof — mathematical proof workbench"**

Proof is the user-selected production identity, confirmed on 2026-10-06. A white document on cool paper keeps the problem and its evidence legible. Cobalt actions and ordered stage navigation guide attention; navy text, fine dividers and generous reading space keep the interface quiet.

The visual canon applies to the solver at `/` and the shared shell at `/evaluation`. Existing evaluator interiors retain their functional controls and semantic status treatments within that shell. The source of truth is `src/styles/proof.css`, with composition in `src/app/_components/proof` and `src/app/evaluation/page.tsx`. The former comparison directions and fixture interface have been removed.

**Key Characteristics:**

- White documents on cool paper with cobalt actions and navy text.
- A persistent, ordered sequence of five inspectable agent stages.
- Readable mathematical models, code revisions and chronological evidence.
- Flat surfaces, restrained corners and immediate state changes.
- Public Sans typography without raster decoration.

## Colors

Cobalt supplies the primary accent; cool paper, white and navy carry the reading experience. Frontmatter records the actual implemented colors, including subtle surface distinctions and semantic evaluation text.

### Primary

- **Cobalt action** and its deeper hover tone mark primary actions, focus, active navigation and agent attribution.
- **Soft cobalt surface** supports selected stages, code blocks and explanatory panels.

### Neutral

- **Cool paper** is the page canvas; **white document** is the main reading surface.
- **Navy ink** carries primary text; **muted slate** carries supporting descriptions, labels and timestamps.
- **Fine divider** separates sections without adding depth.
- **Rail paper**, **input paper** and **assumptions paper** preserve the implemented subtle distinctions between wayfinding, editing and supporting context.

### Semantic status

Warm error paper and error ink identify solver request failures. Evaluation success, warning and error text retain green, ochre and red respectively. Existing evaluator action fills remain part of the retained evaluation controls; these are not additional brand accents.

**The Evidence Color Rule.** Use status color with explicit text or an icon; a completed execution is not visual proof of an optimal solution.

## Typography

Public Sans Variable is self-hosted through the installed font package. System monospace is reserved for code and constraint expressions. The frontmatter records the intentional implemented hierarchy rather than imposing a uniform ratio.

Page titles use the display roles; section headings and stage headings have separate scales. Document names, empty-state headings and mathematical objectives each have a distinct role. Body and conversation text remain comfortable to scan; labels and annotations are intentionally smaller. The tiny mobile brand subtitle is identity metadata, not a model result or action label.

At the mobile breakpoint, page titles use the mobile display role, the monogram becomes the desktop display size, the brand name uses the conversation size, and objective expressions use their mobile role. Textareas use the mobile input role to preserve comfortable phone editing. Stage names become annotation-sized in the compact navigation. Objective values and stage numbers use tabular numerals.

Code preserves whitespace and wraps long content. Prose, variable definitions and equations wrap within their panels. Empty-state copy is limited to 38ch; no universal body measure is imposed.

## Layout

The solver uses a 240px stage rail and fluid main area within a centered 1800px container. A white document pairs problem intake and stage output in minmax(260px, 0.85fr) / minmax(0, 1.15fr) columns. The desktop header has an 88px minimum height. Main padding is 40px vertically and 36px horizontally; document panels use 28px insets.

At 1100px and below, the rail narrows to 190px, document columns stack and main insets reduce. At 760px and below, the shell becomes a single column, the stage sequence becomes horizontal, headings and footer wrap, and panels use 24px vertical / 20px horizontal padding. Stage selection scrolls the output into view in the stacked layout. Help remains available through a disclosure.

At 370px and below, outer horizontal padding drops to 12px. At 1600px and above, main horizontal padding grows to 56px. Evaluation has a centered 1360px main region and wrapping tool navigation. Dataset upload rows stack on small screens so labels and controls remain reachable.

## Elevation & Depth

Surfaces are flat. Tone and single-pixel borders establish structure; the Proof shell does not use a shadow scale or backdrop blur. The retained evaluation wrappers have their inherited shadows and blur removed. The deleted comparison picker does not supply production elevation tokens.

## Shapes

Controls, selected stages, code blocks and error panels use the control radius. The main document uses the larger document radius and clips its contents. Fine straight dividers structure the document. Avoid inventing pill badges or decorative containers from the deleted prototype tooling.

## Components

### Actions and fields

Primary actions use cobalt, white text, a minimum 44px height and semibold labels. Hover deepens the fill; press scales to 0.98 with a 160ms ease-out transform transition. Text actions use navy and underline on hover. Disabled buttons use half opacity and a disabled cursor. Keyboard focus uses a 3px cobalt outline with 4px offset.

The problem field is a labelled native textarea on input paper; examples use a labelled native select. The textarea is vertically resizable, with a 310px desktop minimum, 160px stacked minimum, and 235px phone minimum. The reply field has a smaller desktop minimum. Enter submits; Shift+Enter adds a newline.

### Navigation and document

The header names Workspace and Evaluation and underlines the current route. The ordered stage buttons preserve Understand, Formulate, Review, Execute and Explain. The active stage has a soft cobalt background and cobalt text. Available output and current activity use explicit icons.

A flat document pairs intake with stage output. The document title and supporting type are separated from the body by a divider. Assumptions occupy a lightly tinted footer row.

### Evidence and recovery

Overview, Python and Agent trace are accessible tabs with linked panels and arrow-key, Home and End navigation. Code revisions and generated model details use disclosures; execution attempts and review feedback remain inspectable. Empty states describe the missing output and the next action.

Solver errors appear in a local alert with recovery beside the input. History list and detail failures expose explicit error text and retry controls; an empty history is a separate state. Busy actions show a restrained 900ms linear spinner. Reduced-motion preferences disable animation and transitions.

## Do's and Don'ts

### Do:

- Do extend the selected Proof palette, Public Sans hierarchy and flat document structure.
- Do retain visible focus, labelled inputs, accessible output tabs and reachable mobile controls.
- Do use real stage evidence, explicit empty states and local error recovery.
- Do keep evaluation, baseline and history workflows accessible in the shared shell.

### Don't:

- Don't reintroduce the comparison picker, fixture replay, Contour or Relay as production patterns.
- Don't treat execution completion or critic approval as a guarantee of an optimal result.
- Don't replace inspectable outputs with decorative graphs or raster imagery.
- Don't describe controlled browser responses as live model or Python runner validation.
