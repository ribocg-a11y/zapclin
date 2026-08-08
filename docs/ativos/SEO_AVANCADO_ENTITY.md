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
