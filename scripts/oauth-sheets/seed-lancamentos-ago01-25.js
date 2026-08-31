/**
 * ZapClin — seed OAuth: LANÇAMENTOS 01–25/08/2026 com totais fixos.
 * SEED_VERSION=1
 *
 * Totais alvo (valor ativo, exclui CANCELADO) — BR comma → float:
 *   01/08=270 | 02/08=341 | 03/08=387 | 04/08=429 | 05/08=90
 *   06/08=108 | 07/08=378.08 | 08/08=211 | 09/08=160 | 10/08=375
 *   11/08=371 | 12/08=345 | 13/08=432.81 | 14/08=213 | 15/08=486
 *   16/08=163 | 17/08=393 | 18/08=113 | 19/08=366 | 20/08=225
 *   21/08=288 | 22/08=429 | 23/08=255 | 24/08=346 | 25/08=168
 *
 * Correções vs seed 01–13 (SEED_VERSION=1 daquele script):
 *   02/08 341.90 → 341 | 03/08 387.08 → 387
 *
 * Estratégia: cancela linhas ativas desses dias e append de serviços
 * do catálogo somando o alvo (centavos no último item se necessário).
 *
 * Uso (PowerShell, pasta google-drive-sheets-auth):
 *   node seed-lancamentos-ago01-25.js --dry-run
 *   node seed-lancamentos-ago01-25.js --i-know-what-im-doing
 *
 * Cloud (com GOOGLE_CLIENT_ID / SECRET / REFRESH_TOKEN):
 *   node scripts/oauth-sheets/seed-lancamentos-ago01-25.js --i-know-what-im-doing
 *
 * Se OAuth der invalid_grant, o script cai no caminho GAS (listar/salvar/editar),
 * o mesmo GET+query do PWA. Preserve linhas com clienteId (OS reais).
 * Forçar: --via=gas   |   forçar OAuth: --via=oauth
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
  { dia: 1, mes: 8, total: 270 },
  { dia: 2, mes: 8, total: 341 },
  { dia: 3, mes: 8, total: 387 },
  { dia: 4, mes: 8, total: 429 },
  { dia: 5, mes: 8, total: 90 },
  { dia: 6, mes: 8, total: 108 },
  { dia: 7, mes: 8, total: 378.08 },
  { dia: 8, mes: 8, total: 211 },
  { dia: 9, mes: 8, total: 160 },
  { dia: 10, mes: 8, total: 375 },
  { dia: 11, mes: 8, total: 371 },
  { dia: 12, mes: 8, total: 345 },
  { dia: 13, mes: 8, total: 432.81 },
  { dia: 14, mes: 8, total: 213 },
  { dia: 15, mes: 8, total: 486 },
  { dia: 16, mes: 8, total: 163 },
  { dia: 17, mes: 8, total: 393 },
  { dia: 18, mes: 8, total: 113 },
  { dia: 19, mes: 8, total: 366 },
  { dia: 20, mes: 8, total: 225 },
  { dia: 21, mes: 8, total: 288 },
  { dia: 22, mes: 8, total: 429 },
  { dia: 23, mes: 8, total: 255 },
  { dia: 24, mes: 8, total: 346 },
  { dia: 25, mes: 8, total: 168 },
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

/** Particiona inteiro com preços do catálogo. */
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

/**
 * Alvo pode ter centavos (ex. 378.08). Catálogo é inteiro →
 * particiona floor(alvo) e ajusta o preço do último item.
 */
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
  let maxNum = 0;
  for (const it of items || []) {
    const sheetRow = parseInt(it.row, 10) || 0;
    if (sheetRow > maxRow) maxRow = sheetRow;
    const num = parseInt(it.num, 10) || 0;
    if (num > maxNum) maxNum = num;
    const data = parseDataCell(it.data);
    const svc = it.svc || '';
    const valor = parseMoney(it.val);
    const clienteId = String(it.clienteId || '').trim();
    const cancel = !!(it.cancelado || isCancelado(svc));
    if (!data || !(data in byDay)) continue;
    if (!cancel) byDay[data].totalAtivo += valor;
    byDay[data].rows.push({
      sheetRow: sheetRow,
      num: num,
      svc: svc,
      data: data,
      hora: it.hora || '',
      qtd: parseInt(it.qtd, 10) || 1,
      valor: valor,
      cancel: cancel,
      clienteId: clienteId,
    });
  }
  return { byDay: byDay, maxRow: maxRow, maxNum: maxNum };
}

function buildPlan(byDay, targetKeys) {
  const plan = [];
  for (const t of TARGETS) {
    const key = dataKey(t.dia, t.mes, YEAR);
    const cur = byDay[key] || { totalAtivo: 0, rows: [] };
    const ativos = cur.rows.filter((x) => !x.cancel);
    const osRows = ativos.filter((x) => x.clienteId);
    const avulso = ativos.filter((x) => !x.clienteId);
    const osTotal = round2(osRows.reduce((s, x) => s + x.valor, 0));
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
        key +
          ': total OS (' +
          money(osTotal) +
          ') acima do alvo ' +
          money(t.total) +
          ' — nao cancelo OS'
      );
    } else if (Math.abs(gap) < 15 && avulso.length) {
      const withCents = avulso.filter((r) => Math.abs(r.valor - Math.round(r.valor)) >= 0.005);
      const candidate =
        withCents.find((r) => round2(r.valor + gap) >= 0.01) ||
        avulso.find((r) => round2(r.valor + gap) >= 0.01) ||
        avulso[avulso.length - 1];
      const newVal = round2(candidate.valor + gap);
      if (newVal < 0.01) {
        throw new Error(key + ': ajuste de centavos deixaria valor invalido');
      }
      editRow = { row: candidate, newVal: newVal };
      note = 'editar row ' + candidate.sheetRow + ' ' + money(candidate.valor) + ' → ' + money(newVal);
    } else if (gap > 0) {
      parts = splitToTarget(gap);
      const partsSum = round2(parts.reduce((s, x) => s + x.price, 0));
      if (Math.abs(partsSum - gap) >= 0.02) {
        throw new Error('Particao falhou ' + key + ': ' + partsSum + ' != ' + gap);
      }
      note =
        'append ' +
        parts.length +
        ' svcs (+' +
        money(gap) +
        ')' +
        (osRows.length ? ' — preserva ' + osRows.length + ' OS' : '');
    } else {
      throw new Error(key + ': gap ' + money(gap) + ' sem estrategia segura (OS=' + osRows.length + ')');
    }

    plan.push({
      key: key,
      target: t.total,
      atual: atual,
      gap: gap,
      osRows: osRows,
      avulso: avulso,
      parts: parts,
      editRow: editRow,
      alreadyOk: alreadyOk,
      note: note,
    });
  }
  return plan;
}

async function runViaGas(dry) {
  console.log('via=GAS  WEB_APP ping…');
  const ping = await gasCall('ping', {}, 20000);
  console.log('ping', JSON.stringify({ ok: ping.ok, version: ping.version }));

  const listed = await gasCall('listar', {}, 90000);
  const items = listed.items || [];
  const targetKeys = {};
  for (const t of TARGETS) targetKeys[dataKey(t.dia, t.mes, YEAR)] = t.total;
  const { byDay, maxRow } = summarizeGasItems(items, targetKeys);
  const plan = buildPlan(byDay, targetKeys);

  console.log('Estado ATUAL (ativos) vs ALVO:');
  for (const p of plan) {
    console.log(
      '  ' +
        p.key +
        '  atual=' +
        money(p.atual) +
        '  alvo=' +
        money(p.target) +
        '  gap=' +
        money(p.gap) +
        '  ' +
        p.note
    );
  }

  const toAdd = plan.reduce((s, p) => s + p.parts.length, 0);
  const toEdit = plan.filter((p) => p.editRow).length;
  const skip = plan.filter((p) => p.alreadyOk).length;
  console.log('\nPlano GAS: skip', skip, 'dias · editar', toEdit, '· append', toAdd, 'linhas');

  if (dry) {
    for (const p of plan) {
      if (p.alreadyOk) continue;
      console.log('\n' + p.key + '  ' + p.note);
      if (p.editRow) {
        console.log(
          '   row',
          p.editRow.row.sheetRow,
          p.editRow.row.svc,
          money(p.editRow.row.valor),
          '→',
          money(p.editRow.newVal)
        );
      }
      if (p.parts.length) {
        const counts = {};
        for (const s of p.parts) {
          const k = s.name + ' @' + money(s.price);
          counts[k] = (counts[k] || 0) + 1;
        }
        for (const [n, c] of Object.entries(counts)) console.log('   ', c + '×', n);
      }
    }
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
      const resp = await gasCall(
        'editarLancamento',
        { row: r.sheetRow, svc: r.svc, val: p.editRow.newVal, data: p.key },
        30000
      );
      if (!resp || !resp.ok) throw new Error('editarLancamento falhou ' + p.key + ' row ' + r.sheetRow);
      console.log('Editado', p.key, 'row', r.sheetRow, money(r.valor), '→', money(p.editRow.newVal));
      await sleep(400);
      continue;
    }

    if (!p.parts.length) continue;
    const svcs = p.parts.map((s) => s.name).join('|');
    const vals = p.parts.map((s) => s.price).join('|');
    const saved = await gasCall('salvar', { svcs: svcs, vals: vals }, 90000);
    if (!saved || !saved.ok) throw new Error('salvar falhou ' + p.key);
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
      throw new Error(
        'salvar ' +
          p.key +
          ': esperava ' +
          p.parts.length +
          ' linhas novas em ' +
          today +
          ', vim ' +
          fresh.length +
          ' (maxRow era ' +
          nextMaxRow +
          ')'
      );
    }

    for (let i = 0; i < fresh.length; i++) {
      const it = fresh[i];
      const part = p.parts[i];
      const row = parseInt(it.row, 10);
      const resp = await gasCall(
        'editarLancamento',
        { row: row, svc: part.name, val: part.price, data: p.key },
        30000
      );
      if (!resp || !resp.ok) throw new Error('editarLancamento falhou ' + p.key + ' row ' + row);
      if (row > nextMaxRow) nextMaxRow = row;
      await sleep(250);
    }
    console.log('Append+data', p.key, fresh.length, 'linhas (rows', fresh[0].row, '–', fresh[fresh.length - 1].row + ')');
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
    console.log('  ' + key + '  ' + money(got) + (pass ? '  OK' : '  FALHOU (alvo ' + money(t.total) + ')'));
  }
  console.log('URL:', spreadsheetUrl(ZAPCLIN_SS_ID));
  if (!ok) process.exit(1);
  console.log('\nSeed LANÇAMENTOS 01–25/08 concluído (via GAS).');
}

async function main() {
  console.log('seed-lancamentos-ago01-25 SEED_VERSION=' + SEED_VERSION);
  const dry = process.argv.includes('--dry-run');
  const force = process.argv.includes('--i-know-what-im-doing');
  if (!dry && !force) {
    console.error('Passe --dry-run (simular) ou --i-know-what-im-doing (gravar).');
    process.exit(2);
  }

  const viaArg = argValue('--via');
  const preferGas = viaArg === 'gas';
  const preferOauth = viaArg === 'oauth';

  if (!preferOauth) {
    if (preferGas) {
      await runViaGas(dry);
      return;
    }
    try {
      getSheetsClient();
    } catch (e) {
      console.warn('OAuth indisponivel (' + (e.message || e) + ') — caindo para GAS');
      await runViaGas(dry);
      return;
    }
  }

  const sheets = getSheetsClient();
  const rangeRead = "'" + ABA + "'!B" + DATA_START + ":G";
  let res;
  try {
    res = await sheets.spreadsheets.values.get({
      spreadsheetId: ZAPCLIN_SS_ID,
      range: rangeRead,
      valueRenderOption: 'FORMATTED_VALUE',
    });
  } catch (e) {
    const msg = String((e && e.message) || e);
    if (!preferOauth && /invalid_grant|invalid_client|unauthorized|Token/i.test(msg)) {
      console.warn('OAuth falhou (' + msg + ') — caindo para GAS');
      await runViaGas(dry);
      return;
    }
    throw e;
  }
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
    const parts = splitToTarget(t.total);
    const partsSum = Math.round(parts.reduce((s, x) => s + x.price, 0) * 100) / 100;
    if (Math.abs(partsSum - t.total) >= 0.02) {
      throw new Error('Particao falhou ' + key + ': ' + partsSum + ' != ' + t.total);
    }
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

  const newRows = [];
  let nextNum = maxNum;
  for (const p of plan) {
    const shuffled = shuffle(p.parts);
    for (const s of shuffled) {
      nextNum += 1;
      newRows.push([nextNum, s.name, p.key, randomHora(), 1, s.price]);
    }
  }

  if (newRows.length) {
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
      range: "'" + ABA + "'!B" + appendRow + ":G" + endRow,
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
  }

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
    const pass = Math.abs(got - t.total) < 0.02;
    if (!pass) ok = false;
    console.log('  ' + key + '  ' + money(got) + (pass ? '  OK' : '  FALHOU (alvo ' + money(t.total) + ')'));
  }
  console.log('URL:', spreadsheetUrl(ZAPCLIN_SS_ID));
  if (!ok) process.exit(1);
  console.log('\nSeed LANÇAMENTOS 01–25/08 concluído.');
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
  async function readRowCount() {
    const meta = await sheets.spreadsheets.get({
      spreadsheetId: ZAPCLIN_SS_ID,
      fields: 'sheets.properties',
    });
    for (const s of meta.data.sheets || []) {
      if (s.properties.sheetId === sheetId) {
        return (s.properties.gridProperties && s.properties.gridProperties.rowCount) || 0;
      }
    }
    return 0;
  }

  const current = await readRowCount();
  const want = Math.max(minRows, 2000);
  if (current >= want) {
    console.log('Grade OK: rowCount=' + current);
    return;
  }

  const missing = want - current;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: ZAPCLIN_SS_ID,
    requestBody: {
      requests: [
        {
          appendDimension: {
            sheetId,
            dimension: 'ROWS',
            length: missing,
          },
        },
      ],
    },
  });

  let after = await readRowCount();
  if (after < minRows) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: ZAPCLIN_SS_ID,
      requestBody: {
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId,
                gridProperties: { rowCount: want },
              },
              fields: 'gridProperties.rowCount',
            },
          },
        ],
      },
    });
    after = await readRowCount();
  }

  console.log('Grade expandida: rowCount', current, '→', after, '(alvo', want + ')');
  if (after < minRows) {
    throw new Error('Falha ao expandir grade: rowCount=' + after + ' < minRows=' + minRows);
  }
}

main().catch((e) => {
  console.error('FALHA:', e.message || e);
  if (e.response && e.response.data) console.error(JSON.stringify(e.response.data, null, 2));
  process.exit(1);
});
