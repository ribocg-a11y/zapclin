/**
 * ZapClin — escrita OAuth (smoke seguro).
 *
 * NÃO mexe em LANÇAMENTOS / CLIENTES / CUSTOS.
 * Escreve só na aba dedicada OAUTH_SMOKE (cria se não existir).
 *
 * Uso (PowerShell):
 *   cd C:\Users\riboc\Projects\google-drive-sheets-auth
 *   node C:\path\to\zapclin\scripts\oauth-sheets\test-zapclin-write.js
 *
 * Flags:
 *   --keep     nao limpa a celula apos o smoke (default: limpa A2+)
 *   --dry-run  so imprime o que faria
 */
'use strict';

const path = require('path');
const {
  ZAPCLIN_SS_ID,
  getSheetsClient,
  spreadsheetUrl,
} = require(path.join(__dirname, 'oauth-client.js'));

const ABA = 'OAUTH_SMOKE';

async function ensureSheet(sheets, title) {
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: ZAPCLIN_SS_ID,
    fields: 'sheets.properties',
  });
  for (const s of meta.data.sheets || []) {
    if (s.properties.title === title) return s.properties.sheetId;
  }
  const add = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: ZAPCLIN_SS_ID,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title,
              tabColor: { red: 0.85, green: 0.85, blue: 0.9 },
              gridProperties: { frozenRowCount: 1, columnCount: 4, rowCount: 50 },
            },
          },
        },
      ],
    },
  });
  const sheetId = add.data.replies[0].addSheet.properties.sheetId;
  console.log('Aba criada:', title, '(gid=' + sheetId + ')');
  return sheetId;
}

async function main() {
  const keep = process.argv.includes('--keep');
  const dry = process.argv.includes('--dry-run');
  const sheets = getSheetsClient();

  const stamp = new Date().toISOString();
  const marker = 'zapclin-oauth-write-' + stamp;
  const values = [
    ['marcador', 'quando_iso', 'origem', 'obs'],
    [marker, stamp, 'scripts/oauth-sheets/test-zapclin-write.js', 'smoke seguro — nao e dado operacional'],
  ];

  if (dry) {
    console.log('[dry-run] escreveria em', ABA, values);
    return;
  }

  const sheetId = await ensureSheet(sheets, ABA);

  await sheets.spreadsheets.values.update({
    spreadsheetId: ZAPCLIN_SS_ID,
    range: "'" + ABA + "'!A1:D2",
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });

  const check = await sheets.spreadsheets.values.get({
    spreadsheetId: ZAPCLIN_SS_ID,
    range: "'" + ABA + "'!A2",
  });
  const got = ((check.data.values || [])[0] || [])[0];
  if (got !== marker) {
    console.error('FALHA verify: esperado', marker, 'obtido', got);
    process.exit(1);
  }

  console.log('OK escrita + leitura de volta:', marker);
  console.log('URL:', spreadsheetUrl(ZAPCLIN_SS_ID, sheetId));

  if (!keep) {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: ZAPCLIN_SS_ID,
      range: "'" + ABA + "'!A2:D50",
    });
    // deixa o cabecalho
    await sheets.spreadsheets.values.update({
      spreadsheetId: ZAPCLIN_SS_ID,
      range: "'" + ABA + "'!A1:D1",
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['marcador', 'quando_iso', 'origem', 'obs']],
      },
    });
    console.log('Limpeza pos-smoke: dados A2+ removidos (cabecalho mantido). Use --keep para preservar.');
  } else {
    console.log('Mantido (--keep).');
  }

  console.log('\nEscrita OAuth validada. Use write-range.js / append-rows.js para edicoes reais.');
}

main().catch((e) => {
  console.error('FALHA escrita:', e.message || e);
  if (e.response && e.response.data) console.error(JSON.stringify(e.response.data, null, 2));
  const msg = String(e.message || '') + JSON.stringify((e.response && e.response.data) || {});
  if (/insufficient|PERMISSION|403|Request had insufficient/i.test(msg)) {
    console.error('\nToken provavelmente so com escopo readonly.');
    console.error('No google-drive-sheets-auth, reconceda OAuth com:');
    console.error('  https://www.googleapis.com/auth/spreadsheets');
    console.error('  https://www.googleapis.com/auth/drive.file   (se o projeto pedir)');
    console.error('Depois: npm run auth  (aceitar de novo no browser)');
  }
  process.exit(1);
});
