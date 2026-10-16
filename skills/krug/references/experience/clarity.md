# Engine 1 — CLARITY (Krug + Nielsen)

The first law of usability: **"Don't make me think."** Every element on a screen either answers the user's question instantly or raises a question mark. Question marks compound into hesitation, hesitation into abandonment. The goal is SELF-EVIDENT — a first-timer *gets it* with zero effort. Self-explanatory (gets it with a little effort) is the fallback, never the target.

## How people actually use interfaces

- **They scan, they don't read.** The user's reality is a billboard at 60 mph. They look for words matching their goal, hit the first plausible match, ignore the rest.
- **They satisfice.** They choose the first *reasonable* option, not the best one. Weighing options is work; guessing is fun and usually works.
- **They muddle through.** They form a rough, often wrong mental model and never correct it as long as it works.

Design for someone who guesses and forges ahead: front-load matching keywords, make the primary action unmissable, make wrong guesses cheap to undo.

## Krug's three laws, operationalized

1. **Don't make me think** → kill every question mark the audit found. For each element ask: "would a first-timer get this without a beat of hesitation?" If not: relabel, make it look like what it does, or delete it. Boring-and-obvious beats clever-and-ambiguous, always.
2. **Clicks are free if they're mindless.** *"It doesn't matter how many times I have to click, as long as each click is a mindless, unambiguous choice."* Optimize **certainty per click**, never click count. Three confident steps beat one confusing mega-screen. The 3-click rule is a myth.
3. **Omit needless words.** *"Get rid of half the words on each page, then get rid of half of what's left."* Kill happy talk (content-free welcome prose). Kill instructions — nobody reads them; redesign the flow until none are needed.

## Billboard design — making screens scannable

1. **Visual hierarchy** — prominence ∝ importance; related things grouped; nesting shows containment. A good hierarchy pre-processes the page for the user.
2. **Clearly defined areas** — the eye decides in one glance which zones matter and which to ignore.
3. **Obvious clickability** — interactive elements look interactive at a glance (shape, color, position). Nothing non-interactive may look like a button.
4. **Eliminate noise** — kill visual clutter and background busyness that competes with content.
5. **Format for scanning** — headings, short lines, lists, highlighted keywords.

## One obvious next action

Every screen has exactly ONE primary action: big, close to where attention already is (Fitts's Law), visually unlike everything else (Von Restorff). Secondary actions exist but whisper. If two actions compete for "what do I do now?", the screen is making the user think.

## Conventions and affordances

- **Jakob's Law:** users spend their time in other products; yours should work like those. Conventions (logo top-left = home, cart icon, underlined links) eliminate thinking for free. Break one only if the replacement is (a) so self-evident there's no learning curve, or (b) worth a small one.
- **Affordances:** buttons look pressable, inputs look typeable. Give interactive elements physical cues; strip button styling from static elements.

## Clarity > consistency

*"If you can make something significantly clearer by making it slightly inconsistent, choose clarity."* Global patterns serve the user; when one makes a specific screen confusing, break it locally.

## The master instinct

When fixing a usability problem, your first move is to REMOVE or CLARIFY — never to add. Added text, added options, added tooltips are usually the problem restated as a bandage. If the fix is an explanation, the design still fails.
