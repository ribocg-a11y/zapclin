# ZapClin — Mapa do código e arquitetura

**Atualizado:** 21/07/2026 (FE **v4.33.3** · GAS **3.50** · Pacote Z parcial)  
**Função:** anatomia do sistema — o que é cada parte, o que liga com o quê, zonas sensíveis.  
**Complementa:** `ESTADO_ATUAL.md`, `ACESSOS_E_AUTORIZACOES.md`, `REGRAS_DE_PUBLICACAO_SEGURA.md`, `PROTOCOLO_DIAGNOSTICO_E_TESTES.md`, `AUDITORIA_RANGES_GAS.md`, `../FLUXOS_OPERACIONAIS.md`

---

## 1. Analogia operacional

| Parte | O que é no ZapClin | Arquivos / camada |
|-------|---------------------|-------------------|
| **Cérebro** | Regras de negócio, planilha, KPIs, PDF Golden | `AppsScript_v3.45_ATUAL.gs` + planilha `1nL694BR...` |
| **Coração** | Fila operacional — OS, status, SLA, fotos | `index.html` Operação + aba CLIENTES |
| **Sistema nervoso** | Comunicação FE ↔ GAS | `apiGet()` + `doGet()` actions |
| **Rosto** | Versão, PWA, cache | `APP_VERSION`, `sw.js`, `manifest.json` |
| **Imunológico** | Travas deploy, testes readonly | `pre-push-check.ps1`, `REGRAS_DE_PUBLICACAO_SEGURA.md` |
| **Mãos** | Cadastro, status, WhatsApp, lançamentos | Registrar, Clientes, Operação |
| **Olhos (gestão)** | Dashboard, Admin PIN, fechamento diário | Dashboard, Admin, Relatório Golden |
| **CRM** | VIP, recorrência, aceite OS | Relacionamento, Clube VIP, ACEITES OS |

**Frontend hoje:** `index.html` + 8 módulos `zc-*.js` (Pacote Z parcial). **Meta:** shell enxuto (Z.10).

---

## 2. Mapa de arquivos (raiz)

```
zapclin-repo/
├── CÉREBRO
│   └── AppsScript_v3.45_ATUAL.gs     ← GAS canônico (conteúdo v3.50)
├── CORAÇÃO + MÃOS + OLHOS
│   ├── index.html                    ← HTML + CSS + JS restante
│   └── zc-*.js                       ← Pacote Z (version…historico-custos)
├── PWA
│   ├── sw.js · manifest.json · reparar.html
├── IMUNOLÓGICO
│   ├── scripts/pre-push-check.ps1 · githooks/pre-push
├── DEDOS
│   └── scripts/testes/*.ps1
├── MÃOS PLANILHA (PC)
│   └── scripts/oauth-sheets/ · scripts/planilha/
├── DEPLOY
│   └── APPSCRIPT_DEPLOY.md
└── DOCUMENTAÇÃO
    ├── AGENTS.md
    └── docs/ativos|FLUXOS|MAPA_PASTAS|referencia/
```

---

## 3. Planilha — abas principais

| Aba | Função | Leitura GAS | Escrita GAS |
|-----|--------|-------------|-------------|
| 📊 LANÇAMENTOS | Faturamento, Home KPI | `listar`, KPI | `salvar`, editar, cancelar |
| CLIENTES | OS, fila, fotos Drive | `listarClientes` | cadastro, status, editar |
| CUSTOS | Despesas | `listarCustos` | salvar, editar |
| RELACIONAMENTO | CRM tags/recorrência | map em listarClientes | — |
| BENEFÍCIOS VIP | Auditoria descontos | — | VIP aniversário |
| ACEITES OS | Aceite digital | aceiteOs | confirmarAceiteOs |
| LOGS | Observabilidade | listarLogsAdmin | registrarEventoFrontend |
| 📧 EMAIL | Config Golden PDF | diagnosticoSistema | — |
| 📈 DASHBOARD | Gráficos planilha | trigger KPI | atualizarKPIs |

**Planilha ID:** `1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug`

---

## 4. Actions GAS (`doGet`)

### Leitura (readonly seguro para testes)

| Action | Uso frontend | Zona |
|--------|--------------|------|
| `ping` | Status online | Z0 |
| `listar` | Home, Vendas, Admin local | Z1 KPI |
| `listarCustos` | Custos, Admin | Z1 |
| `listarClientes` | Clientes, Operação, CRM | Z2 fila |
| `listarFotosCliente` | CRM galeria | Z3 CRM |
| `buscarKpisAdmin` | Painel Admin KPI | Z1 |
| `diagnosticoSistema` | Admin diagnóstico | Z0 |
| `listarLogsAdmin` | Admin logs | Z0 |

### Escrita (LockService v3.36)

| Action | Zona |
|--------|------|
| `salvar` | Lançamento avulso |
| cadastro com fotos / Nova OS | Z2 |
| `editarLancamento`, `cancelarLancamento` | Z1 |
| status cliente, editar, cancelar | Z2 |
| `salvarCadastroVip` | Z3 CRM |
| `confirmarAceiteOs` | Z4 aceite |

---

## 5. Fluxo de dados KPI (regra de ouro)

```
LANÇAMENTOS (aba)
       │
       ├── listar ──────────► Home (soma QTD hoje)
       │                      Vendas, Histórico
       │
       └── buscarKpisAdmin ─► Admin KPI server-side
                              (deve = Home após v3.45)
```

**Incidente 11/06/2026:** v3.44 truncava `listar` em linha 600 → Home < Admin. **Fix v3.45:** helpers `ultimaLinhaDados_`, `getLancamentosListaValues_`, KPI com QTD + fuso SP.

---

## 6. Frontend — páginas (`showPage`)

| Página | ID / seção | Dados principais |
|--------|------------|------------------|
| Home | `#pageHome` | `listar` + `listarClientes` |
| Registrar | cadastro OS | GAS cadastro + Drive fotos |
| Clientes | fila cards | `listarClientes` |
| Operação | SLA fila | status + cronômetro |
| Relacionamento | CRM | clientes + VIP |
| Dashboard | gráficos | cache local lancamentos |
| Vendas | lançamentos | `listar` |
| Custos | despesas | `listarCustos` |
| Histórico | comercial | `listar` + clientes |
| Relatório | Golden preview | local + enviarRelatorio |
| Admin | PIN 1321 | KPI server + diagnóstico + fechamento |

---

## 7. Zonas sensíveis (não quebrar)

| Zona | Risco | Arquivos |
|------|-------|----------|
| **WhatsApp** | Abertura wa.me, normalização tel | funções `wa*` no index |
| **LockService** | Colisão multioperador | `obterLockEscrita_`, v3.36 |
| **Ranges planilha** | Truncamento silencioso | helpers v3.45 — ver `AUDITORIA_RANGES_GAS.md` |
| **KPI QTD** | Contagem errada | `_calcStatsHome`, `buscarKpisAdmin_` |
| **PIN Admin** | Bloqueio balcão | `ADMIN_CONFIG` |
| **Cache PWA** | FE velho | `APP_VERSION` + `sw.js` |
| **Aceite OS** | Compliance cliente | ACEITES OS + render público |

---

## 8. Constantes canônicas (GAS)

| Constante | Valor | Função |
|-----------|-------|--------|
| `SHEET_ID` | `1nL694BR...` | Planilha |
| `FUSO` | `America/Sao_Paulo` | Datas KPI |
| `DATA_ROW_START` | `10` | Início dados |
| `DATA_ROW_MAX` | `2000` | Teto leitura |
| `VERSION` | `3.45` | Ping / deploy |

---

## 9. Integração Movi Kids

| Item | Detalhe |
|------|---------|
| Leitura | Movi `FinanceiroGeral.gs` lê LANÇAMENTOS ZapClin |
| Escrita cruzada | **Não** |
| Holding UI | Movi FASE 11 — embed `financeiro/` |

---

## 10. Evolução planejada (equiparação)

| Fase | Entrega | Impacto neste mapa |
|------|---------|-------------------|
| 2 ✅ | Diagnóstico + auditoria ranges | `PROTOCOLO`, `AUDITORIA_RANGES` |
| 3 | Pacote Z | `index.html` → `zc-*.js` |
| 4 | Auth operador | nova camada `zc-auth.js` |
| 5 | Cockpit narrativo | Admin + GAS narrativa |

Ver: `PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md`
