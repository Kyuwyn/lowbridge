# Review response — Arcanum-inspired cultivation RPG design package (revised)

18 October 2026. Second pass. The first pass read the package alone; this one is re-run after a primary-source study of Arcanum (`research/arcanum-mechanics-2026-10-18/MECHANICS-STUDY.md`: pinned-source gating scan, timed opening on the testing build, wiki). Where the two passes disagree, this one wins and says why.

Conventions: **F** = documented fact with a reference; **I** = my interpretation; **R** = recommendation. Staffing assumption for scope judgments: one author doing rules, content, UI, and validation.

---

## Overall assessment

> **Revised 18 Oct after third-party review.** Two over-claims below are withdrawn: (1) the "59/60 skills start at cap 0" reading of Arcanum (skills default to cap 5 — `src/items/skill.js`); (2) blaming most weaknesses on ADR 0013's no-numbers clause. The corrected diagnosis is milder and, I think, more useful: the original refused to commit to concrete numbers, rates, or state transitions *anywhere*, so every progression beat became a bespoke prose scene. ADR 0013 was arguing against a global XP currency, not against skills having levels and maxes; it is one symptom, not the cause. Findings 5, 7 and 8 are also softened below where the reviewer showed I was treating deliberate choices as omissions.

**The design kept Arcanum's shape and lost its machine.** It has tiers (eight breakthroughs), cumulative classes with overlapping expertise, "N of M" advancement quests, one home, an offline bank, optional combat, and a cheap-generalist entry. All of those are faithful. What it does not have is the layer that makes Arcanum's shape work: **capabilities as numbers — gated at entry, with a short visible runway where each level pays out, then a wall that only classes, arrangements and discoveries move.** Without that layer, classes are labels, readiness is a checklist, and the stretch between breakthroughs has nothing to climb.

The absence is pervasive rather than decided: the opening draft has no number with a unit, no cap, no rate. ADR 0013's disclaimer of "a numerical knowledge-point currency, resource cap formula, or universal activity count" reads, in context, as a refusal of a *generic* currency, which is correct; it should not be read as a refusal of levels and caps, and the design plan should say so rather than "reverse" it.

The documents themselves are a 123-question interview ledger (767 `Qnn` references, 365 "remains open" hedges in `design/`), not a design. The opening slice's source document, `OPENING-DRAFT.md`, contains no number with a unit, no named character, and no cap. Your sense that the process "went off the rails" is right; the rails (what a breakthrough numerically does) were never laid, so each question added another car.

**Strengths that survive both passes:** the mortal-village → qi-discovery → two-route foundation opening; cumulative class history with mastery counts (closer to Arcanum than the superseded three-path model); the anti-footgun rules (no class supplies its own prerequisite; every route noncombat-viable; no food meter; no hidden quizzes); the Cloudwell mid-trial pause as a real resource tradeoff; the three-way separation of real time / activity time / age.

---

## Faithfulness

| Arcanum quality (verified in source) | Design status | Verdict |
|---|---|---|
| Skills gated at entry (`require`/`need`/`buy`), default cap 5, per-level payouts; classes raise caps above the runway and open some entries | ADR 0013 states the wall in prose; no runway, no per-level payout, no entry split, no numbers | ✗ lost — the spine |
| Gated content re-raises its own cap (corpsestudy, phylactory, siversnecro) so a specialist climbs between tiers | Class = teaching → demonstration → one application → stop | ✗ lost — no tree |
| Tier-up = 4 of N pointers into existing systems + a bill | B3 = 3 of 5 + class prep | ✓ shape kept; ✗ the five are bespoke scenes, not pointers |
| Tier-up locks tasks, homes, classes; homes lock homes; some locks hidden | No lock rule anywhere; earlier-class revision "remains open" | ✗ lost |
| Same-tier classes share one gate, differ by key and price | Starters share readiness, differ by crossing scene | ~ half kept (no key, no price) |
| One generalist line always takeable, priced in slow shared currency, broad/shallow, never holds an exclusive key | Golden Cauldron from any history, narrow (+1 Alchemy), unpriced, reaches a specialist field | ~ shape kept, balance lever missing |
| Morality gates whole modules (necromancy requires `evil2`) | Dropped, no ADR | ✗ lost silently |
| Homes: space cap + rates + locks, furniture holds early cap-raisers | "Capacity units and values remain undecided" (`HOME-DRAFT.md §Accepted home capacity`) | ~ concept kept, no numbers |
| First resource cap in ~6 clicks, tutorial class in ~3 min, first real stage ≲ 1 h | Foundation (no class) budgeted at ~8 activity hours; first class day 2–3 | ✗ one order of magnitude slower; a deliberate visit-driven choice, but then the incremental framing and the Arcanum pacing reference don't fit |
| Control as reward (Goals, Hobbies, extra slots, growing bank) | Bank fixed at "a few days"; no scheduling growth | ✗ lost |
| Hall / roster / prestige | Dropped for a finite ending | ✓ deliberate departure |
| Spellcraft, summons, dungeons, clashes | Dropped/replaced, no ADR | — fine; record it |

**I:** This is a different game in framing (finite, single life, aging, retry-to-checkpoint) and the same game in skeleton. Neither is the problem. The problem is that it is not yet an *incremental* at all: nothing has a number that a player watches fill, cap, and break.

---

## Prioritized findings

### 1. No numeric capability layer (blocks everything else)

**F:** `OPENING-DRAFT.md`: zero occurrences of cap/capacity/max; zero numbers with units. ADR 0013 ¶2 disclaims a "numerical knowledge-point currency, resource cap formula, or universal activity count." Arcanum: resources start capped (`gold.max 5`, `research.max 10`, `space.max 0`, `offlinetime.max 3600`); skills are gated at entry and default to `max 5` with per-level `mod`s (`skill.js`, `skills.json`).
**I:** Without levels and caps, "knowledge-limited practice" has nothing to limit, classes have nothing to raise, homes have nothing to hold, and the opening has no Pouch moment. Findings 2–6 are consequences. ADR 0013 is not the cause; it was refusing a generic XP currency, which is right.
**R:** Clarify ADR 0013 rather than reverse it: families have levels and caps; there is no global knowledge currency. Define a stat sheet for the opening: ~8–10 capped quantities, each with an entry gate, a 3–5 level runway with a per-level payout, what raises the cap, and what it gates. One page. Do this before any implementation plan.

### 2. Classes are keys in Arcanum and labels here

**F:** `CULTIVATION-CLASS-MAP.md §Choice A–C`: each class "adds +1" to mastery fields and has an "accepted lasting benefit direction" in prose. Mastery totals are "qualifications earned through classes, not currency or independently trainable skill levels." Arcanum: 48/50 classes are the first key to at least one zero-cap skill; `conjuration` has 7 class raisers and 0 non-class.
**I:** The design's mastery tags are Arcanum's `t_necroclass`-style tags — fine for gating later classes — but Arcanum classes *also* raise skill caps, and that is what makes them felt in play. A tag without a cap is a label.
**R:** Each class = (a) +1 to its mastery tags (keep) **and** (b) sole key to one technique family's cap, or +N to one already open. Seven B4 classes become seven key-sets over ~6 families, which is cheap.

### 3. Nothing to climb between breakthroughs

**F:** Per-class content in the drafts: one teaching source, one demonstration, one "optional first application" (`THIRD-BREAKTHROUGH-DRAFT.md §Accepted practice demonstrations`, `§first applications`; `FOURTH-BREAKTHROUGH-DRAFT.md` Q111–Q112). Arcanum's necromancy tree: 7 spells, crypt storage, 4 tasks of which 3 raise `necromancy.max` again, 1 skill, 1 upgrade — and the shadow module (12 classes share it) holds 21 tasks, 28 upgrades, 11 furniture.
**I:** This is the direct answer to Review Question 2. Arcanum fills the stretch between tiers with the specialist's own ladder; the design fills it with shared milestones, which is why it reads as a checklist.
**R:** One content module per mastery line (Body, Sword, Earth, Formation, Spirit, Alchemy): 10–20 records each — practice tasks, home arrangements, recipes, sites — several of which raise the line's cap. Classes are keys into deeper levels of the module. Author modules, not scenes.

### 4. Readiness is a faithful shape with the wrong contents

**F:** B3: "three of five": reliable method, returning chime, working study space, survey spur, crafting commission (`0016`). Arcanum T1: clear Under Den, clear Ruined Crypt, move home, unlock Scroll Loom (+2 skills), equip a real weapon — each a pointer into a subsystem the player already uses.
**I:** First pass called this "checklist drift"; wrong. The shape is lifted correctly. The cost is wrong: four of the design's five are bespoke investigations/scenes; Arcanum's are free because the systems exist.
**R:** Keep N-of-M. Make each M a pointer: "raise any line cap to 3", "install a home arrangement", "clear a site first time", "reach home space 10", "complete a paid commission". Zero new scenes.

### 5. Nothing closes

**F:** No lock-on-advance rule in any ADR. "Whether and how an earlier class choice can be revised remains open" (`CAMPAIGN-OUTLINE.md §Accepted scope`). Arcanum: T0 locks Study/Chores/Errands/Alcove/Attic; `apprentice` disables `cleanstables`; `hut/camp/wagon/cottage/house` all `disable: innroom`; Study silently locks Mystic Savant.
**I:** Breakthroughs that only add are not transformations. The design already forbids hidden quizzes (good, deliberate); visible-but-irreversible locks are the compatible substitute.
**R (softened):** Lock what the fiction removes, not a stage's whole toolset: a job is closed when a better one is taken up; a home tier is closed when the player moves out; a class choice closes its same-tier rivals. Record "no revision of earlier classes" as the decision. The original's "earlier places gain new uses" (ADR 0006/0012) is compatible with this and should stay.

### 6. Golden Cauldron: right idea, missing price and ceiling

**F:** ADR 0017: entry "from any current history," adds `Alchemy +1`, no particular cost. Arcanum mage line: `lore ≥ 10/14/18/25/30/35`, research 500 → 20 000 escalating, raises 6–10 caps by +1, never raises `necromancy`/`bladelore`/`demonology`.
**I:** A universal fallback is a deliberate Arcanum feature. Golden Cauldron is the mage line without the mage line's escalating generic price, without its breadth, and *with* access to the same Alchemy field a Pill Refiner → Spirit Alchemist climbs — so the fallback can reach a specialist's exclusive tree.
**R (revised):** Keep Golden Cauldron open-entry (ADR 0017/Q72 stand) but give it the mage line's shape: gate on the shared family (`Lore ≥ 8`) plus an escalating herb/coin bill; newcomers reach Alchemy 1 (broad utility preparations, +1 to existing family caps), Pill Refiner → Golden Cauldron reaches Alchemy 2 (the deep recipes). Do **not** add a separate scholar line: a class with no mastery tags at B3 leaves a player with zero specialist options at B4, which breaks ADR 0017 outright (third-party review, Finding 3).

### 7. Opening tempo is an order of magnitude slower than the reference

**F:** `PACING-PAPER-BUDGET.md` / `pacing-model.py` opening task list sums to ≈ 8 activity hours before foundation; first class on day 2–3 (`0019`); Q122 targets a decision every 8–12 activity hours. Arcanum testing build, scripted: resource cap at ~6 clicks, tutorial class < 3 min, ~15 unlock notices; first real stage ≈ 30–60 min [I].
**I:** The original chose a visit-driven pace deliberately (Q114: 2–3 short visits daily; bank-accelerated). That is legitimate. But a first-session player has an empty bank and sees an 8-hour arc; and the 3–5-day target plus the bank are an incremental's tools. The two framings are in tension.
**R:** Hybrid: the opening through Foundation at active incremental tempo (~30 min, 20–180 s tasks); post-Foundation durations ramp into the hours as the bank cap grows. The 3–5-day Cloudwell target stays as a hypothesis.

### 8. Morality absent — record the decision

**F:** No ADR mentions virtue/evil/karma. Arcanum: `evil1/2/3`, `good2`, `virtue` gate 9+ classes and the `necromancy` skill's existence; neutrality is a supported path (`q_t2morality`).
**I (softened):** With six mastery lines already accepted, leaving morality out is defensible scope control. The gap is that it was never decided.
**R:** One ADR: out for the first campaign. Note the xianxia analogue (karma, demonic cultivation) as a later option. Do not add an axis now.

### 9. Bank and lifespan incentives unresolved

**F:** ADR 0007/0019: pausing accrues bank and stops aging; spending preserves age cost; the bank survives checkpoint retries; cap "a few days." Arcanum: `offlinetime.max 3600` at start, raised by progression.
**I:** Two asymmetries: a player who *spends* bank on a stretch and then exhausts life loses both progress and days of stored time; a player who hoards it and dies retries with a full bank and full foreknowledge. The first punishes acceleration exactly where it is most useful; the second is a mild farm. A fixed large cap also removes a progression lever Arcanum uses.
**R:** Start the cap small (1 hour) and make raising it a reward. On a checkpoint retry, refund bank spent since the checkpoint (up to the current cap) and keep wall-clock accrual since then — a reversal of ADR 0002's "spent stays spent." Test empty-bank play first.

### 10. Pacing target is model-derived and fragile

**F:** Q123's 3–5 days replaced 7–14 after the paper model, not after play (`0019`). The model reproduces `recorded-results.json` exactly; 3–5 days holds only at 10-minute visits 2–3×/day on one Body route with "all leads understood"; 5-minute visits give 5.5–7.5 days; no failed prep, no confusion, no retry, no other history.
**R:** Keep as a hypothesis with fail conditions. Tune nothing to it.

### 11. Documents: history tangled with contract

**F:** `BRIEF.md:131` and `GLOSSARY.md:120–121` still state "one path is committed at a time … retraining" as current; ADR 0001/0005/0010/0013 say "three paths" without a superseded label; `CAMPAIGN-DRAFT.md` keeps the Body/Intent/Formation table; `PACING-DRAFT.md` keeps the 7–10/10–14-day ladders; `GLOSSARY.md:145` says starting age is open though ADR 0019 fixed 18/80; `Attempt` has two meanings; several terms used everywhere are undefined (objective, meaningful pause, settling draught, field archive).
**R:** One canonical current-rules page; move every Q-citation and superseded section to an append-only history file. Delete, don't annotate.

### 12. Reachability asserted, not shown

**F:** The class map checks mastery-gate eligibility for 11 A→B histories and 25 A→B→C routes; teaching sources, materials, sites, and lifespan budgets are open. No dependency graph exists. No self-prerequisite cycle is documented and the map forbids one.
**R:** After the cap layer exists, generate the dependency DAG from data (as Arcanum's `require` strings allow) rather than hand-auditing prose.

---

## QoL / sanity pass

- Unrecorded drops: spellcraft, summons, dungeons, clashes, Hall, morality, automation growth. Write one ADR listing them; most are correct.
- Drafts open with a paragraph of Q-citations before any content. A reader cannot find "what is true now" in under an hour.
- `OPENING-DRAFT.md` has no fragment text, no NPC, no price, no duration. The implementation plan cannot start from it.
- Arcanum already ships a cultivation-flavoured sword line and an Elegant Pagoda with a "Breakthrough" upgrade; the theme fits the reference and its audience.
- The `support/pacing-model` is sound as arithmetic and honest in its README. It counts task starts as "decisions"; label them as such.

---

## First playable slice

The checkpoint's bound (village → shared foundation) is right. The contents need to change from "scenes" to "caps."

**Build**

- 1 village, 1 home with a space cap and 2 arrangements, 1 paid job with a repetition curve, 1 purchase that raises a cap (the Pouch moment), both investigations, 1 technique family per route each starting at cap 0 and raised by its route's discovery, foundation as "N of M pointers + a bill" that **locks** the pre-foundation job and raises lifespan.
- Save/load, age, objective stops, bank starting at 1 hour.
- No classes, no waystation, no Cloudwell.

**Test, in order of uncertainty**

1. Does the first cap/raise/reveal loop produce the Arcanum "what just opened?" feeling within the first session?
2. Does raising a technique cap through discovery (not repetition) read as transformation, or as a gate?
3. Does channel-vs-hollow feel like choosing a tree, or do both converge invisibly?
4. Does foundation locking the pre-foundation job feel like growing up or like loss?
5. Short visits with an empty bank: fine, or dead?

**Wait:** everything from Q56 onward (B2–B4), the class map, Cloudwell, morality, sects, combat, relocation.

**Decide before coding (three, not thirty):** (a) reverse ADR 0013's no-numbers clause and write the opening stat sheet; (b) incremental or narrative tempo; (c) classes lock rivals and breakthroughs lock stages — yes or no.

---

## Unverifiable from this package

Enjoyment, real visit cadence, any non-Body history, production capacity, whether a finite ending replaces the Hall's replay value. The Arcanum mechanics study scanned one classline module (shadow); other lines exist and were not scanned, so its downstream counts are lower bounds.
