# Plano SEO robusto ZapClin — agosto/2026

**Objetivo:** domínio `www.zapclinslz.com` rankear queries de serviço local (hoje Cap Box IG e sinais sociais vencem no orgânico/DDG); consolidar entidade ZapClin São Luís.

**Produção alvo (site):** marketing em `zapclinslz` · pacote canônico neste repo: `site/zapclinslz-sync/`  
**Não altera:** PWA operacional, Apps Script, WhatsApp operacional, PIN admin.

---

## Fases

### Fase A — Só agente (este PR / branch)
| # | Entrega | Status |
|---|---------|--------|
| A1 | Plano + checklist (este doc) | ✅ |
| A2 | 5 landings PAA + HowTo + Calhau | ✅ |
| A3 | Sitemap + llms.txt + links internos home | ✅ |
| A4 | Pack Instagram (10 Reels + legendas) | ✅ |
| A5 | Lista citações NAP São Luís | ✅ |
| A6 | Script monitoramento SERP + IndexNow multi-URL | ✅ |
| A7 | Prompt sync `zapclinslz` (colar no outro agente) | ✅ |
| A8 | Atualizar HANDOFF / SEO_AVANCADO | ✅ |

### Fase B — Agente `zapclinslz` + humano GSC
| # | Ação | Status |
|---|------|--------|
| B1 | Publicar pastas novas + sitemap + llms no domínio | ✅ `4dafda1` |
| B2 | IndexNow nas URLs novas | ✅ HTTP 200 |
| B3 | GSC: inspeção + solicitar indexação de cada URL nova | ✅ 5/5 (11/08) |

### Fase C — Só humano (loja / contas)
| # | Ação | Por quê |
|---|------|---------|
| C1 | Postar Reels do pack no IG (geo São Luís + site no bio) | Cap Box ganha no Google via IG |
| C2 | Pedir 5–10 avaliações GBP esta semana | Local pack / confiança |
| C3 | 1 post GBP/semana (foto + oferta) | Sinal de negócio ativo |
| C4 | Pedir link/loja no site do Golden Shopping | Backlink local #1 |
| C5 | Cadastrar NAP nas citações da lista | Entidade consistente |
| C6 | Não spam Bing — esperar crawl | Já “Discovered” |
| C7 | Confirmar SERP no celular (fora VPN) | VM Google CAPTCHA |

### Fase D — Iteração (após 7–14 dias live)
| # | Ação | Quem |
|---|------|------|
| D1 | Rodar `scripts/seo/monitor-serp.sh` + anotar | Agente |
| D2 | Ajustar títulos se query não bate | Agente |
| D3 | Nova landing se PAA novo aparecer | Agente |

---

## Landings PAA (Fase A2)

| Slug | Query alvo | Schema |
|------|------------|--------|
| `/higienizacao-de-capacetes-sao-luis/` | onde / higienização São Luís | Service + FAQ (já live) |
| `/preco-higienizacao-capacete-sao-luis/` | quanto custa | Service + Offer + FAQ |
| `/quanto-tempo-higienizar-capacete/` | quanto tempo / 8–12 min | Service + FAQ |
| `/como-higienizar-capacete/` | como higienizar / processo | **HowTo** + FAQ |
| `/higienizacao-vs-lavagem-capacete/` | diferença higienização × lavagem | FAQ + Service |
| `/higienizacao-capacete-calhau-golden-shopping/` | Calhau / Golden Shopping | LocalBusiness ref + FAQ |

---

## Regras P0 deste pacote

- Escopo: só `site/`, `scripts/seo/`, `docs/ativos/*SEO*`, prompts sync, HANDOFF.
- Nunca inventar Deploy GAS / `clasp deploy`.
- Não inventar AggregateRating sem reviews reais.
- Preços = catálogo jun/2026 (R$ 15–70).
- Sync: agente `zapclin` **não** pusha `zapclinslz` — usa prompt.

---

## Ordem de execução (passo a passo)

1. ~~Fase A + B~~ ✅ (publicado + GSC 5/5).
2. **Agora (humano):** Fase C item 1 — `FASE_C_PASSO_1_INSTAGRAM.md`.
3. Paralelo: esperar indexação — `CHECKLIST_ESPERA_INDEXACAO.md` (sem re-pedir).
4. Depois: GBP → Golden → citações (`PROMPT_HUMANO_FASE_C.md`).
5. **+7 dias:** Fase D monitoramento.

---

## Métricas de sucesso (não vanity)

| Sinal | Meta 14–30 dias |
|-------|-----------------|
| `site:www.zapclinslz.com` Google | ≥ 6 URLs |
| Query serviço orgânico | domínio na 1ª página (ideal top 3) |
| Brand “ZapClin São Luís” | #1 domínio ou empate IG+domínio |
| Bing | saiu de “Discovered but not crawled” |
| DDG serviço | domínio aparece (hoje IG Cap Box/ZapClin) |
