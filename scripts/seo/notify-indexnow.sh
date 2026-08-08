#!/usr/bin/env bash
set -euo pipefail
KEY="0bbacc4983f5ad29f11a4d5b29e06e62"
payload=$(python3 - <<PY
import json
print(json.dumps({
  "host": "www.zapclinslz.com",
  "key": "$KEY",
  "keyLocation": f"https://www.zapclinslz.com/{'$KEY'}.txt".replace("'$KEY'","$KEY"),
  "urlList": ["https://www.zapclinslz.com/"]
}))
PY
)
# fix keyLocation cleanly
payload=$(python3 - <<PY
import json
key="0bbacc4983f5ad29f11a4d5b29e06e62"
print(json.dumps({
  "host": "www.zapclinslz.com",
  "key": key,
  "keyLocation": f"https://www.zapclinslz.com/{key}.txt",
  "urlList": ["https://www.zapclinslz.com/"]
}))
PY
)
echo "$payload"
for endpoint in "https://api.indexnow.org/indexnow" "https://www.bing.com/indexnow"; do
  echo "==> $endpoint"
  curl -sS -X POST "$endpoint" -H "Content-Type: application/json; charset=utf-8" -d "$payload" -w "\nHTTP:%{http_code}\n" || true
done
