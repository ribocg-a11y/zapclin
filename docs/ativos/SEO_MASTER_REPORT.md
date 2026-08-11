# SEO Master Report — ZapClin

**UTC:** 2026-08-11T20:39:45.367034+00:00

## PageRank interno
| Path | PR | In | Out |
|------|----|----|-----|
| `/` | 0.1377 | 11 | 11 |
| `/higienizacao-capacete-calhau-golden-shopping/` | 0.1377 | 11 | 11 |
| `/higienizacao-de-capacetes-sao-luis/` | 0.1300 | 11 | 6 |
| `/preco-higienizacao-capacete-sao-luis/` | 0.1300 | 11 | 6 |
| `/quanto-tempo-higienizar-capacete/` | 0.0985 | 6 | 6 |
| `/higienizacao-vs-lavagem-capacete/` | 0.0985 | 6 | 6 |
| `/como-higienizar-capacete/` | 0.0985 | 6 | 6 |
| `/higienizacao-capacete-turu-sao-luis/` | 0.0338 | 2 | 4 |
| `/higienizacao-capacete-sao-francisco-sao-luis/` | 0.0338 | 2 | 4 |
| `/higienizacao-capacete-ponta-d-areia-sao-luis/` | 0.0338 | 2 | 4 |
| `/higienizacao-capacete-renascenca-sao-luis/` | 0.0338 | 2 | 4 |
| `/higienizacao-capacete-cohama-sao-luis/` | 0.0338 | 2 | 4 |

### Sugestões de link
- `/higienizacao-de-capacetes-sao-luis/` → `/higienizacao-capacete-turu-sao-luis/` (hub_pr=0.1300 target_in=2 target_pr=0.0338)
- `/higienizacao-de-capacetes-sao-luis/` → `/higienizacao-capacete-sao-francisco-sao-luis/` (hub_pr=0.1300 target_in=2 target_pr=0.0338)
- `/higienizacao-de-capacetes-sao-luis/` → `/higienizacao-capacete-ponta-d-areia-sao-luis/` (hub_pr=0.1300 target_in=2 target_pr=0.0338)
- `/higienizacao-de-capacetes-sao-luis/` → `/higienizacao-capacete-renascenca-sao-luis/` (hub_pr=0.1300 target_in=2 target_pr=0.0338)
- `/higienizacao-de-capacetes-sao-luis/` → `/higienizacao-capacete-cohama-sao-luis/` (hub_pr=0.1300 target_in=2 target_pr=0.0338)

## Coverage / gaps
- **geo_bairro_expand** value=70 coverage=80.0% gap_priority=14.0 → `maintain`
- **local_core** value=95 coverage=100.0% gap_priority=0.0 → `maintain`
- **price** value=90 coverage=100.0% gap_priority=0.0 → `maintain`
- **time** value=85 coverage=100.0% gap_priority=0.0 → `maintain`
- **howto** value=80 coverage=100.0% gap_priority=0.0 → `maintain`
- **compare** value=78 coverage=100.0% gap_priority=0.0 → `maintain`
- **geo_calhau** value=88 coverage=100.0% gap_priority=0.0 → `maintain`
- **social_discovery** value=92 coverage=100.0% gap_priority=0.0 → `maintain`

## Schema lint
- ok=True errors=0 warnings=0

## Freshness / IndexNow candidates
- changed=2 new=0
  - https://www.zapclinslz.com/
  - https://www.zapclinslz.com/higienizacao-capacete-calhau-golden-shopping/

## Social signal (Reel 01)
- score=100 grade=A pass=True gaps=[]

## CTR lab (maiores lifts)
- `/quanto-tempo-higienizar-capacete/` lift=5 · best: Higienização de Capacete em 8 Minutos | São Luís — ZapClin (80)
- `/como-higienizar-capacete/` lift=0 · best: Como Tirar Odor do Capacete em São Luís | Método ZapClin (75)
- `/higienizacao-capacete-calhau-golden-shopping/` lift=0 · best: Higienização de Capacete no Calhau | Golden Shopping | ZapClin (45)
- `/higienizacao-capacete-cohama-sao-luis/` lift=0 · best: Higienização de Capacete em Cohama | ZapClin São Luís (65)
- `/higienizacao-capacete-ponta-d-areia-sao-luis/` lift=0 · best: Higienização de Capacete em Ponta d'Areia | ZapClin São Luís (65)
- `/higienizacao-capacete-renascenca-sao-luis/` lift=0 · best: Higienização de Capacete em Renascença | ZapClin São Luís (65)

## SERP gap (DDG proxy)
- `higienização de capacete São Luís` gap=0.0 dominant=none our_hits=0
- `ZapClin São Luís` gap=0.0 dominant=none our_hits=0
- `higienizar capacete Golden Shopping Calhau` gap=0.0 dominant=none our_hits=0
- `preço higienização capacete São Luís` gap=0.0 dominant=none our_hits=0
  - Se dominant=instagram → priorizar Reels score≥80 + bio geo (sinal social).
  - Se dominant=mall_citation → H1 backlink Golden (autoridade local).
  - Se our_hits=0 em query serviço → reforçar landing + internal PageRank + title CTR.

## Local modifier factory (dry-run)
- would_create=5 skipped=[]

## Próximas ações MASTER (auto)
1. Aplicar link suggestions PageRank (M1)
2. Aplicar titles com lift≥8 (M6) preservando geo
3. `--write` factory bairros se gap_priority geo_bairro_expand alto (M8)
4. Schema lint exit 0 antes de sync `zapclinslz`
5. IndexNow só em freshness delta após publish
