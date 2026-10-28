# Design plan v2: cultivation incremental (working title: *Lowbridge*)

18 October 2026, revised the same day after `review/THIRD-PARTY-REVIEW-2026-10-18.md`, and revised again on 20 October 2026 by ADRs 0021-0025 (Part F). Where the interview was a ledger of decisions, this plan is a design. It takes the accepted content of the interview (setting, classes, masteries, breakthrough count, bank) and rebuilds it on Arcanum's machine as corrected in `research/arcanum-mechanics-2026-10-18/MECHANICS-STUDY.md`. The interview's mortality material (age, lifespan, checkpoints and retry) was taken in the same way in October and is **cut** by [ADR 0025](decisions/0025-lifespan-and-checkpoints-cut.md); every mention of it below is historical and labelled. Where this plan reverses an accepted decision it says so in Part F. Every number in Part C is there to be tested in play, and every number not yet measured says so.

Reading order: §0 (what changed and how it was checked), then A (the machine), B (campaign skeleton), C (first slice, fully specified), D (data model), E (validation) and F (supersessions, decisions).

---

## 0. Changes from v1 and how each was verified

**How to read this table.** Each row is the state of one finding on the date of the row, kept as an audit trail. Figures inside it are snapshots, not current claims. **There is one current Foundation figure and it lives in [`playtest/SIMULATION-REPORT.md`](../playtest/SIMULATION-REPORT.md)**; nothing in this plan quotes a measured route time of its own. Rows touching mortality or retry are historical: [ADR 0025](decisions/0025-lifespan-and-checkpoints-cut.md) cut age, lifespan, checkpoints and retry.

| Third-party finding | Verified how | Disposition |
|---|---|---|
| F2 (critical): "skills start at cap 0" misread an absent `max`; Arcanum defaults to 5 | `src/items/skill.js` at pinned commit: `Defaults.max = 5`, `buy = {arcana:20}` | **Accepted.** Study §1 rewritten. Part A now: entry gate → 3-5-level runway with per-level payout → wall. |
| F1 (critical): Part C deadlocks on Lore (`fragment_notes` ← `shu_reading` ← `lore ≥ 2`); `channel_return` unreachable/pointless | Executed Part C v1 as a graph: greedy player stalls at `lore 0`, `field_kit` never reachable | **Accepted.** `fragment_notes` requires only the slip; `channel_return` cut. |
| F3 (high): Sutra Reader has no tags, so zero specialist options at B4; breaks ADR 0017 | Tag arithmetic by hand, then by script | **Accepted.** Scholar line removed. Golden Cauldron keeps open entry with the mage line's price shape. |
| F4 (high): B4 "family cap ≥ 5" unreachable for half the histories; Spirit module never unlocked; Mountain Vessel dead for Earth starters | Script over all 11 A→B histories | **Accepted.** Projection is a bridge layer raised by Sword and Formation content; a class unlocks the *next* tier of each line it tags; B4 gates are tier-relative. All 11 histories now have ≥ 2 options incl. ≥ 1 specialist. |
| F5 (high): bank survives retry, so spend-then-die loses days; hoard-then-die farms | Rule reading | **Historical, superseded 20 Oct.** Accepted at the time as "retry refunds bank spent since the checkpoint". [ADR 0025](decisions/0025-lifespan-and-checkpoints-cut.md) removes checkpoints and retry entirely, so both the exploit and its refund are gone. |
| F6 (medium): free Lean-to at Foundation punishes buying it | Reading | **Accepted.** No free home; Lean-to is the prerequisite for Cottage. |
| F7 (medium): 3-of-5 degenerate; 10-min Settling dead wall; `at: 120` unreachable; coin cap 12 absurd | Executed: with "4 of 5" the channel route reached Foundation with **Circulation 0**, so the method was skippable (a defect the reviewer did not catch) | **Accepted and extended.** Circulation ≥ 2 is a hard requirement; 3 of 4 supporting pointers; Settling 2 min; curves trimmed; coin cap 20. |
| Q1: missed Arcanum qualities: `require`/`need` split, continuous rate economy, locale stressors, automation growth | `skills.json`: 41 `require`, 19 `need`; `stressors.json`; `extraaction.json` | **Accepted.** Rules 11-13 added; Part C records carry `need`; qi is the one continuous resource; strain gauges for sites from B2; objective queue / hobby slot as rewards. |
| Q2: review mistook deliberate choices (tempo, open village, morality) for omissions | Re-read ADRs 0003/0006/0012 | **Partly accepted.** Locks follow the fiction; tempo is hybrid; Karma is **cut** (not deferred). |
| Q7: 700 records is not cheap for a solo author | Arithmetic | **Accepted.** Build B1-B4 only; Body + Earth + their hybrid first; others after play evidence. |
| Q8: tempo hybrid; keep GC open-entry; TypeScript rewrite not fork | — | **Accepted** as decisions. |
| Owner's final pass: the interwoven skill web was under-researched; audit class/line diversity | Wiki `Skills` page cross-checked against `skills.json`: 1 trunk with 8 threshold gates, 14 source-gated entries, 8 two-parent bridges, 7+ tag-gated masteries that drain their element, 9 cross-feeders, 5+ OR/action entries (`MECHANICS-STUDY.md §1b`) | **Accepted.** B.1 rebuilt as a 20-technique web (trunk, entries, bridges, masteries, helpers); class gates are techniques; roster refined to 4/8/9 with three one-record additions so every line supports "three from one line" and Sword starters get a second B3 route; `b4-gates.py` re-verified (15 histories, all ≥ 2 options, ≥ 1 specialist). |
| Q9: test order: runway loop first, lifespan/bank/objective stops explicitly | — | **Accepted, partly historical.** Part E reordered; the lifespan half of the ordering lapsed with [ADR 0025](decisions/0025-lifespan-and-checkpoints-cut.md). |
| "Apprentice in 3 min" is a tutorial, not a stage | Wiki T0 quest list | **Accepted.** Study §9 corrected; tempo claim is one order of magnitude, not two. |
| First-playable implementation: three owner decisions | Owner confirmed all three handoff defaults on 18 Oct | **Accepted.** Qi is a reservoir; the channel arrangement and `faint_trace` retain separate acquisition routes through B2; all starred roster additions are accepted for later modules. |
| Part B's future per-level bonuses were not specified in Part C | Compared B.1 with C.1 and C.3 before encoding JSON | **Clarified.** C governs this opening: Qi Sense adds +1 qi cap per level; Lore levels open the listed gates. (This row's Circulation clause, "subtracts 5 seconds per level from Work tasks", is historical; the 19 Oct owner review below replaced it with +2 Vigor cap per level, which is what C.1 carries.) B.1's herb/teaching/Lore cross-feeders and Vitality belong to later module implementation, not this slice. |
| Foundation unlocker versus `settling`; ambiguous qi bill | C.3 and baseline Python simulator | **Clarified.** `foundation` is the visible core/supporting gate; `settling` is its 120-second activity. Ten herbs are spent at start; full qi is a threshold, not consumed. Completing Settling grants Foundation and its rewards once. |
| Channel rate and repetition-curve timing | C.3 and baseline `d` counters | **Clarified.** The arrangement adds +50% to `channel_exercise` only. A repetition threshold changes subsequent runs, so the tenth mill run pays the old yield and the eleventh gains +1. |
| Mat can leave full Qi Sense with an unfilled qi reservoir | Real cold-start sequence: buy mat, obtain slip, practise to Qi Sense 3; after 288 practice seconds, Qi Sense is 3/3 but qi is 4/5 | **Fixed.** Breath-gathering remains available while either Qi Sense is below cap or qi is below capacity. At the knowledge wall it restores qi only; capped practice stores no surplus experience. No rate or price changed. |
| C.1 claimed Lore cap 6 at Foundation while C.3 grants +2 | Real JSON routes have cap 3 before Foundation unless Shu's reading was purchased | **Corrected.** Foundation adds +2: Lore cap 5 without Shu, 6 with her reading. The reward is unchanged. |
| Paper timing approximated continuous experience and hollow rewards | Both original Python routes replayed through the actual JSON and 1-second engine | **Measured, not retuned**; snapshot of 18 Oct. The paper model was shown to understate the real cost of continuous practice. The figures of that date are superseded; the current one is in the simulation report. C.5 remains a comparison target, not a claim of observed timings. |
| Starting then abandoning steady attention could claim its reward from channel practice | Mixed-route event gate inspected against actual earned-level counters | **Clarified.** `faint_trace` requires Circulation ≥ 2 and at least one level earned through steady attention. Merely starting the exercise does not earn its discovery. Visiting both routes stays allowed. |
| UI review: instant acquisitions occupied the same control pattern and interrupted running work | Compared the current interface with the supplied Arcanum screenshot and pinned UI/task sources; exercised an acquisition during paid and partially completed work | **Corrected.** Instant acquisitions do not use or replace the primary activity slot. Timed work and continuous practice remain distinct sustained activities. Explicit discovery pauses, achieved objectives and invalidated activities still stop. The interface separates acquisitions, running activity, resources, techniques and home; this adds no later campaign systems or action slots. |
| Owner review, 19 Oct: every task was timed (Arcanum's opening is instant click-work gated by stamina); one card per record hid the board; LB-01/02/04/05/06/08 open; pacing missed C.5 (Circulation at ~35 min) | Arcanum `tasks.json` (37/200 core tasks instant, perpetual `rest`); `review/INDEPENDENT-REVIEW-2026-10-18.md`; `bun run validate` and the browser smoke after the change | **Changed.** Chores are instant and spend Vigor; Rest and practice are continuous; sites and Settling stay timed; three instant trades. Stopping keeps a paid run's progress (LB-01); the channel stones need Qi Sense 3 (LB-02); arrangements can be taken down without refund (LB-04); import asks first (LB-05); the herb rack adds a bundle per gather and gathering trains Qi Sense (LB-06); cap lines name indirect raisers (LB-08). Circulation now adds +2 Vigor cap per level instead of shortening Work. Route timings of that date are a superseded snapshot; the current figure is in the simulation report. |
| QoL pass, 19 Oct: acceleration was a one-shot button with no cost preview; an empty Vigor meter left the slot idle until the player found Rest; no time-to-objective, net rate or return summary; owned records cluttered the grid | Both routes played under a virtual clock; three owner decisions taken together | **Changed.** Accelerate is a toggle beside the bank naming the objective (C.6): while on, each real second also spends one banked second on the running activity; it clears when the activity stops. Rest is an `autoStart` filler: it begins by itself whenever the slot is empty and Vigor is below its cap, and ends at full Vigor or when a sustained activity replaces it (chosen over a manual nudge; the one automation ahead of rule 13's B2 queue). Owned purchases and completed one-off visits move to a closed Done group. Route timings of that date are a superseded snapshot; Circulation still opened inside the 27-minute window. No Part C number changed. |
| Revision of 20 Oct: five decisions taken together | The prior-review complaint list in the design-intent report §3-§5, re-read against `research/arcanum-reference/12-design-rules.md` | **Accepted.** [ADR 0021](decisions/0021-compounding-vocabulary.md) adds patching so later content compounds earlier content; [ADR 0022](decisions/0022-chore-tempo.md) keeps chores instant and adds one sustained `fill` earner per good, and replaces rule 9; [ADR 0023](decisions/0023-techniques-and-attunement.md) separates learning a method from holding it in a scarce attunement place and using it; [ADR 0024](decisions/0024-route-keys.md) makes `t_` route keys carried by methods the only cross-module history gate; [ADR 0025](decisions/0025-lifespan-and-checkpoints-cut.md) cuts age, lifespan, checkpoints and retry and replaces rule 10. Part A is now sixteen rules. |
| Combat system, 21 Oct: ADR 0008 left resolution open, and the ridge bandit's single `power ≥ threshold` comparison told the player nothing about how to prepare | The worked numbers in [ADR 0026](decisions/0026-combat-exchanges.md) replayed through `bun test` (engine fixture and the real sparring bout), and `bun run validate` with Foundation timings unchanged | **Accepted, then revised the same day.** [ADR 0026](decisions/0026-combat-exchanges.md): fights are swung out over Life, Strike, Guard, Speed, Hit and Dodge, each side on its own readiness clock, with every swing rolled; attuned methods add through `held`; a no-stakes sparring bout opens with Circulation and the bandit is rebuilt on the same model. The fight plays in its own Fight tab. Part A is now seventeen rules. |
| Docs pass, 27 Oct: Part C's tables had drifted from the shipped JSON (2-minute walks, trades and family caps that no longer exist, the bandit as the only way to his cache, a direction sign naming opening furnishings) | Every chapter-one record in `src/data/opening.json` and `src/data/shared.json` read against C.1, C.3 and C.5; `bun run validate` after commit 94a21fe (122/122 records reachable) | **Corrected to the JSON.** C.1, C.3 and C.5 now list the records, costs, lengths, results and curves that run, including Wen's wage counting as wages until the ferry road, Rest's Composure while *Settle the breath* is held, the `t_furnished` key on the cot, herb plot and strongbox, and the cache traced without a fight by the Earth and Formation teachings. The JSON stays the record of what runs. |
| Crafting, 27 Oct: `recipe` was in the vocabulary with nothing authored under it, and ridge materials had no kept use beyond the First Direction bill and a ten-coin trade | `bun run validate` with the `ridge-workbench` witness (every piece made and every dose taken from a cold start, ridge windows unchanged), `bun test` (engine fixture for a dose recipe, a preparation and a kit piece in a fight) | **Accepted.** [ADR 0029](decisions/0029-crafting-workbench-recipes-preparations.md): a workbench arrangement after Foundation gates timed recipes on a Craft tab; recipes make kit (1/1 stores carrying a `mod` while held) or doses (stores of three), and `preparation` is a new instant kind that spends a dose. Kit has no equip slots in this slice, a stated divergence from rule 6. |

Simulations: `design/validation/b4-gates.py` checks all 15 histories and B4 eligibility; `design/validation/opening-sim.py` is retained as the historical paper model. The route measurement that matters is produced by `bun run validate` and reported in [`playtest/SIMULATION-REPORT.md`](../playtest/SIMULATION-REPORT.md), which carries the complete unlock order. Every route timing taken before 20 October 2026 is superseded and awaits re-measurement: [ADR 0022](decisions/0022-chore-tempo.md) gave every good a second way to earn it, and the old routes could only click.

---

## Part A: The machine

Seventeen rules. Everything else is content.

1. **A capability is a number with an entry gate, a runway, and a wall.** Resources start capped and small. A technique family is *visible* when its `require` holds, *startable* when its `need` holds (usually an arrangement or a discovery), and once started trains along a **3-5 level runway** where **every level pays a small passive bonus** (a rate, a cap, an unlocked task) that later content can patch upward (rule 14). The runway ends at a wall that only an outside record moves.
2. **A class raises walls and opens doors.** It adds +1 to its mastery tags (accepted lattice, unchanged), raises its line's entry technique cap by +3, raises its bridge technique if it is a hybrid, unlocks the **next tier** of each line it tags, and is the only thing that lets the line's *mastery* technique exist.
3. **Gated content re-keys itself.** Each line tier has practice, an arrangement and a site that each raise the line's entry technique cap +1. A specialist climbs their own ladder between breakthroughs.
4. **A line is a small web, not one skill.** Each line has an entry technique (source-gated, cheap, runway 5), a mastery technique (entry ≥ 10 **and** the line tag; drains the line's flow resource), and bridges to neighbouring lines that require two parents. Hybrids are techniques first, classes second: a hybrid class requires its bridge at a threshold. Helpers cross-feed: some techniques raise *other* techniques' rate or cap fractionally per level. One content module per line; bridge content lives in both parents' modules.
5. **A breakthrough is a mandatory core + N-of-M supporting pointers + a bill.** The core is the thing the stage is about (Foundation: the reconstructed method). The pointers are into systems that already exist, and at least one of them must ask for something the player's own route does not already supply. The bill is in the slow shared currencies. It pays caps, unlocks and bank cap, and nothing else.
6. **Advancement closes what the fiction removes.** A job is closed when a better one is taken up; a home tier when the player moves; a class choice closes its same-tier rivals. Earlier *places* stay open and gain new uses (ADR 0006/0012). No revision of earlier classes. No hidden quizzes.
7. **One open-entry fallback, shaped like Arcanum's mage line.** Golden Cauldron is enterable from any history, gated on the shared family (`Lore ≥ 8`) and an escalating herb/coin bill; newcomers reach Alchemy 1 (broad: +1 to every open family cap, utility preparations); Pill Refiner → Golden Cauldron reaches Alchemy 2 (the deep recipes). It never raises a line's exclusive family above 5.
8. **Repetition has a curve inside the cap.** Work tasks improve at reachable rep thresholds and some sour late.
9. **Tempo is `length`, and income does not need the slot.** No `length` is *instant*: the click pays and lands, never taking the slot. A `length` in seconds is *timed*: its entry bill is paid once, so stopping keeps the progress and restarting does not pay twice, and its `lock` applies when that bill is paid ([ADR 0027](decisions/0027-locks-at-payment-and-stops.md)). `length: continuous` is *perpetual*. Chores stay instant and Vigor-paid with their `at` curves (cap 10; +0.2/s on its own, +0.35/s more while resting), and clicking them remains the best-paying tempo. Chapter one has no sustained earner: a small passive rate rides on the same unlocks (Wen's wage after the fifth sack, Shu's share once apprenticed), runs whether or not the slot is busy and while away, and so gives the opening an income floor that does not depend on click rate. Sustained earners return in later chapters, where loops completed raise their yield through `at`/`every` and make them the idle filler. One sustained activity at a time; the one it displaces goes to the front of a six-deep waiting list; when a run ends the slot takes the next item, and Rest `autoStart`s into an empty one and ends when Vigor and Life are full. A run that cannot pay one more second of its drain is refused rather than started, and a run carrying an `encounter` is refused unless the whole reserve is there. There is no food meter. Qi is a reservoir: techniques spend it, breath-gathering and arrangements return it. `boost` names a held flag that makes the next timed run faster and spends it. The time bank is 1:1 (accepted), starts at **1 hour**, and is a capped resource raised by progression. ([ADR 0022](decisions/0022-chore-tempo.md) as amended 27 October, replacing the 18 October rule 9.)
10. **A setback costs time and used preparation, never the journey.** A failed attempt (an ordinary obstacle, a defining trial, a fight) keeps every discovery, key, level and point of attunement and returns the player to the choice. Nothing ends a run: there is no age, no lifespan, no checkpoint and no retry. ([ADR 0025](decisions/0025-lifespan-and-checkpoints-cut.md), replacing the 18 October rule 10.)
11. **See it before you can do it.** `require` shows a record; `need` + `needtext` says what is missing. Every cap hit posts one line naming the raiser if it is visible, and every patched per-level value names what patched it.
12. **Expeditions have a strain budget.** From B2, sites carry strain gauges (Arcanum's stressors): a site run drains one or two gauges; rest and techniques restore them; an emptied gauge ends the outing with its discoveries kept. Cloudwell's three stages are strain events.
13. **Scheduling agency grows.** The bounded waiting list is there from the first slice (rule 9); B3 grants one hobby slot (a zero-attention filler that runs while paused); later tiers raise the bank and add a second activity slot.
14. **Six fields are derived; everything else is history.** `max`, `rate`, `open`, `length`, `yield` and `discount` are rebuilt from content plus what the character has done after every change and on load, and only the history is saved. Contributions come from a record's `mod` while owned (times the units held, for a resource), from a family's `perLevel` times its levels, and from the `at` and `every` thresholds it has passed. A path whose second segment is `mod`, `scrolls.mod.lore.rate`, patches what *that* record pays and is folded in before it pays, so a late upgrade raises what early levels already gave. ([ADR 0021](decisions/0021-compounding-vocabulary.md).)
15. **Learn, attune, use.** A family is practised. A technique marked `attune` must hold a place in Attunement before it can be used at all, and places are scarce and raised by content. Using one is instant and spends qi. Two methods that read the same thing differently `lock` each other and `warn` in words before the choice is made. ([ADR 0023](decisions/0023-techniques-and-attunement.md).)
16. **History crosses a module boundary as a tag counter.** A record lists route keys in `tags`, and `g.t_<key>` counts the owned records carrying that key. Later content asks `g.t_school_body >= 1`, never `g.clear_channel > 0`. Keys ride on methods, so what a route taught is something the player chose to hold rather than a flag they tripped. ([ADR 0024](decisions/0024-route-keys.md).)
17. **A fight is prepared, then swung out.** The cultivator brings Life (a fight-only store that returns slowly on its own and quickly under Rest), Strike, Guard, Speed, Hit and Dodge; families, classes and breakthroughs raise them like any cap, and each attuned method adds its `held` table while it holds a place. A fight is one timed run on the stats recorded as it begins. Each side's readiness fills by its Speed per second and it swings at 5; a swing lands with chance Hit × (1 − the other's Dodge) for Strike over the other's Guard. The fight ends when a side falls, or is lost when the run's length runs out; it cannot be left halfway. A loss costs the Life taken and the preparation used, never a discovery (rule 10). Every swing is rolled, so the tooltip leads with an exact win chance graded certain, likely, close, loss or hopeless, and names the cheapest change that would raise it, rather than a promise; it plays out in its own Fight view. ([ADR 0026](decisions/0026-combat-exchanges.md).)

Tempo: **hybrid.** Opening through Foundation at active incremental tempo (instant chores, sites of at most three minutes, and about ten minutes of honest play to Foundation, [ADR 0028](decisions/0028-ten-minute-foundation.md)); B2-B4 durations ramp into hours as the bank cap grows 1 h → 6 h → 24 h → 72 h. The measured figure is in [`playtest/SIMULATION-REPORT.md`](../playtest/SIMULATION-REPORT.md). The 3-5-day Cloudwell target stays a provisional hypothesis.

---

## Part B: Campaign skeleton

### B.1 The technique web (B1-B4)

Shapes taken from Arcanum's skill graph (`MECHANICS-STUDY.md §1b`): a trunk with a threshold clock, source-gated entries, two-parent bridges, class-gated masteries that drain the line's resource, cross-feeding helpers, OR/action entries. Twenty techniques through B4.

**Trunk and shared**

| Technique | Entry | Per level | Gates (threshold clock) |
|---|---|---|---|
| **Lore** | Cracked Jade Slip | +1 herbs cap; +5% teaching-record speed | 2 Shu's reading · 3 every line entry · 5 every bridge · 8 Golden Cauldron, second-tier teachings · 10 every mastery |
| **Qi Sense** | Cracked Jade Slip | +1 qi cap; +5% Lore rate | sites at 1/2/3; bridges needing perception |
| **Settling** | action: 2 sites completed | +1 strain cap (all gauges) | expeditions from B2 |
| **Composure** | Settling ≥ 4 | strain rate −5% | Cloudwell pause |

**Lines.** Each has a flow resource (generated by its entry per level, drained by its mastery and its recipes) and a gathered material.

| Line | Entry technique (need: source + Lore 3) | Flow / material | Mastery (entry ≥ 10 + tag; runs flow) | Bridges (two parents, Lore 5) |
|---|---|---|---|---|
| **Body** | **Circulation**. Source: channel stones *or* steady-attention (opening); per level: Vigor cap +2, Vitality max +1, rate +0.01 | Vitality / Marrow herbs | **Tempering**: carry +1, hazard strain resist | **Rooting** = Circulation 5 + Ground Reading 3 (stationary ground connection; feeds Circulation rate +0.05/lv) · **Quenching** = Blade Intent 5 + Circulation 3 (reinforced edge; feeds Blade Intent rate) · **Tonics** = Refining 3 + Circulation 3 (conditioning doses; feeds Circulation rate) |
| **Sword** | **Blade Intent**. Source: practice post; per level: contact yield +10%, Edge max +1 | Edge / whetstone grit | **Severing**: opens sealed things; cut range | **Projection** = (Blade Intent 5 **or** Array Craft 5) + Qi Sense 4; alt-entry: sit Fernhollow ×10 (will beyond the body; range +1/lv; Will max +1; feeds Qi Sense rate) · Quenching (above) |
| **Earth** | **Ground Reading**. Source: survey stakes; per level: surveys reveal +1 feature, Ground-qi max +1 | Ground-qi / veined ore | **Vein Sense**: deposits, stable lines through disturbance | Rooting (above) · **Anchoring** = Ground Reading 5 + Array Craft 3 (terrain-bound arrangements; feeds Array Craft cap +0.1/lv) |
| **Formation** | **Array Craft**. Source: drawing board + inked tokens; per level: arrangement efficiency +1, Pattern max +1 | Pattern / inked tokens | **Fixing**: durable arrangements, site modifiers | Anchoring (above) · Projection (above) · **Warding** = Projection 5 + Array Craft 5 (triggered responses; event hooks) |
| **Alchemy** | **Refining**. Source: vessel + herb rack; per level: recipe tier access, Essence max +1 | Essence / pill residue | **Transmutation**: demanding transformations (Golden Cauldron's payoff) | Tonics (above) · **Extraction** = Refining 3 + Qi Sense 3 (preserve fleeting properties; feeds Refining rate) |

Spirit has no entry of its own in B1-B4: it *is* Projection and Warding, and the Spirit tag comes from Sword/Formation/Spirit classes (accepted). A Spirit-first entry (a "Communion" technique with its own source) is the natural B5 addition if play shows demand.

Mastery tags remain exactly as ADR 0015 defines them. Techniques are what tags *do*; bridges are where history-dependent opportunity lives. Each line's techniques are learned, attuned and used (rule 15), so a line's depth is also a question of how many of its methods a cultivator can hold at once.

### B.2 Breakthrough ladder

A breakthrough pays caps, unlocks and bank cap. It has no life term ([ADR 0025](decisions/0025-lifespan-and-checkpoints-cut.md)).

| # | Name | Core (mandatory) | Supporting: N of M | Bill | Closes | Class |
|---|---|---|---|---|---|---|
| 1 | **Foundation** | Circulation ≥ 2 | 3 of 4 (Part C) | 10 herbs and 40 coin, full qi (not spent); Settling 3 min | mill work once ferry hauling is taken up | none; raises the Circulation cap by 2 and opens the ferry road, Old Ridge, the Cottage and four B2 teaching records |
| 2 | **First Direction** | the line's family at 4 (Circulation, Blade Intent, Ground Reading or Array Craft) and its drills begun | 3 of 4: {Lore 4; a furnished home (a cot, a herb plot or a strongbox, read as `g.t_furnished >= 1`); a method of the line's school used (two for the body); two hundred coin earned in wages} | 20 herbs, 12 line material, 60 coin | the other three directions | Body Disciple / Sword Disciple / Earth Listener / Formation Student |
| 3 | **Second Direction** | intended class's technique gate (B.3): entry ≥ 8 for depth, bridge ≥ 3 for hybrids | 3 of 5 (ADR 0016's five, as pointers: reliable method = entry at cap; returning-chime site cleared; study arrangement installed; survey spur reopened; a paid commission) | 40 herbs, 20 line material, 150 coin | same-tier rivals | Iron Marrow / Mountain Vessel / Blade Body / Spirit Blade / Earth Array / Deep Listener / Array Keeper / Pill Refiner |
| 4 | **Cloudwell** | ADR 0018's three conditions + intended class's technique gate (mastery technique ≥ 3 for depth, bridge ≥ 5 for hybrids) | — | per approach (ADR 0018) | same-tier rivals; waystation job once basin work is taken | Jade Body / Sword Heart / Vein Adept / Grand Array / Mountain Heart / Stone Ward / Spirit Warden / Spirit Alchemist / Golden Cauldron |
| 5-8 | as CAMPAIGN-OUTLINE's roles | — | 3 of 5 | — | — | one per line per tier; B6 requires a permanent-transformation record |

**Built in this plan: B1-B4 only.** Breakthroughs 5-8 are outlined in shape only, with no content.

### B.3 Classes as keys (B2-B4): verified by `b4-gates.py`

Gates are **techniques**, not bare cap numbers (as Arcanum: Necromancer needs `reanimation ≥ 7`). Roster 4 / 8 / 9; Arcanum's core tiers run 5 / 6 / 9 / 7. Three additions over ADR 0016/0017 (marked ★), each one key record into a module that already exists: they restore "three from one line" for Earth and Formation and give Sword starters a second B3 route.

| Class | Tags | Gate | Raises | Unlocks |
|---|---|---|---|---|
| Body Disciple | Body | Circulation ≥ 3, its introduction used | Circulation +3 | Body tier 1 |
| Sword Disciple | Sword, Spirit | Blade Intent ≥ 3 | Blade Intent +3, Projection +1 | Sword tier 1 |
| Earth Listener | Earth | Ground Reading ≥ 3 | Ground Reading +3 | Earth tier 1 |
| Formation Student | Formation, Spirit | Array Craft ≥ 3 | Array Craft +3, Projection +1 | Formation tier 1 |
| Iron Marrow Adept | Body | Body ≥ 1, Circulation ≥ 8 | Circulation +3 | Body tier 2 |
| Mountain Vessel | Body, Earth | Body or Earth ≥ 1, Rooting ≥ 3 | Rooting +3, both entries +3 | Body next, Earth next |
| ★ Blade Body | Sword, Body | Sword or Body ≥ 1, Quenching ≥ 3 | Quenching +3, both entries +3 | Sword next, Body next |
| Spirit Blade | Sword, Spirit | Sword or Spirit ≥ 1, Projection ≥ 3, Blade Intent ≥ 5 | Projection +3, Blade Intent +3 | Sword tier 2 |
| Earth Array Adept | Earth, Formation | Earth or Formation ≥ 1, Anchoring ≥ 3 | Anchoring +3, both entries +3 | Earth next, Formation next |
| ★ Deep Listener | Earth | Earth ≥ 1, Ground Reading ≥ 8 | Ground Reading +3 | Earth tier 2 |
| ★ Array Keeper | Formation | Formation ≥ 1, Array Craft ≥ 8 | Array Craft +3 | Formation tier 2 |
| Pill Refiner | Alchemy, Body | Refining ≥ 5 (open) | Refining +3, Tonics +3 | Alchemy tier 1 |
| Jade Body | Body | Body ≥ 2, Tempering ≥ 3 | Tempering +2, Circulation +3 | Body tier 3 |
| Sword Heart | Sword, Spirit | Sword ≥ 2, Severing ≥ 3 | Severing +2, Blade Intent +3 | Sword tier 3 |
| ★ Vein Adept | Earth | Earth ≥ 2, Vein Sense ≥ 3 | Vein Sense +2, Ground Reading +3 | Earth tier 3 |
| ★ Grand Array Adept | Formation | Formation ≥ 2, Fixing ≥ 3 | Fixing +2, Array Craft +3 | Formation tier 3 |
| Mountain Heart | Body, Earth | Body ≥ 1 & Earth ≥ 1, Rooting ≥ 5 | Rooting +3, both entries +2 | Body next, Earth next |
| Stone Ward | Earth, Formation | Earth ≥ 1 & Formation ≥ 1, Anchoring ≥ 5 | Anchoring +3, Fixing exists at Formation ≥ 1 | Formation next, Earth next |
| Spirit Warden | Spirit, Formation | Spirit ≥ 2, Warding ≥ 3 | Warding +3, Projection +2 | Formation next |
| Spirit Alchemist | Spirit, Alchemy | Spirit ≥ 1 & Alchemy ≥ 1, Extraction ≥ 5, Projection ≥ 3 | Extraction +3, Projection +2 | Alchemy next |
| Golden Cauldron | Alchemy | Lore ≥ 8, Refining ≥ 5 (open); bill 80 herbs + 400 coin (newcomer) / 40 + 200 (Pill Refiner) | Refining +3; +1 to every open entry | Alchemy next; Transmutation exists |

Result (`b4-gates.py`): **15 A→B histories** (Body 4, Sword 3, Earth 4, Formation 4), every one with ≥ 2 B4 options and ≥ 1 specialist; every line supports a pure three-class chain. Golden Cauldron is reachable from all 15; the rarest specialist (Sword Heart, Spirit Warden, Stone Ward, Grand Array, Spirit Alchemist) from 2 each.

**Diversity audit.** Mechanically the five lines differ by *what their resource buys*: Body spends Vitality on access (places you can carry into, strain resistance); Sword spends Edge on openings (sealed things, cuts at range once Projection is in); Earth spends Ground-qi on information (routes, deposits, stable lines); Formation spends Pattern on persistent modifiers (home and site arrangements, triggered wards); Alchemy spends Essence on consumables that change other tasks' costs. Hybrids are a third verb, not a sum: Rooting (stationary connection), Quenching (reinforced edge), Anchoring (terrain-bound arrangement), Warding (event hook), Extraction (preservation), Tonics (conditioning). Thin spots, deliberately deferred: no Spirit-first entry before B5; no water/fire/wood elements (Earth is the chosen element, per the original design); no beast/companion line (summons excluded by the class map).

**Lines are told apart by their modules.** Each line's module uses different *verbs* instead of a shared template: Body = load, hazard and endurance tasks whose payoff is access (places you can carry into); Sword = contact precision tasks whose payoff is yield and opening sealed things; Earth = survey sites whose payoff is routes and deposits; Formation = arrangements whose payoff is home and site modification; Alchemy = recipes whose payoff is consumables that change other tasks' costs. Stone Ward makes a durable boundary at a site (a persistent site modifier); Spirit Warden makes a triggered response (an event hook). Those are different record *kinds*; neither is a +3 on a shared template.

### B.4 Line modules: tier template, instantiated per line with that line's verbs

Per tier: 3 practice tasks for the entry technique (the top one raises its cap +1 once), 1 arrangement that raises the cap +1 and 1 that raises rate (the *source* for the next tier's technique), the line's flow resource (max raised by the arrangement) and material, 2 recipes or equivalents that spend the flow, 2 sites (first clear +1 cap; repeat yields material; strain gauges), 1 teaching record (Lore ≥ k), and **the bridge content shared with a neighbour** (one practice task and one site per bridge, listed in both modules). ≈ 14 records per tier.

Build order: **Body tier 1-3, Earth tier 1-3, the Rooting bridge and its classes (Mountain Vessel / Mountain Heart)**, then Formation (+ Anchoring, Warding), Sword (+ Projection, Quenching), Alchemy (+ Tonics, Extraction). Two lines and one bridge fully authored is the smallest version of Part B that tests Part A on a real lattice: a pure chain, a hybrid chain, and the fallback.

### B.5 Home

| Tier | Name | Space | Rate | Unlock | Closes |
|---|---|---|---|---|---|
| 0 | Hayloft | 2 | — | start | — |
| 1 | Lean-to | 4 | — | 40 coin + 6 timber | Hayloft (on move) |
| 2 | Cottage | 8 | qi +0.1/min | Foundation + 4 spans of floor (the Lean-to's) + 300 coin | Lean-to (on move) |
| 3 | Ridge Room | 10 | Ground Reading rate +10%, Lore rate −10% | B2 | none (relocation; village home retained) |
| 4 | Basin Lodging | 12 | coin −1/min rent | B3 | — |
| line homes | Mountain Hermitage, Blade Hall, Array Court, Still-room | 20-40 | line caps/rates | line tier 3 class | — |

Arrangements consume space; relocation carries what fits; place-bound arrangements are re-established (ADR 0006).

### B.6 Bank and activity budget

- Activity budget by stage, in ordinary activity time (provisional targets, not deadlines, and none of them measured): B1 ≈ 1 h, B2 ≈ 10 h, B3 ≈ 25 h, B4 ≈ 40 h, totalling ≈ 76 h to Cloudwell. There is no fictional calendar and no conversion to fictional time ([ADR 0025](decisions/0025-lifespan-and-checkpoints-cut.md)).
- Bank cap: 1 h → 6 h (B1) → 24 h (B2) → 72 h (B3); a Formation tier-2 arrangement adds +24 h. Accrual, one-for-one exchange and prompt delivery are [ADR 0007](decisions/0007-away-time-and-acceleration.md), unchanged.
- Setbacks: rule 10. A failed attempt costs its time and its used preparation and keeps everything earned.

---

## Part C: First playable slice, fully specified

The chapter after this slice, from the waystation's leads to the Second Direction and Reedmarket, is specified in [`CHAPTER-2-BASIN-ROAD.md`](CHAPTER-2-BASIN-ROAD.md) ([ADR 0030](decisions/0030-sphere-techniques.md), [ADR 0031](decisions/0031-basin-road-systems.md), [ADR 0032](decisions/0032-dungeons-rooms-in-one-run.md)); its retrofit of the ridge's First Direction is recorded there, and this Part's ridge rows are read through it.

Bound: cold start to Foundation in about ten minutes of honest play, then the ridge to the waystation ([ADR 0028](decisions/0028-ten-minute-foundation.md)). `bun run validate` fails a direct route outside 8–13 minutes to Foundation or with Circulation opening after 10, a preference route above 20, and any ridge route outside 12–24 minutes from Foundation to the waystation. **The measured figure lives in [`playtest/SIMULATION-REPORT.md`](../playtest/SIMULATION-REPORT.md) and nowhere else in this plan.** Every number below is provisional: unless this plan says a figure was measured, it was chosen, and all of the pre-20-October measurements were taken before ADRs 0021-0025. This section states the slice's shape; where it and the shipped JSON disagree, the JSON is the record of what runs and the correction belongs in §0. The 2-3-visit idle pattern still needs human play evidence.

### C.1 Stat sheet

| Quantity | Entry | Runway / cap | Per-level payout | Raised by | Gates |
|---|---|---|---|---|---|
| Coin | start | 20 | — | Pouch +30 (50); Strongbox +50 (100); the ridge's coffer +200 | purchases and bills |
| Coin earned | start (a ledger line) | unbounded | — | every wage: sacks +3, freight +6, Wen's wage +0.05/s until the ferry road; trades and bounties do not count | the First Direction sign "Two hundred coin earned in wages" |
| Herbs | start | 12 | — | Herb Lore +2 per level; herb rack +12; herb plot +4 | Shu's reading, Foundation bill, ridge teachings |
| Timber | field kit or Foundation | 6 | — | Labour +1 per level, +1 more per level once the field kit patches Labour | lean-to, furnishings |
| Stone | first channel walk | 8 | — | Stone Sense +2 per level | channel stones |
| Vigor | start (10/10, +0.2/s) | 10 | — | Circulation +2 and +0.01/s per level (+1 more per level once the channel stones patch it); Labour +1 and +0.005/s per level; cot +0.02/s | every chore; Rest adds +0.35/s, faster with a pallet (+25%) or a cot (+50%) |
| Qi | slip | 2 | — | Qi Sense +1 and +0.0005/s per level; Composure +0.002/s per level; practice mat +0.005/s; Foundation +10 | Foundation wants it full; every technique spends it |
| Attunement | Qi Sense 1 | 1 place | — | practice mat +1; Foundation +1 | a technique cannot be used unheld; Foundation's fourth pointer |
| Strain | Foundation (10/10, +0.02/s) | 10 | — | Composure +1 and +0.002/s per level | ridge outings |
| Life | Circulation opens (6/6, +0.02/s) | 6 | — | Circulation +2 per level; Foundation +4; first sparring win +1; Rest refills it in about five minutes | a fight needs 1 to start; only fights spend it |
| Strike | Circulation opens | 1 | — | Circulation +1 per level; *Steady the breath* and *Carry the current* +1 while attuned | fights (never in the ledger) |
| Guard | Circulation opens | 0 | — | Circulation +1 per level; *Settle the breath* +1 while attuned | fights (never in the ledger) |
| Speed | Circulation opens | 1 (a swing every 5 s) | — | Body Disciple +0.2 and Sword Disciple +0.1 (ridge) | fights (never in the ledger) |
| Hit | Circulation opens | 80% | — | Circulation +2 per level; Sword Disciple +10 (ridge) | fights (never in the ledger) |
| Dodge | Circulation opens | 5% (60% at most) | — | Circulation +1 per level; *Settle the breath* +5 while attuned; Body Disciple +5 (ridge) | fights (never in the ledger) |
| Lore | slip | 0→5 | Copy the slip +10% speed; each ridge teaching 5% cheaper; two ridge practices +5% | Shu's reading +1; Foundation +2 | lv1: field kit; lv2: Shu's reading; lv3: the ridge teachings; lv4: a First Direction sign |
| Qi Sense | slip | 0→5 | qi cap +1, qi +0.0005/s; the three walks and sits +5% speed; *Steady the breath* +1 Vigor; at 3: qi costs −10% | Foundation +2 | lv1: gathering, the channel walk, *Steady the breath*, Attunement, Composure; lv2: the hollow; lv3: channel stones, steady attention, a Foundation pointer |
| Circulation | `require`: slip; `need`: channel stones **or** three dusks in Fernhollow | 0→5 | Vigor cap +2 and +0.01/s; Life +2; Strike +1; Guard +1; Hit +2; Dodge +1; Settling +5% speed; ridge payouts | Foundation +2; the body teaching +2 (ridge) | **Foundation core** at 2 |
| Herb Lore | Shu's apprenticeship | 0→5 | herbs cap +2; at 2: herb costs −10% | herb rack +1 | lv1: herb rack; lv2: herb plot |
| Labour | start | 0→5 | Vigor cap +1 and +0.005/s; timber cap +1; at 3: Vigor costs −10% | field kit +1; Foundation +1 | — |
| Stone Sense | first channel walk | 0→5 | stone cap +2; channel circulation +5%, clearing the fall +10% speed; at 2: stone costs −10% | channel stones +1 | — |
| Composure | Qi Sense 1 | 0→5 | qi +0.002/s; breath practice +5%; Strain cap +1 and +0.002/s; at 2: Strain costs −10% | practice mat +1; Foundation +1 | — |
| Home space | start | 2 (Hayloft) | — | Lean-to +2 (4); Cottage +4 (ridge) | arrangements |
| Bank | start | 1 h | — | Foundation +5 h (6 h) | acceleration |

The shared file also declares the four ridge materials (cap 10 each), which appear with their teachings; they belong to the ridge chapter.

Practice runway: level *n* costs 60·*n* experience, and each practice pays the experience per second its record names (breath practice 8, the slip and the channel and attention exercises 6), scaled by its speed. A family's cap is its level cap; Lore levels open the listed gates. The additional B.1 cross-feeders and line resources are reserved for later modules.

### C.2 Places and people

- **Lowbridge**: a village where the mill stream meets the ferry road; the wilds beyond the ridge. Home: the hayloft above Miller Wen's barn.
- **Miller Wen**: Mill Work; later the ferry hauling and commissions.
- **Granny Shu**: herb-wife and peddler. Her stall offers herb-sorting from minute 0; after three sorts she takes you on as her apprentice (5 coin), and then sells you the cracked slip "nobody wants" (6 coin). At Lore 2 she reads its hard characters for five bundles (Lore cap +1).
- **Headman Lu**: posts the Mill Channel bounty.
- **Mill Channel**: the damaged stream channel: awkward terrain, clear qi.
- **Fernhollow**: the sheltered hollow: accessible, faint qi.

### C.3 Records (`require` = visible, `need` = startable with `needtext`)

**Work** (instant, rule 9: each click pays its cost and lands its result; never takes the activity slot)

| id | require | cost | result | at |
|---|---|---|---|---|
| mill_work "Haul sacks at the mill" | — | vigor 2 | coin +3 (counted as wages); Labour exp +4 | 5: Wen's wage, +0.05 coin/s and +0.05/s coin earned; 20, 40, 80: +1 coin each |
| sort_herbs "Sort herbs at Granny Shu's" | — | vigor 1 | herbs +1; Herb Lore exp +3 | 25: +1 bundle |
| gather_herbs "Gather herbs by the stream" | Qi Sense ≥ 1 | vigor 3 | herbs +3; Qi Sense exp +5; Herb Lore exp +4 | 10: +1; 30: +1 |
| cut_timber "Cut timber beyond the mill" | field_kit | vigor 4 | timber +2; Labour exp +5 | — |
| ferry_hauling "Haul freight to the ferry" | foundation | vigor 3 | coin +6 (counted as wages); Labour exp +4; the first load closes mill_work and ends Wen's wage (its `mod` cancels both rates; "Wen hires a boy") | 20: +2; 50: +2 |

**Passive income** (rule 9 as amended: no sustained earner in chapter one; small rates that never take the slot and accrue while away)

| source | good | from | pays |
|---|---|---|---|
| Wen's wage (`mill_work` at 5 sacks) | coin | the fifth sack, until ferry hauling is taken | +0.05/s, a coin every twenty seconds; counted toward coin earned in wages |
| Shu's racks (`shu_apprentice`) | herbs | apprenticeship | +0.02/s, a bundle every fifty seconds |
| herb rack, herb plot | herbs | lean-to furnishings | +0.005/s and +0.01/s |
| practice mat | qi | the mat | +0.005/s |

Clicking a chore stays the best-paying tempo; the passive rates are the unattended floor, so the slice's measured pace stops depending on how fast the route script clicks. A sustained activity that cannot pay one more second of its drain is refused rather than started, and the activity it displaces waits at the front of the list rather than being lost.

| id | require | need (refusal) | effect |
|---|---|---|---|
| rest "Rest" (continuous, `autoStart`, fills Vigor and Life) | — | refused when both are full ("Vigor and Life are already full.") | Vigor +0.35/s on top of its own +0.2/s; Life max/300 per second (empty to full in about five minutes); Composure exp +0.3/s while *Settle the breath* is attuned (`g.settle_breath.attuned`); stops when both are full |

**Purchases** (instant; the bill is the price)

| id | require | cost | mod |
|---|---|---|---|
| coin_pouch "A larger coin pouch" | coin ≥ 12 | 15 coin | coin cap +30 |
| shu_apprentice "Apprentice to Granny Shu" (class) | sort_herbs reps ≥ 3 | 5 coin | opens Herb Lore; herbs +0.02/s |
| jade_slip "Cracked jade slip" | shu_apprentice | 6 coin | opens Lore, Qi Sense and qi; unlocks breath_gathering, fragment_notes, the practice mat |
| field_kit "Cord, stakes and a hook" | Lore ≥ 1 | 20 coin | Labour cap +1, and Labour's timber cap +1 more per level; unlocks cut_timber and timber |
| shu_reading "Granny Shu reads the hard characters" | Lore ≥ 2 | 5 herbs | Lore cap +1; Copy the slip +5% speed per Lore level |

**Practice** (continuous; stop at chosen objective)

| id | require | need (needtext) | effect per second | cap |
|---|---|---|---|---|
| breath_gathering "Practise the slip's breath method" | jade_slip | Qi Sense below its cap **or** qi below its cap ("The reservoir is full and the slip says nothing more; the next character is missing.") | Qi Sense exp +8; qi +1 every second, including at the knowledge wall | — |
| fragment_notes "Copy and compare the slip" | jade_slip | Lore below its cap ("The surviving leaves have given up all they hold.") | Lore exp +6; Composure exp +0.6 | — |
| channel_exercise "Circulate at the channel stones" | channel_arrangement | Circulation below its cap ("This reading of the method has reached its limit.") | Circulation exp +6; Stone Sense exp +1.2; +50% speed from the stones | — |
| steady_attention "Steady-attention exercise" | sit_fernhollow reps ≥ 3 | Qi Sense ≥ 3 and Circulation below its cap ("Qi Sense 3, and room left in Circulation.") | Circulation exp +6; `faint_trace` once Circulation reaches 2 after this exercise has run | — |

**Breakthrough**

| id | require | need (needtext) | bill | length | result |
|---|---|---|---|---|---|
| settling "Settle the foundation" | Circulation open | qi full ("A full reservoir; the slip's breath method fills it.") | 10 herbs, 40 coin, paid at the start | 3 min (1.5× with a carried turn) | Foundation; see below |

**Sites** (timed; every one runs 1.5× with a carried turn)

| id | require | need (needtext) | length | result |
|---|---|---|---|---|
| channel_observe "Walk the broken channel" | Qi Sense ≥ 1 | — | 90 s, once | stone +2; Stone Sense exp +40; discovery *flow pattern*; unlocks clear_channel |
| clear_channel "Clear the fall and reset the stones" | channel_observe | field_kit ("Cord and a hook, at the least.") | 2 min, once | coin +10 (bounty); stone +4; Stone Sense exp +80; discovery *the stones hum where the flow bends*; unlocks channel_arrangement |
| fernhollow_observe "Sit quietly in Fernhollow" | Qi Sense ≥ 2 | — | 90 s, once | Composure exp +30; discovery *a faint current, easy to lose*; unlocks sit_fernhollow |
| sit_fernhollow "Sit the hollow at dusk" | fernhollow_observe | Qi Sense below its cap or fewer than 3 sits ("The hollow's current has become familiar and Qi Sense has no room left.") | 90 s | Qi Sense exp +240; Composure exp +40; the third sit opens Circulation and unlocks steady_attention and settle_breath |

**Fights** (rule 17: timed, swung out across the run; optional, nothing required behind them)

| id | require | foe (life / strike / guard / speed / hit / dodge) | cost | time limit | if won |
|---|---|---|---|---|---|
| sparring_bout "Spar with the ferry hand" | Circulation open | Old Tam 4 / 2 / 1 / 1 / 75% / 20% | none; repeatable | 1 min | Labour exp +6 every bout; first win: Life cap +1 |
| ridge_bandit "Face the man on the porters' path" (ridge module) | ridge_outskirts | the man on the path 10 / 8 / 5 / 1 / 80% / 15% | vigor 4, herbs 3; Strain 0.06/s | 1 min | coin +15; the path cleared, opening his cache |

With the bare *Steady the breath* at Circulation 0 the bout is a likely loss (about 23%); a second method held makes it a likely win (about 84% with *Carry the current*, 88% with *Settle the breath*). The bandit needs Strike 6 to pass his Guard of 5. The direct routes reach Foundation at Circulation 2 with Strike 5 or 4, so there he reads "Cannot win"; the Body and Sword lines make him a near-certain win by their crossing, the Earth and Formation lines add no Strike. He is optional: the Earth and Formation teachings trace his cache without a fight (*Read the path for his cache*, *Mark out the path for his cache*: 90 s each at 0.04 Strain/s, setting `cache_found`), and the cache opens on `bandit_cleared` or `cache_found`. Because every swing is rolled, a likely win can still be lost; a loss costs the preparation and closes nothing.

**Methods** (rule 15: learned from the route, attuned into a place, used instantly for qi. Rule 16: each carries the route keys a later module reads.)

| id | require | need (needtext) | cost → result | at | held | keys carried | locks |
|---|---|---|---|---|---|---|---|
| steady_breath "Steady the breath" | slip + Qi Sense ≥ 1 | Vigor below its cap ("You are rested.") | qi 2 → vigor 4, +1 per Qi Sense level | 10, 25: +1 vigor | Strike +1 | `t_school_body` | — |
| carry_current "Carry the current" | channel_arrangement | no turn already held | qi 3 → a held turn; the next timed run goes 1.5× | 5, 15: −15% cost | Strike +1 | `t_channel`, `t_school_earth` | settle_breath |
| settle_breath "Settle the breath" | sit_fernhollow reps ≥ 3 | room in Composure or Lore | qi 3 → Composure exp +30, Lore exp +15; while attuned, Rest teaches Composure | 5, 15: −15% cost | Guard +1, Dodge +5 | `t_hollow`, `t_school_body` | carry_current |

The two readings of leaf eight close each other for good, and each `warn`s in words before it is attuned. *Steady the breath* carries no reading, so both routes share it. Attunement starts at one place; the practice mat adds one and Foundation adds another, which a ridge method fills: each of the four ridge teachings makes one attunable technique visible, carrying its school's key ([ADR 0023](decisions/0023-techniques-and-attunement.md), [ADR 0024](decisions/0024-route-keys.md)).

**Home** (the Hayloft has 2 spans of floor and a place to sleep and a place to practise; a slotted furnishing fills its place and takes no floor)

| id | require | need | cost | space or place | mod |
|---|---|---|---|---|---|
| hayloft "Hayloft above Wen's barn" (home tier 0) | start | — | — | 2 spans; rest and practice places | — |
| straw_pallet "Straw pallet" | shu_apprentice | — | 4 coin | rest place | Rest +25% |
| practice_mat "Practice mat" | jade_slip | — | 8 coin | practice place | breath practice +25%; qi +0.005/s; Composure cap +1; **a second attunement place** |
| lean_to "Lean-to" (home tier 1) | — | — | 40 coin + 6 timber | home space +2 (4); rest and practice places | closes the Hayloft on move (`warn`) |
| cot "A proper cot" | lean_to | — | 20 coin + 3 timber | rest place | Rest +50%; Vigor +0.02/s; carries `t_furnished` |
| herb_rack "Herb rack" | Herb Lore ≥ 1 | lean_to ("The lean-to first; the hayloft has no floor to spare for a rack.") | 10 coin + 2 timber | 1 | herbs cap +12; gather_herbs +1 bundle; herbs +0.005/s; Herb Lore cap +1 |
| garden_plot "Herb plot by the door" | Herb Lore ≥ 2 | — | 12 coin + 2 timber + 4 herbs | 1 | herbs +0.01/s; herbs cap +4; carries `t_furnished` |
| strongbox "Strongbox" | coin_pouch | lean_to ("The lean-to first; the hayloft has no corner safe enough.") | 25 coin + 2 timber | 1 | coin cap +50; carries `t_furnished` |
| channel_arrangement "Channel stones set in the floor" | clear_channel | Qi Sense ≥ 3 ("Qi Sense 3, to feel where the flow should bend.") | 4 stone | 2 | opens Circulation; channel_exercise +50%; Stone Sense cap +1; Circulation +1 Vigor cap per level; unlocks channel_exercise and carry_current |

The `t_furnished` key ("Furnished home") is what the ridge's direction signs read, so the ridge never names an opening furnishing ([ADR 0024](decisions/0024-route-keys.md)). Any furnishing that does not open a family can be taken down: its space is freed and its modifier reversed, and its cost is not returned. The channel stones stay once set. Stopping or replacing a paid site visit or Settling keeps its progress; starting it again resumes without paying again.

**Foundation (breakthrough 1)**

Visible once Circulation is open. **Core:** Circulation ≥ 2, the reconstructed method. **Supporting, 3 of 4:** Qi Sense ≥ 3 · both places walked · a lean-to of your own · **two methods held attuned**. The fourth pointer is the one §3.6 was missing: it cannot be satisfied by more of the work already done, only by acquiring a second method and committing a place to it (rule 15). **Bill:** 10 herbs and 40 coin paid at the start; qi must be full and is not consumed; the sitting takes three minutes. On completion: Circulation, Lore and Qi Sense caps +2; Labour and Composure caps +1; qi cap +10; Life +4; one more attunement place; Strain opens; bank cap to 6 h; the ferry crossing and the road to Old Ridge. A banner lists what changed; nothing pauses. The ridge chapter beyond Foundation is playable to the waystation, whose leads point at the next slice.

Neither route can skip the method: Circulation ≥ 2 is reachable only through the channel stones or steady attention, and both routes stay open to a player who visits both places. The route timings for this slice are measured by `bun run validate` and reported in [`playtest/SIMULATION-REPORT.md`](../playtest/SIMULATION-REPORT.md); figures taken before the 27 October honest-play routes ([ADR 0028](decisions/0028-ten-minute-foundation.md)) are superseded and are not repeated here.

### C.4 The slip

> *Lesser Breath-Gathering Method*, leaves 1, 2, 8 of twelve. "Sit as water sits. Draw the breath past the throat and let it pool below the navel. Feel for what is not air." Leaf 8: "…when the pooled breath turns, do not follow it. Wait at the turning. The rest is…" The remaining characters are chipped away.

Leaf 8's missing sentence is what the channel's humming stones and Fernhollow's steady attention each supply, differently.

### C.5 Session script

This table gives the order of beats and is not a schedule. It has never carried a measurement and does not carry one now; the measured run is in [`playtest/SIMULATION-REPORT.md`](../playtest/SIMULATION-REPORT.md), which compares itself against these beats.

| # | beat |
|---|---|
| 1 | Hayloft. Three actions: Haul sacks (2 vigor → 3 coin), Sort herbs (1 vigor → 1 bundle), Rest. Vigor 10/10, coin 0/20. The fifth sack puts you on Wen's wage, which then comes in on its own until the ferry road closes the mill. |
| 2 | Third sort: Granny Shu offers an apprenticeship (5 coin), and then the slip (6 coin). Slip bought: Lore 0/5, Qi Sense 0/5, qi 0/2 appear; breath practice, Copy the slip and the practice mat appear. |
| 3 | Lore 1: the field kit is visible. Qi Sense 1: gathering, the channel walk, *Steady the breath* and Attunement appear. |
| 4 | Qi Sense 2: the hollow appears. Qi Sense 3 is what the channel stones and steady attention ask for, and a Foundation pointer. Two leads. |
| 5 | Channel: walk (flow pattern, two stones), work for the kit, clear the fall (bounty), set the stones (Circulation opens 0/5, and *Carry the current* becomes learnable). Hollow: walk, then sit three dusks (the third opens Circulation 0/5, and steady attention and *Settle the breath* become learnable); steady attention leaves the faint trace once Circulation reaches 2. |
| 6 | The first real commitment: a place in Attunement, and which reading of leaf eight goes into it. The other closes, with a warning first. |
| 7 | Circulate to 2; "Lay the foundation" shows the core and 3 of 4 with the bill as held/needed rows; fill any gap. Settle. Foundation: a banner lists what it changed and the road onward opens; nothing pauses. |

### C.6 Interface

Left: resources `x/cap` with bars, Attunement among them so a filled place reads as the cap it is; families `level/cap` with the runway shown as pips and "what raises this" on hover. Centre: Work / Techniques / Sites / Home groups; instant, timed and perpetual read differently on sight; a technique shows whether it is attuned or waiting for a place; buttons show `needtext` greyed when visible-but-not-startable, and an irreversible one asks before it commits, naming what closes. Right: the log (discoveries, cap hits with raiser names, prose). Top: bank `x/cap` with an Accelerate toggle naming the current objective, the running activity, and the waiting list behind it once there is a second sustained activity. Character: the route keys currently held, each with the line that describes it.

---

## Part D: Data model

Record grammar (Arcanum's, reproduced in TypeScript; not a fork):

```
record := { id, name?, desc?, group?, tags?,
            require?: expr, need?: expr, needtext?,
            buy?: {res: n}, cost?: {res: n},
            length?: seconds | continuous,
            run?: {res: n/s}, effect?: {res: n/s}, result?: {res: n},
            mod?: {"<x>.max": n, "<x>.rate": n, "<x>.mod.<y>.<field>": n, ...},
            at?: {rep: {path: n}}, every?: {n: {path: n}},
            lock?: [ids], enable?: [ids], warn?: text, attune?: bool,
            tags?: [t_keys], fill?: res | [res], boost?: {flag, multiplier},
            max?: n, space?: n, slot?: name, strain?: {gauge: n},
            held?: mod,
            encounter?: {foe: {name, life, strike, guard, speed, hit, dodge}, success, failureText} }
family := record + { perLevel: mod }
expr  := boolean over g.<id> (level/count), g.<id>.max, g.t_<key>, classes, reps
```

Six fields are derived (`max`, `rate`, `open`, `length`, `yield`, `discount`), and nothing but the recompute writes them. They are the sum of a baseline and every contribution being paid: a record's `mod` while owned, times the units held if it is a resource; a family's `perLevel` times its levels; each `at` threshold passed and each `every` period completed. A path whose second segment is `mod` patches what *that* record pays, folded in before it pays, so a late upgrade raises what early levels already gave ([ADR 0021](decisions/0021-compounding-vocabulary.md)).

Kinds: resource, family, task, site, arrangement, home, class, breakthrough (core + pointers + bill), teaching, recipe, preparation, technique, purchase, flag, lead. One JSON per line module plus shared modules; route keys are named in `src/content.ts`, and no gate in a chapter's file names another chapter's record id, which `bun run validate` enforces; the shared file is the vocabulary both read, and its own reveals may name chapter records ([ADR 0024](decisions/0024-route-keys.md)). A technique's `g.<id>.attuned` reads 1 while it holds an attunement place; it is read-only and allowed only on records with `attune`. Saves are **v6** and hold only authoritative history: values, experience, repetitions, the attuned list, visibility, locks, log and bank. Every derived field is recomputed on load. Saves before v6 are not loadable ([ADR 0025](decisions/0025-lifespan-and-checkpoints-cut.md)).

Engine: TypeScript: one expression evaluator shared by the browser runtime and the Part E validator; 1 s tick; one active task with a bounded waiting list; objective stops; a recompute that settles to a fixed point because occupancy counts feed back into it; attunement places; bank accrual on wall-clock; acceleration = run ticks from bank until objective or pause; strain gauges. IndexedDB with export. Vue or plain DOM is a presentation choice, not a design one.

---

## Part E: Validation

Run on every content change, before any human plays:

1. **Reachability**: walk every `require`/`need` from cold start; every record reachable; every family's entry and every cap raiser reachable before anything that needs it. (Seeded by `opening-sim.py`.)
2. **No self-key**: no class is required by a record it unlocks.
3. **History coverage**: all A→B→C histories; ≥ 2 B4 options with ≥ 1 specialist; every line's pure chain reachable; every bridge's two parents reachable before the bridge. (`b4-gates.py`: 15 histories pass.)
4. **Pacing from data**: on honest play at empty bank, the direct routes reach Foundation in 8–13 min with Circulation open by 10, the preference routes within 20, and every ridge route reaches the waystation 12–24 min after Foundation ([ADR 0028](decisions/0028-ten-minute-foundation.md)); no timed record in this slice over 3 min; no pre-B4 task > 2 h ordinary; B1-B4 activity budget within 60-90 h.
5. **Mandatory-core check**: no breakthrough reachable with its core family at 0 (the defect the simulator found).
6. **Compounding**: every modifier and patch path names a record that exists; every family pays at least one effect per level; every chapter after the first patches an earlier one's payout.
7. **Keys**: every `t_` key a gate reads is carried by a reachable record; every key a record carries is read by something; no gate names another module's record id.
8. **Attunement**: every supported history can reach the number of places its gates ask for, a locked pair never leaves a history with no second method, and no route reaches more places than some route can fill at once (rule 74).
9. **Fights**: swings follow Speed and every landed blow follows Hit, Dodge, Strike and Guard under scripted rolls; the projected win chance matches the engine's own rolls and the verdict bands fall at 95%, 75% and 50%; the sparring bout is a likely loss with the bare method and a likely win with a second held, and with every swing landing it is won in ten seconds; route fights use a fixed seed so timings repeat.

Playtest questions, ranked:

1. Does training along a 3-level runway with per-level payouts, then hitting the wall, then moving it by a discovery, feel like *cultivation*, or like a quest flag with a number?
2. Channel vs hollow: a felt difference in how Foundation is reached (infrastructure vs perception), or click-everything?
3. Objective stops with an empty bank across a simulated return visit: clean?
4. Foundation's bill, lock (mill work closing when ferry hauling is taken) and new leads: a threshold, or a loss?
5. Is `needtext` enough to keep a stuck player from leaving?
6. With a wage that runs on its own, does anyone still click? Does the player who does feel rewarded rather than obliged?
7. Is the attunement place a real commitment? Does closing one reading of leaf eight land as a decision rather than a lockout?
8. With nothing able to end a journey, is the cap-and-bill economy enough pressure to make a commitment feel consequential ([ADR 0025](decisions/0025-lifespan-and-checkpoints-cut.md))?

---

## Part F: Supersessions and decisions

**Reversed or changed from accepted records**

| Record | Change | Why |
|---|---|---|
| ADR 0013 ¶2 | Clarified, not reversed: families have levels and caps; no global knowledge currency | The original refusal targeted a generic XP currency; levels/caps are what Arcanum does |
| ADR 0002 "spent banked time stays spent" | **Historical.** On 18 Oct this plan refunded bank spent since the checkpoint; on 20 Oct [ADR 0025](decisions/0025-lifespan-and-checkpoints-cut.md) removed checkpoints and retry altogether, and both the rule and its exploit are gone | The refund removed the spend-then-die penalty; cutting the system removed the reason for either rule |
| No lock rule | Jobs close when a better one is taken; homes close on move; class choice closes same-tier rivals; no revision | Arcanum locks at every tier; follows the fiction rather than a stage's toolset |
| Q114/Q123 foundation "within the first day" | Within the first session; later stages ramp. The bound is the validator's ten-minute band ([ADR 0028](decisions/0028-ten-minute-foundation.md)) and the figure is the simulation report's | Hybrid tempo; a measured number belongs in one place |
| Bank cap "a few days" | 1 h at start, raised by progression | Arcanum `offlinetime.max 3600`; the cap is a reward |
| Five B3 milestones as authored projects | Same five, as pointers into existing records | Arcanum's tier quests are pointers |
| ADR 0003 "no energy meter" | Kept for food; Vigor is a small stamina meter for chores only (owner, 19 Oct); qi is a continuous reservoir with run/rate | The rate economy is where homes and arrangements become felt; Vigor gives instant chores a cost without a timer |
| Rule 9 "every task is timed" (this plan, 18 Oct) | **Historical.** Replaced the same day by instant chores, then superseded on 20 Oct by [ADR 0022](decisions/0022-chore-tempo.md): tempo is `length`, instant chores are kept, each good gained one sustained `fill` earner, and the slot keeps a waiting list. On 27 Oct the earners gave way to passive rates (ADR 0022 amendment) | Timed chores made the opening a wait with nothing to click; chores that could only be clicked made the measured pace a property of the route script; the earners went unused on every direct route |
| ADR 0016 roster (5 at B3) | 8: adds Blade Body (Sword-Body bridge), Deep Listener (pure Earth), Array Keeper (pure Formation) | Every line must support "three from one line" (Arcanum's stated optimal play); Sword starters had one B3 route |
| ADR 0017 roster (7 at B4) | 9: adds Vein Adept (pure Earth), Grand Array Adept (pure Formation) | Same; each is one key record into a module that exists anyway |
| ADR 0015 "mastery totals are qualifications, not trainable levels" | Kept for tags; techniques are the trainable layer beneath them, and class gates name a technique | Arcanum gates classes on skills (Necromancer: `reanimation ≥ 7`), not on tag counts alone |

**Decisions recorded 20 October 2026 (ADRs 0021-0025), with 0026 (21 October), 0027-0031 (27 October) and 0032-0033 (28 October)**

| ADR | Decision | What it changes here |
|---|---|---|
| [0021: Compounding vocabulary](decisions/0021-compounding-vocabulary.md) | Six derived fields rebuilt from authoritative history; four contribution sources with their scales; `X.mod.Y` patches what a record pays and is folded in before it pays, so it repays earned levels | Adds Part A rule 14; amends rule 1, Part D's grammar and Part E check 6 |
| [0022: Chore tempo](decisions/0022-chore-tempo.md) | Tempo is `length`; chores stay instant and Vigor-paid; one slot with a six-deep waiting list and an `autoStart` Rest; a run that cannot sustain itself is refused. Amended 27 Oct: chapter one's earners become passive rates; loop-scaled earners belong to later chapters; Wen's wage counts as wages and ends at the ferry road | **Supersedes Part A rule 9**; amends rule 13 (the waiting list is not a B2 reward), Part C.3, C.5, C.6 and Part E check 4 |
| [0023: Techniques and attunement](decisions/0023-techniques-and-attunement.md) | Learn, attune, use: a technique must hold a scarce place in Attunement before it can be used, and the two readings of leaf eight lock each other with a warning. Amended 27 Oct: each ridge direction teaches one method, filling Foundation's third place; `g.<id>.attuned` reads a held method, and Rest teaches Composure while *Settle the breath* is held | Adds Part A rule 15; amends rule 2 and B.1, adds Part C.3's Methods table and Foundation's fourth pointer, and Part E check 8 |
| [0024: Route keys](decisions/0024-route-keys.md) | History crosses a module boundary as a `t_` tag counter carried by a method; later content reads keys, never another module's record ids. Amended 27 Oct: the ridge reads the school keys and adds sword and formation; `t_furnished` carries the furnished-home sign; the validator forbids a gate naming another chapter's record | Adds Part A rule 16; amends Part C.3 and Part E check 7 |
| [0025: Lifespan and checkpoints cut](decisions/0025-lifespan-and-checkpoints-cut.md) | No age, lifespan, fictional calendar, checkpoint or retry; one setback rule; the bank is unchanged; save v6, older saves not loadable | **Supersedes Part A rule 10** and ADR 0002; amends ADR 0007 and ADR 0019; strips the mortality terms from rules 5 and 12, B.2, B.6, C.1, C.3, Part D and Part E |
| [0026: Combat exchanges](decisions/0026-combat-exchanges.md) (21 Oct) | Fights as rolled swings on Speed clocks, with held methods as the preparation. Amended 27 Oct: an exact win chance and graded verdicts with a flip hint; Rest restores Life; the bandit is optional, since Earth and Formation trace his cache without a fight | Adds Part C.3's Fights table and Part E check 9 |
| [0027: Locks at payment and stops](decisions/0027-locks-at-payment-and-stops.md) (27 Oct) | A timed record's lock applies when its bill is paid; confirmations name what closes; discoveries never stop activity | Amends rule 9 and ADR 0007's stops |
| [0028: A ten-minute Foundation](decisions/0028-ten-minute-foundation.md) (27 Oct) | About ten minutes of honest play to Foundation; the validator's bands are the one bound | Replaces Part E check 4's bounds and the bound line that opens Part C |
| [0029: Crafting](decisions/0029-crafting-workbench-recipes-preparations.md) (27 Oct) | A workbench after Foundation; timed recipes make kit (held, carrying a `mod`) and doses; `preparation` is an instant kind that spends a dose | Settles the open part of ADR 0009; adds `preparation` to Part D's kinds |
| [0030: Sphere techniques](decisions/0030-sphere-techniques.md) (27 Oct) | Identity is the held set of sphere techniques: each sphere teaches an opposed pair per tier that lock each other with a warning; a Direction is one sphere-agnostic breakthrough that never locks and raises every carried sphere; titles are derived by ordered events and keep only their `X.mod.Y` patches; attunement places 3 → 4 → 5; save v7 | **Supersedes rule 2's "+3 to its line" and rule 6's "a class choice closes its same-tier rivals"**, B.2 rows 2–3 and B.3 as the class table; supersedes ADR 0015 and ADR 0016's roster (B4, ADR 0017, untouched); amends ADR 0023, 0024, 0026 §1 |
| [0031: Basin road systems](decisions/0031-basin-road-systems.md) (27 Oct) | A hobby slot at half pace beside the activity slot; Focus as a second gauge; foe techniques inside the exact win chance (stances were added and withdrawn the same day after the design audit); preparations that last and pay `held` while in effect | **Supersedes rule 12's "strain gauges"** with Strain and Focus and **rule 13's hobby schedule** (the Second Direction grants it); settles ADR 0026's open stances and foe techniques and ADR 0029's lasting preparation |
| [0032: Dungeons](decisions/0032-dungeons-rooms-in-one-run.md) (28 Oct) | A `site` in the `Dungeons` group carries `rooms` run in order inside the one slot, its `length` derived; doors (need, Life for a fight, a reserve for every room) at entry and between rooms; a lost room resets itself alone and ends the outing; first clears permanent, repeats pay materials and knowledge; the adit is the Second Direction's seventh pointer | Copies rule 27 (floors, leaving keeps progress) with inline rooms instead of rule 30's pool; settles ADR 0026's open "dungeons of several fights and how Life carries" |
| [0033: Home lists, place swaps, quick bar](decisions/0033-home-lists-place-swaps-quick-bar.md) (28 Oct) | Every arrangement names a Home category; a piece for a filled place swaps in with one click and the one it replaces is kept to swap back for nothing; place pieces are no longer taken down; a ten-key quick bar bound by Shift and a number | Copies rule 6 in full and rule 32's quick bar; amends ADR 0027 §3 (only floor pieces are taken down; a swap asks when it would release a method) |

**Unchanged**: eight breakthroughs; four starters as spheres; the B4 roster and its tags (ADR 0017, to be rewritten on ADR 0030's model when its chapter is designed; Golden Cauldron open entry per Q72); one activity at a time plus the hobby place (ADR 0031); 1:1 bank and its accrual, delivery and cap-as-reward rules (ADR 0007); Cloudwell structure (ADR 0018); noncombat viability; optional sects; desktop text-panel presentation; no morality axis (now recorded as a decision). Mastery counting (ADR 0015) and the B3 roster as bought classes (ADR 0016) are superseded by [ADR 0030](decisions/0030-sphere-techniques.md).

**Decisions taken in the 18 October revision (from the third-party recommendations)**: hybrid tempo; Golden Cauldron as the fallback, no scholar line; TypeScript engine implementing the grammar, Arcanum as reference not fork; Karma cut; B1-B4 only; Body + Earth + hybrid first.

**Owner decisions, confirmed 18 October 2026**: qi-as-reservoir is accepted under ADR 0003; `faint_trace` and the channel arrangement retain their distinct acquisition routes through B2 (no automatic convergence); the starred roster additions are accepted for later modules. Neither route blocks visiting the other place. Human playtest evidence, rather than further design questions, determines the next revision of this opening.
