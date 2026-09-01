/**
 * ZapClin — seed OAuth: LANÇAMENTOS 26–30/08/2026 com total fixo R$ 210/dia.
 * SEED_VERSION=1
 *
 * Dias sem movimento na planilha (buraco 26–30/08).
 * Totais alvo: 26/08=210 | 27/08=210 | 28/08=210 | 29/08=210 | 30/08=210
 *
 * Mesma estratégia do seed 01–25: preserva OS (clienteId), ajusta avulsos ou append.
 *
 * Uso:
 *   node scripts/oauth-sheets/seed-lancamentos-ago26-30.js --dry-run
 *   node scripts/oauth-sheets/seed-lancamentos-ago26-30.js --i-know-what-im-doing
 */
'use strict';

const SEED_VERSION = 1;

const path = require('path');
const {
  ZAPCLIN_SS_ID,
  getSheetsClient,
  spreadsheetUrl,
} = require(path.join(__dirname, 'oauth-client.js'));

const WEB_APP =
  'https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec';

const ABA = '📊 LANÇAMENTOS';
const DATA_START = 10;
const YEAR = 2026;

const TARGETS = [
  { dia: 26, mes: 8, total: 210 },
  { dia: 27, mes: 8, total: 210 },
  { dia: 28, mes: 8, total: 210 },
  { dia: 29, mes: 8, total: 210 },
  { dia: 30, mes: 8, total: 210 },
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

function splitRandomInt(target) {
  if (target === 0) return [];
  if (target < 0) throw new Error('target negativo: ' + target);

  function dfs(remain, acc) {
    if (remain === 0) return acc;
    const opts = shuffle(SERVICOS.filter((s) => s.price <= remain));
    for (const s of opts) {
      const got = dfs(remain - s.price, acc.concat([s]));
      if (got) return got;
    }
    return null;
  }

  for (let attempt = 0; attempt < 500; attempt++) {
    const got = dfs(target, []);
    if (got) return got;
  }
  throw new Error('Nao foi possivel particionar R$ ' + target + ' com o catalogo');
}

function splitToTarget(target) {
  const t = Math.round(Number(target) * 100) / 100;
  if (t === 0) return [];
  const floor = Math.floor(t + 1e-9);
  const parts = splitRandomInt(floor).map((s) => ({ name: s.name, price: s.price }));
  const sum = parts.reduce((s, x) => s + x.price, 0);
  const diff = Math.round((t - sum) * 100) / 100;
  if (Math.abs(diff) >= 0.005) {
    if (!parts.length) {
      parts.push({ name: 'Higienização Rápida', price: t });
    } else {
      const last = parts[parts.length - 1];
      last.price = Math.round((last.price + diff) * 100) / 100;
    }
  }
  return parts;
}

function randomHora() {
  const h = 9 + Math.floor(Math.random() * 11);
  const m = [0, 10, 15, 20, 30, 40, 45, 50][Math.floor(Math.random() * 8)];
  return pad2(h) + ':' + pad2(m);
}

function money(n) {
  return Number(n).toFixed(2);
}

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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

function gasQuery(params) {
  return Object.keys(params)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(String(params[k])))
    .join('&');
}

async function gasCall(action, params, timeoutMs) {
  const url = WEB_APP + '?' + gasQuery(Object.assign({ action: action }, params || {}));
  const delays = [0, 4000, 8000, 16000, 32000];
  let lastErr;
  for (let i = 0; i < delays.length; i++) {
    if (delays[i]) {
      console.log('  retry', action, 'em', delays[i] / 1000 + 's');
      await sleep(delays[i]);
    }
    const ac = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const t = setTimeout(function () {
      if (ac) ac.abort();
    }, timeoutMs || 60000);
    try {
      const res = await fetch(url, ac ? { redirect: 'follow', signal: ac.signal } : { redirect: 'follow' });
      const text = await res.text();
      clearTimeout(t);
      let json;
      try {
        json = JSON.parse(text);
      } catch (parseErr) {
        throw new Error('GAS nao-JSON (' + res.status + '): ' + String(text).slice(0, 180));
      }
      if (json && json.ok === false) throw new Error(json.error || 'ok=false');
      return json;
    } catch (e) {
      clearTimeout(t);
      lastErr = e;
      console.error('  GAS', action, 'falhou:', e.message || e);
    }
  }
  throw lastErr;
}

function argValue(flag) {
  const eq = process.argv.find((a) => a.indexOf(flag + '=') === 0);
  if (eq) return eq.slice(flag.length + 1);
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
}

function todayKeySaoPaulo(d) {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const parts = fmt.formatToParts(d || new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  return get('day') + '/' + get('month') + '/' + get('year');
}

function summarizeGasItems(items, targetKeys) {
  const byDay = {};
  for (const k of Object.keys(targetKeys)) byDay[k] = { totalAtivo: 0, rows: [] };
  let maxRow = DATA_START - 1;
  for (const it of items || []) {
    const sheetRow = parseInt(it.row, 10) || 0;
    if (sheetRow > maxRow) maxRow = sheetRow;
    const data = parseDataCell(it.data);
    const svc = it.svc || '';
    const valor = parseMoney(it.val);
    const clienteId = String(it.clienteId || '').trim();
    const cancel = !!(it.cancelado || isCancelado(svc));
    if (!data || !(data in byDay)) continue;
    if (!cancel) byDay[data].totalAtivo += valor;
    byDay[data].rows.push({
      sheetRow: sheetRow,
      svc: svc,
      data: data,
      hora: it.hora || '',
      qtd: parseInt(it.qtd, 10) || 1,
      valor: valor,
      cancel: cancel,
      clienteId: clienteId,
    });
  }
  return { byDay: byDay, maxRow: maxRow };
}

function buildPlan(byDay) {
  const plan = [];
  for (const t of TARGETS) {
    const key = dataKey(t.dia, t.mes, YEAR);
    const cur = byDay[key] || { totalAtivo: 0, rows: [] };
    const ativos = cur.rows.filter((x) => !x.cancel);
    const osRows = ativos.filter((x) => x.clienteId);
    const avulso = ativos.filter((x) => !x.clienteId);
    const atual = round2(cur.totalAtivo);
    const gap = round2(t.total - atual);
    const alreadyOk = Math.abs(gap) < 0.02;
    let parts = [];
    let editRow = null;
    let note = '';

    if (alreadyOk) {
      note = 'OK — sem escrita';
    } else if (osRows.length && atual > t.total + 0.02) {
      throw new Error(
        key + ': total OS (' + money(osRows.reduce((s, x) => s + x.valor, 0)) + ') acima do alvo — nao cancelo OS'
      );
    } else if (Math.abs(gap) < 15 && avulso.length) {
      const candidate = avulso[avulso.length - 1];
      const newVal = round2(candidate.valor + gap);
      if (newVal < 0.01) throw new Error(key + ': ajuste invalido');
      editRow = { row: candidate, newVal: newVal };
      note = 'editar row ' + candidate.sheetRow;
    } else if (gap > 0) {
      parts = splitToTarget(gap);
      note = 'append ' + parts.length + ' svcs (+' + money(gap) + ')';
    } else {
      throw new Error(key + ': gap ' + money(gap) + ' sem estrategia segura');
    }

    plan.push({ key, target: t.total, atual, gap, parts, editRow, alreadyOk, note });
  }
  return plan;
}

async function runViaGas(dry) {
  console.log('via=GAS');
  const ping = await gasCall('ping', {}, 20000);
  console.log('ping', JSON.stringify({ ok: ping.ok, version: ping.version }));

  const listed = await gasCall('listar', {}, 90000);
  const targetKeys = {};
  for (const t of TARGETS) targetKeys[dataKey(t.dia, t.mes, YEAR)] = t.total;
  const { byDay, maxRow } = summarizeGasItems(listed.items || [], targetKeys);
  const plan = buildPlan(byDay);

  console.log('Estado ATUAL vs ALVO:');
  for (const p of plan) {
    console.log('  ' + p.key + '  atual=' + money(p.atual) + '  alvo=' + money(p.target) + '  ' + p.note);
  }

  if (dry) {
    console.log('\n[dry-run] nada gravado.');
    return;
  }

  let nextMaxRow = maxRow;
  const today = todayKeySaoPaulo();
  console.log('Hoje (America/Sao_Paulo):', today);

  for (const p of plan) {
    if (p.alreadyOk) continue;

    if (p.editRow) {
      const r = p.editRow.row;
      await gasCall('editarLancamento', { row: r.sheetRow, svc: r.svc, val: p.editRow.newVal, data: p.key }, 30000);
      console.log('Editado', p.key, 'row', r.sheetRow);
      await sleep(400);
      continue;
    }

    if (!p.parts.length) continue;
    const svcs = p.parts.map((s) => s.name).join('|');
    const vals = p.parts.map((s) => s.price).join('|');
    await gasCall('salvar', { svcs: svcs, vals: vals }, 90000);
    await sleep(500);

    const after = await gasCall('listar', {}, 90000);
    const fresh = (after.items || []).filter((it) => {
      const row = parseInt(it.row, 10) || 0;
      const data = parseDataCell(it.data);
      const cancel = !!(it.cancelado || isCancelado(it.svc));
      const cli = String(it.clienteId || '').trim();
      return row > nextMaxRow && !cancel && !cli && data === today;
    });
    fresh.sort((a, b) => (a.row || 0) - (b.row || 0));
    if (fresh.length !== p.parts.length) {
      throw new Error('salvar ' + p.key + ': linhas novas inesperadas');
    }

    for (let i = 0; i < fresh.length; i++) {
      const it = fresh[i];
      const part = p.parts[i];
      const row = parseInt(it.row, 10);
      await gasCall('editarLancamento', { row: row, svc: part.name, val: part.price, data: p.key }, 30000);
      if (row > nextMaxRow) nextMaxRow = row;
      await sleep(250);
    }
    console.log('Append+data', p.key, fresh.length, 'linhas');
  }

  const check = await gasCall('listar', {}, 90000);
  const { byDay: afterDays } = summarizeGasItems(check.items || [], targetKeys);
  console.log('\nTotais DEPOIS:');
  let ok = true;
  for (const t of TARGETS) {
    const key = dataKey(t.dia, t.mes, YEAR);
    const got = round2((afterDays[key] && afterDays[key].totalAtivo) || 0);
    const pass = Math.abs(got - t.total) < 0.02;
    if (!pass) ok = false;
    console.log('  ' + key + '  ' + money(got) + (pass ? '  OK' : '  FALHOU'));
  }
  if (!ok) process.exit(1);
  console.log('\nSeed 26–30/08 concluído (via GAS).');
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

async function ensureGridRows(sheets, sheetId, minRows) {
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: ZAPCLIN_SS_ID,
    fields: 'sheets.properties',
  });
  let current = 0;
  for (const s of meta.data.sheets || []) {
    if (s.properties.sheetId === sheetId) {
      current = (s.properties.gridProperties && s.properties.gridProperties.rowCount) || 0;
    }
  }
  const want = Math.max(minRows, 2000);
  if (current >= want) return;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: ZAPCLIN_SS_ID,
    requestBody: {
      requests: [{ appendDimension: { sheetId, dimension: 'ROWS', length: want - current } }],
    },
  });
}

async function main() {
  console.log('seed-lancamentos-ago26-30 SEED_VERSION=' + SEED_VERSION);
  const dry = process.argv.includes('--dry-run');
  const force = process.argv.includes('--i-know-what-im-doing');
  if (!dry && !force) {
    console.error('Passe --dry-run ou --i-know-what-im-doing');
    process.exit(2);
  }

  const viaArg = argValue('--via');
  if (viaArg === 'gas') {
    await runViaGas(dry);
    return;
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

  console.log('Estado ATUAL vs ALVO:');
  const plan = [];
  for (const t of TARGETS) {
    const key = dataKey(t.dia, t.mes, YEAR);
    const cur = byDay[key] || { totalAtivo: 0, rows: [] };
    const ativos = cur.rows.filter((x) => !x.cancel);
    console.log(
      '  ' + key + '  atual=' + money(cur.totalAtivo) + '  alvo=' + money(t.total) + '  linhasAtivas=' + ativos.length
    );
    const parts = splitToTarget(t.total);
    plan.push({ key, target: t.total, cancelRows: ativos, parts });
  }

  let toAdd = 0;
  for (const p of plan) toAdd += p.parts.length;
  console.log('\nPlano: append', toAdd, 'linhas novas');

  if (dry) {
    for (const p of plan) {
      console.log('\n' + p.key + ' → ' + p.parts.length + ' svcs (soma ' + money(p.target) + '):');
      const counts = {};
      for (const s of p.parts) {
        const k = s.name + ' @' + money(s.price);
        counts[k] = (counts[k] || 0) + 1;
      }
      for (const [n, c] of Object.entries(counts)) console.log('   ', c + '×', n);
    }
    console.log('\n[dry-run] nada gravado.');
    return;
  }

  const newRows = [];
  let nextNum = maxNum;
  for (const p of plan) {
    const shuffled = shuffle(p.parts);
    for (const s of shuffled) {
      nextNum += 1;
      newRows.push([nextNum, s.name, p.key, randomHora(), 1, s.price]);
    }
  }

  const meta = await sheets.spreadsheets.values.get({
    spreadsheetId: ZAPCLIN_SS_ID,
    range: "'" + ABA + "'!C:C",
  });
  const colC = meta.data.values || [];
  let lastUsed = DATA_START - 1;
  for (let i = DATA_START - 1; i < colC.length; i++) {
    if (colC[i] && colC[i][0]) lastUsed = i + 1;
  }
  const appendRow = lastUsed + 1;
  const sheetId = await getSheetGid(sheets);
  const endRow = appendRow + newRows.length - 1;
  await ensureGridRows(sheets, sheetId, endRow + 50);

  await sheets.spreadsheets.values.update({
    spreadsheetId: ZAPCLIN_SS_ID,
    range: "'" + ABA + "'!B" + appendRow + ':G' + endRow,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: newRows },
  });
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: ZAPCLIN_SS_ID,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: {
              sheetId,
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

  console.log('\nTotais DEPOIS (26–30):');
  let ok = true;
  for (const t of TARGETS) {
    const key = dataKey(t.dia, t.mes, YEAR);
    const got = Math.round(totals[key] * 100) / 100;
    const pass = Math.abs(got - t.total) < 0.02;
    if (!pass) ok = false;
    console.log('  ' + key + '  ' + money(got) + (pass ? '  OK' : '  FALHOU'));
  }
  console.log('URL:', spreadsheetUrl(ZAPCLIN_SS_ID));
  if (!ok) process.exit(1);
  console.log('\nSeed 26–30/08 concluído.');
}

main().catch((e) => {
  console.error('FALHA:', e.message || e);
  if (e.response && e.response.data) console.error(JSON.stringify(e.response.data, null, 2));
  process.exit(1);
});
