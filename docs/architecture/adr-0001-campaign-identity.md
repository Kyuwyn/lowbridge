ADR 0001: Campaign identity

Status: Accepted. Date: 16 October 2026. Basis: explicit design-interview answers.

The user wants an adventure inspired by Arcanum's core, with a xianxia theme and immortality as the destination. The study identifies discovery, capacity constraints, specialization, infrastructure, and new forms of control as useful reference patterns. The user's priorities select a particular campaign shape from that reference.

| Decision | Accepted direction |
|---|---|
| Core appeal | Discovery/unlocks and consequential character specialization are equal pillars. |
| Protagonist | One continuing cultivator, beginning as an ordinary mortal. |
| Destination | Ascension beyond the mortal world, followed by an epilogue. |
| Campaign length | Several weeks at ordinary play speed with short regular visits; a pacing target to validate, not a measured duration. |
| Progression ladder | Eight major breakthroughs as the working target, including first foundation and final ascension, mixing prepared milestones and selected defining trials. First path commitment occurs before the second, after opportunities to try introductory practices. |
| Everyday structure | One current residence with routines and preparations, expeditions into connected locations, and relocation when opportunities justify it. |
| World structure | A few substantial connected regions, with discoveries and abilities giving earlier places meaningful new uses as travel opens new areas. |
| Main rhythm | Preparation and expedition depend on each other: training enables journeys, and discoveries change cultivation possibilities. |
| Specialization | Begin uncommitted, discover traditions through play, and make consequential commitments that deepen or branch a path. The chosen path defines deepest advancement and signature abilities, while compatible supporting techniques remain learnable elsewhere. |
| Content breadth | Shared world and major milestones, with path-specific opportunities, solutions, and defining trials. |
| Combat's role | One useful and rewarding approach among several; major progression always has a viable noncombat route. Prepare equipment, techniques, and an approach, then resolve the encounter automatically. Ordinary unsuccessful attempts with lifespan remaining cost time and used preparation while retaining advancement and discoveries; see ADR 0008. |
| Ordinary session | Inspect discoveries, make decisions, arrange activities or an expedition, and let configured routines run. |
| Tone | Wonder and earned mastery in a mysterious, sometimes dangerous world; meaningful relationships can contribute to that experience. |
| Sects | Optional membership offers distinctive teaching and opportunities; each of the three paths remains capable of independent ascension. |
| Recurring characters | A small recurring cast develops through shared experiences and consequential choices, opening further stories or leads. |

Consequences: paths need differences that matter to decisions and opportunities. A shared world concentrates authored content while supporting distinct approaches. A finite ending requires a complete route to ascension rather than an indefinitely extended progression ladder. Following one cultivator makes the information and consequences surrounding specialization especially important.

The immediate phase after the first breakthrough deepens local exploration and introduces cultivator contacts while retaining the village as the base. Players experience introductory practices with real uses before commitment. One committed path is active at a time; changing it requires a substantial undertaking of retraining and preparation with clear costs. [ADR 0004](adr-0004-wider-world-and-paths.md) records these directions and the boundary between a committed path and supporting techniques.

The first complete campaign uses three paths: Body Tempering, Intent, and Formation, with final names open. Retraining preserves discoveries, home development, general advancement, and earned lifespan extensions while the new specialization is developed. [ADR 0006](adr-0006-world-and-residence.md) records the connected-region structure and one-current-residence model. Residences combine distinctive cultivation possibilities with room for stronger facilities; reusable investments carry across moves while new site arrangements require work. Exact benefits, improvement limits, and relocation costs remain open.

Not yet decided: exact technique compatibility, retraining costs and treatment of old techniques, specific introductory practices, the amount of narrative branching, realm names and internal structure within the eight-breakthrough target, exact trial placements and detailed trial rules, supporting systems, detailed pacing, ending variants, or post-ending interaction. The opening method and first breakthrough do not commit the protagonist to a path. [ADR 0005](adr-0005-campaign-progression.md) records campaign progression and combat's role; [ADR 0010](adr-0010-sects-and-relationships.md) records sect membership and relationship scope.

The user chose this direction over reincarnation- or lineage-centered progression, and over a campaign ending in deathless residence within the mortal world. Those alternatives are not part of the current foundation.

## Status

Accepted

## Date

2026-10-29. This records the retrofit that added the template sections; the decision itself dates from 16 October 2026, as the status line at the top says.

## Engine Compatibility

| Field | Value |
|-------|-------|
| **Engine** | None — TypeScript 7.0 on Bun 1.4.3, plain DOM |
| **Domain** | Core |
| **Layer** | Foundation |
| **Knowledge Risk** | N/A — no engine, so no `docs/engine-reference/` VERSION.md |
| **References Consulted** | None |
| **Post-Cutoff APIs Used** | None |
| **Verification Required** | None |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | None |
| **Enables** | ADR-0004, ADR-0005, ADR-0006, ADR-0010 |
| **Blocks** | None |
| **Ordering Note** | Later ADRs amend parts of this one without replacing its pillars: ADR-0014 replaces the three named paths with four directions, ADR-0025 cuts lifespan, and ADR-0030 removes the exclusive directions. Read those before relying on the path, lifespan or retraining rows above. |

## GDD Requirements Addressed

Foundational — no GDD requirement. Enables: every system in `design/gdd/systems-index.md`, whose design follows from the campaign identity recorded here.
