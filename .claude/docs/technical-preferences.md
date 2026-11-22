# Technical Preferences

<!-- project.yaml at the repo root is the machine-readable source of truth for
     engine, specialists, naming, performance, platform, and testing.framework.
     This file is the human-readable LEGACY FALLBACK: agents and skills resolve
     each key from project.yaml first and fall back here only when the
     project.yaml key is absent. /setup-engine dual-writes both.
     Forbidden patterns and allowed libraries are NOT migrated — they live only
     in this file. Populated by /setup-engine; updated as decisions are made. -->

## Engine & Language

- **Engine**: None — web platform (browser DOM and CSS). CCGS engine specialists do not apply; see CLAUDE.md
- **Language**: TypeScript 7.0.2
- **Runtime / Build**: Node.js 26 LTS (tooling only); Vite 8.3.8
- **Rendering**: DOM and CSS. Interface layer (plain DOM or a framework) undecided until `/create-architecture`
- **Physics**: None

## Input & Platform

<!-- Written by /setup-engine. Read by /ux-design, /ux-review, /test-setup, /team-ui, and /dev-story -->
<!-- to scope interaction specs, test helpers, and implementation to the correct input methods. -->

- **Target Platforms**: Web (desktop and phone browsers) first; mobile app (iOS / Android) later
- **Input Methods**: Keyboard/Mouse, Touch
- **Primary Input**: Mouse and touch equally
- **Gamepad Support**: None
- **Touch Support**: Full
- **Platform Notes**: No hover-only interactions: every tooltip opens by tap and by keyboard focus as well. Text reflows to phone width. The phone layout is a constraint from the first UX spec and is built at the vertical slice.

## Naming Conventions

- **Classes**: PascalCase
- **Variables**: camelCase
- **Signals/Events**: N/A
- **Files**: kebab-case.ts
- **Scenes/Prefabs**: N/A
- **Constants**: UPPER_SNAKE_CASE

## Performance Budgets

- **Target Framerate**: [TO BE CONFIGURED — set at /create-architecture; frame budgets do not fit a text interface]
- **Frame Budget**: [TO BE CONFIGURED]
- **Draw Calls**: N/A
- **Memory Ceiling**: [TO BE CONFIGURED]

## Testing

- **Framework**: Vitest 5.1.1 (`npm test`); type checking with `npm run typecheck`
- **Minimum Coverage**: [TO BE CONFIGURED]
- **Required Tests**: Balance formulas, gameplay systems, the content validator

## Forbidden Patterns

<!-- Add patterns that should never appear in this project's codebase -->
- [None configured yet — add as architectural decisions are made]

## Allowed Libraries / Addons

<!-- Add approved third-party dependencies here -->
- [None configured yet — add as dependencies are approved]

## Architecture Decisions Log

<!-- Quick reference linking to full ADRs in docs/architecture/ -->
- [No ADRs yet — use /architecture-decision to create one]

## Engine Specialists

<!-- Written by /setup-engine when engine is configured. -->
<!-- Read by /code-review, /architecture-decision, /architecture-review, and team skills -->
<!-- to know which specialist to spawn for engine-specific validation. -->

- **Primary**: lead-programmer
- **Language/Code Specialist**: gameplay-programmer (rules core), tools-programmer (validator and scripts)
- **Shader Specialist**: N/A
- **UI Specialist**: ui-programmer
- **Additional Specialists**: accessibility-specialist
- **Routing Notes**: The studio ships no specialist for a web stack, so the Godot, Unity and Unreal specialists are never spawned here. General agents review instead, and they must check `docs/engine-reference/web/` before relying on what they know of TypeScript, Vite or Vitest.

### File Extension Routing

<!-- Skills use this table to select the right specialist per file type. -->
<!-- If a row says [TO BE CONFIGURED], fall back to Primary for that file type. -->

| File Extension / Type | Specialist to Spawn |
|-----------------------|---------------------|
| Game code (.ts files) | gameplay-programmer |
| Shader / material files | N/A |
| UI / screen files (.css, .html, interface .ts) | ui-programmer |
| Scene / prefab / level files | N/A |
| Native extension / plugin files | N/A |
| General architecture review | lead-programmer |
