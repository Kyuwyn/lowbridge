#!/usr/bin/env python3
"""Class-lattice validator for DESIGN-PLAN Part B (technique web + roster).

Checks, for every legal B2→B3 history:
  * at least 2 B4 options, at least 1 of them a specialist (not Golden Cauldron)
  * every line supports "three from one line" (pure chain B2→B3→B4)
Model: entry techniques open at runway 5; a class tagging a line adds +3 to that line's
entry technique and unlocks one module tier (+3); hybrid classes raise their bridge technique;
mastery techniques exist only when entry >= 10 and the line tag is held.
Run: python3 b4-gates.py  (exit 1 on any failure)
"""
import collections, sys

LINES = {"Body": "circ", "Sword": "blade", "Earth": "ground", "Formation": "array", "Alchemy": "refine"}
BRIDGES = ["rooting", "projection", "anchoring", "warding", "extraction", "tonics", "quenching"]
MASTERY = {"tempering": ("circ", "Body"), "severing": ("blade", "Sword"), "veinsense": ("ground", "Earth"),
           "fixing": ("array", "Formation"), "transmutation": ("refine", "Alchemy")}

CLASSES = {
    # B2 gate: entry technique >= 3 and its introduction used
    "BodyDisciple":     dict(tier=2, tags=["Body"],              gate=lambda t, c: c["circ"] >= 3),
    "SwordDisciple":    dict(tier=2, tags=["Sword", "Spirit"],   gate=lambda t, c: c["blade"] >= 3, bridge={"projection": 1}),
    "EarthListener":    dict(tier=2, tags=["Earth"],             gate=lambda t, c: c["ground"] >= 3),
    "FormationStudent": dict(tier=2, tags=["Formation", "Spirit"], gate=lambda t, c: c["array"] >= 3, bridge={"projection": 1}),
    # B3
    "IronMarrow":     dict(tier=3, tags=["Body"],             gate=lambda t, c: t["Body"] >= 1 and c["circ"] >= 8),
    "MountainVessel": dict(tier=3, tags=["Body", "Earth"],    gate=lambda t, c: (t["Body"] >= 1 or t["Earth"] >= 1) and c["rooting"] >= 3, bridge={"rooting": 3}),
    "BladeBody":      dict(tier=3, tags=["Sword", "Body"],    gate=lambda t, c: (t["Sword"] >= 1 or t["Body"] >= 1) and c["quenching"] >= 3, bridge={"quenching": 3}),
    "SpiritBlade":    dict(tier=3, tags=["Sword", "Spirit"],  gate=lambda t, c: (t["Sword"] >= 1 or t["Spirit"] >= 1) and c["projection"] >= 3 and c["blade"] >= 5, bridge={"projection": 3}),
    "EarthArray":     dict(tier=3, tags=["Earth", "Formation"], gate=lambda t, c: (t["Earth"] >= 1 or t["Formation"] >= 1) and c["anchoring"] >= 3, bridge={"anchoring": 3}),
    "DeepListener":   dict(tier=3, tags=["Earth"],            gate=lambda t, c: t["Earth"] >= 1 and c["ground"] >= 8),
    "ArrayKeeper":    dict(tier=3, tags=["Formation"],        gate=lambda t, c: t["Formation"] >= 1 and c["array"] >= 8),
    "PillRefiner":    dict(tier=3, tags=["Alchemy", "Body"],  gate=lambda t, c: c["refine"] >= 5, bridge={"tonics": 3}),
    # B4
    "JadeBody":        dict(tier=4, tags=["Body"],              gate=lambda t, c: t["Body"] >= 2 and c["tempering"] >= 3),
    "SwordHeart":      dict(tier=4, tags=["Sword", "Spirit"],   gate=lambda t, c: t["Sword"] >= 2 and c["severing"] >= 3),
    "VeinAdept":       dict(tier=4, tags=["Earth"],             gate=lambda t, c: t["Earth"] >= 2 and c["veinsense"] >= 3),
    "GrandArray":      dict(tier=4, tags=["Formation"],         gate=lambda t, c: t["Formation"] >= 2 and c["fixing"] >= 3),
    "MountainHeart":   dict(tier=4, tags=["Body", "Earth"],     gate=lambda t, c: t["Body"] >= 1 and t["Earth"] >= 1 and c["rooting"] >= 5),
    "StoneWard":       dict(tier=4, tags=["Earth", "Formation"], gate=lambda t, c: t["Earth"] >= 1 and t["Formation"] >= 1 and c["anchoring"] >= 5),
    "SpiritWarden":    dict(tier=4, tags=["Spirit", "Formation"], gate=lambda t, c: t["Spirit"] >= 2 and c["warding"] >= 3),
    "SpiritAlchemist": dict(tier=4, tags=["Spirit", "Alchemy"], gate=lambda t, c: t["Spirit"] >= 1 and t["Alchemy"] >= 1 and c["extraction"] >= 5 and c["projection"] >= 3),
    "GoldenCauldron":  dict(tier=4, tags=["Alchemy"],           gate=lambda t, c: c["lore"] >= 8 and c["refine"] >= 5),
}
PURE = {"Body": ("BodyDisciple", "IronMarrow", "JadeBody"), "Sword": ("SwordDisciple", "SpiritBlade", "SwordHeart"),
        "Earth": ("EarthListener", "DeepListener", "VeinAdept"), "Formation": ("FormationStudent", "ArrayKeeper", "GrandArray")}


def caps_after(history):
    tags = collections.Counter(); cap = collections.defaultdict(int)
    cap["lore"] = 10; cap["qisense"] = 8; cap["circ"] = 5          # after Foundation
    for cid in history:
        c = CLASSES[cid]
        for tag in c["tags"]:
            tags[tag] += 1
            if tag in LINES:
                tech = LINES[tag]; cap[tech] = max(cap[tech], 5) + 3 + 3   # class +3, module tier +3
        for b, n in c.get("bridge", {}).items(): cap[b] = max(cap[b], 5) + n
    for tech in LINES.values(): cap[tech] = max(cap[tech], 5)       # entries reachable via teaching at Lore 3
    for b in BRIDGES: cap[b] = max(cap[b], 5)
    for m, (tech, line) in MASTERY.items():
        cap[m] = (5 + 2 * (tags[line] - 1)) if (cap[tech] >= 10 and tags[line] >= 1) else 0
    return tags, cap


def main():
    tier = lambda n: [k for k, v in CLASSES.items() if v["tier"] == n]
    hist, fails = [], []
    for a in tier(2):
        t, c = caps_after([a])
        for b in tier(3):
            if not CLASSES[b]["gate"](t, c): continue
            t2, c2 = caps_after([a, b]); opts = [d for d in tier(4) if CLASSES[d]["gate"](t2, c2)]
            hist.append((a, b, opts))
            spec = [o for o in opts if o != "GoldenCauldron"]
            if len(opts) < 2 or not spec: fails.append(f"{a}->{b}: options={opts}")
            print(f"{a:16}->{b:14} {len(opts)} {opts}")
    for line, (a, b, c) in PURE.items():
        if not any(h[0] == a and h[1] == b and c in h[2] for h in hist): fails.append(f"three-from-{line} blocked")
    print(f"histories={len(hist)} per-starter={ {a: sum(1 for h in hist if h[0]==a) for a in tier(2)} }")
    print("reachable-from:", {d: sum(1 for h in hist if d in h[2]) for d in tier(4)})
    if fails:
        print("FAIL:", *fails, sep="\n  "); sys.exit(1)
    print("OK")


if __name__ == "__main__":
    main()
