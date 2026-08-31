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
    return f?String(f).toLowerCase():'golden';
  }catch(e){return 'golden';}
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
  var perfilLbl=s.perfil==='adm'?'ADM':(s.perfil==='supervisor'?'Supervisor':'Operador');
  var loja=s.perfil==='adm'?(zcAuthUnidadeFiltro_()==='anil'?'Rio Anil':(zcAuthUnidadeFiltro_()==='rede'?'Rede':'Golden')):(s.unidadeNome||s.unidadeId||'');
  if(nomeEl)nomeEl.textContent=s.nome||s.usuario;
  if(metaEl)metaEl.textContent=perfilLbl+(loja?' · '+loja:'')+(s.turno?' · '+s.turno:'');
  var sel=document.getElementById('zcUnidadeFiltro');
  var selWrap=document.getElementById('zcUnidadeFiltroWrap');
  if(selWrap)selWrap.style.display=s.perfil==='adm'?'block':'none';
  if(sel&&s.perfil==='adm'){
    var cur=zcAuthUnidadeFiltro_()||'golden';
    if(sel.value!==cur)sel.value=cur;
  }
}

function zcAuthAplicarPermissoes_(){
  var p=zcAuthPerfil_();
  var custosBtn=document.querySelector('.sb-btn[data-page="custos"]');
  if(custosBtn)custosBtn.style.display=zcAuthPode_('custos')?'':'none';
  var ger=document.getElementById('sbGerenciarBtn');
  if(ger)ger.style.display=p==='adm'?'':'none';
  var adminSec=document.getElementById('sbAdminSection');
  if(p==='adm'){
    isAdmin=true;
    if(adminSec){adminSec.classList.add('visible');adminSec.style.display='';}
    var bar=document.getElementById('sbAdminBar');
    if(bar)bar.style.display='none';
    if(ger)ger.style.display='none';
  }else if(adminSec){
    adminSec.style.display='none';
  }
  var users=document.getElementById('zcUsersAdmin');
  if(users)users.style.display=p==='adm'?'block':'none';
  zcAuthRenderSessao_();
}

function zcAuthOnUnidadeChange_(){
  var sel=document.getElementById('zcUnidadeFiltro');
  if(!sel)return;
  try{sessionStorage.setItem(ZC_AUTH_UNIDADE_KEY,sel.value||'golden');}catch(e){}
  zcAuthRenderSessao_();
  if(typeof refreshDados==='function')refreshDados(true);
  if(typeof carregarPainelAdmin==='function'&&typeof isAdmin!=='undefined'&&isAdmin)carregarPainelAdmin();
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
    return apiGet('loginOperador',params,15000);
  }).then(function(r){
    if(!r||!r.ok||!r.token){
      var msg=r&&r.error?String(r.error):'Usuário ou PIN inválido.';
      if(r&&r.version&&parseFloat(r.version)<3.55)msg='Backend ainda v'+r.version+'. Peça Nova versão do Apps Script (3.55) no mesmo Deploy ID.';
      showErr(msg);
      return;
    }
    zcAuthGravarSessao_(r);
    try{
      sessionStorage.setItem(ZC_AUTH_UNIDADE_KEY,r.unidadeId||'golden');
      localStorage.removeItem('zapClientes');
      localStorage.removeItem('zapLanc');
      localStorage.removeItem('zapCustos');
      localStorage.removeItem('zapKpisAdminServer');
    }catch(e){}
    zcAuthEsconderLogin_();
    zcAuthBoot_();
    if(typeof showToast==='function'){
      showToast('Turno de '+(r.nome||r.usuario)+' iniciado','blue');
    }
  }).catch(function(){
    showErr('Sem conexão. O login precisa de internet.');
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
      return '<div class="zc-user-row"><div><strong>'+escapeHtml_(u.nome||u.usuario)+'</strong><div class="zc-sessao-meta">'+escapeHtml_(u.usuario)+' · '+perfil+' · '+loja+turno+ativo+'</div></div><button class="logs-refresh" type="button" onclick="zcAuthEditarUsuario_(\''+jsStr_(u.usuario)+'\')">Editar</button></div>';
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
  document.getElementById('zcUserPin').value='';
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
  if(!usuario||!nome){showToast('Preencha usuário e nome','error');return;}
  if(perfil!=='adm'&&!unidadeId){showToast('Operador e supervisor precisam da loja','orange');return;}
  apiGet('salvarUsuario',{usuario:usuario,nome:nome,pin:pin,perfil:perfil,unidadeId:unidadeId,turno:turno,ativo:'SIM'},15000).then(function(r){
    if(r&&r.ok){
      showToast('Pessoa salva: '+usuario,'blue');
      document.getElementById('zcUserPin').value='';
      zcAuthCarregarUsuarios_();
    }else showToast((r&&r.error)||'Erro ao salvar','error');
  }).catch(function(){showToast('Falha ao salvar pessoa','error');});
}
