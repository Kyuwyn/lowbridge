# Epic: Lowbridge

> **Layer**: n/a (minimal tier)
> **GDD**: design/game-brief.md
> **Architecture Module**: whole game (`src/engine.ts`, `src/data/*.json`, `src/persistence.ts`, `src/ui.ts`)
> **Status**: Ready
> **Stories**: Not yet created — run `/create-stories lowbridge`

## Overview

- Browser cultivation incremental: village to Foundation, the ridge to the waystation, the basin road to the Second Direction and Reedmarket.
- The MVP below is already built (build-order steps 1–5 in the brief), so this epic records that slice rather than planning new work.
- Nothing past Reedmarket is designed. Step 6 of the brief's build order is undecided; stories for new work need that decision first.

## Scope

In the brief's build order:

1. Engine, content grammar and validator: two tempos with one slot and a waiting list, capped resources, practice families, derived fields rebuilt from history, saves in IndexedDB with Export/Import.
2. Chapter one: the village to Foundation along the channel or the hollow reading.
3. Ridge chapter: learn/attune/use methods, exclusive pairs, route keys, the First Direction, optional fights with an exact win-chance verdict.
4. Chapter two: the basin road to the Second Direction and Reedmarket, with Focus, draughts, the hobby place and two dungeons.
5. Interface follow-ups: home furnishings, crafting, tooltips that state requirements, the bank of unused time with Accelerate, home lists and quick bar, work kinds and knowledge cards.

## Definition of Done

- Every story implemented, reviewed and closed with `/story-done`
- Every acceptance criterion of design/game-brief.md verified
- Logic and Integration stories have passing tests in the test root
- Visual/Feel and UI stories have retained screenshots in `production/qa/evidence/`
  (a lead sign-off too for Visual/Feel)
