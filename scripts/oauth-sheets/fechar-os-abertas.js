/**
 * Fecha OS abertas na aba CLIENTES (Em andamento / Pronto → Entregue).
 * Não dispara WhatsApp (escrita direta na planilha).
 *
 * Uso (pasta google-drive-sheets-auth):
 *   node fechar-os-abertas.js --dry-run
 *   node fechar-os-abertas.js --i-know-what-im-doing
 */
'use strict';

const path = require('path');
const {
  ZAPCLIN_SS_ID,
  getSheetsClient,
  spreadsheetUrl,
} = require(path.join(__dirname, 'oauth-client.js'));

const ABA = 'CLIENTES';
const DATA_START = 10;
const COL = {
  num: 0,
  data: 1,
  hora: 2,
  nome: 3,
  tel: 4,
  status: 9,
  dataPag: 11,
  encerradoEm: 13,
  tempoMin: 14,
  prazoMin: 15,
};

function pad2(n) {
  return String(n).padStart(2, '0');
}

function agoraBr() {
  const d = new Date();
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t).value;
  return {
    dataPag: get('day') + '/' + get('month') + '/' + get('year'),
    encerradoEm: get('day') + '/' + get('month') + '/' + get('year') + ' ' + get('hour') + ':' + get('minute'),
  };
}

function statusNorm(raw) {
  const s = String(raw || '').trim();
  if (!s) return 'Em andamento';
  return s;
}

function isAberta(status) {
  const s = statusNorm(status);
  return s !== 'Entregue' && s !== 'Cancelado';
}

async function main() {
  const dry = process.argv.includes('--dry-run') || !process.argv.includes('--i-know-what-im-doing');
  const sheets = getSheetsClient();
  const now = agoraBr();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: ZAPCLIN_SS_ID,
    range: "'" + ABA + "'!A" + DATA_START + ":P",
    valueRenderOption: 'UNFORMATTED_VALUE',
  });
  const rows = res.data.values || [];
  const abertas = [];
  const porStatus = {};

  rows.forEach((row, i) => {
    const num = row[COL.num];
    if (num == null || num === '') return;
    const status = statusNorm(row[COL.status]);
    porStatus[status] = (porStatus[status] || 0) + 1;
    if (!isAberta(status)) return;
    abertas.push({
      row: DATA_START + i,
      num: String(num),
      nome: String(row[COL.nome] || ''),
      data: String(row[COL.data] || ''),
      hora: String(row[COL.hora] || ''),
      status: status,
    });
  });

  console.log('Planilha:', spreadsheetUrl(ZAPCLIN_SS_ID));
  console.log('Totais por status:', JSON.stringify(porStatus));
  console.log('OS abertas (fila Operação):', abertas.length);
  abertas.slice(0, 20).forEach((c) => {
    console.log('  OS', pad2(c.num), c.status, c.nome, c.data, c.hora, 'linha', c.row);
  });
  if (abertas.length > 20) console.log('  ... +' + (abertas.length - 20));

  if (dry) {
    console.log('\nDRY-RUN. Nada gravado. Para fechar:');
    console.log('  node fechar-os-abertas.js --i-know-what-im-doing');
    return;
  }

  if (!abertas.length) {
    console.log('Nada a fechar.');
    return;
  }

  const data = abertas.map((c) => [c.row, 'Entregue', now.dataPag, now.encerradoEm]);
  // batchUpdate por linha: J, L, N
  const dataPayload = abertas.map((c) => ({
    range: "'" + ABA + "'!J" + c.row + ':J' + c.row,
    values: [['Entregue']],
  })).concat(abertas.map((c) => ({
    range: "'" + ABA + "'!L" + c.row + ':L' + c.row,
    values: [[now.dataPag]],
  }))).concat(abertas.map((c) => ({
    range: "'" + ABA + "'!N" + c.row + ':N' + c.row,
    values: [[now.encerradoEm]],
  })));

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: ZAPCLIN_SS_ID,
    requestBody: {
      valueInputOption: 'USER_ENTERED',
      data: dataPayload,
    },
  });

  console.log('\nFechadas', abertas.length, 'OS como Entregue em', now.encerradoEm);
  console.log('WhatsApp NÃO disparado. Recarregar Operação no PWA (?force=v4.35.0).');
}

main().catch((e) => {
  console.error('FALHA:', e.message || e);
  if (e.response && e.response.data) console.error(JSON.stringify(e.response.data, null, 2));
  process.exit(1);
});
