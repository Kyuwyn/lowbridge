# Systems Index: Lowbridge

> **Status**: Approved
> **Created**: 2026-10-29
> **Last Updated**: 2026-10-29
> **Source Concept**: design/game-brief.md

---

## Overview

Lowbridge is a text-and-DOM cultivation incremental whose systems are already built. The core loop (chores and one sustained activity, capped resources, methods that compound earlier pay, breakthroughs) rests on thirteen systems. Design lives in the ADRs under `docs/architecture/`, not in GDDs, and `CLAUDE.md` names those and the design plans as binding. This index records what exists and how it depends on itself; it does not plan new work.

---

## Systems Enumeration

| # | System Name | Category | Priority | Status | Design Doc | Depends On |
|---|-------------|----------|----------|--------|------------|------------|
| 1 | Content grammar and expressions | Core | MVP | Implemented | ADR 0021 | — |
| 2 | Time, tempo and the activity slot | Core | MVP | Implemented | ADR 0007, 0022, 0027 | Content grammar |
| 3 | Resources, caps and derived-field recompute | Economy | MVP | Implemented | ADR 0009, 0021 | Content grammar |
| 4 | Save and persistence | Persistence | MVP | Implemented | ADR 0025 | Content grammar, Resources |
| 5 | Practice and knowledge | Progression | MVP | Implemented | ADR 0013, 0020, 0034 | Time and tempo, Resources |
| 6 | Techniques and attunement | Progression | MVP | Implemented | ADR 0023, 0024, 0030 | Practice and knowledge |
| 7 | Breakthroughs, directions and titles | Progression | MVP | Implemented | ADR 0012, 0014–0018, 0030, 0031 | Practice and knowledge, Techniques |
| 8 | Fights | Gameplay | MVP | Implemented | ADR 0008, 0026 | Time and tempo, Resources, Techniques |
| 9 | Sites and dungeons | Gameplay | MVP | Implemented | ADR 0032 | Time and tempo, Fights |
| 10 | Home, furnishings and the hobby place | Economy | MVP | Implemented | ADR 0006, 0033 | Time and tempo, Resources |
| 11 | Crafting, preparations and draughts | Economy | MVP | Implemented | ADR 0029 | Resources, Home |
| 12 | Interface | UI | MVP | Implemented | ADR 0011, 0033 | Every gameplay system |
| 13 | Pacing and route validation | Meta | MVP | Implemented | ADR 0019, 0028 | Content grammar, Time and tempo, Breakthroughs |

System 2 covers the waiting list, auto-filling Rest, the bank and Accelerate, locks applied at payment, objective stops and offline settlement. System 6 covers learn/attune/use, exclusive method pairs and route keys.

---

## Categories

| Category | Description | Systems |
|----------|-------------|---------|
| **Core** | What everything else reads | Content grammar, Time and tempo |
| **Progression** | How the player grows | Practice, Techniques, Breakthroughs |
| **Economy** | Resources and what spends them | Resources, Home, Crafting |
| **Gameplay** | Optional challenge | Fights, Sites and dungeons |
| **Persistence** | Save state | Save and persistence |
| **UI** | Player-facing display | Interface |
| **Meta** | Outside the play loop | Pacing and route validation |

---

## Priority Tiers

| Tier | Definition | Target Milestone | Design Urgency |
|------|------------|------------------|----------------|
| **MVP** | Required for the core loop to function | First playable | Design FIRST |
| **Vertical Slice** | One complete, polished area | Demo | Design SECOND |
| **Alpha** | All features present in rough form | Alpha | Design THIRD |
| **Full Vision** | Polish and content-complete features | Release | As needed |

All thirteen systems are MVP, because the brief's MVP list contains every one of them. No system sits in a later tier, and no design past Reedmarket is approved.

---

## Dependency Map

### Foundation Layer (no dependencies)

1. Content grammar and expressions — records, the restricted expression parser and the vocabulary every other system reads.

### Core Layer (depends on foundation)

1. Time, tempo and the activity slot — depends on: Content grammar
2. Resources, caps and derived-field recompute — depends on: Content grammar
3. Save and persistence — depends on: Content grammar, Resources
4. Practice and knowledge — depends on: Time and tempo, Resources

### Feature Layer (depends on core)

1. Techniques and attunement — depends on: Practice and knowledge
2. Breakthroughs, directions and titles — depends on: Practice and knowledge, Techniques
3. Fights — depends on: Time and tempo, Resources, Techniques
4. Sites and dungeons — depends on: Time and tempo, Fights
5. Home, furnishings and the hobby place — depends on: Time and tempo, Resources
6. Crafting, preparations and draughts — depends on: Resources, Home

Several feature systems depend on each other (Techniques→Breakthroughs, Fights→Sites, Home→Crafting), so design within the layer follows those arrows.

### Presentation Layer (depends on features)

1. Interface — depends on: every gameplay system. It holds no game rules and names content ids directly (`home_space`, `jade_slip`, `vigor`).

### Polish Layer (depends on everything)

1. Pacing and route validation — depends on: Content grammar, Time and tempo, Breakthroughs. `bun run validate` plays the real engine to enforce the pacing bands.

Bottlenecks: Content grammar and Resources, which almost every system reads.

---

## Recommended Design Order

Not applicable. Every system is already implemented, and `minimal` expects no GDDs. If a system is redesigned, follow the dependency map and record the change as an ADR.

---

## Circular Dependencies

- **Derived fields ↔ attunement occupancy:** counts of what is held feed back into the derived fields (`max`, `rate`, `open`, `length`, `yield`, `discount`). The engine resolves it by recomputing to a fixed point, at most 8 passes, on every change and load (`src/engine.ts`, `src/types.ts`).

---

## High-Risk Systems

| System | Risk Type | Risk Description | Mitigation |
|--------|-----------|-----------------|------------|
| Resources and recompute | Technical | The fixed-point recompute is a cycle; a content change could stop it settling | Capped at 8 passes; `bun test` and `bun run validate` exercise the real content |
| Time and tempo | Technical | Offline settlement and the waiting list must account for every second without double counting | Time-accounting tests; the validator plays real one-second ticks |
| Save and persistence | Technical | Old versions are refused, not migrated; unknown ids in saved state are refused | Version check by name; derived fields are never saved |
| Interface | Design | It names content ids directly, so renaming one breaks rendering and `validate` will not notice | Smoke test (`bun run smoke`) loads the real build |

---

## Progress Tracker

| Metric | Count |
|--------|-------|
| Total systems identified | 13 |
| Design docs started | 0 (design lives in ADRs) |
| Design docs reviewed | 0 |
| Design docs approved | 0 |
| MVP systems implemented | 13/13 |
| Vertical Slice systems designed | 0/0 |

---

## Next Steps

- [ ] Decide what comes after Reedmarket (step 6 of the brief's build order) and add any new system here
- [ ] Re-run `/map-systems` once that design exists
