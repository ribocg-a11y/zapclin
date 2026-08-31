# ZapClin — Plano de prioridades (31/08/2026)

**Handoff:** [`HANDOFF_NOVO_CHAT.md`](HANDOFF_NOVO_CHAT.md)

---

## Baseline produção

| Item | Status |
|------|--------|
| FE/SW **v4.36.0** | ⏳ branch login de turno (live ainda v4.35.0) |
| GAS **3.55** arquivo | ⏳ Nova versão Web pendente (ping live 3.54) |
| Seed LANÇAMENTOS 01–25/08 | ✅ planilha |
| OAuth Desktop `token.json` | ✅ re-auth 26/08 |
| Environment `zapclin` refresh | ⏳ colado 26/08; Cloud Agent novo ainda não testou |
| SEO motor + Reels em main | ✅ |

---

## P0 humano

| # | Item | Status |
|---|------|--------|
| H0 | Merge **#24** + `git pull` no clone do C: | ✅ 31/08 |
| H1 | GAS Nova versão **3.55** (login de turno) no Deploy ID atual | ⏳ |
| H2 | Smoke loja `?force=v4.36.0` + cadastrar operadores + aceite no WhatsApp | ⏳ |
| H3 | Backlink Golden Shopping | ⬜ |
| H4 | GSC bairros (não re-spam) | ⏳ |
| H5 | Toast exato se erro rede | ⏳ |
| H6 | Opcional: OAuth consent **In production** (evita expirar ~7 dias) | ⬜ |

---

## P2 código (agente, com pedido)

| # | Item | Status |
|---|------|--------|
| F3.7 | `zc-operacao` + `zc-crm` | ✅ v4.34.0 |
| AUD | Auditoria WA + aceite 14/08 | ✅; FAIL §3 só com pedido |
| F3.9 | `zc-app.css` | ⏳ PR **#22** — rebaseado na `main` |
| F3.10 | `zc-boot.js` | ⬜ |
| NET | Fila offline OS + status | ⬜ |

---

## PRs

- **#22** Z.9 CSS — draft atualizado (main + aceite v4.34.1); merge só com pedido  
- Histórico merged: **#24** seed · #23 aceite · #18 Z.7 · #17 · #19 · #20 · closed #1 #14 #15 #16  

---

## Encerrar sessão

Atualizar este checklist + HANDOFF + ESTADO + mapa de erros.
