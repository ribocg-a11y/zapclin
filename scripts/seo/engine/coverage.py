#!/usr/bin/env python3
"""Query coverage scoring against sync HTML corpus."""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SYNC = ROOT / "site" / "zapclinslz-sync"
GRAPH = Path(__file__).with_name("query_graph.json")


def norm(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", s.lower()).strip()


def corpus() -> str:
    parts = []
    for p in SYNC.rglob("*.html"):
        parts.append(p.read_text(encoding="utf-8", errors="ignore"))
    for p in SYNC.rglob("llms.txt"):
        parts.append(p.read_text(encoding="utf-8", errors="ignore"))
    return norm("\n".join(parts))


def token_hits(query: str, text: str) -> float:
    toks = [t for t in re.split(r"[^a-z0-9]+", norm(query)) if len(t) > 2]
    if not toks:
        return 0.0
    hit = sum(1 for t in toks if t in text)
    return hit / len(toks)


def path_exists(path: str) -> bool:
    if path == "/":
        return (SYNC / "index.html").exists()
    rel = path.strip("/") + "/index.html"
    return (SYNC / rel).exists()


def run() -> dict:
    cfg = json.loads(GRAPH.read_text(encoding="utf-8"))
    text = corpus()
    clusters = []
    for c in cfg["clusters"]:
        paths_ok = [p for p in c.get("target_paths", []) if path_exists(p)]
        q_scores = []
        for q in c["queries"]:
            q_scores.append({"query": q, "token_coverage": round(token_hits(q, text), 3)})
        avg = sum(x["token_coverage"] for x in q_scores) / max(1, len(q_scores))
        path_bonus = 0.35 if paths_ok else 0.0
        coverage = min(1.0, avg * 0.65 + path_bonus + (0.15 if avg > 0.7 else 0))
        gap = max(0.0, 1.0 - coverage)
        priority = round(c["value"] * gap, 2)
        clusters.append(
            {
                "id": c["id"],
                "intent": c["intent"],
                "value": c["value"],
                "coverage": round(coverage * 100, 1),
                "gap_priority": priority,
                "paths_present": paths_ok,
                "paths_missing": [p for p in c.get("target_paths", []) if p not in paths_ok],
                "factory": c.get("factory"),
                "seeds": c.get("seeds", []),
                "queries": q_scores,
                "action": (
                    "maintain"
                    if coverage >= 0.75
                    else ("factory_local_modifier" if c.get("factory") == "local_modifier" else "strengthen_content")
                ),
            }
        )
    clusters.sort(key=lambda x: -x["gap_priority"])
    return {"clusters": clusters, "top_gaps": clusters[:5]}


if __name__ == "__main__":
    print(json.dumps(run(), ensure_ascii=False, indent=2))
