import shared from "./data/shared.json";
import opening from "./data/opening.json";
import ridge from "./data/ridge.json";
import type { GameRecord } from "./types";

/** The browser, route runner and validator all consume these same source records. */
export const records = [...shared, ...opening, ...ridge] as GameRecord[];
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
      introduction: "Lowbridge lies below the porters' path. On the ridge the porter's notes teach four ways to carry the method further, and any one of them carries you to the waystation." },
    { id: "waystation", when: "g.waystation > 0", place: "The ridge waystation", title: "At the waystation", bound: "The waystation",
      location: "The old porters' waystation on Old Ridge, reached by your own direction.",
      introduction: "The keeper has stores to shift and ledgers that name a basin beyond the ridge. The direction you chose brought you here; the roads past it are still unwalked." },
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
      next: "Buy the notes for the line you want to try. You may read more than one; only one becomes your First Direction.", focus: ["body_teaching", "sword_teaching", "earth_teaching", "formation_teaching"] },
    { id: "line_work", when: "g.body_teaching + g.sword_teaching + g.earth_teaching + g.formation_teaching > 0", title: "Working a line",
      text: "Each line asks the same four things in its own way: a furnishing on your floor and the drills that use it, a site on the ridge that yields its material, and a chore that digs or scrapes more of it by hand. Each also has a method to hold in the place Foundation opened.",
      next: "Set the line's furnishing and begin its drills, walk its site and work its chore until the core of its direction and three of its signs hold.",
      focus: ["load_frame", "body_drills", "survey_marker", "dig_marrow_herbs", "sink_the_load",
        "practice_post", "blade_drills", "inscription_face", "scrape_whetstone_grit", "cut_by_intent",
        "survey_stakes", "ground_drills", "stable_point", "pry_veined_ore", "read_the_grain",
        "drawing_board", "array_drills", "fixed_layout", "ink_tokens", "fix_the_layout"] },
    { id: "direction_ready", title: "A direction within reach",
      when: "(g.circulation >= 4 && g.body_drills.started > 0) || (g.blade_intent >= 4 && g.blade_drills.started > 0) || (g.ground_reading >= 4 && g.ground_drills.started > 0) || (g.array_craft >= 4 && g.array_drills.started > 0)",
      text: "One line's core holds. Its breakthrough wants twenty herbs, twelve of the line's material and sixty coin, all paid at the start, and three of its four signs.",
      next: "Choose your First Direction. Paying for it closes the other three for good.", focus: ["direction_body", "direction_sword", "direction_earth", "direction_formation"] },
    { id: "cross", when: "g.body_disciple + g.sword_disciple + g.earth_listener + g.formation_student > 0", title: "The way up",
      text: "The direction has changed how you meet the ridge. Each way up to the old waystation suits one of them: a loaded climb, a cut passage, a stable line, a turned runoff.",
      next: "Cross to the waystation by your own direction's way.", focus: ["cross_body", "cross_sword", "cross_earth", "cross_formation"] },
    { id: "waystation", when: "g.waystation > 0", title: "The waystation",
      text: "The old porters' waystation, reached by your own direction. The keeper has stores to shift and ledgers older than Lowbridge.",
      next: "The leads beyond the ridge belong to the next stage of the journey.", focus: [] },
  ],
};
