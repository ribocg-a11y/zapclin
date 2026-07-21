/* Pacote Z.5 — Home (stats, animação, rota dedicada) */
function mostrarHome(){
  fecharSidebar();
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  document.getElementById('page-home').classList.add('active');
  document.querySelectorAll('.sb-btn').forEach(function(b){b.classList.remove('active');});
  var hbtn=document.querySelector('.sb-btn[data-page="home"]');
  if(hbtn)hbtn.classList.add('active');
  // [v4.7 ALTERAÇÃO]
  // Mantém o selo de versão visível na Home. O textContent removia o <span> da versão.
  setMobileTitle_('ZapClin');
  atualizarStatsHome();
  animarCardsHome();
}

function animarCardsHome(){
  var cards=document.querySelectorAll('.home-card');
  cards.forEach(function(card,i){
    card.style.opacity='0';
    card.style.transform='translateY(22px)';
    setTimeout(function(){
      card.style.transition='opacity .4s ease,transform .4s ease';
      card.style.opacity='1';
      card.style.transform='translateY(0)';
    },80+i*70);
  });
}

function _calcStatsHome(){
  // Atendimentos hoje = servicos lancados hoje em LANCAMENTOS (soma QTD), nao OS cadastradas.
  var src=lancamentos.length>0?lancamentos:JSON.parse(localStorage.getItem('zapLanc')||'[]');
  var cli=clientes.length>0?clientes:JSON.parse(localStorage.getItem('zapClientes')||'[]');
  var hoje=hojeBR_();
  var validosHoje=src.filter(function(l){
    var svc=String(l&&l.svc||'');
    return fmtData(l&&l.data)===hoje&&!l.cancelado&&!/^CANCELADO\b/i.test(svc);
  });
  var atd=validosHoje.reduce(function(total,l){
    var qtd=parseInt(l&&l.qtd||1,10);
    return total+(qtd>0?qtd:1);
  },0);
  var ativos=cli.filter(clienteAberto_).length;
  var aEl=document.getElementById('homeAtend');
  var avEl=document.getElementById('homeAtivos');
  if(aEl)aEl.textContent=atd;
  if(avEl)avEl.textContent=ativos;
  var info=document.getElementById('homeLancInfo');
  if(info){
    var temInfo=validosHoje.some(lancamentoTemInfoCliente_);
    if(temInfo){
      var avulsos=validosHoje.filter(lancamentoAvulso_).reduce(function(total,l){var qtd=parseInt(l&&l.qtd||1,10);return total+(qtd>0?qtd:1);},0);
      var vinculados=Math.max(0,atd-avulsos);
      info.textContent=atd+' serviço(s) lançados hoje: '+vinculados+' vinculado(s) a OS e '+avulsos+' avulso(s) válido(s).';
      info.classList.add('show');
    }else{
      info.textContent='';
      info.classList.remove('show');
    }
  }
}
function atualizarStatsHome(){
  // Mostra cache imediatamente
  _calcStatsHome();
  // Se não tem dados, busca agora
  if(lancamentos.length===0 || clientes.length===0){
    refreshDados(true);
  }
}
