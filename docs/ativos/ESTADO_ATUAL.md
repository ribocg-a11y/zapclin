# ZapClin — Estado atual (21/07/2026)

Referência única para alinhamento repo × produção.

**Handoff:** [`HANDOFF_NOVO_CHAT.md`](HANDOFF_NOVO_CHAT.md) ← ler primeiro  
**Erros 14/07 (lido obrigatório):** [`ERROS_PWA_2026-07-14.md`](ERROS_PWA_2026-07-14.md)  
**Prioridades:** [`PLANO_PRIORIDADES_2026-06.md`](PLANO_PRIORIDADES_2026-06.md)  
**Pastas no PC:** [`../MAPA_PASTAS_LOCAL.md`](../MAPA_PASTAS_LOCAL.md)  
**Fluxos:** [`../FLUXOS_OPERACIONAIS.md`](../FLUXOS_OPERACIONAIS.md)  
**Equiparação Movi:** [`../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md`](../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md)  
**Regras:** [`REGRAS_DE_PUBLICACAO_SEGURA.md`](REGRAS_DE_PUBLICACAO_SEGURA.md) (§11 pós-incidente)  
**OAuth:** [`OAUTH_PLANILHA_DESKTOP.md`](OAUTH_PLANILHA_DESKTOP.md)

---

## Produção (verificar após cada deploy)

| Camada | Versão repo / prod | URL / ID |
|--------|--------------------|----------|
| **Frontend** | **v4.33.5** | https://ribocg-a11y.github.io/zapclin/?force=v4.33.5 |
| **Service Worker** | **v4.33.5** | `sw.js` → `ZAPCLIN_SW_VERSION` (ativo) |
| **Apps Script (código repo)** | **v3.50** (header no `.gs` canônico) | `AppsScript_v3.45_ATUAL.gs` (nome mantido) |
| **Apps Script (ping prod.)** | **3.50** | ping ok |
| **OAuth Desktop** | write OK (21/07) | `scripts/oauth-sheets/` |

**Clone local canônico:** `C:\Users\riboc\Documents\Codex\zapclin-repo`

**Planilha:** https://docs.google.com/spreadsheets/d/1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug/edit

**Deploy ID GAS:** `AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg`

**Ping GAS:**  
https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec?action=ping

**PIN Admin:** `1321`

---

## Arquivos canônicos

| Artefato | Arquivo |
|----------|---------|
| GAS | `AppsScript_v3.45_ATUAL.gs` (conteúdo v3.50) |
| Frontend | `index.html` + `zc-*.js` |
| Pacote Z | `zc-version` … `zc-historico-custos`, `zc-nav`, `zc-home`, `zc-registrar`, `zc-clientes` |
| PWA | `sw.js`, `manifest.json`, `reparar.html` |
| OAuth planilha | `scripts/oauth-sheets/` |
| Erros PWA 14/07 | `docs/ativos/ERROS_PWA_2026-07-14.md` |
| Governança | `AGENTS.md`, `docs/ativos/*` |
| Pre-push | `scripts/pre-push-check.ps1` |

---

## Entregas recentes

| Versão / data | Entrega |
|---------------|---------|
| **21/07/2026** | Pacote Z.6 — `zc-registrar.js` + `zc-clientes.js` (**v4.33.5**) |
| **21/07/2026** | Pacote Z.5 — `zc-nav.js` + `zc-home.js` (**v4.33.4**) |
| **21/07/2026** | Organização pastas C: × repo; OAuth no repo; fluxos + mapa pastas |
| **v4.33.3** | Restaura fluxo padrão de versão (SW + toast + `?force=`) |
| **v4.33.2** | Projeção SVG em largura total do card |
| **v4.33.0** | Remove lista/método sob a projeção |
| **v3.50 GAS** | Remove import temp 11–13/07 |

---

## Próximo passo

1. Abrir `?force=v4.33.5` · smoke Registrar + Clientes  
2. **Engenharia:** Pacote Z.7 (`zc-operacao` + `zc-crm`)  
3. Auth operador (Fase 4) depois do Pacote Z avançar

---

## Lacunas vs Movi (backlog)

| Lacuna | Fase |
|--------|------|
| FE ainda parcial monolito | Pacote Z.5+ |
| Sem auth operador | Fase 4 |
| Sem cockpit narrativo | Fase 5 |
| Holding só via Movi financeiro | Movi FASE 11 |
