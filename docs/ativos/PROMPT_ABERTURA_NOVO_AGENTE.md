# Prompt de abertura — novo agente ZapClin

**Use este bloco no Cursor Desktop (pasta do C:).**  
Não abra Cloud Agent para esta sessão — o OAuth está no disco do PC.

**Pasta:** `C:\Users\riboc\Documents\Codex\zapclin-repo`  
**Repo:** `ribocg-a11y/zapclin`

Antes de colar: `git checkout main` + `git pull origin main` (depois do merge do PR #24).  
Se o #24 ainda não estiver na `main`: `git checkout cursor/seed-lancamentos-ago01-25-62bf`.

---

```
Vamos dar continuidade ao projeto ZapClin.

Você é o próximo agente **local no Windows** (Cursor Desktop, pasta C:\Users\riboc\Documents\Codex\zapclin-repo). Não é Cloud Agent. Leia os docs — não invente estado.

## Onde estou
- Clone canônico: C:\Users\riboc\Documents\Codex\zapclin-repo
- Confirmar: git remote -v = ribocg-a11y/zapclin (NÃO zapclinslz).
- Não editar C:\Users\riboc\Documents\Codex\zapclin (órfão) nem pasta Movi.
- OAuth Desktop: %USERPROFILE%\.config\google-api\token.json · pasta auth C:\Users\riboc\Projects\google-drive-sheets-auth
- Re-auth 26/08 + npm test OK. Planilha só com pedido explícito.

## Leitura obrigatória (nesta ordem) antes de código
1. docs/ativos/HANDOFF_NOVO_CHAT.md
2. docs/ativos/ESTADO_ATUAL.md
3. docs/ativos/ERROS_PWA_2026-07-14.md
4. docs/ativos/MAPA_ERROS_FALHAS_EVENTOS_2026-08.md
5. docs/ativos/REGRAS_DE_PUBLICACAO_SEGURA.md
6. docs/ativos/ACESSOS_E_AUTORIZACOES.md
7. docs/ativos/PLANO_PRIORIDADES_2026-06.md
8. docs/ativos/OAUTH_PLANILHA_DESKTOP.md
9. docs/MAPA_PASTAS_LOCAL.md
10. AGENTS.md

Resuma em 8–12 linhas (FE/SW/GAS ping, PRs, humano vs agente, OAuth local) e só então trabalhe.

## Premissas P0
- GAS: AppsScript_v3.45_ATUAL.gs · Deploy ID único · nunca clasp deploy.
- Produção 31/08: FE/SW v4.34.1 · GAS arquivo e ping 3.54.
- Escritas browser→GAS = GET + query string.
- Sem secrets no git. Planilha só com pedido explícito (token.json local).
- **Publicar FE sozinho:** commit + push + PR + merge, sem o sócio pedir. Só ele cola Nova versão GAS. Nunca clasp deploy.
- Site live = zapclinslz; ops/docs/PWA = zapclin.
- WhatsApp zona crítica. PIN 1321 — não alterar sem pedido.
- Incidente PWA 14/07: não repetir SW/cache.
- Terminar com: Mudança no AppScript: sim|não + caminho do .gs.

## Estado herdado (31/08/2026)
- Seed LANÇAMENTOS 01–25/08 já na planilha. Não relançar sem pedido.
- Aceite = página GitHub Pages (aceite.html), não HtmlService. Humano ainda deve testar no WhatsApp do celular.
- Z.7 feito. Z.9 zc-app.css é PR #22 draft — não retomar sem pedido.
- SEO motor + Reels 01–03 em main. Não reinventar. Humano: Golden Shopping.
- Loja: NET-TIMEOUT em OS+fotos (sem fila offline).
- PR #24 = este handoff + script de seed. #22 = Z.9 draft.

## Primeiro smoke (readonly)
- Ping GAS (docs/HANDOFF tem a URL).
- Opcional: na pasta google-drive-sheets-auth, npm test (não grava).

Comece pela leitura e pelo resumo.
```

---

## Links

- PWA: https://ribocg-a11y.github.io/zapclin/?force=v4.34.1  
- Aceite: https://ribocg-a11y.github.io/zapclin/aceite.html?os=345  
- Site: https://www.zapclinslz.com/  
- Ping GAS: https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec?path=ping  
- Planilha: https://docs.google.com/spreadsheets/d/1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug/edit  
