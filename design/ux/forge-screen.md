# UX Spec: Forge Screen

> **Status**: Approved 2026-11-22 (lean `/ux-review`; findings in `design/ux/reviews/forge-screen-review-log.md`)
> **Author**: designer + Claude (`/ux-design forge-screen`)
> **Last Updated**: 2026-11-22
> **System**: #15 in `design/gdd/systems-index.md` (MVP, UI, Wave A)
> **Journey Phase(s)**: the first screen (choosing a method), gathering and planning, the forge, and after the forge. No player journey map exists yet (Open Questions)
> **Platform Target**: web browser, desktop first. Phone width (390 px design width; holds at 320 px) is a layout constraint from the MVP; Phone layout (#17) delivers it at the vertical slice. Inputs: mouse, keyboard and touch. No gamepad (#13 Platform Target)
> **Template**: UX Spec
> **Implements Pillar**: 1 (The forge is the milestone) and 3 (The build is a problem); supports 2 (Methods matter) and 4 (No dead ends, no attention tax)
> **Binding inputs**: systems index paragraph and row 15; Forge and proving #6 (UI Requirements 1–8, G1, G7, G8, G10, G13); Methods #7 (UI Requirements 1–2 and 5, W1, W7); Save and run lifecycle #11 (UI Requirement 5, D7); Interface shell #13 (Seams, C1, C2, C16, C17); Method marks #14 (MK1–MK10, BD1–BD9); `design/ux/interaction-patterns.md` (IP1–IP23, PD1–PD19, Gaps 1–12); `design/accessibility-requirements.md` (Comprehensive, WCAG 2.2 AA)

Rules this spec fixes are numbered **FS** (the designer's decisions, below) and its components
**FC**, so stories can cite them ("#15 FC8"). Numbers in examples are #6 S9's provisional content
under Ember Breath unless a line says otherwise.

**Designer decisions taken in this spec's session (2026-11-22):**

| # | Question | Decision | Gap |
|---|---|---|---|
| FS1 | How the Forge view's blocks are arranged | **One column at every width**, in one fixed order. The pick chips sit directly above the preview | — |
| FS2 | The control that picks four of six, and a fifth pick | **Pick chips above the preview**: six native checkboxes in the plan block. With four picked, the rest stay focusable and `aria-disabled` with their reason (PD10). Forge shows only when the plan can be forged; otherwise its place holds the reason in words | 1 |
| FS3 | How the two method columns fit | **Side by side when the block is at least 600 px wide**, stacked below that, in content order. Each column ends with its own "Begin circulating {method}" | 2 |
| FS4 | Where an ingredient's routes are listed | **IP13 action rows under each planned ingredient not yet in hand**, with Start when Ready. No other ingredient lists routes on the view | 11 |
| FS5 | What the preview shows before all four are in hand | **The door rows stay**, each with the neutral withheld glyph and "not yet shown", under one lead sentence | 3 |
| FS6 | How the preview's breakdowns are reached | **One Plan card**, opened by the preview's heading, laid out as #13's Goal card after the forge and read from `preview` | — |
| FS7 | The order of the held makeups | **Most seals first**, ties in the realm's ingredient order | 4 |
| FS8 | The headroom signal | **A realm-fact line from the commit on, plus "Your best in hand"**, repeated in the forge confirmation when the plan earns fewer. Plain text, not a record | 5 |
| FS9 | Where the last-run line shows | **At the head of the Forge view in every phase**, whenever #11 holds one | — |
| FS10 | Words for composed numbers | **"gathered"** (an affinity's total), **"after clash"**, and **"proof"** (a door's score) | 8 |
| FS11 | The affinity and door-tier glyphs | **Geometric, with opposed pairs inverted**: Cinder ▲ and Bark ▼, Jade ■ and Gale ◆. Tiers reuse #13 C1's seal pairs; "withheld" is two short dashes | 7 |
| FS12 | The accent before the commit | **None.** Hollow glyphs and both "Begin circulating" buttons stay in ink. The tint first appears in the commit's frame | 6 |
| FS13 | Whether the plan is saved | **No.** The plan is interface state: a reload, a new run or a loaded save clears it. #11's format is unchanged | 12 |
| FS14 | A refused commit or forge inside its dialog | **The dialog closes as on success**, nothing changes, and the reason shows as a `status` line at the opener (or under the view heading if the opener is gone), where focus returns | 10 |
| FS15 | The forge's visual moment | **Tinted channels converge**: in the forged view, channel lines in the circulating tint run from the four forged names to the seals, and the three doors' seals settle together. It ends within 400 ms (AR-V6, which answers the motion-cap half of gap 9), and none plays under reduced motion | 9 |

---

## Purpose & Player Need

**The player arrives wanting to compose a Foundation.** First they choose a method. Then they see
what the ingredients they hold make together under it, and they forge the best four they can
find. The Forge view is "the screen the prototype was" (systems index, paragraph 15). In each
phase it answers, without the player leaving it:

1. **Before the commit: what does each method change?** Both methods side by side, with every
   feed, quench, open and close (#7 UI Requirements 1).
2. **What do the ingredients I hold give under my method, and how do they clash?** Each held
   ingredient's contribution, and the held part of the plan's affinities and clashes, before any
   seal can show (#6 G7.3; Player Fantasy, promise 3).
3. **What would these four make?** Each door's tier, the seals and the widened stores, shown only
   once all four are in hand (#6 G7, UI Requirements 2).
4. **Is there a better Foundation?** The headroom signal, which never names the makeup (#6 G7.4,
   UI Requirements 4).
5. **Where does a missing ingredient come from?** Its routes under the method, by family, with
   their times (#8 UI Requirements 4; #7 UI Requirements 5).
6. **After the forge: what did I make?** The Foundation, each door's tier and what lies beyond it
   (#6 UI Requirements 6).

**Why it exists.** Pillar 3 says the best Foundation for a method is not obvious, and a better
one can be found. The forge prototype's one tester forged a makeup worth 3 seals while one worth
4 existed, and did not look for it (CD-PLAYTEST concern 2). The MVP judges the screen with the
signal "Compares before forging": at least three full makeups are previewed before the first
forge, and the makeup forged is one of them (concept, MVP Definition). The screen therefore has
two jobs. It makes comparing held makeups cheap, and it says plainly when a better Foundation
exists.

**What would go wrong without it.**

- The plan would live in the player's head. Six ingredients make 15 makeups, each tested at
  three doors under one of two methods (accessibility requirements, Per-Feature Accessibility
  Matrix rows 6 and 7: a cognitive load above four, carried by this screen).
- The method choice would be blind. Pillar 2's design test needs the player to see what each
  method changes before committing to it.
- The forge would be one irreversible tap with no account of what it consumes (rules 38 and 54).

**The anchor moment** (#6 Player Fantasy). The player holds three ingredients of a plan and is
about to gather the fourth. The Forge view shows what the three contribute under the method, and
shows that the one they meant to fetch would clash with the second. The plan changes quietly,
before any seal is shown.

**What it holds and what it does not.** The Forge view holds no rules. It calls the pure
functions of Forge and proving (#6 G1: `preview`, `previewable`, `bestSeals`) and of Methods
(#7 W1: `commitDialog`, `routes`). It sends exactly two rules actions, `commit(m)` and
`forge(makeup)`, through #13's dialog container. The plan, the method shown before the commit and
the open card are interface state. Whether the plan is ever saved is decided under States &
Variants.

**Player-need test.** A tester who holds five ingredients can say, from the Forge view alone and
without opening a card, which held makeup earns the most seals, whether a better Foundation
exists, and which route would bring the sixth ingredient.

---

## Scope, Seams and Reference Rules

### What this spec owns

Everything inside the Forge view, which #13 places as a centre view beside the Road (#13 Seams,
row "Forge screen (#15)"):

- the method-choice view, and the words of the commit dialog;
- the plan of four, and the preview of the plan's Foundation;
- the list of held makeups, and the headroom signal;
- the per-ingredient contribution rows and their route lists;
- the forge confirmation's words, and the forge's visual moment;
- the forged view inside the Forge view;
- the last-run line (#11 UI Requirements 5);
- the accent before the commit, the four affinity glyphs and the door-tier glyphs (#14 MK2, MK4;
  systems index, paragraph 15);
- the player-facing words for the forge's composed numbers (#6 UI Requirements 8; #14 BD5);
- **for the Wave A checkpoint only**, the goal line and the instruction lines, built from #13's
  components C1 and C2 (Wave A hand-over, below).

### Seams with the other interface specs

| With | This spec owns | The other spec owns |
|---|---|---|
| Interface shell (#13) | The Forge view's contents and order. The words inside the commit dialog and the forge confirmation. The Wave A copies of C1 and C2 | The frame and the Forge view's place in it: the view tabs (C9), the skip link, and the switch to the Road on `committed` (AC-13-08). The detail container (C16): how it opens, closes, scrolls and holds focus, and its field order. The dialog container (C17): its frame, focus, Cancel placement and busy state. The goal line and instructions after Wave A. The persistent display of the Foundation (C1 after the forge, the Goal card). Number and duration formats |
| Method marks (#14) | Where marks sit in the Forge view. The words that replace #14 BD5's provisional names for composed numbers. The affinity and door-tier glyphs, drawn under #14 MK2's silhouette rules. Whether hollow glyphs take a colour before the commit (#14 MK4) | Every mark's look (MK1–MK10), the glyph sheet, every breakdown's contents (BD1–BD9) and the drill-down rules (BD6) |
| Phone layout (#17), vertical slice | The Forge view's narrow form, which is a constraint from the MVP | Delivery and polish. #17 may refine the narrow form but may not drop one of this spec's GDD requirements from it |
| Accessibility and settings (#18), vertical slice | This screen's share of the committed tier | Settings beyond the browser's own |
| GDDs #6, #7, #11 | Display only | Every rule, every legality check and every generated line |

**The Wave A hand-over** (#13 Seams; #13 Open Questions 14). At the forge-and-methods checkpoint
the shell does not exist yet. The Forge view therefore carries the goal line and the three
instruction lines at its head, built from #13's C1 and C2, with #13's rules and strings, so the
player relearns nothing when the shell lands. When the shell lands, both move into the goal band
and the Forge view drops its copies. The checkpoint's stub sources (timed buttons, systems index
Overview) are the build's, not this spec's.

### Reference rules

Rule numbers refer to `research/arcanum-reference/12-design-rules.md` (1–38, 70–74),
`research/hundred-days-reference/06-design-rules.md` (39–69) and Magic Research 2's rules 75–100
as #13 and #14 cite them. "#n" is a system in the systems index. Quoted player-facing text is
provisional copy, checked by review (Acceptance Criteria).

| Rule | Source, tag | In this spec |
|---|---|---|
| 1 One vocabulary; render by field | Arcanum, *copy* | Every card the view opens renders by field (#1 UI Requirements; #13 C16) |
| 2 Visibility is not actionability | Arcanum, *copy* | Every ingredient and route is listed in every phase, with what it lacks in words |
| 12 Tier-up = N-of-M plus a bill, with locks | Arcanum, *copy* | **Diverged, by the concept:** no bill and no lock (#6 Overview). The N-of-M shape is kept (rule 49) |
| 15 Hidden consequences early | Arcanum, *beat* | The commit dialog names everything it closes. The forge confirmation names what it consumes and that there is no reforge |
| 27 Leaving keeps progress; death costs time only | Arcanum, *copy* | A shut door is a tier of 0, never a penalty (#6 G8.5). Shut has no failure styling |
| 33 One tooltip schema | Arcanum, *copy* the schema, *beat* hover-only | Records open #13's one container by tap, click or Enter (IP1). Hover opens nothing |
| 38 Irreversible actions confirm | Arcanum, *beat* | The commit and the forge confirm in IP3, with no delay and no hold |
| 49 Keep N-of-M breakthroughs | Hundred Days, *copy Arcanum, not the fork* | A plan is four of six ingredients |
| 54 Irreversible choices say what they close | Hundred Days, *beat* | Generated "Closes:" lines and the redo line in the commit dialog (#7 W7.3) |
| 67 A phone layout is not optional | Hundred Days, *avoid* the reference | The narrow form is specified now |
| 70 Flavour comments on the mechanic | Arcanum, *copy* | A door's `flavor` shows once the realm is forged (#6 G13.4) |
| 71 Identity lives where the numbers live | Arcanum, *copy* | The method's marks sit on exactly the contributions it changes (#14 MK1) |
| 73 A closing fork must differ inside the stage that offers it | Arcanum, *avoid* the reference | The method columns show the difference inside this realm: different routes, and different contributions at this forge |
| 97 Every number explains itself | Magic Research 2, *copy* | Through the record, not the number (#13 and #14's stated divergence, D3) |
| 99 One goal line, one event channel | Magic Research 2, *copy* | The forge's result reaches the log through #13's channel. Nothing here pops up |

---

## Player Context on Arrival

No player journey map exists, so these contexts are reasoned from the concept and the GDDs
(Open Questions).

| Arrival | When | Just before | State of mind | What the Forge view must give |
|---|---|---|---|---|
| **The first screen** | A run start, in Choosing (#11 D6.1). The Forge view opens first (#13 Navigation Position) | Nothing: the player opened the page | Curious, at risk of the prototype's lost run | The two methods side by side and what each changes. Nothing urgent: the slot rests and banks breath while they read (#7 W10) |
| **A new run under the other method** | `newRunStarted` after a forged run | The new-run dialog | Comparing two ways of being a cultivator | The last-run line, framed as what the other method made, never as a best to beat (#11 UI Requirements 5) |
| **Gathering, with fewer than four in hand** | Committed; the player switched to the Forge tab | A unit paid an ingredient (#9: "the held mark updates … in #15's ingredient list") | Planning ahead | What each held ingredient gives, the held part's clashes, and where each missing ingredient comes from |
| **Four or more in hand** | #13's next-step line: "compare makeups on the Forge tab, then forge" | A route paid an ingredient | Analytical, comparing (MVP signal: three makeups previewed) | Every held makeup with its seals, and whether a better Foundation exists |
| **The forge** | The player opens the confirmation | Comparing | Weighing the run's second irreversible act (#6 Game Feel) | The four consumed, the seals, the widened stores, and that only a new run forges again |
| **After the forge** | `forged` | The confirmation | Satisfied or reflective | The Foundation, each door's tier and what lies beyond it (#6 G13) |

**Emotional assumption: calm and deliberate.** Choosing costs nothing, and the slot banks rest
meanwhile (#7 Game Feel). The forge has no clock (#6 Overview). Nothing on this screen hurries
the player, flashes or times out.

**Voluntary arrival.** The player arrives by the Forge tab, or because the Forge view is the
default before the commit and after a new run (#13 Navigation Position). The game moves the
player away from it once: to the Road, in the frame of the commit (#13 AC-13-08).

---

## Navigation Position

This screen lives at: page load → session gate → shell → centre view **Forge** (#13 Navigation
Position). It is a top-level destination, always one tab away: the view tab Forge in the centre
on wide screens, and in the bottom tab bar on narrow ones (#13 C9, IP4).

- **The default view** before the commit, and after a new run or a loaded save (#13 Entry & Exit
  Points; PD16).
- **Overlays it opens:** #13's detail container (IP1), for every record the view names, and #13's
  dialog container (IP3), for the commit dialog and the forge confirmation.
- **No sub-screens.** The method-choice view, the plan, the preview and the forged view are
  states of this one view (States & Variants), never separate screens.
- **At the Wave A checkpoint** there is no shell, and the Forge view is the build's main screen.

---

## Entry & Exit Points

| Entry source | Trigger | Player carries this context |
|---|---|---|
| Page load, first game | No save, so a run start (#11 D6.1) | Choosing. Nothing held. No last-run line |
| New run confirmed | #13's menu or Refused screen (#11 D6.2) | Choosing. The last-run line, if the cleared run was forged (#11 D7.1) |
| Load save confirmed | #13's menu (#11 D9) | The loaded run in whatever phase it holds |
| The Forge view tab | A tap, click or Enter on the tab (#13 C9) | The current phase, with the view's own scroll position kept (IP4) |
| #13's next-step line | It names the Forge tab once at least four ingredients are in hand (#13 C2) | No link: the line names a step, and the tab is the way in |

| Exit destination | Trigger | Notes |
|---|---|---|
| The Road | The view tab, at any time | Nothing changes but the view |
| The Road, by the game | `committed`, in the frame of the commit (#13 AC-13-08) | **Irreversible.** The commit closes the other method and its routes for the run (#7 W7.8). The dialog names each |
| The forged view, in place | `forged`, from the forge confirmation | **Irreversible.** It consumes the four ingredients and fixes the Foundation for the run (#6 G8). The confirmation names each. The view stays on the Forge |
| A card or a dialog | A record, "Begin circulating {method}" or Forge | Overlays. Closing one returns focus to its opener (IP1, IP3) |

---

## Layout Specification

### Information Hierarchy

Ranked by what the player must read first. The rank sets prominence, not position (FS1 fixes
the position).

**Choosing** (no method committed):

| Rank | Item | Why |
|---|---|---|
| 1 | **The two methods**, each with what it feeds, quenches, opens and closes | The run's first decision (#7 UI Requirements 1) |
| 2 | **"Begin circulating {method}"**, one per method | The only way forward (#13 C2 line 3) |
| 3 | The plan and the ingredients, with each method's deltas only | Plans can be built before the commit (#7 W10), but nothing is held |
| 4 | The last-run line, if any | A comparison for the player choosing the other method (#11 UI Requirements 5) |

**Open** (committed, not forged):

| Rank | Item | Why |
|---|---|---|
| 1 | **The plan**: which four, and either what it lacks, in words, or Forge | The decision this screen serves (#6 UI Requirements 1) |
| 2 | **The Foundation preview**: the held part's affinities and clashes; once all four are in hand, each door's tier, the seals and the widened stores | The anchor moment and the reveal (#6 Player Fantasy, Game Feel) |
| 3 | **The headroom line**: the best here, and the best in hand | CD-PLAYTEST concern 2 (FS8) |
| 4 | **The ingredients**: each one's contribution under the method, and the routes of each missing one | Planning backwards (#8 UI Requirements 4) |
| 5 | **The makeups in hand**, most seals first | Comparing what is held (#6 UI Requirements 3) |
| 6 | The last-run line, if any | Comparison, never a target |

**Forged** (the realm has a snapshot):

| Rank | Item | Why |
|---|---|---|
| 1 | **The seals and each door's tier** | The verdict (#5, "The Foundation proves itself") |
| 2 | Each door's `flavor`: what lies beyond it | The concept's "locked source" past the forge (#6 G13.4) |
| 3 | The four ingredients, the affinities and stats, the widened stores | What was made (#6 G13.3) |
| 4 | The last-run line, if any | Comparison |

**Discoverable on a tap** rather than shown: every breakdown (in the Plan card, the Goal card and
the ingredient and source cards), each ingredient's base contribution trail, the closed routes of
an ingredient (its card's Sources block), a route's creature and the four stats on each side (its
Source card), and the method's `commitText` (in the commit dialog).

### Layout Zones

The Forge view lives in #13's centre zone: Z4 on wide screens (fluid, at least 440 px) and N3 on
narrow ones (designed at 390 px, holds at 320 px). It scrolls vertically inside that zone and
never sideways (IP23). **It is one column at every width (FS1)**, so the blocks below stack in
this order and the order never changes with width:

| Block | Contents | Shown in |
|---|---|---|
| F0 View heading | "Forge", a heading one level below #13's frame | Every phase. The skip link's target (PD15) |
| F1 Goal block | #13's goal line (C1) and instruction lines (C2), unchanged | **The Wave A checkpoint build only** (Scope) |
| F2 Last run | The last-run line (FC4) | Every phase, while #11 holds `lastRun` (FS9) |
| F3 Methods | The two method columns (FC5) | Choosing |
| F4 Headroom | The headroom line (FC6) | Open |
| F5 Plan | The plan block: count, six pick chips, the reason line or Forge (FC7) | Choosing, Open |
| F6 Preview | The Foundation preview (FC8) | Choosing, Open |
| F7 Ingredients | The affinity key and six ingredient rows, with route rows under planned ingredients not in hand (FC9) | Choosing, Open |
| F8 Makeups in hand | The list of held makeups (FC10) | Open |
| F9 The Foundation | The forged view (FC13) | Forged, in place of F3–F8 |

**Width inside the column.** Two blocks rearrange on their own width, never on the page's (FS3).
At a block width of at least `FORGE_SPLIT_MIN_PX` (600 px):

- F3's two method columns sit side by side, Ember Breath at inline-start, at equal widths;
- F5's six pick chips sit in one row.

Below it, F3's columns stack (Ember Breath first) and F5's chips wrap in rows of three. On a
1440 px window the centre is about 936 px, so both split. At 960–1103 px the centre is under
600 px, and both stack, as at 390 px.

**Height at 390 × 844.** #13 gives the content zone at least 460 px after the commit (AC-13-24).
F5 and the first lines of F6 fit in it with no notice showing: the plan heading and count (1 line),
two rows of chips (each two lines), the reason line, the preview heading and its four affinity
lines. So a pick and its effect are on screen together (FS1, FS2). The rest scrolls.

### Component Inventory

The Pattern column names a pattern in `design/ux/interaction-patterns.md`. **New** marks a
pattern this spec defines, proposed for the library under the number shown (Changes needed in
existing specs, P1). The library assigns the final numbers.

| ID | Component | Block | Type | Shows | Interactive | Pattern |
|---|---|---|---|---|---|---|
| FC1 | View heading | F0 | Heading | "Forge" | No. Focus target | — |
| FC2 | Wave A goal line | F1 | Composite display | #13 C1, unchanged | Tap: Goal card | #13 single-use (C1) |
| FC3 | Wave A instruction lines | F1 | Text | #13 C2, unchanged | No | #13 single-use (C2) |
| FC4 | Last-run line | F2 | Text with glyphs | The last forged run's method, makeup, tiers and seals | No | #15 single-use |
| FC5 | Method column | F3 | Grouped lines and a button | A method's hollow glyph and name, its feeds, quenches, opens and closes, then "Begin circulating {method}" | The button | IP24; lines use IP8, IP9, IP10; button IP15 |
| FC6 | Headroom line | F4 | Text | "The best Foundation here holds {b} seals under {method}." and "Your best in hand: {h} seals." | No | IP25 |
| FC7 | Plan block | F5 | Group | "Plan · {k} of 4 chosen", the pick chips, the reason line or Forge | Chips; Forge | — |
| FC7a | Pick chip | F5 | Native checkbox | An ingredient's name and "in hand" or "not yet"; checked when in the plan | Yes | IP26 |
| FC7b | Reason line | F5 | Text | Why the plan cannot be forged, in words | No | IP13's reason line |
| FC7c | Forge button | F5 | Button | "Forge", only when the plan can be forged | Yes: opens FC11 | IP15 |
| FC8 | Foundation preview | F6 | Composite display | The held part's affinities and stats; the withheld state, or each door's tier and proof, the seals and the widened stores | Its heading opens FC8f | — |
| FC8a | Affinity line | F6, F9 | Text with glyph | "{glyph} {affinity} {gathered} − {clash} = {after clash} · {stat} {value}" | No | IP27 |
| FC8b | Withheld door rows | F6 | Text with glyph | The lead sentence; each door with "– –" and "not yet shown" | No | IP28 |
| FC8c | Door row | F6, F9 | Text with glyph | "{door} {tier glyph} {tier word} · proof {n} · {next threshold}"; in F9 also its `flavor` | No | IP11 |
| FC8d | Seals line | F6, F9 | Text | "{s} of {2D} seals" | No | — |
| FC8e | Widened stores | F6, F9 | Text lines | "Widens {store} {cap} → {new cap}" per store with an entry | No | — |
| FC8f | Plan card | Overlay | #13's detail container | The plan's Foundation as #13's Goal card shows a forged one, every number with its breakdown | Part lines, named-record lines, close | IP1, IP2, IP6, IP7 |
| FC9 | Affinity key | F7 | Text with glyphs | "▲ Cinder is might · ■ Jade is guard · ▼ Bark is vigor · ◆ Gale is speed" | No | — |
| FC9a | Ingredient row | F7 | List row | Name, state words, the four contributions with marks, or the hidden-base line and the method's deltas | Name: Ingredient card | IP29; marks IP9; hidden base #14 C10 |
| FC9b | Route row | F7 | List row | One route paying a planned ingredient not in hand, led by its family word | Name: Source card; Start | IP13 |
| FC10 | Makeup line | F8 | List row | "{s} of 6 seals · {four names}", each door's tier glyph, and "Plan this" or "In the plan" | "Plan this" | IP30 |
| FC11 | Forge confirmation | Overlay | #13's dialog container | What the forge consumes, proves and widens; the headroom echo; the redo line | Cancel, Forge | IP3 |
| FC12 | Commit dialog | Overlay | #13's dialog container | #7 W7.3's generated lines | Cancel, Begin circulating | IP3 |
| FC13 | Forged view | F9 | Composite display | The Foundation from the snapshot | Its heading opens #13's Goal card | — |

#### FC4 Last-run line (#11 UI Requirements 5, D7; FS9)

- **Text:** "Last run at {realm}, under {hollow glyph} {method}: {four names} · {door} {tier
  glyph} {tier word} · … · {s} of {2D} seals." The doors come in `realm.doors` order. The realm's
  name stays even with one realm in the MVP, because #11 UI Requirements 5 lists it and #19 adds
  realms.
- **Name order everywhere on this screen.** A makeup is a set (#6 G4.1), so wherever this view
  lists one (the last-run line, a makeup line, the confirmation, the forged view), its names come
  in `realm.ingredients` order. This holds even where the snapshot and `lastRun` store id order
  (#6 G10.1, #11 D7.1).
- **Framing.** The lead names the method, so the line reads as what that method made. It never
  says best, beat, record or previous best (#11 CD-GDD-ALIGN advisory). When the current run
  circulates the same method, the line is unchanged.
- The method's glyph is **hollow and in ink**: it describes a past run (#14 MK4).
- Read-only and not a record, because no rule reads `lastRun` (#11 D7.2). Its seals and tiers
  are a stored copy with no parts, so they show bare (#14 BD1, Stored copies).
- It is shown whenever #11 holds `lastRun`, as the first block after the heading, in every phase.
  When #11 drops it on load (an unknown id, D7.3), the block is absent and nothing says so.

#### FC5 Method column (#7 UI Requirements 1–2, W7.1; #14 W6, MK4, MK5, MK7; FS3, FS12)

One column per method, in content order. Each column holds, in this order:

1. **Heading:** the method's glyph, **hollow and in ink** (FS12), and its name.
2. `desc`, if the method has one.
3. **Its contribution changes**, one line each, in the order of `changed(m)` (#1 F8): a feed reads
   "{ingredient}: {affinity} +{n}" with the hollow raise mark; a quench reads "{ingredient}:
   {affinity} quenched" with the hollow quench mark. A `set` to anything but 0 would read
   "changed" with no notch (#14 MK7; #1 AC-U-1). No absolute contribution appears anywhere in the
   column (#7 AC-W7-1).
4. **Its opens:** "Opens: {source}" with the hollow open mark, one per source, in id order.
5. **Its closes:** each source only another method opens, as "Closes: {source}", led by the
   closed mark and the opening method's hollow glyph (#14 MK5, W6). "Closes: {method}" itself is
   not repeated here. Choosing one column closes the other, and the commit dialog says so.
6. **"Begin circulating {method}"** (IP15), the column's last line. It opens the commit dialog
   (FC12).

- A block with nothing to show is left out (#7 Edge Cases).
- Lines wrap and never truncate or collapse into "and N more" (#7 Edge Cases).
- The two columns never re-order. The last-run line does not move the other method first,
  because one form for one thing (AR-C4) outweighs a nudge.
- **Before the commit only.** From the `committed` event on, F3 leaves the Forge view. The
  committed method and the closed one stay readable in #13's Method card (C3), which meets #7 UI
  Requirements 4.

#### FC6 Headroom line (#6 G7.4, UI Requirements 4; #14 BD5; FS8)

- **Text:** "The best Foundation here holds {b} seals under {method}." Here b is `bestSeals(m)` for
  the committed method. Once at least one makeup is fully in hand, the line goes on: "Your best in
  hand: {h} seals." Here h is the seals of FC10's first line.
- It **never names a makeup**, an ingredient or a route. When h equals b, it says exactly that,
  with no praise and no change of form.
- Plain text. It is not a record and opens nothing, because its breakdown is one line with no
  parts (#14 BD5), which the line already is.
- **Open only.** Before the commit it is absent, because it needs a method, and the two methods'
  bests are equal (both 4, #6 S9), so it would tell a chooser nothing. After the forge it is
  absent, because nothing more can be forged this run.
- Not live: a change in h is announced by the log line of the ingredient that caused it (#13
  Events Fired).

#### FC7 Plan block (#6 UI Requirements 1, G4, G8.1; FS2)

- **Heading:** "Plan", then "{k} of 4 chosen". Here 4 is `realm.makeupSize` and k is the count of
  chosen ingredients.
- **FC7a Pick chips.** One native checkbox per ingredient in `realm.ingredients`, in that order.
  - Its label is the ingredient's name over its state word: "in hand" or "not yet" (#13 C8's
    words). The checkbox's own checked state, drawn as a check glyph, says "in the plan". Hue
    carries nothing (AR-V5).
  - Chips grow taller rather than truncate a name: two lines, or three for a 24-code-point name
    at 320 px. Six in a row at a block width of at least 600 px, otherwise rows of three.
  - **A fifth pick.** While four are chosen, each unchosen chip stays focusable and is marked
    `aria-disabled`. Its accessible description is "The plan holds four. Take one out first."
    Activating it does nothing (PD10). Unchecking any chosen chip frees them all at once.
    So that a tap that does nothing is never a mystery, the same sentence is visible text under
    the chips while four are chosen. Unchosen chips keep full contrast, because their names and
    state words are information (AR-V1).
  - Picking is **interface state**, never a rules action, and works in Choosing too (#7 W10).
- **FC7b Reason line**, shown whenever the plan cannot be forged, in this order of precedence:
  1. "Needs a method committed": the rules core's refusal text (#6 G8.1, AC-G8-1);
  2. "Choose {n} more.", while fewer than four are chosen. This is the interface's own line,
     because the rules never see an incomplete plan (#6 G1, AC-G4-1);
  3. "Needs {ingredient} in hand", one sentence for each chosen ingredient not held, in
     `realm.ingredients` order (FC4). The text is the rules core's (#6 G8.1); the result must name every missing
     ingredient, not the first (Data Requirements, architecture flags).
- **FC7c Forge.** The button "Forge" (IP15) takes the reason line's place only when the plan is
  Forgeable (#6 States and Transitions: previewable, and the realm Open). It is **absent, not
  disabled**, otherwise, as Start is (IP13), because the reason line already says why.

#### FC8 Foundation preview (#6 G7, UI Requirements 2; #14 BD5; FS5, FS6, FS10, FS11)

Everything here comes from one call, `preview(plan, held, m)` (#6 G1). Nothing is computed in
the interface except the sum of FC8d, which the owner also returns (#14 BD5).

- **Heading:** a button reading "Foundation preview" and "{h} of 4 in hand", where h counts the
  chosen ingredients held. It opens the Plan card (FC8f).
- **FC8a Affinity lines**, four, in stat order, for the held part of the plan:
  - "▲ Cinder 130 − 15 = 115 · might 135": the affinity glyph, the name, the amount gathered, the
    clash taken and the amount after clash, then the stat's word and value.
  - The clash part shows only when both the affinity and its opposite gathered more than 0.
    Otherwise the line shortens: "▲ Cinder 25 · might 45", never "− 0", and never "0 − 12 = 0".
  - When the clash takes more than was gathered, the line still shows both figures and ends at
    0: "▼ Bark 30 − 65 = 0" (#6 Visual/Audio's own example). A clash is never shown only as a
    lower number.
  - The clash amount is the one the owner returns (#14 Open Questions 9). The interface does no
    arithmetic.
  - Numbers here carry **no method mark** (#14 MK1.3). The marks sit one level down, on the
    contributions in the Plan card.
  - With no chosen ingredient in hand, the four lines are replaced by one: "What the plan's
    ingredients give together shows once one of them is in hand."
- **FC8b Withheld door rows** (FS5), while the plan is not previewable:
  - A lead sentence: "Doors, seals and widened stores show once all four are in hand ({h} of 4
    held)." With fewer than four chosen it reads "… once four chosen ingredients are in hand."
  - Then one row per door, in `realm.doors` order: the withheld glyph "– –", the door's name and
    "not yet shown".
  - The withheld glyph is not ○○, which reads as "shut" in the goal line (#13 C1).
  - No seal count and no widened store appear. Not even a count of seals "so far", because a
    partial makeup has none (#6 G7.2).
- **FC8c Door rows**, once the plan is previewable, replacing the withheld rows in place, in the
  same order:
  - "{door} {tier glyph} {tier word} · proof {score} · {next threshold}". For example: "Furnace
    Gate ●○ open · proof 14,000 · wide from 15,000".
  - The next threshold reads "opens from {first}" for a shut door and "wide from {second}" for an
    open one. A wide-open door has none.
  - Shut has **no failure styling**: it is a tier of 0, never a penalty (rule 27; #6 G8.5).
- **FC8d Seals line:** "{s} of {2D} seals". Its parts, each door's tier, are the rows directly
  above it, so the block is its own composed breakdown (#14 BD5). The Plan card drills into it.
- **FC8e Widened stores**, once the plan is previewable: "Widens {store} {cap} → {new cap}" for
  each store with an entry, in content order, from `foundationEntries` through `preview` (Changes
  needed in existing specs, G-1). If no store widens: "Widens no store." No cap shows for a plan
  that is not previewable, because a cap would reveal hidden base contributions (#6 UI
  Requirements 2).
- **FC8f Plan card** (FS6). The heading opens #13's container (IP1) on a card laid out as #13's
  Goal card after the forge (#13 C1), read from `preview` instead of the snapshot:
  - title "Foundation preview", with "{s} of {2D} seals" or "{h} of 4 in hand" as its state line;
  - the chosen ingredients as named-record lines (PD6);
  - the four affinities with their stats. Each stat drills down to Body and the affinity after
    clash, then to the amount gathered and the clash, then to each ingredient's contribution
    trail, which carries the method's mark where it has one (#14 BD5, BD6, W4);
  - each door's proof, drilling to the four stats on each side, the decider and the thresholds;
  - the seals, drilling to each door's tier;
  - each widened cap as a trail: the base, a "Foundation" label, and one line per ingredient
    (#14 BD5, "A cap in the forge preview").
  - A plan that is not previewable shows only its held part's affinities and stats (#14 BD5),
    with FC8b's lead sentence in place of the doors.
  - Words follow FS10: "Cinder gathered", "Clash with Bark", "Cinder after clash", "proof".

#### FC9 Ingredients (#6 G7.3; #7 UI Requirements 5; #8 UI Requirements 4; #14 MK1.2, MK7, BD7; FS4)

- **FC9 Affinity key.** One line heads the list: "▲ Cinder is might · ■ Jade is guard · ▼ Bark is
  vigor · ◆ Gale is speed". It wraps. Each affinity names its stat here once, so the rows need
  not repeat it (#6 Visual/Audio).
- **FC9a Ingredient row**, one per ingredient in `realm.ingredients` order:
  1. **First line:** the name, a button that opens the Ingredient card (#13 C16: Contributes,
     Sources), then the state word ("in hand" or "not yet", #13 C8), then "· in plan" when the
     ingredient is chosen.
  2. **Contribution**, held (its high-water mark is 1, #14 MK7): the four values in stat order,
     each led by its affinity glyph and name: "▲ Cinder 25 · ■ Jade 10 · ▼ Bark 0 · ◆ Gale 45".
     A value the method changed carries its mark at its inline-end (#14 MK1.2, MK2): solid after
     the commit. A value and its mark never separate. At 390 px the four wrap as two pairs.
  3. **Contribution**, not held: "What it gives shows once it is in hand." (#13 C16 block 9's
     sentence), then one line for each method step on it: "▲ Cinder +10" with the mark, or "■ Jade
     quenched". Before the commit, each method that changes the value gets its own line with its
     hollow mark. After the commit, only the circulating method's remains (#14 BD7).
  4. **Routes** (FS4), only when the ingredient is chosen and not in hand: one FC9b route row per
     source that pays it.
- **FC9b Route row** (IP13, unchanged, plus a lead word):
  - The row starts with its family word, "Recipe", "Hunt" or "Floor", the same derived word as
    #13's card (#13 Data Requirements, "Derived words"; #7 UI Requirements 5).
  - Then come IP13's anatomy and states: the name (the Source card), the bill with its
    shortfall, the route's own duration (#8 UI Requirements 4's "gathering time", read as the
    source's effective duration, as on the road), a fight's exact result, the reason, and Start
    when Ready.
  - An opened route carries the solid open mark on its name (#14 MK1.2).
  - **After the commit,** the rows are `routes(i, m)` (#7 W1), the enabled sources only.
    `routes` returns them in id order; the view shows them in the road's content order, so a
    route keeps the same relative place on both. A route the method closes is not repeated here; it stays on the road
    and in the Ingredient card's Sources block as closed (#14 MK5).
  - **Before the commit,** the rows are every source that pays the ingredient under either
    method, all Waiting with "Needs a method committed", as on the road (#13 C11).
  - Starting a route here is the road's Start, with the road's result (#13 Interaction Map). The
    view does not switch.

#### FC10 Makeup line (#6 UI Requirements 3, G9.1; FS7)

- **Heading:** "Makeups in hand · {n}", where n is the number of previewable makeups (1, 5 or 15
  in the MVP).
- **Order:** most seals first, ties in the realm's ingredient order (lexicographic on
  `realm.ingredients` positions). It only sorts what the player holds, so it reveals nothing that
  #6 G7 withholds.
- **Each line:**
  - "{s} of {2D} seals · {four names}";
  - then each door's name with its tier glyph. The tier words are the glyph's text alternative
    here, to keep each line within three lines at 390 px (AR-V5 allows a word or a text
    alternative);
  - then "Plan this" (IP15), which makes this makeup the plan. The chips and the preview update
    in the frame. For the makeup that is the plan, "Plan this" is absent and the line reads "In
    the plan". The button that was activated is therefore gone, so focus moves to the plan
    block's heading, which brings the chips and the changed preview into view.
- **Empty:** "No makeup is fully in hand yet. Hold four to compare." (IP19: never blank).
- Seals here come from `preview` for each held makeup, so the list obeys #6 G7 by construction.

**Numbers this view shows that #14 BD5 does not list**, in BD5's form ("Any other derived number
that #13 or #15 shows must name its owner function and its parts in that spec"):

| Number | Owner | Parts, in the owner's order |
|---|---|---|
| "Your best in hand" (FC6) | #6 `preview`, called for each held makeup | None of its own. It is the first line of F8, which lists every part on screen. The interface chooses that line by sorting and computes nothing |
| A door's next threshold, "wide from 15,000" (FC8c) | Content: `door.thresholds` (#6 G2) | Not derived: an authored value with no trail, shown bare (#14 BD2) |
| "{k} of 4 chosen", "{h} of 4 in hand", "Makeups in hand · {n}" | This view's counts | State numbers with no base and no modifiers, so they have no breakdown (#14 BD1) |

#### FC11 Forge confirmation (#6 G8.2, UI Requirements 5; IP3; FS8)

Hosted unchanged in #13's dialog container (C17). Its lines, top to bottom:

1. The title: "Forge the Foundation".
2. "Consumes {four names}." Then, if any other ingredient is held, "{names} stay in hand." (#6
   G13.5).
3. Each door, as FC8c: "{door} {tier glyph} {tier word} · proof {score}".
4. "{s} of {2D} seals", the same seals the preview showed (#6 G8.2).
5. Each widened store, as FC8e.
6. **The headroom echo** (FS8), only when s is less than b: "The best Foundation here holds {b}
   seals."
7. The redo line: "Redo: only by starting a new run" (#7 Y2's line, reused, so one sentence says
   the same thing in every irreversible dialog). This is how the dialog states that there is no
   reforge (#6 G8.2). The player never reads the word "MVP".
8. The buttons: Cancel at inline-start, holding focus, and "Forge" at inline-end (PD9, PD17).

#### FC12 Commit dialog (#7 W7.3, AC-W7-2; #14 W7, D5, MK5; IP3; FS12)

Hosted unchanged in #13's dialog container (C17). Its lines are `commitDialog(m, checked)`, in
#7's order, all generated except `commitText`:

1. "Begin circulating {name}", with the method's glyph, hollow and in ink (FS12);
2. `commitText`;
3. the "Opens:", "Feeds:" and "Quenches:" lines from `closesLines`, in triple order, each with
   its hollow notched mark (#14 W7);
4. "Closes: {other method}", then one "Closes: {source}" per source only another method opens,
   each led by the closed mark and the opening method's hollow glyph (#14 MK5);
5. the redo line, "Redo: only by starting a new run".

Then Cancel (inline-start, holding focus) and "Begin circulating" (inline-end). An empty opens or
closes block is left out, and the redo line is always present (#7 Edge Cases).

#### FC13 Forged view (#6 UI Requirements 6, G10, G13.3–13.4)

Everything here reads the forge snapshot (#6 G10), never content, so a content update never
changes it (AC-G10-1).

- **Heading:** a button reading "The Foundation", which opens #13's Goal card, the persistent
  Foundation card (#13 C1). It is the focus target after the forge (PD16).
- "Forged from {four names}."
- Each door as FC8c, and its `flavor` in italics beneath it (#6 G13.4; rule 70).
- "{s} of {2D} seals".
- The four affinity lines (FC8a), from the snapshot.
- "Widened {store} to {cap}" for each store the Foundation widened.
- F2, the last-run line, stays above it (FS9). It still describes the run before this one.

### ASCII Wireframe

Glyphs are placeholders for layout only; the shapes are art (Open Questions). `(EB)` and `(SW)`
are hollow method glyphs in ink, `[EB↑]` a solid mark with the raise notch, `[EB⊓]` with the open
notch, `▥` the closed glyph, `– –` the withheld glyph, and ○○ ●○ ●● the tier glyphs.

**Narrow (390 px), Choosing, with a last run.** Only the Forge view's content zone (N3) is drawn.
#13's pinned header, instruction block and tabs surround it.

```
├ N3 Forge ──────────────────────────────────┤
│ Forge                                      │
│ Last run at {realm}, under (SW) Still      │
│ Water: Echo Jade, Ironbark Heartwood,      │
│ Ember Marrow, Tidewater Pearl · Furnace    │
│ Gate ●○ open · Deep Well ●○ open ·         │
│ Listening Hall ●● wide open · 4 of 6 seals │
│ ────────────────────────────────────────── │
│ (EB) Ember Breath                          │
│   Ember Marrow: Cinder +10 (EB↑)           │
│   Ironbark Heartwood: Jade quenched (EB⤓)  │
│   Opens: Crab Hunt (EB⊓)                   │
│   Opens: Heron Hunt (EB⊓)                  │
│   Opens: Salamander Hunt (EB⊓)             │
│   ▥ Closes: Still Deep I (SW)              │
│   ▥ Closes: Still Deep II (SW)             │
│   ▥ Closes: Still Deep III (SW)            │
│   [ Begin circulating Ember Breath ]       │
│ (SW) Still Water                           │
│   Echo Jade: Bark +20 (SW↑)                │
│   Tidewater Pearl: Bark +30 (SW↑)          │
│   Opens: Still Deep I (SW⊓) …              │
│   ▥ Closes: Crab Hunt (EB) …               │
│   [ Begin circulating Still Water ]        │
│ ────────────────────────────────────────── │
│ Plan · 0 of 4 chosen                       │
│ [☐ Echo Jade][☐ Ironbark ][☐ Ember Marrow ]│
│ [  not yet  ][ Heartwood ][  not yet      ]│
│ [           ][  not yet  ][               ]│
│ [☐ Cloud    ][☐ Ghost    ][☐ Tidewater    ]│
│ [  Lotus    ][  Moss     ][  Pearl        ]│
│ [  not yet  ][  not yet  ][  not yet      ]│
│ Needs a method committed                   │
│ Foundation preview · 0 of 4 in hand        │
│ What the plan's ingredients give together  │
│ shows once one of them is in hand.         │
│ Doors, seals and widened stores show once  │
│ four chosen ingredients are in hand.       │
│ – – Furnace Gate · not yet shown           │
│ – – Deep Well · not yet shown              │
│ – – Listening Hall · not yet shown         │
│ ▲ Cinder is might · ■ Jade is guard ·      │
│ ▼ Bark is vigor · ◆ Gale is speed          │
│ Echo Jade · not yet                        │
│   What it gives shows once it is in hand.  │
│   ▼ Bark +20 (SW↑)                         │
│ …                                          │
└────────────────────────────────────────────┘
```

**Narrow (390 px), Open under Ember Breath.** Five ingredients held, all but Cloud Lotus. The plan
is Ember Breath's best four, so Cloud Lotus is missing and the preview is withheld. Totals are #6
AC-G7-2's held part (Echo Jade, Ironbark Heartwood, Ember Marrow).

```
├ N3 Forge ──────────────────────────────────┤
│ Forge                                      │
│ The best Foundation here holds 4 seals     │
│ under Ember Breath. Your best in hand:     │
│ 3 seals.                                   │
│ Plan · 4 of 4 chosen                       │
│ [☑ Echo Jade][☑ Ironbark ][☑ Ember Marrow ]│
│ [  in hand  ][ Heartwood ][  in hand      ]│
│ [           ][  in hand  ][               ]│
│ [☑ Cloud    ][☐ Ghost    ][☐ Tidewater    ]│
│ [  Lotus    ][  Moss     ][  Pearl        ]│
│ [  not yet  ][  in hand  ][  in hand      ]│
│ The plan holds four. Take one out first.   │
│ Needs Cloud Lotus in hand                  │
│ Foundation preview · 3 of 4 in hand        │
│ ▲ Cinder 105 − 15 = 90 · might 110         │
│ ■ Jade 45 − 10 = 35 · guard 45             │
│ ▼ Bark 30 − 52 = 0 · vigor 100             │
│ ◆ Gale 20 − 22 = 0 · speed 0               │
│ Doors, seals and widened stores show once  │
│ all four are in hand (3 of 4 held).        │
│ – – Furnace Gate · not yet shown           │
│ – – Deep Well · not yet shown              │
│ – – Listening Hall · not yet shown         │
│ ▲ Cinder is might · ■ Jade is guard ·      │
│ ▼ Bark is vigor · ◆ Gale is speed          │
│ Echo Jade · in hand · in plan              │
│   ▲ Cinder 40 · ■ Jade 40                  │
│   ▼ Bark 0 · ◆ Gale 15                     │
│ …                                          │
│ Cloud Lotus · not yet · in plan            │
│   What it gives shows once it is in hand.  │
│   ◔ Recipe · Open a Cloud Lotus            │
│     Rendered Oil ×12 (3 more) · Seasoned   │
│     Plank ×6 · 9 min 10 s                  │
│   ▷ Hunt · Heron Hunt [EB⊓]       [Start]  │
│     Seasoned Plank ×5 · 10 min 30 s ·      │
│     {exact result}                         │
│ Makeups in hand · 5                        │
│ 3 of 6 seals · Echo Jade, Ironbark         │
│ Heartwood, Ember Marrow, Ghost Moss        │
│ Furnace Gate ●○ Deep Well ●○ Listening     │
│ Hall ●○                      [Plan this]   │
│ 3 of 6 seals · Echo Jade, Ironbark         │
│ Heartwood, Ember Marrow, Tidewater Pearl … │
│ 1 of 6 seals · …                           │
│ 0 of 6 seals · …                           │
│ 0 of 6 seals · …                           │
└────────────────────────────────────────────┘
```

**Wide (centre 936 px at 1440 × 900), Open under Ember Breath, the plan previewable** (all six
held; Ember Breath's best four; #6 AC-G5-1, AC-G6-1, AC-G11-1 and S9's caps). The one column
keeps its order; only F5's chips sit in one row.

```
┌ Z4 [ Road ] [▸Forge ] ──────────────────────────────────────────────────────────────┐
│ Forge                                                                                │
│ The best Foundation here holds 4 seals under Ember Breath. Your best in hand: 4 seals.│
│ Plan · 4 of 4 chosen                                                                 │
│ [☑ Echo     ][☑ Ironbark  ][☑ Ember     ][☑ Cloud     ][☐ Ghost     ][☐ Tidewater ]  │
│ [  Jade     ][  Heartwood ][  Marrow    ][  Lotus     ][  Moss      ][  Pearl     ]  │
│ [  in hand  ][  in hand   ][  in hand   ][  in hand   ][  in hand   ][  in hand   ]  │
│                                                                              [ Forge ]│
│ Foundation preview · 4 of 6 seals                                                    │
│ ▲ Cinder 130 − 15 = 115 · might 135        ■ Jade 55 − 32 = 23 · guard 33            │
│ ▼ Bark 30 − 65 = 0 · vigor 100             ◆ Gale 65 − 27 = 38 · speed 38            │
│ Furnace Gate ●○ open · proof 14,000 · wide from 15,000                               │
│ Deep Well ●○ open · proof 14,400 · wide from 15,000                                  │
│ Listening Hall ●● wide open · proof 15,700                                           │
│ 4 of 6 seals                                                                         │
│ Widens Ash Tallow 40 → 60 · Rendered Oil 12 → 18 · Rough Jade 20 → 25 ·              │
│ Jade Blank 8 → 10                                                                    │
│ ▲ Cinder is might · ■ Jade is guard · ▼ Bark is vigor · ◆ Gale is speed               │
│ Ember Marrow · in hand · in plan   ▲ Cinder 35 [EB↑] · ■ Jade 5 · ▼ Bark 0 · ◆ Gale 5 │
│                                              ═══                                     │
│ …                                                                                    │
│ Makeups in hand · 15                                                                 │
│ 4 of 6 seals · Echo Jade, Ironbark Heartwood, Ember Marrow, Cloud Lotus · In the plan │
│ …                                                                                    │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**The forge confirmation (narrow, full width; #13 C17).**

```
┌────────────────────────────────────────────┐
│ Forge the Foundation                       │
│ Consumes Echo Jade, Ironbark Heartwood,    │
│ Ember Marrow and Cloud Lotus.              │
│ Ghost Moss and Tidewater Pearl stay in     │
│ hand.                                      │
│ Furnace Gate ●○ open · proof 14,000        │
│ Deep Well ●○ open · proof 14,400           │
│ Listening Hall ●● wide open · proof 15,700 │
│ 4 of 6 seals                               │
│ Widens Ash Tallow 40 → 60 · Rendered Oil   │
│ 12 → 18 · Rough Jade 20 → 25 · Jade Blank  │
│ 8 → 10                                     │
│ Redo: only by starting a new run           │
│ [ Cancel ]                       [ Forge ] │
└────────────────────────────────────────────┘
```

With a plan worth 3, line 6 adds "The best Foundation here holds 4 seals." above the redo line.

**The forged view (narrow).**

```
├ N3 Forge ──────────────────────────────────┤
│ Forge                                      │
│ The Foundation                             │
│ Forged from Echo Jade, Ironbark Heartwood, │
│ Ember Marrow and Cloud Lotus.              │
│ Furnace Gate ●○ open · proof 14,000        │
│   {flavor, italic}                         │
│ Deep Well ●○ open · proof 14,400           │
│   {flavor, italic}                         │
│ Listening Hall ●● wide open · proof 15,700 │
│   {flavor, italic}                         │
│ 4 of 6 seals                               │
│ ▲ Cinder 130 − 15 = 115 · might 135        │
│ ■ Jade 55 − 32 = 23 · guard 33             │
│ ▼ Bark 30 − 65 = 0 · vigor 100             │
│ ◆ Gale 65 − 27 = 38 · speed 38             │
│ Widened Ash Tallow to 60 · Rendered Oil    │
│ to 18 · Rough Jade to 25 · Jade Blank to 10│
└────────────────────────────────────────────┘
```

The commit dialog's lines are #14 W7, unchanged, in this spec's dialog frame.

---

## States & Variants

### The run's phase (#6 States and Transitions; #7 States and Transitions)

| Phase | Holds when | What the Forge view shows |
|---|---|---|
| **Choosing** | No method is committed (#7), so the forge is in Planning only (#6) | F2 if any, F3, F5, F6, F7. The chips work, and the reason line reads "Needs a method committed". The preview shows its sentences and the withheld door rows. Ingredient rows show each method's deltas with hollow marks. Route rows are all Waiting. No hue anywhere (FS12) |
| **Open** | A method is committed and the realm has no snapshot | F2 if any, F4, F5, F6, F7, F8. Marks are solid. Route rows take their real states. Forge appears once the plan can be forged |
| **Forged** | The realm has a snapshot (#6 G10) | F2 if any, then F9 only. No plan, no Forge: reforge is #16's |
| **Wave A** (a build variant, not a phase) | The checkpoint build, before the shell exists | F1, #13's C1 and C2, heads the view in every phase, under F0 |

### Transitions between phases

| Trigger | What changes in the Forge view, in that frame |
|---|---|
| `committed` (#7 W7.5) | F3 leaves and F4 arrives. Ingredient rows narrow from both methods' deltas to the committed one's (#7 Edge Cases, "If a plan is open"). Route rows move from Waiting to their states (#1 F7). Marks turn solid (#14). The reason line drops "Needs a method committed". **The plan survives** (#7 Edge Cases). #13 switches the centre to the Road in the same frame (AC-13-08), so the player sees these changes when they come back |
| An ingredient arrives (`unitsCompleted`, #4) | Its chip and row say "in hand". Its row shows its four values. If it completes the plan, the withheld door rows fill in place, and the seals and widened stores appear. The reason line becomes Forge. F8 grows. F4's "Your best in hand" appears or changes |
| `forged` (#6 G8.3) | F9 replaces F3–F8 (Transitions & Animations, the forge's moment). Focus goes to F9's heading (PD16) |
| `newRunStarted` (#11) | Choosing, with an empty plan. F2 shows the cleared run if it was forged (#11 D7.1) |
| `saveLoaded` (#11) | The loaded run's phase, with an empty plan |

### The plan (#6 G4, States and Transitions; FS13)

**The plan is interface state and is never saved** (designer, 2026-11-22; gap 12). The rules
never save it (#6 G4.2), and #11's format is unchanged.

| Plan state (#6) | Holds when | Plan block | Preview |
|---|---|---|---|
| Empty | No ingredient chosen | "Plan · 0 of 4 chosen"; "Choose 4 more." (or "Needs a method committed" in Choosing) | Both sentences; withheld door rows |
| Incomplete | 1–3 chosen | "Choose {n} more." | The held part's affinity lines, if any chosen ingredient is held; withheld door rows |
| Planned | 4 chosen, at least one not held | "Needs {ingredient} in hand" for each | The held part's lines; withheld door rows; route rows under each missing ingredient |
| Forgeable | 4 chosen, all held, the realm Open | Forge | Doors, seals and widened stores |

- **Lifetime.** A plan starts empty when the page loads. It survives view switches, the commit
  and any away time. A new run, a loaded save or a reload clears it. The forge ends it.
- Because the plan is never saved and content never changes within a session (#1), #6's edge case
  "a plan the forge screen kept holds an id that content no longer has" cannot arise.
- **Previewable and Forgeable coincide in practice.** Before the commit nothing is held, so no
  plan is previewable; after the forge there is no plan.
- `held` of an ingredient falls only through the forge (#6 B13), so a Forgeable plan stays
  Forgeable until the forge.

### Component states

| Component | States |
|---|---|
| Pick chip (FC7a) | Unchosen · Chosen · Unchosen and unavailable (`aria-disabled`, four already chosen); each with "in hand" or "not yet" |
| Reason line and Forge (FC7b, FC7c) | One reason, or several "Needs … in hand" sentences · Forge |
| Affinity lines (FC8a) | The one-line sentence (nothing chosen is held) · The held part · The whole plan |
| Door rows (FC8b, FC8c) | Withheld ("– –", "not yet shown") · Shut ○○ · Open ●○ · Wide open ●● |
| Headroom line (FC6) | Realm fact alone · With "Your best in hand" · Absent (Choosing, Forged) |
| Ingredient row (FC9a) | Not yet (hidden base, deltas) · In hand (four values); each optionally "in plan"; route rows when in plan and not yet |
| Route row (FC9b) | IP13's states: Waiting, Closed (not listed here after the commit), Sealed, Short, Full, In hand, Ready, Running |
| Makeup line (FC10) | With "Plan this" · "In the plan" |
| Plan card (FC8f) | Closed · Open at depth 0 · Drilled (#13 C16) |
| Commit dialog, forge confirmation | Closed · Open. Neither has a busy state: both close in the confirm's frame (PD8) |

### Empty and edge states

- **No last run** (a first game, or a cleared run that was never forged): F2 is absent.
- **Nothing chosen is held:** the affinity lines become one sentence (FC8a). The preview is never
  blank and never shows zeros for a makeup that does not exist (IP19).
- **No makeup fully in hand:** F8 reads "No makeup is fully in hand yet. Hold four to compare."
- **All six held:** F8 lists all 15 makeups. Each line keeps to three lines at 390 px.
- **A previewable plan widens no store:** "Widens no store." (FC8e).
- **The best in hand equals the realm's best:** FC6 states both numbers and nothing more.
- **Several makeups tie for the most seals:** they keep the realm's ingredient order (FC10), and
  FC6's numbers are unaffected. Two makeups cannot tie for the realm's best in shipped content,
  because the Validator's B1 forbids it (#6 G14).
- **Loading:** none. Every value comes from pure functions over content and state already in
  memory (#14 States: "A breakdown never shows a spinner").
- **A forge that throws** (a `ModifierError`, #6 G8.3 step 1): nothing changes. #13's internal
  error notice appears ("Something went wrong, and nothing changed.", #13 C6), and the dialog
  closes as a refusal does (Interaction Map).

### Platform and preference variants

| Variant | Trigger | What changes |
|---|---|---|
| Split blocks | F3's or F5's own width is at least `FORGE_SPLIT_MIN_PX` (600 px) | Method columns side by side; six chips in one row (Layout Zones) |
| Stacked blocks | Below that width: every narrow layout, and wide windows under about 1104 px | Method columns stacked; chips in rows of three |
| Narrow | #13's narrow layout (below 960 px) | The Forge view is N3's content; cards are bottom sheets; dialogs are full width (#13) |
| Short viewport | #13's short-viewport fold (AR-V4.4) | Nothing of its own: the view scrolls inside N3 |
| Zoomed | Browser zoom or larger text | Blocks follow CSS pixels, so a zoomed wide window stacks its blocks, and nothing clips |
| Reduced motion | `prefers-reduced-motion: reduce` | The forge's moment and the commit's decorations are removed (Transitions & Animations) |
| Touch | Coarse pointer | Chips, buttons and route rows' controls are at least 44 × 44 CSS px (IP21) |

---

## Interaction Map

Mapping interactions for **mouse, keyboard and touch**. Gamepad support is none (#13 Platform
Target), so there is no gamepad column. Every action is one discrete input: nothing is held,
repeated, timed or dragged (AR-M1). **Before every rules action** the rules core settles time to
now (#4 S3.4; #6 G8.3; #7 W7.5).

| Component | Action | Mouse | Keyboard | Touch | Immediate feedback | Outcome |
|---|---|---|---|---|---|---|
| Pick chip (FC7a) | Choose or unchoose | Click | Space on focus | Tap | In the frame: the check flips, and the count, the reason line or Forge, the preview, and the row's "in plan" all update | Interface only |
| Pick chip, unavailable | — | Click | Space | Tap | Nothing changes. Its description says "The plan holds four. Take one out first." | None (PD10) |
| "Begin circulating {method}" (FC5) | Open the commit dialog | Click | Enter or Space | Tap | The dialog opens instantly, with Cancel focused (PD9) | Interface only |
| Commit dialog: "Begin circulating" | Commit | Click | Enter or Space | Tap | The dialog closes in the confirm's frame. The tint, marks and rows change together, and #13 switches the centre to the Road (AC-13-08). Focus goes to the Road's heading (PD16) | `commit(m)` |
| Forge (FC7c) | Open the forge confirmation | Click | Enter or Space | Tap | The dialog opens instantly, with Cancel focused | Interface only |
| Forge confirmation: "Forge" | Forge | Click | Enter or Space | Tap | The dialog closes in the confirm's frame. F9 replaces the plan in the same frame, and the forge's moment plays (Transitions & Animations). Focus goes to F9's heading, "The Foundation" (PD16) | `forge(makeup)` |
| Either dialog: Cancel | Close, changing nothing | Click | Esc, or Enter or Space on Cancel | Tap | The dialog closes. Focus returns to its opener | Interface only |
| Either dialog: a refused confirm (FS14) | — | — | — | — | The dialog closes in the confirm's frame, as on success. Nothing changes. The rules core's reason appears as a `status` line at the opener: under the column's "Begin circulating" for a commit, as the plan's reason line for a forge. Focus returns to the opener. A refused forge means the plan is no longer Forgeable, so its reason line has taken the Forge button's place, and focus goes to the plan block's heading beside it. If the opener's block is gone, because the phase has moved on, the line sits under F0 and focus goes to F0. No log line, as for a refused Start (#13) | None |
| Foundation preview heading (FC8) | Open the Plan card | Click | Enter or Space | Tap | The card opens, with focus on its title (PD4) | Interface only |
| Plan card part line or named-record line | Drill down | Click | Enter or Space | Tap | The frame is replaced in place, and the back line takes focus (IP2) | Interface only |
| Ingredient name (FC9a) | Open the Ingredient card | Click | Enter or Space | Tap | The card opens (#13 C16) | Interface only |
| Route row name (FC9b) | Open the Source card | Click | Enter or Space | Tap | The card opens | Interface only |
| Route row Start (FC9b) | Start the route | Click | Enter or Space | Tap | In the frame, the row turns Running and #13's running line shows it. The view does not switch | `start(id)` (#4) |
| "Plan this" (FC10) | Make this makeup the plan | Click | Enter or Space | Tap | In the frame, the chips and the preview change to that makeup, and the line reads "In the plan". Its button has gone, so focus moves to the plan block's heading, which brings the chips and the preview into view | Interface only |
| Forged view heading (FC13) | Open the Goal card | Click | Enter or Space | Tap | #13's Goal card opens | Interface only |
| Wave A goal line (FC2) | Open the Goal card | As #13 C1 | | | | Interface only |
| Card or sheet, dialog | Close, scroll | As #13 C16 and C17 | | | | Interface only |

- **Hover** shows a pointer cursor and an ink underline on a record's name (an ingredient, a
  route, the preview and forged-view headings), and nothing else. Chips and buttons show a
  pointer cursor only. No number takes a hover underline (#13 C16; #14 MK2).
- **Right-click** keeps the browser's default. **Long press** acts as a tap.
- **No keyboard shortcuts** beyond Tab, Shift+Tab, Enter, Space, Esc and the arrow keys (#13
  Interaction Map). The chips are six separate checkboxes, each a Tab stop, not a radio group,
  so no arrow-key model is needed.
- **Navigation targets.** The view's only exits are #13's: the Road tab, and the Road after a
  commit. Every overlay is #13's container or dialog. No target lacks a spec.

**Tab order inside the Forge view**, following the reading order: the last-run line (not
focusable), then each method column's "Begin circulating" (Choosing), the six chips, Forge, the
preview heading, each ingredient name, each route row's name and Start, and each "Plan this". In
the Forged phase: the forged view's heading only. F0's heading and the plan block's heading are
focus targets for the skip link, PD16, "Plan this" and a refusal (`tabindex="-1"`), not Tab
stops.

---

## Data Requirements

The Forge view reads state and pure functions, and writes only through rules actions. It owns no
game state.

| Data | Source system | Read / Write | Notes |
|---|---|---|---|
| The realm: `ingredients`, `makeupSize`, `doors`; door `name`, `thresholds`, `flavor`; ingredient `name`; affinity `name` | Forge and proving (#6 G2), Content (#1) | Read | N, M and D in every line; thresholds for FC8c's next threshold |
| `held` and each ingredient's high-water mark | Resources and caps (#3 K2), Content (#1 F1) | Read | Chips, rows, the hidden base (#14 MK7) |
| `committed` | Methods (#7 W12) | Read | The phase |
| `preview(plan, held, m)` | Forge and proving (#6 G1, G7) | **Calls** | The held part's affinities (including each clash amount, #14 Open Questions 9) and stats; each unheld ingredient's name and the method's deltas; each door's score and tier and the seals, only when previewable. **Must also return the Foundation entries, or the widened caps, when previewable** (architecture flag 1) |
| `bestSeals(m)` | #6 G7.4 | **Calls** | FC6. Reads no `held` (#6 AC-G7-3) |
| The forge's legality reason | #6 G8.1 | Read | FC7b and a refused forge (architecture flag 3) |
| The forge snapshot | #6 G10 | Read | F9. Never rebuilt from content |
| `commitDialog(m, checked)`, `closesLines`, `givesUpLines`, `redoLine` | Methods (#7 W1), Content (#1 R7.2) | **Calls** | FC12, with each line's kind (#14 Open Questions 8) |
| The method-choice view's content | #7 W7.1, AC-W7-1; #1 F8 `changed(m)` | **Calls** | FC5, with each line's kind (architecture flag 4) |
| `routes(i, m)` | #7 W1 | **Calls** | FC9b after the commit. Before it, every source paying i in either method's set |
| Each route row's state, reason, bill, effective duration and exact result | #1 F7, R5.5; #4 S5; #5; #9, as #13 shows them | Read | FC9b (IP13) |
| Trails and marks for contributions and caps | Modifier pipeline (#2 P8), through #14 | Read | FC9a marks; FC8f breakdowns |
| `lastRun` | Save and run lifecycle (#11 D7) | Read | FC4. Never written here |
| `start(id)` | Activity slot (#4) | **Write** | From FC9b. Writes the save (#11 D2.2) |
| `commit(m)`, `forge(makeup)` | #7, #6 | **Write**, through #13's dialog container | Each writes the save. A failed write raises "Not saving" at once (#11 J5) |
| The plan, the open card and its stack, any refusal status line, the view's scroll position | **This spec** | Interface state | **Never saved** (FS13) |

- **No method selection before the commit.** #7 W7.1 allows a view-only choice of which method
  to look at. Both columns are always shown (FS3), so the interface has no such state.
- **Cost.** The makeups list calls `preview` once per held makeup: at most 15. The view
  recomputes them only when `held`, the plan or `committed` changes, never every frame. #6 AC-P-1
  bounds `bestSeals` over all 15 at 5 ms, so 15 previews fit well inside a frame.

**Architecture flags.** None needs the interface to own game state. Each goes to an ADR the
owning GDD already lists:

1. `preview`'s result, for a previewable plan, carries `foundationEntries` (or each widened
   store's new cap). Otherwise the view would call a second function, and the preview rule would
   no longer be "a property of a pure function" (#6 G7.2). #6's ADR 2, with the GDD edit G-1
   (Changes needed in existing specs).
2. `foundationStats`, and so `preview`, carries each affinity's clash amount (#14 Open Questions 9).
3. The forge's refusal for a planned makeup names **every** ingredient not in hand, not only the
   first (#6's ADR 2; #6 AC-G8-1 shows one).
4. The method-choice view's content comes from one #7 function whose lines carry their kind
   (feed, quench, open, close), as #14 asks of the dialog (#7's ADR 1; #14 Open Questions 8).

---

## Events Fired

The MVP fires **no analytics events** (#13 Events Fired: no telemetry).

| Player action | Rules action | Events back | Writes the save |
|---|---|---|---|
| Choose or unchoose an ingredient | None | None | No |
| "Plan this" | None | None | No |
| Open the commit dialog or the forge confirmation; Cancel | None | None | No |
| Confirm the commit | `commit(m)` | `committed {method}` (#7 W7.5) | **Yes.** It changes persistent state for the run |
| Confirm the forge | `forge(makeup)` | `capChanged` for each widened store, then `forged {realm, method, makeup, seals, doors}` (#6 G8.3) | **Yes.** It consumes four ingredients and fixes the Foundation |
| A refused confirm | The same action, refused | None (#7 W7.4; #6 AC-G8-1) | No |
| Start on a route row | `start(id)` | `runStarted` (#4) | Yes |
| Open a card, drill down, switch views | None | None | No |

The commit and the forge are the run's two irreversible acts (#6 Game Feel; #7 Game Feel). Their
log lines are #13's ("Circulating {method}." and "Foundation forged from …", #13 Events Fired).
This view adds no log line and derives no event.

**Events the view consumes:** `committed`, `forged` and `capChanged`, `unitsCompleted` (an
ingredient arriving), `newRunStarted` and `saveLoaded`. It repaints on every settle, as every
#13 view does.

---

## Transitions & Animations

The pattern library's Animation Standards bind: the final state shows first, nothing flashes,
and decoration never blocks input. AR-V6 sets the cap: no animation lasts longer than 400 ms,
none repeats, and under `prefers-reduced-motion: reduce` every decorative animation is removed.
**The Forge view has one animation of its own, the forge's moment (FS15).** Everything else
changes in the frame its cause arrives.

| Change | What moves | Duration | Under reduced motion |
|---|---|---|---|
| Entering or leaving the view (a tab, the default view on load) | Nothing: #13's view switch is instant. The view's scroll position is kept (IP4) | 0 | The same |
| A pick, an unpick, "Plan this" | Nothing. The chips, the count, the reason line or Forge, the preview, the rows' "in plan" and F8's "In the plan" change in the frame of the input | 0 | The same |
| An ingredient arrives | Nothing. Its chip and row change in place. Withheld door rows are replaced in place by door rows, in the same order, and the seals and widened stores are inserted below them. The view does not scroll, and focus does not move | 0 | The same |
| F8 re-sorts (an arrival adds makeups) | Nothing. The list is redrawn in its new order. Focus, if it was on a "Plan this", stays on the same makeup's button | 0 | The same |
| A dialog opens or closes | #13 C17's: instant | 0 | The same |
| A card opens (the Plan card, the Goal card, any record) | #13 C16's: anchored card instant; the narrow bottom sheet slides as #13 sets | #13's | #13's: no slide |
| **The commit** | Nothing in this view. The dialog closes in the confirm's frame. #13's tint sweep and #14's underline draw-in run on the same `committed` event; this view adds nothing and waits for neither. #13 moves the centre to the Road in that frame (AC-13-08), so the Forge view is not on screen. This is #15's half of #14 Open Questions 13 | 0 | The same |
| **The forge** | The forge's moment, below | At most 400 ms | Removed |
| A refusal (FS14) | Nothing. The status line appears in the frame | 0 | The same |

**Numbers never count, tick or roll.** A value that changes is drawn at its new value in the
frame it changes, because a count-up would delay the value (AR-V6).

**The forge's moment (FS15; gap 9; #6 Visual/Audio, "the forge as one moment").**

1. **Frame 0, the confirm's frame.** The dialog closes. F9 replaces F3–F8 with its final
   content: the names, every door's tier, the seals, the four affinity lines and the widened
   stores. Focus goes to F9's heading (PD16). #13's goal line becomes the Foundation in the
   same frame (#13 C1), and the store chips show their new caps (#3). Every value is final
   before anything moves. The four ingredients have left the hand, because their chips are
   gone with the plan and #13's persistent context shows them as not held.
2. **0–240 ms: the channels converge.** Four channel lines in the circulating method's tint
   draw from the four names in "Forged from …" to the seals line, easing out. They sit on a
   layer behind the text that takes no pointer events and is `aria-hidden`.
3. **240–400 ms: the doors settle together.** The three door rows' tier glyphs and the seals
   line settle at once: a single scale emphasis of at most 4 % that returns to rest. They were
   already drawn at full value in frame 0, so the settle never reveals anything. The channel
   lines fade out over the same 160 ms.
4. **At 400 ms** nothing of the moment remains on screen.

- **The tint is on the channel lines only.** Names, tiers, seals and every number stay in ink
  (#14 MK2; AR-V1). This is the one place besides #14's marks and #13's identity where the tint
  appears, so #14 MK6 needs an amendment (Changes needed in existing specs, 14-3).
- **Nothing blocks input or delays a value.** A tap, a Tab or a card opened during the moment
  acts at once on the final content. Opening a card or scrolling neither restarts nor extends it.
- **When it plays.** Once, on the `forged` event. It never plays on a load, a reload, a view
  switch or a repaint of an already forged realm.
- **Under reduced motion,** frame 0 is the whole moment. No channel line is drawn and nothing
  settles.
- **Nothing flashes** (SC 2.3.1). Each line is drawn once, and no luminance change repeats.
- **No audio** (#6 Visual/Audio; the game has no audio system).
- **Timings are provisional:** `FORGE_CHANNEL_MS` 240 and `FORGE_SETTLE_MS` 160, whose sum may
  never pass 400 (AR-V6). The art bible owns the lines' drawing, the easing curve and the final
  durations inside that cap (Open Questions 2, 11).

---

## Input Method Completeness Checklist

The Platform Target names mouse, keyboard and touch. **Gamepad is not supported** in the MVP
(#13 Platform Target), so it has no block. An item is ticked only where the Interaction Map,
States & Variants or Accessibility already specifies it. An unticked item is open and listed
under Open Questions.

**Keyboard**

- [x] Every interactive element is reachable by Tab: each "Begin circulating", each chip, Forge,
  the preview heading, each ingredient name, each route row's name and Start, each "Plan this",
  and the forged view's heading (Interaction Map, tab order)
- [x] The tab order follows the reading order, and F0's and the plan block's headings are focus
  targets that are not Tab stops (Interaction Map)
- [x] Focus is always visible: #13's 2 px ring on every chip, button and name (AR-M3)
- [x] Cards and dialogs hold focus while open (#13 C16, C17; PD5) and Esc closes each, returning
  focus to its opener (Interaction Map)
- [x] Focus lands on a defined element after every act that removes its control: the commit
  (the Road's heading), the forge (F9's heading), "Plan this" (the plan block's heading), a
  refusal (the opener, the plan block's heading or F0) (Interaction Map)
- [x] An unavailable fifth chip stays focusable and states its reason (FC7a; PD10)
- [x] No single-key shortcut (Interaction Map; AR-M2)

**Mouse**

- [x] Every action is one click, acting on release (Interaction Map; AR-M1)
- [x] Hover reveals nothing: a pointer cursor and an ink underline on record names only
  (Interaction Map)
- [x] Targets are at least 32 × 32 CSS px with a fine pointer, 44 × 44 preferred (Accessibility,
  AR-M4)
- [x] Right-click keeps the browser's default (Interaction Map)
- [x] A click outside a wide card closes it and acts on what it lands on (#13 C16; AR-M3)

**Touch**

- [x] Chips, buttons and route rows' controls are at least 44 × 44 CSS px with a coarse pointer,
  and no two targets overlap (Platform and preference variants; IP21)
- [x] No swipe, drag, multi-touch or press-and-hold: the method columns stack rather than swipe
  (FS3), and a long press acts as a tap (Interaction Map)
- [x] Nothing scrolls sideways at 390 or 320 px (Layout Zones; AR-V4)
- [ ] **One-handed reach.** The Plan card's back line sits at the top of a tall bottom sheet, as
  every card's does in #13. Whether it is in thumb reach is Phone layout's (#17), as for #13 and
  #14 (Open Questions 7)

---

## Accessibility

The committed tier is **Comprehensive, against WCAG 2.2 AA** (`design/accessibility-requirements.md`).
The Forge view meets AR-V1 to AR-V6, AR-M1 to AR-M6, AR-C1 to AR-C7 and AR-P1 to AR-P7. Forced
colours are not committed (AR-V7). Where a browser applies them, this view follows #14's rule:
glyphs and channel lines draw in `CanvasText`, and the glyph carries the identity.

### Visual (AR-V)

- **AR-V1 Text contrast.** All text is ink on the stone base, a card or a dialog. An unchosen or
  unavailable chip, a withheld door row, a Waiting route row and every reason line keep 4.5:1,
  because their words are information. Nothing on this view is dimmed. No tint colours text,
  before or after the commit.
- **AR-V2 Non-text contrast.** The affinity, tier and withheld glyphs, each chip's box and check,
  every mark and the forge's channel lines keep 3:1 against what is next to them. The channel
  lines use the method's tint token, which already meets 3:1 on both bases (#14 Accessibility).
- **AR-V3 Text sizes.** Chip names, reason lines, the headroom line, the preview's lines, makeup
  lines and dialog lines are body text: 16 CSS px narrow, 14 wide. A route row's bill and
  duration, and a makeup line's door glyphs, are secondary figures at 13 px. The Plan card's
  breakdown lines are 14 px. Every size is in rem.
- **AR-V4 Reflow and zoom.** At 320 CSS px wide, and at 200 % zoom or text size, nothing
  truncates, clips or scrolls sideways:
  - chips grow taller (FC7a);
  - an ingredient row's four values wrap as two pairs, and a value never separates from its mark
    (FC9a; IP9);
  - an affinity line wraps only between its two halves, "{glyph} {affinity} {gathered} −
    {clash} = {after clash}" and "· {stat} {value}", never inside a figure;
  - a door row wraps only at its "·" separators;
  - the 600 px split follows CSS pixels, so a zoomed wide window stacks its blocks (Platform and
    preference variants).

  Text-spacing overrides (SC 1.4.12) clip nothing, because no block has a fixed height.
- **AR-V5 The greyscale rule.** Every distinction this view draws reads without hue:

  | Distinction | Carried by |
  |---|---|
  | Which affinity | The glyph's silhouette (▲ ▼ ■ ◆) and the affinity's name |
  | Which stat an affinity feeds | Its word on every affinity line, and the affinity key (FC9) |
  | A door's tier | #13's glyph pair (○○ ●○ ●●) and the word (shut, open, wide open) |
  | Not yet shown | The withheld glyph "– –" and the words "not yet shown" |
  | In the plan | The checkbox's check glyph, and "· in plan" on the row |
  | In hand | The words "in hand" or "not yet" |
  | Which method, before the commit | The hollow glyph's silhouette and the method's name |
  | What the method changes | #14's notch (raise, quench, open) and the words |
  | A shut door | Its glyph and word only. It has no failure styling of any kind (rule 27) |

  **The colour audit for #15 resolves to no hue before the commit** (FS12). After the commit the
  only hue is the circulating method's tint, on #14's marks and on the forge's channel lines.

  **New glyphs.** The four affinity glyphs are filled geometric solids drawn as inline SVG (no
  font character), in ink, in a box of at least 14 CSS px. Every #14 method glyph is a single
  stroked path, and #13's state glyphs are their own set, so a filled solid differs from both in
  silhouette. The withheld glyph, two short dashes, differs from #13's tier glyphs, which are
  circles. None is gate-shaped (#14 MK2). The opposed pairs are the same shape inverted (▲ and
  ▼, ■ and ◆), so the pairing itself reads in greyscale. The art bible draws them under these
  rules (Open Questions 2).
- **AR-V6 Motion.** The forge's moment ends within 400 ms, never repeats, never delays a value
  and is removed under reduced motion (Transitions & Animations). Nothing on this view flashes.

### Motor (AR-M)

- **AR-M1.** Every action is one discrete input (Interaction Map). Picking is a checkbox, never a
  drag into slots.
- **AR-M2.** Every function works from the keyboard: Space toggles a chip, Enter or Space
  activates a button or a name, and Esc closes a card or dialog.
- **AR-M3.** Focus is always visible and follows the reading order. On narrow widths the pinned
  zones never cover the content zone (#13), so a focused chip or route row is never hidden.
- **AR-M4.** Chips, buttons, record names and route controls are at least 44 × 44 CSS px with a
  coarse pointer and 32 × 32 with a fine one. A route row's name and its Start are separate
  targets that never overlap.
- **AR-M5.** Mouse, keyboard and touch mix freely. Each control's accessible name starts with
  its visible text, so speech input can name it (SC 2.5.3): a chip's name starts with the
  ingredient's name, and "Plan this" is named "Plan this: {four names}".
- **AR-M6.** Neither orientation is locked. A phone in landscape falls under AR-V4.4.

### Cognitive (AR-C)

- **AR-C1 No time pressure.** The forge has no clock and nothing here times out. The forge's
  moment waits for nothing.
- **AR-C2 The goal and the next step.** #13's goal line and next-step line. In the Wave A build,
  F1 carries them.
- **AR-C3 Reasons before action.** The plan's reason line (FC7b), each route row's reason, the
  fifth-pick sentence (FC7a) and each refusal (FS14) say why in words before or after any tap.
- **AR-C4 One form for each kind of thing.**
  - The commit and the forge confirm in #13's one dialog container.
  - The Plan card uses the Goal card's layout (FS6).
  - A door row has one form in the preview, the confirmation and the forged view (FC8c).
  - "Begin circulating" names the same act on the button and in the dialog.
  - Focusing a chip changes nothing. Checking one changes only the plan's own displays on this
    view, which is not a change of context (SC 3.2.2).
- **AR-C5 Plain words.** FS10's words replace the designer terms. No string on this view contains
  "total", "effective value", "score", "patch", "triple", "change set", "frozen set" or "MVP"
  (AC-15-39).
- **AR-C6 Confirm what clears progress.** The commit dialog names everything it closes. The forge
  confirmation names what it consumes, what stays in hand and the redo line (FC11, FC12).
- **AR-C7 Cognitive load.** The accessibility matrix flags rows 6 and 7 above four. This view
  carries those loads:

  | Load (matrix row) | Carried by |
  |---|---|
  | 15 makeups, each proved at three doors (row 6) | F8 lists every held makeup with its seals and tiers, most seals first (FS7). The headroom line says whether a better Foundation exists (FS8). Nothing is remembered |
  | Two methods, each feeding, quenching, opening and closing several things (row 7) | Both columns on screen at once, each change named and marked (FS3) |
  | Planning backwards from an ingredient to its routes (row 8) | Route rows under each planned ingredient not in hand (FS4). Load 3 per ingredient, all on screen |
  | One pick and its effect | At 390 × 844 the chips, the reason line and the preview's affinity lines are on screen together (Layout Zones, "Height") |

### Platform (AR-P): names, roles and structure

Native elements first (AR-P1). Every glyph is `aria-hidden`, and the words beside it carry its
meaning (AR-P2).

| Element | Element and role | Accessible name or reading | Notes |
|---|---|---|---|
| F0 "Forge" | `h2`, one level below #13's frame, `tabindex="-1"` | "Forge" | Skip-link, PD16 and fallback focus target |
| Last-run line (FC4) | `p` | Its text, with the method's glyph read as the method's name | Not focusable |
| Method column (FC5) | `section`, headed by an `h3` | "{method}" | Change lines are a list. Each line reads as #14's phrase: "Ember Marrow, Cinder plus 10, Ember Breath feeds" |
| "Begin circulating {method}" | `button` | "Begin circulating {method}" | Opens FC12 |
| Headroom line (FC6) | `p` | Its text | Not live (FC6) |
| Plan block (FC7) | `section`, headed by an `h3` "Plan", `tabindex="-1"` | "Plan" | "Plan this" and refusal focus target |
| The chips | `fieldset` with the `legend` "Choose four ingredients" | — | — |
| Pick chip (FC7a) | `input type="checkbox"` with a `label` | "{ingredient}, {in hand or not yet}" | Checked means in the plan. While four are chosen, each unchosen chip is `aria-disabled="true"`, described by the visible "The plan holds four. Take one out first." |
| Count and reason line | One region, `role="status"` (polite) | "{k} of 4 chosen", then the reason line's text; "Ready to forge." when Forge appears | The region reports the result of a pick (AR-P4). "Ready to forge." is visually hidden, because the Forge button shows it |
| Forge (FC7c) | `button` | "Forge" | Absent, not disabled, when the plan cannot be forged |
| Preview heading (FC8) | `button` inside an `h3` | "Foundation preview, {h} of 4 in hand" or "Foundation preview, {s} of 6 seals" | Opens FC8f |
| Affinity lines (FC8a) | `ul`, one `li` each | "Cinder 130, clash with Bark, minus 15, after clash 115, might 135" | Signs in words, never left to how a reader voices U+2212 |
| Withheld rows (FC8b) | `p`, then a `ul` | "Furnace Gate, not yet shown" | — |
| Door rows (FC8c) | `ul` | "Furnace Gate, open, proof 14,000, wide from 15,000" | The tier word carries the glyph |
| Ingredient rows (FC9a) | `ul`; each name a `button` | "{ingredient}", then its state words and values as text | Marks read as #14's phrases |
| Route rows (FC9b) | As IP13 and #13 C11 | As IP13, led by the family word | — |
| Makeups in hand (FC10) | `section` headed by an `h3`; the list an `ol`, because its order is a ranking | "{s} of 6 seals, {four names}, Furnace Gate open, Deep Well open, Listening Hall wide open" | "Plan this: {four names}" is a `button`; "In the plan" is text |
| Refusal line (FS14) | `role="status"` | The rules core's reason | Added to AR-P4's table (Changes needed, A-2) |
| Forged view heading (FC13) | `button` inside an `h3` | "The Foundation" | PD16 target after the forge; opens the Goal card |
| Channel lines (FS15) | SVG, `aria-hidden`, no pointer events | — | Decoration |
| Commit dialog, forge confirmation | #13 C17: a native `dialog`, its title as its heading and its label | Every line in order; Cancel focused on open | **In AR-P7's tested scope** |

**What is announced, and how** (AR-P4):

- **A pick** updates the status region: the count, then the reason or "Ready to forge.".
- **The commit:** focus moves to the Road's heading, and #13's log line "Circulating {method}."
  arrives through the log. This view announces nothing of its own.
- **The forge:** focus moves to "The Foundation", which the reader announces, and #13's log line
  "Foundation forged from …" follows. No live region of this view repeats it.
- **An ingredient arriving:** its log line (#13). The preview is not live, so a reader is never
  interrupted by a repaint.
- **A refusal:** the `status` line.

**Tested scope** (AR-P7). The commit dialog and the forge confirmation are screen-reader tested
with NVDA and Chrome on Windows and VoiceOver and Safari on iOS (AC-15-35). The rest of the view
meets AR-P1 to AR-P4 and is checked by axe and by keyboard. No screen-reader play-through of it
is committed (accessibility requirements, Known Intentional Limitations).

---

## Localization Considerations

**Rules for every string on this view:**

- Every string is keyed. None is built by joining fragments. Templates use named placeholders
  ("{method}", "{names}", "{s}"), so a translation may reorder them.
- Counts use the locale's plural rules: "Choose {n} more.", "holds {b} seals", "{h} seals",
  "Makeups in hand · {n}". English needs "1 seal" in the headroom line, and the
  "{s} of 6 seals" form needs a plural rule in other languages.
- Lists of names use the locale's list format (`Intl.ListFormat`): "Echo Jade, Ironbark
  Heartwood, Ember Marrow and Cloud Lotus".
- Numbers use the locale's number format ("14,000"). Durations use #13's format.
- The clash uses U+2212 and "=". The cap change uses "→". These are symbols, not words, and stay
  in logical order. Layout uses inline-start and inline-end throughout (FC5, FC11, FC12), so a
  right-to-left locale mirrors without a separate layout.
- Names are content (#1 R4, at most 24 code points). A translated name that passes the limit
  makes a chip taller, never truncated.
- **Order never depends on the language.** Makeups, ties, names and doors follow content order
  (FC4, FC10), never an alphabetical sort, so a translation never re-ranks a list.
- Glyphs carry no text.

**HIGH PRIORITY for the localization engineer: elements that a 40 % expansion stresses.**

| Element | English (longest) | Budget at 390 px | What happens at +40 % |
|---|---|---|---|
| Pick chip (FC7a) | A 24-code-point name and "not yet" | 3 lines in a third of the row | The chip grows taller and the row's chips match its height. Check that the 390 × 844 adjacency still holds (AC-15-32) |
| "Begin circulating {method}" | 30 characters | 2 lines | The button grows to 2 lines and keeps 44 px of height |
| Headroom line (FC6) | About 95 characters | 3 lines | Wraps; nothing beside it |
| Withheld lead sentence (FC8b) | About 90 characters | 3 lines | Wraps |
| Fifth-pick sentence (FC7a) | 40 characters | 1–2 lines | Wraps |
| Door row (FC8c) | "Listening Hall ●● wide open · proof 15,700 · wide from 15,000" | 2 lines | Wraps at "·" only |
| Makeup line (FC10) | About 110 characters, with the door glyphs | 3 lines | May reach 4 lines. Allowed: the 3-line figure is a target, not a clip |
| Dialog lines (FC11, FC12) | The consumed list and the closes list | The dialog scrolls inside #13's container | Wraps; the buttons stay at the end |
| Affinity line (FC8a) | "▲ Cinder 130 − 15 = 115 · might 135" | 1 line, 2 at 320 px | Wraps between its halves only (Accessibility, AR-V4) |

No string on this view shows a date or a currency.

---

## Acceptance Criteria

**Fixture.** The shipped provisional content (#6 S9). The ingredients, in content order: Echo
Jade, Ironbark Heartwood, Ember Marrow, Cloud Lotus, Ghost Moss, Tidewater Pearl. The doors, in
order: Furnace Gate, Deep Well, Listening Hall. EB is Ember Breath and SW is Still Water. Glyphs
in quoted text are the placeholders of this spec (▲ ■ ▼ ◆, ○○ ●○ ●●, – –); a test matches the
shipped glyph by its text alternative. A debug action that sets `held` is allowed in test builds
only. "In the frame" means before the next animation frame after the input or event.

**Choosing and the commit**

- [ ] **AC-15-01** [UI] **GIVEN** a first game (no save), **WHEN** the page loads, **THEN** the
  Forge view shows the heading "Forge", the EB column then the SW column, each with its feeds as
  "+{n}" deltas, its quenches as "quenched", its "Opens:" and "Closes:" lines and its "Begin
  circulating {method}" button. No absolute contribution appears in either column, there is no
  last-run line, and no element on the view has a hue (computed colours are ink or the base).
- [ ] **AC-15-02** [UI] **GIVEN** Choosing, **WHEN** "Begin circulating Ember Breath" is
  activated, **THEN** a dialog opens with focus on Cancel, reading in order: "Begin circulating
  Ember Breath", the method's commit text, its "Opens:", "Feeds:" and "Quenches:" lines, "Closes:
  Still Water", one "Closes:" line for each source only Still Water opens, and "Redo: only by
  starting a new run". Cancel, or Esc, closes it, changes nothing, and returns focus to the
  button.
- [ ] **AC-15-03** [integration] **GIVEN** that dialog, **WHEN** the player confirms, **THEN** in
  the confirm's frame the dialog closes, the save is written and the centre shows the Road with
  focus on its heading. **WHEN** the player returns to the Forge tab, **THEN** the method columns
  are gone, the headroom line reads "The best Foundation here holds 4 seals under Ember
  Breath.", the plan chosen before the commit is unchanged, and the method's marks are solid.
- [ ] **AC-15-04** [UI] **GIVEN** a 1440 × 900 window, **THEN** the method columns sit side by
  side and the six chips sit in one row. **GIVEN** 1000 × 800 or 390 × 844, **THEN** the columns
  stack, EB first, and the chips sit in rows of three. Resizing across the split changes the
  arrangement with no reload and no lost state.

**The plan**

- [ ] **AC-15-05** [UI] **GIVEN** Open with nothing chosen, **WHEN** chips are checked one at a
  time, **THEN** in the frame of each tap the count reads "1 of 4 chosen" to "4 of 4 chosen",
  the reason line reads "Choose 3 more.", "Choose 2 more." and "Choose 1 more.", and each chosen
  ingredient's row gains "· in plan".
- [ ] **AC-15-06** [UI] **GIVEN** four chosen, **THEN** "The plan holds four. Take one out
  first." is visible under the chips. **WHEN** an unchosen chip is clicked, tapped or toggled
  with Space, **THEN** nothing changes and the chip keeps focus, and a screen reader reads it as
  unavailable with that sentence. **WHEN** any chosen chip is unchecked, **THEN** every chip is
  available again and the sentence is gone.
- [ ] **AC-15-07** [UI] **GIVEN** Choosing with four chosen, **THEN** the reason line reads only
  "Needs a method committed". **GIVEN** Open under EB with Echo Jade, Ironbark Heartwood, Ember
  Marrow and Cloud Lotus chosen and only Echo Jade held, **THEN** it reads, in this order, "Needs
  Ironbark Heartwood in hand", "Needs Ember Marrow in hand", "Needs Cloud Lotus in hand". In
  both cases no Forge button exists in the DOM.

**The preview**

- [ ] **AC-15-08** [UI] **GIVEN** Open under EB, every ingredient held but Cloud Lotus, and the
  plan Echo Jade, Ironbark Heartwood, Ember Marrow, Cloud Lotus, **THEN** the preview heading
  reads "Foundation preview · 3 of 4 in hand"; the affinity lines read exactly "▲ Cinder 105 − 15
  = 90 · might 110", "■ Jade 45 − 10 = 35 · guard 45", "▼ Bark 30 − 52 = 0 · vigor 100" and "◆
  Gale 20 − 22 = 0 · speed 0"; then "Doors, seals and widened stores show once all four are in
  hand (3 of 4 held)." and "– – Furnace Gate · not yet shown", "– – Deep Well · not yet shown",
  "– – Listening Hall · not yet shown". No seal count, tier glyph, proof or store cap appears in
  the preview.
- [ ] **AC-15-09** [UI] **GIVEN** the same plan with all six held, **THEN** the affinity lines
  read "▲ Cinder 130 − 15 = 115 · might 135", "■ Jade 55 − 32 = 23 · guard 33", "▼ Bark 30 − 65 =
  0 · vigor 100" and "◆ Gale 65 − 27 = 38 · speed 38"; the door rows read "Furnace Gate ●○ open ·
  proof 14,000 · wide from 15,000", "Deep Well ●○ open · proof 14,400 · wide from 15,000" and
  "Listening Hall ●● wide open · proof 15,700"; then "4 of 6 seals" and "Widens Ash Tallow 40 →
  60 · Rendered Oil 12 → 18 · Rough Jade 20 → 25 · Jade Blank 8 → 10". Forge stands where the
  reason line was.
- [ ] **AC-15-10** [UI] **GIVEN** Open under EB, only Cloud Lotus held and Cloud Lotus chosen,
  **THEN** the affinity lines read "▲ Cinder 25 · might 45", "■ Jade 10 − 22 = 0 · guard 10", "▼
  Bark 0 · vigor 100" and "◆ Gale 45 − 5 = 40 · speed 40". No line contains "− 0".
- [ ] **AC-15-11** [UI] **GIVEN** a plan none of whose chosen ingredients is held, **THEN** the
  preview shows "What the plan's ingredients give together shows once one of them is in hand."
  in place of the affinity lines, and no zero value.
- [ ] **AC-15-12** [integration] **GIVEN** AC-15-08's state with the view scrolled to the
  preview, **WHEN** a Cloud Lotus arrives from any route, **THEN** in that frame the Cloud Lotus
  chip and row read "in hand", AC-15-09's door rows replace the withheld rows in the same place
  and order, the seals and widened stores appear, Forge replaces the reason line, F8 lists 15
  makeups and the headroom line adds "Your best in hand: 4 seals.". The view does not scroll and
  focus does not move.
- [ ] **AC-15-13** [unit, property] **FOR** every plan of four, every held set (all 64) and each
  method, **THEN** the rendered view contains a door tier, a proof, a seal count or a widened
  cap for that plan only when all four chosen ingredients are held, and F8 lists exactly the
  makeups wholly in hand.

**Headroom and the makeups in hand**

- [ ] **AC-15-14** [UI] **GIVEN** Open under EB with all but Cloud Lotus held, **THEN** the
  headroom line reads "The best Foundation here holds 4 seals under Ember Breath. Your best in
  hand: 3 seals.". **GIVEN** fewer than four held, **THEN** only the first sentence shows.
  **GIVEN** Choosing or Forged, **THEN** there is no headroom line. Its text never contains an
  ingredient's, a makeup's or a source's name.
- [ ] **AC-15-15** [UI] **GIVEN** a forgeable plan worth 3 seals under EB (Echo Jade, Ironbark
  Heartwood, Ember Marrow, Ghost Moss), **WHEN** the forge confirmation opens, **THEN** "The best
  Foundation here holds 4 seals." stands above the redo line. For a plan worth 4, it is absent.
- [ ] **AC-15-16** [UI] **GIVEN** Open under EB with all but Cloud Lotus held, **THEN** F8 reads
  "Makeups in hand · 5" and lists, in this order: 3 seals, Echo Jade, Ironbark Heartwood, Ember
  Marrow, Ghost Moss; 3 seals, Echo Jade, Ironbark Heartwood, Ember Marrow, Tidewater Pearl; 1
  seal, Echo Jade, Ember Marrow, Ghost Moss, Tidewater Pearl; 0 seals, Echo Jade, Ironbark
  Heartwood, Ghost Moss, Tidewater Pearl; 0 seals, Ironbark Heartwood, Ember Marrow, Ghost Moss,
  Tidewater Pearl. A line with shut doors differs from the others only by its glyphs and words.
- [ ] **AC-15-17** [UI] **WHEN** "Plan this" is activated on F8's first line, **THEN** in the
  frame the chips hold exactly those four, the preview shows that makeup, the line reads "In the
  plan" with no button, and focus is on the plan block's heading "Plan".
- [ ] **AC-15-18** [UI] **GIVEN** fewer than four ingredients held, **THEN** F8 reads "No makeup
  is fully in hand yet. Hold four to compare."

**Routes and contributions**

- [ ] **AC-15-19** [UI] **GIVEN** Open under EB with Cloud Lotus chosen and not held, **THEN**
  exactly two route rows sit under its row: "Recipe · Open a Cloud Lotus" with "Rendered Oil
  ×12" and "Seasoned Plank ×6", and "Hunt · Heron Hunt" with the solid open mark, "Seasoned
  Plank ×5" and its exact fight result; each shows the duration the Road shows for it, and there
  is no Still Deep row. **GIVEN** the same under SW, **THEN** the rows are the recipe and "Floor ·
  Still Deep II", and there is no Heron Hunt row. An ingredient that is in hand, or not in the
  plan, has no route rows.
- [ ] **AC-15-20** [UI] **GIVEN** Choosing with Cloud Lotus chosen, **THEN** its route rows are
  the recipe, Heron Hunt and Still Deep II, each Waiting with "Needs a method committed" and no
  Start.
- [ ] **AC-15-21** [integration] **GIVEN** a Ready route row on the Forge view, **WHEN** its Start
  is activated, **THEN** the route runs exactly as if started on the Road (#13's running line
  shows it and the save is written) and the view stays on Forge.
- [ ] **AC-15-22** [UI] **GIVEN** Choosing, **THEN** Echo Jade's row reads "What it gives shows
  once it is in hand." and "▼ Bark +20" with Still Water's hollow raise mark; Tidewater Pearl's
  shows "▼ Bark +30" with Still Water's; Ember Marrow's shows "▲ Cinder +10" and Ironbark
  Heartwood's "■ Jade quenched", each with Ember Breath's hollow mark; no row shows an absolute
  contribution. **WHEN** EB is committed, **THEN** the Still Water lines are gone and the Ember
  Breath marks are solid.

**The forge**

- [ ] **AC-15-23** [integration] **GIVEN** AC-15-09's plan, **WHEN** Forge is activated, **THEN**
  a dialog opens with focus on Cancel, reading "Forge the Foundation", "Consumes Echo Jade,
  Ironbark Heartwood, Ember Marrow and Cloud Lotus.", "Ghost Moss and Tidewater Pearl stay in
  hand.", the three door rows, "4 of 6 seals", the widened stores and "Redo: only by starting a
  new run". Cancel, or Esc, changes nothing and returns focus to Forge.
- [ ] **AC-15-24** [integration] **WHEN** the forge is confirmed, **THEN** in the confirm's frame
  the dialog closes, the four are consumed, the save is written, and the Forge view shows "The
  Foundation" (focused), "Forged from Echo Jade, Ironbark Heartwood, Ember Marrow and Cloud
  Lotus.", each door's row with its flavour beneath, "4 of 6 seals", AC-15-09's affinity lines
  and "Widened Ash Tallow to 60 · Rendered Oil to 18 · Rough Jade to 25 · Jade Blank to 10". The
  plan, the headroom line and F8 are gone, and the seals equal the preview's.
- [ ] **AC-15-25** [integration] **GIVEN** a forged save, **WHEN** it is loaded by a build whose
  content changes an ingredient's contribution, **THEN** the forged view shows the values it
  showed before.
- [ ] **AC-15-26** [integration, stubbed refusal] **GIVEN** the forge confirmation open, **WHEN**
  a planned ingredient leaves the hand before the confirm (a test hook) and the player confirms,
  **THEN** the dialog closes, nothing changes, no log line is written, the reason line reads
  "Needs {ingredient} in hand" in a `status` region, and focus is on the plan block's heading.
- [ ] **AC-15-27** [integration, stubbed refusal] **GIVEN** the commit dialog open, **WHEN** the
  rules core refuses the commit, **THEN** the dialog closes, nothing changes, no log line is
  written, the reason shows as a `status` line under that column's "Begin circulating", and
  focus is on that button.
- [ ] **AC-15-28** [visual, performance trace] **GIVEN** default motion settings, **WHEN** the
  forge is confirmed, **THEN** the first frame already holds every final tier, seal, stat and
  cap; tinted channel lines run from the four names to the seals; the door glyphs and the seals
  settle together; nothing of the moment remains 400 ms after the confirm; nothing flashes; text,
  tiers and seals stay in ink; and a Tab or a tap during the moment acts at once. **GIVEN**
  `prefers-reduced-motion: reduce`, **THEN** nothing moves and no channel line is drawn.
  Reloading a forged save plays nothing.

**The last run and the plan's lifetime**

- [ ] **AC-15-29** [integration] **GIVEN** a run forged under Still Water, **WHEN** a new run is
  confirmed, **THEN** the Forge view in Choosing begins with "Last run at {realm}, under Still
  Water:" (the method's glyph hollow and in ink), that run's four names in content order, each
  door with the tier its forged view showed, and its seals. The line stays in Open and Forged,
  never contains "best", "beat", "record" or "previous", is not focusable and opens nothing.
  **GIVEN** a new run cleared before its forge, **THEN** the line is unchanged; **GIVEN** a first
  game, **THEN** it is absent.
- [ ] **AC-15-30** [integration] **GIVEN** a plan of four, **WHEN** the player switches to the
  Road and back, commits, or leaves the tab open through an hour of away time, **THEN** the plan
  is unchanged. **WHEN** the page reloads, a save is loaded or a new run starts, **THEN** the plan
  is empty. The saved bytes are identical before and after any pick.

**Layout, accessibility and performance**

- [ ] **AC-15-31** [UI] At 320, 360 and 390 CSS px wide, and at 1280 px wide with 200 % zoom and
  with 200 % text size, in each phase: nothing scrolls sideways, no name truncates, a value never
  separates from its mark, an affinity line wraps only between its two halves, and every
  function stays reachable.
- [ ] **AC-15-32** [UI] At 390 × 844, Open, with no notice showing and the plan block's heading
  scrolled to the top of the content zone, the six chips, the reason line or Forge, the preview
  heading and the four affinity lines are all visible without scrolling.
- [ ] **AC-15-33** [visual] Under a greyscale filter, a tester can name, for every element: each
  affinity, each door's tier or "not yet shown", which chips are chosen and which held, each
  mark's method and verb, and each method before the commit. On the shipped glyph sheet the four
  affinity glyphs and the withheld glyph differ in silhouette from each other, from #14's method
  glyphs and from #13's state and tier glyphs.
- [ ] **AC-15-34** [UI, keyboard] With the keyboard alone, a tester can commit, pick four, open
  the Plan card, drill down and back, start a route, use "Plan this", forge and open the Goal
  card, in the tab order of the Interaction Map. Focus is always visible. Esc closes every card
  and dialog and returns focus to its opener. Focus lands on the Road's heading after the commit
  and on "The Foundation" after the forge.
- [ ] **AC-15-35** [manual, screen reader] With NVDA and Chrome on Windows, and VoiceOver and
  Safari on iOS, the commit dialog and the forge confirmation read every line in order, each mark
  as words ("Ember Marrow, Cinder plus 10, Ember Breath feeds"), and each button by name.
  Checking a chip announces the new count and reason; an unavailable chip announces its reason.
- [ ] **AC-15-36** [automated] axe-core reports no violations on the Forge view in Choosing,
  Open with the preview withheld, Open with it shown, and Forged, and on each dialog, at 390 and
  1440 px.
- [ ] **AC-15-37** [UI] With a coarse pointer every chip, button, record name and route control
  is at least 44 × 44 CSS px; with a fine pointer at least 32 × 32; no two overlap. Hovering or
  focusing any element opens and shows nothing.
- [ ] **AC-15-38** [performance] On the build machine at wide size, with all six held: a pick,
  a "Plan this" or an arriving ingredient repaints the Forge view, including F8's 15 makeups,
  in the next frame (at most 16 ms, as #13 AC-13-31); a dialog opens in the next frame; the Plan
  card opens within 100 ms.
- [ ] **AC-15-39** [copy review] The `writer` has reviewed every string of this view. None
  contains "total", "effective value", "score", "patch", "triple", "change set", "frozen set" or
  "MVP", and every count reads correctly at 1 ("holds 1 seal").
- [ ] **AC-15-40** [UI, Wave A build] In the checkpoint build, #13's goal line and three
  instruction lines sit under "Forge" with #13's strings, and the goal line opens the Goal card.
  In the shell build they are absent from the Forge view.

---

## Requirement Trace and Gap Coverage

### GDD and spec requirements

Every requirement found by searching `design/gdd/*.md`, the systems index and the other UX
specs for "#15", "forge screen" and "Forge screen" maps to a rule here.

| Source | Requirement | Covered by |
|---|---|---|
| #6 UI Requirements 1 | A plan of four, each held or not; why it cannot be forged, in words | FC7 (FS2); AC-15-05 to AC-15-07 |
| #6 UI Requirements 2 | Only what `preview` returns; caps only when previewable | FC8, FC8e; architecture flag 1 (G-1); AC-15-08, AC-15-09, AC-15-13 |
| #6 UI Requirements 3 | Compare the makeups in hand | FC10 (FS7); AC-15-16 |
| #6 UI Requirements 4 | The headroom signal, never naming the makeup | FC6 (FS8); AC-15-14, AC-15-15 |
| #6 UI Requirements 5 | The confirmation names the four and the seals, and says there is no reforge | FC11 (the redo line); AC-15-23 |
| #6 UI Requirements 6 | After the forge: the snapshot, each door's tier and `flavor` | FC13; AC-15-24, AC-15-25 |
| #6 UI Requirements 7 | Every stat, score and cap opens its breakdown on tap; nothing hover-only | FC8f (FS6); Interaction Map; AC-15-37 |
| #6 UI Requirements 8 | Player words for "total", "effective value", "score" | FS10; AC-15-39 |
| #6 Visual/Audio | Affinity glyphs that name their stat; the clash as a visible loss; tiers by word and glyph; the forge as one moment; no audio | FS11, FC9 key, FC8a, FC8c, FS15 |
| #6 Game Feel | Instant; the reveal is in the gathering; the clash bites as you build; one weighty step | AC-15-38; AC-15-12; FC8a; FC11 |
| #6 G7.3, G7.4 | The held part's affinities before any seal; `bestSeals` as a realm fact | FC8a; FC6 |
| #6 G13.4, rule 70 | Each door's `flavor` once forged | FC13 |
| #7 UI Requirements 1 | Both methods side by side from the first screen; deltas, "quenched", opens, closes; no absolute contribution | FC5 (FS3); AC-15-01, AC-15-22 |
| #7 UI Requirements 2 | "Begin circulating [method]"; Cancel always; a refused commit shows its reason | FC5, FC12, FS14; AC-15-02, AC-15-27 |
| #7 UI Requirements 3, 4 | The method always on screen; the other method readable | #13 C3 (the Method card); FC5's note on leaving F3 |
| #7 UI Requirements 5 | Route families named wherever sources are listed | FC9b (FS4); AC-15-19, AC-15-20 |
| #7 UI Requirements 6 | Every changed value marked, with its breakdown on tap | FC9a's marks (#14); FC8f |
| #7 UI Requirements 7 | Words | AC-15-39 |
| #7 Edge Cases | Empty blocks left out; lines wrap; the plan survives the commit | FC5; Transitions between phases; AC-15-03 |
| #11 UI Requirements 5 | The last-run line: realm, method with #14's mark, names, tiers, seals; a comparison, never a best | FC4 (FS9); AC-15-29 |
| #11 D7, FS13 | `lastRun` read-only; the save format unchanged | FC4; FS13; AC-15-30 |
| #8 UI Requirements 4 | Each unheld ingredient's recipe, its fight route if any, and their gathering times | FC9b, with "gathering time" read as the route's effective duration (G-7; Open Questions 5) |
| #5 UI Requirements 2 | Proving results under the preview rule | FC8; AC-15-13 |
| #5 UI Requirements 3; #5 Visual/Audio | A fight number opens the four stats on each side; the decider named | FC8f, the proof's drill-down |
| #3 Open Question 5 (resolved by #6) | Caps feed the choice under the seals' rule | FC8e |
| #3 UX flag | The persistent stores, the cap breakdown, the full state and the spill line | The cap breakdown in the forge preview: FC8f. The stores, the full state and the spill line are #13's |
| #7 Visual/Audio; #7 Open Questions (the dialog) | The commit as one moment; no delay or hold-to-confirm; the dialog wraps at 390 px | Transitions & Animations (the commit row); FC12 in IP3; Localization |
| #5 F7 (Score: "how close a door was") | A score shows how close a door came | FC8c's next threshold beside the proof |
| #1 UI Requirements | Render by field; generated need text; numbers from fields; the method-choice view shows a hidden source's name only, `add` as a delta and `set` as "changed" | #13 C16 for cards; FC7b and route rows; FC5 (#14 MK7); AC-15-22 |
| #1 AC-U-1 | Blocked on #14 and #15 | FC5 defines the view the test reads (G-6) |
| #9 Visual/Audio | "The held mark updates … in #15's ingredient list" | FC9a; AC-15-12 |
| Systems index ¶15 | Plan with unheld ingredients; contributions under the method; seals once in hand; the Wave A goal line and instructions; the headroom signal before the forge; the accent before the commit; the forge's visual event | FC7; FC9a; FC8; F1; FC6; FS12; FS15 |
| Systems index, decision 4 | "Onboarding and a pre-commit headroom signal in Wave A" | F1 carries the onboarding. "Pre-commit" is read as before the forge, ¶15's own words; before the method commit both bests are 4, so the line would tell a chooser nothing (FC6; Open Questions 12) |
| #13 Seams; Open Questions 14 | #15 builds the Wave A goal line and instruction from C1 and C2 | F1 (FC2, FC3); AC-15-40 |
| #14 Open Questions 12 | The accent; the view's and dialog's layout; the words; the affinity and tier glyphs | FS12; FC5, FC12; FS10; FS11 |
| #14 Open Questions 13 | #15's half of the commit moment | Transitions & Animations, the commit row |
| Accessibility matrix rows 6, 7, 8, 15; colour audit row | Loads above four carried; the accent | Accessibility, AR-C7 and AR-V5 |
| Pattern library, PD19 | IP1–IP3, IP6–IP10, IP13 and IP20–IP22 as they stand | Component Inventory; FC9b uses IP13 unchanged |

### The twelve gaps (pattern library, "For #15 Forge screen")

| Gap | Status | Rule | Deferred part and its owner |
|---|---|---|---|
| 1 Pick 4 of 6 | **Met** | FS2; FC7, FC7a (IP26) | — |
| 2 Side-by-side method columns | **Met** | FS3; FC5 (IP24) | — |
| 3 Withheld until in hand | **Met** | FS5; FC8b (IP28) | — |
| 4 Comparing held makeups | **Met** | FS7; FC10 (IP30) | — |
| 5 The headroom signal | **Met** | FS8; FC6 (IP25) | Whether it helps without steering: a playtest, the designer (Open Questions 10) |
| 6 The accent before the commit | **Met** | FS12 | — |
| 7 Affinity and door-tier glyphs | **Met** for forms and rules | FS11; Accessibility, AR-V5 | The final drawings: the art bible, `art-director` (Open Questions 2) |
| 8 Words for composed numbers | **Met** | FS10 | The copy review: `writer` (Open Questions 9) |
| 9 The forge's visual moment | **Met** for its form, bound and reduced-motion form | FS15; Transitions & Animations | The drawing and easing: the art bible, `art-director`. The tint on its lines: #14 MK6's amendment, approved at merge (Open Questions 2, 8) |
| 10 A refused act inside a dialog | **Met** | FS14; Interaction Map | — |
| 11 The ingredient row at 390 px | **Met** | FS4; FC9a (IP29), FC9b | One-handed reach of cards: #17 (Open Questions 7) |
| 12 Whether a plan is saved | **Met** | FS13 | — |

---

## Changes needed in existing specs

**Applied at merge on 2026-11-22**, with the designer's approval. Two differ from the rows below:
P-1's patterns are catalogue rows that point here (library PD20), and 14-5's rename also reaches
#14 line 524, AC-14-12 and the library's IP2 reference. **Line numbers are as of commit 359de97**, this branch's base.

### GDDs (G)

| # | Where | Change | Why |
|---|---|---|---|
| G-1 | `design/gdd/forge-and-proving.md` line 161 (G1 table, `preview`) and lines 996–999 (UI Requirements 2) | `preview`'s result for a previewable plan carries the Foundation entries, or each widened store's new cap. UI Requirements 2's "each widened store's new cap from `foundationEntries`" becomes "…, which `preview` returns" | Architecture flag 1: G7 stays a property of one pure function. #6's ADR 2 |
| G-2 | Same file, line 156 (G1 table, `foundationStats`) | Its result carries each affinity's clash amount, beside the total and effective value | Architecture flag 2; #14 Open Questions 9. #6's ADR 2 |
| G-3 | Same file, line 1111 (AC-G8-1) and G8.1 | A refused forge of a planned makeup names every ingredient not in hand, in `realm.ingredients` order, not only the first | Architecture flag 3; FC7b. #6's ADR 2 |
| G-4 | Same file, line 229 (G4.2) | "the forge screen (#15) may keep it" becomes "the forge screen (#15) keeps it as interface state and never saves it (#15 FS13)" | FS13 |
| G-5 | Same file, lines 874–876 (Edge Cases, a kept plan with an unknown id) | Note that it cannot arise while the plan is unsaved (#15 FS13). Keep the rule for a later saved plan | FS13 |
| G-6 | Same file, line 1216 (Open Questions row 4, the headroom signal's form) | Resolved by #15 FS8 and FC6. The "does it help" half moves to #15 Open Questions 10 | FS8 |
| G-7 | `design/gdd/crafting-route.md` line 834 (UI Requirements 4) | "their gathering times" becomes "their durations, as the road shows them" | FC9b; Open Questions 5 |
| G-8 | `design/gdd/content-records-and-schema.md` line 1711 (AC-U-1) | Drop "[blocked: #14, #15]": #14 MK7 and #15 FC5 define what the test reads | Both specs now exist |
| G-9 | `design/gdd/methods.md` lines 1016–1017 (ADRs required, item 1) | Item 1 also covers the method-choice view's content: one W1 function whose lines carry their kind (feed, quench, open, close), as `closesLines` must | Architecture flag 4; #14 Open Questions 8 |

Applied here, as the task allows: `design/gdd/systems-index.md` line 252 (row 15: Designed, with
this file) and lines 492 and 495 (Design docs started 15; MVP systems designed 15/15).

### Interface shell, `design/ux/interface-shell.md` (13)

| # | Where | Change |
|---|---|---|
| 13-1 | Line 93, Seams row "Forge screen (#15), later" | Point to `design/ux/forge-screen.md`, Scope, Seams and Reference Rules |
| 13-2 | Lines 332–338, the Goal card | Add: #15's Plan card (FC8f) uses this layout, read from `preview` instead of the snapshot |
| 13-3 | Lines 500–502, C16 "Opening" | Add the Forge view's "Foundation preview" heading (opens the Plan card) and "The Foundation" heading (opens the Goal card) to the list of what opens the container |
| 13-4 | Line 1094, the Messages row | Add #15's refusal line (FS14) and the plan block's status region (count, reason, "Ready to forge.") |
| 13-5 | Line 1298, AC-13-34 | Add #15's four affinity glyphs, the withheld glyph and the chip's check glyph to the sheet tested for silhouette distinctness |
| 13-6 | Line 1387, trace row "#11 UI Requirements 5 / The last-run line / #15 (not here)" | "#15 FC4" |
| 13-7 | Line 1388, trace row "#6, #7, #15 seams" | Cite #15's Seams table |
| 13-8 | Line 1403, "#15 must still match the seams above" | "#15 matches them (`design/ux/forge-screen.md`, Seams)" |
| 13-9 | Line 1429, Open Questions 3 (the art bible's glyph set) | Add #15's affinity and withheld glyphs and the forge's channel lines |
| 13-10 | Line 1440, Open Questions 14 (the Wave A build) | Resolved by #15 F1 (FC2, FC3). The checkpoint's tab wording stays open as #15 Open Questions 3 |
| 13-11 | Line 214, Entry row "Load save confirmed" | Add "and the Forge view opens", as PD16 and the New run row already say |

### Method marks, `design/ux/method-marks.md` (14)

| # | Where | Change |
|---|---|---|
| 14-1 | Lines 234–239, MK2 "Glyphs other specs draw" | Name #15's forms: Cinder ▲, Bark ▼, Jade ■, Gale ◆ (filled solids, opposed pairs inverted); tiers ○○ ●○ ●● from #13 C1; withheld "– –"; all in ink (#15 FS11) |
| 14-2 | Lines 268–270, MK4 | "whether a hollow glyph takes a colour is the Forge screen's" becomes "a hollow glyph takes no colour before the commit (#15 FS12)" |
| 14-3 | Lines 292–295, MK6 | Add #15's forge-moment channel lines (FS15) to where the tint may appear: decorative, at most 400 ms, removed under reduced motion. Tiers and seals stay without hue. Needs the owner's approval (Open Questions 8) |
| 14-4 | Lines 390–395, BD5 | Header (line 390): the words are #15's (FS10). "An affinity total" (line 392) reads "{affinity} gathered"; "An affinity after its clash" (line 393) reads "{affinity} after clash"; "A door's proving score" (line 395) reads "proof" |
| 14-5 | Line 503 (W4), lines 519 and 528 | "Cinder total" becomes "Cinder gathered" |
| 14-6 | Line 733, "The forge screen's hosts are #15's (not yet written)" | Cite #15 FC5, FC8f, FC9a and FC12 |
| 14-7 | Line 763, the Words row | Add FS10's words |
| 14-8 | Lines 1096–1097, Open Questions 12 and 13 | Resolved by #15: FS10–FS12, FC5, FC12, and Transitions & Animations (the commit row) |
| 14-9 | Line 1109, cross-reference row "#15: not assessed" | Assessed against `design/ux/forge-screen.md`: no mismatch |

### Interaction pattern library, `design/ux/interaction-patterns.md` (P)

| # | Where | Change |
|---|---|---|
| P-1 | The catalogue (after IP23), and the single-use tables near lines 140–150 | Add IP24 Method column, IP25 Realm-fact line, IP26 Pick chip, IP27 Affinity line, IP28 Withheld preview, IP29 Ingredient row and IP30 Makeup line, from #15 FC5, FC6, FC7a, FC8a, FC8b, FC9a and FC10. Add a "#15 component" table with FC4 (last-run line) as single-use |
| P-2 | Line 109 (IP1's catalogue row) and line 178 (IP1 "Used In") | Add the Plan card (#15 FC8f) and the Forge view's two headings |
| P-3 | Lines 344–345, IP3's Forge contents | Add what stays in hand, the widened stores, the headroom echo when the plan earns fewer, and the redo line (#15 FC11) |
| P-4 | Line 398, IP3's note on refusals | Resolved by #15 FS14: the dialog closes; the reason is a `status` line at the opener; focus as #15's Interaction Map says |
| P-5 | Line 1310, Animation Standards row "The forge's visual event" | #15 FS15: channel lines 240 ms, then a settle of 160 ms, at most 400 ms; removed under reduced motion |
| P-6 | Line 1323, "Whether that cap binds every screen" | Answered by AR-V6: every animation is capped at 400 ms |
| P-7 | Lines 1355–1368, gaps 1–12 | Mark each met, with its #15 rule (Requirement Trace, the twelve gaps) |
| P-8 | Line 1445, Open Questions 10 (the library-wide motion cap) | Resolved by AR-V6 |

### Accessibility requirements, `design/accessibility-requirements.md` (A)

| # | Where | Change |
|---|---|---|
| A-1 | Line 181, AR-V6 "Today that means …" | Add #15's forge moment (FS15) |
| A-2 | Lines 421–427, AR-P4's table | Add #15's refusal line and the plan block's count-and-reason region, both `status` |
| A-3 | Line 221, colour audit row for #15 | "Open" becomes "Resolved: no hue before the commit; the glyph and the name carry the method (#15 FS12)" |
| A-4 | Lines 485–487, matrix rows 6, 7 and 8 | "Pending (#15)" becomes "Yes (#15)", citing FS7 and FS8 (row 6), FS3 (row 7) and FS4 (row 8) |
| A-5 | Line 494, matrix row 15 | "Not started" becomes "Specified: `design/ux/forge-screen.md`, Accessibility" |
| A-6 | Line 626, Open Questions "#15's accent before the commit" | Resolved by #15 FS12 |

---

## Open Questions

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | **No player journey map.** The arrival contexts under Player Context on Arrival are reasoned from the concept and the GDDs. Author `design/player-journey.md` and check them | Designer | Before `/ux-review` of #13–#15 |
| 2 | **No art bible.** The affinity and withheld glyphs are forms, not drawings. The forge's channel lines, their easing and the settle need drawing inside FS15's bounds and the silhouette rules (Accessibility, AR-V5) | Art bible (`/art-bible`), `art-director` | Before the vertical slice's visual pass |
| 3 | **The Wave A tab wording.** If the checkpoint build has no view tabs, #13 C2's line "compare makeups on the Forge tab" points at nothing. Either the checkpoint has tabs, or its copy of C2 drops the tab words | Producer, with #13 | Before the Wave A build |
| 4 | **BD1 and the last-run line.** *Resolved 2026-11-22 by the designer:* its tiers and seals show bare, because `lastRun` stores no parts and no rule reads it (#11 D7.2). #14 BD1 now states this exception (Stored copies) | `/ux-review`, with #14 Open Questions 14 | `/ux-review` of this spec |
| 5 | **"Gathering times"** in #8 UI Requirements 4. *Resolved 2026-11-22 by #8 A3:* it reads "durations, as the road shows them" (G-7) | #8's owner | At merge |
| 6 | **The architecture flags** (Data Requirements): `preview` returns the entries; `foundationStats` returns each clash; the forge's refusal names every missing ingredient; the method-choice view's lines carry their kind | #6's ADR 2; #7's ADR 1 | Before epics |
| 7 | **One-handed reach.** The Plan card's back line sits at the top of a tall bottom sheet | Phone layout (#17) | Vertical slice |
| 8 | **The MK6 amendment** (14-3). *Resolved 2026-11-22:* the designer approved it, and #14 MK6 now lists the forge moment's channel lines among the tint's uses | #14's owner (designer) | At merge |
| 9 | **The copy.** Every quoted string here is provisional (AC-15-39) | `writer` | Before the vertical slice |
| 10 | **Does the headroom line help without steering?** Check, in the first MVP playtest, the signal "compares before forging" and whether players read "Your best in hand" as an instruction to keep looking or as pressure | Designer | First MVP playtest |
| 11 | **Provisional constants.** `FORGE_SPLIT_MIN_PX` 600 (safe 520–720: below 520 each method column is under about 250 px and its change lines wrap to two or three lines; above 720, windows up to about 1224 px stack although both columns would fit). `FORGE_CHANNEL_MS` 240 and `FORGE_SETTLE_MS` 160, whose sum may not pass 400 (AR-V6) | Designer, with `art-director` | Vertical slice |
| 12 | **"Pre-commit headroom signal"** (systems index, decision 4). *Resolved 2026-11-22 by `/ux-review`:* the reading holds. It means before the forge, as ¶15 says, not before the method commit; before the commit both methods' bests are 4 and the line tells nothing (FC6; Requirement Trace) | Designer | `/ux-review` of this spec |

### Cross-reference check (`/ux-design` phase 5, 2026-11-22)

| Check | Result |
|---|---|
| GDD requirement coverage | **All covered.** Every line in `design/gdd/*.md` and the systems index that names "#15" or "forge screen" maps to a row of the Requirement Trace. Closed during the check: #11 UI Requirements 5's realm name in the last-run line (FC4), #3's UX flag (the cap breakdown), #7's dialog questions, and #5's "how close a door was" |
| Pattern library alignment | Every pattern cited exists (IP1–IP23, PD1–PD19). **Seven new patterns**, IP24–IP30, plus FC4 as single-use, go to the library through P-1. The task forbids editing the library here, so they are flagged, not added |
| Navigation consistency | **No mismatch with #13** (`design/ux/interface-shell.md` at 359de97): the Forge view is the default on a first game and after a new run, the commit moves the centre to the Road (AC-13-08), and every overlay is #13's container or dialog. One omission in #13: its "Load save confirmed" row does not say the Forge view opens, which PD16 does (13-11). #14: no mismatch (14-9) |
| Accessibility coverage | Comprehensive, WCAG 2.2 AA: AR-V1–V6, AR-M1–M6, AR-C1–C7 and AR-P1–P7 are each addressed (Accessibility). One checklist item, one-handed reach, waits on #17 (Open Questions 7) |
| Empty states | **None missing.** No last run, nothing chosen held, no makeup in hand, a plan that widens no store, the withheld preview, no route rows (in hand or not planned), and an empty F3 block each have a defined form (States & Variants; FC5–FC10) |
| Internal references | 40 acceptance criteria, all cited numbers defined; every "Open Questions n" cited exists; no placeholder remains |
