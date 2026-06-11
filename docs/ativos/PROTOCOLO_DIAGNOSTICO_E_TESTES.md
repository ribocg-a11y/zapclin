# ZapClin — Protocolo de diagnóstico e testes

**Criado:** 11/06/2026 (Fase 2 equiparação Movi × ZapClin)  
**Função:** quando pedir *"rodar teste"*, *"diagnosticar"* ou *"validar deploy"*, seguir este documento.  
**Complementa:** `MAPA_CODIGO_ARQUITETURA.md`, `AUDITORIA_RANGES_GAS.md`, `REGRAS_DE_PUBLICACAO_SEGURA.md`

**Orquestrador:** `scripts/testes/TESTE_PROTOCOLO_DIAGNOSTICO.ps1`

---

## 1. Quando usar

| Pedido do usuário | Rodar |
|-------------------|-------|
| "Testa o GAS" | `TESTE_PING_READONLY.ps1` |
| "Home diferente do Admin" | `TESTE_KPI_PARIDADE_READONLY.ps1` |
| "Diagnóstico completo" | `TESTE_PROTOCOLO_DIAGNOSTICO.ps1` |
| Antes de push | `pre-push-check.ps1` |
| Após deploy GAS | Protocolo completo |

---

## 2. Fluxos ZapClin (Z0–Z6)

| ID | Fluxo | Teste auto | Loja física? |
|----|-------|------------|--------------|
| **Z0** | Infra — versões, ping, diagnóstico | pre-push + ping + diagnostico | `?force=` |
| **Z1** | KPI — Home = Admin | `TESTE_KPI_PARIDADE` | ✅ se divergir |
| **Z2** | Cadastro OS + fotos | manual / QA v4.19 | ✅ |
| **Z3** | Fila Operação + SLA | manual Operação | ✅ |
| **Z4** | WhatsApp por status | matriz REGRAS §3 | ✅ celular |
| **Z5** | CRM VIP + aceite OS | manual Relacionamento | opcional |
| **Z6** | Admin PIN + fechamento diário | manual Admin | PC/celular |

---

## 3. Sequência protocolo completo

```
Z0  pre-push-check.ps1
    TESTE_PING_READONLY.ps1
    TESTE_DIAGNOSTICO_READONLY.ps1
        ↓
Z1  TESTE_KPI_PARIDADE_READONLY.ps1
        ↓
Z2–Z6  checklist manual (loja) — ver AUDITORIA_QA_v4.19.1.md
```

---

## 4. Interpretação de exit codes

| Script | 0 | 1 | 2 |
|--------|---|---|---|
| `TESTE_PING` | OK v3.45+ | falha rede/ok=false | WARN prod < v3.45 |
| `TESTE_KPI_PARIDADE` | paridade OK | divergência | WARN lastRow ~600 |
| `TESTE_DIAGNOSTICO` | todos checks OK | falha crítica | WARN checks não-críticos |
| `pre-push-check` | OK | fail versão/docs | warn cache |

---

## 5. Matriz de impacto (antes de codar)

Ao mexer em… validar fluxos:

| Arquivo / área | Fluxos obrigatórios |
|----------------|---------------------|
| `listar` / ranges | Z0, Z1 |
| `buscarKpisAdmin` | Z1 |
| cadastro / status | Z2, Z3 |
| WhatsApp | Z4 |
| VIP / aceite | Z5 |
| Admin PIN / fechamento | Z6 |
| `sw.js` / versão | Z0 |

---

## 6. Declarar resolvido

**Não** declarar resolvido só com testes HTTP se o sintoma for visual na loja.

Resolvido = **Z0 verde** + fluxo afetado validado + ping versão correta.

---

## 7. Scripts

| Script | Action GAS / escopo |
|--------|---------------------|
| `TESTE_PING_READONLY.ps1` | `ping` |
| `TESTE_KPI_PARIDADE_READONLY.ps1` | `listar` + `buscarKpisAdmin` |
| `TESTE_DIAGNOSTICO_READONLY.ps1` | `diagnosticoSistema` |
| `TESTE_PROTOCOLO_DIAGNOSTICO.ps1` | orquestra Z0+Z1 |

Ver também: `scripts/testes/README.md`
