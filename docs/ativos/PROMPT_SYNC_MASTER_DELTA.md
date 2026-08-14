# PROMPT — Sync MASTER delta → `zapclinslz`

Repo destino: **`ribocg-a11y/zapclinslz`** (domínio live).

## Copiar da branch `cursor/seo-avancado-entity-c633` do `zapclin`

Fonte: `site/zapclinslz-sync/`

### Atualizar
- `index.html` (links internos PageRank → bairros)
- `sitemap.xml` (12 URLs)
- `llms.txt`
- `higienizacao-capacete-calhau-golden-shopping/index.html`
- `preco-higienizacao-capacete-sao-luis/index.html` (title CTR lift)

### Criar pastas novas
- `higienizacao-capacete-renascenca-sao-luis/`
- `higienizacao-capacete-cohama-sao-luis/`
- `higienizacao-capacete-ponta-d-areia-sao-luis/`
- `higienizacao-capacete-sao-francisco-sao-luis/`
- `higienizacao-capacete-turu-sao-luis/`

## Pós-deploy
1. HTTP 200 em cada URL nova
2. IndexNow **só** nas URLs novas + home + calhau + preço (delta)
3. Evidência: commit SHA + lista HTTP + IndexNow codes

## Não fazer
Spam GSC · clasp · PWA
