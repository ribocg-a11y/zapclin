# ZapClin — Estado atual (14/07/2026)

Referência única para alinhamento repo × produção.

**Handoff:** [`HANDOFF_NOVO_CHAT.md`](HANDOFF_NOVO_CHAT.md) ← ler primeiro  
**Erros 14/07 (lido obrigatório):** [`ERROS_PWA_2026-07-14.md`](ERROS_PWA_2026-07-14.md)  
**Prioridades:** [`PLANO_PRIORIDADES_2026-06.md`](PLANO_PRIORIDADES_2026-06.md)  
**Equiparação Movi:** [`../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md`](../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md)  
**Regras:** [`REGRAS_DE_PUBLICACAO_SEGURA.md`](REGRAS_DE_PUBLICACAO_SEGURA.md) (§11 pós-incidente)

---

## Produção (verificar após cada deploy)

| Camada | Versão repo / prod | URL / ID |
|--------|--------------------|----------|
| **Frontend** | **v4.33.3** | https://ribocg-a11y.github.io/zapclin/?force=v4.33.3 |
| **Service Worker** | **v4.33.3** | `sw.js` → `ZAPCLIN_SW_VERSION` (ativo) |
| **Apps Script (código repo)** | **v3.50** (header no `.gs` canônico) | `AppsScript_v3.45_ATUAL.gs` (nome mantido) |
| **Apps Script (ping prod.)** | **3.50** | ping ok |

**Planilha:** https://docs.google.com/spreadsheets/d/1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug/edit

**Deploy ID GAS:** `AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg`

**Ping GAS:**  
https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec?action=ping

**Web App base:**  
https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec

**PIN Admin:** `1321`

---

## Arquivos canônicos

| Artefato | Arquivo |
|----------|---------|
| GAS | `AppsScript_v3.45_ATUAL.gs` (conteúdo v3.50) |
| Frontend | `index.html` + `zc-*.js` |
| Pacote Z | `zc-version.js`, `zc-globals.js`, `zc-api.js`, `zc-core.js`, `zc-sync.js`, `zc-whatsapp.js`, `zc-admin.js`, `zc-historico-custos.js` |
| PWA | `sw.js`, `manifest.json` |
| Erros PWA 14/07 | `docs/ativos/ERROS_PWA_2026-07-14.md` |
| Governança | `AGENTS.md`, `docs/ativos/*` |
| Pre-push | `scripts/pre-push-check.ps1` |

---

## Entregas recentes (14/07/2026)

| Versão | Entrega |
|--------|---------|
| **v4.33.3** | Restaura fluxo padrão de versão (SW + toast + `?force=`) |
| **v4.33.2** | Projeção SVG em largura total do card |
| **v4.33.0** | Remove lista/método sob a projeção |
| **v4.32.9** | Projeção interativa + Inter nos valores |
| **v4.32.7–8** | Projeção republicada (JS validado) → SVG |
| **v4.32.6** | Restauro base estável v4.31.1 (pós-SyntaxError) |
| **v3.50 GAS** | Remoção import temporário 11–13/07; totais 11=713, 12=203, 13=295 |

---

## Dashboard — Projeção de Fechamento

- Após **Faturamento por Dia**
- KPIs: projeção do mês, ritmo diário, restante
- SVG acumulado real (ciano) × ritmo (laranja), tooltip hover/toque
- **Sem** texto “Método” e **sem** tabela dia a dia embaixo
- Tipografia de valores: Inter (`--font-data`)

---

## Aviso de nova versão (padrão ZapClin)

- **Não** há banner persistente
- Toast do SW: “Nova versão disponível. Atualizando…”
- Após reload: “Sistema atualizado para vX.Y.Z”
- Force manual: `?force=vX.Y.Z`

---

## Próximo passo humano

1. Abrir https://ribocg-a11y.github.io/zapclin/?force=v4.33.3
2. Confirmar status **Online · v4.33.3**
3. Dashboard → Projeção expandida + interativa
