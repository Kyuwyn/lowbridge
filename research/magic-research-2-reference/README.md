# Magic Research 2: design reference

Reference for the third inspiration beside Arcanum and Hundred Days: **Magic Research 2** (Matias Ezequiel Colotto, "Maticolotto", released 21 May 2024, last patch 1.8.6 on 8 August 2024; Steam, Android, iOS). It is an incremental, text-based, auto-battler wizard game in which you raise twelve elements, run a home economy, automate casting with hired wizards, and retire repeatedly towards a fixed ending. Written for designers and LLM agents working on Lowbridge, in the same shape as `../arcanum-reference/` and `../hundred-days-reference/`. Every page states its sources; numbers carry a version label; unmeasured claims are tagged `[INFERENCE]`.

Why it matters: Arcanum and Hundred Days are one engine and one content model. MR2 is an independent design that reaches many of the same goals by other means, so it is the control group. It answers questions neither of them can:

- What does a **reset loop** look like when it is the spine of the game rather than an add-on (retirement every few hours, three nested reset layers, a world-level New Game+)?
- What does **automation as an allocated resource** look like (wizards that generate casting power into ordered, conditional rules)?
- What happens to offline time when it is **banked rather than simulated** (Time Pieces)?
- What does it cost to write **content as code** instead of data (127 storylines as TypeScript modules, and a patch history dominated by cache bugs)?
- What does a **real phone layout** for this genre look like?

Nothing here is binding. The project's ADRs and design documents decide; this folder is evidence.

## Sources

| Source | Version | Used for |
|---|---|---|
| Web demo https://mcolotto.github.io/magic-research-demo/magic-research-2/ (repo `mcolotto/magic-research-demo`, HEAD `05717a1`, 2024-07-07) | **v1.5.5**, build timestamp 2024-07-08; Expo SDK 48, React Native Web | Shell, opening, phone layout (`01`, `screens/`). Its JavaScript source map carries the original TypeScript: 571 first-party files, 86 k lines, `src/backend/` 53 k lines. Engine and formulas for every page. Content past the demo (level cap 30) is stripped by `Demo*Loader` modules. **No licence file: read, never copy.** |
| Translation strings `mcolotto/magic-research-2-translations`, `base-translations.json` (commit `4aa8ce4`, 2024-12-18) | **v1.8.6** (the final patch) | Every string in the full game: 4,646 strings, 93,786 words, including all storyline text, the in-game Help and the endings. Licence CC BY 4.0. |
| Modding SDK `mcolotto/magic-research-2-modding-sdk` (`11ce190`, 2024-07-29) and examples `mcolotto/magic-research-2-modding` (`bf8fbde`, 2024-08-03) | v1.8.x API | 326 `.d.ts` files of the full game's API, and `docs/concepts.md`, the developer's own architecture notes. MIT. |
| Developer's mods `mcolotto/magic-research-2-maticolotto-mods` (`df0f333`, 2024-08-20) | v1.8.x | "MR2 – Rebalanced" and "Unleash the Worlds": the developer's own second thoughts on late-game scaling (`07`). MIT. |
| Fandom wiki https://magic-research-2.fandom.com/ (dump in `sources/`) | fetched 2026-11-19 (US Eastern; the dump's own timestamp is UTC 2026-11-20). 663 pages; pages carry no game version, most were bulk-written in 2025 | Full-game record tables: 134 enemies, 122 spells, 127 storylines, 198 equipment, 45 materials, 12 rituals, element unlock ladders (`data-census.md` §3). Licence CC BY-SA. |
| Steam news API, app 2864890 | 21 posts, 2024-05-10 → 2024-08-08 (pre-launch → 1.8.6) | Patch history as design evidence (`07`). |
| Community: Steam discussions, gameplay.tips guides, r/MagicResearch, incrementaldb review | 2024–2025 | What players found, strategies, walls (`07`). |

Lineage: Magic Research (2022, Maticolotto) → Magic Research 2, "built using the first game as a base" (launch FAQ) but with all content new. Neither shares code with Arcanum. Nothing from any of these repositories may be copied into `src/` (the demo source has no licence at all; the strings, SDK and wiki are licensed but Lowbridge is a clean implementation). Mechanics are ideas and remain fair to learn from.

## Pages

| Page | Question it answers |
|---|---|
| [01 Shell and opening](01-shell-and-opening.md) | What is on screen at 1440 px and at 375 px, the 22 screens, the first-minutes ladder from source, tooltips and Help. |
| [02 Progression and meta](02-progression-and-meta.md) | Twelve elements, levels, ranks and their exp curves; Study; primary and secondary elements; Retirement and MPL; classes; storylines, hints and the random-event pity timer; worlds (New Game+), challenges and the five endings. |
| [03 Engine and content model](03-engine-and-content-model.md) | State layers, singletons in DataStores, actions with named effects, the transformation system, listeners, the event DSL, caching, the tick and time bands, saves, modding. Content as code versus Arcanum's content as data. |
| [04 Economy and home](04-economy-and-home.md) | Resources and caps, mana, channeling, catalysts, furniture and land (Modern vs Classic), coins and market stalls, monstium, enhancements, boosts, transmutation and item quality. |
| [05 Exploration, combat, familiars](05-exploration-combat-familiars.md) | Dungeons and floors, combat stats and formulas, scripted enemies and the boss curve, pouch items, death, the Bestiary, familiars. |
| [06 Spells, wizards, late systems](06-spells-wizards-late-systems.md) | Spell anatomy, rank multipliers, empowering, wizards and autocast rules, Perma-Cast, Time Pieces, spellcraft, synchro, rituals and corruption. |
| [07 Patch history and community](07-patch-history-and-community.md) | Twelve weeks of patches read as design evidence, the developer's rebalance mod, and what players say. |
| [08 Design rules](08-design-rules.md) | Rules 75–100, continuing the numbered list (Arcanum 1–38 and 70–74, Hundred Days 39–69): what to copy, beat, avoid. |

## Generated and raw material

| File | Contents |
|---|---|
| `data-census.md` | Class counts and extension points in the demo source; demo spells, furniture, enhancements and enemies with their numbers; string-file statistics, storyline titles, endings and challenges; full-game tables from the wiki (storylines, spells, bestiary, equipment, materials, rituals, element ladders). Generated; regenerate with `python3 -I tools/census.py --demo-map … --strings … --wiki sources/wiki-dump-2026-11-19.json --sdk …`, never hand-edit. |
| `tools/census.py` | The generator. Reads the demo source map in memory and writes only names and numbers. |
| `sources/wiki-dump-2026-11-19.json` | Every wiki page's wikitext, categories, last editor and timestamp, taken from the fandom API in a browser (the shell cannot reach fandom). 427 KB. CC BY-SA; see `sources/README.md`. |
| `screens/` | `home-1440.webp` and `home-375-mobile.webp`, the opening Home screen at desktop and phone width. Low resolution (the capture pane was small); the layout descriptions in `01` come from the page's accessibility tree. |

Not stored here: the demo repository (50 MB; clone it, the source map is `magic-research-2/static/js/main.15163126.js.map`), the strings repository, the SDK and the mods. All four are public on GitHub.

## How to use this wiki

- Designing the **reset loop** (rebirth, chapter restarts, what carries over)? `02` §4–6, `03` §1, rules 75–80.
- Designing **automation** (disciples, arrays, auto-cultivation)? `06` §3–4, rules 89–90.
- Designing **offline and time** handling? `03` §6, `06` §5, rule 91; compare Arcanum rule 25 and Hundred Days rule 43.
- Designing a **content pipeline or validator**? `03` §2–5, rules 95–97; compare Hundred Days rules 51–59.
- Designing the **phone layout**? `01` §2, rule 98; compare rules 37 and 67.
- Citing a number: say which game and which version (`v1.5.5 src` for demo source, `v1.8.6 strings`, `wiki 2026-11-19`, `patch 1.x.y`).
