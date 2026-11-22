---
name: game-design-router
description: Use when a request asks to audit, critique, diagnose, or improve a game's design rather than build it - players quit, stall, feel cheated, get bored, forget the run, or don't know what to do; a pitch is vague; a design is bloated; a tutorial or first session is weak; a shipped game is to be studied. Start here when unsure which game-design-* audit skill fits.
---

# Game Design Router

Picks the right `game-design-*` audit skill for a design question. Dispatches only; each lens is taught by its own skill.

## Procedure

1. Name the **player symptom** in the prompt: what players do, feel, or remember. Ignore the game's genre and topic.
2. Take the **primary** skill from the table: the row whose symptom matches.
3. Add **one companion** only when the prompt names a second, distinct symptom. Otherwise add none. The chosen set is only skills from the table; a gamedev skill (`level-design`, `platformer`, `game-ui-ux`) joins only when the user also asks to build or change something.
4. Read each chosen `SKILL.md`, say `Using <skill> (+ <companion>) because <symptom>`, then follow it.
5. No row matches (code, engine, art, UI build, balance numbers): say none applies and continue normally. Engine and build work belongs to `router`.

## Table

| Player symptom or question | Skill |
|---|---|
| Quit or won't retry after failing; what failure teaches or costs | `game-design-failure-loop-audit` |
| Feels cheated, RNG blame, "unfair", anger at difficulty | `game-design-fairness-frustration-audit` |
| Challenge vs skill over time, boredom, difficulty cliffs, pacing drift | `game-design-flow-audit` |
| Stalls, churn, waiting, multi-step dependencies, resource overload | `game-design-friction-journey-audit` |
| Don't know what to do next, short sessions, safe stopping points, return triggers | `game-design-goal-density-and-immediacy-audit` |
| Open quests, unfinished tasks: pull to return, or nagging and guilt | `game-design-zeigarnik-effect-audit` |
| First session, tutorial, first 30 seconds, player feels like a victim of chores | `game-design-ftue-hero-journey-audit` |
| Intuitive vs deliberate demand, cognitive overload, snap decisions under pressure | `game-design-thinking-fast-and-slow-audit` |
| What players remember, endings, exits, memorable highs, flat aftertaste | `game-design-peak-end-audit` |
| Mechanics listed but the promised feeling is unclear; vague pitch | `game-design-fantasy-extractor` |
| Bloated, muddy, overbuilt; "what should I cut" | `game-design-one-thing-to-remove` |
| Study another team's shipped game; what to steal | `game-design-craft-critique` |

## Near-duplicates

- Retry willingness after failing: `failure-loop`. Perceived cheating or luck: `fairness-frustration`.
- Skill-to-challenge curve over time: `flow`. Obstacles from waiting, steps, or resources: `friction-journey`.
- Nothing to do, or sessions don't fit: `goal-density`. Unfinished tasks creating tension: `zeigarnik`.
- Tutorial feel and first-time emotion: `ftue-hero-journey`. Mental mode of any system, tutorial or not: `thinking-fast-and-slow`.
- Early-game drop-off needs the audit of the stated symptom first; companion `ftue-hero-journey` only when the prompt says tutorial or first session.

## Red Flags

| Thought | Reality |
|---|---|
| "Three lenses all apply, load them all" | One primary, one companion at most. More lenses bloat output; the family prefers 2 to 5 strong findings. |
| "The game is a platformer, so `platformer` and `level-design` come first" | Route on the symptom. Add gamedev skills only when the user asks to build or tune. |
| "It's about the first session, so FTUE" | Only if the symptom is tutorial or first-time feel. |
