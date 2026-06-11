# ZapClin — Estado atual (11/06/2026)

Referência única para alinhamento repo × produção.

**Handoff:** [`HANDOFF_NOVO_CHAT.md`](HANDOFF_NOVO_CHAT.md) ← ler primeiro  
**Prioridades:** [`PLANO_PRIORIDADES_2026-06.md`](PLANO_PRIORIDADES_2026-06.md)  
**Equiparação Movi:** [`../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md`](../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md)

---

## Produção (verificar após cada deploy)

| Camada | Versão repo | URL / ID |
|--------|-------------|----------|
| **Frontend** | **v4.28.2** | https://ribocg-a11y.github.io/zapclin/?force=v4.28.2 |
| **Service Worker** | **v4.28.2** | `sw.js` → `ZAPCLIN_SW_VERSION` |
| **Apps Script (código repo)** | **v3.45** | `AppsScript_v3.45_ATUAL.gs` |
| **Apps Script (ping prod.)** | **3.45** | Confirmado 11/06/2026 |

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
| GAS | `AppsScript_v3.45_ATUAL.gs` |
| GAS fix KPI | ~~v3.44~~ removido — v3.45 unificado |
| Frontend | `index.html` + `zc-*.js` (Pacote Z.1) |
| Pacote Z | `zc-version.js`, `zc-globals.js`, `zc-api.js`, `zc-core.js`, `zc-sync.js`, `zc-whatsapp.js` |
| PWA | `sw.js`, `manifest.json` |
| Roadmap | `ROADMAP_FASE23.md` |
| QA | `AUDITORIA_QA_v4.19.1.md` |
| Deploy GAS | `APPSCRIPT_DEPLOY.md` |
| Governança | `AGENTS.md`, `docs/ativos/*` |
| Pre-push | `scripts/pre-push-check.ps1` |
| `scripts/testes/TESTE_DIAGNOSTICO_READONLY.ps1` | diagnosticoSistema |
| `scripts/testes/TESTE_PROTOCOLO_DIAGNOSTICO.ps1` | Orquestrador Z0+Z1 |
| `docs/ativos/MAPA_CODIGO_ARQUITETURA.md` | Anatomia |
| `docs/ativos/PROTOCOLO_DIAGNOSTICO_E_TESTES.md` | Protocolo testes |
| `docs/ativos/AUDITORIA_RANGES_GAS.md` | Ranges GAS |

---

## Entregas recentes (funcional)

| Versão | Entrega |
|--------|---------|
| **v4.28.0** | Pacote Z.1 — módulos zc-version/globals/api/core |
| **v4.27.0** | Fechamento diário Admin |
| **v4.26.x** | Reconciliação pós-escrita, diagnóstico Admin, sync offline |
| **v4.24–25** | Relatório Golden v2, aceite digital OS |
| **v4.21–23** | Nova OS CRM, fotos Drive, aceite OS |
| **v4.17–19** | SLA operação, resumo diário, gate QA |
| **v3.45** | Ranges dinâmicos, KPI QTD, diagnostico rangesStatus |
| **v3.44** | Vínculo CLIENTE/OS em `listar` |
| **v3.36** | LockService multioperador |

---

## Governança (Fases 1–2 equiparação — 11/06/2026)

| Item | Status |
|------|--------|
| Fase 1 — AGENTS, docs, pre-push, ping/KPI | ✅ |
| Fase 2 — MAPA, PROTOCOLO, AUDITORIA, v3.45 | ✅ |
| `docs/PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md` | ✅ |

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
