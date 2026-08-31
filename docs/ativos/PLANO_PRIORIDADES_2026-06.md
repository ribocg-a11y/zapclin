# ZapClin — Plano de prioridades (31/08/2026)

**Handoff:** [`HANDOFF_NOVO_CHAT.md`](HANDOFF_NOVO_CHAT.md)

---

## Baseline produção

| Item | Status |
|------|--------|
| FE/SW **v4.36.1** | ✅ PR **#27** MERGED |
| FE/SW **v4.36.2** | ✅ PR **#28** MERGED |
| FE/SW **v4.36.6** troca de loja | ⏳ publicar (stats filtrados na hora) |
| GAS **3.55** arquivo + ping | ✅ |
| Seed LANÇAMENTOS 01–25/08 | ✅ planilha |
| OAuth Desktop `token.json` | ✅ re-auth 26/08 |
| Environment `zapclin` refresh | ⏳ colado 26/08; Cloud Agent novo ainda não testou |
| SEO motor + Reels em main | ✅ |

---

## Freeze Rede (RFC 31/08)

**L1 autorizado** 31/08. Fonte: [`RFC_REDE_GESTAO_MUDANCA.md`](RFC_REDE_GESTAO_MUDANCA.md) · PR **#30**.

| Lote | O que | Status |
|------|--------|--------|
| L0 | RFC + canvas + congelar nova cara / microsserviço / aba por loja | ✅ |
| L0 humano | Colar GAS **3.57** (PIN inicial + troca) no mesmo Deploy ID | ⏳ ping ainda 3.55 |
| L1 código | Equipe visível · Painel Rede = **soma** + breakdown | ✅ v4.36.3 |
| L1 dados | Dry-run `UNIDADE` vazia = golden (sem gravar): 1604/349/88 | ✅ 31/08 |
| L1 humano | Cadastrar operadores no Painel → Equipe (`USUARIOS`) | ⬜ |
| L2 | Matriz nas demais telas · WA Anil · coluna `UNIDADE` em RELACIONAMENTO/ACEITES/LOGS | ⬜ |
| L3 | Layout / responsivo / “nova cara” | ⬜ depois do contrato estável |

## P0 humano

| # | Item | Status |
|---|------|--------|
| H0 | Merge **#24** + `git pull` no clone do C: | ✅ 31/08 |
| H1 | GAS Nova versão **3.55** (login de turno) no Deploy ID atual | ✅ ping 3.55 |
| H1b | GAS Nova versão **3.57** (PIN inicial 123456 + troca obrigatória) | ⏳ |
| H2 | Smoke loja `?force=v4.36.6` (Golden → Rio Anil: Home não herda números) + cadastrar operadores | ⏳ |
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
