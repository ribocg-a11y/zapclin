/* Pacote Z.2 — fila offline, fetch listar, refresh automático */

// ═══ FILA PENDENTES ═══
function getPendentes(){return JSON.parse(localStorage.getItem('zapPendentes')||'[]');}
function setPendentes(arr){localStorage.setItem('zapPendentes',JSON.stringify(arr));renderSyncHealth_();}
function addPendente(svcs,vals){var p=getPendentes();p.push({id:'pend_'+Date.now()+'_'+p.length,tipo:'servico-avulso',svcs:svcs,vals:vals,ts:Date.now(),tentativas:0});setPendentes(p);atualizarBadgePendentes();}
function idadePendenciaTexto_(ts){
  var diff=Math.max(0,Date.now()-(parseInt(ts||0,10)||Date.now()));
  var min=Math.floor(diff/60000);
  if(min<1)return'agora';
  if(min<60)return min+'min';
  var h=Math.floor(min/60),m=min%60;
  return h+'h'+(m?m+'min':'');
}
function syncResumoLocal_(){
  var p=getPendentes();
  var oldest=p.length?p.reduce(function(a,b){return (parseInt(a.ts||0,10)||Date.now())<(parseInt(b.ts||0,10)||Date.now())?a:b;}):null;
  var last=localStorage.getItem('zapLastSyncCycle')||'';
  return {pendentes:p,quantidade:p.length,oldest:oldest,idade:oldest?idadePendenciaTexto_(oldest.ts):'—',online:navigator.onLine!==false,last:last};
}
function renderSyncHealth_(){
  var r=syncResumoLocal_();
  var card=document.getElementById('adminSyncHealth');
  if(card)card.className='consistency-card '+(r.quantidade?'warn':'ok');
  var set=function(id,v){var el=document.getElementById(id);if(el)el.textContent=v;};
  set('syncHealthStatus',r.quantidade?'Pendência':'OK');
  set('syncPendCount',r.quantidade);
  set('syncPendAge',r.idade);
  set('syncConnState',r.online?'Online':'Offline');
  set('syncLastCycle',r.last||'—');
  var lines=document.getElementById('syncHealthLines');
  if(lines){
    if(!r.quantidade){
      lines.innerHTML='<div><strong>Fila limpa:</strong> não há registros avulsos aguardando sincronização local.</div>';
    }else{
      var tipos={};
      r.pendentes.forEach(function(x){var t=x.tipo||'servico-avulso';tipos[t]=(tipos[t]||0)+1;});
      lines.innerHTML='<div><strong>Atenção:</strong> '+r.quantidade+' item(ns) aguardando envio ao Apps Script.</div>'+
        '<div>Mais antigo: '+r.idade+'. Tipos: '+Object.keys(tipos).map(function(k){return k+' '+tipos[k];}).join(', ')+'</div>'+
        '<div>Use sincronizar quando a conexão estiver online. A fila não altera CLIENTES/OS enquanto não confirmar no backend.</div>';
    }
  }
}
function atualizarBadgePendentes(){var p=getPendentes();var n=p.length;var badge=document.getElementById('pendenteBadge');var syncBtn=document.getElementById('syncBtn');var syncCount=document.getElementById('syncCount');if(badge){badge.textContent=n>0?n:'';badge.style.display=n>0?'flex':'none';}if(syncBtn){syncBtn.style.display=n>0?'flex':'none';} if(syncCount){syncCount.textContent=n;}renderSyncHealth_();}
function sincronizarPendentes(){var p=getPendentes();if(!p.length){showToast('✅ Tudo sincronizado!');renderSyncHealth_();return;}showToast('🔄 Sincronizando '+p.length+'...','orange');_syncNext(p,0,p.length);}
function _syncNext(p,idx,total){if(idx>=p.length){var r=getPendentes();localStorage.setItem('zapLastSyncCycle',dataHoraLocal_());if(!r.length)showToast('✅ '+(total||p.length)+' registro(s) sincronizado(s)!');else showToast('⚠️ '+r.length+' ainda pendentes','orange');atualizarBadgePendentes();return;}var item=p[idx];apiGet('salvar',{svcs:item.svcs,vals:item.vals},15000).then(function(resp){if(resp&&resp.ok){var atual=getPendentes();atual.splice(0,1);setPendentes(atual);atualizarBadgePendentes();setTimeout(function(){_syncNext(p,idx+1,total);},500);}else{var pend=getPendentes();if(pend[0])pend[0].tentativas=(parseInt(pend[0].tentativas||0,10)||0)+1;setPendentes(pend);showToast('❌ Erro ao sincronizar','error');atualizarBadgePendentes();}}).catch(function(){var pend=getPendentes();if(pend[0])pend[0].tentativas=(parseInt(pend[0].tentativas||0,10)||0)+1;setPendentes(pend);showToast('⚠️ Sem conexão.','orange');atualizarBadgePendentes();});}

// ═══ BUSCAR / LISTAR (sync backend → cache local) ═══
function buscarLancamentos(){return apiGet('listar',{},12000).then(function(j){if(j&&j.ok&&j.items){lancamentos=j.items;localStorage.setItem('zapLanc',JSON.stringify(lancamentos));return true;}return false;}).catch(function(){return false;});}
function buscarCustos(){return apiGet('listarCustos',{},12000).then(function(j){if(j&&j.ok&&j.items){custos=j.items;localStorage.setItem('zapCustos',JSON.stringify(custos));return true;}return false;}).catch(function(){return false;});}
function buscarClientes(){return apiGet('listarClientes',{},12000).then(function(j){if(j&&j.ok&&j.items){clientes=j.items;clientesFiltrados=clientes.slice();localStorage.setItem('zapClientes',JSON.stringify(clientes));return true;}return false;}).catch(function(){return false;});}

// ═══ PERFORMANCE — ATUALIZAÇÃO AUTOMÁTICA ═══
var _refreshInterval = null;
var _lastRefresh = 0;
var REFRESH_COOLDOWN = 10000; // 10s entre refreshes para manter aparelhos alinhados
var _refreshRodando = false;

function renderDadosDependentes_(opts){
  opts=opts||{};
  try{_calcStatsHome();}catch(e){}
  if(opts.clientes!==false){try{renderClienteList();}catch(e){}}
  if(opts.lancamentos!==false){try{renderVendasGerencial();}catch(e){}}
  if(opts.crm!==false){try{crmClientes=consolidarClientesCRM_();renderRelacionamento();}catch(e){}}
  if(opts.operacao!==false){try{renderOperacaoPainel();}catch(e){}}
  if(opts.historico){try{renderHistorico();}catch(e){}}
  if(opts.historicoCustos){try{renderHistoricoCustos();}catch(e){}}
}

function refreshDados(force) {
  var agora = Date.now();
  if(_refreshRodando)return;
  if (!force && agora - _lastRefresh < REFRESH_COOLDOWN) return;
  _lastRefresh = agora;
  _refreshRodando = true;

  Promise.all([buscarLancamentos(), buscarClientes(), buscarCustos()])
    .then(function(results) {
      var algumOk = results.some(function(r){ return r; });
      if (algumOk) {
        renderDadosDependentes_({historico:true,historicoCustos:true});
        if (isAdmin) {
          var pageAdmin = document.getElementById('page-admin');
          if (pageAdmin && pageAdmin.classList.contains('active')) carregarPainelAdmin();
        }
      }
    })
    .catch(function(e){ console.error('refreshDados:', e); })
    .finally(function(){_refreshRodando=false;});
}

function agendarRefreshAposEscrita_(delay){
  setTimeout(function(){refreshDados(true);},delay||900);
}

function iniciarAutoRefresh() {
  if (_refreshInterval) clearInterval(_refreshInterval);
  _refreshInterval = setInterval(function() {
    if (!document.hidden) refreshDados(false);
  }, 15000);
}

document.addEventListener('visibilitychange', function() {
  if (!document.hidden) {
    var agora = Date.now();
    if (agora - _lastRefresh > REFRESH_COOLDOWN) {
      refreshDados(true);
      _calcStatsHome();
    }
  }
});

window.addEventListener('focus', function() {
  var agora = Date.now();
  if (agora - _lastRefresh > REFRESH_COOLDOWN) {
    refreshDados(true);
  }
});
