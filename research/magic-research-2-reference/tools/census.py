#!/usr/bin/env python3
"""Generate data-census.md for the Magic Research 2 reference.

Inputs (all paths are arguments; nothing is fetched):
  --demo-map   main.<hash>.js.map from mcolotto/magic-research-demo (magic-research-2/static/js/)
  --strings    base-translations.json from mcolotto/magic-research-2-translations
  --wiki       sources/wiki-dump-2026-11-19.json (fandom API dump made in the browser)
  --sdk        checkout of mcolotto/magic-research-2-modding-sdk (for modding-decs/)

Writes Markdown to stdout. Regenerate, never hand-edit the output.

The demo source is read from the source map's sourcesContent in memory only; no
code from it is written out. Only identifiers, names and numbers are tabulated.
"""
import argparse
import collections
import json
import os
import re
import sys


def load_demo(path):
    m = json.load(open(path))
    files = {}
    for p, c in zip(m["sources"], m.get("sourcesContent") or []):
        if not c or "node_modules" in p or "webpack" in p:
            continue
        p = re.sub(r"^(\./|\.\./)+", "", p)
        files[p] = c
    return files


def rx(pattern, text, default=None, flags=re.S):
    mo = re.search(pattern, text, flags)
    return mo.group(1) if mo else default


def reqs(text, fn):
    body = rx(fn + r"\(\)[^{]*\{\s*return\s*\{([^}]*)\}", text, "")
    return {k: int(v) for k, v in re.findall(r"(\w+):\s*(\d+)", body)}


def fmt_reqs(d):
    return ", ".join(f"{k} {v}" for k, v in d.items()) or "—"


def md_table(header, rows):
    out = ["| " + " | ".join(header) + " |", "|" + "---|" * len(header)]
    for r in rows:
        out.append("| " + " | ".join(str(x).replace("|", "/").replace("\n", " ") for x in r) + " |")
    return "\n".join(out)


def demo_census(files):
    out = []
    backend = {p: c for p, c in files.items() if "/backend/" in p}
    lines_all = sum(c.count("\n") + 1 for c in files.values())
    lines_be = sum(c.count("\n") + 1 for c in backend.values())
    out.append("## 1. Demo source (v1.5.5 web build, source map)\n")
    out.append(f"{len(files)} first-party files, {lines_all:,} lines; `src/backend/` {len(backend)} files, {lines_be:,} lines.\n")

    # class hierarchy
    ext = collections.Counter()
    for c in backend.values():
        for base in re.findall(r"class\s+\w+\s+extends\s+(\w+)", c):
            ext[base] += 1
    out.append("### 1.1 Classes by base class (backend)\n")
    out.append(md_table(["Base class", "Subclasses"], ext.most_common()))

    # registries / hooks
    allsrc = "\n".join(backend.values())
    hooks = {
        "registerTransformation(": "transformations registered",
        "registerTimeTickListener(": "time-tick listeners",
        "addGameStateListener(": "game-state listeners",
        "buildEvent(": "events built with the event DSL",
        "Storylines.register(": "storylines registered",
        "addEnemyDeathListener(": "enemy-death listeners",
        "registerRetirementListener(": "retirement listeners",
        "registerPostRetirementListener(": "post-retirement listeners",
        "IncomeOverTimeProducers.register(": "income-over-time producers",
        "new DataStore": "DataStores",
    }
    rows = [(desc, allsrc.count(k)) for k, desc in hooks.items()]
    out.append("\n### 1.2 Extension points used (call sites in backend, demo build)\n")
    out.append(md_table(["Hook", "Call sites"], rows))
    tags = files.get("src/backend/transformation/TransformationTags.tsx", "")
    tag_names = re.findall(r"^\s+(\w+)\s*=", tags, re.M)
    flags = files.get("src/backend/Flag.tsx", "")
    flag_names = re.findall(r"^\s+(\w+)\s*=", flags, re.M)
    out.append(f"\n`TransformationTags`: {len(tag_names)} named tags. `Flag` enum: {len(flag_names)} named flags.\n")
    out.append("Tags: " + ", ".join(f"`{t}`" for t in tag_names) + "\n")

    # spells
    spells = []
    for p, c in backend.items():
        if not re.search(r"extends\s+(CombatSpellBase|Spell|BasicChannelingSpellBase|TransmutationSpell|EquipmentTransmutationSpell|BuildingSpell)\b", c):
            continue
        if "/spells/" not in p:
            continue
        sid = rx(r'getId\(\)[^{]*\{\s*return\s*"([^"]+)"', c)
        if sid is None:
            continue  # abstract base class
        name = rx(r'getSpellName\(\)[^{]*\{\s*return\s*t\(\s*"([^"]+)"', c)
        el = rx(r"getElement\(\)[^{]*\{\s*return\s*SpellElement\.(\w+)", c, "")
        mana = rx(r"getBaseManaCost\([^)]*\)[^{]*\{\s*return\s*([\d.]+)", c, "?")
        cd = rx(r"getBaseCooldown\(\)[^{]*\{\s*return\s*([\d.]+)", c, "—")
        wp = rx(r"getBaseAutocastPointsRequirement\(\)[^{]*\{\s*return\s*([\d.]+)", c, "—")
        cat = rx(r"SpellAutocastCategory\.(\w+)", c, "")
        lv = reqs(c, "getLevelRequirements")
        emp = reqs(c, "getEmpoweringLevelRequirements")
        emp_mult = rx(r"register(?:Standard|Buff)EmpowerEffects\(\s*\w+,\s*([\d.]+),\s*([\d.]+)", c)
        em = re.search(r"register(?:Standard|Buff)EmpowerEffects\(\s*\w+,\s*([\d.]+),\s*([\d.]+)", c)
        spells.append((el, min(lv.values()) if lv else 0, sid, name, fmt_reqs(lv), mana, cd, wp, cat,
                       fmt_reqs(emp), f"x{em.group(1)} eff / x{em.group(2)} mana" if em else "—"))
    spells.sort()
    out.append(f"\n### 1.3 Spells in the demo build ({len(spells)})\n")
    out.append(md_table(["Element", "id", "Name", "Level req", "Mana", "Cooldown s", "Wizard Power", "Category", "Empower at", "Empower"],
                        [s[:1] + s[2:] for s in spells]))

    # buildings
    blds = []
    for p, c in backend.items():
        if "/buildings/" not in p or "extends Building" not in c:
            continue
        name = rx(r'getName\(\)[^{]*\{\s*return\s*t\(\s*"([^"]+)"', c)
        land = rx(r"getBaseLandRequired\(\)[^{]*\{\s*return\s*([\d.]+)", c, "?")
        cost = rx(r"getBaseResourceCost\(\)[^{]*\{\s*return\s*\{([^}]*)\}", c, "")
        scale = rx(r"getBaseResourceScale\(\)[^{]*\{\s*return\s*\{([^}]*)\}", c, "")
        mana = rx(r"getBaseManaCost\([^)]*\)[^{]*\{\s*return\s*([\d.]+)", c, "?")
        off = rx(r"canTurnOff\(\)[^{]*\{\s*return\s*(\w+)", c, "?")
        norm = lambda s: re.sub(r"\s+", " ", s).strip().rstrip(",")
        blds.append((name or os.path.basename(p), land, norm(cost), norm(scale), mana, off))
    out.append(f"\n### 1.4 Furniture in the demo build ({len(blds)})\n")
    out.append(md_table(["Furniture", "Land", "Base cost", "Cost scale (per copy)", "Mana", "Can turn off"], sorted(blds)))

    # enhancements
    enh = []
    for p, c in backend.items():
        if "extends Enhancement" not in c:
            continue
        name = rx(r'getBaseName\(\)[^{]*\{\s*return\s*t\(\s*"([^"]+)"', c)
        cost = re.sub(r"\s+", " ", rx(r"getBaseResourceCost\(\)[^{]*\{\s*return\s*\{([^}]*)\}", c, "")).strip().rstrip(",")
        items = re.sub(r"\s+", " ", rx(r"getItemCost\(\)[^{]*\{\s*return\s*\{([^}]*)\}", c, "")).strip().rstrip(",")
        eff = rx(r'getDisplayEffect\([^)]*\)[^{]*\{\s*return\s*t\(\s*"([^"]+)"', c, "(computed)")
        enh.append((p.split("/")[-2], name, cost, items or "—", eff))
    out.append(f"\n### 1.5 Enhancements in the demo build ({len(enh)})\n")
    out.append(md_table(["Group", "Enhancement", "Resources", "Items", "Effect"], sorted(enh)))

    # enemies
    ens = []
    for p, c in backend.items():
        if "/enemies/" not in p or "extends Enemy" not in c:
            continue
        sid = rx(r'getId\(\)[^{]*\{\s*return\s*"([^"]+)"', c)
        lvl = rx(r"getLevel\(\)[^{]*\{\s*return\s*([\d.]+)", c, "?")
        stats = rx(r"getBaseStats\(\)[^{]*\{\s*return\s*\{(.*?)\}", c, "")
        st = dict(re.findall(r"(\w+):\s*([\d.e]+)", stats))
        coins = rx(r"getCoinsAwardedBase\([^)]*\)[^{]*\{\s*return\s*([\d.]+)", c, "—")
        mon = rx(r"getMonstiumAwardedBase\([^)]*\)[^{]*\{\s*return\s*([\d.]+)", c, "—")
        scripted = "yes" if "getNextAction" in c else "no"
        ens.append((p.split("/")[-2], sid, lvl, st.get("maxHP", "?"), st.get("attack", "?"), st.get("defense", "?"),
                    st.get("attackDelay", "?"), st.get("accuracy", "?"), st.get("dodge", "?"), coins, mon, scripted))
    ens.sort(key=lambda r: (r[0], float(r[2]) if r[2] not in ("?",) else 0))
    out.append(f"\n### 1.6 Enemies in the demo build ({len(ens)})\n")
    out.append(md_table(["Area", "id", "Level", "HP", "Attack", "Defense", "Attack delay", "Accuracy", "Dodge", "Coins", "Monstium", "Scripted moves"], ens))
    return out, files


def strings_census(path, files):
    d = json.load(open(path))
    out = ["\n## 2. Translation strings (v1.8.6 base file)\n"]
    words = sum(len(k.split()) for k in d)
    src = re.sub(r"\s+", " ", "\n".join(files.values()))
    in_demo = 0
    for k in d:
        probe = re.sub(r"\s+", " ", k)[:60]
        if probe and probe in src:
            in_demo += 1
    out.append(f"{len(d):,} strings, {words:,} words. About {in_demo:,} ({in_demo*100//len(d)} %) also occur in the v1.5.5 demo source (first 60 characters matched), so roughly {len(d)-in_demo:,} strings exist only in the full game.\n")
    story = sorted(k[len("(Storyline) "):] for k in d if k.startswith("(Storyline) "))
    out.append(f"Event titles prefixed `(Storyline)`: {len(story)} (one title can cover several outcomes, e.g. `Essence Artifact ({{{{element}}}})`).\n")
    out.append(", ".join(story) + "\n")
    endings = sorted(k for k in d if re.match(r"^Ending: ", k))
    out.append("Endings named in strings: " + "; ".join(endings) + "\n")
    chal = sorted(set(re.findall(r"\(Storyline\) Challenge \((\w+)\)", " ".join(d))))
    out.append("Challenges named in strings: " + ", ".join(chal) + "\n")
    return out


def wiki_census(path):
    dump = json.load(open(path))
    P = dump["pages"]
    out = [f"\n## 3. Fandom wiki dump ({dump.get('fetched','?')[:10]})\n"]
    def fields(t):
        heads = list(re.finditer(r"^==\s*([^=].*?)\s*==\s*$", t, re.M))
        f = {}
        for i, h in enumerate(heads):
            end = heads[i + 1].start() if i + 1 < len(heads) else len(t)
            v = t[h.end():end]
            v = re.sub(r"\[\[:?Category:[^\]]*\]\]", "", v)
            v = re.sub(r"<div[^>]*></div>", "", v)
            v = re.sub(r"\[\[(?:[^|\]]*\|)?([^\]]*)\]\]", r"\1", v).strip()
            f[h.group(1)] = v
        return f
    kinds = ["Monster", "Spell", "Storyline", "Equipment", "Material", "Ritual"]
    by = collections.defaultdict(list)
    for title, p in P.items():
        k = next((c for c in kinds if c in p["cats"]), "hand-written")
        by[k].append((title, fields(p["text"]), p))
    years = collections.Counter((p.get("ts") or "")[:4] for p in P.values())
    out.append(f"{len(P)} pages. Last-edit year: " + ", ".join(f"{y} {n}" for y, n in sorted(years.items())) + ".\n")
    out.append(md_table(["Page kind", "Pages"], [(k, len(v)) for k, v in sorted(by.items(), key=lambda kv: -len(kv[1]))]))
    out.append("\nHand-written pages: " + ", ".join(sorted(t for t, _, _ in by["hand-written"])) + "\n")

    def num(x):
        try:
            return float(re.sub(r"[^\d.]", "", x))
        except ValueError:
            return float("inf")

    # storylines
    rows = []
    for t, f, _ in sorted(by["Storyline"], key=lambda r: r[0]):
        rows.append((t, f.get("Area", ""), f.get("Storyline Appearance", ""), f.get("Mid-storyline Requirements", ""), f.get("Reward", ""), f.get("Oracle", "")))
    areas = collections.Counter(r[1] for r in rows)
    out.append(f"\n### 3.1 Storylines ({len(rows)} pages)\n")
    out.append("By area: " + ", ".join(f"{a or '(blank)'} {n}" for a, n in areas.most_common()) + "\n")
    out.append(md_table(["Storyline", "Area", "Appears when", "Mid-storyline requirement", "Reward", "Oracle lvl"], rows))

    # spells
    rows = []
    for t, f, p in by["Spell"]:
        el = f.get("Element", "")
        rows.append((el, num(f.get("Level", "")), t, f.get("Level", ""), f.get("Cost", ""), f.get("Cooldown", ""), f.get("Category", ""), f.get("Empowering Level", ""), f.get("Tags", "")))
    rows.sort()
    out.append(f"\n### 3.2 Spells ({len(rows)} pages)\n")
    per_el = collections.Counter(r[0] for r in rows)
    out.append("By element: " + ", ".join(f"{e} {n}" for e, n in sorted(per_el.items())) + "\n")
    out.append(md_table(["Element", "Spell", "Level", "Mana", "Cooldown s", "Category", "Empowering level", "Tags"], [r[:1] + r[2:] for r in rows]))

    # monsters
    rows = []
    for t, f, p in by["Monster"]:
        rows.append((num(f.get("Level", "")), t, f.get("Level", ""), "boss" if f.get("isBoss") == "1" else "", f.get("maxHP", ""), f.get("attack", ""), f.get("attackDelay", ""), f.get("accuracy", ""), f.get("dodge", ""), f.get("crit", ""), f.get("CoinsAwardedBase", ""), f.get("MonstiumAwardedBase", "")))
    rows.sort()
    out.append(f"\n### 3.3 Bestiary ({len(rows)} pages, {sum(1 for r in rows if r[3])} bosses)\n")
    out.append(md_table(["Enemy", "Level", "Boss", "Max HP", "Attack", "Attack delay", "Accuracy", "Dodge", "Crit", "Coins", "Monstium"], [r[1:] for r in rows]))

    # equipment + materials
    for kind in ("Equipment", "Material"):
        rows = []
        for t, f, p in by[kind]:
            rows.append((f.get("Element", ""), num(f.get("Level", "")), t, f.get("Level", ""), f.get("Price", ""), f.get("Effects", "")[:160]))
        rows.sort()
        out.append(f"\n### 3.{4 if kind=='Equipment' else 5} {kind} ({len(rows)} pages)\n")
        out.append(md_table(["Element", "Item", "Level", "Sale price", "Effects (truncated)"], [r[:1] + r[2:] for r in rows]))

    rows = [(t, f.get("Level", ""), f.get("Corruption", ""), f.get("Effect", "")) for t, f, _ in sorted(by["Ritual"])]
    out.append(f"\n### 3.6 Rituals ({len(rows)} pages)\n")
    out.append(md_table(["Ritual", "Death level", "Corruption", "Effect"], rows))

    # element unlock tables
    rows = []
    for el in ["Fire", "Earth", "Water", "Air", "Poison", "Mind", "Life", "Electric", "Death", "Holy", "Time", "Space"]:
        t = P.get(el, {}).get("text", "")
        lv = [int(x) for x in re.findall(r"^\|\s*(\d+)\s*$", t, re.M)]
        rows.append((el, len(lv), max(lv) if lv else "—"))
    out.append("\n### 3.7 Element pages: levels with an unlock listed\n")
    out.append(md_table(["Element", "Unlock rows", "Highest level listed"], rows))
    return out


def sdk_census(path):
    out = ["\n## 4. Modding SDK declarations\n"]
    decs = os.path.join(path, "modding-decs")
    n = 0
    dirs = collections.Counter()
    for root, _, fs in os.walk(decs):
        for f in fs:
            if f.endswith(".d.ts"):
                n += 1
                dirs[os.path.relpath(root, decs).split(os.sep)[0:2].__str__()] += 1
    out.append(f"{n} `.d.ts` files under `modding-decs/`.\n")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--demo-map", required=True)
    ap.add_argument("--strings", required=True)
    ap.add_argument("--wiki", required=True)
    ap.add_argument("--sdk", required=True)
    a = ap.parse_args()
    files = load_demo(a.demo_map)
    parts = ["# Magic Research 2: data census", "",
             "Generated by `tools/census.py`. Do not hand-edit; regenerate. Version labels: demo source **v1.5.5** (web build 2024-07-08), strings **v1.8.6**, wiki dump **2026-11-19** (wiki pages carry no game version; most were written against 1.2–1.8).", ""]
    d, files = demo_census(files)
    parts += d
    parts += strings_census(a.strings, files)
    parts += wiki_census(a.wiki)
    parts += sdk_census(a.sdk)
    sys.stdout.write("\n".join(parts) + "\n")


if __name__ == "__main__":
    main()
