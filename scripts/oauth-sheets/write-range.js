/**
 * ZapClin — escreve um range via OAuth.
 *
 * Uso:
 *   cd C:\Users\riboc\Projects\google-drive-sheets-auth
 *   node ...\write-range.js --range "OAUTH_SMOKE!A2:B2" --json "[[\"x\",1]]"
 *   node ...\write-range.js --range "OAUTH_SMOKE!A2" --value "texto"
 *   node ...\write-range.js --range "OAUTH_SMOKE!A2:B2" --file payload.json
 *
 * Proteções:
 *   - exige --i-know-what-im-doing para abas operacionais (LANÇAMENTOS, CLIENTES, CUSTOS, REGISTRAR, DASHBOARD)
 *   - OAUTH_SMOKE / LOGS / EMAIL liberados sem flag
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

function sheetNameFromRange(range) {
  const m = String(range).match(/^'?([^'!]+)'?!/);
  return m ? m[1] : null;
}

function parseValues() {
  const file = argValue('--file');
  const json = argValue('--json');
  const value = argValue('--value');
  if (file) return JSON.parse(fs.readFileSync(file, 'utf8'));
  if (json) return JSON.parse(json);
  if (value != null) return [[value]];
  console.error('Informe --json, --value ou --file');
  process.exit(1);
}

async function main() {
  const range = argValue('--range');
  if (!range) {
    console.error('Uso: node write-range.js --range "ABA!A1:B2" --json \'[["a",1]]\'');
    process.exit(1);
  }

  const sheetName = sheetNameFromRange(range);
  const force = process.argv.includes('--i-know-what-im-doing');
  if (sheetName && PROTECTED.includes(sheetName) && !force) {
    console.error('Aba protegida:', sheetName);
    console.error('Para editar dado operacional, passe --i-know-what-im-doing');
    process.exit(2);
  }

  const values = parseValues();
  if (!Array.isArray(values) || !Array.isArray(values[0])) {
    console.error('JSON deve ser matriz 2D, ex: [["col1","col2"],[1,2]]');
    process.exit(1);
  }

  if (process.argv.includes('--dry-run')) {
    console.log('[dry-run]', range, values);
    return;
  }

  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.update({
    spreadsheetId: ZAPCLIN_SS_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });

  console.log('OK update:', res.data.updatedRange, 'cells=', res.data.updatedCells);
  console.log('URL:', spreadsheetUrl(ZAPCLIN_SS_ID));
}

main().catch((e) => {
  console.error('FALHA:', e.message || e);
  if (e.response && e.response.data) console.error(JSON.stringify(e.response.data, null, 2));
  process.exit(1);
});
