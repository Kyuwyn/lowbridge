# Interaction Pattern Library

> **Status**: Approved 2026-11-22 (lean `/ux-review patterns`; findings in `design/ux/reviews/interaction-patterns-review-log.md`)
> **Author**: designer + Claude (`/ux-design patterns`)
> **Last Updated**: 2026-11-22
> **Template**: Interaction Pattern Library
> **Platform Target**: web browser, desktop first; phone width (390 px design width, holds at 320 px) a constraint from the MVP. Inputs: mouse, keyboard and touch. No gamepad (#13 Platform Target)
> **Drawn from**: Interface shell and goal line (#13, `design/ux/interface-shell.md`) and Method marks and number breakdowns (#14, `design/ux/method-marks.md`), both Approved 2026-11-21
> **Accessibility owner**: `design/accessibility-requirements.md` (landed 2026-11-21: Comprehensive, against WCAG 2.2 AA, so every **[AA assumed]** value stands). Values marked **[AA assumed]** are the WCAG 2.2 AA floor that #13 and #14 state

---

## Overview

This library names every interaction pattern the interface uses, so that a screen spec or a story
can cite a pattern ("IP3") instead of specifying it again. It has no screen of its own.

**Citations.** "#13 C16" is component C16 of the Interface shell spec. "#14 BD6" is breakdown rule
BD6 of the Method marks spec, and "#14 MK5" is mark rule MK5. "#n" alone is system n of
`design/gdd/systems-index.md`. Rule numbers ("rule 33") are the reference design rules:
Arcanum 1–38 and 70–74 (`research/arcanum-reference/12-design-rules.md`), Hundred Days 39–69
(`research/hundred-days-reference/06-design-rules.md`) and Magic Research 2 75–100
(`research/magic-research-2-reference/08-design-rules.md`). "PD" numbers are this library's own
designer decisions, listed below.

**Authority.**

- #13 and #14 own the behaviour. This library collects it and adds nothing they do not state,
  except the designer's decisions PD1–PD19.
- Each decision settles a point where the two specs differed, or where neither said enough to
  build from. The spec edits each decision implies are listed under "Changes needed in existing
  specs". The coordinating session applies them at merge, with the designer's approval.
- Those edits landed on 2026-11-21 (Changes needed in existing specs), so each entry and its
  source line now agree.
- A pattern changes in its source spec and in this library together, never in one alone.

**Accessibility values.** `design/accessibility-requirements.md` owns the project's tier and every
accessibility value. It landed on 2026-11-21 with the Comprehensive tier against WCAG 2.2 AA. Each value
here is the floor #13 and #14 state, which takes WCAG 2.2 AA as the working baseline, and is marked
**[AA assumed]**. The committed tier confirms every one, and where that document says more, it
wins.

**Platform.** `project.yaml` has no platform block, and `.claude/docs/technical-preferences.md`
still describes the archived attempt (#13 Open Questions 5). This library follows #13: mouse,
keyboard and touch; no gamepad; nothing hover-only.

**Principles every pattern keeps.** Each comes from the sources.

1. **Nothing hover-only.** Every piece of content opens by tap, click, Enter or Space (rule 33,
   *beat* hover-only; concept MVP required item 8; #13 C16; #14 BD2).
2. **One discrete input per action.** Nothing is held, repeated, timed or windowed (pillar 4; #13
   Interaction Map).
3. **Glyph and word before hue.** Hue means the circulating method and nothing else (#14 MK6; #13
   Accessibility; concept Visual Identity Anchor, principles 1 and 3).
4. **Wrap, never truncate.** Only the pinned log line may end in an ellipsis (#13 C15, AC-13-07;
   #14 Layout Zones).
5. **The result is the feedback.** An action's result shows in the frame of the input (#13
   AC-13-31). Motion carries information and never delays it (#13 Transitions).
6. **One notice channel.** No toasts, pop-ups or tickers (rules 68, 99; #13 C6, C14).
7. **The interface holds no rules.** Every action goes through the rules core, and every log line
   comes from a typed event or an action's result (#13 Events Fired, AC-13-20; #14 Data
   Requirements).
8. **Calm, never hurried.** No urgency cue, no flashing, no sound, no time limit (pillar 4; #13
   Player Context on Arrival, Accessibility).

**How to use this library.**

- A screen spec names a pattern's ID in its Component Inventory's Pattern column. A component that
  matches no pattern is a new pattern. Flag it, and add it here before that spec goes to
  `/ux-review`.
- A story cites the pattern ID together with the source rule it names, for example "IP2
  (#14 BD6)".
- A pattern entry gives behaviour, input, feedback and accessibility. Visual form (glyph drawings,
  palette, weights) belongs to the art bible, which does not exist yet (#13 Open Questions 3, #14
  Open Questions 2).

**Designer decisions taken in this library's session (2026-11-21).**

| # | Question | Decision | Patterns |
|---|---|---|---|
| PD1 | How far the library goes | The patterns in #13 and #14, plus every standard control they use. Each unused standard control is listed with the reason it is not used. Animation and Sound Standards tables are included | All |
| PD2 | #13's single-use components (Goal line, Running line, Notice strip, Store chip, Ladder block) | One catalogue row each, owned by #13 and pointing at its section, with the shared rule it follows. #13 stays their single source | Catalogue |
| PD3 | Phone breakpoint: #13 says below 960 px, #14 says ≤ 650 px and a drawer | #13 wins: narrow below 960 px (`WIDE_MIN_PX`), designed at 390 px, holds at 320 px, no drawer. #14 is aligned | IP22 |
| PD4 | Where focus lands when a card opens at depth 0 | On the card's title | IP1, IP20 |
| PD5 | What Tab does at the wide card's last line | Focus is trapped in the wide card as in the narrow sheet. Tab cycles inside the card, and Esc or × closes it. A pointer click outside still closes it and acts on what it lands on | IP1, IP20 |
| PD6 | How a record named inside a card looks | The same as a part line: a full-width line ending in "›", with the same target size | IP2 |
| PD7 | Part-line and back-line height with a mouse: #13 says 44 px with a coarse pointer and 32 px with a fine one, #14 says 44 px | #13's one target rule: at least 44 px with a coarse pointer, at least 32 px with a fine one | IP2, IP21 |
| PD8 | Whether the commit and forge confirms take #13's busy state | No. "Working…" is only for confirms that switch the run (New run, Load save). The commit and forge dialogs close in the confirm's frame | IP3 |
| PD9 | Which button holds focus when a confirm dialog opens | Cancel. Cancel sits at inline-start, the confirm at inline-end | IP3 |
| PD10 | Whether a disabled control stays in the tab order | Yes. It is focusable and marked `aria-disabled`, with its reason as its accessible description, and activating it does nothing | IP13, IP14, IP15 |
| PD11 | Whether log lines carry marks or glyphs | No. The log is plain text, with no mark, glyph, tint or target | IP17 |
| PD12 | Whether the away block collapses or dismisses | Neither: it is static | IP18 |
| PD13 | Breakdown text size on narrow widths: #13's body size is 16 px there, #14's floor is 14 px | Breakdown lines are secondary text, at least 14 px at every width. A number's own line follows body size | IP6, IP22 |
| PD14 | The bottom sheet's inner padding | Its content sits 16 px in from each inline edge | IP1, IP22 |
| PD15 | The skip link before the commit, when the Road is not shown | One skip link to the centre view's first control, labelled by the view on screen: "Skip to the forge" or "Skip to the road" | IP20 |
| PD16 | Where focus goes after a confirm whose opener has gone | To the heading of the view now shown: the Road after a commit, the Forge after a new run or a load, #15's forged view after the forge | IP3, IP20 |
| PD17 | Whether irreversible confirms get their own button look | No. They use the same button as everything else, with no hue. The label names the act, and the dialog's lines name what it clears | IP3, IP15 |
| PD18 | #14 cites a "pressed state" that #13 never defines | No pressed style is required. The result in the frame of the input is the feedback | IP2, IP15 |
| PD19 | What #15 Forge screen needs that neither spec defines | The twelve gaps under "Gaps & Patterns Needed" | Gaps |

---

## Pattern Catalog

### Pattern Catalog Index

| ID | Pattern | Category | Source rules | Used in | One line |
|---|---|---|---|---|---|
| IP1 | Detail container | Overlay | #13 C16; #14 D3, BD2, BD6; rule 33 | Every record on #13 and #15 | The one tooltip: a card (wide) or bottom sheet (narrow) holding a record's fields in one order, opened by tap, click, Enter or Space |
| IP2 | Drill-down line | Navigation | #14 C8, C9, BD6; #13 C16 | Inside IP1 | Full-width part, named-record and back lines that move one level down or up in the same container |
| IP3 | Confirm dialog | Modal | #13 C17; #14 W7; #6 G8.2; rules 38, 54 | New run, Load save (#13); commit, forge (#15) | The one modal for irreversible acts: names what it clears, Cancel holds focus, no timer |
| IP4 | View tabs | Navigation | #13 C9 | Centre (wide), bottom bar (narrow) | Road · Forge, plus Log on narrow; arrow keys, each view keeps its scroll |
| IP5 | Menu | Navigation | #13 C4 | Goal band | Four run-level actions behind one menu button |
| IP6 | Number breakdown: trail | Data display | #14 BD1–BD4, BD7–BD9 | Under every pipeline value in IP1 | A ledger: Base, each step with its cause and signed change, Total |
| IP7 | Number breakdown: composed | Data display | #14 BD5, BD6 | Under every composed number in IP1 | The owner function's parts and operations, then Total; parts drill down |
| IP8 | Method glyph and verb notch | Iconography | #14 MK2, MK3, MK4, MK10 | Marks, method chip, dialogs, method choice | One single-stroke glyph per method, solid or hollow, with a direction notch |
| IP9 | Method mark | Data display | #14 MK1, MK2, MK6–MK9 | Every changed value and opened route | Glyph and notch after a number in ink, with a tinted channel underline |
| IP10 | Closed mark and closed row | Data display | #14 MK5, BD4; #13 C11, C12 | Road rows, commit dialog, method choice | A route the method does not open: closed glyph, "Opens under", the other method's hollow glyph |
| IP11 | State glyph and word | Status display | #13 C11, C7, C1, C5, Accessibility | Rows, stores, doors, running line | Every state as a distinct glyph plus a word; never hue |
| IP12 | Progress bar | Data display | #13 C5, C7, C11 | Running line, rows, stores | A bar painted from *p* / *D* or held / cap, its value always also in text |
| IP13 | Action row | List item | #13 C11, C11a, C12; #4 S5; #1 R5.5 | The road (#13), route lists (#15) | One source: state, figures, and why it cannot run, before any tap; Start only when Ready |
| IP14 | Switch | Input | #13 C11a; #10 UI Requirements | Gatherer rows | The heap toggle: native, labelled, state word beside it, flips in the input's frame |
| IP15 | Button | Input | #13 Interaction Map; PD17 | Everywhere | One style, a verb label, no hue; absent rather than disabled where #13 says so |
| IP16 | Text area | Input | #13 C17 | Copy save, Load save | The only free-text field: a read-only copy box and a paste box with Check |
| IP17 | Log line | Feedback | #13 C14, C15, Events Fired | Log column, Log tab, pinned line | One plain-text line per typed event, newest first, merged per source |
| IP18 | Away summary | Feedback | #13 Events Fired (away block) | Top of the log after a gap | One static block: what ran, what filled, what stopped, the breath held |
| IP19 | Empty, loading and error states | Feedback | #13 C18, Empty and edge states; #14 States | Every screen | Never blank, no spinner, one plain sentence and the way out |
| IP20 | Focus and keyboard order | Navigation | #13 Input checklist, Accessibility; #14 BD6 | Every screen | Tab order, skip link, focus ring, where focus moves on open, drill, close and confirm |
| IP21 | Pointer and touch targets | Input | #13 Variants, Input checklist; #14 D3 | Every interactive element | 44 px with a coarse pointer, 32 px with a fine one; numbers are never targets; hover shows nothing |
| IP22 | Phone-width layout | Layout | #13 Layout Zones; PD3 | The whole shell below 960 px | Pinned header, store chips, bottom tabs, bottom sheet, pinned log line, no sideways scroll |
| IP23 | Scroll zone | Layout | #13 Layout Zones, Interaction Map | Every zone | The page never scrolls; each zone scrolls vertically inside itself |

### Single-use components (owned by #13, PD2)

These appear on one screen only. #13 specifies them in full, and the library records only the
patterns they are built from, so that a later screen reusing one cites both. PD2 names five of
them. C2, C8, C10 and C18 take the same form, because they are #13's other single-use components
with no pattern of their own (an extension of PD2, not a new decision).

| #13 component | Section | Built from | Shared rule it follows |
|---|---|---|---|
| C1 Goal line | #13 C1 | IP11 (slot, seal and tier glyphs with words); opens IP1 (Goal card) | A picture first and words second; never names a makeup, a source or an ingredient (#13 C1, C2) |
| C2 Instruction lines | #13 C2 | Text | Each number comes from a realm field; a line names a step, never a source, ingredient or makeup |
| C5 Running line | #13 C5 | IP12, IP15 (Stop), IP11 ("×2", "full", "Heaped"); opens IP1 (Running card) | Not a live region, because it changes every frame; its stops reach the reader through the log (#13 Accessibility) |
| C6 Notice strip | #13 C6, States & Variants | IP15 (Copy save, Copy report, Dismiss, Details) | The only place a save at risk is said. It never covers the goal band, never times out, and stands in for every toast (rule 68) |
| C7 Store row and store chip | #13 C7 | IP11 ("full", "held"), IP12 (wide bar); opens IP1 (Store card) | Chips wrap in rows of three and grow taller rather than truncate a name. On a short viewport (at least 640 px wide, below 600 px tall) they fold into one row that scrolls sideways inside itself (#13 Layout Zones) |
| C8 Ingredient row | #13 C8 | IP11 ("in hand", "not yet", "in the Foundation"); opens IP1 | Wide only; on narrow widths the Goal card lists the six |
| C10 Group heading | #13 C10 | Text from `source.group` | Display only; a group of one source is a load error (#1 A8) |
| C12 Ladder block | #13 C12 | IP13 rows, IP11 depth glyph, IP10 | A rail with floors in content order; a sealed floor breaks the rail; depth never fades; a fully closed group is one closed row |
| C18 Session screens | #13 C18 | IP19, IP15 | One plain sentence and the way out, with no persistent context |

### Standard controls not used in the MVP

| Control | Status | Reason |
|---|---|---|
| Slider | Not used | No continuous value is set by the player: every action is one discrete input (pillar 4; #13 Interaction Map) |
| Dropdown / select | Not used | No choice among many values exists. The menu (IP5) holds four actions, not a value |
| Grid item | Not used | Store chips wrap in rows (C7) but are a list read in order, not a two-axis grid with arrow-key movement |
| Toast / notification | Not used, by rule | Rule 68 (one notice channel) and rule 99. Events go to the log (IP17), and a save at risk goes to the notice strip (C6) |
| Hover tooltip | Not used, by rule | Rule 33's schema is copied and hover-only is beaten. The detail container (IP1) replaces it, opened by tap, click, Enter or Space |
| Single-line input field | Not used | The only free text is a pasted save (IP16) |
| Destructive button variant | Not used, by decision | Hue means the method only (#14 MK6), and an irreversible act gets its weight from the confirmation's words (PD17; #6 Game Feel) |
| Hold-to-confirm, timed confirm | Not used, by rule | No held or timed input (pillar 4); the forge's weight comes from the confirmation, "not from a delay or a hold-to-confirm" (#6 Game Feel) |

---

## Patterns

Each entry gives its category, where it is used, its source rules, its behaviour, input, feedback,
states and accessibility, when to use it and when not to, and notes for implementation. Where an
entry quotes player-facing text, the text is provisional copy, checked by the `writer` (#13
AC-13-36).

### Containers and navigation

#### IP1 Detail container

**Category**: Overlay · **Used In**: every record on #13 (a source's name, a store, an
ingredient, a door, the goal line, the method chip, the running line) and on #15's Forge view
(#14 Entry & Exit Points) · **Source**: #13 C16; #14 D3, BD2, BD6, Interaction Map; rules 33,
97; PD4, PD5, PD14

**Description**: The game's one tooltip. A tap, click, Enter or Space on a record opens one
container that shows the record's fields in one fixed order, with every rule-derived number's
breakdown already expanded under its own line. Wide widths anchor a card to the record. Narrow
widths raise a bottom sheet that stops below the pinned header.

**Specification**

- **What opens it: records only.** Numbers and marks are never targets (#13 C16; #14 D3). The
  record's name is the trigger. With a mouse, the name shows a pointer cursor and an ink underline
  on hover, and no number ever takes that underline, so a hover never looks like #14's channel
  underline (#13 C16; #14 MK2).
- **Hover opens nothing** (#13 C16, AC-13-17).
- **Form:**

  | Width | Form | Size and place |
  |---|---|---|
  | Wide (≥ 960 px) | Anchored card | Below its record if there is room, otherwise above; aligned to the record's start edge and kept 16 px inside the viewport; 320–400 px wide, at most 70% of the viewport tall, scrolling inside (#13 C16) |
  | Narrow (< 960 px) | Bottom sheet | Full width, with its content 16 px in from each inline edge (PD14), so 358 px of content at 390 px and 288 px at 320 px. At most the viewport height less the pinned header, so the goal band, running line and store chips stay visible (rule 32). A scrim covers the content zone only (#13 C16) |

- **Contents.** Rule 33's one schema: thirteen blocks in one order for every record type, with
  empty blocks left out (#13 C16): Title, Kind, Description, Time, Needs, Takes, Gives, Fights,
  Contributes, Widens, Opens, Sources, Flavour. Flavour is italic and always last (rule 70).
  Every rule-derived number carries IP6 or IP7 under its own line, already expanded. A base-only
  number shows bare (#14 BD2).
- **Drill-down.** Part lines and named-record lines (IP2) open one level deeper in the same
  container. The stack has no depth limit; the MVP's deepest chain is six levels (#14 BD6).
- **One at a time.** Opening a record from outside the container replaces it and clears its stack
  (#13 C16). Only one overlay is ever open, because a click outside closes the card and focus
  cannot leave it (PD5).
- **Live.** The container repaints with the game, a drilled frame and its back line's value
  included. It never closes on a game event (#13 C16).
- **Closing.** The × button, Esc at any depth, a click or tap outside (wide), or a tap on the scrim
  (narrow). Each closes the whole stack. A click outside also acts on what it lands on, so Start
  works with a card open (#13 C16).
- **Scroll.** Vertical only, inside the container (IP23). It never scrolls sideways, at 390 px or at
  the 320 px reflow floor (#13 C16; #14 Layout Zones).

**Input mapping**

| Action | Mouse | Keyboard | Touch |
|---|---|---|---|
| Open | Click the record | Enter or Space on the focused record | Tap the record |
| Move between lines | — | Tab and Shift+Tab, cycling inside the container (PD5) | — |
| Scroll | Wheel | Arrow keys, Page Up and Page Down while focus is inside (#14 Interaction Map) | Vertical swipe |
| Close the stack | × or a click outside | Esc | × or the scrim |

**Feedback**: the container opens within 100 ms of the tap (#13 AC-13-31). The wide card opens
and closes instantly. The sheet slides up and down in 150 ms, and instantly under reduced motion
(Animation Standards).

**States**: Closed · Open at depth 0 · Drilled at depth 1 or more, under its back line (#13
Component states).

**Accessibility** [AA assumed]

- Role `dialog`, labelled by the card's title. **Modal in both forms**: focus stays inside until
  the container closes (PD5).
- On open, focus moves to the title (PD4). In a drilled frame, it moves to the back line (#14 BD6).
- On close, focus returns to the record that opened the first frame (#13 C16).
- Because focus cannot leave the card while it is open, no focused control is ever hidden under it
  (WCAG 2.2 2.4.11, Focus Not Obscured).
- Content reflows at 320 CSS px with no sideways scroll (WCAG 1.4.10; #13 Accessibility).

**When to Use**: to show a record's fields, its bill, its fights and the breakdown of any number
it shows. Every record type uses this one container (rule 33).

**When NOT to Use**: for a decision or an irreversible act (IP3); for a notice (#13 C6); for a
number on its own, because numbers are never targets (open the record that shows the number).

**Implementation notes**

- The container and its stack are interface state and are never saved (#13 Data Requirements;
  #14 BD6).
- Cards render by field, not by record type, and name no content id (#1 UI Requirements; rule 1).
- A drilled frame starts with the back line, then the part's label and value as its title. #14
  fills the rest (#13 C16; #14 W4).

**Reference**: #13 ASCII Wireframe, "A Source card (wide)"; #14 W2–W5.

#### IP2 Drill-down line

**Category**: Navigation · **Used In**: inside IP1: the part lines of composed breakdowns (#14
C8), records named inside a card (#13 C16: a source under Opens, an ingredient under Sources, a
door in the Goal card) and the back line (#14 C9) · **Source**: #14 C8, C9, BD5, BD6, Layout Zones,
Accessibility; #13 C16, Transitions; PD6, PD7, PD18

**Description**: A full-width line that opens the next level inside the same container, and the
back line that returns from it. It is the only way down and up a stack.

**Specification**

- **Three kinds, one form** (PD6):

  | Kind | Reads | Opens |
  |---|---|---|
  | Part line | "{cause} {amount} {mark} ›". The whole line is the target (#14 Layout Zones) | That part's breakdown (#14 BD6) |
  | Named-record line | "{record name} ›", in the same form as a part line (PD6) | That record's card, one level deeper (#13 C16) |
  | Back line | "‹ {parent label} {parent value}", or "‹ {record}" when the parent is a record (#13 C16) | The parent frame |

- Activating a line replaces the container's content in the same frame, with no slide and no fade,
  so the reading position stays put (#13 Transitions; #14 Transitions).
- The back line is the first line of every drilled frame and first in focus order. It takes focus
  when the frame arrives (#14 BD6).
- Back returns to the parent frame and puts focus on the line that was opened (#14 BD6).
- Esc closes the whole stack from any depth. Opening a record from outside the container clears
  the stack (#14 BD6; #13 C16).
- **Size.** Full width; at least 44 px tall with a coarse pointer and at least 32 px with a fine
  one (PD7).
- Causes wrap. The amount column keeps its width and never wraps (#14 Layout Zones).
- A part with no breakdown of its own is a plain ledger line, not a disabled drill line (#14 BD5).

**Input mapping**: click, tap, or Enter or Space on focus. Tab and Shift+Tab move between lines
(#14 Interaction Map).

**Feedback**: the content swap, in the frame of the input. No pressed style is required (PD18).
With a mouse, a line may show #13's pointer cursor, never content (#14 Interaction Map).

**States**: Rest · Focused (IP20's ring). There is no disabled or pressed state.

**Accessibility** [AA assumed]

- Each line is a native button.
- A part line is named "{cause}, {amount}, show breakdown". The back line is named "Back to
  {parent label}, {value}" (#14 Accessibility), or "Back to {record}" when the parent is a record.
- A named-record line's accessible name is not yet fixed (Open Questions 3).
- No live region is used: the back line taking focus announces the new level (#14 Accessibility).

**When to Use**: whenever a line inside a card has a breakdown of its own, or names another record.

**When NOT to Use**: to open a record from outside a card (that is IP1's trigger, and it clears the
stack); for a number with no parts (show it bare, #14 BD2); for anything that changes game state,
because drill lines are read-only (#14 Data Requirements).

**Implementation notes**: the stack is a list of frames in the container's interface state. Each
frame repaints live, its back line's value included (#13 C16).

**Reference**: #14 W4 (Might → Cinder after clash → Cinder total → Ember Marrow).

#### IP3 Confirm dialog

**Category**: Modal · **Used In**: New run and Load save (#13 C17); the commit dialog and the forge
confirmation (#15, hosted unchanged in #13 C17). Copy save uses the same frame but confirms
nothing · **Source**: #13 C17, Entry & Exit Points; #14 W7, MK5, Transitions; #6 G8.2, Game Feel,
UI Requirement 5; #7 W7, Y2, UI Requirement 2; #11 Game Feel, J5; rules 38, 54; PD8, PD9, PD16,
PD17

**Description**: The one modal for an act that cannot be undone. It names what the act clears or
closes, by name, and asks for one deliberate choice.

**Specification**

- **Frame** (#13 C17): a modal dialog. It traps focus, and Esc or Cancel closes it. On narrow
  widths it is full width.
- **Contents, top to bottom:**
  1. A title naming the act. #15 owns the commit's and the forge's words.
  2. What the act clears or closes, each by name (rule 54):
     - New run: the method, the Foundation with its seals if forged, everything held, kept
       progress and held breath (#13 C17).
     - Load save: the run it replaces and the run it loads (#13 C17).
     - Commit: the "Feeds:", "Opens:", "Quenches:" and "Closes:" lines, each with its hollow
       notched mark, and each "Closes:" line led by the closed mark (#14 W7, MK5).
     - Forge: the four ingredients and the seals, and that the MVP has no reforge (#6 UI
       Requirement 5).
  3. The redo line, "Redo: only by starting a new run", wherever the act is a run's choice (#7
     Y2; #13 C17; #14 W7).
  4. The buttons: Cancel at inline-start, the confirm at inline-end (PD9; #14 W7).
- Lines wrap. They never truncate and never collapse into "and N more" (#14 Localization; #7 Edge
  Cases).
- **The confirm's label names the act**, for example "Start a new run", "Load this save", "Begin
  circulating" or "Forge" (provisional copy). It uses the ordinary button (IP15): no destructive
  variant and no hue (PD17; #14 MK6).
- **Default focus is Cancel**, both when the dialog opens and when its confirm step appears (PD9).
  Where a dialog starts with a field, focus starts there: Load save's paste box, and Copy save's
  text, which is selected on open (#13 C17).
- **Busy state, for run-switching confirms only** (PD8). New run's and Load save's confirms read
  "Working…" and stay disabled until the write commits (#11 Game Feel). A failed write keeps the
  old run and shows "Could not start a new run" or "Could not load this save" with Copy save (#13
  C17).
- **The commit and forge dialogs close in the confirm's frame**, on the same event that changes the
  world (`committed`, `forged`). A failed write raises "Not saving" at once (#11 J5; #14
  Transitions; PD8).
- No delay, no hold-to-confirm, no timeout (#6 Game Feel; #13 Accessibility, "Time").
- **Focus after closing:**
  - after Cancel, or after a dialog that changed nothing: back to the control that opened it (#13
    C17). For a menu item, that is the menu button, because the menu closed when the item was
    chosen (a reading, Open Questions 4);
  - after a confirm that changed what is shown: to the heading of the view now shown. That is the
    Road after a commit, the Forge after a new run or a load, and #15's forged view after the forge
    (PD16).

**Input mapping**: Tab and Shift+Tab cycle inside the dialog. Enter or Space activates the focused
button. Esc is Cancel. Click and tap activate.

**Feedback**: the dialog opens and closes instantly (#13 Transitions). Run-switching confirms show
"Working…" until the write commits.

**States**: Open · Busy (run-switching confirms only) · Failed, with Copy save (#13 Component
states). Load save also steps through: paste and Check · a refusal reason · the confirm (#13 C17).

**Accessibility** [AA assumed]

- Role `dialog`, modal, labelled by its title (#13 Accessibility).
- Focus stays inside until it closes, then moves as above.
- Glyphs are hidden from assistive technology. Each line's words already carry its verb ("Feeds:",
  "Quenches:", "Closes:"), because #14 D5 put the verbs in words.
- No time limit (WCAG 2.2.1).
- The busy confirm stays focusable while disabled, so focus is never dropped (PD10).

**When to Use**: every irreversible act: New run, Load save, the commit and the forge (rule 38,
*beat*; rule 54).

**When NOT to Use**: for a reversible action. Start, Stop and the heap toggle act on one tap with no
confirmation (#4 S3.2; #13 C5, C11a). Also not for a notice (#13 C6) or for reading a record
(IP1).

**Implementation notes**: where a refused act's reason shows inside a dialog (#7 UI Requirement 2:
"A refused commit shows its reason") is not yet defined (Gap 10).

**Reference**: #14 W7 (Ember Breath's commit dialog lines).

#### IP4 View tabs

**Category**: Navigation · **Used In**: the centre's head (wide: Road · Forge) and the bottom bar
(narrow: Road · Forge · Log) · **Source**: #13 C9, N5, Interaction Map, Transitions, AC-13-08;
rules 8 (diverged), 98

**Description**: A fixed set of centre views. The MVP has two views, plus the Log as a tab on
narrow widths. There is no section unlocking (rule 8, diverged).

**Specification**

- Wide: Road · Forge in the centre zone. Narrow: Road · Forge · Log in the pinned bottom bar (rule
  98, the bottom tab bar copied).
- Arrow keys move between tabs within the list, and Enter switches (#13 Interaction Map). Click and
  tap switch.
- Switching is instant. Each view keeps its own scroll position (#13 Interaction Map,
  Transitions).
- **The game switches the view once:** to the Road, in the frame of `committed`. A later switch to
  the Forge stays until the player switches back (#13 AC-13-08).
- The pinned log line opens the Log tab at its top (#13 C15).

**States**: Selected · Not selected · Focused.

**Accessibility** [AA assumed]: standard tab-list semantics (#13 C9, "Standard tabs"). Tab labels
are a 40% expansion risk at 390 px (#13 Localization).

**When to Use**: to move between the fixed centre views.

**When NOT to Use**: to move between records (IP1); to add a view the game unlocks, because there
are no section records in the MVP (#13 Reference rules, rule 8).

**Implementation notes**: tab labels grow to fit and never clip (#13 Localization).

#### IP5 Menu

**Category**: Navigation · **Used In**: the goal band (#13 C4) · **Source**: #13 C4, Interaction
Map, Component states

**Description**: One menu button that holds the run-level actions: New run…, Copy save, Load save…
and Keep my save in this browser.

**Specification**

- Enter opens the menu, the arrow keys move between items, and Esc closes it (#13 Interaction Map).
  Click and tap open it.
- Choosing an item closes the menu. New run…, Copy save and Load save… open their dialogs (IP3).
  "Keep my save in this browser" asks the browser once per choice and logs the answer (#13 C4,
  Events Fired).
- "Keep my save in this browser" is Offered, then reads "This browser keeps your save" and is inert
  once granted, or is not shown (#13 Component states).

**Accessibility** [AA assumed]: a standard menu button (#13 C4). Esc returns focus to the menu
button.

**When to Use**: for run-level actions that are rare and never part of the 30-second loop.

**When NOT to Use**: for a game action. Start, Stop and the heap toggle live on their rows and the
running line, and the toggle never sits in an overflow menu (#10 UI Requirements; #13 C11a).

### Data display

#### IP6 Number breakdown: trail

**Category**: Data display · **Used In**: inside IP1, under every pipeline value: contributions,
bills, outputs, durations and caps (#14 BD1) · **Source**: #14 BD1–BD4, BD7–BD9, Layout Zones, W2,
W3, W5; #13 "Number and duration formats"; #2 P8; PD13

**Description**: A ledger under a number's own line. It shows where the number starts, each change
in order with its cause, and the total that matches the number on screen.

**Specification**

- **Placement**: directly under the number's own line, already expanded (#14 BD2).
- **Lines, in this order, never re-sorted** (#14 BD3):
  1. **Base**, the trail's `base`;
  2. one line per step, in trail order: method, then Foundation, then its limit, then tending, then
     its limit;
  3. a hairline rule, then **Total**, which equals the number on screen.
- **What each line says** (#14 BD4):

  | Line | Glyph | Cause | Amount |
  |---|---|---|---|
  | The authored value | none | "Base" | the value |
  | Method feed | solid mark, raise notch (IP8) | "{method} feeds" | "+n" |
  | Method quench | solid mark, quench notch | "{method} quenches" | "−n" |
  | Any other method step (none in the MVP) | solid mark, raise or lower notch by sign | "{method} changes" | the signed change |
  | Foundation | none; one "Foundation" label line, then one line per ingredient | "{ingredient name}" | "+n" |
  | Tending | heap glyph | "Heaped · {source name}" | "+n", or "+1.25 s" on a duration |
  | Limit | limit glyph | "Limit (highest allowed)" or "Limit (lowest allowed)" | the signed change |
  | The final value | none | "Total" | the value |

- **The signed change** is a step's result minus the previous result. It is the only arithmetic a
  breakdown does (#14 BD3).
- **Number format**: #13's formats, with tabular figures and a true minus sign, U+2212 (#14 BD4;
  #13 "Number and duration formats").
- **A base-only value** shows the bare number, with no lines and no mark (#14 BD2).
- **A hidden base** (#14 BD7, MK7): for an ingredient never held, "Base shown once {ingredient} is
  in hand" replaces Base. A feed shows "+n", and a quench shows "quenched" with no number. There is
  no Total. Before the commit, each method that changes the value gets its own line with its
  hollow mark.
- **Words kept out**: stage, op, clamp, trail, modifier, patch, buff, bonus and boost (#14 BD8).
- **The truth only**: no step is merged, hidden, rounded or re-ordered, and two adds that cancel
  both stay (#14 BD9).
- **Layout** (#14 Layout Zones): indented 1.25 em, in three columns: a glyph column (1.25 em), a
  cause column (`1fr`, wraps, never truncates) and an amount column (auto, at least 7 ch,
  right-aligned, tabular figures, never wraps). Lines are at least 1.4 em tall.
- **Text size**: breakdown lines are secondary text, at least 14 px at every width. The number's
  own line follows body size: 16 px on narrow widths, 14 px on wide ones (PD13; #13
  Accessibility).

**Input mapping**: none. No line of a trail breakdown is a target (#14 Interaction Map).

**States**: base-only · stepped · hidden base · with a limit line · with a heap line (#14 States
& Variants).

**Accessibility** [AA assumed]

- A list labelled by its number's line. Each line reads cause then amount, with the sign in words:
  "Base, 25"; "Ember Breath feeds, plus 10"; "Total, 35" (#14 Accessibility).
- Text at least 4.5:1 against the stone base; glyphs at least 3:1 (#14 Accessibility).

**When to Use**: under every pipeline value shown in a card.

**When NOT to Use**: for state numbers (held, a unit's progress, the rest bank, log amounts),
which have no base and no breakdown. Their card shows the breakdown of the number that bounds them,
such as the cap beside held (#14 BD1). Composed numbers use IP7.

**Implementation notes**: the breakdown reads the trail and never recomputes it (#2 P8.3; #14 BD3).
A rule-derived number with no trail fails a build-time test. If one ever ships, it shows bare, with
a console error naming the record and field (#14 AC-14-16).

**Reference**: #14 W2 (a contribution), W3 (a cap after the forge), W5 (a heaped gatherer).

#### IP7 Number breakdown: composed

**Category**: Data display · **Used In**: inside IP1, under every composed number: affinity
totals, affinities after a clash, Foundation stats, door scores and tiers, seals, route
projections, preview caps, room and the best seal count (#14 BD5) · **Source**: #14 BD1, BD2,
BD5, BD6, W4; #6 S1–S5, G7

**Description**: A ledger that lists a composed number's parts and operations exactly as its
owning function returns them. Any part with a breakdown of its own drills down.

**Specification**

- Parts and operation lines appear in the owner's order, then Total. The interface never computes
  a part (#14 BD5).
- A part that has its own breakdown is a part line (IP2) ending in "›". A marked part carries its
  method mark (IP9; #14 MK1.2).
- A composed number always shows its parts, because a total with nothing under it would not
  explain itself (#14 BD2).
- It never shows what the owner withholds. On the forge screen it reads only what `preview`
  returns, so a plan that is not previewable has no seal, score, tier or cap breakdown (#14 BD5;
  #6 G7).
- A composed number with no parts (the best seal count) shows one sentence line and no Total (#14
  BD5, States & Variants).
- The owners and their parts are listed in #14 BD5's table. Any new derived number that #13 or #15
  shows must name its owner function and parts in that table's form (#14 BD5).
- Layout, number format, words kept out and text size are as IP6.

**Input mapping**: part lines only (IP2). Every other line is not a target.

**States**: with parts · no parts (one sentence) · withheld (not shown while the plan is not
previewable).

**Accessibility** [AA assumed]: as IP6. Part lines are buttons named "{cause}, {amount}, show
breakdown" (#14 Accessibility).

**When to Use**: under every number an owning system's pure function composes from other numbers.

**When NOT to Use**: for a pipeline value (IP6). Where the owner's result lacks a part this
pattern needs, the gap is a requirement on the owner's result-type ADR, never arithmetic in the
interface (#14 BD5, Data Requirements).

**Implementation notes**: three architecture needs are listed by #14: the trail's addressing (#2
ADR 2), each dialog line's kind (#7 ADR 1), and the clash amount and stat limit cuts in
`foundationStats` (#6 result-type ADR) (#14 Data Requirements).

**Reference**: #14 W4.

#### IP8 Method glyph and verb notch

**Category**: Iconography · **Used In**: method marks (IP9), the closed mark (IP10), the method
chip (#13 C3), the heap toggle's heap shape (#13 C11a), breakdown lines (IP6), the method-choice
view, the commit dialog and the last-run line (#15) · **Source**: #14 MK2 (glyph sheet), MK3, MK4,
MK10, Localization, States & Variants; #13 C3, C11a, AC-13-34

**Description**: One single-stroke emblem per method, drawn solid for the circulating method and
hollow for any other reference, with a small notch that shows which way a value moved. A few
neutral glyphs (closed, heap, limit) share the drawing rules.

**Specification**

- **The glyph sheet** (#14 MK2): Ember Breath, a rising curl (silhouette class **rising**); Still
  Water, a level ring crossed by one stroke (class **level**). Later methods take an unused class
  (falling, coiling, branching, rippling), and two methods never share one. The neutral glyphs are
  closed (a barred gate), heap (a low mound) and limit (a stop bar, like ⊣).
- **Drawing** (#14 MK2): one inline SVG symbol drawn from a single path in a 1 em box, with a
  0.18 em stroke, round ends and soft joins. The minimum box is 14 CSS px inline with a number and
  16 CSS px wherever a hollow form is drawn.
- **Solid and hollow** (#14 MK4): solid is filled in the circulating method's tint. Only the
  committed method is ever solid, and only after the commit. Hollow is a 1.5 px ink outline. It is
  used for every other reference: both methods before the commit, the other method after it, and
  the last-run line.
- **Notches** (#14 MK3): raise, quench, open, and a reserved lower notch, each 0.45 em at the
  glyph's inline-end baseline corner, in the glyph's colour and form. Every method shares them. A
  notch shows the value's direction, never better or worse, and no hue carries direction.
- **Neutral glyphs** are ink and never take the tint (#14 MK2).
- **Silhouettes stay distinct.** No other glyph may share a silhouette with a #14 glyph. That
  covers #13's state glyphs (sealed, short, held, full, depth, verdict and "no method"), #9's depth
  glyph, and #15's affinity and door-tier glyphs. A door tier is never gate-shaped (#14 MK2; #13
  AC-13-34).
- **Placed by #13**: the method chip uses the solid glyph, and the heap toggle uses the heap shape
  (#13 C3, C11a).
- **The mark table** (#14 MK10): each method's glyph, silhouette class and tint tokens live in one
  interface table keyed by method id. A build-time test fails on a missing, duplicate or orphaned
  entry.
- **Never mirrored**, in any text direction (#14 Localization).

**Input mapping**: none. Glyphs are not focusable and not targets (#14 Interaction Map).

**States**: solid (circulating) · hollow (any other reference) · neutral (closed, heap, limit).

**Accessibility** [AA assumed]

- Glyph SVGs are hidden from assistive technology. Their meaning is carried by visible words or by
  the host's accessible name (#14 Accessibility).
- Glyphs and notches keep at least 3:1 against the stone base (WCAG 1.4.11; #14 Accessibility).
- Under forced colours they draw in `CanvasText`, and the tint is dropped (#14 States & Variants).
- In greyscale, silhouette class, notch and solid against hollow carry every distinction (#14
  Accessibility, "Colour independence").

**When to Use**: to name a method anywhere it appears; the neutral glyphs for closed, heap and
limit.

**When NOT to Use**: as a button icon or a target; for a state that is not a method's (IP11); with
any colour but the circulating method's tint.

**Implementation notes**: glyph shapes are provisional until an art bible exists, but the
silhouette rules bind now (#14 MK2, Open Questions 2).

#### IP9 Method mark

**Category**: Data display · **Used In**: every value in the circulating method's change set and
every route it opened, wherever shown: #15's ingredient list and method-choice view, a record's
container, a part line inside a composed breakdown, and route names on #13's road and #15's route
lists (#14 MK1.2) · **Source**: #14 MK1, MK2, MK6–MK9, Layout Zones, Accessibility; rule 71

**Description**: The method's identity drawn on exactly the numbers and routes it changed: a glyph
and notch after the number, with a tinted channel underline, while the number itself stays in ink.

**Specification**

- **The marked set is exactly what the method changed** (#14 MK1): a value carries the mark if and
  only if its trail holds a method step. In the MVP that is five values per method.
- **Nothing derived carries a mark** (#14 MK1.3): no total, affinity after a clash, stat, score,
  tier, seal, cap, Foundation line, room, gathering time or fight number. Their breakdowns show the
  mark on the part, one level down.
- **Anatomy** (#14 MK2):
  - the number stays in ink, at full contrast, and is never recoloured, resized or moved;
  - the mark follows at the number's inline-end after a thin space, and after the unit when the
    number has one;
  - the channel underline is a 2 px stroke in the tint, 2 px below the baseline, under the sign and
    digits only. It appears only on solid marks on numbers.
- Number, unit and mark form one no-break unit, so a mark never wraps away from its number (#14
  Layout Zones).
- **On a route's name**, an open mark follows the name, with no underline (#14 MK2).
- **An unheld ingredient** (#14 MK7): the mark sits on the delta ("+10") or on the word "quenched".
  A non-zero `set` shows "changed", with the glyph and no notch.
- **Two marks on one value** (#14 MK8): the method mark sits on the number, and the heap line sits in
  its breakdown.
- **One accent** (#14 MK6): after the commit the only hue on screen is the tint, used on solid
  glyphs, notches, underlines and #13's persistent identity.
- **Before the commit**, marks are hollow and appear only in the method-choice view and the commit
  dialog. Whether they take a colour then is #15's call (#14 MK4; Gap 6).
- **At the commit**, marks turn solid in the commit frame, and the underlines draw in afterwards
  (Animation Standards).

**Input mapping**: none. A click or tap on a mark goes to its host record (#14 Interaction Map).

**States**: none in the world before the commit · hollow (method-choice view, commit dialog) ·
solid (circulating).

**Accessibility** [AA assumed]

- Every mark carries visually hidden words, so a marked number reads as one phrase: "Cinder 35,
  Ember Breath feeds"; "Jade 0, Ember Breath quenches"; "Salamander Hunt, opened by Ember Breath"
  (#14 Accessibility).
- Glyphs and underlines keep at least 3:1, and numbers at least 4.5:1. #14's provisional tint
  tokens meet both on the provisional stone base (#14 Accessibility table).

**When to Use**: on a value whose trail holds a method step, wherever it is shown, and on the name
of a route the circulating method opened.

**When NOT to Use**: on derived numbers, caps, Foundation lines, fight numbers, the hearth road or
log lines (PD11). Never recolour the number itself.

**Reference**: #14 W1 (marks in place).

#### IP10 Closed mark and closed row

**Category**: Data display · **Used In**: road rows and the collapsed group row (#13 C11, C12),
#15's route lists, the commit dialog's "Closes:" lines and the method-choice view (#14 MK5) ·
**Source**: #14 MK5, BD4, Layout Zones; #13 C11 (Closed state), C12; #9 States

**Description**: A route the circulating method does not open stays visible, named and at full
contrast. It shows where it would run instead.

**Specification**

- **The closed row reads** the neutral closed glyph, the route's name, then "Opens under", the
  opening method's hollow glyph and that method's name (#14 MK5). At phone width, "Opens under …"
  wraps beneath the name (#14 Layout Zones).
- **Full contrast and full height.** A closed row is never greyed, dimmed, faded, collapsed or
  moved to the end. It offers no Start (#14 MK5; #13 C11).
- **A group whose every source is Closed** shows as one row: "{group} · closed · Opens under
  {method}" (#13 C12). Under Ember Breath the Still Deep is one row. Under Still Water each Ember
  Breath hunt is its own closed row (#14 MK5).
- **In the commit dialog and the method-choice view**, the closed mark leads every "Closes:" line,
  with the hollow glyph of the method that opens that route (#14 MK5).
- **In a route's container**, one line replaces a breakdown: "Opened by {method}" with the solid
  open mark, the closed mark for a closed route, or nothing for a route every method has (#14 BD4).
  The rest of the route's facts stay readable (#7 UI Requirement 4).

**Input mapping**: the row's name opens IP1, as on any row. The mark itself is not a target.

**States**: closed row · collapsed closed group · "Closes:" line.

**Accessibility** [AA assumed]: a closed row reads "Still Deep, closed, opens under Still Water"
(#14 Accessibility). The text keeps the same contrast as an open row (#14 AC-14-06).

**When to Use**: for every route only another method opens, from the commit on; and on every
"Closes:" line.

**When NOT to Use**: before the commit. Every row then reads "Needs a method committed" (Waiting),
with no closed mark (#13 C11; #14 States & Variants). Rows that are sealed, short, full or in hand
use IP11.

**Reference**: #14 W1 (the closed Still Deep), W6 and W7.

#### IP11 State glyph and word

**Category**: Status display · **Used In**: road row states, stores, key items, ingredients, door
tiers, held breath, the heap state, the rest glyph and the ladder's depth glyph (#13 C1, C5, C7,
C8, C11, C11a, C12) · **Source**: #13 C11 (row-state table), C7, C1, C5, C11a, Accessibility
("Glyph before hue"), AC-13-34; #9 Visual/Audio ("Distinct shapes"); #14 MK2

**Description**: Every state the player must read has its own glyph shape and a visible word, so
nothing depends on hue.

**Specification**

- **Inventory** (#13):
  - row states: waiting, closed (IP10), sealed, short, full, in hand, ready, running;
  - a store's "full", and a key item's "held" or "not held";
  - an ingredient's "not yet", "in hand" or "in the Foundation";
  - door tiers as a word and a glyph: shut ○○, open ●○, wide open ●●;
  - held breath's "×2" and "full";
  - the heap state's "Level" or "Heaped";
  - the rest glyph, used only on the running line;
  - the ladder's depth glyph, repeated once, twice or three times.
- **Each unavailable row state has its own shape** (#9 Visual/Audio; #13 C11).
- **No state glyph shares a silhouette** with any #14 glyph (#13 AC-13-34; IP8).
- **The shapes are the art bible's** (#13 Open Questions 3). The glyphs above are layout
  placeholders.

**Input mapping**: none.

**Accessibility** [AA assumed]: every glyph has a text alternative, and every state word is visible
text anyway (#13 Accessibility). Under a greyscale filter every state stays distinguishable (#13
AC-13-34).

**When to Use**: for every state the player must tell apart.

**When NOT to Use**: for a method's identity (IP8) or a change a method made (IP9).

#### IP12 Progress bar

**Category**: Data display · **Used In**: the running line's unit bar (#13 C5), kept progress on a
row (#13 C11), a spendable store's bar on wide widths (#13 C7) · **Source**: #13 C5, C7, C11,
Transitions, Accessibility; #10 Game Feel; rule 27

**Description**: A bar painted from the game's own fraction. Its value is always also given in
text.

**Specification**

- **The running line's bar** is painted every frame from *p* / *D*. At double speed it visibly
  moves twice as fast (#13 C5, Transitions).
- **Kept progress** is a thin partial bar along a row's bottom edge, at the same fraction after a
  switch and after a reload (#13 C11, AC-13-13; rule 27).
- **A store's bar** shows held against cap, beside "{held}/{cap}" (#13 C7).
- After a rescale, a bar jumps to its true fraction with no easing (#10 Game Feel; #13
  Transitions).
- Every bar's value is also given in text: a countdown, or held against cap (#13 Transitions).

**States**: empty · filling · full · running at ×2.

**Accessibility** [AA assumed]

- The running line's bar is a `progressbar`, whose value updates at each unit, not each frame (#13
  Accessibility).
- A store's bar is hidden from assistive technology, because its text carries the value (#13
  Accessibility).
- The kept-progress bar's text alternative is not yet fixed (Open Questions 5).
- Bars keep moving under reduced motion, because they carry information (#13 Accessibility).
- Bars keep at least 3:1 against the stone base (#13 Accessibility).

**When to Use**: for a value with a fraction the rules core already holds (*p* / *D*, held / cap).

**When NOT to Use**: as decoration or as a fake progress cue. Loading shows no bar or spinner
(IP19).

### Rows and controls

#### IP13 Action row

**Category**: List item · **Used In**: the road's source rows and ladder floors (#13 C11, C12);
#15's per-ingredient route lists (#14 MK1.2; #7 UI Requirement 5) · **Source**: #13 C11, C11a,
C12, Interaction Map, AC-13-09, AC-13-10; #4 S5, S3.1; #1 R5.5, F4; #9 UI Requirements 1, 2, 6;
rules 2, 34, 35; PD10

**Description**: One source on one row. Before any tap, the row shows whether the source can run
now and, if not, why, in words.

**Specification**

- **Anatomy** (#13 C11): one flowing line that wraps at most once, with its controls at the
  inline-end of the first line:
  1. the state glyph and word (IP11), then the name, which is the record trigger (IP1);
  2. "→ {ingredient}" for a source whose output is an ingredient;
  3. the bill, "{input} ×{n}" for each input. When the bill is short, "(k more)" follows it, in #1
     F4's form;
  4. a hearth source's outputs, "→ {output} {n}";
  5. the duration, in #13's duration format;
  6. a fight source's exact result: the verdict word with a neutral glyph, then the Life kept with
     its base, "wins, keeps 46 of 100 Life" (#9 UI Requirements 1);
  7. the controls: the heap switch on gatherers only (IP14), then **Start**, shown only in Ready;
  8. kept progress, as a partial bar along the row's bottom edge (IP12);
  9. the reason line.
- **Numbers in a row are not targets** (#13 C11; #14 D3).
- **Row states are derived on every paint and never saved.** They are tested in this order:
  Waiting, Closed, Sealed, Short, Full, In hand, Ready, Running (#13 C11 table).
- **The reason line** appears only when the source cannot run and the bill's shortfall does not
  already say why. Its text comes from the rules core: the need text (#1 R5.5) or the S5 reason
  (#4 S3.1). The interface displays it and never authors or rewrites it (#13 C11, Data
  Requirements).
- **Start is absent, not disabled**, in every state but Ready (#13 C11; #9 UI Requirements 2). It
  acts on one tap, with no confirmation. A refused Start (the state changed under the tap) changes
  nothing, the row already shows the new reason, and no log line is written (#13 Interaction Map).
- **A disabled control on a row** stays focusable, marked `aria-disabled`, with its reason as its
  accessible description. Activating it does nothing (PD10). Before the commit, that is each
  gatherer's heap switch, with "Needs a method committed" (#13 C11; #10 UI Requirements 2).
- **Wrap, never truncate.** At 390 px the figures take at most one line plus one wrapped line, and
  the reason line, when there is one, is a third (#13 AC-13-09, Open Questions 8).
- **Every revealed source is listed**, closed ones included (rules 2, 35). Hidden sources are
  never listed (#13 C11).
- A Closed row uses IP10. A ladder of floors is #13 C12 (catalogue).

**Input mapping**

| Element | Mouse | Keyboard | Touch | Feedback |
|---|---|---|---|---|
| Name | Click | Enter or Space | Tap | IP1 opens |
| Start | Click | Enter or Space | Tap | In the same frame the row turns Running and the running line shows it (#13 Interaction Map) |
| Heap switch | Click | Space | Tap | IP14 |

**States**: Waiting · Closed · Sealed · Short · Full · In hand · Ready · Running, each with kept
progress shown when there is any (#13 Component states).

**Accessibility** [AA assumed]

- The name and Start are native buttons. Start's accessible name is not yet fixed (Open Questions
  2).
- The state glyph has a text alternative, and the state word and reason are visible text (#13
  Accessibility).
- Targets follow IP21.

**When to Use**: for each source on the road, and for any list of sources on #15.

**When NOT to Use**: for a store (#13 C7), an ingredient (#13 C8) or a log entry (IP17).

**Reference**: #13 ASCII Wireframe, "Wide, Committed, mid-run".

#### IP14 Switch

**Category**: Input (toggle) · **Used In**: the heap toggle on gatherer rows (#13 C11a) ·
**Source**: #13 C11a, Interaction Map, Accessibility; #10 UI Requirements 1–6, Visual/Audio, Game
Feel; PD10

**Description**: A native on/off switch on its own row, labelled with its source, with its state
as a word beside it.

**Specification**

- A native switch on the row itself, never in an overflow menu. Its label is "Heap {source}", and
  it carries the neutral heap glyph (IP8) (#13 C11a).
- The state word sits beside the switch: "Level" when off and "Heaped" when on. Both words are
  provisional (#13 Open Questions 7).
- The row shows both yields side by side: "5 per 5 s · heaped 7 per 6.25 s". There is no
  recommendation, no computed fill time and no highlight (#10 Visual/Audio, "No steering").
- It flips in the input's frame, the row's figures update, and a running unit's bar jumps to its
  true fraction with no easing (#13 Interaction Map; #10 Game Feel).
- Before the commit it is disabled, stays focusable and is marked `aria-disabled`, with "Needs a
  method committed" as its description (PD10).
- A flip shows no "changed" badge and writes no log line (#13 Events Fired; #10 Visual/Audio).

**Input mapping**: click, tap, or Space on focus (#13 Interaction Map).

**States**: Disabled before the commit · Level · Heaped (#13 Component states).

**Accessibility** [AA assumed]: a native switch labelled "Heap {source}", with its checked state
(#13 Accessibility; #10 UI Requirements 5). Its state is a word, never a colour. Targets follow
IP21.

**When to Use**: for a binary choice the player can flip freely, which is reversible and costs
nothing to try.

**When NOT to Use**: for an irreversible act (IP3), or for a setting outside its row.

#### IP15 Button

**Category**: Input · **Used In**: Start, Stop, Begin circulating, Forge, every dialog button,
notice actions, Use here, Check, Copy (#13 Interaction Map; #15) · **Source**: #13 Interaction Map,
C5, C17, Localization; #14 MK6; #4 S3.2; PD10, PD17, PD18

**Description**: One button style for every action, with a verb label and no hue.

**Specification**

- **One style.** There are no primary, secondary or destructive variants defined by colour.
  Irreversible confirms use the same button (PD17). Visual weight is the art bible's.
- **The label is a verb that names the act** ("Start", "Stop", "Start a new run", "Copy save")
  (PD17; #13 copy).
- **No hue.** After the commit, buttons never take the tint, which belongs to glyphs, notches,
  underlines and the method chip (#14 MK6). Before the commit, any accent on "Begin circulating" is
  #15's (Gap 6).
- **One tap, with no hold and no confirmation** for a reversible act: Start and Stop (#4 S3.2; #13
  C5).
- **When an action is not available**: Start is absent rather than disabled (IP13). A busy confirm
  reads "Working…" (IP3). Any control that is shown but cannot act stays focusable, marked
  `aria-disabled`, with its reason as its description, so focus is never dropped (PD10).
- **Feedback** is the result in the frame of the input. No pressed style is required (PD18; #13
  AC-13-31).
- Buttons grow to fit their label and never clip it (#13 Localization).

**Input mapping**: click, tap, or Enter or Space on focus.

**States**: Rest · Focused · Disabled (`aria-disabled`) · Busy ("Working…", run-switching confirms
only).

**Accessibility** [AA assumed]: native buttons; the 2 px focus ring (IP20); targets per IP21; text
at least 4.5:1 (#13 Accessibility).

**When to Use**: for any action.

**When NOT to Use**: for opening a record, which is the record's name (IP1), or for a number,
which is never a target.

#### IP16 Text area

**Category**: Input · **Used In**: Copy save and Load save (#13 C17) · **Source**: #13 C17,
Interaction Map, AC-13-28, AC-13-29

**Description**: The MVP's only free-text field: a read-only box to copy a save from, and a box to
paste one into.

**Specification**

- **Copy save**: a read-only text area holding the save, selected on open, with a **Copy** button.
  Copy uses the clipboard and says "Copied" when it succeeds. If the clipboard is refused, the
  selected text stays there to copy by hand. It writes nothing (#13 C17).
- **Load save**: a text area and **Check**. Over `IMPORT_MAX_BYTES` it says "This text is too long
  to be a save." Text that does not parse says "This is not a save." A dry-run refusal shows its
  reason. Nothing changes until the confirm (IP3) (#13 C17, AC-13-28).

**Input mapping**: standard text editing; Tab leaves the field; Check and Copy are buttons (IP15).

**States**: Empty · Filled · Refused, with its reason · Loadable, leading to the confirm step.

**Accessibility** [AA assumed]: each text area has a visible label. A refusal is shown in words
next to the field (WCAG 3.3.1). Nothing times out.

**When to Use**: to move a save in or out by hand.

**When NOT to Use**: for any game input. The game takes no typed text.

### Feedback

#### IP17 Log line

**Category**: Feedback · **Used In**: the log column (wide), the Log tab and the pinned log line
(narrow) (#13 C14, C15) · **Source**: #13 C14, C15, Events Fired (channel table, merging),
Accessibility, Localization; rules 68, 99, 70; PD11

**Description**: One plain-text line for each typed event the player should be able to read
afterwards. The log is the game's one event channel.

**Specification**

- **Every line comes from a typed event or from an action's result.** The interface derives no
  event of its own (#13 Events Fired, AC-13-20).
- **Templates** with named placeholders, such as "{source} stopped: {reason}"; plurals follow the
  locale (#13 Localization). The event-to-line table is #13's.
- **Newest first.** A new unit line for the same source as the newest entry updates that entry's
  count instead of adding a line; any other entry ends the merge (#13 Events Fired, AC-13-23).
- An optional second line holds a record's `flavor`, for example a key item's first making (#13
  Events Fired; rule 70).
- Lines are neutral: no alarm glyph for a spill and no tending message (#13 Events Fired; #10
  Visual/Audio).
- **Plain text only.** No method mark, glyph, tint or target, and entries open nothing (PD11; #13
  Interaction Map).
- At most `LOG_MAX` (200) entries are kept in memory, the oldest dropped. The log is not saved (#13
  Events Fired).
- **The pinned line** (narrow): the newest entry on one line, the only text allowed to end in an
  ellipsis. A tap, or Enter, opens the Log tab at its top (#13 C15).

**Input mapping**: the log scrolls with the wheel, a swipe, or the arrow keys once focused (#13
Interaction Map). The pinned line opens the Log tab.

**States**: a single line · a merged line with its count · a line with flavour · the away block
(IP18).

**Accessibility** [AA assumed]: role `log`, `aria-live="polite"`, `aria-relevant="additions"`, so a
new entry is announced and an in-place merge is not (#13 Accessibility).

**When to Use**: for each event worth reading later: units, stops, spills, arrivals, openings, the
commit, the forge, a load.

**When NOT to Use**: for a save at risk (#13 C6, an `alert`); for what changes every frame (the
running line); for state the screen already shows in place, such as a heap flip or a start (#13
Events Fired).

#### IP18 Away summary

**Category**: Feedback · **Used In**: the top of the log, after a gap of at least
`AWAY_SUMMARY_MIN_MS` (60,000 ms), on load or when a hidden tab is shown again (#13 Events Fired) ·
**Source**: #13 Events Fired ("The away block"), Player Context on Arrival, Empty and edge states,
AC-13-22; #4 UI Requirements, Game Feel; rule 68; PD12

**Description**: One block that says what happened while the player was away, then the breath held
for the next run.

**Specification**

- **The block** (#13 Events Fired), in order:
  1. the header "Away {duration}";
  2. one line per store the run filled, with its net change and "full" if it ended full;
  3. one line per source that ran, with its units, never one line per unit;
  4. each stop, each spill (merged), each ingredient's arrival and each opening;
  5. last, "Breath held: {m:ss}".
- **A gap with no events** shows only the header and the breath held (#13 Empty and edge states).
- **Static** (PD12): no collapse and no dismiss. Newer entries stack above it, and `LOG_MAX` drops it
  like any other entry.
- **On narrow widths**, the pinned line shows the header and the first figures: "Away 3 h 12 min:
  Ash Tallow +40 · Breath 30:00" (#13 Events Fired).
- **The first paint already shows** the stores, the stop reason and the held breath, so the block is
  a record, not a gate (#13 Player Context on Arrival; #4 Game Feel).
- No dialog, no toast, and nothing asks for a tap on return (rule 68; pillar 4).

**Input mapping**: none beyond scrolling the log.

**States**: with events · header and breath only.

**Accessibility** [AA assumed]: it arrives in the log's polite live region, as any entry does (#13
Accessibility).

**When to Use**: whenever one `advance` covers at least `AWAY_SUMMARY_MIN_MS`.

**When NOT to Use**: for a gap under 60 s, which shows ordinary log lines (#13 AC-13-22); for the
load notice, which belongs to the notice strip and is then copied to the log (#13 C6).

#### IP19 Empty, loading and error states

**Category**: Feedback · **Used In**: every screen · **Source**: #13 C18, Empty and edge states,
C6 (Internal error); #14 States & Variants (Empty, Loading, Error)

**Description**: No screen is ever blank, no wait shows a spinner, and every failure gives one
plain sentence and the way out.

**Specification**

| State | What the player sees | Source |
|---|---|---|
| Empty log | Never: a run starts with "A new run begins." | #13 Empty and edge states |
| Empty road | Never in the MVP; a realm with no revealed source would read "Nothing on the road yet." | #13 Empty and edge states |
| A store at 0 | "0/{cap}" and an empty bar, never a blank | #13 Empty and edge states |
| No rule-derived number in a card | No breakdown block and no "no breakdown" text | #14 States & Variants |
| Loading | Nothing for the first 300 ms, then "Loading…" | #13 C18 |
| A breakdown | Never a spinner or "computing" | #14 States & Variants |
| A session screen | One plain sentence and its way out (Elsewhere, Superseded, Refused, Content error, No lock support) | #13 C18 |
| An internal error | "Something went wrong, and nothing changed." with Copy report, in the notice strip | #13 C6 |
| A developer error (a number with no trail) | The number bare, a console error naming the record and field; a build-time test fails | #14 AC-14-16 |

**Accessibility** [AA assumed]: "Not saving" and "This browser is not keeping your save" are
`alert`; the load notice is `status` (#13 Accessibility).

**When to Use**: on every data-dependent element.

**When NOT to Use**: never show a "?" placeholder, an invented line, or a blank where a value
belongs (#14 States & Variants).

### Input and layout

#### IP20 Focus and keyboard order

**Category**: Navigation · **Used In**: every screen · **Source**: #13 Input Method Completeness
Checklist, Interaction Map, Accessibility, C16, C17; #14 BD6, Input Method Completeness Checklist;
PD4, PD5, PD9, PD15, PD16

**Description**: Where focus goes and in what order, so the whole game plays with the keyboard
alone.

**Specification**

- **Tab order** (#13 Input Method Completeness Checklist):
  - Wide: the skip link, the notice strip, the goal band (goal line, method chip, menu, running
    line, Stop), the store column, the view tabs, the centre view, the log.
  - Narrow: the skip link, the header, the notice strip, the content, the pinned log line, the tab
    bar.
- **The skip link** comes first. It goes to the first control of the centre view on screen, and
  its label follows that view: "Skip to the forge" before the commit or while the Forge is shown,
  otherwise "Skip to the road" (PD15).
- **Keys**: Tab, Shift+Tab, Enter, Space, Esc and the arrow keys only. There are no keyboard
  shortcuts in the MVP. Rule 33's "keyboard pin" is met by Enter opening a card (#13 Interaction
  Map).
- **Arrow keys** move within the tab list and the menu, and scroll a focused log or container (#13
  Interaction Map; #14 Interaction Map).
- **Where focus moves:**

  | Moment | Focus goes to | Source |
  |---|---|---|
  | A card opens | Its title | PD4 |
  | A drill-down | The back line | #14 BD6 |
  | Back | The line that was opened | #14 BD6 |
  | The card closes | The record that opened its first frame | #13 C16 |
  | A confirm dialog opens, or its confirm step appears | Cancel; a dialog that starts with a field starts there | PD9; #13 C17 |
  | A dialog is cancelled, or one that changed nothing closes | The control that opened it (the menu button for a menu item) | #13 C17; Open Questions 4 |
  | A confirm that changed what is shown | The heading of the view now shown | PD16 |
  | The menu closes by Esc | The menu button | IP5 |

- **Containment**: the card, the sheet and every dialog are modal, and focus stays inside until
  they close (PD5; #13 C17).
- **Esc** closes the open overlay (the card with its whole stack, the menu, or the dialog) and never
  leaves the game (#13 Input Method Completeness Checklist).
- **Nothing hidden under an overlay.** The sheet stops below the pinned header, the notice strip
  never covers the goal band, and focus cannot leave an open card (#13 C16, C6; PD5).

**Feedback**: the focus ring is 2 px, never removed, and keeps 3:1 against both colours next to it
[AA assumed] (#13 Accessibility). #14 adds no focus style of its own (#14 Input Method Completeness
Checklist).

**Accessibility** [AA assumed]: every interactive element is reachable with Tab, and every mouse
action has a keyboard equivalent (#13 Input Method Completeness Checklist). WCAG 2.1.1, 2.4.3,
2.4.7 and 2.4.11 are covered by the rules above.

**When to Use**: on every screen and every overlay.

**When NOT to Use**: never move focus on a game event. The card never closes on one (#13 C16), and
the only view switch the game makes, to the Road on `committed`, comes from the player's confirm
(PD16).

#### IP21 Pointer and touch targets

**Category**: Input · **Used In**: every interactive element · **Source**: #13 Platform and
preference variants ("Touch"), Input Method Completeness Checklist, C16, AC-13-33; #14 D3, Layout
Zones; rule 67; PD7

**Description**: How big a target is, what a pointer may do, and what is never a target.

**Specification**

- **Target size** (PD7; #13 Variants, AC-13-33) [AA assumed]:
  - with a coarse pointer, every target is at least 44 × 44 CSS px, at any width;
  - with a fine pointer, at least 32 × 32 CSS px, with 44 preferred;
  - part, back and named-record lines are full width and follow the same two heights (IP2).
  - Both exceed WCAG 2.2's AA minimum of 24 × 24 (2.5.8).
- **Numbers and marks are never targets**, so dense rows such as "5 per 5 s · heaped 7 per 6.25 s"
  need no per-number target at 390 px (#14 D3; rule 67).
- **Hover** shows a pointer cursor and an ink underline on a record's name, and nothing else. No
  number takes a hover underline (#13 C16, Interaction Map; #14 MK2).
- **Right-click** keeps the browser's default (#13; #14).
- **Long press** acts as a tap, and control text cannot be selected (#13 Input Method Completeness
  Checklist).
- **No swipe gestures**: the sheet closes by its × or the scrim (#13 Input Method Completeness
  Checklist).
- **A click outside a card** closes it and also acts on what it lands on (#13 C16).

**States**: fine pointer · coarse pointer, from the `pointer` media feature (#13 Variants).

**Accessibility** [AA assumed]: as above. One-handed reach on a tall phone is open (Open
Questions 9).

**When to Use**: for every interactive element.

**When NOT to Use**: never make a number, a mark or a glyph a target.

#### IP22 Phone-width layout

**Category**: Layout · **Used In**: the whole shell below `WIDE_MIN_PX` · **Source**: #13 Layout
Zones (narrow), C7, C15, C16, C17, Platform and preference variants, Localization, AC-13-07,
AC-13-24; #14 Layout Zones, Localization; rules 32, 37, 67, 98; PD3, PD13, PD14

**Description**: One narrow layout, specified from the MVP, that keeps every persistent item on
screen at 390 px and holds at 320 px.

**Specification**

- **Breakpoint** (PD3): narrow below `WIDE_MIN_PX`, 960 px. Designed at 390 px; holds at 320 px.
  The layout follows CSS pixels, so 200% zoom on a 1280 px window falls into the narrow layout and
  nothing clips (#13 Platform and preference variants). There is no second breakpoint and no
  drawer.
- **Zones** (#13 Layout Zones, narrow):

  | Zone | Place | Contents |
  |---|---|---|
  | N1 Header | Pinned top | Goal line (compact), method chip, menu; after the commit, the next-step line; the running line, at most two lines; store chips, wrapping in rows of three |
  | N2 Notice strip | Pinned under N1 | Session notices; the load notice folds to one line with Details |
  | N3 Content | Between N2 and N4 | Before the commit, the instruction block heads every tab; then Road, Forge or Log |
  | N4 Pinned log line | Above N5 | The newest log entry, on one line (IP17) |
  | N5 Tab bar | Pinned bottom | Road · Forge · Log (IP4) |

- **No drawer and no bell** (rule 98 diverged, because rule 32 wins: the stores stay on screen as
  chips) (#13 Reference rules).
- **Height budget**: at 390 × 844 after the commit, with no notice, N1, N4 and N5 together take at
  most 45% of the height, so the content keeps at least 460 px (#13 AC-13-24).
- **Overlays**: the detail container is a bottom sheet that stops below N1, with its content 16 px
  in from each edge (IP1; PD14). Dialogs are full width (#13 C17).
- **Wrap, never truncate**: rows, chips, cards, dialogs and breakdown causes all wrap. Only N4 may
  end in an ellipsis (#13 C15, AC-13-07; #14 Layout Zones).
- **No sideways scroll** at 390 px or 320 px (WCAG 1.4.10; #13 AC-13-07; #14 AC-14-20).
- **Text sizes** [AA assumed]: body at least 16 px on narrow widths and 14 px on wide ones;
  secondary figures at least 13 px; breakdown lines at least 14 px at every width (PD13). Sizes are
  in rem, so they follow the browser's text size (#13 Accessibility).
- **Logical properties** (inline-start and inline-end), never left and right, so mirroring costs
  little later (#13 Localization; #14 Localization).
- **40% expansion**: #13 Localization and #14 Localization list the high-priority elements (store
  chips, the running line, a row's figures, the compact goal line, tab labels, Start and Stop,
  "Opens under {method}", commit dialog lines, the hidden-base line).

**States**: wide · narrow · zoomed into narrow.

**Accessibility** [AA assumed]: reflow at 320 px (WCAG 1.4.10); text spacing overrides never clip,
because rows wrap (#13 Accessibility).

**When to Use**: for every screen. A new screen states its narrow form in these zones.

**When NOT to Use**: never take a rule 32 item (goal band, method, running line, stores) off the
narrow screen. Phone layout (#17) may refine this layout at the vertical slice, but not remove one
of these without amending #13 (#13 Seams).

**Implementation notes**: a narrow viewport at least 640 px wide and below 600 px tall folds the
pinned zones (#13 Layout Zones, Short viewports). Below 360 px of height, and one-handed reach, are
open for #17 (Open Questions 9).

**Reference**: #13 ASCII Wireframe, "Narrow (390 px), Committed" and "Narrow, Choosing".

#### IP23 Scroll zone

**Category**: Layout · **Used In**: every zone · **Source**: #13 Layout Zones, Interaction Map;
#14 Interaction Map

**Description**: The page never scrolls as a document. Each zone scrolls inside itself.

**Specification**

- Scrolling zones: wide Z3 (stores), Z4 (centre, per view) and Z5 (log); narrow N3 (content); the
  detail container (#13 Layout Zones, C16).
- Fixed zones never scroll: Z1, Z2, N1, N2, N4, N5 (#13 Layout Zones).
- Vertical only. Nothing scrolls sideways at any width (#13 AC-13-07; #14 Interaction Map).
- The wheel scrolls the zone under the pointer. The arrow keys scroll a focused log. Inside the
  container, the arrow keys and Page Up and Page Down scroll while focus is inside (#13 Interaction
  Map; #14 Interaction Map).
- Each centre view keeps its own scroll position across tab switches (#13 Interaction Map).

**Accessibility** [AA assumed]: a scrolling zone with no focusable content of its own (the log) is
itself focusable, so the keyboard can scroll it (#13 Interaction Map: "Arrow keys scroll the
focused log").

**When to Use**: for every zone whose content can exceed its height.

**When NOT to Use**: never scroll the page body, and never scroll sideways.

---

## Animation Standards

The interface's motion is information, never decoration that delays it (#13 Transitions). Every
row below comes from #13 or #14. Where a source sets no easing, the easing is the art bible's.

| Moment | Duration | Easing | Under reduced motion | Blocks input? | Source |
|---|---|---|---|---|---|
| Any state change in place: a stop, a unit completed, a spill, a floor opening, a heap flip | Instant, in the frame it happens | — | Same | No | #13 Transitions |
| Numbers | Change only at a settle, in that frame, with no counting up | — | Same | No | #13 Transitions (#3 Game Feel) |
| Progress bars | Repainted every frame from *p* / *D*; after a rescale, a jump to the true fraction | None | Same: bars carry information | No | #13 Transitions; #10 Game Feel |
| First paint, session screens | Instant; "Loading…" only after 300 ms | — | Same | — | #13 Transitions, C18 |
| View or tab switch | Instant | — | Same | No | #13 Transitions |
| Detail card (wide), open and close | Instant | — | Same | No | #13 Transitions |
| Bottom sheet (narrow), up and down | 150 ms each way | Art bible's (not set by #13) | Instant | No | #13 Transitions |
| Drill down and back | One frame, no slide and no fade | — | Same | No | #13 Transitions; #14 Transitions |
| Dialogs, open and close | Instant | — | Same | No | #13 Transitions |
| Notices | Appear and leave instantly; no timed dismissal | — | Same | No | #13 Transitions |
| The commit: values, glyphs, marks, closed rows, method chip, road states | Final in the confirm's frame | — | Same | No | #13 Transitions; #14 Transitions; #7 AC-W7-4 |
| The commit: #13's tint sweep along the channel lines | Ends within 400 ms of the commit | Art bible's | None | No; never delays a value | #13 Transitions |
| The commit: #14's channel-underline draw-in | 240 ms per underline, starting 20 ms apart in reading order; the whole sweep ends within 400 ms | Ease-out | None: underlines appear complete in the commit frame | No; a container opened during it shows final content | #14 Transitions |
| A new run | Every mark and closed row is gone in the first frame | — | Same | No | #14 Transitions |
| The forge | The goal line becomes the Foundation in the `forged` frame; caps and stats change in that frame | — | Same | No | #13 Transitions; #14 Transitions |
| The forge's visual event | #15's (Gap 9) | — | — | — | #13 Transitions; systems index ¶15 |

**Rules for every animation**

- Nothing flashes and nothing blinks, so no element can trigger photosensitivity (WCAG 2.3.1; #13
  Transitions).
- No animation repeats (#14 Transitions).
- No animation delays a value or blocks input. The state is final before any decoration starts (#13
  Transitions; #14 Transitions).
- The commit's two decorations start on the same `committed` event, and neither waits for the other
  (#13 Transitions; #14 Transitions).
- `prefers-reduced-motion: reduce` removes the sheet slide, the tint sweep and the underline
  draw-in. Progress bars keep moving (#13 Accessibility; #14 Accessibility).
- #14 caps its own motion at 400 ms. Whether that cap binds every screen, #15's forge moment
  included, is open (Gap 9).

---

## Sound Standards

**The MVP has no sound.** There is no audio system yet (#6 Visual/Audio: "No audio: the game has no
audio system yet"), and the interface uses no sound cue anywhere (#13 Player Context on Arrival,
quoting #4 Game Feel: "The interface never needs urgency cues, flashing or a sound on a stop").

| Event | Sound | Source |
|---|---|---|
| Any button, switch, tab, menu or line activation | None | #6 Visual/Audio |
| Opening or closing a card, sheet or dialog | None | #6 Visual/Audio |
| A stop, a store filling, a spill | None, ever: no sound on a stop | #4 Game Feel, via #13 |
| The commit, the forge | None in the MVP | #6 Visual/Audio |
| A save at risk ("Not saving") | None: the notice is the message | #13 Events Fired |

**When an audio system is added**, it must keep #4's rule (no sound on a stop, no urgency cue), and
it must never be the only carrier of a state, so every state keeps its glyph and word (IP11). The
rest of its standards are its own.

---

## Gaps & Patterns Needed

**For #15 Forge screen** (PD19). #15 is the next UX spec. It uses IP1–IP3, IP6–IP10, IP13 and
IP20–IP22 as they stand, and it builds the Wave A goal line and instruction from #13 C1 and C2
(#13 Open Questions 14). Each gap below is a pattern #15 needs that neither #13 nor #14 defines.
#15 defines it, and the pattern is then added here.

| # | Gap | Already fixed by #13, #14 or the GDDs | #15 must decide |
|---|---|---|---|
| 1 | **Pick 4 of 6** (the plan of four) | #6 UI Requirement 1: four of the realm's ingredients, each held or not held; a plan that cannot be forged says why in words (#6 G8.1). The reason-in-words rule (IP13), state words (IP11), and records opening IP1 | The selection control (slots, a checked list or another form); what happens on a fifth pick; its keyboard model; where the "why it cannot forge" sentence sits; its fit at 390 px |
| 2 | **Side-by-side method columns** (the method-choice view) | #7 UI Requirements 1–2: both methods side by side from the first screen, each with name and glyph, feeds as deltas, quenches as "quenched", opens and closes, and "Begin circulating [method]". Hollow marks only and no absolute contribution (#14 W6, MK4, MK7). The commit dialog (IP3) | How two columns fit at 390 px (stacked, or another arrangement with no swipe, IP21); the order of the methods; the tab order between and within columns |
| 3 | **Withheld until in hand** (a plan that is not previewable) | #6 G7: no door score, tier, seal or cap until every ingredient of the makeup is held. #14 BD5: no seal, score, tier or cap breakdown for such a plan. #14 BD7's hidden-base line, at the ingredient level | What the seals, tiers and caps area shows instead, so the space never reads as zero or as blank (IP19), in the tone of BD7's line |
| 4 | **Comparing held makeups** | #6 UI Requirement 3: the screen may list every previewable makeup with its seals (#6 G9.1). IP7 for each seal count. The MVP signal "three makeups previewed before the first forge" (#14 Player Context on Arrival) | The list's form; its order, given the no-steering rules (#6 G7.4; #13 C2: no line names a best makeup); how a listed makeup is chosen; its fit at 390 px |
| 5 | **The headroom signal** as a realm-fact line | #6 G7.4, UI Requirement 4: `bestSeals(m)` as a fact about the realm that never names a makeup. #14 BD5: one sentence line, no parts, no Total. #13 C1: never shown in the goal line | Its form and place; when it shows (the systems index puts it before the commit, ¶15); whether it is a record that opens IP1 |
| 6 | **The accent before the commit** | #14 MK4: hollow glyphs are drawn, and their colour before the commit is #15's. #13 C3: the shell sets no accent before the commit. #14 MK6: after the commit, one accent only | Whether hollow glyphs and "Begin circulating" take a colour before the commit; it must keep 3:1 and the glyph-before-hue rule (IP8, IP11) |
| 7 | **Affinity and door-tier glyphs** | #14 MK2: #15 draws them in ink, never tinted, distinct from every method silhouette, and a tier is never gate-shaped. #6 Visual/Audio: each affinity also names its stat; tiers by word and glyph. #13 C1's tier glyphs in the goal line (shut ○○, open ●○, wide open ●●) | The four affinity glyphs and the tier glyphs, with the art bible, consistent with #13 C1's goal line |
| 8 | **Words for composed numbers** | #14 BD5's provisional words. #6 UI Requirement 8: "total", "effective value" and "score" are designer terms, not copy. #13 Accessibility's list of words never shown | The player-facing names for an affinity total, an affinity after its clash, and a door's score |
| 9 | **The forge's visual moment** and its time bound | #6 Visual/Audio: one moment read from `forged` and `capChanged`, with no fight playback; #6 Game Feel: instant, in the confirm's frame. Animation Standards: state final first, nothing flashes, decoration never blocks input. #13 C1: the goal line becomes the Foundation in the `forged` frame | The moment's look; its time bound (the commit's is 400 ms); its reduced-motion form; whether #14's 400 ms cap binds it |
| 10 | **A refused act inside a dialog** | #7 UI Requirement 2: "A refused commit shows its reason". IP13: a refused Start changes nothing, and its row already shows why. IP16: Load save shows a refusal in words | Where a commit's or forge's refusal shows inside IP3; whether the dialog stays open; where focus goes |
| 11 | **The ingredient contribution row** at 390 px | #14 W1's sketch; IP9's no-break mark unit; #14 MK7 for unheld ingredients; IP13's wrap rule; #13 C8's ingredient words; #7 UI Requirement 5: route families named wherever an ingredient's sources are listed | How four affinity values, their marks and their stat names fit at 390 px; whether the row also lists its routes |
| 12 | **Whether a plan is saved** | #13 Data Requirements: interface state (the open card, the view, the log) is never saved. #11 lists what the save holds | With #11: whether the plan of four is interface state, lost on reload, or saved state, which would change #11's format |

**Other gaps** (outside #15):

- **Phone layout (#17)**: viewports below 360 px of height, and one-handed reach (Open Questions 9).
- **Accessibility and settings (#18)**: themes, text size and a keyboard shortcut set are #18's.
  This library adds none (#13 Interaction Map, Seams).
- **Later realms (#19)**: a screen unlocked by a realm would need section records (rule 8,
  diverged in #13), and a list past about 50 records would need search (rule 66). Neither is in the
  MVP.

---

## Changes needed in existing specs

This library edits neither spec. The coordinating session applied these changes at merge on 2026-11-21, with
the designer's approval. Line numbers are those of `design/ux/interface-shell.md` and
`design/ux/method-marks.md` at commit 5e5deb8. **No GDD needs a change.**

### #13 Interface shell and goal line (`design/ux/interface-shell.md`)

| # | Line | Now | Change to | Why |
|---|---|---|---|---|
| 13.1 | 286–287 | "'New pattern' means the component is not in a pattern library yet, because none exists (Open Questions 4)." | "The Pattern column names the pattern in `design/ux/interaction-patterns.md`." | The library exists |
| 13.2 | 291–308 (Pattern column) | "New: …" and "Standard …" | C1, C2, C5, C6, C7, C8, C10, C12: "#13 single-use (library catalogue)". C3: IP8. C4: IP5. C9: IP4. C11: IP13, with C11a IP14. C14: IP17, IP18. C15: IP17. C16: IP1, IP2. C17: IP3. C18: IP19 | PD1, PD2 |
| 13.3 | 462–463 (C11, before the commit) | "Gatherer toggles are disabled with the same text" | "Gatherer toggles stay focusable and are marked `aria-disabled`, with the same text as their accessible description; activating one does nothing" | PD10 |
| 13.4 | 495–501 (C16 Opening) | — | Add: "Focus moves to the card's title." | PD4 |
| 13.5 | 505–507 (C16 Narrow) | "Full width, at most …" | Add: "Its content sits 16 px in from each inline edge." | PD14 |
| 13.6 | 509–511 (C16 Drill-down stack) | "a **record named in the card** (…)" | Add: "A named record uses the part line's form: a full-width line ending in '›'." | PD6 |
| 13.7 | 518–520 (C16 Line size) | "Part lines and the back line are full width and at least 44 px tall with a coarse pointer." | "Part lines, named-record lines and the back line are full width, and at least 44 px tall with a coarse pointer or 32 px with a fine one." | PD6, PD7 |
| 13.8 | 552–553 (C17) | "… and it returns focus to the control that opened it." | "… and it returns focus to the control that opened it, or, after a confirm that changed what is shown, to the heading of the view now shown. When it opens, or its confirm step appears, Cancel holds focus. Cancel sits at inline-start and the confirm at inline-end." | PD9, PD16 |
| 13.9 | 556–558 (C17 busy state) | "for any dialog whose confirm writes the save" | "for a dialog whose confirm switches the run (New run, Load save). The commit and forge dialogs close in the confirm's frame, and a failed write raises Not saving (#11 J5)" | PD8 |
| 13.10 | 561, 572 (C17); 852, 856 (Interaction Map); 1257 (AC-13-27) | "Confirm and Cancel"; "New run: Confirm"; "Load save: Confirm"; "Confirm shows 'Working…'" | The confirm is labelled with its act ("Start a new run", "Load this save"; provisional copy), then Cancel. The two Interaction Map rows and AC-13-27 follow | PD17 |
| 13.11 | after 849 (Interaction Map) | — | Add a row: "Card or sheet · Scroll · Wheel · Arrow keys, Page Up and Page Down while focus is inside · Vertical swipe · — · Interface only" | Captured from #14 Interaction Map (method-marks.md line 724), which already defines scrolling inside #13's container; #13 states it nowhere |
| 13.12 | 945–947 (Events Fired, "One channel") | — | Add: "Log lines are plain text: no mark, glyph, tint or target." | PD11 |
| 13.13 | 982–989 (the away block) | — | Add: "The block is static: no collapse and no dismiss. Newer entries stack above it, and `LOG_MAX` drops it like any other entry." | PD12 |
| 13.14 | 1027 (Tab order) | "the skip link ('Skip to the road')" | "the skip link ('Skip to the forge' or 'Skip to the road', following the centre view on screen)" | PD15 |
| 13.15 | 1037 (Keyboard checklist) | "Focus stays inside an open dialog or narrow sheet until it closes" | "Focus stays inside an open dialog, card or sheet until it closes" | PD5 |
| 13.16 | 1069–1072 (Keyboard and focus) | "Focus moves into an opened card or dialog" | "Focus moves to an opened card's title, or to a dialog's Cancel (its first field, if it has one)" | PD4, PD9 |
| 13.17 | 1086 (Cards and dialogs row) | "the narrow sheet and every dialog are modal" | "the card, the sheet and every dialog are modal" | PD5 |
| 13.18 | 1090–1091 (Contrast and text) | "secondary figures are at least 13 px." | Add: "Breakdown lines are secondary text, at least 14 px at every width; a number's own line follows body size." | PD13 |
| 13.19 | 1383 (Cross-reference check) | "New patterns to add to the library: eight (Open Questions 4)." | "Patterns: named in `design/ux/interaction-patterns.md` (2026-11-21)." | The library exists |
| 13.20 | 1413 (Open Questions 4) | "No interaction pattern library." | Mark it resolved by `design/ux/interaction-patterns.md` (2026-11-21) | The library exists |

### #14 Method marks and number breakdowns (`design/ux/method-marks.md`)

| # | Line | Now | Change to | Why |
|---|---|---|---|---|
| 14.1 | 601 (Layout Zones, Part line) | "At least 44 px tall on touch" | "At least 44 px tall with a coarse pointer and 32 px with a fine one (#13)" | PD7 |
| 14.2 | 602 (Layout Zones, Back line) | "Full width, at least 44 px tall" | "Full width, at least 44 px tall with a coarse pointer and 32 px with a fine one (#13)" | PD7 |
| 14.3 | 605 | "inside #13's 16 px gutters" | "inside the sheet's 16 px inline padding (#13 C16)" | PD14 |
| 14.4 | 613–624 (Pattern column) | "**New:** …" | C1, C2, C5, C12: IP8. C3: IP9. C4, C11: IP10. C6, C10: IP6. C7: IP7. C8, C9: IP2 | PD1 |
| 14.5 | 626–627 | "No interaction pattern library exists yet (…). Every pattern marked **New** is flagged for it (Open Questions)." | "Patterns are named in `design/ux/interaction-patterns.md`." | The library exists |
| 14.6 | 700 (Display variants) | "Phone width (≤ 650 px, about 390 px)" | "Narrow (below 960 px, #13 `WIDE_MIN_PX`; designed at 390 px, holds at 320 px)" | PD3 |
| 14.7 | 721 (Interaction Map, C8 row) | "#13's pressed state on the line. The content swaps in the same frame" | "The content swaps in the same frame; there is no pressed style" | PD18 |
| 14.8 | 848–849 (Keyboard checklist) | "Focus stays inside the container while it is open, as a narrow bottom sheet," | "Focus stays inside the container while it is open, in both its forms (#13 C16)," | PD5 |
| 14.9 | 855 (Mouse checklist) | "Click targets are at least 44 px tall and full width (Layout Zones)." | "Click targets are full width, and at least 32 px tall with a fine pointer or 44 px with a coarse one (#13)." | PD7 |
| 14.10 | 1072–1073 (AC-14-19) | "At 390 px every part and back line is at least 44 px tall and full width." | "Every part and back line is full width, and at least 44 px tall with a coarse pointer (32 px with a fine one)." | PD7 |
| 14.11 | 1101 (Open Questions 15) | "No interaction pattern library." | Mark it resolved by `design/ux/interaction-patterns.md` (2026-11-21) | The library exists |
| 14.12 | 1103 (Open Questions 17) | "#17 re-checks them in the drawer and bottom-tab layout" | "#17 re-checks them in #13's narrow layout (pinned header, bottom tabs, bottom sheet; no drawer)" | PD3 |
| 14.13 | 1110 (Cross-reference check) | "No library exists, so they are flagged as a gap (Open Questions 15)" | "Named in `design/ux/interaction-patterns.md` (2026-11-21)" | The library exists |

---

## Open Questions

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | **Accessibility requirements not landed.** *Resolved 2026-11-21 by `design/accessibility-requirements.md`:* the tier is Comprehensive, against WCAG 2.2 AA, so every **[AA assumed]** value stands | `design/accessibility-requirements.md` (the parallel `/ux-design accessibility` session) | When it lands |
| 2 | **Start's accessible name.** Many rows carry a Start button. Is "Start" alone enough in context, or should it be "Start {source}", as the heap switch is "Heap {source}"? | `design/accessibility-requirements.md`, with the `writer` | Before #13's UI stories |
| 3 | **A named-record line's accessible name.** #14 names a part line "{cause}, {amount}, show breakdown". A named-record line (PD6) needs a name in the same form, for example "{record}, show details" | `writer`, with `design/accessibility-requirements.md` | #13's copy review (AC-13-36) |
| 4 | **A reading to check.** *Resolved 2026-11-22 by `/ux-review patterns`:* the reading holds. Once a menu item opens a dialog the menu has closed, so "the control that opened it" (#13 C17) is the menu button, and focus returns there | `/ux-review` | `/ux-review` of this library |
| 5 | **The kept-progress bar's text value.** A row's partial bar (IP12) has no text value on the row, unlike every other bar | `design/accessibility-requirements.md`, with #13 | Before #13's UI stories |
| 6 | **Easing.** #13 sets the sheet's 150 ms slide and the 400 ms commit sweep but no easing for either | `art-director` (art bible) | Art bible |
| 7 | **No art bible** (#13 Open Questions 3; #14 Open Questions 2). Glyph drawings, the palette, button weights and the focus ring's colour wait on it | `art-director` | Before the UI stories |
| 8 | **No player journey map** (#13 Open Questions 1; #14 Open Questions 1) | Designer | Before `/ux-review` of #13–#15 |
| 9 | **One-handed reach and short viewports** (#13 Open Questions 11, 12; #14 Open Questions 6). Stop and the back line sit at the top of a tall phone, and below 360 px of height the pinned header can exceed its budget. From 640 × 360 up, #13 folds it (AR-V4.4) | Phone layout (#17) | Vertical slice |
| 10 | **A library-wide motion cap.** #14 caps its own motion at 400 ms. Whether that binds every screen, #15's forge moment included (Gap 9) | Forge screen (#15) | #15 UX spec |
| 11 | **Stale platform note.** `.claude/docs/technical-preferences.md` still says "mouse with hover tooltips" (#13 Open Questions 5; #14 Open Questions 4). This library follows #13 | Technical Director | `/create-architecture` |

### Cross-reference check (`/ux-design` phase 5, 2026-11-21)

An independent read-only review also checked this library against #13 and #14 at commit 5e5deb8:
every citation, every "Now" quote and line number in "Changes needed", and every pattern in scope.
It found no invented behaviour, no contradiction outside PD1–PD19, and no wrong citation or line.
Its two minor findings, both about attribution (change 13.11, and PD2's catalogue scope), are fixed
above.

| Check | Result |
|---|---|
| GDD requirement coverage | **Not applicable as a screen check.** The library adds no screen, so it satisfies no GDD UI Requirement directly. #13's Requirement Trace and #14's cross-reference check cover the GDDs, and every pattern here cites the spec rule that carries a GDD requirement. Gaps 1–12 carry the GDD requirements aimed at #15 (#6 UI Requirements 1–8, #7 UI Requirements 1–2 and 5) that no pattern meets yet |
| Pattern library alignment | **Complete for #13 and #14.** Every component in #13's and #14's Component Inventories maps to a pattern ID or a single-use catalogue row (changes 13.2 and 14.4). #13 Open Questions 4 and #14 Open Questions 15 close when those changes land |
| Navigation consistency | **Consistent.** Back behaves the same everywhere: the back line goes up one level, and Esc closes the whole stack (IP1, IP2). Focus moves follow one table (IP20). The #13/#14 differences found (breakpoint, line height, pressed state, the card's modality) are settled by PD3, PD5, PD7 and PD18, with the spec edits listed |
| Accessibility coverage | **The floor is met; the tier is assumed.** Every pattern states its accessibility under WCAG 2.2 AA [AA assumed], pending `design/accessibility-requirements.md` (Open Questions 1). Three values are routed to that document (Open Questions 2, 3, 5) |
| Empty states | **None missing.** IP19 lists every empty, loading and error state #13 and #14 define. Gap 3 (withheld until in hand) is the one empty state #15 still owes |
