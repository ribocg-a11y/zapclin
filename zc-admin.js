/* Pacote Z.4 — PIN admin, KPIs, fechamento, consistência, diagnóstico painel */

// ═══ ADMIN / PIN ═══
// [v4.8 ALTERAÇÃO]
// Reforço de segurança do acesso administrativo sem alterar backend nem fluxos operacionais.
// Observação técnica: como o frontend é público no GitHub Pages, este PIN melhora controle operacional,
// mas não substitui proteção real server-side no Apps Script para actions sensíveis.
const ADMIN_CONFIG={
  pin:'1321',              // PIN atual preservado para não alterar operação da ZapClin.
  sessionSeconds:60,       // Mantido igual ao baseline: sessão curta de 1 minuto.
  maxAttempts:5,           // Bloqueia temporariamente após 5 erros consecutivos.
  lockSeconds:60,          // Tempo de bloqueio após excesso de tentativas.
  lockKey:'zapAdminLockUntil'
};
var isAdmin=false;
var adminTimerInt=null;
var adminCountdown=ADMIN_CONFIG.sessionSeconds;
var pinBuffer='';
var adminFailedAttempts=0;

function adminNow_(){return Date.now();}
function adminLockUntil_(){return parseInt(localStorage.getItem(ADMIN_CONFIG.lockKey)||'0',10)||0;}
function adminIsLocked_(){return adminLockUntil_()>adminNow_();}
function adminLockRemaining_(){return Math.max(0,Math.ceil((adminLockUntil_()-adminNow_())/1000));}
function adminClearLock_(){try{localStorage.removeItem(ADMIN_CONFIG.lockKey);}catch(e){}}
function adminSetLock_(){
  try{localStorage.setItem(ADMIN_CONFIG.lockKey,String(adminNow_()+ADMIN_CONFIG.lockSeconds*1000));}catch(e){}
}
function adminShowLocked_(){
  var restante=adminLockRemaining_();
  showToast('🔒 Admin bloqueado por '+restante+'s após tentativas incorretas','orange');
}
function adminResetSessionTimer_(){
  adminCountdown=ADMIN_CONFIG.sessionSeconds;
  atualizarTimerAdmin();
}

var _resumoDiarioAdminTexto='';

function resumoOperacaoDiaria_(kpis){
  var arr=clientes.length>0?clientes:JSON.parse(localStorage.getItem('zapClientes')||'[]');
  var ativos=arr.filter(function(c){return c.status!=='Entregue'&&c.status!=='Cancelado';});
  var prontos=ativos.filter(function(c){return c.status==='Pronto';});
  var producao=ativos.filter(function(c){return c.status!=='Pronto';});
  var atencao=producao.filter(function(c){var s=statusPrazoCliente_(c);return s.cls==='warn'||s.cls==='late';});
  var atrasados=producao.filter(function(c){return statusPrazoCliente_(c).cls==='late';});
  var receitaHoje=kpis&&kpis.recHoje?parseFloat(kpis.recHoje):0;
  var custosHoje=kpis&&kpis.cusHoje?parseFloat(kpis.cusHoje):0;
  var resultadoHoje=receitaHoje-custosHoje;
  var linhas=[
    {cls:resultadoHoje>=0?'ok':'bad',txt:'Resultado de hoje: <strong>'+fmtBRL(resultadoHoje)+'</strong> ('+fmtBRL(receitaHoje)+' de receita e '+fmtBRL(custosHoje)+' em custos).'},
    {cls:producao.length?'info':'ok',txt:'Fila ativa: <strong>'+ativos.length+'</strong> cliente(s), sendo '+producao.length+' em produção e '+prontos.length+' pronto(s) para retirada.'}
  ];
  if(atrasados.length)linhas.push({cls:'bad',txt:'Ação imediata: <strong>'+atrasados.length+'</strong> atendimento(s) atrasado(s). Priorize contato e conclusão antes de novos encaixes.'});
  else if(atencao.length)linhas.push({cls:'warn',txt:'Atenção: <strong>'+atencao.length+'</strong> atendimento(s) próximo(s) do prazo. Vale revisar a fila agora.'});
  else linhas.push({cls:'ok',txt:'SLA sob controle no momento. Nenhum atendimento em atraso pela leitura atual.'});
  if(prontos.length)linhas.push({cls:'ok',txt:'Retirada: existem <strong>'+prontos.length+'</strong> capacete(s) pronto(s). Reforce WhatsApp e organize balcão para entrega rápida.'});
  else linhas.push({cls:'info',txt:'Retirada: sem capacetes prontos agora. Foque em reduzir tempo dos atendimentos em produção.'});
  linhas.push({cls:'info',txt:sugestaoRetiradaTexto_()});
  _resumoDiarioAdminTexto='Resumo diário ZapClin\n'+
    linhas.map(function(l){return'- '+stripHtml_(l.txt);}).join('\n');
  return linhas;
}

function renderResumoDiarioAdmin_(kpis){
  var el=document.getElementById('adminResumoDiario');
  if(!el)return;
  var linhas=resumoOperacaoDiaria_(kpis||calcularKpisAdminLocal_());
  el.querySelector('.strategy-lines').innerHTML=linhas.map(function(l){
    return '<div class="strategy-line"><span class="'+l.cls+'">•</span><span>'+l.txt+'</span></div>';
  }).join('')+
  '<div class="daily-actions"><span class="daily-chip">WhatsApp por status</span><span class="daily-chip">SLA monitorado</span><span class="daily-chip">Retirada sugerida</span></div>';
}

function copiarResumoDiarioAdmin_(){copiarTexto_(_resumoDiarioAdminTexto||'Resumo diário ainda não carregado.','Resumo diário copiado.');}

var _fechamentoDiarioAdminTexto='';

function fechamentoDiarioAdmin_(kpis){
  var lanc=lancamentos.length>0?lancamentos:JSON.parse(localStorage.getItem('zapLanc')||'[]');
  var cli=clientes.length>0?clientes:JSON.parse(localStorage.getItem('zapClientes')||'[]');
  var hoje=hojeBR_();
  var lancHoje=lanc.filter(function(l){
    var svc=String(l&&l.svc||'');
    return fmtData(l&&l.data)===hoje&&!l.cancelado&&!/^CANCELADO\b/i.test(svc);
  });
  var servicosHoje=lancHoje.reduce(function(s,l){return s+qtdLancamentoRel_(l);},0);
  var receitaHoje=kpis&&typeof kpis.recHoje==='number'?kpis.recHoje:lancHoje.reduce(function(s,l){return s+parseFloat(l.val||0);},0);
  var osAtivas=cli.filter(clienteAberto_);
  var emProducao=osAtivas.filter(function(c){return String(c.status||'')!=='Pronto';});
  var prontos=osAtivas.filter(function(c){return String(c.status||'')==='Pronto';});
  var atrasados=emProducao.filter(function(c){return statusPrazoCliente_(c).cls==='late';});
  var aceitesPend=osAtivas.filter(function(c){return aceiteStatus_(c)!=='CONFIRMADO';});
  var pendLocal=getPendentes();
  var custosHoje=kpis&&typeof kpis.cusHoje==='number'?kpis.cusHoje:0;
  var pendencias=atrasados.length+prontos.length+aceitesPend.length+pendLocal.length;
  var itens=[
    {cls:servicosHoje>0?'ok':'warn',txt:servicosHoje>0?'Lancamentos do dia registrados: '+servicosHoje+' servico(s).':'Nenhum lancamento encontrado hoje. Conferir antes de encerrar.'},
    {cls:receitaHoje>0?'ok':'warn',txt:'Faturamento do dia: '+fmtBRL(receitaHoje)+(custosHoje>0?' | custos: '+fmtBRL(custosHoje):'')+'.'},
    {cls:atrasados.length?'bad':'ok',txt:atrasados.length?atrasados.length+' OS em atraso na fila. Priorizar contato/conclusao antes do fechamento.':'Sem OS atrasada na leitura atual.'},
    {cls:prontos.length?'warn':'ok',txt:prontos.length?prontos.length+' OS pronta(s) ainda aguardando retirada/entrega.':'Sem OS pronta pendente de retirada.'},
    {cls:aceitesPend.length?'warn':'ok',txt:aceitesPend.length?aceitesPend.length+' OS ativa(s) sem aceite confirmado. Enviar link antes de avancar.':'Aceites das OS ativas em dia.'},
    {cls:pendLocal.length?'bad':'ok',txt:pendLocal.length?pendLocal.length+' registro(s) local(is) pendente(s) de sincronizacao neste aparelho.':'Fila offline local limpa neste aparelho.'}
  ];
  _fechamentoDiarioAdminTexto='Fechamento diario ZapClin - '+hoje+'\n'+
    'Servicos hoje: '+servicosHoje+'\n'+
    'Faturamento: '+fmtBRL(receitaHoje)+'\n'+
    'OS abertas/prontas: '+emProducao.length+'/'+prontos.length+'\n'+
    'Pendencias: '+pendencias+'\n\n'+
    itens.map(function(i){return'- '+stripHtml_(i.txt);}).join('\n');
  return {servicosHoje:servicosHoje,receitaHoje:receitaHoje,osAbertas:emProducao.length,prontos:prontos.length,pendencias:pendencias,itens:itens};
}

function renderFechamentoDiarioAdmin_(kpis){
  var card=document.getElementById('adminFechamentoDiario');
  if(!card)return;
  var f=fechamentoDiarioAdmin_(kpis||calcularKpisAdminLocal_());
  [['closeServicos',f.servicosHoje],['closeReceita',fmtBRL(f.receitaHoje)],['closeOsAbertas',f.osAbertas+'/'+f.prontos],['closePendencias',f.pendencias]].forEach(function(x){
    var el=document.getElementById(x[0]);if(el)el.textContent=x[1];
  });
  var list=document.getElementById('closeChecklist');
  if(list)list.innerHTML=f.itens.map(function(i){
    return '<div class="closing-item"><span class="closing-dot '+i.cls+'">•</span><span>'+escapeHtml_(stripHtml_(i.txt))+'</span></div>';
  }).join('');
}

function copiarFechamentoDiarioAdmin_(){
  copiarTexto_(_fechamentoDiarioAdminTexto||'Fechamento diario ainda nao carregado.','Fechamento diario copiado.');
}

function abrirAdmin(){
  // [v4.8 ALTERAÇÃO]
  // Antes de abrir o PIN, verifica bloqueio temporário por excesso de tentativas incorretas.
  if(isAdmin){goTo('admin',document.querySelector('.sb-btn[data-page="admin"]'));return;}
  if(adminIsLocked_()){adminShowLocked_();return;}
  pinBuffer='';
  atualizarDotsPIN();
  var overlay=document.getElementById('pinOverlay');
  if(overlay)overlay.classList.add('show');
}
function fecharPin(){
  var overlay=document.getElementById('pinOverlay');
  if(overlay)overlay.classList.remove('show');
  pinBuffer='';
  atualizarDotsPIN();
}
function pinKey(d){
  // [v4.8 ALTERAÇÃO]
  // Impede digitação enquanto o Admin estiver temporariamente bloqueado.
  if(adminIsLocked_()){adminShowLocked_();return;}
  if(pinBuffer.length>=4)return;
  pinBuffer+=d;
  atualizarDotsPIN();
  if(pinBuffer.length===4)setTimeout(verificarPIN,120);
}
function pinDel(){
  if(pinBuffer.length>0){pinBuffer=pinBuffer.slice(0,-1);atualizarDotsPIN();}
}
function atualizarDotsPIN(){
  for(var i=0;i<4;i++){
    var d=document.getElementById('pd'+i);
    if(!d)continue;
    d.className='pin-dot'+(i<pinBuffer.length?' filled':'');
  }
}
function verificarPIN(){
  if(adminIsLocked_()){
    pinBuffer='';
    atualizarDotsPIN();
    adminShowLocked_();
    return;
  }
  if(pinBuffer===ADMIN_CONFIG.pin){
    logEventoSistema_('ADMIN','verificarPIN','OK','Admin autenticado',{});
    // [v4.8 ALTERAÇÃO]
    // Zera tentativas e remove bloqueio anterior quando o acesso é válido.
    adminFailedAttempts=0;
    adminClearLock_();
    fecharPin();
    entrarAdmin();
  } else {
    adminFailedAttempts++;
    logEventoSistema_('ADMIN','verificarPIN','ALERTA','PIN incorreto',{tentativa:adminFailedAttempts});
    for(var i=0;i<4;i++){
      var d=document.getElementById('pd'+i);
      if(d)d.className='pin-dot error';
    }
    if(navigator.vibrate)navigator.vibrate([100,50,100]);

    if(adminFailedAttempts>=ADMIN_CONFIG.maxAttempts){
      adminSetLock_();
      setTimeout(function(){
        fecharPin();
        adminShowLocked_();
      },500);
      return;
    }

    setTimeout(function(){
      pinBuffer='';
      atualizarDotsPIN();
      showToast('⚠️ PIN incorreto. Tentativa '+adminFailedAttempts+'/'+ADMIN_CONFIG.maxAttempts,'orange');
    },700);
  }
}
function entrarAdmin(){
  // [v4.8 ALTERAÇÃO]
  // Evita múltiplos intervalos/listeners se entrarAdmin() for chamado mais de uma vez.
  isAdmin=true;
  if(adminTimerInt){clearInterval(adminTimerInt);adminTimerInt=null;}
  document.removeEventListener('click',resetAdminTimer);
  document.removeEventListener('touchstart',resetAdminTimer);

  adminResetSessionTimer_();

  var sec=document.getElementById('sbAdminSection');
  if(sec)sec.classList.add('visible');
  var bar=document.getElementById('sbAdminBar');
  if(bar)bar.classList.add('visible');
  var gbtn=document.getElementById('sbGerenciarBtn');
  if(gbtn)gbtn.style.display='none';

  adminTimerInt=setInterval(function(){
    adminCountdown--;
    atualizarTimerAdmin();
    if(adminCountdown<=0)adminLogout();
  },1000);

  document.addEventListener('click',resetAdminTimer);
  document.addEventListener('touchstart',resetAdminTimer);
  showToast('✅ Bem-vindo, Administrador!','blue');
  goTo('admin',document.querySelector('.sb-btn[data-page="admin"]'));
}
function resetAdminTimer(){
  if(!isAdmin)return;
  adminResetSessionTimer_();
}
function atualizarTimerAdmin(){
  var m=Math.floor(adminCountdown/60);
  var s=adminCountdown%60;
  var str=m+':'+String(s).padStart(2,'0');
  ['sbTimer','adminTimerDisplay','adminTimerDisplay2','adminTimerDisplay3','adminTimerDisplayLogs','adminTimerDisplayAceites','adminTimerDisplayHc'].forEach(function(id){
    var el=document.getElementById(id);
    if(el)el.textContent=str;
  });
}
function adminLogout(){
  logEventoSistema_('ADMIN','adminLogout','OK','Sessão admin encerrada',{});
  isAdmin=false;
  pinBuffer='';
  if(adminTimerInt){clearInterval(adminTimerInt);adminTimerInt=null;}
  document.removeEventListener('click',resetAdminTimer);
  document.removeEventListener('touchstart',resetAdminTimer);
  var sec=document.getElementById('sbAdminSection');
  if(sec)sec.classList.remove('visible');
  var bar=document.getElementById('sbAdminBar');
  if(bar)bar.classList.remove('visible');
  var gbtn=document.getElementById('sbGerenciarBtn');
  if(gbtn)gbtn.style.display='';
  atualizarDotsPIN();
  showToast('🔐 Sessão admin encerrada','orange');
  mostrarHome();
}

function aplicarKpisAdmin_(kpis, origem){
  // [v4.1 NOVO]
  // Centraliza a renderização dos KPIs do Painel Admin para permitir duas fontes:
  // 1) servidor Apps Script, via action=buscarKpisAdmin; 2) fallback local/cache.
  // Isso evita duplicar escrita de DOM e reduz risco de divergência visual.
  if(!kpis) return;
  var khEl=document.getElementById('kAdminHoje');if(khEl)khEl.textContent=fmtBRL(kpis.recHoje||0);
  var khnEl=document.getElementById('kAdminHojeN');if(khnEl)khnEl.textContent=(kpis.atHoje||0)+' serviço(s)';
  var kchEl=document.getElementById('kAdminCusHoje');if(kchEl)kchEl.textContent=fmtBRL(kpis.cusHoje||0);
  var kmEl=document.getElementById('kAdminMes');if(kmEl)kmEl.textContent=fmtBRL(kpis.recMes||0);
  var kmnEl=document.getElementById('kAdminMesN');if(kmnEl)kmnEl.textContent=(kpis.atMes||0)+' serviço(s)';
  var krEl=document.getElementById('kAdminResultado');
  if(krEl){krEl.textContent=fmtBRL(kpis.resultado||0);krEl.style.color=(kpis.resultado||0)>=0?'var(--green)':'var(--red)';}
  var kmgEl=document.getElementById('kAdminMargem');if(kmgEl)kmgEl.textContent='margem '+(kpis.margem||0)+'%';
  var td2=document.getElementById('adminTimerDisplay2');
  var td1=document.getElementById('adminTimerDisplay');
  if(td2&&td1)td2.textContent=td1.textContent;
  renderResumoDiarioAdmin_(kpis);
  renderFechamentoDiarioAdmin_(kpis);
}

function calcularKpisAdminLocal_(){
  // [v4.1 NOVO]
  // Fallback preservando exatamente a lógica anterior do v4.0 baseada em cache local.
  // Usado imediatamente ao abrir o painel e também quando o servidor não responder.
  var lanc=lancamentos.length>0?lancamentos:JSON.parse(localStorage.getItem('zapLanc')||'[]');
  var cst=custos.length>0?custos:JSON.parse(localStorage.getItem('zapCustos')||'[]');
  var now=new Date();
  var dd=String(now.getDate()).padStart(2,'0'),mm=String(now.getMonth()+1).padStart(2,'0'),yyyy=now.getFullYear();
  var hoje=dd+'/'+mm+'/'+yyyy, mes=mm+'/'+yyyy;
  function gm(d){var s=fmtData(d);if(!s||s==='—')return'';var p=s.split('/');return p.length>=3?p[1]+'/'+p[2]:'';}
  var lancHoje=lanc.filter(function(l){return fmtData(l.data)===hoje;});
  var lancMes=lanc.filter(function(l){return gm(l.data)===mes;});
  var cstMes=cst.filter(function(c){return gm(c.data)===mes;});
  var fatHoje=lancHoje.reduce(function(s,l){return s+parseFloat(l.val||0);},0);
  var fatMes=lancMes.reduce(function(s,l){return s+parseFloat(l.val||0);},0);
  var cusMes=cstMes.reduce(function(s,c){return s+parseFloat(c.val||0);},0);
  var cusHoje=cst.filter(function(c){return fmtData(c.data)===hoje;}).reduce(function(s,c){return s+parseFloat(c.val||0);},0);
  var resultado=fatMes-cusMes;
  var margem=fatMes>0?parseFloat((resultado/fatMes*100).toFixed(1)):0;
  var atHoje=lancHoje.reduce(function(s,l){return s+qtdLancamentoRel_(l);},0);
  var atMes=lancMes.reduce(function(s,l){return s+qtdLancamentoRel_(l);},0);
  var ticket=atMes>0?parseFloat((fatMes/atMes).toFixed(2)):0;
  return {recHoje:fatHoje,cusHoje:cusHoje,recMes:fatMes,cusMes:cusMes,atHoje:atHoje,atMes:atMes,resultado:resultado,margem:margem,ticket:ticket};
}

function calcularConsistenciaOperacional_(){
  var lanc=lancamentos.length>0?lancamentos:JSON.parse(localStorage.getItem('zapLanc')||'[]');
  var cli=clientes.length>0?clientes:JSON.parse(localStorage.getItem('zapClientes')||'[]');
  var hoje=hojeBR_();
  var lancHoje=lanc.filter(function(l){
    var svc=String(l&&l.svc||'');
    return fmtData(l&&l.data)===hoje&&!l.cancelado&&!/^CANCELADO\b/i.test(svc);
  });
  var servicosHoje=lancHoje.reduce(function(s,l){return s+qtdLancamentoRel_(l);},0);
  var temInfo=lancHoje.some(lancamentoTemInfoCliente_);
  var vinculados=temInfo?lancHoje.filter(function(l){return !lancamentoAvulso_(l);}).reduce(function(s,l){return s+qtdLancamentoRel_(l);},0):0;
  var avulsos=temInfo?lancHoje.filter(lancamentoAvulso_).reduce(function(s,l){return s+qtdLancamentoRel_(l);},0):0;
  var osHoje=cli.filter(function(c){return fmtData(c&&c.data)===hoje&&!clienteCancelado_(c);}).length;
  var osAtivas=cli.filter(clienteAberto_).length;
  var abertasHoje=cli.filter(function(c){return fmtData(c&&c.data)===hoje&&clienteAberto_(c);}).length;
  var status='ok';
  var linhas=[
    '<strong>Regra aplicada:</strong> Home/Vendas leem LANCAMENTOS; Clientes/Operação leem CLIENTES/OS.'
  ];
  if(!temInfo&&lancHoje.length){
    status='warn';
    linhas.push('Backend ainda não trouxe vínculo CLIENTE/OS em listar. Reimplantar Apps Script v3.44 para distinguir OS e avulso.');
  }else{
    linhas.push('Hoje: '+servicosHoje+' serviço(s), '+vinculados+' vinculado(s) a OS e '+avulsos+' avulso(s) válido(s).');
  }
  if(servicosHoje>0&&osHoje===0){
    linhas.push('Existem serviços hoje sem OS cadastrada hoje. Isso pode ser normal quando o registro foi avulso.');
  }
  if(osAtivas>0&&!cli.length){
    status='warn';
    linhas.push('Cache de clientes indisponível para validar Operação.');
  }
  if(servicosHoje===0&&osAtivas>0){
    status='warn';
    linhas.push('Há OS ativa, mas nenhum lançamento hoje no cache. Verificar se o lançamento foi criado em outro dia ou se a sincronização ainda não atualizou.');
  }
  return {status:status,servicosHoje:servicosHoje,osAtivas:osAtivas,vinculados:vinculados,avulsos:avulsos,osHoje:osHoje,abertasHoje:abertasHoje,linhas:linhas,temInfo:temInfo};
}

function renderConsistenciaOperacional_(){
  var c=calcularConsistenciaOperacional_();
  var card=document.getElementById('adminConsistencia');
  if(card){card.className='consistency-card '+(c.status==='ok'?'ok':c.status==='error'?'error':'warn');}
  var status=document.getElementById('consStatus');
  if(status)status.textContent=c.status==='ok'?'Coerente':'Atenção';
  [['consServicosHoje',c.servicosHoje],['consOsAtivas',c.osAtivas],['consVinculados',c.temInfo?c.vinculados:'—'],['consAvulsos',c.temInfo?c.avulsos:'—']].forEach(function(x){
    var el=document.getElementById(x[0]);if(el)el.textContent=x[1];
  });
  var linhas=document.getElementById('consLinhas');
  if(linhas)linhas.innerHTML=c.linhas.map(function(l){return'<div>'+l+'</div>';}).join('');
}

function renderDiagnosticoBackend_(r, erro){
  var card=document.getElementById('adminDiagnostico');
  var status=document.getElementById('diagStatus');
  var resumo=document.getElementById('diagResumo');
  var list=document.getElementById('diagList');
  var btn=document.getElementById('diagBtn');
  if(btn){btn.disabled=false;btn.textContent='Executar diagnóstico';}
  if(erro||!r){
    if(card)card.className='consistency-card error';
    if(status)status.textContent='Falhou';
    if(resumo)resumo.innerHTML='<div>Não foi possível executar o diagnóstico agora.</div><div>'+escapeHtml_(String(erro||''))+'</div>';
    if(list)list.innerHTML='';
    return;
  }
  var checks=Array.isArray(r.checks)?r.checks:[];
  var falhas=checks.filter(function(c){return !c.ok;}).length;
  if(card)card.className='consistency-card '+(r.ok&&falhas===0?'ok':'warn');
  if(status)status.textContent=r.ok&&falhas===0?'OK':'Atenção';
  if(resumo){
    var total=(r.resumo&&r.resumo.totalChecks)||checks.length||0;
    var ok=(r.resumo&&r.resumo.ok)||(total-falhas);
    resumo.innerHTML='<div><strong>Resultado:</strong> '+ok+'/'+total+' checks OK · backend '+escapeHtml_(r.version||'—')+'</div>'+
      '<div><strong>Fonte:</strong> '+escapeHtml_(r.fonte||'diagnosticoSistema')+' · '+escapeHtml_(r.timestamp||'agora')+'</div>';
  }
  if(list){
    list.innerHTML=checks.slice(0,18).map(function(c){
      return '<div class="diag-item"><div><div class="diag-name">'+escapeHtml_(c.nome||'Check')+'</div><div class="diag-detail">'+escapeHtml_(c.detalhe||'')+'</div></div><span class="diag-pill '+(c.ok?'ok':'fail')+'">'+(c.ok?'OK':'Falha')+'</span></div>';
    }).join('') || '<div class="diag-item"><div class="diag-name">Sem checks retornados</div><span class="diag-pill fail">Atenção</span></div>';
  }
}

function executarDiagnosticoBackend_(){
  atualizarTimerAdmin();
  var btn=document.getElementById('diagBtn');
  var status=document.getElementById('diagStatus');
  var resumo=document.getElementById('diagResumo');
  var list=document.getElementById('diagList');
  if(btn){btn.disabled=true;btn.textContent='Executando...';}
  if(status)status.textContent='Executando';
  if(resumo)resumo.innerHTML='<div>Consultando Apps Script e registrando evento em LOGS...</div>';
  if(list)list.innerHTML='<div class="skeleton-card sm"></div>';
  apiGet('diagnosticoSistema',{},18000)
    .then(function(r){
      if(r&&r.ok!==undefined){renderDiagnosticoBackend_(r);return;}
      renderDiagnosticoBackend_(null,'Resposta inválida do backend');
    })
    .catch(function(err){renderDiagnosticoBackend_(null,err&&err.message?err.message:err);});
}

function isKpisAdminServerValido_(r, localKpis){
  // [v4.8.1 HOTFIX]
  // Evita que uma resposta server-side zerada/incompleta sobrescreva KPIs locais válidos.
  // Causa observada: Painel Admin carregava valores e depois zerava quando buscarKpisAdmin retornava 0.
  if(!r || !r.ok) return false;
  var campos=['recHoje','cusHoje','recMes','cusMes','atHoje','atMes','resultado','margem','ticket'];
  var temNumero=false;
  for(var i=0;i<campos.length;i++){
    if(typeof r[campos[i]]==='number' && !isNaN(r[campos[i]])){temNumero=true;break;}
  }
  if(!temNumero) return false;
  var serverTotal=(parseFloat(r.recHoje||0)+parseFloat(r.recMes||0)+parseFloat(r.atHoje||0)+parseFloat(r.atMes||0)+parseFloat(r.cusHoje||0)+parseFloat(r.cusMes||0));
  var localTotal=localKpis?(parseFloat(localKpis.recHoje||0)+parseFloat(localKpis.recMes||0)+parseFloat(localKpis.atHoje||0)+parseFloat(localKpis.atMes||0)+parseFloat(localKpis.cusHoje||0)+parseFloat(localKpis.cusMes||0)):0;
  if(serverTotal===0 && localTotal>0) return false;
  return true;
}

function carregarPainelAdmin(){
  // [v4.8.1 HOTFIX]
  // Fluxo seguro:
  // 1) renderiza local/cache imediatamente;
  // 2) busca KPIs oficiais no servidor;
  // 3) só sobrescreve a tela se a resposta do servidor for válida;
  // 4) se o servidor vier zerado/incompleto, preserva os dados locais.
  atualizarTimerAdmin();
  var localKpis=calcularKpisAdminLocal_();
  aplicarKpisAdmin_(localKpis,'local');
  renderConsistenciaOperacional_();
  renderSyncHealth_();
  apiGet('buscarKpisAdmin',{},12000)
    .then(function(r){
      if(isKpisAdminServerValido_(r,localKpis)){
        aplicarKpisAdmin_(r,'server');
        try{localStorage.setItem('zapKpisAdminServer',JSON.stringify({t:Date.now(),data:r}));}catch(e){}
      }else{
        console.warn('[ZapClin v4.8.2] buscarKpisAdmin retornou dados zerados/incompletos. Mantendo KPIs locais.',r);
        aplicarKpisAdmin_(localKpis,'server-invalid-fallback');
      }
    })
    .catch(function(err){
      console.warn('[ZapClin v4.8.2] Falha ao buscar KPIs no servidor. Mantendo fallback local.',err);
      aplicarKpisAdmin_(localKpis,'fallback');
    });
}

