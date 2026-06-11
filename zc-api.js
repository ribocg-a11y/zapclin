/* Pacote Z.1 — comunicação GAS (JSONP / apiGet) */
// ═══ JSONP ═══
function jsonp(url,timeout){timeout=timeout||12000;return new Promise(function(resolve,reject){var cb='zap_'+Date.now()+'_'+Math.floor(Math.random()*99999);var s=document.createElement('script');var t=setTimeout(function(){cleanup();reject('timeout');},timeout);function cleanup(){clearTimeout(t);delete window[cb];if(s.parentNode)s.remove();}window[cb]=function(d){cleanup();resolve(d);};s.onerror=function(){cleanup();reject('error');};s.src=url+(url.indexOf('?')>=0?'&':'?')+('callback='+cb+'&t='+Date.now());document.head.appendChild(s);});}

// [v4.2 API CENTRALIZADA]
// Todas as novas chamadas GET do Apps Script devem passar por esta função.
// Motivo: reduzir duplicação de URL/action/callback e padronizar timeout/cache-buster.
function apiGet(action,params,timeout){
  params=params||{};
  var qs='action='+encodeURIComponent(action);
  Object.keys(params).forEach(function(k){
    if(params[k]!==undefined&&params[k]!==null)qs+='&'+encodeURIComponent(k)+'='+encodeURIComponent(params[k]);
  });
  // [v4.8.6 ALTERAÇÃO]
  // Padroniza observabilidade de falhas de API sem bloquear o fluxo principal.
  return jsonp(webAppUrl+'?'+qs,timeout||12000).then(function(resp){
    if(resp && resp.ok===false){
      logEventoSistema_('API','apiGet:'+action,'ERRO',String(resp.error||'Resposta ok=false'),{action:action});
    }
    return resp;
  }).catch(function(err){
    logEventoSistema_('API','apiGet:'+action,'ERRO',String(err||'Falha API'),{action:action});
    throw err;
  });
}

function logEventoSistema_(tipo,origem,status,mensagem,extra){
  // [v4.8.6 NOVO]
  // Telemetria leve do frontend. Envia evento para Apps Script v3.21 registrar na aba LOGS.
  // Não usa apiGet para evitar recursão; usa Image beacon e nunca interrompe a operação do usuário.
  try{
    if(!webAppUrl)return;
    var params={
      action:'registrarEventoFrontend',
      tipo:tipo||'FRONTEND',
      origem:origem||'PWA',
      status:status||'INFO',
      msg:String(mensagem||'Evento frontend').substring(0,800),
      appVersion:APP_VERSION,
      tela:(document.querySelector('.page.active')||{}).id||'',
      url:location.pathname,
      online:navigator.onLine?'1':'0',
      ua:(navigator.userAgent||'').substring(0,300),
      extra:extra?JSON.stringify(extra).substring(0,1200):''
    };
    var qs=Object.keys(params).map(function(k){return encodeURIComponent(k)+'='+encodeURIComponent(params[k]);}).join('&');
    var img=new Image();
    img.referrerPolicy='no-referrer';
    img.src=webAppUrl+'?'+qs+'&_ts='+Date.now();
  }catch(e){
    try{console.warn('[ZapClin] Falha telemetria:',e);}catch(_e){}
  }
}

// [v4.2 PERFORMANCE]
// Carrega cache local antes da rede para a Home abrir rápido mesmo em 4G fraco.
