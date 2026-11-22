"""Static manifest census; does not execute the game or prove reachability."""
import collections
import json
import sys
from pathlib import Path

if len(sys.argv) != 2:
    raise SystemExit('Usage: python3 count-content.py /path/to/arcanum-checkout')
ROOT = Path(sys.argv[1]).resolve()
DATA = ROOT / 'data'
manifest = json.loads((DATA / 'modules.json').read_text())
main = collections.defaultdict(list)
hall = collections.defaultdict(list)
files = []

for source, names in manifest.items():
    for name in names:
        path = DATA / ('modules' if source == 'modules' else '') / (name + '.json')
        files.append(path)
        obj = json.loads(path.read_text())
        lists = {name: obj} if isinstance(obj, list) else {'hall': obj} if name == 'hall' else obj['data']
        for category, records in lists.items():
            if category == 'hall':
                for hcategory, hrecords in records.get('data', records).items():
                    if isinstance(hrecords, list):
                        hall[hcategory].extend(hrecords)
            elif isinstance(records, list):
                main[category].extend(records)

counts = lambda lists: {category: len(records) for category, records in sorted(lists.items())}
duplicates = lambda lists: {key: n for key, n in collections.Counter(record['id'] for records in lists.values() for record in records).items() if n > 1}
title_path = DATA / 'titles.json'
titles = json.loads(title_path.read_text())
result = {
    'scope': 'Files in data/modules.json, plus separately loaded data/titles.json; nested hall lists counted separately. Counts include support/internal/unused records. Runtime reachability not proven.',
    'core_files': len(manifest['core']),
    'module_files': len(manifest['modules']),
    'manifest': manifest,
    'source_bytes': sum(path.stat().st_size for path in files),
    'source_lines': sum(len(path.read_text().splitlines()) for path in files),
    'main_counts': counts(main),
    'hall_counts': counts(hall),
    'main_total': sum(map(len, main.values())),
    'hall_total': sum(map(len, hall.values())),
    'manifest_total': sum(map(len, main.values())) + sum(map(len, hall.values())),
    'supplemental_titles': {
        'path': 'data/titles.json',
        'loader': 'src/chars/title.js:6-15, called by src/game.js:146',
        'title_templates': len(titles),
        'authored_pair_combinations': sum(len(title.get('combo', {})) for title in titles.values()),
        'note': 'The loader mirrors pair combinations. The 36 authored combinations are nested under 9 templates and not added again to record totals.'
    },
    'standard_bootstrap_top_level_records': sum(map(len, main.values())) + sum(map(len, hall.values())) + len(titles),
    'standard_bootstrap_source_bytes': sum(path.stat().st_size for path in files) + title_path.stat().st_size,
    'standard_bootstrap_source_lines': sum(len(path.read_text().splitlines()) for path in files) + len(title_path.read_text().splitlines()),
    'main_duplicate_ids': duplicates(main),
    'hall_duplicate_ids': duplicates(hall),
    'class_tier_counts': dict(sorted(collections.Counter(tag for record in main['classes'] for tag in record.get('tags', '').split(',') if tag.startswith('t_tier')).items())),
    'tier_quest_counts': dict(sorted(collections.Counter(tag for record in main['quests'] for tag in record.get('tags', '').split(',') if tag.startswith('t') and tag.endswith('quest')).items())),
    'explicit_unused': {category: [record['id'] for record in records if record.get('unused')] for category, records in main.items() if any(record.get('unused') for record in records)},
    'caveats': [
        'Static data-definition counts, not counts of player-visible or reachable content.',
        '75 main class records include apprentice, four jobs, and two explicitly deprecated classes; 70 have tier tags and 68 of those are not marked deprecated.',
        '295 spell records include enemy abilities and very-high-gated entries; 331 monster records include summons and companions.',
        'resourcesUnused in main data and upgrades_unused in Hall data each contain one record; neither category is instantiated by initInstance.',
        'Tags, stats, events, and glossary records are included in totals. Narrative entries can be split across records.',
        'Main lists have no duplicate IDs. Hall contains fazbitjolliness twice, once in upgrades and once in upgrades_unused; the unused list is not instantiated, while this raw census retains both records.',
        'Data may contain unused flags, hidden records, placeholder thresholds, and compatibility entries. No complete reachability analysis or long playthrough was performed.',
        'T7 event and Hall pillar class exist, but pillar class requires planeslore>=999; ordinary T7 progression is not established.',
        'Titles are loaded separately from the manifest and counted separately. Eleven remaining JSON files are absent from the inspected standard bootstrap.'
    ],
    'json_files_not_in_manifest': sorted(str(path.relative_to(DATA)) for path in DATA.rglob('*.json') if path not in files and path.name != 'modules.json'),
    'json_files_not_in_standard_bootstrap': sorted(str(path.relative_to(DATA)) for path in DATA.rglob('*.json') if path not in files and path.name not in ('modules.json', 'titles.json')),
    'evidence_files': [str(path.relative_to(ROOT)) for path in files] + ['data/titles.json', 'src/chars/title.js', 'src/game.js'],
}
print(json.dumps(result, indent=2))
