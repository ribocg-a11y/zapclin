# ZapClin — OAuth planilha (Desktop e Cloud)

**Atualizado:** 21/07/2026  
**Prioridade:** P1 (manutenção — não é fluxo de balcão)

## Por que o Cloud Agent não editou a planilha

| Você (notebook) | Cloud Agent (este tipo de chat) |
|-----------------|----------------------------------|
| Tem `C:\Users\riboc\...` | Roda em Linux remoto `/workspace` |
| Tem `token.json` OAuth | **Não** vê seu disco nem o token |
| PowerShell local funciona | Só acessa o repo GitHub |

Estar no notebook **não** coloca o agente dentro do Windows. Cloud Agent = execução na nuvem.

## Como o agente edita a planilha sozinho

### Opção A — Agent **local** (recomendado)

1. No Cursor Desktop: **File → Open Folder** → `C:\Users\riboc\Projects\google-drive-sheets-auth`  
   (ou o clone `zapclin` no mesmo PC)
2. Abrir chat **Agent** (não “Cloud Agent” / background na nuvem)
3. Pedir: *edite a planilha ZapClin via OAuth*

Aí o agente usa `%USERPROFILE%\.config\google-api\token.json` direto.

### Opção B — Cloud Agent com secrets (opcional)

No Environment do Cursor Cloud, definir (nunca no git):

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`

Os scripts em `scripts/oauth-sheets/` leem essas env vars primeiro.

## Estado já feito (21/07/2026)

- ✅ Read + write smoke (`OAUTH_SMOKE`)
- ✅ Seed `📊 LANÇAMENTOS` 14–20/07 → 349 / 365 / 435 / 476 / 565 / 0 / 274

## Arquivos

| Item | Valor |
|------|-------|
| Pasta auth | `C:\Users\riboc\Projects\google-drive-sheets-auth` |
| Planilha | `1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug` |
| Scripts | `scripts/oauth-sheets/` |
| Token Desktop | `%USERPROFILE%\.config\google-api\token.json` |

Ver `scripts/oauth-sheets/README.md`.
