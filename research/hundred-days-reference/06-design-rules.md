# 06: Design rules Hundred Days implies

Synthesis of pages 01–05. Numbering continues `../arcanum-reference/12-design-rules.md` (rules 1–38 there; **[A n]** cites one of them) so a plan or ADR can cite either file by number. "Copy" means adopt the shape; "beat" means the fork has the right idea and a weak execution; "avoid" means it is a worked example of what not to do. Each rule names its evidence page.

The one-line verdict: Hundred Days is Arcanum's engine with a **spendable lifespan** bolted on and a cultivation vocabulary laid over Arcanum's upgrade/skill/class spine. The lifespan axis is the idea worth taking. Almost everything else is a cautionary tale about growing content without a validator.

## F. Lifespan and time (the fork's own contribution)

39. **A lifespan budget as the master resource.** `time` only rises; `age` is a budget in days (21,900 = 60 years at start) that content spends through `cost`/`result`/`run` and extends through `age`+`age.max` grants (续命). Death is an event (`g.time > g.age`) that grants a resource whose mods drain the vitals; there is no death handler. Every click is a cost, idling is meaningful, and "+5 years" is a payout a player reads without a tutorial. (02 §5, 04 §3): *copy the axis, with one sign convention and the price on the button* (rule 47).
    Lowbridge cut this axis (ADR 0025). What transfers is the *alignment*, not the mortality: the master resource is the genre's central desire, and its price is on the button.
40. **Recovery of the slow stat is the expensive act.** Rest costs 0.1 day/s; Deep Rest costs 1.7 day/s and is the only early source of the cultivation energies. Two records, a 17× price gap, and the opening's whole pacing curve. Extends **[A 23]** at zero content cost. (02 §1, §8): *copy*
41. **Windowed milestone rewards.** 风灵 pays 30 years for reaching Foundation Zero Weight within 30 elapsed years; 路远 pays 50 for reaching it between 60 and 90. "How fast did you play" becomes content with no timer UI. Neither window is shown to the player. (02 §8): *beat: keep the window, show the deadline*
42. **Prestige currency without a reset.** Achievements pay milestone points; milestone points buy centuries and caps. The Hall's function (**[A 26]**) without ever taking the save away. (02 §8, 01 Achievements): *copy if prestige is ever in scope*
43. **Stored time resurfaced as speed.** The Cultivation tab shows a Time Energy bar with 2×/4×/6× flow once offline energy exceeds 3,000; but the tick clamps `dt` to one second and throws the remainder away, so a throttled tab loses time instead of banking it, and the title bar grows a "Start Background Process" audio toggle to keep the tab awake. (01, 04 §2): *avoid the clamp; Lowbridge's `settle()` already banks elapsed time* **[A 25]**

## G. Cultivation as content

44. **One illustrated card per domain, node list beside it.** The 17 `xiulian` tag groups render as cards with a landscape and a scrolling list; a card is one `tags` value, so the view costs no new field. Better than a flat grid for a 17-branch tree. (01, 03 §3): *copy the presentation*
45. **The hidden twin as gate token.** Every cultivation node pays a same-named hidden resource (`xiulian_<id>`), and downstream `require`s read the twin, never the node. "Has been taken" is a first-class value that save, tooltip and expression handle uniformly. Lowbridge's `g.t_<tag>` is half of this. (02 §2, 03 §3): *copy*
46. **A tree must have load-bearing edges.** 120 of 193 nodes hang off a skill or a material, not another node: 62 % entry points, a shopping list with a graph's name. All 193 carry `max: 2` while the twin caps at 1, so the second purchase is unobservable. (02 §2, §8): *avoid; audit Lowbridge's technique web against this number before it grows*
47. **Price in days, show the price, one sign.** Sweep Floors spends 0.5 days, Deep Rest 1.7 days/s, `run: {time: -1.2}` means the clock runs *faster*; none of it is on the button. If Lowbridge adopts a lifespan axis the per-action cost belongs in the tooltip schema next to vigor (**[A 33]**). (02 §8, 04 §3): *beat*
48. **Name the stage ladder in the data.** The community had to invent "six major stages" because the game names none: the six keys are a resource, a furniture, an upgrade, a task and two cultivation nodes, and nothing counts them; the achievements track a different ladder (筑基窥探 → 零重 → 一重 → 二重). Lowbridge's breakthroughs are named records; keep every breakthrough the same kind of thing and visibly numbered. (02 §4, 05 §4): *beat*
49. **Keep N-of-M breakthroughs.** 筑基窥探 wants all six pointers (AND); Arcanum's 4-of-6 (**[A 12]**) is what lets a build skip the dungeon or the furniture. Lowbridge's Foundation is 3-of-4 plus a core; hold that line. (02 §3): *copy Arcanum, not the fork*
50. **Keep the education ladder.** 56 of 89 skills are hard-capped at 5 with no raiser anywhere, so two-thirds of the skill list is a one-session purchase; the `skill_extend` overlay does not replace **[A 16]**. (02 §6): *avoid the drop*

## H. Content hygiene (what the validator is for)

51. **Reachability must be checked or content silently dies.** 191 of 4,520 records, 51 % of spells, 70 % of enchants and 5 of 21 section tabs gate on ids no record defines; nothing warns at load. Lowbridge proves 109/109 reachable by playing the engine (`bun run validate`); the fork is what the alternative looks like. (03 §7): *keep the gate unforgiving*
52. **A `require` must narrow.** `require: "g.heli"` evaluates a record object and is always true once the resource exists, so Cultivation and Spells open ten minutes before they are usable with no `need` text; `g.hp>=1` appears 23 times as a no-op. A validator check that every `require` is false in the start state is cheap. (02 §1, 03 §4): *copy the check*
53. **Bare-id gates that can mean record *or* tag are a trap.** `unlockTest` cannot tell them apart, so deleting either breaks every gate that named it, silently. Lowbridge already rejects a record id equal to a tag and keeps `g.t_<tag>` distinct from `g.<id>`. (03 §4, §7): *confirmed*
54. **Irreversible choices must say what they close.** 112 records carry `warn: true`, but the flag selects one global string ("This action is irreversible. Continue?"); the cat chain and the Seeker/Commander fork delete branches the player learns about from the wiki. Lowbridge's `warn` should carry per-record text naming the branch. Extends **[A 15]**. (05 §4, §Lowbridge): *beat*
55. **One vocabulary, interpreted; never one verb per type.** The fork added 31 content types by adding field names to four lists, then grew eleven near-identical verbs in `game.js` (`xiulian`, `lianhua`, `hechengzh`, `touru`…) and a separate update loop per type. Arcanum keeps one vocabulary and one loop. Lowbridge's "follow the existing record vocabulary before adding fields" is exactly this discipline. (04 §4, §Lowbridge): *avoid the sprawl*
56. **Mini-languages beget mini-languages.** `scena`'s `check: "money,600"` is a bespoke CSV condition beside a working expression parser. Any future dialogue condition is an `Expression`. (03 §7): *avoid*
57. **A rich expression grammar goes unused.** 97 % of 2,674 expressions are `g.<id> >= n` joined by `&&`; no arithmetic, one expression-valued cost. Every operator offered is a maintenance cost whether or not content uses it. (03 §4): *price the grammar accordingly*
58. **Closed lists for free-text enums.** 32 resource groups including an empty string, a case typo and a `cultivation` beside `Cultivation`. Lowbridge's 15 groups are tidy only by habit; `group` is free text in `validate.ts`. (03 §5): *copy the warning*
59. **Unloaded files, unlisted modules and `>=999` gates are content rot.** Eleven unloaded files, a tab gated at `g.shenshi_4>=999`, `hall.json` and 35 Arcanum gem/rune resources still shipped. (02 §8, 03 §1): *avoid; the reachability gate catches it*

## I. Documentation and community

60. **Generate a per-record wiki with reverse links from the content JSON.** 2,338 of the wiki's 2,698 pages are generated: requirement (rendered *and* raw expression), costs, results, mods, then *prerequisite-of*, *max-affected-by*, *rate raised by*, *rate lowered by*, *obtainable-from*, kept even when empty. Every edge is one `scripts/validate.ts` already walks. (05 §1, §Lowbridge): *copy as a validator emit, all-or-nothing*
61. **Guide quests are paid content.** The TAB guide is `missions.json`: each quest has an objective, a cost and a coin reward, in the same vocabulary as everything else. (01): *copy once chapter one needs a guide*
62. **Document the mechanics the engine implies but never states.** Conquest's "combat rating > defence" is a disabled button; the officialdom ticket is a 0.02-per-encounter accrual the FAQ misread as a rare drop; the clicker content is balanced around holding Enter (~20 clicks/s). (05 §4): *copy: state the rule in the tooltip or the reference*
63. **Hand-written stubs are not documentation.** 296 of 360 hand-written wiki pages are 17-character stubs, 22 % of which match no live record. Design notes belong in `design/`; record facts belong to the generator. (05 §3): *avoid*
64. **Chrome and monetisation stay out of content.** Ad markup inside the landing and tips pages travels into every export and translation. (05 §Lowbridge): *avoid*

## J. Shell

65. **Three clocks.** Time (days), Life (years remaining, percent spent), Play Time, always visible in the runner column. (01): *copy the Life clock when the lifespan axis lands*
66. **Search once a list passes ~50 records.** Dwelling searches by tag, result or name over 325 furniture. (01): *copy at that size*
67. **Phone layout is not optional.** The fork never touched the CSS below ~1000 px; at 390 px the columns overlap and bars are cut. Arcanum does not reflow either (**[A 37]**, A/01 Mobile), so neither reference is a phone model. (01): *avoid*
68. **One notice channel.** Three permanent coloured strips, a 3-s toast, a news ticker and a bottom hint band compete on the first screen. (01): *avoid*

## K. Licensing (binding on us, not a design rule)

69. **The fork carries no licence and no MIT notice.** Arcanum is MIT (Justin Lacy, 2020); `Mostlai/Hundred-days` and `MaxRau/Hundred-days` ship 149 of 184 Arcanum engine modules with no LICENSE, no notice, and no licence of their own. Nothing in either repository may be copied into `src/`; mechanics are ideas and remain fair to learn from. This page and its siblings are description, not reuse. (04 §7)

## What the two references say together

- Arcanum rules **[A 1–9]** (one vocabulary, visibility ≠ actionability, expressions in data, mod patching, resources carry mods, exclusive slots, repetition curves, sections as records, delta saves) all survive the fork intact; the fork is the second data point that the vocabulary stretches to 4,520 records and 57 types. (03 §2, §6)
- The fork independently reaches for `X.mod.Y` against a **cost table** (`scost`) so each purchase raises the next price: escalating prices without authoring a curve, already supported mechanically by Lowbridge's `recompute`. (03 §7): *copy when a price needs to escalate*
- Where the fork diverges from Arcanum it is almost always worse (AND breakthroughs, dropped education, clamped tick, no phone layout) except for the lifespan axis, the hidden twin, the card view and the generated wiki. Those four are the reason this folder exists.
