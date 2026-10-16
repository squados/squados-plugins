# Phase 1 — AUDIT: building the Friction Map

Goal: an evidence-backed, prioritized list of every point where the product makes the user think, wait, or lose goodwill. No fixes in this phase — only friction, with proof.

## Setup

1. **Name the journey.** Entry point → the user's win, stated as a Job-to-be-Done: *"When [situation], I want to [motivation], so I can [outcome]."* Every audit finding is measured against this job.
2. **Gather both views.** Read the code of every screen in the flow. If a URL is reachable, drive it live with Playwright, screenshotting each step. Code shows what exists; the browser shows what the user actually meets.

## Method 1 — Cognitive walkthrough (Krug's question marks)

Walk the flow as a first-timer. Log EVERY question mark that pops into your head — each one is a tiny cognitive tax, and taxes compound into abandonment:

- "Where do I start?" / "Where do I click?"
- "Is that clickable?"
- "What does this label mean?" (jargon, clever/cute names)
- "What happens if I click this?" (fear of commitment, no preview of consequence)
- "Where am I?" / "How did I get here?"
- "Did it work?" (action with no visible acknowledgment)
- "Why is it asking me this?" (data the product doesn't need yet)
- "Which of these is the real action?" (competing buttons)

Each question mark = one Friction Map item.

## Method 2 — Trunk test (key screens)

Dropped blindfolded onto this screen, can you instantly answer:

1. What app is this?
2. What screen is this?
3. What can I do here?
4. What is THE next step?
5. Where am I in the journey?
6. How do I go back / escape?

Any hesitation on any question = one friction item.

## Method 3 — Nielsen-10 scoring

Score each heuristic 0–4 (0 = systematically violated, 4 = exemplary). Sum = /40 health score.

| # | Heuristic | What to check in this flow |
|---|---|---|
| 1 | Visibility of system status | Does every action get timely, visible feedback? Loading states? |
| 2 | Match with the real world | User's language, not system jargon; real-world conventions |
| 3 | User control and freedom | Undo/cancel everywhere; clearly marked exits; no roach motels |
| 4 | Consistency and standards | Same word = same thing; platform conventions respected |
| 5 | Error prevention | Constraints and defaults that make the mistake impossible |
| 6 | Recognition over recall | Options shown, not memorized; context stays visible; prefill |
| 7 | Flexibility and efficiency | Accelerators for experts, invisible to novices |
| 8 | Aesthetic and minimalist design | Every element competes with the relevant ones — is it earning its place? |
| 9 | Error recovery | Plain-language errors: what happened + how to fix |
| 10 | Help and documentation | If needed at all: concise, task-focused, in context |

## Method 4 — Cognitive load count

Working memory holds **≤4 items** (Miller revised by Cowan). Per screen:

- Count what the user must simultaneously hold in their head (choices, remembered values, cross-screen data). >4 = friction item.
- Classify **extraneous load** — noise, jargon, inconsistency, decoration competing with content, layout that must be deciphered. Extraneous load is the enemy: every unit of it is a design failure, not a task requirement.
- Flag any place the user must CARRY data between screens (recall) instead of seeing it (recognition).

## Method 5 — Goodwill drains (Krug's reservoir)

Users arrive with a limited reservoir of goodwill. Flag every drain:

- Hiding what the user wants (price, total cost, contact, availability)
- Punishing input format (rejecting spaces in card numbers, strict date formats — Postel violation)
- Asking for data the product doesn't need yet
- Fake empathy ("your call is important to us")
- Clutter/bloat that slows the actual task
- Amateur sloppiness (typos, broken states — erodes trust)

## Method 6 — Decision count on the critical path (Hick's Law)

Count every decision between entry and the first "aha" (the win). For each decision ask: *could a smart default, an inference, or a deferral remove it?* Record the total — the blueprint must beat it.

## Personas — lenses for the walkthrough

Run the walkthrough under each lens where relevant:

- **First-Timer** — knows nothing; every convention violation and jargon term hurts; needs the one obvious action.
- **Power User** — does this 20×/day; counts clicks and keystrokes; needs accelerators that don't burden the novice.
- **Distracted Mobile User** — one thumb, sunlight, interruptions; tests touch targets, resumability, and state preservation.

## Output — the Friction Map

Prioritized list, most severe first:

- **P0** — user abandons or contacts support (blocked, lost, afraid to proceed)
- **P1** — user recovers but loses real time or goodwill
- **P2** — noticeable annoyance; small tax paid on every pass
- **P3** — polish

Each item: **WHERE** (screen/step) · **EVIDENCE** (screenshot or code ref) · **LAW VIOLATED** (which heuristic/law, by name) · **COST** (what the user pays). Include the Nielsen /40 score and the decision count as summary metrics. Then move to Phase 2 — do not fix anything yet.
