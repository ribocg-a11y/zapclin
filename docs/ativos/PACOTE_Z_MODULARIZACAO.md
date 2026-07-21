# Pacote Z — Modularização do frontend ZapClin

**Início:** 11/06/2026  
**Atualizado:** 21/07/2026 (Z.6 · **v4.33.5**)  
**Objetivo:** reduzir monólito `index.html` sem mudar comportamento — espelhar Pacote M do Movi Kids.

---

## Panorama (v4.33.5 — Z.6)

| Artefato | Papel |
|----------|-------|
| `zc-version.js` | `APP_VERSION`, `BACKEND_MIN_VERSION`, `WEB_APP` |
| `zc-globals.js` | `SERVICES`, catálogos, estado global, `PAGE_TITLES` |
| `zc-api.js` | `jsonp`, `apiGet`, `logEventoSistema_` |
| `zc-core.js` | Formatadores, toast, cache inicial, helpers lançamento |
| `zc-nav.js` | Sidebar, `goTo`, `setMobileTitle_` |
| `zc-home.js` | `mostrarHome`, stats e animação da Home |
| `zc-sync.js` | Fila offline, `buscar*`, refresh automático |
| `zc-whatsapp.js` | Mensagens WA, modal, OS helpers, aceite |
| `zc-admin.js` | PIN admin, KPIs, fechamento, consistência |
| `zc-historico-custos.js` | Histórico de custos admin |
| `zc-registrar.js` | Lançamento avulso + custos (form/lista) |
| `zc-clientes.js` | Cadastro OS, lista, status, pagamento |
| `index.html` | HTML + CSS + Operação/CRM/Dashboard/… |

**Progresso:** ~28% — 12 módulos; meta final shell HTML < 200 linhas JS inline.

---

## Fases planejadas

| Fase | Entrega | Versão | Status |
|------|---------|--------|--------|
| **Z.1–Z.4** | version…admin | v4.28–4.29 | ✅ |
| **Z.5** | `zc-nav.js` + `zc-home.js` | v4.33.4 | ✅ |
| **Z.6** | `zc-registrar.js` + `zc-clientes.js` | **v4.33.5** | ✅ |
| **Z.7** | `zc-operacao.js` + `zc-crm.js` | v4.34.0 | ⬜ próximo |
| **Z.8** | histórico custos (parcial) | v4.31.0 | 🟡 ✅ custos |
| **Z.9** | `zc-app.css` | v4.35.0 | ⬜ |
| **Z.10** | `zc-boot.js` shell enxuto | v4.36.0 | ⬜ |

---

## Regras (não negociáveis)

1. Uma fase = bump de versão (`zc-version`, `sw.js`, `?v=`).
2. Zero mudança de comportamento — só mover código.
3. `pre-push-check.ps1` verde antes de push.
4. Cada `zc-*.js` novo entra em `APP_SHELL`.
5. Antes de SW/versão: `ERROS_PWA_2026-07-14.md` + Regra 11.

Ordem de carga: version → globals → api → core → nav → home → sync → whatsapp → admin → historico-custos → **registrar → clientes** → inline.

---

## Validação

```powershell
node --check zc-registrar.js; node --check zc-clientes.js
.\scripts\pre-push-check.ps1
```

Homologação: Registrar avulso, Custos, Nova OS, lista Clientes — `?force=v4.33.5`.
