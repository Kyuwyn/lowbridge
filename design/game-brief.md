# Game Brief: Lowbridge (working title)

<!--
One-page brief for the CCGS skills at the `minimal` tier. It summarises; it does
not bind. Binding sources, in order: design/DESIGN-PLAN-2026-10-18.md and
design/decisions/*.md, then design/IMPLEMENTATION-PLAN-2026-10-18.md, then
README.md. Where this page and those disagree, they win.
Drawn from PRODUCT.md, README.md, design/IMPLEMENTATION-PLAN-2026-10-18.md and
design/CHAPTER-2-BASIN-ROAD.md on 2026-10-29.
-->

**One-sentence pitch:** A browser cultivation incremental where an ordinary mill-village worker rebuilds the missing method on an incomplete jade slip and climbs from weak to strong, with every choice readable from the interface alone.

## Core loop
- Spend Vigor on instant chores and hold one sustained activity (practice, Rest, sites, fights, recipes) with a waiting list of 6 that keeps running while away.
- Earnings fill capped resources and short practice runways; repetition thresholds and discoveries open new actions.
- Learn, attune and use methods; each held method carries route keys and raises earlier work's pay (`X.mod.Y`), so growth compounds.
- Meet a breakthrough's bill and signs, cross to the next stage, and find the walls moved again.

## Player goal & fail state — what "working" looks like
- Goal: reach each breakthrough and the next region: Foundation in about ten active minutes (480–780 s on the direct routes), the ridge's waystation 720–1440 s later, then the Second Direction and Reedmarket on the basin road, all enforced by `bun run validate`.
- No fail state: no age, lifespan or retry. A failed attempt or lost fight costs only the time and preparation spent and keeps every discovery, level and attuned method. A session feels complete when the objective it started on stops at its target.

## MVP — what must exist to be the game
- Two tempos (instant and sustained) with one activity slot, a waiting list, auto-filling Rest and offline settlement.
- Capped resources, practice families and repetition thresholds, with derived fields rebuilt from history.
- Learn/attune/use methods, scarce attunement places, exclusive method pairs warned before commitment, and route keys.
- Breakthroughs with bills and signs (Foundation, First Direction, Second Direction) and titles read from what the player carried.
- Optional fights decided by Speed clocks, with an exact win-chance verdict.
- Home furnishings on limited floor, crafting (kit, preparations, draughts) and the hobby place.
- Tooltips that state cost, duration, gains, next threshold or the exact missing requirement; a bank of unused time with Accelerate; IndexedDB saves with Export/Import.

## Out of scope — not building this
- Sects, waystation modules and the Hall, or any panel for a system that does not exist yet.
- Age, lifespan, checkpoints and retry (cut in ADR 0025).
- Any content beyond Reedmarket on the Cloudwell basin's edge.
- Runtime frameworks or dependencies; code or text copied from Arcanum or Hundred Days.
- Save migration: older save versions are refused by name.

## Build order
1. Engine, content grammar and validator: records, tempo, recompute, save format (done).
2. Chapter one: the village to Foundation along the channel or the hollow reading (done).
3. Ridge chapter: four spheres and teachings, the First Direction, crossings, the waystation, the optional bandit fight (done).
4. Chapter two: the basin road to the Second Direction and Reedmarket, with Focus, draughts, the hobby place and two dungeons (done, ADRs 0030–0032).
5. Interface follow-ups: home lists and quick bar, work kinds and knowledge cards (done, ADRs 0033–0034).
6. Next: not yet decided. No design past Reedmarket is approved; choose it in `design/` before writing stories.

---
**Who it's for / what they feel:** Incremental veterans who know *Arcanum* and *Hundred Days*, checking in from a desktop browser tab between other work, who want to feel a slow, planned climb from weak to strong.

**Art & audio direction:** Text-only plain-DOM interface with a stage-tinted accent colour (village, ferry road, Old Ridge, waystation); no audio.

**Reference game:** *Arcanum: Theory of Magic*: its capped resources, short runways and walls that other records move, in a xianxia setting with a single continuing cultivator; no sects or multi-character play.
