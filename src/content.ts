import shared from "./data/shared.json";
import opening from "./data/opening.json";
import ridge from "./data/ridge.json";
import basin from "./data/basin.json";
import type { GameRecord } from "./types";

/** The browser, route runner and validator all consume these same source records. */
export const records = [...shared, ...opening, ...ridge, ...basin] as GameRecord[];
export const recordById = new Map(records.map((record) => [record.id, record]));

/**
 * One moment of the story. Beats run in progression order; the last whose `when` holds is the one shown.
 * `focus` names the records the beat's `next` line points at, so the grid can mark them.
 */
export interface StoryBeat { id: string; when: string; title: string; text: string; next: string; focus: string[] }

/** Where the player stands. Scenes run in progression order; the last whose `when` holds frames the shell. */
export interface Scene { id: string; when: string; place: string; location: string; title: string; introduction: string; bound: string }

/** A route key in the player's words: what holding a `t_` tag says about the method (ADR 0024). */
export interface RouteKey { name: string; desc: string }

export const routeKeys: Record<string, RouteKey> = {
  t_channel: { name: "Channel reading", desc: "Leaf eight's turn read as a current to be carried." },
  t_hollow: { name: "Hollow reading", desc: "Leaf eight's turn read as a current to be let settle." },
  t_school_earth: { name: "Earth school", desc: "A discipline that comes from stone and moving ground." },
  t_school_body: { name: "Body school", desc: "A discipline that comes from breath and the frame that carries it." },
  t_school_sword: { name: "Sword school", desc: "A discipline that meets what comes up the path with an edge of intent." },
  t_school_formation: { name: "Formation school", desc: "A discipline that holds a small place still inside a fixed layout." },
  t_furnished: { name: "Furnished home", desc: "A furnishing beyond the first: a bed, a plot or a strongbox that wants a home of your own." },
  t_school_pill: { name: "Pill school", desc: "A discipline that draws what a root holds out of it over a careful fire." },
  t_deep_body: { name: "Body, deepened", desc: "A deep method of the body school held: the marrow tempered or the load carried without rest." },
  t_deep_sword: { name: "Sword, deepened", desc: "A deep method of the sword school held: the knot severed or the intent sent ahead." },
  t_deep_earth: { name: "Earth, deepened", desc: "A deep method of the earth school held: rooted to the vein or listening for water." },
  t_deep_formation: { name: "Formation, deepened", desc: "A deep method of the formation school held: the array anchored or the threshold warded." },
  t_deep_pill: { name: "Pill, deepened", desc: "A deep method of the pill school held: the essence drawn or the fire tempered." },
  t_leaf: { name: "A leaf of the slip", desc: "One of the slip's missing leaves recovered: Shu's three, the relay keeper's, the shelter's or Han's." },
  t_commission: { name: "A commission done", desc: "A piece of work done for Keeper Han and paid for." },
};

export const openingContext: { title: string; place: string; scenes: Scene[]; beats: StoryBeat[] } = {
  title: "Lowbridge",
  place: "Hayloft above Miller Wen’s barn",
  scenes: [
    { id: "village", when: "true", place: "Lowbridge", title: "A life in Lowbridge", bound: "Village to Foundation",
      location: "The mill stream meets the ferry road. Beyond the barns, the water runs toward the wilds.",
      introduction: "The mill stream meets the ferry road here. Wen has sacks to move; Granny Shu has herbs to sort. Beyond the barns, the water runs through a broken channel toward the wilds." },
    { id: "foundation", when: "g.foundation > 0", place: "The ferry road", title: "Past Foundation", bound: "Foundation to the ridge",
      location: "The ferry road runs down past the mill to the landing. From there the old porters' path climbs toward Old Ridge.",
      introduction: "The slip's method is your own now. Haulage to the ferry pays better than Wen's sacks, and from the landing the porters' path climbs to Old Ridge, where the teachings that choose a First Direction are found." },
    { id: "ridge", when: "g.ridge_outskirts > 0", place: "Old Ridge", title: "On Old Ridge", bound: "The ridge to the waystation",
      location: "Two minutes up the porters' path, the collapsed hut below Old Ridge. Hard ground draws on Strain.",
      introduction: "Lowbridge lies below the porters' path. On the ridge the porter's notes teach four spheres to carry the method into; any one carried to four takes the First Direction, and a held method of its school carries you to the waystation." },
    { id: "waystation", when: "g.waystation > 0", place: "The ridge waystation", title: "At the waystation", bound: "The waystation",
      location: "The old porters' waystation on Old Ridge, reached by your own direction.",
      introduction: "The keeper has stores to shift and ledgers that name a basin beyond the ridge. The method you held brought you here; four leads wait on the board." },
    { id: "second_direction", when: "g.second_direction > 0", place: "The basin road", title: "The Second Direction", bound: "The Second Direction to Reedmarket",
      location: "The terrace above the slide, a day's carry from the waystation to the basin's edge.",
      introduction: "The Second Direction is taken and named from what you hold. The terrace the route records showed runs to Reedmarket, the market settlement on the Cloudwell basin's edge." },
    { id: "reedmarket", when: "g.reedmarket > 0", place: "Reedmarket", title: "Reedmarket", bound: "Reedmarket",
      location: "The market settlement on the Cloudwell basin's edge, where the terrace comes down.",
      introduction: "Reedmarket's porters pay better than Han and its stalls buy pale root. The three leaves the ledger could not place are somewhere in the basin." },
  ],
  beats: [
    { id: "start", when: "true", title: "A hayloft and two jobs",
      text: "You sleep in the rafters above Wen's barn and owe him for it. Wen pays by the sack. Granny Shu pays in bundles and opinions. Between them you can keep the rafters. Twice a year a cultivator rides the ferry across without paying, and the ferryman never asks.",
      next: "Haul sacks for Wen and sort herbs for Shu. She notices quick hands after three sortings.", focus: ["mill_work", "sort_herbs"] },
    { id: "apprentice_offer", when: "g.sort_herbs.reps >= 3 && g.shu_apprentice < 1", title: "Shu is watching your hands",
      text: "She has sorted faster than you for sixty years and says so. She also has a loft corner going spare and a thing in her apron she keeps turning over.",
      next: "Five coin buys the morning apprenticeship, and whatever she is not saying.", focus: ["shu_apprentice"] },
    { id: "slip_offer", when: "g.shu_apprentice > 0 && g.jade_slip < 1", title: "A cracked slip nobody wants",
      text: "Three leaves of twelve, and the last of them chipped mid-sentence. Shu says the old owner sat with it for a year and got nothing but still. She says it like a warning.",
      next: "Six coin takes it off her hands.", focus: ["jade_slip"] },
    { id: "first_breath", when: "g.jade_slip > 0 && g.qi_sense < 1", title: "Three leaves of twelve",
      text: "Leaf one is a posture and leaf two a breath. Leaf eight begins a turn and breaks off before it says what to do at the turning. The breath can be practised from what survives; the turn cannot.",
      next: "Copy the slip to read it (Lore) and sit with its breath (Qi Sense). The first level of Qi Sense will tell you where the turn might be found.", focus: ["fragment_notes", "breath_gathering"] },
    { id: "two_leads", when: "g.qi_sense >= 1 && g.channel_observe < 1 && g.fernhollow_observe < 1", title: "Two places the breath points at",
      text: "Something that is not air moves when you breathe the slip's way, and it pulls two ways: toward the broken channel beyond the barns, where it runs clear over awkward ground, and up the stream to a hollow of ferns, where it is faint and the ground is easy.",
      next: "Walk the channel now, or raise Qi Sense to 2 and sit in Fernhollow. Either finishes the sentence. You may visit both. Attune Steady the breath meanwhile: two qi become strength when Vigor runs low.", focus: ["channel_observe", "fernhollow_observe", "steady_breath"] },
    { id: "channel_found", when: "g.channel_observe > 0 && g.channel_arrangement < 1 && g.circulation.open < 1", title: "The water left; the turn stayed",
      text: "The qi still bends where the channel used to. Two stones came home with you and hum when you hold them near the slip. Headman Lu has a standing bounty on the fall that broke it.",
      next: "Cord and a hook let you clear the fall for Lu's ten coin and four more stones. Four stones set in your own floor will hold the turn where you sleep.", focus: ["field_kit", "clear_channel", "channel_arrangement"] },
    { id: "hollow_found", when: "g.fernhollow_observe > 0 && g.sit_fernhollow.reps < 3 && g.circulation.open < 1", title: "A current that comes back when you stop looking",
      text: "The hollow's current is easy to lose and easy to mistake for wanting one. It returns at dusk, when the ferns stop moving.",
      next: "Sit three dusks. The third makes the missing sentence an exercise.", focus: ["sit_fernhollow"] },
    { id: "circulation_open", when: "g.circulation.open > 0 && g.circulation < 2", title: "The sentence, finished two ways",
      text: "The turn can be taken up and carried, as the stones carry the water, or let down and settled, as the hollow does. Both are leaf eight. A body learns one of them; once it has, the other reading will not take.",
      next: "Practise Circulation to 2. Attune the reading you believe in. The other closes.", focus: ["channel_exercise", "steady_attention", "carry_current", "settle_breath"] },
    { id: "ready", when: "g.circulation >= 2 && g.foundation < 1", title: "Everything but the sitting",
      text: "The method turns on its own for a breath at a time. Settling it means three uninterrupted minutes in the loft with the reservoir full, bundles burned to keep the air still, and coin to Wen for the days off his floor.",
      next: "Fill the reservoir with the slip's breath practice, then settle the foundation once three of its four signs hold.", focus: ["settling", "breath_gathering"] },
    { id: "foundation", when: "g.foundation > 0", title: "The road past the mill",
      text: "Nothing in the loft looks any different. Freight to the ferry pays better than sacks, and from the landing the old porters' path climbs to Old Ridge, where a collapsed hut is said to keep a dead porter's notes.",
      next: "Haul freight to the ferry for the coin the ridge will want, and walk the ridge outskirts when Strain allows.", focus: ["ferry_hauling", "ridge_outskirts"] },
    { id: "teachings", when: "g.ridge_outskirts > 0 && g.body_teaching + g.sword_teaching + g.earth_teaching + g.formation_teaching < 1", title: "Four bundles of notes",
      text: "The porter's notes are four ways to carry the method further: under a load, along a blade, through the ground, inside a layout. His widow wants herbs for each bundle, and reading them wants Lore 3.",
      next: "Buy the notes for the sphere you want to try. You may read more than one; any sphere carried to four takes the First Direction.", focus: ["body_teaching", "sword_teaching", "earth_teaching", "formation_teaching"] },
    { id: "line_work", when: "g.body_teaching + g.sword_teaching + g.earth_teaching + g.formation_teaching > 0", title: "Working a line",
      text: "Each line asks the same four things in its own way: a furnishing on your floor and the drills that use it, a site on the ridge that yields its material, and a chore that digs or scrapes more of it by hand. Each also has a method to hold in the place Foundation opened.",
      next: "Set the line's furnishing and begin its drills, walk its site and work its chore until the core of its direction and three of its signs hold.",
      focus: ["load_frame", "body_drills", "survey_marker", "dig_marrow_herbs", "sink_the_load",
        "practice_post", "blade_drills", "inscription_face", "scrape_whetstone_grit", "cut_by_intent",
        "survey_stakes", "ground_drills", "stable_point", "pry_veined_ore", "read_the_grain",
        "drawing_board", "array_drills", "fixed_layout", "ink_tokens", "fix_the_layout"] },
    { id: "direction_ready", title: "A direction within reach",
      when: "((g.circulation >= 4 && g.body_drills.started > 0) || (g.blade_intent >= 4 && g.blade_drills.started > 0) || (g.ground_reading >= 4 && g.ground_drills.started > 0) || (g.array_craft >= 4 && g.array_drills.started > 0)) && g.first_direction < 1",
      text: "One sphere's core holds. The First Direction wants twenty herbs and sixty coin paid at the start, twelve of that sphere's material in hand, and three of its four signs. It closes nothing.",
      next: "Take the First Direction. The sphere you carried to four names you.", focus: ["first_direction"] },
    { id: "cross", when: "g.first_direction > 0 && g.waystation < 1", title: "The way up",
      text: "The Direction has changed how you meet the ridge. Each way up to the old waystation wants a held method of its school: a loaded climb, a cut passage, a stable line, a turned runoff.",
      next: "Cross to the waystation by a method you hold.", focus: ["cross_body", "cross_sword", "cross_earth", "cross_formation"] },
    { id: "waystation", when: "g.waystation > 0 && g.second_direction < 1", title: "The waystation",
      text: "The old porters' waystation, reached by the method you held. The keeper has stores to shift, ledgers older than Lowbridge, and four things on the board: route records toward a basin, a chime at dusk, a spur that ends at a slide, and the slip's other nine leaves. The bad ground here draws on Focus as well as Strain; a stance can be taken before any fight.",
      next: "Climb the rise the route records point at, and sit out the dusk chime. Each sphere carried to five opens a deeper teaching at Lore 5.", focus: ["route_records", "unusual_chime", "landslide_rise", "chime_watch"] },
    { id: "deepening", when: "g.conditioning_sheets + g.tam_lessons + g.current_accounts + g.overlay_plan + g.refining.open > 0 && g.second_direction < 1", title: "Deeper into a sphere",
      text: "Each deeper teaching offers two methods that read the sphere differently; holding one closes the other. A sphere site raises its cap, and Han pays for a commission once the sphere stands at six. Two spheres deepened and three methods held are what the Second Direction asks.",
      next: "Hold a deep method in each of two spheres, do a commission, and gather three of the Second Direction's six signs.", focus: ["temper_the_marrow", "sever_the_knot", "root_to_the_vein", "anchor_the_array", "draw_the_essence", "second_direction"] },
    { id: "second_ready", when: "g.t_deep_body + g.t_deep_sword + g.t_deep_earth + g.t_deep_formation + g.t_deep_pill >= 2 && g.attune_slots >= 3 && g.second_direction < 1", title: "The Second Direction within reach",
      text: "Two spheres deepened, three methods held. The Direction wants forty herbs and a hundred and fifty coin at the start, the reservoir full, and three of its six signs. Its title is read from what you hold.",
      next: "Take the Second Direction. It closes nothing; a fifth place and the hobby place open with it.", focus: ["second_direction"] },
    { id: "second_direction", when: "g.second_direction > 0 && g.reedmarket < 1", title: "The basin road",
      text: "The title is yours, a fifth method can be held, and a hobby runs at half pace beside whatever holds the slot. The terrace above the slide is a day's carry to Reedmarket.",
      next: "Trace the terrace to Reedmarket.", focus: ["terrace_bypass"] },
    { id: "reedmarket", when: "g.reedmarket > 0", title: "Reedmarket",
      text: "The market settlement on the Cloudwell basin's edge. The porters pay better than Han, pale root sells, and the three leaves the ledger could not place are somewhere in the basin.",
      next: "The basin belongs to the next stage of the journey.", focus: [] },
  ],
};
