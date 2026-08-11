#!/usr/bin/env python3
"""JSON-LD + NAP lint for sync package. Exit 1 on hard failures."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SYNC = ROOT / "site" / "zapclinslz-sync"
GRAPH = Path(__file__).with_name("query_graph.json")

LD_RE = re.compile(r'<script type="application/ld\+json">\s*(.*?)\s*</script>', re.S | re.I)


def extract_ld(html: str) -> list:
    out = []
    for m in LD_RE.finditer(html):
        try:
            out.append(json.loads(m.group(1)))
        except json.JSONDecodeError as e:
            out.append({"_error": str(e)})
    return out


def walk(obj, bag: list):
    if isinstance(obj, dict):
        bag.append(obj)
        for v in obj.values():
            walk(v, bag)
    elif isinstance(obj, list):
        for i in obj:
            walk(i, bag)


def run() -> dict:
    nap = json.loads(GRAPH.read_text(encoding="utf-8"))["nap"]
    errors = []
    warnings = []
    files = 0
    for p in sorted(SYNC.rglob("index.html")):
        files += 1
        html = p.read_text(encoding="utf-8", errors="ignore")
        rel = p.relative_to(SYNC).as_posix()
        if nap["telephone"].replace("+", "") not in html.replace("+", "") and "98147" not in html:
            errors.append(f"{rel}: missing phone NAP")
        if nap["postal"] not in html and rel == "index.html":
            warnings.append(f"{rel}: CEP not found (ok on some landings)")
        if "zapclin.com" in html.lower() and "zapclinslz.com" not in html.split("zapclin.com")[0][-40:]:
            # collision mention without context — soft
            if "JáPede" not in html and "não" not in html.lower():
                warnings.append(f"{rel}: possible brand collision string zapclin.com")
        blocks = extract_ld(html)
        if not blocks:
            errors.append(f"{rel}: no JSON-LD")
            continue
        nodes = []
        for b in blocks:
            if isinstance(b, dict) and "_error" in b:
                errors.append(f"{rel}: JSON-LD parse error: {b['_error']}")
                continue
            walk(b, nodes)
        types = set()
        for n in nodes:
            t = n.get("@type")
            if isinstance(t, list):
                types.update(t)
            elif t:
                types.add(t)
            if n.get("telephone") and nap["telephone"] not in str(n.get("telephone")):
                # allow without plus variants
                if "9814719616" not in str(n.get("telephone")).replace("-", "").replace(" ", "").replace("+", ""):
                    warnings.append(f"{rel}: telephone drift in schema {n.get('telephone')}")
        if rel != "index.html" and not (types & {"Service", "HowTo", "FAQPage", "BreadcrumbList"}):
            warnings.append(f"{rel}: unexpected schema types {sorted(types)}")
        if "FAQPage" not in types and rel != "index.html":
            # landings should have FAQ
            if "FAQPage" not in types:
                errors.append(f"{rel}: missing FAQPage")
    return {
        "files": files,
        "errors": errors,
        "warnings": warnings,
        "ok": len(errors) == 0,
    }


if __name__ == "__main__":
    report = run()
    print(json.dumps(report, ensure_ascii=False, indent=2))
    sys.exit(0 if report["ok"] else 1)
