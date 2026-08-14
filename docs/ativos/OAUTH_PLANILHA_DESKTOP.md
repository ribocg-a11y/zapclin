# ZapClin — OAuth planilha (Desktop e Cloud)

**Atualizado:** 14/08/2026  
**Prioridade:** P1 (manutenção — não é fluxo de balcão)  
**Cloud:** ver também [`AMBIENTE_CLOUD_ZAPCLIN.md`](AMBIENTE_CLOUD_ZAPCLIN.md)

## Por que o Cloud Agent sem Environment falha

| Você (notebook) | Cloud Agent sem Environment | Cloud Agent + Environment `zapclin` |
|-----------------|-----------------------------|-------------------------------------|
| Tem `C:\Users\riboc\...` | Roda em Linux remoto `/workspace` | Mesmo Linux remoto |
| Tem `token.json` OAuth | **Não** vê seu disco | Lê `GOOGLE_*` do Environment |
| PowerShell local funciona | Só repo GitHub | Repo + secrets Sheets |

Estar no notebook **não** coloca o agente dentro do Windows. Preferir Environment **`zapclin`** para Cloud.

## Como o agente edita a planilha sozinho

### Opção A — Agent **local** (desktop)

1. No Cursor Desktop: **File → Open Folder** → `C:\Users\riboc\Documents\Codex\zapclin-repo`  
   (token OAuth continua em `%USERPROFILE%\.config\google-api\`; `node_modules` em `google-drive-sheets-auth`)
2. Abrir chat **Agent** (não “Cloud Agent” / background na nuvem)
3. Pedir: *edite a planilha ZapClin via OAuth*

Scripts canônicos: `scripts/oauth-sheets/` neste repo.

### Opção B — Cloud Agent com Environment `zapclin` (preferido na nuvem)

Secrets (nunca no git):

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`

Os scripts em `scripts/oauth-sheets/` leem essas env vars primeiro. Abrir o agente **já** com Environment `zapclin`.

## Estado já feito

- ✅ Read + write smoke (`OAUTH_SMOKE`) — 21/07/2026
- ✅ Seed `📊 LANÇAMENTOS` 14–20/07 → 349 / 365 / 435 / 476 / 565 / 0 / 274
- ✅ Seed `📊 LANÇAMENTOS` **01–13/08/2026** — OK (PR #16 / Environment)

## Arquivos

| Item | Valor |
|------|-------|
| Pasta auth | `C:\Users\riboc\Projects\google-drive-sheets-auth` |
| Planilha | `1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug` |
| Scripts | `scripts/oauth-sheets/` |
| Token Desktop | `%USERPROFILE%\.config\google-api\token.json` |

Ver `scripts/oauth-sheets/README.md`.
