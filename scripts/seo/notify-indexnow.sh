#!/usr/bin/env bash
# IndexNow multi-URL — ZapClin marketing domain
set -euo pipefail
KEY="0bbacc4983f5ad29f11a4d5b29e06e62"
HOST="www.zapclinslz.com"

DEFAULT_URLS=(
  "https://www.zapclinslz.com/"
  "https://www.zapclinslz.com/higienizacao-de-capacetes-sao-luis/"
  "https://www.zapclinslz.com/preco-higienizacao-capacete-sao-luis/"
  "https://www.zapclinslz.com/quanto-tempo-higienizar-capacete/"
  "https://www.zapclinslz.com/como-higienizar-capacete/"
  "https://www.zapclinslz.com/higienizacao-vs-lavagem-capacete/"
  "https://www.zapclinslz.com/higienizacao-capacete-calhau-golden-shopping/"
)

if [[ $# -gt 0 ]]; then
  URLS=("$@")
else
  URLS=("${DEFAULT_URLS[@]}")
fi

payload=$(python3 -c '
import json, sys
key, host = sys.argv[1], sys.argv[2]
urls = sys.argv[3:]
print(json.dumps({
  "host": host,
  "key": key,
  "keyLocation": f"https://{host}/{key}.txt",
  "urlList": urls,
}, ensure_ascii=False))
' "$KEY" "$HOST" "${URLS[@]}")

echo "$payload"
for endpoint in "https://api.indexnow.org/indexnow" "https://www.bing.com/indexnow"; do
  echo "==> $endpoint"
  curl -sS -X POST "$endpoint" -H "Content-Type: application/json; charset=utf-8" -d "$payload" -w "\nHTTP:%{http_code}\n" || true
done
