#!/usr/bin/env python3
"""SERP gap scorer — best-effort public HTML (DDG) + competitor class weights."""
from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

UA = "Mozilla/5.0 (compatible; ZapClinSEO/1.0; +https://www.zapclinslz.com/)"
QUERIES = [
    "higienização de capacete São Luís",
    "ZapClin São Luís",
    "higienizar capacete Golden Shopping Calhau",
    "preço higienização capacete São Luís",
]


def fetch_ddg(q: str) -> list[str]:
    url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(q)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            html = r.read().decode("utf-8", errors="ignore")
    except Exception as e:
        return [f"ERROR:{e}"]
    # result links
    titles = re.findall(r'class="result__a"[^>]*>(.*?)</a>', html, flags=re.S)
    titles = [re.sub(r"<.*?>", "", t).strip() for t in titles]
    return titles[:8]


def classify(title: str) -> str:
    t = title.lower()
    if title.startswith("ERROR:"):
        return "error"
    if "instagram" in t or "cap box" in t:
        return "instagram"
    if "zapclin" in t and "shopping" not in t:
        return "brand_site_or_mention"
    if "golden" in t or "shopping" in t:
        return "mall_citation"
    if "guia" in t or "cnpj" in t or "telelistas" in t:
        return "directory"
    if "maps" in t or "google" in t:
        return "maps"
    return "other"


def score_gap(classes: list[str]) -> dict:
    """Higher gap = our domain less present vs social/directory."""
    weights = {
        "instagram": 1.2,
        "directory": 0.9,
        "mall_citation": 0.8,
        "maps": 0.7,
        "brand_site_or_mention": -1.0,
        "other": 0.3,
        "error": 0.0,
    }
    raw = sum(weights.get(c, 0.2) for c in classes)
    our = classes.count("brand_site_or_mention")
    return {
        "gap_score": round(max(0.0, raw), 2),
        "our_hits": our,
        "dominant": max(set(classes), key=classes.count) if classes else "none",
    }


def run() -> dict:
    rows = []
    for q in QUERIES:
        titles = fetch_ddg(q)
        classes = [classify(t) for t in titles]
        g = score_gap(classes)
        rows.append({"query": q, "titles": titles, "classes": classes, **g})
    rows.sort(key=lambda x: -x["gap_score"])
    return {
        "engine": "duckduckgo_html",
        "note": "Proxy de SERP. Google real = celular humano (CAPTCHA em VM).",
        "rows": rows,
        "play": [
            "Se dominant=instagram → priorizar Reels score≥80 + bio geo (sinal social).",
            "Se dominant=mall_citation → H1 backlink Golden (autoridade local).",
            "Se our_hits=0 em query serviço → reforçar landing + internal PageRank + title CTR.",
        ],
    }


if __name__ == "__main__":
    print(json.dumps(run(), ensure_ascii=False, indent=2))
