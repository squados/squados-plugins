# Gamification

Design a progression/engagement system that reinforces a real target behavior. Three ideas drive every decision:

1. **Behavior-first** — every mechanic exists to reinforce ONE mapped target behavior. A mechanic you can't justify against the Behavior Brief is decoration: cut it.
2. **Concrete balancing** — curves, formulas, and starting numbers, not vibes. An XP system without a curve is a wish.
3. **Ethics Lens** — every mechanic gets an honest White↔Black label with its real trade-off. The skill informs; the user sets the dial. Guide, don't police.

**The unit of work is the LOOP (a system of mechanics feeding each other), not an isolated badge.**

**Announce at start:** "Using gamification to design [system] reinforcing [target behavior]."

## The Process — 3 phases, 1 gate

```
UNDERSTAND ──► Behavior Brief ──► DESIGN (+Ethics Lens) ──► 🚦 user approves? ──► BUILD ──► verify the loop
                                          │ no
                                          ▼
                                    revise blueprint
```

### Phase 1 — UNDERSTAND → Behavior Brief
Read `reference/understand.md` and follow it. Map the product's core loop, the user's real win, the target behavior to reinforce, and the dominant player profile (Hexad). If gamification already exists, audit it (Octalysis-label what's there; separate working mechanics from decoration). Produce a Behavior Brief. Do NOT propose mechanics yet.

### Phase 2 — DESIGN → approval gate 🚦
Read `reference/psychology.md` (the why), `reference/mechanics.md` (the full menu), `reference/balancing.md` (the numbers), `reference/ethics.md` (the lens), then `reference/blueprint.md` (the output format). Select mechanics from the menu — each justified against the target behavior, each labeled by the Ethics Lens, each with starting parameters. Present the blueprint and STOP. Do not touch code until the user explicitly approves.

### Phase 3 — BUILD → verified loop
Implement the approved blueprint following the repo's existing patterns. Wire up the success metrics defined in the blueprint. Verify the LOOP works end to end — earn, progress, level, reward, return — not just that it compiles. Delegate pure visuals (palette, typography, celebration art) to impeccable/frontend-design when it makes sense: gamification owns the system, not the pixels. Commit in atomic units per the repo's conventions.

## Calibration — declare both dials at the top of every blueprint

**Dial 1 — Surface intensity** (how much mechanic fits this product):

| Surface | Examples | Mechanics dose |
|---|---|---|
| **Serious tool** | admin panels, tax/finance, internal dashboards | Progress/completion + celebrated real wins only. Deep mechanics feel absurd here. |
| **Consumer product** | e-commerce, SaaS, content apps | + streaks-lite, badges on real milestones, onboarding-as-level-1 |
| **Engagement app / game** | habit trackers, education, fitness, games | The full menu is on the table — selected by the Behavior Brief, never all at once |

**Dial 2 — White↔Black ethics dial** (how aggressive): default is **White-Hat** (sustainable, trust-building). The user can push toward Black-Hat (urgent, compelling, corrosive) — deliver what they choose with eyes open: label it, state the trade-off once, never silently escalate. See `reference/ethics.md`.

## Red flags — stop and reconsider

| Thought | Reality |
|---|---|
| "XP would be cool here" | No mapped target behavior = decoration. Justify or cut. |
| "One more mechanic won't hurt" | Every mechanic is cognitive + maintenance cost. The burden of proof is on adding. |
| "I'll skip the Ethics Lens, it's obviously fine" | The user must SEE what they chose. Label every mechanic, even pure White-Hat. |
| "A no-forgiveness streak retains better" | True — and it punishes having a life. Conscious dial choice, never a default. |
| "Variable rewards on everything" | The most addictive and most corrosive mechanic. Careful handling, explicit label. |
| "Reward the thing users already love doing" | Overjustification effect: extrinsic rewards can kill existing intrinsic motivation. Gamify what's hard to start, not what's already fun. |
| "Novelty will carry it" | Every extrinsic mechanic decays. No intrinsic transition + endgame plan = dead system in weeks. |
| "One mechanic fits all users" | Hexad profiles respond differently. Leaderboards delight Achievers and repel Free Spirits. |
| "This is a gamification problem" (but it's UX friction) | Clarity problems ≠ progression problems. Hand off → dont-make-me-think. |
| "Skipping the gate, the design is obvious" | The blueprint gate is mandatory. Present, then wait. |

## Sibling skill — dont-make-me-think

`dont-make-me-think` owns UX clarity and friction (make the journey obvious); this skill owns deep engagement mechanics. Two-way handoff: it sends deep-mechanics work here; you send clarity/friction problems there. If it isn't installed on this machine, say so and continue — this skill is fully self-sufficient.
