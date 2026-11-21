# Systems Index: The Furnace Road (working title)

> **Status**: Approved
> **Created**: 2026-11-19
> **Last Updated**: 2026-11-20
> **Source Concept**: design/gdd/game-concept.md

Rule numbers ("rule 23") refer to `research/arcanum-reference/12-design-rules.md` (1–38, 70–74),
`research/hundred-days-reference/06-design-rules.md` (39–69) and
`research/magic-research-2-reference/08-design-rules.md` (75–100). Pillar numbers refer to the
concept's four pillars. Written by `/map-systems` at `docs.density: thorough`, `review_mode: full`,
`automation: guided`.

---

## Overview

The Furnace Road is a semi-active incremental with one activity slot. Its core loop
(gather, refine, fight a floor, forge) rests on twenty systems. Fifteen of them are MVP, and they
deliver one realm that ends in one forge of four of six ingredients, under one of two committed
methods, scored 0–6 seals by three proving fights. The decomposition follows the anti-pillar
"no sprawl of systems". Ingredients, doors and seals belong to the Forge rather than standing
alone. Away time belongs to the activity slot, because the same `advance(state, dt)` serves both.
The fast new game belongs to Save. Onboarding belongs to the interface shell. Every MVP system
gets its own design document: GDDs for systems 1–12, UX specs (`/ux-design`) for 13–15. The
designer chose this on 2026-11-19 over making 1, 2, 11 and 12 architecture-owned. Narrative is
flavour carried by content records (rule 70), not a system. Audio has no system until the art
bible asks for one. The third method, extra realms and dungeons are content, not systems.

The MVP documents are written in two waves with a build between them (PR-SCOPE, 2026-11-19).
**Wave A** covers the machinery, the forge, the methods and the two forge-facing interface
specs (systems 1–7, 14, 15). It ends at a **forge-and-methods checkpoint**: a playable build with
both methods played in one session. That is the first play evidence for pillar 2. The
checkpoint's sources are stubbed in behaviour (a timed button), but they are real source records
that the Methods patch surface opens or leaves shut (`methods.md` W3). So the build tests "which routes
work", not just what ingredients contribute. The checkpoint's forge screen carries the goal line
and the first-screen instruction, so the prototype's lost first run is not repeated (CD-SYSTEMS). **Wave B** covers the routes, tending, save, validator and shell (systems 8–13). At
the designer's stated 12 hours a week, the 15 MVP documents take 46–56 sessions, about 8–9.5
weeks. The designer extended pre-production from 4 weeks to about 9 to fit them (2026-11-19).
Wave A takes about 4.5–5.5 weeks of design before the checkpoint build.

### Per-system rationale

**1. Content records and schema (inferred).** Every other system is a set of records: ingredients,
methods, sources, recipes, fights, doors. The concept requires plain-data content files and a
validator. Both need one record vocabulary with closed field lists (rules 1, 58), and gates that
reveal before they enable (rule 2). The concept narrows rules 3 and 4 for the MVP: gates use a
small closed set of forms, not free expressions. This GDD fixes those forms. Without it the
validator has nothing to check (rules 51, 52, 57), and Hundred Days shows what content rot costs.
The schema also owns the **field registry**: each owning GDD declares its fields with
`modifiableBy` (method, Foundation, tending) and a `sealInput` tag. It also owns the ingredient
and door record types, so routes and methods reference ids rather than the Forge (TD-SYSTEM-BOUNDARY).
The validator's schema checks are built alongside this system, not in Polish order.

**2. Modifier pipeline and recompute (inferred, from TD-FEASIBILITY).** Pillar 2 needs a method to
change what ingredients contribute and what sources pay. Pillar 1 needs a Foundation to set caps
and affinities. Pillar 4 needs tending to stay off every seal input. All three are modifiers. The
concept fixes three sources in one order (method → Foundation → tending), each with a closed
list of target fields, and no modifier of a modifier, so recompute is one ordered pass. This
narrows rule 96, and the per-field order of operations is decided by ADR. It is the main
bottleneck: methods, the Foundation, tending, method marks, breakdowns (rule 97) and the
validator's tending/seal check all go through it. The archived attempt's fixed-point
recompute is the failure this one-pass rule exists to avoid. The method stage is a pure
`applyMethod(content, method)`, and the validator checks that function's output rather than a
second implementation of it. The Foundation and tending stages run on derived values. Every
output carries its base value, each stage's change and its final value, so breakdowns read
provenance and never recompute. Foundation stats are **fixed at forge time** (designer,
provisional, 2026-11-19): the Foundation stage reads a forged snapshot, not the live method
output, and the save stores that snapshot.

**3. Resources and caps.** About eight resources, each starting small and capped, with bills sized
to most of a cap (rule 18) and the first cap hit within a minute (rule 17). Caps are what the
Foundation's makeup sets, so the forge's effect on the next realm is defined here. Caps limit
the resources activities consume and produce, never which ingredients are held. The concept
states this, so no makeup is ruled out by storage. The GDD names the resources and their caps.
The affinities are named by Forge and proving (#6) instead (designer, 2026-11-20; #1 amendment
A3).

**4. Activity slot, rest and away time.** One slot for the whole game (anti-pillar; diverges from
rule 24). An activity runs until it cannot continue (an input runs out, its output is at cap) or
until the away-time cap, counted from the last input. Then rest fills the slot (rule 23). Live
and away time use one deterministic `advance(state, dt)`, with backwards clocks clamped. That
diverges from rules 25 and 91, as stated in the concept. The away-time cap value is an
architecture question. This system defines one generic activity record (inputs, outputs and
duration per unit, plus an optional resolver call) and one generic stop rule. Routes author
records in that shape, so this Core system never learns about routes. `advance` settles whole
units in batches, and its GDD requires the tests `advance(s, a+b) == advance(advance(s, a), b)`
and backwards-clock clamping.

**5. Combat resolver (inferred: "on the same resolver").** One deterministic auto-resolved fight
(rule 83), used by single-fight sources, by the three dungeon floors and by the three proving
fights. A loss costs time only (rule 27). The resolver is a pure function over explicit
combatant records, with no access to state and no dependency on the modifier pipeline. The Forge
assembles proving inputs (the Foundation and the method only, with no carried items), and the
routes assemble route-fight inputs. Proving inputs are the only seal inputs. Open question for this GDD: what stats the player brings to route fights
before any Foundation exists.

**6. Forge and proving.** The heart of pillars 1 and 3 and the hook. A Foundation is exactly
four distinct ingredients of six (rules 12, 49). The concept diverges from rule 12: no bill and
no lock. The GDD owns the ingredient records, the affinity records and their names, the Foundation stats, the interactions that make a
makeup a trade-off (affinity clashes, caps), the three doors and their door tests, the 0–6 seal
measure, and the preview rule: seals show only for makeups whose every ingredient is in hand.
It must show how "no makeup is co-optimal under both methods" holds from interactions alone,
with no budget (gate concerns 2 and 3). The forge prototype's balance table predates the current
rules and is regenerated before this GDD starts. The GDD writes its API section first:
`foundationStats(makeup, method)`, `doorTier`, `seals`, `previewable(makeup, held)`. Foundation
stats are provisionally fixed at forge time, and this GDD may revisit that. It records its
answer on stacking, which carries save and recompute consequences (gate concern 9).
Three further instructions come from CD-SYSTEMS on 2026-11-19:

- **Name the pressure before tuning.** Before any tuning, the GDD names the pressure that
  replaces the prototype's day budget, so that "gather all six, then read the previews" is not
  the dominant play. Two candidates: holding all six costs more slot time than any four (a cost,
  not a lock), or previews show door stats but not proving-fight outcomes. The pressure must
  never strand a run (pillar 4).
- **Theme fit.** Its acceptance criteria include that each method's best makeup makes sense for
  that method's theme (CD-PLAYTEST concern 3).
- **Post-forge section.** It has a post-forge section, because the MVP has no realm after.
  Forging switches the current realm's caps and affinities to the Foundation's values, play
  continues under them, and the locked source behind the doors becomes visible. This gives
  pillar 1's "every ingredient changes caps or affinities" a payoff the player feels, and it
  delivers the concept's "Foundation you can point at" and "one visible locked source" hooks.

**7. Methods.** Pillar 2. Two methods, visible side by side from the first screen. Each changes
what each ingredient contributes at the forge and which routes work. In the MVP it neither
re-prices nor removes a route: it feeds, quenches or opens (`methods.md` W3). The method is chosen freely until an explicit commit ("Begin circulating
[method]") that names what it closes and how to redo it (rule 54). Gathering starts only after
the commit. Identity lives where the numbers live (rule 71). Late content patches earlier
content (rule 4), narrowed to a closed patch surface. This GDD owns that patch surface. Pillar 2
has no play evidence yet, since the second method has never been played (CD-PLAYTEST concern 1).
The patch surface targets source records, whose type the Schema owns. That lets the Wave A
checkpoint exercise route changes before the route GDDs exist.

**8. Crafting route.** The fightless floor of pillar 4: gather raw inputs, refine them, craft at
one station. A method may re-price a recipe but never remove one. Every ingredient's
fightless source lives here or in a fightless input chain to it. Crafted items can open the next
source (the short-term loop).

**9. Fight and dungeon routes.** Single-fight sources and one dungeon of three chained floors,
on the resolver from system 5. Leaving keeps progress (rule 27). Methods add and remove these
routes, and these routes pay a premium over crafting. A method that removes an ingredient's
fight or dungeon route gives that ingredient another source, so it keeps two (pillar 4).

**10. Tending.** An optional, discrete choice on the running activity, with no repeated, held or
timed input. It raises speed and yield up to stated ceilings, gives something up, and never
lapses because the player leaves (pillar 4). It never touches a field a seal is computed from.
The field registry enforces this (no `sealInput` field is `modifiableBy: tending`), and the
enumeration confirms it. It comes last among the gameplay GDDs so that
its ceilings are set against real routes. It is **first in the MVP cut order**, because no pillar
asks for it and pillar 4 only limits it (CD-SYSTEMS, adopted 2026-11-19). Its GDD must state the
player experience it delivers. If the checkpoint shows the 30-second loop holds without
tending, tending moves to the Vertical Slice. The creative director had asked for it early; the
designer chose last on 2026-11-19. It is the least-tested part of the 30-second loop.

**11. Save and run lifecycle.** A save of non-derived state only, versioned from the first
build (rule 9). It settles away time on load through system 4's `advance`, and it provides a
fast new game so the other method can be tried. The fast new game is a test affordance, not a
reset loop (anti-pillar). It depends on every state owner, so it follows them. Each gameplay
GDD declares the non-derived state it owns. Save composes those declared slices and owns only
versioning, migration and the fast new game. How the slices compose is an ADR. The designer
still has to decide whether saves may be wiped before the first public build.

**12. Content validator and balance enumeration.** MVP required item 5. It runs schema
checks, then the pillar 4 static checks on patched data: two sources per ingredient under each
method, one with no fight in its input chain, and every ingredient changes at least one seal
under at least one method. It then checks reachability from each method's commit state, since
obtainability is monotone after the commit. It generates the 30-case makeup-and-method balance
table, and proves seals tended equal seals untended by enumeration. No simulation bot (rules 51,
52, 59).

**13. Interface shell and goal line (inferred).** Persistent context: resources against caps, the
running activity, the log and the method never leave the screen (rule 32). One goal line from
the first screen shows the empty forge slots, the three doors and their seals (rule 99), plus
the three lines of first-screen instruction the prototype lacked (CD-PLAYTEST concern 5). One
event channel (rules 68, 99). The rules core emits typed events with no DOM, and the shell
subscribes to them and owns only their display. The shell takes over the goal line and the
first-screen instruction from the forge screen (system 15), which carries them for the Wave A
checkpoint. It shows the forged Foundation after the forge. One tooltip schema, opened by tap, with no hover-only interaction
(rule 33; MVP required item 8). The phone layout is a constraint here from the start.

**14. Method marks and number breakdowns.** The Visual Identity Anchor ("what the method touches,
the method marks"): every value a method changes carries the tint and the method's glyph. It
must read in greyscale, and a screenshot must identify the method without its name. This system
owns two art-director gaps: how a mark shows the direction of a change, and how a removed route
is shown. Every number opens a breakdown of base and modifiers by source (rule 97), read
directly from system 2.

**15. Forge screen (inferred).** The screen the prototype was: plan with unheld ingredients, see
what each held ingredient contributes under the method, see seals once a makeup is in hand. In Wave A it also carries the goal line and the three lines of
first-screen instruction until the shell (system 13) exists. It owns the headroom signal (how
the player sees that a better Foundation exists, CD-PLAYTEST concern 2). In the MVP that signal
comes before the forge commit, since there is no reforge to act on it afterwards. It also owns the accent before the method commit and the forge's visual event. These two are
art-director gaps; the second is a known limit of the Circulating Tint.

**16. Reforge and post-commit method switch (Vertical Slice).** Pillar 4's "any forge can be
redone for a stated price, and a reforge never drops a realm". The concept designs the price of
switching method after the commit together with reforge. Its cost and unit are open questions
due before the vertical slice.

**17. Phone layout (Vertical Slice).** Reflow at about 390 px with a drawer, bottom tabs and tap
tooltips (rules 67, 98). It is a constraint on system 13 from the MVP and a deliverable at the
vertical slice.

**18. Accessibility and settings (Vertical Slice, inferred).** The accessibility tier is an open
question. The MVP already meets the floor: no hover-only interaction, no repeated or held input,
glyph before hue.

**19. Realm ladder (Alpha).** More realms, each forged from more ingredients across more routes.
The doors become real unlocks of the next realm. This system settles the open questions on
stacking and later-realm caps.

**20. In-game codex (Full Vision).** Generated per-record entries with reverse links (rules 36,
60), unlocked by play.

### Relationship analysis

There are three couplings, each held by a contract rather than by design order. The Forge owns
the door tests (which stats each door reads, and the tier thresholds), and the combat resolver
must produce exactly that function. Methods owns the patch surface, routes author base values,
and the per-method values live in content and the balance table. The Forge tunes against the
prototype's two methods as placeholders until the Methods GDD replaces them. Two constraints run
one way only. Tending may not target a seal input, enforced by the schema and checked by
enumeration. Caps never limit which ingredients are held. The validator reads every
gameplay system but is read by none. The three interface systems read gameplay state and own no
rules.

---

## Systems Enumeration

| # | System Name | Category | Priority | Status | Design Doc | Depends On |
|---|-------------|----------|----------|--------|------------|------------|
| 1 | Content records and schema (inferred) | Core | MVP | Approved | design/gdd/content-records-and-schema.md | — |
| 2 | Modifier pipeline and recompute (inferred) | Core | MVP | Approved | design/gdd/modifier-pipeline-and-recompute.md | Content records and schema |
| 3 | Resources and caps | Economy | MVP | Approved | design/gdd/resources-and-caps.md | Content records and schema, Modifier pipeline |
| 4 | Activity slot, rest and away time | Core | MVP | Approved | design/gdd/activity-slot-rest-and-away-time.md | Content records and schema, Modifier pipeline, Resources and caps, Combat resolver |
| 5 | Combat resolver (inferred) | Gameplay | MVP | Approved | design/gdd/combat-resolver.md | Content records and schema |
| 6 | Forge and proving | Progression | MVP | Approved | design/gdd/forge-and-proving.md | Content records and schema, Resources and caps, Modifier pipeline, Combat resolver (contract owned by the Forge) |
| 7 | Methods | Progression | MVP | Designed | design/gdd/methods.md | Content records and schema, Forge and proving, Modifier pipeline |
| 8 | Crafting route | Economy | MVP | Not Started | — | Resources and caps, Activity slot, Forge and proving, Methods |
| 9 | Fight and dungeon routes | Gameplay | MVP | Not Started | — | Activity slot, Combat resolver, Forge and proving, Methods |
| 10 | Tending | Gameplay | MVP | Not Started | — | Activity slot, Modifier pipeline, Content records and schema (field registry) |
| 11 | Save and run lifecycle | Persistence | MVP | Not Started | — | Content records and schema, Resources and caps, Activity slot, Forge and proving, Methods |
| 12 | Content validator and balance enumeration | Meta | MVP | Not Started | — | Content records and schema, Modifier pipeline, Resources and caps, Forge and proving, Methods, Crafting route, Fight and dungeon routes, Tending |
| 13 | Interface shell and goal line (inferred) | UI | MVP | Not Started | — | Resources and caps, Activity slot, Forge and proving, Methods, Tending |
| 14 | Method marks and number breakdowns | UI | MVP | Not Started | — | Modifier pipeline, Methods |
| 15 | Forge screen (inferred) | UI | MVP | Not Started | — | Forge and proving, Methods, Method marks and number breakdowns |
| 16 | Reforge and post-commit method switch | Progression | Vertical Slice | Not Started | — | Forge and proving, Methods, Resources and caps, Save and run lifecycle |
| 17 | Phone layout | UI | Vertical Slice | Not Started | — | Interface shell and goal line, Forge screen |
| 18 | Accessibility and settings (inferred) | Meta | Vertical Slice | Not Started | — | Interface shell and goal line, Method marks and number breakdowns |
| 19 | Realm ladder | Progression | Alpha | Not Started | — | Forge and proving, Resources and caps, Reforge, Save and run lifecycle |
| 20 | In-game codex | Meta | Full Vision | Not Started | — | Content records and schema |

---

## Categories

| Category | Description | Typical Systems |
|----------|-------------|-----------------|
| **Core** | Foundation systems everything depends on | Content schema, modifier pipeline, activity slot and time |
| **Gameplay** | The systems that make the game fun | Combat resolver, fight and dungeon routes, tending |
| **Progression** | How the player grows over time | Forge and proving, methods, reforge, realm ladder |
| **Economy** | Resource creation and consumption | Resources and caps, crafting route |
| **Persistence** | Save state and continuity | Save and run lifecycle |
| **UI** | Player-facing information displays | Interface shell, method marks, forge screen, phone layout |
| **Meta** | Systems outside the core game loop | Content validator, accessibility, codex |

Audio and Narrative are not used: audio is minimal and has no system yet, and narrative is
flavour text on content records (rule 70).

---

## Priority Tiers

| Tier | Definition | Target Milestone | Design Urgency |
|------|------------|------------------|----------------|
| **MVP** | Required for the core loop to function. Without these, you can't test "is this fun?" | First playable prototype | Design FIRST |
| **Vertical Slice** | Required for one complete, polished area. Demonstrates the full experience. | Vertical slice / demo | Design SECOND |
| **Alpha** | All features present in rough form. Complete mechanical scope, placeholder content OK. | Alpha milestone | Design THIRD |
| **Full Vision** | Polish, edge cases, nice-to-haves, and content-complete features. | Beta / Release | Design as needed |

> **Creative Director Note** (CD-SYSTEMS, 2026-11-19): **CONCERNS**, resolved by revising the
> set; the designer chose "Revise" the same day. The system set serves all four pillars, and no
> system is scope creep. Five findings were applied:
>
> 1. *(MVP)* The Forge gets a post-forge section, so the MVP's single forge has a felt payoff.
> 2. *(MVP)* The Forge GDD names the pressure that replaces the day budget before tuning, and
>    adds a theme-fit acceptance criterion.
> 3. *(MVP)* The Wave A checkpoint uses real source records that Methods patches.
> 4. *(MVP)* The forge screen carries onboarding and a pre-commit headroom signal in Wave A.
> 5. *(MVP → possibly Vertical Slice)* Tending is first in the cut order and moves to the
>    Vertical Slice if the checkpoint loop holds without it.
>
> Orders 1–4 were never blocked.

Counts: MVP 15 (12 GDDs, 3 UX specs), Vertical Slice 3, Alpha 1, Full Vision 1. The MVP
tier is the concept's "Required for MVP" list plus the Foundation-layer systems it needs. Only
the reforge, the phone layout, accessibility, further realms and the codex wait.

---

## Dependency Map

### Foundation Layer (no dependencies)

1. Content records and schema — every system is records. Closed field lists and gate forms
   are what the validator checks and what the modifier pipeline targets.

### Core Layer (depends on foundation)

1. Modifier pipeline and recompute — depends on: Content records and schema
2. Resources and caps — depends on: Content records and schema, Modifier pipeline
3. Activity slot, rest and away time — depends on: Content records and schema, Modifier pipeline, Resources and caps, Combat resolver (for sources with fights; Combat resolver Open Question 6)
4. Combat resolver — depends on: Content records and schema

These four are rule machinery, not content. The resolver sits here, not in Feature, because
proving and both fight routes share it. It is a pure function over combatant records with no
access to the pipeline. Its door-test contract is owned by the Forge.

### Feature Layer (depends on core)

1. Forge and proving — depends on: Resources and caps, Modifier pipeline, Combat resolver
2. Methods — depends on: Forge and proving, Modifier pipeline
3. Crafting route — depends on: Resources and caps, Activity slot, Forge and proving, Methods
4. Fight and dungeon routes — depends on: Activity slot, Combat resolver, Forge and proving, Methods
5. Tending — depends on: Activity slot, Modifier pipeline, Content records and schema (the field registry's `sealInput` tags constrain it)
6. Save and run lifecycle — depends on: Content records and schema, Resources and caps, Activity slot, Forge and proving, Methods
7. Reforge and post-commit method switch (VS) — depends on: Forge and proving, Methods, Resources and caps, Save and run lifecycle
8. Realm ladder (Alpha) — depends on: Forge and proving, Resources and caps, Reforge, Save and run lifecycle

Within the layer, design follows the arrows: Forge → Methods → routes. Tending and Save come
after the routes.

### Presentation Layer (depends on features)

1. Interface shell and goal line — depends on: Resources and caps, Activity slot, Forge and proving, Methods, Tending
2. Method marks and number breakdowns — depends on: Modifier pipeline, Methods
3. Forge screen — depends on: Forge and proving, Methods, Method marks and number breakdowns
4. Phone layout (VS) — depends on: Interface shell and goal line, Forge screen

None of these hold game rules. They read state and the modifier breakdowns.

### Polish Layer (depends on everything)

1. Content validator and balance enumeration — depends on: Content records and schema, Modifier pipeline, Forge and proving, Methods, Crafting route, Fight and dungeon routes, Tending. MVP tier despite its layer.
2. Accessibility and settings (VS) — depends on: Interface shell and goal line, Method marks and number breakdowns
3. In-game codex (Full Vision) — depends on: Content records and schema

**Bottlenecks** (many dependents, high risk): Forge and proving (10 direct dependents),
Methods (8), Modifier pipeline (7), and Content records and schema (every system, directly or
through another).
**Leaves** (no dependents, lower risk): Content validator, Phone layout, Accessibility and
settings, Realm ladder, In-game codex.

---

## Recommended Design Order

| Order | System | Priority | Layer | Agent(s) | Est. Effort |
|-------|--------|----------|-------|----------|-------------|
| 1 | Content records and schema | MVP | Foundation | systems-designer, technical-director | S |
| 2 | Modifier pipeline and recompute | MVP | Core | systems-designer, technical-director | M |
| 3 | Resources and caps | MVP | Core | economy-designer | S |
| 4 | Activity slot, rest and away time | MVP | Core | systems-designer, game-designer | M |
| 5 | Forge and proving | MVP | Feature | game-designer, systems-designer, economy-designer | L |
| 6 | Methods | MVP | Feature | game-designer, systems-designer | M |
| 7 | Combat resolver | MVP | Core | systems-designer, game-designer | S |
| 8 | Method marks and number breakdowns (UX spec) | MVP | Presentation | ux-designer, art-director, accessibility-specialist | S |
| 9 | Forge screen (UX spec) | MVP | Presentation | ux-designer, game-designer | M |
| 10 | Crafting route | MVP | Feature | economy-designer, game-designer | M |
| 11 | Fight and dungeon routes | MVP | Feature | level-designer, game-designer | M |
| 12 | Tending | MVP | Feature | game-designer, ux-designer | M |
| 13 | Save and run lifecycle | MVP | Feature | systems-designer, technical-director | S |
| 14 | Content validator and balance enumeration | MVP | Polish | tools-programmer, systems-designer, qa-lead | M |
| 15 | Interface shell and goal line (UX spec) | MVP | Presentation | ux-designer, art-director | M |
| 16 | Reforge and post-commit method switch | Vertical Slice | Feature | game-designer, economy-designer | M |
| 17 | Phone layout (UX spec) | Vertical Slice | Presentation | ux-designer | M |
| 18 | Accessibility and settings | Vertical Slice | Polish | accessibility-specialist, ux-designer | S |
| 19 | Realm ladder | Alpha | Feature | game-designer, systems-designer | L |
| 20 | In-game codex | Full Vision | Polish | tools-programmer, writer | S |

**Wave A is orders 1–9; Wave B is orders 10–15.** Between them comes the forge-and-methods
checkpoint: a playable build of orders 1–9 on stub sources, with both methods played in one
session. Wave B starts after the checkpoint, and its order can change on what the build shows.

- **Before order 5:** regenerate the forge prototype's balance table under the current rules
  (no day budget; seals previewed only with ingredients in hand). This takes one session.
- **Why the resolver follows the Forge:** the resolver is Core, but the Forge owns the door-test
  contract the resolver must honour. Ordering it this way keeps the gate check's advice to
  design the forge before methods and sources.
- **Tooling:** GDDs are `/design-system`, and UX specs are `/ux-design`.
- **Effort:** S = 1 session, M = 2–3, L = 4+. The MVP totals 5 S, 9 M and 1 L.
- **Session estimate:**
  - Writing is 27–38 sessions.
  - One review and one revision per document add 15, and the balance table and cross-GDD
    checks add 3, for **46–56 sessions**.
  - At 6 sessions a week (12 hours, the designer's figure), that is **about 8–9.5 weeks**.
  - Wave A alone is 26–34 sessions, about 4.5–5.5 weeks.
- **Speed check:** log actual sessions for orders 1–3. If they run over 1.5× the estimate,
  re-run PR-SCOPE before order 5.

---

## Circular Dependencies

- **Forge and proving ↔ Combat resolver.** The forge preview shows seals, seals come from
  proving fights, and proving fights read the Foundation. Resolution: the Forge GDD owns the
  door tests as a contract (which stats each door reads, and the tier thresholds), and the
  resolver GDD must produce exactly that function. The validator checks this by enumeration.
- **Methods ↔ Crafting route / Fight and dungeon routes.** A method adds, removes and re-prices
  routes, and routes are what a method patches. Resolution: the Methods GDD owns the closed
  patch surface: in the MVP, contribution and route availability only; source yield, price and
  duration are closed (`methods.md` W3). Route GDDs author
  base values only. Per-method values live in content and the balance table.
- **Forge and proving ↔ Methods** (soft). "No makeup is co-optimal under both methods" cannot be
  tuned without methods, and methods patch the forge. Resolution: the Forge GDD tunes against
  the prototype's two methods (Ember Breath, Still Water) as placeholders and defines the
  per-method contribution table's shape. The Methods GDD fills it in.

---

## High-Risk Systems

| System | Risk Type | Risk Description | Mitigation |
|--------|-----------|-----------------|------------|
| Forge and proving | Design | "No makeup is co-optimal under both methods" has no demonstrated mechanism without a budget. The build problem may be a delayed lookup once all six ingredients are held. The balance table is stale (gate concerns 2, 3) | Regenerate the balance table first. Name the replacement pressure before tuning (CD-SYSTEMS). The GDD enumerates all 30 cases and names the interaction that separates each method's best makeup |
| Methods | Design | Pillar 2 and the second half of the hook have no play evidence; the second method has never been played. Each method's best makeup resembled the other's theme (CD-PLAYTEST concerns 1, 3) | Play both methods in one session as the first MVP smoke test. Ask a tester which makeup they expected to be best |
| Tending | Design | Undesigned and untested, yet in the 30-second loop and pillar 4. Capped yield may still favour the present player | The concept's two constraints are written into the GDD as acceptance criteria. Validator enumeration proves seal invariance |
| Modifier pipeline and recompute | Technical | Bottleneck for method, Foundation, tending, breakdowns and validation. The previous attempt's recompute was a fixed-point cycle | One ordered pass, closed targets, no modifier of a modifier. Order of operations fixed by ADR before code |
| Activity slot, rest and away time | Technical | Away-time edge cases (cap, clock skew, an input running out mid-gap) | One `advance(state, dt)` for live and away time. Backwards clocks clamped. Time-accounting tests |
| Content validator and balance enumeration | Scope | Validator cost grows with methods × reforge × realms | Static checks on patched data plus monotone reachability from commit states. Revisit at the vertical slice when reforge adds states |
| Interface shell and goal line | Design | The prototype's tester lost a whole run to not understanding the task. A text-dense interface must fit a phone later | Goal line and three lines of instruction from the first screen. Phone width is a constraint in the UX spec from the MVP |

> **Technical Director Note** (TD-SYSTEM-BOUNDARY, 2026-11-19): **CONCERNS**. The layering
> and the three contract-broken cycles are sound, and nothing needs restructuring. The
> findings are ownership instructions for the GDDs, and most are already written into the
> per-system rationale above:
>
> 1. One transform, not two: `applyMethod(content, method)` is the method stage, and the
>    validator checks its output (systems 2, 7, 12).
> 2. A field registry in the Schema GDD, with `modifiableBy` and `sealInput` tags (1, 2, 10).
> 3. A pure resolver with no pipeline dependency (5).
> 4. One generic activity record and stop rule, plus the `advance` composition test (4).
> 5. The ingredient and door record types live in the Schema. The Forge GDD writes its API
>    section first (6).
> 6. Every gameplay GDD carries a fixed section, "Non-derived state owned / Actions accepted /
>    Events emitted". The rules core emits typed events and the shell subscribes. Save
>    composes the declared slices (3–13).
> 7. Pipeline output carries provenance for breakdowns (2, 14).
> 8. GDDs for systems 1, 2, 11 and 12 state rules, invariants and acceptance criteria only.
>    Representation (types, file format, serialization, per-field order of operations, the
>    away cap) goes to ADRs. Each of these GDDs ends with an "ADRs required" list.
> 9. Foundation stats are fixed at forge time, which the designer answered provisionally on
>    2026-11-19.
>
> Findings 2, 5 and 6 must be in the Schema GDD, and findings 1 and 7 in the Pipeline GDD.
> Nothing blocks starting.
>
> **Producer Note** (PR-SCOPE, 2026-11-19): **UNREALISTIC** against the concept's 4-week
> pre-production timebox. The 15 MVP documents take 46–56 sessions; at 4 weeks the work would
> stop around the resolver or crafting with nothing buildable, which is not a graceful cut.
> Resolved by the designer on 2026-11-19:
>
> - Pre-production is extended to about 9 weeks at 12 hours a week, keeping 12 GDDs. The
>   alternative, moving systems 1, 2, 11 and 12 to ADRs to save 12–14 sessions, was declined.
> - The MVP is split into Waves A and B with a forge-and-methods checkpoint build between them.
> - The Modifier pipeline is re-rated from S to M.
> - The balance-table session is counted.
> - A speed check runs after orders 1–3.
>
> **Tending as the first cut** was adopted via CD-SYSTEMS. Recommended but not yet decided
> by the designer:
>
> - The rest of the cut order inside the MVP if time runs short: the dungeon reduced from
>   three floors to one, then number breakdowns (keeping the marks).
> - Full `/design-review` for systems 2, 5, 6, 7 and 10, and lean review for the rest, with
>   one revision each.
> - Any review finding that adds scope goes on a deferred list that names what it displaces.

---

## Progress Tracker

| Metric | Count |
|--------|-------|
| Total systems identified | 20 |
| Design docs started | 7 |
| Design docs reviewed | 6 |
| Design docs approved | 6 |
| MVP systems designed | 7/15 |
| Vertical Slice systems designed | 0/3 |

---

## Next Steps

- [x] Regenerate the forge prototype's balance table under the current rules (done 2026-11-20 in Forge and proving, S9)
- [ ] Update the concept's Scope Risks (timebox 4 → about 9 weeks) and its MVP timeline row ("Design: 8–9.5 weeks at 12 h/week; build: re-estimated after `/create-architecture`")
- [ ] Decide the rest of the producer's candidate cut order and the review budget (Producer Note)
- [ ] Wave A checkpoint: playable forge and methods with real source records stubbed in behaviour, the goal line and instruction on the forge screen, and both methods played. Decide tending's tier from it
- [ ] Design MVP-tier systems in the order above (`/design-system [system-name]`, `/ux-design` for 13–15)
- [ ] Run `/design-review` on each completed GDD: one review and one revision per document (gate recommendation)
- [ ] Run `/gate-check technical-setup` when MVP systems are designed
- [ ] Validate the highest-risk systems with `/vertical-slice` before committing to Production
