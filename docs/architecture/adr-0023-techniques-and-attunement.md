ADR 0023: Techniques and attunement

Status: Accepted three-verb model, the attunement slot resource and its rules; slot counts and technique effects remain provisional balance. Date: 20 October 2026. Amended 27 October 2026 after the design audits: each ridge direction teaches one attunable method, so Foundation's third place can be filled; amended again the same day: `g.<id>.attuned` reads a held method, and the hollow's Rest reward runs while *Settle the breath* is held; see **Amendment** below. Basis: the prior-review complaints recorded in the design-intent report §3.1, §3.5 and §3.6, and rules 6, 10, 11, 24, 31 and 38 of [`research/arcanum-reference/12-design-rules.md`](../../research/arcanum-reference/12-design-rules.md), and rule 74.

**Context.** Three complaints point at the same gap. The review found "nothing to climb between breakthroughs" (§3.1); it summarised a class as "teaching → demonstration → one application → stop" (§3.5); and the independent review found that at Foundation "the '3 of 4 supporting preparations' collapses to one real choice" (§3.6). Underneath all three, the opening had only one verb for a method. A family was practised, and practising it raised numbers. Nothing was ever *chosen*, held, or given up, so a route's reading of the slip could only ever be another pile of experience.

The reference separates the verbs and Lowbridge had not.

- Rule 31: **learn / memorize / cast are three verbs**, *copy*. A spell is learned once, memorized into a limited set, and cast from there.
- Rule 6: **exclusive-choice slots**, *copy*. Home, bed, mount, body, leisure, companion, equipment: one record per slot, swap to change.
- Rule 24: **slots are rare named milestones** (four in the whole game), *copy*.
- Rule 10: **entry → runway → wall**, *copy*. Rule 11: **classes are keys that count**, *copy the key/count/exclusive shape; beat the hidden-exclusion discoverability*. Rule 38: **irreversible actions confirm via `warn`**, *beat*.

**Decision.** A method has three verbs, and they are different records doing different work.

| Verb | What carries it | What it costs |
|---|---|---|
| **Learn** | A family practised along its runway, and the site or arrangement that makes a technique visible at all | activity time |
| **Attune** | `attune: true` on the technique; it must hold a place in `attune_slots` before it can be used | a place, held until released |
| **Use** | The technique itself: an instant record with a `cost` in qi and a `result` | qi, per use |

**`attune_slots` is a resource named Attunement.** Its `max` is how many methods the mind holds ready, and content raises it the way content raises any cap: the practice mat gives the first place beyond the starting one, Foundation gives another. Its `value` is how many are filled, maintained by the engine rather than authored. `attune` adds a technique to an ordered list, `unattune` removes it, and releasing a technique that is currently running stops the activity and says why. If a cap ever falls, the list truncates from the end rather than silently misbehaving. The list is authoritative saved state, part of the v6 shape in [ADR 0025](adr-0025-lifespan-and-checkpoints-cut.md).

**A technique is an instant record** (no `length`, so it never takes the activity slot; see [ADR 0022](adr-0022-chore-tempo.md)) that spends qi and pays something a chore or a run would otherwise have to wait for. The opening's three: *Steady the breath* turns two qi into four Vigor; *Carry the current* holds a turn that makes the next timed undertaking half again as fast; *Settle the breath* spends three qi sitting still for Composure and Lore. Each improves with use through its own `at` thresholds.

**The opening's choice is made here.** Carrying the current and settling the breath are the channel's and the hollow's readings of leaf eight. They `lock` each other: attuning one closes the other for good, and each carries a `warn` that says so in words before the player commits. That is rule 11's exclusivity and rule 38's *beat*: the reference keeps the consequence and hides it; Lowbridge keeps the consequence and states it. It is also the answer to §3.6: Foundation's fourth supporting pointer is *two methods held attuned*, which cannot be satisfied by more of the same work, only by acquiring and committing to a second method.

**Each ridge direction teaches one method to hold.** The four teachings on the ridge (body, sword, earth, formation) each make one attunable technique visible, costing three qi a use, carrying its direction's school key ([ADR 0024](adr-0024-route-keys.md)) and a `held` table:

| Technique | Teaching | A use pays | Held |
|---|---|---|---|
| *Sink the breath under the load* | body | 2 Strain | Life +2, Guard +1 |
| *Cut by intent* | sword | 2 whetstone grit | Strike +1, Hit +5 |
| *Read the grain* | earth | 2 veined ore | +1 ore per hand pry, max Strain +2 |
| *Fix a layout* | formation | 2 inked tokens | Rest and breath practice +25% |

Before them the opening offered three methods, two of which lock each other, so no history could hold more than two: Foundation's third place was a slot no reachable content could fill (rule 74). A ridge method is the third method any history can hold, and choosing which to hold before the bandit or a long outing is the same preparation as before.

**Divergence from a *copy* rule, with reason.** Rule 24 counts four slots in the whole reference game, arriving as rare milestones. Lowbridge opens with one attunement place and reaches two before Foundation. Reason: the slot *is* the opening's decision, not a convenience unlocked later; with no place to hold a method there is nothing to choose between the channel's reading and the hollow's, which is precisely what §3.6 found collapsing. The rarity rule is kept where it belongs. Places stay scarce enough that holding one is a commitment, and later caps are earned the same way.

**Consequences.** Availability gains a reason a player can act on: a technique that is visible, affordable and unattuned reports that it needs a place rather than failing silently. The interface needs a place to attune and release, and must show which places are filled, since a filled slot is now a cap like any other. Losing a place releases a method: taking down the furnishing that gives it asks first and names the method that would be released, and the release is logged. The validator must prove that every supported history can reach the attunement count its gates ask for (two before Foundation), and that a locked pair never leaves a history with no second method. The irreversible pair needs its `warn` text tested as well as authored.

**Supersessions.** Amends design plan Part A rule 2 and B.1: a technique is learned, attuned and used, and a class gate naming a technique means the trained family behind it. Does not change [ADR 0015](adr-0015-cumulative-class-masteries.md): mastery tags remain qualifications counted from classes, and attunement is a separate, smaller thing: a place in the mind, not a record of history. Does not change [ADR 0013](adr-0013-knowledge-and-practice.md): practice still grows only within current understanding.

**Amendment, 27 October 2026.** The audits found that Foundation granted a third attunement place nothing could fill, against rule 74 ("never grant a slot or cap that no reachable content can fill"). The ridge methods above close that gap, and the take-down confirmation now names any method a lost place would release. `bun run validate` now holds the line: the most attunement places any played route reaches must not exceed the most methods any route holds attuned at once (today 3 and 3), or it fails with "attunement places reach N, but no route holds more than M methods at once (rule 74)".

**Amendment, 27 October 2026 (held state).** The review found the hollow's Rest reward paid once the hollow key was carried, so a player who had used *Settle the breath* once and then released it kept the reward. Whether a method is held is now an expression: the engine resolves a read-only field `g.<id>.attuned`, 1 while that method holds an attunement place and 0 otherwise, read from the saved attuned list rather than stored on the stat. `bun run validate` allows it only on records with `attune`. Rest's Composure effect reads it (`0.3 * g.settle_breath.attuned`), so lying still teaches Composure while *Settle the breath* is held and stops when it is released.

Still open: the slot schedule beyond Foundation, whether releasing an attunement should cost anything, whether any later technique should occupy two places, and the balance of qi spent against what each technique pays.

## Status

Accepted

## Date

2026-10-29. This records the retrofit that added the template sections; the decision itself dates from 20 October 2026, amended 27 October 2026, as the status line at the top says.

## Engine Compatibility

| Field | Value |
|-------|-------|
| **Engine** | None — TypeScript 7.0 on Bun 1.4.3, plain DOM |
| **Domain** | Core |
| **Layer** | Feature |
| **Knowledge Risk** | N/A — no engine, so no `docs/engine-reference/` VERSION.md |
| **References Consulted** | None |
| **Post-Cutoff APIs Used** | None |
| **Verification Required** | None |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-0013, ADR-0022 |
| **Enables** | ADR-0024, ADR-0025, ADR-0026, ADR-0027, ADR-0029, ADR-0030, ADR-0033 |
| **Blocks** | None |
| **Ordering Note** | ADR-0030 raises attunement places to 4 at the First Direction and 5 at the Second, and turns one method per ridge direction into an opposed pair per sphere. ADR-0033 swaps a place-giving furnishing instead of taking it down. Cited but not listed as dependencies (superseded, or written later): ADR-0015, ADR-0024, ADR-0025. |

## GDD Requirements Addressed

No system GDD exists yet. This ADR governs Techniques and attunement in `design/gdd/systems-index.md`; trace its rules to their requirements when those GDDs are written.
