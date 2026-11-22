# sources/

## wiki-dump-2026-11-19.json

Every page of the Magic Research 2 fandom wiki (https://magic-research-2.fandom.com/), taken on 2026-11-19 (US Eastern; the file's own `fetched` timestamp is UTC 2026-11-20) through the wiki's MediaWiki API from a browser, because the project shell cannot reach fandom.com.

Shape: `{"source": "https://magic-research-2.fandom.com/api.php", "fetched": ISO-8601, "pages": {title: {"ts": last-edit timestamp, "user": last editor, "text": wikitext, "cats": [categories]}}}`. 663 pages, 427 KB.

How it was made: `list=allpages` (two batches of 500), then `prop=revisions|categories&rvprop=content|timestamp|user&rvslots=main` in batches of 50 titles; the resulting object was saved as one JSON file. To refresh it, run the same two queries from a browser on the wiki's origin and replace the file; then regenerate `../data-census.md` with `../tools/census.py`.

Licence: fandom wiki text is CC BY-SA 3.0 (attribution: the Magic Research 2 Wiki contributors, https://magic-research-2.fandom.com/). Kept here as research evidence only. Nothing from it goes into `src/`.

The wiki carries no game-version labels and mixes patch eras (see `../07-patch-history-and-community.md` §5). Prefer the demo source for the first 4–8 hours and the v1.8.6 strings for wording.
