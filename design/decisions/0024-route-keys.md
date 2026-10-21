ADR 0024: Route keys

Status: Accepted key vocabulary: tag counters, the records that carry them, and the rule that later content reads keys rather than record ids. The opening's four keys are named; later slices' keys are open. Date: 20 October 2026. Basis: the prior-review complaints recorded in the design-intent report §3.2 and §3.6, and rules 1, 2, 3, 11, 15, 30, 36 and 38 of [`research/arcanum-reference/12-design-rules.md`](../../research/arcanum-reference/12-design-rules.md).

**Context.** Two complaints come from the same habit of gating on raw record ids. The adversarial review's first finding was that "a 'fully specified first slice' (`Part C`) that soft-locks at Minute 4 cannot be handed to an implementer": `fragment_notes` reached back through `shu_reading` to `lore ≥ 2`, and `channel_return` existed with nothing reading it (§3.2). The independent review's verdict was that "on both routes, the '3 of 4 supporting preparations' collapses to one real choice" (§3.6). Both were fixed by hand, and both can recur the moment a second module is authored, because nothing in the grammar said what a later record is allowed to look at. A B2 teaching that wants "someone who learned the channel's way" had no way to ask except by naming `clear_channel`, which welds the next slice to this one's record list.

- Rule 3: **expressions in data**, *copy*. History gates such as `g.evil2<=0` ("never studied") are authored, not coded.
- Rule 30: **locales are built from a shared pool; permanent-benefit encounters are tagged and filterable**, *copy*.
- Rule 11: **line tags are integers used in later gates**, *copy*.
- Rule 1: **one record vocabulary**, *copy*. Rule 2: **visibility ≠ actionability**, *copy*. Rule 36: **play generates documentation**, *copy at the scale that fits*.
- Rule 15: **hidden consequences early**, *beat: keep the consequence, surface the warning*. Rule 38: **irreversible actions confirm via `warn`**, *beat*.

**Decision.** A **route key** is a tag counter. A record lists the keys it carries in `tags`; the engine keeps `g.t_<tag>` equal to the number of owned records carrying that tag, and the `t_` prefix is reserved for exactly this. Each key is also a record of its own, so it has a name and a line of description, appears among the player's Methods when it is first held, and can be pointed at in a requirement the player can read (rules 1, 2 and 36).

**Later content reads keys, not record ids.** A gate that wants to know what a player learned asks `g.t_school_body >= 1`, never `g.clear_channel > 0`. Within one module, gating on a record id stays normal and useful; across a module boundary, the key is the seam. This is the promise a later author can keep without reading the earlier module, and §3.2's deadlock is exactly what happens when it is broken.

**The opening's four keys** divide along two axes, so a later record can ask either question:

| Key | Means | Carried by |
|---|---|---|
| `t_channel` | reads the missing turn as a current to be **carried** | Carry the current |
| `t_hollow` | reads the missing turn as a current to be **let settle** | Settle the breath |
| `t_school_earth` | a discipline that comes from stone and moving ground | Carry the current |
| `t_school_body` | a discipline that comes from breath and the frame that carries it | Steady the breath, Settle the breath |

A key counts up to two carriers, so a later method can reinforce a reading rather than only confirming it.

**Keys are carried by methods, so committing to one is the choice.** Because a key rides on a technique, holding it means attuning it ([ADR 0023](0023-techniques-and-attunement.md)), and the two readings of leaf eight `lock` each other with a `warn`. The route a player took stops being a flag they happened to trip and becomes a method they chose to hold and could have held differently. That is what §3.6 asked for, and which keeps rule 15's consequence while surfacing it (rule 38's *beat*). *Steady the breath* carries only a school key and no reading, so both routes share a foundation while differing in what they commit to.

**Divergence from a *copy* rule, with reason.** Rule 11 uses its counted tags for class lines and reads them at tier gates. Lowbridge uses the same counter, with the same arithmetic, before any class exists, for the shape of a method rather than the standing of a cultivator. Reason: §3.2 and §3.6 are first-slice failures, and waiting for classes to introduce the idiom would leave the opening with nothing but record ids to gate on. Class tags keep their own meaning under [ADR 0015](0015-cumulative-class-masteries.md); the two counters share a mechanism, not a namespace.

**Consequences.** The validator gains three checks: every `t_` key in a gate is carried by at least one reachable record; every key a record carries is read by something, so no key is the new `channel_return`; and no gate names a record id from another module. The opening's key records live in the shared content file, so a later module can be authored against them without opening `opening.json`. Keys are derived from what the player owns rather than stored, so they need no save field of their own, and a retuned carrier changes a history's keys on load. The Methods group gives rule 36 its smallest honest form: the player accumulates a readable account of what their practice is made of.

**Supersessions.** Formalises the design plan §0 dispositions for F1 (the Lore deadlock and the removal of `channel_return`) as a rule rather than a fix, and amends design plan Part C.3, where the routes' discoveries become keys carried by methods. Keeps the owner decision confirmed 18 October 2026 that the channel and hollow readings retain separate acquisition routes through B2; the `lock` between the two techniques makes that structural rather than conventional. Does not change [ADR 0003](0003-opening-anchors.md)'s route fiction.

Still open: the keys each later slice grants, whether a key should ever be read as an exclusion (`g.t_hollow == 0`, the reference's "never studied" shape), and whether the two-carrier ceiling is right once a second module exists.
