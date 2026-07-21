# Scripts de planilha ZapClin

Utilitários que mexem na planilha via OAuth (não passam pelo Apps Script do balcão).

## Onde rodar

Sempre a partir do projeto OAuth compartilhado (tem `node_modules` + `load-auth`):

```powershell
cd C:\Users\riboc\Projects\google-drive-sheets-auth
node scripts\criar-aba-investimento-zapclin.js --dry-run
```

Cópia de referência deste script: `criar-aba-investimento-zapclin.js` (mesmo conteúdo; preferir o da pasta auth se for ESM com `load-auth.js`).

**Leitura/escrita genérica:** `../oauth-sheets/` (canônico no repo ZapClin).

**Planilha:** `1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug`
