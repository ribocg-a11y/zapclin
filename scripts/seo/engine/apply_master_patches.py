#!/usr/bin/env python3
"""Apply high-impact patches: PageRank link injections + CTR title lifts + local factory."""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
SYNC = ROOT / "site" / "zapclinslz-sync"


def load(mod: str) -> dict:
    p = subprocess.run([sys.executable, str(HERE / mod)], capture_output=True, text=True, check=True)
    return json.loads(p.stdout)


def inject_footer_links(html: str, targets: list[str]) -> str:
    """Ensure targets appear as footer links if missing."""
    missing = [t for t in targets if t not in html]
    if not missing:
        return html
    block = " · ".join(f'<a href="{t}">{t.strip("/").split("/")[-1].replace("-", " ")[:28]}</a>' for t in missing)
    # prefer existing tiny footer paragraph
    if '<p class="tiny">' in html:
        html = html.replace('<p class="tiny">', f'<p class="tiny">{block} · ', 1)
        return html
    if "</footer>" in html:
        return html.replace(
            "</footer>",
            f'<div class="wrap"><p class="tiny">{block}</p></div></footer>',
            1,
        )
    return html


def apply_title(html: str, new_title: str) -> str:
    return re.sub(r"<title>.*?</title>", f"<title>{new_title}</title>", html, count=1, flags=re.I | re.S)


def path_file(path: str) -> Path:
    if path == "/":
        return SYNC / "index.html"
    return SYNC / path.strip("/") / "index.html"


def update_sitemap(urls: list[str]):
    sm = SYNC / "sitemap.xml"
    existing = sm.read_text(encoding="utf-8") if sm.exists() else ""
    locs = set(re.findall(r"<loc>(.*?)</loc>", existing))
    for u in urls:
        locs.add(u)
    body = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    # stable priority: home first
    ordered = sorted(locs, key=lambda u: (0 if u.rstrip("/") == "https://www.zapclinslz.com" else 1, u))
    for i, u in enumerate(ordered):
        pri = "1.0" if i == 0 else ("0.9" if "higienizacao-de-capacetes-sao-luis" in u else "0.8")
        body += [
            "  <url>",
            f"    <loc>{u}</loc>",
            "    <lastmod>2026-08-11</lastmod>",
            "    <changefreq>weekly</changefreq>",
            f"    <priority>{pri}</priority>",
            "  </url>",
        ]
    body.append("</urlset>")
    sm.write_text("\n".join(body) + "\n", encoding="utf-8")
    (ROOT / "site" / "sitemap.xml").write_text(sm.read_text(encoding="utf-8"), encoding="utf-8")


def main():
    pr = load("internal_pagerank.py")
    ctr = load("ctr_lab.py")

    # M1 — inject up to 5 suggestions onto hub pages
    changed = []
    for sug in pr.get("link_suggestions", [])[:5]:
        f = path_file(sug["from"])
        if not f.exists():
            continue
        html = f.read_text(encoding="utf-8")
        new = inject_footer_links(html, [sug["to"]])
        if new != html:
            f.write_text(new, encoding="utf-8")
            changed.append({"type": "link", **sug})

    # M6 — apply title if lift >= 8 and São Luís or ZapClin kept
    for row in ctr.get("pages", []):
        if row.get("lift", 0) < 8:
            continue
        best = row["best_candidate"]["title"]
        if "ZapClin" not in best and "São Luís" not in best:
            continue
        f = path_file(row["path"])
        html = f.read_text(encoding="utf-8")
        new = apply_title(html, best)
        if new != html:
            f.write_text(new, encoding="utf-8")
            changed.append({"type": "title", "path": row["path"], "title": best, "lift": row["lift"]})

    # M8 — write local modifiers
    fac = subprocess.run(
        [sys.executable, str(HERE / "local_modifier_factory.py"), "--write"],
        capture_output=True,
        text=True,
        check=True,
    )
    factory = json.loads(fac.stdout)
    urls = [c["url"] for c in factory.get("created", [])]
    if urls:
        # also keep previous 7
        base = [
            "https://www.zapclinslz.com/",
            "https://www.zapclinslz.com/higienizacao-de-capacetes-sao-luis/",
            "https://www.zapclinslz.com/preco-higienizacao-capacete-sao-luis/",
            "https://www.zapclinslz.com/quanto-tempo-higienizar-capacete/",
            "https://www.zapclinslz.com/como-higienizar-capacete/",
            "https://www.zapclinslz.com/higienizacao-vs-lavagem-capacete/",
            "https://www.zapclinslz.com/higienizacao-capacete-calhau-golden-shopping/",
        ]
        update_sitemap(base + urls)
        # llms append
        llms = SYNC / "llms.txt"
        t = llms.read_text(encoding="utf-8")
        for c in factory["created"]:
            line = f"- [Higienização em {c['bairro']}]({c['url']})"
            if line not in t:
                t = t.replace("## Contato e redes", line + "\n\n## Contato e redes")
        llms.write_text(t, encoding="utf-8")
        (ROOT / "site" / "llms.txt").write_text(t, encoding="utf-8")

    lint = subprocess.run([sys.executable, str(HERE / "schema_lint.py")], capture_output=True, text=True)
    lint_j = json.loads(lint.stdout) if lint.stdout else {"ok": False}

    out = {"changed": changed, "factory": factory, "schema_ok": lint_j.get("ok"), "schema": lint_j}
    print(json.dumps(out, ensure_ascii=False, indent=2))
    # re-run master report
    subprocess.run([sys.executable, str(HERE / "run_master.py")], check=False)


if __name__ == "__main__":
    main()
