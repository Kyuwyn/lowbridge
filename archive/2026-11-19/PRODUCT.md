# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Incremental-game veterans who know *Arcanum: Theory of Magic* and *Hundred Days*. They play on desktop in a browser tab, checking in between other work. They read dense text, use hover tooltips and plan their routes. Touch is supported (ⓘ pins tooltips) but is not the main case.

## Product Purpose

Lowbridge is a browser cultivation incremental. You start as an ordinary person in a mill village who holds an incomplete jade slip, and you rebuild its missing method along one of two exclusive readings. Success for this slice: the player reaches Foundation in about ten active minutes of play that keeps the activity slot busy, then chooses one of four directions on the ridge, and every choice along the way is readable from the interface alone.

## Positioning

A weak-to-strong cultivation power fantasy built on Arcanum's machine (capped resources, short runways, walls that outside records move). The current slice is chapter one, the "weak" stage. Its small, ordinary scale is the starting point of the climb, not the identity of the game. The tone of the village opening must not be mistaken for the whole product.

## Operating Context

- Played in text: a grid of action buttons grouped by kind across Tasks, Techniques, Home and Character, with a Fight tab once a fight begins.
- Two tempos: instant actions (chores, trades, techniques) and sustained ones that hold one activity slot with a waiting list of 6, which keeps running while the player is away. Small passive wages accrue alongside.
- Unused real time goes into a bank; Accelerate spends it on the current objective. A visit after time away opens with a summary.
- One tab per profile; saves live in IndexedDB with Export/Import.

## Capabilities and Constraints

- TypeScript, Bun, plain DOM, no runtime dependencies (`src/ui.ts`, `src/style.css`, `index.html`).
- The UI holds no game rules and names content ids directly; renaming ids breaks rendering.
- Content is declarative JSON validated by `bun run validate`, which also enforces pacing.
- Scope is the current slice (village to Foundation, plus the ridge chapter). Systems out of scope are evidence for later slices, not reasons to add panels now.
- Binding sources: `design/DESIGN-PLAN-2026-10-18.md`, `docs/architecture/adr-*.md`, then `design/IMPLEMENTATION-PLAN-2026-10-18.md`, then `README.md`.
- No age, lifespan or retry; a failed attempt costs only time and preparation.

## Brand Commitments

- Name: Lowbridge (working title).
- Clean implementation inspired by Arcanum (MIT); never copy upstream or Hundred Days code or text.
- Interface copy states requirements and consequences in plain words (e.g., an exclusive attunement is announced before commitment).

## Evidence on Hand

- Design reference wikis: `research/arcanum-reference/`, `research/hundred-days-reference/` (design rules 1–74; 70–74 cover both games).
- Route measurements: `bun run validate`, whose 27 October figures head `playtest/SIMULATION-REPORT.md`; the report's older sections are history.
- Playtest sheet and UI revision notes in `playtest/`.
- No players, testimonials or press exist yet; do not invent them.

## Product Principles

1. Every button explains itself: its cost, duration, gains, next threshold, or the exact requirement it is missing.
2. Respect the player's time: absence fills the bank, and nothing punishes being away.
3. Growth compounds: later content raises earlier content, so the climb from weak to strong is felt.
4. Choices that close doors say so before the player commits.
5. Stay inside the slice; do not show systems that do not exist yet.

## Accessibility & Inclusion

Keyboard and focus must match hover: everything a hover tooltip reveals is also reachable by focus, and on touch by the ⓘ pin.
