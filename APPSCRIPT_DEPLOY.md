# Deploy do Apps Script v3.47.1

## Regra de ouro

**Sempre colar o arquivo canônico COMPLETO.** Nunca patch, trecho, nem arquivo separado.

1. Abrir `AppsScript_v3.45_ATUAL.gs` (link abaixo ou do repo)
2. **Ctrl+A** → **Ctrl+C** (arquivo inteiro, ~2967 linhas)
3. Apps Script → `Código.gs` → **Ctrl+A** → apagar → **Ctrl+V**
4. Salvar → Implantar → Nova versão (mesmo Deploy ID)

## Arquivo canônico

| Item | Caminho |
|------|---------|
| Arquivo local (repo) | `AppsScript_v3.45_ATUAL.gs` |
| Versão | **3.47.1** (10/07/2026) |
| PC (clone atual) | `C:\Users\riboc\Documents\Codex\zapclin-repo\AppsScript_v3.45_ATUAL.gs` |

## Download direto (main)

https://raw.githubusercontent.com/ribocg-a11y/zapclin/main/AppsScript_v3.45_ATUAL.gs

**Conferir após abrir:** linha 3 = `Versão: 3.47.1` · **Ctrl+F** `importarJulho2026_` = 1 ocorrência (função no final do arquivo).

## v3.47.1 — o que mudou

1. **importarJulho2026_** + array `IMPORT_JULHO_2026_` integrados no `.gs` canônico (não usar arquivos separados).
2. Action remota `?action=importarJulho2026&pin=1321` para agente importar lançamentos.

## v3.47 / v3.46 — base

- v3.47: action `importarJulho2026` no doGet
- v3.46: catálogo jun/2026 (6 serviços)

## Redeploy (5 minutos)

1. Planilha ZapClin → **Extensões** → **Apps Script**
2. `git pull origin main` no PC (opcional)
3. Colar **`.gs` completo** conforme regra de ouro acima
4. **Implantar** → **Gerenciar implantações** → editar Web App → **Nova versão** → Implantar  
   (mesmo Deploy ID — nunca criar implantação nova)

## Validar após deploy

Ping:

```
https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec?action=ping
```

Esperado: `"version":"3.47.1"`
