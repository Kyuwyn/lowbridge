# Adoption Plan

> **Generated**: 2026-10-29
> **Project phase**: Technical Setup (`project.stage` in `project.yaml`, mirrored in `production/stage.txt`)
> **Engine**: Not configured (hand-written TypeScript on Bun, no game engine)
> **Template version**: v1.0+
> **Workflow tier**: minimal (`modes.rigor: minimal`). Audit scope: `design/game-brief.md`, engine reference, project config.

Work through these steps in order. Check off each item as you complete it.
Re-run `/adopt` anytime to check remaining gaps.

**Gap totals:** BLOCKING 0 · HIGH 3 · MEDIUM 2 · LOW 0

This project keeps its design in its own layout (`design/BRIEF.md`,
`design/decisions/` with 34 ADRs, `design/IMPLEMENTATION-PLAN-2026-10-18.md`),
and `CLAUDE.md` names those paths as binding. Nothing below moves or rewrites
them. The CCGS skills read other paths, so the gaps are about giving them a
brief and an engine record, not about fixing existing documents.

---

## Step 1: Fix Blocking Gaps

None.

---

## Step 2: Fix High-Priority Gaps

### 2.1 No `design/game-brief.md` (HIGH)
`/create-stories` reads the brief's MVP list, and no skill on the minimal path
can find one. `design/BRIEF.md` is a 169-line design-interview record with no
headings, so it does not carry the six required fields (one-sentence pitch,
core loop, player goal and fail state, MVP, out of scope, build order).
**Fix**: write a one-page `design/game-brief.md` from
`.claude/docs/templates/game-brief.md`, drawing on `design/BRIEF.md`,
`PRODUCT.md` and `design/IMPLEMENTATION-PLAN-2026-10-18.md` (build order).
`/reverse-document design src` is the skill route; the code root holds 8
TypeScript files (13 with the JSON data), under the 10-file mark the skills
use, so a hand-written brief from the existing documents is the closer fit.
**Time**: 30 min
- [ ] `design/game-brief.md` exists with all six required fields filled

### 2.2 Engine not configured (HIGH)
`engine.*` is absent from `project.yaml`, and `technical-preferences.md` still
reads `[TO BE CONFIGURED]` for Engine, Language, Rendering and Physics.
**Fix**: decide whether to record the stack (TypeScript, Bun, DOM, no physics)
with `/setup-engine`, or leave it unset on purpose.
**Time**: 5 min
- [ ] Engine decision made and recorded (or consciously skipped)

### 2.3 No engine reference docs (HIGH)
`docs/engine-reference/[engine]/VERSION.md` is absent. This only matters if
2.2 records an engine; with no engine there is nothing to reference.
**Fix**: created by `/setup-engine` if you record a stack.
**Time**: included in 2.2
- [ ] Resolved with 2.2

---

## Step 3: Bootstrap Infrastructure

Not on the minimal path: the brief's build order is the plan. Next:
`/create-stories` (or `/dev-story` once stories exist).

---

## Step 4: Medium-Priority Gaps

### 4.1 No naming conventions configured (MEDIUM)
`naming.*` is absent from `project.yaml` and `technical-preferences.md`.
**Fix**: `/settings` or `/setup-engine`. The code already follows a
convention; this only records it.
**Time**: 5 min
- [ ] Naming conventions recorded

### 4.2 No performance budgets configured (MEDIUM)
`performance.*` is absent from `project.yaml` and `technical-preferences.md`.
**Fix**: `/settings` or `/setup-engine`. Pacing budgets are enforced by
`bun run validate` (ADR 0028), not recorded in the CCGS config.
**Time**: 5 min
- [ ] Performance budgets recorded

---

## Step 5: Optional Improvements

None.

---

## Not audited at this tier

- **ADRs**: 34 files in `design/decisions/` use a `Status:` line, not a `## Status` heading, and sit outside `docs/architecture/`. ADRs are not expected at `minimal`, so this is informational. Move or reformat them only if the project later moves to `standard`, and then check the references in `CLAUDE.md` and `README.md` first.
- **v1.0 migration**: not applicable. `project.yaml` exists and `production/stage.txt` agrees with it.

## What to Expect from Existing Stories

There are no stories yet. Once they exist, they continue to work with all
template skills. New format checks (TR-ID validation, manifest version
staleness) auto-pass when the fields are absent. Do not regenerate stories that
are in progress or done.

---

## Re-run

Run `/adopt` again after completing Step 2 to verify all blocking and high gaps
are resolved. The new run will reflect the current state of the project.
