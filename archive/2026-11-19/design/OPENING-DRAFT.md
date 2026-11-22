First arc working design: a foothold and a first foundation

Status: First-arc design checkpoint. Direction, core rules, and activity package accepted; detailed design in progress, 16 October 2026. Accepted decisions are recorded in [ADR 0003](../docs/architecture/adr-0003-opening-anchors.md). The village, both investigations, their distinct preparation needs, and their broad reward roles are accepted for development into the first playable arc. The accepted activity package comprises village errands, perception practice, field equipment, an optional home practice upgrade, both investigations, and method practice leading to the shared foundation. Exact names, effects, costs, durations, readiness requirements, and individual scenes below remain working proposals where not explicitly accepted.

**Accepted frame**

An ordinary mortal begins in a village at the edge of the wilds, where cultivation is known but distant. Home represents growing independence. An incomplete method teaches perception but not stable cultivation; the first unmistakable qi experience reveals hidden possibilities early in the first session.

The player chooses among a small set of useful leads and reconstructs reliable practice through fieldwork. Expeditions follow a chosen destination and purpose between visits, pausing when a discovery creates a meaningful new choice. One primary activity runs at a time, with home improvements benefiting that activity. Home activities stop at a chosen objective and pause for the player's next decision. The first major breakthrough establishes a shared foundation without choosing a path, and a deliberate attempt succeeds once prepared. Completing every lead is unnecessary.

Target pacing is a few short visits, roughly within the first day at ordinary play speed. This is an untested design target, not a deadline. Exact durations and offline processing implementation remain open; the accepted bank and acceleration rules are recorded in [ADR 0007](../docs/architecture/adr-0007-away-time-and-acceleration.md).

The accepted opening uses village work and home improvements to support two investigations: the damaged stream channel and the sheltered hollow. Either can establish the first foundation; the other remains worth exploring afterward. The channel provides a useful home arrangement, while the hollow provides a technique useful in the field. Their exact effects remain to be designed.

Knowledge sets clear limits on practice: the fragment and discoveries determine what can currently be learned, and new understanding opens further growth or a new practice. Ordinary expeditions depend on preparation and access through equipment, techniques, and understood obstacles, with time and lifespan as their ongoing costs. The opening has no additional energy or food meter.

An ordinary investigation obstacle pauses the outing with a useful finding about the obstacle or missing understanding. Discoveries are preserved; the cost is time already spent, and the next preparation is the player's decision. If lifespan is exhausted before the first breakthrough, retry instead restores the opening character and world state exactly, with no retained discoveries, skills, or purchases. The current time-bank balance is retained under [ADR 0007](../docs/architecture/adr-0007-away-time-and-acceleration.md); spent banked time stays spent.

**Opening flow: working details**

| Stage | What happens | A useful player choice |
|---|---|---|
| Establish a foothold | A modest home and village work make independence tangible. The protagonist acquires the incomplete method; its provenance remains open. Trying it reveals qi early. | Put the next stretch of effort into practical means or perception practice. Show the promise of cultivation before asking for substantial ordinary work. |
| Choose an investigation | Perception reveals two promising local phenomena. Their observations explain different preparation needs. | Prepare to reach a clear phenomenon in awkward terrain, or improve perception to understand a faint phenomenon at an accessible site. |
| Bring a finding home | The chosen outing produces knowledge that can be put into practice. A discovery that creates a meaningful new choice pauses the outing. | Develop the finding into a working exercise, improve preparation for a further investigation, or pursue the other lead for its benefits. |
| Establish a foundation | Practice and further investigation make an exercise reliable. The character is ready for a deliberate first breakthrough. | Attempt it when ready or explore further first. The breakthrough does not require completing both investigations. |

These stages describe progress, not a mandatory number of visits or a fixed sequence of every action.

**Activities supporting the discoveries**

| Activity role | Purpose and continuing value |
|---|---|
| Village work | Earn the means for useful equipment and home improvements. The benefit of a purchase should be apparent before the player spends time working toward it. The currency, earning rates, and purchase costs remain open; useful paid work throughout the campaign and currency plus selected crafting materials are accepted in [ADR 0009](../docs/architecture/adr-0009-work-and-crafting-resources.md). |
| Practise perception | Develop the perception supported by current knowledge, up to its visible limit. Field observations can expand that knowledge and make more demanding perception practice possible. |
| Prepare | Acquire or make a useful aid, improve the home, or address an identified obstacle. Preparation follows a chosen purpose; it is not a generic bar every outing must fill. |
| Investigate a known site | Carry out established observation work under the chosen expedition purpose. New information changes possibilities; repeated work need not ask for another click each cycle. |
| Practise a reconstructed method | Turn field understanding into an exercise the protagonist can sustain. This is an expanded capability earned through discovery. |

For example, with the channel lead visible, the player might work toward equipment that makes its direct approach manageable. Alternatively, they might spend that time practising perception for the more accessible hollow. Only the selected primary activity advances. A home improvement supports that activity rather than adding another simultaneous worker.

Home activities stop at the objective the player selects. For example, working toward the means for a useful piece of equipment stops when that target is reached; practising toward a known milestone stops at that milestone. The player then decides what to do next. The pause consumes no activity-based lifespan under the accepted age rule. How objectives are selected and presented, and exact stopping boundaries, still need design.

**Accepted activity package: proposed implementation in play**

The activity package is accepted. Names, exact effects, and boundaries in this table remain working details; agreeing to the package does not lock every effect or scene. The design recommendation is to use the shared activities above across both investigations.

| Proposed content | What it changes | Boundary |
|---|---|---|
| Village errands | Provide earnings toward a known purchase, such as field equipment or a home improvement. | Stop at the selected earnings objective; earning enough does not automatically make the purchase. Job variety and currency remain open. |
| Practise the fragment | Establish basic perception and develop it as far as current understanding allows. | Enough for an initial useful survey of either lead. It cannot teach stable cultivation by repetition alone. |
| Field equipment | A modest set of practical tools supports the channel approach. Cord and stakes are illustrative possibilities. | Available through ordinary village means, without cultivation or either investigation reward. Exact items and prices remain open. |
| Quiet practice corner | An optional home improvement reduces time spent on relevant home practice. | Does not raise a knowledge limit or become a prerequisite for either route. Its benefit must justify the work invested in it. |
| Channel arrangement | The channel discovery unlocks an exercise supported by an arrangement at home. The arrangement continues to improve suitable home practice afterward. | Distinct from the optional general home improvement. Foundation removes dependence on the support without making its benefit disappear. |
| Steady-attention exercise | The hollow discovery unlocks a complete foundational exercise and develops a technique for distinguishing faint or disturbed traces in the field. | The shared foundation does not automatically grant this particular perceptual skill. Exact later applications remain to be designed. |
| Practise the reconstructed exercise | Develop either discovered exercise toward the same shared readiness capability. | Each exercise must suffice independently; readiness must not silently require both investigation completions. |

Objectives should refer to things the player has encountered or understands. A practice limit can explain what the current exercise cannot yet achieve without revealing an undiscovered location's solution. These presentation rules remain proposals.

**Two accepted investigations: effects still in design**

| Lead | Understandable obstacle | Proposed finding brought home | Continuing benefit to develop |
|---|---|---|---|
| Damaged stream channel | Qi is comparatively clear, but reaching a useful observation point requires practical preparation or a longer approach. | Its pattern suggests a small arrangement that steadies perception and permits sustained practice. Further observation helps reconstruct circulation. | A useful home arrangement supporting cultivation practice. Exact effect remains open. |
| Sheltered hollow | The site is easier to reach, but its faint qi requires more dependable perception to understand. | Observing what remains steady through small disturbances suggests an attention and breathing exercise. Practice and field observation develop it into reliable circulation. | A technique that helps maintain perception under distracting field conditions. Exact effect remains open. |

Either investigation supports a complete route to the same foundation. Their tradeoff is how the player prepares and which additional capability they develop along the way. They are not elemental paths or permanent specialization choices. The other investigation remains available for useful discoveries after the breakthrough. Their relative effort and benefits need validation; neither should be strictly superior under all starting circumstances.

The channel could unfold as: notice qi in an ordinary stream stone, investigate the channel, reproduce a useful pattern at home, practise, revisit with improved perception, and reconstruct the full exercise. This is one illustrative route, not a recipe requiring every object or scene. Observations should explain promising approaches without requiring the player to guess a hidden puzzle solution.

**Proposed progression through each lead**

| Step | Channel route | Hollow route |
|---|---|---|
| Identify a promising phenomenon | Basic fragment perception reveals enough to identify the channel lead and its practical access problem. | Basic fragment perception supports an initial visit that reveals the faint phenomenon and what further observation requires. |
| Develop the means to investigate | Ordinary work and field preparation make a useful observation point accessible. | The initial field observation expands what perception practice can teach. Practise within this new limit, then return. |
| Change home practice | Partial observations suggest the arrangement and a new exercise; practising it supports a more informed investigation. | Clearer observations suggest the attention exercise; practising it supports a more informed investigation. |
| Reconstruct the working method | Further observation and practice complete a viable exercise. | Further observation and practice complete a viable exercise. |
| Become ready | Practise the reconstructed exercise until the common readiness capability is established. | Use the same readiness structure with this exercise. |

The hollow's higher perception requirement must come after an accessible observation that supplies the necessary knowledge. Channel preparation must remain available without completing the hollow. Neither route requires the other route's reward, and both remain useful and available after foundation. These are consistency requirements of offering two viable routes under the accepted knowledge-limit rule.

**Proposed readiness and payoff**

Readiness would mean reconstructing a workable exercise through fieldwork and demonstrating through practice that the character can sustain it. The remaining preparation should be visible and achievable, with the ready state clear before the deliberate attempt. Exact requirements and any material preparation remain open. The accepted rule is that this first attempt succeeds once ready. Later progression mixes prepared milestones and defining trials whose outcomes depend on preparation and choices, with no separate random failure roll; see [ADR 0005](../docs/architecture/adr-0005-campaign-progression.md). Concrete trial placements and requirements remain open.

The proposed transformation is internal circulation that no longer depends on the opening exercise's external support, making reliable perception available on further journeys. Longer life and a retry milestone follow the accepted broad role of major breakthroughs; values and checkpoint capture timing remain open. New leads would introduce enough alternatives for a later informed path commitment.

The direction immediately after this breakthrough is accepted: new abilities open local leads and first contacts with cultivators, while the village remains the base. This gives the opening's home and discoveries continuing relevance. Later path commitment defines deepest advancement and signature abilities while leaving compatible supporting techniques learnable elsewhere. [ADR 0004](../docs/architecture/adr-0004-wider-world-and-paths.md) records these decisions; exact abilities and encounters remain to be designed.

**Scope and next decisions**

The accepted opening centers on one village/home, the two nearby investigation sites, the accepted activity package, and the first breakthrough. The exact number of jobs, purchases, exercises, and improvements within that package remains open. The design recommendation is to share activity and readiness rules across both investigations; separate minigames, bespoke automation, or a terrain engine are not requirements of this outline.

This is a design checkpoint for the opening direction, rules, and activity package. The [path working design](PATHS-DRAFT.md) records a second checkpoint: three paths and broad retraining rules. The [campaign outline](CAMPAIGN-OUTLINE.md) brings the accepted full-campaign scope together and marks the proposed later-stage functions. Opening details still to refine include method acquisition, exact improvement and equipment effects, routine objective selection and presentation, action durations, expedition stop/resume behavior, and exact breakthrough payoff. The desktop-first browser target and text/activity-panel emphasis are now accepted. Exact content counts and implementation technology remain open.
