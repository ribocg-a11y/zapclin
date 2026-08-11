# PROMPT — Sync landings PAA no repo `zapclinslz`

Cole este prompt no agente do repositório **`ribocg-a11y/zapclinslz`** (domínio live `www.zapclinslz.com`).

---

## Missão

Publicar o pacote SEO PAA do ZapClin na **raiz** do site (paths `/`, sem `/zapclin/site/`).

Fonte canônica no repo `zapclin` (branch `cursor/seo-avancado-entity-c633` ou main após merge):

`site/zapclinslz-sync/`

## Copiar / criar na raiz do `zapclinslz`

| Origem (`zapclin`) | Destino (`zapclinslz` raiz) |
|--------------------|-----------------------------|
| `site/zapclinslz-sync/index.html` | `/index.html` (links internos do footer/nav) |
| `site/zapclinslz-sync/sitemap.xml` | `/sitemap.xml` |
| `site/zapclinslz-sync/llms.txt` | `/llms.txt` |
| `site/zapclinslz-sync/higienizacao-de-capacetes-sao-luis/index.html` | pasta já existente — atualizar footer |
| `.../preco-higienizacao-capacete-sao-luis/index.html` | **criar pasta** |
| `.../quanto-tempo-higienizar-capacete/index.html` | **criar** |
| `.../como-higienizar-capacete/index.html` | **criar** |
| `.../higienizacao-vs-lavagem-capacete/index.html` | **criar** |
| `.../higienizacao-capacete-calhau-golden-shopping/index.html` | **criar** |

Manter `styles.css`, `main.js`, `assets/` já existentes. Se o sync trouxer `?v=15` em CSS/JS e o live estiver em outra versão de cache-bust, alinhar para a versão atual do live **ou** bump consistente.

## Não fazer

- Não criar novo Deploy GAS / não tocar PWA ZapClin operacional.
- Não inventar AggregateRating.
- Não remover IndexNow key file nem GSC/Bing verify.

## Depois do deploy Pages

1. Rodar IndexNow com todas as URLs do sitemap (no `zapclin`: `bash scripts/seo/notify-indexnow.sh`).
2. Responder com: lista de arquivos commitados + HTTP 200 das 7 URLs + resultado IndexNow.
3. Pedir ao humano: GSC → inspecionar cada URL nova → solicitar indexação.

## URLs esperadas (HTTP 200)

1. https://www.zapclinslz.com/
2. https://www.zapclinslz.com/higienizacao-de-capacetes-sao-luis/
3. https://www.zapclinslz.com/preco-higienizacao-capacete-sao-luis/
4. https://www.zapclinslz.com/quanto-tempo-higienizar-capacete/
5. https://www.zapclinslz.com/como-higienizar-capacete/
6. https://www.zapclinslz.com/higienizacao-vs-lavagem-capacete/
7. https://www.zapclinslz.com/higienizacao-capacete-calhau-golden-shopping/
8. https://www.zapclinslz.com/sitemap.xml (deve listar as 7 páginas)

---

Plano completo: `docs/ativos/PLANO_SEO_ROBUSTO_2026-08.md` no repo `zapclin`.
