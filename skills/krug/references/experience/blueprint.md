# Phase 2 — BLUEPRINT (the approval gate)

Rebuild the journey on paper, applying the three engines to every item in the Friction Map. Present it. STOP. No code until the user explicitly approves.

## Structure — 5 mandatory sections

### 1. Calibration
Surface class (serious tool / consumer product / engagement app) + the game-feel dose that follows from it + one line of why. This goes FIRST so every later decision is read against it.

### 2. Journey: before → after
The step list as it exists vs. as rebuilt. For every REMOVED step or decision, state where its complexity went: absorbed by a smart default / inferred / deferred behind disclosure / deleted outright (Tesler accounting — complexity is never hand-waved away, it is relocated on purpose). End with the metric: decision count before → after, steps before → after.

### 3. Per-screen spec
For each screen in the rebuilt flow:
- **Primary action** — the ONE obvious next step (big, close, unmistakable); where secondary actions sit and how they whisper.
- **Visible vs. deferred** — what shows up front, what lives behind "Advanced/More", and why (real frequency of use). Max 2 disclosure levels.
- **The 8 interactive states** — default / hover / focus / active / disabled / loading / error / success. Loading is skeleton-or-optimistic, never a dead click; error states say what happened + how to fix.
- **Empty state** — what it teaches + its one action (level-1 rule).
- **Microcopy** — the actual copy, already halved twice. No happy talk, no instructions.

### 4. Flow mechanics applied
Each mechanic used (progress indicator, peak-end celebration, just-in-time hint, …) + WHICH law justifies it (Zeigarnik, Doherty, peak-end, …) + which of the 8 fundamentals it implements. If the surface is an engagement app and deep mechanics surfaced: mark o modo de gamificação deste pacote handoff here.

### 5. Traceability
Table: Friction Map item → what in this blueprint resolves it (or an explicit "deferred because …"). **Every P0 and P1 must be addressed** — a blueprint that leaves a P0 unresolved is not presentable. P2/P3 may be deferred with one-line justification.

## Gate rules

- Present the blueprint in chat, compact. Offer to write the full version to a file if the journey is large.
- STOP and wait for explicit approval. Do not start Phase 3 on silence or on partial comments.
- If the user requests changes: update the blueprint, re-present only the changed sections, wait again.
- On approval: proceed to Phase 3 (REBUILD), carrying the traceability table as the work list, and re-run the Phase 1 walkthrough on the finished result as the acceptance test.
