#!/usr/bin/env python3
"""Internal PageRank over zapclinslz-sync HTML anchors."""
from __future__ import annotations

import json
import re
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse

SYNC = Path(__file__).resolve().parents[3] / "site" / "zapclinslz-sync"
HOST = "https://www.zapclinslz.com"


class AnchorParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.hrefs: list[str] = []

    def handle_starttag(self, tag, attrs):
        if tag != "a":
            return
        href = dict(attrs).get("href")
        if href:
            self.hrefs.append(href)


def list_pages() -> dict[str, Path]:
    pages = {}
    for p in SYNC.rglob("index.html"):
        rel = p.relative_to(SYNC).as_posix()
        if rel == "index.html":
            path = "/"
        else:
            path = "/" + rel[: -len("index.html")]
            if not path.endswith("/"):
                path += "/"
        pages[path] = p
    return pages


def normalize(href: str, base_path: str) -> str | None:
    if href.startswith("#") or href.startswith("mailto:") or href.startswith("tel:"):
        return None
    if href.startswith("http"):
        u = urlparse(href)
        if u.netloc not in ("www.zapclinslz.com", "zapclinslz.com"):
            return None
        path = u.path or "/"
    else:
        path = urljoin(base_path, href)
        path = urlparse(path).path or "/"
    if not path.endswith("/") and "." not in path.split("/")[-1]:
        path += "/"
    if path == "":
        path = "/"
    return path


def build_graph(pages: dict[str, Path]) -> dict[str, set[str]]:
    g: dict[str, set[str]] = {p: set() for p in pages}
    for path, file in pages.items():
        html = file.read_text(encoding="utf-8", errors="ignore")
        parser = AnchorParser()
        parser.feed(html)
        for href in parser.hrefs:
            tgt = normalize(href, path)
            if tgt and tgt in pages and tgt != path:
                g[path].add(tgt)
    return g


def pagerank(graph: dict[str, set[str]], d: float = 0.85, iters: int = 80) -> dict[str, float]:
    nodes = list(graph)
    n = len(nodes)
    if n == 0:
        return {}
    pr = {u: 1.0 / n for u in nodes}
    for _ in range(iters):
        new = {u: (1 - d) / n for u in nodes}
        for u in nodes:
            outs = graph[u]
            if not outs:
                share = d * pr[u] / n
                for v in nodes:
                    new[v] += share
            else:
                share = d * pr[u] / len(outs)
                for v in outs:
                    new[v] += share
        pr = new
    s = sum(pr.values()) or 1.0
    return {u: pr[u] / s for u in nodes}


def weak_edges(graph: dict[str, set[str]], pr: dict[str, float], top_need: int = 5) -> list[dict]:
    """Suggest links from high-PR hubs to low-PR money pages with few inlinks."""
    indeg = defaultdict(int)
    for u, outs in graph.items():
        for v in outs:
            indeg[v] += 1
    money = [p for p in graph if p != "/" and "higien" in p or "preco" in p or "quanto" in p or "como" in p]
    money = [p for p in graph if p != "/"]
    ranked_need = sorted(money, key=lambda p: (indeg[p], pr.get(p, 0)))
    hubs = sorted(graph, key=lambda p: pr.get(p, 0), reverse=True)[:4]
    suggestions = []
    for target in ranked_need[:top_need]:
        for hub in hubs:
            if target not in graph[hub] and hub != target:
                suggestions.append(
                    {
                        "from": hub,
                        "to": target,
                        "reason": f"hub_pr={pr[hub]:.4f} target_in={indeg[target]} target_pr={pr[target]:.4f}",
                    }
                )
                break
    return suggestions


def run() -> dict:
    pages = list_pages()
    graph = build_graph(pages)
    pr = pagerank(graph)
    ranked = sorted(pr.items(), key=lambda x: -x[1])
    indeg = defaultdict(int)
    for outs in graph.values():
        for v in outs:
            indeg[v] += 1
    return {
        "pages": len(pages),
        "edges": sum(len(v) for v in graph.values()),
        "pagerank": [{ "path": p, "pr": round(s, 6), "inlinks": indeg[p], "outlinks": len(graph[p]) } for p, s in ranked],
        "link_suggestions": weak_edges(graph, pr),
        "graph": {k: sorted(v) for k, v in graph.items()},
    }


if __name__ == "__main__":
    print(json.dumps(run(), ensure_ascii=False, indent=2))
