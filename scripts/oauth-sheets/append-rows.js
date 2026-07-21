/**
 * ZapClin — append de linhas via OAuth.
 *
 * Uso:
 *   cd C:\Users\riboc\Projects\google-drive-sheets-auth
 *   node ...\append-rows.js --sheet OAUTH_SMOKE --json "[[\"a\",1],[\"b\",2]]"
 *   node ...\append-rows.js --sheet OAUTH_SMOKE --file rows.json
 *
 * Mesma trava de abas operacionais que write-range.js.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {
  ZAPCLIN_SS_ID,
  getSheetsClient,
  spreadsheetUrl,
} = require(path.join(__dirname, 'oauth-client.js'));

const PROTECTED = [
  'LANÇAMENTOS',
  '📊 LANÇAMENTOS',
  'CLIENTES',
  'CUSTOS',
  'REGISTRAR',
  '🏠 REGISTRAR',
  'DASHBOARD',
  '📈 DASHBOARD',
  'RELACIONAMENTO',
  'BENEFICIOS VIP',
  'ACEITES OS',
];

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
}

function parseValues() {
  const file = argValue('--file');
  const json = argValue('--json');
  if (file) return JSON.parse(fs.readFileSync(file, 'utf8'));
  if (json) return JSON.parse(json);
  console.error('Informe --json ou --file');
  process.exit(1);
}

async function main() {
  const sheet = argValue('--sheet');
  if (!sheet) {
    console.error('Uso: node append-rows.js --sheet OAUTH_SMOKE --json \'[["a",1]]\'');
    process.exit(1);
  }

  const force = process.argv.includes('--i-know-what-im-doing');
  if (PROTECTED.includes(sheet) && !force) {
    console.error('Aba protegida:', sheet);
    console.error('Passe --i-know-what-im-doing para append operacional.');
    process.exit(2);
  }

  const values = parseValues();
  if (!Array.isArray(values) || !Array.isArray(values[0])) {
    console.error('JSON deve ser matriz 2D');
    process.exit(1);
  }

  if (process.argv.includes('--dry-run')) {
    console.log('[dry-run] append', sheet, values);
    return;
  }

  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId: ZAPCLIN_SS_ID,
    range: "'" + sheet + "'!A1",
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values },
  });

  console.log('OK append:', res.data.updates && res.data.updates.updatedRange);
  console.log('URL:', spreadsheetUrl(ZAPCLIN_SS_ID));
}

main().catch((e) => {
  console.error('FALHA:', e.message || e);
  if (e.response && e.response.data) console.error(JSON.stringify(e.response.data, null, 2));
  process.exit(1);
});
