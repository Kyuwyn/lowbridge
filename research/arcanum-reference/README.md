# Arcanum / Theory of Magic: design reference wiki

Reference for *how the inspiration game is built*: its shell, interaction semantics, data model, progression spine, and systems. Written for designers and LLM agents working on Lowbridge. Every page states what it is derived from; numbers come from the testing-build data unless marked otherwise.

This folder **extends** the two earlier studies rather than replacing them:

- `../arcanum-study-2026-10-16/`: scope census of the pinned stable source (what Arcanum contains).
- `../arcanum-mechanics-2026-10-18/`: skill-cap/class/tier mechanism from the pinned source (how the opening and the class graph work), plus a source-level UI note.

What this folder adds that neither had: a **hands-on mid-game view** (a T4 save loaded into the live testing build), the **complete testing-build data** (82 files, 3,389 records), the **game's own mechanics glossary**, and per-system pages written as a reference rather than as a review response.

A second reference sits beside this one: `../hundred-days-reference/` catalogues **Hundred Days / 筑基**, a Chinese cultivation idle game forked from Arcanum's engine. Its design rules are numbered 39–69, continuing the 1–38 in `12-design-rules.md`.

## Sources

| Source | Version | Used for |
|---|---|---|
| Testing build https://arcanumtesting.gitlab.io/arcanum/ | `unstable 0.12.12.9` | Live UI (1440×900 and 390×844), tooltips, section layouts, combat view, settings |
| Testing-build data `data/*.json`, `data/modules/*.json` (82 files) | `unstable 0.12.12.9` | All hard numbers in `data-tables.md`; record schema in `03-data-model.md` |
| Save `Wizrobe (8).json` (owner's mid-game save, T4 Protean, level 28) | `unstable 0.12.12.9` | Save format; a real mid-game state (`11-midgame-snapshot-wizrobe.md`) |
| In-game glossary (`modules/hallgloss.json`, `hall.json`) | `unstable 0.12.12.9` | Rules in the author's words: `glossary-verbatim.md` |
| Community wiki https://theoryofmagic.miraheze.org | documents stable 0.12.0.0 | Opening flow, class table, anything not in data: `wiki-notes.md` |

Three versions are in play (0.12.0.0 wiki, 0.12.3.1 pinned source in the earlier studies, 0.12.12.9 testing). Structure matches across them; individual numbers drift. Prefer the testing-build numbers here when they differ from the earlier studies.

## Pages

| Page | Question it answers |
|---|---|
| [01 Shell and layout](01-shell-and-layout.md) | What is on screen, where, and how the frame behaves (desktop, mobile, settings, log, quickbar). |
| [02 Interaction semantics](02-interaction-semantics.md) | Instant vs timed vs perpetual actions, slots, fill, Goals/Hobbies/Waiting, Focus, button states, tooltip schema. |
| [03 Data model](03-data-model.md) | The record vocabulary every content type shares (`require`/`need`/`buy`/`cost`/`run`/`effect`/`result`/`mod`/`at`/`fill`/`lock`…), expression strings, mod patching, save format. |
| [04 Progression spine](04-progression-spine.md) | Apprentice → graduation → tiers 0-6; tier-unlocker shape; classes as keys; locks; morality; wizard level. |
| [05 Skills and education](05-skills-and-education.md) | Skill graph, 5-level runway, caps, training, Focus, arcana, education upgrades (Competence → Transcendence). |
| [06 Economy and resources](06-economy-resources.md) | Resource groups and caps, books-as-modifiers, gems/runes, selling, debt, converters, stored time. |
| [07 Home and domain](07-home-and-domain.md) | Homes, floor space, furniture, source tags, converters; Domain upgrades and the Siege minigame. |
| [08 Adventure and combat](08-adventure-and-combat.md) | Dungeons/locales/clashes, distance, floors, stress, the combat turn, potencies/resists, summons/minions/companions, loot. |
| [09 Spells and spellcraft](09-spells-and-spellcraft.md) | Spell schema, schools, memorize vs quickslot, spell-list levels, spellcraft rules. |
| [10 Automation and time](10-automation-and-time.md) | Action slots, Goals/Hobbies/Waiting, Autofocus, stored time, fast-forward, chronomancy, the Hall (prestige). |
| [11 Mid-game snapshot: Wizrobe](11-midgame-snapshot-wizrobe.md) | What a real T4 save looks like in numbers; what it says about pacing and shape. |
| [12 Design rules](12-design-rules.md) | The rules the reference implies, what to copy, what to beat. |

## Generated and raw material

| File | Contents |
|---|---|
| `data-tables.md` | Tier unlockers, tier quests, morality quests, all 80 classes, sections, 106 resources, player stats, stressors, equip slots, 69 skills, 45 homes, dungeons/locales/clashes, distance sources, action-slot sources, Goal/Hobby sources, Main-tab groups, spell schools, monster levels. Generated; regenerate rather than edit. |
| `data-unstable-0.12.12.9.tar.gz` | The 82 fetched data files (`*.json`, `modules/*.json`, 1.3 MB unpacked) from the testing build on 2026-10-19; they are the source for `data-tables.md` and `03-data-model.md`. Upstream MIT (see `../arcanum-study-2026-10-16/UPSTREAM-LICENSE`). |
| `glossary-verbatim.md` | The 40 in-game glossary entries, verbatim, grouped as the Glossary tab groups them. |
| `wiki-notes.md` | Community-wiki hard data with page URLs (opening guide, class table, quests, combat formulas, Hall). |
| `save-wizrobe-analysis.json` | The save reduced to levels, resources, quests, clears, owned furniture, known spells. |
| `section-texts.json` | `innerText` of every section tab with the save loaded. |
| `tooltips.json` | Tooltip text for a task, skill, upgrade, quest, furniture, home, dungeon, locale, clash. |
| `screens/` | Screenshots: every section tab, tooltips (`tip-*`), runner menu, settings, combat, mobile. |

## How to use this wiki

- Designing a system? Read its page, then the matching `data-tables.md` section for numbers, then `glossary-verbatim.md` for the author's phrasing of the rule.
- Designing a screen? `01` and `02`, then the screenshots.
- Deciding what to adopt? `12`, which cites the other pages.
- The earlier studies' "Design rules Arcanum implies" (13 rules) are superseded by `12-design-rules.md`, which keeps them and adds what the mid-game view showed.
