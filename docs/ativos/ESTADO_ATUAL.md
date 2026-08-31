# ZapClin — Estado atual (31/08/2026)

Referência repo × produção. **Handoff primeiro:** [`HANDOFF_NOVO_CHAT.md`](HANDOFF_NOVO_CHAT.md)

**Prompt (agente no C:):** [`PROMPT_ABERTURA_NOVO_AGENTE.md`](PROMPT_ABERTURA_NOVO_AGENTE.md)  
**Erros PWA:** [`ERROS_PWA_2026-07-14.md`](ERROS_PWA_2026-07-14.md)  
**Erros/eventos:** [`MAPA_ERROS_FALHAS_EVENTOS_2026-08.md`](MAPA_ERROS_FALHAS_EVENTOS_2026-08.md)  
**RFC Rede (L1 em curso):** [`RFC_REDE_GESTAO_MUDANCA.md`](RFC_REDE_GESTAO_MUDANCA.md)  
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
| Frontend / SW | **v4.36.6** | https://ribocg-a11y.github.io/zapclin/?force=v4.36.6 |
| GAS arquivo | **3.57** no repo | Nova versão 3.57 pendente |
| GAS ping | **3.55** até colar 3.57 | ping abaixo |
| Site marketing | live | https://www.zapclinslz.com/ |
| PRs GitHub | **#30** RFC Rede MERGED · **#28** menu · **#26** login · **#22** Z.9 | — |

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
| FE | `index.html` + `zc-*.js` + `zc-auth.js` + `zc-app.css` + `aceite.html` (`APP_VERSION` = v4.36.6) |
| Pacote Z | até Z.9 `zc-app.css` · próximo Z.10 `zc-boot.js` |
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
| Seed LANÇAMENTOS 01–25/08 | planilha 26/08 · script+docs **#24 MERGED** |
| OAuth Desktop re-auth | 26/08 · `npm test` OK no PC |
| Z.9 CSS | **#22** — rebaseado na `main` (aceite v4.34.1 + GAS 3.54) |

---

## Próximo

**Humano:** `?force=v4.36.6` · chips Golden/Rio Anil devem mostrar números da loja na hora · cadastrar operadores · aceite WhatsApp · Golden.  
**Agente:** NET-TIMEOUT só com pedido. Seed 01–25 já na planilha.

---

## Lacunas Movi

Auth operador (Fase 4) · cockpit (Fase 5) · OS+fotos ainda exigem internet.
