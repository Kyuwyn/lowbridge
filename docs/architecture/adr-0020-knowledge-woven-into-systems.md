ADR 0020: Knowledge woven into every system

Status: Accepted campaign-wide content rule; the first-slice magnitudes are provisional balance. Date: 19 October 2026. Basis: the owner's direction after the knowledge tooltip review, extending [ADR 0013](adr-0013-knowledge-and-practice.md) and design plan §1 ("every level pays a small passive bonus").

A knowledge is understanding of one subject, and every level should improve the work of that subject wherever it appears: the chores, trades, outings, practice, techniques, breakthroughs, crossings, encounters and stores that touch it. A knowledge whose only role is to gate other records, or whose only effect is a larger store, is incomplete. New systems name which knowledges reach into them; new knowledges name which existing systems they reach.

The player learns a knowledge from two separate parts. Its description is a single line of flavor. Its mechanics come from content: what each level gives, what currently teaches it, and what raises its limit. The interface does not list the levels at which other records open; finding those is part of play, and a visible action already states its own requirement.

| Knowledge | Reaches |
|---|---|
| Lore | Copying the slip; reading the ridge's inscription and layout diagrams; the cost of the porters' notes. |
| Qi Sense | Qi capacity and return; the channel and Fernhollow visits; Steady the breath's Vigor; qi spent. |
| Circulation | Vigor capacity and return; Settling; the Body direction and its crossing; Life, Strike, Guard, Hit and Dodge. |
| Herb Lore | Herb storage; herbs spent on every bill; the survey ground; the price of marrow herbs. |
| Labour | Vigor capacity, return and Vigor spent; timber carried. |
| Stone Sense | Stone storage and stones spent; clearing the channel; practice at the channel stones; the stable observation point. |
| Composure | Qi gathering; the breath method; Strain capacity, return and drawing. |
| Blade Intent, Ground Reading, Array Craft | Their path's material storage and price; their direction and its crossing; Blade Intent also adds Strike. |

A discount can sit on an action, reducing everything it spends, or on a resource, reducing that resource wherever it is spent; a resource discount reaches new systems without naming them. Discounts stack, and nothing costs less than half its listed amount.

Knowledge levels keep rising across the campaign's eight chapters, so what a level may give depends on how long its target lasts:

- **Per level:** capacity; speed, output and discounts on the knowledge's own chapter's actions, which that chapter's content bounds; and flat regeneration. Capacities grow chapter by chapter, so a flat return matters most early and fades without a ceiling.
- **Milestones only:** effects that last the whole game and scale with everything later content adds: a resource discount, or a speed bonus on an action that never closes, such as Rest. A milestone sits at a stated knowledge level (`at` on the knowledge), so each chapter adds a known amount. The first slice's are 10% off one resource each: Qi Sense 3 (qi), Herb Lore 2 (herbs), Labour 3 (Vigor), Stone Sense 2 (stones), Composure 2 (Strain).

Tooltips list milestones with their levels, since they are the knowledge's own rewards rather than other records' unlocks.

Every path's ridge site is also sped by one opening knowledge (Lore for the inscription and the layout, Herb Lore for the survey ground, Stone Sense for the stable point), so what the opening taught carries onto every path. The Body path's own knowledge is Circulation. Fights read Circulation and Blade Intent through Strike, Guard and Life ([ADR 0026](adr-0026-combat-exchanges.md)).

Effects stay small because direct play is paced by ordinary activity: the measured direct routes must remain inside the opening's 35-45-minute Foundation window and the ridge's 90-240-minute waystation window, which `bun run validate` enforces. Saves from versions 3 and 4 are credited for knowledge levels and milestones already earned.

Still open: per-level effects for knowledges introduced after the first slice, and balance beyond the measured routes.
