# ADR-0036: Platform stack and the whole-second time model

## Status
Proposed

## Date
2026-10-29

## Last Verified
2026-10-29

## Decision Makers
Owner (Kyuwyn); drafted by Claude from the as-built code after the architecture review of 29 October 2026.

## Summary
ADR-0011 chose a desktop-first browser game and explicitly left the framework, rendering technology and implementation approach open, and no later ADR closed them (TR-ui-006, TR-time-007). This ADR records the stack as built: strict TypeScript bundled by Bun 1.4.3 into a static page with plain DOM and no runtime dependencies. It also records the time model: the engine simulates whole seconds through one `advance(seconds)` call, a 1 s wall-clock ticker drives it, and every player action calls `settle()` before touching the engine.

## Engine Compatibility

| Field | Value |
|-------|-------|
| **Engine** | None — TypeScript 7.0 on Bun 1.4.3, plain DOM |
| **Domain** | Core |
| **Layer** | Foundation |
| **Knowledge Risk** | MEDIUM — no game engine, but TypeScript 7.0 (the native compiler), Bun 1.4.x (`Bun.build`, `Bun.serve`) and Playwright 1.64 are likely newer than agents' training data. API questions about them go to the official documentation for these exact versions, not to memory. |
| **References Consulted** | None. No pinned reference exists in this repo for these tools; versions are taken from `package.json`, `bun --version` and `.github/workflows/deploy-pages.yml`. |
| **Post-Cutoff APIs Used** | None known; `Bun.build` and `Bun.serve` options in `scripts/` should be checked against Bun 1.4.3's documentation before they are changed |
| **Verification Required** | `bun run build` under the pinned Bun in CI produces the same `dist/` as locally; a background tab's throttled ticker still settles on return; whether `performance.now()` advances across system sleep in the target browsers (see Risks) |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-0007, ADR-0011, ADR-0021, ADR-0022, ADR-0026, ADR-0027, ADR-0035 |
| **Enables** | None |
| **Blocks** | None |
| **Ordering Note** | Records existing code. It closes the implementation questions ADR-0011 left open. ADR-0007 and ADR-0027 say what elapsed time does; this ADR says how it is measured and fed to the engine. ADR-0035 owns how a settled state reaches storage. |

## Context

### Problem Statement
Every ADR stamps "TypeScript 7.0 on Bun 1.4.3, plain DOM" in its Engine Compatibility table, but none decides it, and ADR-0011 says outright that it "does not select a framework, rendering technology, source reuse strategy, hosting service, or installation model". The design plan records the 18 October choice of "a TypeScript engine implementing the grammar" and calls "Vue or plain DOM" a presentation choice. The time model is in the same position. ADR-0007 and ADR-0027 fix what away time does (the slot, then the waiting list, then the bank, never both), and the implementation plan names a 1 s tick. No ADR says how real time becomes simulated seconds, or that a player action must first catch the engine up. A fractional, frame-driven or per-action clock would each pass ADR-0007's rules and give different results.

The review also found the deploy workflow installing Bun 1.4.0 while every ADR and the local toolchain say 1.4.3.

### Constraints
- Browser, desktop first, phone secondary (ADR-0011); static hosting on GitHub Pages (`.github/workflows/deploy-pages.yml`).
- One author working with agents: the stack must stay small enough to read whole.
- The validator and tests must run the same engine the browser runs, at faster-than-real time (ADR-0028's route bands, ADR-0026's seeded rolls).
- Time accrues while the tab is closed (ADR-0007), so the clock is the wall clock, not page uptime.

### Requirements
- TR-ui-006: TypeScript on Bun, plain DOM, no runtime dependencies.
- TR-time-007: a 1 s tick, elapsed-time settlement on return and load, and `settle()` before every action.

## Decision

### 1. Language and toolchain
- **TypeScript**, `strict`, checked by `tsc --noEmit` (`bun run typecheck`) over `src/`, `scripts/` and `tests/`. Target ES2022 with DOM libraries; `moduleResolution: Bundler`; JSON content imported directly (`resolveJsonModule`).
- **Bun 1.4.3** runs everything else: `Bun.build` bundles `src/main.ts` for the browser into `dist/` with an external source map and no minification (`scripts/build.ts`); `Bun.serve` serves `dist/` on 127.0.0.1 with `no-store` and only the four built files (`scripts/serve.ts`); `bun test` runs the tests; `bun scripts/validate.ts` runs the validator; `bun install --frozen-lockfile` installs from `bun.lock`.
- **Development dependencies only**: `typescript` 7.0.2, `@types/bun` 1.4.3, `playwright` 1.64.1 (browser smoke). Exact versions, no ranges.
- The deploy workflow pins the same Bun as the ADRs: this ADR changes `bun-version` in `deploy-pages.yml` from 1.4.0 to 1.4.3.

### 2. No runtime dependencies; plain DOM
The shipped page is `index.html`, one bundled `main.js` and `style.css`. Every import under `src/` is relative to `src/`; nothing from `node_modules` is bundled. The interface is built with DOM APIs (`document.createElement`, `replaceChildren`, `textContent`) in `src/ui.ts`, with no framework, virtual DOM or templating library. The browser APIs the game depends on are IndexedDB and Web Locks (ADR-0035) and `localStorage` for per-browser preferences (ADR-0033).

### 3. Module boundaries
The import edges (`types` aside, which every module may read) are `engine → expression`, `content → data/*.json`, `persistence → engine`, `ui → engine, content` (the UI reads `homeCategories`, `openingContext` and `routeKeys` from content and constants such as `WAITING_MAX` from the engine), and `main → content, engine, persistence, ui`, with no cycles. The engine does not import content; it is handed records. `src/engine.ts`, `src/expression.ts` and `src/types.ts` hold every game rule and touch no DOM, storage or clock, so the validator (`scripts/validate.ts`), the route runner (`scripts/routes.ts`) and `bun test` drive the same `GameEngine` the browser does. `src/main.ts` owns the clock, storage and the Web Lock; `src/ui.ts` renders and calls the engine's public surface. What the UI may and may not decide is TR-ui-001, a separate decision.

### 4. Whole-second simulation
`GameEngine.advance(seconds)` is the only way simulated time passes. It accepts any non-negative real number, adds the stored fraction `wallRemainder`, and simulates whole seconds one at a time while an activity or hobby runs. Idle and passive stretches are taken in larger steps that stop at the next threshold crossing, which content keeps on whole units, so the result equals ticking every second. A fraction left while something runs is kept in `wallRemainder` (saved, ADR-0035) for the next call; with nothing running it goes to the bank (ADR-0007). A run that starts but cannot tick three times in a row is released rather than left spinning. The engine reads no clock of its own.

### 5. The wall clock drives it; `settle()` comes first
`main.ts` measures real time and hands it to `advance`:

- **On load**, the time since the save's `savedAt` (wall clock, `Date.now()`) is passed to `advance` once, and a return summary is shown if it was at least a minute.
- **While open**, `settle()` advances the engine by the `performance.now()` time since the last settle. A 1 s `setInterval` ticker calls `settle()` and renders; `visibilitychange` and `pagehide` call it too.
- **Before every player action**, the UI calls `beforeChange`, which is `settle()`, before the action touches the engine (`change` in `src/ui.ts`). The action itself therefore lands on the second it was taken. A confirmation's text (`removeWarning`, `askFirst`) is computed before that settle, so the warning a player reads can describe a state up to a second old.
- The interval's own timing does not matter: a late or throttled tick passes the larger elapsed time to `advance`, so a background tab loses nothing.

### 6. Randomness is injected
`GameEngine.random` defaults to `Math.random` in play. Tests and the route runner replace it with scripted or seeded generators (ADR-0026 §4), which is what lets `bun run validate` timings repeat.

### Architecture Diagram

```
 wall clock ── load: Date.now() − savedAt ──┐
 performance.now() ── settle() ─────────────┤
   ▲  1 s setInterval / visibilitychange /  │
   │  pagehide / beforeChange (every action)│
   │                                        ▼
 src/main.ts ──────────────► GameEngine.advance(seconds)   ◄── scripts/validate.ts, routes.ts,
   │ owns clock, storage,      whole seconds; fraction        bun test (same engine, no clock,
   │ Web Lock (ADR-0035)       kept in wallRemainder          seeded random)
   ▼
 src/ui.ts (plain DOM) ── renders state, calls engine surface

 build: Bun.build(src/main.ts) → dist/{index.html, main.js, main.js.map, style.css} → GitHub Pages
```

### Key Interfaces
- `GameEngine.advance(seconds: number): AdvanceResult` — the only clock input to the engine.
- `GameEngine.random: () => number` — the only randomness source.
- `settle()` in `src/main.ts`, passed to the UI as `beforeChange`.
- `GameState.wallRemainder` — the carried fraction of a second, in `[0, 1)`.
- Commands: `bun run dev | build | typecheck | test | validate | smoke`.

### Implementation Guidelines
- Code under `src/` must import only from `src/` (and its JSON); a runtime dependency needs a new ADR.
- The interface must use DOM APIs directly; adding a UI framework or templating library needs a new ADR.
- `src/engine.ts`, `src/expression.ts` and `src/types.ts` must never read a clock, the DOM, storage or `Math.random` directly; time enters only through `advance` and randomness only through `random`.
- Every player action must call `settle()` before it touches the engine.
- Elapsed time must be measured, never counted in ticks: a tick passes the time since the last settle, not a fixed second.
- `advance` must simulate whole seconds; content thresholds must stay on whole units so that larger idle steps equal per-second ticking.
- Development dependencies must be pinned to exact versions, and CI must use the Bun version this ADR names.

Enforcement: these are conventions held by code review. No tool checks the import rule, the engine's clock and randomness rule, settle-first or whole-unit thresholds; the validator's real-tick routes catch some breaches of the last one. `tsc` and the frozen lockfile are the only automatic checks here. Adding a lint or validator gate is a separate decision.

## Alternatives Considered

### Alternative 1: A UI framework with Vite
- **Description**: Vue (which the design plan named as an option) or React for the interface, bundled by Vite, with the engine unchanged.
- **Pros**: Declarative rendering; a mature ecosystem for components and devtools.
- **Cons**: A runtime dependency and its upgrade cadence; a second toolchain beside Bun; reactivity that would tempt rules into components; more to read for a text-and-panel game whose screens are lists and cards.
- **Rejection Reason**: The interface is text and panels (ADR-0011) and already renders by field (ADR-0021 rule 1); plain DOM does that with no dependency, and keeps the engine the only place rules live.

### Alternative 2: Simulation in a Web Worker on a requestAnimationFrame clock
- **Description**: Run `GameEngine` in a worker; the page posts frames and receives state snapshots.
- **Pros**: The page stays responsive under a heavy simulation; frame-rate rendering.
- **Cons**: Every action becomes an async message, so "settle, then act" needs a round trip; state must be cloned across the boundary each render; `requestAnimationFrame` stops in background tabs, so the wall clock is still needed. The simulation is cheap enough that none of this buys anything today.
- **Rejection Reason**: Complexity without a measured need. The whole-second model already decouples simulation from render rate.

### Alternative 3: Fractional time (continuous `advance` without whole seconds)
- **Description**: Let every call simulate exactly the real time passed, fractions included.
- **Pros**: No carried remainder.
- **Cons**: Results would depend on the ticker's timing, so the validator's runs would not match play, and fight swings (ADR-0026, on Speed clocks per second) would need sub-second rules.
- **Rejection Reason**: Whole seconds make play, tests and the validator agree.

## Consequences

### Positive
- One engine runs in the browser, the tests and the validator, so a measured pacing band is a property of the content, not of the harness (ADR-0028).
- No runtime dependency can break, change licence or need a security upgrade.
- Background throttling and closed tabs settle from measured elapsed time; a late tick loses nothing. (System sleep with the tab open is not guaranteed; see Risks.)
- An action lands on the current second, never on a state up to a second stale.

### Negative
- The DOM code in `src/ui.ts` is long and imperative; every view is rebuilt by hand.
- A large `advance` on return runs synchronously on the main thread before the first render.
- The toolchain is tied to Bun: build, serve, test and validate all use Bun APIs.

## Risks
- **CI and local toolchains drift.** The deploy workflow ran Bun 1.4.0 while development used 1.4.3. Mitigation: this ADR pins 1.4.3 in the workflow; any later Bun upgrade updates the workflow, the ADRs' Engine line and this ADR together.
- **Deploys are not gated.** The Pages workflow builds and deploys on every push to `master` without running `typecheck`, `test`, `validate` or `smoke`. Not changed here (adding a gate is a release decision); recorded so it is not mistaken for coverage.
- **Long absences.** A return after days runs every activity second up to the next stop synchronously; idle stretches are stepped, so cost is bounded by activity, not by absence, but it has not been measured at the bank cap.
- **Sleep with the tab open can lose time (accepted risk).** `settle()` measures `performance.now()` and then sets the save's `anchor` to `Date.now()`. Whether `performance.now()` advances while the machine is suspended differs by browser and OS. Where it does not, the sleep is never fed to `advance`, and the next save marks it as already settled, so the time is lost rather than banked. Proposed fix, not decided here: settle from the larger of the `performance.now()` and `Date.now()` deltas.
- **A forward change to the system clock grants away time.** Load settlement trusts `Date.now() − savedAt`, so moving the clock forward credits activity or bank time (a backward change is clamped to zero). Accepted for a single-player game with no leaderboard.
- **Content off whole units.** If a threshold sits on a fraction, a stepped idle stretch could cross it on a different second than per-second ticking. Mitigation: the guideline above; the route validator plays real ticks.

## GDD Requirements Addressed

| GDD System | Requirement | How This ADR Addresses It |
|------------|-------------|--------------------------|
| Interface (`design/gdd/systems-index.md`; source `design/DESIGN-PLAN-2026-10-18.md` Part F, `design/IMPLEMENTATION-PLAN-2026-10-18.md`) | TR-ui-006: TypeScript on Bun, plain DOM, no runtime dependencies | §1–§3 |
| Time, tempo and the activity slot (`design/IMPLEMENTATION-PLAN-2026-10-18.md`, design plan Part D) | TR-time-007: 1 s tick, elapsed-time settlement on return and load, `settle()` before every action | §4–§5 |
| Fights / Pacing and validation | TR-fight-002, TR-pacing-003 (already covered by ADR-0026, ADR-0028): injected randomness and the same engine in validation | §3, §6 restate the boundary they rely on |

No system GDD exists; the requirement IDs are those in `docs/architecture/tr-registry.yaml`.

## Performance Implications
- **CPU**: One `advance` of about one second per tick, plus a full render. No budget is set here (TR-fight-005 is a separate decision).
- **Memory**: One engine and its state; the bundle is unminified.
- **Load Time**: One unminified bundle and one stylesheet, plus the return settlement.
- **Network**: Static files only; no requests after load.

## Migration Plan
One change: `.github/workflows/deploy-pages.yml` `bun-version: 1.4.0` → `1.4.3`. Everything else records the code at commit e75aae9 (the ADR-0035 acceptance).

## Validation Criteria
- `bun run typecheck`, `bun test`, `bun run validate` and `bun run smoke` pass under Bun 1.4.3.
- The Pages build succeeds with the pinned Bun.
- Existing: `tests/engine.test.ts` "a long idle wait resumes on the same second as stepping second by second, and stays fast" checks §4's equivalence for an idle stretch, and the validator's routes play real one-second ticks.
- To add, in `tests/engine.test.ts`: the same equivalence for a stretch that crosses an activity's end, the waiting list and Rest in one `advance` call.

## Related
- ADR-0011 (closes its open implementation questions), ADR-0007 and ADR-0027 (what elapsed time does), ADR-0021 (render by field), ADR-0026 §4 (injected rolls), ADR-0028 (validator bands), ADR-0033 (`localStorage` preferences), ADR-0035 (storage and the Web Lock).
- `docs/architecture/architecture-review-2026-10-29.md` (Required ADR 2).
