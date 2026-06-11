# Testes ZapClin (readonly)

Scripts PowerShell para validar infraestrutura e KPIs **sem gravar** na planilha.

Requer Windows + PowerShell 5.1+ (mesmo ambiente do Movi Kids).

## Scripts

| Script | O que faz |
|--------|-----------|
| `TESTE_PING_READONLY.ps1` | Ping GAS — ok + versão |
| `TESTE_KPI_PARIDADE_READONLY.ps1` | Compara KPI hoje: listar vs buscarKpisAdmin |
| `TESTE_DIAGNOSTICO_READONLY.ps1` | Action `diagnosticoSistema` + rangesStatus |
| `TESTE_PROTOCOLO_DIAGNOSTICO.ps1` | Orquestra Z0+Z1 (pre-push + ping + diag + KPI) |

## Uso

```powershell
cd C:\caminho\para\zapclin
.\scripts\testes\TESTE_PROTOCOLO_DIAGNOSTICO.ps1
# ou individualmente:
.\scripts\testes\TESTE_PING_READONLY.ps1
.\scripts\testes\TESTE_DIAGNOSTICO_READONLY.ps1
.\scripts\testes\TESTE_KPI_PARIDADE_READONLY.ps1
.\scripts\pre-push-check.ps1
```

## Exit codes

| Code | Significado |
|------|-------------|
| 0 | OK |
| 1 | Falha |
| 2 | WARN (ex.: produção ainda v3.44 com planilha grande) |

## Quando rodar

- Antes de merge/push (`pre-push-check` já orquestra ping);
- Após deploy GAS v3.45 — KPI deve passar sem divergência;
- Quando usuário reportar Home ≠ Admin.

## Deploy ID

`AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg`
