# HANDOFF — Novo chat / novo agente

**Atualizado:** 31/08/2026 (handoff para agente **local no C:**)  
**Repo:** [`ribocg-a11y/zapclin`](https://github.com/ribocg-a11y/zapclin) · `main`  
**Clone canônico (abrir só este):** `C:\Users\riboc\Documents\Codex\zapclin-repo`  
**Site live:** [`ribocg-a11y/zapclinslz`](https://github.com/ribocg-a11y/zapclinslz) · https://www.zapclinslz.com/  
**PWA:** https://ribocg-a11y.github.io/zapclin/?force=v4.36.3  
**Aceite:** https://ribocg-a11y.github.io/zapclin/aceite.html?os=345  
**Environment Cloud (se for nuvem):** **`zapclin`**

> Mensagem mínima: *Vamos dar continuidade ao projeto ZapClin.*  
> Ler docs em `AGENTS.md` → resumir 8–12 linhas → só então trabalhar.

**Prompt colável:** [`PROMPT_ABERTURA_NOVO_AGENTE.md`](./PROMPT_ABERTURA_NOVO_AGENTE.md)

---

## 0) Como abrir o próximo agente **no C:** (Cursor Desktop)

Não use Cloud Agent para esta sessão. O token OAuth novo está no **disco do PC**.

1. `git checkout main` + `git pull origin main` (PR **#24** já merged 31/08)  
2. PowerShell:

```powershell
cd C:\Users\riboc\Documents\Codex\zapclin-repo
git checkout main
git pull origin main
git remote -v
# tem que ser ribocg-a11y/zapclin  — NÃO zapclinslz
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
| FE / SW | **v4.36.3** (L1 Rede — Equipe + Painel soma) |
| GAS arquivo | **3.56** no repo (`AppsScript_v3.45_ATUAL.gs`) — ping pode ainda ser 3.55 até Nova versão |
| GAS ping | **3.55** até você colar 3.56 |
| PRs | **#30** RFC · **#28** menu Rede · L1 v4.36.3 |
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
| Z.9 `zc-app.css` | ✅ PR **#22** MERGED |
| Login de turno v4.36 / GAS 3.55 | ✅ PR **#26** MERGED · ping 3.55 |
| Menu balcão + cockpit Rede (sem dump ADMINISTRAÇÃO) | ✅ PR **#28** MERGED · Pages **v4.36.2** |
| RFC Rede / gestão de mudança | ✅ PR **#30** · sócio marcou **pode L1** |
| L1 Equipe visível + Painel Rede soma | ⏳ **v4.36.3** |

### Humano (só você)

1. Smoke: https://ribocg-a11y.github.io/zapclin/?force=v4.36.3
2. Entrar como `antonio` / PIN **1321** — chip **Rede**
3. Home Rede: cards **Painel** e **Equipe** — cadastrar operadores (golden; PIN 4–6 dígitos)
4. Painel: conferir título “soma” e tabela Golden / Rio Anil
5. Aceite **dentro do WhatsApp no celular**
6. Colar GAS **3.56** no editor (mesmo Deploy ID)

### Agente no C: (só com pedido)

1. Pacote **Z.10** `zc-boot.js`  
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
| seed LANÇAMENTOS 01–25/08 (**#24**) | **MERGED** 31/08 |
| Z.9 CSS (**#22**) | **draft** — rebaseado na `main` (v4.35.0 + aceite) |
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
10. **Publicar FE sem pedir:** commit + push + PR + merge. Só o humano cola Nova versão GAS. Nunca `clasp deploy`.  

---

## 7) Encerrar sessão

Atualizar este arquivo + `ESTADO_ATUAL.md` + `PLANO_PRIORIDADES` + mapa de erros.  
Última linha: `Mudança no AppScript: sim|não` + `AppsScript_v3.45_ATUAL.gs`
