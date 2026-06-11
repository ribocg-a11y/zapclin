/* Pacote Z.1 — catálogos e estado global */
const SERVICES=[
  {name:'Higienização Rápida',price:15,icon:'🧹',cat:'Higienização'},
  {name:'Higienização Essencial',price:18,icon:'🧴',cat:'Higienização'},
  {name:'Higienização Profunda',price:23,icon:'💎',cat:'Higienização'},
  {name:'Limpeza + Hig. Rápida',price:18,icon:'🔵',cat:'Limpeza + Higienização'},
  {name:'Limpeza + Hig. Essencial',price:21,icon:'🟣',cat:'Limpeza + Higienização'},
  {name:'Limpeza + Hig. Profunda',price:30,icon:'⭐',cat:'Limpeza + Higienização'},
  {name:'Revitalização',price:70,icon:'✨',cat:'Premium'}
];
const SERVICE_TIMES={
  'higienizacao rapida':8,
  'higienizacao essencial':10,
  'higienizacao profunda':12,
  'limpeza + hig. rapida':16,
  'limpeza + hig. essencial':20,
  'limpeza + hig. profunda':30,
  'revitalizacao':1440
};
const CATEGORIAS=[
  {key:'Salários',icon:'👷'},{key:'Produtos/Insumos',icon:'🧴'},
  {key:'Ferramentas/Equipamentos',icon:'🔧'},{key:'Transporte',icon:'🚗'},
  {key:'Utilidades',icon:'💡'},{key:'Comida',icon:'🍔'},
  {key:'Taxas e Boletos',icon:'📄'},{key:'Outros',icon:'📦'}
];
const PAGE_TITLES={
  home:'ZapClin',
  registrar:'📋 Registrar',
  lancamentos:'📊 Vendas',
  custos:'💸 Custos',
  operacao:'Operação',
  clientes:'👥 Clientes',
  dashboard:'📈 Dashboard',
  relatorio:'📋 Relatório',
  admin:'📊 Painel Admin',
  aceites:'✅ Aceites',
  historico:'🗂️ Histórico',
  logs:'🧭 Logs',
  relacionamento:'Relacionamento',
  config:'⚙️ Config'
};
const WEB_APP='https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec';
const GOOGLE_REVIEW_URL='https://g.page/r/CcTInX7dYxLwEBM/review';
// [v4.4 NOVO]
// Versão visível do frontend. Use este valor para confirmar se o GitHub Pages carregou a atualização correta.
const APP_VERSION='v4.27.4';
// [v4.7 NOVO]
// Chave única para detectar troca de versão no navegador/PWA sem apagar dados operacionais.
const APP_VERSION_KEY='zapAppVersion';
const APP_TRANSIENT_CACHE_KEYS=['zapKpisAdminServer','zapAdminLogs'];

var selected=new Set(), webAppUrl=localStorage.getItem('zapWebApp')||WEB_APP;
var lancamentos=[], custos=[], clientes=[], clientesFiltrados=[];
var logsAdmin=[], logsAdminFiltrados=[];
var vendasPeriodo='hoje';
var operacaoFiltro='todos';
var backendVersao='';
var fotosSelecionadas=[], servicosPorCap=[], obsPorCap=[];
var waData={};
var _criarLanc=false;
var _pagData={num:0,nome:'',tel:'',qtd:0};

// [v4.7 NOVO]
// Atualiza o título mobile sem destruir o selo de versão quando a tela ativa é a Home.
