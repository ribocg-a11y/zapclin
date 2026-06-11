# ZapClin — Plano de prioridades (jun/2026)

**Atualizado:** 11/06/2026  
**Documento irmão:** [`../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md`](../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md)

Checklist vivo — marcar ao concluir.

---

## P0 — Estabilização (esta semana)

| # | Item | Status | Quem |
|---|------|--------|------|
| P0.1 | Merge [PR #1](https://github.com/ribocg-a11y/zapclin/pull/1) v3.45/v4.27.5 | ⬜ | Humano |
| P0.2 | Colar `AppsScript_v3.45_ATUAL.gs` → Nova versão Web GAS | ⬜ | Humano |
| P0.3 | Ping retorna `"version":"3.45"` | ⬜ | Agente |
| P0.4 | Home atendimentos hoje = Admin serviços hoje | ⬜ | Humano (loja) |
| P0.5 | `TESTE_KPI_PARIDADE_READONLY.ps1` passa | ⬜ | Agente (PC) |

---

## P1 — Governança Fase 1 ✅

| # | Item | Status |
|---|------|--------|
| G1 | `AGENTS.md` | ✅ |
| G2 | `docs/ativos/HANDOFF_NOVO_CHAT.md` | ✅ |
| G3 | `docs/ativos/ESTADO_ATUAL.md` | ✅ |
| G4 | `docs/ativos/REGRAS_DE_PUBLICACAO_SEGURA.md` | ✅ |
| G5 | `docs/ativos/ACESSOS_E_AUTORIZACOES.md` | ✅ |
| G6 | `scripts/pre-push-check.ps1` | ✅ |
| G7 | `TESTE_PING_READONLY.ps1` | ✅ |
| G8 | `TESTE_KPI_PARIDADE_READONLY.ps1` | ✅ |
| G9 | Merge PR governança + plano equiparação | ⬜ |

---

## P1 — Padrões GAS (Fase 2 equiparação)

| # | Item | Status |
|---|------|--------|
| F2.1 | `diagnosticoSistema` documentado + teste readonly | ⬜ |
| F2.2 | Auditar todos ranges fixos no `.gs` | ⬜ |
| F2.3 | `MAPA_CODIGO_ARQUITETURA.md` ZapClin | ⬜ |

---

## P2 — Frontend Pacote Z (Fase 3)

| # | Item | Status |
|---|------|--------|
| F3.1 | Extrair `zc-version.js`, `zc-api.js` | ⬜ |
| F3.2 | Shell `index.html` enxuto | ⬜ |
| F3.3 | Paridade funcional 100% antes de merge | ⬜ |

---

## P2 — Auth operador (Fase 4)

| # | Item | Status |
|---|------|--------|
| F4.1 | Login operador nome + PIN | ⬜ |
| F4.2 | Coluna operador em LANÇAMENTOS | ⬜ |

---

## P2 — Cockpit Admin (Fase 5 ← Movi Fases 6–8)

| # | Item | Status |
|---|------|--------|
| F5.1 | 5 KPIs síntese + narrativa | ⬜ |
| F5.2 | Alertas semáforo | ⬜ |

---

## Coordenação Movi

| # | Item | Owner |
|---|------|-------|
| M1 | FASE 11 Holding embed | Movi repo |
| M2 | FinanceiroGeral lê planilha ZapClin | ✅ existente |

---

## Ao encerrar sessão de agente

1. Atualizar checklist acima  
2. Atualizar `HANDOFF_NOVO_CHAT.md` se versão mudou  
3. Atualizar `ESTADO_ATUAL.md` se deploy ocorreu
