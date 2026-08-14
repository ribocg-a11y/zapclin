#!/usr/bin/env python3
"""Content-hash freshness manifest + IndexNow delta helper."""
from __future__ import annotations

import hashlib
import json
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SYNC = ROOT / "site" / "zapclinslz-sync"
STATE = Path(__file__).with_name(".freshness_state.json")
HOST = "https://www.zapclinslz.com"


def path_to_url(p: Path) -> str:
    rel = p.relative_to(SYNC).as_posix()
    if rel == "index.html":
        return f"{HOST}/"
    if rel.endswith("/index.html"):
        return f"{HOST}/{rel[: -len('index.html')]}"
    return f"{HOST}/{rel}"


def file_hash(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()[:16]


def scan() -> dict[str, str]:
    out = {}
    for p in SYNC.rglob("*"):
        if p.is_file() and p.suffix.lower() in {".html", ".xml", ".txt"}:
            if p.name.startswith("."):
                continue
            out[path_to_url(p)] = file_hash(p)
    return out


def run(update_state: bool = False) -> dict:
    current = scan()
    prev = {}
    if STATE.exists():
        prev = json.loads(STATE.read_text(encoding="utf-8")).get("hashes", {})
    changed = sorted(u for u, h in current.items() if prev.get(u) != h)
    new = sorted(u for u in current if u not in prev)
    removed = sorted(u for u in prev if u not in current)
    report = {
        "ts": int(time.time()),
        "total": len(current),
        "changed": changed,
        "new": new,
        "removed": removed,
        "indexnow_candidates": sorted(set(changed) | set(new)),
    }
    if update_state:
        STATE.write_text(json.dumps({"hashes": current, "ts": report["ts"]}, indent=2), encoding="utf-8")
    return report


if __name__ == "__main__":
    import sys

    upd = "--update" in sys.argv
    print(json.dumps(run(update_state=upd), ensure_ascii=False, indent=2))
