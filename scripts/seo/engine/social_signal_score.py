#!/usr/bin/env python3
"""Score Reel/caption scripts for IG discovery proxies (not a claim of algorithm control)."""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]


def norm(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return s.lower()


def score(script: str, caption: str) -> dict:
    text = norm(script + "\n" + caption)
    checks = {
        "hook_question_or_pain": bool(re.search(r"\?|fedendo|odor|cheiro|suor", text)),
        "geo_sao_luis": "sao luis" in text or "são luís" in norm(script + caption),
        "geo_calhau_or_golden": "calhau" in text or "golden" in text,
        "price_anchor": bool(re.search(r"r\$\s*15|15 reais", text)),
        "time_anchor": bool(re.search(r"8\s*min|minutos", text)),
        "cta_whatsapp_or_bio": "whatsapp" in text or "link na bio" in text or "wa.me" in text,
        "brand_zapclin": "zapclin" in text,
        "anti_machine_only": "maquina" in text or "máquina" in norm(script + caption) or "processo" in text,
        "hashtag_geo": "#saoluis" in text.replace(" ", "") or "#saoluís" in text,
        "loop_save_share": bool(re.search(r"salva|manda|compartilha|amigo", text)),
    }
    # weights sum ~100
    weights = {
        "hook_question_or_pain": 18,
        "geo_sao_luis": 16,
        "geo_calhau_or_golden": 10,
        "price_anchor": 10,
        "time_anchor": 10,
        "cta_whatsapp_or_bio": 12,
        "brand_zapclin": 8,
        "anti_machine_only": 6,
        "hashtag_geo": 5,
        "loop_save_share": 5,
    }
    score_v = sum(weights[k] for k, ok in checks.items() if ok)
    gaps = [k for k, ok in checks.items() if not ok]
    return {
        "score": score_v,
        "grade": "A" if score_v >= 85 else "B" if score_v >= 70 else "C" if score_v >= 55 else "D",
        "checks": checks,
        "gaps": gaps,
        "pass_publish_gate": score_v >= 80,
    }


def run() -> dict:
    cap = (ROOT / "docs/ativos/marketing-ig/zapclin-reel-01-legenda.txt").read_text(encoding="utf-8")
    script = """
    Capacete fedendo? Em São Luís resolve em 8 min.
    Higienização R$ 15. Golden Shopping Calhau.
    Não é só máquina. WhatsApp. Link na bio.
    """
    return {"reel_01": score(script, cap), "threshold_publish": 80}


if __name__ == "__main__":
    print(json.dumps(run(), ensure_ascii=False, indent=2))
