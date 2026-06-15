#!/usr/bin/env python3
"""
Fetches citation stats from Google Scholar and writes them to
assets/scholar-stats.json. Run by the GitHub Action daily.
"""
import json
import sys
from datetime import date

SCHOLAR_ID = "q4ARDFIAAAAJ"

try:
    from scholarly import scholarly

    author = scholarly.search_author_id(SCHOLAR_ID)
    author = scholarly.fill(author, sections=["basics", "indices", "counts"])

    stats = {
        "publications": len(author.get("publications", [])),
        "citations":    author.get("citedby", 0),
        "hindex":       author.get("hindex", 0),
        "updated":      str(date.today()),
    }
    print(f"Fetched stats: {stats}")

except Exception as exc:
    print(f"WARNING: Could not fetch Scholar stats — {exc}", file=sys.stderr)

    # Fall back to whatever is already in the file, just bump the date
    try:
        with open("assets/scholar-stats.json") as f:
            stats = json.load(f)
        stats["updated"] = str(date.today())
        stats["fetch_error"] = str(exc)
    except Exception:
        stats = {
            "publications": 4,
            "citations":    1,
            "updated":      str(date.today()),
            "fetch_error":  str(exc),
        }

with open("assets/scholar-stats.json", "w") as f:
    json.dump(stats, f, indent=2)
    f.write("\n")

print("Wrote assets/scholar-stats.json")
