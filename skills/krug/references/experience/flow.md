# Engine 3 — FLOW & GAME-FEEL (calibrated)

Goal: the journey PULLS the user forward. This is not decoration — it is motivation mechanics grounded in real psychology, dosed by surface. **Calibrate first** (table in SKILL.md), then apply.

## The 8 fundamentals — every surface, always

1. **Clear goal at every moment** — the user always knows what they're trying to do and what's next (Flow condition #1). If a screen can't state its goal in one line, it has no goal.
2. **Immediate feedback** — every action visibly acknowledged in under ~400 ms perceived (Doherty Threshold). If reality is slower: optimistic UI, skeletons, progress. Never a dead click.
3. **Visible progress** — progress bar, checklist, "2 steps left". Started-but-unfinished pulls toward completion (Zeigarnik Effect); motivation rises as the goal nears (Goal-Gradient), so always show proximity to done.
4. **Challenge matched to skill** — complexity scales with demonstrated ability (Flow's channel between boredom and anxiety). Novices get the happy path; power users get accelerators that stay invisible to novices.
5. **Peak-end** — the user remembers the peak and the ending, not the average. Engineer ONE peak of delight and make the success state a real ending: celebrate the win (motion, sound where appropriate, a summary of what was accomplished) — never a bare "Done".
6. **Empty state = level 1** — never a void: what this is + one obvious action (+ sample data when it helps). The first screen is a tutorial level, not a blank page.
7. **Minimum time-to-value** — map open → first "aha" and DELETE every step not on that path. Defer signup/config until after value is shown whenever possible.
8. **Just-in-time teaching** — teach each feature at first contact (contextual hint, dismissible, never blocking). No upfront tutorial carousels; nobody remembers slide 3.

## Motivation vocabulary — for reasoning about WHY a mechanic works

- **Self-Determination Theory:** intrinsic motivation = **autonomy** (real, meaningful choices) + **competence** (feeling progress and mastery — needs calibrated challenge and feedback) + **relatedness** (mattering to others). If a mechanic feeds none of these, it's noise.
- **Octalysis (8 core drives):** Epic Meaning · Accomplishment · Creativity+Feedback · Ownership · Social Influence · Scarcity · Unpredictability · Loss Avoidance. The first group (meaning, accomplishment, creativity) is **White Hat** — empowering, sustainable. The last (scarcity, unpredictability, loss) is **Black Hat** — urgent, compelling, corrosive. Build White Hat; touch Black Hat only deliberately, sparingly, and honestly.
- **Hooked loop** (trigger → easy action → variable reward → investment): understand it to recognize it; deploy it only where the habit genuinely serves the user's own goal.

## The ethical line

Every mechanic must map to a REAL user win. If it works only by exploiting anxiety, FOMO, or loss aversion, cut it. Banned outright: fake scarcity, manufactured urgency, confirm-shaming, guilt copy, roach-motel flows, streaks that punish having a life. The test (Eyal): *does this materially improve the user's experience, and would you happily have it used on you?*

## Handoff — the `gamification` sibling skill

If the surface is an **engagement app** and the blueprint calls for deep mechanics — XP, levels, quests, progression curves, reward economies, streak systems — do NOT design them here. Mark the handoff in the blueprint: *"deep mechanics → `gamification` skill"*. If that skill doesn't exist yet on this machine, tell the user it's pending and keep the blueprint at the fundamentals level.
