# ADR-0035: Save storage and single-writer access

## Status
Proposed

## Date
2026-10-29

## Last Verified
2026-10-29

## Decision Makers
Owner (Kyuwyn); drafted by Claude from the as-built code after the architecture review of 29 October 2026.

## Summary
Lowbridge kept its saves in IndexedDB and its journey to one tab through Web Locks, but no ADR said so, and the architecture review of 29 October 2026 failed on that gap (TR-save-002, TR-save-004). This ADR records the design as built: one IndexedDB store holds a `current` save and a `backup` save, both replaced in one transaction and each checked by decoding before it is written; one tab per browser profile holds the journey through a Web Lock; an import and every stored slot pass the same decoder.

## Engine Compatibility

| Field | Value |
|-------|-------|
| **Engine** | None — TypeScript 7.0 on Bun 1.4.3, plain DOM |
| **Domain** | Core |
| **Layer** | Core |
| **Knowledge Risk** | N/A — no engine, so no `docs/engine-reference/` VERSION.md |
| **References Consulted** | None. The browser APIs below (IndexedDB, Web Locks) are not covered by any pinned reference in this repo. |
| **Post-Cutoff APIs Used** | None |
| **Verification Required** | Recovery from the `backup` slot in a real browser (no test exercises `SaveStore` directly); the final write on `pagehide` (best effort, see Risks); a lock-holding tab under back/forward cache and tab freezing (a frozen tab keeps the lock, and some browsers keep lock-holding pages out of the back/forward cache) |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-0011, ADR-0021, ADR-0025, ADR-0026, ADR-0030, ADR-0031, ADR-0032 |
| **Enables** | None |
| **Blocks** | None |
| **Ordering Note** | Records existing code; nothing waits on it. ADR-0025 fixes what a save holds and that older versions are refused; ADR-0030 and ADR-0031 set the v7 shape; this ADR fixes where a save lives, how it is written and who may write it. |

## Context

### Problem Statement
Every save rule the ADRs record is about what a save contains: authoritative history only, derived fields rebuilt on load (ADR-0021), older versions refused by name (ADR-0025), the v7 fields (ADR-0030, ADR-0031), a fight saved mid-run with its room (ADR-0026, ADR-0032). None says where the save is kept, how a write is made safe against a crash or a corrupt record, or what happens when the game is open twice. The build answers all three in `src/persistence.ts` and `src/main.ts`, and the systems index names save and persistence as a high-risk Core system. Without a decision record, a change to any of the three has nothing to be checked against.

### Constraints
- Browser only, desktop first, no server (ADR-0011). Saves live on the player's device.
- No runtime dependencies: the save layer uses browser APIs directly.
- Time passes while the tab is closed and is settled on return (ADR-0007, ADR-0027), so the saved wall-clock time must belong to the last state written.
- A save is a sparse delta keyed by stable record ids and must survive content changing under it (ADR-0021, ADR-0025).

### Requirements
- TR-save-002: storage that survives a reload, with a recoverable copy when the newest write is damaged.
- TR-save-003: export and import, refusing a malformed file or one naming ids that cannot be resumed, without disturbing the running game.
- TR-save-004: one writer per journey, so two tabs never tick or save over each other.

## Decision

### 1. Storage: one IndexedDB store, two slots
The database is `lowbridge-first-slice` (`DATABASE_NAME`), schema version 1, with one object store `saves` holding two keys:

- `current`: the newest save.
- `backup`: the save `current` held before the last write.

The database name predates chapter two; it stays, since renaming it would orphan every existing save. The database's own schema version (1) is independent of the save format version (`SAVE_VERSION`, 7), which ADR-0025 governs.

### 2. A write replaces both slots in one transaction, checked twice
`SaveStore.write(save)`:

1. Decodes the new save with `decodeSave` before opening a transaction. A save the decoder would refuse is never stored.
2. In one `readwrite` transaction, reads `current`; if it decodes, writes it to `backup`; then writes the new save to `current`. If the old `current` does not decode, `backup` is left as it is, so a damaged slot never overwrites the last good copy.
3. Resolves only when the transaction commits (`oncomplete`) and rejects on abort.

Writes are serialised through one promise chain in `main.ts` (`persist`), so two writes never overlap. A write happens once at boot (so a save recovered from `backup` or chosen at the boot screen is on disk at once), about every 5 s while the ticker runs, when the running activity ends, after every player action (`onChange`), after an import or a new journey (`replace`), when the page becomes hidden (`visibilitychange`) and on `pagehide`.

### 3. A load tries `current`, then `backup`
`SaveStore.load()` reads both slots in one `readonly` transaction and decodes `current`; if that fails it decodes `backup` and reports `recovered`, which the status line shows as "Recovered the previous save". With neither slot present it is a new journey. If both fail, boot stops at "Your saved journey needs attention" with the decoder's message, an import field and a confirmed "Start a new journey". Nothing is replaced until the player chooses.

If IndexedDB cannot be opened at all, the game runs without autosave and the status line says "Autosave unavailable. Export to keep this visit."

### 4. One decoder for every way in
`decodeSave` is the single gate for a slot, an import and the write check above. It refuses: a wrong `format`; any `version` other than `SAVE_VERSION`, by name (ADR-0025); an unknown field on a record; numbers that are not finite, negative or out of range; a waiting list longer than `WAITING_MAX` or naming one entry twice; and sizes past fixed bounds (5000 records, 5000 journal lines, 100 effects). It skips, rather than refuses, `items` for ids the content no longer has, since a delta keyed by stable ids is meant to outlive content changes. It refuses ids the game would have to resume, because nothing can run them: unknown ids in `attuned`, the running activity, the waiting list, the hobby, the effects and a saved fight. Progress past a length that content has since shortened is held just short of it rather than refused.

### 5. Export and import
Export downloads `makeSave`'s `SaveFile` JSON after `settle()`. It is the same shape a slot holds but is not passed through `decodeSave`, so a slot holds the decoder's normalised copy while an export holds the raw one, and nothing yet guarantees that an export imports (see Risks). Import reads a file of at most 5 MB, decodes it, and only on success replaces the engine and writes it as `current` through the ordinary write path. A refused import leaves the running game and both slots untouched.

### 6. One writer: a Web Lock per browser profile
Before boot, `main.ts` requests the Web Lock `lowbridge-active-journey` with `ifAvailable: true`. A tab that boots holds it for the life of the page. If `boot()` throws, the tab shows "Lowbridge could not open" and the lock is released; such a tab never starts its ticker. A second tab that cannot take the lock does not boot: it shows "Lowbridge is open in another tab" with a "Continue here" button that reloads, and so succeeds once the first tab has closed. It never takes the lock from the holder. A browser without `navigator.locks` does not boot at all ("This browser cannot keep the journey safe"), since without the lock two tabs could tick and save over each other.

A tab whose ticker faulted ("The simulation stopped") stops ticking but keeps the lock, and its `visibilitychange` and `pagehide` handlers still call `settle()` and `persist()`. If `settle()` throws again, the handler stops before `persist()` and nothing is written. Otherwise it writes the state the engine holds, which must still pass the write-time decode. A faulted tab is therefore not read-only. It is guarded only by the decoder.

The IndexedDB connection closes itself on `versionchange`, and an `onblocked` open reports that another tab is blocking storage. Neither can fire while the database stays at schema version 1; they are groundwork for a future schema change, not a live protection.

### Architecture Diagram

```
 tab A (holds Web Lock "lowbridge-active-journey")      tab B
 ┌──────────────────────────────────────────────┐      ┌───────────────────────────┐
 │ ticker 1 s ─ settle() ─ GameEngine.advance()  │      │ lock not available →      │
 │        │                                      │      │ "open in another tab"     │
 │  makeSave() ─► persist() (one promise chain)  │      │ [Continue here] = reload  │
 │                    │                          │      └───────────────────────────┘
 │             SaveStore.write()                 │
 │   decodeSave(new) ✓                           │
 │   ┌─ readwrite transaction on "saves" ──────┐ │
 │   │ get current → decodeSave ✓ → put backup │ │
 │   │ put current = new                       │ │
 │   └─ commit → resolve ──────────────────────┘ │
 └──────────────────────────────────────────────┘
 load: decode current ── fails ──► decode backup ("recovered") ── fails ──► import / new journey
 import file ≤ 5 MB ─► decodeSave ─► replace engine ─► SaveStore.write
```

### Key Interfaces
- `SaveStore.open(): Promise<SaveStore>`; `load(records): Promise<{ decoded: DecodedSave | null; recovered: boolean }>`; `write(save, records): Promise<void>`; `close()`.
- `makeSave(state, records, savedAt): SaveFile` and `decodeSave(input, records): DecodedSave`, both in `src/persistence.ts`.
- Constants: `SAVE_FORMAT = 'lowbridge-save'`, `SAVE_VERSION = 7`, `DATABASE_NAME = 'lowbridge-first-slice'`; store `saves`; keys `current`, `backup`; lock name `lowbridge-active-journey`.

### Implementation Guidelines
- Every save that reaches IndexedDB must pass `decodeSave` first; there is no second decoder.
- `current` and `backup` must change only inside one `readwrite` transaction, and `backup` must only receive a save that decodes.
- A write must resolve on `oncomplete`, never on the last `put`.
- Writes must stay serialised through the one `persist` chain.
- The game must not tick or write without holding `lowbridge-active-journey`; a tab without the lock must never take it from the holder.
- Every engine action must call `settle()` before it touches the engine, and the saved time (`savedAt`) must be the time of the state written.
- An import, an unreadable slot or a new journey must never replace the running game or a slot before the player has chosen it and the decoder has accepted it.
- Do not rename `DATABASE_NAME`, the store or its keys without a migration, which this ADR does not provide.
- A content id must never be removed while a save could name it in `attuned`, `active`, `waiting`, `fight`, `hobby` or `effects`, since the decoder refuses those rather than skipping them; check removals against those fields before release (a `bun run validate` check is the intended follow-up).
- An export is not decoded today. Until it is, a change to `makeSave` or `decodeSave` must keep an export importable, and the follow-up is to pass every export through `decodeSave` before download.
- Per-browser UI preferences stay in `localStorage` and never in a save (ADR-0033).

## Alternatives Considered

### Alternative 1: One `localStorage` key, last writer wins
- **Description**: Serialise the save to one `localStorage` string on each write; any tab may write.
- **Pros**: Synchronous and simple; survives `pagehide` more reliably than an async write.
- **Cons**: No transaction, so no atomic pair of current and backup; a 5 MB-class quota shared with UI preferences; synchronous writes on the main thread every few seconds; two tabs silently overwrite each other's progress.
- **Rejection Reason**: It gives up both the recoverable backup (TR-save-002) and the single writer (TR-save-004).

### Alternative 2: Files in the Origin Private File System, with a BroadcastChannel takeover
- **Description**: Write `current` and `backup` as OPFS files; a new tab announces itself on a BroadcastChannel and the old tab stops and hands over.
- **Pros**: Larger quotas; a takeover lets the newest tab continue without closing the old one.
- **Cons**: No transaction across two files, so the pair could be left half-written; a takeover needs a handshake that must itself be correct when the old tab is frozen in the background; more code for a save that is a few hundred kilobytes.
- **Rejection Reason**: It replaces a transaction the browser guarantees with ordering the game would have to get right, for a size the save does not need.

### Alternative 3: Web Lock with takeover (`steal: true`)
- **Description**: Keep IndexedDB, but let "Continue here" steal the lock so the new tab runs at once.
- **Pros**: No need to find and close the old tab.
- **Cons**: The old tab keeps its in-memory engine and its ticker until it notices the loss, and could write once more over the new tab's save.
- **Rejection Reason**: Not taken now. The reload-to-retry button is enough for one player on one device; a takeover can be added later if the old tab is made to stop writing first.

## Consequences

### Positive
- A crash or a damaged write costs at most the newest save: the previous one is in `backup` and loads with a visible "Recovered" notice.
- A save the decoder would refuse can never be written, so an unreadable slot is one damaged outside the game or orphaned by a later content change.
- Two tabs cannot advance the same journey, so offline settlement never counts the same seconds twice.
- Import, load and write share one set of refusal rules, so a file that imports is a file that reloads. (The converse, that every export imports, is not yet guaranteed; see Risks.)

### Negative
- Every write decodes twice (the new save and the old `current`), which rebuilds an engine each time; cheap at today's content size, but it grows with content.
- A browser without Web Locks cannot play at all, by design.
- The legacy database name `lowbridge-first-slice` is now fixed.
- Saves exist only on the device; moving a journey means exporting it.

## Risks
- **The last write before close may be lost.** `pagehide` starts an asynchronous IndexedDB transaction that the browser may not finish. At most the seconds since the last write are lost (about 5 s, or the last action). Mitigation: the 5 s cadence and the write on `visibilitychange`, which fires before `pagehide` on most closes.
- **Backup recovery is untested.** No test drives `SaveStore` against a real or fake IndexedDB, so the `current`-fails-then-`backup` path rests on reading the code. Mitigation: add a browser smoke step that corrupts `current` and checks the "Recovered the previous save" status.
- **Both slots can fail together** if content changes so that neither decodes (for example, an id in `attuned` is removed). Mitigation: the Implementation Guideline on removed ids; the boot screen offers import and a confirmed new journey.
- **Silent eviction is not detected (accepted risk).** Storage is best-effort: nothing calls `navigator.storage.persist()`, so a browser under storage pressure may evict the database, and the next visit then starts a new journey with no warning. The status line only reports a failed `SaveStore.open()`, as in private browsing or a full quota, and asks for an export. Follow-up: request persistent storage, and say so when the browser declines.
- **An export may not import.** Export skips `decodeSave`, so a bug in `makeSave` could produce a file the decoder refuses, and the player would learn this only when importing it. Mitigation: the round-trip tests in `tests/persistence.test.ts` decode `makeSave` output. Follow-up: decode every export before download.

## GDD Requirements Addressed

| GDD System | Requirement | How This ADR Addresses It |
|------------|-------------|--------------------------|
| Save and persistence (`design/gdd/systems-index.md`; source `design/IMPLEMENTATION-PLAN-2026-10-18.md`) | TR-save-002: IndexedDB storage with a recoverable copy and atomic writes | §1–§3: two slots in one store, replaced in one transaction, loaded current-then-backup |
| Save and persistence (`design/IMPLEMENTATION-PLAN-2026-10-18.md`) | TR-save-003: export/import refusing malformed files and unknown resumable ids without disturbing the running game | §4–§5: one decoder for every way in; import replaces nothing until accepted |
| Save and persistence (`CLAUDE.md`, `src/main.ts`) | TR-save-004: one tab per profile | §6: the Web Lock `lowbridge-active-journey`, never stolen |
| Time and tempo (`design/IMPLEMENTATION-PLAN-2026-10-18.md`) | TR-time-007 (in part): elapsed-time settlement on return, `settle()` before every action | §6 and Implementation Guidelines: one writer means settlement runs once; `savedAt` is the time of the state written |

No system GDD exists; the requirement IDs are those registered in `docs/architecture/tr-registry.yaml`.

## Performance Implications
- **CPU**: Each write runs `decodeSave` twice, which builds a `GameEngine` and recomputes every derived field; at today's 223 records this is fast enough that no one has measured it, but it is the largest cost on the save path and should be measured if content grows severalfold.
- **Memory**: Two save copies in IndexedDB plus the in-memory snapshot; saves are sparse deltas, typically tens to a few hundred kilobytes.
- **Load Time**: One read transaction and one or two decodes at boot.
- **Network**: None.

## Migration Plan
None. This ADR records the code as it stands at commit 449ba2b. A future change to the database name, store, keys or lock name needs its own migration, which this ADR does not provide.

## Validation Criteria
- Existing: `tests/persistence.test.ts` covers the v7 round-trip, refusal of older formats, corrupt files refused before anything is replaced, departed ids skipped, shortened lengths held, and the hobby and effects refusals. `scripts/browser-smoke.ts` checks the second-tab message and that an outdated import is refused without changing the running game.
- To add: a smoke step that damages `current` and expects "Recovered the previous save" from `backup`.
- To add: a smoke step that checks a refused import leaves both slots unchanged.
- To add: a `bun run validate` check that no saved-and-resumed field could name a removed id, once a list of shipped ids exists to check against.

## Related
- ADR-0011 (browser platform), ADR-0021 (derived fields never saved), ADR-0025 (save versions refused by name), ADR-0026 and ADR-0032 (a fight saved mid-run with its room), ADR-0030 and ADR-0031 (save v7), ADR-0033 (UI preferences in `localStorage`).
- `docs/architecture/architecture-review-2026-10-29.md` (the review whose blocking issue this answers).
