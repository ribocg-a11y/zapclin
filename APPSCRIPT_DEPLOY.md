# Deploy do Apps Script v3.45

## Arquivo atualizado

| Item | Caminho |
|------|---------|
| Arquivo local (repo) | `AppsScript_v3.45_ATUAL.gs` |
| Versão | **3.45** (11/06/2026) |

## Como baixar

### Opção 1 — GitHub (recomendado)

Repositório: https://github.com/ribocg-a11y/zapclin

Arquivo direto (raw):

https://raw.githubusercontent.com/ribocg-a11y/zapclin/cursor/fix-listar-range-kpis-f0f3/AppsScript_v3.45_ATUAL.gs

Após merge na `main`, use:

https://raw.githubusercontent.com/ribocg-a11y/zapclin/main/AppsScript_v3.45_ATUAL.gs

### Opção 2 — Clone na sua máquina (Windows)

```powershell
git clone https://github.com/ribocg-a11y/zapclin.git
cd zapclin
```

O arquivo ficará em:

`C:\Users\<SEU_USUARIO>\...\zapclin\AppsScript_v3.45_ATUAL.gs`

(Ajuste o caminho conforme a pasta onde você clonou o repositório.)

## O que foi corrigido na v3.45

1. **`listar`** deixou de truncar na linha 600 — passa a ler até `getLastRow()` (máx. 2000).
2. **`listarCustos`** e **`listarClientes`** — mesmo ajuste de range dinâmico.
3. **`buscarKpisAdmin`** — usa fuso `America/Sao_Paulo` e soma **QTD** (igual ao frontend).
4. Ações de status/edição de clientes — leitura dinâmica da coluna OS.

## Passo a passo no Google Apps Script

1. Abra a planilha ZapClin → **Extensões** → **Apps Script**.
2. Selecione todo o código atual e **substitua** pelo conteúdo de `AppsScript_v3.45_ATUAL.gs`.
3. Salve (Ctrl+S).
4. **Implantar** → **Gerenciar implantações** → editar a implantação do Web App → **Nova versão** → Implantar.
5. No app (PWA), recarregue a página ou limpe cache; confirme **Backend v3.45** no status.

## Validar após deploy

Chame no navegador:

```
https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec?action=ping
```

Resposta esperada: `"version":"3.45"`

Home e Painel Admin devem mostrar o **mesmo** número de atendimentos do dia.
