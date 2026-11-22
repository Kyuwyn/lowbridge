#!/usr/bin/env python3
"""Opening-slice reachability + timing simulator for DESIGN-PLAN Part C.

A greedy player follows a route preference; every record is a dict with require/need
(callables over state S and completion counter d), an apply(), a duration and repeatability.
Checks: both routes reach Foundation; Circulation (the core) cannot be skipped; prints the
active-play time. Practice levels cost 60*(level+1) seconds (runway model).
Run: python3 opening-sim.py  (exit 1 if a route fails or the core is skippable)
     python3 opening-sim.py --real-json  (also run the TypeScript engine over source JSON)

This historical approximation is intentionally retained. Its site/practice rewards are
not the exact data model; --real-json prints the measured difference instead of silently
changing the baseline to match the implementation.
"""
import argparse, collections, json, pathlib, subprocess, sys


def records():
    S0 = dict(coin=0, coin_max=20, herbs=0, herbs_max=12, timber=0, stone=0, qi=0, qi_max=0,
              lore=0, lore_max=0, qs=0, qs_max=0, circ=0, circ_max=0, space=2, used=0)
    R = []

    def add(id, apply, require=None, need=None, len=0, repeat=False):
        R.append(dict(id=id, apply=apply, require=require, need=need, len=len, repeat=repeat))

    def gain(k, n, cap=None):
        return lambda S, d: S.__setitem__(k, min(S[cap], S[k] + n) if cap else S[k] + n)

    def pay(**c):
        def f(S, d):
            for k, v in c.items(): S[k] -= v
        return f

    def seq(*fs): return lambda S, d: [f(S, d) for f in fs]
    def level(k, kmax): return lambda S, d: S.__setitem__(k, min(S[kmax], S[k] + 1))
    def install(sp): return lambda S, d: S.__setitem__("used", S["used"] + sp)
    have = lambda **c: (lambda S, d: all(S[k] >= v for k, v in c.items()))
    did = lambda id, n=1: (lambda S, d: d[id] >= n)

    # work: instant Vigor chores, timed here as the rest needed to pay them (cost / 0.25 Vigor per second)
    add("mill_work", seq(lambda S, d: S.__setitem__("coin", min(S["coin_max"], S["coin"] + 3 + (d["mill_work"] >= 10) + (d["mill_work"] >= 30)))),
        require=lambda S, d: d["ferry_hauling"] == 0, len=8, repeat=True)
    add("sort_herbs", gain("herbs", 1, "herbs_max"), len=4, repeat=True)
    add("gather_herbs", gain("herbs", 3, "herbs_max"), require=have(qs=1), len=12, repeat=True)
    add("cut_timber", gain("timber", 2), require=did("field_kit"), len=16, repeat=True)
    # purchases
    add("coin_pouch", seq(pay(coin=15), gain("coin_max", 30)), require=have(coin=20))
    add("jade_slip", seq(pay(coin=6), lambda S, d: S.update(lore_max=3, qs_max=3, qi_max=2)), require=did("sort_herbs", 3), need=have(coin=6))
    add("field_kit", pay(coin=20), require=have(lore=1), need=have(coin=20))
    add("shu_reading", seq(pay(herbs=5), gain("lore_max", 1)), require=have(lore=2), need=have(herbs=5))
    # practice
    add("breath_gathering", seq(level("qs", "qs_max"), lambda S, d: S.__setitem__("qi", min(S["qi_max"], S["qi"] + 2))),
        require=did("jade_slip"), need=lambda S, d: S["qs"] < S["qs_max"], len=60, repeat=True)
    add("fragment_notes", level("lore", "lore_max"), require=did("jade_slip"), need=lambda S, d: S["lore"] < S["lore_max"], len=90, repeat=True)
    # channel route
    add("channel_observe", seq(gain("stone", 2), lambda S, d: S.__setitem__("qs_max", S["qs_max"] + (d["channel_observe"] == 0))), require=have(qs=1), len=120)
    add("clear_channel", seq(gain("coin", 10, "coin_max"), gain("stone", 4)), require=lambda S, d: d["channel_observe"] > 0 and d["field_kit"] > 0, len=300)
    add("channel_arrangement", seq(pay(stone=4), install(2), lambda S, d: S.__setitem__("circ_max", max(S["circ_max"], 3))),
        require=lambda S, d: d["clear_channel"] > 0 and S["qs"] >= 3, need=lambda S, d: S["stone"] >= 4 and S["space"] - S["used"] >= 2)
    add("channel_exercise", level("circ", "circ_max"), require=did("channel_arrangement"), need=lambda S, d: S["circ"] < S["circ_max"], len=60, repeat=True)
    # hollow route
    add("fernhollow_observe", lambda S, d: None, require=have(qs=2), len=120)
    add("sit_fernhollow", seq(level("qs", "qs_max"), lambda S, d: S.__setitem__("qs_max", S["qs_max"] + (2 if d["sit_fernhollow"] == 0 else 0))),
        require=did("fernhollow_observe"), need=lambda S, d: S["qs"] < S["qs_max"] or d["sit_fernhollow"] < 3, len=180, repeat=True)
    add("steady_attention", seq(lambda S, d: S.__setitem__("circ_max", max(S["circ_max"], 3)), level("circ", "circ_max")),
        require=lambda S, d: d["sit_fernhollow"] >= 3 and S["qs"] >= 3, need=lambda S, d: S["circ"] < S["circ_max"] or d["steady_attention"] == 0, len=120, repeat=True)
    # home
    add("practice_mat", seq(pay(coin=8), install(1)), need=lambda S, d: S["coin"] >= 8 and S["space"] - S["used"] >= 1)
    add("herb_rack", seq(pay(coin=10, timber=2), install(1), gain("herbs_max", 12)), require=have(lore=1),
        need=lambda S, d: S["coin"] >= 10 and S["timber"] >= 2 and S["space"] - S["used"] >= 1)
    add("lean_to", seq(pay(coin=40, timber=6), lambda S, d: S.__setitem__("space", 4)), need=have(coin=40, timber=6))
    # foundation: core Circulation >= 2 (require) + 3 of 4 supporting (need) + bill
    def supporting(S, d): return sum([S["qs"] >= 3, S["lore"] >= 2, S["used"] >= 2, d["clear_channel"] > 0 or d["steady_attention"] > 0])
    add("foundation", pay(herbs=10), require=lambda S, d: S["circ"] >= 2,
        need=lambda S, d: supporting(S, d) >= 3 and S["herbs"] >= 10 and S["qi"] >= S["qi_max"], len=120)
    add("ferry_hauling", gain("coin", 6, "coin_max"), require=did("foundation"), len=40, repeat=True)
    return R, S0, supporting


def simulate(R, S0, pref, max_steps=600):
    S = dict(S0); d = collections.Counter(); t = 0.0; log = []
    ok = lambda r: (r["require"] or (lambda s, d: True))(S, d) and (r["need"] or (lambda s, d: True))(S, d)
    for _ in range(max_steps):
        avail = [r for r in R if ok(r) and (r["repeat"] or d[r["id"]] == 0) and pref(r["id"], S, d) < 900]
        if not avail: break
        r = min(avail, key=lambda r: pref(r["id"], S, d))
        r["apply"](S, d); d[r["id"]] += 1; t += r["len"]
        if d[r["id"]] == 1: log.append((round(t / 60, 1), r["id"]))
        if d["foundation"]: break
    return log, S, t, d


def route(prefs, avoid=()):
    order = {k: i for i, k in enumerate(prefs)}
    def pref(id, S, d):
        if id in avoid: return 999
        if id == "sort_herbs": return 799 if (d["sort_herbs"] < 3 or (S["herbs"] < 10 and S["qs"] < 1)) else 802
        if id == "mill_work": return 800
        if id == "gather_herbs": return 798 if S["herbs"] < 10 else 999
        return order.get(id, 500)
    return pref


ROUTES = {
    "channel-only": (["foundation", "coin_pouch", "jade_slip", "fragment_notes", "breath_gathering", "field_kit", "channel_observe",
                      "clear_channel", "channel_arrangement", "channel_exercise", "cut_timber", "herb_rack", "fernhollow_observe"],
                     ("sit_fernhollow", "steady_attention", "practice_mat", "lean_to", "shu_reading")),
    "hollow-only": (["foundation", "coin_pouch", "jade_slip", "breath_gathering", "fragment_notes", "fernhollow_observe", "sit_fernhollow",
                     "steady_attention", "practice_mat", "shu_reading", "channel_observe"],
                    ("clear_channel", "channel_arrangement", "channel_exercise", "field_kit", "cut_timber", "herb_rack", "lean_to")),
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--real-json", action="store_true", help="also compare both route preferences against the real TypeScript engine")
    args = parser.parse_args()
    fails = []
    baseline_seconds = {}
    for name, (prefs, avoid) in ROUTES.items():
        R, S0, supporting = records()
        log, S, t, d = simulate(R, S0, route(prefs, avoid))
        baseline_seconds[name] = t
        ok = d["foundation"] > 0 and S["circ"] >= 2
        print(f"{name}: foundation={'YES' if d['foundation'] else 'NO'} at {t/60:.1f} min | circ/qs/lore={S['circ']}/{S['qs']}/{S['lore']} "
              f"| supporting={supporting(S, d)}/4 | mill={d['mill_work']} sort={d['sort_herbs']} | used space={S['used']}")
        print("   ", " -> ".join(f"{m}m {i}" for m, i in log))
        if not ok: fails.append(name)
        if t / 60 > 45: fails.append(f"{name}: over 45 min")
    # core-skippable check: with no Circulation practice available, Foundation must be unreachable
    R, S0, _ = records()
    R = [r for r in R if r["id"] not in ("channel_exercise", "steady_attention")]
    log, S, t, d = simulate(R, S0, route(ROUTES["channel-only"][0], ()))
    if d["foundation"]: fails.append("core skippable: Foundation reached without Circulation practice")
    if args.real_json:
        root = pathlib.Path(__file__).resolve().parents[2]
        try:
            result = subprocess.run(["bun", "scripts/routes.ts", "--json"], cwd=root, text=True, capture_output=True, timeout=120)
            measured = json.loads(result.stdout)
            names = {item["name"] for item in measured}
            if names != set(ROUTES): fails.append(f"real JSON route set differs: {sorted(names)}")
            for item in measured:
                seconds = item["foundationSeconds"]
                if not item["success"] or seconds is None:
                    fails.append(f"real JSON {item['name']}: Foundation unreachable ({item['reason']})")
                    continue
                delta = (seconds - baseline_seconds[item["name"]]) / 60
                print(f"real JSON {item['name']}: {seconds / 60:.2f} min ({delta:+.2f} vs historical approximation); "
                      f"{len(item['unlocks'])} unlocks; {len(item['unknownRaiserLog'])} unknown-raiser cap lines")
                if seconds > 2700: fails.append(f"real JSON {item['name']}: over 45 min")
                if item["levels"].get("circulation", 0) < 2: fails.append(f"real JSON {item['name']}: mandatory core absent")
            if result.returncode: fails.append(f"real JSON runner exit {result.returncode}: {result.stderr.strip()}")
        except (OSError, ValueError, KeyError, subprocess.TimeoutExpired) as error:
            fails.append(f"real JSON comparison failed: {error}")
    print("FAIL: " + "; ".join(fails) if fails else "OK"); sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
