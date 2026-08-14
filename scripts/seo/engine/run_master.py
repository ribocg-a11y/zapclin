#!/usr/bin/env python3
"""Orchestrate master SEO engine → report Markdown + JSON."""
from __future__ import annotations

import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
REPORT_MD = ROOT / "docs/ativos/SEO_MASTER_REPORT.md"
REPORT_JSON = HERE / "last_master_report.json"


def run_mod(name: str, args: list[str] | None = None) -> dict:
    cmd = [sys.executable, str(HERE / name)] + (args or [])
    p = subprocess.run(cmd, capture_output=True, text=True)
    if p.returncode not in (0, 1):
        return {"ok": False, "module": name, "stderr": p.stderr[-2000:], "stdout": p.stdout[-2000:]}
    try:
        data = json.loads(p.stdout)
    except json.JSONDecodeError:
        return {"ok": False, "module": name, "raw": p.stdout[-2000:], "stderr": p.stderr[-2000:]}
    data["_exit"] = p.returncode
    data["ok"] = p.returncode == 0 or name != "schema_lint.py"
    if name == "schema_lint.py":
        data["ok"] = data.get("ok", False)
    return data


def main():
    pr = run_mod("internal_pagerank.py")
    cov = run_mod("coverage.py")
    lint = run_mod("schema_lint.py")
    fresh = run_mod("freshness.py", ["--update"])
    social = run_mod("social_signal_score.py")
    ctr = run_mod("ctr_lab.py")
    serp = run_mod("serp_gap.py")
    factory = run_mod("local_modifier_factory.py")  # dry-run first in report; write separately

    payload = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "pagerank": pr,
        "coverage": cov,
        "schema_lint": lint,
        "freshness": fresh,
        "social": social,
        "ctr_lab": ctr,
        "serp_gap": serp,
        "local_factory_dry": factory,
    }
    REPORT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    lines = []
    lines.append("# SEO Master Report — ZapClin")
    lines.append("")
    lines.append(f"**UTC:** {payload['ts']}")
    lines.append("")
    lines.append("## PageRank interno")
    if pr.get("pagerank"):
        lines.append("| Path | PR | In | Out |")
        lines.append("|------|----|----|-----|")
        for row in pr["pagerank"]:
            lines.append(f"| `{row['path']}` | {row['pr']:.4f} | {row['inlinks']} | {row['outlinks']} |")
        lines.append("")
        lines.append("### Sugestões de link")
        for s in pr.get("link_suggestions", []):
            lines.append(f"- `{s['from']}` → `{s['to']}` ({s['reason']})")
    else:
        lines.append("Falha: " + json.dumps(pr)[:500])

    lines.append("")
    lines.append("## Coverage / gaps")
    for c in (cov.get("clusters") or [])[:8]:
        lines.append(
            f"- **{c['id']}** value={c['value']} coverage={c['coverage']}% gap_priority={c['gap_priority']} → `{c['action']}`"
        )

    lines.append("")
    lines.append("## Schema lint")
    lines.append(f"- ok={lint.get('ok')} errors={len(lint.get('errors') or [])} warnings={len(lint.get('warnings') or [])}")
    for e in (lint.get("errors") or [])[:12]:
        lines.append(f"  - ERROR: {e}")
    for w in (lint.get("warnings") or [])[:8]:
        lines.append(f"  - WARN: {w}")

    lines.append("")
    lines.append("## Freshness / IndexNow candidates")
    lines.append(f"- changed={len(fresh.get('changed') or [])} new={len(fresh.get('new') or [])}")
    for u in (fresh.get("indexnow_candidates") or [])[:12]:
        lines.append(f"  - {u}")

    lines.append("")
    lines.append("## Social signal (Reel 01)")
    r = (social.get("reel_01") or {})
    lines.append(f"- score={r.get('score')} grade={r.get('grade')} pass={r.get('pass_publish_gate')} gaps={r.get('gaps')}")

    lines.append("")
    lines.append("## CTR lab (maiores lifts)")
    for row in (ctr.get("pages") or [])[:6]:
        lines.append(
            f"- `{row['path']}` lift={row['lift']} · best: {row['best_candidate']['title']} ({row['best_candidate']['score']})"
        )

    lines.append("")
    lines.append("## SERP gap (DDG proxy)")
    for row in (serp.get("rows") or [])[:6]:
        lines.append(
            f"- `{row['query']}` gap={row['gap_score']} dominant={row['dominant']} our_hits={row['our_hits']}"
        )
    for tip in serp.get("play") or []:
        lines.append(f"  - {tip}")

    lines.append("")
    lines.append("## Local modifier factory (dry-run)")
    lines.append(f"- would_create={len(factory.get('created') or [])} skipped={factory.get('skipped')}")

    lines.append("")
    lines.append("## Próximas ações MASTER (auto)")
    lines.append("1. Aplicar link suggestions PageRank (M1)")
    lines.append("2. Aplicar titles com lift≥8 (M6) preservando geo")
    lines.append("3. `--write` factory bairros se gap_priority geo_bairro_expand alto (M8)")
    lines.append("4. Schema lint exit 0 antes de sync `zapclinslz`")
    lines.append("5. IndexNow só em freshness delta após publish")

    REPORT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"report_md": str(REPORT_MD), "report_json": str(REPORT_JSON), "schema_ok": lint.get("ok")}, indent=2))


if __name__ == "__main__":
    main()
