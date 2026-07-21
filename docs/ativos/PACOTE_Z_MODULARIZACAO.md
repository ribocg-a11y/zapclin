# Pacote Z — Modularização do frontend ZapClin

**Início:** 11/06/2026  
**Atualizado:** 21/07/2026 (Z.5 · **v4.33.4**)  
**Objetivo:** reduzir monólito `index.html` sem mudar comportamento — espelhar Pacote M do Movi Kids.

---

## Panorama (v4.33.4 — Z.5)

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
| `index.html` | HTML + CSS inline + restante do JS |

**Progresso:** ~22% — 10 módulos; meta final shell HTML < 200 linhas JS inline.

---

## Fases planejadas

| Fase | Entrega | Versão | Status |
|------|---------|--------|--------|
| **Z.1** | version + globals + api + core | v4.28.0 | ✅ |
| **Z.2** | `zc-sync.js` | v4.28.1 | ✅ |
| **Z.3** | `zc-whatsapp.js` | v4.28.2 | ✅ |
| **Z.4** | `zc-admin.js` | v4.29.0 | ✅ |
| **Z.5** | `zc-nav.js` + `zc-home.js` | **v4.33.4** | ✅ |
| **Z.6** | `zc-registrar.js` + `zc-clientes.js` | v4.34.0 | ⬜ próximo |
| **Z.7** | `zc-operacao.js` + `zc-crm.js` | v4.34.1 | ⬜ |
| **Z.8** | histórico custos (parcial) | v4.31.0 | 🟡 ✅ custos |
| **Z.9** | `zc-app.css` | v4.35.0 | ⬜ |
| **Z.10** | `zc-boot.js` shell enxuto | v4.36.0 | ⬜ |

---

## Regras (não negociáveis)

1. **Uma fase = bump de versão** em `zc-version.js`, `sw.js`, `?v=` no `index.html`.
2. **Zero mudança de comportamento** — só mover código.
3. **`pre-push-check.ps1`** verde antes de push.
4. **`sw.js`:** cada novo `zc-*.js` entra em `APP_SHELL`.
5. **Antes de mexer em SW/versão:** `ERROS_PWA_2026-07-14.md` + Regra 11.
6. **Ordem de carga:**

```html
<script src="zc-version.js?v=…"></script>
<script src="zc-globals.js?v=…"></script>
<script src="zc-api.js?v=…"></script>
<script src="zc-core.js?v=…"></script>
<script src="zc-nav.js?v=…"></script>
<script src="zc-home.js?v=…"></script>
<script src="zc-sync.js?v=…"></script>
<script src="zc-whatsapp.js?v=…"></script>
<script src="zc-admin.js?v=…"></script>
<script src="zc-historico-custos.js?v=…"></script>
<script> /* restante inline até Z.10 */ </script>
```

---

## Validação

```powershell
node --check zc-nav.js; node --check zc-home.js
.\scripts\pre-push-check.ps1
```

Homologação: Home, sidebar/`goTo`, Admin PIN — smoke manual com `?force=v4.33.4`.

---

## Referência

Movi Kids: `movikids/docs/ativos/PACOTE_M_MODULARIZACAO.md`
