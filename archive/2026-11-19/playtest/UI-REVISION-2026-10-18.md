# Lowbridge UI and action revision: 18 October 2026

The first interface gave purchases, work and practice nearly the same large card treatment. It also contained a mechanical error: any purchase stopped the current activity. The owner's Arcanum screenshot prompted a source check and a redesign of the existing village-to-Foundation workspace.

## What changed

- A compact dark workspace: resource and knowledge ledger on the left, game views in the centre, current activity and character state on the right, with a separate journal.
- Tasks, Techniques, Home and Character have native keyboard-operable tabs. Techniques appears when discovered. Counts show available actions; an activity continues when another view is selected.
- **Instant**, **Timed** and **Continuous** are explicit action modes with different controls and styling. Purchases have no objective editor. Work shows cycle duration and payoff; practice shows its rate and level progress. Costs, requirements, effects and stopping objectives remain inspectable through native details controls.
- The activity panel keeps the running action, progress, objective, stop control and acceleration visible across game views. Resource rows show the current output cadence where applicable. Knowledge limits, home space and qi have their own context.
- The journal can show discoveries and limits or all entries. Character collects the actual stage, learned method effects, slip and Foundation leads.
- Fractional values retain their precision. The practice mat's bonus is presented as **+25% speed**, not a rounded raw rate increment. Foundation presents its rewards before the player commits its bill.
- The page uses system fonts and matching dark browser chrome; the previous unused external font requests were removed.

Instant acquisitions now preserve a running activity, its paid entry, objective, progress and unfinished wall-clock fraction. Another sustained activity still replaces it. An explicit discovery pause, an objective fulfilled by the instant effect, or an activity invalidated by that effect still stops deliberately. Finite activities do not pay their entry bill again after an unrelated purchase.

The save format and content records are unchanged. This revision adds no extra action slots, classes, combat, or later campaign modules. Foundation remains the playable endpoint.

## Evidence

- `bun test`: **44 passed, 0 failed**, 341 assertions. Eight new engine regressions cover instant acquisitions during work/practice, failed acquisitions, sustained replacement, discovery pauses, newly completed objectives and invalidated activity.
- `bun run typecheck`: passed.
- `bun run validate`: **41/41 records** witnessed across the same four cold-start histories. Normal channel and hollow timings remain **2,330 seconds** and **2,420 seconds**, respectively.
- `bun run smoke`: isolated Chromium replay of both complete routes, using production controls and normal activity ticks under a virtual clock. Includes save/reload, offline return, bank depletion, stable objective input focus, import/export, second-tab protection, clock correction, and the new workspace checks.
- The workspace check earns nine coin through ordinary mill work, starts another run, and buys the practice mat ten seconds into that run. The save retains the active mill task at ten seconds, pays eight coin, then finishes normally twenty seconds later. The activity panel remains visible on Home throughout.
- Keyboard checks exercise Arrow navigation, Home and End, skipping the undiscovered Techniques tab and including it once unlocked. Action modes are checked against both complete routes. Horizontal overflow is checked at **1440, 768 and 390 pixels**, including Tasks, Home and Character.
- Desktop opening, running practice, instant purchase alongside work, and the mobile layout were visually inspected. Screenshots and machine-readable results are below.

These are scripted Chromium checks, not human pacing evidence or a cross-browser certification. The previous open-tab system-suspend limitation remains documented in the original smoke report. Testing uses isolated storage and does not operate on the owner's live journey.

## References and captures

- [Pinned-source UI/action study](../research/arcanum-mechanics-2026-10-18/UI-ACTION-STUDY.md): acquisition versus the runner, task classification, skill controls, persistent slots, resource layout, details and visibility. It distinguishes the pinned stable source from the unstable version in the supplied screenshot.
- [Machine-readable browser results](smoke-results.json)
- [Opening workspace](opening-desktop.png)
- [Continuous practice and Foundation](cultivation-desktop.png)
- [Instant purchase alongside running work](instant-and-running-desktop.png)
- [Mobile Foundation layout](foundation-mobile.png)

The existing review ZIPs remain snapshots of the earlier implementation. Use the current source and this report when reviewing this revision.

# Instant/sustained action mix and density pass: 19 October 2026

## What changed

- Chores are instant and spend **Vigor** (10/10; +0.05/s while any activity runs, +0.25/s resting; Circulation adds +2 cap per level). **Rest** is continuous and stops at full Vigor. Three instant trades: sell a bundle, buy a bundle, sell timber. Sites and Settling stay timed; practice stays continuous.
- The centre is a grid of compact action buttons grouped under collapsible headings (collapse state is remembered). Each button shows name, a one-line cost → gain or duration, a state badge and a progress fill. Hovering or keyboard focus reveals the details tooltip; the ⓘ button pins it for touch. Locked actions stay focusable and announce their missing need.
- The right column holds Current activity with an inline objective editor, a Body panel with the Vigor and qi bars, Character and the Journal. Ledger rows flash when a value rises; instant buttons flash on success.
- Review defects closed: stopping or replacing a paid run keeps its progress (LB-01); the channel stones need Qi Sense 3 (LB-02); furnishings that do not open a family can be taken down without refund (LB-04); import asks for confirmation (LB-05); the herb rack adds a bundle per gather and gathering trains Qi Sense (LB-06); cap lines name indirect raisers such as the channel walk behind a full Qi Sense (LB-08). Journal option markup is valid.
- Saves are version 2. Version 1 saves migrate: new records are added, Circulation's Vigor cap is replayed, an instant chore left running becomes idle, and a site visit in progress stays paid.

## Evidence

- `bun run typecheck`: passed. `bun test`: **53 passed, 0 failed**, 487 assertions, including Vigor, Rest, herb-rack yield, indirect raisers, take-down, resumed paid runs, Settling stop/resume and two version-1 migrations.
- `bun run validate`: channel-only **24.00 min**, hollow-only **25.67 min** (Circulation opens at 20.0 and 20.7 min, inside C.5's 27-minute window, which the validator now enforces); coverage branches 57.43 and 40.07 min; **46/46 records** witnessed.
- `bun run validate:design`: passed; `--real-json` reproduces 24.00 / 25.67 min.
- `bun run smoke`: both routes reach Foundation in the browser at **1,440 s** and **1,540 s**, equal to the simulation. Added scripted layout checks: at least four buttons after the first chore with Rest shown, Work/Trade/Purchases/Sites groups and both Body bars at Foundation, one or two grid columns at 390 px, no horizontal overflow at 1440/768/390 px. The workspace check spends Vigor on three mill clicks, rests, buys the mat during Rest without interrupting it, reaches a locked action by keyboard and reads its need from the tooltip. Import confirmation (cancel and confirm) and a version-1 import are exercised.
- A version-1 save exported from the previous build migrated without the recovery screen and re-exported as version 2.

# Quality-of-life pass: 19 October 2026

Played both routes under a virtual clock; three owner decisions were taken together (toggle acceleration per C.6, self-starting Rest, a Done group). No Part C number changed.

## What changed

- **Accelerate is a toggle beside the bank** (C.6) and names the current objective. While on, each real second also spends one banked second on the running activity; it switches itself off when the activity stops or the bank empties. The one-shot button in the activity panel is gone. The bank reads "full" when idle at its cap.
- **Rest starts by itself** whenever the slot is empty and Vigor is below its cap (`autoStart` on the record; the engine fills the slot in `advance()` and after instant actions, including offline settlement). It ends at full Vigor or when a sustained activity replaces it; clicking the running Rest or Stop does nothing to it. Routes now measure channel 24m20s and hollow 26m00s.
- **Time left.** The activity panel estimates the time to the objective (`GameEngine.timeToObjective`), halved in wall-clock terms while accelerating. Body and ledger rows show the net rate (`GameEngine.netRate`) with "full in" / "empty in"; slow rates read per minute.
- **Why it stopped.** The activity panel keeps the reason the last chosen activity left the slot (`state.lastStop`); the self-starting Rest never overwrites it.
- **While you were away.** A return after a minute or more opens with the away time, how long the activity continued, what the bank received, and up to four new journal lines.
- Locked buttons show their `needtext` in place of the cost line (C.6), and floor-space blockers name whether to move to the Lean-to or take down an installed furnishing on Home (LB-04). An instant chore that would spill over a full cap carries a "Wastes N" badge and the tooltip says so.
- **Repetition curve preview & unseen discovery badges.** Action tooltips show the next repetition threshold (`at`) and how many completions remain (e.g. `Next at 10 (7 more): +1 Haul sacks at the mill yield`). Newly revealed actions and tabs with unseen unlocks show a **New** badge until hovered, focused or opened.
- **Interactive ledger & Body cross-highlighting.** Clicking any resource in the ledger or Body panel highlights actions that earn, spend or raise that resource (`Escape` or clicking again clears it); clicking a Knowledge family row switches to Techniques.
- Owned purchases and completed one-off visits move to a closed **Done** group at the end of their tab. Keyboard focus continues in the group after a purchase, and small metadata/footer colours meet WCAG AA contrast (LB-09).
- The journal's "All entries" shows the whole retained log; the location panel's stage line follows the actual stage.
- An objective that a cap reduction makes unreachable now pauses with a reason; saves with unpaid timed runs, over-completed one-shots, closed/unseen active tasks, or inconsistent checkpoint bank caps/remainders are rejected (LB-10); a resource within floating-point distance of its cap counts as full; the one-second loop reports an engine fault instead of freezing silently (LB-11).
## Evidence

- `bun run typecheck`: passed. `bun test`: **53 passed, 0 failed**; acceleration, lifespan, retry and fractional-tick tests rewritten for the toggle; chore, practice, pause and roundtrip tests assert the self-starting Rest and the kept stop reason; floor-space remediation and six new rejected-save cases (LB-04, LB-10).
- `bun run validate`: channel-only **24.33 min**, hollow-only **26.00 min**; coverage branches 58.30 and 40.13 min; **46/46 records** witnessed. `bun run validate:design`: passed.
- `bun run smoke`: both routes reach Foundation in the browser at **1,460 s** and **1,560 s**, equal to the simulation. Added checks: the return summary after a 90-second absence; the toggle names the objective, spends 10 banked seconds in 10 real seconds, shows "accelerating" in the estimate, and leaves the objective running at ordinary speed once the bank is empty; Rest starts by itself after chores and Stop is disabled for it; the "14s left" estimate; the "Wastes 2 Coin" badge at the coin cap; the "New" discovery badge and next-threshold tooltip line; resource-to-action highlighting and `Escape` clearing; a purchase moving to Done with focus retained; no horizontal overflow at 1440/768/390 px.
