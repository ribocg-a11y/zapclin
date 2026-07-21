/* Pacote Z.5 — navegação (sidebar + goTo + título mobile) */
function setMobileTitle_(title){
  var mt=document.getElementById('mobileTitle');
  if(!mt)return;
  if((title||'ZapClin')==='ZapClin'){
    mt.innerHTML='ZapClin <span class="mh-version" id="mobileVersion">'+APP_VERSION+'</span>';
  }else{
    mt.textContent=title;
  }
}

function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sbOverlay').classList.toggle('open');
}
function fecharSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sbOverlay').classList.remove('open');
}

function goTo(page, btn){
  // [v4.2 MENU/HOME]
  // Valida rota, fecha menu mobile sempre, atualiza título e sobe a tela para evitar estado visual quebrado no celular.
  var target=document.getElementById('page-'+page);
  if(!target){page='home';target=document.getElementById('page-home');}
  var paginasAdmin=['admin','dashboard','historico','historico-custos','lancamentos','relatorio','logs','aceites'];
  if(paginasAdmin.indexOf(page)>=0 && !isAdmin){
    fecharSidebar();
    abrirAdmin();
    return;
  }
  fecharSidebar();
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  target.classList.add('active');
  document.querySelectorAll('.sb-btn').forEach(function(b){b.classList.remove('active');});
  var match=btn||document.querySelector('.sb-btn[data-page="'+page+'"]');
  if(match)match.classList.add('active');
  // [v4.7 ALTERAÇÃO]
  // Usa helper para preservar o selo de versão quando a rota volta para Home.
  setMobileTitle_(PAGE_TITLES[page]||'ZapClin');
  try{window.scrollTo({top:0,behavior:'smooth'});}catch(e){window.scrollTo(0,0);}
  if(page==='lancamentos')carregarLancamentos();
  if(page==='custos')carregarCustos();
  if(page==='operacao')carregarOperacao(false);
  if(page==='clientes')carregarClientes();
  if(page==='relacionamento')carregarRelacionamento(false);
  if(page==='dashboard')carregarDashboard();
  if(page==='relatorio')carregarRelatorio();
  if(page==='admin')carregarPainelAdmin();
  if(page==='historico')carregarHistorico();
  if(page==='historico-custos')carregarHistoricoCustos();
  if(page==='logs')carregarLogsAdmin(false);
  if(page==='aceites')carregarAceitesPainel_(false);
  if(page==='home'){atualizarStatsHome();animarCardsHome();}
}
