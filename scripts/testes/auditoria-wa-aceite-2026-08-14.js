#!/usr/bin/env node
/**
 * Auditoria readonly do fluxo WhatsApp + aceite digital ZapClin.
 * NÃO chama confirmarAceiteOs nem salvarCadastroVip (escritas na planilha).
 *
 * Uso: node scripts/testes/auditoria-wa-aceite-2026-08-14.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const https = require('https');
const http = require('http');
const { URL } = require('url');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../..');
const WEB_APP = 'https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec';
const DEPLOY_ID = 'AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg';
const PAGES = 'https://ribocg-a11y.github.io/zapclin';
const STORE_WA = '5598981479616';
const GOOGLE_REVIEW = 'https://g.page/r/CcTInX7dYxLwEBM/review';
const SITE = 'https://www.zapclinslz.com/';
const IG = 'https://www.instagram.com/zapclinhigienizacao/';
const WRITE_ACTIONS = ['confirmarAceiteOs', 'salvarCadastroVip', 'salvar', 'atualizarStatus'];

const startedAt = new Date().toISOString();
const checks = [];
const evidence = {
  startedAt,
  policy: {
    readonly: true,
    skippedWriteActions: WRITE_ACTIONS,
    note: 'Aceite confirmado na planilha só ocorre com GET action=confirmarAceiteOs. Este harness nunca chama isso.'
  },
  live: {},
  phone: {},
  messages: {},
  code: {}
};

function record(id, status, detail, extra) {
  const row = { id, status, detail };
  if (extra) row.extra = extra;
  checks.push(row);
  const mark = status === 'PASS' ? 'PASS' : status === 'WARN' ? 'WARN' : 'FAIL';
  console.log('[' + mark + '] ' + id + ' — ' + detail);
  return row;
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function httpGet(url, opts) {
  opts = opts || {};
  const timeoutMs = opts.timeoutMs || 45000;
  const maxRedirects = opts.maxRedirects == null ? 8 : opts.maxRedirects;
  const maxBytes = opts.maxBytes || 800000;
  return new Promise(function (resolve, reject) {
    const chain = [];
    function go(current, left) {
      let parsed;
      try { parsed = new URL(current); } catch (e) { reject(e); return; }
      const lib = parsed.protocol === 'http:' ? http : https;
      const req = lib.request({
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: 'GET',
        headers: {
          'User-Agent': 'ZapClin-AuditoriaWA/2026-08-14 (+readonly)',
          'Accept': 'text/html,application/json,*/*'
        }
      }, function (res) {
        chain.push({ url: current, status: res.statusCode, location: res.headers.location || null, type: res.headers['content-type'] || '' });
        const loc = res.headers.location;
        if (res.statusCode >= 300 && res.statusCode < 400 && loc && left > 0) {
          res.resume();
          const next = new URL(loc, current).toString();
          go(next, left - 1);
          return;
        }
        const chunks = [];
        let size = 0;
        res.on('data', function (c) {
          size += c.length;
          if (size <= maxBytes) chunks.push(c);
        });
        res.on('end', function () {
          const body = Buffer.concat(chunks).toString('utf8');
          resolve({
            url: current,
            status: res.statusCode,
            headers: res.headers,
            body: body,
            truncated: size > maxBytes,
            bytes: size,
            chain: chain
          });
        });
      });
      req.on('error', reject);
      req.setTimeout(timeoutMs, function () {
        req.destroy(new Error('timeout ' + timeoutMs + 'ms ' + current));
      });
      req.end();
    }
    go(url, maxRedirects);
  });
}

function parseJsonLoose(body) {
  const t = String(body || '').trim();
  if (!t) throw new Error('empty body');
  return JSON.parse(t);
}

function snippet(html, max) {
  return String(html || '').replace(/\s+/g, ' ').trim().slice(0, max || 280);
}

function decodeGasHtml(raw) {
  var s = String(raw || '');
  for (var i = 0; i < 4; i++) {
    s = s.replace(/\\x3d/gi, '=').replace(/\\x3c/gi, '<').replace(/\\x3e/gi, '>')
      .replace(/\\x22/gi, '"').replace(/\\\//g, '/').replace(/\\"/g, '"');
  }
  return s;
}

function curlGet(url, timeoutSec) {
  timeoutSec = timeoutSec || 60;
  const out = execFileSync('curl', [
    '-sS', '-L', '--max-time', String(timeoutSec),
    '-A', 'ZapClin-AuditoriaWA/2026-08-14 (+readonly)',
    '-w', '\n__CURL__ %{http_code} %{url_effective} %{time_total} %{size_download}',
    url
  ], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  const idx = out.lastIndexOf('\n__CURL__ ');
  const body = idx >= 0 ? out.slice(0, idx) : out;
  const meta = idx >= 0 ? out.slice(idx + 10).trim().split(' ') : ['0', url, '0', '0'];
  return {
    status: parseInt(meta[0], 10) || 0,
    url: meta[1] || url,
    timeSec: parseFloat(meta[2] || '0'),
    bytes: parseInt(meta[3], 10) || body.length,
    body: body
  };
}

function hasAll(hay, needles) {
  return needles.every(function (n) { return String(hay).indexOf(n) >= 0; });
}

function currentWaTel(raw) {
  var tel = String(raw || '').replace(/\D/g, '');
  if (tel.startsWith('0')) tel = tel.substring(1);
  if (!tel.startsWith('55')) tel = '55' + tel;
  return tel;
}

/** Matriz esperada REGRAS_DE_PUBLICACAO_SEGURA.md §3 */
function expectedWaTel(raw) {
  var d = String(raw || '').replace(/\D/g, '');
  if (!d) return { ok: false, reason: 'vazio' };
  if (d.startsWith('0')) d = d.substring(1);
  if (d.startsWith('55')) d = d.substring(2);
  if (d.length === 10) d = d.substring(0, 2) + '9' + d.substring(2);
  if (d.length !== 11) return { ok: false, reason: 'tamanho nacional ' + d.length, national: d };
  if (d.charAt(2) !== '9') return { ok: false, reason: 'sem nono dígito celular', national: d };
  return { ok: true, tel: '55' + d };
}

function loadWhatsappSandbox() {
  const src = read('zc-whatsapp.js');
  const opened = [];
  const sandbox = {
    SERVICES: [
      { name: 'Higienização Rápida', price: 15 },
      { name: 'Higienização Essencial', price: 18 },
      { name: 'Higienização Profunda', price: 23 }
    ],
    LEGACY_SERVICE_ALIASES: {},
    webAppUrl: WEB_APP,
    GOOGLE_REVIEW_URL: GOOGLE_REVIEW,
    clientes: [],
    waData: null,
    APP_VERSION: 'v4.34.1',
    ACEITE_PAGE_URL: 'https://ribocg-a11y.github.io/zapclin/aceite.html',
    fmtBRL: function (n) { return 'R$ ' + Number(n || 0).toFixed(2).replace('.', ','); },
    showToast: function () {},
    logEventoSistema_: function () {},
    apiGet: function () { return Promise.resolve({ ok: false }); },
    prompt: function () {},
    navigator: { clipboard: null },
    document: {
      getElementById: function () {
        return { textContent: '', classList: { add: function () {}, remove: function () {} } };
      }
    },
    window: {
      open: function (u) { opened.push(String(u)); return { closed: false }; }
    },
    console: console,
    Array: Array,
    parseInt: parseInt,
    parseFloat: parseFloat,
    String: String,
    Number: Number,
    Date: Date,
    JSON: JSON,
    encodeURIComponent: encodeURIComponent,
    isNaN: isNaN,
    Math: Math,
    Object: Object,
    Boolean: Boolean
  };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox);
  sandbox.__opened = opened;
  return sandbox;
}

async function runUnit() {
  const waSrc = read('zc-whatsapp.js');
  const idxSrc = read('index.html');
  const gsSrc = read('AppsScript_v3.45_ATUAL.gs');
  const cliSrc = read('zc-clientes.js');
  const opSrc = read('zc-operacao.js');
  const crmSrc = read('zc-crm.js');
  const verSrc = read('zc-version.js');

  evidence.code.appVersion = (verSrc.match(/APP_VERSION = '([^']+)'/) || [])[1] || '';
  evidence.code.webApp = (verSrc.match(/WEB_APP = '([^']+)'/) || [])[1] || '';
  evidence.code.googleReview = (verSrc.match(/GOOGLE_REVIEW_URL = '([^']+)'/) || [])[1] || '';
  evidence.code.confirmarEnvioWA = (waSrc.match(/function confirmarEnvioWA\(\)\{[^}]+\}/) || [''])[0];

  record('CODE-WEBAPP', evidence.code.webApp === WEB_APP ? 'PASS' : 'FAIL',
    'zc-version.js WEB_APP ' + (evidence.code.webApp === WEB_APP ? 'bate com Deploy ID canônico' : 'DIVERGE'),
    { webApp: evidence.code.webApp });

  record('CODE-DEPLOY', evidence.code.webApp.indexOf(DEPLOY_ID) >= 0 ? 'PASS' : 'FAIL',
    'Deploy ID único presente em WEB_APP');

  record('CODE-REVIEW-CONST', evidence.code.googleReview === GOOGLE_REVIEW ? 'PASS' : 'FAIL',
    'GOOGLE_REVIEW_URL constante');

  const modalOk = idxSrc.indexOf('id="waModal"') >= 0 && idxSrc.indexOf('onclick="confirmarEnvioWA()"') >= 0;
  record('CODE-MODAL', modalOk ? 'PASS' : 'FAIL',
    'Modal #waModal + botão Enviar no WhatsApp → confirmarEnvioWA()');

  const aceitePage = idxSrc.indexOf('id="page-aceites"') >= 0 &&
    idxSrc.indexOf('enviarAceiteWhatsApp_') >= 0 &&
    waSrc.indexOf('function copiarLinkAceiteOs') >= 0;
  record('CODE-PAINEL-ACEITE', aceitePage ? 'PASS' : 'FAIL',
    'Painel Admin Aceites: WhatsApp + copiar link');

  const flowCadastro = /mostrarWaModal\(\s*['"]boasVindas['"]/.test(cliSrc);
  const flowPronto = (cliSrc.match(/mostrarWaModal\(\s*['"]pronto['"]/g) || []).length >= 2;
  const flowEntrega = /mostrarWaModal\(\s*['"]agradecimento['"]/.test(cliSrc);
  const flowOpWa = /mostrarWaModal\([^)]*pronto/.test(opSrc);
  const flowCrm = /mostrarWaModal\(\s*['"]boasVindas['"]/.test(crmSrc);
  record('CODE-GATILHOS', flowCadastro && flowPronto && flowEntrega && flowOpWa && flowCrm ? 'PASS' : 'FAIL',
    'Gatilhos: cadastro OS, Pronto (status+Operação), Entregue, CRM nova OS',
    { cadastro: flowCadastro, prontoStatus: flowPronto, entrega: flowEntrega, operacao: flowOpWa, crm: flowCrm });

  const gasAceiteGet = gsSrc.indexOf("action === 'aceiteOs'") >= 0;
  const gasConfirmForm = gsSrc.indexOf("action === 'confirmarAceiteOs' && p.form === '1'") >= 0;
  const gasConfirmJson = gsSrc.indexOf("action === 'confirmarAceiteOs'") >= 0;
  const gasVip = gsSrc.indexOf("action === 'cadastroVip'") >= 0;
  const gasFormGet = gsSrc.indexOf('method="get"') >= 0 && gsSrc.indexOf('Aceito as condições da OS') >= 0;
  record('CODE-GAS-ACEITE-GET', gasAceiteGet && gasFormGet ? 'PASS' : 'FAIL',
    'GAS doGet aceiteOs renderiza formulário HTML (leitura)');
  record('CODE-GAS-CONFIRM-FORM', gasConfirmForm ? 'PASS' : 'FAIL',
    'Confirmação documental exige form=1 (GET HTML) — harness não executa');
  record('CODE-GAS-CONFIRM-JSON-SURFACE', gasConfirmJson ? 'WARN' : 'FAIL',
    'doGet também aceita confirmarAceiteOs sem form=1 (JSON) — superfície de escrita pública por OS');
  record('CODE-GAS-VIP', gasVip ? 'PASS' : 'FAIL', 'GAS cadastroVip HTML público');

  const clipboardInSend = /function confirmarEnvioWA\(\)\{[^}]*clipboard/.test(waSrc);
  const fallbackOpen = /function confirmarEnvioWA\(\)\{[^}]*api\.whatsapp/.test(waSrc);
  record('CODE-CLIPBOARD-ANTES-WA', clipboardInSend ? 'PASS' : 'FAIL',
    clipboardInSend
      ? 'confirmarEnvioWA copia texto antes de abrir wa.me'
      : 'REGRAS §3: copiar mensagem antes de abrir WA — NÃO implementado em confirmarEnvioWA (clipboard só em copiarLinkAceiteOs / resumo OS)');
  record('CODE-FALLBACK-WA', fallbackOpen ? 'PASS' : 'FAIL',
    fallbackOpen
      ? 'Há fallback api.whatsapp.com'
      : 'REGRAS §3: fallback se app WhatsApp não abrir — NÃO implementado (só window.open wa.me)');

  const sb = loadWhatsappSandbox();
  const matrix = [
    { raw: '98 9242-8208', expected: '5598992428208', label: '10 dígitos + nono' },
    { raw: '98 99242-8208', expected: '5598992428208', label: '11 dígitos sem duplicar 9' },
    { raw: '(98) 99242-8208', expected: '5598992428208', label: 'formatado 11 dígitos' },
    { raw: '5598992428208', expected: '5598992428208', label: 'já internacional' },
    { raw: '98 98147-9616', expected: '5598981479616', label: 'loja 11 dígitos' },
    { raw: '098 99242-8208', expected: '5598992428208', label: 'zero à esquerda' }
  ];
  const phoneRows = [];
  matrix.forEach(function (c) {
    const got = currentWaTel(c.raw);
    const exp = expectedWaTel(c.raw);
    const matchSpec = exp.ok && exp.tel === c.expected;
    const matchCurrent = got === c.expected;
    phoneRows.push({ raw: c.raw, label: c.label, current: got, expected: c.expected, currentMatchesSpec: matchCurrent, expectedHelperOk: matchSpec });
    record('TEL-' + c.label.replace(/\s+/g, '_'), matchCurrent ? 'PASS' : 'FAIL',
      '"' + c.raw + '" → atual wa.me/' + got + (matchCurrent ? ' = spec' : ' ≠ spec ' + c.expected));
  });
  const invalids = ['', '123', '999', 'abcdefgh'];
  invalids.forEach(function (raw, i) {
    const got = currentWaTel(raw);
    const exp = expectedWaTel(raw);
    const blocked = false;
    phoneRows.push({ raw: raw || '(vazio)', current: got, expectedBlock: true, specOk: !exp.ok, currentBlocks: blocked });
    record('TEL-INVALIDO-' + (i + 1), 'FAIL',
      'Entrada "' + (raw || '(vazio)') + '" deveria bloquear envio; código atual monta wa.me/' + got);
  });
  evidence.phone = { matrix: phoneRows, currentFunction: evidence.code.confirmarEnvioWA };

  sb.waData = { tipo: 'boasVindas', nome: 'Teste', tel: '98 9242-8208', qtd: 1, msg: 'oi' };
  sb.confirmarEnvioWA();
  const opened = sb.__opened[0] || '';
  evidence.phone.sampleOpen = opened.split('?')[0];
  record('SEND-WA-ME-HOST', opened.indexOf('https://wa.me/') === 0 ? 'PASS' : 'FAIL',
    'confirmarEnvioWA abre https://wa.me/<tel>?text=… (número 10 dígitos coberto em TEL-*) → ' + opened.split('?')[0]);

  const detalhes = sb.montarDetalhesAtendimento_(
    'Cliente Teste', '98992428208', 1,
    ['Higienização Profunda'], [['Arranhão']], 23, 0, 176, 1, 1
  );
  const boas = sb.msgBoasVindas('Cliente Teste', 1, detalhes);
  const aceiteUrl = sb.aceiteOsUrl_(176);
  const vipUrl = sb.clienteVipUrl_('Cliente Teste', '98992428208');
  const pronto = sb.msgPronto('Cliente Teste', 1);
  const agradece = sb.msgAgradecimento('Cliente Teste');
  const aceiteMsg = sb.msgAceiteOs_({ num: 176, nome: 'Cliente Teste', tel: '98992428208', servicos: ['Higienização Profunda'], total: 23, aceite: { url: aceiteUrl } });

  evidence.messages = {
    aceiteUrl: aceiteUrl,
    vipUrl: vipUrl,
    boasHasAceite: boas.indexOf(aceiteUrl) >= 0,
    boasHasVip: boas.indexOf(WEB_APP + '?action=cadastroVip') >= 0,
    prontoHasReview: pronto.indexOf(GOOGLE_REVIEW) >= 0,
    prontoHasIg: pronto.indexOf('@zapclinhigienizacao') >= 0,
    agradeceHasIg: agradece.indexOf('@zapclinhigienizacao') >= 0,
    aceiteMsgHasUrl: aceiteMsg.indexOf(aceiteUrl) >= 0,
    boasPreview: snippet(boas, 400)
  };

  record('MSG-ACEITE-URL', aceiteUrl.indexOf('aceite.html?os=176') >= 0 ? 'PASS' : 'FAIL',
    'aceiteOsUrl_ aponta para GitHub Pages aceite.html', { aceiteUrl: aceiteUrl });
  record('MSG-VIP-URL', vipUrl.indexOf(WEB_APP + '?action=cadastroVip') === 0 ? 'PASS' : 'FAIL',
    'clienteVipUrl_ aponta para cadastroVip no mesmo WEB_APP');
  record('MSG-BOAS-LINKS', evidence.messages.boasHasAceite && evidence.messages.boasHasVip ? 'PASS' : 'FAIL',
    'Boas-vindas inclui link de aceite digital + Clube VIP');
  record('MSG-PRONTO-LINKS', evidence.messages.prontoHasReview && evidence.messages.prontoHasIg ? 'PASS' : 'FAIL',
    'Pronto inclui Google review + @zapclinhigienizacao');
  record('MSG-ACEITE-DEDICADA', evidence.messages.aceiteMsgHasUrl ? 'PASS' : 'FAIL',
    'Mensagem dedicada do painel Aceites carrega a URL da OS');
  record('MSG-AGRADECIMENTO', evidence.messages.agradeceHasIg ? 'PASS' : 'FAIL',
    'Agradecimento pós-retirada cita Instagram da loja');

  const site = read('site/index.html');
  const waSiteOk = site.indexOf('https://wa.me/' + STORE_WA) >= 0;
  record('SITE-WA-LOJA', waSiteOk ? 'PASS' : 'FAIL',
    'site/index.html usa wa.me/' + STORE_WA);
}

function live(id, fn) {
  try { fn(); }
  catch (e) { record(id, 'FAIL', String(e && e.message || e)); }
}

function aceiteMarkers(htmlRaw) {
  const html = decodeGasHtml(htmlRaw);
  return {
    titleAceite: /Aceite da OS/i.test(html),
    botaoVerde: html.indexOf('Aceito as condições da OS') >= 0,
    formConfirm: html.indexOf('name="action" value="confirmarAceiteOs"') >= 0,
    formFlag: html.indexOf('name="form" value="1"') >= 0,
    methodGet: /method="get"/i.test(html),
    jaConfirmado: /Aceite j[aá] confirmado/i.test(html),
    osNaoEncontrada: /OS n[aã]o encontrada/i.test(html),
    actionExec: html.indexOf(DEPLOY_ID) >= 0
  };
}

async function runLive() {
  live('LIVE-PING', function () {
    const ping = curlGet(WEB_APP + '?action=ping', 30);
    let pingJson = null;
    try { pingJson = parseJsonLoose(ping.body); } catch (e) { pingJson = { parseError: String(e), body: snippet(ping.body, 200) }; }
    evidence.live.ping = { status: ping.status, finalUrl: ping.url, json: pingJson, timeSec: ping.timeSec };
    const pingOk = pingJson && pingJson.ok === true && String(pingJson.version || '') >= '3.51';
    record('LIVE-PING', pingOk ? 'PASS' : 'FAIL',
      pingOk ? 'GAS ping version=' + pingJson.version + ' tz=' + pingJson.timezone + ' ' + ping.timeSec + 's' : 'ping falhou ' + JSON.stringify(pingJson).slice(0, 180));
  });

  live('LIVE-PAGES-VERSION', function () {
    const pagesVer = curlGet(PAGES + '/zc-version.js', 20);
    const liveAppVer = (pagesVer.body.match(/APP_VERSION = '([^']+)'/) || [])[1] || '';
    const liveWebApp = (pagesVer.body.match(/WEB_APP = '([^']+)'/) || [])[1] || '';
    evidence.live.pagesVersion = { status: pagesVer.status, appVersion: liveAppVer, webApp: liveWebApp };
    record('LIVE-PAGES-VERSION', pagesVer.status === 200 && liveAppVer ? 'PASS' : 'FAIL',
      'GitHub Pages APP_VERSION=' + liveAppVer + ' WEB_APP ' + (liveWebApp === WEB_APP ? 'canônico' : 'DIVERGE'));
  });

  live('LIVE-PAGES-WA-PARITY', function () {
    const pagesWa = curlGet(PAGES + '/zc-whatsapp.js', 20);
    const liveSend = (pagesWa.body.match(/function confirmarEnvioWA\(\)\{[^}]+\}/) || [''])[0];
    const repoSend = evidence.code.confirmarEnvioWA;
    evidence.live.pagesWhatsapp = { status: pagesWa.status, bytes: pagesWa.bytes, confirmarEnvioWA: liveSend };
    record('LIVE-PAGES-WA-PARITY', pagesWa.status === 200 && liveSend === repoSend ? 'PASS' : 'FAIL',
      liveSend === repoSend ? 'confirmarEnvioWA Pages = repo main' : 'Pages e repo divergem no envio WA');
  });

  live('LIVE-SW', function () {
    const sw = curlGet(PAGES + '/sw.js', 20);
    const swVer = (sw.body.match(/ZAPCLIN_SW_VERSION\s*=\s*['"]([^'"]+)/) || sw.body.match(/v4\.\d+\.\d+/)) || [];
    evidence.live.sw = { status: sw.status, hint: snippet(sw.body, 160) };
    record('LIVE-SW', sw.status === 200 ? 'PASS' : 'FAIL', 'sw.js Pages HTTP ' + sw.status + (swVer[1] ? ' ' + swVer[1] : ''));
  });

  live('LIVE-ACEITE-SEM-OS', function () {
    const aceiteMissing = curlGet(WEB_APP + '?action=aceiteOs', 60);
    const missHtml = decodeGasHtml(aceiteMissing.body);
    const missOk = aceiteMissing.status === 200 && /OS n[aã]o encontrada/i.test(missHtml);
    evidence.live.aceiteSemOs = { status: aceiteMissing.status, finalUrl: aceiteMissing.url, timeSec: aceiteMissing.timeSec, snippet: snippet(missHtml, 240) };
    record('LIVE-ACEITE-SEM-OS', missOk ? 'PASS' : 'FAIL',
      'aceiteOs sem OS → página "OS não encontrada" (HTTP ' + aceiteMissing.status + ', ' + aceiteMissing.timeSec + 's)');
  });

  live('LIVE-ACEITE-OS-INEXISTENTE', function () {
    const aceiteFake = curlGet(WEB_APP + '?action=aceiteOs&os=999999', 60);
    const fakeOk = aceiteFake.status === 200 && /OS n[aã]o encontrada/i.test(decodeGasHtml(aceiteFake.body));
    evidence.live.aceiteOsInexistente = { status: aceiteFake.status, timeSec: aceiteFake.timeSec, snippet: snippet(decodeGasHtml(aceiteFake.body), 200) };
    record('LIVE-ACEITE-OS-INEXISTENTE', fakeOk ? 'PASS' : 'FAIL',
      'aceiteOs&os=999999 → OS não encontrada');
  });

  let clientes = null;
  live('LIVE-LISTAR-CLIENTES', function () {
    const list = curlGet(WEB_APP + '?action=listarClientes', 90);
    clientes = parseJsonLoose(list.body);
    evidence.live.listarClientes = {
      status: list.status,
      ok: !!(clientes && clientes.ok),
      version: clientes && clientes.version,
      count: clientes && clientes.items ? clientes.items.length : 0,
      timeSec: list.timeSec
    };
    record('LIVE-LISTAR-CLIENTES', clientes && clientes.ok && Array.isArray(clientes.items) ? 'PASS' : 'FAIL',
      clientes && clientes.ok ? 'listarClientes ok version=' + clientes.version + ' items=' + clientes.items.length + ' ' + list.timeSec + 's' : 'falha listarClientes');
  });

  const aceiteStats = { total: 0, pendente: 0, confirmado: 0, urlOk: 0, urlMissing: 0, urlMismatch: 0, ativosPendentes: 0, ativosConfirmados: 0 };
  let samplePendente = null;
  let sampleConfirmado = null;
  if (clientes && Array.isArray(clientes.items)) {
    clientes.items.forEach(function (c) {
      aceiteStats.total += 1;
      const st = String((c.aceite && c.aceite.status) || 'PENDENTE').toUpperCase();
      const url = c.aceite && c.aceite.url;
      const ativo = c.status !== 'Cancelado' && c.status !== 'Entregue';
      if (st === 'CONFIRMADO') {
        aceiteStats.confirmado += 1;
        if (ativo) aceiteStats.ativosConfirmados += 1;
        if (!sampleConfirmado) sampleConfirmado = { os: c.num, statusOs: c.status, aceiteStatus: st, hasUrl: !!url };
      } else {
        aceiteStats.pendente += 1;
        if (ativo) aceiteStats.ativosPendentes += 1;
        if (!samplePendente && ativo) samplePendente = { os: c.num, statusOs: c.status, aceiteStatus: st, hasUrl: !!url };
      }
      if (!url) aceiteStats.urlMissing += 1;
      else if (String(url).indexOf(WEB_APP + '?action=aceiteOs') === 0) aceiteStats.urlOk += 1;
      else aceiteStats.urlMismatch += 1;
    });
  }
  evidence.live.aceiteStats = aceiteStats;
  evidence.live.sampleOs = { pendenteAtivo: samplePendente, confirmado: sampleConfirmado };
  record('LIVE-ACEITE-URLS-GAS', clientes && aceiteStats.urlMismatch === 0 ? 'PASS' : (clientes ? 'FAIL' : 'FAIL'),
    'URLs aceite do GAS: ok=' + aceiteStats.urlOk + ' missing=' + aceiteStats.urlMissing + ' mismatch=' + aceiteStats.urlMismatch +
    ' (missing esperado em CONFIRMADO: mapa da aba não grava url)');
  record('LIVE-ACEITE-CONTADORES', clientes && clientes.ok ? 'PASS' : 'FAIL',
    'Aceites: ' + aceiteStats.confirmado + ' confirmados / ' + aceiteStats.pendente + ' pendentes · ativos pendentes=' + aceiteStats.ativosPendentes +
    ' · ativos confirmados=' + aceiteStats.ativosConfirmados);

  function inspectAceiteForm(os) {
    const r = curlGet(WEB_APP + '?action=aceiteOs&os=' + encodeURIComponent(os), 60);
    const decoded = decodeGasHtml(r.body);
    const formIdx = decoded.indexOf('<form method="get"');
    const formSnippet = formIdx >= 0 ? snippet(decoded.slice(formIdx, formIdx + 520), 520) : snippet(decoded, 260);
    return { os: os, status: r.status, finalUrl: r.url, timeSec: r.timeSec, markers: aceiteMarkers(r.body), formSnippet: formSnippet };
  }

  if (samplePendente) {
    live('LIVE-ACEITE-FORM-PENDENTE', function () {
      const form = inspectAceiteForm(samplePendente.os);
      evidence.live.aceiteFormPendente = form;
      const ok = form.status === 200 && form.markers.titleAceite && form.markers.botaoVerde && form.markers.formConfirm && form.markers.formFlag && form.markers.methodGet && !form.markers.jaConfirmado;
      record('LIVE-ACEITE-FORM-PENDENTE', ok ? 'PASS' : 'FAIL',
        'OS #' + String(samplePendente.os).padStart(6, '0') + ' GET readonly: botão verde + form GET confirmarAceiteOs&form=1 (' + form.timeSec + 's)',
        { markers: form.markers, os: samplePendente.os });
    });
  } else {
    record('LIVE-ACEITE-FORM-PENDENTE', 'WARN', 'Nenhuma OS ativa pendente na planilha para abrir o formulário');
  }

  if (sampleConfirmado) {
    live('LIVE-ACEITE-FORM-CONFIRMADO', function () {
      const form = inspectAceiteForm(sampleConfirmado.os);
      evidence.live.aceiteFormConfirmado = form;
      const ok = form.status === 200 && form.markers.jaConfirmado && !form.markers.botaoVerde && !form.markers.formConfirm;
      record('LIVE-ACEITE-FORM-CONFIRMADO', ok ? 'PASS' : (form.markers.botaoVerde ? 'FAIL' : 'WARN'),
        'OS #' + String(sampleConfirmado.os).padStart(6, '0') + ' já CONFIRMADO: ' + (form.markers.jaConfirmado ? 'tela "já confirmado" sem botão' : (form.markers.botaoVerde ? 'AINDA mostra botão' : 'página inesperada')),
        { markers: form.markers, os: sampleConfirmado.os });
    });
  } else {
    record('LIVE-ACEITE-FORM-CONFIRMADO', 'WARN', 'Nenhuma OS confirmada na planilha para validar tela de obrigado/já confirmado');
  }

  live('LIVE-VIP-FORM', function () {
    const vip = curlGet(WEB_APP + '?action=cadastroVip&nome=Auditoria&tel=98992428208', 60);
    const vipHtml = decodeGasHtml(vip.body);
    const vipOk = vip.status === 200 && /Clube VIP/i.test(vipHtml) && /salvarCadastroVip/i.test(vipHtml);
    evidence.live.cadastroVip = { status: vip.status, timeSec: vip.timeSec, snippet: snippet(vipHtml, 240), hasForm: /salvarCadastroVip/i.test(vipHtml) };
    record('LIVE-VIP-FORM', vipOk ? 'PASS' : 'FAIL',
      'cadastroVip HTML público carrega formulário (sem submit) ' + vip.timeSec + 's');
  });

  live('LIVE-GOOGLE-REVIEW', function () {
    const review = curlGet(GOOGLE_REVIEW, 25);
    evidence.live.googleReview = { status: review.status, finalUrl: review.url, timeSec: review.timeSec };
    const reviewOk = review.status >= 200 && review.status < 400 && /google\.|g\.page|maps/i.test(review.url + review.body.slice(0, 500));
    record('LIVE-GOOGLE-REVIEW', reviewOk ? 'PASS' : 'FAIL',
      'Google review HTTP ' + review.status + ' final=' + review.url);
  });

  live('LIVE-WAME-LOJA', function () {
    const waMe = curlGet('https://wa.me/' + STORE_WA, 25);
    evidence.live.waMeLoja = { status: waMe.status, finalUrl: waMe.url, timeSec: waMe.timeSec };
    const waOk = waMe.status >= 200 && waMe.status < 400 && /wa\.me|whatsapp/i.test(waMe.url);
    record('LIVE-WAME-LOJA', waOk ? 'PASS' : 'FAIL',
      'wa.me/' + STORE_WA + ' HTTP ' + waMe.status + ' final=' + waMe.url);
  });

  live('LIVE-INSTAGRAM', function () {
    const ig = curlGet(IG, 25);
    evidence.live.instagram = { status: ig.status, finalUrl: ig.url };
    record('LIVE-INSTAGRAM', ig.status >= 200 && ig.status < 400 ? 'PASS' : 'WARN',
      'instagram.com/zapclinhigienizacao HTTP ' + ig.status + ' (handle nas msgs; não é URL clicável no PWA)');
  });

  live('LIVE-SITE-WA', function () {
    const siteLive = curlGet(SITE, 25);
    const siteHasWa = siteLive.body.indexOf('wa.me/' + STORE_WA) >= 0;
    evidence.live.site = { status: siteLive.status, finalUrl: siteLive.url, hasWa: siteHasWa };
    record('LIVE-SITE-WA', siteLive.status === 200 && siteHasWa ? 'PASS' : 'FAIL',
      'www.zapclinslz.com HTTP ' + siteLive.status + (siteHasWa ? ' contém wa.me da loja' : ' SEM wa.me da loja'));
  });

  record('LIVE-NO-WRITE', 'PASS',
    'Nenhuma action de escrita chamada (' + WRITE_ACTIONS.join(', ') + ')');
}

function summarize() {
  const counts = { PASS: 0, FAIL: 0, WARN: 0 };
  checks.forEach(function (c) { counts[c.status] = (counts[c.status] || 0) + 1; });
  evidence.finishedAt = new Date().toISOString();
  evidence.counts = counts;
  evidence.checks = checks;
  return counts;
}

function renderMarkdown(counts) {
  const failList = checks.filter(function (c) { return c.status === 'FAIL'; });
  const warnList = checks.filter(function (c) { return c.status === 'WARN'; });
  const passList = checks.filter(function (c) { return c.status === 'PASS'; });
  function li(arr) {
    if (!arr.length) return '- (nenhum)\n';
    return arr.map(function (c) { return '- `' + c.id + '` — ' + c.detail; }).join('\n') + '\n';
  }
  return [
    '# Auditoria WhatsApp + Aceite OS — 14/08/2026',
    '',
    '**Tipo:** varredura readonly (sem gravar planilha, sem `confirmarAceiteOs`).  ',
    '**Branch:** `cursor/auditoria-wa-aceite-62bf`  ',
    '**Alvo:** produção GitHub Pages + GAS Deploy ID canônico.  ',
    '**Início:** ' + startedAt + '  ',
    '**Fim:** ' + evidence.finishedAt + '  ',
    '',
    '## Resultado',
    '',
    '| Status | Qtde |',
    '|--------|------|',
    '| PASS | ' + counts.PASS + ' |',
    '| FAIL | ' + counts.FAIL + ' |',
    '| WARN | ' + counts.WARN + ' |',
    '',
    'O fluxo operacional **existe e está ligado ponta a ponta** (cadastro → modal WA → wa.me; Pronto → mensagem + review; painel Aceites → link GAS; cliente abre formulário GET). A matriz **REGRAS §3 de telefone/clipboard/fallback não está implementada** em `confirmarEnvioWA` — isso é FAIL de conformidade, não de “link quebrado”.',
    '',
    '## Fluxo esperado (código atual)',
    '',
    '```mermaid',
    'flowchart TD',
    '  A[Cadastro OS POST fotos/Drive] --> B[Modal boas-vindas]',
    '  B --> C[confirmarEnvioWA window.open wa.me]',
    '  D[Marcar Pronto] --> E[Modal pronto + review Google]',
    '  E --> C',
    '  F[Entregue/pagamento] --> G[Modal agradecimento]',
    '  G --> C',
    '  H[Painel Aceites PIN] --> I[Copiar link / WhatsApp aceite]',
    '  I --> C',
    '  C --> J[Cliente abre aceiteOs GET]',
    '  J --> K{Já confirmado?}',
    '  K -->|Não| L[Botão verde form GET form=1]',
    '  K -->|Sim| M[Tela já confirmado]',
    '  L -.->|NÃO testado aqui| N[confirmarAceiteOs grava aba ACEITES OS]',
    '```',
    '',
    'Envio **não é automático**: o operador confirma no modal. WhatsApp Web/app abre com texto pré-preenchido.',
    '',
    '## Evidência live (sanitizada)',
    '',
    '- GAS ping: `' + JSON.stringify(evidence.live.ping && evidence.live.ping.json) + '`',
    '- Pages `APP_VERSION`: `' + ((evidence.live.pagesVersion && evidence.live.pagesVersion.appVersion) || '?') + '`',
    '- `listarClientes`: ' + JSON.stringify(evidence.live.listarClientes || {}) + '',
    '- Contadores aceite: `' + JSON.stringify(evidence.live.aceiteStats || {}) + '`',
    '- OS amostra (só número, sem PII): `' + JSON.stringify(evidence.live.sampleOs || {}) + '`',
    '- Google review final: `' + ((evidence.live.googleReview && evidence.live.googleReview.finalUrl) || '') + '`',
    '- wa.me loja final: `' + ((evidence.live.waMeLoja && evidence.live.waMeLoja.finalUrl) || '') + '`',
    '',
    '## FAILs',
    '',
    li(failList),
    '## WARNs',
    '',
    li(warnList),
    '## PASSes',
    '',
    li(passList),
    '## O que não foi executado (de propósito)',
    '',
    '- `confirmarAceiteOs` / clique no botão verde em OS real — **grava planilha**.',
    '- `salvarCadastroVip` — **grava planilha**.',
    '- Cadastro de OS + fotos — POST Drive.',
    '- Homologação no tablet da loja (abrir WhatsApp nativo) — só humano.',
    '- Matriz §3 “fallback se o app não abrir” no aparelho físico.',
    '',
    '## Correção sugerida (só com pedido explícito — zona crítica WhatsApp)',
    '',
    '1. `normalizarTelWA_`: inserir 9 após DDD em números nacionais de 10 dígitos; não duplicar se já houver 11.',
    '2. Bloquear envio se o resultado não for `55` + 11 dígitos com 3º dígito nacional `9`.',
    '3. Copiar `waData.msg` para clipboard antes de `window.open`.',
    '4. Se `window.open` falhar, tentar `https://api.whatsapp.com/send?phone=...`.',
    '',
    '**Não alterar templates de mensagem nem Deploy ID sem pedido.**',
    '',
    'JSON bruto (sem PII): `scripts/testes/evidencias/auditoria-wa-aceite-2026-08-14.json`',
    '',
    'Mudança no AppScript: **não**. Canônico: `AppsScript_v3.45_ATUAL.gs`.',
    ''
  ].join('\n');
}

(async function main() {
  try {
    await runUnit();
    await runLive();
  } catch (err) {
    record('HARNESS', 'FAIL', String(err && err.stack || err));
  }
  const counts = summarize();
  const evDir = path.join(ROOT, 'scripts/testes/evidencias');
  fs.mkdirSync(evDir, { recursive: true });
  const jsonPath = path.join(evDir, 'auditoria-wa-aceite-2026-08-14.json');
  const mdPath = path.join(ROOT, 'docs/ativos/AUDITORIA_WA_ACEITE_2026-08-14.md');
  fs.writeFileSync(jsonPath, JSON.stringify(evidence, null, 2));
  fs.writeFileSync(mdPath, renderMarkdown(counts));
  console.log('\n---');
  console.log('PASS=' + counts.PASS + ' FAIL=' + counts.FAIL + ' WARN=' + counts.WARN);
  console.log('Wrote ' + jsonPath);
  console.log('Wrote ' + mdPath);
  if (counts.FAIL > 0) process.exit(2);
})();
