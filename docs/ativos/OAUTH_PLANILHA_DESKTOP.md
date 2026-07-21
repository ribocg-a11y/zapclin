# ZapClin — OAuth planilha no Desktop

**Atualizado:** 21/07/2026 (smoke read+write ✅ no Desktop)  
**Prioridade:** P1 (ferramenta de manutenção — não é fluxo de balcão)

## Contexto

Leitura via OAuth já validada no PC (`test-movikids.js` OK em `google-drive-sheets-auth`).  
Este pacote habilita **escrita** direta na planilha ZapClin pelo mesmo token.

| Item | Valor |
|------|-------|
| Pasta auth | `C:\Users\riboc\Projects\google-drive-sheets-auth` |
| Planilha | `1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug` |
| Scripts | `scripts/oauth-sheets/` |
| Token | `%USERPROFILE%\.config\google-api\token.json` |

## Escopo

| Pode | Não pode / não deve |
|------|---------------------|
| Ler qualquer aba | Commitar tokens/secrets |
| Smoke write em `OAUTH_SMOKE` | Substituir o app/GAS no balcão |
| Editar ranges com `write-range.js` | Cloud Agent sem token Desktop |
| Append com flag em abas sensíveis | `clasp deploy` / novo Deploy ID |

## Passo a passo (humano no Desktop)

```powershell
cd C:\Users\riboc\Projects\google-drive-sheets-auth
# se leitura ok mas escrita 403: reconceder auth com escopo spreadsheets
npm run auth

$ZC = "<caminho-do-clone-zapclin>"
node "$ZC\scripts\oauth-sheets\test-zapclin-read.js"
node "$ZC\scripts\oauth-sheets\test-zapclin-write.js"
```

Se write falhar com *insufficient permissions*: o token atual é só readonly — rode `npm run auth` de novo com escopo `https://www.googleapis.com/auth/spreadsheets`.

## Relação com GAS

| Canal | Uso |
|-------|-----|
| PWA → GAS Web App | Operação multioperador (LockService) |
| OAuth Desktop | Manutenção pontual / scripts / importação controlada |
| MCP `google-drive-sheets-auth` | Opcional no Cursor Desktop se configurado |

Agente Cloud **não** tem o token do PC — scripts ficam no repo; execução é no Desktop.

## Arquivos

Ver `scripts/oauth-sheets/README.md`.
