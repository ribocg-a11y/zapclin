/**
 * ZapClin — U0: abas UNIDADES + USUARIOS, colunas UNIDADE/OPERADOR, backfill golden.
 *
 * Nao apaga OS nem lancamentos. Linhas existentes recebem UNIDADE=golden se estiver vazio.
 * ADM inicial: usuario antonio, PIN 1321 (hash SHA-256, nunca texto na planilha).
 *
 * Uso (PowerShell):
 *   cd C:\Users\riboc\Projects\google-drive-sheets-auth
 *   node ...\bootstrap-unidades-usuarios.js --dry-run
 *   node ...\bootstrap-unidades-usuarios.js --i-know-what-im-doing
 */
'use strict';

const crypto = require('crypto');
const path = require('path');
const {
  ZAPCLIN_SS_ID,
  getSheetsClient,
  spreadsheetUrl,
} = require(path.join(__dirname, 'oauth-client.js'));

const AUTH_PEPPER = 'zapclin-auth-v1';
const DATA_START = 10;

function hashPin(usuario, pin) {
  return crypto
    .createHash('sha256')
    .update(String(usuario || '').toLowerCase().trim() + ':' + String(pin || '') + ':' + AUTH_PEPPER)
    .digest('hex');
}

function argFlag(flag) {
  return process.argv.includes(flag);
}

function sheetByTitle(meta, title) {
  const sheets = (meta.data && meta.data.sheets) || [];
  return sheets.find((s) => s.properties && s.properties.title === title) || null;
}

function colLetter(n) {
  let s = '';
  let x = n;
  while (x > 0) {
    const m = (x - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    x = Math.floor((x - 1) / 26);
  }
  return s;
}

async function ensureSheet(sheets, ssId, meta, title) {
  const existing = sheetByTitle(meta, title);
  if (existing) return existing.properties.sheetId;
  const res = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: ssId,
    requestBody: {
      requests: [{ addSheet: { properties: { title: title } } }],
    },
  });
  const added = res.data.replies && res.data.replies[0] && res.data.replies[0].addSheet;
  return added && added.properties ? added.properties.sheetId : null;
}

async function updateValues(sheets, ssId, range, values) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: ssId,
    range: range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: values },
  });
}

async function getValues(sheets, ssId, range) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: ssId,
    range: range,
  });
  return (res.data && res.data.values) || [];
}

async function backfillColumn(sheets, ssId, tab, col, lastRow, fill, dryRun) {
  if (lastRow < DATA_START) return { filled: 0, skipped: 0 };
  const letter = colLetter(col);
  const range = "'" + tab + "'!" + letter + DATA_START + ':' + letter + lastRow;
  const rows = await getValues(sheets, ssId, range);
  const out = [];
  let filled = 0;
  let skipped = 0;
  const n = lastRow - DATA_START + 1;
  for (let i = 0; i < n; i++) {
    const cur = rows[i] && rows[i][0] != null ? String(rows[i][0]).trim() : '';
    if (cur) {
      out.push([cur]);
      skipped++;
    } else {
      out.push([fill]);
      filled++;
    }
  }
  if (!dryRun && filled > 0) await updateValues(sheets, ssId, range, out);
  return { filled: filled, skipped: skipped };
}

async function lastDataRow(sheets, ssId, tab, keyCol) {
  const letter = colLetter(keyCol);
  const rows = await getValues(sheets, ssId, "'" + tab + "'!" + letter + DATA_START + ':' + letter + '3000');
  let last = DATA_START - 1;
  for (let i = 0; i < rows.length; i++) {
    const v = rows[i] && rows[i][0];
    if (v !== undefined && v !== null && String(v).trim() !== '') last = DATA_START + i;
  }
  return last;
}

async function main() {
  const dryRun = argFlag('--dry-run') || !argFlag('--i-know-what-im-doing');
  if (!argFlag('--i-know-what-im-doing') && !dryRun) {
    console.error('Passe --dry-run ou --i-know-what-im-doing');
    process.exit(2);
  }

  const sheets = getSheetsClient();
  const ssId = ZAPCLIN_SS_ID;
  let meta = await sheets.spreadsheets.get({ spreadsheetId: ssId });
  const titles = ((meta.data && meta.data.sheets) || []).map((s) => s.properties.title);
  console.log('Planilha:', spreadsheetUrl(ssId));
  console.log('Abas:', titles.join(' | '));
  console.log(dryRun ? 'MODO: dry-run (nao grava)' : 'MODO: gravacao real');

  const lancTab = titles.find((t) => /LANC/i.test(t)) || '📊 LANÇAMENTOS';
  const cliTab = titles.find((t) => t === 'CLIENTES') || 'CLIENTES';
  const cusTab = titles.find((t) => t === 'CUSTOS') || 'CUSTOS';

  if (!dryRun) {
    await ensureSheet(sheets, ssId, meta, 'UNIDADES');
    await ensureSheet(sheets, ssId, meta, 'USUARIOS');
    meta = await sheets.spreadsheets.get({ spreadsheetId: ssId });
  }

  const unidadesHeader = [['ID', 'NOME', 'SLUG', 'WHATSAPP', 'ATIVA']];
  const unidadesRows = [
    ['golden', 'Golden Shopping Calhau', 'golden', '5598981479616', 'SIM'],
    ['anil', 'Rio Anil Shopping', 'anil', '', 'SIM'],
  ];
  const usuariosHeader = [['USUARIO', 'NOME', 'PIN_HASH', 'PERFIL', 'UNIDADE_ID', 'ATIVO', 'CRIADO', 'TURNO']];
  const pinHash = hashPin('antonio', '1321');
  const usuariosRows = [['antonio', 'Antonio', pinHash, 'adm', '', 'SIM', '31/08/2026', '']];

  console.log('ADM hash (antonio/1321):', pinHash);

  if (!dryRun) {
    await updateValues(sheets, ssId, 'UNIDADES!A1:E1', unidadesHeader);
    await updateValues(sheets, ssId, 'UNIDADES!A2:E3', unidadesRows);
    await updateValues(sheets, ssId, 'USUARIOS!A1:H1', usuariosHeader);
    const existingUsers = await getValues(sheets, ssId, 'USUARIOS!A2:A20');
    const hasAntonio = existingUsers.some((r) => String((r && r[0]) || '').toLowerCase() === 'antonio');
    if (!hasAntonio) await updateValues(sheets, ssId, 'USUARIOS!A2:H2', usuariosRows);
    else console.log('USUARIOS: antonio ja existe — nao sobrescreveu PIN');

    await updateValues(sheets, ssId, "'" + lancTab + "'!J8:K8", [['UNIDADE', 'OPERADOR']]);
    await updateValues(sheets, ssId, "'" + cliTab + "'!Q8:R8", [['UNIDADE', 'OPERADOR']]);
    await updateValues(sheets, ssId, "'" + cusTab + "'!G8:H8", [['UNIDADE', 'OPERADOR']]);
  } else {
    console.log('Criaria UNIDADES + USUARIOS e cabecalhos J/K, Q/R, G/H');
  }

  const lastLanc = await lastDataRow(sheets, ssId, lancTab, 3);
  const lastCli = await lastDataRow(sheets, ssId, cliTab, 1);
  const lastCus = await lastDataRow(sheets, ssId, cusTab, 2);
  console.log('Ultimas linhas dados: LANC', lastLanc, 'CLIENTES', lastCli, 'CUSTOS', lastCus);

  const bLanc = await backfillColumn(sheets, ssId, lancTab, 10, lastLanc, 'golden', dryRun);
  const bCli = await backfillColumn(sheets, ssId, cliTab, 17, lastCli, 'golden', dryRun);
  const bCus = await backfillColumn(sheets, ssId, cusTab, 7, lastCus, 'golden', dryRun);
  console.log('Backfill UNIDADE=golden:', { lancamentos: bLanc, clientes: bCli, custos: bCus });
  console.log('OK U0');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
