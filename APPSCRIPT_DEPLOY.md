# Deploy do Apps Script v3.50

## Regra de ouro

**Sempre colar o arquivo canônico COMPLETO.** Nunca patch, trecho, nem arquivo separado.

1. Abrir `AppsScript_v3.45_ATUAL.gs` (link abaixo ou do repo)
2. **Ctrl+A** → **Ctrl+C** (arquivo inteiro)
3. Apps Script → `Código.gs` → **Ctrl+A** → apagar → **Ctrl+V**
4. Salvar → Implantar → Nova versão (mesmo Deploy ID)

## Arquivo canônico

| Item | Caminho |
|------|---------|
| Arquivo local (repo) | `AppsScript_v3.45_ATUAL.gs` |
| Versão | **3.50** (14/07/2026) |
| PC (clone atual) | `C:\Users\riboc\Documents\Codex\zapclin-repo\AppsScript_v3.45_ATUAL.gs` |

## Download direto (main)

https://raw.githubusercontent.com/ribocg-a11y/zapclin/main/AppsScript_v3.45_ATUAL.gs

**Conferir após abrir:** linha 3 = `Versão: 3.50` · arquivo **sem** `importarJulho1113` e **sem** array `IMPORT_JULHO_11_13_2026_`.

## v3.50 — o que mudou

1. Remove bloco temporário `importarJulho1113` / `IMPORT_JULHO_11_13_2026_` (importação 11–13/07 já concluída).

## Conferência dos dias importados

| Dia | Total |
|-----|-------|
| 11/07/2026 | **R$ 713** |
| 12/07/2026 | **R$ 203** |
| 13/07/2026 | **R$ 295** |

## Redeploy (5 minutos)

1. Planilha ZapClin → **Extensões** → **Apps Script**
2. Colar **`.gs` completo** conforme regra de ouro acima
3. **Implantar** → **Gerenciar implantações** → editar Web App → **Nova versão** → Implantar  
   (mesmo Deploy ID — nunca criar implantação nova)

## Validar após deploy

Ping:

```
https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec?action=ping
```

Esperado: `"version":"3.50"`
