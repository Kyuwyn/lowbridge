#!/usr/bin/env python3
"""Regenerate research/hundred-days-reference/data-census.md.

Usage:
    python3 research/hundred-days-reference/tools/census.py /tmp/hundred-days-src
    python3 .../census.py <repo> --arcanum /tmp/arcanum-data -o <outfile>

<repo> is a checkout of the Hundred Days (筑基) fork: the directory holding
`data/modules.json`, `data/*.json`, `data/modules/*.json` and `js/`.

Output is deterministic (no wall-clock timestamp), so a regenerated census can
be diffed against the committed one.
"""

from __future__ import annotations

import argparse
import collections
import json
import os
import re
import subprocess
import sys

# ---------------------------------------------------------------------------
# Engine facts, transcribed from the bundle. Not derivable from the JSON alone.
# ---------------------------------------------------------------------------

# dataLoader.initInstance(): which class each manifest type is instanced as, and
# the tag/type string stamped onto every record of that type.
# Source: js/hundred_days.js, "./src/dataLoader.js" -> initInstance().
LOADED_AS = {
    "tags": ("TagSet", "", ""),
    "gfx_config": ("Resource", "", ""),
    "resources": ("Resource", "", ""),
    "upgrades": ("GData", "升级", "upgrade"),
    "tasks": ("Task", "task", "task"),
    "homes": ("GData", "home", "home"),
    "furniture": ("GData", "家具", "furniture"),
    "skills": ("Skill", "skill", ""),
    "states": ("State", "state", "state"),
    "player": ("Resource/StatData/RevStat", "", "资源"),
    "spells": ("Spell", "", ""),
    "race": ("Race", "", ""),
    "monsters": ("Monster", "monster", "monster"),
    "dungeons": ("Locale", "副本", "dungeon"),
    "events": ("GEvent", "event", "event"),
    "classes": ("GClass", "阶位", "rank"),
    "equip_perk": ("Alter", "词条", "enchant/perk"),
    "armors": ("ProtoItem", "armor", "armor"),
    "weapons": ("ProtoItem", "weapon", "weapon"),
    "materials": ("Alter", "material", "material"),
    "enchants": ("Enchant", "enchant", "enchant"),
    "sections": ("(raw object)", "", ""),
    "consumables": ("Potion", "道具", "item"),
    "market": ("Market", "市场", "market"),
    "adv_weapon": ("Resource", "杀伤武器", "ordnance"),
    "conquer": ("Resource", "征服", "conquest"),
    "xiulian": ("Xiulian", "修炼", "cultivation"),
    "humanr": ("Resource", "人力", "manpower"),
    "encounters": ("Encounter", "enc", "enc"),
    "locales": ("Locale", "地点", "location"),
    "stressors": ("Resource", "stress", "stress"),
    "rares": ("ProtoItem", "", ""),
    "reagents": ("Resource", "", ""),
    "properties": ("Alter", "property", "property"),
    "element": ("Resource", "元素", "element"),
    "herbal": ("Resource", "herbal", "herbal material"),
    "achievement": ("Resource", "成就", "achievement"),
    "missions": ("Resource", "指引任务", "guide quest"),
    "fight": ("Resource", "fight", "combat data"),
    "obstacles": ("Resource", "地块障碍", "terrain obstacle"),
    "weapon_factory": ("Resource", "weapon_factory", "武器工厂"),
    "realsoul": ("Resource", "真魂", "true soul"),
    "realsoul_fu": ("Resource", "真魂", "true soul (hidden)"),
    "soulpice": ("Resource", "真魂碎片", "soul shard"),
    "factclass": ("Resource", "产品", "product"),
    "factclass_fu": ("Resource", "产品来源", "production source"),
    "factrecipe": ("Factrecipe", "生产模式", "production mode"),
    "factory": ("Resource", "生产工厂", "factory"),
    "player_res": ("PlayerRes", "人物属性", "character attribute"),
    "techo": ("Techo", "研究", "research"),
    "ap_upgrade": ("Resource", "里程升级", "milestone upgrade"),
    "environment": ("Resource", "战斗环境", "combat environment"),
    "map": ("Resource", "地图", "map"),
    "tile": ("Resource", "地块", "tile"),
    "scena": ("Resource", "对话", "dialogue"),
    "skill_extend": ("SkillExtend", "天理学", "celestial principle"),
}

# Data files present in the checkout but never fetched by the loader, and why.
# `hall` is the exception: profile.js loads it as a second, independent module.
UNLOADED_NOTES = {
    "hall": "loaded separately as the Hall module (profile.loadHallData -> "
            "Module.load('hall')); its items are excluded from the character save",
    "potions": "superseded by `consumables`; the initInstance line is commented out",
    "places": "not in the manifest and not referenced by the bundle",
    "equip": "not in the manifest; equipment slots are hard-coded in chars/equip.js",
    "professions": "not in the manifest; no engine reference",
    "skills_extend": "not in the manifest (the loaded file is the singular `skill_extend`)",
    "bio": "empty array, not in the manifest",
    "elect": "empty array, not in the manifest",
    "metal": "empty array, not in the manifest",
    "machine": "not in the manifest, although js/machine-ui.bundle.js still ships",
    "modules": "the manifest itself",
}

# Why each Arcanum-only type is gone. Verified by grepping the bundle for
# `lists.<type>` and for the bare word.
DROPPED_TYPE_NOTES = {
    "quests": "gone; `missions` (14 records, type 指引任务) is the replacement "
              "guide-quest list, and it is a different shape",
    "clashes": "gone; no siege/clash system",
    "potencies": "gone; spell potencies folded into `equip_perk` / `element`",
    "equipslots": "gone; slots are hard-coded in src/chars/equip.js",
    "invaders": "gone with the siege system",
    "zones": "gone; replaced by `map` + `tile` + `obstacles`",
    "zonegroups": "gone; replaced by `map` + `tile` + `obstacles`",
    "glossaryentries": "gone; no in-game glossary tab",
    "hall": "still exists, but `data/hall.json` is loaded as its own module by "
            "profile.js rather than through the manifest",
    "items": "the `initItems(... lists['items'] ...)` line is commented out and "
             "marked @deprecated",
    "resourcesUnused": "never loaded in Arcanum either",
}

# Fields that PrepData() in src/modules/parsing.js treats specially.
PARSE_CLASSES = {
    "mod": "ParseMods",
    "runmod": "ParseMods",
    "alter": "ParseMods",
    "effect": "ParseEffects(MakeEffectFunc)",
    "result": "ParseEffects(MakeEffectFunc)",
    "xiulianresult": "ParseEffects(MakeEffectFunc)",
    "ele": "ParseEffects(MakeEffectFunc)",
    "damage_element": "ParseEffects(MakeEffectFunc)",
    "cost": "ParseEffects(MakeCostFunc)",
    "buy": "ParseEffects(MakeCostFunc)",
    "acost": "ParseEffects(MakeCostFunc)",
    "counterattack": "ParseEffects(MakeCostFunc)",
    "scost": "ParseEffects(MakeCostFunc)",
    "startcost": "ParseEffects(MakeCostFunc)",
    "lhxy": "ParseEffects(MakeCostFunc)",
    "require": "ParseRequire",
    "need": "ParseRequire",
    "equneed": "ParseRequire",
    "show_require": "ParseRequire",
}

REQUIRE_FIELDS = ("require", "need", "equneed", "show_require")

ID_TEST = re.compile(r"^[A-Za-z_]+\w*$")

# Items GameState builds itself, so an expression may name them even though no
# JSON record declares them. Source: src/gameState.js constructor and prepItems.
ENGINE_IDS = {
    "player", "runner", "inv", "minions", "userSpells", "userVehicle",
    "spelllist", "pursuits", "allies", "enchantslots", "drops", "self", "length",
}

# Gates that are unresolvable on purpose.
EXPECTED_DANGLING = {
    "template_item": "the placeholder `dataLoader` substitutes when it clones "
                     "`template_burn` into a real combustion recipe",
}


# ---------------------------------------------------------------------------
# Loading
# ---------------------------------------------------------------------------

def read_json(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def git_describe(repo):
    def run(*args):
        try:
            out = subprocess.run(
                ["git", "-C", repo, *args],
                capture_output=True, text=True, check=True,
            ).stdout.strip()
        except (OSError, subprocess.CalledProcessError):
            return None
        return out or None
    return run("rev-parse", "HEAD"), run("rev-parse", "--abbrev-ref", "HEAD")


class Checkout:
    """Everything the census needs from one data directory."""

    def __init__(self, root, label):
        self.root = root
        self.label = label
        self.data_dir = os.path.join(root, "data")
        if not os.path.isdir(self.data_dir):
            # /tmp/arcanum-data is already the data dir.
            self.data_dir = root
        self.manifest = read_json(os.path.join(self.data_dir, "modules.json"))
        self.core = list(self.manifest.get("core", []))
        self.module_names = list(self.manifest.get("modules", []))

        self.core_records = collections.OrderedDict()   # file -> [record]
        self.core_missing = []
        for name in self.core:
            path = os.path.join(self.data_dir, name + ".json")
            if not os.path.exists(path):
                self.core_missing.append(name)
                continue
            payload = read_json(path)
            self.core_records[name] = payload if isinstance(payload, list) else []

        self.module_records = collections.OrderedDict()  # module -> {type: [record]}
        self.module_missing = []
        for name in self.module_names:
            path = os.path.join(self.data_dir, "modules", name + ".json")
            if not os.path.exists(path):
                self.module_missing.append(name)
                continue
            payload = read_json(path)
            self.module_records[name] = payload.get("data", {}) if isinstance(payload, dict) else {}

        # merged: type -> [record]
        merged = collections.defaultdict(list)
        for name, recs in self.core_records.items():
            merged[name].extend(recs)
        for name, data in self.module_records.items():
            for typ, recs in data.items():
                merged[typ].extend(recs)
        self.merged = merged

    # -- derived views -----------------------------------------------------

    def all_records(self):
        for typ, recs in self.merged.items():
            for rec in recs:
                if isinstance(rec, dict):
                    yield typ, rec

    def field_counts(self):
        """field -> total, and field -> Counter(type)."""
        total = collections.Counter()
        by_type = collections.defaultdict(collections.Counter)
        for typ, rec in self.all_records():
            for key in rec:
                total[key] += 1
                by_type[key][typ] += 1
        return total, by_type

    def fields_of(self, records):
        counter = collections.Counter()
        for rec in records:
            if isinstance(rec, dict):
                counter.update(rec.keys())
        return counter

    def expressions(self):
        out = []
        for typ, rec in self.all_records():
            for field in REQUIRE_FIELDS:
                value = rec.get(field)
                if isinstance(value, str):
                    out.append((typ, rec.get("id"), field, value))
                elif isinstance(value, list):
                    for item in value:
                        if isinstance(item, str):
                            out.append((typ, rec.get("id"), field, item))
        return out

    def declared_names(self):
        """Every id and tag an expression could legitimately name."""
        names = set(ENGINE_IDS)
        for _, rec in self.all_records():
            if rec.get("id"):
                names.add(rec["id"])
            raw = rec.get("tags")
            if isinstance(raw, str):
                names.update(t.strip() for t in raw.split(",") if t.strip())
            elif isinstance(raw, list):
                names.update(t.strip() for t in raw if isinstance(t, str))
        hall = os.path.join(self.data_dir, "hall.json")
        if os.path.exists(hall):
            payload = read_json(hall)
            for recs in payload.get("data", {}).values():
                for rec in recs:
                    if isinstance(rec, dict) and rec.get("id"):
                        names.add(rec["id"])
        return names

    def dangling(self):
        """(type -> [record id]), and Counter of the names that resolve to nothing."""
        known = self.declared_names()
        by_type = collections.defaultdict(list)
        missing = collections.Counter()
        for typ, rec in self.all_records():
            for field in REQUIRE_FIELDS:
                value = rec.get(field)
                if not isinstance(value, str):
                    continue
                if ID_TEST.match(value):
                    bad = [value] if value not in known else []
                else:
                    bad = [m.group(1) for m in re.finditer(r"g\.([A-Za-z_]\w*)", value)
                           if m.group(1) not in known]
                if bad:
                    by_type[typ].append((rec.get("id"), field, value, sorted(set(bad))))
                    missing.update(bad)
        return by_type, missing

    def disk_files(self):
        """Every data/*.json in the checkout, with its record count."""
        out = {}
        for entry in sorted(os.listdir(self.data_dir)):
            if not entry.endswith(".json"):
                continue
            name = entry[:-5]
            path = os.path.join(self.data_dir, entry)
            try:
                payload = read_json(path)
            except (ValueError, OSError):
                out[name] = (None, "unparseable")
                continue
            if isinstance(payload, list):
                out[name] = (len(payload), "array")
            elif isinstance(payload, dict) and "data" in payload:
                out[name] = (sum(len(v) for v in payload["data"].values()), "module wrapper")
            else:
                out[name] = (None, "object")
        return out

    def disk_modules(self):
        out = {}
        mod_dir = os.path.join(self.data_dir, "modules")
        if not os.path.isdir(mod_dir):
            return out
        for entry in sorted(os.listdir(mod_dir)):
            path = os.path.join(mod_dir, entry)
            if not os.path.isfile(path):
                continue
            if not entry.endswith(".json"):
                out[entry + "  (no .json extension)"] = (
                    None, "the loader fetches `<dir>/<name>.json`, so this copy is "
                          "never read")
                continue
            payload = read_json(path)
            data = payload.get("data", {}) if isinstance(payload, dict) else {}
            out[entry[:-5]] = (sum(len(v) for v in data.values()),
                               ", ".join(f"{k}:{len(v)}" for k, v in data.items()))
        return out


# ---------------------------------------------------------------------------
# Formatting helpers
# ---------------------------------------------------------------------------

def cell(value):
    """A table cell. Pipes inside content (`||` in expressions) must be escaped."""
    if value is None:
        return ""
    return str(value).replace("|", "\\|")


def table(headers, rows, aligns=None):
    aligns = aligns or ["left"] * len(headers)
    sep = {"left": "---", "right": "---:", "center": ":---:"}
    out = ["| " + " | ".join(cell(h) for h in headers) + " |",
           "|" + "|".join(sep[a] for a in aligns) + "|"]
    for row in rows:
        out.append("| " + " | ".join(cell(c) for c in row) + " |")
    return "\n".join(out)


def freq_block(counter, total):
    """`n  field` lines, most frequent first, ties broken alphabetically."""
    items = sorted(counter.items(), key=lambda kv: (-kv[1], kv[0]))
    width = max((len(k) for k in counter), default=1)
    lines = []
    for key, count in items:
        marker = " (all)" if count == total else ""
        lines.append(f"{count:>5}  {key.ljust(width)}{marker}")
    return "```\n" + "\n".join(lines) + "\n```"


# ---------------------------------------------------------------------------
# Report
# ---------------------------------------------------------------------------

def build_report(fork, arc, commit, branch):
    L = []
    w = L.append

    w("# Hundred Days data census")
    w("")
    w("Generated by `research/hundred-days-reference/tools/census.py`. Do not hand-edit; "
      "regenerate with:")
    w("")
    w("```")
    w("python3 research/hundred-days-reference/tools/census.py /tmp/hundred-days-src")
    w("```")
    w("")
    w("The prose that interprets these numbers is `03-data-model-and-content.md`.")
    w("")

    # -- provenance --------------------------------------------------------
    w("## 1. Provenance")
    w("")
    rows = [
        ["fork checkout", f"`{fork.root}`"],
        ["fork commit", f"`{commit}`" if commit else "(not a git checkout)"],
        ["fork branch", f"`{branch}`" if branch else "(unknown)"],
        ["comparison baseline", f"`{arc.root}`" if arc else "(not supplied)"],
    ]
    w(table(["item", "value"], rows))
    w("")
    w("The fork's `master` branch carries the original Chinese text and the `english` "
      "branch the translation; record ids, counts and field names are identical on both.")
    w("")

    # -- totals ------------------------------------------------------------
    core_total = sum(len(v) for v in fork.core_records.values())
    mod_total = sum(len(r) for d in fork.module_records.values() for r in d.values())
    w("## 2. Totals")
    w("")
    rows = [
        ["core files listed in `data/modules.json`", len(fork.core)],
        ["core files present on disk", len(fork.core_records)],
        ["records from core files", core_total],
        ["modules listed in `data/modules.json`", len(fork.module_names)],
        ["records from listed modules", mod_total],
        ["**records loaded in total**", f"**{core_total + mod_total}**"],
        ["distinct record types after merge", len(fork.merged)],
        ["distinct field names across all records", len(fork.field_counts()[0])],
    ]
    w(table(["measure", "count"], rows, ["left", "right"]))
    w("")
    w("`hall.json` is loaded on top of this as a separate module (6 types, "
      f"{sum(len(v) for v in read_json(os.path.join(fork.data_dir, 'hall.json'))['data'].values())} "
      "records) with its own save file; its records are deliberately kept out of the "
      "character save.")
    w("")

    # -- load order --------------------------------------------------------
    w("## 3. Core load order")
    w("")
    w("Order is the array order of `core` in `data/modules.json`; the loader fetches "
      "`./data/<name>.json` for each. \"Instanced as\" and the type tags come from "
      "`initInstance()` in `src/dataLoader.js`; the Chinese string is the internal "
      "`type`/tag used by `hasTag()` and must never be translated.")
    w("")
    rows = []
    for i, name in enumerate(fork.core, 1):
        recs = fork.core_records.get(name)
        if recs is None:
            rows.append([i, f"`{name}`", "**missing**", "", "", ""])
            continue
        cls, tag, english = LOADED_AS.get(name, ("?", "", ""))
        fields = fork.fields_of(recs)
        rows.append([
            i, f"`{name}`", len(recs), len(fields),
            cls, f"`{tag}`" if tag else "—",
            english or "—",
        ])
    w(table(["#", "file", "records", "fields", "instanced as", "tag/type", "English type name"],
            rows, ["right", "left", "right", "right", "left", "left", "left"]))
    w("")

    empty = [n for n, r in fork.core_records.items() if not r]
    if empty:
        w("Empty core files (listed in the manifest, load to zero records): "
          + ", ".join(f"`{n}.json`" for n in empty) + ".")
        w("")

    # -- unloaded files ----------------------------------------------------
    w("## 4. Files on disk that the manifest does not load")
    w("")
    disk = fork.disk_files()
    rows = []
    for name in sorted(disk):
        if name in fork.core:
            continue
        count, shape = disk[name]
        rows.append([f"`data/{name}.json`",
                     "—" if count is None else count,
                     shape,
                     UNLOADED_NOTES.get(name, "")])
    w(table(["file", "records", "shape", "status"], rows, ["left", "right", "left", "left"]))
    w("")

    w("### Module files on disk that the manifest does not load")
    w("")
    disk_mods = fork.disk_modules()
    rows = []
    for name in sorted(disk_mods, key=str.lower):
        if name in fork.module_names:
            continue
        count, detail = disk_mods[name]
        label = name if count is None else name + ".json"
        rows.append([f"`data/modules/{label}`", "—" if count is None else count, detail])
    w(table(["file", "records", "contents"], rows, ["left", "right", "left"]))
    w("")
    w("Types a module contributes that `initInstance()` does not recognise (`potions`, "
      "`items`, `fupgrades`) are still parsed into the object index, then deleted on "
      "startup by `GameState.prepItems()` with a `missing hasTag(). Removing.` warning.")
    w("")

    # -- merged counts -----------------------------------------------------
    w("## 5. Record counts by type (core + listed modules)")
    w("")
    rows = []
    for typ in sorted(fork.merged, key=lambda t: (-len(fork.merged[t]), t)):
        core_n = len(fork.core_records.get(typ, []))
        total = len(fork.merged[typ])
        arc_n = len(arc.merged.get(typ, [])) if arc else None
        rows.append([f"`{typ}`", core_n, total - core_n, total,
                     "—" if arc is None else (arc_n if typ in arc.merged else "—")])
    w(table(["type", "core file", "from modules", "total", "Arcanum"],
            rows, ["left", "right", "right", "right", "right"]))
    w("")

    # -- field frequency ---------------------------------------------------
    w("## 6. Field frequency per type")
    w("")
    w("Counts are over core + listed modules. `(all)` marks a field present on every "
      "record of the type.")
    w("")
    for typ in sorted(fork.merged):
        recs = fork.merged[typ]
        if not recs:
            w(f"### `{typ}` — 0 records")
            w("")
            continue
        counter = fork.fields_of(recs)
        w(f"### `{typ}` — {len(recs)} records, {len(counter)} distinct fields")
        w("")
        w(freq_block(counter, len(recs)))
        w("")

    # -- modules -----------------------------------------------------------
    w("## 7. Listed modules")
    w("")
    rows = []
    for name in fork.module_names:
        data = fork.module_records.get(name)
        if data is None:
            rows.append([f"`{name}`", "**missing**", ""])
            continue
        total = sum(len(v) for v in data.values())
        detail = ", ".join(f"`{k}` {len(v)}" for k, v in data.items() if v) or "(all lists empty)"
        rows.append([f"`{name}`", total, detail])
    w(table(["module", "records", "types contributed"], rows, ["left", "right", "left"]))
    w("")
    w("Modules are merged by `Module.merge()`: records are appended to the matching core "
      "list and overwrite by id in the object index, so a module can silently replace a "
      "core record.")
    w("")

    # -- vocabulary index --------------------------------------------------
    total_fields, by_type = fork.field_counts()
    w("## 8. Vocabulary index")
    w("")
    w("Every field name in the loaded data, with its total occurrence count, the number "
      "of types it appears on, and how `PrepData()` parses it (blank = stored as-is, "
      "after the generic Percent / Range / PerMod / AtMod string coercion).")
    w("")
    rows = []
    for field in sorted(total_fields, key=lambda f: (-total_fields[f], f)):
        types = by_type[field]
        top = ", ".join(f"{t} {n}" for t, n in types.most_common(4))
        if len(types) > 4:
            top += f", +{len(types) - 4} more"
        arc_n = None
        if arc:
            arc_total, _ = arc.field_counts()
            arc_n = arc_total.get(field)
        rows.append([f"`{field}`", total_fields[field], len(types),
                     PARSE_CLASSES.get(field, ""), top,
                     "—" if arc is None else (arc_n if arc_n else "new")])
    w(table(["field", "n", "types", "parsed as", "top types", "Arcanum n"],
            rows, ["left", "right", "right", "left", "left", "right"]))
    w("")

    # -- arcanum diff ------------------------------------------------------
    if arc:
        arc_total, arc_by_type = arc.field_counts()
        w("## 9. Vocabulary diff against Arcanum")
        w("")
        w(f"Baseline: `{arc.root}` ({sum(len(v) for v in arc.merged.values())} records, "
          f"{len(arc.merged)} types, {len(arc_total)} distinct fields).")
        w("")

        w("### Types only in the fork")
        w("")
        only_fork = sorted(set(fork.merged) - set(arc.merged))
        w(table(["type", "records"],
                [[f"`{t}`", len(fork.merged[t])] for t in only_fork],
                ["left", "right"]))
        w("")

        w("### Types only in Arcanum")
        w("")
        only_arc = sorted(set(arc.merged) - set(fork.merged))
        w(table(["type", "Arcanum records", "what happened to it in the fork"],
                [[f"`{t}`", len(arc.merged[t]),
                  DROPPED_TYPE_NOTES.get(t, "no `lists.%s` branch in the bundle" % t)]
                 for t in only_arc],
                ["left", "right", "left"]))
        w("")

        w("### Fields only in the fork")
        w("")
        rows = []
        for field in sorted(total_fields, key=lambda f: (-total_fields[f], f)):
            if field in arc_total:
                continue
            types = by_type[field]
            rows.append([f"`{field}`", total_fields[field],
                         ", ".join(f"{t} {n}" for t, n in types.most_common(5)),
                         PARSE_CLASSES.get(field, "")])
        w(table(["field", "n", "types", "parsed as"], rows, ["left", "right", "left", "left"]))
        w("")

        w("### Fields only in Arcanum")
        w("")
        rows = []
        for field in sorted(arc_total, key=lambda f: (-arc_total[f], f)):
            if field in total_fields:
                continue
            rows.append([f"`{field}`", arc_total[field],
                         ", ".join(f"{t} {n}" for t, n in arc_by_type[field].most_common(5))])
        w(table(["field", "Arcanum n", "types"], rows, ["left", "right", "left"]))
        w("")

        w("### Shared fields, by fork frequency")
        w("")
        rows = []
        for field in sorted(set(total_fields) & set(arc_total),
                            key=lambda f: (-total_fields[f], f)):
            fork_n, a_n = total_fields[field], arc_total[field]
            ratio = "—" if not a_n else f"{fork_n / a_n:.2f}×"
            rows.append([f"`{field}`", fork_n, a_n, ratio])
        w(table(["field", "fork n", "Arcanum n", "fork/Arcanum"],
                rows, ["left", "right", "right", "right"]))
        w("")

    # -- resource groups ---------------------------------------------------
    w("## 10. Resource groups")
    w("")
    for label, checkout in (("Fork", fork), ("Arcanum", arc)):
        if checkout is None:
            continue
        res = checkout.merged.get("resources", [])
        groups = collections.Counter(r.get("group", "(no group)") or "(empty string)"
                                     for r in res if isinstance(r, dict))
        w(f"### {label} — {len(res)} resource records in {len(groups)} groups")
        w("")
        w(table(["group", "records"],
                [[f"`{g}`", n] for g, n in sorted(groups.items(), key=lambda kv: (-kv[1], kv[0]))],
                ["left", "right"]))
        w("")

    # -- tags --------------------------------------------------------------
    tags = fork.merged.get("tags", [])
    w("## 11. Tag records")
    w("")
    w(f"`tags.json` holds {len(tags)} records. A tag id used as a bare `require` string "
      "resolves to its TagSet, which is truthy when the player owns any record carrying "
      "the tag. `t_furniture: true` marks a tag as a facility capability; `TagSet` "
      "appends \"(Facility Support)\" to its display name.")
    w("")
    rows = []
    tag_usage = collections.Counter()
    for typ, rec in fork.all_records():
        raw = rec.get("tags")
        if isinstance(raw, str):
            for t in raw.split(","):
                t = t.strip()
                if t:
                    tag_usage[t] += 1
        elif isinstance(raw, list):
            for t in raw:
                if isinstance(t, str):
                    tag_usage[t.strip()] += 1
    for rec in tags:
        rows.append([f"`{rec['id']}`", rec.get("name", ""),
                     "yes" if rec.get("t_furniture") else "",
                     tag_usage.get(rec["id"], 0)])
    w(table(["tag id", "name", "facility", "records carrying it"],
            rows, ["left", "left", "left", "right"]))
    w("")
    w("### Most-used tag strings not declared in `tags.json`")
    w("")
    undeclared = [(t, n) for t, n in tag_usage.most_common()
                  if t not in {r["id"] for r in tags}]
    w(table(["tag", "records"], [[f"`{t}`", n] for t, n in undeclared[:40]],
            ["left", "right"]))
    w(f"\n{len(undeclared)} undeclared tag strings in total; they still create TagSets "
      "lazily via `GameState.makeTagSets()`.")
    w("")

    # -- expressions -------------------------------------------------------
    w("## 12. Expression census")
    w("")
    fork_ex = fork.expressions()
    arc_ex = arc.expressions() if arc else []
    w(f"{len(fork_ex)} expression strings across `require`, `need`, `equneed` and "
      f"`show_require`" + (f" (Arcanum: {len(arc_ex)})." if arc else "."))
    w("")
    tokens = [">=", "<=", "==", "!=", ">", "<", "&&", "||", "!", "(", "+", "-", "*",
              "g.", "g.t_", ".max", ".rate", ".value", ".val", ".level", ".owned",
              ".locked", ".hasType", "Math."]
    rows = []
    for tok in tokens:
        f_n = sum(tok in e[3] for e in fork_ex)
        a_n = sum(tok in e[3] for e in arc_ex) if arc else None
        rows.append([f"`{tok}`", f_n, "—" if a_n is None else a_n])
    rows.append(["bare id (matches `/^[A-Za-z_]+\\w*$/`)",
                 sum(1 for e in fork_ex if ID_TEST.match(e[3])),
                 "—" if not arc else sum(1 for e in arc_ex if ID_TEST.match(e[3]))])
    w(table(["token", "fork", "Arcanum"], rows, ["left", "right", "right"]))
    w("")

    w("### Dotted sub-paths used inside expressions (fork)")
    w("")
    dots = collections.Counter()
    for _, _, _, text in fork_ex:
        for m in re.finditer(r"g\.[A-Za-z_]\w*((?:\.[A-Za-z_]\w*)+)", text):
            dots[m.group(1)] += 1
    w(table(["sub-path", "uses"],
            [[f"`{d}`", n] for d, n in sorted(dots.items(), key=lambda kv: (-kv[1], kv[0]))],
            ["left", "right"]))
    w("")

    w("### Bare-id requirements (fork)")
    w("")
    declared = {r["id"] for r in tags}
    all_tags = declared | set(tag_usage)
    bare = collections.Counter(e[3] for e in fork_ex if ID_TEST.match(e[3]))
    w(table(["id", "uses", "resolves to"],
            [[f"`{b}`", n,
              "tag (declared)" if b in declared else
              "tag (undeclared, lazily created)" if b in tag_usage else "record or nothing"]
             for b, n in sorted(bare.items(), key=lambda kv: (-kv[1], kv[0]))],
            ["left", "right", "left"]))
    w("")

    w("### Tag gating: `g.<tag>` vs Arcanum's `g.t_<tag>`")
    w("")
    w("`TagSet.valueOf()` sums the values of every item carrying the tag, so comparing a "
      "tag against a number counts owned records exactly as Arcanum's `g.t_<tag>` does. "
      "The fork simply stopped putting a `t_` prefix on tag names.")
    w("")
    # A tags.json entry is itself a record, so exclude that type when asking
    # "is this name a tag rather than a content record".
    record_ids = {rec.get("id") for typ, rec in fork.all_records() if typ != "tags"}
    tag_only = all_tags - record_ids
    gtag = collections.Counter()
    for _, _, _, text in fork_ex:
        if ID_TEST.match(text):
            continue
        for m in re.finditer(r"g\.([A-Za-z_]\w*)", text):
            if m.group(1) in tag_only:
                gtag[m.group(1)] += 1
    bare_tag = {b: n for b, n in bare.items() if b in tag_only}
    arc_t = 0
    for _, _, _, text in arc_ex:
        arc_t += len(re.findall(r"g\.t_\w+", text))
    w(table(["form", "uses"],
            [["fork — `g.<tag>` compared to a number", sum(gtag.values())],
             ["fork — bare tag id", sum(bare_tag.values())],
             ["fork — `g.t_<tag>`", sum(1 for e in fork_ex if "g.t_" in e[3])],
             ["Arcanum — `g.t_<tag>`", arc_t]],
            ["left", "right"]))
    w("")
    w(table(["tag", "`g.<tag>` uses", "bare-id uses"],
            [[f"`{t}`", gtag.get(t, 0), bare_tag.get(t, 0)]
             for t in sorted(set(gtag) | set(bare_tag),
                             key=lambda t: (-(gtag.get(t, 0) + bare_tag.get(t, 0)), t))],
            ["left", "right", "right"]))
    w("")

    w("### Every expression that uses more than `g.<id> <cmp> <n>` joined by `&&` (fork)")
    w("")
    w("Anything with alternation, equality, arithmetic, grouping, negation or a dotted "
      "sub-path. This is the complete list.")
    w("")
    complex_re = re.compile(r"\|\||==|!=|[-+*!()]|g\.\w+\.")
    interesting = [e for e in fork_ex
                   if not ID_TEST.match(e[3]) and complex_re.search(e[3])]
    rows = [[f"`{t}`", f"`{i}`", f"`{f}`", f"`{v}`"] for t, i, f, v in interesting]
    w(table(["type", "id", "field", "expression"], rows))
    w(f"\n{len(interesting)} of {len(fork_ex)} expressions "
      f"({100 * len(interesting) / max(len(fork_ex), 1):.1f}%). The remaining "
      f"{len(fork_ex) - len(interesting)} are a bare id or a chain of "
      "`g.<id> >= <number>` joined by `&&`.")
    w("")

    # -- synthesised records -----------------------------------------------
    w("## 13. Records synthesised at load time")
    w("")
    mj_items = [r for r in fork.merged.get("factclass", [])
                if isinstance(r, dict) and r.get("mj")]
    w("`dataLoader.loadGame()` walks `factclass` and, for every record with an `mj` "
      "value, clones the `template_burn` recipe into a new `factrecipe` with id "
      "`as_<id>_burn`, substituting the item into the recipe's `require`, `inp`, `outp` "
      "and `cost`. Items carrying the `solid` tag have a similar part-generation loop, "
      "but every line of it is commented out.")
    w("")
    w(table(["measure", "value"],
            [["`factclass` records with `mj`", len(mj_items)],
             ["synthesised `factrecipe` records", len(mj_items)],
             ["`factrecipe` records after synthesis",
              len(fork.merged.get("factrecipe", [])) + len(mj_items)]],
            ["left", "right"]))
    w("")

    # -- dangling gates ----------------------------------------------------
    by_type, missing = fork.dangling()
    unreachable = sum(len(v) for v in by_type.values())
    w("## 14. Gates that name something nothing defines")
    w("")
    w("`GameState.unlockTest()` resolves a bare-id gate with `getData(test)` and returns "
      "falsy when the id is unknown; an expression reading `g.<unknown>` gets `undefined`, "
      "so every comparison against it is false. A record whose `require` names a "
      "non-existent id can therefore never unlock. Ids the engine creates itself "
      "(" + ", ".join(f"`{i}`" for i in sorted(ENGINE_IDS)) + ") are treated as declared.")
    w("")
    rows = []
    for typ in sorted(by_type, key=lambda t: (-len(by_type[t]), t)):
        rows.append([f"`{typ}`", len(by_type[typ]), len(fork.merged[typ]),
                     f"{100 * len(by_type[typ]) / len(fork.merged[typ]):.0f}%"])
    rows.append(["**total**", f"**{unreachable}**",
                 f"**{sum(len(v) for v in fork.merged.values())}**",
                 f"**{100 * unreachable / sum(len(v) for v in fork.merged.values()):.0f}%**"])
    w(table(["type", "records with a dangling gate", "records of that type", "share"],
            rows, ["left", "right", "right", "right"]))
    w("")
    w("### The names that resolve to nothing")
    w("")
    w(table(["name", "gates naming it", "note"],
            [[f"`{name}`", n, EXPECTED_DANGLING.get(name, "")]
             for name, n in sorted(missing.items(), key=lambda kv: (-kv[1], kv[0]))],
            ["left", "right", "left"]))
    w("")
    w("### Every affected record")
    w("")
    rows = []
    for typ in sorted(by_type):
        for rec_id, field, expr, bad in sorted(by_type[typ]):
            rows.append([f"`{typ}`", f"`{rec_id}`", f"`{field}`", f"`{expr}`",
                         ", ".join(f"`{b}`" for b in bad)])
    w(table(["type", "id", "field", "expression", "undefined"], rows))
    w("")

    return "\n".join(L).rstrip() + "\n"


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("repo", help="path to the Hundred Days checkout")
    parser.add_argument("--arcanum", default="/tmp/arcanum-data",
                        help="path to unpacked Arcanum data for the diff "
                             "(default: %(default)s; skipped if absent)")
    parser.add_argument("-o", "--out", default=None,
                        help="output file (default: ../data-census.md next to this script)")
    args = parser.parse_args(argv)

    if not os.path.isdir(args.repo):
        parser.error(f"no such directory: {args.repo}")

    fork = Checkout(args.repo, "fork")

    arc = None
    if os.path.isdir(args.arcanum):
        arc = Checkout(args.arcanum, "arcanum")
    else:
        print(f"note: {args.arcanum} not found; the Arcanum diff will be omitted",
              file=sys.stderr)

    commit, branch = git_describe(args.repo)
    report = build_report(fork, arc, commit, branch)

    out = args.out or os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                   os.pardir, "data-census.md")
    out = os.path.normpath(out)
    with open(out, "w", encoding="utf-8") as fh:
        fh.write(report)
    print(f"wrote {out} ({len(report.splitlines())} lines)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
