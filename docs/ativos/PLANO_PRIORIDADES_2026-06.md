# ZapClin — Plano de prioridades (atualizado 14/08/2026)

**Handoff:** [`HANDOFF_NOVO_CHAT.md`](HANDOFF_NOVO_CHAT.md)  
**Erros ago:** [`MAPA_ERROS_FALHAS_EVENTOS_2026-08.md`](MAPA_ERROS_FALHAS_EVENTOS_2026-08.md)  
**Equiparação:** [`../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md`](../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md)

Checklist vivo — marcar ao concluir.

---

## Produção estável (baseline 14/08/2026)

| Item | Status |
|------|--------|
| FE / SW **v4.34.0** em `main` (PR #18) | ✅ |
| GAS arquivo **3.52** · ping prod **3.52** | ✅ 14/08 |
| Incidente PWA 14/07 documentado | ✅ |
| OAuth + Environment `zapclin` | ✅ |
| Seed LANÇAMENTOS ago 01–13 | ✅ |
| SEO live + motor (playbooks em main) | ✅ |
| Handoff transição 14/08 | ✅ |

---

## P0 — Humano (agora)

| # | Item | Status | Quem |
|---|------|--------|------|
| H1 | Nova versão Web GAS **3.52** (mesmo Deploy ID) | ✅ | Humano |
| H2 | Homologar `?force=v4.34.0` (Operação + Relacionamento) | ⏳ | Humano |
| H3 | Backlink Golden Shopping Calhau | ⬜ | Humano |
| H4 | Aguardar GSC bairros / `site:` (não re-spam) | ⏳ | Humano |
| H5 | Relatar toast exato nos erros de salvar/encerrar (rede) | ⏳ | Humano |

---

## P0 — Homologação loja (histórico)

| # | Item | Status |
|---|------|--------|
| P0.1–P0.3 | force v4.33.3 + Dashboard + smoke | ✅ |
| P0.4 | force v4.33.4 (Z.5) | ✅ / superseded |
| P0.5 | force **v4.34.0** (Z.7) | ⏳ |

---

## P1 — Governança

| # | Item | Status |
|---|------|--------|
| G14–G17 | Mapa erros, Environment, Prompt, AGENTS | ✅ |
| G18 | Docs alinhados pós merge #18 | ⏳ |

---

## P1 — Marketing / SEO

| # | Item | Status |
|---|------|--------|
| S1–S3 | Entity/PAA/IndexNow + GSC 5/5 | ✅ / aguardar |
| S4 | Golden Shopping backlink | ⬜ humano |
| S5 | Reels 01–03 | ✅ postar opcional |

---

## P2 — Pacote Z

| # | Item | Status |
|---|------|--------|
| F3.1–F3.7 | até `zc-operacao` + `zc-crm` | ✅ **v4.34.0** |
| F3.9 | `zc-app.css` | ⬜ **próximo código** |
| F3.10 | `zc-boot.js` | ⬜ |
| NET | Resiliência salvar OS / status em rede lenta | ⬜ sob pedido |

Ver `PACOTE_Z_MODULARIZACAO.md`. Antes de SW/versão: `ERROS_PWA_2026-07-14.md`.

---

## P2 — Auth / Cockpit

| Item | Status |
|------|--------|
| Fase 4 login operador | ⬜ |
| Fase 5 cockpit narrativo | ⬜ |

---

## Backlog PRs

| PR | Estado |
|----|--------|
| #18 Z.7 · #17 handoff · #19 GAS 3.52 | **MERGED** |
| #15 SEO | consolidado nesta limpeza |
| #16 seed · #1 legado | **CLOSED** |
| #14 Extra chuva | merge se ainda aberto |

---

## Ao encerrar sessão

1. Este checklist  
2. `HANDOFF_NOVO_CHAT.md`  
3. `ESTADO_ATUAL.md`  
4. `MAPA_ERROS_FALHAS_EVENTOS_2026-08.md` se incidente novo  
