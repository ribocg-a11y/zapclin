# ZapClin — Estado atual (11/06/2026)

Referência única para alinhamento repo × produção.

**Handoff:** [`HANDOFF_NOVO_CHAT.md`](HANDOFF_NOVO_CHAT.md) ← ler primeiro  
**Prioridades:** [`PLANO_PRIORIDADES_2026-06.md`](PLANO_PRIORIDADES_2026-06.md)  
**Equiparação Movi:** [`../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md`](../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md)

---

## Produção (verificar após cada deploy)

| Camada | Versão repo | URL / ID |
|--------|-------------|----------|
| **Frontend** | **v4.27.4** | https://ribocg-a11y.github.io/zapclin/?force=v4.27.4 |
| **Service Worker** | **v4.27.4** | `sw.js` → `ZAPCLIN_SW_VERSION` |
| **Apps Script (código repo main)** | **v3.44** | `AppsScript_v3.44_ATUAL.gs` |
| **Apps Script (fix pendente)** | **v3.45** | PR #1 · `AppsScript_v3.45_ATUAL.gs` |
| **Apps Script (ping prod.)** | verificar | Ping abaixo — alvo **3.45** |

**Planilha:** https://docs.google.com/spreadsheets/d/1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug/edit

**Deploy ID GAS:** `AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg`

**Ping GAS:**  
https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec?action=ping

**Web App base:**  
https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec

---

## Arquivos canônicos

| Artefato | Arquivo |
|----------|---------|
| GAS | `AppsScript_v3.44_ATUAL.gs` (main) |
| GAS fix KPI | `AppsScript_v3.45_ATUAL.gs` (branch `cursor/fix-listar-range-kpis-f0f3`) |
| Frontend | `index.html` — `APP_VERSION`, `WEB_APP` |
| PWA | `sw.js`, `manifest.json` |
| Roadmap | `ROADMAP_FASE23.md` |
| QA | `AUDITORIA_QA_v4.19.1.md` |
| Deploy GAS | `APPSCRIPT_DEPLOY.md` (branch fix) |
| Governança | `AGENTS.md`, `docs/ativos/*` |
| Pre-push | `scripts/pre-push-check.ps1` |
| Testes | `scripts/testes/TESTE_PING_READONLY.ps1`, `TESTE_KPI_PARIDADE_READONLY.ps1` |

---

## Entregas recentes (funcional)

| Versão | Entrega |
|--------|---------|
| **v4.27.4** | Semanas dashboard = seg–dom calendário operacional |
| **v4.27.0** | Fechamento diário Admin |
| **v4.26.x** | Reconciliação pós-escrita, diagnóstico Admin, sync offline |
| **v4.24–25** | Relatório Golden v2, aceite digital OS |
| **v4.21–23** | Nova OS CRM, fotos Drive, aceite OS |
| **v4.17–19** | SLA operação, resumo diário, gate QA |
| **v3.44** | Vínculo CLIENTE/OS em `listar` |
| **v3.36** | LockService multioperador |

---

## Governança (Fase 1 equiparação — 11/06/2026)

| Item | Status |
|------|--------|
| `AGENTS.md` | ✅ |
| `docs/ativos/HANDOFF_NOVO_CHAT.md` | ✅ |
| `docs/ativos/ESTADO_ATUAL.md` | ✅ |
| `docs/ativos/REGRAS_DE_PUBLICACAO_SEGURA.md` | ✅ |
| `docs/ativos/ACESSOS_E_AUTORIZACOES.md` | ✅ |
| `scripts/pre-push-check.ps1` | ✅ |
| Testes readonly ping + KPI | ✅ |
| `docs/PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md` | ✅ PR #2 |

---

## PRs abertos

| PR | Branch | Conteúdo |
|----|--------|----------|
| [#1](https://github.com/ribocg-a11y/zapclin/pull/1) | `cursor/fix-listar-range-kpis-f0f3` | v3.45/v4.27.5 fix KPI |
| [#2](https://github.com/ribocg-a11y/zapclin/pull/2) | `cursor/plano-equiparacao-movi-zapclin-f0f3` | Plano equiparação |

---

## Lacunas vs Movi Kids (backlog equiparação)

| Lacuna | Fase equiparação |
|--------|------------------|
| Frontend monolítico | Fase 3 Pacote Z |
| Sem auth operador | Fase 4 |
| Sem cockpit narrativo Admin | Fase 5 |
| Sem Firebase live | Fase 8 (opcional) |
| Holding só via Movi financeiro | Movi FASE 11 |
