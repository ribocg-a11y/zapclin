# ZapClin — Plano de prioridades (jun/2026)

**Atualizado:** 21/07/2026  
**Documento irmão:** [`../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md`](../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md)

Checklist vivo — marcar ao concluir.

---

## P0 — Estabilização (esta semana)

| # | Item | Status | Quem |
|---|------|--------|------|
| P0.1 | Merge [PR #1](https://github.com/ribocg-a11y/zapclin/pull/1) v3.45/v4.27.5 | ⬜ | Humano |
| P0.2 | Colar `AppsScript_v3.45_ATUAL.gs` → Nova versão Web GAS | ✅ | Humano |
| P0.3 | Ping retorna `"version":"3.45"` | ✅ | Agente |
| P0.4 | Home atendimentos hoje = Admin serviços hoje | ⬜ | Humano (loja) |
| P0.5 | `TESTE_KPI_PARIDADE_READONLY.ps1` passa | ✅ | Agente |

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

## P1 — Padrões GAS (Fase 2 equiparação) ✅ repo

| # | Item | Status |
|---|------|--------|
| F2.1 | `PROTOCOLO_DIAGNOSTICO_E_TESTES.md` + orquestrador | ✅ |
| F2.2 | `AUDITORIA_RANGES_GAS.md` + diagnostico rangesStatus | ✅ |
| F2.3 | `MAPA_CODIGO_ARQUITETURA.md` | ✅ |
| F2.4 | `AppsScript_v3.45_ATUAL.gs` canônico no repo | ✅ |
| F2.5 | Deploy v3.45 produção | ✅ humano |

---

## P2 — Frontend Pacote Z (Fase 3)

| # | Item | Status |
|---|------|--------|
| F3.1 | Extrair `zc-version.js`, `zc-api.js`, `zc-core.js`, `zc-globals.js` | ✅ v4.28.0 |
| F3.2 | `zc-sync.js` | ✅ v4.28.1 |
| F3.3 | `zc-whatsapp.js` | ✅ v4.28.2 |
| F3.4 | `zc-admin.js` | ✅ v4.29.0 |
| F3.5 | `zc-nav.js` … | ⬜ |

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

## P2 — OAuth planilha Desktop

| # | Item | Status |
|---|------|--------|
| O1 | Scripts `scripts/oauth-sheets/` (read/write + smoke `OAUTH_SMOKE`) | ✅ repo |
| O2 | Doc `OAUTH_PLANILHA_DESKTOP.md` | ✅ |
| O3 | Rodar `test-zapclin-read.js` + `test-zapclin-write.js` no PC | ⬜ humano Desktop |
| O4 | Reauth com escopo `spreadsheets` se escrita 403 | ⬜ se necessário |

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
