/* Pacote Z.1 — utilitários, formatadores, toast (Home → zc-home.js / Nav → zc-nav.js) */
// [v4.7 NOVO]
// Controle seguro de versão/cache. Não apaga lançamentos, clientes, custos, pendências nem configuração do Apps Script.
function aplicarControleVersao_(){
  try{
    var anterior=localStorage.getItem(APP_VERSION_KEY);
    if(anterior===APP_VERSION)return;

    APP_TRANSIENT_CACHE_KEYS.forEach(function(k){
      try{localStorage.removeItem(k);}catch(e){}
    });

    localStorage.setItem(APP_VERSION_KEY,APP_VERSION);

    if(anterior){
      setTimeout(function(){
        showToast('✅ Sistema atualizado para '+APP_VERSION,'blue');
      },900);
    }
  }catch(e){
    console.log('[ZapClin] Controle de versão indisponível:',e);
  }
}

function lancamentoClienteId_(l){
  return String((l&&(l.clienteId!==undefined?l.clienteId:l.cliente!==undefined?l.cliente:l.os))||'').trim();
}
function lancamentoTemInfoCliente_(l){
  return !!(l&&('clienteId' in l||'cliente' in l||'os' in l));
}
function lancamentoAvulso_(l){
  return lancamentoTemInfoCliente_(l)&&!lancamentoClienteId_(l);
}
function lancamentoVinculoBadge_(l){
  if(!lancamentoTemInfoCliente_(l))return '';
  var id=lancamentoClienteId_(l);
  return id?'<span class="info-badge vinculo">OS '+formatarOS_(id)+'</span>':'<span class="info-badge avulso">Avulso válido</span>';
}

// ═══ Formatadores ═══
function fmtData(v){if(!v)return'—';var s=String(v);if(/^\d{2}\/\d{2}\/\d{4}$/.test(s))return s;var d=new Date(v);if(!isNaN(d.getTime())){var p=s.split('T')[0].split('-');if(p.length===3)return p[2]+'/'+p[1]+'/'+p[0];return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear();}return s;}
function fmtHora(v){if(!v)return'—';var s=String(v);if(/^\d{2}:\d{2}$/.test(s))return s;var d=new Date(v);if(!isNaN(d.getTime()))return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');return s;}
function fmtBRL(v){var n=parseFloat(v||0);if(!isFinite(n))n=0;return n.toLocaleString('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:2,maximumFractionDigits:2}).replace(/\s/g,'\u00a0');}
function parseBRDateInput_(br){var p=String(br||'').split('/');return p.length===3?p[2]+'-'+p[1].padStart(2,'0')+'-'+p[0].padStart(2,'0'):'';}
function inputDateToBR_(iso){var p=String(iso||'').split('-');return p.length===3?p[2]+'/'+p[1]+'/'+p[0]:'';}
function jsStr_(v){return String(v||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,' ');}
function fecharMenusOperacionais(){document.querySelectorAll('.item-menu.show').forEach(function(m){m.classList.remove('show');});}
function toggleMenuOperacional(id){var el=document.getElementById(id);if(!el)return;var on=el.classList.contains('show');fecharMenusOperacionais();if(!on)el.classList.add('show');}
document.addEventListener('click',function(e){if(!e.target.closest||!e.target.closest('.item-menu-wrap'))fecharMenusOperacionais();});
function abrirEditorOperacional(titulo,bodyHtml,actionsHtml){document.getElementById('editTitle').textContent=titulo;document.getElementById('editBody').innerHTML=bodyHtml;document.getElementById('editActions').innerHTML=actionsHtml;document.getElementById('editOverlay').classList.add('show');}
function fecharEditorOperacional(){var ov=document.getElementById('editOverlay');if(ov)ov.classList.remove('show');}
function detectCat(desc){var d=desc.toLowerCase();if(/sal[aá]rio|funcionário|funcionario|colaborador/.test(d))return'Salários';if(/produto|insumo|sab[aã]o|detergente|esponja|luva|pano|microfibra|shampoo|cera|polish|limpador|material/.test(d))return'Produtos/Insumos';if(/ferramenta|equipamento|m[áa]quina|compressor|pistola|mangueira|carrinho|estante|aquisi[cç][aã]o/.test(d))return'Ferramentas/Equipamentos';if(/transporte|combust[ií]vel|gasolina|[aá]lcool|etanol|uber|corrida|[oô]nibus|passagem/.test(d))return'Transporte';if(/[aá]gua|luz|energia|internet|aluguel|conta|mensalidade|plano|lavanderia/.test(d))return'Utilidades';if(/comida|lanche|alimenta[cç][aã]o|refei[cç][aã]o|caf[eé]|marmita|mercado|supermercado/.test(d))return'Comida';if(/taxa|boleto|imposto|das|mei|nota|fiscal|tributo|multa|juro|parcela|financiamento|alvar[aá]/.test(d))return'Taxas e Boletos';return'Outros';}
function getCatIcon(key){for(var i=0;i<CATEGORIAS.length;i++)if(CATEGORIAS[i].key===key)return CATEGORIAS[i].icon;return'📦';}
function nthVisita(n){return(n||1)+'ª visita';}
function statusClass(s){if(s==='Pronto')return'pronto';if(s==='Entregue')return'entregue';if(s==='Cancelado')return'cancelado';return'andamento';}

function carregarCacheInicial_(){
  try{lancamentos=JSON.parse(localStorage.getItem('zapLanc')||'[]')||[];}catch(e){lancamentos=[];}
  try{custos=JSON.parse(localStorage.getItem('zapCustos')||'[]')||[];}catch(e){custos=[];}
  try{clientes=JSON.parse(localStorage.getItem('zapClientes')||'[]')||[];}catch(e){clientes=[];}
  clientesFiltrados=clientes.slice();
  _calcStatsHome();
}

function dataHoraLocal_(){var d=new Date();return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear()+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');}
function hojeBR_(){var d=new Date();return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear();}
function escapeHtml_(v){return String(v||'').replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function showToast(msg,type){var t=document.getElementById('toast');if(!t)return;var title='',body='';if(msg&&typeof msg==='object'){title=msg.title||'';body=msg.msg||msg.body||'';}else{body=String(msg||'');}var cls=type||'success';if(cls==='green')cls='success';if(cls==='orange')cls='warning';if(cls==='blue')cls='info';t.innerHTML=(title?'<div class="toast-title">'+escapeHtml_(title)+'</div>':'')+'<div class="toast-msg">'+escapeHtml_(body)+'</div>';t.className='toast show '+cls;clearTimeout(t._timer);t._timer=setTimeout(function(){t.className='toast '+cls;},3600);}
