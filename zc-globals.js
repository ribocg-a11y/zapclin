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
