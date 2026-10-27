# Lowbridge

A browser cultivation incremental about an ordinary life in a mill village, an incomplete jade slip, and two ways to reconstruct its missing method. The first playable ends at Foundation. It is played in text, with capped resources, short practice runways, discoveries and a bank of unused time.

## Run locally

Requires Bun 1.4.x (developed with 1.4.0). The player bundle has no runtime dependencies.

```sh
bun install --frozen-lockfile
bun run dev
```

Open [Lowbridge on localhost](http://127.0.0.1:4173). The server builds on startup; restart it after source changes. To use another port: `PORT=4174 bun run dev`.

```sh
bun run typecheck
bun test
bun run validate
bun run validate:design
bun run build
bun run smoke
```

Browser smoke uses Playwright's Chromium (`bunx playwright install chromium` if the matching browser is not already present). It runs in isolated browser contexts and never uses a player's saved profile. The smoke server binds an available local port and shuts down when done.

## Playing and saving

The workspace separates Tasks, Techniques, Home and Character. Tasks opens with a **Now** panel that says where the story stands and what moves it on; the actions it names carry a **Next** mark. Below it sit village work, **Practice** (mirrored under each knowledge on Character), the breakthrough panel, places, purchases and standing. Tasks is a grid of action buttons grouped by kind. Techniques and Home read like Arcanum's spell list and furniture table: one row per method or furnishing, with its cost and headline effect in a column of their own. Techniques counts attuned places at the top and puts **Attune** beside each method. Home counts floor spans at the top, lists each place and what fills it, and starts each furnishing's row with the place it fills or the floor it takes. Hovering or focusing a button shows its cost, duration, gains, next repetition threshold and any missing requirement, and the ⓘ button pins those details on touch screens. Newly discovered actions, and tabs with unseen discoveries, carry a **New** badge until inspected. A button you cannot use yet states what it needs in place of its cost line, including how to free or expand floor space when a home arrangement is blocked; Stop and Accelerate show why they are unavailable in plain text rather than on hover. A chore whose payout would spill over a full resource says how much it would waste. Owned purchases and completed one-off visits move to a closed **Done** group at the end of their tab. Resources stay in a compact ledger: selecting a resource row (click, Enter or Space) marks the actions that produce, spend or raise it until you select it again or press Escape, and selecting a knowledge row opens Character. Vigor, qi and Life sit in the Body panel with their net rate and the time until full. The current activity stays visible when you change tabs, with its objective editor, its progress and time left in real seconds at the current completion rate, and the reason the previous activity stopped. The place panel, the Character introduction and the footer follow the stage you have reached: the village, the ferry road after Foundation, Old Ridge, the waystation. Steps that cannot be undone ask first in a modal confirmation that keeps focus until it is answered.

Actions come in two tempos. **Instant** ones (chores, trades and techniques) pay on the click without touching the activity slot or disturbing what is running. **Sustained** ones hold the slot: practice, **Rest** and the sustained earners run continuously, while site visits and Settling run for a set time. Starting a sustained activity sends the one it displaces to the front of a short waiting list instead of discarding it, and the slot picks the list back up when it frees. A paid timed run keeps its progress when you stop it and does not charge you twice to resume. An activity that cannot pay the next second of what it drains is refused with the reason. Furnishings can be taken down to free floor space; their cost is not returned.

Chores are instant and cost Vigor. Haul a sack or sort a bundle and the pay lands at once, rising at the repetition thresholds each chore names. Clicking them is the attentive way to play and pays best. Each good also has a sustained alternative (a shift at the mill for coin, tending the racks for herbs) that holds the slot and earns on its own at about two-thirds the rate, for when you would rather set something going than stand there clicking. A sustained earner runs until the good it fills reaches its cap, then hands the slot to whatever is waiting. When nothing is waiting, **Rest** takes over and brings Vigor back to full.

Choose an objective for one activity. An objective, a new discovery, or a cap can pause it. Unused real time goes into the bank. **Accelerate**, beside the bank, is a toggle that names the current objective. While it is on, every real second also spends one banked second on that activity, so progress runs at twice the ordinary pace until the objective stops or the bank is empty. It switches itself off when the activity ends. Returning to the game resumes the saved objective only as far as its next stop, then banks the remainder. A visit after a minute or more away opens with a summary of what happened and what entered the bank.

Using a method takes three steps. You **learn** it from a place or a practice, you **attune** it into one of the few places your mind holds ready, and then you can **use** it for qi. Attunement starts at a single place; the practice mat buys another and Foundation gives a third. The channel and the hollow teach opposite readings of the slip's missing turn (carry it, or let it settle), and attuning one closes the other for good. The game says so in plain words before you commit. Foundation asks for the reconstructed method, three of four preparations including two methods held attuned, a bill in herbs and coin, and a full qi reservoir. The quickest sensible play reaches it in about fifteen active minutes, and no outing or sitting before it runs longer than three.

Every method you hold carries **route keys** that name what it is made of: the channel's reading or the hollow's, and the school it comes from. Each method's details list its keys by name, and Character shows a **Route keys** section with every key you hold and the method that carries it. The rest of the journey asks about them, so it never asks which particular chores you did. Visiting one place does not forbid the other, and a method both routes share keeps them from diverging completely.

Fights appear under **Fights** once Circulation opens, along with **Life** in the Body panel. Each side's readiness fills by its **Speed** every second and it swings when the bar is full, every 5 seconds at Speed 1. A swing lands with your **Hit** chance less the foe's **Dodge**, and deals your **Strike** minus their **Guard**; theirs works the same way against you. Circulation, the ridge classes and attuned methods raise these. The tooltip shows both sides, each side's chance to land, and the average race ("on average you fell Old Tam in ~16 s; he fells you in ~21 s"), but every swing is rolled, so a likely win can still go wrong. Once begun, the fight opens its own **Fight** tab: both Life bars, both readiness bars, and the blow-by-blow, also kept in the journal. It ends when a side falls, or is lost if the minute runs out, and cannot be stopped halfway. Losing empties Life, which returns on its own, and costs what you brought, never a discovery. The sparring bout with the ferry hand stakes nothing; the man on the porters' path stakes your herbs.

No age, lifespan or retry ends a journey. A failed attempt costs the time and the preparation it used, keeps everything you discovered, and hands the choice back to you.

Progress saves in this browser's IndexedDB. A second tab cannot run the same journey at the same time. **Export** in the save controls creates a portable JSON copy; **Import** asks for confirmation, then resumes that snapshot without adding the time since its export. A save holds only what you actually did (values, experience, repetitions, what you have attuned and what you have seen). Every derived number is rebuilt from the content when it loads, so a rebalance reaches an existing journey without a migration. Saves are version 6, and older saves cannot be loaded. A version 6 save made before fights existed starts with 6 Life, which fills on its own. They carry a checkpoint and a lifespan that no longer mean anything, so the game refuses them by version and leaves the running journey alone. A new journey replaces the current one after confirmation.

Time away is settled from the saved wall-clock time. An open visit uses a monotonic clock, so system clock corrections neither freeze progress nor count time twice. Browser and operating-system suspend behavior can affect an open visit; closing the tab gives the clearest away-time boundary.

## Source of truth and scope

- [Design v2](design/DESIGN-PLAN-2026-10-18.md), including its implementation clarifications in §0.
- [Decisions](design/decisions/). The behaviour above is described by the most recent ones: [0021 compounding vocabulary](design/decisions/0021-compounding-vocabulary.md), [0022 chore tempo](design/decisions/0022-chore-tempo.md), [0023 techniques and attunement](design/decisions/0023-techniques-and-attunement.md), [0024 route keys](design/decisions/0024-route-keys.md), [0025 lifespan and checkpoints cut](design/decisions/0025-lifespan-and-checkpoints-cut.md) and [0026 combat exchanges](design/decisions/0026-combat-exchanges.md).
- [Implementation plan](design/IMPLEMENTATION-PLAN-2026-10-18.md).
- [Playtest sheet](playtest/PLAYTEST-SHEET.md).
- [Route measurements](playtest/SIMULATION-REPORT.md), the one place a measured time to Foundation lives. [Browser smoke](playtest/SMOKE-REPORT.md) covers persistence and layout.
- [UI and action revision](playtest/UI-REVISION-2026-10-18.md).

Every duration, price and limit in this slice is provisional unless the simulation report measured it, and all of them are expected to change after play. ADRs 0021 to 0025 are still landing in the running build, so some of the behaviour described above may be ahead of the code you are running. This slice has one optional fight before Foundation and one on the ridge; there are no stances, foe techniques or multi-floor sites yet, and no sect or waystation modules. The leads after Foundation show where the next slice begins. The Python design validators remain alongside the TypeScript validator, which runs real content and engine behavior.

Inspired by [Arcanum: Theory of Magic](https://mathiashjelm.gitlab.io/arcanum/). Lowbridge is a separate TypeScript implementation and does not fork its runtime. The pinned primary-source study is kept in `research/`, and the design reference wiki for the inspiration (shell, interaction semantics, data model, systems, a mid-game save) is at [research/arcanum-reference/README.md](research/arcanum-reference/README.md). The frozen review package is preserved unchanged.
