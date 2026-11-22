# Independent adversarial review — Lowbridge first playable (cold start → Foundation)

Reviewed artifact: `review/lowbridge-playable-review-2026-10-18.zip`, extracted to `~/Work/tries/2026-10-18-lowbridge-review/lowbridge-playable-review-2026-10-18/`. All 89 `MANIFEST.json` hashes match. `diff -rq` against this working tree shows no drift in `src/`, `tests/`, `scripts/`, `design/`, `playtest/` or `research/`. Experiments live in `~/Work/tries/2026-10-18-lowbridge-review/exp/`; nothing was added to the repository except this report.

## 1. Verdict

**Ready for a first human playtest, with named caveats: LB-01 (fix first), LB-02/LB-03 (decide before the playtest), LB-05.**

No softlock, no time-accounting leak and no save-corruption path was found:

- Foundation was reached from all 1,200 random-order histories plus 12 hand-scripted adversarial orders. An exhaustive 256-state check found no way past the Circulation ≥ 2 core.
- An independent ledger matched the engine on every advance/accelerate/stop/retry boundary.
- All 16 ordinary-corruption save cases were rejected without touching the running game.

The caveats are about what a real player will experience:

- Pressing **Pause activity** or starting any other task during Settling silently destroys the 10 paid herbs and the Settling progress.
- The channel route reaches Foundation at Qi Sense 1, so its players never meet the runway → wall → discovery loop that playtest question 1 asks about.
- On both routes, the "3 of 4 supporting preparations" collapses to one real choice.

## 2. Findings (ranked)

### LB-01 · P1 · implementation bug — "Pause activity", or starting another task, silently forfeits paid Settling and all timed progress

- **Where:** `src/engine.ts:174-180` (`stop()` sets `active = null`; progress is discarded). `src/engine.ts:156-157` (`start()` of a different record calls `stop()`, then pays). `src/data/opening.json:92-95` (`settling`: `"buy": { "herbs": 10 }`, charged at start). UI: `src/ui.ts:113` (button label "Pause activity"), `src/ui.ts:199` (handler `engine.stop()`), `src/ui.ts:376` (every other card's Begin stays enabled while Settling runs).
- **Requirement:** design C.3 (line 247) says "10 herbs spent at the start of `settling`". Interruption is unspecified. A control called "Pause" implies resumability.
- **Repro (browser, reproduced):** `exp/browser.ts` section D. Load a ready-to-settle save, click "Settle the foundation", advance 100 s, then click "Pause activity".
  - Observed: `herbs 0`, `active null`, `foundation 0`. The Foundation panel reads "Ten herbs and a full qi reservoir."
  - Clicking "Begin" on *Sort herbs* at 100/120 s gives the same result.
  - No confirmation appears and no journal line is written; the top journal entry is still the prior "Sort herbs…: objective complete."
- **Engine repro:** `exp/orders.ts` S9. Stopping at 60/120 s, or switching task at 119/120 s, leaves `herbs 0`, and `availability('settling')` = "Ten herbs and a full qi reservoir."
- **Same mechanism, every timed task:** S7. `mill_work` stopped at 29/30 s restarts at progress 0.
- **Objective changes force the loss:** while a task runs, its Begin button and objective `<select>` are disabled (`src/ui.ts:376, 396-397`; browser E: `begin: true, select: true`). Changing a running objective in the UI therefore means Pause, which throws progress away. The engine's "change objective without repaying" path (`engine.ts:141-148`) is unreachable from the UI.
- **Player impact:** at the climax of the session, one click costs up to 119 s of Settling plus about 100 s of re-sorting (10 runs × 10 s at Circulation 2), with no explanation. Earlier, every Pause silently drops up to 29 s of a run. The button's own label makes this likely. This is not a softlock.
- **Counterevidence:** reloads and time away keep `active.progress` (smoke and B below). Only explicit stops and switches lose it.
- **Smallest remedy:** keep Settling's payment across interruptions, either with a per-stat "paid" flag or by keeping partial progress on the stat, so restarting does not re-charge. Rename the control to "Stop" and add a confirmation when the active task has progress or a paid bill. Optionally, enable the objective editor on the running card so it uses the existing no-repay path.
- **Regression check:** start Settling, advance 60 s, stop, start again. Herbs stay at 0 and are not charged again; progress resumes at 60 (or, under a confirm design, the confirmation appears and no state changes on Cancel).

### LB-02 · P2 · design tension — the channel route never needs the Qi Sense runway

- **Where:** `src/data/opening.json:96-101` (pointers). `opening.json:75-80` (`channel_exercise` has no Qi Sense need). By contrast, `steady_attention` needs `g.qi_sense >= 3` (`opening.json:84`).
- **Repro (reproduced, `exp/design.ts`):** slip → breath to Qi Sense **1** → Lore 2 → walk the channel → kit → clear → stones → Circulation 2 → 10 herbs → fill qi (max 3) → Settle.
  - Foundation at **1,330 s (22m10s)**, 9 mill runs.
  - Supporting pointers met: Lore 2, home space (the stones' own 2 spans), channel cleared.
  - **Zero** Qi Sense cap notices were ever posted.
- **Why it matters:** design A.1 and Part E question 1 frame the opening as entry → runway → wall → external discovery. On the channel route the Qi Sense wall and its discovery-raiser (`channel_observe` `at: {1: qi_sense.max +1}`, `opening.json:111-117`) are optional and dominated: Qi Sense 3 costs about 300 s more breath, and a bigger reservoir to fill, than Lore 2. An optimising or lucky channel player cannot answer sheet question 1. A route-preferring player may also find the channel "faster and emptier", which affects question 2.
- **Counterevidence:** the scripted channel route reaches Qi Sense 4 only because its preference list orders breath practice early (`scripts/routes.ts:7-10`). A naive player may train breath anyway because it is the first practice offered. *Playtest hypothesis* whether players do.
- **Smallest remedy (owner choice, not a correctness fix):** mirror the hollow and give `channel_exercise` a `need` of `g.qi_sense >= 3`, or make Qi Sense 3 part of the core. Alternatively, accept the asymmetry and frame it on the sheet. Neither option touches the accepted "separate acquisition routes" decision.
- **Regression check:** add an engine test that no cold-start order reaches Foundation with Qi Sense < 3 (or, if the asymmetry is accepted, document it in C.5).

### LB-03 · P2 · design tension — the supporting preparations collapse to one real choice per route (prior Finding 7 only partly repaired)

- **Where:** `opening.json:96-101`. §0 row F7 (design line 19) claims the repair: "3 of 4 supporting pointers".
- **Pointer 4 is implied by the core.** "Channel cleared or steady attention practised" (`g.clear_channel > 0 || g.steady_attention.reps > 0`) holds in every state where Circulation ≥ 2:
  - Circulation can only open through `channel_arrangement`, which requires `clear_channel > 0` (`opening.json:163`).
  - Otherwise it opens through steady attention, in which case its levels can only come from steady attention, so `reps > 0`.
  - Empirical check: `exp/fuzz.ts` asserts this in every state; **1,344 / 1,344** core-met states had pointer 4 true.
- **Pointer 3 comes free with the channel route.** "Two spans of home space in use" is satisfied by the stones themselves (`space: 2`, `opening.json:164`).
- **Pointer 1 comes free with the hollow route.** Qi Sense 3 is guaranteed by `steady_attention`'s need.
- **Net effect:** channel players choose Qi Sense 3 *or* Lore 2; hollow players choose Lore 2 *or* furniture. Lore 2 is cheapest on both:
  - Hollow: 180 s, against roughly 38 coin, the field kit and 60 s of timber for mat + rack.
  - Channel: 120 s extra, because Lore 1 is already needed to see the field kit.
- **Measured:** S4 (hollow, Lore 0, no furniture) is blocked at "2 of 3 supporting conditions are ready", and the recovery is exactly 180 s of `fragment_notes`.
- **Impact:** the mandatory core keeps Foundation meaningful, but the "supporting choices retain agency" goal is mostly nominal. This is design evidence, established by arithmetic and simulation; whether players *feel* it is a playtest question.
- **Smallest remedy:** replace pointer 4 with a condition not implied by the core (for example, "both places first observed", which costs the other route 120 s). Count home space excluding the stones (for example `g.home_space - 2*g.channel_arrangement >= 1`, or "an arrangement other than the stones").
- **Regression check:** a validator rule that evaluates each pointer over route end states and flags any pointer that is true on every route.

### LB-04 · P2 · design tension — optional furniture can permanently close the channel route, without saying so

- **Where:** home space `shared.json:55-59` (Hayloft 2), `lean_to` `opening.json:167-171` (+2 → 4, no further raiser before Foundation), `practice_mat`/`herb_rack`/`strongbox` (1 span each, `opening.json:147-159, 173-178`), `channel_arrangement` (2 spans, `opening.json:160-166`). Arrangements cannot be removed. The author knows (`scripts/routes.ts:159` comment: "the four-span Lean-to cannot hold all five spans"); the player is never told.
- **Repro (reproduced, `exp/orders.ts`):**
  - **S1: mat then rack in the Hayloft (2/2).** The stones are unbuyable with "Four stones; two free spans of floor." Detours: Lean-to (pouch, 3 timber runs, 40 coin) costs **510 s**; switching to the hollow costs **840 s**. Both reach Foundation.
  - **S2: Lean-to, then mat + rack + strongbox (3/4).** The stones are unbuyable *permanently*. `capRaisers('home_space')` is empty and no cap line is posted, because 3/4 is not at cap. The need text never changes. The only remaining path is the hollow.
- **Not a softlock:** the hollow needs no space, and all 1,200 fuzz histories reached Foundation.
- **Impact:** a home-minded player can close half the content with ordinary purchases, then keep reading a need text that implies "free some floor" when no means exists in this opening. Lean-to is visible from minute 0 with "Forty coin and six timber." while coin caps at 20 and timber is unseen; that is another bill the player cannot yet see how to reach.
- **Smallest remedy:** state the permanence at purchase ("Arrangements cannot be moved out"). When space is the only blocker and no visible raiser exists, use a distinct need text ("No home in this opening has two free spans left").
- **Regression check:** an S2-style test asserting the reason text names the space limit and the absence of a raiser.

### LB-05 · P2 · implementation bug — Import replaces the journey without confirmation; the backup is overwritten within one autosave

- **Where:** `src/ui.ts:182-187` (file change → `callbacks.onImport` directly). `src/main.ts:116-120` (`replace()` → `persist()`). `src/persistence.ts:145-157` (each write moves the previous `current` into `backup`). New game and Retry do confirm (`ui.ts:189-190`); Import does not.
- **Repro (browser, reproduced, `exp/browser.ts` F):** a journey at 1,480 activity seconds; import a fresh save.
  - Right after import: `confirmationShown false`, `current 0`, `backup 1480`.
  - After the next autosave (≈5 s): `current 5`, `backup 0`. The 1,480 s journey is unrecoverable unless it was exported.
- **Impact:** choosing the wrong file, such as a spoiler Foundation export from `playtest/`, destroys the tester's run. The README's "Import resumes that snapshot" is accurate but gives no warning.
- **Smallest remedy:** route Import through the existing `confirmAction` ("This replaces the current journey…").
- **Regression check:** smoke step: import → confirmation visible → Cancel → stored `activitySeconds` unchanged.

### LB-06 · P3 · design tension — dominated options in the opening economy (mathematical, not preference)

From the data, with the simulation (`exp/design.ts`) used only for the qi interaction:

- **`gather_herbs`** (45 s, 2 herbs; 3 after 10 runs; `opening.json:15-20`) costs 22.5 s/herb against `sort_herbs`' 20 s/herb (`opening.json:8-14`). Its improvement needs 10 runs, which is 20 herbs, more than the 12-herb cap and the 10-herb bill. Circulation shortens both by the same 5 s, so sorting stays ahead (15 vs 20 s/herb at Circulation 1). The Qi Sense 1 reveal of gathering is a reward that is never useful in this slice.
- **`practice_mat`** (8 coin, which is 80 s of mill work) cuts Qi Sense 0→3 from 360 s to 288 s. But qi pulses count ticks, not rate (`every: {30: qi +1}`, `opening.json:66`), so qi is 4/5 at the wall and full only at 300 s. The net saving is 60 s for 80 s of earning. The mat also takes one of the Hayloft's two spans (LB-04). Its description, "breath-method practice is twenty-five percent faster", overstates the effect.
- **`herb_rack`**'s +12 herb cap is never needed before Foundation; its only use is the home-space pointer (LB-03).
- **Remedy:** a playtest hypothesis, not a retune. Either give each a niche (gathering yields more per run than sorting; the mat also speeds the qi pulse) or accept them as flavour. Mechanism stated; no number proposed without play evidence.

### LB-07 · P3 · research/evidence error — reported pacing is a property of the route script, not of the opening

- **Claim:** SMOKE-REPORT line 64: "whether the measured 39–40-minute opening feels right or needs shortening". Design C.3 (line 249) and §0 record 38m50s / 40m20s as *measured*.
- **Evidence:** those figures are reproduced exactly, but they come from fixed preference lists (`scripts/routes.ts:6-16`) and one-completion objectives. Hand-scripted orders on the same engine:
  - minimal channel: **1,330 s**;
  - channel with Qi Sense 3: **1,600 s** (`exp/orders.ts` S0);
  - minimal hollow: **1,540 s**.
  - The 45-minute bound holds comfortably.
- **"41/41 records witnessed"** counts resources and flags when *visible*, families when *open*, and leads when their `need` holds (`scripts/routes.ts:101-105`). `home_space`, `coin` and `herbs` are therefore "witnessed" at t = 0.
- **Impact:** the next pacing decision ("shorten?") would be anchored on a scripted policy. Real pacing lies between about 22 minutes for an informed player and an unknown time for a naive one.
- **Remedy:** report a minimal-order bound beside the preference routes, and describe "witnessed" precisely.

### LB-08 · P3 · implementation bug (known) — unknown-raiser cap lines ignore indirect raisers

- **Where:** `src/engine.ts:239-253`. `capRaisers` lists only records that *directly* raise `<id>.max`; for families it excludes those already at their cap.
- **Example:** Qi 5/5 with Qi Sense 3/3 logs "Further ways to raise this cap have not been discovered." (SMOKE-REPORT lines 23-28), even though the visible *Walk the broken channel* raises the Qi Sense cap and therefore qi. Design A.11 asks for the visible raiser to be named.
- **Remedy:** when a resource's raiser is a capped family, append that family's visible raisers ("…through Qi Sense, whose limit can rise through Walk the broken channel").

### LB-09 · P3 · implementation bug — keyboard focus loss and small-text contrast

These are reproduced in Chromium headless (`exp/browser.ts` E, G):

- Activating a card's Begin with Enter disables the focused button (`ui.ts:376`); `document.activeElement` becomes `BODY`. Chromium's next Tab still lands on the next card, but screen readers lose their place on every start.
- WCAG AA contrast (4.5:1) is computed from rendered colours:
  - `.journal-meta` (entry kind, e.g. "A limit reached"): 3.54 at 10.9 px (`style.css:224`);
  - `.journal-time`: 3.46 (`:225`);
  - `.game-footer` (activity total): 3.63 (`:231`);
  - `.tab-count`: 3.44 (`:177`).
  - Disabled-button text at 4.39 is exempt.
- The reason Accelerate is disabled exists only in `title` (`ui.ts:480-481`).
- No horizontal overflow at 300 px or at 720 px (≈200 % zoom). The "Practice" tab label clips by 2 px at 300 px.
- **Remedy:** move focus to the card's state line or the Pause button after Begin. Darken the four colours to at least 4.5:1. Render the Accelerate reason as visible text.

### LB-10 · P3 · implementation bug (adversarial only) — `decodeSave` accepts internally inconsistent saves

`exp/saves.ts` reproduces each case. All require hand editing; for a local single-player game this is not anti-cheat work, only cheap invariant checks.

- `bank.spentSinceCheckpoint = 3600` with bank 0 → `retry()` gives bank 3600.
- `checkpoint.bankCap = 1e9` → retry sets cap 1e9.
- `checkpoint.world.wallRemainder = 0.9` → bank grows 0.9 per retry. Ordinary play cannot create this: breakthrough calls `stop()` before `createCheckpoint` (`engine.ts:332-336`), and the ledger confirmed remainder 0.
- `settling.value/reps` reset → rewards re-applied (lifespan 90, bank cap 39,600, qi max 25).
- Active `clear_channel` with no field kit completes, because a finite task's `need` is not re-checked mid-run (`engine.ts:290`).
- Active `settling` at progress 100 with herbs unpaid completes Foundation.
- **Remedy:**
  - `spentSinceCheckpoint ≤ bank.cap`;
  - `checkpoint.world.wallRemainder === 0` and `active === null`;
  - `reps ≤ max` for one-shot kinds;
  - re-run `availability`-style need checks for a restored finite activity.

### LB-11 · P3 · future expansion risk — a runtime content error freezes the browser loop silently

- **Where:** `engine.value()` throws on non-finite results (`engine.ts:79-83`). `main.ts:131-136` calls `settle()` every second with no catch.
- **Repro (engine):** mutating `mill_work.result.coin` to `"g.coin / 0"` makes `advance(31)` throw "Expression produced a non-finite value." (`exp/saves.ts`, last line). The validator's grammar check parses expressions but cannot catch value-dependent division by zero.
- The browser behaviour is established from source, not observed: every tick would throw before `render()`, leaving a frozen UI with no message.
- Current content has no such expression.
- **Remedy:** catch in the interval and show the startup-message panel; add a validator pass that evaluates every expression over route states.

### LB-12 · P3 · research/evidence error — "structure identical across all three versions" is unsupported

- `MECHANICS-STUDY.md:13` asserts it. The only cross-version evidence, `research/arcanum-study-2026-10-16/deployment-check.json`, compares 5 stable-deployment files with the pinned commit.
- Nothing compares the testing build (0.12.12.9) or the wiki (0.12.0.0) structurally.
- The "first real tier-up ≈ 30–60 min" (`MECHANICS-STUDY.md:184`) is explicitly [I], yet it anchors the ~30-minute Foundation target.
- **Checked against the pinned source and correct:** `src/items/skill.js` `Defaults.max = 5`, `buy = { arcana: 20 }`; `data/skills.json` has 52 records, 41 with `require`, 19 with `need`.
- **Remedy:** soften the sentence to "the opening structure observed in 0.12.12.9 resembles the pinned data", and label the pacing anchor as a hypothesis.

### LB-13 · P3 · tooling — `bun run smoke` overwrites committed evidence

Running smoke in the extracted copy changed 5 manifest-hashed files: the four PNGs in `playtest/` and `playtest/smoke-results.json` (`scripts/browser-smoke.ts:54, 80, 90, 161`). The route JSON saves are deterministic and unchanged. A reviewer's run silently replaces the screenshots the report links to. **Remedy:** write to a temp or `--out` directory by default.

## 3. Claims table

| Supplied claim | Status | Evidence |
|---|---|---|
| 36 tests / 266 assertions | Verified | `bun test`: 36 pass, 0 fail, 266 `expect()` (`/tmp/lb-test.txt`) |
| 41/41 records witnessed across four cold starts | Verified, qualified | `bun run validate` prints 41/41. Witness ≠ completion: resources/flags count when visible, leads when `need` holds (LB-07) |
| Channel 2,330 s (38m50s) | Verified | validate 38.83 min; smoke "2330s ordinary activity". It is a route-policy figure: hand order 1,330–1,600 s (LB-07) |
| Hollow 2,420 s (40m20s) | Verified | validate 40.33 min; smoke 2420 s. Hand order 1,540 s |
| Empty starting bank, no bank spent | Verified | `validate.ts:113` check passes; routes start from `new GameEngine` (bank 0) |
| Python 31m20s / 30m50s | Verified (rounded) | `opening-sim.py` prints 31.3 / 30.8 min (31m18s / 30m48s) |
| B4: 15 histories | Verified | `b4-gates.py`: `histories=15`, OK |
| "No self-key" | Verified, narrow | `validate.ts:67-79` checks only a record's own id and skips passive kinds. A 2-cycle (`field_kit.require = g.clear_channel > 0`) fails validate only indirectly: "No cold-start reachability witness for: timber, cut_timber, … cottage" (11 records), with no cycle message |
| "Mandatory method cannot be bypassed" | Verified | Independent 256-state sweep (Circulation 0–3 × 16 pointer subsets × herbs × qi) matched the gate exactly (`exp/orders.ts` S10). The repo check (`validate.ts:84-103`) tests one adversarial state, which is valid but not a path proof |
| "Distinct route rewards require actual histories" | Verified | Faint trace needs a steady-attention level (S6: started-then-abandoned plus channel to Circulation 2 → no trace); traveller line needs `clear_channel` |
| Rewards not repeated at Foundation | Verified for ordinary play | `availability` "Completed." after Foundation and after retry; repeats only with an edited save (LB-10) |
| Multi-tab exclusion | Verified | Smoke shows the refusal screen; `main.ts:143-158` never boots (so never writes) without the Web Lock. Untested: browsers without Web Locks show an error page by design |
| Clock-change safety | Verified (Chromium/Linux) | Open tab: smoke `browser-smoke.ts:149-157`. Closed tab with `savedAt` +1 day: no credit, ticking continues (`exp/browser2.ts` A′: 5 s → 10 s after 5 s). Frozen tab 9.2 s wall → 9 s activity |
| Import gets no offline credit | Verified | Smoke (`browser-smoke.ts:139-143`) and source (`main.ts:116-120`); the recovery import also resets `savedAt` (`main.ts:56-57`). No confirmation (LB-05) |
| Retry refunds once, keeps later accrual | Verified | `exp/time.ts`: 750 → retry 1050 → retry 1050; capped case 3570+160 → 3600 |
| Time ledger (no double credit, ages only active seconds) | Verified | `exp/time.ts` 14/14 checks; 1,200 fuzz histories with age = 18 + activity × 0.25/3600 throughout |
| Browser result equals engine simulation | Verified, not independent | Smoke replays `runRoute`'s own action list (`browser-smoke.ts:43-71`); `--real-json` also calls the TS route runner |
| No horizontal overflow 1440/768/390 | Verified, plus 300/720 | `exp/browser.ts` G; "Practice" tab clips by 2 px at 300 |
| MANIFEST integrity (89 files) | Verified | `sha256sum -c`: 89 OK before smoke (smoke then rewrites 5, LB-13) |
| "Frozen review package: 49 files unchanged" | Could not check | Package excluded from the bundle |
| Upstream `Defaults.max = 5` | Verified | Pinned `src/items/skill.js` lines 19-21, 51 |
| Upstream `skills.json`: 41 require / 19 need / 52 records | Verified | `jq` over the pinned raw file |
| "Structure identical across 0.12.0.0 / 0.12.3.1 / 0.12.12.9" | Unsupported | LB-12 |

## 4. Next three fixes

1. **LB-01:** make Settling's bill survive interruption and add a confirmation to Stop; ideally allow objective edits on the running card.
2. **LB-02 + LB-03:** decide whether the channel route should require Qi Sense 3, and replace the core-implied pointer and the stones' self-satisfied home-space pointer. If the owner accepts the asymmetry, say so on the playtest sheet so question 1 is interpreted correctly.
3. **LB-05 + LB-04 text:** confirm before Import, and give the stones a distinct, honest need text when floor space can no longer be freed.

## 5. Three questions that need human play

1. Without a guide, what Qi Sense level do channel players reach before Foundation, and do they ever see a Qi Sense cap notice? (This tests whether LB-02 matters in practice.)
2. How long does a naive player take to reach Foundation, and how many clicks? Do they discover "Total completions", or click Begin for every 30-second run? The scripted 39–40 minutes and the informed 22–26 minutes bracket nothing about this.
3. Do players furnish the Hayloft first and then hit the stones' floor requirement? If so, do they understand the Lean-to or hollow way out, and do they use "Pause" expecting to resume?

## 6. Limitations

- **Browser coverage:** Chromium headless 156 (Playwright 1.64.1) on Linux only. No Firefox/Safari, no real OS suspend, no mobile background-kill. The frozen-tab test used CDP `Page.setWebLifecycleState`.
- **The UI walk was mine, not a naive human's.** I drove the UI after reading the content, so it says nothing about discoverability. No human pacing data exists.
- **Fuzz depth:** random histories touched 17–20 distinct actions; deep furniture orders were covered only by the targeted scenarios S1/S2.
- **Snapshot vs live tree:** no source drift. This tree has no git commits, so "unchanged" was checked with `diff -rq` against the ZIP.
- **Primary sources:** two pinned files fetched with `scrapling`. The live game, testing build and wiki were not re-observed.
- **Future content:** B2–B4 were assessed only through `b4-gates.py` output; nothing in this slice exercises classes.

## Reproduction

```sh
cd ~/Work/tries/2026-10-18-lowbridge-review
unzip /home/pengwyn/Documents/ChatGPT/Thing/review/lowbridge-playable-review-2026-10-18.zip
cd lowbridge-playable-review-2026-10-18
jq -r '.files[] | "\(.sha256)  \(.path)"' MANIFEST.json | sha256sum -c
bun install --frozen-lockfile && bun run typecheck && bun test && bun run validate
python3 design/validation/opening-sim.py && python3 design/validation/opening-sim.py --real-json && python3 design/validation/b4-gates.py
bun run build && bun run smoke
cd .. && bun exp/orders.ts && bun exp/time.ts && bun exp/saves.ts && bun exp/design.ts
bun exp/fuzz.ts 7 400 && bun exp/browser.ts && bun exp/browser2.ts
```

Experiment files are in `exp/`: `lib.ts` and `ready.ts` (helpers), `orders.ts` (progression scenarios S0–S12), `time.ts` (independent ledger), `saves.ts` (import/corruption and expression attacks), `design.ts` (minimal routes and rates), `fuzz.ts` (random orders with invariants), and `browser.ts` / `browser2.ts` (Playwright lifecycle, Settling interruption, keyboard, import, layout, contrast). The cycle mutation was run in a separate copy, `mut/`.
