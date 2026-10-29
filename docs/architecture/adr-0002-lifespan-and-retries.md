ADR 0002: Lifespan and retries

Status: Accepted. Updated 18 October 2026. Basis: explicit design-interview answers.

Immortality is both the campaign destination and an answer to a finite lifespan. This constraint must coexist with discovery, experimentation, short visits, and a single continuing character.

Accepted rules:

- Time spent on simulated activities advances age. Training, work, recovery, and expeditions can consume lifespan. Paused or unspent away time does not itself age the cultivator.
- When configured activity stops at its objective or a meaningful discovery while the player is away, unused away time is banked to accelerate later player-chosen activities. Those activities consume lifespan normally. The bank has a generous fixed cap intended to cover a few days, with the exact amount to be tested. Acceleration is enabled for one current objective, ends at the objective or meaningful pause, and must be enabled again for the next activity. Q43-Q45 establish these rules; [ADR 0007](adr-0007-away-time-and-acceleration.md) records their boundaries and open details.
- While no activity runs, unused real time accrues up to the bank cap whether the game is open or closed. Completed objectives, decision pauses, and voluntarily stopped activities qualify. Time used to advance activity is not also credited. Q47 establishes this rule.
- Breakthroughs and longevity opportunities extend the life available for further progress. Their exact effects and sources are undecided.
- A first attempt should have room for curiosity and reasonable mistakes. The lifespan limit discourages indefinite accumulation and makes major commitments consequential; repeated failure is not the intended normal discovery loop.
- Automated routines stop before exhausting the remaining lifespan. Spending the last of a life requires a deliberate action or undertaking.
- Exhausting lifespan before ascension ends that attempt and permits a retry from the last major breakthrough.
- A retry restores character and world state from the checkpoint exactly. Gains and choices made after it are undone. There is no retained discovery journal or character progression reward from the failed attempt. The player's own understanding informs another attempt.
- Q46 establishes a separate rule for banked time: retain its current balance across retries. Spent banked time stays spent, and later accumulated time remains. This also applies when retrying from the opening starting state.
- Before the first major breakthrough, lifespan exhaustion restores the opening starting state exactly. No discoveries, skills, or purchases from the failed attempt are retained.
- An ordinary investigation obstacle before the first breakthrough instead pauses with a useful finding, preserves discoveries already made, and lets the player choose how to prepare. Its cost is time already spent; it is not a checkpoint retry.
- An unsuccessful later defining trial, while lifespan remains, costs time and repeatable preparation while preserving established advancement and discoveries. What the attempt revealed informs another approach. Q36 establishes this boundary; [ADR 0005](adr-0005-campaign-progression.md) records the trial rules. Lifespan exhaustion still invokes exact checkpoint restoration.

- An ordinary unsuccessful combat attempt while lifespan remains costs time and used preparation while preserving established advancement and discoveries. It does not trigger a checkpoint retry. [ADR 0008](adr-0008-optional-combat.md) records Q48-Q49; lifespan exhaustion still invokes the ordinary character/world restore while retaining the current time bank.

Consequences: the game must distinguish available elapsed/away time from activities actually simulated. Activity duration and longevity have to be understandable enough for meaningful decisions. Every supported path needs to be assessed for viable advancement with the intended exploration margin. Checkpoint placement matters when an undertaking or commitment can consume a large part of the available life.

Still open: age display units and calendar convention, exact activity-to-age conversion, lifespan extensions and other longevity rewards, the exact time-bank cap, presentation, detailed offline processing and implementation of elapsed-time accounting across retries, the automation stopping boundary for continuous activities, checkpoint creation timing, retry presentation, manual retries, consequences of any exceptional hazards outside the accepted ordinary opening-obstacle, trial, and combat-setback rules, and how much information about dangerous undertakings is exposed. The starting values accepted in Q118 below are working design values; no implementation is authorized.

Q113 selects pacing and lifespan through breakthrough 4 for further design. The [pacing draft](../../design/PACING-DRAFT.md) compares focused and exploratory workloads under these rules. Q114 establishes the reference play pattern and Q123 revises the Cloudwell target to roughly 3-5 days in [ADR 0019](adr-0019-early-campaign-pacing.md); exact activity-to-age conversion, lifespan extensions, and time-bank settings remain open.

Q116 accepts a lifespan-budget target for the specified exploratory journey through breakthrough 4: each stretch can finish with room for one further modest optional objective. Normal breakthrough extensions suffice without extra longevity rewards or the optional faster settling draught. All activity and earlier reserve use count toward carried age, including the single planned Cloudwell withdrawal. This is a target to check, not measured viability; calculated ages, lifespan extensions, and representative reserve objectives remain open. [ADR 0019](adr-0019-early-campaign-pacing.md) records the associated pacing targets.

Q117 accepts roughly 10-20 fictional years of elapsed age for the focused opening-to-Cloudwell journey, separately from its calendar pace. Q118 settles the starting age and natural lifespan below; exact time conversion and extensions remain open. This target does not change the rules for activity, pauses, bank spending, or checkpoint restoration. See [ADR 0019](adr-0019-early-campaign-pacing.md).

Q118 accepts fixed authored starting values of age 18 and natural lifespan 80: 62 years initially, without adding a character-creation system. Q119 accepts one common scale from normal activity time to fictional elapsed time through breakthrough 4. Equal normal durations have equal age costs across activities; efficiency that shortens required activity also saves lifespan. Banked acceleration shortens the player's wait while preserving the normal age cost, and pauses do not age the cultivator. The exact conversion, breakthrough extensions, activity durations, bank settings, and treatment of aging people and places remain open. See [ADR 0019](adr-0019-early-campaign-pacing.md).

Q120 accepts one-for-one bank exchange: one unused real hour stores one bank hour, and spending it supplies one hour of normal activity progress. Time already used for activity is not credited again. Q121 accepts prompt delivery to the current objective, stopping at completion or its next meaningful decision and retaining unused balance. If the bank runs out first, unfinished work continues at ordinary speed. Spending must be enabled again for another objective or a continuation after a decision pause. Normal lifespan costs and all activity prerequisites remain; the exact cap, controls, and processing implementation remain open. See [ADR 0007](adr-0007-away-time-and-acceleration.md).

Q123 accepts the compact working pace: roughly 3-5 real days through Cloudwell for the focused and specified curious journeys, preserving the current content and Q122's regular decisions. This supersedes the former 7-10-day focused and 10-14-day curious Cloudwell targets. Foundation still targets the first day; intermediate dates need alignment with the compact schedule. The full eight-breakthrough campaign's several-week target remains separate. Individual timers, prices, home effects, bank capacity, fictional-time conversion, and modeled visit settings are still provisional. See [ADR 0019](adr-0019-early-campaign-pacing.md).

## Status

Superseded by ADR-0025

## Date

2026-10-29. This records the retrofit that added the template sections; the decision itself was last updated on 18 October 2026, as the status line at the top says.

## Engine Compatibility

| Field | Value |
|-------|-------|
| **Engine** | None — TypeScript 7.0 on Bun 1.4.3, plain DOM |
| **Domain** | Core |
| **Layer** | Core |
| **Knowledge Risk** | N/A — no engine, so no `docs/engine-reference/` VERSION.md |
| **References Consulted** | None |
| **Post-Cutoff APIs Used** | None |
| **Verification Required** | None |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-0001 |
| **Enables** | None (superseded) |
| **Blocks** | None |
| **Ordering Note** | Superseded by ADR-0025, which removes age, lifespan, the fictional calendar, checkpoints and retry and voids Q116-Q119. The time-bank rules this ADR also states survive unchanged in ADR-0007. Read those two instead. |

## GDD Requirements Addressed

None. Superseded: nothing in `design/gdd/systems-index.md` is governed by this ADR. Time and tempo now follow ADR-0007 and ADR-0025.
