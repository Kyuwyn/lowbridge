# Adoption Plan

> **Generated**: 2026-10-29 (replaces the minimal-tier plan of the same date, kept in git history at `c97febd`)
> **Project phase**: Technical Setup (`project.stage` in `project.yaml`, mirrored in `production/stage.txt`)
> **Engine**: Not configured by design: no game engine, TypeScript 7.0 on Bun 1.4.3 (recorded in `.claude/docs/technical-preferences.md`; `engine.name` stays unset because the schema only names Godot, Unity and Unreal)
> **Template version**: v1.0+
> **Workflow tier**: full (`modes.rigor: full`). Audit scope: every artifact type.

Work through these steps in order. Check off each item as you complete it.
Re-run `/adopt` anytime to check remaining gaps.

**Gap totals:** BLOCKING 1 · HIGH 6 · MEDIUM 4 · LOW 1

**Closed since the last plan:** `design/game-brief.md`, the engine and stack record, naming and performance config. At `full` the brief stands in for neither the concept doc nor the GDDs, so it no longer counts as the design artifact.

This project keeps its design in its own layout, and `CLAUDE.md` names
`design/DESIGN-PLAN-2026-10-18.md` and `design/decisions/*.md` as binding and
links to those paths. Step 1 asks you to decide whether the CCGS ADR pipeline is
worth moving them. Nothing below runs until you decide.

---

## Step 1: Fix Blocking Gaps

### 1.1 The 34 ADRs are in the wrong place and shape (BLOCKING)
`design/decisions/` holds ADRs 0001–0034. They sit outside `docs/architecture/`,
so every ADR skill sees none of them. None has a `## Status` heading (each uses a
plain `Status: Accepted.` line), and none has `## ADR Dependencies`,
`## Engine Compatibility`, `## GDD Requirements Addressed` or
`## Performance Implications`. Once they are found, `/story-readiness` would
silently pass every ADR status check.

**Decide first (5 min):**
- **A. Adopt the pipeline.** `git mv` each file to `docs/architecture/adr-NNNN-[slug].md`, update every link to the old paths (`CLAUDE.md`, `README.md`, `PRODUCT.md`, `design/*.md`, the ADRs' own relative links), then retrofit each ADR. The moves are a `file_deletions`-class change, so each batch needs your approval.
- **B. Step the rigor back down** with `/settings modes.rigor=minimal` (or `standard`, which expects only critical Foundation ADRs) and leave the ADRs where they are.

- [ ] Decision made: A or B

**If A**, per ADR: `/architecture-decision retrofit docs/architecture/adr-[NNNN]-[slug].md`. **Time**: 1–2 sessions for all 34, plus the link fix-up.

- [ ] 0001 campaign-identity
- [ ] 0002 lifespan-and-retries
- [ ] 0003 opening-anchors
- [ ] 0004 wider-world-and-paths
- [ ] 0005 campaign-progression
- [ ] 0006 world-and-residence
- [ ] 0007 away-time-and-acceleration
- [ ] 0008 optional-combat
- [ ] 0009 work-and-crafting-resources
- [ ] 0010 sects-and-relationships
- [ ] 0011 presentation-and-platform
- [ ] 0012 second-breakthrough-arc
- [ ] 0013 knowledge-and-practice
- [ ] 0014 early-class-advancements
- [ ] 0015 cumulative-class-masteries
- [ ] 0016 third-breakthrough-classes
- [ ] 0017 fourth-breakthrough-choice-breadth
- [ ] 0018 first-defining-trial
- [ ] 0019 early-campaign-pacing
- [ ] 0020 knowledge-woven-into-systems
- [ ] 0021 compounding-vocabulary
- [ ] 0022 chore-tempo
- [ ] 0023 techniques-and-attunement
- [ ] 0024 route-keys
- [ ] 0025 lifespan-and-checkpoints-cut
- [ ] 0026 combat-exchanges
- [ ] 0027 locks-at-payment-and-stops
- [ ] 0028 ten-minute-foundation
- [ ] 0029 crafting-workbench-recipes-preparations
- [ ] 0030 sphere-techniques
- [ ] 0031 basin-road-systems
- [ ] 0032 dungeons-rooms-in-one-run
- [ ] 0033 home-lists-place-swaps-quick-bar
- [ ] 0034 work-kinds-and-condensed-knowledge-cards

---

## Step 2: Fix High-Priority Gaps

Skip this step if you chose B in 1.1 and lowered the rigor.

### 2.1 No `design/gdd/game-concept.md` (HIGH)
`/map-systems` and `/design-system` read it for context. `design/game-brief.md` stands in only at `minimal`.
**Fix**: `/reverse-document concept src`, drawing on `design/game-brief.md`, `PRODUCT.md` and `design/BRIEF.md`.
**Time**: 1 session
- [ ] `design/gdd/game-concept.md` exists

### 2.2 No system GDDs (HIGH)
`systems-index.md` lists 13 systems and `design/gdd/` holds no GDD for any of them. `/create-epics` stops with "No system GDDs found", and `/create-stories` has nothing to build from. At `full` each needs all 8 sections.
**Fix**: `/reverse-document design src/[module]` per system, then `/design-review design/gdd/[file].md`.
**Time**: 1 session each (13)
- [ ] content-grammar-and-expressions
- [ ] time-tempo-and-activity-slot
- [ ] resources-caps-and-recompute
- [ ] save-and-persistence
- [ ] practice-and-knowledge
- [ ] techniques-and-attunement
- [ ] breakthroughs-directions-and-titles
- [ ] fights
- [ ] sites-and-dungeons
- [ ] home-furnishings-and-hobby-place
- [ ] crafting-preparations-and-draughts
- [ ] interface
- [ ] pacing-and-route-validation

### 2.3 No `docs/architecture/architecture.md` (HIGH)
`/create-epics` requires it at `full` and stops without it.
**Fix**: `/create-architecture`, after 2.2 and 1.1.
**Time**: 1 session
- [ ] `docs/architecture/architecture.md` exists

### 2.4 No engine reference docs (HIGH)
`docs/engine-reference/[engine]/VERSION.md` is absent. With no engine there is nothing to reference, so ADR engine-compatibility checks will report NOT ASSESSED.
**Fix**: record the decision; no file to create.
**Time**: 2 min
- [ ] Accepted as not applicable

### 2.5 No TR registry (HIGH)
Created by Step 3a.
- [ ] Resolved with 3a

### 2.6 No control manifest (HIGH)
Created by Step 3b.
- [ ] Resolved with 3b

---

## Step 3: Bootstrap Infrastructure

Needs 1.1 and 2.2 first: the registry and the traceability matrix map GDD requirements to ADRs.

### 3a. Register existing requirements (creates tr-registry.yaml)
Run `/architecture-review` — even if ADRs already exist, this run bootstraps
the TR registry from your existing GDDs and ADRs.
**Time**: 1 session (review can be long for large codebases)
- [ ] tr-registry.yaml created
- [ ] requirements-traceability.md created

### 3b. Create control manifest
Run `/create-control-manifest`
**Time**: 30 min
- [ ] docs/architecture/control-manifest.md created

### 3c. Create sprint tracking file
Run `/sprint-plan` (a sprint plan does not exist yet, so `update` has nothing to read), then `/sprint-plan update`.
**Time**: 1 session
- [ ] production/sprint-status.yaml created

### 3d. Set authoritative project stage
Run `/gate-check technical-setup` (the gate into the phase the project is in)
**Time**: 5 min
- [ ] `project.stage` in `project.yaml` written (legacy `production/stage.txt` also updated)

---

## Step 4: Medium-Priority Gaps

### 4.1 Systems index Status values (MEDIUM)
All 13 rows read `Implemented`. The framework's own template lists that value, but `/adopt` accepts only Not Started, In Progress, In Review, Designed, Approved and Needs Revision, and no skill I searched reads `Implemented`. The column tracks design-doc status, and there are no GDDs yet.
**Fix**: edit `design/gdd/systems-index.md` and set each row to `Not Started`, then move each to `Designed` as its GDD is written (2.2).
**Time**: 5 min
- [ ] Status values changed

### 4.2 No sprint-status.yaml (MEDIUM)
Created by Step 3c.
- [ ] Resolved with 3c

### 4.3 No requirements traceability matrix (MEDIUM)
Created by Step 3a.
- [ ] Resolved with 3a

### 4.4 The `lowbridge` epic is minimal-shaped (MEDIUM)
`production/epics/lowbridge/EPIC.md` has no Governing ADRs or GDD Requirements tables, and its GDD line points at `design/game-brief.md`. At `full` `/create-epics` writes one epic per system from the GDDs.
**Fix**: after 2.2, 2.3 and 3a, run `/create-epics` and choose "Update in place" for this epic, or skip it and let the per-system epics replace it.
**Time**: 1 session
- [ ] Epics regenerated from GDDs

---

## Step 5: Optional Improvements

### 5.1 Unset testing and library fields (LOW)
Forbidden Patterns, Allowed Libraries, Minimum Coverage and the engine specialist routing in `technical-preferences.md` are empty or `[TO BE CONFIGURED]`.
**Fix**: fill them as decisions are made.
- [ ] Fields filled as needed

---

## Not gaps

- **Stories**: none exist yet, so no story audit applies.
- **v1.0 migration**: not applicable. `project.yaml` exists and `production/stage.txt` agrees with it.
- **Layer column**: `/adopt` expects System, Layer, Priority and Status columns, but the framework's own template uses Category and puts Layer in the Dependency Map. `systems-index.md` follows the template, so nothing to fix.
- **Review mode**: resolves to `full`, from `modes.rigor`. Director-gate agents run at each skill step.

## What to Expect from Existing Stories

There are no stories yet. Once they exist, they continue to work with all
template skills. New format checks (TR-ID validation, manifest version
staleness) auto-pass when the fields are absent — so nothing breaks. They won't
benefit from staleness tracking until regenerated. Do not regenerate stories
that are in progress or done.

---

## Re-run

Run `/adopt` again after completing Step 3 to verify all blocking and high gaps
are resolved. The new run will reflect the current state of the project.
