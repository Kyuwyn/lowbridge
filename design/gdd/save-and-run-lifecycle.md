# Save and Run Lifecycle

> **Status**: Approved 2026-11-21 (lean review; findings in `design/gdd/reviews/save-and-run-lifecycle-review-log.md`)
> **Author**: designer + agents
> **Last Updated**: 2026-11-21
> **Last Verified**: 2026-11-21
> **Implements Pillar**: 4 (No dead ends, no attention tax); supports 2 (Methods matter) and 1 (The forge is the milestone)
> **Creative Director Review (CD-GDD-ALIGN)**: APPROVED 2026-11-21. Three non-blocking advisories, each carried into the GDD: frame `lastRun` as a comparison under the other method, never as a best to beat (UI Requirements 5); revisit the accepted save-scumming case if #16 or #19 add hidden information or chance (Open Question 8); prefer putting the persistent-storage request behind a settings action, so the first post-commit write is never interrupted (Open Question 6)

## Summary

Save and run lifecycle keeps the run in the browser and gives the MVP its one way to begin
again. It writes only non-derived state, each system's declared slice plus a small envelope,
after every action. On load it maps, drops or re-derives what a content update changed, and
refuses by name only what would alter the committed method or a forged Foundation. It then
settles the time away through the same `advance` as live play, so leaving costs nothing. A
confirmed new run clears everything a rule reads, so the other method can be tried, and keeps
one read-only line about the last forged run for comparison. A text copy of the save is the
player's own backup.

> **Quick reference** — Layer: `Feature` · Priority: `MVP` · Key deps: `Content records and schema, Modifier pipeline, Resources and caps, Activity slot, Forge and proving, Methods, Tending`

## Overview

Save and run lifecycle is the game's memory and its one way to begin again. It is a data layer
with three player-facing edges: coming back, a content update, and starting a new run.

**What it stores.** The save holds non-derived state only, keyed by stable ids (rule 9). It
holds each system's declared slice:

- `held` (#3);
- the slot's state and the high-water marks (#4);
- `committed` (#7);
- one forge snapshot per forged realm (#6);
- the tending choice (#10).

It also holds Save's own envelope: the format version, the content fingerprint the save was
written against (#1 R8.5), `lastSeen` and the last-run line. Caps, effective values, reveal
states, need text and everything else derivable are recomputed from content on every load and
never read from the save.

**How it loads.** Load runs one fixed pipeline:

1. It checks the format version.
2. It maps retired ids through the alias map.
3. It drops what content no longer has. It refuses by name only the cases that would change a
   forged Foundation or the committed method.
4. It rebuilds the effective set and re-clamps what the player holds.
5. It settles the time away through the Activity slot's own `advance` (#4).

A day away therefore gives exactly what a day watched would have.

**When it writes.** The save is written after every accepted player action, once after each
load, and on page hide. No timer is needed. Because `advance` composes, the saved state plus the
gap since `lastSeen` equals uninterrupted play. A crash can lose an action in flight, but never
time.

**What the player meets.**

- **Coming back.** The gap's events, which the Interface shell (#13) shows as the away summary.
- **A content update.** A notice when the fingerprint differs, with one line for each thing the
  load changed.
- **The fast new game.** It is the MVP's one redo and the way to try the other method. One
  confirmed action returns the run to its start. It keeps one read-only line about the last
  forged run (method, makeup, seals), which no rule reads. It is a test affordance, not a reset
  loop (concept, anti-pillars).
- **Export and import.** A text copy of the save, the only backup that survives cleared site
  data.

**Versioning.** Until the first public build, a save of another format version is refused by
name and a new run is offered. It is never deleted silently. From the first public build on,
a format change ships a migration, and saves are never wiped.

Without this system the game would lose pillar 4's promise that leaving costs nothing and
pillar 1's Foundation the player can point at after an update. In the MVP it would also lose
the only way to the second method (pillar 2).

## Player Fantasy

**Framing: indirect.** The player never meets the save file, the format version or the replay
of time. What they feel is that the run is theirs. One promise: **nothing you chose is quietly
edited, rewound or erased.**

- **Coming back.** The player closes the tab for a day. When they return, the slot has rendered
  exactly what Ash Tallow would have rendered had they watched. The log names what stopped it,
  and the held breath sits where the hours put it.
- **An update.** A build lands between sessions. One line says the game was updated, and one
  more line names each thing that touched their run. Their forged Foundation still reads the
  seals they earned, because it is a record, not a recomputation (#6 G10).
- **The other method.** They forged under Ember Breath and wonder about Still Water. A new run
  is one confirmed action, and its dialog says what it clears. The Ember Breath result stays on
  screen as one line to compare against, and nothing from it helps the new run.
- **A backup.** Before clearing browser data, they copy the save as text and later paste it
  back.

This serves:

- **Pillar 4**, *"No dead ends, no attention tax"*. Leaving costs nothing. A content update
  never strands a run: it re-derives what it can, and names what it refused with a new run
  offered. The redo is stated before it is taken.
- **Pillar 1**, *"The forge is the milestone"*. The forged Foundation survives every load as
  recorded.
- **Pillar 2**, *"Methods matter"*. In the MVP the second method is one decision away, with the
  first method's result kept in view for the comparison.
- **The anti-pillar** *"NOT a reset loop"*. Nothing a rule reads carries into the new run.

It sits beside its siblings' promises: "the plan holds" (#1), "every number can tell you why"
(#2), "the forge shapes the vessel that holds the next climb" (#3) and "when the work pauses,
breath fills the slot" (#4).

**Tone.**

- Player-facing text says "new run" (matching #7's redo line), "the game was updated", "copy
  save" and "load save".
- It never says "wipe", "reset", "prestige", "corrupt" or "migrate".
- A refusal says what it found and what the player can do.

*Specialist: `creative-director` consulted. It gave three framings ("the run is yours", "shut
the tab", "the Foundation keeps") and recommended the first, which was adopted with the
designer's last-run line (2026-11-21) in place of "the old run is not replaced".*

## Detailed Design

### Core Rules

Rules are numbered D1–D12 and formulas J1–J5, letters no other GDD uses.

#### D1. The save and its slices

1. The save is one record: Save's envelope plus each owner's declared slice (TD finding 6).
   Every value in it is non-derived. A value any system can recompute from content and the
   slices is never saved (rule 9; #2 P9.3).
2. **Envelope** (Save's own):
   - `format`: the save-format version, a positive integer starting at 1 (D11);
   - `fingerprint`: #1 R8.5's fingerprint of the content the record was written against;
   - `lastSeen`: the wall-clock time in ms that the state was advanced to (#4 S9.2);
   - `lastRun`: none, or the last forged run's display copy (D7).
3. **Slices:**

   | Slice | Owner | Saved | Run-start value |
   |---|---|---|---|
   | Holdings | #3 K2 | `held[id]` for every resource and ingredient | `min(start, cap)` per resource, 0 per ingredient (#3 K4) |
   | Slot | #4 S12 | The occupant (rest or a source id); the last stop reason; kept progress (non-zero entries only, S6.2); `t`; the bank `b`; a high-water mark per resource and ingredient | Rest; none; empty; 0; 0; marks equal to `held` (#4 S1.3, #1 F1) |
   | Method | #7 W12 | `committed`: a method id or none | None |
   | Forge | #6 G10 | One snapshot per forged realm, keyed by realm, with its entry list `F` | None |
   | Tending | #10 D9 | `heaped`: a sparse set of source ids, an absent id meaning unheaped | Empty |

4. **Explicit, not delta.** `held` and the marks are written for every id the content had at
   write time, even when they equal the run-start value. Only kept progress is sparse, and its
   absent value (0) does not depend on content. On load, an id that content has and the save
   lacks is new content and takes its run-start value (#3 Edge Cases, "Saves and runs"). A delta
   against content defaults would silently change saved amounts whenever an update moved `start`.
   Hundred Days' save shows the same trap from the other side: defaults kept outside the template
   (`research/hundred-days-reference/03-data-model-and-content.md` §6).
5. **Not saved:**
   - content, the frozen sets, effective values and trails (#1, #2);
   - caps, room and full (#3);
   - reveal and actionable states, and need text (#1 F7);
   - whether a source can run (#4);
   - plans, the viewed method and dialogs (#6, #7);
   - route states (#8 L9, #9);
   - the log and events (#13).

   No fight is ever saved mid-fight: a fight resolves at unit completion (#4 S4), and the
   resolver holds no state (#5).

#### D2. Writing

1. State and `lastSeen` are one record, with the state already advanced to `lastSeen`.
   `lastSeen` is never written alone.
2. **When the save is written:**
   - after every accepted player action: commit, start, stop, forge, a tending change, new run
     and import. Each action settles time to now, applies, then writes. A refused action writes
     nothing;
   - once after each successful load;
   - when the clock re-anchors backwards (#4 S9.2);
   - on page hide.

   There is no timer. By #4's composition law, the saved state plus the gap since `lastSeen`
   equals uninterrupted play. A lost write can therefore cost only the actions accepted after the
   last committed write, never time.
3. **Two slots.** A write makes the new record `current` and the old `current` the `backup`. The
   old record rotates only if it would load (it passes D3.3–D3.7), or if it was refused only
   because its format is newer (D11). Otherwise `backup` is kept. After any interruption, at
   least one slot holds a readable record no older than the previous committed write.
4. **One write in flight.** A newer write replaces a queued one. A failed write never rolls play
   back, and the next action retries. The shell shows a persistent "Not saving" notice with Copy
   save (D9) after `WRITE_FAIL_PROMPT` consecutive failures, or at once when the failed write
   followed a commit or a forge (J5). A new run and an import are the exception: they write
   before they switch (D6.2, D9.2).
5. **Never write over** a load error (#1) or a refused save. A refused record stays in storage
   until the player confirms a new run, or an import whose dialog says it replaces that record.

#### D3. Loading

The order is fixed, and each step reads only the output of earlier steps.

1. Take the tab lock (D8).
2. Load content (#1 R8.1). On a load error, show the error screen, make no `advance` and no
   write, and stop.
3. Read `current`.
   - If neither slot holds a record, this is the first game: a run start (D6.1).
   - If `current` cannot be parsed or fails its integrity check (a checksum over the record; the
     method is an ADR), read `backup` and add the notice line "Your last save could not be read;
     the one before it was loaded." A record that parses and passes its checksum but fails D4.1
     is refused, not swapped for `backup`, because it was written that way.
   - If both fail, refuse.
4. Check `format` (D11, J2). If it is equal, go on. Otherwise migrate or refuse. A missing or
   malformed `format` is refused as a shape failure (D4.1).
5. Check the shape (D4.1). On failure, refuse, naming the field.
6. Rewrite every id through the alias map (#1 R2.3).
7. Check consistency (D4.2). On failure, refuse.
8. Drop and re-derive (D5). Each change adds a notice line.
   - Drop departed ids from `held`, the marks and kept progress.
   - Drop each `F` entry whose target record, field or key is gone, or that raises the cap of a
     store that is now a key item (#2 Edge Cases, #6 Edge Cases).
   - With no method committed, reset every resource's `held` and mark to their run-start values
     (#7 Edge Cases, amended A2).
   - Drop each `heaped` id that does not name a tendable source of the committed frozen set
     (#10 D9). Before the commit no source is tendable, so `heaped` empties. A save is never
     refused for a `heaped` id.
9. Recompute: `effective(set_m, F, T)` from `committed`, the snapshot's `F` and the `T` that #10
   D3 builds from `heaped` (#2 P9). Before the commit, this is the base content.
10. New content: each resource or ingredient the save lacks takes its run-start value under the
    effective cap (#3).
11. Re-clamp `held` to the effective caps (#3 K5). Emit `overflow` with cause `cap` once per id
    that spilled, and no `capChanged`. A mark above its cap keeps its value. A mark below `held`
    is raised to `held`.
12. Normalise the slot (#4 Edge Cases):
    - an occupant whose id is unknown after step 8 becomes rest, with reason `withdrawn`;
    - a known occupant that is no longer offered is stopped by #4's segment-start check (S5) at
      the gap's first instant, with the same result;
    - kept progress with `p ≥ D′` becomes `D′ − 1`;
    - a bank above `BANK_CAP` becomes `BANK_CAP`;
    - `t` is kept as saved.
13. Gap. `advance` the state by J1's gap, then set `lastSeen` to now.
    - The gap is one segment: no player acts during it, and `heaped` changes only by an
      accepted `setHeap` (#10 D5). If a later system adds a boundary inside the gap, the gap runs
      as consecutive segments with a recompute between them until it is spent (#4 S9.5).
    - The gap's events are the away summary (#13).
14. Notice. If the fingerprint differs, show the line "The game was updated". Then show:
    - the lines from steps 3, 6, 8, 10, 11 and 12;
    - the dropped-`lastRun` line (D7.3);
    - a known occupant that step 13 stopped at the gap's first instant.

    If the fingerprint is equal and there is no line, show no notice.
15. Write once (D2), then hand the state, the notice and the away summary to the shell.

#### D4. Checks on a record

1. **Shape.** On any failure the save is refused, naming the field:
   - every number is a safe integer;
   - `held`, the marks, `t` and `b` are at least 0;
   - every kept-progress entry is above 0;
   - every id matches #1's pattern (R2.1);
   - the occupant is rest or an id;
   - the stop reason is none or one of #4's six;
   - `committed` is none or an id;
   - each snapshot has every G10 field and no other;
   - `format` is a positive safe integer, checked first (D3.4);
   - `lastSeen` is a safe integer of at least 0.

   Three cases never refuse:
   - a malformed `fingerprint` counts as a mismatch (D3.14);
   - a malformed `lastRun` drops the line (D7.3);
   - an unknown field outside a snapshot is dropped with a log line, not a notice line.
2. **Consistency.** The save is refused if:
   - `committed` is unknown after aliasing (#7 Edge Cases);
   - no method is committed, and the save holds any kept progress, a source in the slot, a
     snapshot, or an ingredient held or marked above 0 (#7 Edge Cases, amended A2);
   - a snapshot's method differs from `committed` (#6 and #7 Edge Cases);
   - a snapshot names a realm, method, door, affinity or ingredient that is unknown after
     aliasing (#6 Edge Cases). Amendment A6 to #1 makes this unreachable from shipped content.
3. **Principle.** Refuse only when an id pins the run's identity (the committed method or the
   forged Foundation), or when the record cannot have come from play. Everything that can be
   re-derived is mapped, dropped, clamped or re-derived instead. The archived attempt refused on
   departed ids and made whole saves unloadable (`.ai/docs/issues.md`, ISS-005).

#### D5. Map, drop, clamp, re-derive or refuse

| Found on load | Outcome | Owner of the case |
|---|---|---|
| A retired id with an alias | Mapped; notice line | #1 |
| `held`, a mark or kept progress for an id content lacks | Dropped; notice line | #1, #3, #4 |
| An `F` entry naming a missing record, field or key, or raising a key item's cap | Dropped; notice line. The snapshot's stats, door scores, tiers and seals stay as recorded | #2, #6 |
| A resource or ingredient the save lacks | Run-start value | #3 |
| No method committed, and a resource's `held` or mark differs from the run start | Reset to the run start | #7 (A2) |
| `held` above its effective cap | Re-clamped; `overflow` with cause `cap` | #3 K5 |
| A mark below `held` | Raised to `held` (#1 F1's postcondition) | #1 |
| Kept progress `p ≥ D′`; a bank above `BANK_CAP` | `D′ − 1`; `BANK_CAP` | #4 |
| An unknown occupant | Rest, reason `withdrawn` | #4 |
| `lastRun` naming an unknown id | The line is dropped; notice line | This GDD (D7) |
| Both slots unreadable (D3.3); another format (D3.4); a D4.1 or D4.2 failure | **Refused.** The screen names what was found and offers New run, Copy save and Load save. Nothing is written | This GDD, #6, #7 |

#### D6. Run start and the fast new game

1. **Run start** builds one state from content: every slice at its D1.3 run-start value, and
   `lastSeen` at now. It serves the first game, every new run, and a refusal that the player
   resolves with New run. The road is in Choosing (#8, #9), and the realm is in Planning only
   (#6).
2. **New run** (`newRun()`) is accepted whenever the rules accept actions, before or after the
   commit or the forge.
   - One dialog names what it clears: the committed method, the forged Foundation if any,
     everything held, kept progress and held breath.
   - On confirm, time settles to now and one record is written: the run start, with `lastRun`
     updated (D7).
   - The tab switches to the new run only once that write has committed. It switches at once,
     without a reload.
   - If the write fails, the old run stays, with "Could not start a new run" and Copy save.
   - Cancel changes nothing.
3. **Not a reset loop.** No resource, cap, mark, bank, time, method or Foundation carries into
   the new run. The bank restarts at 0, so an old run never speeds up a new one. Only `lastRun`
   survives, and no rule reads it.

#### D7. The last-run line

1. On a new run, if the run being cleared holds a snapshot, `lastRun` becomes its display copy:
   the realm, method, makeup, each door's tier, and the seals. A run cleared before its forge
   leaves `lastRun` unchanged. There is one entry, and a later forged run replaces it.
2. No rule reads `lastRun`: not a gate, the pipeline, the forge or the validator. Only the
   interface shows it (#13, #15).
3. On load, its ids go through the alias map. An unknown id drops the line (D5). It is never a
   reason to refuse.

#### D8. One tab

1. One tab plays a save at a time; #6 and #7 rely on this. The tab takes the lock before reading
   the save.
2. A tab without the lock reads, advances and writes nothing. It shows "The game is open in
   another tab", with **Use here**.
3. Use here takes the lock.
   - The other tab at once accepts no action and writes nothing. A write from a tab that has lost
     the lock is refused.
   - That tab shows "The game moved to another tab".
   - After Use here, `current` changes only through the new holder. A write from the old tab
     either committed before the new tab read the save, or is refused.
   - The take-over loses at most the one action whose write was still in flight. Every earlier
     action was written (D2), and time replays from `lastSeen`.
4. A browser with no lock support does not start the game, and says why.

#### D9. Export and import

1. **Copy save** puts the save as text where the player can copy it. It writes nothing.
   - During play, it serializes the tab's state settled to now, so the copy is current even when
     writes are failing.
   - On a refusal or storage screen, it copies the stored record unchanged.
2. **Load save** takes pasted text up to `IMPORT_MAX_BYTES`.
   - Text that does not parse as a record is refused as "This is not a save" and changes
     nothing. No integrity check runs on pasted text: the checksum guards storage (D3.3), and
     only D4 catches hand edits (D9.3).
   - A record that parses runs D3.4–D3.12 as a dry run. A refusal shows the reason and changes
     nothing.
   - A loadable record shows a confirm that names what it replaces.
   - On confirm, D3.13–D3.15 run. The imported run's gap since its own `lastSeen` is played as
     away time. The record is written, and the old `current` rotates to `backup` (D2.3).
   - The tab switches to the imported run only once that write has committed. If it fails, the
     current run stays, with "Could not load this save" and Copy save.
3. Import replaces the whole save, `lastRun` included, and never merges. The text is plain, and
   only D4 catches hand edits. There is one player and no leaderboard, as with #4's clock rule.

#### D10. Storage that may not keep the save

1. At boot, after the lock, the game checks that storage can hold a record. If it cannot
   (storage is blocked, or the window is private and keeps storage for the session only), play
   goes on. A persistent notice reads "This browser is not keeping your save", with Copy save.
2. After the first write that follows the commit, the game asks the browser once to keep its
   storage. A refusal changes nothing but one log line pointing to Copy save.

#### D11. Versioning and migration

1. `format` rises when the meaning or layout of a saved value changes, including when a slice is
   added or removed. A content change never raises it: ids go through the alias map, and values
   through the fingerprint and D3's re-derivation.
2. **Before the first public build** (designer, 2026-11-21; #1 Open Question 4): a record of any
   other format is refused by name, "This save is from an older test build" or "This save is
   from a newer build". It is replaced only by a confirmed new run or import (D2.5). The alias
   map stays empty, and renames are free.
3. **From the first public build on,** that build's format is `F_pub`.
   - A record with `F_pub ≤ v < format` passes through pure migrations v → v+1 in order. Each
     migration is tested on a fixture save.
   - A record with `v < F_pub` or `v > format` is refused by name. It is replaced only by a
     confirmed new run or import (D2.5), and a newer-format record then rotates into `backup`
     (D2.3).
4. **Three channels, never mixed:** `format` for layout, the alias map for ids, and the
   fingerprint for content. The fingerprint gives a notice and is never a lock (#1 R8.5).
5. **Alias rules.** This GDD owns them, and the Validator (#12) checks them against the
   retired-id list, which starts from the first public build's ids.
   - An alias is a rename. Its target must not have been live in any shipped content where its
     source was live, so two saved ids can never merge into one.
   - #1's rules on chains, cycles, missing targets, types and live sources apply as load errors.

#### D12. State, actions and events (TD finding 6)

- **Non-derived state owned:** the envelope (`format`, `fingerprint`, `lastSeen`, `lastRun`).
  Save composes every other slice and owns none of their fields.
- **Actions accepted:** `newRun()` and `importSave(text)`, each confirmed; `copySave()`;
  `useHere()`.
- **Events emitted** (payloads go to an ADR with #13's channel):
  - `saveLoaded {notice, recovered}`. The away summary is the load `advance`'s own #4 events;
  - `saveRefused {reason, found}`;
  - `newRunStarted {}`;
  - `saveFailing {count}`;
  - `tabSuperseded {}`.

### States and Transitions

**A tab's save session:**

| State | Holds when | The screen |
|---|---|---|
| Locking | Boot, before the lock | Nothing playable |
| Elsewhere | Another tab holds the lock | "The game is open in another tab", Use here |
| Loading | The lock is held and D3 is running | Nothing playable |
| Content error | #1 load error | #1's error screen; no write |
| Refused | D3 refused | What was found; New run, Copy save, Load save |
| Playing | Loaded or started | The game; writes per D2 |
| Superseded | Another tab used Use here | "The game moved to another tab"; inert |

| From | Trigger | To |
|---|---|---|
| Locking | The lock is taken / unavailable | Loading / Elsewhere |
| Elsewhere | Use here | Loading |
| Loading | Loaded, or no record (a run start) / refused / a content error | Playing / Refused / Content error |
| Refused | New run confirmed, or Load save of a loadable record | Playing |
| Playing | New run or import confirmed | Playing, with the new state |
| Playing | Another tab's Use here | Superseded |
| Superseded, Content error | Page reload | Locking |

**The run.** Its phase is derived from the slices, and mirrors #6 and #7:

| Phase | Holds when |
|---|---|
| Choosing | `committed` is none |
| Committed | A method is committed, and there is no snapshot |
| Forged | The realm has a snapshot |

| Transition | Trigger | Reversible? |
|---|---|---|
| Choosing → Committed | The commit (#7) | Not in the MVP |
| Committed → Forged | The forge (#6) | Not in the MVP; a reforge (#16) replaces the snapshot |
| Any → Choosing | A new run (D6) | — |
| Any → the imported record's phase | An import (D9) | — |

### Interactions with Other Systems

| # | System | Gives this system | Gets from this system | Interface owner |
|---|---|---|---|---|
| 1 | Content records and schema | The loader, ids and their pattern, the fingerprint, the alias map's load errors, the retired-id list | The alias map's rename rule (D11.5); the answer to Open Question 4 (D11.2); amendment A6 | #1 owns ids and loading; this GDD owns the alias map and when ids freeze |
| 2 | Modifier pipeline | `effective(set_m, F, T)` | The saved inputs on load; stale `F` entries dropped before P3 | #2 |
| 3 | Resources and caps | Run start (K4); the re-clamp (K5) | `held` saved for every id; new ids initialised; the re-clamp run on load before marks are read | #3 owns the clamp; this GDD decides when it runs |
| 4 | Activity slot | The slot slice (S12); run start (S1.3); `advance` and its segment-start check (S5) | `lastSeen`; the gap on load; the rules for an unknown occupant, progress and the bank; the segment loop over the gap | #4 owns `advance`; this GDD owns `lastSeen` and the load call |
| 5 | Combat resolver | — | Nothing: no fight is saved mid-fight | — |
| 6 | Forge and proving | The snapshot (G10) | Its storage; `F` drops; the refusal rules; its clearing on a new run; the `lastRun` copy | #6 owns the snapshot's content |
| 7 | Methods | `committed` (W12) | Its storage; its reset to none in the new-run write; the refusals; amendment A2 | #7 |
| 8, 9 | Crafting route; Fight and dungeon routes | Nothing saved (#8 L9; #9) | A new run returns the road to Choosing | — |
| 10 | Tending | The `heaped` slice (#10 D9) | Its storage; its emptying at run start; dropping ids that are no longer tendable on load, with the notice line (D3.8) | #10 owns the set and the rule that only `setHeap` changes it |
| 12 | Validator | — | D11.5's alias check; the retired-id list's baseline; the migration fixtures | #12 runs the checks; this GDD defines them |
| 13, 15 | Interface shell; Forge screen | — | The away summary, notices, refusal screen, new-run dialog, `lastRun`, Copy save and Load save, and the storage and tab screens; the D12 events | They own the display |
| 16, 19 | Reforge (VS); Realm ladder (Alpha) | A replaced snapshot; more realms | D4.2's rule that a snapshot's method equals `committed`, which a post-commit switch must amend; snapshots keyed by realm | They amend D4.2 and D7 |

*Specialists: `systems-designer` (primary), `gameplay-programmer` and `engine-programmer`
(supporting) were consulted. Adopted from them:*

- *no timer;*
- *explicit `held` and marks, with sparse progress;*
- *the refuse principle;*
- *two-slot rotation guarded by D4.1;*
- *the take-over write fence;*
- *the storage probe;*
- *Copy save serializing live state.*

*They found four conflicts between the inputs, each resolved here:*

- *doors and affinities retired without an alias (A6 to #1);*
- *resources before the commit (A2 to #7);*
- *`F` drops against the recorded snapshot (D5: drop the lines, keep the record);*
- *alias merges (D11.5).*

## Formulas

This system sets no balance numbers. Its formulas fix what load does to time, versions and
saved values. All values are integers (#1 R7.1).

### J1. Load gap

The load_gap formula is defined as:

`gap = min(max(0, now − lastSeen), DT_MAX)`, then `lastSeen := now`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| now | int | 0 to 2⁵³ − 1 | calculated | Wall-clock ms, sampled once per load and floored to an integer (the clock source is #4's ADR 2) |
| lastSeen | int | 0 to 2⁵³ − 1 | saved (envelope) | The ms the saved state was advanced to |
| DT_MAX | int | 2⁵⁰ | constant (#4) | The largest *dt* `advance` accepts (#4 S9.2) |
| gap | int | 0 to DT_MAX | calculated | Real ms passed to #4's `advance` (D3.13) |

**Output Range:** 0 to DT_MAX. The state stops changing once the gap passes `AWAY_CAP` + the
longest unit + `BANK_CAP` (about 49 hours, #4 S9.2), so a week away gives the same state as two
days. A gap of 0 still calls `advance(s, 0)`, which runs S5's segment-start check (#4 S9.6).
**Example:** `lastSeen` 1,000,000 and now 4,600,000 give a gap of 3,600,000 (one hour). With now
at 900,000 (the clock went back), the gap is 0, `lastSeen` becomes 900,000, and the save is
written (D2.2).

### J2. Format decision

The format_action formula is defined as:

`formatAction(v)` =
- `load` if v = `SAVE_FORMAT`;
- `migrate(SAVE_FORMAT − v)` if `F_pub` ≠ none and `F_pub` ≤ v < `SAVE_FORMAT`;
- `refuseOlder` in any other case with v < `SAVE_FORMAT`;
- `refuseNewer` if v > `SAVE_FORMAT`.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| v | int | ≥ 1 | saved (envelope) | The record's `format`. A missing or malformed value never reaches J2: D4.1 refuses it |
| SAVE_FORMAT | int | ≥ 1; 1 in the first build | constant (build) | This build's format (D11.1) |
| F_pub | int or none | none, or 1 to `SAVE_FORMAT` | constant (build) | The first public build's format; none before that build (D11.2, D11.3) |

**Output Range:** one of four actions. A migration takes 1 to `SAVE_FORMAT` − `F_pub` steps, each
a pure v → v+1 function.
**Example:** before the first public build, with `SAVE_FORMAT` 3: v 3 loads, v 2 is refused as
older and v 4 as newer. With `F_pub` 3 and `SAVE_FORMAT` 5: v 4 migrates one step, v 3 two steps,
v 2 is refused as older, and v 6 as newer.

### J3. Run-start values

The run_start formula is defined as:

`held0[r] = min(start[r], cap[r])` for each resource r; `held0[i] = 0` for each ingredient i;
`mark0[id] = held0[id]`. The occupant is rest, with no stop reason, no kept progress, *t* 0,
*b* 0, `committed` none and no snapshot.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| start[r] | int | 0 to the base cap | data file (#3) | The resource's authored start |
| cap[r] | int | 1 to 10⁹ | calculated | The **base** cap at run start (D6.1) and at the pre-commit reset (D3.8), where D4.2 rules out any Foundation. The **effective** cap from D3.9 for new content (D3.10) |
| held0, mark0 | int | 0 to cap | calculated | The run-start amount and mark (#3 K4, #1 F1) |

**Output Range:** 0 to cap.
**Example:** every MVP resource starts at 0 (#3 K1), so a run starts with Ash Tallow at 0 of 40
and its mark at 0. In a fixture where an update moves a start from 1 to 2 before the commit,
D3.8 resets that resource's `held` and mark to 2. A start of 5 against a cap of 3 gives 3.

### J4. Load clamps

The load_clamp formula is defined as:

`p′ = min(p, D′ − 1)`; `b′ = min(b, BANK_CAP)`; `held′ = min(held, cap_eff)` with
`spill = held − held′`; `mark′ = max(mark, held′)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| p | int | ≥ 1 | saved | One source's kept progress, in activity ms |
| D′ | int | ≥ 1,000 | calculated (D3.9) | That source's effective duration, tended if tending is on; at least `UNIT_FLOOR_MS` by #4 T1 |
| b | int | ≥ 0 | saved | The rest bank |
| BANK_CAP | int | 1,800,000 | constant (#4) | |
| held | int | ≥ 0 | saved | |
| cap_eff | int | 1 to 10⁹ | calculated (D3.9) | The effective cap; 1 for an ingredient or a key item |
| mark | int | ≥ 0 | saved | The high-water mark |

**Output Range:**
- p′ is 1 to D′ − 1, and never 0, since D′ ≥ 1,000.
- b′ is 0 to `BANK_CAP`.
- held′ is 0 to cap_eff. Each spill above 0 emits one `overflow` with cause `cap` (#3 K5).
- mark′ ≥ held′, which keeps #1 F1's postcondition.

**Example:** p 5,000 with D′ 3,000 becomes 2,999 (#4 AC-L-1), and p 1,000 stays 1,000. A bank of
2,000,000 becomes 1,800,000. `held` 48 against a cap of 44 becomes 44 with a spill of 4, and the
mark stays 48 (#3 AC-X-3).

### J5. Write-failure counter

The write_fail formula is defined as:

`n := n + 1` on a failed write attempt; `n := 0` on a committed write. "Not saving" shows when
`n ≥ WRITE_FAIL_PROMPT`, or at once if the failed write followed a commit or a forge, and clears
on the next committed write.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| n | int | ≥ 0 | calculated, not saved | Failed attempts in a row. A write replaced by a newer one (D2.4) or refused by the fence (D8.3) is not an attempt |
| WRITE_FAIL_PROMPT | int | 3 (safe 1–10) | constant (tuning) | Failures before the notice |

**Output Range:** the notice is shown or not. A new run and an import never use n, because they
commit before switching (D6.2, D9.2).
**Example:** three Starts whose writes fail show the notice on the third. A commit whose write
fails shows it at once.

*Specialist: `systems-designer` reviewed J1–J5 and the Edge Cases. Its fixes were applied: `now`
is sampled once; a gap of 0 still advances; a malformed `format` is a shape failure; J3 uses the
base cap before the recompute; D′ is the effective tended duration; J5 counts attempts only and
fires at once after a commit or forge. Its seven corrections to D2–D11 were approved by the
designer on 2026-11-21 and applied there.*

## Edge Cases

Each case states its outcome. Cases owned by another system cite it. This GDD only applies them
on load.

### Time and the clock

- **If `lastSeen` is later than now**: the gap is 0, `lastSeen` re-anchors to now, and the save
  is written (J1, D2.2).
- **If the system clock jumped forward between sessions**: the gap counts as real time. It gains
  at most one run up to `AWAY_CAP` and a full bank, like an honest absence of that length (#4).
- **If the player reloads at once**: a gap of 0 runs `advance(s, 0)`, which completes nothing.
  The notice still shows if the fingerprint differs.
- **If the page-hide write never commits** (a killed tab): the next load replays from the last
  committed write. The away summary then also covers time the player watched without acting. The
  state is identical either way, by the composition law.

### Storage and writes

- **If `current` is unreadable and `backup` is readable**: `backup` loads, with its notice line
  (D3.3). Every action since `backup`'s write is lost, which is every action coalesced into the
  last write (D2.4).
- **If both slots are unreadable**: the save is refused. The screen offers each raw record to
  Copy save, plus New run.
- **If a write fails, or storage is over quota**: play goes on, and J5 decides when "Not saving"
  shows.
- **If storage is blocked or keeps data for the session only**: D10.1.
- **If the browser or the player cleared site data between sessions**: there is no record, so
  this is a first game (D3.3). Only an imported copy recovers it.
- **If the page hides while the tab is Refused, Elsewhere, Superseded or showing a content
  error**: nothing is written (D2.5, D8.2).

### Versions and content updates

- **If a record has an older format before the first public build**: it is refused with "This
  save is from an older test build", offering New run, Copy save and Load save (D11.2).
- **If a record has a newer format** (an older cached build opened it): it is refused with "This
  save is from a newer build". It is replaced only by a confirmed New run, and is then kept as
  `backup` (D2.3).
- **If only text changed** (`desc`, `flavor`): the fingerprint differs, and the notice is the
  single line "The game was updated" (D3.14).
- **If the running source was removed**: the slot rests with reason `withdrawn` before the gap,
  so the gap fills the bank (#4 Edge Cases).
- **If the running source was disabled, or its `need` raised**: #4's S5 check stops it at the
  gap's first instant, with the same result.
- **If a base cap fell under `held`**: J4's re-clamp applies (#3 AC-X-3).
- **If an `F` entry's target is gone, or its store became a key item**: the entry is dropped, so
  that cap reverts to its base. The recorded seals and tiers stay (D5).
- **If a door's opponent or thresholds changed**: the snapshot's tiers and seals stay as recorded
  (#6 AC-G10-1).
- **If a duration shortened under kept progress**: J4's p′.
- **If a resource was added or removed**: it takes its run-start value, or it is dropped (D5).

### Runs, export and import

- **If the player starts a new run mid-activity**: time settles first, then the confirmed write
  replaces the run (D6.2).
- **If the player starts a new run before forging**: `lastRun` is unchanged (D7.1).
- **If the player starts two new runs in a row**: the second gives the same run start, and
  `lastRun` is unchanged.
- **If a new-run or import write fails**: the old run stays, with the message and Copy save (D6.2,
  D9.2).
- **If pasted text carries whitespace or a byte-order mark**: ASCII whitespace and a leading BOM
  are trimmed, and then UTF-8 bytes are counted. Exactly `IMPORT_MAX_BYTES` loads, and one byte
  more is refused with nothing changed.
- **If the imported `lastSeen` is later than now** (another device's clock): the gap is 0.
- **If the imported `lastSeen` is very old**: J1 and #4's caps bound the gain, as for an absence.
- **If the same save is imported twice**: each import replaces the save, and the result is the
  same, because the replay is deterministic and nothing merges.

### Tabs

- **If two tabs open**: the second is Elsewhere (D8.2).
- **If Use here lands while the old tab's write is in flight**: that write either committed
  before the read, or is refused (D8.3). At most that one action is lost.
- **If a frozen background tab holds the lock**: Use here is the only way to play, and it works.

### Damaged or hand-edited records

- **If a value is negative or not a safe integer**: the save is refused, naming the field (D4.1,
  #3 Edge Cases).
- **If `held` is above its mark**: the mark is raised to `held` (J4).
- **If `committed` is unknown, or a snapshot's method differs from it**: the save is refused
  (D4.2).
- **If a record has unknown fields**: they are dropped and logged, except inside a snapshot,
  where the save is refused (D4.1).

### Degenerate strategies

- **Copy save before the forge, forge, then load the copy** (save-scumming): accepted. The forge
  preview already shows the seals of any held makeup (#6 G7), and fights are deterministic (#5),
  so loading the copy reveals nothing new. It costs only the player's own time.
- **New-run loops**: nothing a rule reads carries over (D6.3), so a loop gains nothing.
- **Closing the tab to pause**: away time equals live time, so closing is neither a pause nor a
  gain.
- **Clock manipulation**: capped by `AWAY_CAP` and `BANK_CAP`. There is one player and no
  leaderboard (#4 Edge Cases).

*Specialist: `systems-designer` reviewed this section. It added the cases for page hide outside
Playing, import trimming and size, both slots unreadable, a very old imported `lastSeen` and
extra snapshot fields, and corrected the backup-loss case.*

## Dependencies

**Upstream (this system depends on):**

| System | Nature | What this system needs |
|---|---|---|
| Content records and schema (#1) | Hard | The loader and its load errors (R8.1); the id pattern (R2.1); the fingerprint (R8.5); the alias map's load-error rules and the retired-id list (R2.3, Edge Cases) |
| Modifier pipeline and recompute (#2) | Hard | `effective(set_m, F, T)` as a pure function (P9); P3's legality, which stale `F` entries must never reach |
| Resources and caps (#3) | Hard | `held` as non-derived state (K2); run start (K4); the re-clamp (K5) |
| Activity slot, rest and away time (#4) | Hard | The slot slice (S12); run start (S1.3); `advance`, its composition law, its segment-start check and `advance(s, 0)` (S9); `DT_MAX` and `BANK_CAP` |
| Forge and proving (#6) | Hard | The forge snapshot and its fields (G10) |
| Methods (#7) | Hard | `committed` (W12) and its save cases (Edge Cases, amended A2) |
| Tending (#10) | Hard | The `heaped` slice, empty at run start (D9); the rule that only an accepted `setHeap` changes it (D5) |
| Crafting route (#8); Fight and dungeon routes (#9) | Soft | Nothing saved (#8 L9, #9); the road's Choosing state after a new run |

**Downstream (depend on this system):**

| System | Nature | What it needs from this system |
|---|---|---|
| Content validator (#12) | Hard | D11.5's alias rule; the retired-id list from the first public build on; one fixture save per migration (D11.3) |
| Interface shell (#13) | Hard | The D12 events; the away summary and the notice; the refusal, Elsewhere, Superseded, Not-saving and not-keeping screens; the new-run dialog; Copy save and Load save |
| Forge screen (#15) | Soft | `lastRun`, shown beside the current forge |
| Reforge and post-commit method switch (#16, VS) | Hard | D4.2's rule that a snapshot's method equals `committed`, and D6 and D7, which a post-commit switch must amend |
| Realm ladder (#19, Alpha) | Hard | Snapshots keyed by realm (D1.3). `lastRun` holds one forged run, so a multi-realm run must say which realm it copies (D7) |
| Every state owner (#3, #4, #6, #7, #10) | Hard | Each declared slice is saved, loaded and reset by D1–D6. A new slice raises `format` (D11.1) |

**Bidirectionality.**

- **#1, #2, #3, #4, #6, #7, #8 and #9** each already list Save and run lifecycle (#11) in their
  Dependencies.
- **#5** saves nothing, so it is not a dependency (Interactions row 5).
- **#10** lists Save and run lifecycle in its Dependencies (`tending.md` Dependencies, row 11).
- **#12, #13, #15, #16 and #19** are undesigned. Each must list "depends on: Save and run
  lifecycle" in its own Dependencies.
- **Systems index.** Row #11's Depends On gains Modifier pipeline and Tending. Rows #12, #13 and
  #15 gain Save and run lifecycle. This GDD's index update makes these edits.

## Tuning Knobs

| Knob | Value | Safe range | Affects | Too low | Too high |
|---|---|---|---|---|---|
| `WRITE_FAIL_PROMPT` | 3 | 1–10 | How soon "Not saving" shows after ordinary failed writes (J5) | At 1, one transient failure shows it, which teaches the player to ignore it | Above 10, an idle game may never show it. A failed commit or forge still shows it at once |
| `IMPORT_MAX_BYTES` | 1,048,576 (1 MiB) | `SAVE_MAX_BYTES` to 5,242,880 | The largest text Load save accepts (D9.2) | Below `SAVE_MAX_BYTES`, a real save could not be loaded back | Parsing a multi-megabyte paste blocks the main thread |
| `SAVE_MAX_BYTES` | 65,536 (64 KiB), provisional | 16,384–262,144 | The largest record a build may write, checked by a test on the largest fixture save. The engine-programmer's estimate for the MVP is 6–10 KB | Legal content fails the test | The write budget (Game Feel) stops holding |

- **Interaction:** `IMPORT_MAX_BYTES` must stay at or above `SAVE_MAX_BYTES`.
- **Not knobs:** `SAVE_FORMAT` and `F_pub` are version constants the build sets (D11). They are
  never tuned.
- **Owned elsewhere and not duplicated here:** `DT_MAX`, `BANK_CAP` and `AWAY_CAP` (#4).

## Visual/Audio Requirements

Visual/Audio is optional for a Persistence system, and this system adds none of its own: no art,
and no audio (the game has no audio system). Every screen it needs belongs to the Interface shell
(#13), and follows the concept's Visual Identity Anchor: type, colour, layout and simple glyphs.

- Notices and refusals are text.
- A refusal never relies on an alarm colour alone (glyph before hue, systems index #18).

## Game Feel

- **Writes are silent.** There is no per-write "Saved" flash. Only failures surface (J5), so the
  player never has to watch the save (pillar 4).
- **Load to playable.** The whole of D3, including the gap's `advance`, fits the boot budget that
  an ADR fixes with #1's ADR 9 and #4's ADR 5. The provisional target is 250 ms for the largest
  MVP fixture save with a 49-hour gap.
- **A write never blocks input.** Serialising takes at most 2 ms of main-thread time at
  `SAVE_MAX_BYTES` (engine-programmer, provisional), and the commit runs off the input path.
- **New run and import switch only once the write has committed.** The dialog shows a busy state
  until then, and storage latency is the only wait.

## UI Requirements

All layout belongs to the Interface shell (#13) and the Forge screen (#15). This GDD fixes their
content and rules.

1. **Refusal screen.** It says in plain words what was found: an older test build, a newer
   build, or a damaged save, naming the field. It offers New run, Copy save and Load save.
2. **Elsewhere screen.** One line, plus Use here. **Superseded screen:** one line, with no
   actions.
3. **Load notice.** "The game was updated", plus one line per change (D3.14). It is shown once,
   can be dismissed, and is copied to the log.
4. **New-run dialog.** It is reachable from the menu at any time. It names what it clears, by
   name: the method, and the Foundation and its seals if the realm is forged. It echoes #7's redo
   line. It offers Confirm and Cancel.
5. **The last-run line.** The realm, the method (with #14's mark), the makeup's names, each
   door's tier and the seals. It is read-only, and is shown on the Forge screen (#15). It is
   framed as a comparison under the other method (pillar 2), never as a previous best to beat
   (CD-GDD-ALIGN).
6. **Copy save and Load save.** They are in the menu, on the refusal screens and on both banners.
   Load save uses a text area, shows a size error over `IMPORT_MAX_BYTES`, and its confirm names
   the run it replaces.
7. **Persistent banners.** "Not saving" and "This browser is not keeping your save", each with
   Copy save.
8. **Accessibility.** All of these are text with status or alert roles, are used by tap with no
   hover, and fit phone width (rule 67).

> **📌 UX Flag — Save and run lifecycle**: this system has UI requirements. When `/ux-design`
> writes the Interface shell (#13) spec, it must cover items 1–4 and 6–8. The Forge screen (#15)
> spec must cover item 5. Stories that touch these screens cite the UX specs, not this GDD.

## Cross-References

| This document references | Where | What it relies on | Status |
|---|---|---|---|
| `design/gdd/game-concept.md` | Overview, Player Fantasy, D6, D11 | MVP item 6; the anti-pillar "NOT a reset loop"; the open question on wiping saves | Concept |
| `design/gdd/systems-index.md` | Overview, D1, D12 | #11's brief; TD findings 6 and 8 | Approved |
| Content records and schema (#1) | D1, D3–D5, D11 | R2, R8.1, R8.5, F1, Edge Cases "Saves across content versions" | Approved; amended by this GDD (A6) |
| Modifier pipeline and recompute (#2) | D3.8–D3.9 | P4.2, P9, Edge Cases "Recompute and time" | Approved |
| Resources and caps (#3) | D1.3, D3.10–D3.11, J3, J4 | K2, K4, K5, K10, Edge Cases "Saves and runs", AC-X-3 | Approved |
| Activity slot, rest and away time (#4) | D1.3, D2, D3.12–D3.13, J1, J4 | S1.3, S5, S6, S9, S12, Edge Cases, AC-L-1 | Approved |
| Combat resolver (#5) | D1.5 | It holds no state | Approved |
| Forge and proving (#6) | D1.3, D4.2, D5, D7 | G7, G10, Edge Cases, AC-G10-1, AC-G13-2 | Approved |
| Methods (#7) | D1.3, D4.2, D6 | W7.8, W9, W12, Edge Cases "Saves (owned by #11)" | Approved; amended by this GDD (A2) |
| Crafting route (#8); Fight and dungeon routes (#9) | D1.5, D6.1 | Nothing saved | Approved |
| Tending (#10) | D1.3, D3.8, D3.9, D3.13 | D5, D9: the `heaped` slice | Approved 2026-11-21 |
| Rule 9, *copy* (`research/arcanum-reference/12-design-rules.md`) | D1 | **Kept:** a save keyed by stable ids, with everything derivable recomputed. **Diverged:** `held` and the marks are written explicitly, not as a delta against content defaults, because a delta changes saved amounts when `start` moves (D1.4) | Reference |
| Rule 54 (`research/hundred-days-reference/06-design-rules.md`) | D6.2 | The redo is stated before it is taken | Reference |
| Rule 26, *copy if a prestige layer is ever in scope* | D6.3 | Not in scope. The fast new game is the concept's stated test affordance, not prestige | Reference |
| `research/hundred-days-reference/03-data-model-and-content.md` §6 (P0.3.9c) | D1.4, D11 | Defaults kept outside the template become save weight; no save versioning | Reference |
| The archived attempt's `.ai/docs/data-layer.md` and `.ai/docs/issues.md` (ISS-005) | D2.3, D4.3, D8 | `current` and `backup` slots, Web Locks, and the cost of refusing on departed ids | Evidence, not binding |

## Acceptance Criteria

**Tags:**

- `[unit]`: the pure core;
- `[integration]`: the real load and save path in `bun test`, with an injected clock;
- `[browser]`: `bun run smoke`;
- `[manual]`: the checklist below.

**Fixtures:**

- **Fx** is a fixture that may inject constants: `AWAY_CAP` 98, `BANK_CAP` 60,
  `WRITE_FAIL_PROMPT` 3 and `IMPORT_MAX_BYTES` 1,024.
- **FS** is a fake store. Each get or put can throw, tear, or raise a quota error.
- Until the storage ADR (Open Question 4), the store criteria assume that `backup` is put before
  `current`, with a store-side fence.

**Criteria this GDD unblocks in other GDDs:**

- **#1:** AC-E-1 by AC-D5-1; AC-R2-4 by AC-D11-3; AC-R8-7 by AC-D3-5 (the alert element is
  #13's).
- **#2:** AC-P9-3 by AC-D3-4.
- **#3:** AC-X-3 by AC-J4-1.
- **#4:** AC-L-1 by AC-J4-2 and AC-D3-2.
- **#6:** AC-G10-1 by AC-D5-2; AC-G13-2 by AC-D6-1.
- **#7:** AC-W12-1 by AC-D1-1, AC-D6-1 and AC-D12-1.

### Load order (D3)

- **AC-D3-1** [integration, Fx] **GIVEN** a step spy on the load path, **WHEN** a save loads,
  **THEN** it records D3.1–D3.15 in order, each once, and exactly one write, at step 15. **AND
  GIVEN** content with a load error, **WHEN** the game starts, **THEN** the spy stops at step 2,
  with no store read, no `advance` and no write.
- **AC-D3-2** [integration, Fx] **Order changes the outcome.** Each fixture fails if its steps
  are swapped:
  - **GIVEN** `committed` naming a retired id with an alias, **WHEN** loaded, **THEN** it loads
    (step 6 before step 7);
  - **GIVEN** an `F` entry `add +8` on a store whose base cap is now 1, and `held` 5, **WHEN**
    loaded, **THEN** the entry is dropped and `held` is 1 (step 8 before steps 9 and 11);
  - **GIVEN** `held` 48, an effective cap of 44 and a mark of 40, **WHEN** loaded, **THEN**
    `held` is 44 and the mark is 44 (step 11);
  - **GIVEN** a removed occupant, *b* 900,000 and a gap of 600,000, **WHEN** loaded, **THEN** the
    slot rests with reason `withdrawn`, *b* is 1,500,000 and no unit completed (step 12 before
    step 13).
- **AC-D3-3** [integration, FS]
  - **GIVEN** no record in either slot, **WHEN** the game starts, **THEN** the state is J3's run
    start and no notice shows.
  - **GIVEN** a garbage `current` and a good `backup`, **WHEN** loaded, **THEN** `backup` loads,
    the notice holds "Your last save could not be read; the one before it was loaded.", and
    `saveLoaded` has `recovered: true`.
  - **GIVEN** both slots garbage, **WHEN** loaded, **THEN** the tab is Refused, and nothing is
    written.
  - **GIVEN** a differing or malformed fingerprint and nothing else to change, **WHEN** loaded,
    **THEN** the notice is the single line "The game was updated". With an equal fingerprint,
    there is no notice.
  - **GIVEN** one change each in steps 6, 8, 10, 11 and 12, **WHEN** loaded, **THEN** each adds
    one line.
- **AC-D3-4** [integration] **GIVEN** a save holding a committed method and an `F`, **WHEN** it
  is saved and loaded, **THEN** the effective set and every trail deep-equal those before saving.
  **AND GIVEN** `heaped` holding `fell_ironbark`, the same holds, and `heaped` is unchanged.
- **AC-D3-5** [browser] **GIVEN** a production bundle built from content with a load error, and
  a save in storage, **WHEN** the game starts, **THEN** no `advance` is called, nothing is
  written, and the stored bytes are unchanged.
- **AC-D3-6** [integration, Fx] **GIVEN** a committed run saved with `fell_ironbark` heaped and
  running, **WHEN** it is loaded after a gap below `DT_MAX`, **THEN** the gap runs as one segment,
  `heaped` is unchanged, and the state equals that of the same gap played live with no action.
  **GIVEN** a save whose `heaped` holds an id that is not a tendable source, **THEN** the load
  succeeds, the id is dropped, and the notice gains one line for it.

### Rules

- **AC-D1-1** [unit]
  - **GIVEN** a running game, **WHEN** it is saved, **THEN** the record's keys are exactly the
    envelope plus the declared slices. `held` and the marks cover every content id, and kept
    progress holds no 0.
  - **GIVEN** method A committed while method B is viewed, **THEN** the save holds A.
  - **GIVEN** a committed run with `held` 3, **WHEN** content moves that resource's `start` from
    0 to 2 and the save loads, **THEN** `held` stays 3.
- **AC-D2-1** [integration, FS]
  - **GIVEN** a running game, **WHEN** each of commit, start, stop, forge, new run, import, load,
    a backward clock and page hide happens, **THEN** each writes exactly once, with the state
    advanced to `lastSeen`.
  - **GIVEN** a refused Start, or two idle hours of fake time, **THEN** nothing is written.
  - **GIVEN** writes 1 and 2, **THEN** `current` holds 2 and `backup` holds 1.
  - **GIVEN** a `current` that fails D4.1, **WHEN** the next write lands, **THEN** `backup` is
    unchanged. **GIVEN** a `current` refused only for a newer format, **THEN** it rotates into
    `backup`.
  - **GIVEN** one write in flight and three more requested, **THEN** exactly two land: the one in
    flight and the last requested.
  - **GIVEN** an accepted `setHeap`, **THEN** a write is requested. **GIVEN** a `setHeap` refused
    before the commit (#10 D2), **THEN** nothing is written.
- **AC-D4-1** [unit]
  - **GIVEN** one fixture per D4.1 failure (`held` −1, `format` "3", an extra snapshot field) and
    per D4.2 case (an unknown `committed`; no commit with kept progress, a source in the slot, a
    snapshot or an ingredient at 1; a snapshot's method differing from `committed`), **WHEN**
    each loads, **THEN** it is Refused naming the field, and nothing is written.
  - **GIVEN** a malformed `fingerprint`, a malformed `lastRun`, an unknown top-level field, or
    five departed ids, **WHEN** loaded, **THEN** none refuses.
- **AC-D5-1** [integration, Fx]
  - **GIVEN** a save holding a retired id with an alias, one with no alias, and a differing
    fingerprint, **WHEN** loaded, **THEN** the first is mapped, the second is dropped and logged,
    and the save loads.
  - **GIVEN** one fixture per other D5 row, **WHEN** loaded, **THEN** each shows its outcome and
    its notice line.
- **AC-D5-2** [integration, Fx]
  - **GIVEN** a forged save whose `F` entry targets a store content no longer has, **WHEN**
    loaded, **THEN** the entry is dropped, that cap is at its base, seals 4 and tiers 1 / 1 / 2
    are kept, the resolver is not called, and the notice line shows.
  - **AND GIVEN** content changing the Gate's opponent vigor from 191 to 250, **WHEN** the forged
    save loads, **THEN** the Foundation display still reads seals 4 and tiers 1 / 1 / 2 from the
    snapshot, while a fresh `seals` of the same makeup returns the new value.
- **AC-D6-1** [integration, FS]
  - **GIVEN** a first game, a new run, and a Refused save resolved by New run, **THEN** all three
    give deep-equal J3 states: Choosing, with the realm in Planning only.
  - **GIVEN** a forged run, **WHEN** a new run is confirmed, **THEN** the snapshot and `forged`
    are cleared, every ingredient is held 0, `committed` is none, and exactly one write is made.
  - **GIVEN** a deferred write, **THEN** the tab keeps the old run until the write resolves.
    **WHEN** the write fails, **THEN** the old run stays, "Could not start a new run" shows, and
    no `newRunStarted` is emitted.
  - **GIVEN** Cancel, **THEN** nothing is written.
  - **GIVEN** 100 seeded states, **WHEN** a new run is confirmed from each, **THEN** each result
    deep-equals the run start in everything but `lastRun`.
- **AC-D7-1** [integration]
  - **GIVEN** a forged run, **WHEN** a new run is confirmed, **THEN** `lastRun` holds its realm,
    method, makeup, door tiers and seals.
  - **GIVEN** an unforged run, **WHEN** a new run is confirmed, **THEN** `lastRun` is unchanged.
  - **GIVEN** a `lastRun` naming an unknown id, **WHEN** loaded, **THEN** the line is dropped
    with a notice line, and the save loads.
  - **GIVEN** two states that differ only in `lastRun`, **WHEN** each is advanced by the same
    *dt*, **THEN** both give equal results.
- **AC-D8-1** [integration, Fx]
  - **GIVEN** the lock held elsewhere, **WHEN** the game starts, **THEN** it is Elsewhere, with
    zero store reads, `advance` calls and writes. **WHEN** Use here is chosen, **THEN** it
    reaches Playing.
  - **GIVEN** no lock support, **THEN** the game does not start, and says why.
  - **[browser] GIVEN** two pages in one profile, **THEN** the second shows Elsewhere. **WHEN**
    Use here is chosen there, **THEN** the first shows "The game moved to another tab".
- **AC-D9-1** [integration, FS] **GIVEN** every write failing, **WHEN** Copy save is chosen,
  **THEN** the text equals the live state settled to now, and nothing is written. **GIVEN** a
  Refused screen, **THEN** it copies the stored bytes unchanged.
- **AC-D9-2** [integration, FS]
  - **GIVEN** pasted text that would be refused, **WHEN** loaded, **THEN** nothing changes and
    no `advance` runs.
  - **GIVEN** pasted text that does not parse, **WHEN** loaded, **THEN** it is refused as "This
    is not a save", and nothing changes.
  - **GIVEN** a loadable record, **WHEN** it is confirmed, **THEN** the gap since its own
    `lastSeen` is played, one write is made, and the old `current` rotates to `backup`. **WHEN**
    that write fails, **THEN** the current run stays.
  - **GIVEN** text with a BOM and whitespace, **THEN** they are trimmed before the UTF-8 bytes
    are counted: 1,024 bytes load, and 1,025 are refused.
- **AC-D10-1** [integration, FS] **GIVEN** a storage probe that throws, **WHEN** the game starts,
  **THEN** play continues with "This browser is not keeping your save". **GIVEN** a spy on the
  persistent-storage request, **THEN** it is called once, after the first write that follows the
  commit.
- **AC-D11-1** [integration] **GIVEN** `SAVE_FORMAT` 3 before the first public build, **WHEN**
  records of format 2 and 4 load, **THEN** each is Refused by name, offering New run, Copy save
  and Load save, with the stored bytes unchanged. **WHEN** a new run is then confirmed over the
  format-4 record, **THEN** it lands in `backup`.
- **AC-D11-2** [unit, Fx] **GIVEN** `F_pub` 3 and `SAVE_FORMAT` 5, **WHEN** a format-3 fixture
  save loads, **THEN** the result equals two chained pure migration steps.
- **AC-D11-3** [integration] **GIVEN** an alias map with a chain, a cycle, a missing or
  wrong-type target, or a live source, **WHEN** the game starts, **THEN** it is a load error,
  with no `advance` and no write. An alias merge into an id live beside its source is
  *[validator, blocked: #12]*.
- **AC-D12-1** [unit] **GIVEN** the rules core, **THEN** this system accepts only `newRun`,
  `importSave`, `copySave` and `useHere`. **WHEN** each D12 trigger happens, **THEN** its event
  fires once, and one `committed` event fires per commit.

### Store faults

- **AC-S-1** [integration, FS] **GIVEN** each write operation (put `backup`, put `current`)
  failing in each way (throw, tear, quota), **WHEN** an action writes, **THEN** the tab's state
  is unchanged, a fresh load reads a record no older than the last committed write, and the next
  action writes.
- **AC-S-2** [integration, FS] **GIVEN** tab A's write in flight when tab B's Use here lands,
  **WHEN** A's write commits before B's read, **THEN** B loads it. **WHEN** A's write lands after
  B's read, **THEN** it is refused, and `current` is byte-identical.

### Formulas

- **AC-J1-1** [unit]
  - **GIVEN** `lastSeen` 1,000,000 and now 4,600,000, **THEN** the gap is 3,600,000.
  - **GIVEN** now 900,000, **THEN** the gap is 0 and `lastSeen` becomes 900,000.
  - **GIVEN** now − `lastSeen` = `DT_MAX` + 7, **THEN** the gap is `DT_MAX`.
  - The clock is read once per load, and a gap of 0 still calls `advance(s, 0)`.
- **AC-J1-2** [integration, Fx and shipped constants] **The gap law.** **GIVEN** 20,000 seeded
  cases, **WHEN** a state is saved at *a*, loaded, and given a gap of *b*, **THEN** it deep-equals
  `advance(s, a + b)` on state. At shipped constants, the cases include:
  - *a* = 0;
  - an exact unit end;
  - a stop mid-gap;
  - bank saturation (*b* 1,795,000, then 2,000 and 5,000);
  - *a* + *b* above `DT_MAX`;
  - three-way splits.

  A mutant that drops *t* or *b* from the save fails.
- **AC-J2-1** [unit]
  - **GIVEN** `SAVE_FORMAT` 3 and no `F_pub`, **THEN** v 3 loads, v 2 is `refuseOlder`, and v 4
    is `refuseNewer`.
  - **GIVEN** `F_pub` 3 and `SAVE_FORMAT` 5, **THEN** v 4 is `migrate(1)`, v 3 is `migrate(2)`,
    v 2 is `refuseOlder`, and v 6 is `refuseNewer`.
- **AC-J3-1** [unit]
  - **GIVEN** no commit and a `start` moved from 1 to 2, **WHEN** loaded, **THEN** `held` and the
    mark are 2.
  - **GIVEN** `start` 5 and a cap of 3, **THEN** the run-start value is 3.
  - **GIVEN** the MVP content, **THEN** every resource starts at 0 of its cap, with mark 0.
- **AC-J4-1** [integration, Fx] **GIVEN** `held` 48 and mark 48, with `F` `add +8` on Ash Tallow,
  **WHEN** loaded against a base cap of 36, **THEN** the cap is 44, `held` is 44, one `overflow`
  of 4 with cause `cap` is emitted, the mark stays 48, and no `capChanged` is emitted.
- **AC-J4-2** [unit]
  - **GIVEN** *p* 5,000 and *D′* 3,000, **THEN** *p′* is 2,999, and `advance(1)` completes a
    unit.
  - **GIVEN** *p* 1,000 and *D′* 3,000, **THEN** *p′* stays 1,000 and is not rescaled.
  - **GIVEN** *b* 2,000,000, **THEN** *b′* is 1,800,000.
  - **GIVEN** `skim_ash_pits` saved heaped with *p* 6,000 (*D* 6,250), and content that gives it
    an input (so it is no longer tendable) and keeps its 5,000 ms, **THEN** the id is dropped, *D′* is 5,000 and *p′* is 4,999.
- **AC-J5-1** [integration, FS]
  - **GIVEN** three Starts whose writes fail, **THEN** "Not saving" shows on the third.
  - **GIVEN** a commit or a forge whose write fails, **THEN** it shows at once.
  - **GIVEN** the sequence fail, fail, succeed, fail, fail, **THEN** it never shows.
  - **GIVEN** a write that was replaced or fenced, **THEN** it does not count.

### Manual checklist (Chromium, Firefox, WebKit)

- **AC-M-1** [manual]
  - **GIVEN** a running activity, **WHEN** the tab process is killed and the game reopened,
    **THEN** the state equals uninterrupted play.
  - **GIVEN** an action just taken, **WHEN** the tab is closed and reopened, **THEN** the action
    is held.
- **AC-M-2** [manual]
  - **GIVEN** a save, **WHEN** site data is cleared, **THEN** the game starts as a first game.
  - **WHEN** a copied save is then loaded, in the same browser or another, **THEN** the run
    returns.
  - **GIVEN** a private window, **THEN** the not-keeping notice shows.
  - Record each browser's answer to the persistent-storage request (Open Question 6).
- **AC-M-3** [manual] **GIVEN** tab A frozen mid-write, **WHEN** Use here is chosen in tab B,
  **THEN** B holds nothing older than A's last committed write, and A writes nothing when it
  thaws.

### Checked by review, not by test

- The Player Fantasy, tone and wording, and the screens (with #13's UX spec).
- The accepted degenerate strategies: save-scumming and clock manipulation.
- D1.1's "nothing derived is saved", beyond AC-D1-1's key-set test.
- D7.2's "no rule reads `lastRun`", beyond AC-D7-1's equal-advance test.

*Specialist: `qa-lead` drafted these criteria. The designer approved them with five corrections:
AC-D1-1 holds after the commit, AC-D2-1's queue wording, AC-D5-2 gains #6's vigor case, AC-D6-1's
seeded wording, and AC-J4-2's not-rescaled case. Its testability notes went to D3.3, D4.1 and
Open Questions 4 and 5.*

## Open Questions

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | Resolved 2026-11-21 by #10 (`tending.md` D5, D9): the slice is `heaped`, a sparse set of source ids, empty at run start. A choice survives a stop and never changes by itself, so the gap is one segment (D3.13) | Tending (#10) | Done |
| 2 | Is the log saved? Not in the MVP (D1.5). #13 may propose a capped display slice, which would raise `format` (D11.1) | Interface shell (#13) | #13 UX spec |
| 3 | Who declares `F_pub`, and when the retired-id list starts (D11.3, D11.5) | Designer, release manager | Before the first public build |
| 4 | The two-slot write order and the take-over fence (D2.3, D8.3). Tests assume that `backup` is put before `current`, with a store-side epoch | Technical Director | Storage ADR |
| 5 | The boot (250 ms) and write (2 ms) budgets, and `SAVE_MAX_BYTES`, are provisional. Measure them on the largest fixture save | Technical Director | Performance ADR |
| 6 | Some browsers show a permission prompt for a persistent-storage request, which interrupts the player. Keep D10.2, or move the request behind a settings action? CD-GDD-ALIGN prefers the settings action, so the first post-commit write is never interrupted | Interface shell (#13) with the Technical Director | Architecture |
| 7 | The Wave A checkpoint needs two methods in one session, but this system is in Wave B. Should D6's run start and new run, without persistence, be built into the checkpoint? | Producer | Before the checkpoint build |
| 8 | How `lastRun` behaves under a reforge (#16) and across realms (#19). Also, whether the accepted save-scumming case (Edge Cases, "Degenerate strategies") still holds if either adds hidden information or chance, since it rests on #6 G7's full preview and #5's deterministic fights | Reforge (#16), Realm ladder (#19) | Vertical Slice; Alpha |

**ADRs required** (representation this GDD leaves out, per TD finding 8):

1. The record's encoding and how the slices compose, with #2's ADR 5, #3's ADR 1, #4's ADR 1,
   #6's ADR 1 and #7's ADR 3.
2. Storage: the API, the two-slot write order and its atomicity, the integrity checksum (which
   may reuse #1's ADR 6 hash), the boot probe and the persistent-storage request.
3. The tab lock and the take-over fence.
4. The `now` source and `lastSeen` handling, with #4's ADR 2.
5. The alias map and retired-id list format, with #1's ADR 7.
6. The form of the migrations, the fixture-save layout, and how `F_pub` is recorded.
7. The export text format and clipboard handling.
8. Event payloads, with #13's channel, #3's ADR 2 and #4's ADR 4.
9. The load and write budgets, with #1's ADR 9 and #4's ADR 5.
