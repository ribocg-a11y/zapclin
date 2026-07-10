/* Pacote Z.8 — Histórico de custos (admin) · client-side · DNA ZapClin */

var _hcPeriodo = 'mes';
var _hcDe = null;
var _hcAte = null;
var _hcCatFiltro = '';

var HC_CAT_COLORS = {
  'Salários': '#4fc3f7',
  'Produtos/Insumos': '#00e5ff',
  'Ferramentas/Equipamentos': '#b388ff',
  'Transporte': '#00e676',
  'Utilidades': '#ffea00',
  'Comida': '#ff9100',
  'Taxas e Boletos': '#ff5252',
  'Outros': '#6b6b8a'
};

function hcValidCusto_(c) {
  return c && !c.cancelado && parseFloat(c.val || 0) > 0;
}

function hcSet_(id, text) {
  var el = document.getElementById(id);
  if (el) el.textContent = text;
}

function hcSetHtml_(id, html) {
  var el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function setHcPeriodo(periodo, btn) {
  _hcPeriodo = periodo;
  document.querySelectorAll('#page-historico-custos .hc-btn').forEach(function (b) {
    b.classList.remove('ativo');
  });
  if (btn) btn.classList.add('ativo');
  var custom = document.getElementById('hcCustom');
  if (custom) custom.classList.toggle('show', periodo === 'custom');
  if (periodo !== 'custom') renderHistoricoCustos();
}

function aplicarHcCustom() {
  var de = document.getElementById('hcDataDe').value;
  var ate = document.getElementById('hcDataAte').value;
  if (!de || !ate) { showToast('Selecione as duas datas', 'orange'); return; }
  _hcDe = de;
  _hcAte = ate;
  renderHistoricoCustos();
}

function _getHcRange() {
  var now = new Date();
  var hoje = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var de, ate, label;
  if (_hcPeriodo === 'hoje') {
    de = ate = hoje;
    label = 'Hoje — ' + String(hoje.getDate()).padStart(2, '0') + '/' + String(hoje.getMonth() + 1).padStart(2, '0');
  } else if (_hcPeriodo === 'ontem') {
    var ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);
    de = ate = ontem;
    label = 'Ontem — ' + String(ontem.getDate()).padStart(2, '0') + '/' + String(ontem.getMonth() + 1).padStart(2, '0');
  } else if (_hcPeriodo === '7d') {
    de = new Date(hoje);
    de.setDate(hoje.getDate() - 6);
    ate = hoje;
    label = 'Últimos 7 dias';
  } else if (_hcPeriodo === 'mes') {
    de = new Date(now.getFullYear(), now.getMonth(), 1);
    ate = hoje;
    var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    label = meses[now.getMonth()] + ' ' + now.getFullYear();
  } else if (_hcPeriodo === 'mesant') {
    var m = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    var y = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    de = new Date(y, m, 1);
    ate = new Date(y, m + 1, 0);
    var meses2 = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    label = meses2[m] + ' ' + y;
  } else if (_hcPeriodo === 'custom' && _hcDe && _hcAte) {
    var dp = _hcDe.split('-'), ap = _hcAte.split('-');
    de = new Date(parseInt(dp[0], 10), parseInt(dp[1], 10) - 1, parseInt(dp[2], 10));
    ate = new Date(parseInt(ap[0], 10), parseInt(ap[1], 10) - 1, parseInt(ap[2], 10));
    label = dp[2] + '/' + dp[1] + '/' + dp[0] + ' → ' + ap[2] + '/' + ap[1] + '/' + ap[0];
  } else {
    de = new Date(now.getFullYear(), now.getMonth(), 1);
    ate = hoje;
    label = 'Este mês';
  }
  return { de: de, ate: ate, label: label };
}

function _getHcPrevRange(range) {
  var ms = range.ate.getTime() - range.de.getTime() + 86400000;
  var prevAte = new Date(range.de.getTime() - 86400000);
  var prevDe = new Date(prevAte.getTime() - ms + 86400000);
  return { de: prevDe, ate: prevAte };
}

function _hcFiltrarPorRange(lista, de, ate) {
  return lista.filter(function (c) {
    return hcValidCusto_(c) && _dataNoRange(fmtData(c.data), de, ate);
  });
}

function _hcFiltrarCat(lista) {
  if (!_hcCatFiltro) return lista;
  return lista.filter(function (c) { return (c.cat || detectCat(c.desc || '')) === _hcCatFiltro; });
}

function _hcDiasNoRange(de, ate) {
  return Math.max(1, Math.round((ate.getTime() - de.getTime()) / 86400000) + 1);
}

function _hcStatsFrom_(lista, diasRange) {
  var total = lista.reduce(function (s, c) { return s + parseFloat(c.val || 0); }, 0);
  var n = lista.length;
  var ticket = n > 0 ? total / n : 0;
  var diasCom = {};
  lista.forEach(function (c) {
    var d = fmtData(c.data);
    if (d && d !== '—') diasCom[d] = true;
  });
  var diasComCusto = Object.keys(diasCom).length;
  var mediaDiaria = diasComCusto > 0 ? total / diasComCusto : 0;

  var porCat = {};
  CATEGORIAS.forEach(function (cat) { porCat[cat.key] = { val: 0, qtd: 0, icon: cat.icon }; });
  lista.forEach(function (c) {
    var cat = c.cat || detectCat(c.desc || '');
    if (!porCat[cat]) porCat[cat] = { val: 0, qtd: 0, icon: getCatIcon(cat) };
    porCat[cat].val += parseFloat(c.val || 0);
    porCat[cat].qtd++;
  });

  var ranking = Object.keys(porCat).map(function (k) {
    return { name: k, val: porCat[k].val, qtd: porCat[k].qtd, icon: porCat[k].icon };
  }).filter(function (x) { return x.val > 0; }).sort(function (a, b) { return b.val - a.val; });

  var porDia = {};
  lista.forEach(function (c) {
    var d = fmtData(c.data);
    if (!d || d === '—') return;
    porDia[d] = (porDia[d] || 0) + parseFloat(c.val || 0);
  });
  var cusPorDia = Object.keys(porDia).sort(function (a, b) {
    var pa = a.split('/'), pb = b.split('/');
    var da = new Date(parseInt(pa[2], 10), parseInt(pa[1], 10) - 1, parseInt(pa[0], 10));
    var db = new Date(parseInt(pb[2], 10), parseInt(pb[1], 10) - 1, parseInt(pb[0], 10));
    return da - db;
  }).map(function (d) {
    var p = d.split('/');
    return { dia: d, label: p[0] + '/' + p[1], valor: porDia[d] };
  });

  var topCat = ranking.length ? ranking[0] : null;
  var topLanc = lista.slice().sort(function (a, b) { return parseFloat(b.val || 0) - parseFloat(a.val || 0); })[0] || null;

  return {
    total: total,
    n: n,
    ticket: ticket,
    mediaDiaria: mediaDiaria,
    diasComCusto: diasComCusto,
    diasRange: diasRange,
    ranking: ranking,
    cusPorDia: cusPorDia,
    topCat: topCat,
    topLanc: topLanc,
    porCat: porCat
  };
}

function _hcDeltaHtml_(atual, anterior) {
  if (anterior > 0) {
    var diff = atual - anterior;
    var pct = diff / anterior * 100;
    var cls = diff > 0 ? 'hc-delta-up' : diff < 0 ? 'hc-delta-down' : 'hc-delta-flat';
    var sign = diff > 0 ? '+' : '';
    return '<span class="hc-delta ' + cls + '">' + sign + pct.toFixed(1).replace('.', ',') + '% · ' + sign + fmtBRL(Math.abs(diff)) + ' vs anterior</span>';
  }
  if (atual > 0) return '<span class="hc-delta hc-delta-up">novo movimento no período</span>';
  return '<span class="hc-delta hc-delta-flat">sem base comparável</span>';
}

function _hcInsights_(stats, prevTotal, receitaPeriodo) {
  var linhas = [];
  if (!stats.n) {
    linhas.push({ cls: 'info', txt: 'Nenhum custo válido no período. Registre despesas em Custos ou amplie o filtro.' });
    return linhas;
  }
  linhas.push({ cls: 'info', txt: 'Total de <strong>' + fmtBRL(stats.total) + '</strong> em <strong>' + stats.n + ' lançamento(s)</strong> em ' + stats.diasComCusto + ' dia(s) com movimento.' });
  if (stats.topCat) {
    var pctCat = stats.total > 0 ? (stats.topCat.val / stats.total * 100).toFixed(1) : 0;
    linhas.push({ cls: 'warn', txt: 'Maior concentração: <strong>' + escapeHtml_(stats.topCat.name) + '</strong> (' + pctCat.replace('.', ',') + '% do período).' });
  }
  if (stats.mediaDiaria > 0) {
    linhas.push({ cls: 'info', txt: 'Média diária de <strong>' + fmtBRL(stats.mediaDiaria) + '</strong> nos dias com lançamento.' });
  }
  if (prevTotal > 0) {
    var diff = stats.total - prevTotal;
    if (diff > 0) linhas.push({ cls: 'bad', txt: 'Custos <strong>' + fmtBRL(diff) + '</strong> acima do período anterior. Vale revisar as categorias que mais subiram.' });
    else if (diff < 0) linhas.push({ cls: 'ok', txt: 'Custos <strong>' + fmtBRL(Math.abs(diff)) + '</strong> abaixo do período anterior. Boa contenção de despesas.' });
  }
  if (receitaPeriodo > 0) {
    var pctRec = (stats.total / receitaPeriodo * 100).toFixed(1);
    if (parseFloat(pctRec) >= 40) linhas.push({ cls: 'bad', txt: 'Despesas representam <strong>' + pctRec.replace('.', ',') + '%</strong> da receita do período. Margem em atenção.' });
    else if (parseFloat(pctRec) >= 25) linhas.push({ cls: 'warn', txt: 'Despesas em <strong>' + pctRec.replace('.', ',') + '%</strong> da receita. Acompanhe antes de ampliar descontos.' });
    else linhas.push({ cls: 'ok', txt: 'Despesas em <strong>' + pctRec.replace('.', ',') + '%</strong> da receita do período — proporção saudável.' });
  }
  if (stats.topLanc && stats.topLanc.val >= stats.total * 0.35 && stats.n > 1) {
    linhas.push({ cls: 'warn', txt: 'Lançamento isolado alto: <strong>' + escapeHtml_(stats.topLanc.desc || '—') + '</strong> (' + fmtBRL(stats.topLanc.val) + ').' });
  }
  return linhas;
}

function _renderHcKpis(stats, prevTotal) {
  hcSet_('hcTotal', fmtBRL(stats.total));
  hcSet_('hcTotalSub', stats.n + ' lançamento' + (stats.n === 1 ? '' : 's'));
  hcSetHtml_('hcTotalDelta', _hcDeltaHtml_(stats.total, prevTotal));
  hcSet_('hcLanc', String(stats.n));
  hcSet_('hcLancSub', stats.ticket > 0 ? 'Ticket ' + fmtBRL(stats.ticket) : '—');
  hcSet_('hcMedia', fmtBRL(stats.mediaDiaria));
  hcSet_('hcMediaSub', stats.diasComCusto + ' dia(s) com custo');
  if (stats.topCat) {
    hcSet_('hcTopCat', stats.topCat.icon + ' ' + stats.topCat.name.split('/')[0]);
    hcSet_('hcTopCatSub', fmtBRL(stats.topCat.val) + ' · ' + stats.topCat.qtd + ' lanç.');
  } else {
    hcSet_('hcTopCat', '—');
    hcSet_('hcTopCatSub', 'sem dados');
  }
}

function _renderHcCatBar(stats) {
  var bar = document.getElementById('hcCatBar');
  var legend = document.getElementById('hcCatLegend');
  if (!bar || !legend) return;
  hcSet_('hcCatBarTotal', stats.total > 0 ? fmtBRL(stats.total) : '—');
  if (!stats.total) {
    bar.innerHTML = '';
    legend.innerHTML = '';
    return;
  }
  bar.innerHTML = stats.ranking.map(function (r) {
    var pct = Math.max(r.val > 0 ? 2 : 0, Math.round(r.val / stats.total * 100));
    var cor = HC_CAT_COLORS[r.name] || '#6b6b8a';
    return '<div class="hc-cat-seg" style="width:' + pct + '%;background:' + cor + '" title="' + escapeHtml_(r.name) + ': ' + fmtBRL(r.val) + '"></div>';
  }).join('');
  legend.innerHTML = stats.ranking.map(function (r) {
    var pct = Math.round(r.val / stats.total * 1000) / 10;
    var cor = HC_CAT_COLORS[r.name] || '#6b6b8a';
    return '<div class="hc-cat-leg-item">' +
      '<span class="hc-cat-leg-dot" style="background:' + cor + '"></span>' +
      '<span class="hc-cat-leg-name">' + r.icon + ' ' + escapeHtml_(r.name) + '</span>' +
      '<span class="hc-cat-leg-val">' + fmtBRL(r.val) + '</span>' +
      '<span class="hc-cat-leg-pct">' + pct.toFixed(1).replace('.', ',') + '%</span>' +
      '</div>';
  }).join('');
}

function _renderHcDiaChart(stats) {
  var wrap = document.getElementById('hcDiaChart');
  var note = document.getElementById('hcDiaNote');
  if (!wrap) return;
  var arr = stats.cusPorDia || [];
  if (note) note.textContent = arr.length ? arr.length + ' dia(s) no período' : 'sem lançamentos';
  if (!arr.length) {
    wrap.innerHTML = '<div class="hist-empty"><div class="hist-empty-icon">📊</div><div>Sem custos por dia</div></div>';
    return;
  }
  var maxVal = Math.max.apply(null, arr.map(function (x) { return x.valor; }).concat([1]));
  wrap.innerHTML = arr.map(function (d) {
    var pct = Math.max(d.valor > 0 ? 4 : 0, Math.round(d.valor / maxVal * 100));
    return '<div class="hc-dia-row">' +
      '<div class="hc-dia-lbl">' + escapeHtml_(d.label) + '</div>' +
      '<div class="hc-dia-track"><div class="hc-dia-fill" style="width:0" data-w="' + pct + '%"></div></div>' +
      '<div class="hc-dia-val">' + fmtBRL(d.valor) + '</div>' +
      '</div>';
  }).join('');
  setTimeout(function () {
    wrap.querySelectorAll('.hc-dia-fill').forEach(function (b) {
      b.style.transition = 'width .6s ease';
      b.style.width = b.getAttribute('data-w');
    });
  }, 50);
}

function _renderHcDonut(stats) {
  var canvas = document.getElementById('hcDonutCanvas');
  var legend = document.getElementById('hcDonutLegend');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var S = 160;
  canvas.width = S;
  canvas.height = S;
  var cx = S / 2, cy = S / 2, r = S * 0.44, innerR = S * 0.28;
  var slices = stats.ranking.map(function (r) {
    return { name: r.name, val: r.val, color: HC_CAT_COLORS[r.name] || '#6b6b8a', icon: r.icon };
  });
  var total = slices.reduce(function (s, sl) { return s + sl.val; }, 0);
  if (!total) {
    ctx.clearRect(0, 0, S, S);
    ctx.fillStyle = '#6b6b8a';
    ctx.font = '11px DM Sans,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Sem dados', cx, cy);
    if (legend) legend.innerHTML = '';
    return;
  }
  ctx.clearRect(0, 0, S, S);
  var startAngle = -Math.PI / 2;
  slices.forEach(function (sl) {
    var angle = (sl.val / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + angle);
    ctx.closePath();
    ctx.fillStyle = sl.color;
    ctx.fill();
    startAngle += angle;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.fillStyle = '#16161f';
  ctx.fill();
  ctx.fillStyle = '#ff9100';
  ctx.font = 'bold 11px Syne,sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(fmtBRL(total), cx, cy + 2);
  ctx.fillStyle = '#6b6b8a';
  ctx.font = '9px DM Sans,sans-serif';
  ctx.fillText('custos', cx, cy + 14);
  if (legend) {
    legend.innerHTML = slices.map(function (sl) {
      var pct = Math.round(sl.val / total * 100);
      var shortName = sl.name.length > 18 ? sl.name.slice(0, 16) + '…' : sl.name;
      return '<div class="donut-legend-item">' +
        '<span class="donut-legend-dot" style="background:' + sl.color + '"></span>' +
        '<span class="donut-legend-name">' + sl.icon + ' ' + escapeHtml_(shortName) + '</span>' +
        '<span class="donut-legend-pct">' + pct + '%</span>' +
        '</div>';
    }).join('');
  }
}

function _renderHcRanking(stats) {
  var el = document.getElementById('hcRanking');
  if (!el) return;
  if (!stats.ranking.length) {
    el.innerHTML = '<div class="hist-empty"><div class="hist-empty-icon">💸</div><div>Sem custos no período</div></div>';
    return;
  }
  var maxVal = stats.ranking[0].val || 1;
  var medals = ['gold', 'silver', 'bronze'];
  el.innerHTML = stats.ranking.map(function (r, i) {
    return '<div class="hist-rank-item">' +
      '<div class="hist-rank-n ' + (medals[i] || '') + '">' + (i + 1) + '</div>' +
      '<div class="hist-rank-info">' +
      '<div class="hist-rank-name">' + r.icon + ' ' + escapeHtml_(r.name) + '</div>' +
      '<div class="hist-rank-bar-w"><div class="hist-rank-bar hc-rank-bar" style="width:0" data-w="' + Math.round(r.val / maxVal * 100) + '%"></div></div>' +
      '</div>' +
      '<div class="hist-rank-r">' +
      '<div class="hist-rank-val" style="color:var(--orange)">' + fmtBRL(r.val) + '</div>' +
      '<div class="hist-rank-qtd">' + r.qtd + ' lanç.</div>' +
      '</div></div>';
  }).join('');
  setTimeout(function () {
    el.querySelectorAll('.hc-rank-bar').forEach(function (b) {
      b.style.transition = 'width .6s ease';
      b.style.width = b.getAttribute('data-w');
    });
  }, 50);
}

function _renderHcInsights(linhas) {
  var el = document.getElementById('hcInsights');
  if (!el) return;
  if (!linhas.length) { el.innerHTML = ''; return; }
  el.innerHTML = linhas.map(function (l) {
    return '<div class="dash-insight"><span class="' + l.cls + '">•</span><span>' + l.txt + '</span></div>';
  }).join('');
}

function _renderHcLista(lista) {
  var el = document.getElementById('hcLista');
  if (!el) return;
  if (!lista.length) {
    el.innerHTML = '<div class="hist-empty"><div class="hist-empty-icon">📭</div><div>Nenhum lançamento no período</div></div>';
    return;
  }
  var grupos = {};
  var ordenados = lista.slice().sort(function (a, b) {
    var da = fmtData(a.data), db = fmtData(b.data);
    return da < db ? 1 : da > db ? -1 : 0;
  });
  ordenados.forEach(function (c) {
    var d = fmtData(c.data);
    if (!d) return;
    if (!grupos[d]) grupos[d] = [];
    grupos[d].push(c);
  });
  var html = '';
  Object.keys(grupos).sort(function (a, b) {
    var pa = a.split('/'), pb = b.split('/');
    var da = new Date(parseInt(pa[2], 10), parseInt(pa[1], 10) - 1, parseInt(pa[0], 10));
    var db = new Date(parseInt(pb[2], 10), parseInt(pb[1], 10) - 1, parseInt(pb[0], 10));
    return db - da;
  }).forEach(function (data) {
    var items = grupos[data];
    var totalDia = items.reduce(function (s, c) { return s + parseFloat(c.val || 0); }, 0);
    html += '<div class="hist-grupo">';
    html += '<div class="hist-grupo-data">' + data + ' <span style="color:var(--orange);float:right">-' + fmtBRL(totalDia) + '</span></div>';
    items.forEach(function (c) {
      var cat = c.cat || detectCat(c.desc || '');
      html += '<div class="hist-item">' +
        '<div class="hist-item-dot" style="background:var(--orange);box-shadow:0 0 6px var(--orange)"></div>' +
        '<div class="hist-item-info">' +
        '<div class="hist-item-svc">' + getCatIcon(cat) + ' ' + escapeHtml_(c.desc || '—') + '</div>' +
        '<div class="hist-item-hora">' + escapeHtml_(cat) + ' · ' + fmtHora(c.hora) + '</div>' +
        '</div>' +
        '<div class="hist-item-val" style="color:var(--orange)">-' + fmtBRL(c.val) + '</div>' +
        '</div>';
    });
    html += '</div>';
  });
  el.innerHTML = html;
}

function _preencherHcCatFilter_(lista) {
  var sel = document.getElementById('hcCatFilter');
  if (!sel || sel.dataset.loaded === '1') return;
  var cats = {};
  lista.forEach(function (c) {
    if (!hcValidCusto_(c)) return;
    var cat = c.cat || detectCat(c.desc || '');
    cats[cat] = true;
  });
  var keys = Object.keys(cats).sort();
  sel.innerHTML = '<option value="">Todas as categorias</option>' +
    keys.map(function (k) { return '<option value="' + escapeHtml_(k) + '">' + getCatIcon(k) + ' ' + escapeHtml_(k) + '</option>'; }).join('');
  sel.dataset.loaded = '1';
}

function filtrarHcCategoria() {
  var sel = document.getElementById('hcCatFilter');
  _hcCatFiltro = sel ? sel.value : '';
  renderHistoricoCustos();
}

function carregarHistoricoCustos() {
  atualizarTimerAdmin();
  var td = document.getElementById('adminTimerDisplayHc');
  var td1 = document.getElementById('adminTimerDisplay');
  if (td && td1) td.textContent = td1.textContent;
  _hcPeriodo = 'mes';
  document.querySelectorAll('#page-historico-custos .hc-btn').forEach(function (b) {
    b.classList.toggle('ativo', b.getAttribute('data-hc-periodo') === 'mes');
  });
  var custom = document.getElementById('hcCustom');
  if (custom) custom.classList.remove('show');
  var sel = document.getElementById('hcCatFilter');
  if (sel) { sel.value = ''; sel.dataset.loaded = ''; }
  _hcCatFiltro = '';
  buscarCustos().then(function () {
    renderHistoricoCustos();
  }).catch(function () {
    renderHistoricoCustos();
  });
}

function renderHistoricoCustos() {
  var range = _getHcRange();
  var badge = document.getElementById('hcPeriodoBadge');
  if (badge) badge.textContent = range.label;

  var base = custos.length > 0 ? custos : JSON.parse(localStorage.getItem('zapCustos') || '[]');
  _preencherHcCatFilter_(base);

  var noRange = _hcFiltrarPorRange(base, range.de, range.ate);
  var filtrados = _hcFiltrarCat(noRange);

  var prevRange = _getHcPrevRange(range);
  var prevFiltrados = _hcFiltrarCat(_hcFiltrarPorRange(base, prevRange.de, prevRange.ate));
  var prevTotal = prevFiltrados.reduce(function (s, c) { return s + parseFloat(c.val || 0); }, 0);

  var diasRange = _hcDiasNoRange(range.de, range.ate);
  var stats = _hcStatsFrom_(filtrados, diasRange);

  var lanc = lancamentos.length > 0 ? lancamentos : JSON.parse(localStorage.getItem('zapLanc') || '[]');
  var receitaPeriodo = lanc.filter(function (l) {
    return l && !l.cancelado && parseFloat(l.val || 0) > 0 && _dataNoRange(fmtData(l.data), range.de, range.ate);
  }).reduce(function (s, l) { return s + parseFloat(l.val || 0); }, 0);

  _renderHcKpis(stats, prevTotal);
  _renderHcCatBar(stats);
  _renderHcDiaChart(stats);
  _renderHcDonut(stats);
  _renderHcRanking(stats);
  _renderHcInsights(_hcInsights_(stats, prevTotal, receitaPeriodo));
  _renderHcLista(filtrados);
}
