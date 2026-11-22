# Cross-GDD Review Report

Date: 2026-11-22
Skill: `/review-all-gdds` (focus: full), on commit 00af24b ("Approve #15 Forge screen")
GDDs Reviewed: 12 of 12 present (#1–#12), plus the UX specs #13–#15, `design/ux/interaction-patterns.md` and
`design/accessibility-requirements.md`, read against `design/gdd/game-concept.md`, `design/gdd/systems-index.md`
and `design/registry/entities.yaml`
Not read: none
Focus: full (consistency, design theory, scenario walkthrough)
Systems Covered: #1 Content records and schema · #2 Modifier pipeline and recompute · #3 Resources and caps ·
#4 Activity slot, rest and away time · #5 Combat resolver · #6 Forge and proving · #7 Methods · #8 Crafting route ·
#9 Fight and dungeon routes · #10 Tending · #11 Save and run lifecycle · #12 Content validator and balance
enumeration · #13 Interface shell · #14 Method marks · #15 Forge screen · pattern library · accessibility requirements

Pillars: 1 The forge is the milestone · 2 Methods matter · 3 The build is a problem · 4 No dead ends, no attention tax.
Anti-pillars: extra activity slots, automation tiers, sects, branching story, reset loop, sprawl of systems.

Severity follows the project's review exit rule: a finding is **blocking** only when it breaks a pillar or the design
itself. Mechanical gaps are warnings and go to implementation. Nothing already tracked as an open question (art bible,
player journey map, architecture, a document's own open questions) is reported unless another document contradicts it.

---

## Verdict: CONCERNS

No blocking issue. No two binding rules were found that cannot both hold in a way that breaks a pillar, and no
document references a rule, formula or value that nobody defines. The design holds together at its seams. What remains:

- **Four design decisions** with pillar weight (G-01 to G-04): the Still Water over-gathering margin and the headroom
  line (pillar 3), two MVP hypothesis signals that cannot be observed as written, the 30-second loop's feeling, and
  MVP scope that grew in the UX specs without the concept or index recording it.
- **Three wording decisions** where two approved documents mandate different player-facing text or sizes (W-01 to W-03).
- **Mechanical seams** (W-04 to W-26): data the interface needs that no GDD saves or exposes, acceptance criteria
  that cannot all pass, two safe ranges for one constant, stale amendment bookkeeping. These go to implementation.

---

### Consistency Issues

#### Blocking (must resolve before architecture begins)

None.

#### Warnings (should resolve, but won't block)

**Decisions needed**

⚠️ **W-01 One refusal, two mandated strings for an ingredient already held**
- `activity-slot-rest-and-away-time.md:686` "The refusal reads "[ingredient] is already held"" (S5.3, which owns the
  refusal); `fight-and-dungeon-routes.md:967` AC-N5-1 "Ghost Moss is already held" (also :239, :258, :410, :623)
- ↔ `crafting-route.md:831` "read "{ingredient} is in hand", never "{ingredient} is full"" (also :600, AC-L4-2 :884);
  `interface-shell.md:460` "{name} is in hand" and AC-13-10 (:1198)
- The rules core returns one string, so AC-N5-1 and AC-13-10 cannot both pass. The state names differ too (#9 "Held",
  #13 "In hand"). #4's away stop line says "… is full" for the same condition (:109-110). #13 Open Questions 6 holds
  the wording open but omits #4, which owns it.
- Fix: choose one wording; edit #4 :686 and the stop line, #9 (N5.3, N6.4, States, AC-N5-1, AC-N6-1, UI Requirements
  2 and 5), #8 :600, :831, :884, #13 :460, :893, :1198; close #13 Open Questions 6.
- **Designer decision:** "{name} is in hand" (#8, #13; matches the forge screen and covers key items) or
  "{name} is already held" (#4, #9)?

⚠️ **W-02 "Quenched" is shown before the ingredient is held; the concept and #1 say a `set` shows only "changed"**
- `game-concept.md:122` "a method that sets one shows only that it changes it. Absolute contribution values appear
  only once an ingredient is in hand"; `content-records-and-schema.md:1199-1200` "a `set` patch shows "changed" with no
  number" (also :1343)
- ↔ `methods.md:205` "quench … "quenched", with no number" (also :138, :315); `method-marks.md:298-303` (MK7),
  :421-422 (BD7); `forge-screen.md:352-356` (FC5), :486-489 (FC9a), AC-15-22 (:1402-1407)
- "Quenched" tells the player the post-method value (0) before the ingredient is in hand. #1 A10 changed only R7.2
  (the commit dialog); #1's Edge Cases and UI Requirements and concept line 122 still say "changed". The concept's own
  mechanic 2 (:91) uses the verb "quenches", so the concept is mixed. No pillar breaks: the base stays hidden, and the
  build still cannot be solved on paper.
- **Designer decision:** (a) keep "quenched" pre-commit and amend concept :122 and #1 :1199-1200, :1343 to "a `set` to
  0 reads 'quenched'; any other `set` reads 'changed'"; or (b) revert to "changed" in #7 W3, W7.1, AC-W7-1, #14 MK7,
  BD7, AC-14-10 and #15 FC5, FC9a, AC-15-22.

⚠️ **W-03 AR-M4 requires 44 px drill lines; PD7, #13 and #14 allow 32 px with a fine pointer**
- `accessibility-requirements.md:268` "Full-width lines (#14's part and back lines) are at least 44 px tall." (also
  :495; :537 claims the specs already match)
- ↔ `interface-shell.md:525` "at least 44 px tall with a coarse pointer or 32 px with a fine one";
  `interaction-patterns.md:87` (PD7), :304-305 (IP2), :1193 (IP21); `method-marks.md:606-607`, :859, :1076
- The accessibility document says it wins conflicts (:22-24), and the library agrees (:40-41). By that rule every
  32 px line breaks a binding requirement.
- **Designer decision:** keep PD7's 32 px fine-pointer allowance (amend AR-M4 and its matrix row), or require 44 px
  everywhere (revert PD7 in #13 C16, IP2, IP21 and #14).

⚠️ **W-04 #11's new-run dialog does not name the heap choices it clears**
- `save-and-run-lifecycle.md:304-305` (D6.2) "names what it clears: the committed method, the forged Foundation if
  any, everything held, kept progress and held breath"; :312-313 (D6.3); `interface-shell.md:566-568` follows D6.2
- ↔ `tending.md:253` "emptied at run start (#11)"; `save-and-run-lifecycle.md:83` "nothing you chose is quietly edited,
  rewound or erased"
- #11 UI Requirements 4 (:792-794) is also narrower than D6.2 and still uses the retired "Confirm" label (PD17 says
  "Start a new run").
- Fix: add "which gatherers are heaped" to D6.2, D6.3, UI Requirements 4 and #13 C17; align UI Requirements 4 with
  D6.2 and PD17.
- **Designer decision:** do heap choices count as "what it clears" under rule 54, or are they a reversible setting
  that needs no mention?

**Data and interface seams**

⚠️ **W-05 Accepted actions that write nothing still reset the away counter**
- `activity-slot-rest-and-away-time.md:163-165` "Every *accepted* player action, in any system, is an **input** … Each
  input resets the time since the last input to 0"
- ↔ `save-and-run-lifecycle.md:344` "Copy save … writes nothing"; :401-402 (`copySave`, `useHere`,
  `requestPersistence`); :180-182 "the saved state plus the gap since `lastSeen` equals uninterrupted play"
- A Copy save resets *t* live but not after a reload, so a run can stop `away` at a different time than it would have
  live. Shipped content never reaches the away cap, so only fixtures show it.
- Fix: #4 S3.3 defines an input as an accepted rules-core action that changes game state (Start, Stop, `setHeap`,
  commit, forge; `newRun` and `importSave` replace state). Copy save, Use here and "Keep my save in this browser" are
  not inputs.

⚠️ **W-06 The running line needs the stopped source after a reload, but #4 saves only the reason**
- `interface-shell.md:388-389` "Resting · {source} stopped: {reason}", from the saved last stop reason (#4 S12)"
- ↔ `activity-slot-rest-and-away-time.md:395` "the last stop's reason;" and :983 (the serialised slot holds occupant,
  stop reason, kept map); :132-133 (S1.3 run start names no reason, while `save-and-run-lifecycle.md:258` supplies
  "none")
- After a stop the occupant is rest, so after a load #13 cannot fill {source}.
- Fix: #4 S12 and S1.3 read "the last stop's source and reason (none at run start)"; follow through #4 :983, #4 ADR
  item 1 and #11's slot slice.

⚠️ **W-07 #6 G1 has no query for the forge's refusal reason, which #15 shows while the player plans**
- `forge-screen.md:404-410` (FC7b shows "the rules core's refusal text (#6 G8.1)" on every repaint), :930
- ↔ `forge-and-proving.md:154-162` (G1 lists `preview`, `previewable`, `bestSeals` … and no legality query); :284-286
  (G8.1 is the refusal of the forge action itself)
- Without a query the interface would rebuild G8.1's rule and text, which breaks "the interface holds no rules".
- Fix: add a G1 function (for example `forgeRefusal(plan, held, committed, forgedRealm)` returning the reason lines or
  none), or have `preview` return it; record it in #6 ADR 2 and #15's Data Requirements.

⚠️ **W-08 #15's forged view says it reads only the snapshot, but the snapshot holds no cap or threshold**
- `forge-screen.md:572-573` "Everything here reads the forge snapshot (#6 G10), never content"; :578 (door rows as FC8c,
  "wide from {threshold}"); :581 "Widened {store} to {cap}"
- ↔ `forge-and-proving.md:1129-1130` "the snapshot holds … `F`, and no `contrib`, threshold or cap"
- Widened caps come from #3, thresholds, `flavor` and names from content. The wireframe (:763-767) already drops the
  next threshold, so the text and the picture disagree.
- Fix: FC13 says stats, tiers, seals and the makeup read the snapshot; names, `flavor` and widened caps read content and
  #3; the forged door row omits the next threshold.

⚠️ **W-09 #13 makes the preview heading's count a live status; #15 keeps the preview out of every live region**
- `interface-shell.md:1095` "the plan block's "{h} of 4 in hand" count … are `status`"
- ↔ `forge-screen.md:1211` (the status region reads "{k} of 4 chosen", then the reason); :1232-1233 "The preview is not
  live" (change 13-4, applied with the wrong count)
- Fix: `interface-shell.md:1095` reads "{k} of 4 chosen".

⚠️ **W-10 Two safe ranges for `FIRST_INGREDIENT_MS`**
- `crafting-route.md:747` "(X2; shared with #9's U5) | 300,000 | 290,000–360,000"
- ↔ `fight-and-dungeon-routes.md:771` "180,000–420,000"; `entities.yaml:944` "safe 180000 to 420000";
  `content-validator-and-balance-enumeration.md:961` names #9 as owner
- A value inside #9's range (say 200,000) fails #8 X2 on shipped content. Both upper bounds pass the concept's "first
  ingredient within five" (`game-concept.md:122`).
- Fix: one owner (#9); its row and the registry take #8's lower bound with the reason; decide whether the upper bound
  is 300,000 (the concept's five minutes) or the concept states a band.

⚠️ **W-11 Two ranges for `HEAP_YIELD_BP` inside #10**
- `tending.md:431` "2,000–5,000 (shipped 4,000)" ↔ `tending.md:671` "1,000–5,000"; `entities.yaml:950` "safe 1000 to 5000"
- Fix: #10 Z1's variable row reads 1,000–5,000.

**Validator and acceptance criteria**

⚠️ **W-12 #4 T2 (a warning) is always shadowed by an error on the same source**
- `activity-slot-rest-and-away-time.md:376` "T2 | Lone ingredient output … | warning"
- ↔ `crafting-route.md:396` X6, `fight-and-dungeon-routes.md:344` U2, `content-validator-and-balance-enumeration.md:559`
  VC12 (all errors, all stricter); VR12 (:521) still registers T2 as a live warning
- Fix: #12 reports T2 as one "covered by X6, U2, VC12" line, or #4 amends T2 to defer to them.

⚠️ **W-13 #12 VR2-c's "check table row" rule also matches variable, cross-reference and knob rows**
- `content-validator-and-balance-enumeration.md:204-205` "A check table row is one whose first cell is a check id"
- ↔ `tending.md:513` "| J1 | bool | 0 or 1 |", :780 "| J3 | #6 B9 …"; `forge-and-proving.md:1035` "| B11 | #5 `SPEED_BASE` |"
- If a real J1, J3 or B11 check row is renamed or deleted, another row still carries the id and VR2-c still passes.
- Fix: VR2-c reads only the table under each owner's "Checks owned here" heading; AC-VR2-c adds a duplicate-id case.

⚠️ **W-14 #9's acceptance criteria and two registry outputs still pin the 44 s stub chain on shipped content**
- `fight-and-dungeon-routes.md:993` AC-X1-1 "[unit, S, stub chain] … 224, 254, 554"; :1002 AC-X2-1 "GIVEN the shipped
  routes … EJ 280–448 s"; :1040 AC-U5-1 "224 s"; :1061 AC-I6-1; :1067 AC-I7-1; `entities.yaml:513` (route_price
  "224 s to 944 s"), :520 (premium_ok "EJ 280-448 … TP 1180-1524")
- ↔ `crafting-route.md:938` AC-J-1 (real chain: B9 2.04 and 1.43, H5 margins 120 s and 280 s); #9's own X3 real-bills
  paragraph (:580-591: Pangolin 240 s, EJ 300–480)
- #9's convention (:934) limits the stub chain to "until #8's chain exists"; #8 is Approved, so these criteria now fail
  on S. Stub figures also remain in #9's rules text (:308 "224 s", :635 "254 s", Game Feel :859).
- Fix: retag those cases [Fx, stub chain] and add S cases from X3's real-bills table; update the two registry outputs
  and add #8 to `premium_ok`'s `referenced_by`.

⚠️ **W-15 #11 AC-D12-1 lists four save actions after A1 added a fifth**
- `save-and-run-lifecycle.md:997-998` "accepts only `newRun`, `importSave`, `copySave` and `useHere`"
- ↔ :401-402 D12 adds `requestPersistence()` (A1); A1's Touches list (:7) omits AC-D12-1
- Fix: add `requestPersistence` to AC-D12-1 and AC-D12-1 to A1's Touches.

⚠️ **W-16 #1 AC-R4-12 runs on "the shipped schema", but its values load only under a test schema**
- `content-records-and-schema.md:1577` "GIVEN the shipped schema", :1593 lists `[0, 1]` and `[999999, 1000000]` as loads
- ↔ :352 thresholds "each 10,000–20,000" (A4); note 6 at :384 "by loading against a test schema"; the fixture also uses
  `stat_a` keys (closed by A2) and sources without `group` (required by A8)
- Fix: GIVEN "the R8.2 test schema"; add a shipped-schema row: `[10000, 20000]` loads, `[9999, 20000]` and
  `[10000, 20001]` fail.

⚠️ **W-17 #1 A8's "group carried by one source" check has no form in R4.7's closed table**
- `content-records-and-schema.md:401-403` (note 11) "except two checks at step 6. A group text that only one source
  carries is a load error"
- ↔ :258 "forms from one closed table", :286 "A new form is a change to this GDD", :674-676 (step 6 has no group check)
- Note 11 also says "two checks" and names one.
- Fix: add a form `shared by ≥ 2 records` to R4.7, `source.group`'s Range cell, step 6 and AC-R8-2a; fix the count.

⚠️ **W-18 #1 AC-F1 tests a Foundation that lowers a cap at run start; #3 makes both halves unreachable**
- `content-records-and-schema.md:1861` "a Foundation that lowers the effective cap to 5, WHEN a run starts", :1138
- ↔ `resources-and-caps.md:204` "K7. A Foundation only raises caps"; :174-175 "no Foundation exists yet"
- Fix: rewrite the case as a test schema (base cap 5, start 8) or delete it; cite #3 K4/K7 at :1138.

**Stale cross-references and amendment bookkeeping**

⚠️ **W-19 The concept still describes tending as undesigned and methods as removing routes**
- `game-concept.md:4` "Status: Under Review … the fourth revision awaits re-review"; :79 "tend the running activity";
  :141 "what that choice is, concretely, is still to be designed"; :356 "the tending action is undesigned"; :367-368
  (the balance table and tending ceilings as open questions); :403 MVP item 3 "methods add and remove fight and dungeon
  routes"; :471-472 unchecked `/map-systems` and `/design-system`; also `systems-index.md:415` "A method adds, removes
  and re-prices routes"
- ↔ `tending.md` D1–D5, J1 (Approved); `crafting-route.md:353` (B9 passes); `methods.md:64` "No closing by patch",
  W3/W4 (open only); `systems-index.md:124-146` (already correct)
- All 15 systems were approved against a concept whose binding text contradicts them in these lines.
- Fix: refresh the concept's Status, :79, :141, Open Questions :356, :367-368, MVP item 3 and Next Steps; reword index
  :415 to "opens".

⚠️ **W-20 #5 is stale against #1, #4, #6 and #9, and its header misses #6's resolutions**
- `combat-resolver.md:538` "range 0–1,000,000 until #6 narrows it"; :541-543 #6, #9, #4 "Not yet designed"; :7 header
  records only A1; :167-168 (C9) "an open question"; :606 (AC-C10) "deferred until #6 is designed"; :641 OQ6 open
- ↔ `content-records-and-schema.md:352` (10,000–20,000, A4); `entities.yaml:898-909`; `forge-and-proving.md:466`
  "answers to #5 Open Questions 1, 3 and 5"; `combat-resolver.md:636-640` (its own table says resolved);
  `systems-index.md:241` (OQ6 done)
- Fix: update the Cross-References rows; add a header A2 for #6's resolutions; C9 ends "It is a validator error (#9
  U1)"; drop the deferral in AC-C10; mark OQ6 resolved.

⚠️ **W-21 Two open questions are still open in their owners although other GDDs answered them**
- `content-records-and-schema.md:1952` (OQ3 "Is rest a `source` record", open; hedges at :132, :1177-1178) ↔
  `activity-slot-rest-and-away-time.md:130` "This answers #1 Open Question 3. Rest is not a" record
- `resources-and-caps.md:776` (OQ3: about ten fill/spend switches in the first two minutes, open) ↔
  `activity-slot-rest-and-away-time.md:305` (latency half), :1066 "Resolved 2026-11-21 by #8 (`crafting-route.md` L5.3,
  X1)"; `crafting-route.md:294` "four in 28 runs, with a median run of 30 s"
- The pillar 4 attention-tax question is answered and held (#4 S8.6, #8 L5.3, X1); only the owners' rows are stale.
- Fix: mark #1 OQ3 resolved by #4 S2 and remove the rest hedges; mark #3 OQ3 resolved (status-only amendment A3).

⚠️ **W-22 Stale "[blocked]" tags on checks that now run**
- `content-records-and-schema.md:713-715` "Until #6 states it, check 3 is `[blocked: #6]`" ↔ :1961 (OQ12 resolved),
  `forge-and-proving.md:367-372` (G12), `entities.yaml:886-897`
- `forge-and-proving.md:423` B9 "[blocked: #8, #9]", :1179, :1182, :780, :1217; `methods.md:414` H5 "[blocked: #8, #9]",
  :848-850, :894, :958; `fight-and-dungeon-routes.md:345` U3 "[blocked: #8]", :1032
- Fix: remove the tags (keep stub cases as [Fx]); #1 R8.4 reads "#6 G12/S8 sets it (`source_price`); #12 applies it".

⚠️ **W-23 #7's body still says no check guarantees a winnable route**
- `methods.md:276` "No check enforces this yet"; :627; :997 ↔ `fight-and-dungeon-routes.md:343` U1; `methods.md:1005`
  OQ2 "Resolved"
- Fix: cite #9 U1 (with #12 U4, VC10) in W5.5, the Routes edge case and the QA note.

⚠️ **W-24 Registry `referenced_by` lists miss most citing documents**
- `entities.yaml:207` `div_floor` [#6, #12] (also cited by #2, #3, #4, #5, #8, #9, #10); :214 `bp_of` []; :353
  `raise_envelope` []; :179 `high_water` [#11]; :332 `settle` [#11]; :228 `method_change_set` [#7]; :802-807
  `rest_speed` [] and :796-801 `bank_cap_ms` (no #10); :264-269 `scale_product_bound` and :737-741
  `recompute_time_ceiling_provisional` have no key
- The registry cannot show the blast radius of a change to the core helpers.
- Fix: regenerate `referenced_by` from a grep of names; add the two missing keys.

⚠️ **W-25 Systems index ¶17 still gives the phone layout a drawer**
- `systems-index.md:205` "Reflow at about 390 px with a drawer, bottom tabs and tap tooltips"
- ↔ `interface-shell.md:130` "Diverged: there is no resource drawer and no bell"; `interaction-patterns.md:83` (PD3);
  `method-marks.md:1106`
- #17 will be designed from this paragraph; a drawer would move the stores off the narrow screen (#13 :94, rule 32).
- Fix: index ¶17 describes #13's narrow layout (pinned header, store chips, bottom tabs, bottom sheet, no drawer).

⚠️ **W-26 Accessibility open questions passed their deadline, and three library questions have no owner**
- `accessibility-requirements.md:625` (SC 2.2.2 and the moving bar), :626 (label-in-name for the heap toggle), deadline
  "`/ux-review` of #13", "Unresolved" ↔ `interface-shell.md:3` (Approved 2026-11-21); #13's Open Questions list neither
- `interaction-patterns.md:1451-1454` (Open Questions 2, 3, 5: Start's accessible name, a named-record line's name, the
  kept-progress bar's text value; owner "`design/accessibility-requirements.md`") ↔ that document's Open Questions
  (:621-632) hold none of them
- Fix: collect all five in the accessibility doc's Open Questions with the deadline "before #13's UI stories", and
  cross-list them in #13.

---

### Game Design Issues

#### Blocking

None. Pillar alignment holds for every system: each serves at least one pillar, and none does what an anti-pillar
forbids. There is one progression loop (the forge); caps change only at the forge; no loops compete (3a).

#### Warnings

⚠️ **G-01 Under Still Water the cheapest path to the best makeup hands over a fifth ingredient, and the headroom line
confirms the answer** (pillar 3; 3c dominant strategy)
- `crafting-route.md:351-353` Still Water T(best) 22.5 min, T(all six) 32.2 min, "ratio 1.43, +580,000: passes";
  `fight-and-dungeon-routes.md:561-562` "Still Water's over-gathering price is the Fox Hunt alone, because TP's descent
  makes CL on the way"; `forge-screen.md:307` (FC6) "The best Foundation here holds {b} seals" / "Your best in hand:
  {h} seals."
- ↔ `game-concept.md:196` "The best Foundation for a method is not obvious"; `forge-and-proving.md:314` (G9.2) "Any
  other ingredient gathered for this forge is slot time the forge does not repay" and :780 (S9's "five-ingredient
  hedge"), both false for Cloud Lotus under Still Water
- Walked on the documents' own numbers: under Ember Breath, gathering all six costs +1,550 s (2.04×), a strong price.
  Under Still Water, floor III's gate makes Cloud Lotus part of the best path, so the player holds 5 of 6, F8 ranks the
  five previewable makeups, and h = b appears the moment the pearl arrives. Completing the set costs one hunt (+580 s,
  1.43×), 220 s above B9's 360 s minimum; a cheaper Jade Blank bill fails B9 (#9 :602). With five held and h < b, the
  line also implies that every best makeup contains the missing sixth (`forge-screen.md:374-385`). B1 keeps the best
  makeup unnamed, and every check passes, so this is a margin, not a break. No check measures how many makeups the best
  path previews for free, and #15 Open Questions 10 asks whether the line steers, not whether it solves.
- **Designer decision:** (a) accept it as Still Water's identity and state it in #6 G9 and S9; (b) FC6 drops b and says
  only whether a better Foundation exists; (c) retune so the best path's gates do not hand over a fifth ingredient, or
  make the Fox Hunt dearer; (d) add a warning check (#6 G14 or a new VC) on the count of ingredients held when each
  method's best path completes. In every case, add the "does it solve" half to #15 Open Questions 10.

⚠️ **G-02 Two MVP hypothesis signals cannot be observed as written** (3f; the core hypothesis)
- `game-concept.md:389` "At least three full makeups are previewed before the first forge" ↔ `forge-screen.md:509-526`
  (FC10 lists every held makeup's seals, ranked, with no player act) and :1191 ("Nothing is remembered"). "Previewed"
  happens by itself once four are held; the MVP has no telemetry, so the signal passes for every tester holding five.
- `game-concept.md:390` "A run under the other method is started in the same session, unprompted" ↔
  `interface-shell.md:356` "Forged: {s} of {2D} seals. A new run can try {other method}." After the forge the MVP offers
  nothing else to do (#6 G13; #9 Open Questions 8), and the only goal on screen suggests exactly the measured action.
- **Designer decision:** for "Compares before forging": (a) a makeup counts as previewed when it became the plan (chips
  or "Plan this"); (b) any makeup line visible in F8; (c) drop the count and keep "the makeup forged is the best in hand
  or was chosen through the plan". For "unprompted": (a) define it as no prompt from outside the game; (b) the playtest
  build drops the line's second sentence; (c) record the signal as prompted by the game.

⚠️ **G-03 The 30-second loop promises urgency that #4's breath bank removes** (3g fantasy coherence; 3b)
- `resources-and-caps.md:70-71` "The pressure is on every bar … spend before it spills."; `game-concept.md:133-135`
  "spends a resource before its cap stops the activity"
- ↔ `activity-slot-rest-and-away-time.md:84-86` "The seconds the slot rested come back, doubled … A late tap costs
  nothing, so the bar never has to be watched."
- Rest banks up to 30 min, spent at 2×, so a late spend loses only the last unit's spill. The rule serves pillar 4; the
  loop's pull now comes from always having something to spend, not from tension. #3's fantasy and the concept describe
  the earlier feeling.
- **Designer decision:** (a) availability without urgency: reword #3's Player Fantasy "Now" bullet and the concept's
  30-second paragraph to "always something to spend; a full store waits" (no rule change); or (b) keep mild urgency, so
  the bank returns less than 1:1, which pillar 4's attention test rejects.

⚠️ **G-04 MVP scope grew in the UX specs; the concept and index still defer it** (scope; anti-pillar "no sprawl")
- `game-concept.md:408` "The phone layout itself waits for the vertical slice."; `systems-index.md:302-303` "Only the
  reforge, the phone layout, accessibility … wait"; :209 "The accessibility tier is an open question"; row 18
  "Not Started"
- ↔ `accessibility-requirements.md:51` "Comprehensive … WCAG 2.2 Level AA on every screen"; :160 short viewports "fixed
  in the MVP"; :560 axe-core in `bun run smoke` across four viewports; two screen-reader journeys (NVDA, VoiceOver);
  `interface-shell.md` AC-13-07, AC-13-24, AC-13-38 test the narrow layout in the MVP
- The designer decided this on 2026-11-21, but only the accessibility doc and #13 record it. No new system is added, so
  "no sprawl" holds; the producer's estimate and the concept's tiers do not see the growth, and #17 keeps only polish.
- **Designer decision:** record the MVP's narrow layout and accessibility tier in the concept (item 8, :415) and the
  index (¶17, ¶18, :302-303, row 18), leaving in-game settings and user testing to #18 at the Vertical Slice; or move
  AC-13-24, AC-13-38 and the narrow viewports of the axe matrix to #17 and #18.

#### Info

- ℹ️ **G-05 The MVP's stated redo price is "a new run".** `forge-screen.md:549` "Redo: only by starting a new run" ↔
  `game-concept.md:208` "Any forge can be redone for a stated price". The fast new game meets pillar 4 under the MVP
  carve-out and is not a reset loop, but the price is everything (22–51 min of activity) and no screen says how long.
  Optional decision: accept "a new run" as the stated price (recommended), or show the last run's activity time in the
  new-run dialog.
- ℹ️ **G-06 Choosing a route per ingredient is a lookup.** `game-concept.md:146-147` "The choice is which route supplies
  an ingredient" ↔ #9 U1 (every route won) and U3 (≤80% of the recipe): an open route is always faster. The real
  choices are which ingredient, in what order, and which method; consistent with pillars 2 and 4. Fix: reword the
  concept's Short-Term loop to "which ingredient next, by the roads the method opened".
- ℹ️ **G-07 Run length.** Efficient runs take 22.5–24.8 min of activity (`crafting-route.md:351`), yet the concept calls
  a session one forge of 30–60 min (:151) and expects a second run in the same session (:390). Fix: Session-Level reads
  "one forge, about 20–50 min of activity; an MVP session may hold two runs".
- ℹ️ **G-08 VC11 perturbs only door opponent stats.** `content-validator-and-balance-enumeration.md:558` ↔ the CD note
  at :4 ("so pillar 3's best makeup does not rest on a knife edge"). A knife edge in `contrib`, a method feed or a
  threshold is never tested. Optional decision: keep door-only and say so in the note, or widen the perturbation set.
- ℹ️ **G-09 Under the same method, the last-run line hands over last run's makeup.** `forge-screen.md:337-339` "When
  the current run circulates the same method, the line is unchanged" ↔ `save-and-run-lifecycle.md:797` "framed as a
  comparison under the other method … never as a previous best to beat". Harmless while the fast new game is a test
  affordance. Optional decision: keep, hide, or show it without the makeup under the same method.
- ℹ️ **Attention budget (3b): within limits.** The 30-second loop has two concurrent active decisions (what occupies
  the slot; the heap toggle on the running gatherer, which persists). The forge plan is revisited when an ingredient
  arrives (about every 4–5 min); marks are passive.
- ℹ️ **Economy (3d): no runaway loop.** Raw → refined → ingredient; every spendable store has a sink (V2); key items are
  never spent (V5); ingredients are spent only by the forge (B13); the breath bank breaks even and is capped; no source
  runs out, so tending yield enlarges no finite stock (concept condition held).

---

### Cross-System Scenario Issues

Scenarios walked: 7
1. A fight-route unit running with a gatherer heaped, tab closed for 3 hours, reload (#11 → #4 → #5 → #3 → #10 → #13)
2. A backward clock, or a save from another tab arriving mid-unit (#11 D2, Use here)
3. Fast new game after a forge (#11 D6 → #3, #4, #6, #7, #10, #15)
4. Commit Still Water → floor I → `reached` opens floor II → four ingredients → forge → proving → seals → wider caps
   (#7 → #1 → #4 → #9 → #5 → #6 → #3)
5. Gathering all six before forging (#6 G9, B9; #8; #9)
6. The forge-screen session, from method columns to the post-forge view (#7, #14, #15, #6, #13, #11)
7. After the forge: what the MVP session offers next (#6 G13, #9, #13, concept signals)

#### Blockers

None. No race, unbounded feedback loop, double count or broken state transition was found. In scenario 4, #6 A2 counts
Cloud Lotus once for the floor gate and the forge cannot consume a running route's ingredient. In scenario 1, the
composition law, the heap bit surviving stops (#10 D5) and #11's one-segment gap agree.

#### Warnings

- ⚠️ **Scenarios 1 and 4 — #4, #8, #9, #13:** a fight route paying an ingredient stops `full` with "… is full", the
  next Start is refused "… is already held", and the recipe row says "… is in hand": three wordings for one state. See W-01.
- ⚠️ **Scenario 2 — #4, #11:** Copy save, Use here and the storage request reset the away counter live but not after
  reload. See W-05.
- ⚠️ **Scenario 3 — #11, #10, #13:** the new-run dialog clears the heap choices without naming them. See W-04.
- ⚠️ **Scenario 5 — #6, #8, #9, #15:** under Still Water all six costs one hunt over the best path. See G-01.
- ⚠️ **Scenario 6 — #6, #15:** FC7b needs a refusal reason no G1 query provides (W-07); the forged view's sources are
  misstated (W-08); the preview count is made live in #13 only (W-09); "quenched" before the ingredient is held (W-02).
- ⚠️ **Scenario 7 — #6, #13, concept:** the only goal after the forge is the new run the goal line suggests. See G-02.

#### Info

- ℹ️ **Scenario 2 — #11, #13:** after Use here, the new tab shows an away summary for time the player watched in the old
  tab since its last write (`save-and-run-lifecycle.md:336-339`; stated for a killed tab at :620-622, not for a
  takeover). Fix: one #11 Edge Case under Tabs; optionally #13 titles that summary "Since the last save".

---

### Info-level findings (stale text, wording, bookkeeping)

These need no design decision; each fix is an edit at the next revision of the named document.

- **I-01 Stale status cells.** `modifier-pipeline-and-recompute.md:481-483`, :550-555 ("Not designed");
  `resources-and-caps.md:571-580`, :584-585 ("Not started"); `activity-slot-rest-and-away-time.md:782` ("#7–#13 are
  undesigned"), :455, :457, :774 (a floor convention with no MVP instance, #12 VR9.2), and no Cross-References rows for
  #6–#13; `tending.md:651-653`, :784-785 (#12–#14 "Not started"); `save-and-run-lifecycle.md:7` (A2) and :742 (#15 "in
  design"); `forge-and-proving.md:900` ("A4 pending"); `content-records-and-schema.md:1357-1376` (no rows for #8, #9,
  #10; :1371 #15 "in design"); `systems-index.md:251-252` (rows 14 and 15 omit #1); `accessibility-requirements.md:3`,
  :15, :492, :596, :627, :643, :645; `interaction-patterns.md:8`, :29, :1364, :1466, :1472-1476;
  `forge-screen.md:11`, :298, :1028-1030, :1665.
- **I-02 Prose calling settled questions open in #1–#3.** `content-records-and-schema.md:1179-1182` (cap `sealInput`),
  :182-183 (save wipe), :422, :883, :1107 and `resources-and-caps.md:137`, :350, :607 ("until #6 gives ingredients
  counts"), :324, :1275, :639, :1728, :1935 (product pairs "empty"); `modifier-pipeline-and-recompute.md:443-445` ("#10
  drops the choice when the activity stops", against its own OQ4 at :685).
- **I-03 Last Updated and amendment records.** `modifier-pipeline-and-recompute.md:7` and `resources-and-caps.md:5`
  predate their own 2026-11-21 amendments. #13, #14, the pattern library and the accessibility doc received #15's
  changes (13-x, 14-x, P-x, A-x) with no header record and stale dates (`method-marks.md:3-7`, `interface-shell.md:3-5`).
- **I-04 #2 P2 ops shape.** `modifier-pipeline-and-recompute.md:116` `{fn, noOpCheck}` ↔ #1 A1 adds `operandRange`
  (`content-records-and-schema.md:482-483`).
- **I-05 The forge snapshot and the cap.** `modifier-pipeline-and-recompute.md:464` "#6 records it in the forge snapshot"
  and `resources-and-caps.md:230-231` ↔ `forge-and-proving.md:342-343` (no cap in the snapshot), :256-257 (no seal
  reads a cap, so #3 K8.2 holds trivially).
- **I-06 #3 overstates rule 18.** `resources-and-caps.md:14`, :33 "every bill takes most of a cap" ↔ #9's half-cap bills
  (`fight-and-dungeon-routes.md:178`) and #3's own V2 (largest bill only); :114, :127 say "reveals" where #8 says every
  gate is a `need` (`crafting-route.md:220`).
- **I-07 Registry coverage.** No door opponents, ingredients, affinities, doors or realm in `entities.yaml`;
  `content-records-and-schema.md:133` combatant "~7" ↔ 7 route combatants plus 3 door opponents; item notes at
  `entities.yaml:86`, :95-149 still "provisional until #8 and #9 approve".
- **I-08 Runtime.** `game-concept.md:297` (Vite, Vitest, Node.js 26) ↔ `content-records-and-schema.md:235` (Bun's ICU)
  and #1's `bun test` criteria. Tracked as #12 Open Questions 5; it is a technical-director call before
  `/create-architecture`.
- **I-09 #4 fixtures.** `activity-slot-rest-and-away-time.md:886-890`, :792 use #3 K1's illustrative chain (skim 2,000 ms)
  ↔ shipped skim 5,000 ms (`crafting-route.md:759`); the `UNIT_FLOOR_MS` rationale rests on it. Label the fixtures.
- **I-10 Notice vs log.** `tending.md:360-362`, :887-888 "log line" ↔ `save-and-run-lifecycle.md:214`, :899 "notice line".
- **I-11 Need text for `reached(id, 1)`.** `crafting-route.md:120`, :593 "Needs Hearth Lamp" ↔ `interface-shell.md:457`
  "Needs Hearth Lamp ×1 (1 more)", `fight-and-dungeon-routes.md:408`; #9 :78, :808 use a sentence #1 R5.5 does not generate.
- **I-12 #9 events.** `fight-and-dungeon-routes.md:376` omits #1 A9's `opened` (#8 :422 cites it).
- **I-13 #12 H2 scope.** `content-validator-and-balance-enumeration.md:529` "H1, H2, H4 | set" ↔ `methods.md:404`, :411
  (H2 compares methods, so it needs `checked`).
- **I-14 #5's loss form.** `combat-resolver.md:519-521` (a losing verdict shows the opponent's Life removed) has no form in
  #13 C11 or the Fights block; U1 makes it unreachable in shipped content. Note it in #13's trace.
- **I-15 Banners.** `save-and-run-lifecycle.md:799` puts Load save on both banners ↔ `interface-shell.md:786-787` (Copy
  save only). Amend #11 UI Requirements 6.
- **I-16 "Tapping a number".** `resources-and-caps.md:639`, `combat-resolver.md:524`, `forge-and-proving.md:1011`,
  `tending.md:748` ↔ #13 :129, :551 and #14 D3 (records open the card; numbers are not targets).
- **I-17 Pattern library.** #13 C13 is missing from the catalogue (:148-158, required at :68-70); :441 cites C9 as
  "Standard tabs" but C9 now reads IP4.
- **I-18 #13 internals.** C17 focus (:559) vs :1081 (first field); tab order (:1038) vs reading order (:258-259, :1045);
  wireframes :667-669, :751 show the Pangolin Hunt keeping 46 of 100 Life (#9 :213, :961: 60; 46 is the Heron);
  AR-C5's "frozen set" (`accessibility-requirements.md:329`) missing from #13 :1116.
- **I-19 #15 vs #14.** AC-15-02 (`forge-screen.md:1299-1301`) lists Opens before Feeds ↔ AC-14-11
  (`method-marks.md:1031-1036`, triple order); #14 Open Questions 9 (:1098) does not record that #6 A4 resolved its
  clash half; FC8's heading omits the "{s} of 6 seals" form its wireframe shows (:420-421 vs :713); #14 W1 says
  "held"/"not held" where #13 and #15 say "in hand"/"not yet"; `forge(plan)` (#13 :872) vs `forge(makeup)` (#15 :886).

---

### GDDs Flagged for Revision

No document is flagged at blocking priority. The systems index was not changed (see Process notes).

| Document | Reason | Type | Priority |
|---|---|---|---|
| game-concept.md | Stale tending, route-removal and status text (W-19); quench rule (W-02); signals (G-02); loop feeling (G-03); MVP scope (G-04) | Consistency, Design Theory | Warning |
| systems-index.md | ¶17 drawer (W-25); :415 re-pricing (W-19); MVP scope (G-04) | Consistency | Warning |
| content-records-and-schema.md (#1) | AC-R4-12, A8 form, AC-F1, stale blocked tag and OQ3 (W-16–W-18, W-21, W-22); quench rule (W-02) | Consistency | Warning |
| resources-and-caps.md (#3) | OQ3 open (W-21); fantasy wording (G-03) | Consistency, Design Theory | Warning |
| activity-slot-rest-and-away-time.md (#4) | Inputs (W-05); stop source (W-06); refusal string (W-01); T2 (W-12) | Consistency | Warning |
| combat-resolver.md (#5) | Stale cross-references and header (W-20) | Consistency | Warning |
| forge-and-proving.md (#6) | No refusal query (W-07); G9/S9 Still Water case (G-01); blocked tags (W-22) | Consistency, Design Theory | Warning |
| methods.md (#7) | Winnable-route text (W-23); blocked tag (W-22); quench (W-02) | Consistency | Warning |
| crafting-route.md (#8) | Refusal string (W-01); `FIRST_INGREDIENT_MS` (W-10) | Consistency | Warning |
| fight-and-dungeon-routes.md (#9) | Refusal string (W-01); stub-chain ACs (W-14); `FIRST_INGREDIENT_MS` (W-10); blocked tag (W-22) | Consistency | Warning |
| tending.md (#10) | `HEAP_YIELD_BP` ranges (W-11) | Consistency | Warning |
| save-and-run-lifecycle.md (#11) | New-run dialog (W-04); AC-D12-1 (W-15) | Consistency | Warning |
| content-validator-and-balance-enumeration.md (#12) | T2 shadowing (W-12); VR2-c row rule (W-13) | Consistency | Warning |
| interface-shell.md (#13) | Refusal string (W-01); live count (W-09); 32 px lines (W-03) | Consistency | Warning |
| forge-screen.md (#15) | Forged view sources (W-08); headroom line (G-01); signals (G-02) | Consistency, Design Theory | Warning |
| accessibility-requirements.md | AR-M4 vs PD7 (W-03); unowned open questions (W-26) | Consistency | Warning |
| interaction-patterns.md | PD7 (W-03); unowned open questions (W-26) | Consistency | Warning |
| registry/entities.yaml | `referenced_by` (W-24); stub outputs (W-14); range (W-10) | Consistency | Warning |
| method-marks.md (#14), modifier-pipeline-and-recompute.md (#2) | Info items only (I-03, I-04, I-05, I-19) | Consistency | Info |

---

### Designer decisions requested

Each needs the designer's call; none blocks `/gate-check technical-setup`.

1. **W-01** Held-ingredient wording: "is in hand" or "is already held"?
2. **W-02** "Quenched" before the ingredient is held: amend the concept and #1, or revert #7, #14 and #15 to "changed"?
3. **W-03** Drill-line height: keep PD7's 32 px fine-pointer allowance, or 44 px everywhere?
4. **W-04** Does the new-run dialog name the heap choices it clears?
5. **G-01** Still Water's over-gathering margin and the headroom line: accept and document, drop b from the line,
   retune, or add a warning check?
6. **G-02** Define "previewed" and "unprompted" for the MVP signals.
7. **G-03** The 30-second loop's feeling: availability without urgency (reword), or mild urgency (change the bank)?
8. **G-04** Record the MVP's narrow layout and accessibility tier in the concept and index, or move those criteria to
   the Vertical Slice?
9. Optional: G-05 (stated redo time), G-08 (VC11 scope), G-09 (same-method last-run line), I-08 (runtime, a
   technical-director call).

---

### Process notes (what ran, and how)

- **Coverage.** Every in-scope document was read in full by at least one reviewer: #1, #2, #3 and the registry (core);
  #4, #5, #10, #11 (time, combat, tending, save); #6–#9 (forge, methods, routes); #12 and the concept (validator and
  holism); #13, the pattern library and the accessibility doc; #14 and #15. The coordinator read the concept and the
  systems index in full and spot-checked 26 cited lines before writing; all matched. One reviewer claim was corrected:
  the registry does hold `first_ingredient_ms` (`entities.yaml:940`).
- **Partial checks, named.** The scan for fields missing from #1's registry covered backticked `type.field` names only.
  #15's changes 13-1, 13-9 and accessibility row 7 were too long for Grep to print and were not seen. #12's citations of
  #1 R8.4 and #2 P3.4, P6, P10 were checked against #12 and #1's A7 line; #1 and #2 themselves were read in full by
  another reviewer. #13–#15 have no `## Player Fantasy` heading; 3g judged their relevant rows.
- **Deviations from the skill.** The design set is about 1.5 MB, so six `game-designer` reviewers read the files
  directly (in two waves of three) instead of two agents receiving pasted sections; each was given the seams to weight.
  Sub-agents could not write files, so their findings came back as text and are merged and de-duplicated here. The
  skill's write-permission question was answered by the task that started this run (write and commit the report). The
  systems index was **not** updated to "Needs Revision", because that task forbids editing approved documents; the
  table above is advisory.
- **Already tracked, not reported:** no art bible, no player journey map, no architecture or ADRs.
