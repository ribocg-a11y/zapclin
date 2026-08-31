/* Pacote Z — login operador / supervisor / ADM + sessao de turno */
var ZC_AUTH_PEPPER = 'zapclin-auth-v1';
var ZC_AUTH_KEY = 'zapSessao';
var ZC_AUTH_UNIDADE_KEY = 'zapUnidadeFiltro';
var _zcAuthBootouApp_ = false;

function zcAuthSessao_(){
  try{
    var s=JSON.parse(localStorage.getItem(ZC_AUTH_KEY)||'null');
    if(!s||!s.token||!s.usuario)return null;
    return s;
  }catch(e){return null;}
}
function zcAuthSessToken_(){
  var s=zcAuthSessao_();
  return s&&s.token?String(s.token):'';
}
function zcAuthPerfil_(){
  var s=zcAuthSessao_();
  return s&&s.perfil?String(s.perfil).toLowerCase():'';
}
function zcAuthUnidadeId_(){
  var s=zcAuthSessao_();
  return s&&s.unidadeId?String(s.unidadeId).toLowerCase():'';
}
function zcAuthUnidadeFiltro_(){
  if(zcAuthPerfil_()!=='adm')return zcAuthUnidadeId_();
  try{
    var f=sessionStorage.getItem(ZC_AUTH_UNIDADE_KEY)||'';
    return f?String(f).toLowerCase():'rede';
  }catch(e){return 'rede';}
}
function zcAuthNomeLojaFiltro_(){
  var f=zcAuthUnidadeFiltro_();
  if(f==='anil')return 'Rio Anil';
  if(f==='rede')return 'Rede (as duas)';
  return 'Golden Shopping';
}
function zcAuthLinhaUnidade_(obj){
  var u=String((obj&&obj.unidade)||'').trim().toLowerCase();
  return u||'golden';
}
function zcAuthAbrirEquipe_(){
  if(typeof zcAuthPerfil_==='function' && zcAuthPerfil_()==='adm'){
    if(typeof isAdmin!=='undefined')isAdmin=true;
    if(typeof goTo==='function')goTo('equipe');
    return;
  }
  if(typeof abrirAdmin==='function')abrirAdmin();
}
function zcAuthLoginDeNome_(nome){
  var s=String(nome||'');
  try{s=s.normalize('NFD').replace(/[\u0300-\u036f]/g,'');}catch(e){}
  return s.toLowerCase().replace(/[^a-z0-9._-]/g,'').slice(0,20);
}
function zcAuthNomeDigitou_(){
  if(window._zcLoginManual_)return;
  var nome=(document.getElementById('zcUserNome')||{}).value||'';
  var loginEl=document.getElementById('zcUserUsuario');
  if(loginEl)loginEl.value=zcAuthLoginDeNome_(nome);
}
function zcAuthPodeEscreverNaUnidade_(){
  if(zcAuthPerfil_()!=='adm')return true;
  var f=zcAuthUnidadeFiltro_();
  return f==='golden'||f==='anil';
}
function zcAuthPode_(recurso){
  var p=zcAuthPerfil_();
  if(p==='adm')return true;
  if(recurso==='admin'||recurso==='usuarios'||recurso==='dashboard'||recurso==='logs')return false;
  if(recurso==='custos'||recurso==='caixa'||recurso==='lancamentos')return p==='supervisor';
  return true;
}
function zcAuthPodePagina_(page){
  var p=zcAuthPerfil_();
  if(p==='adm')return true;
  var ops=['home','registrar','clientes','relacionamento','operacao'];
  if(ops.indexOf(page)>=0)return true;
  if(page==='custos')return p==='supervisor';
  return false;
}
function zcAuthGravarSessao_(data){
  var s={
    token:data.token||'',
    usuario:data.usuario||'',
    nome:data.nome||data.usuario||'',
    perfil:String(data.perfil||'operador').toLowerCase(),
    unidadeId:String(data.unidadeId||'').toLowerCase(),
    unidadeNome:data.unidadeNome||'',
    turno:data.turno||'',
    mustChangePin:!!data.mustChangePin,
    t:Date.now()
  };
  localStorage.setItem(ZC_AUTH_KEY,JSON.stringify(s));
  return s;
}
function zcAuthLimparSessao_(){
  try{localStorage.removeItem(ZC_AUTH_KEY);}catch(e){}
}
function zcAuthBytesToHex_(buf){
  return Array.from(new Uint8Array(buf)).map(function(b){return('0'+b.toString(16)).slice(-2);}).join('');
}
function zcAuthHashPin_(usuario,pin){
  var raw=String(usuario||'').toLowerCase().trim()+':'+String(pin||'')+':'+ZC_AUTH_PEPPER;
  if(window.crypto&&crypto.subtle&&window.TextEncoder){
    return crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw)).then(zcAuthBytesToHex_);
  }
  return Promise.resolve('');
}

function zcAuthMostrarTrocaPin_(){
  var gate=document.getElementById('zcPinTrocaGate');
  if(!gate)return;
  gate.classList.add('show');
  gate.setAttribute('aria-hidden','false');
  var err=document.getElementById('zcPinTrocaErro');
  if(err){err.textContent='';err.style.display='none';}
  var a=document.getElementById('zcPinNovo');
  var b=document.getElementById('zcPinNovo2');
  if(a)a.value='';
  if(b)b.value='';
  if(a)setTimeout(function(){a.focus();},80);
}
function zcAuthEsconderTrocaPin_(){
  var gate=document.getElementById('zcPinTrocaGate');
  if(!gate)return;
  gate.classList.remove('show');
  gate.setAttribute('aria-hidden','true');
}
function zcAuthPrecisaTrocarPin_(){
  var s=zcAuthSessao_();
  return !!(s&&s.mustChangePin&&s.perfil!=='adm');
}
function zcAuthTrocarPinSubmit_(ev){
  if(ev&&ev.preventDefault)ev.preventDefault();
  var pin=(document.getElementById('zcPinNovo')||{}).value||'';
  var pin2=(document.getElementById('zcPinNovo2')||{}).value||'';
  var err=document.getElementById('zcPinTrocaErro');
  var btn=document.getElementById('zcPinTrocaBtn');
  function showErr(m){
    if(err){err.textContent=m;err.style.display='block';}
    if(btn){btn.disabled=false;btn.textContent='Salvar meu PIN';}
  }
  pin=String(pin).trim();
  pin2=String(pin2).trim();
  if(pin.length<4||pin.length>6||!/^\d+$/.test(pin)){showErr('PIN com 4 a 6 dígitos.');return;}
  if(pin==='123456'){showErr('Não use 123456. Esse é só o PIN inicial.');return;}
  if(pin!==pin2){showErr('Os dois PINs não são iguais.');return;}
  if(btn){btn.disabled=true;btn.textContent='Salvando...';}
  apiGet('trocarPinPrimeiroAcesso',{pin:pin},15000).then(function(r){
    if(!r||!r.ok){
      showErr((r&&r.error)||'Não consegui salvar. Cole o Apps Script 3.57 se o backend ainda for antigo.');
      return;
    }
    var s=zcAuthSessao_()||{};
    s.mustChangePin=false;
    localStorage.setItem(ZC_AUTH_KEY,JSON.stringify(s));
    zcAuthEsconderTrocaPin_();
    zcAuthBoot_();
    if(typeof showToast==='function')showToast('PIN salvo. Turno iniciado.','blue');
  }).catch(function(){showErr('Sem conexão. Tente de novo.');});
}
function zcAuthMostrarLogin_(msg){
  var gate=document.getElementById('zcLoginGate');
  if(!gate)return;
  gate.classList.add('show');
  gate.setAttribute('aria-hidden','false');
  var err=document.getElementById('zcLoginErro');
  if(err){
    err.textContent=msg||'';
    err.style.display=msg?'block':'none';
  }
  var pin=document.getElementById('zcLoginPin');
  if(pin)pin.value='';
  var u=document.getElementById('zcLoginUsuario');
  if(u)setTimeout(function(){u.focus();},80);
}
function zcAuthEsconderLogin_(){
  var gate=document.getElementById('zcLoginGate');
  if(!gate)return;
  gate.classList.remove('show');
  gate.setAttribute('aria-hidden','true');
}

function zcAuthRenderSessao_(){
  var s=zcAuthSessao_();
  var wrap=document.getElementById('zcSessaoChip');
  var nomeEl=document.getElementById('zcSessaoNome');
  var metaEl=document.getElementById('zcSessaoMeta');
  if(!wrap)return;
  if(!s){wrap.style.display='none';return;}
  wrap.style.display='block';
  var loja=s.perfil==='adm'?zcAuthNomeLojaFiltro_():(s.unidadeNome||s.unidadeId||'');
  if(nomeEl)nomeEl.textContent=s.nome||s.usuario;
  if(metaEl)metaEl.textContent=(loja||'Turno')+(s.turno?' · '+s.turno:'');
  zcAuthRenderLojaSwitch_();
  zcAuthAtualizarHomeRede_();
}

function zcAuthRenderLojaSwitch_(){
  var wrap=document.getElementById('zcLojaSwitch');
  if(!wrap)return;
  if(zcAuthPerfil_()!=='adm'){wrap.style.display='none';return;}
  wrap.style.display='flex';
  var cur=zcAuthUnidadeFiltro_()||'rede';
  var chips=wrap.querySelectorAll('[data-loja]');
  for(var i=0;i<chips.length;i++){
    chips[i].classList.toggle('on',chips[i].getAttribute('data-loja')===cur);
  }
}

function zcAuthSetUnidadeFiltro_(id){
  if(zcAuthPerfil_()!=='adm')return;
  var v=String(id||'rede').toLowerCase();
  if(v!=='golden'&&v!=='anil')v='rede';
  try{sessionStorage.setItem(ZC_AUTH_UNIDADE_KEY,v);}catch(e){}
  zcAuthRenderSessao_();
  if(v==='rede'&&typeof mostrarHome==='function')mostrarHome();
  if(typeof refreshDados==='function')refreshDados(true);
  if(typeof carregarPainelAdmin==='function'&&typeof isAdmin!=='undefined'&&isAdmin){
    var pageAdmin=document.getElementById('page-admin');
    if(pageAdmin&&pageAdmin.classList.contains('active'))carregarPainelAdmin();
  }
}
function zcAuthEntrarLoja_(id){
  zcAuthSetUnidadeFiltro_(id);
  if(typeof mostrarHome==='function')mostrarHome();
  if(typeof showToast==='function')showToast('Loja: '+zcAuthNomeLojaFiltro_(),'blue');
}
function zcAuthVoltarRede_(){
  zcAuthSetUnidadeFiltro_('rede');
}

function zcAuthStatsLoja_(unidadeId){
  var src=typeof lancamentos!=='undefined'&&lancamentos.length?lancamentos:JSON.parse(localStorage.getItem('zapLanc')||'[]');
  var cli=typeof clientes!=='undefined'&&clientes.length?clientes:JSON.parse(localStorage.getItem('zapClientes')||'[]');
  var hoje=typeof hojeBR_==='function'?hojeBR_():'';
  var atd=src.filter(function(l){
    var u=zcAuthLinhaUnidade_(l);
    var svc=String(l&&l.svc||'');
    return u===unidadeId&&fmtData(l&&l.data)===hoje&&!l.cancelado&&!/^CANCELADO\b/i.test(svc);
  }).reduce(function(total,l){
    var qtd=parseInt(l&&l.qtd||1,10);
    return total+(qtd>0?qtd:1);
  },0);
  var ativos=cli.filter(function(c){
    var u=zcAuthLinhaUnidade_(c);
    return u===unidadeId&&typeof clienteAberto_==='function'&&clienteAberto_(c);
  }).length;
  return {atend:atd,ativos:ativos};
}

function zcAuthAtualizarHomeRede_(){
  var adm=zcAuthPerfil_()==='adm';
  var filtro=adm?zcAuthUnidadeFiltro_():'';
  var naRede=adm&&filtro==='rede';
  var naLoja=adm&&(filtro==='golden'||filtro==='anil');
  var cockpit=document.getElementById('homeRedeCockpit');
  var gestao=document.getElementById('homeRedeGestao');
  var balcao=document.getElementById('homeBalcaoBlock');
  var bar=document.getElementById('homeLojaBar');
  var sub=document.getElementById('homeTopoSub');
  var barNome=document.getElementById('homeLojaBarNome');
  if(cockpit)cockpit.style.display=naRede?'block':'none';
  if(gestao)gestao.style.display=naRede?'block':'none';
  if(balcao)balcao.style.display=naRede?'none':'block';
  if(bar)bar.style.display=naLoja?'flex':'none';
  if(barNome)barNome.textContent=zcAuthNomeLojaFiltro_();
  var atendSub=document.getElementById('homeAtendSub');
  var ativosSub=document.getElementById('homeAtivosSub');
  if(atendSub)atendSub.textContent=naRede?'soma das duas lojas':'serviços lançados hoje';
  if(ativosSub)ativosSub.textContent=naRede?'soma das duas lojas':'em andamento ou pronto';
  if(sub){
    if(naRede)sub.textContent='As duas lojas juntas. Toque numa unidade para operar como no sistema de sempre.';
    else if(naLoja)sub.textContent='Balcão de '+zcAuthNomeLojaFiltro_()+' — como uma loja só.';
    else sub.textContent='Pronto para atender!';
  }
  if(naRede){
    var g=zcAuthStatsLoja_('golden');
    var a=zcAuthStatsLoja_('anil');
    var ge=document.getElementById('homeStoreGoldenAtend');
    var ga=document.getElementById('homeStoreGoldenAtivos');
    var ae=document.getElementById('homeStoreAnilAtend');
    var aa=document.getElementById('homeStoreAnilAtivos');
    if(ge)ge.textContent=g.atend;
    if(ga)ga.textContent=g.ativos;
    if(ae)ae.textContent=a.atend;
    if(aa)aa.textContent=a.ativos;
  }
}

function zcAuthAplicarPermissoes_(){
  var p=zcAuthPerfil_()||'operador';
  document.body.classList.remove('zc-perfil-adm','zc-perfil-supervisor','zc-perfil-operador');
  document.body.classList.add('zc-perfil-'+p);
  var custosBtn=document.getElementById('sbBtnCustos')||document.querySelector('.sb-btn[data-page="custos"]');
  if(custosBtn)custosBtn.style.display=zcAuthPode_('custos')?'':'none';
  var homeCustos=document.getElementById('homeCardCustos');
  if(homeCustos)homeCustos.style.display=zcAuthPode_('custos')?'':'none';
  var ger=document.getElementById('sbGerenciarBtn');
  if(ger)ger.style.display=p==='adm'?'flex':'none';
  var eq=document.getElementById('sbEquipeBtn');
  if(eq)eq.style.display=p==='adm'?'flex':'none';
  var homePainel=document.getElementById('homeCardPainel');
  if(homePainel)homePainel.style.display=p==='adm'?'':'none';
  var homeEquipe=document.getElementById('homeCardEquipe');
  if(homeEquipe)homeEquipe.style.display=p==='adm'?'':'none';
  var adminSec=document.getElementById('sbAdminSection');
  if(adminSec){adminSec.classList.remove('visible');adminSec.style.display='none';}
  var bar=document.getElementById('sbAdminBar');
  if(bar)bar.style.display='none';
  if(p==='adm')isAdmin=true;
  var users=document.getElementById('zcUsersAdmin');
  if(users)users.style.display=p==='adm'?'block':'none';
  zcAuthRenderSessao_();
}

function zcAuthOnUnidadeChange_(){
  zcAuthSetUnidadeFiltro_(zcAuthUnidadeFiltro_());
}

function zcAuthEncerrarTurno_(){
  var s=zcAuthSessao_();
  var nome=s? (s.nome||s.usuario) : '';
  if(!confirm('Encerrar o turno'+(nome?' de '+nome:'')+'?\nO próximo operador entra com o usuário e o PIN dele.'))return;
  var token=zcAuthSessToken_();
  zcAuthLimparSessao_();
  if(token&&typeof apiGet==='function'){
    apiGet('logoutOperador',{sess:token},8000).catch(function(){});
  }
  location.reload();
}

function zcAuthBoot_(){
  if(zcAuthSessao_()){
    if(zcAuthPrecisaTrocarPin_()){
      zcAuthEsconderLogin_();
      zcAuthMostrarTrocaPin_();
      return;
    }
    zcAuthEsconderTrocaPin_();
    if(zcAuthPerfil_()==='adm'){
      try{
        if(!sessionStorage.getItem(ZC_AUTH_UNIDADE_KEY))sessionStorage.setItem(ZC_AUTH_UNIDADE_KEY,'rede');
      }catch(e){}
    }
    zcAuthEsconderLogin_();
    if(!_zcAuthBootouApp_){
      _zcAuthBootouApp_=true;
      init();
      zcAuthAplicarPermissoes_();
    }else{
      zcAuthAplicarPermissoes_();
    }
    return;
  }
  zcAuthEsconderTrocaPin_();
  zcAuthMostrarLogin_();
}

function zcAuthLoginSubmit_(ev){
  if(ev&&ev.preventDefault)ev.preventDefault();
  var usuario=(document.getElementById('zcLoginUsuario')||{}).value||'';
  var pin=(document.getElementById('zcLoginPin')||{}).value||'';
  usuario=String(usuario).trim().toLowerCase();
  pin=String(pin).trim();
  var err=document.getElementById('zcLoginErro');
  var btn=document.getElementById('zcLoginBtn');
  function showErr(m){
    if(err){err.textContent=m;err.style.display='block';}
    if(btn){btn.disabled=false;btn.textContent='Entrar no turno';}
  }
  if(!usuario||pin.length<4){showErr('Informe o usuário e o PIN de 4 a 6 dígitos.');return;}
  if(btn){btn.disabled=true;btn.textContent='Entrando...';}
  zcAuthHashPin_(usuario,pin).then(function(pinHash){
    var params={usuario:usuario};
    if(pinHash)params.pinHash=pinHash;
    else params.pin=pin;
    return apiGet('loginOperador',params,30000);
  }).then(function(r){
    if(!r||!r.ok||!r.token){
      var msg=r&&r.error?String(r.error):'Usuário ou PIN inválido.';
      if(r&&r.version&&parseFloat(r.version)<3.57)msg='Backend ainda v'+r.version+'. Cole Nova versão 3.57 no Apps Script (mesmo Deploy ID) para o primeiro acesso com troca de PIN.';
      showErr(msg);
      return;
    }
    zcAuthGravarSessao_(r);
    try{
      sessionStorage.setItem(ZC_AUTH_UNIDADE_KEY,String(r.perfil||'').toLowerCase()==='adm'?'rede':(r.unidadeId||'golden'));
      localStorage.removeItem('zapClientes');
      localStorage.removeItem('zapLanc');
      localStorage.removeItem('zapCustos');
      localStorage.removeItem('zapKpisAdminServer');
    }catch(e){}
    zcAuthEsconderLogin_();
    if(r.mustChangePin){
      zcAuthMostrarTrocaPin_();
      return;
    }
    zcAuthBoot_();
    if(typeof showToast==='function'){
      showToast('Turno de '+(r.nome||r.usuario)+' iniciado','blue');
    }
  }).catch(function(err){
    var motivo=String(err||'');
    if(motivo==='timeout')showErr('O servidor demorou. Toque de novo em Entrar no turno.');
    else showErr('Sem conexão com o Apps Script. Confira a internet e toque de novo.');
  });
}

function zcAuthCarregarUsuarios_(){
  var wrap=document.getElementById('zcUsersLista');
  if(!wrap||zcAuthPerfil_()!=='adm')return;
  wrap.innerHTML='Carregando equipe...';
  apiGet('listarUsuarios',{},12000).then(function(r){
    var items=(r&&r.items)||[];
    if(!items.length){wrap.innerHTML='<div class="empty-text">Nenhuma pessoa cadastrada ainda.</div>';return;}
    wrap.innerHTML=items.map(function(u){
      var perfil=u.perfil==='adm'?'ADM':(u.perfil==='supervisor'?'Supervisor':'Operador');
      var loja=u.perfil==='adm'?'Rede':(u.unidadeId==='anil'?'Rio Anil':'Golden');
      var ativo=u.ativo===false?' · inativo':'';
      var turno=u.turno?' · '+u.turno:'';
      var pinTxt='';
      if(u.perfil!=='adm'){
        var pin=u.pinRecupera?String(u.pinRecupera):'(ainda sem PIN na planilha — cole GAS 3.57)';
        pinTxt='<div class="zc-sessao-meta">PIN para recuperar: <strong>'+escapeHtml_(pin)+'</strong>'+(u.trocarPin?' · primeiro acesso pendente (123456)':'')+'</div>';
      }
      var reset=u.perfil==='adm'?'':'<button class="logs-refresh" type="button" onclick="zcAuthResetPinInicial_(\''+jsStr_(u.usuario)+'\')">Resetar 123456</button>';
      return '<div class="zc-user-row"><div><strong>'+escapeHtml_(u.nome||u.usuario)+'</strong><div class="zc-sessao-meta">'+escapeHtml_(u.usuario)+' · '+perfil+' · '+loja+turno+ativo+'</div>'+pinTxt+'</div><div class="zc-user-actions">'+reset+'<button class="logs-refresh" type="button" onclick="zcAuthEditarUsuario_(\''+jsStr_(u.usuario)+'\')">Editar</button></div></div>';
    }).join('');
    window._zcUsersCache_=items;
  }).catch(function(){wrap.innerHTML='Falha ao listar equipe.';});
}

function zcAuthEditarUsuario_(usuario){
  var items=window._zcUsersCache_||[];
  var u=null;
  for(var i=0;i<items.length;i++){if(items[i].usuario===usuario){u=items[i];break;}}
  if(!u)return;
  document.getElementById('zcUserUsuario').value=u.usuario||'';
  document.getElementById('zcUserNome').value=u.nome||'';
  window._zcLoginManual_=true;
  var pinEl=document.getElementById('zcUserPin');
  if(pinEl)pinEl.value='';
  document.getElementById('zcUserPerfil').value=u.perfil||'operador';
  document.getElementById('zcUserUnidade').value=u.unidadeId||'';
  document.getElementById('zcUserTurno').value=u.turno||'';
}

function zcAuthSalvarUsuario_(){
  var usuario=(document.getElementById('zcUserUsuario')||{}).value||'';
  var nome=(document.getElementById('zcUserNome')||{}).value||'';
  var pin=(document.getElementById('zcUserPin')||{}).value||'';
  var perfil=(document.getElementById('zcUserPerfil')||{}).value||'operador';
  var unidadeId=(document.getElementById('zcUserUnidade')||{}).value||'';
  var turno=(document.getElementById('zcUserTurno')||{}).value||'';
  usuario=String(usuario).trim().toLowerCase();
  nome=String(nome).trim();
  if(!nome){showToast('Preencha o nome da pessoa','error');return;}
  if(!usuario)usuario=zcAuthLoginDeNome_(nome);
  if(!usuario){showToast('O login precisa de letras. Ajuste o nome.','orange');return;}
  if(perfil!=='adm'&&!unidadeId){showToast('Operador e supervisor precisam da loja','orange');return;}
  if(perfil!=='adm'&&!String(pin).trim())pin='123456';
  apiGet('salvarUsuario',{usuario:usuario,nome:nome,pin:pin,perfil:perfil,unidadeId:unidadeId,turno:turno,ativo:'SIM'},15000).then(function(r){
    if(r&&r.ok){
      var extra=perfil!=='adm'?' · PIN inicial 123456 até o primeiro login':'';
      showToast('Pessoa salva: '+usuario+extra,'blue');
      document.getElementById('zcUserPin').value='';
      document.getElementById('zcUserNome').value='';
      document.getElementById('zcUserUsuario').value='';
      window._zcLoginManual_=false;
      zcAuthCarregarUsuarios_();
    }else showToast((r&&r.error)||'Erro ao salvar','error');
  }).catch(function(){showToast('Falha ao salvar pessoa','error');});
}
function zcAuthResetPinInicial_(usuario){
  usuario=String(usuario||'').trim().toLowerCase();
  if(!usuario)return;
  if(!confirm('Resetar o PIN de '+usuario+' para 123456?\nNo próximo login o app obriga a cadastrar um PIN novo.'))return;
  var items=window._zcUsersCache_||[];
  var u=null;
  for(var i=0;i<items.length;i++){if(items[i].usuario===usuario){u=items[i];break;}}
  if(!u){showToast('Pessoa não encontrada na lista','orange');return;}
  apiGet('salvarUsuario',{usuario:u.usuario,nome:u.nome,perfil:u.perfil,unidadeId:u.unidadeId,turno:u.turno||'',ativo:'SIM',resetPinInicial:'1',pin:'123456'},15000).then(function(r){
    if(r&&r.ok){showToast('PIN de '+usuario+' voltou a 123456','blue');zcAuthCarregarUsuarios_();}
    else showToast((r&&r.error)||'Falha ao resetar','error');
  }).catch(function(){showToast('Falha ao resetar PIN','error');});
}
