ADR 0010: Optional sect membership and recurring relationships

Status: Eighth design checkpoint. Sect participation and relationship scope accepted; institutions, characters, and concrete arcs remain in design. Date: 16 October 2026. Basis: explicit answers Q52-Q53.

| Decision | Accepted direction |
|---|---|
| Joining a sect | Optional membership. Joining offers distinctive teaching and opportunities; a cultivator on any of the three paths can still reach ascension independently. |
| Relationships with individual characters | A small recurring cast. Shared experiences and consequential choices develop relationships and open further stories or leads. |

The opening remains an ordinary mortal's village foothold, followed by self-reconstruction of a shared foundation and local encounters with cultivators. The new decisions extend that journey; they do not require opening sect membership or change the timing of path commitment.

Design consequences: choosing a cultivation path and joining a sect are distinct commitments. Body Tempering, Intent, and Formation each need a viable independent route to ascension, alongside the established noncombat progression rule. Sect teaching and opportunities should provide worthwhile reasons to join without making membership an indispensable advancement condition. This does not require every sect to teach every path.

The recurring cast should develop through authored experiences and choices, with useful continuity as the player returns to familiar regions. Specific character roles and arcs remain to be written. These decisions do not introduce mandatory daily attendance, a faction currency, repeatable relationship maintenance, a relationship meter, or an NPC simulation.

Still open: the number and identities of sects and characters, membership benefits and terms, obligations and leaving rules, concrete teaching, relationship arcs and their consequences, event triggers, and how relationships reflect the passage of in-world time. Specific institutions, characters, and scenes remain to be developed.

[ADR 0011](adr-0011-presentation-and-platform.md) records the subsequent presentation and platform decisions; the [campaign outline](../../design/CAMPAIGN-OUTLINE.md) consolidates the current scope. See [ADR 0004](adr-0004-wider-world-and-paths.md) for path commitment, [ADR 0005](adr-0005-campaign-progression.md) for noncombat progression, and the [brief](../../design/BRIEF.md) for the full accepted direction.

## Status

Accepted

## Date

2026-10-29. This records the retrofit that added the template sections; the decision itself dates from 16 October 2026, as the status line at the top says.

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
| **Depends On** | ADR-0001, ADR-0005 |
| **Enables** | ADR-0014, ADR-0016, ADR-0018 |
| **Blocks** | None |
| **Ordering Note** | Sects are outside the current slice (CLAUDE.md): this records design intent for a later slice and nothing implements it yet. Its three-path wording is overtaken by ADR-0014 and then ADR-0030. Cited but not listed as dependencies (superseded, or written later): ADR-0004. |

## GDD Requirements Addressed

No system in `design/gdd/systems-index.md`: sects are outside the current slice. Trace this ADR when a sect system is designed.
