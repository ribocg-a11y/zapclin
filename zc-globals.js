/* Pacote Z.1 — catálogos e estado global */
const SERVICES=[
  {name:'Higienização Rápida',price:15,icon:'🧹',cat:'Higienização',minutes:8,
   desc:'Mata germes, bactérias, tira odores e aromatiza.',
   recommendation:'Capacetes não higienizados toda semana.'},
  {name:'Higienização Essencial',price:18,icon:'🧴',cat:'Higienização',minutes:10,
   desc:'Mata germes, bactérias, tira odores e aromatiza.',
   recommendation:'Capacetes não higienizados toda semana.'},
  {name:'Higienização Profunda',price:23,icon:'💎',cat:'Higienização',minutes:12,
   desc:'Mata germes, bactérias, tira odores e aromatiza.',
   recommendation:'Capacetes não higienizados por 1 mês.'},
  {name:'Limpeza + Higienização',price:30,icon:'✨',cat:'Limpeza + Higienização',minutes:20,
   desc:'Limpa sujeiras leves (área externa); brilho, proteção e antiembaçante (viseira).',
   recommendation:'Capacetes higienizados toda semana.'},
  {name:'Higienização + Lavagem',price:45,icon:'🚿',cat:'Lavagem',minutes:45,
   desc:'Lavagem profunda interna e externa; remove sujeira pesada e mau cheiro forte; sanitização completa do capacete.',
   recommendation:''},
  {name:'Revitalização Premium',price:70,icon:'👑',cat:'Premium',minutes:240,
   desc:'Higienização completa, lavagem profunda, polimento técnico, recuperação do brilho, tratamento da viseira, eliminação de odores persistentes e acabamento premium.',
   recommendation:'Serviço premium — 4 horas.'}
];
const LEGACY_SERVICE_ALIASES={
  'Limpeza + Hig. Rápida':{price:18,minutes:16},
  'Limpeza + Hig. Essencial':{price:21,minutes:20},
  'Limpeza + Hig. Profunda':{price:30,minutes:30},
  'Revitalização':{price:70,minutes:1440}
};
const SERVICE_TIMES={
  'higienizacao rapida':8,
  'higienizacao essencial':10,
  'higienizacao profunda':12,
  'limpeza + higienizacao':20,
  'higienizacao + lavagem':45,
  'revitalizacao premium':240,
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
