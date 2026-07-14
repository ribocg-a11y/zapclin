# Deploy do Apps Script v3.49

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
| Versão | **3.49** (14/07/2026) |
| PC (clone atual) | `C:\Users\riboc\Documents\Codex\zapclin-repo\AppsScript_v3.45_ATUAL.gs` |

## Download direto (esta branch / após merge)

https://raw.githubusercontent.com/ribocg-a11y/zapclin/cursor/import-julho-11-13-f0f3/AppsScript_v3.45_ATUAL.gs

**Conferir após abrir:** linha 3 = `Versão: 3.49` · arquivo **com** `importarJulho1113`.

## v3.49 — o que mudou

1. Action temporária `importarJulho1113` (PIN `1321`) para completar lançamentos **11–13/07/2026**.
2. Metas do dia: **11=713**, **12=203**, **13=295** (preserva parciais já existentes: 11=R$90 e 13=R$70).
3. Proteção anti-reimportação via Script Property `IMPORT_JULHO_11_13_2026_DONE`.

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

Esperado: `"version":"3.49"`

Importar (agente ou humano, uma vez):

```
https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec?action=importarJulho1113&pin=1321
```

Esperado: `"ok":true,"criados":51,"total":1051`

## Após a importação

Remover o bloco temporário e publicar **v3.50** (igual ao fluxo 3.47→3.48).
