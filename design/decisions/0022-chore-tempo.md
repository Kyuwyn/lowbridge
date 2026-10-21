ADR 0022: Chore tempo

Status: Accepted tempo vocabulary: instant Vigor-paid chores kept as they are, plus one sustained `fill` earner per good, the one-slot and waiting-list rules, and the sustainability guards. The two-thirds ratio and every per-second rate remain provisional until `bun run validate` measures the routes again. Date: 20 October 2026. Basis: the prior-review complaints recorded in the design-intent report §3.8 and §3.9, and rules 2, 7, 17, 23, 24 and 34 of [`research/arcanum-reference/12-design-rules.md`](../../research/arcanum-reference/12-design-rules.md). Supersedes design plan Part A rule 9.

**Context.** The independent review's unresolved finding is that "reported pacing is a property of the route script, not of the opening" (§3.8). The disposition recorded against it was a hypothesis rather than a fix: a hybrid tempo and a roughly thirty-minute active target were chosen, and the simulation report still says in its own words that it is deterministic route evidence, not representative player pacing. Its sibling complaint was that stopping or switching a paid activity "silently forfeits paid Settling and all timed progress" (§3.9, LB-01), fixed on 19 October when chores became instant.

That fix was right and is kept. What it left behind is the measurement problem. When every way to earn a good is a click, the time to Foundation is the click cadence the route script happened to use, and no number the content authors choose can change that. A player who clicks steadily and a player who drifts in twice a day are not playing the same opening, and only one of them is in the report.

- Rule 23: **one slot + auto-filling rest + `fill`**, *copy*. The reference removes idle micromanagement without selling automation.
- Rule 34: **classify by timing, not group**, *copy*. Instant, timed and perpetual read differently: a click pays, a timed run shows a percentage in the slot, a perpetual one shows no percentage and `(Full)`.
- Rule 24: **priority flags and a bounded waiting list are the automation**, *copy*.
- Rule 17: **the first cap is hit in a minute; first stage under an hour**, *copy the density*.
- Rule 7: **repetition curves (`at` / `every`)**, *copy*. Rule 2: **visibility ≠ actionability**, *copy*.

**Decision.** Tempo is `length`, and nothing else reads it.

| `length` | Tempo | Behaviour |
|---|---|---|
| absent | **instant** | The click pays `cost` and lands `result` in the same frame. It never enters the activity slot and never disturbs what is running. |
| a number of seconds | **timed** | Holds the slot. Its entry bill is paid once and marked `paid`, so stopping keeps the progress and restarting resumes without paying again (the LB-01 rule, kept). |
| `"continuous"` | **perpetual** | Holds the slot and pays per second. |

**Chores stay exactly as they are.** `mill_work`, `sort_herbs`, `gather_herbs`, `cut_timber` and `ferry_hauling` remain instant, Vigor-paid, and carry their `at` repetition curves (rule 7). Clicking is the attentive tempo and it remains the best-paying one; nothing in this decision slows it down or puts it in the slot.

**Each good also gets one sustained `fill` earner.** `mill_shift` fills coin; `rack_tending` fills herbs. Each is a continuous task that holds the slot and earns its good per second at roughly **two-thirds of attentive click income**. When the good it names in `fill` reaches its cap the run ends, the slot takes the next item off the waiting list, and if the list is empty it idles into Rest.

The two-thirds ratio sits between two bounds. Below parity, an attentive player is never punished for paying attention and rule 17's opening density survives intact. Above zero, an inattentive player still earns, so the opening has an **income floor that does not depend on click rate**, and that floor is what makes a measured route a property of the content rather than of the script that drove it (§3.8). The same two bounds are what the validator can honestly report: clicking throughout is the fast edge, sustained-only is the slow edge, and real play sits between them.

**One slot, and a bounded waiting list.** Starting a sustained activity displaces the running one, which goes to the *front* of the waiting list unless it is an `autoStart` filler. `queue` appends to the back. The list holds six, and the slot pulls from it whenever it frees. Rest is the filler: `autoStart` with `fill: vigor`, it begins by itself whenever the slot is empty and ends at full Vigor (rules 23 and 24).

**A sustained run must be able to pay for itself.** It will not start, and it stops, when any reservoir it drains cannot cover one more second after that reservoir's own regeneration. A timed run carrying an `encounter` will not start at all unless the reserves can see the whole run through, because an encounter cannot stop halfway.

**Timed work can be made faster deliberately.** `boost` names a held flag and a multiplier: while the flag is held, a timed run goes faster and one completion spends it. The opening's is the carried turn, which the channel's technique sets and the next timed undertaking spends at one and a half times speed.

**Divergences from *copy* rules, with reasons.**

- Rule 23 is copied in its machinery (one slot, an auto-filling Rest, `fill` as the stopping condition) and widened in where `fill` is used: the reference reserves it for recovery, and Lowbridge also puts it on earners. Reason: §3.8. `fill` already means "run until this resource is full", which is exactly the shape an unattended earner needs, and the two-thirds ratio keeps the widening from turning into the automation purchase rule 23 exists to avoid.
- Rule 24 makes the waiting list a separately unlocked automation milestone. Lowbridge has it from the first slice. Reason: with a sustained earner per good, the slot now empties on its own whenever a cap fills, and an opening that stalls at a full coin cap until the player notices is worse than one that moves on. Design plan Part A rule 13's *scheduling agency grows* keeps its later rewards, the hobby slot and the second activity slot, but the plain waiting list is not one of them.

**Consequences.** Every route timing taken before this decision is superseded: the opening now has a second way to earn every good, and the old routes never used it. The design plan therefore quotes no Foundation figure of its own and points at [`playtest/SIMULATION-REPORT.md`](../../playtest/SIMULATION-REPORT.md), which carries the single current number that `bun run validate` produces. Content owns the earners' rates and must keep each one near two-thirds of its chore's attentive income as the chore's `at` curves raise that income. The tooltip schema must distinguish the three tempos on sight (rule 34) and say what a run drains per second, since a run that cannot sustain itself is refused rather than started. Part E's playtest questions gain one: with a sustained earner available, does anyone still click, and does the player who does feel rewarded rather than obliged?

**Supersessions.** Supersedes design plan Part A rule 9 in full and replaces it. Keeps the 19 October owner-review decisions it grew from: chores are instant and spend Vigor, instant actions never take the slot, Rest self-starts, stopping a paid run keeps its progress. Keeps [ADR 0003](0003-opening-anchors.md)'s no-food-meter decision and the Vigor reinterpretation recorded in design plan Part F. Amends Part A rule 13: the waiting list is not a B2 reward. Does not touch [ADR 0007](0007-away-time-and-acceleration.md): one primary activity at a time, and acceleration still applies to whatever holds the slot. Techniques are instant records and belong to [ADR 0023](0023-techniques-and-attunement.md); they are not a tempo.

Still open: the exact per-second rates of `mill_shift` and `rack_tending` and whether two-thirds is the right ratio once measured; whether any good beyond coin and herbs wants an earner in this slice; whether the waiting list should be visible from the first minute or appear with the second sustained activity; and whether `boost` wants a second flag here.
