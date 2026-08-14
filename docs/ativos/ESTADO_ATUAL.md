# ZapClin — Estado atual (14/08/2026)

Referência única para alinhamento repo × produção.

**Handoff:** [`HANDOFF_NOVO_CHAT.md`](HANDOFF_NOVO_CHAT.md) ← ler primeiro  
**Prompt novo agente:** [`PROMPT_ABERTURA_NOVO_AGENTE.md`](PROMPT_ABERTURA_NOVO_AGENTE.md)  
**Erros PWA 14/07:** [`ERROS_PWA_2026-07-14.md`](ERROS_PWA_2026-07-14.md)  
**Erros/eventos ago/2026:** [`MAPA_ERROS_FALHAS_EVENTOS_2026-08.md`](MAPA_ERROS_FALHAS_EVENTOS_2026-08.md)  
**Prioridades:** [`PLANO_PRIORIDADES_2026-06.md`](PLANO_PRIORIDADES_2026-06.md)  
**Environment Cloud:** [`AMBIENTE_CLOUD_ZAPCLIN.md`](AMBIENTE_CLOUD_ZAPCLIN.md)  
**Deploy GAS:** [`../APPSCRIPT_DEPLOY.md`](../APPSCRIPT_DEPLOY.md)  
**Pastas no PC:** [`../MAPA_PASTAS_LOCAL.md`](../MAPA_PASTAS_LOCAL.md)  
**Fluxos:** [`../FLUXOS_OPERACIONAIS.md`](../FLUXOS_OPERACIONAIS.md)  
**Equiparação Movi:** [`../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md`](../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md)  
**Regras:** [`REGRAS_DE_PUBLICACAO_SEGURA.md`](REGRAS_DE_PUBLICACAO_SEGURA.md) (§11 + §12)  
**OAuth:** [`OAUTH_PLANILHA_DESKTOP.md`](OAUTH_PLANILHA_DESKTOP.md)  
**Acessos:** [`ACESSOS_E_AUTORIZACOES.md`](ACESSOS_E_AUTORIZACOES.md)

---

## Produção (varredura 14/08/2026 — pós merge #18)

| Camada | Versão repo / prod | URL / ID |
|--------|--------------------|----------|
| **Frontend** | **v4.34.0** | https://ribocg-a11y.github.io/zapclin/?force=v4.34.0 |
| **Service Worker** | **v4.34.0** | `sw.js` → `ZAPCLIN_SW_VERSION` |
| **Apps Script (código repo)** | **v3.52** | `AppsScript_v3.45_ATUAL.gs` |
| **Apps Script (ping prod.)** | **3.51** (alvo **3.52**) | ping OK |
| **Site marketing** | live `zapclinslz` | https://www.zapclinslz.com/ · HTTP 200 · sitemap 12 `<loc>` |
| **OAuth Desktop / Cloud** | write OK (ago 01–13) | `scripts/oauth-sheets/` + Environment `zapclin` |

**Clone local canônico:** `C:\Users\riboc\Documents\Codex\zapclin-repo`

**Planilha (abre o Apps Script daqui):**  
https://docs.google.com/spreadsheets/d/1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug/edit

**Código `.gs` para colar (v3.52):**  
https://raw.githubusercontent.com/ribocg-a11y/zapclin/main/AppsScript_v3.45_ATUAL.gs

**Deploy ID GAS (único):** `AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg`

**Ping GAS:**  
https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec?path=ping

**PIN Admin:** `1321`  
**WhatsApp loja:** `5598981479616` · **IG:** `@zapclinhigienizacao`

---

## Arquivos canônicos

| Artefato | Arquivo |
|----------|---------|
| GAS | `AppsScript_v3.45_ATUAL.gs` (conteúdo **v3.52**) |
| Frontend | `index.html` + `zc-*.js` |
| Versão FE | `zc-version.js` → `APP_VERSION = 'v4.34.0'` |
| Pacote Z | … `zc-operacao`, `zc-crm` ✅ · **próximo:** `zc-app.css` |
| PWA | `sw.js`, `manifest.json`, `reparar.html` |
| OAuth planilha | `scripts/oauth-sheets/` |
| SEO engine | `scripts/seo/engine/` (PR #15) |
| Site live | repo **`ribocg-a11y/zapclinslz`** |
| Governança | `AGENTS.md`, `docs/ativos/*` |

---

## Entregas recentes

| Versão / data | Entrega |
|---------------|---------|
| **14/08/2026** | Pacote Z.7 — `zc-operacao` + `zc-crm` (**v4.34.0**) · PR **#18 MERGED** |
| **14/08/2026** | Handoff transição + Environment Cloud `zapclin` |
| **14/08/2026** | Seed LANÇAMENTOS **01–13/08** OK (PR #16) |
| **ago/2026** | SEO entity / PAA / IndexNow / motor · live `zapclinslz` · PR #15 |
| **08/08/2026** | Isola `/site/` do SW (**v4.33.9**) |
| **29/07/2026** | Dashboard Projeção Fechamento (**v4.33.8**) |

---

## PRs (14/08)

| PR | Estado | Tema |
|----|--------|------|
| [#18](https://github.com/ribocg-a11y/zapclin/pull/18) | **MERGED** | Z.7 v4.34.0 |
| [#17](https://github.com/ribocg-a11y/zapclin/pull/17) | handoff docs | rebase pós-#18 |
| [#15](https://github.com/ribocg-a11y/zapclin/pull/15) | DRAFT | SEO |
| [#16](https://github.com/ribocg-a11y/zapclin/pull/16) | DRAFT | seed ago |
| [#14](https://github.com/ribocg-a11y/zapclin/pull/14) | DRAFT | Extra chuva |

---

## Próximo passo

### Humano
1. Confirmar loja em `?force=v4.34.0` (já validado parcialmente)  
2. Nova versão Web GAS **3.52** — ver `APPSCRIPT_DEPLOY.md` + links acima  
3. Backlink Golden Shopping  
4. Aguardar GSC bairros (não re-spam)

### Agente
1. Rede lenta / timeouts em salvar OS e status → endurecer fila offline / timeouts (se pedido)  
2. Pacote Z.9 `zc-app.css`  
3. Planilha só via Environment `zapclin` + pedido explícito  

---

## Lacunas vs Movi (backlog)

| Lacuna | Fase |
|--------|------|
| FE ainda parcial monolito | Pacote Z.9+ |
| Sem auth operador | Fase 4 |
| Sem cockpit narrativo | Fase 5 |
| Holding só via Movi financeiro | Movi FASE 11 |
| Cadastro OS+fotos exige internet | fila offline só parcial (lançamentos avulsos) |
