# HANDOFF — Novo chat / novo agente Cloud

**Atualizado:** 14/08/2026 (Pacote Z.9 · FE alvo **v4.35.0**)  
**Repo:** [`ribocg-a11y/zapclin`](https://github.com/ribocg-a11y/zapclin) · `main`  
**Clone local:** `C:\Users\riboc\Documents\Codex\zapclin-repo`  
**Site live:** [`ribocg-a11y/zapclinslz`](https://github.com/ribocg-a11y/zapclinslz) · https://www.zapclinslz.com/  
**PWA:** https://ribocg-a11y.github.io/zapclin/?force=v4.35.0  
**Environment Cursor:** **`zapclin`**

> Mensagem mínima: *Vamos dar continuidade ao projeto ZapClin.*  
> Ler docs em `AGENTS.md` → resumir 8–12 linhas → só então trabalhar.

**Prompt colável:** [`PROMPT_ABERTURA_NOVO_AGENTE.md`](./PROMPT_ABERTURA_NOVO_AGENTE.md)

---

## 1) Produção (varredura 14/08 — confirmada)

| Camada | Valor |
|--------|--------|
| FE / SW | **v4.35.0** (repo; Pages após merge) |
| GAS arquivo | **3.52** (`AppsScript_v3.45_ATUAL.gs`) |
| GAS ping | **3.52** ✅ |
| PRs abertas | **nenhuma** |
| Site | https://www.zapclinslz.com/ · sitemap 12 |
| Planilha | seed LANÇAMENTOS 01–13/08 ✅ |

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
| Pacote Z.1–Z.9 | ✅ `zc-app.css` · alvo **v4.35.0** |
| Pacote Z.1–Z.7 | ✅ `zc-operacao.js` + `zc-crm.js` · v4.34.0 |
| GAS 3.52 | arquivo + ping live ✅ |
| Handoff + Environment `zapclin` | ✅ secrets OAuth |
| SEO playbooks + motor + Reels 01–03 | ✅ em `main` (PR #20) |
| Extra chuva (foto loja) | ✅ em `site/` |
| Seed ago 01–13 | ✅ planilha + script |
| Drafts #1 #14 #15 #16 | **CLOSED / merged** — zero PRs abertas |

### Humano (só você)

1. Loja: Wi-Fi estável + smoke `?force=v4.35.0` (Home, OS, Pronto, Entregue, Relacionamento)  
2. Backlink Golden Shopping — [`ALAVANCAS_HUMANAS_ALTO_IMPACTO.md`](./ALAVANCAS_HUMANAS_ALTO_IMPACTO.md)  
3. Aguardar GSC bairros — **não** re-spam  
4. Opcional: postar Reels `docs/ativos/marketing-ig/`

### Agente (próxima sessão — só com pedido)

1. Resiliência **NET-TIMEOUT**: fila offline para cadastro OS+fotos e status (hoje só lançamento avulso tem fila)  
2. Pacote **Z.10** `zc-boot.js`  
3. Planilha: Environment `zapclin` + pedido explícito  
4. SEO: não reinventar; gap medido só

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
- `REGRAS_DE_PUBLICACAO_SEGURA.md` §11 + §12  

---

## 5) PRs (histórico — nada aberto)

| PR | Estado |
|----|--------|
| #18 Z.7 · #17 handoff · #19 GAS docs · #20 SEO consolidado | **MERGED** |
| Z.9 `zc-app.css` v4.35.0 | **este PR** |
| #1 legado · #14 chuva · #15 SEO draft · #16 seed | **CLOSED** (conteúdo útil já em main) |

---

## 6) Premissas P0

1. Escritas browser→GAS = GET + query string  
2. Nunca `clasp deploy` / nunca novo Deploy ID  
3. LockService multioperador — não remover  
4. WhatsApp = zona crítica  
5. Sem commit de secrets  
6. Ops = `zapclin` · live site = `zapclinslz`  
7. Planilha só com pedido explícito  
8. PIN 1321 — não alterar sem pedido  

---

## 7) Encerrar sessão

Atualizar este arquivo + `ESTADO_ATUAL.md` + `PLANO_PRIORIDADES` + mapa de erros.  
Última linha: `Mudança no AppScript: sim|não` + `AppsScript_v3.45_ATUAL.gs`
