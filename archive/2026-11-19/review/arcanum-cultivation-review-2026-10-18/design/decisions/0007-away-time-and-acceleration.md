ADR 0007 — Away time and acceleration

Status: Accepted bank accrual, one-for-one exchange, prompt spending, and retry rules; exact capacity, presentation, and implementation remain in design. Updated 18 October 2026. Basis: explicit answers Q43–Q47 and Q120–Q121, alongside the accepted activity stopping and aging rules.

| Decision | Accepted direction |
|---|---|
| Unused away time after a stop | Bank time remaining after a configured activity reaches its objective or an expedition pauses at a meaningful discovery while the player is away. |
| Purpose of the bank | Accelerate activities chosen by the player. |
| Exchange — Q120 | One unused real hour stores one bank hour; spending one bank hour supplies one hour of normal activity progress. |
| Delivery — Q121 | Apply stored progress promptly to the current objective or next meaningful pause, preserving unused balance. If the bank runs out, unfinished activity continues at ordinary speed. |
| Accrual while no activity runs | Unused real time builds the bank whether the game is open or closed, up to its cap. Completed objectives, meaningful-choice pauses, and voluntarily stopped activities all qualify, including absences begun without an activity. Time used to advance an activity is not also credited. |
| Storage limit | A generous fixed cap allowing a few days of stored time without needing upgrades. Tune the exact amount through playtesting. |
| Spending instruction | Enable acceleration for the current activity. It ends at the objective or a meaningful pause, and must be enabled again for the next activity. |
| Lifespan during acceleration | Accelerated activities consume lifespan normally. Merely storing time does not age the cultivator. |
| Bank across checkpoint retries | Keep the current bank balance. Restore character and world state exactly; spent banked time stays spent, and later accumulated time is retained. |

Q120 accepts one-for-one bank exchange: one unused real hour stores one bank hour, and spending it supplies one hour of normal activity progress. Time already used for activity is not credited again. Q121 accepts prompt delivery to the current objective, stopping at completion or its next meaningful decision and retaining unused balance. If the bank runs out first, unfinished work continues at ordinary speed. Spending must be enabled again for another objective or a continuation after a decision pause. Normal lifespan costs and all activity prerequisites remain; the exact cap, controls, and processing implementation remain open.

The existing activity contract continues to apply. One primary activity runs at a time. Home activity stops at its chosen objective; an expedition pauses when a discovery creates a meaningful new choice. Automation stops before exhausting lifespan. Banking time does not choose a subsequent activity. Spending requires the player to enable acceleration for the current objective; the instruction does not carry into the next activity.

Design consequences: distinguish real time spent advancing configured work from the unused portion banked for later, consistently whether the game is open or closed. The same portion cannot both advance work and be newly credited to the bank. Acceleration must preserve the ordinary consequences and stops of the activity it advances. Several-week campaign pacing remains an untested target and must be assessed with the fixed storage cap and acceleration for individual objectives in place. A few days of capacity is the accepted direction; its exact value remains untested.

Still open: the exact storage-cap value, activity-to-fictional-time conversion, control presentation, detailed offline processing, and concrete save/accounting implementation. Q121 selects prompt delivery with no substantial extra wait, so a fixed playback multiplier is not needed for the accepted spending model. Brief presentation feedback remains open.

Q46 explicitly distinguishes the bank from character and world state restored by a checkpoint. Retrying does not refund banked time spent during the unsuccessful stretch or remove time accumulated afterward. This boundary also applies before the first breakthrough, when character and world state return to the opening starting state. The implementation must preserve elapsed-time accounting so a restore does not credit already processed time again. Character discoveries, skills, purchases, and other post-checkpoint gains still rewind under the ordinary retry rule.

[ADR 0008](0008-optional-combat.md) records the subsequent optional combat control and setback decisions. The [brief](../BRIEF.md) tracks subsequent economic and social scope decisions. See [ADR 0002](0002-lifespan-and-retries.md) for aging and retries and the [brief](../BRIEF.md) for the full accepted campaign direction.
