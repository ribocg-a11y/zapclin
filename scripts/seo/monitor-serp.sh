#!/usr/bin/env bash
# Monitoramento leve SEO ZapClin — HTTP + sinais públicos (sem bypass de CAPTCHA Google)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="${1:-$ROOT/docs/ativos/_serp_monitor_last.txt}"
DATE_UTC="$(date -u +"%Y-%m-%d %H:%M UTC")"

URLS=(
  "https://www.zapclinslz.com/"
  "https://www.zapclinslz.com/sitemap.xml"
  "https://www.zapclinslz.com/llms.txt"
  "https://www.zapclinslz.com/higienizacao-de-capacetes-sao-luis/"
  "https://www.zapclinslz.com/preco-higienizacao-capacete-sao-luis/"
  "https://www.zapclinslz.com/quanto-tempo-higienizar-capacete/"
  "https://www.zapclinslz.com/como-higienizar-capacete/"
  "https://www.zapclinslz.com/higienizacao-vs-lavagem-capacete/"
  "https://www.zapclinslz.com/higienizacao-capacete-calhau-golden-shopping/"
  "https://www.zapclinslz.com/robots.txt"
)

{
  echo "ZapClin SEO monitor — $DATE_UTC"
  echo "================================="
  echo
  echo "## HTTP status"
  for u in "${URLS[@]}"; do
    code=$(curl -sS -o /dev/null -w "%{http_code}" -L --max-time 20 "$u" || echo "ERR")
    echo "$code  $u"
  done
  echo
  echo "## Sitemap URL count (loc)"
  curl -sS --max-time 20 "https://www.zapclinslz.com/sitemap.xml" | grep -c "<loc>" || true
  echo
  echo "## DuckDuckGo HTML (brand) — top titles (best-effort)"
  curl -sS -A "Mozilla/5.0" --max-time 25 \
    "https://html.duckduckgo.com/html/?q=ZapClin+S%C3%A3o+Lu%C3%ADs" \
    | grep -oP '(?<=class="result__a"[^>]*>)[^<]+' | head -8 || echo "(sem parse)"
  echo
  echo "## DuckDuckGo HTML (serviço) — top titles"
  curl -sS -A "Mozilla/5.0" --max-time 25 \
    "https://html.duckduckgo.com/html/?q=higieniza%C3%A7%C3%A3o+de+capacete+S%C3%A3o+Lu%C3%ADs" \
    | grep -oP '(?<=class="result__a"[^>]*>)[^<]+' | head -8 || echo "(sem parse)"
  echo
  echo "## Checklist humano"
  echo "- [ ] GSC: site: e cobertura das landings novas"
  echo "- [ ] Bing: saiu de Discovered but not crawled?"
  echo "- [ ] SERP celular guest: query serviço + brand"
  echo "- [ ] IG: Reels do pack publicados?"
} | tee "$OUT"

echo
echo "Salvo em: $OUT"
