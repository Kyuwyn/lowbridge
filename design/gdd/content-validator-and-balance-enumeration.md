# Content Validator and Balance Enumeration

> **Status**: Designed 2026-11-21 (pending `/design-review` in a fresh session)
> **Creative Director Review (CD-GDD-ALIGN)**: APPROVED 2026-11-21. No blocker. One non-blocking note: close Open Question 3 (VC11 warns on S9's provisional doors) before content lock, so pillar 3's best makeup does not rest on a knife edge
> **Amends** (all designer-approved 2026-11-21): #1 A7 (R8.4 check 2 reads "some producer", gates counted, as #8 X5); #6 A3 (G14's cascade adds B9; Open Question 2 resolved by VC11). Status-only, marking Open Questions resolved: #4 A3 (row 7), #8 A1 (row 3), #9 A2 (row 4 (a)–(c))
> **Author**: designer + agents
> **Last Updated**: 2026-11-21
> **Last Verified**: 2026-11-21
> **Implements Pillar**: 4 (No dead ends, no attention tax); supports 1 (The forge is the milestone), 2 (Methods matter) and 3 (The build is a problem)

## Summary

The command-line check that proves, on every build, that the shipped content keeps what the
pillars promise:
- every ingredient has two sources under every method, one of them fightless and fairly priced;
- every route can pay;
- everything a gate names can be reached after the commit;
- heaping never changes a seal;
- each method has one best makeup that is not obvious and not best under the other.

It runs the checks that GDDs #3–#10 define, plus its own VC1–VC24, by static analysis and
exhaustive enumeration, with no play bot. It also generates the committed 30-case balance table.
A check that cannot run yet never reads as a pass: the run reports INCOMPLETE, and a build passes
only when every such check is on a reviewed pending list. Players never see it. They only never
meet a dead end.

> **Quick reference** — Layer: `Polish` · Priority: `MVP` · Key deps: `Content records and schema, Modifier pipeline, Resources and caps, Activity slot, Combat resolver, Forge and proving, Methods, Crafting route, Fight and dungeon routes, Tending, Save and run lifecycle`

## Overview

The content validator is the command-line check that proves, on every build, that the shipped
content keeps what the pillars promise. It never plays a run. It loads the content through #1's
loader, takes each method's frozen set, and evaluates a fixed catalogue of checks. It uses static
analysis and exhaustive enumeration over small closed spaces:

- the 30 makeup-and-method cases (15 makeups × 2 methods);
- the 8 tending sets (#10);
- the rooms of a store (#10 J2);
- a monotone reachability closure from each method's commit state.

It then writes the **balance table** those enumerations produce. There is no simulation bot
(rules 51, 52, 59; concept, TD-FEASIBILITY).

It has three parts:

1. **The catalogue.** It holds about 70 checks, and the GDD that owns each one defines it: #3 V1–V7,
   #4 T1–T3, #6 B1–B13, #7 H1–H5, #8 X1–X6, #9 U1–U5 and #10 J1–J3. The Validator runs them and
   restates none. It owns only the checks no other GDD numbers. These are #1 R8.4's items and edge-case rules,
   #2's enumerations (P3.4, P10), #11's alias rules (D11.3, D11.5), three checks the designer
   added on 2026-11-21, and the integrity of its own inputs. They are numbered VC1–VC24.
2. **The runner.** It fixes the order of checks, the preconditions between them, four
   statuses (pass, warning, error, not evaluated), the run's verdict (PASS, INCOMPLETE, FAIL), the
   exit status and the **pending list** of checks that are known not to run yet.
3. **The balance table.** A generated Markdown file is committed to the repository, and a
   committed copy that differs from the generated one is an error.

**The player never meets it.** Its output is a tooling report. Its format is the ADR that #1's
ADR 8 begins, and #12 owns no display (#13–#15 do). The player feels it as an absence: no gate
names a thing that cannot be had, no route asks for a fight it cannot win, and no heap changes a
seal.

**Why it exists.** Pillar 4's guarantees are validator checks by the concept's own wording ("set
in the forge design document, checked by the validator"). Pillars 1, 2 and 3 each have a test
that only enumeration can run (#6 B1–B8). Hundred Days shows what happens without one: 191 of
4,520 records gate on ids that no record defines, and nothing warns at load (rule 51). The
archived attempt proved reachability by playing its engine. This one does not need to. After the
commit, no action closes a source or spends a one-time unlock: forging spends held ingredients,
never a source. So a closure computed from each method's commit state covers every state a player
can reach (concept, TD-FEASIBILITY). Rule 59's "the reachability gate catches it" holds without
a bot.

**What it is not:**

- **Not the structural loader.** #1 R8.3's steps 0–9 run in the shipped game on every load and stay
  #1's. The Validator runs only on content that has loaded.
- **Not a tuner.** It reports and never adjusts a value. Tuning happens in content, against its
  report and table.
- **Not a playtest.** It shows the content is not broken, never that it is good. The MVP
  hypothesis needs testers (concept, Evidence standard).
- **Not a code test.** Engine behaviour is tested by each GDD's unit and integration criteria. The
  Validator calls the engine's pure functions and assumes them correct.

**Alternatives set aside:**

- **A play bot.** The archived attempt and Lowbridge's `bun run validate` worked this way (rule
  51's note). Its cost grows with content, it finds only the paths it plays, and it cannot prove
  that no path exists.
- **One script per GDD.** Each design session checked its own numbers with a throwaway calculator
  (#6 S9, #8 L9, #10 D8). Two implementations of one formula drift apart. #9's ADR 2 forbids a
  second implementation, and the Validator calls the same functions the game does: #6 G1, #7 W1,
  #2 `effective` and the #5 resolver.

## Player Fantasy

**Indirect.** The player never runs the Validator or sees its report. They feel what it keeps true
of the content. #1 promised that the vocabulary can say "the plan holds". This system proves that
the shipped content does. Framing: **no button is a dead end.**

**The moment.** Forty minutes into a Still Water run, the player settles on a makeup they have
never built: Echo Jade, Ironbark Heartwood, Ember Marrow and Tidewater Pearl. They trace each
ingredient back from the forge screen:

- every ingredient they lack has a route open under Still Water;
- for each one, a route never asks for a fight;
- the descent's third floor can be won;
- the hearth recipe costs no more than a fair multiple of the fight route.

They gather and forge. The proving fights pay the four seals the preview promised, and the same
four whether or not they heaped the gatherers.

**The promises, and what keeps each:**

| Promise to the player | Pillar | Kept by |
|---|---|---|
| Every ingredient can be had two ways under the chosen method, one with no fight, at a fair price | 4 | VC2; X5 (#1 R8.4 check 2); B10 (check 3); U3; U5 and X2 for the first one |
| Every route can pay | 4 | U1, U4, VC10 |
| Every gate names something that exists and can be reached after the commit | 4 | VC1, VC3, VC4 (rules 51, 52, 74) |
| Heaping never changes a seal | 4 | VC6 (#2 P10); J1–J3 |
| Every ingredient matters at the forge | 1 | B5 (#1 R8.4's "changes a seal") |
| The chosen method changes what ingredients do and which routes work | 2 | VC5; H1–H3 |
| The best makeup can be found, is not obvious, and differs by method | 3 | B1–B4, B6, H5; VC11 warns when the answer is on a knife edge |

**For the designer.** The designer is the only tester today (concept, Evidence standard). For
them the fantasy is that **the build fails before a player meets the break**. Suppose they add an
ingredient that only fills a slot, or a method that opens no route. Then `bun run validate`
stops, naming the check, the method, the record and the field. The same run regenerates the
table that shows each method's best makeup, so a retune is read in one place.

**What it must not claim:**

- that the game is fun, or the pillars right;
- that it replaces a playtest;
- that it finds engine bugs;
- that it tunes anything.

A green run means only that no promise above is broken by the content as written.

*Specialist: `creative-director` consulted. It proposed three framings: no dead end, the build is
really a problem, and the build fails first. It recommended the first, with the third folded in for
the designer, and that split is used here. The second framing's promises are the last three rows
of the table.*

## Detailed Design

### Core Rules

Rules here are VR1–VR12, formulas VF1–VF6 and this GDD's own checks VC1–VC24. No other GDD uses
two-letter ids, so a report line such as "VC3" or "B9" names one check everywhere.

#### VR1. One function, three callers

1. **The Validator is one pure function**, `runChecks(content, opts) → report`. `content` is the
   result of #1's `load` (`{checked, frozen, registry, fingerprint}`, #1 R8.1). `opts` holds:
   - the pending list (VR6);
   - the committed balance table's text (VR10);
   - the baseline and `F_pub` (VR11);
   - the release flag;
   - for tests only, any of these passed in place of the shipped one: a case table (#6 G14), a
     schema (#1 R8.2), a check registry (VR2), or the constants of this GDD's Tuning Knobs and of
     the thresholds the checks read. A test can then reach a bound or a cycle without building
     2,001 cases.

   It reads no file, clock or environment. Two calls with equal inputs give byte-identical reports.
2. **Callers:**
   - `bun run validate`, the command line, reads the files, calls `runChecks`, prints the report
     and sets the exit status (VR5). It is the only caller that writes, and only under
     `--write-table` (VR10).
   - `bun run build` calls `runChecks` in-process after the content loads. Any exit status but 0
     stops the build.
   - Tests call `runChecks` directly, passing every input explicitly. A few tests run the command
     line to pin the exit statuses (AC-VR5-2).
3. **Load comes first.** If `load` throws a `LoadError`, the run's verdict is FAIL. The report is
   one line naming the error (`step`, `record`, `field`, `cause`, and `method`, `entry` and `key`
   when present, #1 R8.1) and the number of checks not run. Those checks are not "not evaluated":
   a load error is never pending, and the pending list is not read.
4. **No second implementation.** The Validator calls the pure functions the game uses (#9 ADR 2):
   - #1's `atomMet`, `gateMet`, `shortfall`, `recordState` and `changed`;
   - #2's `effective` and the stage legality of P3;
   - #5's resolver;
   - #6 G1's case-table builder;
   - #7 W1's functions;
   - #10 D1's tendable set and D3's entry list `T`.

   #6 S7 (gather time), #6 S8 (price) and #8's hearth-road derivation are used only by the
   Validator and the generators. #12 owns their single implementation, and #9's X3 route-table
   generator imports it.

#### VR2. The catalogue is data

1. Every check is one **registry entry**: an id, the GDD that defines it, its scope (VR2.3), its
   severity in each scope, whether it is universal or existential (VR4.4), and the checks it
   requires (VR3). A lettered sub-check (J1(a)–(d), VC4(a)–(b)) is its own entry.
2. **The registry is the covered set** (`.claude/rules/skill-authoring.md`, obligation 5). It is
   derived, not listed by hand anywhere else:
   - Test VR2-a: ids are unique, every `requires` edge names a registered check, and the edges have
     no cycle.
   - Test VR2-b: every built check has at least one failing fixture, and the reference fixture
     `ref` passes it (Acceptance Criteria, "Fixtures"). An owner's `[validator, Fx]` criterion
     counts as that check's failing fixture. A check whose precondition can fail has a second
     fixture, which expects "not evaluated". A check reported `NOT_BUILT` has no code to fail, so it
     is exempt until built.
   - Test VR2-c: every check id in an owning GDD's check table is in the registry, and every
     registry id but the VC series is in some owner's table. A check table row is one whose first
     cell is a check id (`| V1 |`). A lettered sub-check such as J1(a) counts as its parent's id.
     This test reads the GDDs, so it is brittle on purpose: a check renamed in design fails it
     until the registry follows.
3. **Scopes.** A check runs once per instance of its scope:

   | Scope | One instance per | Example |
   |---|---|---|
   | once | the schema and constants | T3 |
   | checked | record of `checked` | U1, U2, U4, B13 |
   | set | (method, record) of each frozen set | V1–V3, H1–H4, X1, X5, X6 |
   | case | (method, makeup): 30 in the MVP | B5, V4, VC7's Foundation half |
   | method | method | B1–B4, B9, H5, V7, X2–X4, U5 |
   | tending | (method, tending set): 16 in the MVP | VC6, J3, and the tending halves of V3, T1, VC7, VC8 |
   | baseline | retired or aliased id | VC19–VC23 |

4. **Ids the GDDs did not give.** #1 R8.4 lists its Validator checks by bullet, and #1 Edge Cases,
   #2 and #11 name theirs in prose. Each becomes a VC check below, or is **covered by** another
   owner's check. A covered item has no instance of its own. The report prints it as one line,
   "covered by X5", so it never disappears silently:

   | Item | Covered by |
   |---|---|
   | #1 R8.4, pillar 4 check 2 (no fight in the input chain) | #8 X5, which is check 2 with gates counted (#8 Notation). Check 2 asks for **some** fightless producer of each input, as #8's hearth road does (#1 A7, 2026-11-21) |
   | #1 R8.4, pillar 4 check 3 (price ceiling) | #6 B10 |
   | #1 R8.4, every ingredient changes at least one seal | #6 B5 |
   | #1 R8.4, every method patches a `contrib` and an `enabled` value; #1 Edge Cases, a method with no patches or that patches only rates | VC5(a) |
   | #1 R8.4, seals tended equal seals untended | VC6 |
   | #1 R8.4, the balance table | VR10 and VC17 |
   | #1 Edge Cases, a patch disables every source of an id some atom or the forge needs | VC3 |
   | #1 Edge Cases, `reached` n above the smallest effective cap | #1 R8.3 step 6 (n ≤ authored cap) with #3 V4 (no Foundation entry lowers a cap, so the base cap is the smallest). It is reported "holds by step 6 and V4", or "not established: V4 failed" |
   | #1 Edge Cases, `start ≥ n` in a `reveal` | VC1 |

#### VR3. Order and preconditions

1. Checks run in a topological order over their `requires` edges, with ties broken by catalogue
   order (VR12). An error stops only the checks that require it.
2. A check whose required instance did not pass is **not evaluated**, with reason
   `PRECONDITION` naming that check and instance. The edges, each derived from what the check
   reads:

   | Requires | Not evaluated without it | Why |
   |---|---|---|
   | B1 under m | B3, B4, B9, H5, X3, X4 and VC11 under m; J3's B9, H5 and X3 under m | Each reads m's one best makeup. #6 G14 lists B2–B4 and B9 (#6 A3); H5, X3 and X4 read T_best and say so (#7 W11, #8 L8, #10 D8) |
   | B1 under every method | B2 | B2 compares the two bests |
   | X5 under m | X3, X4 under m | T_fl is undefined for a set holding an ingredient the hearth road cannot make (#8 L8). X2 still runs over the ingredients it can make, and is not evaluated only when there are none |
   | U4 | U1 | No challenger (#9 N12) |
   | VC2 and X5 for (ingredient, m) | B10 and U3 for (ingredient, m) | No second or no fightless source to price against. The failure is reported once, at VC2 or X5 |
   | VC6 for every makeup of (m, S) | J3 at (m, S) | J3 reuses each method's untended best makeup, which stays the best under a tending set only while seals are invariant |
   | VC16 | VC3, VC4(a) | Reachability's coverage argument (VR7.5) holds only while its premise does |
   | VC24 | VC19–VC23 | No baseline to compare with |
   | The case table | everything in scope `case`, B1–B12, VC11, VC17 | #6 G1 builds it. If G1 throws, that is one error, reported on B1's `*` instance with the cause "internal: case table", and its dependents are not evaluated |

3. **"Follows from."** Some errors are consequences of an earlier error in the same chain: a later
   floor of the Still Deep whose price came from a failing floor (#9 Edge Cases), or a reachability
   finding that disappears when every fight is counted won (VR7.4). These stay errors and point at
   their root, which the report prints first. The summary counts roots.
4. **A check that throws** is an error for that instance, with the cause "internal", never "not
   evaluated", so the pending list can never absorb a crash.

#### VR4. Statuses

1. Each instance of a check ends in one of four statuses:
   - **pass**;
   - **warning**: a warning-severity instance that failed;
   - **error**: an error-severity instance that failed;
   - **not evaluated**, with one reason from a closed list:
     - `PRECONDITION(check, instance)`: VR3.2;
     - `NOT_BUILT`: the check is registered but its code does not exist yet;
     - `NO_INPUT(what)`: something the check's definition reads does not exist, such as B2's
       "other method" when content holds three (Edge Cases). Content that pillar 4 requires, a
       recipe for instance, is never `NO_INPUT`: its absence already fails VC2 or X5;
     - `UNDEFINED(value)`: a price or a time it needs is undefined (VR9.4);
     - `OVER_BOUND(bound)`: an enumeration past its bound (VR8.5).
2. **Ranking: error > not evaluated > warning > pass.** "Not evaluated" outranks a pass, because the
   scope was not shown to be good. It never outranks an error, because a known break is more
   actionable than an unknown one (`skill-authoring.md`, obligation 1). A check's status is the
   worst status among its instances.
3. **Every check prints its instance counts** by status, so a check that ran over nothing shows
   "0 instances" and the reason, never a bare pass (obligation 3).
4. **Empty scopes:**
   - A **universal** check ("every X …", "no X …") with no instances passes, and prints its zero.
   - An **existential** check fails when its scope enumerates no instance at all: no ingredient, no
     resource, no candidate source. Otherwise each of its instances passes or fails on its own.

   The catalogue marks each check U or E. The existential checks are V7, B5, B7, VC2, VC4(a),
   VC5(a), VC5(b), H3, X2 and U5, so the content's existence is always asserted somewhere.
5. **An instance is a key:**
   - the check id, then its scope tuple: method, then tending set, then makeup, ingredient, source
     or record;
   - a tending set is keyed by its source ids in UTF-16 order, joined, with the empty set first;
   - a not-evaluated result that has no countable instances, such as `NOT_BUILT`, or `OVER_BOUND`
     over 2^k sets, is one instance keyed `*`;
   - a prefix of a key is a leading run of whole segments, so `ember_breath` is a prefix of
     (`ember_breath`, `echo_jade`) and `ember` is a prefix of nothing. The separator and the
     spelling of the empty set are ADR 8's.

#### VR5. Verdict and exit status

1. **The verdict** (VF4):
   - **FAIL** if the load threw, or any instance is an error, VC17's and VC18's included;
   - otherwise **INCOMPLETE** if any instance is not evaluated;
   - otherwise **PASS**.

   Warnings never change it, and their count is printed. An INCOMPLETE run never prints "PASS".
2. **The exit status:**
   - **0** on PASS;
   - **0** on INCOMPLETE, when every not-evaluated root (VR5.3) matches a pending entry and the run
     is not `--release`;
   - **1** on FAIL, on an INCOMPLETE run with an unmatched root, or on INCOMPLETE under
     `--release`. A load failure is exit 1 even when an input file is also bad, because the files
     are read only after the content loads (VR1.3);
   - **2** when the Validator itself cannot run after the content loads: an unreadable pending
     list, table or baseline file, a malformed pending list or baseline, a registry that fails
     VR2-a, or a refused flag combination (`--write-table` under `--release`). This is a tool
     fault, not a content finding, and it outranks every content finding, because the run that
     would weigh them did not finish. A missing table file is not a fault: it reads as empty text,
     and VC17 reports it.
3. **A root** is a not-evaluated instance whose reason is not `PRECONDITION` on another
   not-evaluated instance. Instances that wait on a listed root are covered by it and need no entry
   of their own.
4. **The report's last line** is the verdict word, the counts (error roots and error instances, not
   evaluated, warnings, passes) and the exit status, for example `INCOMPLETE — 0 errors, 2 not
   evaluated (2 pending), 1 warning — exit 0`.
5. **Who sets `--release`:** the build command that makes a public build. A public build made
   without it is a release-process error, which the release checklist owns (Open Questions).

#### VR6. The pending list

The designer decided on 2026-11-21 (answering #9 Open Question 4(a)) that a check that cannot run
yet must neither break the build nor read as a pass.

1. The pending list is a committed file. Each entry names **(check id, instance, reason, blocker)**,
   for example `(U3, *, NOT_BUILT, "U3 not yet implemented")`. Entries match on the first three:
   - The instance may be a prefix of the key (VR4.5). An entry under `ember_breath` covers that
     check for every ingredient under Ember Breath, and never under Still Water.
   - `*` covers the check's `*` instance only.

   This answers #9's case, "a blocked U3 neither breaks the build before #8 nor reads as a pass".
   While U3's code waits on #8's chain, U3 is `NOT_BUILT` and pending. Once its code runs, a missing
   recipe fails VC2 or X5 as an error, never as a pending gap.
2. **VC18 keeps it honest.** An entry is an error when:
   - it names an unknown check;
   - its reason is `PRECONDITION`, which is never a root;
   - its instance names no instance the run enumerates;
   - it duplicates another entry;
   - no instance it covers is still not evaluated for its reason, because each now passes, warns
     or errors, or waits for another reason.

   So the list only shrinks as content and code arrive: a stale entry fails the run until it is
   removed. An instance a prefix entry covers reports its own result as soon as it evaluates.
3. **Adding an entry is a reviewed change.** The Validator sees one version of the file, so it
   cannot refuse a new entry, and does not try.
4. **A public build needs an empty list.** `--release` turns every INCOMPLETE into exit 1. The first
   public build and every later one is a release.
5. Warnings and errors are never pending. Only not-evaluated roots are.

#### VR7. Reachability (VC3, VC4)

1. **Start state.** For each method m, take the commit state σ₀: `committed` = m, nothing forged,
   every resource's mark at its run-start `held` (#3 K4), and every ingredient's mark 0. This is
   the state #3 V7 starts its clock from.
2. **The closure.** Keep three sets, all empty at σ₀: R (reachable sources), P (producible ids) and
   Fg (forged realms), and the abstract marks H, which start at σ₀'s marks. Repeat until nothing
   changes. A source s joins R when all four hold:
   1. s is enabled in m's frozen set;
   2. `gateMet` holds for s's `reveal` and `need` on the state {marks H, held H, committed m,
      forged Fg} (#1's helper, called, not rewritten);
   3. every id in s's `inputs` is in P;
   4. s has no fights, or U1 passes for s.

   When s joins, every output id of s joins P. H of each output resource rises to its base cap,
   because repeated units fill a store whose inputs are all producible. H of each output
   ingredient rises to 1. A realm joins Fg when at least `makeupSize` of its ingredients are in P.
3. **Start stock is not renewable.** An id held from the start but made by no source in R is not
   in P, so it never feeds an input. A `reached` atom on it still reads its starting mark through
   H. The least fixpoint never admits a loop that only feeds itself.
4. **Findings,** each naming the method, the record and, where a patch caused it, the patch entry:
   - **VC3:** an enabled source not in R. The report gives its first unmet cause, in this order: the
     gate's atoms in authored order, through `shortfall`; then inputs not in P, by id; then a
     fight U1 loses. It also reports an ingredient of the realm not in P. Every ingredient must be
     obtainable, because every makeup must be forgeable.
   - **VC4(a):** a resource, key items included, with no source in R that outputs it. Its store
     could never fill (rule 74). The "slot" half of rule 74 has no instance in the MVP: the one
     activity slot is always fillable, and the forge's slots are VC3's ingredient finding.
   - **A second pass with every fight counted as won.** A finding that disappears in it depends
     on U1:
     - when U1 (or U4) failed, it is printed "follows from U1" and stays an error;
     - when U1 was not evaluated for its own reason, such as `NOT_BUILT`, the finding is not
       evaluated, `PRECONDITION(U1)`, since "follows from" needs an error at its root.
5. **Why the commit state is enough** (concept, TD-FEASIBILITY):
   - every gate atom is monotone (#1 R5.4);
   - after the commit, no action changes a source's `enabled`, `reveal`, `need`, `inputs` or
     `fights`;
   - forging spends held ingredients only, never a source or a key item (#6 B13, #3 V5);
   - a Foundation never lowers a cap (#3 V4);
   - a route's challenger is the unforged cultivator before and after the forge (#6 G13.2, #9 N3),
     so a route's result never changes.

   So every state a player can reach lies inside the closure, and every source in R is actionable
   in some reachable state. **VC16 checks the premise** that no Foundation or tending row can
   touch those five fields. A schema change that would break the argument fails the run instead
   of silently weakening VC3.

#### VR8. Enumerations

1. **The case table** is built once per run by #6 G1. It has one row per (method, makeup), where
   a makeup is each `makeupSize`-subset of the realm's ingredients: 15 × 2 = 30 in the MVP (VF1).
   Each row holds effective affinities, Foundation stats, door scores and tiers, seals and cap
   raises. It feeds B1–B12, #3 V4, VC6, VC7, VC11 and the balance table. A test may pass a case
   table in its place (#6 G14).
2. **Tending sets.** For each method m, every subset S of m's tendable sources (#10 D1) gives an
   entry list T(S) (#10 D3). The empty set is untended. In the MVP there are 3 tendable sources
   under each method, so 8 sets each and 16 (method, set) pairs (VF2). VC6, VC7, VC8, #3 V3, #4 T1
   and #10 J3 run once per pair.
3. **Seal invariance (VC6)** compares, for each (m, X, S), every `sealInput` value of
   `effective(set_m, F(X), T(S))` with `effective(set_m, F(X), none)`, and the seals they give
   (#2 P10). That is 15 × 8 = 120 comparisons per method.
4. **The B1 margin (VC11)** perturbs one door opponent's stat by ±1 at a time, when the result stays
   inside its row's range. It recomputes that door for every makeup of the method and asks whether
   the best makeup is still unique (VF3). Uniqueness is the test, as the designer decided. A best
   that changes to another single makeup passes, and that pass line carries "best changes to X" as
   a note. The change is made to a copy handed to the resolver, never to content and never by a
   reload.
5. **Bounds.** The Validator never samples, because prices couple through shared chains and a
   sample proves nothing about what it skips. Past a bound it reports `OVER_BOUND`:
   - Past `TENDING_K_MAX` (10) tendable sources under a method (1,024 sets), every tending-scope
     instance of that method is one `*` instance, not evaluated. J1 and J2 still run per source.
   - A store whose base cap exceeds `ROOMS_MAX` (10⁶) makes its J2 instance not evaluated.
   - When the case count (VF1) exceeds `CASES_MAX` (2,000), every case-scope instance and every
     check that reads the case table is one `*` instance, not evaluated. VF1 has no bound of its
     own: C(30, 15) is about 1.55 × 10⁸.

   Past the first two bounds, #10 Open Question 4's decomposition is due. Past the third, the realm
   ladder (#19) must restate the enumeration.

#### VR9. Time and arithmetic

1. **Prices are activity time.** B9, B10, H5, U3, U5, X1–X4 and J3 compare #6 S7 gather times and
   #6 S8 prices in untended activity milliseconds (#8 Notation). They are prices, not pacing
   bands, and the rest bank does not change them (designer, 2026-11-21).
2. **Pacing ceilings timed from the commit** are #3 V7, #9 U5, #8 X2, and the 60-minute ceilings of
   #6 B9 and #8 X3. They read #4 F5 with an empty bank, eta(A, 0) = A, so they equal activity time.
   **No MVP check is a floor timed from the commit.** #4 S11's full-bank reading for floors
   therefore has no instance, and #4 Open Question 7 is answered: rest before the commit keeps
   banking.
3. **No timed-action ceiling.** A duration is bounded only by #1 R4's row range (1–86,400,000 ms),
   #4 T1 (`UNIT_FLOOR_MS`) and #8 X1 (`RUN_FLOOR_MS` on the hearth road). The archived attempt's
   180 s cap on every timed action does not bind this game, since eight of #9's nine routes run
   longer (#9 Open Question 4(b)).
4. **Exact integers.**
   - The Validator computes #6 S7, #6 S8 and #10 J1(c) and J2 in exact integers (BigInt), and never
     mixes them with floating-point numbers.
   - A value it passes into an engine function (#2 `effective`, the #5 resolver, #6 G1) is checked
     to be a safe integer first. If it is not, that instance is an error with the cause "unsafe".
     The report and the table write exact values as decimal strings.
   - An undefined price or time (an id with no enabled producer, or a price chain that loops) makes
     the check that reads it not evaluated, `UNDEFINED`. It is never treated as infinite, because
     ∞ would pass X4's ">", and never as 0.

#### VR10. The balance table

The designer decided on 2026-11-21 that the generated table is committed, and that a stale copy is
an error.

1. **Contents:**
   - one block per method, holding its 15 makeups ordered by seals (highest first), then by makeup
     ids;
   - each row gives the seals, the door tiers, the effective affinities, the widened stores,
     T (#6 S7) and T_fl (#8);
   - marks on each method's best makeup (B1), its plain-sum pick (B3) and its cheapest makeup (H5);
   - one summary line per method, with the numbers B9, H5, X3 and X4 compare;
   - one line giving the count of (method, makeup, tending set) triples whose seals equal the
     untended ones, out of the total (VF2).
2. **Byte-stable:**
   - integers only (ms and basis points), written as plain decimals;
   - UTF-16 code-unit ordering, as in the report (VR12);
   - LF line ends, one final newline, no trailing spaces;
   - no timestamp, path, timing or fingerprint, since a text edit must not stale the table;
   - a value that cannot be computed prints a fixed token: `undefined` (T_fl when X5 fails), `tied:
     a, b` (B1 ties) or `not evaluated` (the invariance line when VC6 did not run). VC17 compares
     the tokens like any other text.
3. **VC17.** A committed copy that differs from the generated one is an error. It names the first
   differing line and the command that regenerates it, `bun run validate --write-table`. A
   default run never writes, and `--release` refuses to write. When the case table cannot be built,
   VC17 is not evaluated.
4. The tables in #6 S9 and #8 L6 are design-time history. Once the generated table exists, it wins
   where they disagree.

#### VR11. The shipped baseline (from the first public build)

1. **`F_pub` is a declared constant.** It is `none` before the first public build (#11 D11.2) and the
   first public build's save format after it. An absent constant is a VC24 error, never read as
   `none` (`skill-authoring.md`, obligation 2).
2. **Before the first public build** the retired-id list is empty by #11's declaration: renames are
   free and the alias map stays empty. VC19–VC23 therefore run over zero ids and print "0 instances:
   before the first public build (#11 D11.2)".
3. **From the first public build on,** the baseline is committed. It holds:
   - the retired-id list;
   - for each id, the shipped versions in which it was live;
   - the last shipped content's gates;
   - the migration fixtures (#11 D11.3).

   The release step that ships a build appends that build's ids and gates. Formats are #1's ADR 7
   and #11's ADR 5. VC24 requires the baseline to exist and parse. When it does not, VC24 is an
   error and VC19–VC23 are not evaluated.

#### VR12. The catalogue

The GDDs in the Owner column define these checks, and this table fixes only their scope, severity
and preconditions. Scope "set" means each method's frozen set; "checked" means `checked` once.

| Owner | Checks | Scope | Severity | U/E |
|---|---|---|---|---|
| #3 K9 | V1, V3, V5, V6 | checked and set; V3 also tending | error | U |
| #3 K9 | V2 | checked: error; set: warning (enabled sources only) | as stated | U |
| #3 K9 | V4 | case | error | U |
| #3 K9 | V7 | method | error | E |
| #4 S11 | T1 | checked, set and tending | error | U |
| #4 S11 | T2 | checked and set | warning | U |
| #4 S11 | T3 | once | error | U |
| #6 G14 | B1–B4, B6, B8, B9, B11, B12 | method, from the case table | error | U |
| #6 G14 | B7 | method (every door opens), and once across methods (every door opens wide under some method) | error | E |
| #6 G14 | B5 | case table, per ingredient | error | E |
| #6 G14 | B10 | (ingredient, method) | error | U |
| #6 G14 | B13 | checked and set | error | U |
| #7 W11 | H1, H2, H4 | set | error | U |
| #7 W11 | H3 | method | error | E |
| #7 W11 | H5 | method | error | U |
| #8 L8 | X1, X5, X6 | set, on the hearth road | error | U |
| #8 L8 | X2 | method | error | E |
| #8 L8 | X3 | method | error | U |
| #8 L8 | X4 | method | warning | U |
| #9 N12 | U1, U2, U4 | checked | error | U |
| #9 N12 | U3 | (ingredient, method) | error | U |
| #9 N12 | U5 | method | error | E |
| #10 D8 | J1(a)–(d), J2 | (tendable source, method) | error | U |
| #10 D8 | J3 | tending, for B9, B10, H5, X3, U3 | error | U |

**This GDD's checks:**

| # | Check | Scope | Severity | U/E | Source |
|---|---|---|---|---|---|
| VC1 | **Reveals narrow** (rule 52). No `reached(id, n)` atom of any `reveal` has `start` of id ≥ n, so no reveal is true at run start (`committed()` and `forged` atoms are false there) | checked | error | U | #1 R8.4; #1 Edge Cases |
| VC2 | **Two sources.** Every ingredient of the realm has at least two enabled sources that output it | (ingredient, method) | error | E | #1 R8.4 check 1 |
| VC3 | **Reachable** (rules 51, 59). Every enabled source is in R, and every ingredient of the realm is in P (VR7) | set | error | U | #1 R8.4; #1 Edge Cases |
| VC4(a) | **Every store can fill** (rule 74). Every resource has a source in R that outputs it | (resource, method) | error | E | #1 R8.4 |
| VC4(b) | **Every source is used.** No source is disabled in both frozen sets | checked | error | U | #1 Edge Cases |
| VC5(a) | **A method is more than a rate.** Every method patches at least one `ingredient.contrib` value and at least one `source.enabled` value | method | error | E | #1 R8.4; pillar 2's design test |
| VC5(b) | **Methods differ.** There are at least two methods, and no two methods' frozen sets are equal | method pair | error | E | #1 Edge Cases; concept MVP item 2 |
| VC6 | **Seal invariance.** For every (method, makeup, tending set), every `sealInput` value and the seals equal the untended ones | tending × makeup | error | U | #1 R8.4; #2 P10, AC-P10-1 |
| VC7 | **Entry legality.** Every Foundation entry list (each case) and every tending entry list (each tending pair) applies with no `ModifierError` | case and tending | error | U | #2 P3.4, AC-E-2 |
| VC8 | **Wasted or clamped entries.** (a) A tending entry leaves its value unchanged; (b) a Foundation or tending entry targets a source disabled in that set; (c) the pipeline clamp fires (#2 P6) | case and tending | warning | U | #2 AC-E-1 and Edge Cases; #1 AC-E-3 |
| VC9 | **Needs narrow.** (a) A `reached` atom of a `need` is true at run start; (b) a `need` holds `committed()`; (c) every atom of a `need` is implied by its `reveal` | checked | warning | U | #1 Edge Cases |
| VC10 | **Creature speed.** Every combatant fought on a route has `speed` ≤ `SPEED_BASE` (100). A combatant that is also a door opponent is #6 B11's, and VC10 prints "covered by B11" for it | checked | error | U | Designer 2026-11-21; #9 Open Question 4(c); the reason of #6 B11 |
| VC11 | **B1 margin.** Under each method, the best makeup stays unique under every single ±1 change of one door opponent's stat (VR8.4, VF3) | method | warning | U | Designer 2026-11-21; #6 Open Question 2 |
| VC12 | **Cap-1 outputs stand alone.** A source whose `outputs` hold a key item (a resource with base cap 1) or an ingredient holds no other output. On the hearth road an ingredient output is #8 X6's, and on a fight source #9 U2's; VC12 prints "covered by" for those and checks every other source | checked and set | error | U | Designer 2026-11-21 ("every cap-1 output"); #8 Open Question 3 |
| VC13 | **A source does something.** No source has empty `inputs` and empty `outputs`, or `outputs` equal to its `inputs` | checked and set | error | U | #1 Edge Cases |
| VC14 | **No patch on a closed source.** No method patches a source that is disabled in its own frozen set, whether the method closes it or never opens it | set | warning | U | #1 Edge Cases |
| VC15 | **Price bound.** Every #6 S8 price is at most `div_floor(2⁵³ − 1, FIGHTLESS_CEILING_BP)` (VF5) | (source, method) | error | U | #6 S8 |
| VC16 | **The monotone premise.** `rowsFor('foundation')` and `rowsFor('tending')` hold no row on `source.enabled`, `source.reveal`, `source.need`, `source.inputs` or `source.fights` | once | error | U | VR7.5 |
| VC17 | **The table is current.** The committed balance table equals the generated one | once | error | U | Designer 2026-11-21 |
| VC18 | **The pending list is honest** (VR6.2) | each entry | error | U | Designer 2026-11-21 |
| VC19 | **Protected ids keep an alias.** An ingredient, realm, method, door or affinity id live in the baseline and absent now has an alias | baseline | error | U | #1 Edge Cases (A6) |
| VC20 | **Retired ids stay retired.** No live id is on the retired-id list | baseline | error | U | #1 Edge Cases |
| VC21 | **An alias is a rename.** No alias target was live in a shipped version in which its source was live, so two saved ids never merge | baseline | error | U | #11 D11.5 |
| VC22 | **Gates do not tighten across versions.** Against the last shipped content, no `reveal` or `need` threshold rose and no atom was added | baseline | warning | U | #1 Edge Cases |
| VC23 | **One fixture per migration.** Each migration v → v+1 for `F_pub` ≤ v < `SAVE_FORMAT` has a fixture save | baseline | error | U | #11 D11.3 |
| VC24 | **The baseline matches `F_pub`.** `F_pub` is declared. While it is `none`, the alias map and the retired-id list are empty (#11 D11.2). Once it is a format, the baseline and the retired-id list exist and parse | once | error | U | VR11; #11 D11.2 |

- **Findings name** the check, the method and tending set when they apply, the record, the field
  and the key, and a fixed cause phrase, and the instance counts follow. The exact layout extends
  #1's ADR 8 (#3 ADR 3, #6 ADR 3, #7 ADR 2, #9 ADR 1 and #10 ADR 4 each extend it for their
  checks).
- **Ordering:** catalogue order (this table, owners by GDD number, then the VC series), then
  method id, then scope tuple, then record id, field and key, all in UTF-16 code-unit order.

### States and Transitions

**One run.** Nothing here is game state. A run is a pure computation (VR1.1).

| State | Entered when | Leaves to |
|---|---|---|
| Loading | `bun run validate` or `bun run build` hands content to #1's `load` | Load failed, or Checking |
| Load failed | `load` throws | Terminal: verdict FAIL, exit 1 |
| Tool fault | A pending list, table or baseline file cannot be read or parsed, or the registry fails VR2-a | Terminal: no verdict, exit 2 |
| Checking | `load` returned | Reported |
| Reported | Every registered instance has a status | Terminal: verdict PASS, INCOMPLETE or FAIL; exit by VR5.2 |

**A check, over the project's life:**

| State | Holds when | Report |
|---|---|---|
| Registered, not built | Its id is in the registry; its code is not | Not evaluated, `NOT_BUILT`; needs a pending entry for exit 0 |
| Built, input missing | Its code runs, but its definition reads something content lacks (B2's "other method" with three methods) | Not evaluated, `NO_INPUT` (pending); a universal check over zero instances passes instead (VR4.4) |
| Live | It evaluates every instance | Pass, warning or error per instance |

A check moves only forward. A check that goes from live to not evaluated is a new root, and with no
pending entry that run exits 1.

**A pending entry:**

| State | Holds when | Effect |
|---|---|---|
| Matching | Its instance is not evaluated for its reason | Covers that root |
| Stale | Its instance now evaluates, or waits for another reason, or the check is gone | VC18 error until the entry is removed |

**The baseline:** Before the first public build (`F_pub` none, VC19–VC23 over zero ids) → Shipped
(`F_pub` a format, the baseline required). The change happens once and is never reversed.

### Interactions with Other Systems

The Validator reads every gameplay system, and none reads it (systems index, relationship
analysis). It owns no game state, accepts no player action and emits no event (TD finding 6).

| # | System | Gives this system | Gets from this system | Interface owner |
|---|---|---|---|---|
| 1 | Content records and schema | `load` and `LoadError`; `checked`, frozen sets, `registry.rowsFor`; the atom helpers; `changed`; the schema constants; R8.4 and the validator edge cases | Their ids (VR2.4, VC1–VC5, VC9, VC13, VC14, VC19, VC20, VC22); the reading of R8.4 check 2 as X5's | #1 owns loading and structural checks; this GDD owns the state and enumeration checks |
| 2 | Modifier pipeline | `effective`, P3 legality, P6 clamp, P10 | VC6, VC7, VC8 over every F and T | #2 defines; this GDD enumerates |
| 3 | Resources and caps | V1–V7, base caps, `start` | Their scopes and severities (VR12); V7 as a ceiling with an empty bank | #3 defines |
| 4 | Activity slot | T1–T3; F5 eta; the pacing-band convention | T1 over every tending set; the answer to Open Question 7 (VR9.2) | #4 defines |
| 5 | Combat resolver | The resolver, pure | Calls for the 90 door fights, every route fight (U1) and VC11's perturbed door fights | #5 owns the function; this GDD owns which fights it enumerates |
| 6 | Forge and proving | G1's case-table builder; B1–B13; S7 and S8's definitions | The case table built once; B9 waits on B1 (VR3.2); VC11 for Open Question 2; VC15 applying S8's bound at any `FIGHTLESS_CEILING_BP`; the single S7 and S8 implementation | #6 defines; this GDD runs and implements S7 and S8 |
| 7 | Methods | W1's functions; H1–H5 | H5 waits on B1 | #7 defines |
| 8 | Crafting route | The hearth road; X1–X6 | X3 and X4 wait on B1 and X5; VC12 for Open Question 3 | #8 defines |
| 9 | Fight and dungeon routes | U1–U5; the X3 generator's inputs | The answers to Open Question 4(a)–(c) (VR6, VR9.3, VC10); "follows from" (VR3.3); the S7 the generator imports | #9 defines |
| 10 | Tending | The tendable set and `T`; J1–J3 | The tending sets (VR8.2); BigInt for J1(c) and J2 (VR9.4); `TENDING_K_MAX` and `ROOMS_MAX` | #10 defines |
| 11 | Save and run lifecycle | D11.3 and D11.5; `F_pub`; the retired-id list's start | VC19–VC24 | #11 defines the rules; this GDD checks them |
| 13–15 | Interface shell; Method marks; Forge screen | — | Nothing. The report is a tooling output, not player UI | — |
| 16 | Reforge (Vertical Slice) | A post-commit method switch | VR7.5 no longer holds when a switch changes `enabled` after the commit. Reforge must restate the coverage argument, or reachability must start from every post-switch state (systems index, High-Risk Systems) | #16 |
| 19 | Realm ladder (Alpha) | More realms, a door-tier atom | The case count grows as Σ C(M_r, N_r) (VF1); `forged` atoms join the closure (VR7.2) | #19 |

**Non-derived state owned:** none in the game. In the repository, the Validator reads three
committed files it owns with #11 (the pending list, the balance table and the baseline), and
writes only the table, on request.
**Actions accepted:** none. **Events emitted:** none.

*Specialists consulted: `systems-designer` (primary) and `tools-programmer` (supporting; the
systems index names it for #12, so it stood in for the Foundation/Infrastructure row's
`gameplay-programmer` and `engine-programmer`). `systems-designer` proposed the runner's
precondition graph, the reachability closure, the VC ids and the covered-by items.
`tools-programmer` proposed the exit statuses, the pending entry's three-part key, the byte-stable
table and the one-function shape. They agreed on everything adopted here. The VR4.4 rule
(universal checks pass on an empty scope and print it) replaces `systems-designer`'s
"not evaluated on an empty scope", which would have needed pending entries for checks with
nothing to check. `systems-designer` also found two gaps between approved GDDs: R8.4 check 2's literal "every
producer" (VR2.4) and B9 missing from #6 G14's cascade (VR3.2). The designer approved closing both
upstream as #1 A7 and #6 A3.*

## Formulas

The checks' own formulas belong to their owners (#3 Q5–Q7, #4 F1–F5, #6 S1–S8, #7 Y1–Y4, #8
E1–E3, #9 X1–X3, #10 Z1–Z4). This GDD states only what the runner computes: how many instances
each enumeration has, the margin's perturbation set, the verdict and the price bound.

### VF1. Cases

The case_count formula is defined as:

`cases = Σ over methods m of Σ over realms r of C(M_r, N_r)`; `door_fights = Σ over the same of C(M_r, N_r) × D_r`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| m | method id | 2 in the MVP | data file | Each method's frozen set |
| M_r | int | 3–`realm.ingredients` row bound | data file | Ingredients of realm r (6) |
| N_r | int | 2 to M_r − 1 (#1 R4) | data file | `realm.makeupSize` (4) |
| D_r | int | 2–`MAX_DOORS_PER_REALM` | data file | Doors of realm r (3); B6 needs at least 2 |
| C(n, k) | int | — | calculated | Binomial coefficient |

**Output Range:** in the MVP, 2 × C(6, 4) = 30 cases and 30 × 3 = 90 door fights, each one call
to #5's resolver. C(M, N) peaks at N = M/2: a realm of 10 ingredients forging 5 gives 252 per
method. The Alpha tier (3 realms, 4 methods) stays in the low thousands.
**Example:** the MVP's 15 makeups per method are S9's rows; the two methods give the table's 30.

### VF2. Tending pairs

The tending_pairs formula is defined as:

`pairs = Σ over methods m of 2^(k_m)`, for k_m ≤ `TENDING_K_MAX`; `seal_comparisons = Σ over m of C(M, N) × 2^(k_m)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| k_m | int | 0–`TENDING_K_MAX` | calculated (#10 D1) | Tendable sources in m's frozen set |
| `TENDING_K_MAX` | int | 6–12 (shipped 10) | constant (tuning knob) | The largest k enumerated |
| C(M, N) | int | VF1 | calculated | Makeups per method |

**Output Range:** in the MVP, k = 3 under each method gives 8 sets per method, 16 pairs and
15 × 8 × 2 = 240 seal comparisons (VC6). The 16 pairs include the two untended ones, which compare
equal by construction. At k_m = `TENDING_K_MAX` = 10 a method has 1,024 sets. Past it, every
tending-scope instance of m is not evaluated, `OVER_BOUND` (VR8.5).
**Example:** under Ember Breath the sets are every subset of {skim the ash pits, fell ironbark,
quarry jade}. J3 re-runs B9, B10, H5, X3 and U3 on each of the eight.

### VF3. The B1 margin

The b1_margin formula is defined as:

`margin_ok(m) = ∀ (door d, stat s, δ ∈ {−B1_MARGIN_STEP, +B1_MARGIN_STEP}) with v_{d,s} + δ in range: |argmax over X of seals′(X, m)| = 1`; `perturbations(m) ≤ D × 4 × 2`; `resolver_calls(m) = perturbations(m) × C(M, N)`

- seals′(X, m) is the seal count of makeup X under m with the one door's opponent stat replaced by
  v_{d,s} + δ. The other doors' tiers are reused from the case table (VR8.4).
- "In range" means inside the `combatant.stats` row's range (#1 R4), with speed at most
  `SPEED_BASE` (#6 B11). A perturbation outside it is skipped and counted in the report.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| d | door id | 1–D | data file | The door whose opponent is perturbed |
| s | stat name | might, guard, vigor, speed (#1 R8.2) | schema | The stat that moves |
| δ | int | ±`B1_MARGIN_STEP` (shipped 1, range 1–5) | constant (tuning knob) | The step |
| v_{d,s} | int | `combatant.stats` row | data file | The opponent's authored stat |
| seals′ | int | 0–2D | calculated (#6 S5) | Seals with the one changed stat |

**Output Range:** at most 3 × 4 × 2 = 24 perturbations per method and 24 × 15 = 360 resolver
calls, 720 in the MVP. `margin_ok` is true or false per method. False is a warning (VC11).
**Example:** S9's provisional doors fail it under Still Water: Furnace Gate vigor 191 → 190 ties
two makeups at 4 seals (#6 S9, "Sensitivity"). VC11 warns, the run is not failed, and the table
shows B1's margin is one point.

### VF4. Verdict and exit status

The run_verdict formula is defined as:

`verdict = load_failed ∨ E > 0 ? FAIL : (NE > 0 ? INCOMPLETE : PASS)`;
`exit = load_failed ? 1 : tool_fault ? 2 : verdict = PASS ? 0 : (verdict = INCOMPLETE ∧ U = 0 ∧ ¬release ? 0 : 1)`

`tool_fault` is read only after the content loads, because the input files are read only then
(VR1.3).

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| load_failed | bool | — | calculated | #1's `load` threw (VR1.3) |
| E | int | 0 or more | calculated | Error instances, VC17's and VC18's included |
| NE | int | 0 or more | calculated | Not-evaluated instances |
| U | int | 0–NE | calculated | Not-evaluated roots (VR5.3) that match no pending entry |
| release | bool | — | command line | `--release`, set for every public build |
| tool_fault | bool | — | calculated | An input file unreadable or malformed, or VR2-a failed |

Warnings appear in neither formula.

**Output Range:** verdict is one of three words. Exit is 0, 1 or 2. Exit 0 with INCOMPLETE is
possible only off release, and only with every root on the pending list.
**Example:** while U3's code is unwritten, U3 is one `*` instance, not evaluated, `NOT_BUILT`.
With the entry `(U3, *, NOT_BUILT)` and no errors, the verdict is INCOMPLETE and the exit status 0.
Under `--release` the same run exits 1, and removing the entry also makes it exit 1. Once U3's code
lands, the entry is stale (VC18) until it is removed.

### VF5. Price bound

The price_bound formula is defined as:

`PRICE_MAX = div_floor(2⁵³ − 1, FIGHTLESS_CEILING_BP)`; VC15 passes for source s under m when `price(s) ≤ PRICE_MAX`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| price(s) | BigInt | 1 or more | calculated (#6 S8) | The source's price, exact |
| `FIGHTLESS_CEILING_BP` | int | 10,000–30,000 (shipped 20,000) | constant (#6) | B10's multiplier |
| `div_floor` | — | — | #1 F5 | Floor division |

**Output Range:** 450,359,962,737 ms (about 14.3 years of slot time) at the shipped 20,000, and
300,239,975,158 ms at the knob's top of 30,000. #6 S8 states 4.5 × 10¹¹, which is the shipped case.
The bound keeps B10's product p × `FIGHTLESS_CEILING_BP` a safe integer for every consumer that
reads it outside the Validator.
**Example:** the dearest MVP recipe, the Tidewater Pearl's at 1,300,000 ms (#8 L6), is about
346,000 times below the bound.

### VF6. Bounds on enumeration

The enumeration_bounds formula is defined as:

`case_ok = cases ≤ CASES_MAX`; `tending_ok(m) = k_m ≤ TENDING_K_MAX`; `rooms_ok(r) = base_cap(r) ≤ ROOMS_MAX`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| cases | int | VF1 | calculated | Case-table rows |
| `CASES_MAX` | int | 500–20,000 (shipped 2,000) | constant (tuning knob) | The largest case table enumerated |
| k_m | int | VF2 | calculated | Tendable sources under m |
| `TENDING_K_MAX` | int | 6–12 (shipped 10) | constant (tuning knob) | The largest tendable count enumerated |
| base_cap(r) | int | `resource.cap` row | data file | The store J2 loops over |
| `ROOMS_MAX` | int | 10⁴–10⁷ (shipped 10⁶) | constant (tuning knob) | The largest room count J2 loops over |

**Output Range:** each is true or false. False makes the affected instances one `*` instance,
`OVER_BOUND` (VR8.5). In the MVP: 30 ≤ 2,000, 3 ≤ 10, and the largest cap, 40, ≤ 10⁶.
**Example:** a realm of 12 ingredients forging 6 under 4 methods gives 4 × 924 = 3,696 cases, which
is over `CASES_MAX`. Every check that reads the case table (B1–B12, #3 V4, VC6, VC7, VC8, VC11
and VC17) then reports one `OVER_BOUND` each, and a pending entry is needed until #19 restates the
enumeration.

*Specialist: `systems-designer` proposed VF1–VF4, the perturbation rule (copies, never content)
and `CASES_MAX`. VF5 extends #6 S8's bound to the knob's whole range, because `systems-designer`
found the stated bound exact only at 20,000. A second `systems-designer` pass over Sections C and
D found eight contradictions and fifteen gaps. Each was applied to VR2–VR10, VR12, VF4 and VF6, or
moved to Edge Cases below.*

## Edge Cases

Each case states the outcome in this GDD's terms. Edge cases of a check's own rule belong to its
owner (#3 Content checks, #6 Degenerate content, #8 Content, #9 Checks at their boundaries, #10
Content and checks) and are not repeated here.

### Inputs and the run

- **If `load` throws**: verdict FAIL, exit 1, one line naming the `LoadError`. No check runs, the
  pending list, table and baseline are not read, and `--write-table` writes nothing (VR1.3).
- **If the pending list file is missing**: it reads as an empty list. That is the strictest list,
  since every not-evaluated root then exits 1. If the file is malformed, the run is a tool fault,
  exit 2.
- **If the committed table is missing**: it reads as empty text. VC17 is an error naming
  `bun run validate --write-table`. An unreadable file is a tool fault (VR5.2).
- **If `F_pub` is absent**: VC24 is an error, and VC19–VC23 are not evaluated. Absence is never
  read as `none`.
- **If `--write-table` is given and the case table was built**: the table is written to a
  temporary file and renamed into place, then VC17 compares against it and passes. If the case
  table could not be built, nothing is written and VC17 is not evaluated. Under `--release` the
  flag is refused, exit 2.
- **If every check passes and some warn**: verdict PASS, exit 0, and the warning count is printed.

### Statuses and the pending list

- **If a check throws**: that instance is an error with the cause "internal". The pending list can
  never cover it (VR3.4).
- **If a pending entry covers an instance that now errors**: the error is reported. When no other
  instance the entry covers is still not evaluated for its reason, VC18 also reports the entry as
  stale.
- **If two entries overlap**, for example `(U3, ember_breath, NO_INPUT)` and
  `(U3, ember_breath/echo_jade, NO_INPUT)`: the one whose instances the other already covers is a
  duplicate, a VC18 error.
- **If a not-evaluated instance waits on an error** (`PRECONDITION` on a failing check): the
  verdict is already FAIL. No entry can cover it, since VC18 refuses `PRECONDITION` entries.
- **If a warning-severity check is not evaluated**: it still counts toward INCOMPLETE and needs a
  pending entry. Only its failures are warnings.

### Enumeration and arithmetic

- **If B1 fails under both methods**:
  - B2 is not evaluated, and so are B3, B4, B9, H5, X3, X4 and VC11 under each method, and J3's
    B9, H5 and X3;
  - B10 and U3 still run per ingredient, since they need no best makeup;
  - the table prints `tied: …` in place of each best.
- **If B1 ties under one method**: B1's finding lists every tied makeup.
- **If a method has no tendable source** (k = 0): its one tending set is the empty set. VC6 passes
  trivially, J1 and J2 pass over zero instances, and J3 has nothing to run (next case).
- **J3 runs on non-empty tending sets only.** Under the empty set, B9, B10, H5, X3 and U3 are their
  owners' own untended instances. Running them again as J3 would report each failure twice.
- **If content holds more than two methods** (the Vertical Slice's third): B2 is not evaluated,
  `NO_INPUT("#6 B2 for more than two methods")`, until #6 restates "the other method". VC5(b) runs
  on every pair.
- **If content holds one method**: VC5(b) is an error, so the run fails. B2 is not evaluated.
- **If a price chain loops**, meaning an input is made only through the source that spends it: its
  price is undefined. Every check that reads it is not evaluated, `UNDEFINED`. VC3 reports the
  loop, because the least fixpoint never admits it.
- **If an id has no enabled producer under m**: the prices that need it are undefined
  (`UNDEFINED`), and VC3 or VC4(a) reports the cause.
- **If X5 fails for one ingredient under m**: X3 and X4 are not evaluated under m, X2 runs over the
  ingredients the hearth road can make, and the table prints `undefined` in that method's T_fl
  column wherever the set holds the ingredient.
- **If a J1(c) or J2 product exceeds 2⁵³ − 1**: it is computed exactly, and nothing is reported
  unless its inequality fails.
- **If a VC11 perturbation leaves its stat's row range, or pushes a door's speed above
  `SPEED_BASE`**: it is skipped and counted. Content that fails B11 could not ship, so it is no
  margin to test.
- **If the case count exceeds `CASES_MAX`**: every check that reads the case table is one `*`
  instance, `OVER_BOUND` (VF6). Reachability, the per-record checks and the baseline checks
  still run.

### Content shapes

- **If a source is authored disabled and no method opens it**: VC4(b) is an error (disabled in both
  sets), and VC14 warns if a method patches it anyway.
- **If a fightless source makes an ingredient behind a fight-made key item and also makes a
  by-product**: it is on neither the hearth road (X6) nor a fight route (U2), so VC12 reports it.
  This keeps #8 L8's "an error everywhere in the MVP" true.
- **If a combatant is both a route creature and a door opponent, with speed above 100**: B11
  reports it, and VC10 prints "covered by B11".
- **If a route fight is lost** (U1 fails): the reachability findings it causes are printed
  "follows from U1" and stay errors (VR7.4).
- **If a resource is held from the start and made by no source**: it never feeds an input (VR7.3).
  Its consumers fail VC3, and the resource fails VC4(a). A `reached` atom on it still reads the
  starting mark.
- **If a `reached` atom's id starts at or above n**: in a `reveal` it is a VC1 error, and in a
  `need` a VC9(a) warning.
- **If a method patches a source its own set disables**: VC14 warns. In the MVP, #7 H1 forbids `set
  enabled 0`, so only a never-opened source can trigger it.

### Baseline and versions

- **If `F_pub` is `none` and the alias map is not empty**: VC24 is an error, because #11 D11.2
  keeps the map empty before the first public build.
- **If `F_pub` equals `SAVE_FORMAT`**: there is no migration, and VC23 passes over zero instances.
- **If an id was renamed through the alias map**: VC22 compares the old id's gate in the baseline
  with the target's gate now. An atom whose id differs only by that alias is not "added".
- **If a source is new since the baseline**: VC22 has no instance for it. **If it was removed**:
  VC19 applies when its type is protected. Otherwise #11 drops the id on load and logs it, which
  is not a finding.
- **If an alias target was live beside its source in some shipped version**: VC21 is an error,
  because the two saved ids would merge (#11 D11.5).

### What a green run does not show

- **If the content passes every check and plays badly**: nothing here notices. The MVP hypothesis
  is judged by testers (concept, Evidence standard).
- **If an engine function is wrong**: the Validator inherits the error. The function's own unit
  criteria in its owning GDD catch it.
- **If a public build is made without `--release`**: it can ship INCOMPLETE. The release checklist
  owns that step (VR5.5, Open Questions).

*Specialist: `systems-designer` consulted twice, before Section C and after Sections C and D.
Its second pass supplied most of these cases. The rest come from `tools-programmer`'s review
(missing files, `--write-table`, the release flag).*

## Dependencies

Every upstream GDD is Approved, so this GDD makes no provisional assumption about an interface. No
system depends on the Validator: it is a leaf (systems index, Dependency Map). The build and the
release step depend on its exit status.

**Upstream.** Each GDD below already lists "Content validator (#12)" in its own Dependencies table,
so the links run both ways.

| System | Hard or soft | What this GDD needs from it |
|---|---|---|
| Content records and schema (#1) | Hard | `load`, `LoadError`, `checked`, the frozen sets and `registry.rowsFor`; the atom helpers and `changed`; the schema constants; R8.4 and the validator edge cases, which become VC1–VC5, VC9, VC13, VC14, VC19, VC20 and VC22 |
| Modifier pipeline and recompute (#2) | Hard | `effective` as a pure function; P3's stage legality; P6's clamp; P10, which becomes VC6, VC7 and VC8 |
| Resources and caps (#3) | Hard | V1–V7 (K9); base caps and `start` for VR7's closure |
| Activity slot, rest and away time (#4) | Hard | T1–T3 (S11); F5's eta and the pacing-band convention (VR9.2) |
| Combat resolver (#5) | Hard | The resolver, called for the door fights, the route fights (U1) and VC11's perturbed door fights. #5 rates the link "soft" from its side because it needs nothing back. From this side it is hard, since B1–B12 and U1 have no other source of results |
| Forge and proving (#6) | Hard | G1's case-table builder; B1–B13 (G14); the definitions of S7 and S8, implemented here once |
| Methods (#7) | Hard | W1's functions; H1–H5 (W11) |
| Crafting route (#8) | Hard | The hearth road's derivation (Notation); X1–X6 (L8) |
| Fight and dungeon routes (#9) | Hard | U1–U5 (N12) and their "not evaluated" and "follows from" cases; the X3 generator, which imports this GDD's S7 |
| Tending (#10) | Hard | D1's tendable set and D3's entry list `T`; J1–J3 (D8) |
| Save and run lifecycle (#11) | Hard for VC21, VC23 and VC24; their instances are zero before the first public build | D11.2 (`F_pub` and the empty alias map); D11.3 (migrations); D11.5 (the alias rule); the retired-id list |

**Downstream:** none. The interface systems (#13–#15) read no output of this one.

**Outside the game:**

- `bun run build` runs the Validator in-process and stops on any exit status but 0 (VR1.2).
- `bun test` calls `runChecks` with explicit inputs, plus a few command-line runs for the exit
  statuses (VR1.2).
- The release step passes `--release` and appends the shipped build to the baseline (VR5.5,
  VR11.3).
- **The archived attempt's `scripts/validate.ts`** (559 lines, the previous game's gate) still sits
  where `bun run validate` points. It is not this system and none of its rules carry over, the
  180 s cap included (VR9.3). Implementation replaces it (Open Questions).

**ADRs:** this GDD states rules and criteria only (TD finding 8). The representation decisions are
listed under Open Questions, "ADRs required".

## Tuning Knobs

Every threshold a check compares against belongs to the check's owner: `FIRST_CAP_MS` (#3),
`UNIT_FLOOR_MS` (#4), the `OVERGATHER_*` and `FIGHTLESS_*` constants (#6), `METHOD_PATCH_MAX`
(#7), `RUN_FLOOR_MS` (#8), `PREMIUM_MAX_BP` and `FIRST_INGREDIENT_MS` (#9), and the tending
ceilings (#10). This GDD repeats none of them. Its own knobs bound the enumerations and the run.

| Knob | Value | Safe range | Affects | Too high | Too low | Interacts with |
|---|---|---|---|---|---|---|
| `CASES_MAX` | 2,000 | 500–20,000 | How large a case table is enumerated before the case checks report `OVER_BOUND` (VF6) | A run slows past `VALIDATE_TIME_CEILING_MS` before it reports anything: about 90 resolver calls per 30 cases, and 12 times that with VC11 | A realm ladder (#19) trips it early and needs pending entries for checks that could have run | VC11's resolver calls grow with it (VF3); `VALIDATE_TIME_CEILING_MS` |
| `TENDING_K_MAX` | 10 | 6–12 | The largest tendable count whose 2^k sets are enumerated (VF2) | 2^12 = 4,096 sets per method, and every J3 price recomputation with them | Content with more gatherers than this needs #10's decomposition sooner (#10 Open Question 4) | `CASES_MAX`, since VC6 runs C(M, N) × 2^k comparisons |
| `ROOMS_MAX` | 1,000,000 | 10⁴–10⁷ | The largest base cap J2 loops over (VF6) | J2's room loop dominates the run on a large store | A later realm's large store loses J2 to `OVER_BOUND` | #1's `RESOURCE_CAP_MAX` row bound |
| `B1_MARGIN_STEP` | 1 | 1–5 | The δ of VF3: how far one door stat moves in VC11 | Robust content warns, because a big enough step always moves a best, and the warning stops meaning "knife edge" | — (0 would perturb nothing, so the range starts at 1) | B11's `SPEED_BASE` cap skips speed steps above it |
| `VALIDATE_TIME_CEILING_MS` | 2,000 (provisional) | 1,000–10,000 | The wall-time ceiling of `bun run validate` on the shipped content, measured as the median of 5 cold runs (AC-PERF-1). `tools-programmer` expects 300–500 ms for the MVP | A slow Validator stops being run between edits, and content rot returns (rule 59) | Ordinary content growth fails the performance criterion | The three bounds above; #1's ADR 9 (load and check budget) |

The pending list, the committed table and the baseline are files, not knobs. Their contents follow
content and code, never a tuning pass.

## Visual/Audio Requirements

None. The Validator has no player-facing output, so it needs no art, sound or visual effect. The
report and the balance table are plain text for the designer, and their layout is an ADR (Open
Questions, ADR 1 and ADR 5). `art-director` was not consulted, because a Meta system with no
display has nothing for it to direct.

## Game Feel

None for the player. The feel that matters is the designer's loop: edit content, run
`bun run validate`, read a named failure. That loop must stay short enough to run after every
edit, or content rot returns (rule 59). `VALIDATE_TIME_CEILING_MS` (2,000 ms, provisional) holds it
(AC-PERF-1). A failure names its check, method, record and field on one line, so it needs no second
run to locate.

## UI Requirements

None. This system owns no screen, tab, tooltip or notice. The report is a tooling output, not
player UI, and the interface specs (#13–#15) read nothing from it. No `/ux-design` flag is raised.

## Cross-References

| GDD | Sections referenced | What this GDD uses | Nature |
|---|---|---|---|
| `game-concept.md` | Pillars 1–4; Technical Considerations (TD-FEASIBILITY); MVP Definition (item 5, the 30-case table); Evidence standard | The validator split, monotone obtainability after the commit, no bot, what a green run cannot claim | Binding |
| `systems-index.md` | Paragraph 12; row 12; relationship analysis; High-Risk Systems | Scope; the leaf position; revisit reachability at reforge | Binding |
| #1 `content-records-and-schema.md` | R8.1 (`load`, `LoadError`, helpers); R8.2; R8.3 (structural checks stay there); R8.4; R5.4; Edge Cases (validator rules, saves across versions, A6); AC-R8-8, AC-R8-17, AC-E-2; ADRs 5, 7, 8, 9 | Inputs, the R8.4 items as VC1–VC5, the edge-case rules as VC9, VC13, VC14, VC19, VC20, VC22; R8.4 check 2 read as some producer (VR2.4) | Hard dependency |
| #2 `modifier-pipeline-and-recompute.md` | P3.4, P6, P10; Edge Cases; AC-P10-1, AC-E-1, AC-E-2 | `effective`; VC6, VC7, VC8 | Hard dependency |
| #3 `resources-and-caps.md` | K4; K7; K9 (V1–V7); ADR 3 | Scopes and severities; base caps and `start` for the closure; V4 behind the "smallest cap" item | Hard dependency |
| #4 `activity-slot-rest-and-away-time.md` | S11 (T1–T3, pacing bands); F5; Open Question 7 | VR9.2's ceilings; the answer to Open Question 7 | Hard dependency |
| #5 `combat-resolver.md` | The resolver; Degenerate builds | Door, route and perturbed fights; VC10 carries B11's reason to route creatures | Hard dependency |
| #6 `forge-and-proving.md` | G1; G13.2; G14 (B1–B13 and the cascade); S5, S7, S8, S9; Open Question 2; ADR 3 | The case table; VR3.2's edges; VC11, VC15; the single S7 and S8 | Hard dependency |
| #7 `methods.md` | W1; W3; W11 (H1–H5); ADR 2 | H5 waits on B1; VC14's MVP limit through H1 | Hard dependency |
| #8 `crafting-route.md` | Notation (the hearth road); L6; L8 (X1–X6); Open Question 3 | X5 as R8.4 check 2; VC12 for Open Question 3; the table's T_fl | Hard dependency |
| #9 `fight-and-dungeon-routes.md` | N3; N12 (U1–U5); Edge Cases ("follows from"); Open Question 4; ADRs 1, 2 | The answers to Open Question 4(a)–(c); "follows from"; the generator that imports S7 | Hard dependency |
| #10 `tending.md` | D1, D3; D8 (J1–J3, BigInt, the 2^k bound); Open Questions 3, 4; ADR 4 | VR8.2's tending sets; `TENDING_K_MAX`, `ROOMS_MAX` | Hard dependency |
| #11 `save-and-run-lifecycle.md` | D11.2, D11.3, D11.5; Open Question 3; ADR 5 | VC21, VC23, VC24; `F_pub`; the baseline | Hard dependency |
| `research/hundred-days-reference/06-design-rules.md` | Rules 51, 52, 59 | Reachability (VC3), reveals that narrow (VC1), content rot caught by the reachability gate without a bot | Design rule (copy) |
| `research/arcanum-reference/12-design-rules.md` | Rule 74; rules 17 and 18 through their owners' checks | Unfillable stores (VC4); the first cap and bill bands run as #3 V7 and V2, #8 X2 and #9 U5 | Design rule (copy) |
| `.claude/rules/skill-authoring.md` | Obligations 1–5 | "Not evaluated" outranks a pass and never an error; no permissive default; announced skips; derived coverage | Project rule |

## Acceptance Criteria

**Tags:** [unit] calls `runChecks` directly; [cli] runs a real `bun run validate` process; [Fx]
uses a mutation of `ref`; [shipped] uses the shipped content; [perf] is timed. "NE" means not
evaluated. The owners' own `[validator, Fx]` criteria (#3, #4, #6–#10) stay with them. The
criteria below cover the runner, the VC checks and the upstream criteria blocked on #12.

### Fixtures

- **`ref`** is a small content set that passes every built check, with its own pending list for
  the unbuilt ones. It has:
  - methods `m_a` and `m_b`;
  - one realm of 4 ingredients, `i1`–`i4`, forging 2, with 2 doors;
  - at least 2 enabled sources per ingredient under each method, one of them fightless;
  - 2 tendable gatherers;
  - the resources `wood` and `ore` and one key item;
  - one fight route.
- **A mutation** is at most 5 operations from this list: set or delete a field, add or remove a
  record or a patch entry, override a constant (VR1.1).
- Every criterion asserts both halves: `ref` passes the check, and the mutation fails it.

### Runner and registry

- **AC-VR1-1** [unit] **GIVEN** `fs`, `Date`, `process.env` and `Math.random` stubbed to throw,
  **WHEN** `runChecks(ref)` runs twice, **THEN** no stub fires and the two reports are
  byte-identical. The same holds on a deep-frozen `ref`.
- **AC-VR1-2** [cli] **GIVEN** content that fails `load` and a malformed pending list, **WHEN**
  `bun run validate --write-table` runs, **THEN** it exits 1, prints one `LoadError` line (step,
  record, field, cause) and the count of checks not run, and writes nothing.
- **AC-VR2-a** [unit] **GIVEN** a test registry with a duplicate id, a `requires` edge naming no
  check, or a two-check cycle, **WHEN** run, **THEN** each case exits 2 with no verdict.
- **AC-VR2-b** [unit] **GIVEN** the fixture table, **WHEN** the coverage test runs, **THEN**:
  - every built check has a mutation that makes it warn or error, and `ref` passes it;
  - a check with a precondition also has a mutation that makes it NE;
  - `NOT_BUILT` checks are exempt;
  - a registered, built check with no fixture fails the test, naming the check.
- **AC-VR2-c** [unit] **GIVEN** the owner GDDs' check tables, **WHEN** the drift test runs,
  **THEN** every id there is registered and every non-VC registry id appears in one. Renaming
  `| B13 |` in a copy of #6 fails it.
- **AC-VR3-1** [unit] **GIVEN** a test registry that forces check A to error, one case per row of
  the VR3.2 table, **WHEN** run, **THEN** each listed dependent is NE `PRECONDITION(A, instance)`
  and unlisted checks still run. **GIVEN** a case-table builder that throws, **THEN** one error
  is reported on B1's `*` instance with the cause "internal: case table".
- **AC-VR3-2** [unit] **GIVEN** a test check that throws, **WHEN** run, **THEN** its instance is an
  error with the cause "internal", and no pending entry can cover it. A root error prints before
  its NE dependents, and the summary counts one root.
- **AC-VR4-1** [unit] **GIVEN** instance sets, **THEN** the worst status wins: {error, NE, warning,
  pass} gives error; {NE, warning, pass} gives NE; {warning, pass} gives warning. A universal
  check over zero instances passes and prints "0 instances". Each of the ten existential checks of
  VR4.4 fails on an empty scope.
- **AC-VR4-2** [unit] **GIVEN** a tending set {b, a} and findings on ids `ore_a` and `oreb`,
  **THEN** the set keys as `a`, `b`, the empty set sorts first, and the findings print in UTF-16
  code-unit order, not locale order.

### Verdict, exit status and the pending list

- **AC-VR5-1** [cli] **GIVEN** each case below, **WHEN** `bun run validate` runs, **THEN** the
  verdict and exit status are as listed. The last line holds the verdict word, the error roots
  and instances, the NE, warning and pass counts and the exit status. An INCOMPLETE run never
  prints "PASS", and `bun run build` stops on any status but 0.

  | Case | Verdict, exit |
  |---|---|
  | `ref`; or `ref` with warnings only | PASS, 0 |
  | Every NE root matched by an entry, dependents covered (VF4's U3 entry) | INCOMPLETE, 0 |
  | The same under `--release`; or with one entry removed; or with the pending file missing | INCOMPLETE, 1 |
  | Any error (VC17 and VC18 included), with or without NE | FAIL, 1 |
  | `load` throws and the pending file is also bad; or the table file is missing (VC17) | FAIL, 1 |
  | A pending, table or baseline file unreadable, or a pending or baseline file malformed; the registry fails VR2-a; `--write-table` under `--release`; any of these together with a content error | no verdict, 2 |

- **AC-VR6-1** [Fx] **GIVEN** each of these pending entries, **WHEN** run, **THEN** each is a VC18
  error naming the entry: an unknown check; the reason `PRECONDITION`; an instance the run
  enumerates nowhere; a duplicate; a prefix entry that another entry already covers; a stale entry
  (every instance it covers now passes, warns, errors or is NE for another reason).
- **AC-VR6-2** [unit] **GIVEN** U3 NE for every ingredient under both methods, **THEN**:
  - the entry `ember_breath` covers U3 under Ember Breath only;
  - `ember` covers nothing, and VC18 reports it;
  - `*` covers only a `*` instance;
  - the blocker text is never matched;
  - a warning-severity NE still needs an entry for exit 0.
- **AC-VR6-3** [unit] **GIVEN** a prefix entry over 6 instances of which 5 now pass, **WHEN** run,
  **THEN** those 5 report passes, the entry stays live and the run exits 0. **WHEN** the sixth also
  evaluates, **THEN** VC18 reports the entry stale.

### Reachability

- **AC-VR7-1** [Fx] **GIVEN** each mutation, **WHEN** run, **THEN** it is the named error, naming
  the method, the record and the first unmet cause (gate atoms, then inputs, then a lost fight):
  - a source gated on an atom nothing raises: VC3;
  - two sources that feed only each other: VC3 on both, VC4(a) on their output, and the prices
    that need it NE `UNDEFINED`;
  - `ore` held at start with no producer and one consumer: VC3 on the consumer and VC4(a) on `ore`.
    A source gated only by `need reached(ore, 1)` is in R, and VC9(a) warns on it;
  - an ingredient whose sources are all dead: VC3 names the ingredient.
- **AC-VR7-2** [Fx] **GIVEN** a route fight U1 loses, **WHEN** run, **THEN** the VC3 findings it
  causes print "follows from U1", stay errors and count as one root. **GIVEN** U1 NE `NOT_BUILT`
  instead, **THEN** those findings are NE `PRECONDITION(U1)`. A gate dead for its own reason stays
  a plain VC3 error.
- **AC-VR7-3** [Fx] **GIVEN** a test schema with a Foundation row, and separately a tending row, on
  each of `source.enabled`, `.reveal`, `.need`, `.inputs` and `.fights` (10 cases), **WHEN** run,
  **THEN** VC16 is an error and VC3 and VC4(a) are NE `PRECONDITION(VC16)`.

### Enumeration, bounds and arithmetic

- **AC-VR8-1** [shipped] **GIVEN** a spy on the resolver and on `effective`, **WHEN** run, **THEN**
  it sees 30 cases, 90 door fights, 16 tending pairs, 240 seal comparisons and 720 VC11 resolver
  calls, and VC6 finds no difference. This also closes #2 AC-P10-1.
- **AC-VF6-1** [Fx, constants overridden] **GIVEN** each bound reached exactly, **THEN** it runs;
  **GIVEN** the bound plus 1, **THEN**:
  - `CASES_MAX`: every case-scope check and case-table reader is one `*` NE `OVER_BOUND`, while
    reachability, the per-record checks and the baseline checks still run;
  - `TENDING_K_MAX` (1,024 sets at the bound): that method's tending-scope instances become one `*`
    NE, and J1 and J2 still run;
  - `ROOMS_MAX`: that store's J2 instance is NE.

  VF1's counts check as C(10, 5) = 252, and 12 ingredients forging 6 under 4 methods as 3,696.
- **AC-VF3-1** [unit] **GIVEN** `ref` with mid-range door stats, **THEN** each method has 16
  perturbations and 96 resolver calls (D = 2). A stat at its row minimum skips −1, and a speed at
  `SPEED_BASE` skips +1. Skips are counted in the report.
- **AC-VC11-1** [Fx] **GIVEN** a best that is unique under every step, **THEN** VC11 passes.
  **GIVEN** a step that ties two makeups, **THEN** VC11 warns naming the door, stat and δ, and the
  run stays PASS with exit 0. **GIVEN** a step that moves the best to one other makeup, **THEN**
  VC11 passes with the note "best changes to X".
- **AC-VF5-1** [unit] **THEN** `PRICE_MAX` is 900,719,925,474 at `FIGHTLESS_CEILING_BP` 10,000,
  450,359,962,737 at 20,000 and 300,239,975,158 at 30,000. VC15 passes at `PRICE_MAX` and is an
  error at `PRICE_MAX` + 1, naming the source and method.
- **AC-VR9-1** [Fx] **GIVEN** a J1(c) or J2 product above 2⁵³ − 1 whose two sides differ by 1,
  **THEN** exact arithmetic decides the check. **GIVEN** an id with no enabled producer, or a price
  loop, **THEN** B10, U3 and X4 are NE `UNDEFINED`, never a pass, 0 or infinity. **GIVEN** a value
  above 2⁵³ − 1 that would be passed into the resolver, **THEN** that instance is an error with the
  cause "unsafe".

### The balance table

- **AC-VR10-1** [shipped] **THEN** the generated table holds two blocks of 15 rows, ordered by seals
  (highest first) then makeup ids; it marks B1's best, B3's plain-sum pick and H5's cheapest; it
  has one summary line per method; and its invariance line reads "240 of 240".
- **AC-VR10-2** [cli] **GIVEN** the table generated under another working directory, `TZ` and
  `LANG`, **THEN** the bytes are equal, with LF only, one final newline, and no trailing space,
  timestamp, path or fingerprint. An edit to a display name leaves the table equal.
- **AC-VR10-3** [Fx] **GIVEN** a committed copy with one digit changed, a trailing space, CRLF line
  ends, or no file at all, **THEN** VC17 is an error naming the first differing line (or the
  missing file) and `bun run validate --write-table`.
- **AC-VR10-4** [Fx] **GIVEN** X5 failing, a B1 tie, and VC6 not run, **THEN** the table prints
  `undefined` in T_fl, `tied: a, b` in place of the best, and `not evaluated` on the invariance
  line, and VC17 compares them as text.
- **AC-VR10-5** [cli] **GIVEN** `--write-table`, **THEN** a rerun passes VC17. A default run never
  writes. `--release --write-table` exits 2 and writes nothing. When the case table cannot be
  built, nothing is written and VC17 is NE.

### This GDD's checks

- **AC-VC-1** [Fx] **GIVEN** `ref` with each row's mutation, **WHEN** run, **THEN** the row's check
  reports the row's result, naming the method (where it applies) and the record, and `ref` passes
  that check. VC3, VC4(a), VC11 and VC15–VC18 are covered above.

  | Check | Mutation | Result |
  |---|---|---|
  | VC1 | `dig.reveal` = `reached(wood, 3)`, with `wood.start` 3 (2 passes) | error |
  | VC2 | One producer of `i1` left under `m_a` | error |
  | VC4(b) | A source disabled in both frozen sets | error |
  | VC5(a) | Both methods patch only `smelt_ore.duration`. One `contrib` and one `enabled` patch each passes. This closes #1 AC-R8-8 | error per method |
  | VC5(b) | One method; or two methods with equal frozen sets | error |
  | VC6 | A test schema with a tending row on `ingredient.contrib` | error per (m, S, makeup) |
  | VC7 | A stage-illegal Foundation entry; a stage-illegal tending entry | error |
  | VC8 | (a) a tending `add 0`; (b) a stage entry on a disabled source; (c) a stage result past its row's range | warning each |
  | VC9 | (a) a start-true `reached` atom in a `need`; (b) `committed()` in a `need`; (c) a `need` whose atoms its `reveal` implies | warning each |
  | VC10 | A route combatant with speed 101 (100 passes). One that is also a door opponent prints "covered by B11" | error |
  | VC12 | A source with outputs {key item, `wood`}; an ingredient plus a by-product on a source neither on the hearth road nor a fight route. On the hearth road it prints "covered by X6", on a fight source "covered by U2" | error |
  | VC13 | A source with empty inputs and outputs; a source whose outputs equal its inputs | error |
  | VC14 | `m_a` patches a source its own set disables | warning |
  | VC19 | A baseline ingredient absent now, with no alias (with an alias it passes) | error |
  | VC20 | A live id on the retired-id list | error |
  | VC21 | An alias target live beside its source in a shipped version. This closes #11 AC-D11-3's merge half | error |
  | VC22 | A threshold raised; an atom added (a change by alias only gives none) | warning |
  | VC23 | `F_pub` 3, `SAVE_FORMAT` 5, a fixture for 3 → 4 only, naming 4 → 5 (with `F_pub` = `SAVE_FORMAT`, 0 instances) | error |
  | VC24 | `F_pub` absent; `none` with a non-empty alias map; a format with no baseline. Each makes VC19–VC23 NE. With `none`, VC19–VC23 print "0 instances: before the first public build" | error |

### Upstream criteria closed here

- **#1 AC-R8-17:** **GIVEN** three variants of `ref`, **WHEN** run, **THEN** VC2, X5 and B10 are
  errors naming the method and ingredient. The variants: the only fightless source disabled while
  two fight sources remain; one enabled source left; the fightless source past the ceiling. A
  fourth variant, which disables a recipe while another fightless source stays within the ceiling,
  passes.
- **#1 AC-E-2:** the VC1, VC4(b), VC5, VC9, VC13 and VC14 rows of AC-VC-1.
- **#2 AC-P10-1:** AC-VR8-1. **#2 AC-E-1:** VC8(a). **#2 AC-E-2:** VC7 passes on the shipped
  content.

### Performance

- **AC-PERF-1** [perf, shipped] **GIVEN** 5 cold runs, each a new `bun` process with no warm cache,
  **WHEN** each `bun run validate` is timed from spawn to exit, **THEN** the median is at most
  `VALIDATE_TIME_CEILING_MS` (2,000). Wall time is noisy, so AC-VR8-1's call counts are the stable
  half of this budget.

### Checked by review, not by test

- `--write-table` writes through a temporary file and a rename.
- New pending entries are reviewed (VR6.3).
- A public build passes `--release` (VR5.5).
- VR7.5's coverage argument beyond the premise VC16 checks.
- The report's layout (#1 ADR 8).

*Specialist: `qa-lead` drafted these criteria and flagged ten points that were untestable or
ambiguous as written. Each was fixed in Sections C and D:*

- *test hooks for the registry and constants (VR1.1);*
- *segment prefixes (VR4.5);*
- *exit 2's precedence (VR5.2);*
- *the "unsafe" consumers (VR9.4);*
- *VC11's note on a pass (VR8.4);*
- *VR2-c's row rule;*
- *one ordering (VR10.2);*
- *VF6's example;*
- *`ref` for VR2-b;*
- *call counts beside wall time (AC-PERF-1).*

## Open Questions

**Questions from other GDDs, answered here:**

| Question | Answer | Where |
|---|---|---|
| #9 Open Question 4(a): what exit status does "not evaluated" give? | INCOMPLETE, never PASS. It exits 0 only when every not-evaluated root is on the pending list and the run is not `--release`; a stale entry is an error (designer, 2026-11-21) | VR5, VR6, VF4 |
| #9 Open Question 4(b): the archived 180 s cap | Not inherited. No timed-action ceiling exists | VR9.3 |
| #9 Open Question 4(c): should the unchecked content facts become checks? | Creature speed does, as VC10. The bill families and N4.1's +3 margin stay unchecked, because U1 catches every outcome they could change (designer, 2026-11-21) | VC10 |
| #6 Open Question 2: should B1 require a margin? | Yes, as a warning: VC11, ±1 on one door stat (designer, 2026-11-21). S9's provisional doors trip it (Furnace Gate vigor 191) | VC11, VF3 |
| #8 Open Question 3: should X6 cover every cap-1 output? | Yes. VC12 covers key-item makes and the ingredient sources X6 and U2 leave out (designer, 2026-11-21) | VC12 |
| #4 Open Question 7: do #12's pacing floors bind? | No MVP check is a floor timed from the commit. Price checks read activity time, so rest before the commit keeps banking (designer, 2026-11-21) | VR9.1, VR9.2 |
| #10 Open Question 3: do J3's B9, H5 and X3 hold under tending? | J3 computes them on every non-empty tending set. The answer arrives with the implementation's first run, not with this GDD | VR8.2 |

**This GDD's open questions:**

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | Who makes sure every public build runs with `--release` (VR5.5)? Put it in the release checklist, beside #11 Open Question 3's `F_pub` | Release manager, with the designer | Before the first public build |
| 2 | Shipped warnings: should the set of warnings on the shipped content be snapshotted, so that a new warning is noticed and not just counted? VC11 already warns on S9's doors | Designer, with `tools-programmer` | First implementation of the runner |
| 3 | VC11 warns on the provisional doors. Retune them with the table generator, never by hand, until the best makeup survives ±1, or accept the warning | Designer, with Forge and proving (#6) | Before the content is final |
| 4 | The archived attempt's `scripts/validate.ts` still answers `bun run validate`, and `bun test` did not finish within 120 s on this tree (`tools-programmer`). Replace the script, and find the cause, before this Validator joins the test run | Technical Director | Start of implementation |
| 5 | The concept's Technical Considerations name Vite, Vitest and Node.js, while `package.json` and the project rules name Bun. The Validator's entry point needs one runtime (ADR 2) | Technical Director | `/create-architecture` |
| 6 | With more than two methods, #6 B2 has no "other method" (Edge Cases). #6 must restate it for the third method | Forge and proving (#6), Reforge (#16) | Vertical Slice |
| 7 | A post-commit method switch changes `enabled` after the commit and breaks VR7.5's coverage argument. Reforge must restate it, or reachability must start from every post-switch state | Reforge (#16) | Vertical Slice |
| 8 | Past `TENDING_K_MAX`, `ROOMS_MAX` or `CASES_MAX`, the enumerations need decomposition (#10 Open Question 4) or a restated case space | Tending (#10), Realm ladder (#19) | Alpha |

**ADRs required** (representation this GDD leaves out, per TD finding 8):

1. **The report.** It covers the finding and report format, the verdict words, the exit statuses,
   the instance key's grammar (separator, the empty set's spelling) and the last line. It extends
   #1's ADR 8, and folds in #3's ADR 3, #6's ADR 3, #7's ADR 2, #9's ADR 1 and #10's ADR 4.
2. **The entry point.** It covers `runChecks`, the command line and the build hook, the file
   location, and the dependency direction (the Validator imports the rules core, never the
   reverse). It also covers replacing the archived `scripts/validate.ts` (Open Questions 4, 5).
3. **The check registry.** It covers the entry shape, scopes, severities, the `requires` edges, the
   covered-by items, and VR2-c's parser.
4. **The pending list.** It covers the file format, the key and the blocker note.
5. **The balance table.** It covers the path, the layout and `--write-table`.
6. **Fixtures.** It covers `ref`, the mutation operations, and how a case table, schema, registry
   and constants are injected.
7. **Exact integers.** It covers where BigInt starts and stops, and the decimal-string output. It
   pairs with #1's ADR 5.
8. **The baseline.** It covers its format and the release step that appends to it, with #1's ADR 7
   and #11's ADR 5.
9. **The performance budget.** It covers `VALIDATE_TIME_CEILING_MS` and the cold-run method, with
   #1's ADR 9.
