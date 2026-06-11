# ZapClin — Auditoria de ranges GAS (v3.44 → v3.45)

**Data:** 11/06/2026  
**Incidente:** Home mostrava 5 atendimentos; Admin mostrava 10 — planilha `lastRow=605`, `listar` lia só até linha 600.

---

## 1. Padrão canônico (v3.45+)

```javascript
var DATA_ROW_START = 10;
var DATA_ROW_MAX   = 2000;

function ultimaLinhaDados_(sheet, colNum) { ... }
function numLinhasDados_(sheet, colNum) { ... }
function getLancamentosListaValues_(lanc) { ... }
function getCustosListaValues_(custos) { ... }
function getClientesListaValues_(clientes) { ... }
```

Toda **leitura operacional** para o PWA deve usar estes helpers — nunca range fixo `B10:I600`.

---

## 2. Actions corrigidas em v3.45

| Action | v3.44 (problemático) | v3.45 |
|--------|----------------------|-------|
| `listar` | `B10:I600` fixo | `getLancamentosListaValues_` |
| `listarCustos` | `A10:F600` fixo | `getCustosListaValues_` |
| `listarClientes` | `A10:P600` fixo | `getClientesListaValues_` |
| `listarFotosCliente` | scan `A10:P600` | `getClientesListaValues_` |
| `buscarKpisAdmin` | contava linhas, não QTD | soma QTD + fuso SP |

---

## 3. Ranges ainda fixos (aceitável ou backlog)

| Local | Range | Risco | Notas |
|-------|-------|-------|-------|
| Escrita próxima linha | `C10:C2000` | Baixo | Busca slot vazio — OK |
| VIP scan | `A10:P2000` | Baixo | Cadastro VIP |
| Reparo lancamentos | `A10:M2000` | Baixo | Manutenção |
| Formatação planilha | `A10:G600` etc. | **Visual only** | Não afeta API — estética aba |
| Dashboard fórmulas | `B$10:B$500` | Médio | Gráficos planilha — Fase 14 Movi-style |
| Status edit num scan | `A10:A600` | Médio | Se OS > linha 600, falha edit — **backlog F2.2** |

**Backlog F2.2b:** migrar scans `A10:A600` em status/edit/cancel para `numLinhasDados_` ou busca por OS indexada.

---

## 4. KPI — regras alinhadas

| Métrica | Regra |
|---------|-------|
| Atendimentos hoje | Soma coluna **QTD** em LANÇAMENTOS hoje, exclui CANCELADO |
| Receita hoje | Soma coluna **VALOR** |
| Fuso | `America/Sao_Paulo` no GAS (`FUSO`) |
| Frontend Home | `_calcStatsHome()` — mesma regra |
| Admin server | `buscarKpisAdmin_()` — `fonte: server-side-v3.45` |

---

## 5. Como verificar em produção

### PowerShell (PC)

```powershell
.\scripts\testes\TESTE_KPI_PARIDADE_READONLY.ps1
.\scripts\testes\TESTE_DIAGNOSTICO_READONLY.ps1
```

### Admin no app

Painel Admin → Diagnóstico backend → action `diagnosticoSistema`

Checks v3.45:
- `Ranges dinamicos v3.45`
- `Risco truncamento legado (600)`
- `Capacidade planilha`

### Ping

```
?action=ping → "version":"3.45"
```

---

## 6. Critério de saída Fase 2

- [x] Helpers documentados neste arquivo
- [x] `diagnosticoSistema` reporta `rangesStatus`
- [x] Testes readonly ping + KPI + diagnóstico
- [ ] Deploy v3.45 em produção (humano)
- [ ] `TESTE_KPI_PARIDADE` verde em prod
