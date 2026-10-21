import shared from "./data/shared.json";
import opening from "./data/opening.json";
import ridge from "./data/ridge.json";
import type { GameRecord } from "./types";

/** The browser, route runner and validator all consume these same source records. */
export const records = [...shared, ...opening, ...ridge] as GameRecord[];
export const recordById = new Map(records.map((record) => [record.id, record]));

/** One moment of the story. Beats run in progression order; the last whose `when` holds is the one shown. */
export interface StoryBeat { id: string; when: string; title: string; text: string; next: string }

export const openingContext: { title: string; place: string; introduction: string; bound: string; beats: StoryBeat[] } = {
  title: "Lowbridge",
  place: "Hayloft above Miller Wen’s barn",
  introduction:
    "The mill stream meets the ferry road here. Wen has sacks to move; Granny Shu has herbs to sort. Beyond the barns, the water runs through a broken channel toward the wilds.",
  bound: "Village to Foundation",
  beats: [
    { id: "start", when: "true", title: "A hayloft and two jobs",
      text: "You sleep in the rafters above Wen's barn and owe him for it. Wen pays by the sack. Granny Shu pays in bundles and opinions. Between them you can keep the rafters.",
      next: "Haul sacks for Wen and sort herbs for Shu. She notices quick hands after three sortings." },
    { id: "apprentice_offer", when: "g.sort_herbs.reps >= 3 && g.shu_apprentice < 1", title: "Shu is watching your hands",
      text: "She has sorted faster than you for sixty years and says so. She also has a loft corner going spare and a thing in her apron she keeps turning over.",
      next: "Five coin buys the morning apprenticeship, and whatever she is not saying." },
    { id: "slip_offer", when: "g.shu_apprentice > 0 && g.jade_slip < 1", title: "A cracked slip nobody wants",
      text: "Three leaves of twelve, and the last of them chipped mid-sentence. Shu says the old owner sat with it for a year and got nothing but still. She says it like a warning.",
      next: "Six coin takes it off her hands." },
    { id: "first_breath", when: "g.jade_slip > 0 && g.qi_sense < 1", title: "Three leaves of twelve",
      text: "Leaf one is a posture and leaf two a breath. Leaf eight begins a turn and breaks off before it says what to do at the turning. The breath can be practised from what survives; the turn cannot.",
      next: "Copy the slip to read it (Lore) and sit with its breath (Qi Sense). The first level of Qi Sense will tell you where the turn might be found." },
    { id: "two_leads", when: "g.qi_sense >= 1 && g.channel_observe < 1 && g.fernhollow_observe < 1", title: "Two places the breath points at",
      text: "Something that is not air moves when you breathe the slip's way, and it pulls two ways: toward the broken channel beyond the barns, where it runs clear over awkward ground, and up the stream to a hollow of ferns, where it is faint and the ground is easy.",
      next: "Walk the channel now, or raise Qi Sense to 2 and sit in Fernhollow. Either finishes the sentence. You may visit both." },
    { id: "channel_found", when: "g.channel_observe > 0 && g.channel_arrangement < 1 && g.circulation.open < 1", title: "The water left; the turn stayed",
      text: "The qi still bends where the channel used to. Two stones came home with you and hum when you hold them near the slip. Headman Lu has a standing bounty on the fall that broke it.",
      next: "Cord and a hook let you clear the fall for Lu's ten coin and four more stones. Four stones set in your own floor will hold the turn where you sleep." },
    { id: "hollow_found", when: "g.fernhollow_observe > 0 && g.sit_fernhollow.reps < 3 && g.circulation.open < 1", title: "A current that comes back when you stop looking",
      text: "The hollow's current is easy to lose and easy to mistake for wanting one. It returns at dusk, when the ferns stop moving.",
      next: "Sit three dusks. The third makes the missing sentence an exercise." },
    { id: "circulation_open", when: "g.circulation.open > 0 && g.circulation < 2", title: "The sentence, finished two ways",
      text: "The turn can be taken up and carried, as the stones carry the water, or let down and settled, as the hollow does. Both are leaf eight. A body learns one of them; once it has, the other reading will not take.",
      next: "Practise Circulation to 2. Attune the reading you believe in. The other closes." },
    { id: "ready", when: "g.circulation >= 2 && g.foundation < 1", title: "Everything but the sitting",
      text: "The method turns on its own for a breath at a time. Settling it means three uninterrupted minutes in the loft with a full reservoir, bundles burned to keep the air still, and coin to Wen for the days off his floor.",
      next: "Settle the foundation when three of its four signs are in place." },
    { id: "foundation", when: "g.foundation > 0 && g.waystation < 1", title: "Foundation",
      text: "The pooled breath turns, and returns, and turns again without being asked. Wen takes on a boy for the sacks. The ferry road is open, and Old Ridge rises past it.",
      next: "Haul to the ferry for better coin, and walk the ridge outskirts when Strain allows." },
    { id: "waystation", when: "g.waystation > 0", title: "The waystation",
      text: "The old porters' waystation, reached by your own direction. The service passage opens with a shoulder.",
      next: "The leads beyond the ridge belong to the next stage of the journey." },
  ],
};
