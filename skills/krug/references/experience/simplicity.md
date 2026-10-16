# Engine 2 — SIMPLICITY (Maeda + Tesler + cognitive load)

North star (Maeda's tenth law): **"Simplicity is about subtracting the obvious and adding the meaningful."** The burden of proof is always on ADDING (Occam) — never on removing. Nothing speculative survives.

## Reduce — Maeda's SHE

- **Shrink** — make each element as small and light as it can be while doing its job.
- **Hide** — move the non-essential behind progressive disclosure (see below). Out of sight = out of working memory.
- **Embody** — what remains visible must feel higher quality; reduction must read as refinement, not amputation.

## Organize — Maeda's SLIP

**Sort, Label, Integrate, Prioritize.** Organization makes many things appear as few: group related items (proximity does the grouping — space, not boxes), label groups in the user's words, merge overlapping items, and rank so the important is unmissable. Target: **≤4 chunks** visible per screen region (working memory limit — Miller revised by Cowan).

## Tesler's Law — WHO absorbs the complexity

Complexity never disappears; it only moves. Every unit of it is paid either by the **product** (smart defaults, inference, automation, remembering context) or by the **user** (forms, options, decisions, manuals). For EVERY field, option, and step ask:

> "Can a smart default, an inference, or an automation remove this decision from the user?"

If yes, the product absorbs it — that is the job. A settings screen is a receipt for complexity the product refused to absorb. A required field the product could infer is a small insult.

## Progressive disclosure (Nielsen)

- Show ONLY the essential and frequent up front; defer the rest behind a clearly labeled control ("Advanced", "More options") with strong information scent.
- The split must match REAL frequency of use, not org-chart logic.
- **Maximum 2 levels.** Needing a third level means the design is wrong — redesign instead of nesting.
- Deferred ≠ hidden treasure hunt: the path to advanced options must be obvious to whoever needs them.

## Cognitive load — the three types

- **Intrinsic** (the task's own difficulty): lower it with defaults, chunking, splitting big choices into steps.
- **Extraneous** (caused by presentation): THE ENEMY — noise, jargon, inconsistency, decoration competing with content. Eliminate ruthlessly; every unit is a design failure.
- **Germane** (builds understanding): keep, in small doses, when it teaches the model the user needs.

Never make the user carry data between screens: **recognition over recall** — show options, keep context visible, prefill, suggest, autocomplete.

## Postel's Law — robust input

Accept input liberally (any date/phone/spacing/case format — parse it), emit output conservatively (clean, consistent, predictable). Rejecting a card number because of spaces is punishing the user for the product's laziness.

## Words

Halve the words, then halve again (Krug's third law lives here too). Microcopy states the user's benefit or the next action — nothing else. If a sentence explains the UI, redesign the UI.
