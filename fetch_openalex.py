#!/usr/bin/env python3
"""
Refresh citation counts, abstracts and open-access flags from OpenAlex.

Reads  publications.json
Writes publications.json  (only the fields: c, ab, oa) and meta.json

Curated fields (title, authors, topics, methods, journal) are NEVER touched --
you own those; OpenAlex only supplies the numbers.

Run:  python fetch_openalex.py
"""
import json, os, sys, time, urllib.request, urllib.parse
from datetime import date

ORCID = "0000-0003-3413-9062"
MAILTO = "32329117@fsv.cuni.cz"          # polite pool -> faster, higher rate limit
ROOT = os.path.dirname(os.path.abspath(__file__))
PUBS = os.path.join(ROOT, "publications.json")
META = os.path.join(ROOT, "meta.json")


def get(url, tries=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": f"vranka-site/1.0 (mailto:{MAILTO})"})
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            if i == tries - 1:
                raise
            print(f"  retry {i+1} after error: {e}", file=sys.stderr)
            time.sleep(5 * (i + 1))


def reconstruct(inv, limit=650):
    """OpenAlex stores abstracts as an inverted index; rebuild the text."""
    if not inv:
        return ""
    pos = []
    for word, places in inv.items():
        for p in places:
            pos.append((p, word))
    pos.sort()
    s = " ".join(w for _, w in pos)
    if len(s) > limit:
        s = s[:limit].rsplit(" ", 1)[0] + "…"
    return s


def fetch_works():
    """All works for the ORCID, paged."""
    out, cursor = {}, "*"
    fields = "doi,title,publication_year,cited_by_count,open_access,abstract_inverted_index,primary_location"
    while cursor:
        url = ("https://api.openalex.org/works?"
               + urllib.parse.urlencode({
                   "filter": f"author.orcid:{ORCID}",
                   "per-page": 200,
                   "cursor": cursor,
                   "select": fields,
                   "mailto": MAILTO,
               }))
        j = get(url)
        for w in j.get("results", []):
            doi = (w.get("doi") or "").replace("https://doi.org/", "").lower()
            if not doi:
                continue
            # keep the record with the most citations if a DOI repeats
            prev = out.get(doi)
            if prev and prev["c"] >= (w.get("cited_by_count") or 0):
                continue
            out[doi] = {
                "c": w.get("cited_by_count") or 0,
                "ab": reconstruct(w.get("abstract_inverted_index")),
                "oa": bool((w.get("open_access") or {}).get("is_oa")),
            }
        cursor = (j.get("meta") or {}).get("next_cursor")
        if not j.get("results"):
            break
    return out


def main():
    pubs = json.load(open(PUBS, encoding="utf-8"))
    print(f"Local publications: {len(pubs)}")

    live = fetch_works()
    print(f"OpenAlex works with DOI: {len(live)}")

    matched = changed = 0
    for p in pubs:
        doi = (p.get("doi") or "").lower()
        if not doi or doi not in live:
            continue
        matched += 1
        w = live[doi]
        if p.get("c") != w["c"]:
            print(f"  {p.get('c')} -> {w['c']}  {p['t2'][:60]}")
            changed += 1
        p["c"] = w["c"]
        p["oa"] = w["oa"]
        if w["ab"] and not p.get("ab"):      # don't overwrite a hand-edited abstract
            p["ab"] = w["ab"]

    json.dump(pubs, open(PUBS, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    total = sum(p.get("c") or 0 for p in pubs)
    meta = {
        "updated": date.today().isoformat(),
        "matched": matched,
        "openalex_total_citations": total,
        "source": "OpenAlex",
    }
    json.dump(meta, open(META, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    print(f"Matched {matched}/{len(pubs)}; {changed} citation counts changed; sum={total}")


if __name__ == "__main__":
    main()
