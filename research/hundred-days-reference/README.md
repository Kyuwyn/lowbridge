# Hundred Days / 筑基: design reference

Reference for the second inspiration beside Arcanum: **Hundred Days** (筑基 *Zhuji*, "Foundation Establishment"), a Chinese cultivation idle game that is a **fork of Arcanum's engine** with new content — in effect the thing Lowbridge is building, shipped by someone else in 2022–2024. Written for designers and LLM agents working on Lowbridge, in the same shape as `../arcanum-reference/`. Every page states its sources; numbers carry a version label; unmeasured claims are tagged `[INFERENCE]`.

Why it matters: it answers "what happens when you lay a cultivation frame over Arcanum's spine" with a real game — a spendable lifespan, a 193-node cultivation tree, Foundation Establishment as the first realm — and it answers "what happens when content grows without a validator" with 191 unreachable records. Both answers are evidence for Lowbridge's plan; neither is binding (`design/DESIGN-PLAN-2026-10-18.md` and the ADRs win).

## Sources

| Source | Version | Used for |
|---|---|---|
| Live build https://maxrau.github.io/Hundred-days/ | `P0.3.9c`, English branch, observed 2026-10-21 at 1440×900 and 390×844 | Shell, opening, section tabs, tooltips, settings (`01`, `screens/`) |
| Translation fork https://github.com/MaxRau/Hundred-days branch `english` | commit `9e1e0d3`, 2026-04-25 (Claude-assisted Chinese→English, `docs/translation/GLOSSARY.md`, `tools/unminify.py`, Playwright fixture) | All English names; the readable webpack bundle `js/hundred_days.js` (every `src/**` module as plain source); `tools/fixtures/save-all-unlocked.json` |
| Upstream https://github.com/Mostlai/Hundred-days branch `master` | HEAD `91ba763`, 2024-10-13; data last touched 2024-08-03; author Pldada / "Ask sky" | The original Chinese for every record; the only attribution line (README) |
| Arcanum testing data `../arcanum-reference/data-unstable-0.12.12.9.tar.gz` and pinned source `a2632d2` (0.12.3.1) | — | Every "Arcanum vs fork" diff |
| Community wiki https://2096358571.de5.net/HD-WIKI/ (TiddlyWiki 5.2.2, author's own) | fetched 2026-10-21; 2,698 tiddlers, hand edits 2022-01 → 2024-10 | Tips, FAQ, monster prefixes, the "six stages" testimony, the generated per-record pages (`05`) |

Lineage: Arcanum (MIT, Justin Lacy) → 筑基 by Pldada (Chinese, `Mostlai/Hundred-days`, no licence file) → English translation by Max Rau (`MaxRau/Hundred-days`, served at the live URL). The fork ships Arcanum's engine without the MIT notice; see `04` §7 and rule 69. **Nothing from either repository may be copied into `src/`.**

## Pages

| Page | Question it answers |
|---|---|
| [01 Shell and opening](01-shell-and-opening.md) | What is on screen, how it differs from Arcanum, the 19 tabs, the first minutes as played, mobile. |
| [02 Cultivation and progression](02-cultivation-and-progression.md) | The opening route from data, the 17-domain cultivation graph (mermaid), tiers and classes, the wiki's six stages checked against data, the lifespan rule, skills, the resource economy. |
| [03 Data model and content](03-data-model-and-content.md) | 4,520 records / 57 types; which Arcanum fields survive, the 101 new ones and what they do; every new content type with a real record; the expression language as used; resource groups; the save format. |
| [04 Engine behind the curtain](04-engine-behind-the-curtain.md) | What the fork changed in Arcanum's source: module inventory, tick and tempo, life/age/death, the new runtime systems, combat, persistence and services, licensing. |
| [05 Community wiki notes](05-community-wiki-notes.md) | How the wiki is built (generated pages with reverse links), full translations of the tips, FAQ and monster prefixes, what the wiki knows that the data does not. |
| [06 Design rules](06-design-rules.md) | Rules 39–69, continuing Arcanum's 1–38: what to copy, beat, avoid. Rules 70–74, on layer alignment across both games, follow in `../arcanum-reference/12-design-rules.md`. |

## Generated and raw material

| File | Contents |
|---|---|
| `data-census.md` | Record counts, field frequencies, vocabulary diff vs Arcanum, resource groups, unreachable gates. Generated; regenerate with `python3 tools/census.py <path-to-Hundred-days-checkout>` (branch `english`), never hand-edit. |
| `tools/census.py` | The generator. |
| `screens/` | `00-start-1440.webp` fresh save; `guide-tab.webp`; `tip-task-sweep.webp`; `settings.webp`; `sect-<tab>.webp` for every tab with the all-unlocked fixture; `mobile-390-main.webp`. |

Not stored here: the game repository (clone it; the data is 2.9 MB, the bundle 6.9 MB) and the wiki store (9.7 MB single HTML file; the tiddlers are a JSON array inside `<script class="tiddlywiki-tiddler-store">`).

## How to use this wiki

- Designing the lifespan / time axis for a later chapter? `02` §5, `04` §3, rules 39–43, 47.
- Designing the technique web or a breakthrough? `02` §2–4, rules 44–50.
- Adding a validator check or a content field? `03` §4, §7 and rules 51–59 are a list of what goes wrong without one.
- Wanting a generated content wiki? `05` §1 and rule 60.
- Citing a number from the inspiration games: say which game and which version (`P0.3.9c` here; `0.12.12.9` for Arcanum).
