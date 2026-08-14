# SEO avançado ZapClin (entity + IndexNow)

## O que foi feito
- Canonical/OG apontando para `https://www.zapclinslz.com/`
- JSON-LD `@graph`: WebSite + LocalBusiness/Store + FAQPage + OfferCatalog
- `sameAs` Instagram + domínio próprio + espelho GitHub Pages
- `llms.txt` para agentes/IA
- Chave IndexNow: `0bbacc4983f5ad29f11a4d5b29e06e62`
- Script: `scripts/seo/notify-indexnow.sh`

## Publicar no domínio
Repo `zapclinslz` (raiz):
1. Copiar head/schema do `site/index.html` (ajustar paths `/` sem `/zapclin/site/`)
2. Colocar `0bbacc4983f5ad29f11a4d5b29e06e62.txt` na raiz
3. `llms.txt`, `robots.txt`, `sitemap.xml` com URLs `www.zapclinslz.com`
4. Rodar IndexNow após deploy

## Não faz
- Não altera algoritmo do Instagram/TikTok (isso é conteúdo + engajamento)
- Não substitui Google Business Profile / avaliações

## Validação 48h (10/08/2026)

### Infra ao vivo — OK
| Check | Resultado |
|-------|-----------|
| `https://www.zapclinslz.com/` | HTTP 200 |
| Apex `zapclinslz.com` → www | 301 |
| `robots.txt` + `sitemap.xml` | OK |
| IndexNow key file | 200 + chave correta |
| `BingSiteAuth.xml` + GSC verify HTML | 200 |
| `llms.txt` | 200 |
| Canonical / OG / Twitter | apontam para www |
| JSON-LD LocalBusiness | presente (endereço Golden + tel + horários) |
| DNS www → `ribocg-a11y.github.io` | OK |
| Re-ping IndexNow (`api.indexnow.org` + `bing.com`) | **HTTP 200** |

### Busca / relevância — parcial
| Query / sinal | Resultado 10/08 |
|---------------|-----------------|
| `site:www.zapclinslz.com` (Google via API) | **0** resultados públicos |
| `site:www.zapclinslz.com` (Bing browser) | **não indexado** (falso “1 result” = `cp.beget.com`) |
| DuckDuckGo `site:` | sem resultados |
| Wayback / Common Crawl | sem captura |
| `ZapClin São Luís` / Golden / higienização | marca aparece via **LinkedIn Golden Shopping** + **GuiaPJ CNPJ** — **domínio oficial ainda não rankeia** |
| Colisão de entidade | `zapclin.com` = JáPedeAí (delivery) — confunde marca |

### Gap produção × pacote avançado
- **Repo `zapclin` (`site/index.html` + sync):** `@graph` + landings PAA no pacote `site/zapclinslz-sync/`
- **Live `www.zapclinslz.com` (até Fase B):** home + landing São Luís indexáveis; **5 landings PAA ainda precisam de sync** via [`PROMPT_SYNC_LANDINGS_PAA.md`](PROMPT_SYNC_LANDINGS_PAA.md)
- Entity sync anterior: [`PROMPT_SYNC_ZAPCLINSLZ_SEO.md`](PROMPT_SYNC_ZAPCLINSLZ_SEO.md)
- Plano passo a passo: [`PLANO_SEO_ROBUSTO_2026-08.md`](PLANO_SEO_ROBUSTO_2026-08.md)

### Landings PAA no pacote (11/08/2026)
| Path | Foco |
|------|------|
| `/preco-higienizacao-capacete-sao-luis/` | quanto custa |
| `/quanto-tempo-higienizar-capacete/` | tempos / SLA |
| `/como-higienizar-capacete/` | HowTo + processo |
| `/higienizacao-vs-lavagem-capacete/` | intenção comparativa |
| `/higienizacao-capacete-calhau-golden-shopping/` | Calhau / Golden |

### Validação 11/08/2026 (pós-publish)
- Live: 7 URLs HTTP 200 · sitemap 7 `<loc>` · commit `zapclinslz` `4dafda1`
- IndexNow: 200
- GSC: 5 landings novas na fila (“Indexação solicitada”)
- NAP sync: OK sem patch
- Baseline: `SEO_MONITOR_LOG.md`

### O que o humano faz agora
1. Fase C passo 1 — bio + Reel 01: `FASE_C_PASSO_1_INSTAGRAM.md`
2. Não re-pedir GSC/IndexNow — `CHECKLIST_ESPERA_INDEXACAO.md`
3. Depois: fila `PROMPT_HUMANO_FASE_C.md` (GBP, Golden, NAP)
