# ZapClin — Plano de prioridades (atualizado 21/07/2026)

**Documento irmão:** [`../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md`](../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md)  
**Pastas locais:** [`../MAPA_PASTAS_LOCAL.md`](../MAPA_PASTAS_LOCAL.md)  
**Fluxos:** [`../FLUXOS_OPERACIONAIS.md`](../FLUXOS_OPERACIONAIS.md)

Checklist vivo — marcar ao concluir.

---

## Produção estável (baseline 14–21/07)

| Item | Status |
|------|--------|
| FE / SW **v4.33.3** em GitHub Pages | ✅ |
| GAS ping **3.50** (mesmo Deploy ID) | ✅ |
| Incidente PWA 14/07 documentado (`ERROS_PWA_*` + Regra 11) | ✅ |
| Projeção Dashboard (SVG full-width, sem lista embaixo) | ✅ |
| OAuth Desktop write smoke (`OAUTH_SMOKE`) | ✅ 21/07 |
| Organização pastas C: + repo + OAuth no main | ✅ PR #7 |
| Homologação loja v4.33.3 | ✅ humano 21/07 |
| Pacote Z.5 `zc-nav` + `zc-home` | ✅ **v4.33.4** |

---

## P0 — Homologação loja (humano)

| # | Item | Status | Quem |
|---|------|--------|------|
| P0.1 | Abrir `?force=v4.33.3` → **Online · v4.33.3** | ✅ | Humano |
| P0.2 | Validar Dashboard projeção (largura + toque) | ✅ | Humano |
| P0.3 | Smoke balcão: OS + status + Admin PIN 1321 | ✅ | Humano (loja) |
| P0.4 | Abrir `?force=v4.33.4` após deploy Z.5 | ⬜ | Humano |

---

## P1 — Governança / organização ✅

| # | Item | Status |
|---|------|--------|
| G1–G8 | AGENTS, handoff, estado, regras, acessos, pre-push, ping/KPI | ✅ |
| G9 | Merge plano equiparação | ✅ (PR #2) |
| G10 | `MAPA_PASTAS_LOCAL.md` + marcadores arquivo histórico | ✅ 21/07 |
| G11 | `FLUXOS_OPERACIONAIS.md` | ✅ 21/07 |
| G12 | `scripts/oauth-sheets/` no repo canônico | ✅ (branch org / PR #6) |
| G13 | Separar scripts ZapClin vs Movi no `google-drive-sheets-auth` | ✅ README |

---

## P1 — Padrões GAS ✅

| # | Item | Status |
|---|------|--------|
| F2.* | Mapa, protocolo, ranges, v3.45+ | ✅ |
| Deploy produção | **3.50** | ✅ |

---

## P2 — Frontend Pacote Z (próximo engenharia)

| # | Item | Status |
|---|------|--------|
| F3.1–F3.4 | version, api, core, sync, whatsapp, admin | ✅ |
| F3.8 parcial | `zc-historico-custos.js` | ✅ v4.31+ |
| **F3.5** | `zc-nav.js` + `zc-home.js` | ✅ **v4.33.4** |
| **F3.6** | `zc-registrar.js` + `zc-clientes.js` | ⬜ **próximo código** |
| F3.7 | `zc-operacao.js` + `zc-crm.js` | ⬜ |
| F3.9 | `zc-app.css` | ⬜ |
| F3.10 | `zc-boot.js` shell enxuto | ⬜ |

Ver `PACOTE_Z_MODULARIZACAO.md`. **Antes de mexer em SW/versão:** `ERROS_PWA_2026-07-14.md`.

---

## P2 — Auth operador (Fase 4 equiparação)

| # | Item | Status |
|---|------|--------|
| F4.1 | Login operador nome + PIN | ⬜ |
| F4.2 | Coluna operador em LANÇAMENTOS | ⬜ |

---

## P2 — Cockpit Admin (Fase 5)

| # | Item | Status |
|---|------|--------|
| F5.1 | 5 KPIs síntese + narrativa | ⬜ |
| F5.2 | Alertas semáforo | ⬜ |

---

## Coordenação Movi (repos separados)

| # | Item | Owner |
|---|------|-------|
| M1 | FASE 11 Holding embed | Movi repo |
| M2 | FinanceiroGeral lê planilha ZapClin | ✅ |
| M3 | Não misturar pastas/código | ✅ mapa 21/07 |

---

## Backlog PRs

| PR | Estado | Nota |
|----|--------|------|
| [#7](https://github.com/ribocg-a11y/zapclin/pull/7) org + OAuth | MERGED | ✅ |
| [#6](https://github.com/ribocg-a11y/zapclin/pull/6) OAuth sheets | CLOSED | superseded #7 |
| [#1](https://github.com/ribocg-a11y/zapclin/pull/1) fix listar | DRAFT legado | Conteúdo já em main |

---

## Ao encerrar sessão

1. Atualizar este checklist  
2. Atualizar `HANDOFF_NOVO_CHAT.md`  
3. Atualizar `ESTADO_ATUAL.md` se versão/deploy mudou  
4. Confirmar que edições foram em `zapclin-repo` (não em Continuidade/Downloads)
