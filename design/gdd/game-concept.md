# Game Concept: The Furnace Road (working title)

*Created: 2026-11-19*
*Status: Under Review — revised three times on 2026-11-19 after `/design-review`; the third revision awaits re-review*
*Repository: `lowbridge` (restarted from scratch on 2026-11-19; the previous attempt is in `archive/2026-11-19/` and is not binding)*

Rule numbers in this document ("rule 12") refer to the numbered design rules in
`research/arcanum-reference/12-design-rules.md` (1–38, 70–74),
`research/hundred-days-reference/06-design-rules.md` (39–69) and
`research/magic-research-2-reference/08-design-rules.md` (75–100).

---

## Elevator Pitch

> It's a semi-active xianxia incremental where you gather through crafting, combat and
> dungeons to forge each realm breakthrough from ingredients you chose, under a
> cultivation method that changes what every other system pays.

---

## Core Identity

| Aspect | Detail |
| ---- | ---- |
| **Genre** | Incremental / idle RPG, semi-active; xianxia (cultivation) theme |
| **Platform** | Web browser first (MVP); mobile app later. No PC store or console build planned |
| **Target Audience** | Systems explorers who plan builds (see Target Player Profile) |
| **Player Count** | Single-player |
| **Session Length** | 30–60 minutes active, with progress while away |
| **Monetization** | None yet |
| **Estimated Scope** | Medium (6–9 months, solo) on the designer's target; Large (10–14 months, solo) on the producer's estimate. See Scope Tiers |
| **Comparable Titles** | Arcanum: Theory of Magic, Magic Research 2, Hundred Days (筑基) |

---

## Core Fantasy

You are a cultivator who builds your own foundation by hand. Every realm you reach is
something you forged from what you chose to gather, and the method you practise makes you
a visibly different kind of cultivator.

The promise is that cultivation systems and methods actually matter. A method is not a
number that goes up; it is the reason your character can do what another cannot.

---

## Unique Hook

Like Arcanum and Magic Research, **and also** every breakthrough is a crafted object whose
ingredients you chose.

The equipped cultivation method is the second half of the hook. It changes what each
ingredient contributes at the forge and rewrites what the other systems pay, so the same
forge is a different problem under a different method. The forged breakthrough leads; the
method is what makes forging it twice worthwhile.

---

## Player Experience Analysis (MDA Framework)

### Target Aesthetics (What the player FEELS)

| Aesthetic | Priority | How We Deliver It |
| ---- | ---- | ---- |
| **Sensation** (sensory pleasure) | 6 | The method's tint moving through the interface; a clear visual event when a forge completes |
| **Fantasy** (make-believe, role-playing) | 4 | The self-made cultivator: furnaces, pills, meridians, methods |
| **Narrative** (drama, story arc) | 5 | Short flavour text that comments on the mechanic (rule 70); no branching story |
| **Challenge** (obstacle course, mastery) | 1 | The best Foundation for a method is not obvious; forge planning under caps |
| **Fellowship** (social connection) | N/A | Single player |
| **Discovery** (exploration, secrets) | 3 | New sources, recipes and what each method changes |
| **Expression** (self-expression, creativity) | 2 | Foundation makeup and method choice form a build that is yours |
| **Submission** (relaxation, comfort zone) | 7 | Idle progress and rest filling the slot; never the main draw |

### Key Dynamics (Emergent player behaviors)

- Players plan a forge backwards: pick the Foundation they want, then work out which routes supply it under their method.
- Players compare makeups and discover that an ingredient that is weak under one method is strong under another.
- Players switch between tending actively for speed and leaving the game to accrue, depending on the time they have.
- Players replay the first forge under the other method to see what changes.

### Core Mechanics (Systems we build)

1. **The forge.** A realm breakthrough ("Foundation") assembled from exactly N distinct ingredients out of M (2 ≤ N < M). Its makeup sets resource caps and affinities.
   - *Measure.* A Foundation is measured in **seals**. Each door of the next realm is tested by one proving fight, and the fight's result is that door's tier (shut 0, open 1, wide open 2). A Foundation's quality is its seal total.
   - *Proving.* Proving fights are deterministic (rule 83) and read only the Foundation and the method (no carried items or consumables). They run as one step at forge time, outside the activity slot.
   - *Preview.* The forge preview shows a makeup's seals only when every ingredient in it is in hand; until then it shows what each held ingredient contributes under the method. Comparing makeups therefore costs gathering time: the player chooses which ingredients to gather first, and gathering all M takes longer than gathering the N a plan needs.
   - *Trade-off.* The trade-off lives inside the forge and in the order of gathering, never in a scarce budget. Sourcing costs time only, and any number of distinct ingredients can be held at once, so no makeup is ruled out by storage; the caps of mechanic 5 limit the resources activities consume and produce, not which ingredients are held. The choice comes from how ingredients interact (affinity clashes, caps). No makeup is co-optimal under both methods.
   - *Supply.* No source runs out, so tending yield never enlarges a finite supply.
2. **Methods.** One equipped cultivation method. It changes what each ingredient contributes at the forge, and what other systems pay: which routes work and which sources yield which ingredient. A method re-prices crafting recipes but never removes one. The method is chosen freely until the player commits to it with an explicit step ("Begin circulating [method]") that names what the commit closes and how to redo it (rule 54). Gathering starts after the commit, so the lock never fires on its own or while the player is away. After the commit the method is fixed for the run in the MVP. The price of switching later is designed together with reforge.
3. **Three gathering routes.** Crafting, an auto-resolved fight and a dungeon of chained fights, each a source of forge ingredients.
4. **One activity slot with tending.** One thing runs at a time. An activity runs until it cannot continue (an input runs out or its output is at cap) or the away-time cap is reached, counted from the player's last input; then rest fills the slot (rule 23). The same rule applies live and away. Tending is an optional, discrete choice on the running activity, with no repeated, held or timed input. It raises speed and yield, each up to a stated ceiling; untended, the activity runs at its base rate. What tending gives up, and how it behaves while away, are set in the tending design document under two constraints: tending gives something up, and it never lapses merely because the player leaves.
5. **Capped resources.** Everything starts small and capped, and bills are sized to most of a cap (rule 18).

---

## Player Motivation Profile

### Primary Psychological Needs Served

| Need | How This Game Satisfies It | Strength |
| ---- | ---- | ---- |
| **Autonomy** (freedom, meaningful choice) | Route, method and ingredient choices; no route is mandatory | Core |
| **Competence** (mastery, skill growth) | Visible forge quality; a reforge that beats the original; a build problem with discoverable better answers | Core |
| **Relatedness** (connection, belonging) | Teachers and rivals in flavour text only | Minimal |

### Player Type Appeal (Bartle Taxonomy)

- [x] **Achievers** (goal completion, collection, progression) — How: realms forged, every route cleared, every ingredient found. Secondary appeal.
- [x] **Explorers** (discovery, understanding systems, finding secrets) — How: learning how methods, sources and makeups interlock. Primary appeal.
- [ ] **Socializers** (relationships, cooperation, community) — Not served.
- [ ] **Killers/Competitors** (domination, PvP, leaderboards) — Not served.

In Quantic Foundry terms the game serves Strategy (planning) and Completion first, Discovery
second. It is not for players who want action, a driving story, competition, or an idler
that needs no input. Arcanum, Magic Research 2, Kittens Game and Melvor Idle serve the same
player.

### Flow State Design

- **Onboarding curve**: The goal is visible from the first screen as one line (rule 99): the empty forge slots, the three doors and the seals they can earn. Text supplements this; it does not carry it. The prototype's one tester lost a whole run to not understanding the task, so this is a requirement. The first cap is hit within a minute and the first ingredient is in hand within five (rule 17). Both methods are visible from the start, with what each changes shown side by side, and the choice stays open until the player commits to one.
- **Difficulty scaling**: Each realm's forge asks for more ingredients from more routes; the challenge is planning, not reflexes.
- **Feedback clarity**: Bars against caps, a log, and a forge screen that shows the chosen ingredients, what each contributes and, once every ingredient in the makeup is in hand, the seals it would earn. Every value a method changes is marked, and every number can show its breakdown (rule 97).
- **Recovery from failure**: A lost fight costs time only (rule 27). A weak forge can be redone: by a fast new game in the MVP, and by reforging from the vertical slice on. The fast new game is a test affordance for the MVP, not a reset loop; the full game never asks the player to start over.

---

## Core Loop

### Moment-to-Moment (30 seconds)

The player chooses the next action for the one activity slot (gather, refine, fight a
floor), nudges whatever is running, and spends a resource before its cap stops the activity that fills it. It is
satisfying because caps start small and fill fast, so there is always something to spend
(rule 18). When the running activity can no longer continue, rest fills the slot by itself
(rule 23); stopping tending only returns the activity to its base rate.

Tending raises speed and yield, each up to a stated ceiling. It never raises the quality
ceiling of a forge: every makeup earns the same seals whether or not the player tended.
Tending is a discrete choice that gives something up and never lapses because the player leaves; what that choice is, concretely, is still to be designed.

### Short-Term (5–15 minutes)

Gather one ingredient set, refine it, then craft an item or clear a floor that opens the
next source. "One more" comes from being one ingredient short of a forge. The choice is
which route supplies an ingredient under the method already chosen.

### Session-Level (30–60 minutes)

One forge and its proving. The natural stopping point is a finished Foundation, measured
in seals, or later a reforge. The reasons to come back are the new
realm's caps, one visible locked source, and what the last activity produced while away.

### Long-Term Progression

Realms. Each breakthrough is forged from exactly N distinct of M ingredients (rules 12, 49), and its
makeup sets caps and affinities for the realm after. Methods are equipped and patch other
systems (rules 4, 71). Reforging improves an old Foundation with later ingredients for a
stated price, and never drops a realm. The game is finished when the last
realm in scope is forged.

### Retention Hooks

- **Curiosity**: What the other method changes; the locked source visible past the next forge.
- **Investment**: A Foundation the player assembled and can point at.
- **Social**: None.
- **Mastery**: Finding a better makeup for a method than the obvious one.

---

## Game Pillars

Reviewed at gate CD-PILLARS on 2026-11-19 (verdict CONCERNS); this is the revised set the
designer locked after that review.

### Pillar 1: The forge is the milestone

Every realm breakthrough is assembled from chosen ingredients, and every ingredient changes
caps or affinities.

*Design test*: Debating a breakthrough paid by a resource bill or one built from
ingredients, this pillar picks ingredients. An ingredient that only fills a slot fails.

### Pillar 2: Methods matter

The method you circulate changes what each ingredient contributes at the forge and what
other systems pay, never just a rate.

*Design test*: Debating a method that gives +10% qi or one that changes which routes
work, this pillar picks the routes.

### Pillar 3: The build is a problem

The best Foundation for a method is not obvious, and a better one is discoverable. "Best"
means by the Foundation's measure: the most seals. A non-obvious answer must come from how
ingredients interact, never from a scarce budget or from values that run against a method's
theme. No makeup is co-optimal under both methods.

*Design test*: Debating an ingredient that is always best or one that is best only under
some methods, this pillar picks the second.

### Pillar 4: No dead ends, no attention tax

- Every ingredient keeps at least two sources under every method, one of them needing no fight anywhere in its input chain. Where this conflicts with pillar 2, pillar 4 wins: a method may re-price a source but never take away an ingredient's last fightless source.
- Tending is optional and discrete, and buys speed and yield, each up to a stated ceiling, never a higher quality ceiling: a makeup's seals are identical tended or untended. The ceilings are set in the tending design document.
- Any forge can be redone for a stated price, and a reforge never drops a realm.

*Design test (dead ends)*: Debating a permanent lock or an expensive redo, this pillar picks the redo.

*Design test (attention)*: Debating a reward for watching or one that waits for the player, this pillar picks the one that waits.

### Anti-Pillars (What This Game Is NOT)

- **NOT extra activity slots**: one slot for the whole game keeps every choice a trade-off; more slots would dissolve pillar 3. This diverges from rule 24 (see Stated divergences).
- **NOT automation tiers**: automation that plays the build for the player removes the problem pillar 3 protects.
- **NOT sects**: a faction layer is a new system before the existing ones interlock.
- **NOT a branching story**: narrative is flavour on the mechanic; branches multiply content a solo first game cannot carry.
- **NOT a reset loop**: progress is never taken away (rule 26); a reset would contradict pillar 4. The MVP's fast new game is a test affordance, not a reset loop.
- **NOT a sprawl of systems**: no new system until the existing ones interlock.

---

## Visual Identity Anchor

Chosen at gate AD-CONCEPT-VISUAL on 2026-11-19 from three directions. The art director
leaned toward a different direction (The Written Formula) without calling any dominant;
the designer chose this one.

**Direction: The Circulating Tint**

**Visual rule:** What the method touches, the method marks.

**Supporting principles**

1. **One owner per accent.** The equipped method owns the interface's only accent colour. *Design test*: can a screenshot identify the method without its name?
2. **Mark the changed value.** Every payout a method alters carries the tint plus a glyph. *Design test*: swap methods; do exactly the changed numbers change appearance?
3. **Glyph before hue.** Each method has its own glyph, so meaning never rests on colour alone. *Design test*: does the screen still read in greyscale?

**Colour philosophy:** A neutral stone base. Hue means method and nothing else. Mood is
immersive, bodily and shifting; shapes are continuous lines and channels linking panels,
with soft joins.

**Known limits to design around**

- The direction breaks down past about six methods; the full vision is capped at six.
- It gives the forge no visual event of its own. The art bible must add one.
- The pipeline is type, colour, layout and simple glyphs. No illustration is planned.

---

## Inspiration and References

| Reference | What We Take From It | What We Do Differently | Why It Matters |
| ---- | ---- | ---- | ---- |
| Arcanum: Theory of Magic | Capped resources, one activity slot with rest, N-of-M tier-ups, late content patching early content (rules 4, 12, 18, 23) | The tier-up is a forged object built from chosen ingredients, not a bill in shared currencies | Shows many open paths of growth hold attention for hours |
| Magic Research 2 | An incremental RPG where crafting and combat feed one character's growth | No retirement loop; nothing resets | Shows the audience finishes a designed, finite incremental |
| Hundred Days (筑基) | Cultivation vocabulary on Arcanum's spine; evidence for strict content validation (rules 46, 51, 52) | No spendable lifespan; a tree with load-bearing edges | The nearest existing game, and a record of what goes wrong without a validator |

**Rules this concept follows:** 2, 6, 17, 18, 23, 26, 27, 49, 70, 71, 72, 74; from
Hundred Days 46, 51, 52, 54; from Magic Research 2 83, 97, 99.

**Stated divergences from *copy* rules**

- **Rule 12** (tier-up as a bill in slow shared currencies that locks the previous stage's tools): the N-of-M shape is kept, but the bill is replaced by chosen ingredients and nothing is locked. Reason: pillar 1.
- **Rules 3 and 4** (expressions in data; general mod patching): narrowed for the MVP. Only three modifier sources exist (method, Foundation, tending), each targets a closed list of fields, and gates use a small closed set of forms. Reason: the technical review (TD-FEASIBILITY) and a first game on a short timeline. Revisit when content demands more.
- **Rule 14** (four independent ladders): not adopted. Reason: the sprawl anti-pillar.
- **Rule 24** (slots are rare named milestones, plus priority flags as automation): one slot for the whole game and no automation tiers. Reason: anti-pillars "extra activity slots" and "automation tiers"; pillar 3.
- **Rules 25 and 91** (a capped offline bank spent deliberately; three time bands): the activity continues while away until it cannot or the away-time cap, then rest. Reason: one deterministic `advance(state, dt)` for live and away time, and a first game on a short timeline. A banked speed resource may be revisited in the tending/time design document.
- **Rule 96** (ordered, tagged modifiers as data): narrowed as for rules 3 and 4; the per-field order of operations is decided by ADR.
- **Rule 39** (a spendable lifespan): not adopted in this scope.

**Non-game inspirations**: xianxia web fiction's craft traditions: pill refining, furnace
work, meridian circulation and named cultivation methods.

---

## Target Player Profile

| Attribute | Detail |
| ---- | ---- |
| **Age range** | 20–40 (assumption, not researched) |
| **Gaming experience** | Mid-core to hardcore incremental players |
| **Time availability** | 30–60 minute sessions, with the game left running or closed between them |
| **Platform preference** | Browser on desktop; phone for check-ins |
| **Current games they play** | Arcanum: Theory of Magic, Magic Research 2, Melvor Idle |
| **What they're looking for** | A cultivation game where the method chosen changes how the game is played |
| **What would turn them away** | Mandatory clicking, resets that take progress away, choices that turn out not to matter |

---

## Technical Considerations

| Consideration | Assessment |
| ---- | ---- |
| **Recommended Engine** | None: a web stack, chosen at `/setup-engine` on 2026-11-19 (TypeScript 7.0.2, Vite 8.3.8, Vitest 5.1.1, Node.js 26 LTS; see `CLAUDE.md`). The interface layer, plain DOM or a framework, is decided at `/create-architecture`. The stack must provide: text layout that reflows to phone width, tooltips that work by tap, a rules core that runs headless from the command line, plain-data content files, and local saves on web and mobile |
| **Key Technical Challenges** | Method patching and recompute; a validator for the pillar 4 guarantees; saves and offline accrual; a text-dense interface on a phone |
| **Art Style** | 2D interface only: type, colour, layout, simple glyphs |
| **Art Pipeline Complexity** | Low |
| **Audio Needs** | Minimal |
| **Networking** | None |
| **Content Volume** | MVP: 40–60 content records, one 30–60 minute session. Full vision: 5–6 realms; record count and hours not yet estimated |
| **Procedural Systems** | None |

**Technical review (TD-FEASIBILITY, 2026-11-19): CONCERNS.** Nothing invalidates the
concept. Mitigations adopted as constraints for the architecture stage:

- Modifiers come from three sources only, applied in one fixed order: the method (what ingredients contribute and what sources pay), then the Foundation (caps and affinities), then tending (speed and yield, capped). Each targets a closed list of fields, and no modifier can modify another, so recompute is one ordered pass.
- The "tending never raises the quality ceiling" rule is enforced two ways: by the schema (no tending modifier can target a field that a seal is computed from) and by enumeration (for all makeup-and-method cases, seals with tending equal seals untended). No simulation bot is needed.
- One deterministic `advance(state, dt)` serves live and away time: an activity runs until it cannot continue or the away-time cap, then rest. Backwards clocks are clamped.
- The save holds only non-derived state and is versioned from the first build.
- The validator splits into static checks on patched data (two sources per method, one with no fight in its input chain; every ingredient changes at least one seal under at least one method) and reachability by enumeration. Obtainability is monotone after the method commit. The commit is the only action that closes anything (the other method's choice and what it would have opened), and gathering starts only after it. After the commit no action closes a source or consumes a one-time unlock, so checks run from each method's commit state cover every reachable state.
- One architecture document and a short must/never list exist before any code; changes to the rules core need an ADR.

---

## Risks and Open Questions

### Design Risks

- One method dominates and the choice collapses (pillars 2 and 3).
- "N distinct of M" degrades into a resource bill with a menu if ingredients do not differ in effect (pillar 1).
- The reforge price is wrong: cheap makes choices weightless, expensive makes them final in practice.
- The Circulating Tint gives the forge no visual event unless one is designed.
- Tending yield may still favour the player who is present, even capped. It is safe only while no finite stock exists that yield can enlarge and nothing tending touches feeds a seal.
- Removing the prototype's day budget made both methods share a best makeup in its balance table. The forge must hold "no makeup is co-optimal under both methods" from interactions alone.
- Tuning for a non-obvious best makeup can make each method's best look like the other method's theme, as the prototype's did.

### Technical Risks

- The platform pair (web, then mobile app) with a text-dense, tooltip-heavy interface; the mobile app wrapper is not chosen yet.
- Architecture drift across AI coding sessions, the failure that ended the previous attempt.
- Save format changes as content changes; offline accrual edge cases.
- Validator cost grows as methods and reforge multiply the states to explore.

### Market Risks

- A niche audience already well served by the reference games.
- A xianxia theme competing with a nearer existing game (Hundred Days).

### Scope Risks

- **The timeline gap.** The designer's target is weeks; the scope review (PR-SCOPE, 2026-11-19: OPTIMISTIC) estimates about three times longer, mostly because of full-rigor design stages that agents do not speed up. Both are recorded in Scope Tiers.
- **Stalling in pre-production.** The likeliest failure is a stack of approved documents and nothing playable. Mitigation: pre-production timeboxed to 4 weeks, design documents only for MVP systems, the art bible shrunk to a one-page interface style sheet.
- Every method re-prices every source in every realm, so balance cost multiplies with methods. Alpha is held to four.
- Proving fights add content to the MVP (one per door, three in all). The tier timelines were estimated before that addition; re-estimate before `/map-systems`.

### Open Questions

- What does a reforge cost, and in what unit? Answer in the reforge system's design document, before the vertical slice.
- What is the offline cap? Answer at architecture.
- May saves be wiped until the first public build? Designer's call, before the save format is fixed.
- How many hours a week are available? The producer's estimate assumed about 12.
- Will anyone other than the designer playtest the MVP? As of 2026-11-19, no; without one the MVP gives no hypothesis verdict. See the evidence standard under MVP Definition.
- Is tending fun as an input, or only a speed button? The forge prototype did not test tending; the MVP is the first test. Beyond being a discrete choice, the tending action is undesigned.

For the system design documents, from the forge prototype and the design review of 2026-11-19:

- Which interactions make the forge a trade-off (affinity clashes, caps), what values N and M take, and how is "no makeup is co-optimal under both methods" held? The forge design document answers.
- Which caps and affinities exist? They are not yet named.
- Are a Foundation's stats fixed at forge time, or recomputed under the current method?
- Do Foundations stack across realms, or does only the latest count?
- What does switching method cost after the commit? Designed with reforge.
- What are the tending ceilings for speed and for yield, and what does tending give up?
- How does the player see that a better Foundation exists? The prototype's tester forged a 3 when a 4 existed and did not look for it.
- How does the tint show the direction of a change, and a recipe that a method removes?
- Which accessibility tier applies? (Tending already uses no repeated or held input.)
- How are the 40–60 MVP records budgeted by type?
- The two-source guarantee as a check: under each method every ingredient has a source with no fight in its input chain, so N ingredients stay obtainable from every reachable state.

---

## MVP Definition

**Core hypothesis**: Forging a breakthrough from chosen ingredients under a chosen method
holds a 30–60 minute session, and players want to try the other method afterwards.

**How it is judged.** The signals below are fixed before the playtest. They give the
verdict, not the tester's impression.

| Signal | Pass |
| ---- | ---- |
| States the goal | Within two minutes of starting, the tester can say what they are trying to do |
| Forges unaided | A Foundation is forged within 60 minutes with no help from outside the game |
| Compares before forging | At least three full makeups are previewed before the first forge |
| Comes back for the other method | A run under the other method is started in the same session, unprompted |
| Solves it differently | The second method's Foundation uses a different makeup from the first |

**Evidence standard.** The only tester is the designer, by his decision. On him, "States
the goal", "Forges unaided" and "Comes back for the other method" cannot fail, and "Solves
it differently" is set by the balance table rather than by play. His run is therefore a
smoke test: it shows the MVP works and gives the hypothesis verdict UNTESTED. A verdict
(CONFIRMED, PARTIALLY CONFIRMED or NOT CONFIRMED) needs at least one tester who has read
neither this concept nor the balance table; the design review's QA lead asked for three to five.

**Required for MVP**:
1. One realm ending in one forge, built from exactly four distinct of six ingredients.
2. Two methods that change what ingredients contribute at the forge and how they are sourced. The method is free to change until the player commits to it.
3. Each ingredient with two sources, one needing no fight: one crafting station, one auto-resolved fight, and a dungeon of three chained fights on the same resolver. Crafting is the fightless floor: a method may re-price a crafting recipe but never remove one; methods add and remove fight and dungeon routes, which pay a premium over crafting. A method that removes an ingredient's fight or dungeon route gives that ingredient another source, so it keeps two (pillar 4).
4. One activity slot with tending and auto-filling rest; about eight capped resources.
5. The content validator (schema, the pillar 4 static checks, reachability).
6. A save, away progress (the activity continues until it cannot or the away-time cap, then rest), and a fast new game so the other method can be tried.
7. The Foundation's measure: three named doors, each tested by one fixed proving fight on the same resolver, scored 0–6 seals and shown from the first screen as the goal. In the MVP the doors are named, previewed unlocks, not a second realm.
8. No hover-only interaction. The phone layout itself waits for the vertical slice.

All 30 makeup-and-method cases (15 makeups × 2 methods) are enumerated in a balance table
for the MVP; the tending and reachability checks run over them by enumeration; no simulation bot.

**Explicitly NOT in MVP** (defer to later):
- Reforge (vertical slice).
- A third method, the visual pass and the phone layout (vertical slice). The phone layout is a constraint in the UX spec from the start.
- A second realm, further dungeons, the in-game codex.

### Scope Tiers (if budget/time shrinks)

Timelines are cumulative. The designer's target and the producer's estimate are both
recorded; the producer assumed about 12 hours a week. Both were estimated before the
design review added a proving fight to each door in the MVP.

| Tier | Content | Features | Timeline (designer's target) | Timeline (producer's estimate) |
| ---- | ---- | ---- | ---- | ---- |
| **Prototype** | Forge, 6 ingredients, 2 methods, stubbed sources | Throwaway test of the hypothesis | Under 1 week | 2 weeks |
| **MVP** | 1 realm, 1 forge, 2 methods, 6 ingredients, 3 doors each with a proving fight | Core loop, forge, validator, save, away progress, fast new game | 2–3 weeks | 7–10 weeks |
| **Vertical Slice** | Adds a 3rd method | Reforge, visual pass, phone layout | 5–6 weeks | 12–16 weeks |
| **Alpha** | 3 realms, 4 methods, 2 dungeons | All features, rough | 14–18 weeks | 24–32 weeks |
| **Full Vision** | 5–6 realms, 6 methods | All features, polished, in-game codex | 6–9 months | 10–14 months |

Stopping at the MVP is a graceful fallback: one realm ending in a forge is a complete loop.

---

## Review Record

| Gate | Date | Verdict | Outcome |
| ---- | ---- | ---- | ---- |
| CD-PILLARS | 2026-11-19 | CONCERNS | Pillars revised from five to four; a mastery pillar added; anti-pillars replaced |
| AD-CONCEPT-VISUAL | 2026-11-19 | Three directions, none dominant | Designer chose The Circulating Tint |
| TD-FEASIBILITY | 2026-11-19 | CONCERNS | Mitigations adopted as architecture constraints |
| PR-SCOPE | 2026-11-19 | OPTIMISTIC | Content and ordering adjustments applied; designer's timeline kept beside the producer's |
| Forge prototype | 2026-11-19 | PROCEED (designer) | One internal tester; the second method was not played. `prototypes/forge-concept/REPORT.md` |
| CD-PLAYTEST | 2026-11-19 | CONCERNS | Accepted with noted concerns; carried into Open Questions |
| Design review (full) | 2026-11-19 | NEEDS REVISION | Six concept-level decisions made and applied the same day |
| Design review (full, re-review) | 2026-11-19 | NEEDS REVISION | Three decisions applied the same day: the trade-off lives inside the forge; the measure is seals 0–6, one proving fight per door; the designer's run is a smoke test (UNTESTED). Method lock made an explicit commit. Awaiting a targeted re-check, not a full panel |
| Design review (lean, re-review) | 2026-11-19 | NEEDS REVISION | The prior four blockers closed. Two fixes applied the same day: the preview shows seals only for makeups whose ingredients are in hand; validator monotonicity holds from each method's commit state. Also: pillar 2 says routes, not recipes; tending gives something up and never lapses on leaving; a removed route is replaced |

Recorded designer decisions against reviewer advice:

- **Tending keeps yield, capped.** The first review's economy-designer and creative-director advised speed only, because yield favours the player who is present. The re-review accepted it on two conditions now written into the concept: no finite stock that yield can enlarge, and nothing tending touches feeds a seal.
- **The designer is the only MVP tester.** Reviewers asked for one to five outsiders. The concept records that his run gives no hypothesis verdict.

---

## Next Steps

The core mechanic is unproven, so the path is prototype-first.

- [x] Configure the engine and platform targets (`/setup-engine`): done 2026-11-19, web stack
- [x] **Prototype the forge** (`/prototype forge`): done 2026-11-19, PROCEED with noted concerns
- [x] Review this concept (`/design-review`): done three times on 2026-11-19 (two full, one lean), NEEDS REVISION each time, revised the same day
- [ ] Re-review the third revision (`/design-review design/gdd/game-concept.md --review lean`)
- [ ] Regenerate the forge prototype's balance table under the current rules (no day budget; seals previewed only with ingredients in hand) before the forge design document
- [ ] Producer re-estimate of the tiers after the proving fights were added
- [ ] Write the one-page interface style sheet (`/art-bible`)
- [ ] Decompose the concept into systems (`/map-systems`)
- [ ] Design each MVP system (`/design-system [system-name]`), with `/design-review` after each
- [ ] Write the architecture blueprint (`/create-architecture`) and its decisions (`/architecture-decision`)
- [ ] Trace requirements to decisions (`/architecture-review`)
- [ ] Pass the stage gates (`/gate-check`)
- [ ] Build the vertical slice (`/vertical-slice`) before committing to sprints
- [ ] Validate the core loop with a playtest (`/playtest-report`)
