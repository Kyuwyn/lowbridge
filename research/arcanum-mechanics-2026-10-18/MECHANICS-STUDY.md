# Arcanum / Theory of Magic: mechanics study, 18 October 2026

Companion to `research/arcanum-study-2026-10-16/` (scope census, class/mastery study). That folder answers *what Arcanum contains*. This one answers *how Arcanum works as a machine*, because the design documents inherited the catalog view and not the mechanism, and several review findings turned on it.

## Sources and method

| Source | What was done |
|---|---|
| Pinned source `a2632d2edf3e07e9168fff81167b11f2792e9197` (stable 0.12.3.1), `data/*.json` and `data/modules/{learning,swordplay,extraaction,classline/shadow}.json` | Fetched raw; scanned 998 records (plus the shadow module) for `require`/`need` strings and `mod`/`result` keys to build a class → skill-cap → gated-content graph. Output in `gating-evidence.json`, `task-curves.json`, `homes.json`. |
| Testing build `https://arcanumtesting.gitlab.io/arcanum/` (`unstable 0.12.12.9`) | Played the opening with a scripted autoplayer (click work when stamina ≥ 1, else rest; buy anything new; study when scrolls ≥ 1). Logged unlock order and wall-clock time. |
| Wiki `https://theoryofmagic.miraheze.org` (documents stable 0.12.0.0) | `Guide:New_players`, `Classes`, `Home`, `Main_Page`. Used for tier-quest lists, tier locks, home table, and the community's stated strategy. |

Three versions are in play (0.12.0.0 wiki, 0.12.3.1 pinned source, 0.12.12.9 testing). Structure is identical across all three; individual numbers drift. Numbers below are from the pinned source unless marked *(wiki)* or *(testing build)*.

Not done: a full playthrough, mobile, save recovery, combat/spellcraft depth, Hall. Shadow is the only classline module fetched (others 404 at that path); other lines exist in the manifest and were not scanned, so "downstream" counts are lower bounds.

## 1. The spine: gated entry, a 5-level runway, and caps that only move from outside

> **Corrected 18 Oct (after third-party review).** The first version of this section claimed "59 of 60 skills start at cap 0 and cannot be trained until a class raises `max`." That misread a missing JSON property as a zero. `src/items/skill.js` at the pinned commit: `Defaults = { rate: 0.5, max: 5, unlockweight: 0.5 }` and `if (!this.max) this.max = new Stat(Defaults.max, …)`; also `if (!this.buy) this.buy = { arcana: 20 }`. The 59/60 figure is withdrawn. What follows is the corrected reading; the conclusions that survive are marked.

**A skill is gated at entry, then runs 0→5, then needs outside help.** From `skills.json` (52 records): 41 have `require` (visibility), 19 have `need` (actionability, mostly furniture "source" tags: `plantsource`, `workspace`, `weavesource`), all 52 have `buy` (research or arcana). Once bought a skill trains to the default cap of **5**, and *every level* applies the skill's own `mod` (herbalism: `research.max +2, herbs.max +2` per level; lore: `research.max +5, arcana.max +1`). Above 5 the cap moves only when something raises `<skill>.max`: classes, furniture, upgrades, homes, tasks, locale first-clears. Class raises are small (+1 ×100, +2 ×98, +3 ×37 across all class records), and content thresholds cluster at 10/5/3/6, so anything that asks for ≥ 6 is reachable only through those raisers.

**Entry gates are frequently class- or tag-dependent.** `lore` requires `apprentice`; `conjuration` requires `tier0 && lore ≥ 7 && divination ≥ 3`; `spellcraft` requires `tier3 && lore ≥ 15`; `necromancy` requires `evil2 && reanimation ≥ 7`. So classes are keys in two senses: they open entry to some skills (via tier/tag/class requirements) and they open *depth* above the runway for all of them.

**48 of 50 core classes raise at least one skill cap**, and the content gated by those skills (records whose `require`/`need` mentions them) is large:

| Class | Caps raised | Skills whose cap it raises | Downstream gated records |
|---|---:|---|---:|
| wizard2 (T5) | 8 | languages, 4 lores, crafting, lore, mysticism | 201 |
| wizard3 (T6) | 10 | spellcraft, enchanting, potions, alchemy, history, … | 165 |
| highmage (T3) | 6 | firelore, mysticism, alchemy, spellcraft, crafting, lore | 144 |
| kell (T5) | 5 | lore, airlore, naturelore, animals, herbalism | 140 |
| oracle (T1) | 5 | lore, scrying, divination, airlore, spiritlore | 135 |
| alchemist (T2) | 4 | crafting, potions, alchemy, lore | 119 |
| falconer (job) | 3 | lore, animals, naturelore | 107 |
| job_smith (job) | 2 | lore, crafting | 106 |

Full table in `gating-evidence.json → classes` (its `base0_skills_opened` column should be read as "skills whose cap this class raises"; the `skills_without_base_max` count is the number of records relying on the default 5, not zero-cap skills).

Resources do start capped and small: `gold.max = 5` at tick 0, `research.max = 10`, home `space.max = 0` until a home exists. The opening's first six clicks hit the gold cap; the Pouch (`require g.gold>=5, cost 5, gold.max +10, max 3`) is the first cap-raiser. Purse at 20 gold. The `offlinetime` bank starts at `max 3600` seconds and is raised later.

**Interpretation (revised).** The pleasure is in three layers: *seeing* a skill (`require`), *being able to start it* (`need`: usually buy a piece of furniture), then *several levels of visible growth* each paying out a small passive bonus, then a wall at 5 that a class or discovery moves. A design that copies only the wall (caps at 1-2, raised by +1) gets boolean quest flags with numbers on them. The design's ADR 0013 ("practice can't cross a knowledge limit; teaching or discovery opens it") describes the wall; it does not describe the runway, the per-level payout, or the require/need split.

## 1b. The skill web (added after the wiki `Skills` pass)

`skills.json`, 52 records, checked against the wiki `Skills` table. Skills are not a list; they are a graph with six recurring shapes.

| Shape | Count | Examples (require → effect) |
|---|---:|---|
| **Trunk with threshold clock** | 1 | Mage Lore gates at 3 (all seven elemental entries, Nature Studies), 6 (Anatomy, Spirit Communion), 7 (Conjuration), 8 (Mysticism), 10 (Charms), 11 (Enchanting), 15 (Spellcraft), 20 (Arcane Mastery), 25 (Magiphysics). Its level is the campaign clock. |
| **Entry skills** needing a *source* arrangement | 14 | `firelore: need lore ≥ 3 && firesource`; `herbalism: need plantsource`; `crafting: need workspace`; `potions: need workspace && potsource`; `enchanting: need 3 kinds of gem`. Cheap (arcana 5-14), per level +1 element max, +0.01 rate, +5 research max. |
| **Bridge skills** requiring two parents | 8 | Nature Studies = Herbalism 3 + Lore 3; Potions = Alchemy 2 + Crafting 3; Conjuration = Lore 7 + Divination 3; Magic Beasts = Animals 7 + Nature 5; Charms = Lore 10 + Enchanting 5; Vivification = Anatomy 1 + Spirit Communion 5; Travel = Languages + World Lore ≥ 12 (a *sum*); Puppetry = Crafting 8 + Spirit Communion 5. Hybrids live at the **skill** layer; hybrid classes then require the bridge (Necromancer needs `reanimation ≥ 7`). |
| **Mastery skills** needing entry ≥ 10 **and** the Master-of tag | 7+ | Fire Mastery = Pyromancy 10 + Master of Fire; runs the element itself (`fire 0.5/s`); per level potency, element max/rate, rune slots. Class-gated depth. |
| **Cross-feeders**: per-level mods on *other* skills | 9 | Languages → Lore rate +0.1; Weaving → Crafting max +0.1, rate +0.05; Runic Lore → Lore max +0.2, Languages max +0.2; History → Travel max/rate; Magic Beasts → Animals rate; Blood Lore / Vivification → Anatomy rate. Fractional cap contributions mean ten levels of a helper = +1-2 cap on the trunk. |
| **Alternative / action entries** | 5+ | Divination = Spirit Communion 6 **or** Mysticism 5; Trickery = 10 performances **or** Tier 1 **or** a Hall item; Concentration = 2 locales completed; Rejuvenation = 200 healing casts; Wizard Lore = count of Knowledge classes + T5 ≥ 2. Skills unlock from *doing*, not only from having. |

Running costs: every skill runs stamina; 8 also run research, 4 mana, 3 arcana, and the element-specific ones drain their own element (fire, water, air, earth, light, nature, spirit, hp, gold). Training a line's mastery spends the line's resource, which the line's entry skills generate: the closed rate economy per line.

**Interpretation.** A line in Arcanum is more than one skill with a wall. It is an entry skill (source-gated, cheap), one or two bridges to neighbouring lines (the hybrid identities), a mastery (class-gated, resource-draining), and helpers that feed the trunk. The class is the key to the mastery; the bridges are where most of the "history-dependent opportunity" comes from. Design rule 14: **hybrids are techniques first, classes second.**

## 2. Keys gate trees, and trees re-key themselves

Traced end to end (`modules/classline/shadow.json` + core):

```
Dark Adept (T0)            shadowlore.max +1
  └─ shadowlore trainable → 5 furniture (darkshrine, gargoyle, bloodfountain, grotesque, smcage)
                            7 tasks (defilespirits, earthabyss, murder, sensorydeprivation, …)
                            → tasks raise evil → evil2 ; reanimation skill
  └─ necromancy skill EXISTS only if evil2 && reanimation ≥ 7     (triple gate: history + morality + in-tree skill)
Necromancer (T4)           require shadowlore ≥ 17 && evil2 ; cost 30 bloodgem, 30 shadowgem
                            necromancy.max +3, reanimation +2, shadowlore +2, spiritlore +2, embalming +1, potions +1
  └─ necromancy gates:      7 spells (mk_lich, mk_spectre, mk_reaper, lifedrain, …)
                            crypt furniture (bodies.max 25, bones.max 30, bonedust.max 20)
                            corpsestudy task  → necromancy.max +1, reanimation +1, embalming +1
                            phylactory task   → necromancy.max +2, shadowlore +2, hp.max +25
                            siversnecro upgrade → necromancy.max +2, reanimation +2, planeslore +1
                            shademastery skill
                            up_lich task      → resist shadow 100 / light −50 ; required by Vile Necromancer (T6)
```

The gated content **raises the cap that gated it**. A specialist climbs inside their own tree for hours between tier-ups, and the tree hands them storage for its exclusive resources, production, and the next key. The shadow module is 12 classes, 8 skills, 27 spells, 11 furniture, 2 homes, 21 tasks, 28 upgrades: one module serving twelve classes, so content per class is ~10 records, not ~130.

Exclusivity is real: `conjuration` has 7 class raisers and 0 non-class; `vivification` 4 and 0. A build that never takes a conjuring class never sees conjuration.

**Interpretation.** This is what fills the time between tier-ups. The design's classes are teaching, then demonstration, then one application, then stop; there is no tree, so the between-breakthrough stretch has only the shared milestones to do.

## 3. Tier-up: "4 of N quests" plus a bill, and it closes doors

Every tier unlocker is the same shape (`quests.json`):

| Unlocker | Need | Cost |
|---|---|---|
| T0 Graduand Magus | 4 of the t0 quests | 5 arcana |
| T1 Mana Proficiency | 4 of the t1 quests | 250 research, 5 codices, 300 gold, 2 gems |
| T2 Arcane Expertise | 4 of t2 | 850 research, 1 tome, 1000 gold, 5 gems |
| T3 Preeminent Magus | 4 of t3 | 100 scrolls, 10 codices, 5 tomes, 2500 gold, 10 gems |
| T4 Esoteric Occultist | 4 of t4 | 250 scrolls, 65 codices, 15 tomes, 5000 gold, 25 gems |
| T5 Magic Immemorial | 4 of t5 **and a permanent transformation** | 25 tomes, 20 runestones, 8000 gold, 35 gems |
| T6 Eternal Transcendence | 4 of t6 | 15 tomes, 35 runestones, 10000 gold, 50 gems |

The quests are *pointers into systems that already exist* *(wiki)*: T0 = buy Library Haul ×4 / own a Steed / buy Aided Thoughts / memorize a Spell. T1 = clear Under Den / clear Ruined Crypt / move to a new Home / unlock the Scroll Loom (+2 skills) / equip a real weapon. None is a bespoke scene; each is a different subsystem the player is already using.

Tier-up **locks** content *(wiki)*: becoming T0 locks Study, Do Chores, Run Errands, Alcove, Attic Bedroom; T1 locks Prestidigitation; T4 locks more. Homes lock homes in data: `hut`, `camp`, `wagon`, `cottage`, `house` all carry `disable: innroom`; Attic permanently locks Alcove. The `apprentice` class itself disables `cleanstables`. Growing up means leaving the previous stage's tools behind.

**Interpretation.** The design's B3 "three of five milestones" is a direct lift of this shape. The difference is that its five are authored projects, not pointers into existing trees; and the design has no lock rule anywhere.

## 4. Same-tier classes: identical gate, different keys, hidden consequences

All five T0 classes share one requirement string (`g.t0unlocker>0 && g.research.max>=100 && g.lore>=4`). They differ only in cost and which caps they raise:

| Class | Cost | Raises |
|---|---|---|
| adept | 225 research, 200 gold | mysticism, lore, history, languages max +1; mana max +5 |
| dark adept | 225 research (narratively: kills the master) | mysticism, spiritlore, shadowlore, trickery max +1; shadow max +5 |
| red adept | none (hidden prior deed) | anatomy, firelore, weaponlore, mysticism max +1; stamina rate |
| blue adept | none | mysticism, lightlore, spiritlore, divination max +1; light max +5 |
| mystic savant | none; **locked if Study was ever used** | mysticism +2, conjuration +1 |

Hidden consequences are deliberate *(wiki)*: "Studying will lock the Mystic Savant class later on"; clearing Treffil Woods before binding a spellbook unlocks Red Adept. The first irreversible choice in my run ("Studious Master — this action is not reversible") appeared at **minute 3** *(testing build)*.

## 5. The generalist line is a deliberate universal fallback

The knowledge line is the only ladder gated purely by generic resources:

| Tier | Class | Require | Cost |
|---|---|---|---|
| 1 | magician | lore ≥ 10 | 500 research, 2 codices |
| 2 | mage | lore ≥ 14 | 1000 research, 5 codices |
| 3 | highmage | lore ≥ 18 | 2000 research, 5 tomes |
| 4 | wizard | lore ≥ 25 | 6000 research, 15 tomes, 5 runestones |
| 5 | wizard2 | lore ≥ 30 | 15000 research, 10 tomes, 10 runestones |
| 6 | wizard3 | lore ≥ 35, spellcraft ≥ 10 | 20000 research, 20 tomes, 3 sindel |

`lore` is the skill every build trains from the Apprentice onward (it gates herbalism, alchemy, most lores). Every other T1-T6 class needs a specialist skill that exists only if an earlier class keyed it, a class tag (`t_necroclass`, `t_swordclass`, `t_earthclass`), a named predecessor (`warlock` → archlock, `battlemage` → bloodmage), a morality threshold (`evil2`, `evil3`, `good2`), or specialist gems.

What keeps the fallback from dominating:

- **Priced in the slow shared currency, escalating.** Research 500 → 20000. Specialists pay in gems they already produce by being that specialist.
- **Broad and shallow vs narrow and deep.** `wizard2` raises 8 caps by +1 (largest downstream count in the game, 201). `necromancer` raises `necromancy +3`. The generalist opens the entrance to many trees; the specialist climbs one.
- **Never gives the exclusive key.** No mage-line class raises `necromancy`, `bladelore`, or `demonology`. A pure mage never sees the shadow module.

The wiki's new-player advice is the player-side statement of the same structure: "choose a primary line and take three classes from that line (three classes from a line maximizes specialty unlocks)."

**Interpretation.** ADR 0017's Golden Cauldron (enterable from any history) is faithful. What it lacks is the mage line's *price* and *ceiling*: it adds a narrow `Alchemy +1` at no particular cost, and that field is the same one Pill Refiner → Spirit Alchemist climbs, so the fallback can reach a specialist's tree.

## 6. Repetition has curves

23 of 200 core tasks carry `at`/`every` tables (`task-curves.json`). Examples: `chores` pays +1 gold at reps 5 and 25, then −0.3 virtue at rep 500; `smith_work` stamina cost drops at 20 and 50 runs; `study` gains research per 100 runs. Tasks improve with use inside their caps, then some sour. Compatible with the design's knowledge-limit rule: repetition develops *within* a cap; the cap moves from outside.

## 7. Morality is a gate, not flavor

`evil1/2/3`, `good2`, `virtue` appear in class requirements (reanimator, bonemonger, dreadlord, thanophage, necromancer, warlock, archlock, greynecromancer, deathlock) and in the `necromancy` skill's own existence condition. Tasks shift it (`chores` +0.3 virtue; `thievery` −3 virtue, +5 evil). Neutrality is its own documented path *(wiki)*. A whole module is unreachable without it.

## 8. Homes are part of the build, in numbers

`homes.json` (41 records). Each home sets `space.max` (furniture capacity) and usually a rate or cap, and most lock the previous stage:

| Home | Require | Mods | Locks |
|---|---|---|---|
| alcove | apprentice | space 5 | — |
| atticbedroom | neophyte | space 10 | alcove *(wiki)* |
| innroom | tier0 (auto move-in) | space 12, gold.rate −0.25 | — |
| hut | tier0, 300 gold | space 15 | innroom |
| camp | tier0, naturelore ≥ 5 | space 14, lore.rate −0.1, research.rate −0.1, nature max via naturelore | innroom |
| cave | tier0, (shadow+earth+nature) > 0 | space 25, minions 2, research.rate −0.5, earth/shadow max via lores, light max −2 | — |
| elegant pagoda *(wiki)* | complete "Make a Beautiful Home" | space 550, Mysterious Sword Arts max 1, **Breakthrough** max 1, spirit rate 0.3 | — |

Furniture consumes `space` and is where the early cap-raisers live (Small Chest: gold.max 75; Scroll Rack: scrolls.max +15; Calligraphy Set: research.max +5). "Source" tags on furniture (plantsource, watersource, airsource …) are prerequisites for early skills *(wiki)*.

## 9. The opening is fast and dense

*(testing build, scripted play from a cold start, wall clock)*

| Time | Event |
|---|---|
| 0 s | Gold 0/5, Stamina 10, Stored Time 0/3600. One task: Clean Stables. |
| ~6 clicks | Gold cap hit; **Pouch** unlocks. |
| < 1 min | Buy Scroll → Scrolls → Study → Research resource → Apprenticeship class visible; Purse, Satchel. |
| < 3 min | **Apprentice** (first class) purchased. Unlocks in one burst: Home tab + Alcove, 4 furniture, Skills tab (Mage Lore), Glossary, Quests (Move In, First Lessons), Do Chores, Run Errands, Studious Master (irreversible). |

Roughly fifteen "Unlocked:" notices and one irreversible identity choice inside three minutes. Clean Stables pays 2.5 gold for 1 stamina; Apprentice costs 10 research + 20 gold and disables Clean Stables.

**Interpretation (revised).** Apprentice at ~3 minutes is a tutorial class; it opens the Home, Skills and Quests tabs rather than completing a stage. The first real tier-up (Neophyte → T0 Graduand Magus: `research.max ≥ 100`, `lore ≥ 4`, 4 of 4 T0 quests, the Leaky Cellar) is on the order of 30-60 minutes of active play [I: not measured here; wiki quest list plus the third-party reviewer's estimate]. The honest comparison is therefore: Arcanum's *tutorial* is three dense minutes and its first *stage* is under an hour; the design's foundation stage was budgeted at ~8 activity hours. The gap is real but one order of magnitude, not two.

## 10. Control as a reward

Apprentice-era play is one action at a time with a stamina budget. Later tiers add Goals, Hobbies, waiting behaviour, and extra action slots (`extraaction.json`; "Timeline Bifurcation" at T4 *(wiki)*). The stored-time bank starts at 1 hour and grows. Progression gives the player more control over scheduling as well as bigger numbers.

## 11. Arcanum already contains cultivation

`modules/swordplay.json`: Spell Blade (T3) → Blade Weaver (T4) → Arcane Dervish (T5) → Eldritch Knight (T6), gated by `t_swordclass` and `bladelore`. The Elegant Pagoda home carries "Mysterious Sword Arts" and a "**Breakthrough**" upgrade *(wiki)*. The reference's own community already reads xianxia into it.

## What this corrects in the earlier studies and review

| Earlier statement | Correction |
|---|---|
| Study: "hard caps force new solutions" as one example (gold 5 → Pouch) | Caps are the spine, but skills start with a **default cap of 5** (`skill.js`), not 0. Entry is gated by `require`/`need`/`buy`; classes raise caps above the runway and gate some entries. The first version of this study's "59/60 keyless" claim was wrong and is withdrawn. |
| Study: classes "close alternatives at the same tier" | Understated. Tier-up locks tasks and homes too; homes lock homes; some locks are hidden. |
| Study: never timed the opening | Tutorial class ≈ 3 minutes with ~15 reveals; first stage ≈ 30-60 min [I]. Still the most important pacing fact for an incremental, but see §9 for the corrected comparison. |
| Review: "3-of-5 milestones is checklist drift" | It is a faithful lift of the tier-unlocker shape. The flaw is that the design's five are bespoke, not pointers into existing trees. |
| Review: "4→5→7 classes is over-wide" | Arcanum runs 5-9 per tier (core tags: 5/6/9/7/6/3/5). Breadth is in line. The missing thing is one shared module per line, with classes as keys. |
| Review: "Arcanum classes are data, the design's are content" | Both gate content. The difference is recursion: Arcanum's gated content re-raises its own cap; the design's class content is three beats and stops. |
| Review: "Golden Cauldron is a dominant fallback" | A universal fallback is a deliberate Arcanum feature (the mage line). Golden Cauldron lacks its escalating generic price and its ceiling (it reaches the specialist's exclusive field). |
| Review (unchanged, strengthened) | Zero caps in the opening; nothing closes on advancement; morality dropped with no decision record; bank cap fixed rather than grown. |

## Design rules Arcanum implies, stated as rules

1. A technique family (skill) is **gated at entry** (visible by `require`, startable by `need`, usually a home arrangement, and bought once), then has a **short runway** (3-5 levels) where every level pays a small passive bonus, then a wall.
2. A class raises walls (+1…+3) and opens some entries. Jobs count. Depth above the runway is reachable only through classes, arrangements, and first-clears.
3. Each family has 10-20 gated records (practice tasks, home arrangements, recipes, sites); several of them raise the family cap again.
4. Lines share one content module; classes within a line are keys into deeper levels. "Three from one line" should be the optimal specialist play.
5. Some keys need history + morality + an in-tree skill, all at once.
6. A breakthrough is "N of M pointers into existing systems" plus a bill, and it locks the previous stage's tools and home.
7. One generalist line is always takeable, priced in the slow shared currency on an escalating curve, broad and shallow, and never holding an exclusive key.
8. The first resource cap is hit within a minute and its raiser is the next thing on screen; the tutorial class is within minutes; the first real stage is under an hour.
9. Repetition improves a task within its cap (`at`/`every` curves) and trains a skill along its runway; caps move only from outside.
10. The offline bank starts small and is itself something to grow.
11. Visibility and actionability are separate (`require` vs `need`, with `needtext`): the player sees what they cannot yet do and is told what is missing.
12. Noncombat sites use stress gauges (five stressors) as noncombat HP; skills like `concentrate`/`composure` raise and drain them. Expeditions and trials have a budget that is not lifespan.
13. Scheduling agency grows with progression: Goals, Hobbies, extra action slots, a larger bank.

## Files

- `gating-evidence.json`: per-class caps raised, zero-cap skills opened, downstream gated record counts; per-skill raisers and gated records.
- `task-curves.json`: the 23 core tasks with `at`/`every` progression tables.
- `homes.json`: all 41 home records (require, cost, mod, disable).
- Scratch: raw data files in `~/Work/tries/2026-10-18-arcanum-src/`, wiki dumps in `/tmp/tom-*.md` (not retained).
