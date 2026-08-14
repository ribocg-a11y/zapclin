# Prompt — sync SEO avançado no repo `zapclinslz`

**Cole isto** num Cloud Agent / chat do repo `ribocg-a11y/zapclinslz` (branch `main`).

---

## Tarefa

Publicar no domínio `https://www.zapclinslz.com/` o pacote SEO avançado já preparado em:

`ribocg-a11y/zapclin` → pasta `site/zapclinslz-sync/`

(branch de referência: `cursor/seo-avancado-entity-c633` ou `main` após merge)

### Arquivos a copiar para a **raiz** do `zapclinslz` (sobrescrever)

| Origem (`zapclin`) | Destino (`zapclinslz` raiz) |
|--------------------|----------------------------|
| `site/zapclinslz-sync/index.html` | `index.html` |
| `site/zapclinslz-sync/robots.txt` | `robots.txt` |
| `site/zapclinslz-sync/sitemap.xml` | `sitemap.xml` |
| `site/zapclinslz-sync/llms.txt` | `llms.txt` |
| `site/zapclinslz-sync/0bbacc4983f5ad29f11a4d5b29e06e62.txt` | manter igual (já deve existir) |

### Regras obrigatórias

1. **NÃO** alterar Service Worker / PWA / Apps Script (este repo é só marketing).
2. Paths devem continuar na raiz: `/assets/...`, `/styles.css`, `/main.js` — **nunca** `/zapclin/site/`.
3. **Preservar** arquivos de verificação: `BingSiteAuth.xml`, `google33df99b32030e825.html`, `CNAME` (se existir).
4. **Preservar** imagens em `assets/` (hero, extra-chuva, logos, etc.) — o sync não as substitui.
5. Confirmar que `index.html` contém JSON-LD com `@graph` + `WebSite` + `LocalBusiness`/`Store` + `FAQPage` + `OfferCatalog`.
6. Commit + push em `main` (Pages na raiz).
7. Depois do deploy, rodar IndexNow:

```bash
KEY=0bbacc4983f5ad29f11a4d5b29e06e62
curl -sS -X POST https://api.indexnow.org/indexnow \
  -H 'Content-Type: application/json; charset=utf-8' \
  -d "{\"host\":\"www.zapclinslz.com\",\"key\":\"$KEY\",\"keyLocation\":\"https://www.zapclinslz.com/$KEY.txt\",\"urlList\":[\"https://www.zapclinslz.com/\"]}"
curl -sS -X POST https://www.bing.com/indexnow \
  -H 'Content-Type: application/json; charset=utf-8' \
  -d "{\"host\":\"www.zapclinslz.com\",\"key\":\"$KEY\",\"keyLocation\":\"https://www.zapclinslz.com/$KEY.txt\",\"urlList\":[\"https://www.zapclinslz.com/\"]}"
```

### Validação pós-deploy

```bash
curl -sS https://www.zapclinslz.com/ | grep -E '@graph|FAQPage|OfferCatalog|og:site_name' | head
curl -sS https://www.zapclinslz.com/sitemap.xml
```

Esperado: `@graph`, `FAQPage`, `OfferCatalog` presentes; sitemap `lastmod` 2026-08-10.

### Commit message sugerida

```text
seo: publica @graph FAQ+offers e reforça meta/IndexNow no domínio
```

---

## Contexto (por que)

- Google já indexou e rankeia marca/local bem.
- Live ainda tinha só `LocalBusiness` simples; o pacote avançado estava no `zapclin` e não no domínio.
- Bing segue “Discovered but not crawled” — IndexNow após o deploy ajuda o crawl; não força ranking.
