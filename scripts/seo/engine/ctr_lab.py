#!/usr/bin/env python3
"""Title CTR lab — heuristic variants + scores (for GSC A/B later)."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SYNC = ROOT / "site" / "zapclinslz-sync"

TITLE_RE = re.compile(r"<title>(.*?)</title>", re.I | re.S)


def score_title(t: str) -> dict:
    n = len(t)
    s = 0
    reasons = []
    if 35 <= n <= 62:
        s += 25
        reasons.append("length_sweet")
    elif n < 35:
        s += 10
        reasons.append("short")
    else:
        s += 12
        reasons.append("long")
    if re.search(r"São Luís|Sao Luis", t, re.I):
        s += 20
        reasons.append("geo")
    if re.search(r"R\$\s*\d+|preço|min", t, re.I):
        s += 15
        reasons.append("number")
    if "|" in t or "—" in t or "-" in t:
        s += 8
        reasons.append("pipe")
    if re.search(r"ZapClin", t):
        s += 12
        reasons.append("brand")
    if re.search(r"como|quanto|onde|vs|melhor", t, re.I):
        s += 10
        reasons.append("intent_word")
    return {"title": t, "score": min(100, s), "reasons": reasons}


def variants(base: str, path: str) -> list[str]:
    # path-aware seeds
    if "preco" in path:
        return [
            "Preço Higienização de Capacete em São Luís | ZapClin",
            "Quanto Custa Higienizar Capacete em São Luís? R$15 | ZapClin",
            "Tabela de Preços — Higienização de Capacetes São Luís | ZapClin",
            base,
        ]
    if "quanto-tempo" in path:
        return [
            "Quanto Tempo Demora Higienizar Capacete? 8 Min | ZapClin São Luís",
            "Higienização de Capacete em 8 Minutos | São Luís — ZapClin",
            base,
        ]
    if "como-higienizar" in path:
        return [
            "Como Higienizar Capacete de Moto (Passo a Passo) | ZapClin São Luís",
            "Como Tirar Odor do Capacete em São Luís | Método ZapClin",
            base,
        ]
    if "calhau" in path or "golden" in path:
        return [
            "Higienização de Capacete no Calhau | Golden Shopping | ZapClin",
            "Quiosque 01 Golden Shopping Calhau — Higienização de Capacetes",
            base,
        ]
    return [
        base,
        base.replace("|", "—") if "|" in base else base + " | São Luís",
    ]


def run() -> dict:
    rows = []
    for p in sorted(SYNC.rglob("index.html")):
        html = p.read_text(encoding="utf-8", errors="ignore")
        m = TITLE_RE.search(html)
        if not m:
            continue
        cur = re.sub(r"\s+", " ", m.group(1)).strip()
        rel = "/" if p.parent == SYNC else "/" + p.parent.relative_to(SYNC).as_posix() + "/"
        opts = [score_title(t) for t in variants(cur, rel)]
        opts.sort(key=lambda x: -x["score"])
        best = opts[0]
        rows.append(
            {
                "path": rel,
                "current": score_title(cur),
                "best_candidate": best,
                "lift": best["score"] - score_title(cur)["score"],
                "all": opts,
            }
        )
    rows.sort(key=lambda x: -x["lift"])
    return {"pages": rows, "apply_policy": "Só aplicar best_candidate se lift>=8 e geo preservada."}


if __name__ == "__main__":
    print(json.dumps(run(), ensure_ascii=False, indent=2))
