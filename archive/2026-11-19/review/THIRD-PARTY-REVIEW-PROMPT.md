# Third-party review request — cultivation incremental, design v2

You are reviewing a browser idle/incremental RPG design, inspired by *Arcanum: Theory of Magic* (open source, MIT: https://mathiashjelm.gitlab.io/arcanum/ , source https://gitlab.com/mathiashjelm/arcanum , wiki https://theoryofmagic.miraheze.org ), themed as xianxia cultivation toward immortality.

History you need: a long design interview (123 questions, ~33 documents) produced a first design. An independent reviewer then (1) reviewed that package, (2) did a primary-source study of Arcanum's mechanics, (3) revised the review in light of it, and (4) wrote a design plan that rebuilds the accepted content on Arcanum's machine. **You are reviewing the reviewer as much as the design.** Treat every claim below as something to attack, including the mechanics study's reading of Arcanum.

Three documents are appended verbatim after this header:

- **A. `MECHANICS-STUDY.md`** — the reviewer's primary-source analysis of Arcanum (pinned commit `a2632d2edf3e07e9168fff81167b11f2792e9197`, testing build 0.12.12.9, wiki). Evidence JSON files referenced in it are not attached; the claims that rest on them are flagged where made.
- **B. `REVIEW-RESPONSE-2026-10-18.md`** — the revised review of the original design package. It references the original package's files (`CAMPAIGN-OUTLINE.md`, `CULTIVATION-CLASS-MAP.md`, `OPENING-DRAFT.md`, ADRs 0001–0019, etc.); those are not attached. Judge the review's reasoning and the fairness of its inferences from the quotations it gives.
- **C. `DESIGN-PLAN-2026-10-18.md`** — the new design. Parts A–F. Part C is a fully numeric first slice; Part F lists what it reverses from the accepted design and three open decisions.

## What the original design accepted (so you can judge what the plan keeps)

One cultivator, mortal village start, eight breakthroughs ending in ascension and an epilogue. Cumulative classes: none at breakthrough 1; one lasting class at each of breakthroughs 2–4 (4 → 5 → 7 candidates), each adding +1 to mastery tags (Body, Sword, Earth, Formation, Spirit, Alchemy) that gate later classes. One residence with capacity-limited improvements; one primary activity at a time; no energy meter; a 1:1 offline time bank; activity-based aging from age 18 / lifespan 80; exact-state retry to the last breakthrough on life exhaustion; optional combat and sects with every route noncombat-viable; a prepared first trial at breakthrough 4 ("Cloudwell") with three approaches and one mid-trial decision; desktop-first text-and-panel browser presentation; a target of 3–5 real days to breakthrough 4.

## The reviewer's central claims — challenge these first

1. Arcanum's defining mechanism is that nearly every skill starts with no cap (claimed: 59 of 60 scanned) and classes are the keys that raise caps; gated content then raises its own cap again. The original design stated this rule in prose (ADR 0013) and explicitly refused a numeric form, and that single omission explains most of its weaknesses.
2. The original's "3 of 5 milestones" readiness is a faithful copy of Arcanum's "4 of N tier quests" and was wrongly called checklist drift in a first pass; the real flaw is that the five are bespoke scenes rather than pointers into existing systems.
3. Class breadth (4/5/7 per tier) is in line with Arcanum (5–9 per tier); the missing thing is one shared content module per line with classes as keys into it.
4. Arcanum's mage line is a deliberate universal fallback kept honest by escalating generic-currency prices, breadth-not-depth, and never holding an exclusive key; the original's "Golden Cauldron from any history" lacked those three properties. The plan replaces it with a Scholar line.
5. Arcanum locks tasks/homes/classes on every tier-up; the original locked nothing; the plan adds visible locks and forbids revision.
6. Arcanum's opening reaches a cap in ~6 clicks and a first class in ~3 minutes; the original's foundation took ~8 activity hours. The plan assumes an incremental tempo (foundation in 25–40 active minutes).
7. Morality gates whole modules in Arcanum and was dropped from the original with no decision; the plan defines a Karma axis and defers its content.

## Questions

1. **Is the reading of Arcanum right?** Where does the mechanics study over-generalise from one classline module (shadow) and the opening? Is "caps as spine" the correct abstraction, or is it a projection? Name any Arcanum quality the study missed that the plan should have inherited (automation/Goals/Hobbies, spellcraft composition, stress types in locales, the Hall, morality neutrality, anything else).
2. **Is the review fair to the original design?** Where does it mistake deliberate choices for omissions? Is the "interview ledger, not a design" judgement supported by the quoted evidence (767 Q-references, 365 "remains open" hedges, zero numbers/NPCs/caps in the opening draft)?
3. **Does the plan's machine (Part A) actually produce the Arcanum feeling, or a cap-grind?** Specifically: will "every capability at cap 0" plus visible raisers read as discovery, or as a to-do list with numbers?
4. **Part C, the first slice.** Walk the session script as a skeptical player. Find the dead minutes, the forced order, the choice that isn't one, and any record whose `require` makes it unreachable. Is the Foundation 3-of-5 list a real choice set? Is locking Mill Work and the Hayloft a transformation or a loss? Are the numbers absurd anywhere (coin cap 12, 10-minute Settling, 0.25 fictional years per activity hour)?
5. **Classes as keys (Part B.3).** Do the assigned cap raises make the seven breakthrough-4 classes meaningfully different in play, or still labels? Is Mountain Vessel's "shallow entry to a second line" interesting or a trap? Is the Scholar line correctly priced, or will it be the dominant pick at B3 for anyone who hasn't decided?
6. **Coherence of bank + aging + locks + retries.** The plan keeps the accepted rules (bank survives retry, pauses don't age, 1:1 exchange) and shrinks the bank cap to 1 hour. Find the degenerate strategy if there is one.
7. **Scope.** The plan claims modules make breadth cheap (a line module is 12–20 records per tier). Is that credible for a solo author across six lines and seven tiers? What should be cut, and what is the smallest version of Part B that still tests Part A?
8. **The three open decisions in Part F** (incremental vs narrative tempo; Scholar line vs broad/expensive Golden Cauldron; reuse Arcanum's MIT parser vs rewrite). Give a recommendation on each with the deciding reason.
9. **What should the first playable actually test, in rank order?** Correct the plan's Part E list if you disagree.

## Format

- A short overall verdict on each of the three documents separately (study, review, plan).
- Prioritised findings. For each: which document, which section, what is wrong or risky, why it matters, one concrete alternative.
- Keep facts, interpretations, and recommendations labelled and separate. Where you cannot verify a claim about Arcanum without the source, say so rather than accepting or rejecting it.
- Do not derive a schedule from document length. State any staffing assumption you use.
- Be adversarial toward the reviewer. Agreement with the reviewer is only useful when you add evidence or a sharper statement.

---



# ═══ A. MECHANICS-STUDY.md ═══

# Arcanum / Theory of Magic — mechanics study, 18 October 2026

Companion to `research/arcanum-study-2026-10-16/` (scope census, class/mastery study). That folder answers *what Arcanum contains*. This one answers *how Arcanum works as a machine*, because the design documents inherited the catalog view and not the mechanism, and several review findings turned on it.

## Sources and method

| Source | What was done |
|---|---|
| Pinned source `a2632d2edf3e07e9168fff81167b11f2792e9197` (stable 0.12.3.1), `data/*.json` and `data/modules/{learning,swordplay,extraaction,classline/shadow}.json` | Fetched raw; scanned 998 records (plus the shadow module) for `require`/`need` strings and `mod`/`result` keys to build a class → skill-cap → gated-content graph. Output in `gating-evidence.json`, `task-curves.json`, `homes.json`. |
| Testing build `https://arcanumtesting.gitlab.io/arcanum/` (`unstable 0.12.12.9`) | Played the opening with a scripted autoplayer (click work when stamina ≥ 1, else rest; buy anything new; study when scrolls ≥ 1). Logged unlock order and wall-clock time. |
| Wiki `https://theoryofmagic.miraheze.org` (documents stable 0.12.0.0) | `Guide:New_players`, `Classes`, `Home`, `Main_Page`. Used for tier-quest lists, tier locks, home table, and the community's stated strategy. |

Three versions are in play (0.12.0.0 wiki, 0.12.3.1 pinned source, 0.12.12.9 testing). Structure is identical across all three; individual numbers drift. Numbers below are from the pinned source unless marked *(wiki)* or *(testing build)*.

Not done: a full playthrough, mobile, save recovery, combat/spellcraft depth, Hall. Shadow is the only classline module fetched (others 404 at that path); other lines exist in the manifest and were not scanned, so "downstream" counts are lower bounds.

## 1. The spine: everything is a cap, and caps start at zero

**59 of 60 skills scanned have no base `max`.** (`gating-evidence.json → skills_without_base_max`.) A skill with cap 0 cannot be trained. It becomes trainable only when some record raises `<skill>.max`. The raisers are classes, furniture, upgrades, homes, tasks, and locale first-clears.

**48 of 50 core classes raise at least one zero-cap skill** — i.e. nearly every class is the first key to some tree. Downstream content gated by the caps a class raises (records whose `require`/`need` mentions those skills):

| Class | Caps raised | Zero-cap skills opened | Downstream gated records |
|---|---:|---|---:|
| wizard2 (T5) | 8 | languages, 4 lores, crafting, lore, mysticism | 201 |
| wizard3 (T6) | 10 | spellcraft, enchanting, potions, alchemy, history, … | 165 |
| highmage (T3) | 6 | firelore, mysticism, alchemy, spellcraft, crafting, lore | 144 |
| kell (T5) | 5 | lore, airlore, naturelore, animals, herbalism | 140 |
| oracle (T1) | 5 | lore, scrying, divination, airlore, spiritlore | 135 |
| alchemist (T2) | 4 | crafting, potions, alchemy, lore | 119 |
| falconer (job) | 3 | lore, animals, naturelore | 107 |
| job_smith (job) | 2 | lore, crafting | 106 |

Full table in `gating-evidence.json → classes`. Even the apprentice-era *jobs* open ~100 records.

Resources work the same way: `gold.max = 5` at start, `research.max = 10`, home `space.max = 0` until a home exists. The opening's first six clicks hit the gold cap; the Pouch (`require g.gold>=5, cost 5, gold.max +10, max 3`) is the first cap-raiser. Purse at 20 gold. The `offlinetime` resource (the stored-time bank) starts at `max 3600` seconds and is itself raised later.

**Interpretation.** A class record is ~10 lines because the *key* is cheap. The *tree behind the key* is the content. The design's ADR 0013 ("practice can't cross a knowledge limit; teaching or discovery opens it") is this mechanism in prose; it never became a number.

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

The gated content **raises the cap that gated it**. A specialist climbs inside their own tree for hours between tier-ups, and the tree hands them storage for its exclusive resources, production, and the next key. The shadow module is 12 classes, 8 skills, 27 spells, 11 furniture, 2 homes, 21 tasks, 28 upgrades — one module serving twelve classes, so content per class is ~10 records, not ~130.

Exclusivity is real: `conjuration` has 7 class raisers and 0 non-class; `vivification` 4 and 0. A build that never takes a conjuring class never sees conjuration.

**Interpretation.** This is what fills the time between tier-ups. The design's classes are teaching → demonstration → one application → stop; there is no tree, so the between-breakthrough stretch has only the shared milestones to do.

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

`lore` is the skill every build trains from the Apprentice onward (it gates herbalism, alchemy, most lores). Every other T1–T6 class needs a specialist skill that exists only if an earlier class keyed it, a class tag (`t_necroclass`, `t_swordclass`, `t_earthclass`), a named predecessor (`warlock` → archlock, `battlemage` → bloodmage), a morality threshold (`evil2`, `evil3`, `good2`), or specialist gems.

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

**Interpretation.** First identity choice in ~3 minutes versus the design's foundation (no class) "within the first day" and first class on days 2–3. The design's 8–12-hour decision cadence would be a long stretch by Arcanum's clock.

## 10. Control as a reward

Apprentice-era play is one action at a time with a stamina budget. Later tiers add Goals, Hobbies, waiting behaviour, and extra action slots (`extraaction.json`; "Timeline Bifurcation" at T4 *(wiki)*). The stored-time bank starts at 1 hour and grows. Progression hands the player more scheduling agency, not just bigger numbers.

## 11. Arcanum already contains cultivation

`modules/swordplay.json`: Spell Blade (T3) → Blade Weaver (T4) → Arcane Dervish (T5) → Eldritch Knight (T6), gated by `t_swordclass` and `bladelore`. The Elegant Pagoda home carries "Mysterious Sword Arts" and a "**Breakthrough**" upgrade *(wiki)*. The reference's own community already reads xianxia into it.

## What this corrects in the earlier studies and review

| Earlier statement | Correction |
|---|---|
| Study: "hard caps force new solutions" as one example (gold 5 → Pouch) | It is the entire spine. 59/60 skills are keyless by default; classes are the keys. |
| Study: classes "close alternatives at the same tier" | Understated. Tier-up locks tasks and homes too; homes lock homes; some locks are hidden. |
| Study: never timed the opening | First class ≈ 3 minutes; ~15 reveals. The most important pacing fact for an incremental. |
| Review: "3-of-5 milestones is checklist drift" | It is a faithful lift of the tier-unlocker shape. The flaw is that the design's five are bespoke, not pointers into existing trees. |
| Review: "4→5→7 classes is over-wide" | Arcanum runs 5–9 per tier (core tags: 5/6/9/7/6/3/5). Breadth is in line. The missing thing is one shared module per line, with classes as keys. |
| Review: "Arcanum classes are data, the design's are content" | Both gate content. The difference is recursion: Arcanum's gated content re-raises its own cap; the design's class content is three beats and stops. |
| Review: "Golden Cauldron is a dominant fallback" | A universal fallback is a deliberate Arcanum feature (the mage line). Golden Cauldron lacks its escalating generic price and its ceiling (it reaches the specialist's exclusive field). |
| Review (unchanged, strengthened) | Zero caps in the opening; nothing closes on advancement; morality dropped with no decision record; bank cap fixed rather than grown. |

## Design rules Arcanum implies, stated as rules

1. Every technique family (skill) starts at cap 0.
2. A class is the sole key to at least one family, or a deeper cap in one. Jobs count.
3. Each family has 10–20 gated records (practice tasks, home arrangements, recipes, sites); several of them raise the family cap again.
4. Lines share one content module; classes within a line are keys into deeper levels. "Three from one line" should be the optimal specialist play.
5. Some keys need history + morality + an in-tree skill, all at once.
6. A breakthrough is "N of M pointers into existing systems" plus a bill, and it locks the previous stage's tools and home.
7. One generalist line is always takeable, priced in the slow shared currency on an escalating curve, broad and shallow, and never holding an exclusive key.
8. The first cap is hit within a minute; the first cap-raiser is the next thing on screen; the first identity choice is within minutes.
9. Repetition improves a task within its cap; caps move only from outside.
10. The offline bank starts small and is itself something to grow.

## Files

- `gating-evidence.json` — per-class caps raised, zero-cap skills opened, downstream gated record counts; per-skill raisers and gated records.
- `task-curves.json` — the 23 core tasks with `at`/`every` progression tables.
- `homes.json` — all 41 home records (require, cost, mod, disable).
- Scratch: raw data files in `~/Work/tries/2026-10-18-arcanum-src/`, wiki dumps in `/tmp/tom-*.md` (not retained).


# ═══ B. REVIEW-RESPONSE-2026-10-18.md ═══

# Review response — Arcanum-inspired cultivation RPG design package (revised)

18 October 2026. Second pass. The first pass read the package alone; this one is re-run after a primary-source study of Arcanum (`research/arcanum-mechanics-2026-10-18/MECHANICS-STUDY.md`: pinned-source gating scan, timed opening on the testing build, wiki). Where the two passes disagree, this one wins and says why.

Conventions: **F** = documented fact with a reference; **I** = my interpretation; **R** = recommendation. Staffing assumption for scope judgments: one author doing rules, content, UI, and validation.

---

## Overall assessment

**The design kept Arcanum's shape and lost its machine.** It has tiers (eight breakthroughs), cumulative classes with overlapping expertise, "N of M" advancement quests, one home, an offline bank, optional combat, and a cheap-generalist entry. All of those are faithful. What it does not have is the thing that makes Arcanum's shape work: **a numeric cap on every capability, starting at zero, with classes as the keys that raise it, and gated content that raises it again.** That one omission explains most of the symptoms the first pass catalogued separately — nominal classes, checklist readiness, no engagement between breakthroughs, no cap in the opening, scope that grows by scene rather than by record.

The omission is deliberate. ADR 0013 states the knowledge-limit rule and then disclaims "a numerical knowledge-point currency, resource cap formula, or universal activity count." That sentence is where the design parted from Arcanum's spine, and it should be reversed.

The documents themselves are a 123-question interview ledger (767 `Qnn` references, 365 "remains open" hedges in `design/`), not a design. The opening slice's source document, `OPENING-DRAFT.md`, contains no number with a unit, no named character, and no cap. Your sense that the process "went off the rails" is right; the rails (what a breakthrough numerically does) were never laid, so each question added another car.

**Strengths that survive both passes:** the mortal-village → qi-discovery → two-route foundation opening; cumulative class history with mastery counts (closer to Arcanum than the superseded three-path model); the anti-footgun rules (no class supplies its own prerequisite; every route noncombat-viable; no food meter; no hidden quizzes); the Cloudwell mid-trial pause as a real resource tradeoff; the three-way separation of real time / activity time / age.

---

## Faithfulness

| Arcanum quality (verified in source) | Design status | Verdict |
|---|---|---|
| Every skill starts at cap 0; classes/furniture/homes/tasks raise caps; 59/60 skills keyless by default | ADR 0013 states the rule in prose and explicitly refuses a numeric form | ✗ lost — the spine |
| Gated content re-raises its own cap (corpsestudy, phylactory, siversnecro) so a specialist climbs between tiers | Class = teaching → demonstration → one application → stop | ✗ lost — no tree |
| Tier-up = 4 of N pointers into existing systems + a bill | B3 = 3 of 5 + class prep | ✓ shape kept; ✗ the five are bespoke scenes, not pointers |
| Tier-up locks tasks, homes, classes; homes lock homes; some locks hidden | No lock rule anywhere; earlier-class revision "remains open" | ✗ lost |
| Same-tier classes share one gate, differ by key and price | Starters share readiness, differ by crossing scene | ~ half kept (no key, no price) |
| One generalist line always takeable, priced in slow shared currency, broad/shallow, never holds an exclusive key | Golden Cauldron from any history, narrow (+1 Alchemy), unpriced, reaches a specialist field | ~ shape kept, balance lever missing |
| Morality gates whole modules (necromancy requires `evil2`) | Dropped, no ADR | ✗ lost silently |
| Homes: space cap + rates + locks, furniture holds early cap-raisers | "Capacity units and values remain undecided" (`HOME-DRAFT.md §Accepted home capacity`) | ~ concept kept, no numbers |
| First cap in ~6 clicks, first class in ~3 min, ~15 reveals | Foundation (no class) in "a few short visits"; first class day 2–3; 8 activity hours in the opening model | ✗ tempo is narrative-RPG, not incremental |
| Control as reward (Goals, Hobbies, extra slots, growing bank) | Bank fixed at "a few days"; no scheduling growth | ✗ lost |
| Hall / roster / prestige | Dropped for a finite ending | ✓ deliberate departure |
| Spellcraft, summons, dungeons, clashes | Dropped/replaced, no ADR | — fine; record it |

**I:** This is a different game in framing (finite, single life, aging, retry-to-checkpoint) and the same game in skeleton. Neither is the problem. The problem is that it is not yet an *incremental* at all: nothing has a number that a player watches fill, cap, and break.

---

## Prioritized findings

### 1. No numeric cap layer (blocks everything else)

**F:** ADR 0013 ¶2: "The rule does not require … a numerical knowledge-point currency, resource cap formula, or universal activity count." `OPENING-DRAFT.md`: zero occurrences of cap/capacity/max; zero numbers with units. Arcanum: `gold.max 5` at tick 0, `research.max 10`, `space.max 0`, `offlinetime.max 3600`; 59/60 skills `max` absent.
**I:** Without caps, "knowledge-limited practice" has nothing to limit, classes have nothing to raise, homes have nothing to hold, and the opening has no Pouch moment. Every downstream finding (2–6) is a consequence.
**R:** Reverse the ADR 0013 disclaimer. Define a stat sheet for the opening: ~8–10 capped quantities (coin, provisions, field kit, qi sense, circulation, one technique family per route, home space, bank), each with a starting cap, what raises it, and what it gates. One page. Do this before any implementation plan.

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
**R:** Every breakthrough locks the previous stage's work and home tier; choosing a class closes its same-tier rivals; record "no revision" as the decision and stop re-litigating it.

### 6. Golden Cauldron: right idea, missing price and ceiling

**F:** ADR 0017: entry "from any current history," adds `Alchemy +1`, no particular cost. Arcanum mage line: `lore ≥ 10/14/18/25/30/35`, research 500 → 20 000 escalating, raises 6–10 caps by +1, never raises `necromancy`/`bladelore`/`demonology`.
**I:** A universal fallback is a deliberate Arcanum feature. Golden Cauldron is the mage line without the mage line's escalating generic price, without its breadth, and *with* access to the same Alchemy field a Pill Refiner → Spirit Alchemist climbs — so the fallback can reach a specialist's exclusive tree.
**R:** Either make it the broad scholar option (+1 to several shared fields, paid in the slow shared currency — study time and lifespan), or keep it narrow and have it raise a *shared* alchemy field distinct from the Pill Refiner line's exclusive one.

### 7. Opening tempo is 50–100× slower than the reference

**F:** `PACING-PAPER-BUDGET.md` / `pacing-model.py` opening task list sums to ≈ 8 activity hours before foundation; first class on day 2–3 (`0019`); Q122 targets a decision every 8–12 activity hours. Arcanum testing build, scripted: cap at ~6 clicks, first class < 3 min, ~15 unlock notices, one irreversible choice.
**I:** The design has the tempo of a text RPG. That can be a legitimate choice, but then "idle/incremental" is the wrong genre label and Arcanum the wrong pacing reference. If it is an incremental, the opening needs many small caps and reveals, not one eight-hour arc.
**R:** Decide the genre explicitly. If incremental: foundation within the first ~20 minutes of play, first class within the first session, with the cap/raise/reveal cadence of §9 of the mechanics study. If narrative: drop the 3–5-day Cloudwell target and the bank as designed; they are solving an incremental's problem.

### 8. Morality dropped without a decision

**F:** No ADR mentions virtue/evil/karma. Arcanum: `evil1/2/3`, `good2`, `virtue` gate 9+ classes and the `necromancy` skill's existence; tasks move it (`chores` +0.3 virtue, `thievery` −3).
**I:** Xianxia has a native, thematically loud analogue (karma, demonic cultivation, dao heart). As a mechanic it is one resource pair with side-effects on tasks — cheap — and it gates whole lines, which is the kind of consequence the design is short of.
**R:** Decide it either way in an ADR. If in: one axis, moved by work and expedition choices, gating one line (demonic/blood cultivation) and one home.

### 9. Bank and lifespan incentives unresolved

**F:** ADR 0007/0019: pausing accrues bank and stops aging; spending preserves age cost; the bank survives checkpoint retries; cap "a few days." Arcanum: `offlinetime.max 3600` at start, raised by progression.
**I:** "Wait at cap" may be optimal; bank-as-meta-resource across retries is odd; a fixed large cap removes a progression lever Arcanum uses.
**R:** Start the cap small (1 hour) and make raising it a reward. Test empty-bank play first. Decide whether the bank is checkpoint state.

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


# ═══ C. DESIGN-PLAN-2026-10-18.md ═══

# Design plan — cultivation incremental (working title: *Lowbridge*)

18 October 2026. This is a design, not a ledger. It takes the accepted content of the interview (setting, classes, masteries, breakthrough count, bank, lifespan, retries) and rebuilds it on Arcanum's actual machine as documented in `research/arcanum-mechanics-2026-10-18/MECHANICS-STUDY.md`. Where it reverses an accepted decision it says so in Part F. Every number in Part C exists so that it can be wrong in play; none is sacred.

Reading order: A (the machine, one page) → B (campaign skeleton) → C (first slice, fully specified) → D (data model) → E (validation) → F (what this supersedes, open decisions).

---

## Part A — The machine

Ten rules. Everything else is content.

1. **Every capability is a number with a cap, and most caps start at 0.** Resources (coin, herbs, qi), technique families (Circulation, Blade Intent, …), home space, the time bank. A family at cap 0 cannot be practised. Practice raises *level* toward *cap*; nothing raises cap except an external record (discovery, teaching, arrangement, class, breakthrough).
2. **A class is a key.** It adds +1 to its mastery tags (the accepted lattice) **and** is the sole first key to at least one family, or +N to one already open. Jobs count as minor keys.
3. **Gated content re-keys itself.** Each family's module contains practice tasks, home arrangements, recipes and sites; several of them raise the family cap again. A specialist climbs their own ladder between breakthroughs.
4. **One module per line.** Six lines (Body, Sword, Earth, Formation, Spirit, Alchemy) each own one content module. Classes within a line are keys into deeper levels of that module. "Three classes from one line" is the intended specialist play.
5. **A breakthrough is N-of-M pointers + a bill + locks + lifespan.** The pointers are into systems that already exist (reach cap X, install arrangement Y, clear site Z first time). The bill is in the slow shared currencies. It locks the previous stage's work and home tier. It extends lifespan.
6. **Advancement closes doors, visibly.** Choosing a class closes its same-tier rivals. Breakthroughs lock the prior stage's job and lowest home tier. No hidden quizzes (accepted); no revision of earlier classes (decided here).
7. **One generalist line, always takeable, never holding an exclusive key.** The Scholar line's key is Lore (the one family everyone trains). It is priced in Lore level and study time on an escalating curve; it raises many caps by +1 and no line's exclusive family.
8. **Repetition has a curve inside the cap.** Tasks improve at rep thresholds (`at`) and some sour late. Caps still only move from outside.
9. **Time is the only action budget.** One primary activity at a time; every task has a duration; there is no stamina/food meter (accepted). The time bank (1:1, accepted) starts at **1 hour** and is itself a capped resource raised by progression.
10. **Morality is one axis, Karma**, moved by choices in work and expeditions, gating one line's deep tier and one home. Defined now; content deferred past the first slice.

Tempo decision: **incremental.** First cap within a minute; first cap-raiser the next thing on screen; foundation within the first session (~25–40 min active); first class within the first real day; the 3–5-day Cloudwell target stays as a hypothesis.

---

## Part B — Campaign skeleton

### B.1 Families (skills), lines, and the shared two

| Family | Line | What level does | Exclusive resource | First key |
|---|---|---|---|---|
| **Lore** | shared | reading scripture/records; gate for every teaching record; Scholar key | — | Cracked Jade Slip (opening) |
| **Qi Sense** | shared | perception; gates site observations and faint-trace reading | — | Cracked Jade Slip (opening) |
| **Circulation** | Body | reinforced exertion, load, hazardous work | Marrow Tonic (herb) | channel arrangement *or* hollow exercise (opening); Body Disciple raises |
| **Blade Intent** | Sword | precise contact force; later projection | Whetstone Grit | Sword Disciple |
| **Ground Reading** | Earth | ground currents, deposits, stable lines | Veined Ore | Earth Listener |
| **Array Craft** | Formation | temporary/fixed arrangements | Inked Tokens | Formation Student |
| **Projection** | Spirit | will beyond the body; wards, projected cuts | Incense Ash | Sword Disciple *or* Formation Student at +1 cap; Spirit Blade / Spirit Warden deepen |
| **Refining** | Alchemy | extraction, heating, pills | Pill Residue | Pill Refiner |

Mastery tags (Body/Sword/Earth/Formation/Spirit/Alchemy, accepted) remain exactly as ADR 0015–0017 define them and gate class eligibility. Families are what tags *do*.

### B.2 Breakthrough ladder

| # | Name (provisional) | N of M (pointers) | Bill | Locks | Lifespan | Class choice |
|---|---|---|---|---|---|---|
| 1 | **Foundation** | 3 of 5 (Part C) | 10 Herbs, full Qi reservoir, 1 Settling task | Mill Work; Hayloft | +5 y | none |
| 2 | **First Direction** | 3 of 5: {chosen family cap ≥ 3, any home arrangement tier 2, Old Ridge first observation, Lore ≥ 4, 200 coin earned lifetime} | 20 Herbs, 10 line resource, 60 coin | Ferry Hauling; Lean-to | +8 y | Body Disciple / Sword Disciple / Earth Listener / Formation Student (closes the other three) |
| 3 | **Second Direction** | 3 of 5: {reliable method = chosen family level ≥ cap, the returning chime site cleared, study-space arrangement, survey spur reopened, a paid commission at Old Ridge} — same five as ADR 0016, now as pointers | 40 Herbs, 20 line resource, 150 coin | village paid work; Cottage | +10 y | Iron Marrow / Mountain Vessel / Spirit Blade / Earth Array / Pill Refiner / **Sutra Reader** (scholar) |
| 4 | **Cloudwell** (first trial) | ADR 0018's three conditions unchanged + intended-class family cap ≥ 5 | per approach (ADR 0018) | waystation jobs | +15 y | Jade Body / Sword Heart / Mountain Heart / Stone Ward / Spirit Warden / Spirit Alchemist / Golden Cauldron (Alchemy ≥ 1) / **Wandering Scholar** |
| 5 | Change the Place | 3 of 5 from the B5 region module | — | — | +20 y | one per line, tier 5 |
| 6 | Reconcile | 3 of 5 | — | — | +30 y | one per line, tier 6; requires a *permanent transformation* record (Arcanum T5 rule) |
| 7 | Mortal Peak | 4 of 6 | — | locks all paid work | +50 y | one per line, tier 7 |
| 8 | Ascend | the final undertaking | — | — | — | none; epilogue |

Breakthroughs 5–8 keep the accepted *roles* (CAMPAIGN-OUTLINE §Proposed later stages) and get content when reached; the shape above is fixed now so that B1–B4 are built on it.

### B.3 Classes as keys (B2–B4)

Tags per ADR 0015–0017. Keys added here. "Raises" means family cap.

| Class | Tags | Raises | Also |
|---|---|---|---|
| Body Disciple | Body | Circulation +2 | unlocks Body module tier 1 |
| Sword Disciple | Sword, Spirit | Blade Intent 0→2, Projection 0→1 | Sword module tier 1 |
| Earth Listener | Earth | Ground Reading 0→2 | Earth module tier 1 |
| Formation Student | Formation, Spirit | Array Craft 0→2, Projection 0→1 | Formation module tier 1 |
| Iron Marrow Adept | Body | Circulation +3 | Body tier 2; requires Body ≥ 1 |
| Mountain Vessel | Body, Earth | Circulation +1, Ground Reading +1 (0→1 if absent) | Body tier 2 **and** Earth tier 1 (shallow entry to a second line) |
| Spirit Blade | Sword, Spirit | Blade Intent +2 (0→2 if absent), Projection +2 | Sword tier 2 |
| Earth Array Adept | Earth, Formation | Ground Reading +1, Array Craft +1 (0→1 if absent) | Earth tier 2 and Formation tier 1 |
| Pill Refiner | Alchemy, Body | Refining 0→2, Circulation +1 | Alchemy tier 1; open entry (the line starter, like an Arcanum job) |
| **Sutra Reader** (B3 scholar) | none | Lore +3, Qi Sense +1, +1 to every family already > 0 | requires Lore ≥ 6; bill 150 coin + 2 Lore-study objectives; raises *no* family from 0 |
| Jade Body | Body | Circulation +3 | Body tier 3; Body ≥ 2 |
| Sword Heart | Sword, Spirit | Blade Intent +3, Projection +1 | Sword tier 3; Sword ≥ 2 |
| Mountain Heart | Body, Earth | Circulation +2, Ground Reading +2 | Body ≥ 1 and Earth ≥ 1 |
| Stone Ward | Earth, Formation | Ground Reading +1, Array Craft +3 | Earth ≥ 1 and Formation ≥ 1 |
| Spirit Warden | Spirit, Formation | Projection +3, Array Craft +1 | Spirit ≥ 2 |
| Spirit Alchemist | Spirit, Alchemy | Projection +2, Refining +2 | Spirit ≥ 1 and Alchemy ≥ 1 |
| Golden Cauldron | Alchemy | Refining +3 | **Alchemy ≥ 1** (reverts Q72; see Part F) |
| **Wandering Scholar** (B4 scholar) | none | Lore +4, Qi Sense +2, +1 to every family > 0 | requires Lore ≥ 10; bill 600 coin + 4 Lore-study objectives |

ADR 0017's "at least two options per history" is satisfied universally by the scholar line, so the specialist roster no longer needs a universal door.

### B.4 Line modules (what each line owns)

Each module is 12–20 records at tier 1, growing by tier. Template, instantiated per line:

- 3–4 **practice tasks** (timed, train the family; `at` curves; the tier's top one raises cap +1 once)
- 2 **home arrangements** (consume space; one raises cap +1, one raises rate)
- 1 **resource** (exclusive; cap starts 0, raised by an arrangement)
- 2 **recipes** (consume line resource + herbs; produce a consumable that supports expeditions or trials)
- 2 **sites** (expedition destinations; first clear raises cap +1; repeat yields resource)
- 1 **teaching record** (requires Lore ≥ k; the line's next-tier class requires it)

Shared module: Lore (scripture study tasks, the three practitioners' lessons as records), Qi Sense (observation tasks at every site), Home (tiers, space, generic arrangements), Work (jobs per region), Karma (defined, empty until B5).

### B.5 Home

| Tier | Name | Space | Rate | Unlock | Locks |
|---|---|---|---|---|---|
| 0 | Hayloft | 2 | — | start | — |
| 1 | Lean-to | 4 | — | 40 coin + 6 timber | Hayloft |
| 2 | Cottage | 8 | Qi +0.1/min | Foundation + 300 coin | Lean-to |
| 3 | Ridge Room (Old Ridge) | 10 | Ground Reading rate +10%, Lore rate −10% | B2 | — (relocation; Cottage kept, cannot be occupied simultaneously) |
| 4 | Basin Lodging (market settlement) | 12 | coin −1/min rent | B3 | — |
| … | line homes (Mountain Hermitage, Blade Hall, Array Court, Pagoda) | 20–40 | line-specific caps/rates | line tier 3 class | — |

Relocation carries arrangements that fit; place-bound ones (channel arrangement) must be re-established (accepted ADR 0006).

### B.6 Lifespan and bank

- Start age 18, natural lifespan 80 (accepted). **1 activity hour = 0.25 fictional years** (provisional). Pauses and bank accrual do not age.
- Extensions per B.2 sum to +138 y by B7; plus longevity recipes in the Alchemy module.
- Bank: cap 1 h at start; Foundation → 6 h; B2 → 24 h; B3 → 72 h; a Formation tier-2 arrangement adds +24 h. 1:1 exchange and prompt delivery per ADR 0007/0019, unchanged. Bank balance is **not** checkpoint state (accepted ADR 0002), kept.
- Retry rules per ADR 0002 unchanged.

---

## Part C — First playable slice, fully specified

Bound: cold start → Foundation. No classes, no waystation. Target: 25–40 min of active play to Foundation; 2–3 visits if played idle. Every value below is provisional **and specified**.

### C.1 Stat sheet (the Pouch moments)

| Quantity | Start | Cap at start | Raised by | Gates |
|---|---|---|---|---|
| Coin | 0 | **12** | Coin Pouch 12→30 (12 coin); Strongbox arrangement 30→80 | every purchase |
| Herbs | 0 | 5 | Herb Rack arrangement 5→20 | Foundation bill; Marrow Tonic |
| Timber | 0 | 6 | — | Lean-to |
| Stone | 0 | 8 | — | channel work, channel arrangement |
| Qi (reservoir) | 0 | **0** | Cracked Jade Slip 0→5; Foundation 5→20 | exercises, Settling |
| Lore (family) | 0 | 0 | Jade Slip 0→2; Granny Shu's reading 2→3; Foundation +2 | teaching records |
| Qi Sense (family) | 0 | 0 | Jade Slip 0→2; Fernhollow sitting 2→4; Foundation +1 | site observations |
| Circulation (family) | 0 | 0 | Channel Arrangement **or** Steady-Attention exercise 0→1; Foundation +1 | Settling; B2 pointers |
| Home space | — | 2 (Hayloft) | Lean-to 4 | arrangements |
| Time bank | 0 | 1 h | Foundation 6 h | acceleration |
| Age | 18 | 80 | Foundation +5 | — |

### C.2 Places and people

- **Lowbridge**: a village where the mill stream meets the ferry road, the wilds beyond the ridge. Home: the hayloft above Miller Wen's barn.
- **Miller Wen** — gives Mill Work; later commissions.
- **Granny Shu** — herb-wife and peddler. Sells the Cracked Jade Slip (6 coin, "cracked, half the characters gone, nobody wants it"). Buys herbs. Reads the slip's hard characters once Lore 2 (raises Lore cap to 3).
- **Headman Lu** — posts the Mill Channel repair bounty (the channel investigation's paid frame).
- **Mill Channel** — the damaged stream channel; awkward terrain; clear qi.
- **Fernhollow** — the sheltered hollow; accessible; faint qi.

### C.3 Records

Durations are real seconds/minutes at ordinary speed; `at` are repetition thresholds.

**Work**

| id | require | length | result | at |
|---|---|---|---|---|
| mill_work "Haul sacks at the mill" | — | 30 s | coin +3 | 10: coin +1; 30: coin +1; 120: length +10 s ("your back") |
| gather_herbs | Qi Sense ≥ 1 | 45 s | herbs +2 | 10: herbs +1 |
| cut_timber | field kit | 60 s | timber +2 | — |
| ferry_hauling | Lean-to | 40 s | coin +6 | 20: coin +2 |

**Purchases / upgrades**

| id | require | cost | mod |
|---|---|---|---|
| coin_pouch | coin ≥ 12 (shown when cap first hit) | 12 coin | coin.max +18 |
| jade_slip "Cracked Jade Slip" | coin_pouch | 6 coin | qi.max +5, lore.max +2, qisense.max +2; unlocks `breath_gathering`, both site observations |
| field_kit "Cord, stakes, hook" | lore ≥ 1 | 20 coin | unlocks `cut_timber`, `clear_channel` |
| shu_reading "Have Granny Shu read the hard characters" | lore ≥ 2, 5 herbs | 5 herbs | lore.max +1; unlocks `fragment_notes` task |

**Practice**

| id | require | length | effect | cap rule |
|---|---|---|---|---|
| breath_gathering "Practise the slip's breath method" | jade_slip | 60 s | qi +1, qisense.exp +1 | stops at qisense cap with message "The slip says nothing more. The next character is missing." |
| fragment_notes "Copy and study the slip" | shu_reading | 90 s | lore.exp +1 | — |
| sit_fernhollow "Sit in the hollow at dusk" | fernhollow_observe | 3 min | qisense.exp +2; first completion qisense.max +2 | — |
| steady_attention "Steady-attention exercise" | sit_fernhollow ×3, qisense ≥ 3 | 2 min | circulation.exp +1; first completion circulation.max 0→1; grants technique `faint_trace` | — |
| channel_exercise "Circulate at the channel stone" | channel_arrangement | 2 min | circulation.exp +1 (+50% at home) | — |
| settling "Settle the foundation" | foundation unlocker purchased | 10 min | — | the breakthrough act |

**Sites / expeditions**

| id | require | length | result |
|---|---|---|---|
| channel_observe "Walk the broken channel" | qisense ≥ 1 | 2 min | discovery: *flow pattern* (text); unlocks `clear_channel`; stone +2 |
| clear_channel "Clear the fall and reset the stones" | field_kit, stone ≥ 3 | 5 min | stone −3; coin +15 (Headman's bounty); discovery: *the stones hum where the flow bends*; unlocks `channel_arrangement` |
| fernhollow_observe "Sit quietly in Fernhollow" | qisense ≥ 2 | 2 min | discovery: *a faint current, easy to lose*; unlocks `sit_fernhollow` |
| channel_return "Return to the channel with the arrangement" | channel_arrangement, circulation ≥ 1 | 3 min | circulation.max +1; stone +4 |

**Home arrangements** (space in Hayloft = 2)

| id | require | cost | space | mod |
|---|---|---|---|---|
| practice_mat | — | 8 coin | 1 | breath_gathering length −15 s |
| herb_rack | lore ≥ 1 | 10 coin, 2 timber | 1 | herbs.max +15 |
| channel_arrangement "Channel stones set in the floor" | clear_channel | 4 stone | 2 | circulation.max 0→1; circulation rate at home +50%; unlocks `channel_exercise` |
| strongbox | lean_to | 25 coin, 2 timber | 1 | coin.max +50 |
| lean_to (home tier 1) | 40 coin, 6 timber | — | space 4 | locks Hayloft |

**Foundation (breakthrough 1)**

Unlocker "Lay the foundation" appears when Circulation cap ≥ 1. **Need 3 of 5:**

1. Qi Sense level ≥ 3
2. Circulation level ≥ 1
3. Any arrangement of space ≥ 2 installed (channel arrangement or practice mat + herb rack)
4. Both sites' first observation completed
5. 100 coin earned lifetime

Bill: 10 herbs, Qi reservoir full (5/5), then the `settling` task (10 min). On completion:

- Lifespan +5; qi.max 5→20; qisense.max +1; lore.max +2; circulation.max +1; bank cap 1 h → 6 h.
- **Locks** `mill_work` and Hayloft (if still occupied, the Lean-to is granted at no cost with a line of text).
- Unlocks: `ridge_trail_observe` (the Old Ridge lead), "a traveller asks after the one who cleared the channel" (first cultivator contact), the four B2 introductions' *first* records (teaching records requiring Lore ≥ 3), Cottage purchase.
- Pause for a decision.

### C.4 The slip (the opening's one piece of prose)

> *Lesser Breath-Gathering Method* — leaves 1, 2, 8 of twelve. "Sit as water sits. Draw the breath past the throat and let it pool below the navel. Feel for what is not air." Leaf 8: "…when the pooled breath turns, do not follow it. Wait at the turning. The rest is…" The remaining characters are chipped away.

Leaf 8's missing sentence is what the channel's humming stones and Fernhollow's steady-attention exercise each supply, differently.

### C.5 Session script (what the first 40 minutes look like)

| min | event |
|---|---|
| 0 | Hayloft. One task: Haul sacks. Coin 0/12. |
| 2 | Coin 12/12 — **cap**. Coin Pouch appears. |
| 3 | Pouch. Granny Shu's stall: Cracked Jade Slip, 6 coin. |
| 4 | Slip read. Qi 0/5, Qi Sense 0/2, Lore 0/2 appear. Breath-gathering task appears. Both site observations appear. |
| 7 | Qi Sense 2/2 — **cap**. "The next character is missing." Two leads glow: channel (needs kit, 20 coin) or hollow (open now). |
| 8–14 | Either: work for the kit, cut timber, walk the channel; or sit Fernhollow (cap → 4), gather herbs. |
| 15–25 | Clear the channel (bounty 15 coin, arrangement) **or** steady-attention (Circulation 0→1). |
| 25–30 | "Lay the foundation" appears with its 3-of-5 list; player fills the gaps (herbs, a second arrangement, the other site's first look). |
| 30–40 | Settling (10 min; bank can accelerate). Foundation. Locks, extensions, three new leads. Decision pause. |

Idle variant: the same in 2–3 visits with the bank covering the 10-minute tasks.

### C.6 Interface (desktop-first, text + panels; accepted)

Left: resources with `x/cap` and a thin bar; families as `level/cap` with "what raises this" on hover. Centre: task groups (Work / Practice / Sites / Home) as buttons with progress bars, collapsible. Right: log of discoveries and unlocks, prose entries for the slip and site findings. Top: bank `x/cap` with an Accelerate toggle that names the current objective. Every cap hit posts one log line naming the raiser if it is visible, or "you don't know yet" if it isn't.

---

## Part D — Data model

Mirror Arcanum's record grammar; it is MIT and proven, and it makes Part E a script instead of a reading exercise.

```
record := { id, name?, desc?, group?, tags?,
            require?: expr,   // visible when true
            need?: expr,      // purchasable/startable when true
            cost?: {res: n},  // paid once
            length?: seconds, // timed task
            run?: {res: n/s}, result?: {res: n}, effect?: {res: n/s},
            mod?: {"<x>.max": n, "<x>.rate": n, ...},  // persistent while owned
            at?: {rep: {path: n}}, every?: {n: {path: n}},
            disable?: [ids], max?: n, space?: n }
expr := JS-like boolean over g.<id> (level), g.<id>.max, tags (g.t_body), classes (g.body_disciple)
```

Record kinds: `resource`, `family` (skill), `task`, `site`, `arrangement`, `home`, `class`, `breakthrough` (unlocker + pointers), `teaching`, `recipe`, `technique`. Lines are modules: one JSON per line, loaded by manifest. Saves store level/cap/rep per record id plus class history and age.

Engine: 1 s tick (Arcanum uses 120 ms; we have no combat), one active task, bank accrual on elapsed wall-clock, acceleration = run ticks from bank until objective or pause. Persistence IndexedDB with export.

Technology decision (open, Part F): reuse Arcanum's `src/modules/parsing.js` + `src/dataLoader.js` (requirement compiler, modifier application) under MIT, or write a ~1 kLOC equivalent. Either way the data grammar above is the contract.

---

## Part E — Validation

Built into the data pipeline, run on every content change:

1. **Reachability**: walk every `require`/`need` expr from the cold-start state; every record must be reachable; every family's cap must have at least one raiser reachable before any record that requires that family.
2. **No self-key**: a class may not be required (directly or via tag) by any record it unlocks.
3. **History coverage**: enumerate A→B→C histories (11 and 25 per the class map); for each, assert ≥ 2 B4 options reachable including the scholar, and the full module tier for the chosen line.
4. **Pacing model**: extend `support/pacing-model/pacing-model.py` to run from the record data rather than a hand-typed list; emit time-to-foundation at 0 bank, time-to-B2 at 2 visits/day; fail if foundation > 60 min active or any single pre-B4 task > 2 h ordinary.
5. **Playtest questions for the slice** (ranked): does the first cap/raise/reveal loop produce "what just opened?"; does raising a family cap by discovery read as transformation; channel-vs-hollow — tree choice or convergence; does locking Mill Work feel like growing up; empty-bank short visits — alive or dead.

---

## Part F — Supersessions and open decisions

**Reversed or changed from accepted records**

| Record | Change | Why |
|---|---|---|
| ADR 0013 ¶2 "does not require … a numerical … resource cap formula" | Reversed: caps are numeric, universal, start at 0 | It is Arcanum's spine (59/60 skills keyless) |
| ADR 0017 / Q72 Golden Cauldron open entry | Golden Cauldron requires Alchemy ≥ 1; a Scholar line (Sutra Reader B3, Wandering Scholar B4) is the universal second option | Arcanum's fallback is priced in generic currency, broad, and never holds an exclusive key |
| No lock rule anywhere | Breakthroughs lock prior job and home tier; class choice closes same-tier rivals; no revision | Arcanum locks at every tier; transformations must close something |
| Q114/Q123 foundation "within the first day" | Within the first session (25–40 min active) | Incremental tempo; Arcanum's first class is ~3 min |
| Bank cap "a few days" | 1 h at start, raised by progression | Arcanum `offlinetime.max 3600` at start; the cap is a reward |
| Morality absent | Karma axis defined, content deferred | Arcanum gates a module on it; xianxia has the native analogue |
| Five B3 milestones as authored projects | Same five, as pointers into existing records | Arcanum's tier quests are pointers |

**Unchanged**: eight breakthroughs; four starters; B3/B4 rosters and tags; mastery counting; one activity at a time; no energy meter; 1:1 bank; age 18/80; retry rules; Cloudwell trial structure (ADR 0018); noncombat viability; optional sects; desktop text-panel presentation.

**Decisions for the owner (three)**

1. **Tempo**: incremental (assumed here) or narrative. If narrative, Part C's durations ×10 and the bank/Cloudwell-day targets go.
2. **Scholar line** as the universal second option vs keeping Golden Cauldron open-entry and making it broad and expensive instead.
3. **Engine**: reuse Arcanum's MIT parser/loader or rewrite to the same grammar.

Everything else in this plan is a provisional number waiting for Part E to disagree with it.
