# ADR-0038: The interface-to-content contract

## Status
Proposed

## Date
2026-10-29

## Last Verified
2026-10-29

## Decision Makers
Owner (Kyuwyn); drafted by Claude after the architecture review of 29 October 2026.

## Summary
The interface named about twenty content ids as string literals scattered through `src/ui.ts`, and nothing checked them, so renaming a record would silently blank a panel (TR-ui-002); the rule that the interface holds no game rules had never been decided either (TR-ui-001). This ADR decides both: the interface may name content only through one declared list, `uiIds` in `src/content.ts`, which `bun run validate` checks against the records and route keys; and the interface may read and present engine state but never decide an outcome, with the two existing exceptions (the slip's leaf count, and the waystation arrival time read back from a log line) recorded as debt to move.

## Engine Compatibility

| Field | Value |
|-------|-------|
| **Engine** | None — TypeScript 7.0 on Bun 1.4.3, plain DOM |
| **Domain** | UI |
| **Layer** | Presentation |
| **Knowledge Risk** | LOW — plain TypeScript; no browser or toolchain API is involved beyond what ADR-0036 records |
| **References Consulted** | `research/arcanum-reference/12-design-rules.md` rule 1 |
| **Post-Cutoff APIs Used** | None |
| **Verification Required** | None beyond Validation Criteria |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-0021, ADR-0024, ADR-0027, ADR-0036, ADR-0037 |
| **Enables** | None |
| **Blocks** | None |
| **Ordering Note** | Ships with its code: `uiIds` in `src/content.ts`, `src/ui.ts` reading it, and the check in `validateContext`. ADR-0027 already put the warning text in the engine (`warnText`, `removeWarning`); this ADR generalises that boundary. |

## Context

### Problem Statement
Rule 1 of the reference (*copy*, ADR-0021) is that "the UI renders by field, never by type", and Lowbridge's interface mostly does: groups are matched by `kind`, `group` and `category`, cards and tooltips by field. But some things the interface shows are particular records, not kinds: the Body panel's five gauges, the stage line (Foundation, the ridge, the basin road, Reedmarket), the completion banners, the slots it reports (floor space, attunement places, the hobby place), the jade slip and its leaves. `src/ui.ts` named about twenty of these as string literals, and CLAUDE.md records the consequence: "renaming them breaks rendering, and `validate` will not notice". The systems index lists it as the Interface's risk; `bun run smoke` catches some breakage, but only on the screens it visits.

Separately, the implementation plan says "The UI and route runner call this same surface; they never implement rewards", and ADR-0027 says the interface "holds no rule of its own" for warnings. No ADR made the boundary general. One rule has already leaked: the Character tab computes the slip's recovered-leaf count as `3 + g.t_leaf + 2 × (Shu's three leaves held)` of 12.

### Constraints
- Plain DOM, no framework (ADR-0036); the fix must be small and readable.
- Content files must not learn about the interface: no UI-only fields in the record vocabulary unless they earn their place (rule 1).
- The check must run where content is checked, in `bun run validate`, so a content rename fails before release.

### Requirements
- TR-ui-001: the UI holds no game rules and calls the same engine surface as the route runner.
- TR-ui-002: the UI's direct references to content are checked.

## Decision

### 1. One declared list of ids
`src/content.ts` exports `uiIds`, a constant object from a role name to a content id or route key:

- `body`: the Body panel's gauges in display order (`vigor`, `qi`, `life`, `strain`, `focus`);
- single records: `vigor`, `life`, `rest`, `coin`, `homeSpace`, `attuneSlots`, `hobbySlots`, `settling`, `foundation`, `waystation`, `secondDirection`, `reedmarket`, `jadeSlip`, `slipLeaves`, `shuApprentice`, `shuThreeLeaves`, `carryCurrent`, `settleBreath`;
- one route key: `leafKey` (`t_leaf`).

It sits beside `routeKeys`, `homeCategories` and `openingContext`, the other content-side tables the interface reads.

### 2. The interface names content only through `uiIds`
`src/ui.ts` must not write a content id or route key as a string literal; every such reference reads `uiIds.<role>`. Strings that merely coincide with an id but are not content references stay literal: a group key (`workbench` in the group table), a `data-ui` hook (`foundation`), a fight result (`life`), a DOM event (`focus`).

### 3. The validator checks the list
`validateContext` in `scripts/validate.ts` fails when any value in `uiIds` names no record, or, for a `t_`-prefixed value, no entry in `routeKeys`: "uiIds.jadeSlip names jade_slipX, which is not a record". A rename that misses `uiIds` now fails `bun run validate` instead of blanking a panel. The check tells the two apart by the `t_` prefix, which ADR-0024 reserves for route keys; a record id beginning `t_` would be misread as a missing route key. No record id begins `t_` today, and content must keep it that way.

`uiIds` is a plain object literal `as const`, with no index signature, so a mistyped role (`uiIds.waystaton`) fails `bun run typecheck`.

### 4. The interface reads and presents; it never decides
The interface may:
- read engine state and records, and call the engine's public methods (`stat`, `record`, `visible`, `availability`, `tooltip`, `warnText`, `fight`, `pointerProgress`, …);
- call the engine's actions (`start`, `queue`, `stop`, `attune`, `remove`, …) after `settle()` (ADR-0036);
- choose layout, order, wording and which panels show, from what the engine reports;
- run the engine on a **clone** to preview, and set up that clone's state before advancing it (the unattended-runway probe builds a new `GameEngine` from the current state, which the constructor deep-copies, then clears the clone's `bank.accelerating` so the preview runs at ordinary speed).

The interface must not:
- write the live engine's state;
- compute an outcome, cost, gate, count or reward that content or the engine owns;
- decide availability, warnings or fight projections itself (ADR-0026, ADR-0027 put these in the engine).

### 5. Known debt
Two places in `src/ui.ts` compute what content or the engine owns, against §4. Both are recorded here, not fixed.

- **The leaf count.** The Character tab's "N of 12 recovered" computes `3 + tagCount(t_leaf) + 2 × [Shu's three leaves held]`: how many leaves the slip has and how each is recovered, a content fact. Follow-up: give the slip a store or derived count in content and have the interface read it.
- **The waystation arrival time.** The completion banner (`renderCompletion`) finds the crossing by scanning for a record whose `result` contains `waystation`, then finds the journal entry whose text starts with `"<crossing name>:"`, and reads its time. That rebuilds an engine fact (when the arrival happened) from the wording of a log line. Renaming a crossing or changing the completion log format silently falls back to total activity time, and neither `uiIds` nor the validator notices. Follow-up: have the engine record the arrival time (or a completion's time by record id) and read that.

### Key Interfaces
- `uiIds` (`src/content.ts`): an object literal `as const` from role name to id (or, for `body`, a readonly tuple of ids); no index signature, so every role is a typed property.
- The check: `validateContext(records)` in `scripts/validate.ts`.

### Implementation Guidelines
- `src/ui.ts` must name a content id or route key only through `uiIds`; a new reference adds a role to `uiIds` first.
- A role must name the record it is about, not the screen that uses it (`waystation`, not `stageRidge`).
- A content rename must update `uiIds` in the same change; `bun run validate` fails until it does.
- The interface must never write the live engine's state; it may set up and advance a clone.
- The interface must not read engine facts back from journal wording; a fact it needs must be exposed by the engine.
- The interface must not compute an outcome content or the engine owns; a number the interface needs and cannot read must be added to content or the engine.
- Prefer rendering by `kind`, `group`, `category` and fields (rule 1); add to `uiIds` only for something that is genuinely one particular record.
- Enforcement: `bun run validate` checks every `uiIds` value. That `src/ui.ts` uses `uiIds` rather than a literal, and that it holds no rule, are held by code review.

## Alternatives Considered

### Alternative 1: The interface names no ids; content marks roles
- **Description**: Add a field such as `ui: "body"` or `ui: "stage"` to the records the interface needs, and have the interface find them by role.
- **Pros**: The interface would hold no ids at all; content declares its own presentation roles.
- **Cons**: A presentation field in the record vocabulary that only one consumer reads, against rule 1's "render by field" spirit in reverse; several roles are about one record each (the stage line names four in order), so the field would carry ordering and uniqueness rules of its own; the validator would need those rules too.
- **Rejection Reason**: More vocabulary for the same guarantee. A list in `src/content.ts` keeps the record grammar unchanged and is as checkable.

### Alternative 2: Leave the literals, rely on the browser smoke
- **Description**: Keep the ids inline in `src/ui.ts` and trust `bun run smoke` to catch a broken panel.
- **Pros**: No change.
- **Cons**: The smoke test sees only the screens and states it drives; a rename of `reedmarket` or `shu_three_leaves` would pass it. The validator, which runs on every content change, would still not notice.
- **Rejection Reason**: It leaves TR-ui-002 uncovered, which is the gap the review found.

## Consequences

### Positive
- A content rename the interface depends on fails `bun run validate`, with the role and the missing id named.
- Every particular record the interface depends on is listed in one place, so a reader can see the interface's whole dependency on content at a glance.
- The interface's boundary is stated, so a reviewer has a rule to hold a change against.
- A mistyped role fails `bun run typecheck`, and a missing id fails `bun run validate`.

### Negative
- `src/ui.ts` reads `uiIds.waystation` where it read `"waystation"`, which is slightly longer.
- Nothing mechanical stops a new literal id in `src/ui.ts`; only review does.
- The leaf count and the arrival-time lookup stay in the interface until their follow-ups land.

## Risks
- **A new literal slips past review.** A future change writes `engine.stat("some_id")` in `src/ui.ts`. Mitigation: the guideline. Follow-up: a `bun test` that scans `src/ui.ts` for quoted strings equal to a content id, allowing the four known coincidences; today it would find exactly those four.
- **The arrival time silently falls back.** Renaming a ridge crossing or rewording the completion log makes the waystation banner show total activity time instead of arrival time, with no error. Mitigation: the §5 follow-up.
- **The engine names ids too.** `src/engine.ts` exports its own fixed ids as constants (`LIFE`, `STRIKE`, `GUARD`, `SPEED`, `HIT`, `DODGE`, `HOME_SPACE`, `ATTUNE_SLOTS`, `HOBBY_SLOTS`, per ADR-0026 and ADR-0023), so `life`, `home_space`, `attune_slots` and `hobby_slots` now have two names, one in `uiIds` and one in the engine. That is the engine's contract with content, outside this ADR's scope. `GameEngine.stat` throws on an unknown id, so an unguarded engine read of a renamed id fails in tests and the validator's routes; a read guarded by a presence check (`has`) would not, and no check lists the engine's ids the way `uiIds` is now listed. Follow-up: check the engine's fixed ids in `validateContext` the same way.
- **The leaf count drifts from content.** If a recoverable leaf is added or removed, the interface's "of 12" and its arithmetic go stale without any check. Mitigation: the §5 follow-up.

## GDD Requirements Addressed

| GDD System | Requirement | How This ADR Addresses It |
|------------|-------------|--------------------------|
| Interface (`design/gdd/systems-index.md`; source implementation plan) | TR-ui-001: the UI holds no game rules and calls the same engine surface as the route runner | §4, with §5 recording the two exceptions |
| Interface (`design/gdd/systems-index.md` risk table) | TR-ui-002: the UI's direct references to content are checked | §1–§3 |

No system GDD exists; the requirement IDs are those in `docs/architecture/tr-registry.yaml`.

## Performance Implications
- **CPU**: None; a property read replaces a literal.
- **Memory**: One small constant object.
- **Load Time**: None.
- **Network**: None.

## Migration Plan
Done in the same change as this ADR: `uiIds` added to `src/content.ts`; 45 literal references in `src/ui.ts` replaced with `uiIds` reads; `validateContext` checks the list. The change was verified to fail `bun run validate` on a broken record id and on a broken route key before both were restored.

## Validation Criteria
- `bun run typecheck`, `bun test`, `bun run validate` and `bun run smoke` pass with the change.
- `bun run validate` fails with "uiIds.<role> names <id>, which is not a record" (or "a route key") when an entry is broken (verified by hand on `jadeSlip` and `leafKey`).
- Follow-up: move the leaf count into content (§5), then remove `shuThreeLeaves` and `leafKey` from `uiIds` if nothing else reads them.

## Related
- ADR-0021 (rule 1: render by field), ADR-0024 (route keys, `routeKeys`), ADR-0026 and ADR-0027 (fight projections and warnings live in the engine), ADR-0036 (plain DOM; `settle()` before every action), ADR-0037 (the expression language the engine resolves for gates the interface only displays).
- `docs/architecture/architecture-review-2026-10-29.md` (Required ADR 4).
