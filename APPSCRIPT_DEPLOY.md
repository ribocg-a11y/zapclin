# Deploy do Apps Script v3.45.1

## Arquivo canônico

| Item | Caminho |
|------|---------|
| Arquivo local (repo) | `AppsScript_v3.45_ATUAL.gs` |
| Versão | **3.45.1** (11/06/2026) |
| PC (clone atual) | `C:\Users\riboc\Documents\Codex\zapclin-repo\AppsScript_v3.45_ATUAL.gs` |

## Download direto (branch equiparação)

https://raw.githubusercontent.com/ribocg-a11y/zapclin/cursor/plano-equiparacao-movi-zapclin-f0f3/AppsScript_v3.45_ATUAL.gs

## v3.45.1 — o que mudou

1. **Diagnóstico** — check `Risco truncamento legado (600)` passa quando `DATA_ROW_MAX >= 2000` (ranges dinâmicos ativos).
2. Ping passa a retornar `"version":"3.45.1"`.

## v3.45 — base

1. **`listar`** deixou de truncar na linha 600 — lê até `getLastRow()` (máx. 2000).
2. **`buscarKpisAdmin`** — fuso `America/Sao_Paulo` e soma **QTD** (igual ao frontend).

## Redeploy (5 minutos)

1. Planilha ZapClin → **Extensões** → **Apps Script**
2. Abra `AppsScript_v3.45_ATUAL.gs` do repo (pull antes: `git pull origin cursor/plano-equiparacao-movi-zapclin-f0f3`)
3. **Ctrl+A** no editor GAS → apagar → **Ctrl+V** com o `.gs` completo
4. **Salvar** (Ctrl+S)
5. **Implantar** → **Gerenciar implantações** → editar Web App → **Nova versão** → Implantar  
   (mesmo Deploy ID — nunca criar implantação nova)

## Validar após deploy

Ping:

```
https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec?action=ping
```

Esperado: `"version":"3.45.1"`

Protocolo (PowerShell no repo):

```powershell
cd C:\Users\riboc\Documents\Codex\zapclin-repo
pwsh -File .\scripts\testes\TESTE_PROTOCOLO_DIAGNOSTICO.ps1
```

Esperado: **STATUS PROTOCOLO: OK** (25/25 checks no GAS após redeploy).
