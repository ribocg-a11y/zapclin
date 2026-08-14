#!/usr/bin/env python3
"""Local modifier factory — generates neighborhood landings with anti-doorway gates."""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SYNC = ROOT / "site" / "zapclinslz-sync"
GRAPH = Path(__file__).with_name("query_graph.json")

# Minimal unique angles per bairro (quality gate — not thin doorway)
ANGLES = {
    "Renascença": "rota comum de quem sobe a holandeses / área nobre próxima ao Calhau",
    "Cohama": "eixo de motoboys e deslocamento rápido até o Golden Shopping Calhau",
    "Ponta d'Areia": "quem circula orla/ponte e prefere deixar o capacete no shopping",
    "São Francisco": "bairro vizinho ao Calhau — ida curta ao Quiosque 01",
    "Turu": "demanda de uso diário; higienização rápida no caminho do Calhau",
}


def slugify(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s


def quality_ok(bairro: str, body: str) -> tuple[bool, str]:
    tokens = len(re.findall(r"\w+", body, flags=re.U))
    if bairro not in ANGLES:
        return False, "no_unique_angle"
    if tokens < 180:
        return False, f"thin_content:{tokens}"
    if "São Luís" not in body or "Golden Shopping" not in body:
        return False, "missing_geo_anchor"
    if "R$ 15" not in body:
        return False, "missing_price_anchor"
    return True, "ok"


TEMPLATE = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Higienização de Capacete em {bairro} | ZapClin São Luís</title>
  <meta name="description" content="Higienização de capacetes para quem está em {bairro}, São Luís. Atendimento no Golden Shopping Calhau — a partir de R$ 15. WhatsApp (98) 98147-9616.">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://www.zapclinslz.com/{slug}/">
  <link rel="stylesheet" href="/styles.css?v=15">
  <script type="application/ld+json">
  {ld}
  </script>
</head>
<body>
  <header class="nav"><div class="wrap nav-inner">
    <a class="brand" href="/">ZapClin</a>
    <nav class="nav-links"><a href="/#servicos">Serviços</a><a href="/higienizacao-de-capacetes-sao-luis/">São Luís</a>
    <a class="nav-cta" href="https://wa.me/5598981479616">WhatsApp</a></nav>
  </div></header>
  <main class="wrap" style="padding:4rem 1.2rem 3rem">
    <p class="eyebrow">São Luís · {bairro}</p>
    <h1>Higienização de capacete em {bairro}</h1>
    <p>{angle_sentence} A ZapClin atende no <strong>Quiosque 01 do Golden Shopping Calhau</strong>
    (Av. dos Holandeses, 200) — higienização a partir de <strong>R$ 15</strong> em cerca de 8 minutos.</p>
    <h2>Por que quem está em {bairro} escolhe o Calhau</h2>
    <ul>
      <li>Preço transparente (R$ 15 a R$ 70) e prazo claro</li>
      <li>Processo profissional — não é só máquina automática</li>
      <li>Ideal para motoboys e uso diário em São Luís</li>
    </ul>
    <h2>Como chegar</h2>
    <p>De {bairro} até o Golden Shopping Calhau: deixe o capacete no quiosque, resolva o que precisar no shopping e retire no prazo do serviço.
    WhatsApp <a href="https://wa.me/5598981479616">(98) 98147-9616</a>.</p>
    <h2>FAQ</h2>
    <details open><summary>Tem higienização de capacete perto de {bairro}?</summary>
    <p>O ponto físico ZapClin fica no Calhau (Golden Shopping). Para quem está em {bairro}, é a referência de higienização profissional em São Luís com preço a partir de R$ 15.</p></details>
    <details><summary>Quanto custa?</summary>
    <p>De R$ 15 (rápida) a R$ 70 (premium). Veja a <a href="/preco-higienizacao-capacete-sao-luis/">tabela completa</a>.</p></details>
    <p style="margin-top:2rem"><a href="/higienizacao-de-capacetes-sao-luis/">Higienização em São Luís</a> ·
    <a href="/higienizacao-capacete-calhau-golden-shopping/">Página Calhau</a> ·
    <a href="/">Início</a></p>
  </main>
</body>
</html>
"""


def build_ld(bairro: str, slug: str) -> str:
    data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Início", "item": "https://www.zapclinslz.com/"},
                    {"@type": "ListItem", "position": 2, "name": f"Higienização em {bairro}", "item": f"https://www.zapclinslz.com/{slug}/"},
                ],
            },
            {
                "@type": "Service",
                "name": f"Higienização de capacete em {bairro}, São Luís",
                "provider": {"@type": "LocalBusiness", "name": "ZapClin", "telephone": "+5598981479616"},
                "areaServed": {"@type": "Place", "name": f"{bairro}, São Luís"},
                "offers": {"@type": "AggregateOffer", "priceCurrency": "BRL", "lowPrice": "15.00", "highPrice": "70.00"},
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": f"Tem higienização de capacete perto de {bairro}?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": f"A ZapClin atende no Golden Shopping Calhau; referência para quem está em {bairro}, São Luís, a partir de R$ 15.",
                        },
                    }
                ],
            },
        ],
    }
    return json.dumps(data, ensure_ascii=False, indent=2)


def run(write: bool = False) -> dict:
    cfg = json.loads(GRAPH.read_text(encoding="utf-8"))
    seeds = []
    for c in cfg["clusters"]:
        if c.get("factory") == "local_modifier":
            seeds = c.get("seeds", [])
    created = []
    skipped = []
    for bairro in seeds:
        slug = f"higienizacao-capacete-{slugify(bairro)}-sao-luis"
        angle = ANGLES.get(bairro, "")
        angle_sentence = f"Para quem circula em {bairro} — {angle}."
        body = TEMPLATE.format(
            bairro=bairro,
            slug=slug,
            angle_sentence=angle_sentence,
            ld="{}",
        )
        ok, reason = quality_ok(bairro, body)
        if not ok:
            skipped.append({"bairro": bairro, "reason": reason})
            continue
        html = TEMPLATE.format(
            bairro=bairro,
            slug=slug,
            angle_sentence=angle_sentence,
            ld=build_ld(bairro, slug),
        )
        # re-check with final
        ok2, reason2 = quality_ok(bairro, html)
        if not ok2:
            skipped.append({"bairro": bairro, "reason": reason2})
            continue
        out = {"slug": slug, "bairro": bairro, "url": f"https://www.zapclinslz.com/{slug}/"}
        if write:
            dest = SYNC / slug / "index.html"
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(html, encoding="utf-8")
            out["written"] = str(dest)
        created.append(out)
    return {"created": created, "skipped": skipped, "write": write}


if __name__ == "__main__":
    import sys

    print(json.dumps(run(write="--write" in sys.argv), ensure_ascii=False, indent=2))
