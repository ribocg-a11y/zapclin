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
- **Repo `zapclin` (`site/index.html`):** `@graph` com WebSite + LocalBusiness + OfferCatalog + FAQPage
- **Live `www.zapclinslz.com`:** só LocalBusiness simples — **FAQ/OfferCatalog ainda não publicados no domínio**
- Ação: sincronizar head/schema do pacote no repo `zapclinslz` e republicar Pages

### O que o humano confere agora (logado)
1. GSC → Inspeção de URL `https://www.zapclinslz.com/` (ainda “no Google”?)
2. Bing Webmaster → URL Inspection (saiu de “Discovered but not crawled”?)
3. No celular (fora VPN/incognito de datacenter): `site:www.zapclinslz.com`
