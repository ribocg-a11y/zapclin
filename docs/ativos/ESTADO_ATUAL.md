# ZapClin — Estado atual (31/08/2026)

Referência repo × produção. **Handoff primeiro:** [`HANDOFF_NOVO_CHAT.md`](HANDOFF_NOVO_CHAT.md)

**Prompt (agente no C:):** [`PROMPT_ABERTURA_NOVO_AGENTE.md`](PROMPT_ABERTURA_NOVO_AGENTE.md)  
**Erros PWA:** [`ERROS_PWA_2026-07-14.md`](ERROS_PWA_2026-07-14.md)  
**Erros/eventos:** [`MAPA_ERROS_FALHAS_EVENTOS_2026-08.md`](MAPA_ERROS_FALHAS_EVENTOS_2026-08.md)  
**Auditoria WA/aceite (14/08):** [`AUDITORIA_WA_ACEITE_2026-08-14.md`](AUDITORIA_WA_ACEITE_2026-08-14.md)  
**Prioridades:** [`PLANO_PRIORIDADES_2026-06.md`](PLANO_PRIORIDADES_2026-06.md)  
**OAuth PC:** [`OAUTH_PLANILHA_DESKTOP.md`](OAUTH_PLANILHA_DESKTOP.md)  
**Environment Cloud:** [`AMBIENTE_CLOUD_ZAPCLIN.md`](AMBIENTE_CLOUD_ZAPCLIN.md)  
**Pastas C:** [`../MAPA_PASTAS_LOCAL.md`](../MAPA_PASTAS_LOCAL.md)  
**GAS deploy:** [`../APPSCRIPT_DEPLOY.md`](../APPSCRIPT_DEPLOY.md)  
**Golden (humano):** [`ALAVANCAS_HUMANAS_ALTO_IMPACTO.md`](ALAVANCAS_HUMANAS_ALTO_IMPACTO.md)

---

## Produção (31/08 — alinhada)

| Camada | Versão | URL |
|--------|--------|-----|
| Frontend / SW | **v4.34.1** | https://ribocg-a11y.github.io/zapclin/?force=v4.34.1 |
| GAS arquivo + ping | **3.54** ✅ | ping abaixo |
| Site marketing | live | https://www.zapclinslz.com/ |
| PRs GitHub | **#24** seed+handoff · **#22** Z.9 draft | — |

**Planilha:** https://docs.google.com/spreadsheets/d/1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug/edit  
**`.gs` raw:** https://raw.githubusercontent.com/ribocg-a11y/zapclin/main/AppsScript_v3.45_ATUAL.gs  
**Deploy ID:** `AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg`  
**Ping:** https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec?path=ping  

PIN **1321** · WA `5598981479616` · IG `@zapclinhigienizacao`  
Clone: `C:\Users\riboc\Documents\Codex\zapclin-repo`

---

## Canônico

| Artefato | Caminho |
|----------|---------|
| GAS | `AppsScript_v3.45_ATUAL.gs` |
| FE | `index.html` + `zc-*.js` + `aceite.html` (`APP_VERSION` = v4.34.1) |
| Pacote Z | até `zc-operacao` + `zc-crm` · próximo `zc-app.css` (PR #22 draft) |
| PWA | `sw.js`, `manifest.json` |
| OAuth | `scripts/oauth-sheets/` + token em `%USERPROFILE%\.config\google-api\` |
| SEO | `scripts/seo/engine/` + `docs/ativos/marketing-ig/` |
| Site live | repo `zapclinslz` (espelho `site/zapclinslz-sync/`) |

---

## Entregas

| Item | PR |
|------|-----|
| Z.7 v4.34.0 | #18 MERGED |
| Aceite.html Pages + GAS 3.54 | #23 MERGED |
| Seed LANÇAMENTOS 01–25/08 | planilha 26/08 · script+docs **#24** |
| OAuth Desktop re-auth | 26/08 · `npm test` OK no PC |
| Z.9 CSS | #22 draft — parado |

---

## Próximo

**Humano:** merge #24 → `git pull` no C: → abrir Agent local · smoke v4.34.1 · aceite no WhatsApp · Golden.  
**Agente no C:** Z.9 CSS **ou** fila offline OS/status **só com pedido** · seed 01–25 já na planilha.

---

## Lacunas Movi

Auth operador (Fase 4) · cockpit (Fase 5) · OS+fotos ainda exigem internet.
