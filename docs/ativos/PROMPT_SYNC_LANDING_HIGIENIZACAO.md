# Prompt — publicar landing de higienização (zapclinslz)

Cole no Cloud Agent do repo `ribocg-a11y/zapclinslz` (branch `main`):

```text
Tarefa: publicar a landing de relevância local da ZapClin no domínio www.zapclinslz.com.

Fonte: repo ribocg-a11y/zapclin, branch cursor/seo-avancado-entity-c633 (ou main após merge), pasta site/zapclinslz-sync/

Copiar/sobrescrever na RAIZ do zapclinslz:
1) site/zapclinslz-sync/higienizacao-de-capacetes-sao-luis/index.html
   → higienizacao-de-capacetes-sao-luis/index.html  (criar pasta)
2) site/zapclinslz-sync/index.html → index.html  (ganhou link interno no nav/footer)
3) site/zapclinslz-sync/sitemap.xml → sitemap.xml  (2 URLs)
4) site/zapclinslz-sync/llms.txt → llms.txt

Regras:
- NÃO mexer em SW/PWA/GAS
- Preservar assets/, BingSiteAuth.xml, google*.html, CNAME, chave IndexNow
- Paths na raiz (/assets, /styles.css) — nunca /zapclin/site/
- Commit + push main
- Depois do deploy, IndexNow nas DUAS URLs:

KEY=0bbacc4983f5ad29f11a4d5b29e06e62
curl -sS -X POST https://api.indexnow.org/indexnow -H 'Content-Type: application/json; charset=utf-8' -d "{\"host\":\"www.zapclinslz.com\",\"key\":\"$KEY\",\"keyLocation\":\"https://www.zapclinslz.com/$KEY.txt\",\"urlList\":[\"https://www.zapclinslz.com/\",\"https://www.zapclinslz.com/higienizacao-de-capacetes-sao-luis/\"]}"
curl -sS -X POST https://www.bing.com/indexnow -H 'Content-Type: application/json; charset=utf-8' -d "{\"host\":\"www.zapclinslz.com\",\"key\":\"$KEY\",\"keyLocation\":\"https://www.zapclinslz.com/$KEY.txt\",\"urlList\":[\"https://www.zapclinslz.com/\",\"https://www.zapclinslz.com/higienizacao-de-capacetes-sao-luis/\"]}"

Validar:
curl -sI https://www.zapclinslz.com/higienizacao-de-capacetes-sao-luis/ | head
curl -sS https://www.zapclinslz.com/higienizacao-de-capacetes-sao-luis/ | grep -E 'Higienização de capacetes|FAQPage|Service' | head

Commit: seo: landing higienização de capacetes em São Luís + sitemap
```
