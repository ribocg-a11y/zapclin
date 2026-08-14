# HANDOFF — Novo chat / novo agente Cloud

**Atualizado:** 14/08/2026 (FE **v4.34.0** · Z.7 ✅ · GAS ping **3.52** ✅ · PR #18/#17 MERGED)  
**Repo canônico:** [`ribocg-a11y/zapclin`](https://github.com/ribocg-a11y/zapclin) · `main`  
**Clone local:** `C:\Users\riboc\Documents\Codex\zapclin-repo`  
**Site marketing:** [`ribocg-a11y/zapclinslz`](https://github.com/ribocg-a11y/zapclinslz) · https://www.zapclinslz.com/  
**PWA:** https://ribocg-a11y.github.io/zapclin/?force=v4.34.0

> **Mensagem mínima:** *Vamos dar continuidade ao projeto ZapClin.*  
> Agente: ler docs em `AGENTS.md` → resumir → só então trabalhar.

---

## 0) Prompt de abertura

- [`PROMPT_ABERTURA_NOVO_AGENTE.md`](./PROMPT_ABERTURA_NOVO_AGENTE.md)  
- Environment Cursor: **`zapclin`**

---

## 1) Produção (varredura 14/08)

| Camada | Status |
|--------|--------|
| FE/SW | **v4.34.0** (PR #18 merged) |
| GAS arquivo | **3.52** |
| GAS ping | **3.52** ✅ (redeploy humano 14/08) |
| Site | https://www.zapclinslz.com/ ✅ · sitemap 12 |
| Planilha | seed ago 01–13 ✅ |

**Deploy ID (nunca outro):** `AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg`  
**Planilha:** https://docs.google.com/spreadsheets/d/1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug/edit  
**`.gs` raw v3.52:** https://raw.githubusercontent.com/ribocg-a11y/zapclin/main/AppsScript_v3.45_ATUAL.gs  
**Ping:** https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec?path=ping

**Abrir editor GAS:** planilha → **Extensões** → **Apps Script** (não há URL pública fixa no repo). Guia: `docs/APPSCRIPT_DEPLOY.md`.

---

## 2) Feito / não refazer

| Frente | Status |
|--------|--------|
| Pacote Z.1–Z.7 | ✅ · próximo Z.9 `zc-app.css` |
| Handoff + Environment `zapclin` | ✅ |
| SEO live + motor | ✅ · PR #15 draft |
| Seed ago 01–13 | ✅ |

### Humano agora
1. Homologar balcão em `v4.34.0` com Wi-Fi estável (erros de rede já reportados)  
2. Golden Shopping backlink  
3. Não re-spam GSC  
4. GAS **3.52** ✅ feito

### Agente agora
1. Endurecer resiliência a **internet lenta** (salvar OS+fotos, status) — sob pedido  
2. Z.9 CSS quando pedido

---

## 3) Rede lenta × operação (importante)

O PWA **abre** com cache local, mas **não é 100% offline**:

| Ação | Precisa internet? | Se rede lenta |
|------|-------------------|---------------|
| Abrir app / telas | Cache SW ajuda | Lento no 1º load |
| **Cadastrar OS + fotos** | **SIM** (POST + Drive) | Timeout / toast erro — **sem fila offline** |
| **Marcar Pronto / Entregue** | SIM (apiGet ~10s) | UI atualiza local; toast “salvo localmente”; planilha pode ficar atrás |
| Lançamento avulso | Fila `zapPendentes` | Melhor resiliência |
| Listar/atualizar fila | SIM | Timeout; usa cache `localStorage` se houver |

**Conclusão:** internet ruim **causa** erros ao salvar/encerrar. Não é só “sensação”.

---

## 4) Mapa de erros (ler)

| ID | Doc |
|----|-----|
| PWA-14/07 | `ERROS_PWA_2026-07-14.md` |
| Cloud/SEO/OAuth/NET | `MAPA_ERROS_FALHAS_EVENTOS_2026-08.md` |

---

## 5) PRs

| PR | Estado |
|----|--------|
| #18 Z.7 | **MERGED** |
| #17 handoff | rebase pós-#18 |
| #15 SEO · #16 seed · #14 chuva | draft |

---

## 6) Premissas P0

1. GET + query string para escritas browser→GAS  
2. Nunca `clasp deploy` / nunca novo Deploy ID  
3. LockService multioperador  
4. WhatsApp zona crítica  
5. Sem commit de secrets  
6. Dois repos: `zapclin` vs `zapclinslz`  
7. Planilha só com pedido explícito  

---

## 7) Encerrar sessão

Atualizar este HANDOFF + `ESTADO_ATUAL` + `PLANO_PRIORIDADES` + mapa de erros.  
Terminar com: `Mudança no AppScript: sim|não` + `.gs` canônico.
