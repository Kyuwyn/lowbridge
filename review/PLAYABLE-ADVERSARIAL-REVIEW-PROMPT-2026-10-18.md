# Independent adversarial review — Lowbridge first playable

Review the attached Lowbridge project as an independent game designer and software reviewer. Your job is to find the strongest evidence that the playable fails its intended experience or its mechanical contracts. Be skeptical of the implementation, the design, the source research, and the validation reports. Do not reward a large test count or polished documentation with an assumption of correctness.

Produce a review report, not implementation. Do not continue building the campaign. You may run the project and create disposable experiments or tests in a separate copy. Preserve the supplied snapshot and use isolated browser storage; do not import over or manipulate a player's live save.

## What you are reviewing

Lowbridge is a browser-first cultivation incremental RPG inspired by Arcanum / Theory of Magic. An ordinary villager finds an incomplete jade slip, studies and practises, reconstructs a missing method through a channel or hollow investigation, and reaches Foundation.

The implemented slice ends at Foundation (B1). It has a clean TypeScript engine, JSON content, native DOM controls, capped resources, practice runways with per-level effects, purchases and home space, one active objective, a bank of unused time, age/lifespan, checkpoint retries, IndexedDB persistence, and JSON import/export. B2–B4 classes and line modules are design proposals; their Python lattice validator is not a playable later campaign. Evaluate the future design separately where it exposes a problem in the current foundation or a material expansion risk. Missing later content is not itself an opening-slice defect.

The central questions are: **Does this work for a player who does not know the scripted route? Does it create worthwhile incremental decisions? Can its time and save systems be trusted? Have the research and tests earned the claims made about them?**

## Materials and source authority

The companion ZIP contains the project snapshot, all three research studies and their evidence files, current design and implementation plans, historical design decisions, source, tests, validation scripts, playtest reports, screenshots, and save fixtures. Paths below are relative to its extracted project root. `MANIFEST.json` records the included files and SHA-256 hashes. Dependencies and the complete upstream Arcanum checkout are not bundled.

Read in this order:

1. `README.md`, `design/IMPLEMENTATION-PLAN-2026-10-18.md`, and `design/DESIGN-PLAN-2026-10-18.md`, especially §0 and Parts A, C, E, and F. These establish current scope, mechanical rules, recorded clarifications, and supersessions.
2. The three research studies reproduced verbatim in the appendices below. Their original files and supporting JSON evidence are also included under `research/`.
3. `src/data/shared.json`, `src/data/opening.json`, and the engine, expression evaluator, persistence, browser lifecycle, and UI code under `src/`. Follow the actual implementation for each material finding.
4. `playtest/SIMULATION-REPORT.md`, `playtest/SMOKE-REPORT.md`, `playtest/smoke-results.json`, the playtest sheet, fixtures, and screenshots. Treat these as claims and observations to verify, not independent approval.
5. `tests/`, `scripts/routes.ts`, `scripts/validate.ts`, `scripts/browser-smoke.ts`, and `design/validation/`. Identify shared assumptions and blind spots between the tests and the system they exercise.
6. Consult the older `design/decisions/` and drafts only for provenance or unresolved intent. Read `review/THIRD-PARTY-REVIEW-2026-10-18.md` and `review/REVIEW-RESPONSE-2026-10-18.md` after forming your initial view, to reduce anchoring and check whether claimed repairs actually hold.

Resolve conflicts explicitly. Current accepted owner decisions and design §0/Part F supersede older draft rules; code is evidence of behavior, not authority to redefine a requirement. Research describes the reference game and supports interpretation; it does not automatically impose every upstream feature on this adaptation. Neither a research interpretation nor an implementation clarification is immune from criticism. Distinguish an intentional change, an unresolved contradiction, and a defect.

Important provenance traps:

- The claim that “59 of 60 skills start at cap zero” was withdrawn. The corrected mechanics study records the runtime default of 5. Missing JSON properties must be interpreted through runtime defaults. The legacy evidence key `base0_skills_opened` survives as a historical field name; it does not establish zero-cap skills.
- The old `review/THIRD-PARTY-REVIEW-PROMPT.md` embeds obsolete document copies and is deliberately excluded from this bundle. The older frozen review packet is also excluded. Do not substitute either for the current documents.
- Scholar/Sutra Reader and Karma are not current requirements. Golden Cauldron is the planned open-entry fallback. Old rules saying bank spending remains lost after a retry were superseded by the refund rule.
- The source studies distinguish pinned stable 0.12.3.1, wiki 0.12.0.0, and historical testing 0.12.12.9. Do not merge their measurements or assume a historical deployment observation is current. Challenge claims of structural equivalence where their evidence is insufficient.

The owner has accepted qi as a spendable reservoir; separate acquisition routes for `faint_trace` and the channel arrangement through B2, while allowing the player to visit both routes; and the future roster additions Blade Body, Deep Listener/Vein Adept, and Array Keeper/Grand Array. Assess their consequences candidly, but do not present reversing a settled preference as a correctness fix. The bank starts **empty**, with a **one-hour capacity**.

## Source research to challenge

- `research/arcanum-mechanics-2026-10-18/MECHANICS-STUDY.md`: corrected mechanical analysis, skill web, cap raisers, rates, repetition curves, homes, advancement, and limitations. Supporting evidence: `gating-evidence.json`, `task-curves.json`, `homes.json`.
- `research/arcanum-study-2026-10-16/STUDY.md`: scope and content census, runtime architecture, deployment comparison, and limitations. Supporting evidence: `snapshot.json`, `content-census.json`, `source-metrics.json`, `deployment-check.json`, `count-content.py`, and `UPSTREAM-LICENSE`.
- `research/arcanum-study-2026-10-16/CLASS-MASTERY-STUDY.md`: class history, accumulated expertise tags, separate mastery skills, and depth/hybrid opportunities. Supporting evidence: `class-mastery-evidence.json`.

Primary reference: [Arcanum repository at the studied commit](https://gitlab.com/mathiashjelm/arcanum/-/tree/a2632d2edf3e07e9168fff81167b11f2792e9197), commit `a2632d2edf3e07e9168fff81167b11f2792e9197`. The studies link relevant source files and line anchors. [Reference game](https://mathiashjelm.gitlab.io/arcanum/) and [wiki](https://theoryofmagic.miraheze.org/) are useful context, but may have changed since the recorded research. Verify consequential disputed claims against the pinned primary source when available; disclose when you cannot.

## Required lines of attack

### 1. Can ordinary choices break progression?

Trace visibility (`require`), actionability (`need`), costs, capacity, rewards, discovery stops, and locks as a single system. Seek circular gates, invisible prerequisites, unaffordable bills, mandatory items that cannot fit, self-keying cap raises, unrecoverable purchases, misleading dead ends, and choices that are nominally optional but actually mandatory.

Try plausible orders outside the provided route preferences: mat or furniture first; delayed storage or field kit; home capacity filled; money spent after a lead becomes visible; both investigations mixed; a task stopped and resumed; an objective changed near a reward; capped knowledge with unfilled qi; repeated work at a curve threshold; and Settling interrupted after payment. Distinguish a recoverable detour from a softlock and give the recovery cost when relevant. Prove that Foundation's mandatory method cannot be bypassed, that distinct route rewards require their actual acquisition histories, and that rewards cannot be repeated or lost at transition boundaries.

### 2. Is the progression worth playing?

Evaluate entry → useful runway → cap → external discovery against the corrected research. Are per-level effects perceptible? Does a cap reveal an interesting next possibility or merely demand another checklist item? Do the routes change what the player does or understands, or converge into the same wait with different labels? Does the mandatory core preserve the meaning of Foundation while the supporting choices retain agency?

Assess the first several minutes, first qi practice, long stretches before Circulation, optional furniture costs, discovery cadence, objective interruptions, and the payoff at Foundation. Identify dominant choices and traps, but separate mathematical dominance from a player preference. Discuss whether the current slice can actually test the promised class/skill-web experience, and what remains unknowable until later content exists. Do not invent human pacing evidence from a simulated run. Recommend numerical changes only with a stated mechanism and evidence; otherwise frame them as playtest hypotheses.

### 3. Does time accounting conserve the right things?

Build explicit expectations independently of engine helpers. Check active wall time, unused time, bank spending, age, fractional progress, and objective boundaries. No elapsed interval should be credited twice, disappear without a stated rule, or bypass age costs. Acceleration should spend bank only on the current objective. Check capped bank, exhausted bank, discovery stops, long offline returns, backward/forward clock changes, background tabs, open-tab suspension, and closed-tab return. Distinguish tested browser behavior from assumptions about other browsers or operating systems.

Attack lifespan exhaustion and retry around partial ticks, paid task starts, discoveries, and Foundation. Can repeating retry manufacture bank or progress? Does the checkpoint refund spent bank while retaining legitimate later accrual, without duplicating either? Does the new checkpoint contain the correct durable state? State any accounting assumptions before judging an ambiguous edge case.

### 4. Are saves and imports resilient?

Exercise reloads with active work, backup recovery, malformed/truncated/unsupported imports, invalid progress or objectives, failed storage operations, and simultaneous tabs. Check that a rejected import leaves the existing journey intact, an accepted import does not receive unearned offline credit, and concurrent sessions cannot silently overwrite newer progress. Inspect versioning and validation boundaries for ordinary corruption and adversarial input, without demanding anti-cheat or server security from a local single-player game. Review expression evaluation for unsafe execution and invalid-data behavior.

### 5. Can a player understand and operate it?

Use the UI without reading the solver first. Check whether visible unavailable actions explain the relevant blocker, cap notices describe known raisers accurately, unknown-raiser messages preserve useful context, the bank and qi are understandable, and future leads are honest about the playable endpoint. Check keyboard navigation, focus during ticks, accessible labels, contrast, readable numbers, and narrow-screen controls. A screenshot or lack of horizontal overflow alone does not establish usability. Keep recommendations compatible with a text/panel incremental and player agency; avoid turning the journal into a mandatory walkthrough.

### 6. What does the validation actually prove?

Reported baseline, to be independently checked: 36 tests / 266 assertions; 41 of 41 records witnessed across four cold starts; channel Foundation at 2,330 ordinary activity seconds (38m50s); hollow at 2,420 seconds (40m20s); both with an empty starting bank and no bank spent. Optional coverage histories take longer. The old Python estimates are 31m20s and 30m50s. The B4 validator reports 15 histories, solely for the planned class lattice.

Four successful histories establish reachability witnesses, not exhaustive ordering safety. Agreement between browser smoke and simulation is valuable but may share the same engine, route assumptions, or incorrect specification. Inspect how validators define “reached,” “mandatory,” and “no self-key”; look for tautologies and blind spots. Use at least one independent derivation or counterexample search for the highest-risk contracts. Temporary data mutations or small independent models are appropriate if they test a plausible failure rather than duplicate the implementation. Do not manufacture a second full engine just to claim independence.

Suggested reproduction commands, from a disposable extracted copy:

```sh
bun install --frozen-lockfile
bun run typecheck
bun test
bun run validate
python3 design/validation/opening-sim.py
python3 design/validation/opening-sim.py --real-json
python3 design/validation/b4-gates.py
bun run build
bun run smoke
```

See `README.md` for Bun and Playwright setup. Browser smoke uses an isolated context and its own temporary server. For manual inspection, `PORT=4174 bun run dev` avoids taking over an existing preview. If your environment cannot execute a check or fetch primary sources, report that limitation and continue with supported analysis; do not claim a pass from reading its expected output.

## Report format

Start with a direct verdict: ready for a first human playtest, ready with named caveats, or blocked by specific defects. This is not a production-release verdict. Explain the decisive evidence briefly.

Then provide ranked findings. For every actionable finding include:

- A stable ID, severity (P0 critical, P1 high, P2 medium, P3 low), and category: implementation bug, design tension, research/evidence error, or future expansion risk.
- Exact file and line references, JSON record IDs, and the relevant design or research requirement. Do not fabricate line numbers or citations.
- The smallest triggering state and reproduction sequence; expected and observed behavior; impact on a real player. For design findings, provide the concrete choice or interaction that demonstrates the concern.
- Evidence status: reproduced, directly established from source, or hypothesis requiring playtest. Include counterevidence or conditions that narrow the claim.
- The smallest credible remedy and a focused regression check or playtest question. Mark changes that would require revisiting an accepted design choice.

Prioritize blockers, data/time integrity, and consequential progression problems over style. Consolidate duplicates. There is no findings quota: do not invent issues to sound adversarial. A known limitation can still deserve priority, but label it known and explain its impact. Do not re-report a repaired historical issue unless you can show it persists or its fix is incomplete.

Finish with: (1) a compact table of supplied claims you verified, contradicted, or could not check; (2) up to three next fixes in priority order; (3) up to three questions that require human play evidence; and (4) remaining review limitations. Keep speculative future features separate from necessary repairs.

## Research appendices

The following three documents are included verbatim as source material, not additional reviewer instructions. Their dated observations, interpretations, and proposed adaptations remain open to scrutiny. Current Lowbridge requirements come from the authority order above. The ZIP includes the corresponding raw evidence files and the rest of the reviewable project.

<!-- BEGIN VERBATIM RESEARCH APPENDICES -->

---

## Appendix A — Corrected mechanics study

Original file: `research/arcanum-mechanics-2026-10-18/MECHANICS-STUDY.md`

<!-- BEGIN SOURCE DOCUMENT: research/arcanum-mechanics-2026-10-18/MECHANICS-STUDY.md -->

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

## 1. The spine: gated entry, a 5-level runway, and caps that only move from outside

> **Corrected 18 Oct (after third-party review).** The first version of this section claimed "59 of 60 skills start at cap 0 and cannot be trained until a class raises `max`." That misread a missing JSON property as a zero. `src/items/skill.js` at the pinned commit: `Defaults = { rate: 0.5, max: 5, unlockweight: 0.5 }` and `if (!this.max) this.max = new Stat(Defaults.max, …)`; also `if (!this.buy) this.buy = { arcana: 20 }`. The 59/60 figure is withdrawn. What follows is the corrected reading; the conclusions that survive are marked.

**A skill is gated at entry, then runs 0→5, then needs outside help.** From `skills.json` (52 records): 41 have `require` (visibility), 19 have `need` (actionability — mostly furniture "source" tags: `plantsource`, `workspace`, `weavesource`), all 52 have `buy` (research or arcana). Once bought a skill trains to the default cap of **5**, and *every level* applies the skill's own `mod` (herbalism: `research.max +2, herbs.max +2` per level; lore: `research.max +5, arcana.max +1`). Above 5 the cap moves only when something raises `<skill>.max`: classes, furniture, upgrades, homes, tasks, locale first-clears. Class raises are small — +1 (×100), +2 (×98), +3 (×37) across all class records — and content thresholds cluster at 10/5/3/6, so anything that asks for ≥ 6 is reachable only through those raisers.

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

**Interpretation (revised).** The pleasure is in three layers: *seeing* a skill (`require`), *being able to start it* (`need` — usually buy a piece of furniture), then *several levels of visible growth* each paying out a small passive bonus, then a wall at 5 that a class or discovery moves. A design that copies only the wall (caps at 1–2, raised by +1) gets boolean quest flags with numbers on them. The design's ADR 0013 ("practice can't cross a knowledge limit; teaching or discovery opens it") describes the wall; it does not describe the runway, the per-level payout, or the require/need split.

## 1b. The skill web (added after the wiki `Skills` pass)

`skills.json`, 52 records, checked against the wiki `Skills` table. Skills are not a list; they are a graph with six recurring shapes.

| Shape | Count | Examples (require → effect) |
|---|---:|---|
| **Trunk with threshold clock** | 1 | Mage Lore gates at 3 (all seven elemental entries, Nature Studies), 6 (Anatomy, Spirit Communion), 7 (Conjuration), 8 (Mysticism), 10 (Charms), 11 (Enchanting), 15 (Spellcraft), 20 (Arcane Mastery), 25 (Magiphysics). Its level is the campaign clock. |
| **Entry skills** needing a *source* arrangement | 14 | `firelore: need lore ≥ 3 && firesource`; `herbalism: need plantsource`; `crafting: need workspace`; `potions: need workspace && potsource`; `enchanting: need 3 kinds of gem`. Cheap (arcana 5–14), per level +1 element max, +0.01 rate, +5 research max. |
| **Bridge skills** requiring two parents | 8 | Nature Studies = Herbalism 3 + Lore 3; Potions = Alchemy 2 + Crafting 3; Conjuration = Lore 7 + Divination 3; Magic Beasts = Animals 7 + Nature 5; Charms = Lore 10 + Enchanting 5; Vivification = Anatomy 1 + Spirit Communion 5; Travel = Languages + World Lore ≥ 12 (a *sum*); Puppetry = Crafting 8 + Spirit Communion 5. Hybrids live at the **skill** layer; hybrid classes then require the bridge (Necromancer needs `reanimation ≥ 7`). |
| **Mastery skills** needing entry ≥ 10 **and** the Master-of tag | 7+ | Fire Mastery = Pyromancy 10 + Master of Fire; runs the element itself (`fire 0.5/s`); per level potency, element max/rate, rune slots. Class-gated depth. |
| **Cross-feeders**: per-level mods on *other* skills | 9 | Languages → Lore rate +0.1; Weaving → Crafting max +0.1, rate +0.05; Runic Lore → Lore max +0.2, Languages max +0.2; History → Travel max/rate; Magic Beasts → Animals rate; Blood Lore / Vivification → Anatomy rate. Fractional cap contributions mean ten levels of a helper = +1–2 cap on the trunk. |
| **Alternative / action entries** | 5+ | Divination = Spirit Communion 6 **or** Mysticism 5; Trickery = 10 performances **or** Tier 1 **or** a Hall item; Concentration = 2 locales completed; Rejuvenation = 200 healing casts; Wizard Lore = count of Knowledge classes + T5 ≥ 2. Skills unlock from *doing*, not only from having. |

Running costs: every skill runs stamina; 8 also run research, 4 mana, 3 arcana, and the element-specific ones drain their own element (fire, water, air, earth, light, nature, spirit, hp, gold). Training a line's mastery spends the line's resource, which the line's entry skills generate — the closed rate economy per line.

**Interpretation.** A line in Arcanum is not one skill with a wall; it is an entry skill (source-gated, cheap), one or two bridges to neighbouring lines (the hybrid identities), a mastery (class-gated, resource-draining), and helpers that feed the trunk. The class is the key to the mastery; the bridges are where most of the "history-dependent opportunity" actually comes from. Design rule 14: **hybrids are techniques first, classes second.**

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

**Interpretation (revised).** Apprentice at ~3 minutes is a tutorial class — it opens the Home, Skills and Quests tabs rather than completing a stage. The first real tier-up (Neophyte → T0 Graduand Magus: `research.max ≥ 100`, `lore ≥ 4`, 4 of 4 T0 quests, the Leaky Cellar) is on the order of 30–60 minutes of active play [I — not measured here; wiki quest list plus the third-party reviewer's estimate]. The honest comparison is therefore: Arcanum's *tutorial* is three dense minutes and its first *stage* is under an hour; the design's foundation stage was budgeted at ~8 activity hours. The gap is real but one order of magnitude, not two.

## 10. Control as a reward

Apprentice-era play is one action at a time with a stamina budget. Later tiers add Goals, Hobbies, waiting behaviour, and extra action slots (`extraaction.json`; "Timeline Bifurcation" at T4 *(wiki)*). The stored-time bank starts at 1 hour and grows. Progression hands the player more scheduling agency, not just bigger numbers.

## 11. Arcanum already contains cultivation

`modules/swordplay.json`: Spell Blade (T3) → Blade Weaver (T4) → Arcane Dervish (T5) → Eldritch Knight (T6), gated by `t_swordclass` and `bladelore`. The Elegant Pagoda home carries "Mysterious Sword Arts" and a "**Breakthrough**" upgrade *(wiki)*. The reference's own community already reads xianxia into it.

## What this corrects in the earlier studies and review

| Earlier statement | Correction |
|---|---|
| Study: "hard caps force new solutions" as one example (gold 5 → Pouch) | Caps are the spine, but skills start with a **default cap of 5** (`skill.js`), not 0. Entry is gated by `require`/`need`/`buy`; classes raise caps above the runway and gate some entries. The first version of this study's "59/60 keyless" claim was wrong and is withdrawn. |
| Study: classes "close alternatives at the same tier" | Understated. Tier-up locks tasks and homes too; homes lock homes; some locks are hidden. |
| Study: never timed the opening | Tutorial class ≈ 3 minutes with ~15 reveals; first stage ≈ 30–60 min [I]. Still the most important pacing fact for an incremental, but see §9 for the corrected comparison. |
| Review: "3-of-5 milestones is checklist drift" | It is a faithful lift of the tier-unlocker shape. The flaw is that the design's five are bespoke, not pointers into existing trees. |
| Review: "4→5→7 classes is over-wide" | Arcanum runs 5–9 per tier (core tags: 5/6/9/7/6/3/5). Breadth is in line. The missing thing is one shared module per line, with classes as keys. |
| Review: "Arcanum classes are data, the design's are content" | Both gate content. The difference is recursion: Arcanum's gated content re-raises its own cap; the design's class content is three beats and stops. |
| Review: "Golden Cauldron is a dominant fallback" | A universal fallback is a deliberate Arcanum feature (the mage line). Golden Cauldron lacks its escalating generic price and its ceiling (it reaches the specialist's exclusive field). |
| Review (unchanged, strengthened) | Zero caps in the opening; nothing closes on advancement; morality dropped with no decision record; bank cap fixed rather than grown. |

## Design rules Arcanum implies, stated as rules

1. A technique family (skill) is **gated at entry** (visible by `require`, startable by `need` — usually a home arrangement — and bought once), then has a **short runway** (3–5 levels) where every level pays a small passive bonus, then a wall.
2. A class raises walls (+1…+3) and opens some entries. Jobs count. Depth above the runway is reachable only through classes, arrangements, and first-clears.
3. Each family has 10–20 gated records (practice tasks, home arrangements, recipes, sites); several of them raise the family cap again.
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

- `gating-evidence.json` — per-class caps raised, zero-cap skills opened, downstream gated record counts; per-skill raisers and gated records.
- `task-curves.json` — the 23 core tasks with `at`/`every` progression tables.
- `homes.json` — all 41 home records (require, cost, mod, disable).
- Scratch: raw data files in `~/Work/tries/2026-10-18-arcanum-src/`, wiki dumps in `/tmp/tom-*.md` (not retained).

<!-- END SOURCE DOCUMENT: research/arcanum-mechanics-2026-10-18/MECHANICS-STUDY.md -->

---

## Appendix B — Original scope study

Original file: `research/arcanum-study-2026-10-16/STUDY.md`

<!-- BEGIN SOURCE DOCUMENT: research/arcanum-study-2026-10-16/STUDY.md -->

Arcanum / Theory of Magic — scope study, 16 October 2026

**Arcanum is a substantial, content-heavy single-player RPG built around incremental progression.** Its defining feature is an expanding set of possibilities: ordinary work leads to knowledge and infrastructure; those unlock new activities, identities, places, and eventually additional characters. The interface is mostly text and controls, but the design underneath spans several interacting games: an activity scheduler, a character build system, a home economy, combat, exploration, crafting, and shared progression across a wizard roster.

This study establishes the reference game's scope. It does not choose a theme, implementation approach, feature list, or development schedule for a successor.

**The reference is the linked stable game, version 0.12.3.1.** I inspected its opening loop in the browser and studied repository commit `a2632d2edf3e07e9168fff81167b11f2792e9197`, dated 19 September 2026. The deployed manifest, classes, tasks, Hall, and mechanics glossary were byte-identical to that snapshot. This is a five-file deployment check, not a claim that every deployed asset was compared. [Live game](https://mathiashjelm.gitlab.io/arcanum/), [pinned source](https://gitlab.com/mathiashjelm/arcanum/-/tree/a2632d2edf3e07e9168fff81167b11f2792e9197).

**The core loop changes the character's options.** Choose an activity, spend time and resources, gain resources or experience, acquire knowledge or infrastructure, and meet the conditions for something new. Combat and exploration provide materials, first-clear rewards, and learning opportunities. Homes and equipment change what the character can support. Classes direct future possibilities. The opening demonstrates the pattern immediately: Clean Stables costs stamina and earns gold; gold reaches a cap of five; a Pouch becomes available and increases that capacity. Accumulation alone cannot bypass a hard cap. [Tasks](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/tasks.json), [shipped mechanics glossary](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/hallgloss.json).

| System | What it contributes to play |
|---|---|
| Tasks and recovery | Work, study, train, produce, rest; competing uses of time and limited action capacity. |
| Resources and maximums | Gold, research, magical resources, reservoirs, skill caps, and other limits that require different solutions. |
| Skills and character advancement | Training, schools of magic, practical knowledge, levels, tier quests, and skill-cap increases. |
| Classes and character history | Exclusive class choices, moral consequences, and prerequisites based on earlier behavior. |
| Homes and furniture | Space, storage, recovery, workstations, magical sources, environmental bonuses and penalties. |
| Spells and spellcraft | Memorized spell cycles, active casting, and later construction of composite spells. |
| Equipment and crafting | Item types, materials, enchantments, consumables, and build tradeoffs. |
| Dungeons | Automatic combat, spell sequencing, enemies, loot, and first-clear rewards. |
| Locales | Primarily noncombat exploration with encounters, five stress types, rest, and permanent learning. |
| Clashes | Focused challenge fights with bespoke mechanics and attempts that reset when leaving. |
| Summons and companions | Additional combat participants constrained by capacity and character choices. |
| Automation | Repeating and waiting tasks, prioritized Goals, idle-filling Hobbies, and additional action slots. |
| Wizard's Hall | Switchable characters and shared prestige upgrades while retaining existing wizard progress. |
| Supporting interface | Progressive section reveals, tooltips, unlock notices, glossary, bestiary, travelogue, saves, and settings. |

The table describes systems present in the source and shipped explanations. It does not establish that every conditional branch is currently reachable. [Mechanics glossary](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/hallgloss.json), [interface section definitions](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/sections.json).

**The content is large enough that a complete feature match would be a major undertaking.** The standard manifest names 32 core data files and 32 content modules. A separate loader adds titles. Counting their authored top-level records produces 2,847 main records, 88 Hall records, and nine title templates: **2,944 raw content and support records**. This includes tags, stats, events, explanations, unused categories, hidden entries, and compatibility or placeholder content. It is not a count of 2,944 player-facing features. The bootstrap data occupies approximately 1.26 MB and 58,087 physical lines of JSON. [Manifest](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules.json), [title loader](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/chars/title.js).

| Main-game category | Raw definitions |
|---|---:|
| Tasks | 267 |
| Skills | 72 |
| Spells | 295 |
| Upgrades | 499 |
| Classes, including apprenticeship and jobs | 75 |
| Quests and advancement records | 53 |
| Homes | 47 |
| Furniture | 121 |
| Monsters, summons, and companions | 331 |
| Dungeons / locales / clashes | 33 / 21 / 3 |
| Encounters | 292 |
| Weapon / armor definitions | 30 / 57 |
| Materials / enchantments | 26 / 48 |
| Potions | 63 |

These category counts include the manifest's content modules and keep Hall content separate. Spells include enemy abilities; monster data includes allies; equipment templates can generate further combinations. The 75 main class records include apprenticeship, four jobs, and two explicitly deprecated classes. Seventy records have tier tags across tiers 0–6, of which 68 are not marked deprecated. That is catalog breadth, not a proof of 68 viable paths. Tier-7-related data exists, but the examined conditions do not establish ordinary playable tier-7 progression. The 53 quest records include 38 tier quests and 15 advancement records. Eleven other JSON files are outside the inspected standard bootstrap and are excluded from this census. Full counts and qualifications are preserved in the accompanying `content-census.json`.

**Character identity is mechanically consequential.** Graduation provides a compact example: the ordinary adept pays tuition; the dark adept kills the master and gains corresponding benefits and moral consequences; the red adept depends on an early combat accomplishment; the mystic savant requires never having used Study. Class selection closes alternatives at the same tier, including classes the player may not yet have revealed. This gives choices weight, while also creating a discoverability burden. [Classes](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/classes.json), [class explanations](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/hallgloss.json).

**Housing is part of a build.** A camp provides outdoor/star conditions while reducing research efficiency. A cave adds space and minion capacity, favors earth and shadow, and penalizes research and light. Furniture spends limited space on workstations, storage, recovery, and magical access. Consequently, a new home can alter which strategies are possible. These are useful examples of theme expressed through decisions and consequences. [Homes](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/homes.json), [furniture](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/furniture.json).

**Progression also grants greater control over the game.** Training, production, recovery, and adventuring initially compete for scarce action capacity. Goals, Hobbies, waiting behavior, and additional slots progressively improve scheduling. Spellcraft introduces a different kind of agency by combining spells within cost and level constraints. These rewards expand what the player can arrange, rather than merely increasing production rates. [Automation and spellcraft glossary](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/hallgloss.json), [extra-action content](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/extraaction.json).

**The Hall adds a second scale of progression.** It unlocks at tier 5 and preserves the current wizard while allowing new, switchable characters. Its shipped description specifies three initial character slots, expandable to nine, alongside shared prestige upgrades. This makes alternative builds useful long-term pursuits and adds roster-level persistence and economy to the single-character game. It should be counted as a substantial system in its own right. [Hall content](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/hall.json), [Hall unlock](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/upgrades.json).

**Technically, the project is a browser application with a sizable custom game layer.** The pinned package uses Vue 3.4.30, Vite 5.4.20, and eventemitter3 3.1.2. Most game code is JavaScript, alongside Vue components and a small TypeScript portion. The source measurements are physical lines, including comments and whitespace, with the explicit `src/unused` directory excluded; they are a measure of repository size, not an effort estimate. [Package manifest](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/package.json).

| Source category | Files | Physical lines |
|---|---:|---:|
| JavaScript under source, excluding `src/unused` | 121 | 26,163 |
| Vue components | 74 | 12,683 |
| TypeScript under source | 1 | 347 |
| Main CSS | 1 | 1,357 |
| Combined categories above | 197 | 40,550 |

These source counts do not imply every file is included in the production bundle. The repository also contains legacy paths. All 77 JSON files occupy 65,389 physical lines, but only the bootstrap subset was included in the content census. Build configuration and documentation are outside the 40,550-line total.

The runtime includes a 120 ms simulation tick, rules and modifiers shared across content, task scheduling, combat/exploration, and persistence. IndexedDB handles main local saves, with legacy/localStorage paths also present. Offline elapsed time is banked as stored time and spent through accelerated simulation; it should not be described as arbitrary overnight progress automatically granted to every task. The standard configuration has no active remote-save handler, although legacy remote code exists. These observations describe the inspected source; save recovery and long offline sessions were not exercised in this study. [Game runtime](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/game.js), [persistence](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/persist/persist.js).

Reusable structures exist in content modules, item types, and modifiers. They also carry the original game's assumptions: requirements can compile into JavaScript functions, data expressions refer to runtime objects and IDs, and systems share a central Game coordinator and Vue-reactive state. This is relevant to adaptation cost. It does not establish that either a fork or a rewrite is preferable before we define the new game. [Content loader](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/dataLoader.js), [rule parsing](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/parsing.js).

**The main scope multiplier is the relationship between content.** A class needs access to appropriate skills, resources, spells, tasks, and milestones. A capacity increase must arrive before a later requirement becomes impossible. A location can be both an adventure and a critical source of permanent learning. Housing, equipment, magic, morality, and scheduling multiply the combinations that need to remain understandable and viable. Supporting interfaces must explain enough of those relationships for discovery to feel intentional.

That separates the work into several substantial responsibilities: simulation and saves; an expandable content/rules structure; an interface that reveals and explains progression; authored paths and rewards; and repeated balancing and playtesting across those paths. A small game can retain the characteristic discovery-and-specialization loop. Matching Arcanum's full catalog and late-game systems would bring a much larger authoring and validation commitment. This is a scope judgment, not a calendar estimate: a credible schedule depends on the successor's selected systems, content depth, polish requirements, and reuse approach.

**The source is available for reuse.** Alongside the permission you reported from the owner, the repository contains an MIT license naming Justin Lacy, copyright 2020. Its text permits copying, modification, distribution, and other uses, with the copyright and permission notice retained in copies or substantial portions. The contributor file also records community contributions. The source is therefore valuable both as a reference and as material we can evaluate for reuse when the new game's scope is defined. This study does not commit us to either a fork or a fresh implementation. [License](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/LICENSE), [contributors](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/CONTRIBUTORS).

**The design principle worth carrying forward is gradual transformation with consequential specialization.** Mundane beginnings make later capability meaningful; resource and skill limits create reasons to explore; identity and infrastructure change available strategies; and progression introduces new kinds of decisions. This is my interpretation of the reference, rather than an assumption about which particular parts are your favorites. Those are useful foundations for the next conversation about a different theme and scope.

The evidence consists of live opening-loop inspection, source and shipped-glossary study, a manifest-based static census, code measurements, and the five-file deployment comparison. It does not include a complete playthrough, a proof of all class/build reachability, measured completion time, mobile testing, or a production-readiness audit. Scratch design notes and unreferenced files were not counted as shipped features. Research only; no successor implementation was created.

Supporting records are saved alongside this study: `content-census.json`, `source-metrics.json`, and `deployment-check.json`. `count-content.py` reproduces the census against a checkout of the pinned commit, accepting that checkout's path as its first argument. All measurements are scoped to this inspected snapshot.

<!-- END SOURCE DOCUMENT: research/arcanum-study-2026-10-16/STUDY.md -->

---

## Appendix C — Class and mastery study

Original file: `research/arcanum-study-2026-10-16/CLASS-MASTERY-STUDY.md`

<!-- BEGIN SOURCE DOCUMENT: research/arcanum-study-2026-10-16/CLASS-MASTERY-STUDY.md -->

# Arcanum classes and “Master of” — focused source study

Studied 16 October 2026 in response to the user's correction at Q62. Source: [mathiashjelm/arcanum](https://gitlab.com/mathiashjelm/arcanum), commit `a2632d2edf3e07e9168fff81167b11f2792e9197`, the same snapshot as the original scope study. A fresh public-source clone matched that commit. The previous deployment comparison belongs to the original study; this follow-up traces source and manifest-loaded data, without a new full playthrough or deployment comparison.

## Main finding

**Arcanum develops a character through successive class choices whose benefits and expertise accumulate.** “Master of …” labels describe overlapping fields recorded by those choices. Later opportunities inspect that accumulated history alongside skills, achievements, resources, and sometimes particular earlier classes.

Our proposed Body / Intent / Formation structure had moved toward three continuing paths, each with a prepared solution to a shared obstacle. That captures some differentiation, but gives too little space to the source's repeated class decisions, combinations, and changes to the character's broader capabilities. The closer reference is a developing class history with several kinds of expertise.

## The systems that need to be distinguished

| Layer | What the source does |
|---|---|
| Shared tier advancement | Common qualifications and advancement unlockers make the next class stage available. Taking the class advances the ordinary tier and supplies shared rewards. |
| Class choice | An authored identity with requirements, costs, benefits, and tags. Ordinary same-tier alternatives close after choosing, including undiscovered alternatives. |
| Accumulated class history | Acquired classes remain recorded. Their benefits continue, and later requirements can inspect the history. The displayed latest class does not replace the whole build. |
| “Master of …” tags | A class can add several expertise fields. Repeated contributions provide depth, while combinations qualify the character for different opportunities. |
| Mastery skills and education | Separately acquired and trained skills, and separately purchased learning upgrades. These may depend on expertise tags, but are not the tags themselves. |

The shipped glossary explains the class/tier relationship and exclusion rule. Runtime acquisition calls `GClass.changed`, applies ordinary results and modifiers, then appends the class through `Player.setClass`. Saves retain the class IDs. Tier locks prevent further acquisition without removing the acquired classes or their modifiers. [Class glossary](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/hallgloss.json#L372-429), [class acquisition](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/items/gclass.js#L22-29), [class history](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/chars/player.js#L252-258), [tier events](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/events.json#L85-175).

## How an advancement is earned

The player prepares across the wider game, qualifies for candidate classes, and spends an advancement opportunity on one of them. Requirements can include trained skills, resource capacity, purchases, exploration, morality, prior classes, or expertise tags. A particular class also has its own cost and benefits.

For example, the tier-1 and tier-2 advancement unlockers require at least four tagged tier quests plus resource costs. Their quest pools involve several systems, including exploration, equipment, housing, production, and learned skills. This is broader than completing one method-specific field exercise. Unlocking a candidate and being able to acquire it are separate runtime checks. [Advancement requirements](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/quests.json#L231-347), [unlock checks](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/game.js#L978-987), [acquisition checks](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/items/gdata.js#L357-379).

Class rewards can change resource capacity and production, skill limits, training effects, combat properties, or specialized content access. Magician, for instance, improves research capacity, mana production, and several skill limits. Alchemist develops crafting, potion, and alchemy capacity as well as potion-essence production. These benefits affect the continuing build rather than only one expedition. [Magician](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/classes.json#L213-235), [Alchemist](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/classes.json#L368-389).

## What “Master of” actually records

The core tag file defines 28 labels of this form. They span elements, weapons, knowledge, crafting, healing, summons, and other fields. A tagged class can contribute to more than one: Alchemist carries Blood, Potions, and Crafting; Witch carries Shadow, Demonology, and Potions. The runtime tag value is the sum of its member records' values, so a condition can test presence, repeated depth, or a sum across fields. The standard-manifest scan found these expertise memberships on class records. [Tag definitions](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/tags.json#L363-482), [numeric tag aggregation](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/composites/tagset.js#L98-104).

### Example 1: the same later class, different accumulated expertise

| Earlier choice | Later choice | Resulting contributions from these two choices |
|---|---|---|
| Hydromancer | Stormcaller | Water 2, Air 1 |
| Wind Mage | Stormcaller | Air 2, Water 1 |

Stormcaller accepts either earlier Water or Air expertise and contributes both. It also raises both lore limits. The latest identity can therefore be the same while the history underneath differs. These counts describe the two stated choices, with other advancement requirements still applicable. [Water, Air, and Stormcaller definitions](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/classes.json#L467-518).

### Example 2: several histories can qualify for an advanced class

Rune Fencer accepts either two Sword contributions or the specific Duelist class. Battle Mage at tier 2 and Spell Blade at tier 3 supply two Sword contributions. Duelist itself can be entered through earlier Sword expertise, Red Adept, or Chaos expertise. Other stage requirements and costs still apply. The resulting structure contains converging routes and cross-training opportunities. [Battle Mage](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/classes.json#L303-314), [Spell Blade](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/swordplay.json#L189-201), [Duelist and Rune Fencer](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/duelist.json#L83-117).

### Example 3: depth and combinations unlock more content

Shade Mastery requires two Necromancy contributions as well as a positive Necromancy skill. Summon Demon checks a combined Demonology-plus-Summoning total of at least three, alongside substantial skill requirements. A class contributing to both fields counts toward both terms: this is not necessarily a requirement to take three classes. Other content uses expertise for home development or reward scaling; Temple Renovations checks Light history, while Grand Quest grants additional rewards per Light or Shadow contribution. [Shade Mastery](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/classline/shadow.json#L354-375), [Summon Demon](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/classline/shadow.json#L1056), [Temple Renovations](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/priest.json#L29-49), [Grand Quest](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/questing.json#L27-28).

These are qualifications within a broader progression graph, not proof that every theoretical class combination can be completed. Some classes require a particular predecessor, while others accept a tag, skills, or an alternative condition. For example, Archlock requires Warlock; the ordinary Mage sequence does not universally require the immediately preceding named Mage class.

## Separate meanings of mastery

Fire Mastery is a trainable skill with purchase/run costs and level benefits; it requires Fire expertise, Fire Lore, and an appropriate tier. “Pyromancy: Mastery” is an educational upgrade with its own knowledge and prior-upgrade requirements. “Magical Mastery” also names tier 3. None of those should be conflated with the accumulated Fire class tag. [Fire Mastery skill](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/skills.json#L566-585), [education upgrade](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/learning.json#L558-573).

## Recommended adaptation — proposal for our game

Keep the shared climb toward immortality, but design advancement identities and accumulated expertise before more bespoke path solutions.

1. **Realm progress** supplies the common transformation, lifespan extension, and broader opportunities. The eight-breakthrough target can remain a working scope; which stages also contain a class choice needs mapping.
2. **A cultivation identity chosen at an advancement** adds a lasting package of capabilities, limits, opportunities, and one or more expertise tags. Candidates emerge from the character's preparation and discoveries. Competing choices at a stage give commitment its cost.
3. **Accumulated expertise** supports later depth, hybrid qualifications, and specialist content. A later identity can build on several different histories. Changing direction at a later advancement need not erase earlier learning.
4. **Techniques and studies** remain separately learned and practised. Some require the relevant expertise; knowledge limits continue to matter. Classes, teachings, and discoveries can each contribute to the means of deeper development.

An illustrative xianxia example would be a Body contribution followed by a Body-and-Earth identity, versus an Earth contribution followed by that same identity. The resulting histories would be Body 2 / Earth 1 and Earth 2 / Body 1. Names, available fields, counts, and effects are deliberately unselected; this demonstrates the structural possibility.

Body, Intent, and Formation can remain useful ideas, but should not constrain the design to three exclusive lifelong tracks before the class/expertise model is settled. More concrete identities could express physical cultivation, weapon disciplines, elements, formations, spiritual practices, or alchemy in overlapping ways. This is a recommendation to reconsider the roster, not approval of an expanded content catalog.

The ridge waystation can still introduce teachings and give a new capability an immediate use. Its investigation should contribute to qualifications and reveal possibilities within the larger build system. The proposed three-method package is not approved, and should be revisited after the class model. The accepted outward lead toward another connected region remains intact.

The earlier retraining rule also needs reconsideration: rebuilding one replacement specialization models a different kind of choice from adding another class to a permanent history. We should decide what, if anything, can revise an earlier advancement once the new structure is concrete. The source study does not establish an ordinary respec system.

## Scope and verification limits

The standard manifest contains 75 main class records, including apprenticeship, jobs, and deprecated records. There are 70 raw tier-tagged records across tiers 0–6, of which 68 are not explicitly named deprecated. These are catalog counts, not 68 proved reachable builds. A single character chooses a subset over successive stages; the catalog's breadth is not a required scope for our game.

This study used graph discovery, runtime traces, direct source reads, and manifest-aware JSON extraction. Restoring the clone changed filesystem metadata relative to the graph; material claims were checked in source. Dynamic call edges are incomplete, so a missing graph caller was not treated as absence. No ordinary respec was found in the bounded runtime/data investigation, but that is not an exhaustive gameplay proof. Unlisted modules, old title-combination support, and placeholder Hall content were not promoted into ordinary shipped class behavior.

Selected records, source paths, line references, and hashes are retained in [class-mastery-evidence.json](class-mastery-evidence.json). The broader [original study](STUDY.md) retains its scope qualifications. Selected upstream data is covered by the preserved [upstream MIT license](UPSTREAM-LICENSE).

<!-- END SOURCE DOCUMENT: research/arcanum-study-2026-10-16/CLASS-MASTERY-STUDY.md -->
