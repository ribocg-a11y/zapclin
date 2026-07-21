/**
 * ZapClin — leitura OAuth (smoke).
 *
 * Uso (PowerShell):
 *   cd C:\Users\riboc\Projects\google-drive-sheets-auth
 *   node C:\path\to\zapclin\scripts\oauth-sheets\test-zapclin-read.js
 *
 * Opcional:
 *   node test-zapclin-read.js --range "CLIENTES!A1:E5"
 */
'use strict';

const path = require('path');
const {
  ZAPCLIN_SS_ID,
  getSheetsClient,
  spreadsheetUrl,
} = require(path.join(__dirname, 'oauth-client.js'));

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
}

async function main() {
  const sheets = getSheetsClient();
  const rangeArg = argValue('--range');

  const meta = await sheets.spreadsheets.get({
    spreadsheetId: ZAPCLIN_SS_ID,
    fields: 'properties.title,sheets.properties',
  });

  const title = meta.data.properties && meta.data.properties.title;
  const tabs = (meta.data.sheets || []).map((s) => ({
    title: s.properties.title,
    sheetId: s.properties.sheetId,
    rows: s.properties.gridProperties && s.properties.gridProperties.rowCount,
    cols: s.properties.gridProperties && s.properties.gridProperties.columnCount,
  }));

  console.log('OK leitura — planilha:', title);
  console.log('ID:', ZAPCLIN_SS_ID);
  console.log('URL:', spreadsheetUrl(ZAPCLIN_SS_ID));
  console.log('Abas (' + tabs.length + '):');
  for (const t of tabs) {
    console.log('  -', t.title, '(gid=' + t.sheetId + ', ' + t.rows + 'x' + t.cols + ')');
  }

  const prefer = ['CLIENTES', 'CUSTOS', 'LANÇAMENTOS', '📊 LANÇAMENTOS', 'LOGS'];
  let sampleRange = rangeArg;
  if (!sampleRange) {
    const hit = tabs.find((t) => prefer.includes(t.title));
    sampleRange = hit ? "'" + hit.title + "'!A1:E3" : "'" + tabs[0].title + "'!A1:E3";
  }

  const values = await sheets.spreadsheets.values.get({
    spreadsheetId: ZAPCLIN_SS_ID,
    range: sampleRange,
  });

  console.log('\nAmostra', sampleRange + ':');
  console.log(JSON.stringify(values.data.values || [], null, 2));
  console.log('\nLeitura OK. Proximo: node test-zapclin-write.js');
}

main().catch((e) => {
  console.error('FALHA leitura:', e.message || e);
  if (e.response && e.response.data) console.error(JSON.stringify(e.response.data, null, 2));
  if (String(e.message || '').includes('insufficient') || String(e.code) === '403') {
    console.error('\nDica: token pode ser so readonly. Rode npm run auth com escopo spreadsheets.');
  }
  process.exit(1);
});
