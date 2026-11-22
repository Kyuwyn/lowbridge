# Lowbridge: project rules for agents

The project was restarted from scratch on 2026-11-19. Read this file first.

## State of the repo

- **Live:** `research/` (the two reference wikis below), `.claude/` and `project.yaml` (Claude Code Game Studios), and this file.
- **Archived:** `archive/2026-11-19/` holds the whole previous attempt: its code (`src/`, `tests/`, `scripts/`), design documents, 39 ADRs (`docs/architecture/`), playtests, the `review/` package, and its old `CLAUDE.md`, `AGENTS.md` and `README.md`. The git tag `pre-restart-2026-11-19` is the same work in its original layout.
- The archive is frozen and **not binding**. Read it for ideas about what the new framework should do; never modify it, never run or extend its code in place, and do not treat its ADRs, plans or rules as decisions for the new game. `archive/2026-11-19/_untracked/` is local-only and gitignored.
- The concept is `design/gdd/game-concept.md` (The Furnace Road, working title). The stack is pinned below. No architecture and no game code exist yet. The stage is `Systems Design` (gate passed with accepted concerns on 2026-11-19; see `production/gate-checks/`).

## Technology Stack

Set by `/setup-engine` on 2026-11-19. `project.yaml` holds the same facts for the studio's scripts.

- **Engine**: None. The game is a web page; the browser's DOM and CSS render it.
- **Language**: TypeScript 7.0.2
- **Runtime**: Node.js 26 LTS (tooling only; the game itself runs in the browser)
- **Build System**: Vite 8.3.8 (dev server and production bundle)
- **Tests**: Vitest 5.1.1
- **Interface layer**: undecided. `/create-architecture` chooses plain DOM or a framework, with an ADR.
- **Platforms**: web browser first; a mobile app later, through a wrapper chosen at that point.

Commands: `npm run dev`, `npm run build`, `npm test`, `npm run typecheck`.

The rules core must run headless from the command line, with no DOM, so the validator and tests need no renderer (`design/gdd/game-concept.md`, Technical Considerations).

TypeScript 7, Vite 8 and Vitest 5 are newer than most model training data. Check `docs/engine-reference/web/` before writing config or tooling code.

## Engine Version Reference

<!-- ENGINE-REFERENCE-IMPORT: written by /setup-engine; keep the import on the next line -->
@docs/engine-reference/web/VERSION.md

## Reference material (informative, MUST consult)

`research/arcanum-reference/README.md` is the design-reference wiki for the inspiration game: shell and layout, interaction semantics, data model, progression spine, skills, economy, home/domain, adventure/combat, spells, automation/time, a real T4 mid-game save, and numbered design rules (1–38, plus 70–74 under "G. Layer alignment", added 27 October 2026 from a craft critique of both references). It supersedes the two older studies in `research/` for anything they overlap on.

Before any of the following, read the matching page and cite the rule numbers (`12-design-rules.md`, e.g. "rule 4, 18") in your plan or ADR:

| Task | Read first |
|---|---|
| New or changed screen, tab, tooltip, button state, mobile layout | `01-shell-and-layout.md`, `02-interaction-semantics.md`, `screens/` |
| New content type, field, requirement expression, save-format change | `03-data-model.md` |
| Breakthroughs, classes, caps, locks, morality, pacing | `04-progression-spine.md`, `05-skills-and-education.md`, `11-midgame-snapshot-wizrobe.md` |
| Resources, caps, storage, home, furniture, converters | `06-economy-resources.md`, `07-home-and-domain.md` |
| Combat, sites, stress, spells, automation, offline time | `08-…`, `09-…`, `10-…` |
| Any hard number from the inspiration | `data-tables.md` (testing build 0.12.12.9) before `wiki-notes.md` (stable 0.12.0.0); say which version you used |
| The author's own wording of a mechanic | `glossary-verbatim.md` |

Rules in `12-design-rules.md` are tagged *copy* / *beat*. Diverging from a *copy* rule is allowed but MUST be stated explicitly with the reason, in the ADR or the PR description. Do not rediscover these facts from the live game or source; extend the wiki instead.

`research/hundred-days-reference/README.md` is the second reference: **Hundred Days / 筑基**, a Chinese cultivation idle game built on a fork of Arcanum's engine (live `P0.3.9c`, English branch). It is the nearest existing thing to Lowbridge, so consult it for anything cultivation-flavoured: a spendable lifespan (`02` §5, `04` §3), a cultivation tree over Arcanum's spine (`02` §2–4), the six-stage shape the community found (`05` §4), and the content-rot evidence for keeping `bun run validate` strict (`03` §7). Its rules are numbered 39–69 in `06-design-rules.md`, continuing Arcanum's 1–38; rules 70–74 in `12-design-rules.md` cover both games, so the numbered rules run 1–74 (75–100 follow in the Magic Research 2 reference). Cite them the same way ("rule 39, 51"). Arcanum stays the primary reference where the two overlap; Hundred Days is evidence of what one designer did with the same machine, not a template.

`research/magic-research-2-reference/README.md` is the third reference: **Magic Research 2** (Maticolotto, 2024, final patch 1.8.6), an independent incremental wizard game built on a reset loop, not on Arcanum's engine. Consult it for anything about resets and prestige (`02` §4–6), automation (`06` §3–4), offline time (`03` §6), explaining numbers (`01` §5, `03` §3) and the phone layout (`01` §2). Its rules are numbered 75–100 in `08-design-rules.md`, continuing the shared list; cite them the same way ("rule 89, 91"). Version labels there are `v1.5.5 src` (demo source map), `v1.8.6 strings`, `wiki 2026-11-19`. Its content is code, not data (`03` §11): take its loops and interface, keep Arcanum's vocabulary underneath. The demo source has **no licence**; nothing from it, the strings, the SDK or the wiki may be copied into `src/`. `data-census.md` there is **generated** by `tools/census.py`; regenerate, never hand-edit.

## Maintaining the reference

- `data-tables.md`, `save-wizrobe-analysis.json`, `section-texts.json`, `tooltips.json` are **generated**. Do not hand-edit; regenerate from `data-unstable-0.12.12.9.tar.gz` (unpack, load every `*.json`, index records by `id`) and the save, then replace the file.
- New findings go into the matching numbered page plus, if they change a rule, `12-design-rules.md`. Mark unmeasured claims `[INFERENCE]`.
- Keep version labels on every number (0.12.0.0 wiki / 0.12.3.1 pinned source / 0.12.12.9 testing).
- Screenshots live in `research/arcanum-reference/screens/`; name new ones `<section>.webp` or `tip-<kind>-<id>.webp`.
- The upstream source is MIT (`research/arcanum-study-2026-10-16/UPSTREAM-LICENSE`); Lowbridge is a clean implementation, never a fork. Do not copy upstream code or text into `src/`.
- `research/hundred-days-reference/data-census.md` is **generated** by `tools/census.py` from a checkout of `MaxRau/Hundred-days` (branch `english`); regenerate, never hand-edit. Version label there is `P0.3.9c`. The fork ships Arcanum's engine with **no licence and no MIT notice** (`04` §7); nothing from it may be copied into `src/` either.

## Claude Code Game Studios (installed 2026-10-29)

The `.claude/` tree (agents, skills, hooks, rules) and `project.yaml` come from Donchitos/Claude-Code-Game-Studios v1.2.0. This file stays the project's rulebook; the template's own `CLAUDE.md` was not adopted. Its agents and skills ask before writing files (`.claude/docs/coordination-rules.md`). It targets Godot/Unity/Unreal, so engine skills (`/setup-engine`, engine specialists) do not apply to this TypeScript project. Run Claude Code from the repo root so its hooks load.
