# Accessibility Requirements

> **Status**: Committed 2026-11-21: the tier is committed and every section is written. `/ux-review` has not been run
> **Author**: designer + Claude (`/ux-design accessibility`)
> **Last Updated**: 2026-11-21
> **Accessibility Tier Target**: Comprehensive (designer, 2026-11-21)
> **Platform(s)**: Web browser, desktop first. Phone width is a constraint from the MVP: 390 CSS px design width, 320 CSS px reflow floor. Inputs: mouse, keyboard and touch. No gamepad. No console, store or native mobile build
> **External Standards Targeted**:
> - WCAG 2.2 Level AA, on every screen (designer, 2026-11-21)
> - AbleGamers CVAA Guidelines: not applicable. The game has no communication feature (no chat, voice or messaging)
> - Xbox Accessibility Guidelines (XAG): No (no Xbox build)
> - PlayStation Accessibility (Sony Guidelines): No (no PlayStation build)
> - Apple / Google Accessibility Guidelines: N/A (no native app; phone browsers are covered by WCAG)
> **Accessibility Consultant**: None engaged. A self-audit against this document runs at the Pre-Production and Polish gates (designer, 2026-11-21)
> **Linked Documents**: `design/gdd/systems-index.md`, `design/gdd/game-concept.md` (pillars, Visual Identity Anchor), `design/ux/interface-shell.md` (#13), `design/ux/method-marks.md` (#14), `design/ux/interaction-patterns.md` (being written; it cites this document)
> **Template**: Accessibility Requirements

> **Why this document exists**: Per-screen accessibility annotations belong in UX specs. This
> document holds the project-wide commitment: the tier, the requirements every screen must meet,
> the feature matrix across all systems, the test plan and the audit history. The interaction
> pattern library (`design/ux/interaction-patterns.md`) owns how each pattern behaves and cites
> this document for the bar it must clear. If a feature conflicts with a commitment made here,
> this document wins. Change the feature, not the commitment, unless the designer approves a
> formal revision.
>
> **When to update**: After each `/gate-check` pass, after any accessibility audit, and whenever
> a new system is added to `systems-index.md`.

Rule numbers ("rule 32") refer to `research/arcanum-reference/12-design-rules.md` (1–38, 70–74),
`research/hundred-days-reference/06-design-rules.md` (39–69) and
`research/magic-research-2-reference/08-design-rules.md` (75–100). "#n" is system n of
`design/gdd/systems-index.md`. "SC" is a WCAG 2.2 success criterion. Requirements this document
fixes are numbered **AR-V** (visual), **AR-M** (motor), **AR-C** (cognitive), **AR-A** (auditory)
and **AR-P** (platform), so specs and stories can cite them ("AR-V3").

---

## Accessibility Tier Definition

### Tier Definitions

| Tier | Core Commitment | Typical Effort |
|------|----------------|----------------|
| **Basic** | Critical player-facing text is readable at standard resolution. No feature requires color discrimination alone. Volume controls exist for music, SFX, and voice independently. The game is completable without photosensitivity risk. | Low — primarily design constraints |
| **Standard** | All of Basic, plus: full input remapping on all platforms, subtitle support with speaker identification, adjustable text size, at least one colorblind mode, and no timed input that cannot be extended or toggled. | Medium — requires dedicated implementation work |
| **Comprehensive** | All of Standard, plus: screen reader support for menus, mono audio option, difficulty assist modes, HUD element repositioning, reduced motion mode, and visual indicators for all gameplay-critical audio. | High — requires platform API integration and significant UI architecture |
| **Exemplary** | All of Comprehensive, plus: full subtitle customization (font, size, color, background, position), high contrast mode, cognitive load assist tools, tactile/haptic alternatives for all audio-only cues, and external third-party accessibility audit. | Very High — requires dedicated accessibility budget and specialist consultation |

### This Project's Commitment

**Target Tier**: **Comprehensive**, measured against **WCAG 2.2 Level AA on every screen**
(designer, 2026-11-21).

**Rationale**: The Furnace Road is a text-dense browser incremental. Its barriers are visual and
cognitive, not motor. The player reads many numbers at phone width and solves a build problem
from them. The game asks for no execution skill: every action is one discrete input, nothing is
timed or held, fights resolve without play from an exact preview (#5), and pillar 4 guarantees
that no ingredient needs a fight. Comprehensive's distinguishing items are already designed in
#13 and #14 (screen-reader names and roles, reduced motion), or have nothing to act on (no
audio, no execution difficulty). The one exception is HUD repositioning, which is out of scope
below. Because the game is plain DOM in a browser, the browser and the OS supply text size, zoom,
reduced motion and the screen reader, so the tier costs design discipline rather than engine
work. No store certification applies, so WCAG 2.2 AA is the external bar. It is the version #13
and #14 already assume, and it adds Focus Not Obscured (SC 2.4.11) and Target Size (SC 2.5.8)
over 2.1. Dropping to Standard would make screen-reader menus and reduced motion optional. A
text-only game with no timing is one of the few kinds a screen-reader user can play in full,
so those are the players the drop would lose *[INFERENCE: no audience measurement exists]*.
Exemplary is not chosen: it needs an external audit, and its subtitle and haptic items do not
apply to a game with no audio.

**What this commitment means, item by item:**

| Tier | Item | In this project | Where it is met |
|---|---|---|---|
| Basic | Critical text readable | Met: text keeps 4.5:1, sizes are in rem with stated floors | Visual Accessibility |
| Basic | No information by colour alone | Met: glyph before hue (concept, Visual Identity Anchor principle 3) | Visual Accessibility; #13 AC-13-34; #14 AC-14-04 |
| Basic | Independent volume controls | Not applicable: the MVP has no audio. Required when audio arrives | Auditory Accessibility |
| Basic | No photosensitivity risk | Met: nothing flashes or blinks, and no motion lasts longer than 400 ms | Visual Accessibility; #13 and #14 Transitions |
| Standard | Full input remapping | Not applicable: the game binds no keys of its own. It uses only Tab, Shift+Tab, Enter, Space, Esc and the arrow keys, with their platform meanings (#13 Interaction Map; Shift+Tab per #14 Interaction Map) | Motor Accessibility |
| Standard | Subtitles with speaker identification | Not applicable: no voice and no audio | Auditory Accessibility |
| Standard | Adjustable text size | Met through the browser: rem sizes follow the browser's text size and zoom, to 200% without loss (SC 1.4.4). This depends on the short-viewport change to #13 | Visual Accessibility; Changes needed in existing specs |
| Standard | At least one colour-blind mode | **Diverged** (designer, 2026-11-21): no mode. Hue means the method and nothing else, the glyph always carries it, and after the commit only one hue is on screen, so a mode would have nothing to remap. Replaced by the greyscale rule (AR-V5) | Visual Accessibility |
| Standard | No timed input that cannot be extended | Met: nothing is timed (pillar 4) | Motor and Cognitive Accessibility |
| Comprehensive | Screen reader support for menus | Met: the menu, dialogs, session screens and notices are tested with a screen reader. WCAG 2.2 AA still requires names, roles, states and status messages on every screen (SC 1.1.1, 1.3.1, 4.1.2, 4.1.3) | Platform Accessibility API Integration |
| Comprehensive | Mono audio | Not applicable: no audio | Auditory Accessibility |
| Comprehensive | Difficulty assist modes | Not applicable: no execution skill. Fights are previewed exactly before they start, and every ingredient keeps a fightless source (pillar 4) | Cognitive Accessibility |
| Comprehensive | HUD element repositioning | **Not met**: out of scope | Known Intentional Limitations |
| Comprehensive | Reduced motion mode | Met through the OS preference `prefers-reduced-motion` | Visual Accessibility |
| Comprehensive | Visual indicators for gameplay-critical audio | Not applicable: no audio, and every event is already a log line | Auditory Accessibility |

**Where the settings come from** (designer, 2026-11-21): in the MVP, text size, zoom, reduced
motion and high contrast come from the browser and the OS. The game has no settings panel.
Accessibility and settings (#18) decides at the Vertical Slice whether to add in-game overrides.
This diverges from the template, whose Standard and Comprehensive rows assume in-game toggles.
The reason: a browser already exposes each of these preferences, and a second, in-game copy
would only be able to disagree with the player's own setting.

**Features explicitly in scope (beyond tier baseline)**: none. The designer chose the
Comprehensive baseline with no elevations (2026-11-21). Where #13 or #14 already exceeds the
baseline, the extra work stays allowed but is not a commitment, and no gate checks it. This
covers #14's forced-colours rules and AC-14-22, and the phrasing #13 and #14 give play screens
beyond what SC 4.1.2 requires.

**Features explicitly out of scope** (each also appears in Known Intentional Limitations):
- **HUD element repositioning** (Comprehensive). The persistent context is one band at the top
  on wide screens and one pinned header on narrow ones (#13; rule 32), and nothing sits in the
  periphery.
- **A tested screen-reader play-through** of the road, the stores, the cards and the forge
  screen. Menus are tested. Play screens must still meet WCAG 2.2 AA's programmatic
  requirements.
- **Forced colours (Windows High Contrast) on every screen**: Exemplary's high-contrast mode.
  #14 supports it for its own marks.
- **One-handed reach on a tall phone** in the MVP (#13 Open Questions 11, #14 Open Questions 6).
  Phone layout (#17) takes it at the Vertical Slice.
- **A colour-blind mode**, replaced by the greyscale rule (AR-V5).
- **In-game settings** for text size, motion and contrast in the MVP. Platform preferences serve
  instead, and #18 reviews this at the Vertical Slice.

---

## Visual Accessibility

Visual barriers are the main ones here. The game is read, not watched: numbers, bills, reasons
and breakdowns, at phone width, on a neutral stone base where one hue means the method (concept,
Visual Identity Anchor). There is no rendered scene, so brightness, gamma and subtitle rows of the
template do not apply. Every requirement below binds every screen: #13, #14, #15 and every later
one.

**Requirements**

- **AR-V1 Text contrast.** Text keeps at least **4.5:1** against the surface it sits on: the
  stone base, a card, a sheet, a chip, the notice strip or a dialog. Large text (at least 24 CSS
  px, or 18.67 CSS px bold) keeps at least 3:1 (SC 1.4.3). A state's reason text keeps 4.5:1
  even when its control is disabled. "Needs a method committed" beside a disabled toggle is
  information, so WCAG's exemption for inactive components does not cover it.
- **AR-V2 Non-text contrast.** Glyphs, notches, channel underlines, progress bars, control
  boundaries and the focus ring keep at least **3:1** against every colour next to them (SC
  1.4.11). The method tint tokens are for non-text graphics. A tint may colour text only where it
  also meets AR-V1 on that surface. #14's provisional light Ember Breath token (#B04A1C, 4.35:1 on
  #E9E5DE) passes for glyphs and fails for text, so names, numbers and breakdown text stay in ink (#14 MK2 and Accessibility,
  "Contrast").
- **AR-V3 Text size floors** (designer, 2026-11-21: #13's and #14's floors kept as written):

  | Text | Narrow (below 960 px) | Wide |
  |---|---|---|
  | Body text: names, reasons, card fields, dialog text | 16 CSS px | 14 CSS px |
  | Breakdown lines (#14) | 14 CSS px | 14 CSS px |
  | Secondary figures: a row's figures, a chip's held / cap | 13 CSS px | 13 CSS px |

  Every font size is set in rem, so it follows the browser's text size. No text is set in px,
  and no text is an image (SC 1.4.5; the pipeline is type, colour, layout and glyphs).
- **AR-V4 Resize, reflow and zoom.**
  1. At 200% browser zoom, and at a 200% browser text size, nothing is lost: no content is
     clipped, truncated or covered, and every function stays reachable (SC 1.4.4).
  2. At 320 CSS px wide, nothing scrolls sideways, and rows, chips, cards, breakdowns and
     dialogs wrap (SC 1.4.10). The one permitted truncation is #13's pinned log line, because the
     whole entry is one tap away.
  3. Text-spacing overrides (line height 1.5, paragraph spacing 2, letter spacing 0.12, word
     spacing 0.16, all in em) clip nothing (SC 1.4.12).
  4. **Short viewports** (designer, 2026-11-21: fixed in the MVP). At **640 × 360 CSS px**,
     which is a 1280 × 720 window at 200% zoom, and at any viewport at least that wide and that
     tall, every function stays reachable. The pinned zones (header, pinned log line and tab bar,
     with no notice showing) take at most **half** the viewport height. #13 meets it by folding the pinned zones at 640 px wide or more and below 600 px tall: the store chips become one row that scrolls sideways inside itself, the running line takes one line and the pinned log line hides, with rule 32's divergence stated (#13 Layout Zones, Short viewports). This
     closes #13 Open Questions 12 for the MVP down to 360 px of height. Below that is #17's.
- **AR-V5 The greyscale rule** (replaces the template's colour-blind modes; designer,
  2026-11-21).
  - Hue means the circulating method and nothing else. After the commit, only that method's
    tint is on screen (#14 MK6).
  - Every state, verb and identity reads under a greyscale filter, by glyph silhouette and by a
    word or a text alternative. That covers the method, circulating or not, which value a method
    changes and how, a closed route, every row state, a full store, each door tier, ×2, the heap
    state, and held or not held.
  - No red, green, amber or other warning hue is used, for direction, danger or anything else.
    Urgency is carried by words and by a role (Platform Accessibility API Integration).
  - Every new glyph (#15, the art bible, later realms) differs in silhouette from every existing
    glyph. #13 AC-13-34 and #14 AC-14-04 and AC-14-15 test this.
- **AR-V6 Motion and flashing.**
  - Nothing flashes or blinks, at any rate (SC 2.3.1).
  - No animation lasts longer than **400 ms**, and none repeats or loops.
  - Under `prefers-reduced-motion: reduce`, every decorative animation is removed, and the
    state appears in its final form in the frame it changes. Today that means #13's commit
    sweep and sheet slide, and #14's underline draw-in.
  - Animation never delays a value and never blocks input.
  - **Progress bars keep moving under reduced motion** (#13's decision, kept). A bar moves only
    while an activity the player started is running, its value is also given as a countdown in
    text, and one tap on Stop ends it. This document reads it as essential under SC 2.2.2 (Open
    Questions).
- **AR-V7 Forced colours: not committed** (designer, 2026-11-21). A screen that supports
  `forced-colors: active` follows #14's rule: glyphs, notches and underlines draw in
  `CanvasText`, and the glyph carries the identity once the tint is gone. No gate checks it
  (Known Intentional Limitations).

| Feature | Target Tier | Scope | Status | Implementation Notes |
|---------|-------------|-------|--------|---------------------|
| Text contrast, 4.5:1 and 3:1 (AR-V1) | Basic | All text on every surface | Specified: #13 Accessibility (stone base only); #14 Accessibility | #13 states it against the stone base only. It must name every surface (Changes needed in existing specs). Final values are the art bible's, which must keep these ratios |
| Non-text contrast, 3:1 (AR-V2) | Standard | Glyphs, notches, underlines, bars, control edges, focus ring | Specified: #13 Accessibility; #14 Accessibility, tint tokens | The tint never colours text below 4.5:1 |
| Text size floors (AR-V3) | Standard | All text | Specified: #13 Accessibility; #14 Accessibility | Sizes in rem. The browser's text size is the adjustment, with no in-game slider (Tier Definition) |
| Resize text to 200% (AR-V4.1) | Standard | All screens | Specified: #13 Layout Zones, Short viewports; AC-13-38 | The pinned zones fold at 640 px wide or more and below 600 px tall, so they keep to half the height |
| Reflow at 320 px (AR-V4.2) | Standard | All screens | Specified: #13 AC-13-07; #14 Accessibility, "Size and reflow" (AC-14-20 tests 390 px and 200% text zoom) | Wrap, never truncate. Only the pinned log line may end in an ellipsis |
| Text spacing (AR-V4.3) | Standard | All screens | Specified: #13 Accessibility | #14 relies on wrapping; covered by the axe and manual checks (Accessibility Test Plan) |
| Greyscale rule (AR-V5) | Standard (in place of colour-blind modes) | All coloured elements | Specified: #13 AC-13-34; #14 AC-14-04, AC-14-05 | Audit below |
| Colour-blind modes (protanopia, deuteranopia, tritanopia) | Standard | — | **Diverged**: replaced by AR-V5 | After the commit one hue is on screen, so there is no pair of hues to confuse |
| No flashing (AR-V6) | Basic | All screens | Specified: #13 Transitions; #14 Transitions | Nothing flashes; no photosensitivity warning screen is needed |
| Reduced motion (AR-V6) | Comprehensive | Every decorative animation | Specified: #13 AC-13-35; #14 AC-14-14 | OS preference only. Progress bars keep moving |
| High contrast / forced colours (AR-V7) | Exemplary | — | Out of scope | #14 supports it for its marks |
| UI scaling | Standard | All screens | Met by browser zoom (AR-V4) | No in-game scale |
| Brightness and gamma, subtitles | Basic / Standard | — | Not applicable | No rendered scene, no audio |

### Color-as-Only-Indicator Audit

Every element that uses colour, and what carries its meaning without it. Under AR-V5, colour is
never the only carrier, so each row records the backup rather than a fix.

| Location | Color Signal | What It Communicates | Non-Color Backup | Status |
|----------|-------------|---------------------|-----------------|--------|
| Method chip (#13 C3) | The method's tint | Which method circulates | The method's solid glyph (silhouette class, #14 MK2) and its name | Specified |
| Method mark on a changed value (#14 MK1–MK3) | Tinted solid glyph | This value is changed by the circulating method | The glyph's presence, its notch for the verb (feeds, quenches, opens), and visually hidden words ("Cinder 35, Ember Breath feeds") | Specified |
| Solid against hollow glyph (#14 MK4) | Tint against ink | Circulating, or only referred to | Solid against hollow form | Specified |
| Channel underline (#14) | Tint | Which numbers are marked | The underline's presence (a shape), plus the mark | Specified |
| Shell tint and commit sweep (#13 Transitions) | Tint along the channel lines | Decoration: the method moving through the interface | Nothing to back up; the method chip carries the identity | Specified |
| Method-choice view and commit dialog, before the commit (#15) | #15's accent, if any (#14 Open Questions 12) | Each method's identity before choosing | The method's glyph and name | **Open**: #15 not written |
| Progress bars (#13 C5, C11) | Fill colour (art bible) | How far the unit has run | The bar's length and the countdown text | Specified |
| Disabled heap toggle before the commit (#13 C11a) | Lowered contrast | Cannot be used yet | The visible reason "Needs a method committed" and the native disabled state | Specified |
| Notice strip (#13 C6) | Background (art bible) | A save problem, an error, an update | Words, and the `alert` or `status` role; no warning hue (AR-V5) | Specified |

States that use no colour at all: every source row state, a full store, each door tier (○○ ●○
●●), held breath's ×2, the heap state, and key items held or not held. Each is a glyph and a word
(#13 C1, C5, C7, C11; AC-13-34).

---

## Motor Accessibility

The game asks for almost nothing motor. Pillar 4 is the reason. There is no execution skill and
no reward for watching. Every action is one discrete input that can be made at any moment,
because nothing is lost by waiting (#13 Interaction Map; #10 D2.4). What remains is a web page's
motor surface: reaching targets, keyboard operation, focus, and touch on a phone.

**Requirements**

- **AR-M1 One discrete input per action.**
  - No action is held, repeated, timed, windowed, chorded, double-tapped or dragged (SC 2.5.7).
  - Nothing needs a path or a multipoint gesture (SC 2.5.1).
  - Controls act on release, so moving the pointer off a target cancels the action (SC 2.5.2).
  - Nothing reads device motion (SC 2.5.4).
  - A long press acts as a tap, and right-click keeps the browser's default.
- **AR-M2 Keyboard alone.**
  - Every function works from the keyboard (SC 2.1.1).
  - The keys are the platform's own: Tab, Shift+Tab, Enter, Space, Esc and the arrow keys.
  - No single-character shortcut exists (SC 2.1.4). If Accessibility and settings (#18) adds a
    shortcut set, each shortcut can be turned off or remapped.
  - Esc always leaves a dialog, sheet or card, so focus containment is never a trap (SC 2.1.2).
- **AR-M3 Focus.**
  - Focus is always visible, as #13's 2 px ring at 3:1 against both colours beside it. It is
    never removed (SC 2.4.7).
  - Focus order follows reading order (SC 2.4.3), and a skip link comes first (SC 2.4.1).
  - Focus moves into an opened card, sheet or dialog, and returns to its trigger when it closes.
  - **Focus is never covered by the game's own content** (SC 2.4.11). On narrow widths, the
    pinned zones sit beside the scrolling content zone, never over it.
  - On wide widths, focus is **trapped in the anchored card**, as in the narrow sheet: Tab cycles
    inside it, and Esc or × closes it. A pointer click outside still closes it and acts on what it
    lands on. Focus therefore never reaches content the card covers (designer, 2026-11-21,
    pattern library PD5; this replaces the focus-out close first chosen here).
- **AR-M4 Target size.**
  - With a coarse pointer, every target is at least **44 × 44 CSS px**.
  - With a fine pointer, every target is at least 32 × 32 CSS px, and 44 × 44 is preferred.
  - Both are above WCAG 2.2's 24 × 24 floor (SC 2.5.8).
  - Full-width lines (#14's part and back lines) are at least 44 px tall.
  - Targets never overlap.
- **AR-M5 Any input, at any moment.**
  - Mouse, keyboard and touch can be mixed freely, with no mode to switch.
  - Nothing is hover-only (concept, MVP required item 8). Nothing opens on hover or on focus,
    so SC 1.4.13 has nothing to govern.
  - Labels that show text start the control's accessible name with that text, so speech input
    can name them (SC 2.5.3).
- **AR-M6 Orientation.** Neither orientation is locked (SC 1.3.4). A phone in landscape falls
  under AR-V4's short-viewport rule down to 360 px of height.

**Hold inputs in this game:** none. **Rapid or timed inputs:** none.

| Feature | Target Tier | Scope | Status | Implementation Notes |
|---------|-------------|-------|--------|---------------------|
| Full input remapping | Standard | — | Not applicable | The game binds no keys of its own (AR-M2). A future shortcut set must be remappable or able to be turned off |
| Input method switching | Standard | All screens | Specified: #13 Interaction Map | No modes. Hover adds a pointer cursor and an underline, never content |
| One-hand mode | None (no tier names it) | Phone portrait | **Out of scope for the MVP** | Stop (#13 Open Questions 11) and the back line (#14 Open Questions 6) sit at the top of a tall phone. Phone layout (#17) takes this at the Vertical Slice (Known Intentional Limitations) |
| Hold-to-press alternatives | Standard | — | Not applicable | No hold inputs |
| Rapid input alternatives | Standard | — | Not applicable | No rapid inputs |
| Input timing adjustments | Standard | — | Not applicable | No timed inputs: no quick-time events, windows or rhythm |
| Aim assist, movement and traversal assists | Standard | — | Not applicable | No aiming, movement or platforming |
| Keyboard operation and focus (AR-M2, AR-M3) | Standard (WCAG AA) | All screens | Specified: #13 Input Method Completeness Checklist and C16; #14 Interaction Map | Both forms of the card trap focus (PD5) |
| Target size (AR-M4) | Standard (WCAG AA) | All targets | Specified: #13 AC-13-33; #14 AC-14-19 | — |
| HUD element repositioning | Comprehensive | — | **Out of scope** | Known Intentional Limitations |

---

## Cognitive Accessibility

The game's challenge is cognitive by design: pillar 3, "the build is a problem". This section
does not make the problem easier. It removes every cognitive cost that is not the problem:
timing, remembering, guessing what a control does, decoding jargon, and finding out why
something cannot run. Pillar 4's "no attention tax" carries most of it already.

**Requirements**

- **AR-C1 No time pressure.**
  - Nothing asks for a response within a time limit (SC 2.2.1). No dialog times out.
  - Nothing that carries information dismisses itself. Notices stay until they are dismissed or
    their cause ends (#13 C6; rule 68).
  - The game waits for the player. An activity stops by itself when it cannot continue, and
    away time keeps running while the tab is closed (#4; pillar 4).
- **AR-C2 The goal and the next step are always shown.**
  - The goal line is always on screen. Before the commit, three instruction lines say what the
    game asks. After the commit, a next-step line remains, and the first two lines stay in the
    Goal card, one tap away (#13 C1, C2).
  - No instruction is shown once and lost.
- **AR-C3 Reasons before action.** Every source shows, before any tap, whether it can run now
  and, if not, why, in words (#4 UI Requirements; #13 C11). A refused action changes nothing and
  never leaves the player guessing.
- **AR-C4 One form for each kind of thing.**
  - There is one detail container, with one field order for every record (rule 33; #13 C16).
  - There is one breakdown form: Base, changes, Total (#14).
  - There is one set of verbs: feeds, quenches, opens.
  - Controls and labels that do the same thing are named the same way everywhere (SC 3.2.3,
    3.2.4).
  - Focusing a control or changing a toggle never opens, moves or switches anything else
    (SC 3.2.1, 3.2.2).
- **AR-C5 Plain words.**
  - Copy uses the player's words. The designer terms "total", "effective value", "score",
    "patch", "triple", "change set" and "frozen set" never appear on screen (#6 UI
    Requirements 8; #7 UI Requirements 7).
  - Every number on screen comes from a field and can be explained in its card (#1 R7.2; #14).
  - The `writer` reviews the copy (#13 AC-13-36).
- **AR-C6 Confirm what clears progress, and say what it clears.**
  - The commit, the forge, a new run and loading a save each open a dialog. The dialog names
    what the action closes or clears, and how to redo it (#7 Y2; #6 G8.2; #11 UI Requirements
    4 and 6; SC 3.3.4).
  - A refused save says what was found, in words (SC 3.3.1, 3.3.3).
- **AR-C7 Cognitive load is documented per system.** This is a Comprehensive item. The
  Per-Feature Accessibility Matrix records, for each system, how many things it asks the player
  to hold in mind to make one decision. Any count above four is flagged and must name the
  interface that carries the load instead of memory.

| Feature | Target Tier | Scope | Status | Implementation Notes |
|---------|-------------|-------|--------|---------------------|
| Difficulty options | Standard | — | Not applicable, by design | No execution difficulty. Fights resolve from stats with an exact preview (#5). Pillar 4 keeps a fightless source for every ingredient, so no fight is required. The build problem (pillar 3) is the game, and no setting removes it |
| Pause anywhere | Basic | All states | Met by design | Nothing needs a pause: no state worsens while the player is away or idle. Closing the tab is safe (#11 save, #4 away time) |
| Tutorial persistence | Standard | Instruction lines | Specified: #13 C2 | Lines 1 and 2 move to the Goal card, and the next-step line stays on screen |
| Quest / objective clarity | Standard | Goal line | Specified: #13 C1, AC-13-01 | The goal is on screen at all times, with no press needed |
| Visual indicators for audio-only information | Standard | — | Not applicable | No audio (Auditory Accessibility) |
| Reading time for UI | Standard | Notices, dialogs, log | Specified: #13 Transitions ("no timed dismissal") | No element auto-dismisses |
| Cognitive load documentation (AR-C7) | Comprehensive | Every system | Recorded in the Per-Feature Accessibility Matrix | Review trigger at more than four |
| Navigation assists | Standard | The road | Specified: #13 C10–C13; #7 UI Requirements 5 | No world to travel. Every source is listed from the run start, grouped by line, and each ingredient's card names its sources by route family |

---

## Auditory Accessibility

**The MVP has no audio.** The concept sets Audio Needs to Minimal, and the systems index gives
audio no system until the art bible asks for one. Every event the game has is already a line in
the log, the one event channel (#13 C14; rules 68, 99), and every state is shown on screen. So
nothing is delivered by sound, and nothing needs a caption. There is no video and no voice, so
WCAG's time-based media criteria (SC 1.2.x) have nothing to apply to.

**AR-A1 When audio arrives**, it must meet the committed tier before it ships:
1. **No sound is the only carrier of anything.** Every sound accompanies a log line or a visible
   change of state (Comprehensive: visual indicators for gameplay-critical audio).
2. **Independent volume controls**, one per bus, and a mute (Basic).
3. **A mono option** if any sound is stereo or spatial (Comprehensive).
4. **No sound plays for more than 3 seconds without a control** to pause, stop or lower it (SC
   1.4.2).
5. **The SFX audit below gains one row per sound**, before that sound's story is accepted.

| Feature | Target Tier | Scope | Status | Implementation Notes |
|---------|-------------|-------|--------|---------------------|
| Subtitles for all spoken dialogue | Basic | — | Not applicable | No voice |
| Closed captions for gameplay-critical SFX | Comprehensive | — | Not applicable | No sound. AR-A1.1 makes captions unnecessary when sound arrives |
| Mono audio option | Comprehensive | — | Not applicable until audio arrives | AR-A1.3 |
| Independent volume controls | Basic | — | Not applicable until audio arrives | AR-A1.2 |
| Visual representations for directional audio | Comprehensive | — | Not applicable | No space, no direction |
| Hearing aid compatibility | Standard | — | Not applicable | No sound |

### Gameplay-Critical SFX Audit

| Sound Effect | What It Communicates | Visual Backup | Caption Required | Status |
|-------------|---------------------|--------------|-----------------|--------|
| None: the MVP plays no sound | — | Every event is a log line (#13 C14) | No | Not applicable |

---

## Platform Accessibility API Integration

The game's platform is the browser, so its accessibility API is the browser's accessibility
tree, built from the page's HTML and ARIA. A screen reader, speech input, switch access and the
browser's own zoom and text size all read that tree, on every OS. No engine layer stands in
between. What the game must do is emit a correct tree and honour the OS preferences the browser
passes on.

**Requirements**

- **AR-P1 Native elements first.**
  - Use native HTML elements: buttons, a native switch for the heap toggle (#10 UI Requirements
    5), lists, headings and dialogs.
  - Use ARIA only where HTML has no element: the `log` role and the tab list.
  - The page declares its language (`lang`, SC 3.1.1), and its title names the game (SC 2.4.2).
- **AR-P2 Names, roles and states** (SC 1.1.1, 4.1.2).
  - Every control has a name, a role and its state.
  - Every glyph is hidden from assistive technology whenever visible or visually hidden words
    carry its meaning. A mark reads as part of its number's phrase (#14 Accessibility).
  - A store's bar is hidden from assistive technology, because its text carries the value. The
    running line's bar is a `progressbar` that updates once per unit, not once per frame (#13
    Accessibility).
- **AR-P3 Structure** (SC 1.3.1, 2.4.1, 2.4.6).
  - Landmarks: the goal band is `banner`, the store column is `complementary` "Stores", the
    centre is `main`, and the log is `log` (#13 Accessibility).
  - Anything that looks like a heading is a heading: the road's group headings (#13 C10), each
    card's title, each dialog's title and each session screen's text. A reader can then move
    through the road by its six groups instead of through 23 rows.
- **AR-P4 Status messages** (SC 4.1.3). Every message that reports the result of an action, a
  wait or an error reaches the screen reader without moving focus:

  | Message | Role |
  |---|---|
  | New log entries (additions only, so a merged entry is not announced again) | `log`, `aria-live="polite"` (#13) |
  | "Not saving", "This browser is not keeping your save" | `alert` (#11 UI Requirements 8; #13) |
  | The load notice | `status` (#11 UI Requirements 8; #13) |
  | "Copied", "Working…", "Loading…", Load save's "This text is too long to be a save." and "This is not a save." | `status` |
  | "Could not start a new run", "Could not load this save", "Something went wrong, and nothing changed." | `alert` |

  The running line is not live, because it changes every frame. Its stop reasons reach the
  reader through the log (#13).
- **AR-P5 Session screens take focus.** When a session screen replaces the shell (Loading,
  Elsewhere, Superseded, Refused, Content error, No lock support; #13 C18), focus moves to its
  heading, so the screen reader announces what happened.
- **AR-P6 OS preferences are honoured:**
  - the browser's text size and zoom (AR-V3, AR-V4);
  - `prefers-reduced-motion` (AR-V6).

  Forced colours are not committed (AR-V7).
- **AR-P7 The tested scope.** Comprehensive's "screen reader support for menus" means, here
  (designer, 2026-11-21):
  - #13's menu (C4);
  - every dialog in #13's container (C17), including #15's commit dialog and forge confirmation;
  - the session screens (C18);
  - the notice strip (C6).

  Play screens (the road, stores, log, cards and the forge view) must meet AR-P1 to AR-P4. They
  are checked by axe and by keyboard, but no screen-reader play-through of them is committed
  (Known Intentional Limitations).

| Platform | API / Standard | Features Planned | Status | Notes |
|----------|---------------|-----------------|--------|-------|
| Windows, desktop browser | Browser accessibility tree (UIA / IA2) → **NVDA with Chrome** | AR-P1 to AR-P7; the menus journey tested end to end | Specified: #13 Accessibility; #14 Accessibility | Tested pair (designer, 2026-11-21). JAWS and Narrator read the same tree and are not tested |
| iOS, phone browser | Browser accessibility tree → **VoiceOver with Safari** | AR-P1 to AR-P7 at 390 px with touch | Specified: #13 Accessibility; #14 Accessibility | Tested pair (designer, 2026-11-21) |
| macOS, desktop browser | VoiceOver with Safari | Same tree | Not tested | Not in the MVP test matrix |
| Android, phone browser | TalkBack with Chrome | Same tree | Not tested | Not in the MVP test matrix |
| Speech input (Voice Control, Voice Access, Dragon) | Accessible names | Label in name (AR-M5) | Partly checked | #13's store names and #14's part lines start with their visible text. The heap toggle shows "Level" or "Heaped" but is named "Heap {source}" (Open Questions). Not tested separately |
| Browser display preferences | CSS media features, rem sizing | Text size, zoom, `prefers-reduced-motion` | Specified: #13 Platform and preference variants | `forced-colors` not committed |
| Xbox (GDK), PlayStation 5, Steam | XAG, Sony guidelines, Steam Input | — | Not applicable | No console or store build |
| iOS / Android native | UIAccessibility, AccessibilityService | — | Not applicable | No native app |

---

## Per-Feature Accessibility Matrix

One row per system in `design/gdd/systems-index.md`. When a system is added there, a row is
added here. **Load** is AR-C7's count: how many things the system asks the player to hold in mind
to make one decision. A count above four is flagged ⚑, and the row names the interface that
carries the load instead.

The Addressed column:
- **Yes**: the system's requirements meet the tier.
- **Pending (#n)**: the requirement is fixed in a GDD or here, and spec #n, not yet written,
  must show it. Pending is assigned, not unaddressed, so it does not block a GDD's Approved
  status.
- **Change needed**: an existing spec falls short (Changes needed in existing specs).
- **Not started**: the system is not designed.

| System | Visual Concerns | Motor Concerns | Cognitive Concerns | Auditory Concerns | Addressed | Notes |
|--------|----------------|---------------|-------------------|------------------|-----------|-------|
| 1 Content records and schema | Names must fit phone-width lines (24 code points, R4) | None: no screen | Need text is generated in one form, with the shortfall (R5.5). Every number comes from a field (R7.2). Render by field (rule 33). Load: none (no decision) | None | Yes | Its content-error screen is a session screen (AR-P5) |
| 2 Modifier pipeline and recompute | None: no screen | None | Breakdowns name each step by its source's name, and a clamp reads as a limit (UI Requirements). Load: none | None | Yes | Shown through #14 |
| 3 Resources and caps | Eight stores, held / cap, at the 13 px secondary floor on narrow chips. Full is a glyph and a word, never a hue | Store chips are targets: 44 px with a coarse pointer | All eight stores stay on screen (rule 32), so none is remembered. Load: 2 (the store a source fills, and its room) | None | Yes | The store chips are the likely fold for short viewports, which is #13's change S3 (AR-V4.4) |
| 4 Activity slot, rest and away time | The progress bar moves every frame and is treated as essential (AR-V6). ×2 is a glyph and a word | One tap to Start or Stop. Stop sits out of thumb reach on a tall phone (out of scope for the MVP) | One slot: what runs, when it stops, the breath held, all on the running line. The away summary goes to the log. Load: 3, all on screen | No sound on a stop (#4 Visual/Audio) | Yes | Known limitation: one-handed reach (#17) |
| 5 Combat resolver | The result in words (won or lost), and the Life kept (UI Requirements 1). #9 and #13 add its base | None: fights resolve without play (C9) | The result is previewed exactly, so there is no risk to judge. Load: 2 (the verdict, the Life kept) | None | Yes | Four stats per side are in the breakdown, on tap |
| 6 Forge and proving | Dense plan figures at 390 px. The tier glyphs ○○ ●○ ●● are not hue | Choosing four of six by discrete taps; confirm in a dialog | ⚑ Four of six ingredients, 15 makeups, three doors each. Carried instead by the list of previewable makeups with their seals (UI Requirements 3), the headroom signal (UI Requirements 4) and breakdowns on tap. Load: more than 4 by design (pillar 3) | None | Pending (#15) | The confirmation is in the tested scope (AR-P7) |
| 7 Methods | The tint plus the glyph is the identity, and only one hue shows after the commit (AR-V5) | The commit is one confirmed action | ⚑ Two methods, each feeding, quenching, opening and closing several things. Carried by both methods side by side from the first screen, each change named and marked (UI Requirements 1), the dialog's "Feeds:" and "Quenches:" lines, and the redo line. Choosing costs nothing until the commit. Load: more than 4 | None | Yes for the marks (#14). Pending (#15) for the choice view and the commit dialog | The commit dialog is in the tested scope (AR-P7) |
| 8 Crafting route | Bills have at most two inputs and fit 390 px (UI Requirements 6) | Start only when it can run | Planning backwards from an ingredient to its recipe is carried by the forge screen, which names each unheld ingredient's recipe and its time (UI Requirements 4). Load: 3 (a bill's inputs and the amounts held) | None | Yes (#13). Pending (#15) for the plan-to-road names | — |
| 9 Fight and dungeon routes | Seven row states, each with its own glyph and words. The Still Deep is one block with a rail | Start only in Ready | State before action (UI Requirements 2). The result is exact. Load: 3 (the verdict, the Life kept, the bill) | None | Yes | AC-13-09 checks the longest names at 390 px |
| 10 Tending | The heap state is a word ("Level", "Heaped"), never a colour | A native switch, keyboard-operable, 44 px (UI Requirements 5) | Untended and heaped yields side by side, with no recommendation. Load: 2 | None | Yes | Label-in-name check for the toggle (Open Questions) |
| 11 Save and run lifecycle | Text screens and notices | Copy save falls back to selected text when the clipboard is refused | Confirmations name what they clear. Refusals say what was found, in words. Load: 2 (the run kept, the run replaced) | None | Change needed (#13) | UI Requirements 8 asks for status and alert roles. #13 has not yet added them all, or session-screen focus (S6, S7; AR-P4, AR-P5) |
| 12 Content validator and balance enumeration | None: no player-facing output | None | None | None | Yes (not applicable) | — |
| 13 Interface shell and goal line | Contrast on every surface; short viewports at 200% zoom | Focus trapped in the wide card (PD5) | The goal line and next-step line are always shown. Load: 1 (the next step) | None | Specified | S1–S3 and S5–S7 applied 2026-11-21; S4 superseded by PD5 |
| 14 Method marks and number breakdowns | Greyscale identity; tint tokens are for graphics only | Part and back lines at 44 px | One breakdown form. Drill chains reach six levels, and each back line names where it returns. Load: 2 per level | None | Specified | K1 and K2 applied 2026-11-21; K3 superseded by PD5 |
| 15 Forge screen | Must meet AR-V1 to AR-V6. It owes the pre-commit accent with glyphs, and affinity and tier glyphs distinct from #14's | Must meet AR-M1 to AR-M6 | Carries #6's and #7's flagged loads | None | Not started | Its dialogs are in the tested scope (AR-P7) |
| 16 Reforge and post-commit method switch | — | — | A redo must name what it changes and its price, as the commit does (AR-C6) | — | Not started | Vertical Slice |
| 17 Phone layout | Short viewports below 360 px of height | One-handed reach for Stop and the back line | — | — | Not started | Owns two out-of-scope items (Known Intentional Limitations) |
| 18 Accessibility and settings | Decides on in-game overrides for text size, motion and contrast | Any shortcut set must be remappable or able to be turned off (AR-M2) | Plans user testing (Open Questions) | Owns audio controls if audio arrives (AR-A1) | Not started | This document is its input |
| 19 Realm ladder | New glyphs differ in silhouette from all others (AR-V5). The concept caps methods at six | — | More realms and ingredients raise the forge's load; re-count at its GDD | — | Not started | Alpha |
| 20 In-game codex | Reading-heavy: headings, reflow, text floors | — | Plain words (AR-C5) | — | Not started | Full Vision |

---

## Changes needed in existing specs

Where #13 or #14 fell short of this commitment or contradicted it. **Applied at merge on
2026-11-21**, except S4 and K3: the designer chose pattern PD5 instead, so the wide card traps focus.
The coordinating session applies each change at merge, with the designer's approval. Line numbers
are as of commit 5e5deb8. A new acceptance criterion takes the spec's next free number.

### `design/ux/interface-shell.md` (#13)

| # | Where (line) | Requirement | Change |
|---|---|---|---|
| S1 | Accessibility, 1058; Requirement Trace cross-reference check, 1389; Open Questions 2, 1411 | Tier Definition | Replace "**Tier: not yet defined** (Open Questions 2)" with "**Tier: Comprehensive, against WCAG 2.2 AA** (`design/accessibility-requirements.md`)". At 1389, replace "the tier is undefined (Open Questions 2)" with "the tier is Comprehensive; the changes that document lists for this spec apply". Mark Open Questions 2 answered |
| S2 | Accessibility, "Contrast and text", 1088; C3 Method chip, 364 | AR-V1, AR-V2 | At 1088, replace "Text keeps at least 4.5:1 against the stone base" with "Text keeps at least 4.5:1 against every surface it sits on: the stone base, a card, the sheet, a chip, the notice strip and a dialog". At 364, add: "The name is in ink; a tint colours text only where it keeps 4.5:1" |
| S3 | Layout Zones, height budget, 277; Platform and preference variants, Zoomed, 821; Open Questions 12, 1421 | AR-V4.4 | Add to the height budget: "At 640 × 360 CSS px (a 1280 × 720 window at 200% zoom), and at any larger viewport, every function stays reachable and the pinned zones, with no notice, take at most half the height." At 821, add "short viewports follow the height budget". Answer Open Questions 12 for viewports down to 360 px tall in the MVP (the designer chose the MVP, 2026-11-21). Below 360 px stays with #17. #13 designs how, for example by folding the store chips into one scrolling row at short heights, which needs a ruling on rule 32. New AC: "At 640 × 360 CSS px after the commit, with no notice, the pinned zones take at most 180 px of height, and the tester reaches and uses Start, Stop, the heap toggle, a card and the menu" |
| S4 | C16 "Closing", 523; Input Method Completeness Checklist, 1037; AC-13-17, 1211 | AR-M3 (SC 2.4.11) | **Superseded by PD5; not applied.** Add to C16 Closing: "Wide: when focus moves outside the card, the card closes and focus stays where it moved, as with a click outside." At 1037, append "; on wide widths the card closes when focus leaves it". Extend AC-13-17: "With the keyboard, Tab from the wide card's last line closes it, and the newly focused element is not covered" |
| S5 | Component Inventory C10, 300; Accessibility, screen-reader table, 1076–1086 | AR-P3 | Change C10's type from "Text" to "Heading" (one level below the centre's view). Add a screen-reader table row: "Group heading: a heading; card, dialog and session-screen titles are headings too" |
| S6 | Accessibility, screen-reader table, Notice strip row, 1083, and a new row after it | AR-P4 | Add to the Notice strip row: "The internal-error notice is `alert`." Add a row "Messages": "'Copied', 'Working…', 'Loading…', 'This text is too long to be a save.' and 'This is not a save.' are `status`; 'Could not start a new run' and 'Could not load this save' are `alert`." New AC: "A screen reader announces 'Copied', 'Working…' and a Load save refusal without focus moving" |
| S7 | C18 Session screens, 575 | AR-P5 | Add: "On display, focus moves to the screen's text, which is its heading." Add a screen-reader table row for session screens |

### `design/ux/method-marks.md` (#14)

| # | Where (line) | Requirement | Change |
|---|---|---|---|
| K1 | Accessibility, 873–876; Open Questions 3, 1089; cross-reference check, 1112 | Tier Definition | Replace "No accessibility tier is committed yet … It **assumes WCAG 2.2 AA as the baseline** until a tier is chosen (Open Questions 3)" with "The committed tier is Comprehensive, against WCAG 2.2 AA (`design/accessibility-requirements.md`). This spec meets it." Mark Open Questions 3 answered. At 1112, replace "No tier is committed. This spec assumes WCAG 2.2 AA (Open Questions 3)" with "The tier is Comprehensive, WCAG 2.2 AA" |
| K2 | Accessibility, tint token table, 896–900 | AR-V2 | Add under the table: "Tint tokens colour glyphs, notches and underlines only. The light Ember Breath token (4.35:1) may never colour text." |
| K3 | Input Method Completeness Checklist, 848 | AR-M3 | **Superseded by PD5; not applied.** Append: "On wide widths the card closes when focus leaves it (#13 C16)" |

**No change needed:**
- #14's forced-colours rules and AC-14-22 exceed the tier and stay as they are (AR-V7).
- #13 Open Questions 11 and #14 Open Questions 6 (one-handed reach) already defer to #17, which
  matches the out-of-scope decision.
- Both specs' 400 ms motion bound, reduced-motion behaviour, target sizes, text floors and
  greyscale tests already match AR-V3, AR-V5, AR-V6 and AR-M4.

---

## Accessibility Test Plan

Three kinds of test:
- **Automated** checks run on every `bun run smoke`.
- **Manual** checks run at each gate's self-audit.
- **User testing** with disabled players is not planned for the MVP. Accessibility and settings
  (#18) plans it at the Vertical Slice (designer, 2026-11-21).

The per-spec acceptance criteria named below are the test cases. This plan says how they run.

**The automated check must be able to fail visibly** (`.claude/rules/skill-authoring.md`):
- If axe-core cannot load, or a viewport or phase in the matrix is skipped, the smoke run
  **fails**. It never passes having checked nothing.
- The run reports the count of pages checked, and that count must equal the matrix.
- When the check is first wired in, one known violation is injected and the run is seen to fail,
  then the injection is removed.

| Feature | Test Method | Test Cases | Pass Criteria | Responsible | Status |
|---------|------------|------------|--------------|-------------|--------|
| WCAG 2.2 A and AA, machine-detectable | **Automated: axe-core in `bun run smoke`** (a dev-only dependency beside playwright; designer, 2026-11-21), rule tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` | Viewports 1440 × 900, 640 × 360, 390 × 844 and 320 × 568. In each: Choosing, Committed and Forged, then a card open, a drilled card, the menu, and each dialog | Zero violations. The count of pages checked equals the matrix | qa-tester | Not Started |
| Text contrast (AR-V1) | Automated (axe), plus a token check on the art bible's final palette | Every text colour on every surface, light and dark if both ship | All text at least 4.5:1, large text at least 3:1 | ux-designer | Not Started |
| Non-text contrast (AR-V2) | Automated token check (#14 AC-14-21), plus manual check of bars, control edges and the focus ring, which axe does not measure | Every glyph, notch, underline, bar, control edge and focus ring against its neighbours | At least 3:1 | ux-designer | Not Started |
| Greyscale rule (AR-V5) | Manual, under a greyscale filter | #13 AC-13-34; #14 AC-14-04 (ten shuffled screenshots) | As the criteria state | ux-designer | Not Started |
| Reflow and short viewports (AR-V4) | Automated in smoke: no sideways scroll at 320 px; pinned-zone height measured at 640 × 360. Manual: 200% browser text size, and text-spacing overrides | #13 AC-13-07; #14 AC-14-20, plus a 320 px pass for #14's reflow rule; #13's new short-viewport criterion (change S3) | No sideways scroll. Pinned zones at most 180 px at 640 × 360. Nothing clipped | qa-tester | Not Started |
| Keyboard and focus (AR-M2, AR-M3) | Manual, keyboard alone | #13 AC-13-32, AC-13-17 (focus trapped in the wide card, PD5); #14 AC-14-12, AC-14-19 | Every function reached and used. Focus always visible and never covered. Esc always leaves | qa-tester | Not Started |
| Target size (AR-M4) | Automated in smoke: bounding boxes of every interactive element, with touch emulation and without | #13 AC-13-33; #14 AC-14-19 | At least 44 × 44 with a coarse pointer, at least 32 × 32 with a fine one | qa-tester | Not Started |
| Nothing hover-only (AR-M5) | Manual | #13 AC-13-17 (hover 3 s opens nothing) | As the criterion states | qa-tester | Not Started |
| Reduced motion (AR-V6) | Automated in smoke: `prefers-reduced-motion: reduce` emulated; no transition or animation runs at the commit or on the sheet | #13 AC-13-35; #14 AC-14-14 | No sweep, no draw-in, no slide. Every state is final in its frame | qa-tester | Not Started |
| Screen reader, menus journey (AR-P4, AR-P5, AR-P7) | Manual, with **NVDA and Chrome on Windows**, and **VoiceOver and Safari on iOS** at 390 px (designer, 2026-11-21) | The menu; New run, Copy save and Load save, including both refusals and the confirm; #15's commit dialog and forge confirmation; the Elsewhere, Superseded and Refused screens; each notice | Every control is announced with its name, role and state. Status messages are announced without focus moving. Focus lands on each dialog's and screen's heading, and returns to the trigger on close | ux-designer | Not Started |
| Names and roles on play screens (AR-P1 to AR-P3) | Automated (axe), plus a manual spot check with NVDA | The road's group headings, one source row in each state, a store, the log and the heap toggle | Names start with visible text; headings are headings; the log announces additions only | ux-designer | Not Started |
| Self-audit against this document | Manual walk of every AR requirement | The Pre-Production and Polish gates | Each requirement Met, or a named gap logged in Audit History | ux-designer, with accessibility-specialist | Not Started |
| User testing with disabled players | User testing | — | — | #18 (Vertical Slice) | Not planned for the MVP |

---

## Known Intentional Limitations

| Feature | Tier Required | Why Not Included | Risk / Impact | Mitigation |
|---------|--------------|-----------------|--------------|------------|
| HUD element repositioning | Comprehensive | The persistent context is one fixed band at the top (wide) or one pinned header (narrow), by rule 32. A movable frame would break the one layout that both widths share | Players who use head- or eye-tracking, or a magnifier, cannot move the goal line, running line or stores to where they look. Nothing sits in the periphery, which limits the harm | Browser zoom reflows everything into the narrow layout, and focus moves into whatever opens. Revisit with #17 and #18 at the Vertical Slice |
| A tested screen-reader play-through of the road, stores, cards and forge view | Comprehensive asks for menus only. Beyond that is the designer's choice (2026-11-21) | Kept at the tier baseline, with no elevations | The core loop is where a blind player spends the game. An untested reading order or phrasing there could make the game unplayable while the menus pass | AR-P1 to AR-P4 bind play screens. axe checks them on every smoke run, and #13 and #14 already define their names and phrases. #18 revisits with user testing at the Vertical Slice |
| Forced colours on every screen | Exemplary (high-contrast mode) | Kept at the tier baseline (designer, 2026-11-21) | Under Windows High Contrast, custom backgrounds, bars or the focus ring in #13 may lose their contrast. #14's marks are covered | Every state is a glyph and a word (AR-V5), so meaning survives when colour is lost. Revisit at #18 |
| One-handed reach on a tall phone | No tier names it | Stop and the drill-down back line sit at the top of a tall phone (#13 Open Questions 11, #14 Open Questions 6) | Players using one hand, or with a tremor, must shift their grip or use both hands | Nothing is timed, so reaching costs no outcome, and every target is at least 44 px. Phone layout (#17) at the Vertical Slice |
| A colour-blind mode | Standard (template) | Diverged: the greyscale rule (AR-V5) replaces it. Hue carries nothing the glyph does not | Low. A player with a colour-vision difference sees the tint as another hue, which loses no meaning | AR-V5's greyscale tests (#13 AC-13-34, #14 AC-14-04) |
| In-game settings for text size, motion and contrast | Standard and Comprehensive (the template assumes toggles) | The browser and the OS already supply each one (designer, 2026-11-21) | Players who do not know their browser's or OS's settings get the defaults | rem sizes, `prefers-reduced-motion` and zoom work with no setup. #18 reviews in-game overrides at the Vertical Slice |
| Viewports below 360 px tall | WCAG 2.2 AA (SC 1.4.4) at extreme sizes | AR-V4.4 covers 640 × 360 and up. Below that is #17's | A small phone in landscape may squeeze the content zone | Portrait works. #17 at the Vertical Slice |
| User testing with disabled players | Not a tier item; recommended by the template's test plan | Planned at the Vertical Slice (designer, 2026-11-21) | The requirements here rest on standards and reasoning, not on observed play | The self-audit at each gate; #18 plans user tests |

---

## Audit History

| Date | Auditor | Type | Scope | Findings Summary | Status |
|------|---------|------|-------|-----------------|--------|
| 2026-11-21 | `/ux-review` (lean) | Spec review | #13 Interface shell, #14 Method marks | Accessibility NOT ASSESSED: no tier was committed, and this document did not exist | Superseded by this document |
| 2026-11-21 | Designer + Claude (`/ux-design accessibility`) | Spec check against the committed tier (not an audit) | #13 and #14 | Ten changes: S1–S7 for #13 and K1–K3 for #14 (Changes needed in existing specs). Everything else in both specs meets the tier | Open: the coordinating session applies them at merge |
| Planned | Self-audit (ux-designer, with accessibility-specialist) | Internal review | Every AR requirement, at the Pre-Production gate | — | Not Started |
| Planned | Self-audit | Internal review | Every AR requirement on the built MVP, at the Polish gate | — | Not Started |

---

## External Resources

| Resource | URL | Relevance |
|----------|-----|-----------|
| WCAG 2.2 | https://www.w3.org/TR/WCAG22/ | The external standard this document targets (Level AA) |
| Understanding WCAG 2.2 | https://www.w3.org/WAI/WCAG22/Understanding/ | The intent and exceptions of each success criterion, including SC 2.2.2's "essential" (Open Questions) |
| WAI-ARIA Authoring Practices Guide | https://www.w3.org/WAI/ARIA/apg/ | Keyboard and role patterns for dialogs, tabs, switches and menus |
| axe-core | https://github.com/dequelabs/axe-core | The automated checker in `bun run smoke` |
| WebAIM Contrast Checker | https://webaim.org/resources/contrastchecker/ | Manual contrast checks on palette tokens |
| MDN: `prefers-reduced-motion` | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion | The OS preference AR-V6 follows |
| MDN: `forced-colors` | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors | The media feature behind AR-V7 (not committed) |
| NV Access (NVDA) | https://www.nvaccess.org/ | One of the two tested screen readers |
| Game Accessibility Guidelines | https://gameaccessibilityguidelines.com | Game-specific checklist by category and cost |
| AbleGamers Player Panel | https://ablegamers.org/player-panel/ | User testing with disabled players, for #18 at the Vertical Slice |
| Accessible Games Database | https://accessible.games | Examples of accessible game design decisions |
| Design rules 1–100 | `research/arcanum-reference/12-design-rules.md`, `research/hundred-days-reference/06-design-rules.md`, `research/magic-research-2-reference/08-design-rules.md` | Rules 32 (persistent context), 33 (one tooltip schema), 67 (phone width) and 68 (one event channel), cited above |

---

## Open Questions

| Question | Owner | Deadline | Resolution |
|----------|-------|----------|-----------|
| **SC 2.2.2 and the progress bar.** This document reads the running bar and the once-a-second countdowns and breath counter as essential, because they move only for an activity the player started, they are also given in text, and Stop ends them in one tap. Does the accessibility specialist agree? If not, the fallback is a bar that steps once a second under reduced motion | accessibility-specialist | `/ux-review` of #13 | Unresolved |
| **Label in name for the heap toggle** (SC 2.5.3). It shows "Level" or "Heaped" and is named "Heap {source}". Does a speech-input user's "click Heaped" reach it? | ux-designer, with `design/ux/interaction-patterns.md` | `/ux-review` of #13 | Unresolved |
| **How #13 meets AR-V4.4.** Folding the store chips into one scrolling row at short heights would hide some stores, which touches rule 32 (persistent context) | Designer, #13 | Before #13's UI stories | Unresolved: the requirement is fixed, the layout is not |
| **#15's accent before the commit.** Whatever colour the method-choice view and commit dialog use must follow AR-V5 and the colour audit | Forge screen (#15) | #15 UX spec | Unresolved |
| **The axe-core pin.** The version to pin, and where in `scripts/browser-smoke.ts` it runs | Technical Director | `/create-architecture` or `/test-setup` | Unresolved |
| **Stale input preferences.** `.claude/docs/technical-preferences.md` still says "Mouse with hover tooltips" and "ⓘ pins tooltips", which contradict AR-M5 (also #13 Open Questions 5, #14 Open Questions 4) | Technical Director | `/create-architecture` | Unresolved |
| **The pattern library cites this document.** `design/ux/interaction-patterns.md` (being written in a parallel session) should cite AR numbers for each pattern's bar rather than restate them | ux-designer | When both merge | Unresolved |
| **In-game overrides and user testing** at the Vertical Slice | Accessibility and settings (#18) | Vertical Slice | Deferred by the designer (2026-11-21) |

### Cross-reference check (`/ux-design` phase 5, 2026-11-21)

This document specs no screen, so the phase's navigation and empty-state checks have nothing to
check. They are reported as not applicable, not as passed.

| Check | Result |
|---|---|
| GDD requirement coverage | **All covered.** Every accessibility item in the 12 GDDs' UI Requirements maps to an AR requirement. #1: render by field, generated need text, text limits, numbers from fields and the content-error screen (AR-C3, AR-C4, AR-C5, AR-V4, AR-P5). #2: step names, and "limit" for a clamp (AR-C5). #3: no hover-only, full as a glyph (AR-M5, AR-V5). #4: nothing held, repeated or timed, reasons before a tap, tap-opened cards (AR-M1, AR-C1, AR-C3, AR-M5). #5: the exact preview (Matrix). #6 and #7: no hover-only, no designer terms, confirmations (AR-M5, AR-C5, AR-C6). #8 and #9: no hover-only, state glyphs with words, wrap never truncate at 390 px (AR-M5, AR-V5, AR-V4). #10: native, keyboard, 44 px, not colour (AR-P1, AR-M2, AR-M4, AR-V5). #11: status and alert roles, tap, phone width (AR-P4, AR-M5, AR-V4). #12: none |
| Systems index coverage | 20 of 20 systems have a matrix row |
| Pattern library alignment | Not assessed: `design/ux/interaction-patterns.md` is not on this branch. Open Questions asks it to cite AR numbers |
| Navigation consistency | Not applicable: this document defines no screen |
| Accessibility coverage of existing specs | #13 meets the tier except S1–S7; #14 meets it except K1–K3 (Changes needed in existing specs). #15 is not written |
| Missing empty states | Not applicable: this document defines no data-dependent element |
