/* Pacote Z.7 — Operação (fila, SLA, painel) */
function setOperacaoFiltro(f,btn){operacaoFiltro=f||'todos';document.querySelectorAll('.op-filter').forEach(function(b){b.classList.remove('ativo');});if(btn)btn.classList.add('ativo');renderOperacaoPainel();}
function carregarOperacao(force){var sub=document.getElementById('opSub');if(sub)sub.textContent='Atualizando fila...';['opListAtencao','opListAndamento','opListProntos'].forEach(function(id){var el=document.getElementById(id);if(el)el.innerHTML=skeletonList_(2,'lg');});var cacheOk=false;if(!force){try{var c=JSON.parse(localStorage.getItem('zapClientes')||'[]');if(c&&c.length){clientes=c;cacheOk=true;}}catch(e){}}buscarClientes().then(function(ok){if(!ok&&!cacheOk){try{clientes=JSON.parse(localStorage.getItem('zapClientes')||'[]')||[];}catch(e){clientes=[];}}renderOperacaoPainel();});}
function classificarOperacao_(c){var st=statusPrazoCliente_(c);var status=String(c.status||'Em andamento');var tipo=status==='Pronto'?'prontos':(st.cls==='late'||st.cls==='warn')?'atencao':'andamento';var prioridade=(st.meta||0)-(st.elapsed||0);if(tipo==='atencao')prioridade-=10000;if(tipo==='prontos')prioridade=99999+(st.elapsed||0);return{c:c,st:st,tipo:tipo,prioridade:prioridade};}
function opResumoServicos_(c){var svcs=Array.isArray(c.servicos)?c.servicos.filter(Boolean):[];if(!svcs.length)return'—';return svcs.slice(0,3).map(function(s,i){return'Cap.'+(i+1)+': '+escapeHtml_(s);}).join('<br>')+(svcs.length>3?'<br>+'+(svcs.length-3)+' cap.':'');}
function opCardHtml_(it){var c=it.c,st=it.st,cls=st.cls==='late'?'late':st.cls==='warn'?'warn':it.tipo==='prontos'?'ready':'';var btn=it.tipo==='prontos'?'<button class="op-btn gray" onclick="marcarStatus('+c.num+',\'Entregue\')">Entregue</button><button class="op-btn wa" onclick="mostrarWaModal(\'pronto\',\''+jsStr_(c.nome)+'\',\''+jsStr_(c.tel)+'\','+(c.qtd||1)+')">WhatsApp</button>':'<button class="op-btn green" onclick="marcarStatus('+c.num+',\'Pronto\')">Marcar pronto</button>';return'<div class="op-card '+cls+'" id="opCard'+c.num+'"><div class="op-card-top"><span class="op-os">OS '+formatarOS_(c.num)+'</span><span class="op-time '+st.cls+'">'+escapeHtml_(st.label)+'</span></div><div class="op-name">'+escapeHtml_(c.nome)+'</div><div class="op-meta">'+(c.qtd||1)+' cap. · '+fmtData(c.data)+' '+fmtHora(c.hora)+(c.operador?' · '+escapeHtml_(c.operador):'')+'</div><div class="op-services">'+opResumoServicos_(c)+'</div><div class="op-actions">'+btn+'<button class="op-btn gray" onclick="goTo(\'clientes\',null);setTimeout(function(){filtrarClientes(\''+formatarOS_(c.num)+'\');},150)">Ver OS</button><button class="op-btn gray" onclick="gerarOsPdf('+c.num+')">PDF</button></div></div>';}
function renderOperacaoLista_(id,items,msg){var el=document.getElementById(id);if(!el)return;el.innerHTML=items.length?items.map(opCardHtml_).join(''):'<div class="op-empty">'+msg+'</div>';}
function opMinRestante_(it){if(!it||!it.st||it.st.elapsed===null)return null;return (it.st.meta||0)-(it.st.elapsed||0);}
function opRenderRiscos_(items){
  var el=document.getElementById('opRiskList');if(!el)return;
  var riscos=items.filter(function(it){var r=opMinRestante_(it);return it.tipo!=='prontos'&&r!==null&&r<=10;}).sort(function(a,b){return opMinRestante_(a)-opMinRestante_(b);}).slice(0,4);
  if(!riscos.length){el.innerHTML='';return;}
  el.innerHTML=riscos.map(function(it){var r=opMinRestante_(it),late=r<0;var txt=late?'atrasado há '+fmtTempo(Math.abs(r)):'vence em '+fmtTempo(r);return'<div class="op-risk-item '+(late?'late':'')+'"><span>'+escapeHtml_(it.c.nome||'Cliente')+' · '+txt+'</span><span class="op-risk-os">OS '+formatarOS_(it.c.num)+'</span></div>';}).join('');
}
function opRenderServicoSla_(base){
  var el=document.getElementById('opServicoSlaList');if(!el)return;
  var mapa={};
  base.forEach(function(item){
    var c=opClienteFromItem_(item);
    if(!clienteAberto_(c))return;
    var st=opStatusFromItem_(item,c),svcs=Array.isArray(c.servicos)?c.servicos.filter(Boolean):[];
    if(!svcs.length)svcs=['Serviço não informado'];
    var porSvc=svcs.length?Math.round((st.elapsed||0)/svcs.length):st.elapsed;
    svcs.forEach(function(s){
      var k=s||'Serviço não informado';if(!mapa[k])mapa[k]={nome:k,total:0,qtd:0,ok:0,meta:tempoServicoMin_(k)};
      if(st.elapsed!==null){mapa[k].total+=porSvc;mapa[k].qtd++;}
      if(st.elapsed!==null&&st.elapsed<=st.meta)mapa[k].ok++;
    });
  });
  var arr=Object.keys(mapa).map(function(k){var m=mapa[k];m.media=m.qtd?Math.round(m.total/m.qtd):0;m.sla=m.qtd?Math.round(m.ok/m.qtd*100):0;return m;}).sort(function(a,b){return b.qtd-a.qtd||b.media-a.media;}).slice(0,6);
  if(!arr.length){el.innerHTML='<div class="dash-empty">Sem dados de serviço ainda.</div>';return;}
  el.innerHTML=arr.map(function(m){var cls=m.sla>=85?'ok':m.sla>=60?'warn':'late';return'<div class="op-svc-row"><div><div class="op-svc-name">'+escapeHtml_(m.nome)+'</div><div class="op-mini-bar"><div class="op-mini-fill" style="width:'+Math.min(100,m.sla)+'%"></div></div></div><div class="op-svc-meta">'+fmtTempo(m.media)+' méd.</div><div class="op-svc-sla '+cls+'">'+m.sla+'%</div></div>';}).join('');
}
function opRenderPicos_(base){
  var el=document.getElementById('opPicoList');if(!el)return;
  var hrs={};base.forEach(function(item){var c=opClienteFromItem_(item);if(!clienteAberto_(c))return;var h=fmtHora(c.hora);if(!h||h==='—')return;var n=parseInt(h.split(':')[0],10);if(isNaN(n))return;hrs[n]=(hrs[n]||0)+1;});
  var arr=Object.keys(hrs).map(function(k){return{h:parseInt(k,10),qtd:hrs[k]};}).sort(function(a,b){return b.qtd-a.qtd||a.h-b.h;}).slice(0,5);
  var max=arr.length?arr[0].qtd:0;
  if(!arr.length){el.innerHTML='<div class="dash-empty">Sem dados de horário na fila atual.</div>';return;}
  el.innerHTML=arr.map(function(x){var pct=max?Math.round(x.qtd/max*100):0;return'<div class="op-peak-row"><div><div class="op-peak-hora">'+String(x.h).padStart(2,'0')+'h</div><div class="op-mini-bar"><div class="op-mini-fill" style="width:'+pct+'%"></div></div></div><div class="op-peak-meta">'+x.qtd+' atend.</div><div class="op-svc-sla ok">'+pct+'%</div></div>';}).join('');
}
function opRenderInteligencia_(src){opRenderRiscos_(src);opRenderServicoSla_(src);opRenderPicos_(src);}
function renderOperacaoPainel(){var base=(clientes.length?clientes:JSON.parse(localStorage.getItem('zapClientes')||'[]')).filter(function(c){return c&&!clienteCancelado_(c);});var src=base.filter(clienteAberto_).map(classificarOperacao_);var atencao=src.filter(function(i){return i.tipo==='atencao';}).sort(function(a,b){return a.prioridade-b.prioridade;});var andamento=src.filter(function(i){return i.tipo==='andamento';}).sort(function(a,b){return a.prioridade-b.prioridade;});var prontos=src.filter(function(i){return i.tipo==='prontos';}).sort(function(a,b){return (a.c.encerradoEm||'')<(b.c.encerradoEm||'')?1:-1;});var producao=andamento.length,totalAnd=atencao.length+andamento.length,ok=andamento.length,pct=totalAnd?Math.round(ok/totalAnd*100):100;var set=function(id,v){var el=document.getElementById(id);if(el)el.textContent=v;};set('opKpiProducao',producao);set('opKpiAtraso',atencao.length);set('opKpiProntos',prontos.length);set('opKpiSla',pct+'%');set('opCountAtencao',atencao.length);set('opCountAndamento',andamento.length);set('opCountProntos',prontos.length);var sub=document.getElementById('opSub');if(sub)sub.textContent=src.length+' atendimento(s) ativo(s) · atualizado agora';var alert=document.getElementById('opAlert');if(alert){if(atencao.length){var p=atencao[0];alert.classList.add('show');alert.textContent='Prioridade: '+(p.c.nome||'Cliente')+' · OS '+formatarOS_(p.c.num)+' · '+p.st.label;}else{alert.classList.remove('show');alert.textContent='';}}opRenderInteligencia_(src);var show=function(wrap,on){var el=document.getElementById(wrap);if(el)el.style.display=on?'block':'none';};show('opLaneAtencaoWrap',operacaoFiltro==='todos'||operacaoFiltro==='atencao');show('opLaneAndamentoWrap',operacaoFiltro==='todos'||operacaoFiltro==='andamento');show('opLaneProntosWrap',operacaoFiltro==='todos'||operacaoFiltro==='prontos');renderOperacaoLista_('opListAtencao',atencao,'Nenhum atendimento em risco agora.');renderOperacaoLista_('opListAndamento',andamento,'Fila de produção vazia.');renderOperacaoLista_('opListProntos',prontos,'Nenhum capacete pronto para retirada.');}
