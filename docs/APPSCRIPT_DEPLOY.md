# Deploy do Apps Script v3.53

## Regra de ouro

**Sempre colar o arquivo canônico COMPLETO.** Nunca patch, trecho, nem arquivo separado.

1. Abrir o `.gs` canônico (links abaixo)
2. **Ctrl+A** → **Ctrl+C** (arquivo inteiro)
3. Apps Script → `Código.gs` → **Ctrl+A** → apagar → **Ctrl+V**
4. Salvar → **Implantar** → **Gerenciar implantações** → lápis da Web App → **Nova versão** → Implantar  
   (mesmo Deploy ID — **nunca** criar implantação nova / **nunca** `clasp deploy`)

## Como abrir o editor (não existe “link mágico” público no repo)

1. Abrir a **planilha ZapClin**:  
   https://docs.google.com/spreadsheets/d/1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug/edit  
2. Menu **Extensões** → **Apps Script**  
3. Colar o `.gs` completo → salvar → Nova versão Web

## Arquivo canônico

| Item | Valor |
|------|-------|
| Arquivo | `AppsScript_v3.45_ATUAL.gs` |
| Versão no código | **3.53** (`var VERSION = '3.53'`) |
| PC clone | `C:\Users\riboc\Documents\Codex\zapclin-repo\AppsScript_v3.45_ATUAL.gs` |

## Download direto

- Raw `main`: https://raw.githubusercontent.com/ribocg-a11y/zapclin/main/AppsScript_v3.45_ATUAL.gs  
- Blob: https://github.com/ribocg-a11y/zapclin/blob/main/AppsScript_v3.45_ATUAL.gs  

**Conferir após abrir:** `VERSION = '3.53'` (ou header Versão 3.53).

## Deploy ID (único — nunca criar outro)

`AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg`

## Validar após deploy

```
https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec?path=ping
```

Esperado após Nova versão: `"version":"3.53"`  

**Status 14/08/2026:** ping produção ainda **3.52** até o humano colar o `.gs` 3.53 e publicar **Nova versão** no mesmo Deploy ID.
