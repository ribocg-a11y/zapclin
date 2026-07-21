/**
 * ZapClin — seed OAuth: LANÇAMENTOS 14–20/07/2026 com totais fixos.
 *
 * Totais alvo (valor ativo, exclui CANCELADO):
 *   14/07 = 349 | 15/07 = 365 | 16/07 = 435 | 17/07 = 476
 *   18/07 = 565 | 19/07 = 0   | 20/07 = 274
 *
 * Estratégia: cancela linhas ativas desses dias e append de serviços
 * aleatórios do catálogo (preços oficiais) somando exatamente o alvo.
 *
 * Uso (PowerShell, pasta google-drive-sheets-auth):
 *   node seed-lancamentos-jul14-20.js --dry-run
 *   node seed-lancamentos-jul14-20.js --i-know-what-im-doing
 */
'use strict';

const path = require('path');
const {
  ZAPCLIN_SS_ID,
  getSheetsClient,
  spreadsheetUrl,
} = require(path.join(__dirname, 'oauth-client.js'));

const ABA = '📊 LANÇAMENTOS';
const DATA_START = 10;
const YEAR = 2026;

const TARGETS = [
  { dia: 14, mes: 7, total: 349 },
  { dia: 15, mes: 7, total: 365 },
  { dia: 16, mes: 7, total: 435 },
  { dia: 17, mes: 7, total: 476 },
  { dia: 18, mes: 7, total: 565 },
  { dia: 19, mes: 7, total: 0 },
  { dia: 20, mes: 7, total: 274 },
];

const SERVICOS = [
  { name: 'Higienização Rápida', price: 15 },
  { name: 'Higienização Essencial', price: 18 },
  { name: 'Higienização Profunda', price: 23 },
  { name: 'Limpeza + Higienização', price: 30 },
  { name: 'Higienização + Lavagem', price: 45 },
  { name: 'Revitalização Premium', price: 70 },
];

function pad2(n) {
  return String(n).padStart(2, '0');
}

function dataKey(dia, mes, ano) {
  return pad2(dia) + '/' + pad2(mes) + '/' + ano;
}

function parseDataCell(raw) {
  if (raw == null || raw === '') return null;
  if (raw instanceof Date && !isNaN(raw.getTime())) {
    return dataKey(raw.getDate(), raw.getMonth() + 1, raw.getFullYear());
  }
  const s = String(raw).trim();
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) return dataKey(+m[1], +m[2], +m[3]);
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return dataKey(+m[3], +m[2], +m[1]);
  // serial Sheets (dias desde 1899-12-30) — raro com FORMATTED_VALUE
  if (/^\d+(\.\d+)?$/.test(s)) {
    const n = parseFloat(s);
    if (n > 40000 && n < 60000) {
      const epoch = Date.UTC(1899, 11, 30) + Math.round(n) * 86400000;
      const d = new Date(epoch);
      return dataKey(d.getUTCDate(), d.getUTCMonth() + 1, d.getUTCFullYear());
    }
  }
  return null;
}

function isCancelado(svc) {
  return /^CANCELADO\b/i.test(String(svc || ''));
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

/** Partição aleatória em preços do catálogo que soma exatamente `target`. */
function splitRandom(target) {
  if (target === 0) return [];
  if (target < 0) throw new Error('target negativo: ' + target);

  function dfs(remain, acc) {
    if (remain === 0) return acc;
    const opts = shuffle(SERVICOS.filter((s) => s.price <= remain));
    for (const s of opts) {
      const next = acc.concat([s]);
      // poda: se restar valor menor que o menor preço e != 0, falha
      const got = dfs(remain - s.price, next);
      if (got) return got;
    }
    return null;
  }

  for (let attempt = 0; attempt < 400; attempt++) {
    const got = dfs(target, []);
    if (got) return got;
  }
  throw new Error('Nao foi possivel particionar R$ ' + target + ' com o catalogo');
}

function randomHora() {
  const h = 9 + Math.floor(Math.random() * 11); // 09–19
  const m = [0, 10, 15, 20, 30, 40, 45, 50][Math.floor(Math.random() * 8)];
  return pad2(h) + ':' + pad2(m);
}

function money(n) {
  return Number(n).toFixed(2);
}

/** Aceita number, "70", "70,00", "R$ 1.050,00". */
function parseMoney(raw) {
  if (typeof raw === 'number') return raw;
  const cleaned = String(raw || '')
    .replace(/R\$\s?/gi, '')
    .trim();
  if (!cleaned) return 0;
  if (cleaned.indexOf(',') >= 0) {
    return parseFloat(cleaned.replace(/\./g, '').replace(',', '.')) || 0;
  }
  return parseFloat(cleaned) || 0;
}

async function main() {
  const dry = process.argv.includes('--dry-run');
  const force = process.argv.includes('--i-know-what-im-doing');
  if (!dry && !force) {
    console.error('Passe --dry-run (simular) ou --i-know-what-im-doing (gravar).');
    process.exit(2);
  }

  const sheets = getSheetsClient();
  const rangeRead = "'" + ABA + "'!B" + DATA_START + ":G";
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: ZAPCLIN_SS_ID,
    range: rangeRead,
    valueRenderOption: 'FORMATTED_VALUE',
  });
  const rows = res.data.values || [];

  const targetKeys = {};
  for (const t of TARGETS) targetKeys[dataKey(t.dia, t.mes, YEAR)] = t.total;

  const byDay = {};
  for (const k of Object.keys(targetKeys)) byDay[k] = { totalAtivo: 0, rows: [] };

  let maxNum = 0;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const sheetRow = DATA_START + i;
    const num = parseInt(r[0], 10) || 0;
    if (num > maxNum) maxNum = num;
    const svc = r[1] || '';
    const data = parseDataCell(r[2]);
    const hora = r[3] || '';
    const qtd = parseInt(r[4], 10) || 0;
    const valor = parseMoney(r[5]);

    if (!data || !(data in byDay)) continue;
    const cancel = isCancelado(svc);
    if (!cancel) byDay[data].totalAtivo += valor;
    byDay[data].rows.push({ sheetRow, num, svc, data, hora, qtd, valor, cancel });
  }

  console.log('Estado ATUAL (ativos) vs ALVO:');
  const plan = [];
  for (const t of TARGETS) {
    const key = dataKey(t.dia, t.mes, YEAR);
    const cur = byDay[key] || { totalAtivo: 0, rows: [] };
    const ativos = cur.rows.filter((x) => !x.cancel);
    console.log(
      '  ' +
        key +
        '  atual=' +
        money(cur.totalAtivo) +
        '  alvo=' +
        money(t.total) +
        '  linhasAtivas=' +
        ativos.length
    );
    const parts = splitRandom(t.total);
    plan.push({ key, target: t.total, cancelRows: ativos, parts });
  }

  let toCancel = 0;
  let toAdd = 0;
  let sumNew = 0;
  for (const p of plan) {
    toCancel += p.cancelRows.length;
    toAdd += p.parts.length;
    sumNew += p.parts.reduce((s, x) => s + x.price, 0);
  }
  console.log('\nPlano: cancelar', toCancel, 'linhas + append', toAdd, 'novas (R$', money(sumNew) + ')');

  if (dry) {
    for (const p of plan) {
      console.log('\n' + p.key + ' → ' + p.parts.length + ' svcs:');
      const counts = {};
      for (const s of p.parts) counts[s.name] = (counts[s.name] || 0) + 1;
      for (const [n, c] of Object.entries(counts)) console.log('   ', c + '×', n);
    }
    console.log('\n[dry-run] nada gravado.');
    return;
  }

  // 1) Cancelar ativos dos dias-alvo
  const dataCalls = [];
  for (const p of plan) {
    for (const row of p.cancelRows) {
      const novoSvc = /^CANCELADO\b/i.test(row.svc) ? row.svc : 'CANCELADO - ' + row.svc;
      dataCalls.push({
        range: "'" + ABA + "'!C" + row.sheetRow + ":G" + row.sheetRow,
        values: [[novoSvc, row.data, row.hora || '12:00', row.qtd || 1, 0]],
      });
    }
  }
  if (dataCalls.length) {
    // batch em pedaços de 50
    for (let i = 0; i < dataCalls.length; i += 50) {
      const chunk = dataCalls.slice(i, i + 50);
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: ZAPCLIN_SS_ID,
        requestBody: {
          valueInputOption: 'USER_ENTERED',
          data: chunk,
        },
      });
    }
    console.log('Cancelados:', dataCalls.length);
  }

  // 2) Append novos
  const newRows = [];
  let nextNum = maxNum;
  // embaralha ordem dos dias mas mantém horas crescentes leves por dia
  for (const p of plan) {
    const shuffled = shuffle(p.parts);
    for (const s of shuffled) {
      nextNum += 1;
      newRows.push([nextNum, s.name, p.key, randomHora(), 1, s.price]);
    }
  }

  if (newRows.length) {
    // primeira linha vazia em C
    let appendRow = DATA_START + rows.length;
    // se última linha de rows tem serviço, append depois; senão reusa buracos no fim
    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i] && rows[i][1]) {
        appendRow = DATA_START + i + 1;
        break;
      }
      appendRow = DATA_START + i;
    }
    // se planilha tem linhas além do array (vazias), lastRow via API
    const meta = await sheets.spreadsheets.values.get({
      spreadsheetId: ZAPCLIN_SS_ID,
      range: "'" + ABA + "'!C:C",
    });
    const colC = meta.data.values || [];
    let lastUsed = DATA_START - 1;
    for (let i = DATA_START - 1; i < colC.length; i++) {
      if (colC[i] && colC[i][0]) lastUsed = i + 1;
    }
    appendRow = lastUsed + 1;

    await sheets.spreadsheets.values.update({
      spreadsheetId: ZAPCLIN_SS_ID,
      range: "'" + ABA + "'!B" + appendRow + ":G" + (appendRow + newRows.length - 1),
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: newRows },
    });
    // formato R$ na coluna G
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: ZAPCLIN_SS_ID,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: await getSheetGid(sheets),
                startRowIndex: appendRow - 1,
                endRowIndex: appendRow - 1 + newRows.length,
                startColumnIndex: 6,
                endColumnIndex: 7,
              },
              cell: {
                userEnteredFormat: {
                  numberFormat: { type: 'CURRENCY', pattern: 'R$ #,##0.00' },
                },
              },
              fields: 'userEnteredFormat.numberFormat',
            },
          },
        ],
      },
    });
    console.log('Append:', newRows.length, 'linhas a partir da row', appendRow);
  }

  // 3) Verificar
  const check = await sheets.spreadsheets.values.get({
    spreadsheetId: ZAPCLIN_SS_ID,
    range: rangeRead,
    valueRenderOption: 'FORMATTED_VALUE',
  });
  const after = check.data.values || [];
  const totals = {};
  for (const k of Object.keys(targetKeys)) totals[k] = 0;
  for (const r of after) {
    const data = parseDataCell(r[2]);
    if (!data || !(data in totals)) continue;
    if (isCancelado(r[1])) continue;
    totals[data] += parseMoney(r[5]);
  }

  console.log('\nTotais DEPOIS:');
  let ok = true;
  for (const t of TARGETS) {
    const key = dataKey(t.dia, t.mes, YEAR);
    const got = Math.round(totals[key] * 100) / 100;
    const pass = Math.abs(got - t.total) < 0.01;
    if (!pass) ok = false;
    console.log('  ' + key + '  ' + money(got) + (pass ? '  OK' : '  FALHOU (alvo ' + money(t.total) + ')'));
  }
  console.log('URL:', spreadsheetUrl(ZAPCLIN_SS_ID));
  if (!ok) process.exit(1);
  console.log('\nSeed LANÇAMENTOS 14–20/07 concluído.');
}

async function getSheetGid(sheets) {
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: ZAPCLIN_SS_ID,
    fields: 'sheets.properties',
  });
  for (const s of meta.data.sheets || []) {
    if (s.properties.title === ABA) return s.properties.sheetId;
  }
  throw new Error('Aba nao encontrada: ' + ABA);
}

main().catch((e) => {
  console.error('FALHA:', e.message || e);
  if (e.response && e.response.data) console.error(JSON.stringify(e.response.data, null, 2));
  process.exit(1);
});
