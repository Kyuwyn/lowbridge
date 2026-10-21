# Hard data tables — testing build `unstable 0.12.12.9`

Generated from `data/*.json` and `data/modules/*.json` fetched from https://arcanumtesting.gitlab.io/arcanum/data/ on 2026-10-19. Regenerate rather than hand-edit. Expressions like `g.lore>=4` are the game's own requirement strings (`g` = game state).

## Tier unlockers (quests, group=advancement)

| id | name | require | need | cost | result | locks |
|---|---|---|---|---|---|---|
| warriorghost_quest | A Warrior's Last Wish | g.seancebuff_warrior.owned | Enter the charred keep and slay the Archlock within. | — |  |  |
| thiefghost_quest | A Thief's Last Wish | g.seancebuff_thief.owned | Acquire great splendor and riches. | — |  |  |
| mageghost_quest | A Mage's Last Wish | g.seancebuff_mage.owned | Accumulate a vast library of at least 200 tomes. | — |  |  |
| veldrantraces | traces of Veldran | g.t_waterclass>0&&g.aragwastes>0 | Explore the old storehouses you found near the ruined wharf. | — |  |  |
| veldransfall | fall of Veldran | g.veldrantraces>0 | Explore the shipwreck and see what it leads you to. Perhaps keep exploring until you find some loot, but that's extra. | — |  |  |
| neophyte | None | (g.evt_helper>0)&&g.research.max>=125&&g.spellbook>0 | Master refuses to teach you more until you clear out the Leaky Cellar. | 150 gold, 175 research, 3 arcana | {"player.exp": 10} |  |
| t_0 | Tier 0 - Solitary Magic | g.neophyte_future>0 | Will be acquired with your next class advancement. | — |  | ["mustylibrary"] |
| t_1 | Tier 1 - Professional Magick | g.t0_future>0 | Will be acquired with your next class advancement. | — |  | ["prestidigitation"] |
| t_2 | Tier 2 - Arcane Ascendant | t1_future | Will be acquired with your next class advancement. | — |  |  |
| t_3 | Tier 3 - Magical Mastery | t2_future | Will be acquired with your next class advancement. | — |  |  |
| t_4 | Tier 4 - Supreme Sorcery | t3_future | Will be acquired with your next class advancement. | — |  |  |
| t_5 | Tier 5 - Dhrunic Magic | g.tier4>0 | Will be acquired with your next class advancement. | — |  |  |
| t_6 | Tier 6 - Ageless Magic | g.tier5>0 | Will be acquired with your next class advancement | — |  |  |
| t0unlocker | Graduand Magus | g.neophyte_future>0 | Complete all 4 Tier 0 Quests. | 5 arcana | {"fame": 1} | t0quest |
| t1unlocker | Mana Proficiency | g.t0_future>0 | Complete at least 4 Tier 1 Quests. | 250 research, 5 codices, 300 gold, 2 gems | {"fame": 2} | t1quest |
| t2unlocker | Arcane Expertise | t1_future | Complete at least 4 Tier 2 Quests. | 850 research, 1 tomes, 1000 gold, 5 gems | {"fame": 3} | t2quest |
| t3unlocker | Preeminent Magus | t2_future | Complete at least 4 Tier 3 Quests. | 100 scrolls, 10 codices, 5 tomes, 2500 gold, 10 gems | {"fame": 4} | t3quest |
| t4unlocker | Esoteric Occultist | t3_future | Complete at least 4 Tier 4 Quests. | 250 scrolls, 65 codices, 15 tomes, 5000 gold, 25 gems | {"fame": 5} | t4quest |
| t5unlocker | Magic Immemorial | g.tier4>0 | ['Complete at least 4 Tier 5 Quests.', 'Attain a permanent transformation.'] | 25 tomes, 20 runestones, 8000 gold, 35 gems | {"fame": 6} | t5quest |
| t6unlocker | Eternal Transcendence | g.tier5>0 | Complete at least 4 Tier 6 Quests. | 15 tomes, 35 runestones, 10000 gold, 50 gems | {"fame": 7} | t6quest |

## Tier quests (group=tier) — the "N of M pointers into existing systems"

| tier tag | id | name | need (player-facing) | require |
|---|---|---|---|---|
| t0quest | q_t0arcanaaction | Night Owl | arcanaaction | g.neophyte_future>0 |
| t0quest | q_t0mount | Equestrian | Purchase a steed. | g.neophyte_future>0 |
| t0quest | q_t0mustylibrary | Erudition | Purchase Library Haul 4 times. | g.neophyte_future>0 |
| t0quest | q_t0spells | Spellcaster | Construct a spelllist by memorizing learnt spells. | g.neophyte_future>0 |
| t1quest | q_t1combat | Root Out Banditry | underden | g.t0_future>0 |
| t1quest | q_t1equip | Well-Armed | Equip a non-training weapon you have crafted. | g.t0_future>0 |
| t1quest | q_t1explore | Uncover The Crypt | ruinedcrypt | g.t0_future>0 |
| t1quest | q_t1house | Home Sweet Home | Move out of the Inn to more permanent housing. | g.t0_future>0 |
| t1quest | q_t1loom | Enchanted Scrollery | Learn how to automate scroll production. This requires the Weaving skill. | g.t0_future>0 |
| t1quest | q_t1mana | Energy Spectrum | Learn all the prismatic mana types, consisting of standard mana, the 4 elemental, and 4 primal forces. You will need to purchase upgrades to act as a source for the respective mana type to unlock the corresponding skills. | g.t0_future>0 |
| t2quest | q_t2combat | Prismatic Rift | elementalrift | t1_future |
| t2quest | q_t2enchanting | Thaumaturgy | Learn the enchanting skill and possess at least one of each of the 9 prismatic gem types. | t1_future |
| t2quest | q_t2explore | Vesparia's Gilded Age | Explore Reedburgh Markets. You will need a Reedburgh City Pass to be allowed entry, which requires the City Navigation skill. | t1_future |
| t2quest | q_t2morality | Alignment Bias | Select your Tier 1 morality. Options include Scrupulous for good, Sinister for evil, and Balanced for neutrality. You can refer to the glossary for further information. | t1_future |
| t2quest | q_t2potion | Bubbling Concoctions | Brew your first potion. The Potions skill requires Alchemy. | t1_future |
| t2quest | q_t2shopkeeping | Mercantile Ventures | Learn Shopkeeping. Requires 1000 gold to unlock. | t1_future |
| t3quest | q_t3books | Ghost Writer | Have 12 Unseen Scribes. | t2_future |
| t3quest | q_t3combat_gorborung | Mountain Trekking | mtgorborung | t2_future |
| t3quest | q_t3combat_spider | Tattered Cobwebs | spidercave | t2_future |
| t3quest | q_t3explore | Fazbit's Magnum Opus | fazbitshop | t2_future |
| t3quest | q_t3study | Gematria | Enchant your Personal Study. | t2_future |
| t4quest | q_t4books | Bibliophile | library | t3_future |
| t4quest | q_t4chronomancy | Timeline Bifurcation | Gain an additional action slot from Timesplit while possessing 5 Chronomancy. | t3_future |
| t4quest | q_t4combat | Ruins of Reverence | sereditetemple | t3_future |
| t4quest | q_t4explore | Echo of the Ages | loc_ageshall | t3_future |
| t4quest | q_t4rune | Runic Labourers | Hire either a Dwarven Runecrafter or Skeletal Runecarver. Requires Runic Lore. | t3_future |
| t4quest | q_t4spellcraft | Spell Construction | Learn Spellcraft. | t3_future |
| t5quest | q_t5combat_desilla | Den of Pleasure | desillagrotto | g.tier4>0 |
| t5quest | q_t5combat_plane | Disaster's Emissaries | elementalplane | g.tier4>0 |
| t5quest | q_t5frosted | Aerated Abode | up_stam3 | g.tier4>0 |
| t5quest | q_t5nexus | Realm Splitter | gate | g.tier4>0 |
| t5quest | q_t5vivification | Endless Stamina | Learn Vivification. | g.tier4>0 |
| t6quest | q_t6astrallore | Wish Upon A Star | Be capable of storing 5 star shards. Requires Astral Communion. | g.tier5>0 |
| t6quest | q_t6combat | Ashen Glory | charredkeep | g.tier5>0 |
| t6quest | q_t6explore | Dunes of Orrem | loc_orrem | g.tier5>0 |
| t6quest | q_t6hall | Wizard Association | wizardhall | g.tier5>0 |
| t6quest | q_t6voidlore | Stare Back | Learn Abyss Gazing. | g.tier5>0 |
| t6quest | q_t6werry | Pocket Dimension | t_werry | g.tier5>0 |

## Morality quests

| id | name | need | mod | disables/locks |
|---|---|---|---|---|
| conquertheseas | rule the waves | Defeat the kraken. |  |  |

## Classes by tier tag

| sort | id | name | tags | require | cost | mod (truncated) | locks |
|---|---|---|---|---|---|---|---|
| None | tenebrarch | Tenebrarch | t_expertclass,t_shadowclass,t_painclass,t_expert_shadowclass | g.t_painclass>=2&&g.tier7>0 | — |  | ["t_expert_shadowclass"] |
| 1 | apprentice | apprentice |  | research | 10 research, 20 gold |  | ["cleanstables"] |
| 2 | job_smith | Smith | t_job | g.crafting>=5 | 250 gold | {"gold.rate": 0.1, "lore.max": 2, "crafting.max": 1, "weaponlore.max": 1} |  |
| 3 | falconer | falconer | t_job | animals | 100 gold, 100 research | {"gold.rate": 0.1, "lore.max": 2, "animals.max": 1, "naturelore.max": 1} |  |
| 4 | herbalist | herbalist | t_job | herbalism | 100 gold, 100 research | {"gold.rate": 0.1, "lore.max": 2, "herbalism.max": 1, "alchemy.max": 1} |  |
| 5 | scribe | scribe | t_job | scribescroll | 100 gold, 100 research | {"gold.rate": 0.1, "lore.max": 2, "history.max": 1, "languages.max": 1} |  |
| 6 | adept | adept | t_tier0 | g.t0unlocker>0&&g.research.max>=100&&g.lore>=4 | 225 research, 200 gold | {"mysticism.max": 1, "lore.max": 1, "history.max": 1, "languages.max": 1, "mana.max": 5, "mana.rate": 0.1} |  |
| 7 | darkadept | dark adept | t_tier0 | g.t0unlocker>0&&g.research.max>=100&&g.lore>=4 | 225 research | {"mysticism.max": 1, "spiritlore.max": 1, "shadowlore.max": 1, "trickery.max": 1, "shadow.max": 5, "shadow.rate": 0.1} |  |
| 8 | redadept | red adept | t_tier0 | g.t0unlocker>0&&g.research.max>=100&&g.lore>=4 | — | {"anatomy.max": 1, "firelore.max": 1, "weaponlore.max": 1, "mysticism.max": 1, "stamina.rate": 0.1, "vigor.rate": 0.01} |  |
| 9 | blueadept | blue adept | t_tier0 | g.t0unlocker>0&&g.research.max>=100&&g.lore>=4 | — | {"mysticism.max": 1, "lightlore.max": 1, "spiritlore.max": 1, "divination.max": 1, "light.max": 5, "light.rate": 0.1} |  |
| 10 | savant | mystic savant | t_tier0 | g.t0unlocker>0&&g.research.max>=100&&g.lore>=4 | — | {"mysticism.max": 2, "conjuration.max": 1, "spiritlore.max": 1, "mysticism.mod.prismatic.rate": 0.01} |  |
| 100 | magician | Magician | t_tier1,t_manaclass,t_knowledgeclass | g.t1unlocker>0&&g.lore>=6 | 500 research, 2 codices | {"research.max": 100, "arcana.rate": 0.001, "mana.max": 2, "mana.rate": 0.4, "mysticism.mod.mana.rate": 0.05, "lore.max": 1, "astronomy.max": 1, "languages.max" |  |
| 101 | trickster | arcane trickster | t_tier1,t_chaosclass | g.trickery>=4&&g.t1unlocker>0&&g.tier1==0 | — | {"player.dodge": 2.2, "research.max": 2, "mana.max": 2, "chaos.max": 3, "chaos.rate": 0.1, "trickery.max": 2, "conjuration.max": 1, "spiritlore.max": 1, "potion |  |
| 102 | warden | warden | t_basicclass,t_natureclass | g.naturelore>=8 | — | {"research.max": 5, "naturelore.max": 3, "animals.max": 3, "potions.max": 1} |  |
| 103 | elementalist | elementalist | t_tier1,t_elementalclass | g.t1unlocker>0&&g.airlore>=3&&g.firelore>=3&&g.earthlore>=3&&g.waterlore>=3 | — | {"research.max": 5, "elemental.max": 2, "elemental.rate": 0.2} |  |
| 104 | oracle | oracle | t_tier1,t_divinationclass | g.t1unlocker>0&&g.spiritlore>=5&&g.divination>=5 | — | {"virtue": 1, "research.max": 15, "scrying.max": 2, "mana.max": 3, "divination.max": 2, "airlore.max": 1, "spiritlore.max": 1} |  |
| 105 | conjurer | conjurer | t_tier1,t_summonclass | g.conjuration>=5&&g.t1unlocker>0 | — | {"minions.max": 1, "summoning.max": 2, "charms.max": 1, "mana.max": 2, "conjuration.max": 4} |  |
| 106 | witch | witch | t_tier1,t_demonclass,t_potionclass | g.t1unlocker>0&&g.animals>=2&&g.potions>=3&&g.tier1==0 | 13 arcana | {"research.max": 10, "demonology.max": 2, "potions.max": 2, "spiritlore.max": 2} |  |
| 109 | puppeteer | puppeteer | t_basicclass,t_craftingclass,t_minionclass,t_mechaclass | g.puppetry>=5 | — | {"t_skill_animation.rate": 0.5, "puppetry.max": 2, "magicalanimation.max": 1, "allies.max": 5, "clockworkhome.mod.space.max": 50, "puppetworkshop.max": 2, "pupp |  |
| 110 | shapechanger | Shapechanger | t_basicclass,t_shapeshiftclass | g.anatomy>=3&&g.alchemy>=3 | — | {"anatomy.max": 1, "stamina.max": "10%", "vigor.max": "10%", "anatomy.mod.shiftdmg": 1} |  |
| 120 | pyromancer | Pyromancer | t_basicclass,t_fireclass | g.firelore>=6 | — | {"firelore.max": 1} |  |
| 150 | madcap | mystic madcap | t_tier2,t_chaosclass | g.trickery>=7&&g.t2unlocker>0&&g.tier2==0 | 7 managem, 7 airgem, 7 watergem | {"player.dodge": 2.2, "gold.max": "5%", "trickery.max": 2, "conjuration.max": 1, "mysticism.max": 1, "potions.max": 1} |  |
| 150 | medium | Medium | ['t_basicclass', 't_spiritclass', 't_minionclass'] | g.spiritlore>=7 | — | {"spiritlore.max": 2, "planeslore.max": 1} |  |
| 151 | battlemage | battle mage | t_tier2,t_swordclass,t_manaclass | g.t2unlocker>0&&g.weaponlore>=6&&g.tier2==0 | — | {"mana.max": 4, "mana.rate": 0.5, "firelore.max": 2, "earthlore.max": 1} |  |
| 152 | alchemist | alchemist | t_tier2,t_bloodclass,t_potionclass,t_craftingclass | g.t2unlocker>0&&g.potions>=4&&g.alchemy>=5 | 5 managem, 2 firegem, 2 watergem, 2 earthgem | {"research.max": 100, "crafting.max": 3, "potions.max": 3, "potionessence.rate": 0.00028, "alchemy.max": 3} |  |
| 153 | enchanter | enchanter | t_tier2,t_craftingclass,t_enchantingclass | g.t2unlocker>0&&g.enchanting>=6&&g.charms>=3 | 5 managem | {"research.max": 15, "enchanting.max": 3, "arcana.max": 2, "naturelore.max": 2, "mana.max": 3, "airlore.max": 2, "waterlore.max": 2} |  |
| 154 | geomancer | geomancer | t_basicclass,t_earthclass,t_hammerclass | g.earthlore>=7 | 10 earthgem | {"earthlore.max": 2, "geosculpting.max": 2, "stamina.max": "10%", "mana.max": 2, "earthspire.mod.space.max": 50} |  |
| 155 | hydromancer | Hydromancer | t_basicclass,t_waterclass,t_spearclass | g.waterlore>=6 | — | {"waterlore.max": 2, "barrier.max": "10%", "mana.max": 2} |  |
| 156 | windmage | wind mage | t_tier2,t_airclass | g.t2unlocker>0&&g.airlore>=10 | 10 airgem | {"airlore.max": 2, "dodge": "10%", "mana.max": 2} |  |
| 157 | seer | seer | t_tier2,t_divinationclass | g.t2unlocker>0&&g.divination>=8 | — | {"virtue": 5, "mana.max": 3, "divination.max": 2, "scrying.max": 2, "spiritlore.max": 2} |  |
| 158 | mage | Mage | t_tier2,t_manaclass,t_knowledgeclass | g.t2unlocker>0&&g.lore>=8 | 1000 research, 5 codices | {"research.max": 40, "firelore.max": 1, "mysticism.max": 2, "enchanting.max": 1, "lore.max": 2, "mana.max": 3} |  |
| 159 | darkmagician | Dark Mage | t_basicclass,t_shadowclass,t_painclass | g.shadowlore>=7 | 13 arcana | {"evilamt": 5, "research.max": 100, "mana.max": 3, "mana.rate": 0.2, "shadowlore.mod.mana.rate": 0.02, "shadowlore.max": 1, "demonology.max": 2} |  |
| 200 | bloodmage | blood mage | t_tier3,t_bloodclass,t_manaclass | g.t3unlocker>0&&(g.battlemage>0\|\|g.hp.max>=150)&&g.tier3==0 | 20 bloodgem | {"bloodgem.max": 10, "bloodgem.mod.bloodsiphon.effect.hp": 0.02, "mana.max": 2, "mana.rate": 0.5, "anatomy.max": 3, "earthlore.max": 2, "waterlore.max": 1} |  |
| 201 | summoner | summoner | t_tier3,t_summonclass | g.summoning>=5&&g.t3unlocker>0&&g.lore>=10 | — | {"minions.max": 1, "mana.max": 2, "summoning.max": 4, "conjuration.max": 2, "charms.max": 1} |  |
| 202 | stormcaller | stormcaller | t_tier3,t_waterclass,t_airclass | (g.t_waterclass>0\|\|g.t_airclass>0)&&g.t3unlocker>0 | 20 airgem, 20 watergem | {"mana.max": 2, "airlore.max": 3, "waterlore.max": 3} |  |
| 203 | druid | druid | t_advancedclass,t_natureclass | g.warden>0&&g.naturelore>=15 | — | {"naturelore.max": 3, "animals.max": 2, "herbalism.max": 2, "potions.max": 1} |  |
| 204 | highelemental | high elementalist | t_tier3,t_elementalclass | g.t3unlocker>0&&g.airlore>=8&&g.firelore>=8&&g.waterlore>=8&&g.earthlore>=8 | 20 airgem, 20 firegem, 20 earthgem, 20 watergem | {"airlore.max": 2, "firelore.max": 2, "earthlore.max": 2, "waterlore.max": 2, "research.max": 25, "elemental.max": 2, "elemental.rate": 0.2} |  |
| 205 | highmage | High mage | t_tier3,t_manaclass,t_knowledgeclass | g.t3unlocker>0&&g.lore>=10 | 2000 research, 5 tomes | {"research.max": 50, "firelore.max": 1, "mysticism.max": 2, "alchemy.max": 1, "spellcraft.max": 2, "crafting.max": 1, "lore.max": 2} |  |
| 206 | doomsayer | doomsayer | t_tier3,t_divinationclass | g.t3unlocker>0&&g.spirit>=12&&g.divination>=9 | 15 spiritgem | {"spiritlore.max": 2, "divination.max": 3, "planeslore.max": 1, "scrying.max": 2, "mana.max": 1} |  |
| 207 | dreadlord | dreadlord | t_tier3,t_shadowclass,t_swordclass | g.tier7>0 | 10 shadowgem | {"player.tohit": 1, "hp.max": "10%", "arcanebody.max": 1, "arcanebody2.max": 1, "bladelore.max": 1, "shadowlore.max": 2} |  |
| 209 | duelist | duelist | t_tier3,t_duelingclass,t_swordclass | g.t3unlocker>0&&(g.t_swordclass>0\|\|g.redadept>0\|\|g.t_chaosclass>0)&&g.tier3==0 | — | {"duelingdmg": 5, "dueling_lessons.max": 3, "sworddmg": 5, "self.chaincast": 0.5, "spelldmg": -10} |  |
| 211 | limnimancer | Limnimancer | t_advancedclass,t_waterclass,t_spearclass | g.waterlore>=9&&g.hydromancer>0 | — | {"waterlore.max": 3, "barrier.max": "15%", "stamina.max": "20%", "water.rate": 0.3, "wet_real_estate.mod.space.max": 50} |  |
| 211 | mechanist | mechanist | t_advancedclass,t_craftingclass,t_minionclass,t_mechaclass | g.machinacreation>=5&&g.t_mechaclass==1 | 20 bloodgem, 20 airgem | {"t_skill_animation.rate": 1, "puppetry.max": 1, "magicalanimation.max": 2, "machinacreation.max": 2, "allies.max": 5, "clockworkhome.mod.space.max": 100, "mach |  |
| 212 | spellblade | spell blade | t_tier3,t_swordclass | g.t3unlocker>0&&g.enchanting>=7&&g.weaponlore>=8&&g.tier3==0 | — | {"sworddmg": 3, "player.speed": 1, "player.tohit": 1, "history.max": 1, "enchanting.max": 2, "bladelore.max": 2, "blade_spellbook.max": 1, "anatomy.max": 1, "ar |  |
| 213 | priest | Priest | t_basicclass,t_lightclass | ["g.lightlore>=6", "g.spiritlore>=6"] | — | {"lightlore.max": 1, "lightlore.mod.lightdmg": 1, "spiritlore.max": 1, "spiritlore.mod.barrier.max": 3} |  |
| 214 | protean | Protean | t_advancedclass,t_shapeshiftclass | g.anatomy>=10&&g.t_shapeshiftclass>=1 | — | {"stretchself.max": 2, "alchemy.max": 1, "anatomy.max": 2, "alchemy.mod.hp.max": 0.5, "anatomy.mod.stamina.max": 0.5, "anatomy.mod.vigor.max": 0.5} |  |
| 220 | scorchcaller | Scorchcaller | t_advancedclass,t_pyrovolatile,t_fireclass | g.decipherpyronotes>0&&g.wordsoffire>0 | — | {"firelore2.max": 1} |  |
| 250 | jester | jester | t_tier4,t_chaosclass | g.trickery>=15&&g.t_chaosclass>0&&g.t4unlocker>0&&g.tier4==0 | 13 managem, 13 airgem, 13 watergem | {"player.dodge": 2.6, "gold.max": "10%", "facemuseum.mod.space.max": 20, "trickery.max": 3, "conjuration.max": 2, "chaoslore.max": 1, "mysticism.max": 1} |  |
| 250 | channeler | Channeler | ['t_advancedclass', 't_spiritclass', 't_minionclass', 't_advanced_spiritclass'] | ["g.spiritlore>=9", "g.medium>0"] | 15 spiritgem, 25 herbs | {"spiritlore.max": 3, "planeslore.max": 1, "history.max": 1, "barrier.max": "5%"} | t_advanced_spiritclass |
| 250 | psychopomp | Psychopomp | ['t_expertclass', 't_spiritclass', 't_minionclass'] | ["g.spiritlore>=16", "g.channeler>0"] | 5 spiritrune | {"spiritlore.max": 2, "spiritlore2.max": 2, "planeslore.max": 2, "barrier.max": "15%"} |  |
| 251 | earthshaker | earthshaker | t_advancedclass,t_earthclass,t_hammerclass | g.earthlore>=11&&g.t_earthclass==1 | 50 earthgem | {"earthlore.max": 3, "player.defense": 15, "stamina.max": "20%", "earth.rate": 0.3, "earthspire.mod.space.max": 50} |  |
| 252 | sorcerer | sorcerer | t_tier4,t_elementalclass | g.t4unlocker>0&&(g.earthlore>=12\|\|g.waterlore>=12\|\|g.firelore>=12)&&(g.t_elementalclass+g.t_fireclass+g.t_waterclass+g.t_earthclass)>0 | 5 managem, 15 firegem, 15 earthgem, 15 watergem | {"mana.max": 1, "earthlore.max": 2, "waterlore.max": 2, "firelore.max": 2} |  |
| 253 | destined | destined | t_tier4,t_enchantingclass,t_divinationclass | g.t4unlocker>0&&g.spirit>=15&&g.divination>=10 | 20 spiritgem | {"spiritlore.max": 2, "divination.max": 3, "spellcraft.max": 2, "light.max": 2, "light.rate": "0.2+5%", "mana.max": 3} |  |
| 254 | wizard | Wizard | t_tier4,t_manaclass,t_knowledgeclass | g.t4unlocker>0&&g.lore>=15 | 6000 research, 15 tomes, 5 runestones | {"languages.max": 2, "conjuration.max": 1, "crafting.max": 1, "lore.max": 3, "spellcraft.max": 3, "mana.max": 4, "mana.rate": "5%", "mysticism.max": 1, "spellli |  |
| 255 | warlock | warlock | t_tier4,t_demonclass,t_summonclass | g.t4unlocker>0&&g.evil2>0 | 25 arcana | {"anatomy.max": 3, "firelore.max": 1, "shadowlore.max": 2, "demonology.max": 3} |  |
| 256 | necromancer | necromancer | t_advancedclass,t_shadowclass,t_necroclass,t_minionclass,t_advanced_shadowclass | g.shadowlore>=10&&g.t_shadowclass>0 | 30 bloodgem, 30 shadowgem | {"shadowlore.max": 2, "potions.max": 1, "necromancy.max": 3, "spiritlore.max": 1} | ["t_advanced_shadowclass"] |
| 257 | rune_fencer | rune fencer | t_tier4,t_duelingclass,t_swordclass | g.t4unlocker>0&&(g.t_swordclass>=2\|\|g.duelist>0)&&g.tier4==0 | 10 airgem, 5 firegem, 5 earthgem, 5 watergem | {"duelingdmg": 10, "dueling_lessons.max": 5, "runicdmg": 5, "sworddmg": 10, "self.chaincast": 0.5, "spelldmg": -10} |  |
| 259 | tormentor | Tormentor | t_advancedclass,t_shadowclass,t_painclass,t_advanced_shadowclass | g.t_shadowclass>0&&g.shadowlore>=12&&g.tier7>0 | — |  | ["t_advanced_shadowclass"] |
| 259 | shian | shian anchorite | t_tier4,t_swordclass,t_spiritclass | g.t4unlocker>0&&(g.unstablespire>0\|\|g.up_shian>0)&&g.spiritlore>=15&&g.weaponlore>=8 | 2 ichor | {"spiritlore.max": 3} |  |
| 260 | bladeweaver | bladeweaver | t_tier4,t_swordclass | g.t4unlocker>0&&(g.bladelore+g.weaponlore)>=10&&g.tier4==0&&g.weaving>=5 | 10 airgem, 5 firegem, 5 earthgem, 5 watergem | {"player.dodge": 2, "player.speed": "3%", "history.max": 1, "enchanting.max": 1, "elemental.max": 1, "bladelore.max": 2, "blade_spellbook.max": 1, "anatomy.max" |  |
| 261 | lightbringer | lightbringer | t_tier4,t_lightclass | g.tier7>0 | 20 lightgem |  |  |
| 300 | wizard2 | Dhrunic wizard | t_tier5,t_manaclass,t_knowledgeclass | g.t5unlocker>0&&g.lore>=20 | 15000 research, 10 tomes, 10 runestones | {"languages.max": 2, "firelore.max": 1, "waterlore.max": 1, "airlore.max": 1, "lightlore.max": 1, "crafting.max": 2, "lore.max": 5, "mana.max": 4, "mana.rate":  |  |
| 301 | kell | kell | t_expertclass,t_natureclass | g.druid>0&&g.naturelore>=21&&g.t_permanent_transformation>0 | — | {"airlore.max": 2, "naturelore.max": 3, "animals.max": 2, "herbalism.max": 1} |  |
| 302 | heresiarch | heresiarch | t_tier5,t_divinationclass | g.t5unlocker>0&&g.spirit>=15&&g.divination>=11 | 50 spiritgem | {"spiritlore.max": 3, "divination.max": 3, "scrying.max": 2} |  |
| 303 | archlock | archlock | t_tier5,t_demonclass,t_summonclass | g.t5unlocker>0&&g.warlock>0&&g.demonology>=12&&g.evil3>0 | 25 arcana | {"firelore.max": 1, "demonology.max": 5} |  |
| 304 | greynecromancer | grey necromancer | t_expertclass,t_shadowclass,t_necroclass,t_minionclass,t_expert_shadowclass | g.necromancy>=10&&g.t_necroclass>=1 | 100 bones, 50 bodies, 100 souls | {"necromancy.max": 3, "shadowlore.max": 2, "spiritlore.max": 1} | ["t_expert_shadowclass"] |
| 306 | mechamancer | mechamancer | t_expertclass,t_craftingclass,t_minionclass,t_mechaclass | g.magiphysics>=5&&g.machinacreation>=9&&g.t_mechaclass==2 | — | {"t_skill_animation.rate": 2, "puppetry.max": 1, "magicalanimation.max": 1, "machinacreation.max": 2, "automatasculpting.max": 3, "allies.max": 5, "clockworkhom |  |
| 307 | arcanedervish | arcane dervish | t_tier5,t_swordclass | g.t5unlocker>0&&g.bladelore>=7&&g.tier5==0 | 20 airgem, 10 firegem, 10 earthgem, 10 watergem | {"stamina.rate": "0.3", "vigor.rate": "0.03", "player.dodge": "5%", "history.max": 1, "enchanting.max": 1, "elemental.max": 1, "bladelore.max": 2, "blade_spellb |  |
| 308 | highpriest | High Priest | t_advancedclass,t_lightclass | ["g.lightlore>=14", "g.spiritlore>=12", "g.priest>0"] | 20 lightgem, 20 spiritgem | {"lightlore.max": 2, "lightlore.mod.lightdmg": 1, "spiritlore.max": 2, "spiritlore.mod.barrier.rate": 0.2, "heallore.max": 1} |  |
| 309 | class_leviathan | Leviathan | t_expertclass,t_waterclass,t_spearclass | g.waterlore>=16&&g.limnimancer>0 | — | {"waterlore.max": 3, "barrier.max": "20%", "stamina.max": "20%", "spearlore.max": 3, "wet_real_estate.mod.space.max": 100} |  |
| 310 | autopoet | Autopoet | t_expertclass,t_shapeshiftclass | g.anatomy>=13&&g.t_shapeshiftclass>=2&&g.naturelore>3&&g.weaponlore>3 | — | {"stretchself.max": 2, "composure.max": 1, "concentrate.max": 1, "vivification.max": 1, "anatomy.max": 3, "alchemy.mod.hp.rate": 0.1, "anatomy.mod.shiftdmg": 0. |  |
| 320 | infernalist | Infernalist | t_expertclass,t_pyrovolatile,t_fireclass | g.scorchlimit4>0 | 40 scorchedcodices | {"firelore.max": 1, "firelore2.max": 1} |  |
| 350 | titan | titan | t_expertclass,t_earthclass,t_hammerclass | g.t_earthclass==2&&g.hammerlore>=10&&g.geosculpting>=10 | 100 earthgem, 20 earthrune | {"earthlore.max": 3, "player.defense": 30, "stamina.max": "20%", "hammerlore.max": 3, "earthspire.mod.space.max": 100} |  |
| 351 | wizard3 | Mythic wizard | t_tier6,t_manaclass,t_knowledgeclass | g.t6unlocker>0&&g.lore>=25&&g.spellcraft>=6 | 20000 research, 20 tomes, 3 sindel, 10 runestones | {"spellcraft.max": 1, "firelore.max": 1, "enchanting.max": 1, "waterlore.max": 1, "earthlore.max": 1, "crafting.max": 2, "history.max": 1, "potions.max": 1, "al |  |
| 352 | astralseer | astral seer | t_tier6 | g.t6unlocker>0&&g.astronomy>=14&&g.planeslore>=9 | 3 sindel | {"manadmg": 5, "spellcraft.max": 1, "planeslore.max": 2, "astronomy.max": 5, "scrying.max": 1, "sindel.rate": "5%", "mysticism.max": 2, "crafting.max": 2} |  |
| 353 | c_avatar | avatar | t_tier6,t_elementalclass | g.t6unlocker>0&&(g.t_elementalclass+g.t_natureclass+g.heresiarch+g.destined)>=2 | 3 sindel, 70 managem, 40 airgem, 40 earthgem, 40 firegem, 40 watergem | {"airlore.max": 2, "earthlore.max": 3, "waterlore.max": 2, "firelore.max": 1} |  |
| 354 | deathlock | death lock | t_tier6,t_demonclass,t_summonclass | g.t6unlocker>0&&g.demonology>=19&&g.evil3>0 | 60 arcana, 10 firerune | {"earthlore.max": 2, "firelore.max": 2, "shadowlore.max": 3, "demonology.max": 5} |  |
| 357 | thanophage | Thanophage | t_expertclass,t_shadowclass,t_bloodclass,t_expert_shadowclass | g.t_shadowclass>=2&&g.tier7>0 | 10 bloodgem | {"evilamt": 20, "bloodgem.max": 10, "bodies.mod.bloodsiphon.effect.hp": 0.05, "research.max": 25, "shadowlore.max": 2, "anatomy.max": 3} | ["t_expert_shadowclass"] |
| 357 | eldritchknight | eldritch knight | t_tier6,t_swordclass | g.t6unlocker>0&&g.t_swordclass>0&&(g.bladelore+g.weaponlore)>=12&&g.tier6==0 | 40 airgem, 20 firegem, 20 earthgem, 20 watergem | {"stamina.rate": "0.5+2%", "vigor.rate": "0.05+2%", "history.max": 1, "enchanting.max": 1, "bladelore.max": 2, "blade_spellbook.max": 1, "elemental.max": 1, "an |  |
| 358 | primarch | Primarch | t_expertclass,t_lightclass | ["g.lightlore>=20", "g.spiritlore>=18", "g.highpriest>0"] | 60 lightgem, 40 spiritgem, 15 lightrune, 10 spiritrune | {"lightlore.max": 3, "lightlore.mod.speed": 0.1, "spiritlore.max": 3, "spiritlore.mod.t_churchfollower.defense": 1, "heallore.max": 2, "heallore.mod.t_churchfol |  |

## Sections (tabs) and unlock requirements

| id | name | parent | require | locked |
|---|---|---|---|---|
| sect_main | main |  | always | False |
| sect_skills | skills |  | apprentice_lessons |  |
| sect_home | home |  | alcove |  |
| sect_raid | adventure |  | job_adventuring |  |
| sect_player | player |  | always | False |
| sect_spells | spells |  | g.spellbook.value>0\|\|g.weaponlore>0 |  |
| sect_scraft | spellcraft |  | spellcraft |  |
| sect_equip | Equipment |  | job_adventuring |  |
| sect_bestiary | bestiary |  | g.bestiary>0\|\|g.lore>=11 |  |
| sect_travelogue | travelogue |  | g.travelogue>0 |  |
| sect_potions | potions |  | g.potions>0 |  |
| sect_minions | minions |  | g.minions>0 |  |
| sect_furniture | furniture | home | always | False |
| sect_converters | converters | home | always | False |
| sect_glossary | glossary |  | apprentice |  |
| sect_settings_main | main | settings | always |  |
| sect_settings_extra | extra stats | settings | always |  |
| sect_domain | domain |  | g.t_domain>0 |  |
| sect_loot | loot | sect_equip | job_adventuring |  |
| sect_craft | crafting | sect_equip | g.craftinglearn1>0\|\|g.t_shapeshiftunlock>0 |  |
| sect_enchant | enchanting | sect_equip | enchanting |  |

## Resources: groups and base caps

| group | id | name | base max | base rate | require | mod | desc |
|---|---|---|---|---|---|---|---|
|  | starsight | Seeing by Starlight |  |  |  | {"throne_boss.result.void_discovery_trigger": 1} | Lingering starlight tinges your vision. If you are reading t |
|  | void_discovery_trigger | Something In The Darkness | 1 |  |  |  | Used to smooth over oddity in the code for triggering events |
|  | domain_danger | Domain Danger |  |  |  |  |  |
|  | instability | instability | 500 | -0.1 |  | {"tempus.rate": "-0.2%", "prismatic.rate": -0.01} | Time is a dangerous thing. Try not to wink out of existence |
|  | space | Floor Space | 0 |  |  |  | Available space. |
|  | vigor | vigor | 10 |  |  |  | Your capacity for short-term exertions. |
|  | mana | mana | 0 |  | lore |  | Raw magical energy. |
|  | water | water | 0 |  | waterlore |  | Water mana. |
|  | air | air | 0 |  | airlore |  | Air mana. |
|  | fire | fire | 0 |  | firelore |  | Fire mana. |
|  | earth | earth | 0 |  | earthlore |  | Earth mana. |
|  | nature | nature | 0 |  | naturelore |  | Nature mana. |
|  | spirit | spirit | 0 |  | spiritlore |  | Spirit mana. |
|  | light | light | 0 |  | lightlore |  | Light mana. |
|  | shadow | shadow | 0 |  | shadowlore |  | Shadow mana. |
|  | chaos | chaos | 0 |  | g.t_chaosclass>0\|\|g.chaoslore>0 |  | Chaos incarnate. You can do anything! |
|  | tempus | tempus | 0 |  | chronomancy |  | Time incarnate. If only... |
|  | void | void | 0 |  |  |  | Nothingness. |
|  | blaze | Blaze | 50 |  |  | {"blaze.rate": -0.1, "firedmg": "0.5%", "fire.rate": "0.5%"} | Glorious flame, always ready, always burning. |
|  | scorch | Scorch | 100 |  |  | {"fire.rate": 0.1, "hp.rate": -0.5, "barrier.rate": -0.5, "stamina.rate": -0.5,  | Feel the burn... |
|  | inferno | Inferno | 100 |  |  | {"fire.rate": 0.7, "scorch.rate": 0.1, "prismatic.rate": -0.5} | ...burn the feel! |
| adversities | voidcontamination | Void Contamination | 100 |  |  | {"stress.rate": 0.025, "stamina.max": "-0.9%", "vigor.max": "-0.9%", "void.rate" | Nothing is clinging to your back. Nothing presses at your mi |
| adversities | debt | debt | 500 |  | g.debt>=1 |  | Debt is gnawing at you. |
| adversities | timeparadox | time paradox | 20 | -0.01 |  |  | Hold on, the stables were demolished a century ago? |
| basic | offlinetime | stored time | 3600 |  |  |  | Time since you last checked in. Can be used to speed up the  |
| basic | gold | gold | 5 |  |  |  | Gold coins. |
| constructs | puppets | puppets | 20 |  |  |  | Easily controlled, yet fundamentally inert. |
| constructs | machinae | machinae | 20 |  |  |  | Towering hulks of metal, ready to do their master's bidding. |
| constructs | automatas | automata | 20 |  |  |  | Constructs of translucent crystal; they possess a pristine i |
| domain | domain_happiness | Domain Happiness | 100 | 1 | g.t_domain>0 | {"domain_danger": 0.01} | The general wellbeing of your domain. |
| domain | domain_education | Domain Education | 100 | 1 | g.domain_guild_scribe>0 | {"domain_danger": 0.01} | The level of literacy and knowledge in your domain. |
| domain | domain_industry | Domain Industry | 100 | 1 | g.domain_guild_artisan>0 | {"domain_danger": 0.01} | The economic activity of your domain. |
| domain | domain_mysticism | Domain Mysticism | 100 | 1 | g.domain_guild_alchemist>0 | {"domain_danger": 0.01} | The magical power and potential of your domain. |
| esoteric | sindel | star shard | 3 |  |  | {"light.rate": 0.1, "player.resist.shadow": 1} | A glowing cinder of the stars. |
| esoteric | dreams | dreams | 3 |  |  | {"weary.rate": -0.1, "arcana.rate": "1%"} | We are such stuff as dreams are made of. And our little life |
| gems | gems | gemstones | 5 |  |  |  | Various fine gemstones. |
| gems | bloodgem | blood gem | 2 |  |  |  | A little magic and a lot of blood. |
| gems | managem | arcane gem | 2 |  |  |  | Gem infused with arcane energy. |
| gems | watergem | water gem | 2 |  |  |  | Gem imbued with the essence of water. |
| gems | airgem | air gem | 2 |  |  |  | Gem imbued with the essence of air. |
| gems | firegem | fire gem | 2 |  |  |  | Gem imbued with the essence of fire. |
| gems | earthgem | earth gem | 2 |  |  |  | Gem imbued with the essence of earth. |
| gems | naturegem | nature gem | 2 |  |  |  | Physical essence of life. |
| gems | spiritgem | spirit gem | 2 |  |  |  | Gem imbued with raw spirit. |
| gems | lightgem | light gem | 2 |  |  |  | Gem imbued with the essence of light. |
| gems | shadowgem | shadow gem | 2 |  |  |  | Gem imbued with the essence of darkness. |
| gems | chaosgem | chaos gem | 3 |  |  | {"chaos.rate": 0.01} | Every time you look at it, it looks different. |
| gems | timegem | time gem | 3 |  |  | {"tempus.rate": 0.01} | Crafted from gems which do not yet exist. |
| gems | voidgem | void gem | 3 |  |  | {"player.resist.void": 1} | The space where a gem once was. |
| knowledge | res_education_lockpick | Unverified personal gnosis | 3 |  |  |  |  |
| knowledge | voidsecrets | Void Insights | 100 |  |  | {"research.rate": -1} | Forget what you think you know. Only then can you understand |
| knowledge | res_attune_werry_vertex | Werry Attunement Vertex | 2 |  |  |  |  |
| knowledge | research | research | 10 |  |  |  | Research into the Arcane. |
| knowledge | arcana | arcana | 0 |  |  |  | Profound mystical knowledge. |
| knowledge | scrolls | scrolls | 10 |  |  | {"research.rate": 0.005, "research.max": 1} | Scroll of arcane lore. |
| knowledge | codices | codices | 10 |  |  | {"research.rate": 0.07, "research.max": 5} | Codex of arcane lore. |
| knowledge | tomes | tomes | 5 |  |  | {"research.max": 25, "research.rate": 0.3, "arcana.rate": 0.001, "lore.rate": 0. | A hefty tome of knowledge. |
| materials | herbs | herbs | 10 |  |  |  | Special plants for potions and alchemy. |
| materials | potionessence | potion base | 3 |  |  |  | Basic essence for creating advanced potions. |
| materials | ichor | ichor | 5 |  |  |  | The blood of gods. |
| materials | iron | iron | 50 |  |  |  |  |
| materials | quicksteel | quicksteel | 50 |  |  |  |  |
| materials | adamant | adamant | 50 |  |  |  |  |
| materials | leather | leather | 50 |  |  |  |  |
| materials | serpentskin | Serpent Skin | 50 |  |  |  |  |
| materials | aetherhide | aetherhide | 50 |  |  |  |  |
| materials | cotton | cotton | 50 |  |  |  |  |
| materials | spidersilk | Spider Silk | 50 |  |  |  |  |
| materials | amberroot | Amber Root | 50 |  |  |  |  |
| materials | rubies | rubies | 50 |  |  |  |  |
| materials | diamonds | diamonds | 50 |  |  |  |  |
| materials | basiliskhide | Basilisk Hide | 50 |  |  |  |  |
| materials | dragonscale | Dragon Scales | 500 |  |  |  |  |
| materials | fineparts | fine-tuned parts | 10 |  |  |  | Made to extremely exacting specifications, can be used in pr |
| materials | deepsteel | core steel | 25 |  |  |  | Steel forged in the very core of the world. |
| materials | emptytimepiece | intricate timepiece | 6 |  |  |  | An ordinary timepiece, crafted with remarkable materials. |
| materials | chargedtimepiece | charged timepiece | 6 |  |  |  | Imbued with time energies, this timepiece shows the current  |
| materials | stillroom | still room | 1 |  |  |  | Nothing occurs within this room. |
| necromancy | bodies | bodies | 1 |  | g.evil1_floodgate>0\|\|g.transfusions>0 |  | Bodies for necromantic magic. |
| necromancy | skulls | skulls | 5 |  |  |  | Human skull. |
| necromancy | bones | bones | 10 |  |  |  | Human bones. |
| necromancy | bonedust | Bone Dust | 10 |  |  |  | The dust of human bones. |
| necromancy | souls | Trapped Souls | 1 |  |  | {"shadow.rate": 0.001, "spiritlore.rate": 0.01} | Imprisoned souls of living creatures. |
| pyromancy | kindling | kindling | 5 |  |  | {} | Scraps of paper, ready for the flame. |
| pyromancy | burningcodices | Burning Codices | 20 |  |  | {"research.rate": 0.1} | A libram now bearing an eternal flame instead of more conven |
| pyromancy | scorchedcodices | Scorched Codices | 50 |  |  | {"research.rate": 0.04} | Even the flame has died away. But what remains has its own v |
| pyromancy | burninggems | Burning Gems | 8 |  |  | {} | This fire gem has been sparked into life, burning merrily aw |
| pyromancy | blazinggems | Blazing Gems | 8 |  |  | {} | The flame has been stoked to dangerous levels, rendering thi |
| pyromancy | infernalgems | Infernal Gems | 60 |  |  | {} | What is left, when you burn fire itself down to ashes? It mi |
| reliquary | warriorsoul_item | Rusted Longsword | 1 |  |  | {"reliquary.mod.spiritgem.max": 1} | Belonged to a warrior slain in the Skittering Caverns. |
| reliquary | thiefsoul_item | Faded Locket | 1 |  |  | {"reliquary.mod.spiritgem.max": 1} | Belonged to a thief who drowned searching Veldran's Wreck. |
| reliquary | magesoul_item | Tattered Grimoire | 1 |  |  | {"reliquary.mod.spiritgem.max": 1} | Belonged to a mage who perished in the Lost Menagerie. |
| reliquary | lostsouls | Lost Souls | 5 |  |  | {"spirit.rate": 0.002, "spiritlore.rate": 0.01} | Wandering souls of living creatures. |
| runes | voidrune | Void Runes | 0 |  | g.voidsecrets>0 | {"void.max": 1} | Nothing is written on this slab of stone, but it is a nothin |
| runes | runestones | rune stones | 10 |  |  | {"research.max": 10, "runelore.rate": "0.02//100/-8"} | Runes carved on pieces of stone. |
| runes | manarune | mana runes | 10 |  |  | {"research.max": 10} | The surging energy of this rune can be felt even by the leas |
| runes | waterrune | water runes | 10 |  |  | {"research.max": 10} | Rune lined in flowing water. |
| runes | airrune | air runes | 10 |  |  | {"research.max": 10} | Rune etched with solid air. |
| runes | firerune | fire runes | 10 |  |  | {"research.max": 10} | Rune etched with lines of fire. |
| runes | earthrune | earth runes | 10 |  |  | {"research.max": 10} | Rune ingrained with moonstone. |
| runes | naturerune | nature runes | 10 |  |  | {"research.max": 10} | Formed out of a complicated tangle of stems and leaves. |
| runes | spiritrune | spirit runes | 10 |  |  | {"research.max": 10} | Runes written in a dead language. |
| runes | lightrune | light runes | 10 |  |  | {"research.max": 10} | Rune ingrained with sparkling diamond. |
| runes | shadowrune | shadow runes | 10 |  |  | {"research.max": 10} | Black upon black, only a trained eye can distinguish the tin |
| runes | chaosrune | chaos runes | 10 |  |  | {"chaos.max": 1} | Unmistakably a rune, even if it's impossible to tell quite w |
| runes | timerune | time runes | 6 |  |  | {"tempus.rate": 0.05, "bf.rate": 0.01} | Time flows along the grooves of the rune. |

## Player stats (player.json)

| id | name | val | max | stat | defeatstat | desc |
|---|---|---|---|---|---|---|
| level |  | 0 |  | True |  |  |
| exp |  | 0 |  |  |  |  |
| stamina |  | 10 | 10 |  | True |  |
| hp | life | 5 | 5 |  | True | Wizard life-force. |
| barrier |  | 0 | 0 |  |  | Wizard's basic harm prevention measure |
| defense |  | 0 |  | True |  |  |
| dodge |  | 1 |  | True |  |  |
| tohit |  | 0 |  | True |  |  |
| speed |  | 1 |  | True |  | Movement speed. |
| chainhit | Extra Attacks | 1 |  | True |  |  |
| chaincast | Extra Spell Casts | 1 |  | True |  |  |
| breath |  | 15 | 15 |  |  |  |
| fame | notoriety | 0 |  | True |  | Your reputation in the world. |
| virtue |  | 0 |  | True |  | Tendency to good. |
| evilamt | evil | 0 |  | True |  | Tendency to evil. |
| dist | distance | 5 |  | True |  | Maximum travel distance. |
| luck |  | 0 |  | True |  | Affinity for fortune. |
| stat_thorns | thorns | 0 |  | True |  |  |
| stat_reflect | damage reflection | 0 |  | True |  |  |

## Stressors (locale "HP")

| id | name | max | desc |
|---|---|---|---|
| bf | befuddlement | 10 | Outright confusion in your studies. |
| unease | unease | 10 | A general feeling of unwell. |
| weary | weariness | 10 | The fatigue of mental strain. |
| rage | frustration | 10 | Rising book-throwing urges. |
| madness | madness | 10 | Warping of your mind under magical influences. |

## Equipment slots

| id | name | group | max | desc |
|---|---|---|---|---|
| mainhand | Main hand | equip | 1 | For main hand weapons. |
| offhand | Offhand | equip | 0 | For offhand tools. |
| head | Head | equip | 0 | armor. |
| hands | Hands | equip | 0 | armor. |
| back | Back | equip | 0 | armor. |
| waist | Waist | equip | 0 | armor. |
| neck | Amulet | equip | 0 | armor. |
| trinket | Trinket | equip | 0 | armor. |
| fingers | Ring | equip | 0 | armor. |
| chest | Chest | equip | 0 | armor. |
| shins | Shins | equip | 0 | armor. |
| feet | Feet | equip | 0 | armor. |
| limb | Limbs | equip | 0 |  |
| sense | Senses | equip | 0 |  |
| skin | Skin | equip | 0 |  |
| guts | Guts | equip | 0 |  |
| brain | Brain | equip | 0 |  |

## Skills (all 69)

| id | name | school | require | need | buy | run (per s) | base max | mod per level |
|---|---|---|---|---|---|---|---|---|
| magicalanimation | Animation |  | ["g.puppetry>=5", "g.spiritlore>=8"] |  | 20 arcana | 0.3 stamina | 5 | {"allies.max": 0.25, "research.max": 5} |
| manalore2 | Arcane mastery |  | g.lore>=10&&g.t_knowledgeclass>0&&g.tier2>0 |  | 50 arcana | 1 stamina, 0.5 mana | 5 | {"mana.max": 1, "mana.rate": "1%", "manadmg": 3} |
| automatasculpting | Automata Sculpting |  | g.crafting>=18&&g.puppetry>=8&&g.magicalanimation>=6&&g.magiphysics>=5&&(g.mechanist+g.mechamancer)>0 |  | 90 arcana | 1 stamina | 5 | {"minions.puppet.hp.max": "1%", "minions.machina.hp.max": "1%", "minions.automata.hp.max": "1%", "puppetry.max": 0.2, "magicalanimation.max" |
| firelore2 | Fire Mastery |  | g.firelore>=13&&g.t_fireclass>0&&g.tier2>0 |  | 30 arcana | 1 stamina, 1.5 fire | 5 | {"firerune.max": 2, "fire.max": "10%", "fire.rate": "5%", "firedmg": 5} |
| magiphysics | Magiphysics |  | g.lore>=15&&g.planeslore>=9&&g.tier4>0 |  | 75 arcana | 0.5 stamina | 5 | {"planeslore.rate": 0.05, "lore.rate": 0.05, "research.max": 5} |
| machinacreation | Mechanical Magic |  | (g.crafting>=12&&g.puppetry>=6&&g.magicalanimation>=5&&g.t2_studies>0)\|\|(g.crafting>=10&&g.machinadecon>0&&g.machinarecon>0) |  | 30 arcana | 0.3 stamina | 5 | {"minions.machina.hp.max": "1%", "puppetry.max": 0.2, "magicalanimation.max": 0.2, "allies.max": 0.25, "research.max": 5} |
| puppetry | Puppetry |  | ["g.crafting>=8", "g.spiritlore>=4"] |  | 15 arcana | 0.2 stamina | 5 | {"minions.puppet.hp.max": "1%", "allies.max": 0.25, "research.max": 5} |
| runelore | Runic Lore | arcane | t2_studies | dwarfbook | 2500 research, 1 runestones | 0.2 stamina, 1 research | 5 | {"research.max": "0.3%", "lore.max": 0.2, "languages.max": 0.1} |
| shademastery | Shade Mastery | shadow | g.necromancy>0&&g.t_necroclass>=2 |  | 10 souls | 0.1 souls, 2.5 shadow | 5 | {"t_summon_shade.statedata.barrier.max": "10%", "t_summon_shade.speed": 1, "minions.t_minion_shade.barrier.max": "10%", "minions.t_minion_sh |
| spiritlore2 | Spirit Channeling |  | ["g.spiritlore>=10", "g.t_spiritclass>0", "g.tier2>0"] | summonsource | 50 arcana | 1 stamina, 0.5 spirit | 5 | {"spiritrune.max": 2, "spirit.max": 1, "spirit.rate": "1%", "spiritdmg": 3, "minions.t_minion_spirit.barrier.max": "5%", "minions.t_minion_s |
| undeadmastery | Undead Mastery | shadow | g.t_necroclass>0 |  | 2 bodies | 0.1 bodies, 1.5 shadow | 5 | {"t_summon_undead.statedata.hp.max": "10%", "t_summon_undead.speed": 1, "minions.t_minion_undead.hp.max": "10%", "minions.t_minion_undead.hp |
| voidlore2 | Void Suffusion |  | g.voidsurrender>0 | g.voidintegration>g.voidlore2 | 100 voidsecrets, 100 arcana | 2 voidsecrets | 0 | {"voidsecrets.max": 10, "voidsecrets.mod.research.rate": 0.1, "void.max": 1, "voiddmg": 5} |
| wizlore | Wizard lore | arcane | (g.t_knowledgeclass+g.tier5)>=2 |  | 75 arcana | 1 stamina, 50 research, 0.5 arcana | 5 | {"lore.rate": 0.1, "mana.rate": "3%", "research.rate": "2%", "arcana.rate": "1%"} |
| voidlore | abyss gazing |  | g.planeslore>=9&&g.tier5>0 |  | 150 arcana | 1 stamina, 5 research, 0.1 arcana | 5 | {"space.max": "2%", "research.max": 1} |
| airlore | aeromancy |  |  | g.lore>=3&&g.airsource>0 | 10 arcana | 0.2 stamina | 1 | {"research.max": 5, "air.max": 1, "air.rate": 0.01} |
| airlore2 | air mastery |  | g.airlore>=10&&g.t_airclass>0&&g.tier2>0 |  | 50 arcana | 1 stamina, 0.5 air | 5 | {"airrune.max": 2, "air.max": 1, "air.rate": "1%", "airdmg": 3} |
| alchemy | alchemy | elemental | g.t0_studies>0&&g.herbalism>=4 |  | 14 arcana | 0.4 stamina | 1 | {"research.max": 5, "gold.rate": 0.01} |
| anatomy | anatomy | ['nature', 'shadow', 'light'] | g.neophyte_studies>0&&g.lore>=6 |  | 5 arcana | 0.4 stamina | 5 | {"research.max": 1, "hp.max": 0.1, "t_rest.effect.hp": 0.1} |
| animals | animal handling |  |  | t_pets | 20 research | 0.3 stamina | 5 | {"research.max": 1, "steed.mod.dist": "1//10/1"} |
| waterlore | aquamancy |  |  | g.lore>=3&&g.watersource>0 | 5 arcana | 0.2 stamina | 1 | {"research.max": 5, "water.max": 1, "water.rate": 0.01} |
| astrallore | astral communion |  | g.planeslore>=9&&g.tier5>0 |  | 150 arcana | 1 stamina, 10 research, 0.5 arcana | 5 | {"sindel.rate": 0.0001, "sindel.max": 0.4} |
| astronomy | astronomy |  |  | starsource | 7 arcana | 0.2 stamina | 5 | {"research.max": 5} |
| bloodlore | blood magic | blood | g.t_bloodclass>0 |  | 40 arcana | 1 stamina, 1 hp | 5 | {"anatomy.rate": 0.05, "hp.max": "5%", "hp.rate": 0.1} |
| charms | charms |  | g.enchanting>=5&&g.lore>=8 |  | 30 arcana | 0.5 stamina | 5 | {"research.max": 1, "minions.max": "10%", "allies.max": 1} |
| chronomancy | chronomancy |  | t3_studies | timesource | 60 arcana | 0.7 stamina, 1 research, 1 mana | 1 | {"tempus.max": 1, "tempus.rate": 0.001} |
| citynavigation | city navigation |  | t1_adventuring |  | 20 arcana | 0.2 stamina | 5 | {"research.max": 5} |
| composure | composure |  | g.concentrate>=4 |  | 12 arcana | 0.3 stamina | 5 | {"stress.rate": -0.1} |
| concentrate | concentration |  | g.t_locale>=2 |  | 8 arcana | 0.2 stamina | 5 | {"stress.max": 1} |
| conjuration | conjuration | arcane | g.t0_studies>0&&g.lore>=7&&g.divination>=3 |  | 14 arcana | 0.2 stamina, 0.2 spirit | 5 | {"research.max": 1} |
| crafting | crafting |  |  | workspace | 20 research | 0.3 stamina | 5 | {"research.max": 1} |
| debitomancy | debitomancy |  | (g.debt>=10\|\|g.shopkeeping>=6)&&g.tier1>0 |  | 40 arcana | 0.3 stamina, 1 debt | 5 | {"research.max": 5, "debt.max": 100} |
| demonology | demonology |  | g.t_demonclass>0 |  | 20 arcana | 0.4 stamina, 1 hp | 5 | {"arcana.max": 0.1, "lore.rate": 0.1, "research.max": 3} |
| divination | divination | spirit | g.spiritlore>=6\|\|g.mysticism>=5 | spiritsource | 14 arcana | 0.2 stamina | 1 | {"research.max": 1} |
| duelinglore | dueling |  | g.t_duelingclass>0 | armssource | 40 arcana | 1.5 stamina | 1 | {"duelingdmg": 2, "piercedmg": 2} |
| earthlore2 | earth mastery |  | g.earthlore>=10&&g.t_earthclass>0&&g.tier2>0 |  | 50 arcana | 1 stamina, 0.5 earth | 5 | {"earthrune.max": 2, "earth.max": 1, "earth.rate": "1%", "earthdmg": 3} |
| enchanting | enchanting |  | g.tier1>0&&g.lore>=8 | ((g.managem>=1)+(g.firegem>=1)+(g.watergem>=1)+(g.naturegem>=1)+(g.earthgem>=1)+(g.airgem>=1)+(g.shadowgem>=1)+(g.lightgem>=1)+(g.spiritgem>=1))>=3 | 300 research | 0.4 stamina, 1 research | 5 | {"enchantslots.max": 1} |
| earthlore | geomancy |  |  | g.lore>=3&&g.earthsource>0 | 10 arcana | 0.3 stamina | 1 | {"research.max": 5, "earth.max": 1, "earth.rate": 0.01} |
| geosculpting | geosculpting |  | g.t_earthclass>0 |  | 30 arcana | 0.5 stamina | 5 | {"player.defense": 0.3, "player.dodge": -0.2, "earthspire.mod.space.max": 1} |
| hammerlore | hammer proficiency |  | g.t_hammerclass>0 | armssource | 25 arcana | 1.5 stamina | 5 | {"hammerdmg": 3} |
| herbalism | herbalism | nature |  | plantsource | 25 research | 0.25 stamina | 5 | {"research.max": 2, "herbs.max": 2} |
| chaoslore | imposition | chaos | g.tier4>0&&g.trickery>=12 |  | 80 arcana | 1 stamina, 1 mana | 5 | {"luck": 1, "chaos.max": 1, "chaos.rate": "0.01+1%", "arcana.rate": 0.01, "lore.rate": 0.05, "research.rate": "1%"} |
| languages | languages | lore | lore |  | 10 research | 0.2 stamina | 5 | {"research.rate": 0.05, "research.max": 5, "lore.rate": 0.1} |
| lightlore2 | light mastery |  | g.lightlore>=10&&g.t_lightclass>0&&g.tier2>0 |  | 50 arcana | 1 stamina, 0.5 light | 5 | {"light.max": 1, "light.rate": "1%", "lightdmg": 3} |
| lightlore | lumenology | light |  | g.lore>=3&&g.lightsource>0 | 12 arcana | 0.2 stamina | 1 | {"research.max": 5, "light.max": 1, "light.rate": 0.01} |
| lore | mage lore | arcane | apprentice_lessons |  | 20 research | 0.2 stamina | 5 | {"research.max": 10, "arcana.max": 2, "arcana.rate": 0.002} |
| magicbeasts | magic beasts |  | g.animals>=7&&g.naturelore>=5 |  | 20 arcana | 0.5 stamina | 5 | {"research.max": 5, "animals.rate": 0.05, "allies.max": 0.25} |
| weaponlore | martial |  |  | armssource | 5 vigor | 0.6 stamina, 0.12 vigor | 5 | {"physdmg": 1, "bluntdmg": 0.4, "piercedmg": 0.4, "slashdmg": 0.4} |
| mysticism | mysticism |  | g.lore>=8 |  | 10 arcana | 0.5 stamina | 5 | {"mana.max": 0.5, "arcana.rate": 0.001, "prismatic.rate": 0.02} |
| naturelore | nature studies |  | g.herbalism>=3&&g.lore>=3 |  | 8 arcana | 0.2 stamina | 1 | {"research.max": 5, "nature.max": 1, "nature.rate": 0.01} |
| necromancy | necromancy | shadow | g.t_necroclass>0 |  | 30 arcana, 3 souls | 0.4 stamina, 0.5 shadow | 5 | {"shadow.rate": 0.01} |
| planeslore | planes lore |  | g.astronomy>=5&&g.t1_adventuring>0 |  | 30 arcana | 0.3 stamina, 1 research, 0.1 mana | 1 | {"arcana.max": 1, "research.max": 5} |
| potions | potions |  | g.crafting>=3&&g.alchemy>=2&&g.potsource.locked==0 | ["workspace", "potsource"] | 18 arcana | 0.3 stamina | 5 | {"research.max": 5} |
| firelore | pyromancy |  |  | g.lore>=3&&g.firesource>0 | 10 arcana | 0.2 stamina, 0.2 hp | 1 | {"research.max": 5, "fire.max": 1, "fire.rate": 0.05} |
| heallore | rejuvenation | ['light', 'water', 'nature'] | g.t_healspell.owned&&g.tier2>0 | g.t_healspell>=50 | 60 arcana | 0.5 stamina | 5 | {"spellheal": 2} |
| scrying | scrying |  | g.divination>0 |  | 20 arcana | 0.25 stamina | 5 | {"research.max": 1, "arcana.max": 0.2} |
| shadowlore2 | shadow mastery |  | g.shadowlore>=10&&g.t_shadowclass>0&&g.tier2>0 |  | 50 arcana | 1 stamina, 0.5 shadow | 5 | {"shadow.max": 1, "shadow.rate": "1%", "shadowdmg": 3} |
| shopkeeping | shopkeeping |  | g.gold>=1000&&g.tier1>0 |  | 15 arcana | 0.2 stamina, 1 gold | 5 | {"research.max": 5, "gold.max": 10} |
| spearlore | spear proficiency |  | g.t_spearclass>0 | armssource | 25 arcana | 1.5 stamina | 5 | {"speardmg": 3} |
| spellcraft | spellcraft | arcane | g.t3_studies>0&&g.lore>=10 |  | 60 arcana | 0.2 stamina, 5 research | 1 | {"research.max": 5, "scraftlist.max": 1, "userSpells.max": 0.7} |
| spiritlore | spirit communion | spirit |  | g.lore>=3&&g.spiritsource>0 | 5 arcana | 0.2 stamina | 1 | {"research.max": 5, "spirit.max": 1, "spirit.rate": 0.01} |
| summoning | summoning | arcane | g.tier1>0&&g.conjuration>=5 |  | 25 arcana | 0.5 stamina | 5 | {"research.max": 5, "allies.max": 1, "minions.max": 0.5} |
| bladelore | swordplay |  | g.t_swordclass>0 | armssource | 25 arcana | 1.5 stamina | 5 | {"sworddmg": 3, "sword_lessons.max": 1} |
| trickery | trickery | arcane | spellbook | g.prestidigitation>=10\|\|g.tier1>0\|\|g.hal_trick_pumpkin>0 | 13 arcana | 0.2 stamina, 1 gold | 5 | {"luck": 0.2} |
| shadowlore | umbramancy | shadow |  | g.lore>=3&&g.shadowsource>0 | 12 arcana | 0.2 stamina | 1 | {"research.max": 5, "shadow.max": 1, "shadow.rate": 0.01} |
| naturelore2 | viriditas |  | g.naturelore>=10&&g.t_natureclass>0&&g.tier2>0 |  | 30 arcana | 1 stamina, 0.5 nature | 5 | {"nature.max": 1, "nature.rate": "1%", "naturedmg": 3} |
| vivification | vivification |  | g.tier4>0&&g.anatomy>0&&g.spiritlore>=5 |  | 80 arcana | 1 stamina | 5 | {"stamina.rate": 0.1, "vigor.rate": 0.01, "anatomy.rate": 0.05} |
| waterlore2 | waveshaping |  | g.waterlore>=10&&g.t_waterclass>0&&g.tier2>0 |  | 30 arcana | 1 stamina, 0.5 water | 5 | {"water.max": 1, "water.rate": "1%", "waterdmg": 3, "player.barrier.max": "2%"} |
| weaving | weaving |  |  | weavesource | 14 arcana | 0.4 stamina | 5 | {"crafting.max": 0.1, "crafting.rate": 0.05} |
| history | world lore |  | g.languages>=6 |  | 12 arcana | 0.2 stamina | 5 | {"research.max": 15, "arcana.max": 0.1, "languages.rate": 0.05} |

## Homes

| id | name | tags | require | buy | mod | locks |
|---|---|---|---|---|---|---|
| alcove | alcove | t_apprenticehome | apprentice_movein | — | {"space.max": 5} |  |
| atticbedroom | Attic Bedroom | t_apprenticehome | neophyte | 50 research | {"space.max": 10} | ["alcove"] |
| innroom | Lodge at Inn |  | g.innroom>0 | — | {"space.max": 12, "gold.rate": -0.25} |  |
| hut | hut |  | tier0 | 300 gold | {"space.max": 15} | innroom |
| camp | camp | outdoors,starsource,t_mobilehome | g.tier0>0&&g.naturelore>=5 | 75 gold | {"space.max": 14, "lore.rate": -0.1, "research.rate": -0.1, "naturelore.mod.nature.max": 0.25} | innroom |
| wagon | tinker's wagon | outdoors,t_pets,starsource,t_mobilehome | g.tier0>0&&g.naturelore>=5 | 150 gold | {"space.max": 12, "naturelore.mod.minions.max": 0.2, "inv.max": 5, "gold.max": 100, "mule.mod.inv.max": 2, "mule.mod.gold.max": 50} | innroom |
| cottage | cottage |  | tier0 | 500 gold, 5 gems | {"space.max": 20, "minions.max": 1} | innroom |
| house | house |  | g.tier0>0&&g.arcana.max>=8 | 900 gold, 10 gems | {"space.max": 30, "minions.max": 3} | innroom |
| shop | shop |  | g.t1_housing>0&&g.crafting>=9 | 850 gold, 9 gems | {"space.max": 25, "minions.max": 2, "magicgems.max": 1, "gold.rate": 0.2, "gold.max": 25, "nature.rate": "-5%", "arcana.rate": -0.002} |  |
| inn | inn |  | g.t1_housing>0&&g.languages>=7 | 2000 gold, 15 gems | {"space.max": 50, "minions.max": 5, "research.rate": -0.5, "gold.max": 40, "gold.rate": 0.4, "arcana.rate": -0.001} |  |
| lodge | lodge |  | g.t1_housing>0&&g.naturelore>=7 | 950 gold, 5 gems | {"space.max": 30, "minions.max": 5, "nature.max": 1, "nature.rate": 0.1} |  |
| gabledhouse | gabled mansion |  | g.t1_housing>0&&g.arcana>=10 | 2000 gold, 10 gems | {"space.max": 65, "minions.max": 5} |  |
| halftimber | half-timber house |  | g.t1_housing>0&&g.arcana>=10 | 3000 gold, 15 gems | {"space.max": 75, "minions.max": 7} |  |
| cave | Cave | outdoors,starsource,t_underground | g.tier0>0&&(g.shadow+g.earth+g.nature)>0 | 150 gold | {"space.max": 25, "research.rate": -0.25, "earthlore.rate": "30%", "shadowlore.rate": "30%", "lightlore.rate": "-30%", "airlore.rate": "-30%"} | ["latticewindow"] |
| pavilion | pavilion | lightsource | t_divinationclass | 800 gold, 15 gems | {"space.max": 50, "minions.max": 3, "light.rate": 0.1, "air.rate": 0.1, "mana.rate": 0.1, "shadow.max": -1, "shadow.rate": "-5%"} |  |
| hauntedmanse | haunted manse | spiritsource | hauntedmanor | 2500 gold | {"space.max": 75, "spiritlore.mod.spirit.max": 0.25, "shadow.rate": 0.1, "demonology.mod.minions.max": 1} |  |
| ancientruins | ancient ruins |  | g.spirit>=15&&g.arcana>=12&&g.t2_social>0 | 5000 gold | {"space.max": 110, "minions.max": 10, "craftrune.cost.tomes": "-50%", "craftrune.cost.managem": "-50%", "demonology.mod.arcana.max": 0.4, "spiritlore. |  |
| lighthouse | lighthouse | watersource,lightsource,wet_real_estate | (g.t_airclass+g.t_waterclass)>0&&g.arcana>=20 | 3000 gold | {"space.max": 80, "minions.max": 5, "waterlore.mod.water.max": 0.25, "lightlore.mod.light.max": 0.5} |  |
| cataract | cataract | watersource | g.excavatewaterfall>0 | 500 gold | {"space.max": 330, "minions.max": 4, "research.rate": "-10%", "waterlore.mod.water.max": 1} | ["latticewindow"] |
| citadel | citadel |  | (g.t_spearclass+g.t_swordclass+g.t_hammerclass)>0&&g.arcana>=20 | 1000 gold | {"space.max": 60, "minions.max": 15, "nature.max": -1, "nature.rate": "-5%"} |  |
| temple | temple |  | (g.t_divinationclass+g.t_lightclass)>0 | 2000 gold | {"space.max": 60, "composure.mod.stress.rate": -0.01, "virtue.rate": 0.001, "arcana.rate": 0.001, "minions.max": 8, "lightlore.mod.light.max": 0.6, "s |  |
| palace | palace |  | g.palacerestoration>0 | 2500 gold | {"space.max": 400, "gold.mod.stress.rate": -4e-06, "stress.rate": -0.05, "magicadvice.result.gold": 0.65, "research.rate": -0.5} |  |
| castle | castle |  | g.castlerestoration>0 | 2500 gold | {"space.max": 400, "minions.max": 30, "hall_quest.run": {"hp": "-50%", "stamina": "-50%"}, "earthlore.mod.earth.max": 0.1, "earth.rate": 0.1} |  |
| cove | cove | outdoors,starsource,wet_real_estate | g.tier3>0&&(g.t_elementalclass+g.t_waterclass*2)>=2 | 3000 gold | {"space.max": 300, "minions.max": 20, "airlore.mod.air.max": 0.25, "waterlore.mod.water.max": 0.5, "water.max": 2, "water.rate": 0.1} |  |
| cavern | cavern | earthsource,t_underground | g.t2_social>0&&g.earthlore>=10 | 500 research, 3000 gold, 20 earthgem | {"space.max": 200, "minions.max": 20, "research.rate": -0.5, "earth.rate": 0.2, "earthlore.mod.earth.max": 0.5, "shadow.max": 3, "shadow.rate": 0.2, " | ["latticewindow"] |
| grove | Enchanted Grove | outdoors,starsource | g.tier3>0&&g.t_enchantingclass>0 | 4000 gold, 1600 research, 40 gems | {"space.max": 320, "minions.max": 20, "naturelore.mod.nature.max": 0.5, "enchanting.mod.enchantslots.max": 1} |  |
| facemuseum | Museum of Faces |  | g.t3_social>0&&g.trickery>=13 | 6666 gold, 666 research, 66 gems, 6 tomes | {"space.max": 300, "chaosgem.mod.chaos.max": "0.01", "chaosrune.mod.research.max": "1%", "facecollect.length": -2} |  |
| home_collective | collective | outdoors,starsource,plantsource,t_pets,t_mobilehome | g.foundcollective>0 | — | {"space.max": 150, "minions.max": 10, "allies.max": 10, "charms.mod": {"minions.max": "5%", "allies.max": 1}, "summoning.mod": {"minions.max": 1.5, "a |  |
| home_caravan | caravan | outdoors,t_pets,starsource,t_mobilehome | g.establishcaravan>0 | — | {"space.max": 150, "inv.max": 30, "gold.max": 100, "allies.max": 8, "minions.max": 8, "steed.mod": {"inv.max": 20, "gold.max": 50}} |  |
| home_emporium | emporium | watersource,plantsource,booksource,t_pets,workspace,firesource,earthsource,airsource,potsource,spiritsource,shadowsource,lightsource,starsource,enchantsource,armssource,legssource | g.buildemporium>0 | — | {"space.max": 150, "gold.max": 1000, "gold.rate": 2.5, "gems.max": 10, "gems.rate": 0.01, "magicgems.max": 3, "minions.max": 10, "arcana.rate": -0.001 |  |
| home_waterfall | waterfall | watersource | g.water>=6&&g.naturelore>=6&&g.t1_housing>0 | 500 gold | {"space.max": 50, "minions.max": 2, "research.rate": "-5%", "waterlore.mod.water.max": 0.5, "lightlore.rate": -0.4} | ["latticewindow"] |
| ruinedpalace | mouldering palace |  | g.t2_social>0 | 2500 gold | {"space.max": 150, "stress.rate": -0.025, "research.rate": -0.5} |  |
| ruinedcastle | crumbling castle |  | g.t2_social>0 | 2500 gold | {"space.max": 150, "minions.max": 10, "earth.rate": 0.1} |  |
| earthspire | earthen spire |  | g.geosculpting>=5 | 500 research, 3000 gold, 15 codices | {"space.max": 150, "minions.max": 10, "earthlore.mod.earth.max": 1, "geosculpting.mod.player.defense": 0.2, "earth.max": 5, "earth.rate": 0.5} |  |
| tower | Tower | airsource | g.t_knowledgeclass>0&&g.arcana>=20 | 2500 gold | {"space.max": 55, "minions.max": 5, "airlore.mod.air.max": 0.25} |  |
| academy | Academy |  | g.research>=400&&g.t_knowledgeclass>0 | 1000 gold, 500 research | {"space.max": 75, "minions.max": 20, "research.max": 50, "research.rate": 0.4} |  |
| magetower | Mage tower |  | g.tier4>0&&g.t_knowledgeclass>=2 | 7000 gold, 5000 research, 30 managem, 10 tomes | {"space.max": 420, "minions.max": 10, "mysticism.mod.prismatic.rate": 0.01, "prismatic.rate": 0.05, "history.mod.arcana.max": 0.9, "arcana.rate": 0.00 |  |
| home_idrasil_sprout | idrasil sprout | outdoors,starsource | g.tier2>0&&g.t_natureclass>0 | 15 gems, 25 herbs | {"space.max": 150, "minions.max": 5} |  |
| home_idrasil_sapling | idrasil sapling | outdoors,starsource | g.idrasilgrow1>0 | 15 gems, 25 herbs | {"space.max": 300, "minions.max": 10} |  |
| home_idrasil_tree | idrasil tree | outdoors,starsource | g.idrasilgrow2>0 | 15 gems, 25 herbs | {"space.max": 400, "minions.max": 20} |  |
| home_necropolis | necropolis | shadowsource,t_underground | g.raisenecropolis>0 | — | {"space.max": 400, "souls.max": 40, "bonedust.max": 50, "bodies.max": 50, "bones.max": 150, "allies.max": 10, "shadowlore": {"mod.shadow.max": 1, "mod |  |
| island | Shrouded Isle | outdoors,starsource,watersource,wet_real_estate | g.tier3>0&&g.t_waterclass>0 | 4000 gold, 40 gems, 1600 research | {"space.max": 270, "minions.max": 25, "waterlore.mod.water.max": 1, "water.rate": 0.15} |  |
| wildcamp | wild's encampment | outdoors,plantsource,t_pets,patron | g.t_natureclass>0&&g.tier2>0 | 300 gold, 20 naturegem, 50 herbs, 1000 research | {"space.max": 40, "lore.rate": -0.1, "research.rate": -0.2, "naturelore2.mod.naturedmg": 1, "naturelore.mod.nature.max": 0.25, "airlore.mod.air.max":  |  |
| clockworkhome | clockwork home |  | (g.puppeteer+g.mechanist+g.mechamancer)>0 | 500 research, 3000 gold, 5 codices | {"space.max": 50, "minions.max": 50, "puppetry.mod.allies.max": 0.25, "machinacreation.mod.allies.max": 0.25, "automatasculpting.mod.allies.max": 0.25 |  |
| shianpagoda | elegant pagoda |  | g.mkpagoda>0 | — | {"space.max": 550, "minions.max": 10, "sworduse.max": 1, "breakthrough.max": 1, "spirit.rate": 0.3, "herbs.max": 5} |  |

## Dungeons

| id | name | difficulty | dist | floors | run | require | result (first/each) | mod |
|---|---|---|---|---|---|---|---|---|
| pestcontrol | Leaky Cellar | 🦴 | 0 | 10 | 0.7 stamina | job_adventuring | {"arcana": 10, "gold": "15~20", "player.exp": 10, "title": "Master of the Cellar"} |  |
| traininggrounds | training grounds |  | 1 | 5 | — | job_adventuring |  |  |
| treffilwoods | Treffil Woods edges | 🦴 | 5 | 14 | 1 stamina | job_adventuring | {"herbs": "3~7", "gems": "0~2", "iron": "2~5"} |  |
| clockwork_castle | Corivar's Castle | 💀💀💀💀 | 8 | 30 | 1 stamina | g.magiphysics>=5&&g.clockcastle_grounds>=1 | {"machinae": "8~10", "automatas": "5~7", "puppets": "12~15", "gold": 500, "gems": 5} |  |
| stonyhills | Stony Hills | 🦴 | 10 | 12 | 0.75 stamina | job_adventuring | {"gold": "10~15", "cotton": "2~5"} |  |
| stonyhills_cavern | Stony Hills Caves | 🦴🦴 | 11 | 10 | 0.5 stamina | g.stonyhills_cavern_entrance>0 | {"gems": "2~3", "iron": "2~5"} |  |
| goblincamp | Goblin Camp | 🦴🦴🦴 | 20 | 28 | 1 stamina | g.treffilwoods>0 | {"title": "Goblin Slayer", "gold": "20~30", "cotton": "2~7", "iron": "2~7", "leather": "2~7"} |  |
| hauntedmanor | Haunted Manor | 🦴🦴🦴 | 27 | 18 | 1 stamina | ["t1_adventuring", "g.spiritlore>=9"] | {"gold": "20~30", "cotton": "2~7", "iron": "2~7", "leather": "2~7"} | {"unease.max": "5\|10\|30", "spiritlore.max": "?1"} |
| orccamp | Orc Camp | 💀 | 40 | 22 | 1.2 stamina | goblincamp | {"gold": "40~50"} |  |
| aragheights | Arag Heights | 🦴🦴🦴 | 45 | 22 | 1 stamina | stonyhills | {"gold": "20~30", "cotton": "2~7", "iron": "2~7", "leather": "2~7"} |  |
| aragogres | Ogre Cavern | 💀💀 | 50 | 22 | 1.7 stamina | g.orccamp>0&&g.aragheights>0&&g.scrying>0 | {"gold": "40~50", "bones": {"value": "5~10", "skipLocked": true}, "quicksteel": "2~7"} | {"weary.max": "5\|10\|30"} |
| underden | Under Den | 🦴🦴🦴 | 60 | 20 | 1 stamina | t0_adventuring | {"gold": "25~40", "cotton": "2~7", "iron": "2~7", "leather": "2~7"} |  |
| pillage_village | pillage village | 🦴 | 60 | 50 | 0.2 stamina, 0.1 mana | g.evil1_floodgate>0 | {"gold": "50~150", "gems": "3~5"} | {"pillage_village.dist": "800\|40\|10"} |
| aragwastes | Arag Wastes | 💀 | 80 | 20 | 2 stamina | aragheights | {"gold": "20~30", "bones": {"value": "3~7", "skipLocked": true}, "cotton": "2~7", "iron": "2~7", "leather": "2~7"} |  |
| veldransstorehouse | Veldran's Storehouse | 💀💀 | 80 | 20 | 2 stamina | g.underden>0 | {"gems": "3~5", "gold": "80~150", "quicksteel": "2~7", "serpentskin": "2~7"} | {"gold.max": "1000\|10\|30", "gems.max": "10\|10\|30"} |
| veldranswreck | Veldran's Wreck | 💀💀💀 | 85 | 18 | 1 stamina | g.veldransstorehouse>0&&g.aragheights>0 | {"gold": "75~125", "gems": "10~25", "rubies": "5~12", "watergem": "3~5", "thiefsoul_item": "g.evt_thiefghost_start>0&&g. |  |
| elementalrift | Elemental Rift | 💀 | 120 | 30 | 1 stamina | g.planeslore>=4&&g.tier1>0 | {"gems": "9~12", "lightgem": 3} | {"madness.max": "5\|10\|30"} |
| reedburgh_city_sewer | reedburgh city first ring sewer | 💀 | 125 | 25 | 0.2 stamina, 0.12 mana | g.reedburgh_market>0 | {"gold": "50~100", "gems": "5~10", "watergem": "5~10", "debt": "-50~-100"} |  |
| greatbog | The Great Bog | 💀💀💀 | 150 | 24 | 3 stamina | aragwastes | {"title": "Fetid Pathfinder", "gems": "3~5", "gold": "100~200", "bones": {"value": 10, "skipLocked": true}, "rubies": "2 |  |
| ettinmarchcamp | Ettinmarch Camp | 💀💀💀 | 150 | 28 | 2 stamina | evt_rangers | {"herbs": "3~7", "gems": "0~2", "title": "Forest Scourge"} |  |
| fetidbarrow | The Fetid Barrows | 💀💀💀 | 150 | 28 | 2 stamina | evt_cabal | {"title": "Cabal Breaker", "bodies": {"value": "0~2", "skipLocked": true}, "bones": {"value": "3~7", "skipLocked": true} |  |
| spidercave | Skittering Caverns | 💀💀 | 210 | 30 | 1.2 stamina | ["t2_adventuring", "goblincamp"] | {"title": "Spider Slayer", "gold": "40~50", "spidersilk": "5~9", "warriorsoul_item": "g.evt_warriorghost_start>0&&g.warr |  |
| holyhall | Hall of the Holy | 💀💀💀 | 250 | 28 | 2 stamina | g.planeslore.max>=4&&g.evil2>0 | {"title": "Holy Defiler", "evilamt": 10, "gold": "150~275", "quicksteel": "2~7"} |  |
| sackguild | guild of the sack makers | 💀💀💀💀💀 | 250 | 32 | 3.5 stamina | g.t_craftedbag>0 | {"title": "Guild Breaker", "iron": "0~5", "leather": "0~5", "cotton": "0~5", "quicksteel": "0~5", "serpentskin": "0~5",  |  |
| mtgorborung | Mount Gorborung | 💀💀 | 300 | 36 | 2 stamina | ["orccamp", "t2_adventuring"] | {"title": "Mountaineer", "watergem": "25%", "airgem": "10%", "gems": "3~5"} | {"breath.max": "5\|10\|30"} |
| sereditetemple | Seredite Temple | 💀💀💀 | 500 | 25 | 1.2 stamina | t3_adventuring | {"gold": "20~30", "gems": "4~5", "quicksteel": "2~7", "serpentskin": "2~7", "spidersilk": "2~7"} |  |
| unstablespire | The unstable spire | 💀💀💀 | 795 | 400 | 2 stamina | evt_hole | {"fame": 1, "gems": "10~20", "gold": "100~200", "basiliskhide": "10~20"} |  |
| belowgorborung | Below Mt. Gorborung | 💀💀💀💀💀💀 | 800 | 100 | 3 stamina | g.tier4>0&&g.mtgorborung>0 | {"title": "Lightless", "earthgem": 5, "gems": 10, "tomes": 2, "aetherhide": "2~7"} |  |
| desillagrotto | Desilla's Grotto | 💀💀💀💀 | 900 | 27 | 2.5 stamina | g.greatbog>0&&g.tier4>0 | {"gems": "3~5", "gold": "50~100", "ichor": 1, "adamant": "2~7", "aetherhide": "2~7", "amberroot": "2~7"} | {"charms.max": "0.5//2/-1"} |
| temple_of_strativax | Temple of Strativax | 💀💀💀💀💀 | 900 | 3 | — | g.scrying>=12&&g.history>=12 |  |  |
| elementalplane | Elemental Plane | 💀💀💀💀 | 1000 | 24 | 2 stamina | g.elementalrift>0&&g.tier4>0 | {"gems": "9~12", "lightgem": 3, "amberroot": "2~7"} | {"bf.max": "5\|10\|30"} |
| abyssal_layer1 | Abyssal Depths: First Layer | 💀💀💀💀💀💀 | 1200 | 25 | 3 stamina | g.planeslore>=8&&g.space.max>=20&&g.tier4>0 | {"title": "Abyssal Spelunker", "tomes": 10} |  |
| catacrypts | The Catacrypts | 💀💀💀💀💀💀 | 1200 | 1000 | 3 stamina | ["belowgorborung"] | {"title": "Twice Born", "fame": 3, "gems": "30~50", "gold": "1000~2000", "basiliskhide": "30~40"} |  |
| charredkeep | Charred Keep | 💀💀💀💀💀 | 1500 | 40 | 3 stamina | g.mtgorborung>0&&g.tier5>0 | {"title": "Lock Slayer", "gold": "300~500", "ichor": 3, "adamant": "5~7", "aetherhide": "5~7", "diamonds": "5~7", "drago |  |

## Locales

| id | name | level | dist | floors | #encs | run | require | result | mod |
|---|---|---|---|---|---|---|---|---|---|
| mustylibrary | musty library | 0 | 0 | 15 | 6 | 0.2 stamina | job_adventuring | {"arcana": 1, "research": 10, "scrolls": "1~4"} |  |
| loc_ettinmoors | ettinmoors |  |  | None | 0 | — | g.player.level>=9999 |  |  |
| loc_ageshall | hall of ages |  |  | 100 | 12 | — | g.t3_adventuring>0 | {"title": "Mark of Ages"} | {"history.max": "?1"} |
| loc_treffil | Explore Treffil Wood | 1 |  | 40 | 12 | 0.25 stamina | g.treffilwoods>0 | {"arcana": 3, "naturelore.exp": 100, "herbalism.exp": 50, "animals.exp": 50, "herbs": "5~10"} |  |
| localfields | Village fields | 1 |  | 25 | 8 | 0.2 stamina | job_adventuring | {"arcana": 0.5, "gold": 5} | {"puppetry.max": "0.5//2/-1"} |
| loc_spring | lillit's spring | 2 |  | 20 | 6 | 0.2 stamina | mustylibrary | {"arcana": 1.5, "research": 10, "herbs": "2~5"} |  |
| stonyhills_cavern_entrance | Stony Hills spelunking | 2 |  | 10 | 8 | 0.25 stamina | g.stonyhills>0 | {"earthgem": "0~2", "gold": "15~18", "cave_jade": "20%"} |  |
| eryleyot | eryl eyot | 3 |  | 30 | 5 | 0.22 stamina |  | {"arcana": 2, "research": 10, "scrolls": "1~4", "herbs": "2~5"} |  |
| reedburgh_market | reedburgh Markets | 4 | 120 | 40 | 16 | 0.2 stamina, 0.2 bf | g.reedburgh_city_papers>0 |  | {"purse.max": "?1", "herbbag.max": "?1", "gembag.max": "?1"} |
| reedburgh_second_ring | infiltrate reedburgh second ring | 4 | 130 | 31 | 7 | 0.3 stamina, 0.1 shadow | g.evil1>0&&g.citynavigation>=6&&g.reedburgh_city_sewer>=1 |  |  |
| pidwigcove | pidwig's cove | 5 |  | 25 | 8 | 0.3 stamina | g.history>=5&&g.eryleyot>0 | {"arcana": 2, "gold": "20~30", "gems": "4~10"} |  |
| reedburgh_gymnasium | reedburgh Gymnasium | 5 | 125 | 40 | 12 | 1 stamina, 0.1 vigor | g.reedburgh_gym_membership>0 |  | {"hp.max": "2//10/-1"} |
| ruinedcrypt | Ruined Crypt | 6 |  | 30 | 9 | 0.35 stamina | t0_adventuring | {"arcana": 3, "research": 20, "scrolls": "2~4", "bodies": {"value": "4~8", "skipLocked": true}, "bonedust": {"value": "3 |  |
| rithel | None | 10 |  | None | 12 | 0.33 stamina | g.evil2<=0&&g.history>=7&&g.loc_treffil>0 | {"arcana": 1.5, "research": 10, "scrolls": "1~4"} |  |
| hallofmirrors | None | 12 |  | 50 | 11 | 0.4 stamina | g.scrying>=999 | {"arcana": 0.1, "research": 10} |  |
| genezereth | Genezereth | 13 |  | 100 | 9 | 0.4 stamina | g.history>=7 | {"title": "Historian", "arcana": 25, "tomes": "1~3", "shadowgem": "8~12"} |  |
| fazbitshop | fazbit's workshop | 15 |  | 50 | 8 | — | ["(g.alchemy+g.scrying)>=17", "t2_adventuring"] | {"arcana": 10, "tomes": 1, "gems": "3~5", "airgem": "50%", "firegem": "50%"} |  |
| clockcastle_grounds | Corivar's Castle Courtyard | 17 | 800 | 50 | 9 | 1 stamina | evt_puppet_locallord | {"arcana": 6, "herbs": 10, "machinae": "1~2", "automatas": "20%", "puppets": "3~4"} | {"magiphysics.max": "?1"} |
| loc_tenwick | peregrination | 25 |  | 1000 | 30 | 2 stamina | g.tier4>0&&g.wander.locked==0 | {"title": "Dhrunic Wayfarer"} |  |
| loc_menagerie | the lost menagerie | 26 |  | 200 | 17 | 3 stamina | g.tier5>0&&g.magicbeasts>=5 | {"title": "Wild Compiler", "arcana": 50, "gems": "5~10", "herbs": "10~20", "magesoul_item": "g.evt_mageghost_start>0&&g. | {"magicbeasts.max": "?1"} |
| loc_orrem | sands of orrem | 28 |  | 200 | 16 | 3 stamina | g.history>=7&&g.scrying>=5&&g.tier5>0 | {"title": "Nomad", "fame": 0.5, "arcana": 50} |  |
| guidelostsoul_locale | Finish Unfinished Business | 28 |  | 50 | 27 | 2.5 stamina, 2 spirit | ["g.psychopomp>0"] | {"spiritrune": 15, "arcana": 75} | {"lostsouls.max": "100\|100\|10"} |
| timerip_locale | rip in time | 30 |  | 150 | 35 | 3 stamina, 1 tempus | evt_timerip | {"timegem": 25, "timerune": 2} |  |
| emptythrone_locale | The Empty Throne | 31 |  | 40 | 35 | 4 stamina | g.findemptythrone>0 |  |  |

## Clashes

| id | name | level | dist | floors | require | result |
|---|---|---|---|---|---|---|
| consumedshack | fire-cursed shack | 8 | 100 | 1 | g.tier1>0&&g.firelore>=12 |  |
| fireinnerbattle | The Pyre Within |  | 0 | 1 | infernoharvest |  |
| treffilwoods_clash | treffilwoods survey |  | 12 | 2 | (g.t_natureclass>=1\|\|g.hall_treffilwoods_survey>0)&&(g.treffilwoods+g.loc_treffi | {"gold": 500, "naturegem": 15, "watergem": 15} |
| shapeshift_dragon_clash | Dracomachy | 15 | 1400 | 2 | g.dragonshape.owned | {"title": "Dragon"} |
| kraken_clash | kraken's lair | 17 | 700 | 2 | g.limnimancer>0&&g.veldransfall>0 | {"title": "Sealord"} |
| emptythrone_clash | The Absent Monarch | 31 |  | 2 | g.voidstruggle>0 | {"title": "Endslayer"} |
| clockwork_castle_core | Clockwork sanctum | 17 | 800 | 2 | g.clockwork_castle>0 | {"title": "Troubleshooter"} |
| timerip_clash | unknown timeline | 1 | 2000 | 1 | g.timerip_locale>=15 | {"title": "Foredoomed"} |

## Distance sources (any record whose mod touches `dist`)

| type | id | name | slot | dist mod | cost | need/require |
|---|---|---|---|---|---|---|
| tasks | dbg_mount | Flight Hacks | mount | {"dist": 9000} | 1 gold | g.dbg_enable>0 |
| upgrades | chimeramount | Chimera | mount | {"dist": 400} | 10000 gold, 100 gems, 5000 research | stables |
| upgrades | destrier | Destrier | mount | {"dist": 15} | 200 gold | g.animals>=3 |
| upgrades | ebonwoodbroomstick | Ebonwood Broomstick | mount | {"dist": 250} | 1000 research, 10 nature, 10 spirit, 1000 gold, 1 arcana | g.witch>0&&g.crafting>=15&&g.t3_adventuring>0 |
| upgrades | firecharger | Fire Charger | mount | {"dist": 200} | 2000 research, 20 fire, 10 firegem | stables |
| upgrades | firechariot | Chariot of Fire | mount | {"dist": 450} | 20000 research, 15 arcana, 50 lightgem, 10 firerune | g.firelore>=22&&g.tier6>0&&g.t_fireclass>0 |
| upgrades | fly | Fly | mount | {"dist": 250} | 20 arcana, 10000 research, 20 airgem | g.airlore>=16&&g.tier7>0 |
| upgrades | flyingcarpet | Flying Carpet | mount | {"dist": 105} | 20 gems, 300 research, 5 airgem, 300 gold, 1 arcana | ["g.weaving>=4", "g.airlore>=8"] |
| upgrades | gate | dhrunic nexus |  | {"dist": 80} | 12000 gold, 10 tomes, 5 runestones, 25 arcana, 10 quicksteel, 10 rubies | g.planeslore>=5&&g.tier4>0 |
| upgrades | gelding | Demure Gelding | mount | {"dist": 15} | 150 gold | g.animals>=3 |
| upgrades | giantfrog | Giant Frog | mount | {"dist": 55} | 1500 gold, 100 herbs | ["stables", "g.magicbeasts>=3"] |
| upgrades | gryffonmount | Gryffon | mount | {"dist": 200} | 2000 gold, 5 gems | stables |
| upgrades | kraken_mount | Tame Kraken | mount | {"dist": 400} | — | g.up_kraken_mount>0&&g.tier6>0 |
| upgrades | magicbroomstick | Magic Broomstick | mount | {"dist": 105} | 200 research, 5 nature, 5 spirit, 100 gold, 1 arcana | g.witch>0&&g.crafting>=10&&g.enchanting>=5&&g.tier1>0 |
| upgrades | magictent | casgair's conjured canopy |  | {"dist": 80} | 1000 research, 1 arcana, 10 gems, 10 cotton | ["g.lore>=8", "g.conjuration>=5", "g.research.max>=800", "t2_adventuring"] |
| upgrades | mule | Mule | mount | {"dist": 15} | 100 gold | g.player.level>=4\|\|g.animals>=2 |
| upgrades | nightmaremount | Nightmare | mount | {"dist": 400} | 10000 research, 66 shadowgem, 6 runestones, 66 stamina, 66 hp | g.t_demonclass>0&&g.demonology>=15&&g.tier6>0 |
| upgrades | pegasusmount | Pegasus | mount | {"dist": 55} | 2000 gold, 5 gems | ["stables", "g.lightlore>=4", "g.magicbeasts>=2"] |
| upgrades | rovingcloud | Roving Cloud | mount | {"dist": 450} | 5000 gold, 20 airgem, 5 airrune, 15000 research, 20 codices | g.crafting>=25&&g.airlore>=15&&g.tier6>0 |
| upgrades | scrypaths | scry paths |  | {"dist": "35%"} | 2000 research, 15 spiritgem | g.scrying>=10&&g.t3_adventuring>0 |
| upgrades | skelcharger | Skeletal Charger | mount | {"dist": 200} | 400 gold, 10 bones, 2 shadowgem, 25 bonedust | stables |
| upgrades | surfmount | Ride the Waves | mount | {"dist": 250} | 5 watergem, 300 gold, 300 research | g.crafting>=8&&g.waterlore>=10&&g.t_waterclass>0&&g.t3_adventuring>0 |
| upgrades | tent | travel tent |  | {"dist": 15} | 50 gold, 50 research, 3 leather | g.naturelore>=5&&g.t0_adventuring>0 |
| upgrades | up_map1 | travel map |  | {"dist": "25%"} | 700 research | g.crafting>=6&&g.astronomy>=4&&g.t0_adventuring>0 |
| upgrades | up_pack | travel pack |  | {"dist": 20} | 600 gold, 5 leather | t1_adventuring |
| upgrades | up_ten_map | tenwick's travel map |  | {"dist": "15%"} | 800 gold, 900 research | ["g.history>=6", "t2_adventuring"] |
| upgrades | walkingpavilion | Walking Pavilion | mount | {"dist": 450} | 5000 gold, 20 managem, 5 runestones, 15000 research, 50 codices | g.crafting>=25&&g.enchanting>=8&&g.tier6>0 |
| upgrades | wyvernmount | Wyvern | mount | {"dist": 200} | 2000 gold, 5 gems | stables |
| upgrades | zombiedino | Reanimated Monstrosity | mount | {"dist": 400} | 2000 gold, 10000 research, 100 shadowgem, 100 bonedust, 20 souls | stables |

## Action-slot sources (mod touches `runner.max`)

| type | id | name | runner.max | cost | require | need |
|---|---|---|---|---|---|---|
| upgrades | timespiral | time spiral | 1 | 1 stillroom, 6 chargedtimepiece | g.tier5>0&&g.runner.max>=3&&g.evt_timerip>0 |  |
| upgrades | autoagents | automata agents | 1 | 50 automatas, 30 runestones, 10 firerune, 10 airrune, 10 earthrune, 10 waterrune, 3 timerune, 5 sindel | g.automatasculpting>=10 |  |
| upgrades | timesplit | timesplit | 1 | 10 arcana, 5 tempus | g.chronomancy>=5 |  |
| upgrades | arcanaaction | Aided Thoughts | 1 | 150 research, 2 arcana | g.neophyte>0&&g.research.max>=90 |  |

## Goal/Hobby capacity sources (mod touches `goals.max` / `hobbies.max`)

| type | id | name | goals.max | hobbies.max | cost | require |
|---|---|---|---|---|---|---|
| upgrades | goals1 | dedicated goal | 1 |  | 50 research, 1 arcana | g.lore>=6 |
| upgrades | goals2 | maniacal goals | 1 |  | 800 research, 10 arcana | t1_selfimprove |
| upgrades | hobbies1 | idle hobbies |  | 1 | 25 research, 1 scrolls | g.lore>=7 |
| upgrades | hobbies2 | expanded interests |  | 1 | 800 research, 10 codices | g.t2_selfimprove>0 |
| upgrades | hobbies3 | never-idle |  | 1 | 2500 research, 5 tomes | g.tier5>0 |

## Stored-time (offline bank) cap sources (mod touches `offlinetime.max`)

| type | id | name | offlinetime.max | cost | require |
|---|---|---|---|---|---|

## Main-tab groups (tasks / upgrades) with record counts

| kind | group | count |
|---|---|---|
| task | knowledge | 93 |
| task | affluence | 31 |
| task | advancement | 31 |
| task | crafting | 27 |
| task | imbuement | 21 |
| task | morality | 21 |
| task | housing | 20 |
| task | pyromancy | 15 |
| task | (none) | 13 |
| task | materials | 13 |
| task | domain | 13 |
| task | debug | 11 |
| task | storage | 10 |
| task | void | 10 |
| task | transformation | 9 |
| task | research | 8 |
| task | martial | 7 |
| task | weapon | 6 |
| task | Spirit Communion | 6 |
| task | shapeshifting | 5 |
| task | personal werry | 5 |
| task | body | 5 |
| task | rest | 5 |
| task | spellcasting | 4 |
| task | dimensional probing | 4 |
| task | apprenticeship | 2 |
| task | special | 2 |
| task | armor | 2 |
| task | minions | 1 |
| task | debt | 1 |
| task | exploration | 1 |
| task | sublimation | 1 |
| task | starting out | 1 |
| task | familliar | 1 |
| upgrade | education | 141 |
| upgrade | knowledge | 86 |
| upgrade | body | 57 |
| upgrade | magic | 21 |
| upgrade | mount | 20 |
| upgrade | storage | 19 |
| upgrade | (none) | 17 |
| upgrade | debt | 17 |
| upgrade | furniture | 16 |
| upgrade | pyromancy | 16 |
| upgrade | exploration | 14 |
| upgrade | crafting | 14 |
| upgrade | housing | 12 |
| upgrade | personal plane | 12 |
| upgrade | rest | 11 |
| upgrade | affluence | 11 |
| upgrade | companions | 10 |
| upgrade | martial | 10 |
| upgrade | master | 10 |
| upgrade | materials | 9 |
| upgrade | familiar | 9 |
| upgrade | special | 8 |
| upgrade | void | 7 |
| upgrade | bargain | 6 |
| upgrade | research | 6 |
| upgrade | shapeshifting | 5 |
| upgrade | spellcasting | 5 |
| upgrade | minions | 5 |
| upgrade | plane | 5 |
| upgrade | actions | 4 |
| upgrade | Spirit Communion | 3 |
| upgrade | domain | 3 |
| upgrade | instability | 3 |
| upgrade | rip in time | 2 |
| upgrade | personal werry | 1 |
| upgrade | sublimation | 1 |

## Spells by school and level

| school | count | min lvl | max lvl | with cooldown |
|---|---|---|---|---|
| martial | 54 | 1 | 15 | 43 |
| spirit | 31 | 0 | 10 | 22 |
| chaos | 25 | 2 | 13 | 5 |
| nature | 23 | 1 | 15 | 17 |
| light | 22 | 1 | 15 | 8 |
| water | 21 | 2 | 15 | 15 |
| earth | 18 | 1 | 25 | 11 |
| shadow | 18 | 1 | 12 | 9 |
| animation | 16 | 1 | 10 | 0 |
| mana | 15 | 1 | 15 | 9 |
| air | 14 | 1 | 12 | 7 |
| fire | 13 | 2 | 7 | 6 |
| tempus | 12 | 15 | 25 | 12 |
| necromancy | 11 | 1 | 8 | 6 |
| charms | 10 | 2 | 8 | 9 |
| blood | 6 | 3 | 10 | 3 |
| ? | 6 | 0 | 0 | 0 |
| shian | 5 | 6 | 15 | 0 |
| demonology | 4 | 3 | 12 | 4 |
| astral | 4 | 3 | 10 | 3 |
| summoning | 4 | 3 | 7 | 0 |
| void | 3 | 10 | 25 | 1 |
| arcane | 2 | 3 | 5 | 1 |
| charm | 2 | 1 | 1 | 2 |
| cheat | 1 | 1 | 1 | 0 |

## Monster level distribution

| n | min | median | max | kinds |
|---|---|---|---|---|
| 356 | 0 | 28.0 | 78 | humanoid:53, beast:50, magicbeast:34, undead:28, None:22, construct:19, automata:15, elemental:14, giant:13, spirit:12, plant:11, demon:11 |