# Pacote Z — Modularização do frontend ZapClin

**Início:** 11/06/2026  
**Objetivo:** reduzir monólito `index.html` sem mudar comportamento — espelhar Pacote M do Movi Kids.

---

## Panorama (v4.28.1 — Z.2 entregue)

| Artefato | Papel |
|----------|-------|
| `zc-version.js` | `APP_VERSION`, `BACKEND_MIN_VERSION`, `WEB_APP` |
| `zc-globals.js` | `SERVICES`, catálogos, estado global |
| `zc-api.js` | `jsonp`, `apiGet`, `logEventoSistema_` |
| `zc-core.js` | Home, formatadores, toast, cache inicial |
| `zc-sync.js` | Fila offline, `buscar*`, refresh automático |
| `index.html` | HTML + CSS inline + restante do JS (~4.500 linhas) |

**Progresso:** ~8% — 5 módulos extraídos; meta final shell HTML < 200 linhas JS inline.

---

## Fases planejadas

| Fase | Entrega | Versão | Status |
|------|---------|--------|--------|
| **Z.1** | version + globals + api + core | v4.28.0 | ✅ |
| **Z.2** | `zc-sync.js` — fila pendentes, refresh | v4.28.1 | ✅ |
| **Z.3** | `zc-whatsapp.js` | v4.28.2 | ⬜ |
| **Z.4** | `zc-admin.js` — PIN, KPIs, fechamento | v4.29.0 | ⬜ |
| **Z.5** | `zc-nav.js` + `zc-home.js` | v4.29.1 | ⬜ |
| **Z.6** | `zc-registrar.js` + `zc-clientes.js` | v4.30.0 | ⬜ |
| **Z.7** | `zc-operacao.js` + `zc-crm.js` | v4.30.1 | ⬜ |
| **Z.8** | `zc-dashboard.js` + `zc-historico.js` | v4.31.0 | ⬜ |
| **Z.9** | `zc-app.css` — CSS extraído | v4.32.0 | ⬜ |
| **Z.10** | `zc-boot.js` — init + SW; shell enxuto | v4.33.0 | ⬜ |

---

## Regras (não negociáveis)

1. **Uma fase = bump de versão** em `zc-version.js`, `sw.js`, `?v=` no `index.html`.
2. **Zero mudança de comportamento** — só mover código.
3. **`pre-push-check.ps1`** verde antes de push.
4. **`sw.js`:** cada novo `zc-*.js` entra em `APP_SHELL`.
5. **Ordem de carga:**

```html
<script src="zc-version.js?v=…"></script>
<script src="zc-globals.js?v=…"></script>
<script src="zc-api.js?v=…"></script>
<script src="zc-core.js?v=…"></script>
<script src="zc-sync.js?v=…"></script>
<!-- futuros zc-*.js por domínio -->
<script> /* restante inline até Z.10 */ </script>
```

---

## Validação Z.1

```powershell
.\scripts\pre-push-check.ps1
.\scripts\testes\TESTE_PROTOCOLO_DIAGNOSTICO.ps1
```

Homologação loja: Home, Registrar avulso, cadastro OS, Admin PIN — smoke manual.

---

## Referência

Movi Kids: `movikids/docs/ativos/PACOTE_M_MODULARIZACAO.md`
