# ZapClin — OAuth Sheets (Desktop)

Scripts Node que leem/escrevem a planilha ZapClin usando o mesmo OAuth de:

`C:\Users\riboc\Projects\google-drive-sheets-auth`

**Planilha:** `1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug`

## Pré-requisitos

1. Em `google-drive-sheets-auth`: `npm install` + `npm run auth` (browser Google).
2. Token em `%USERPROFILE%\.config\google-api\token.json`.
3. Escopo de **escrita**: `https://www.googleapis.com/auth/spreadsheets`  
   (se `test-movikids.js` só leu, o token pode ser readonly — reconceda o auth).

## Como rodar (PowerShell)

Sempre a partir da pasta auth (para achar `node_modules/googleapis`):

```powershell
cd C:\Users\riboc\Projects\google-drive-sheets-auth

# ajuste o caminho do clone zapclin
$ZC = "C:\Users\riboc\Projects\zapclin"   # ou onde estiver o repo

node "$ZC\scripts\oauth-sheets\test-zapclin-read.js"
node "$ZC\scripts\oauth-sheets\test-zapclin-write.js"
```

## Scripts

| Arquivo | Função |
|---------|--------|
| `oauth-client.js` | Carrega token + googleapis |
| `test-zapclin-read.js` | Lista abas + amostra |
| `test-zapclin-write.js` | Smoke write na aba `OAUTH_SMOKE` |
| `write-range.js` | Update de range (`--range` + `--json`/`--value`/`--file`) |
| `append-rows.js` | Append de linhas |
| `seed-lancamentos-jul14-20.js` | Seed 14–20/07/2026 com totais fixos (cancela + recreia) |

### Exemplos de edição

```powershell
# celula livre (aba smoke)
node "$ZC\scripts\oauth-sheets\write-range.js" --range "OAUTH_SMOKE!A2" --value "ola"

# matriz
node "$ZC\scripts\oauth-sheets\write-range.js" --range "OAUTH_SMOKE!A2:B3" --json "[[`"a`",1],[`"b`",2]]"

# dado operacional (trava — exige flag)
node "$ZC\scripts\oauth-sheets\write-range.js" --range "'📊 LANÇAMENTOS'!A10" --value "x" --i-know-what-im-doing
```

## Segurança

- **Não** committe `token.json` / `client_secret.json`.
- Abas operacionais (LANÇAMENTOS, CLIENTES, CUSTOS, …) exigem `--i-know-what-im-doing`.
- Preferir editar via app/PWA + GAS para fluxo de balcão; OAuth é para manutenção no PC.

## Doc irmão

Ver `docs/ativos/OAUTH_PLANILHA_DESKTOP.md`.
