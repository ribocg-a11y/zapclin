# HANDOFF — Novo chat / novo agente

**Atualizado:** 31/08/2026 (handoff para agente **local no C:**)  
**Repo:** [`ribocg-a11y/zapclin`](https://github.com/ribocg-a11y/zapclin) · `main`  
**Clone canônico (abrir só este):** `C:\Users\riboc\Documents\Codex\zapclin-repo`  
**Site live:** [`ribocg-a11y/zapclinslz`](https://github.com/ribocg-a11y/zapclinslz) · https://www.zapclinslz.com/  
**PWA:** https://ribocg-a11y.github.io/zapclin/?force=v4.34.1  
**Aceite:** https://ribocg-a11y.github.io/zapclin/aceite.html?os=345  
**Environment Cloud (se for nuvem):** **`zapclin`**

> Mensagem mínima: *Vamos dar continuidade ao projeto ZapClin.*  
> Ler docs em `AGENTS.md` → resumir 8–12 linhas → só então trabalhar.

**Prompt colável:** [`PROMPT_ABERTURA_NOVO_AGENTE.md`](./PROMPT_ABERTURA_NOVO_AGENTE.md)

---

## 0) Como abrir o próximo agente **no C:** (Cursor Desktop)

Não use Cloud Agent para esta sessão. O token OAuth novo está no **disco do PC**.

1. Merge (se ainda aberto): https://github.com/ribocg-a11y/zapclin/pull/24  
2. PowerShell:

```powershell
cd C:\Users\riboc\Documents\Codex\zapclin-repo
git checkout main
git pull origin main
git remote -v
# tem que ser ribocg-a11y/zapclin  — NÃO zapclinslz
```

Se o #24 ainda não estiver na `main`:

```powershell
git fetch origin
git checkout cursor/seed-lancamentos-ago01-25-62bf
git pull origin cursor/seed-lancamentos-ago01-25-62bf
```

3. Cursor Desktop: **File → Open Folder** → `C:\Users\riboc\Documents\Codex\zapclin-repo`  
   Não abrir `C:\Users\riboc\Documents\Codex\zapclin` (órfão). Não misturar pasta Movi.  
4. Chat **Agent** (local). **Não** “Cloud Agent” / background na nuvem.  
5. Colar o bloco de [`PROMPT_ABERTURA_NOVO_AGENTE.md`](./PROMPT_ABERTURA_NOVO_AGENTE.md).

OAuth neste PC: `%USERPROFILE%\.config\google-api\token.json`  
Pasta auth: `C:\Users\riboc\Projects\google-drive-sheets-auth`  
Re-auth 26/08 + `npm test` OK. Agente local lê o token do disco — **não** precisa do Environment.

---

## 1) Produção (varredura 31/08)

| Camada | Valor |
|--------|--------|
| FE / SW | **v4.34.1** (repo + GitHub Pages) |
| GAS arquivo | **3.54** (`AppsScript_v3.45_ATUAL.gs`) |
| GAS ping | **3.54** ✅ |
| PRs | **#24** seed 01–25 (merge para o clone do C: puxar o handoff) · **#22** Z.9 CSS *draft* — não continuar sem pedido |
| Site | https://www.zapclinslz.com/ |
| Planilha | seed LANÇAMENTOS **01–25/08/2026** ✅ |

**Deploy ID (nunca outro / nunca `clasp deploy`):**  
`AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg`

**Planilha / editor GAS:**  
https://docs.google.com/spreadsheets/d/1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug/edit  
→ Extensões → Apps Script

**`.gs` raw:** https://raw.githubusercontent.com/ribocg-a11y/zapclin/main/AppsScript_v3.45_ATUAL.gs  
**Ping:** https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec?path=ping  
**Guia:** `docs/APPSCRIPT_DEPLOY.md`

PIN admin **1321** · WhatsApp `5598981479616` · IG `@zapclinhigienizacao`

---

## 2) O que o agente anterior passou (não refazer)

| Frente | Status |
|--------|--------|
| Pacote Z.1–Z.7 | ✅ `zc-operacao.js` + `zc-crm.js` · v4.34.0 |
| Aceite.html no Pages + GAS 3.54 | ✅ PR **#23** MERGED · ping 3.54 |
| SEO playbooks + motor + Reels 01–03 | ✅ em `main` (PR #20) |
| Seed ago 01–25 | ✅ planilha 26/08 (via GAS). Script `scripts/oauth-sheets/seed-lancamentos-ago01-25.js` |
| OAuth Desktop | ✅ `npm run auth` + `npm test` 26/08 · `token.json` no PC |
| Environment `GOOGLE_REFRESH_TOKEN` | ✅ colado 26/08 · **não verificado** em Cloud Agent novo |
| Z.9 `zc-app.css` | ⬜ PR **#22** draft — não misturar com v4.34.1 sem pedido |

### Humano (só você)

1. Merge **#24** + `git pull` no clone do C: (passo 0)  
2. Loja: smoke `?force=v4.34.1` + aceite **dentro do WhatsApp no celular**  
3. Backlink Golden Shopping — [`ALAVANCAS_HUMANAS_ALTO_IMPACTO.md`](./ALAVANCAS_HUMANAS_ALTO_IMPACTO.md)  
4. Opcional: tela OAuth Google **Testing → In production** (senão refresh token cai ~7 dias)  
5. GSC bairros — **não** re-spam

### Agente no C: (só com pedido)

1. Pacote **Z.9** `zc-app.css` — só se pedir; há draft #22, revisar antes de retomar  
2. **NET-TIMEOUT**: fila offline para cadastro OS+fotos e status  
3. Planilha: OAuth local (`token.json`) + pedido explícito. Seed 01–25 já feito  
4. SEO: não reinventar; gap medido só

Smoke OAuth local (readonly, sem gravar):

```powershell
cd C:\Users\riboc\Projects\google-drive-sheets-auth
npm test
# ou, com node_modules dessa pasta:
$ZC = "C:\Users\riboc\Documents\Codex\zapclin-repo"
node "$ZC\scripts\oauth-sheets\test-zapclin-read.js"
```

---

## 3) Rede lenta (loja reportou 14/08)

O PWA **abre** do cache. **Salvar/encerrar não é local:**

| Ação | Internet? | Se lenta |
|------|-----------|----------|
| Cadastrar OS + fotos | **Obrigatória** (POST/Drive) | Erro / timeout — **sem** fila offline |
| Pronto / Entregue | `apiGet` ~10s | UI local; planilha pode atrasar |
| Lançamento avulso | Fila `zapPendentes` | Melhor |

---

## 4) Docs de erro / regras

- `ERROS_PWA_2026-07-14.md` — 14 erros SW (não repetir)  
- `MAPA_ERROS_FALHAS_EVENTOS_2026-08.md` — Cloud-403, OAuth, NET-TIMEOUT  
- `AUDITORIA_WA_ACEITE_2026-08-14.md` — varredura WhatsApp + aceite  
- `REGRAS_DE_PUBLICACAO_SEGURA.md` §11 + §12  
- `MAPA_PASTAS_LOCAL.md` — C: canônico vs Movi  
- `OAUTH_PLANILHA_DESKTOP.md` — token no PC vs Environment  

---

## 5) PRs

| PR | Estado |
|----|--------|
| seed LANÇAMENTOS 01–25/08 (**#24**) | aberta — **merge para o C: puxar este handoff** |
| Z.9 CSS (**#22**) | **draft** — não mergear / não continuar sem pedido |
| aceite Pages (**#23**) | **MERGED** |
| #18 Z.7 · #17 handoff · #19 GAS docs · #20 SEO | **MERGED** |
| #1 · #14 · #15 · #16 | **CLOSED** |

---

## 6) Premissas P0

1. Escritas browser→GAS = GET + query string  
2. Nunca `clasp deploy` / nunca novo Deploy ID  
3. LockService multioperador — não remover  
4. WhatsApp = zona crítica  
5. Sem commit de secrets / `token.json`  
6. Ops = `zapclin` · live site = `zapclinslz`  
7. Planilha só com pedido explícito  
8. PIN 1321 — não alterar sem pedido  
9. Clone canônico = `C:\Users\riboc\Documents\Codex\zapclin-repo`  

---

## 7) Encerrar sessão

Atualizar este arquivo + `ESTADO_ATUAL.md` + `PLANO_PRIORIDADES` + mapa de erros.  
Última linha: `Mudança no AppScript: sim|não` + `AppsScript_v3.45_ATUAL.gs`
