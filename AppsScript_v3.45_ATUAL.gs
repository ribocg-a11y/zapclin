// ============================================================
// ZAPCLIN â€” APPS SCRIPT
// VersÃ£o: 3.47 | Data: 10/07/2026
// NOVO v3.47:
//   - Action importarJulho2026 (PIN admin) para agente importar lancamentos remotamente
// NOVO v3.46:
//   - CatÃ¡logo jun/2026: 6 serviÃ§os (preÃ§os, tempos e nomes do flyer ZapClin)
//   - Limpeza + HigienizaÃ§Ã£o unificada, HigienizaÃ§Ã£o + Lavagem, RevitalizaÃ§Ã£o Premium (4h)
//   - Aliases legados para lanÃ§amentos histÃ³ricos (Limpeza + Hig. *, RevitalizaÃ§Ã£o)
// HOTFIX v3.45.1:
//   - Diagnostico: check truncamento legado OK quando DATA_ROW_MAX>=2000 (ranges dinamicos ativos)
// HOTFIX v3.45:
//   - Corrige listar/listarCustos/listarClientes para ler ate getLastRow (antes truncava na linha 600)
//   - Alinha buscarKpisAdmin com America/Sao_Paulo e soma QTD como o frontend
//   - Unifica leitura operacional em helpers de range dinamico ate linha 2000
// HOTFIX v3.44:
//   - Expõe coluna CLIENTE/OS na action listar para diferenciar lancamento vinculado de avulso valido
// HOTFIX v3.43:
//   - Troca comparativo sem base anterior por bloco de base de referencia historica no PDF Golden
// HOTFIX v3.42:
//   - Refina texto do PDF Golden quando nao ha mes anterior consolidado
//   - Ajusta leitura visual de base historica consolidada e quebra de pagina
// HOTFIX v3.41:
//   - Remove alerta UI do testarEnvioEmail para permitir execucao pelo editor/trigger sem erro de contexto
// NOVO v3.40:
//   - Alinha envio/salvamento do relatorio Golden ao modelo v2 validado no frontend
//   - Gera PDF oficial por HTML institucional, com evolucao do negocio e nota de governanca
//   - Agrupa linhas consolidadas para evitar composicao por servico sem lastro contabil
// BASE v3.39:
//   - Relatorio Golden passa a respeitar QTD nos lancamentos consolidados historicos
//   - Permite importar abril oficial sem inflar/duplicar atendimentos do PDF
// NOVO v3.38:
//   - Adiciona aceite simples por botao para OS, com registro auditavel em ACEITES OS
//   - Gera tela publica de aceite vinculada ao numero da OS e retorna status para o app
// HOTFIX v3.37:
// HOTFIX v3.37:
//   - Torna o formulario publico do Clube VIP mobile-first, em tela cheia no celular
//   - Aumenta campos, textos e area de toque para reduzir necessidade de zoom
// HOTFIX v3.36:
//   - Adiciona trava transacional nas escritas criticas para uso simultaneo por varios operadores
//   - Serializa cadastros com fotos/Nova OS, status, custos, edicoes, cancelamentos, VIP e lancamentos simples
//   - Evita colisao de proxima linha livre quando 5+ pessoas gravam ao mesmo tempo
// HOTFIX v3.35:
//   - Remove leitura massiva de fotos do listarClientes para reduzir lentidao e divergencia entre aparelhos
//   - Adiciona action listarFotosCliente sob demanda por telefone/pasta para ficha CRM e nova OS
//   - Mantem dados operacionais leves para sincronizacao frequente no PWA
// NOVO v3.34:
// NOVO v3.34:
//   - Retorna fotos do Drive por OS para ficha CRM do Relacionamento
//   - Permite criar OS recorrente copiando foto anterior ou usando foto nova obrigatoria
//   - Mantem rastreabilidade da nova pasta da OS sem alterar baseline do cadastro completo
// NOVO v3.33:
// NOVO v3.33:
//   - Retorna dados da aba RELACIONAMENTO junto dos clientes para a ficha CRM do app
//   - Mantem cadastro VIP como fonte auditavel de aniversario, email, modelo, origem e consentimento
// NOVO v3.32:
//   - Aplica beneficio Clube VIP/aniversario somente apos cadastro comprovado
//   - Desconto limitado a 30% de um unico servico, sempre o de menor valor, com teto de R$ 15
//   - Registra auditoria financeira em BENEFICIOS VIP e LOGS
// HOTFIX v3.31:
//   - Corrige prazo operacional da Revitalizacao para 24h/1440min
// HOTFIX v3.30:
//   - Valida CLIENTES/LANCAMENTOS antes de gravar cadastro com fotos
//   - Evita cadastro parcial quando a criacao de lancamentos falhar
// HOTFIX v3.29:
//   - Corrige busca robusta das abas com emoji/acentos para evitar getRange de null
//   - Adiciona action repararLancamentosClientesHoje para recuperar atendimentos gravados sem lancamento
// NOVO v3.28:
//   - Cria cadastro VIP publico para coletar aniversario e preferencias do cliente
//   - Retorna numero da visita no cadastro para orientar mensagens de primeira visita
//   - Adiciona base de relacionamento para campanhas, recorrencia e desconto de aniversario
// NOVO v3.27:
//   - Adiciona action gerarOsPdf para criar OS/comprovante digital em PDF no Drive
//   - Registra URL do PDF em LOGS para rastreabilidade operacional
// NOVO v3.26:
//   - Considera Pronto como encerramento do tempo operacional/SLA
//   - Preserva tempo final quando o status avanÃ§a de Pronto para Entregue
// NOVO v3.25:
//   - Persiste tempo final e prazo operacional do cliente ao marcar Entregue/Cancelado
//   - Retorna campos de SLA para o frontend parar o cronÃ´metro apÃ³s encerramento
// NOVO v3.24:
//   - Adiciona ediÃ§Ã£o/cancelamento operacional para lanÃ§amentos, custos e clientes
//   - MantÃ©m exclusÃ£o lÃ³gica/auditÃ¡vel para evitar perda acidental de histÃ³rico
// BASE v3.23:
//   - Corrige timestamp dos LOGS para texto fixo em horÃ¡rio de SÃ£o Paulo (UTC-3)
//   - Evita reconversÃ£o automÃ¡tica de fuso pelo Google Sheets ao listar logs no Admin
// BASE v3.22:
//   - Adiciona action listarLogsAdmin para Painel Admin de observabilidade
//   - Retorna logs recentes da aba LOGS sem alterar dados operacionais
// BASE v3.21:
//   - Adiciona action registrarEventoFrontend para telemetria do PWA
//   - Permite que o frontend registre eventos operacionais na aba LOGS sem alterar dados
//   - Registra erros de API, cadastro, WhatsApp gerado, status e navegaÃ§Ã£o crÃ­tica
// BASE v3.20:
//   - Adiciona governanÃ§a e observabilidade com aba LOGS
//   - Cria registrarLogSistema_() e helpers seguros de log operacional
//   - Registra diagnÃ³stico, erros do backend, geraÃ§Ã£o de PDF e envio de relatÃ³rio
//   - NÃ£o altera fluxos operacionais existentes, apenas adiciona rastreabilidade
// BASE v3.19:
//   - Adiciona diagnÃ³stico operacional via action diagnosticoSistema
//   - Verifica abas obrigatÃ³rias, parÃ¢metros de e-mail, triggers, Drive, Gmail e linhas crÃ­ticas
// BASE v3.18:
//   - Corrige buscarKpisAdmin_() para ler datas como Date ou texto
//   - Evita retorno zerado quando LANÃ‡AMENTOS/CUSTOS usam datas reais do Sheets
//   - Adiciona helpers locais de KPI para data e nÃºmero sem alterar demais funÃ§Ãµes
// BASE v3.17:
//   - doGet() action 'enviarRelatorio': dispara enviarRelatorioMensal()
//   - doGet() action 'buscarKpisAdmin': retorna KPIs calculados server-side
// ============================================================

var SHEET_REGISTRAR   = '\uD83C\uDFE0 REGISTRAR';
var SHEET_LANCAMENTOS = '\uD83D\uDCCA LAN\u00C7AMENTOS';
var SHEET_CUSTOS      = 'CUSTOS';
var SHEET_CLIENTES    = 'CLIENTES';
var SHEET_RELACIONAMENTO = 'RELACIONAMENTO';
var SHEET_BENEFICIOS_VIP = 'BENEFICIOS VIP';
var SHEET_ACEITES_OS  = 'ACEITES OS';
var SHEET_DASHBOARD   = '\uD83D\uDCC8 DASHBOARD';
// [v3.20 NOVO] Aba de observabilidade operacional. Criada automaticamente quando necessÃ¡rio.
var SHEET_LOGS        = 'LOGS';
var SHEET_ID          = '1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug';
var FUSO              = 'America/Sao_Paulo';
var VERSION           = '3.47';
var DATA_ROW_START    = 10;
var DATA_ROW_MAX      = 2000;
var LOG_FUSO_OFFSET_HORAS = -3;
var VIP_ANIVERSARIO_PERCENTUAL = 0.30;
var VIP_ANIVERSARIO_TETO = 15;

var PRECOS = {
  'Higieniza\u00e7\u00e3o R\u00e1pida': 15, 'Higieniza\u00e7\u00e3o Essencial': 18,
  'Higieniza\u00e7\u00e3o Profunda': 23, 'Limpeza + Higieniza\u00e7\u00e3o': 30,
  'Higieniza\u00e7\u00e3o + Lavagem': 45, 'Revitaliza\u00e7\u00e3o Premium': 70,
  'Limpeza + Hig. R\u00e1pida': 18, 'Limpeza + Hig. Essencial': 21,
  'Limpeza + Hig. Profunda': 30, 'Revitaliza\u00e7\u00e3o': 70
};

function actionPrecisaLock_(action) {
  return [
    'salvar','salvarCusto','editarLancamento','cancelarLancamento',
    'editarCusto','cancelarCusto','atualizarStatus','editarCliente',
    'cancelarCliente','salvarCadastroVip','registrarEventoFrontend',
    'gerarOsPdf','enviarRelatorio','repararLancamentosClientesHoje',
    'confirmarAceiteOs','importarJulho2026'
  ].indexOf(String(action || '')) >= 0;
}

function obterLockEscrita_(rotulo) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  return lock;
}

function normalizarServicoKey_(nome) {
  return String(nome || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function precoServicoOs_(nome) {
  var direto = PRECOS[nome];
  if (direto !== undefined && direto !== null && direto !== '') return parseFloat(direto) || 0;
  var mapa = {
    'higienizacao rapida': 15,
    'higienizacao essencial': 18,
    'higienizacao profunda': 23,
    'limpeza + higienizacao': 30,
    'higienizacao + lavagem': 45,
    'revitalizacao premium': 70,
    'limpeza + hig. rapida': 18,
    'limpeza + hig. essencial': 21,
    'limpeza + hig. profunda': 30,
    'revitalizacao': 70
  };
  return mapa[normalizarServicoKey_(nome)] || 0;
}

function normalizarNomeAba_(nome) {
  return String(nome || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
}

function getSheetRobusto_(ss, nomes, criarNome) {
  nomes = Array.isArray(nomes) ? nomes : [nomes];
  for (var i = 0; i < nomes.length; i++) {
    var direto = ss.getSheetByName(nomes[i]);
    if (direto) return direto;
  }
  var alvo = nomes.map(normalizarNomeAba_);
  var sheets = ss.getSheets();
  for (var j = 0; j < sheets.length; j++) {
    var n = normalizarNomeAba_(sheets[j].getName());
    for (var k = 0; k < alvo.length; k++) {
      if (n === alvo[k] || n.indexOf(alvo[k]) >= 0 || alvo[k].indexOf(n) >= 0) return sheets[j];
    }
  }
  if (criarNome) return ss.insertSheet(criarNome);
  return null;
}

function getLancamentosSheet_(ss) {
  return getSheetRobusto_(ss, [SHEET_LANCAMENTOS, 'LANÇAMENTOS', 'LANCAMENTOS', '📊 LANÇAMENTOS'], null);
}

function getRegistrarSheet_(ss) {
  return getSheetRobusto_(ss, [SHEET_REGISTRAR, 'REGISTRAR', '🏠 REGISTRAR'], null);
}

function getDashboardSheet_(ss) {
  return getSheetRobusto_(ss, [SHEET_DASHBOARD, 'DASHBOARD', '📈 DASHBOARD'], null);
}

function fmtData_(d) {
  if (!d) return '';
  if (d instanceof Date) return Utilities.formatDate(d, FUSO, 'dd/MM/yyyy');
  return String(d);
}

function fmtHora_(h) {
  if (!h) return '';
  if (h instanceof Date) return Utilities.formatDate(h, 'Etc/GMT+8', 'HH:mm');
  return String(h);
}

// [v3.45 NOVO] Limites compartilhados para leituras operacionais sem truncar dados recentes.
function ultimaLinhaDados_(sheet, colNum) {
  if (!sheet) return DATA_ROW_START;
  var last = sheet.getLastRow();
  if (last < DATA_ROW_START) return DATA_ROW_START;
  if (last > DATA_ROW_MAX) last = DATA_ROW_MAX;
  return last;
}

function numLinhasDados_(sheet, colNum) {
  return ultimaLinhaDados_(sheet, colNum) - DATA_ROW_START + 1;
}

function getLancamentosListaValues_(lanc) {
  return lanc.getRange(DATA_ROW_START, 2, numLinhasDados_(lanc, 2), 8).getValues();
}

function getCustosListaValues_(custos) {
  return custos.getRange(DATA_ROW_START, 1, numLinhasDados_(custos, 2), 6).getValues();
}

function getClientesListaValues_(clientes) {
  return clientes.getRange(DATA_ROW_START, 1, numLinhasDados_(clientes, 1), 16).getValues();
}

function getClientesOsColValues_(clientes) {
  return clientes.getRange(DATA_ROW_START, 1, numLinhasDados_(clientes, 1), 1).getValues();
}


function getOrCreateClientesSheet(ss) {
  var s = ss.getSheetByName(SHEET_CLIENTES);
  if (!s) s = ss.insertSheet(SHEET_CLIENTES);
  try {
    var headers = s.getRange('N8:P8').getValues()[0].join('');
    if (!headers) s.getRange('N8:P8').setValues([['ENCERRADO EM','TEMPO MIN','PRAZO MIN']]).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('#00e5ff');
  } catch(e) {}
  return s;
}

function getOrCreateRelacionamentoSheet(ss) {
  var s = ss.getSheetByName(SHEET_RELACIONAMENTO);
  if (!s) s = ss.insertSheet(SHEET_RELACIONAMENTO);
  if (s.getLastRow() < 1 || !s.getRange(1,1).getValue()) {
    s.getRange(1,1,1,10).setValues([['TIMESTAMP','NOME','TELEFONE','ANIVERSARIO','EMAIL','MODELO/CAPACETE','PREFERENCIA','ORIGEM','CONSENTIMENTO','VERSAO']]).setFontWeight('bold').setBackground('#111827').setFontColor('#00e5ff');
    s.setFrozenRows(1);
  }
  return s;
}

function getOrCreateBeneficiosVipSheet(ss) {
  var s = ss.getSheetByName(SHEET_BENEFICIOS_VIP);
  if (!s) s = ss.insertSheet(SHEET_BENEFICIOS_VIP);
  if (s.getLastRow() < 1 || !s.getRange(1,1).getValue()) {
    s.getRange(1,1,1,16).setValues([['TIMESTAMP','OS','NOME','TELEFONE','ANIVERSARIO','REGRA','ELEGIVEL','MOTIVO','SERVICO_BASE','VALOR_BASE','PERCENTUAL','TETO','DESCONTO','TOTAL_ANTES','TOTAL_DEPOIS','VERSAO']]).setFontWeight('bold').setBackground('#111827').setFontColor('#00e5ff');
    s.setFrozenRows(1);
  }
  return s;
}

function getOrCreateAceitesOsSheet(ss) {
  var s = ss.getSheetByName(SHEET_ACEITES_OS);
  if (!s) s = ss.insertSheet(SHEET_ACEITES_OS);
  if (s.getLastRow() < 1 || !s.getRange(1,1).getValue()) {
    s.getRange(1,1,1,11).setValues([['TIMESTAMP','OS','NOME','TELEFONE','STATUS','DATA_OS','HORA_OS','TOTAL','SERVICOS','OBSERVACOES','VERSAO']]).setFontWeight('bold').setBackground('#111827').setFontColor('#00e5ff');
    s.setFrozenRows(1);
  }
  return s;
}

function telDigits_(tel) {
  return String(tel || '').replace(/\D/g, '').replace(/^55/, '');
}

function aniversarioPartes_(valor) {
  var s = String(valor || '').trim();
  if (!s) return null;
  var m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return { mes: parseInt(m[2], 10), dia: parseInt(m[3], 10), raw: s };
  m = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/\d{2,4})?$/);
  if (m) return { mes: parseInt(m[2], 10), dia: parseInt(m[1], 10), raw: s };
  return null;
}

function buscarCadastroVip_(ss, telefone) {
  var tel = telDigits_(telefone);
  if (!tel) return null;
  var s = getOrCreateRelacionamentoSheet(ss);
  var rows = s.getRange(2,1,Math.max(1,s.getLastRow()-1),10).getValues();
  var found = null;
  for (var i = 0; i < rows.length; i++) {
    if (telDigits_(rows[i][2]) !== tel) continue;
    var ani = aniversarioPartes_(rows[i][3]);
    if (!ani) continue;
    found = { timestamp: rows[i][0], nome: String(rows[i][1] || ''), telefone: String(rows[i][2] || ''), aniversario: ani.raw, mes: ani.mes, dia: ani.dia };
  }
  return found;
}

function listarRelacionamentoMap_(ss) {
  var s = getOrCreateRelacionamentoSheet(ss);
  var last = s.getLastRow();
  var mapa = {};
  if (last < 2) return mapa;
  var rows = s.getRange(2,1,Math.max(1,last-1),10).getValues();
  for (var i = 0; i < rows.length; i++) {
    var tel = telDigits_(rows[i][2]);
    if (!tel) continue;
    mapa[tel] = {
      timestamp: fmtData_(rows[i][0]) + (fmtHora_(rows[i][0]) ? ' ' + fmtHora_(rows[i][0]) : ''),
      nome: String(rows[i][1] || ''),
      telefone: String(rows[i][2] || ''),
      aniversario: fmtData_(rows[i][3]) || String(rows[i][3] || ''),
      email: String(rows[i][4] || ''),
      modelo: String(rows[i][5] || ''),
      preferencia: String(rows[i][6] || ''),
      origem: String(rows[i][7] || ''),
      consentimento: String(rows[i][8] || ''),
      versao: String(rows[i][9] || '')
    };
  }
  return mapa;
}

function folderIdFromUrl_(url) {
  var s = String(url || '');
  var m = s.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  m = s.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return m ? m[1] : '';
}

function listarFotosCliente_(folderUrl, limite) {
  var id = folderIdFromUrl_(folderUrl);
  var out = [];
  if (!id) return out;
  try {
    var folder = DriveApp.getFolderById(id);
    var files = folder.getFiles();
    while (files.hasNext() && out.length < (limite || 12)) {
      var file = files.next();
      var mime = String(file.getMimeType() || '');
      if (mime.indexOf('image/') !== 0) continue;
      out.push({
        id: file.getId(),
        name: file.getName(),
        url: file.getUrl(),
        thumb: 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w220',
        downloadUrl: 'https://drive.google.com/uc?export=view&id=' + file.getId()
      });
    }
  } catch(e) {}
  return out;
}

function menorServicoElegivel_(servicos) {
  var melhor = null;
  for (var i = 0; i < servicos.length; i++) {
    var svc = servicos[i];
    var val = precoServicoOs_(svc);
    if (!svc || !(val > 0)) continue;
    if (!melhor || val < melhor.valor) melhor = { servico: svc, valor: val };
  }
  return melhor;
}

function beneficioJaRegistrado_(ss, os) {
  var s = getOrCreateBeneficiosVipSheet(ss);
  var rows = s.getRange(2,2,Math.max(1,s.getLastRow()-1),1).getValues();
  for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === String(os)) return true;
  return false;
}

function registrarBeneficioVip_(ss, info) {
  var s = getOrCreateBeneficiosVipSheet(ss);
  var row = Math.max(2, s.getLastRow() + 1);
  s.getRange(row,1,1,16).setValues([[Utilities.formatDate(new Date(), FUSO, 'dd/MM/yyyy HH:mm'), info.os || '', info.nome || '', info.telefone || '', info.aniversario || '', info.regra || 'ANIVERSARIO_CLUBE_VIP', info.elegivel ? 'SIM' : 'NAO', info.motivo || '', info.servicoBase || '', info.valorBase || 0, info.percentual || VIP_ANIVERSARIO_PERCENTUAL, info.teto || VIP_ANIVERSARIO_TETO, info.desconto || 0, info.totalAntes || 0, info.totalDepois || 0, VERSION]]);
  s.getRange(row,10,1,6).setNumberFormats([['R$ #,##0.00','0%','R$ #,##0.00','R$ #,##0.00','R$ #,##0.00','R$ #,##0.00']]);
}

function aplicarBeneficioVipNaLinha_(ss, clientes, linha, lanc, criarLancamentoDesconto) {
  var row = clientes.getRange(linha,1,1,16).getValues()[0];
  var os = row[0], nome = String(row[3] || ''), telefone = String(row[4] || ''), status = String(row[9] || 'Em andamento');
  var totalAtual = parseFloat(row[10] || 0) || 0;
  var descontoAtual = parseFloat(row[12] || 0) || 0;
  if (!os) return { aplicado:false, motivo:'OS inexistente' };
  if (status === 'Entregue' || status === 'Cancelado') return { aplicado:false, motivo:'Sem servico em aberto' };
  if (descontoAtual > 0) return { aplicado:false, motivo:'Ja existe desconto no atendimento' };
  if (beneficioJaRegistrado_(ss, os)) return { aplicado:false, motivo:'Beneficio ja registrado para a OS' };
  var vip = buscarCadastroVip_(ss, telefone);
  if (!vip) return { aplicado:false, motivo:'Cadastro VIP nao localizado' };
  var hoje = new Date();
  var mesAtual = parseInt(Utilities.formatDate(hoje, FUSO, 'M'), 10);
  var diaAtual = parseInt(Utilities.formatDate(hoje, FUSO, 'd'), 10);
  if (vip.mes !== mesAtual) return { aplicado:false, motivo:'Fora do mes de aniversario' };
  var servicos = [];
  try { servicos = JSON.parse(String(row[7] || '[]')); } catch(e) { servicos = []; }
  var base = menorServicoElegivel_(servicos);
  if (!base) return { aplicado:false, motivo:'Sem servico elegivel' };
  var desconto = Math.min(Math.round(base.valor * VIP_ANIVERSARIO_PERCENTUAL * 100) / 100, VIP_ANIVERSARIO_TETO);
  if (!(desconto > 0)) return { aplicado:false, motivo:'Desconto calculado zero' };
  var totalDepois = Math.max(0, Math.round((totalAtual - desconto) * 100) / 100);
  clientes.getRange(linha,11).setValue(totalDepois).setNumberFormat('R$ #,##0.00');
  clientes.getRange(linha,13).setValue(desconto).setNumberFormat('R$ #,##0.00');
  if (criarLancamentoDesconto && lanc) criarLancamentoServico_(lanc, 'Desconto Clube VIP', fmtData_(row[1]), fmtHora_(row[2]), -desconto, os);
  var info = { aplicado:true, os:os, nome:nome, telefone:telefone, aniversario:vip.aniversario, regra:'ANIVERSARIO_CLUBE_VIP', elegivel:true, motivo:vip.dia === diaAtual ? 'Aniversario hoje' : 'Mes de aniversario', servicoBase:base.servico, valorBase:base.valor, percentual:VIP_ANIVERSARIO_PERCENTUAL, teto:VIP_ANIVERSARIO_TETO, desconto:desconto, totalAntes:totalAtual, totalDepois:totalDepois, aniversarioHoje:vip.dia === diaAtual };
  registrarBeneficioVip_(ss, info);
  registrarLogSistema_('RELACIONAMENTO', 'aplicarBeneficioVip', 'OK', 'Beneficio Clube VIP aplicado', info);
  return info;
}

function aplicarBeneficioVipAberto_(ss, telefone) {
  var clientes = getOrCreateClientesSheet(ss);
  var lanc = getLancamentosSheet_(ss);
  var tel = telDigits_(telefone);
  if (!tel) return { aplicado:false, motivo:'Telefone invalido' };
  var rows = clientes.getRange('A10:P2000').getValues();
  var alvo = -1;
  for (var i = 0; i < rows.length; i++) {
    if (!rows[i][0]) break;
    if (telDigits_(rows[i][4]) !== tel) continue;
    var st = String(rows[i][9] || 'Em andamento');
    if (st === 'Entregue' || st === 'Cancelado') continue;
    alvo = 10 + i;
  }
  if (alvo < 0) return { aplicado:false, motivo:'Nenhuma OS aberta para este telefone' };
  return aplicarBeneficioVipNaLinha_(ss, clientes, alvo, lanc, true);
}

function calcularVisitaCliente_(clientes, telefone) {
  var tel = telDigits_(telefone);
  if (!tel) return { numVisita: 1, totalVisitas: 1 };
  var rows = clientes.getRange('A10:E2000').getValues();
  var count = 0;
  for (var i = 0; i < rows.length; i++) {
    if (!rows[i][0]) break;
    if (telDigits_(rows[i][4]) === tel) count++;
  }
  return { numVisita: count + 1, totalVisitas: count + 1 };
}

function cadastroVipUrl_(nome, telefone) {
  var base = ScriptApp.getService().getUrl();
  return base + '?action=cadastroVip&nome=' + encodeURIComponent(nome || '') + '&tel=' + encodeURIComponent(telefone || '');
}

function aceiteOsUrl_(os) {
  var base = ScriptApp.getService().getUrl();
  return base + '?action=aceiteOs&os=' + encodeURIComponent(os || '');
}

function escapeHtmlOs_(v) {
  return String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function formatarOsNumero_(num) {
  num = parseInt(num || 0, 10);
  return '#' + String(num).padStart(6, '0');
}

function minutosParaTexto_(min) {
  min = parseInt(min || 0, 10);
  if (!min) return 'Nao registrado';
  if (min < 60) return min + ' min';
  var h = Math.floor(min / 60);
  var m = min % 60;
  return h + 'h' + (m ? m + 'min' : '');
}

function tempoServicoOsMin_(nome) {
  var k = String(nome || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  var mapa = {
    'higienizacao rapida': 8,
    'higienizacao essencial': 10,
    'higienizacao profunda': 12,
    'limpeza + higienizacao': 20,
    'higienizacao + lavagem': 45,
    'revitalizacao premium': 240,
    'limpeza + hig. rapida': 16,
    'limpeza + hig. essencial': 20,
    'limpeza + hig. profunda': 30,
    'revitalizacao': 1440
  };
  return mapa[k] || 15;
}

function prazoOsMin_(servicos, qtd) {
  if (servicos && servicos.length) {
    var total = 0;
    for (var i = 0; i < servicos.length; i++) if (servicos[i]) total += tempoServicoOsMin_(servicos[i]);
    return total || 15;
  }
  return Math.max(1, parseInt(qtd || 1, 10)) * 15;
}

function minutosDesdeRecebimento_(dataValor, horaValor) {
  var data = dataValor instanceof Date ? dataValor : null;
  if (!data) {
    var p = String(dataValor || '').split('/');
    if (p.length !== 3) return '';
    data = new Date(parseInt(p[2], 10), parseInt(p[1], 10) - 1, parseInt(p[0], 10), 0, 0, 0);
  }
  var hh = 0, mm = 0;
  if (horaValor instanceof Date) {
    hh = parseInt(Utilities.formatDate(horaValor, 'Etc/GMT+8', 'HH'), 10);
    mm = parseInt(Utilities.formatDate(horaValor, 'Etc/GMT+8', 'mm'), 10);
  } else {
    var hp = String(horaValor || '').split(':');
    if (hp.length >= 2) { hh = parseInt(hp[0], 10) || 0; mm = parseInt(hp[1], 10) || 0; }
  }
  data.setHours(hh, mm, 0, 0);
  var diff = Math.floor((new Date().getTime() - data.getTime()) / 60000);
  return diff >= 0 ? diff : '';
}

function gerarOsPdf_(ss, numCliente) {
  if (!numCliente) throw new Error('OS invalida');
  var clientes = getOrCreateClientesSheet(ss);
  var rows = getClientesListaValues_(clientes);
  var row = null;
  for (var i = 0; i < rows.length; i++) {
    if (!rows[i][0]) break;
    if (parseInt(rows[i][0], 10) === numCliente) { row = rows[i]; break; }
  }
  if (!row) throw new Error('Cliente #' + numCliente + ' nao encontrado');

  var servicos = [];
  var observacoes = [];
  try { servicos = JSON.parse(String(row[7] || '[]')); } catch(eSvc) { servicos = []; }
  try { observacoes = JSON.parse(String(row[8] || '[]')); } catch(eObs) { observacoes = []; }

  var os = formatarOsNumero_(row[0]);
  var nome = String(row[3] || '');
  var telefone = String(row[4] || '');
  var qtd = parseInt(row[5] || 1, 10) || 1;
  var status = String(row[9] || 'Em andamento');
  var total = parseFloat(row[10] || 0) || 0;
  var desconto = parseFloat(row[12] || 0) || 0;
  var tempoMin = row[14] === '' ? '' : parseInt(row[14] || 0, 10);
  var prazoMin = row[15] === '' ? '' : parseInt(row[15] || 0, 10);
  if (tempoMin === '') tempoMin = minutosDesdeRecebimento_(row[1], row[2]);
  if (prazoMin === '') prazoMin = prazoOsMin_(servicos, qtd);
  var agora = Utilities.formatDate(new Date(), FUSO, 'dd/MM/yyyy HH:mm');
  var recebimento = fmtData_(row[1]) + ' ' + fmtHora_(row[2]);

  var linhasServico = '';
  for (var s = 0; s < Math.max(qtd, servicos.length); s++) {
    var svc = servicos[s] || 'Servico nao informado';
    var obs = observacoes[s] || '';
    linhasServico += '<tr><td>Capacete ' + (s + 1) + '</td><td>' + escapeHtmlOs_(svc) + '</td><td>' + escapeHtmlOs_(obs || '-') + '</td></tr>';
  }

  var slaHtml = tempoMin !== '' || prazoMin !== ''
    ? '<div class="pill">Tempo: ' + escapeHtmlOs_(minutosParaTexto_(tempoMin)) + ' / Prazo: ' + escapeHtmlOs_(minutosParaTexto_(prazoMin)) + '</div>'
    : '<div class="pill">Tempo operacional em andamento</div>';

  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
    'body{font-family:Arial,sans-serif;color:#101828;margin:0;background:#f5f7fb}' +
    '.wrap{max-width:760px;margin:0 auto;background:white;padding:34px}' +
    '.brand{font-size:30px;font-weight:800;color:#071329}.brand span{color:#00cfe8}' +
    '.muted{color:#667085;font-size:12px}.top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #00cfe8;padding-bottom:18px;margin-bottom:22px}' +
    '.os{font-size:24px;font-weight:800;color:#2563eb;text-align:right}.status{display:inline-block;margin-top:8px;padding:6px 12px;border-radius:18px;background:#ecfdf3;color:#027a48;font-weight:700;font-size:12px}' +
    '.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0}.box{border:1px solid #e4e7ec;border-radius:12px;padding:14px;background:#fcfcfd}.lbl{font-size:11px;color:#667085;text-transform:uppercase;letter-spacing:.08em}.val{font-size:15px;font-weight:700;margin-top:4px}' +
    'table{width:100%;border-collapse:collapse;margin-top:12px}th{background:#071329;color:white;text-align:left;padding:10px;font-size:12px}td{border-bottom:1px solid #e4e7ec;padding:10px;font-size:12px;vertical-align:top}' +
    '.pill{display:inline-block;background:#eff6ff;color:#175cd3;border:1px solid #b2ddff;border-radius:20px;padding:8px 12px;font-weight:700;font-size:12px;margin:6px 6px 6px 0}' +
    '.total{font-size:24px;font-weight:800;color:#12b76a;text-align:right}.foot{margin-top:26px;border-top:1px solid #e4e7ec;padding-top:14px;font-size:11px;color:#667085}' +
    '</style></head><body><div class="wrap">' +
    '<div class="top"><div><div class="brand"><span>Zap</span>Clin</div><div class="muted">Higienizacao de Capacetes</div><div class="muted">Golden Shopping Calhau - Sao Luis, MA</div></div><div><div class="os">OS ' + os + '</div><div class="status">' + escapeHtmlOs_(status) + '</div></div></div>' +
    '<div class="grid"><div class="box"><div class="lbl">Cliente</div><div class="val">' + escapeHtmlOs_(nome) + '</div></div><div class="box"><div class="lbl">Telefone</div><div class="val">' + escapeHtmlOs_(telefone) + '</div></div><div class="box"><div class="lbl">Recebimento</div><div class="val">' + escapeHtmlOs_(recebimento) + '</div></div><div class="box"><div class="lbl">Capacetes</div><div class="val">' + qtd + '</div></div></div>' +
    '<h3>Servicos e condicoes registradas</h3><table><thead><tr><th>Item</th><th>Servico</th><th>Condicoes</th></tr></thead><tbody>' + linhasServico + '</tbody></table>' +
    '<div style="margin-top:18px">' + slaHtml + '</div>' +
    '<div class="grid"><div class="box"><div class="lbl">Desconto</div><div class="val">R$ ' + desconto.toFixed(2).replace('.', ',') + '</div></div><div class="box"><div class="lbl">Total do atendimento</div><div class="total">R$ ' + total.toFixed(2).replace('.', ',') + '</div></div></div>' +
    '<div class="foot">Documento gerado pelo Sistema ZapClin v' + VERSION + ' em ' + agora + '. Este comprovante consolida os dados operacionais registrados na planilha no momento da emissao.</div>' +
    '</div></body></html>';

  var pasta = _obterOuCriarPasta_('ZapClin_OS_Digital', null);
  var nomeArquivo = 'ZapClin_OS_' + String(numCliente).padStart(6, '0') + '.pdf';
  var existentes = pasta.getFilesByName(nomeArquivo);
  while (existentes.hasNext()) existentes.next().setTrashed(true);
  var blob = Utilities.newBlob(html, 'text/html', nomeArquivo.replace('.pdf', '.html')).getAs(MimeType.PDF).setName(nomeArquivo);
  var file = pasta.createFile(blob);
  registrarLogSistema_('PDF', 'gerarOsPdf', 'OK', 'OS digital gerada', { os: numCliente, nome: nome, url: file.getUrl() });
  return { ok: true, version: VERSION, num: numCliente, nome: nomeArquivo, url: file.getUrl() };
}

function renderCadastroVipForm_(p) {
  var nome = String(p.nome || '').replace(/"/g, '&quot;');
  var tel = String(p.tel || '').replace(/"/g, '&quot;');
  var actionUrl = ScriptApp.getService().getUrl();
  var html = '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Clube VIP ZapClin</title><style>'+
    '*{box-sizing:border-box}html{min-height:100%;background:#090a0f}body{margin:0;min-height:100%;background:#090a0f;color:#eef2ff;font-family:Arial,sans-serif;-webkit-text-size-adjust:100%}'+
    'main{width:100%;max-width:720px;margin:0 auto;padding:18px;min-height:100dvh}.card{background:#151821;border:1px solid #2a2f42;border-radius:20px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.35)}'+
    'h1{font-size:30px;line-height:1.05;margin:0 0 10px;color:#00d7f5}p{color:#aab0cc;line-height:1.45;margin:0 0 14px;font-size:16px}label{display:block;margin:16px 0 7px;font-weight:700;font-size:14px;color:#eef2ff}'+
    'input,textarea{width:100%;padding:16px;border-radius:14px;border:1px solid #2a2f42;background:#0f1118;color:#fff;font-size:18px;line-height:1.25;outline:none}input:focus,textarea:focus{border-color:#00d7f5;box-shadow:0 0 0 3px rgba(0,215,245,.16)}'+
    'button{width:100%;margin-top:20px;border:0;border-radius:16px;padding:17px;background:#17d982;color:#04120b;font-weight:900;font-size:17px;line-height:1.1;min-height:56px}.gift{background:rgba(23,217,130,.1);border:1px solid rgba(23,217,130,.25);border-radius:16px;padding:15px;margin:16px 0;color:#d9ffe9;font-size:16px;line-height:1.35}.fine{font-size:13px;color:#8b90ad}'+
    '@media(max-width:640px){main{max-width:none;padding:0;min-height:100dvh}.card{min-height:100dvh;border-radius:0;border-left:0;border-right:0;padding:22px 18px 28px}h1{font-size:32px}p,.gift{font-size:17px}label{font-size:15px}input,textarea{font-size:19px;padding:17px}button{font-size:18px;padding:18px}}'+
    '</style></head><body><main><div class="card"><h1>Clube VIP ZapClin</h1><p>Complete seu cadastro para receber benefícios exclusivos, campanhas antecipadas e seu presente de aniversário.</p><div class="gift">No mês do seu aniversário, você pode ganhar <b>30% de desconto em 1 serviço</b>, sempre calculado sobre o serviço de menor valor do atendimento e limitado a R$ 15,00.</div><p class="fine">O benefício só é aplicado quando cadastro, aniversário e atendimento aberto batem com a regra da ZapClin.</p><form method="get" action="'+actionUrl+'"><input type="hidden" name="action" value="salvarCadastroVip"><input type="hidden" name="form" value="1"><label>Nome</label><input name="nome" required autocomplete="name" value="'+nome+'"><label>WhatsApp</label><input name="telefone" required inputmode="tel" autocomplete="tel" value="'+tel+'"><label>Data de aniversário</label><input name="aniversario" type="date" required><label>E-mail opcional</label><input name="email" type="email" inputmode="email" autocomplete="email"><label>Modelo ou observação do capacete</label><textarea name="modelo" rows="3" placeholder="Ex: LS2 preto, capacete de trilha..."></textarea><button type="submit">Entrar para o Clube VIP</button></form></div></main></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle('Clube VIP ZapClin').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function salvarCadastroVip_(ss, p) {
  var s = getOrCreateRelacionamentoSheet(ss);
  var nome = String(p.nome || '').trim();
  var tel = String(p.telefone || p.tel || '').trim();
  if (!nome) throw new Error('Nome obrigatorio');
  if (!tel) throw new Error('Telefone obrigatorio');
  var row = Math.max(2, s.getLastRow() + 1);
  s.getRange(row, 1, 1, 10).setValues([[Utilities.formatDate(new Date(), FUSO, 'dd/MM/yyyy HH:mm'), nome, tel, String(p.aniversario || ''), String(p.email || ''), String(p.modelo || ''), String(p.preferencia || ''), 'Cadastro VIP', 'SIM', VERSION]]);
  var beneficio = aplicarBeneficioVipAberto_(ss, tel);
  registrarLogSistema_('RELACIONAMENTO', 'salvarCadastroVip', 'OK', 'Cadastro VIP recebido', { nome: nome, telefone: tel, beneficio: beneficio });
  return { ok: true, version: VERSION, msg: 'Cadastro VIP salvo', beneficio: beneficio };
}

function renderCadastroVipObrigado_(res) {
  var b = res && res.beneficio;
  var msg = b && b.aplicado ? 'Seu benefício de aniversário foi aplicado no atendimento aberto. Desconto: R$ ' + String((b.desconto || 0).toFixed ? b.desconto.toFixed(2) : b.desconto).replace('.', ',') + '.' : 'Agora você faz parte do Clube VIP ZapClin. Quando cadastro, aniversário e atendimento aberto baterem com a regra, o benefício é aplicado pela equipe.';
  var html = '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Cadastro confirmado</title><style>*{box-sizing:border-box}body{margin:0;background:#090a0f;color:#eef2ff;font-family:Arial,sans-serif;display:grid;min-height:100dvh;place-items:center;padding:18px}div{width:100%;max-width:520px;background:#151821;border:1px solid #2a2f42;border-radius:20px;padding:30px 22px;text-align:center}h1{color:#17d982;margin:0 0 12px;font-size:30px}p{color:#aab0cc;line-height:1.45;font-size:17px}@media(max-width:640px){body{padding:0;display:block}div{max-width:none;min-height:100dvh;border-radius:0;border-left:0;border-right:0;padding:44px 20px}}</style></head><body><div><h1>Cadastro confirmado!</h1><p>'+msg+'</p></div></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle('Cadastro confirmado');
}

function buscarClientePorOs_(ss, os) {
  var clientes = getOrCreateClientesSheet(ss);
  var rows = clientes.getRange('A10:P2000').getValues();
  var alvo = String(parseInt(os || 0, 10));
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (!r[0]) break;
    if (String(r[0]) !== alvo) continue;
    var servicos = [], observacoes = [];
    try { servicos = JSON.parse(String(r[7] || '[]')); } catch(eSvc) { servicos = []; }
    try { observacoes = JSON.parse(String(r[8] || '[]')); } catch(eObs) { observacoes = []; }
    return {
      row: 10 + i,
      os: r[0],
      data: fmtData_(r[1]),
      hora: fmtHora_(r[2]),
      nome: String(r[3] || ''),
      telefone: String(r[4] || ''),
      qtd: r[5],
      servicos: servicos,
      observacoes: observacoes,
      status: String(r[9] || 'Em andamento'),
      total: parseFloat(r[10] || 0) || 0
    };
  }
  return null;
}

function listarAceitesOsMap_(ss) {
  var s = getOrCreateAceitesOsSheet(ss);
  var last = s.getLastRow();
  var out = {};
  if (last < 2) return out;
  var rows = s.getRange(2,1,last-1,11).getValues();
  for (var i = 0; i < rows.length; i++) {
    var os = String(rows[i][1] || '');
    if (!os) continue;
    out[os] = {
      status: String(rows[i][4] || 'CONFIRMADO'),
      timestamp: String(rows[i][0] || ''),
      version: String(rows[i][10] || '')
    };
  }
  return out;
}

function confirmarAceiteOs_(ss, p) {
  var os = parseInt(p.os || 0, 10);
  if (!os) throw new Error('OS obrigatoria');
  var cliente = buscarClientePorOs_(ss, os);
  if (!cliente) throw new Error('OS nao encontrada');
  var mapa = listarAceitesOsMap_(ss);
  if (mapa[String(os)] && mapa[String(os)].status === 'CONFIRMADO') {
    return { ok:true, version:VERSION, os:os, status:'CONFIRMADO', jaConfirmado:true };
  }
  var s = getOrCreateAceitesOsSheet(ss);
  var row = Math.max(2, s.getLastRow() + 1);
  s.getRange(row,1,1,11).setValues([[Utilities.formatDate(new Date(), FUSO, 'dd/MM/yyyy HH:mm:ss'), os, cliente.nome, cliente.telefone, 'CONFIRMADO', cliente.data, cliente.hora, cliente.total, JSON.stringify(cliente.servicos || []), JSON.stringify(cliente.observacoes || []), VERSION]]);
  s.getRange(row,8).setNumberFormat('R$ #,##0.00');
  registrarLogSistema_('ACEITE', 'confirmarAceiteOs', 'OK', 'Aceite de OS confirmado', { os: os, nome: cliente.nome, telefone: cliente.telefone });
  return { ok:true, version:VERSION, os:os, status:'CONFIRMADO' };
}

function renderAceiteOsForm_(ss, p) {
  var os = parseInt(p.os || 0, 10);
  var cliente = buscarClientePorOs_(ss, os);
  if (!cliente) {
    return HtmlService.createHtmlOutput('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>OS nao encontrada</title><style>body{margin:0;background:#090a0f;color:#eef2ff;font-family:Arial,sans-serif;display:grid;min-height:100dvh;place-items:center;padding:20px}div{max-width:520px;background:#151821;border:1px solid #2a2f42;border-radius:20px;padding:28px}h1{color:#ff5252}</style></head><body><div><h1>OS não encontrada</h1><p>Confira o link enviado pela ZapClin.</p></div></body></html>').setTitle('OS nao encontrada');
  }
  var mapa = listarAceitesOsMap_(ss);
  var confirmado = mapa[String(os)] && mapa[String(os)].status === 'CONFIRMADO';
  var actionUrl = ScriptApp.getService().getUrl();
  var servHtml = (cliente.servicos || []).map(function(s,i){
    if (!s) return '';
    var obs = cliente.observacoes && cliente.observacoes[i] ? '<div class="obs">Condições: '+escapeHtmlOs_(cliente.observacoes[i])+'</div>' : '';
    return '<div class="svc"><strong>Capacete '+(i+1)+'</strong><span>'+escapeHtmlOs_(s)+'</span>'+obs+'</div>';
  }).join('');
  var btn = confirmado ? '<div class="ok">Aceite já confirmado. Obrigado!</div>' : '<form method="get" action="'+actionUrl+'"><input type="hidden" name="action" value="confirmarAceiteOs"><input type="hidden" name="form" value="1"><input type="hidden" name="os" value="'+os+'"><button type="submit">Aceito as condições da OS</button></form>';
  var html = '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Aceite OS '+formatarOsNumero_(os)+'</title><style>*{box-sizing:border-box}body{margin:0;background:#090a0f;color:#eef2ff;font-family:Arial,sans-serif;-webkit-text-size-adjust:100%}main{width:100%;max-width:760px;margin:0 auto;padding:18px;min-height:100dvh}.card{background:#151821;border:1px solid #2a2f42;border-radius:20px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.35)}h1{margin:0;color:#00d7f5;font-size:30px}.sub{color:#aab0cc;margin:8px 0 18px;line-height:1.45}.box{border:1px solid #2a2f42;background:#0f1118;border-radius:16px;padding:14px;margin:12px 0}.lbl{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8b90ad}.val{font-size:18px;font-weight:800;margin-top:4px}.svc{border-top:1px solid #2a2f42;padding:13px 0}.svc:first-child{border-top:0}.svc strong{display:block;color:#5b8cff;margin-bottom:4px}.obs{color:#aab0cc;margin-top:5px;line-height:1.35}.terms{font-size:14px;color:#cbd5e1;line-height:1.5;background:rgba(0,215,245,.07);border:1px solid rgba(0,215,245,.20);border-radius:16px;padding:14px;margin:16px 0}button{width:100%;border:0;border-radius:16px;background:#17d982;color:#04120b;font-weight:900;font-size:18px;min-height:58px;padding:18px}.ok{background:rgba(23,217,130,.12);border:1px solid rgba(23,217,130,.28);border-radius:16px;padding:16px;color:#d9ffe9;font-weight:800;text-align:center}@media(max-width:640px){main{padding:0;max-width:none}.card{min-height:100dvh;border-radius:0;border-left:0;border-right:0;padding:24px 18px 30px}h1{font-size:32px}.val{font-size:20px}}</style></head><body><main><div class="card"><h1>Aceite da OS '+formatarOsNumero_(os)+'</h1><p class="sub">Confira os dados registrados no recebimento do capacete. O aceite confirma ciência das condições e autoriza a execução do serviço.</p><div class="box"><div class="lbl">Cliente</div><div class="val">'+escapeHtmlOs_(cliente.nome)+'</div><div class="sub">'+escapeHtmlOs_(cliente.telefone)+' · '+escapeHtmlOs_(cliente.data)+' '+escapeHtmlOs_(cliente.hora)+'</div></div><div class="box"><div class="lbl">Serviços registrados</div>'+servHtml+'</div><div class="box"><div class="lbl">Total</div><div class="val">R$ '+String(cliente.total.toFixed(2)).replace('.', ',')+'</div></div><div class="terms">Ao tocar em aceitar, declaro que conferi as informações da OS, condições registradas e serviço contratado, autorizando a ZapClin a executar o atendimento conforme descrito.</div>'+btn+'</div></main></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle('Aceite OS '+formatarOsNumero_(os)).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function renderAceiteOsObrigado_(res) {
  var os = res && res.os ? formatarOsNumero_(res.os) : '';
  var html = '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Aceite confirmado</title><style>*{box-sizing:border-box}body{margin:0;background:#090a0f;color:#eef2ff;font-family:Arial,sans-serif;display:grid;min-height:100dvh;place-items:center;padding:18px}div{width:100%;max-width:520px;background:#151821;border:1px solid #2a2f42;border-radius:20px;padding:30px 22px;text-align:center}h1{color:#17d982;margin:0 0 12px;font-size:30px}p{color:#aab0cc;line-height:1.45;font-size:17px}@media(max-width:640px){body{padding:0;display:block}div{max-width:none;min-height:100dvh;border-radius:0;border-left:0;border-right:0;padding:44px 20px}}</style></head><body><div><h1>Aceite confirmado!</h1><p>Registramos sua confirmação da '+os+'. Obrigado pela confiança na ZapClin.</p></div></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle('Aceite confirmado');
}

function proximaLinhaLancamento_(lanc) {
  var dados = lanc.getRange('C10:C2000').getValues();
  var linha = 10;
  for (var i = 0; i < dados.length; i++) {
    if (dados[i][0] !== '') linha = 10 + i + 1;
    else break;
  }
  return linha;
}

function criarLancamentoServico_(lanc, svc, dataStr, horaStr, valor, clienteId) {
  var linha = proximaLinhaLancamento_(lanc);
  lanc.getRange(linha, 2).setValue(linha - 9);
  lanc.getRange(linha, 3).setValue(svc);
  lanc.getRange(linha, 4).setValue(dataStr);
  lanc.getRange(linha, 5).setValue(horaStr);
  lanc.getRange(linha, 6).setValue(1);
  lanc.getRange(linha, 7).setValue(valor);
  lanc.getRange(linha, 7).setNumberFormat('R$ #,##0.00');
  lanc.getRange(linha, 9).setValue(clienteId);
  return linha;
}

function repararLancamentosClientesHoje_(ss) {
  var clientes = getOrCreateClientesSheet(ss);
  var lanc = getLancamentosSheet_(ss);
  if (!lanc) throw new Error('Aba LANÇAMENTOS não encontrada');
  var hoje = Utilities.formatDate(new Date(), FUSO, 'dd/MM/yyyy');
  var vinculos = {};
  var vincRows = lanc.getRange('I10:I2000').getValues();
  for (var i = 0; i < vincRows.length; i++) if (vincRows[i][0]) vinculos[String(vincRows[i][0])] = true;
  var rows = clientes.getRange('A10:M2000').getValues();
  var criados = 0, clientesReparados = 0;
  for (var r = 0; r < rows.length; r++) {
    var row = rows[r];
    if (!row[0]) break;
    var clienteId = String(row[0]);
    if (vinculos[clienteId]) continue;
    if (fmtData_(row[1]) !== hoje) continue;
    if (String(row[9] || '') === 'Cancelado') continue;
    var servicos = [];
    try { servicos = JSON.parse(String(row[7] || '[]')); } catch(e) { servicos = []; }
    var hora = fmtHora_(row[2]);
    var antes = criados;
    for (var s = 0; s < servicos.length; s++) {
      var svc = servicos[s];
      if (!svc) continue;
      criarLancamentoServico_(lanc, svc, hoje, hora, precoServicoOs_(svc), row[0]);
      criados++;
    }
    var desconto = parseFloat(row[12] || 0) || 0;
    if (desconto > 0 && criados > antes) {
      criarLancamentoServico_(lanc, 'Desconto', hoje, hora, -desconto, row[0]);
      criados++;
    }
    if (criados > antes) clientesReparados++;
  }
  registrarLogSistema_('MANUTENCAO', 'repararLancamentosClientesHoje', 'OK', 'Lancamentos de clientes reparados', { clientes: clientesReparados, lancamentos: criados });
  return { ok: true, version: VERSION, clientes: clientesReparados, lancamentosCriados: criados };
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  LOGS / OBSERVABILIDADE â€” v3.20
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function getOrCreateLogsSheet_(ss) {
  // [v3.20 NOVO] Cria/normaliza a aba LOGS sem interferir nas abas operacionais.
  ss = ss || SpreadsheetApp.openById(SHEET_ID);
  var s = ss.getSheetByName(SHEET_LOGS);
  if (!s) s = ss.insertSheet(SHEET_LOGS);

  if (s.getLastRow() === 0 || String(s.getRange(1, 1).getValue()).trim() !== 'Timestamp') {
    s.getRange(1, 1, 1, 7).setValues([['Timestamp','Tipo','Origem','Status','Mensagem','Extra','VersÃ£o']]);
    s.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#111827').setFontColor('#00e5ff');
    s.setFrozenRows(1);
    s.setColumnWidth(1, 150);
    s.setColumnWidth(2, 120);
    s.setColumnWidth(3, 180);
    s.setColumnWidth(4, 90);
    s.setColumnWidth(5, 360);
    s.setColumnWidth(6, 420);
    s.setColumnWidth(7, 80);
  }
  // [v3.23 HOTFIX] MantÃ©m Timestamp como texto para impedir que o Sheets aplique fuso automaticamente.
  try { s.getRange('A:A').setNumberFormat('@'); } catch(eFmt) {}
  return s;
}

function timestampLogSaoPaulo_() {
  // [v3.23 HOTFIX]
  // Usa offset fixo UTC-3 porque a operaÃ§Ã£o Ã© em America/Sao_Paulo e o Brasil nÃ£o usa DST atualmente.
  // Isso evita discrepÃ¢ncias quando o Sheets interpreta/reconverte Date automaticamente.
  var agoraUtcMs = Date.now();
  var saoPaulo = new Date(agoraUtcMs + LOG_FUSO_OFFSET_HORAS * 60 * 60 * 1000);
  return Utilities.formatDate(saoPaulo, 'Etc/UTC', 'dd/MM/yyyy HH:mm:ss');
}

function serializarExtraLog_(extra) {
  // [v3.20 NOVO] SerializaÃ§Ã£o defensiva para evitar que objeto grande quebre o log.
  try {
    if (extra === null || extra === undefined) return '';
    if (typeof extra === 'string') return extra.substring(0, 5000);
    return JSON.stringify(extra).substring(0, 5000);
  } catch(e) {
    return String(extra).substring(0, 5000);
  }
}

function registrarLogSistema_(tipo, origem, status, mensagem, extra) {
  // [v3.20 NOVO] Logger central do ZapClin. Nunca interrompe o fluxo principal se falhar.
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var logs = getOrCreateLogsSheet_(ss);
    logs.appendRow([
      timestampLogSaoPaulo_(),
      String(tipo || 'GERAL'),
      String(origem || ''),
      String(status || 'INFO'),
      String(mensagem || ''),
      serializarExtraLog_(extra),
      VERSION
    ]);
  } catch(eLog) {
    Logger.log('[ZapClin LOG falhou] ' + eLog.toString());
  }
}

function registrarEventoFrontend_(p) {
  // [v3.21 NOVO]
  // Recebe telemetria leve do frontend/PWA e grava na aba LOGS.
  // NÃ£o altera dados operacionais, clientes, lanÃ§amentos, custos, Drive, Gmail ou triggers.
  p = p || {};
  var extra = {
    appVersion: String(p.appVersion || ''),
    tela: String(p.tela || ''),
    os: String(p.os || ''),
    cliente: String(p.cliente || ''),
    telefone: String(p.telefone || ''),
    url: String(p.url || ''),
    online: String(p.online || ''),
    userAgent: String(p.ua || ''),
    extra: String(p.extra || '')
  };
  registrarLogSistema_(
    'FRONTEND',
    String(p.origem || 'PWA'),
    String(p.status || 'INFO'),
    String(p.msg || p.mensagem || 'Evento frontend'),
    extra
  );
  return { ok: true, version: VERSION, msg: 'Evento frontend registrado' };
}

function listarLogsAdmin_(ss, limite) {
  // [v3.22 NOVO]
  // Leitura limitada dos logs recentes para exibiÃ§Ã£o no Admin. NÃ£o grava nem altera planilhas operacionais.
  ss = ss || SpreadsheetApp.openById(SHEET_ID);
  limite = Math.max(10, Math.min(parseInt(limite || 60, 10) || 60, 150));
  var logs = getOrCreateLogsSheet_(ss);
  var lastRow = logs.getLastRow();
  if (lastRow < 2) {
    return {
      ok: true,
      version: VERSION,
      items: [],
      resumo: { total: 0, erros: 0, alertas: 0, frontend: 0 },
      lastRow: lastRow
    };
  }

  var startRow = Math.max(2, lastRow - limite + 1);
  var numRows = lastRow - startRow + 1;
  var rows = logs.getRange(startRow, 1, numRows, 7).getDisplayValues();
  var items = [];
  var resumo = { total: rows.length, erros: 0, alertas: 0, frontend: 0 };

  rows.forEach(function(r) {
    var status = String(r[3] || 'INFO');
    var tipo = String(r[1] || '');
    if (status === 'ERRO') resumo.erros++;
    if (status === 'ALERTA') resumo.alertas++;
    if (tipo === 'FRONTEND') resumo.frontend++;
    items.push({
      timestamp: String(r[0] || ''),
      tipo: tipo,
      origem: String(r[2] || ''),
      status: status,
      mensagem: String(r[4] || ''),
      extra: String(r[5] || ''),
      versao: String(r[6] || '')
    });
  });

  return {
    ok: true,
    version: VERSION,
    items: items.reverse(),
    resumo: resumo,
    lastRow: lastRow,
    limite: limite
  };
}

function salvarRegistro() {
  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var reg  = getRegistrarSheet_(ss);
  var lanc = getLancamentosSheet_(ss);
  var svcs    = ['Higieniza\u00e7\u00e3o R\u00e1pida','Higieniza\u00e7\u00e3o Essencial','Higieniza\u00e7\u00e3o Profunda',
                 'Limpeza + Higieniza\u00e7\u00e3o','Higieniza\u00e7\u00e3o + Lavagem','Revitaliza\u00e7\u00e3o Premium'];
  var vals    = [15,18,23,30,45,70];
  var chkRows = [12,15,18,21,24,27];
  var agora   = new Date();
  var dataStr = Utilities.formatDate(agora, FUSO, 'dd/MM/yyyy');
  var horaStr = Utilities.formatDate(agora, FUSO, 'HH:mm');
  var registrou = false;
  for (var i = 0; i < svcs.length; i++) {
    var celula = reg.getRange(chkRows[i], 5);
    if (celula.getValue() == true || celula.getValue() == 1) {
      var dados = lanc.getRange('C10:C2000').getValues();
      var proxLinha = 10;
      for (var j = 0; j < dados.length; j++) {
        if (dados[j][0] !== '') { proxLinha = 10 + j + 1; } else { break; }
      }
      lanc.getRange(proxLinha, 2).setValue(proxLinha - 9);
      lanc.getRange(proxLinha, 3).setValue(svcs[i]);
      lanc.getRange(proxLinha, 4).setValue(dataStr);
      lanc.getRange(proxLinha, 5).setValue(horaStr);
      lanc.getRange(proxLinha, 6).setValue(1);
      lanc.getRange(proxLinha, 7).setValue(vals[i]);
      lanc.getRange(proxLinha, 7).setNumberFormat('R$ #,##0.00');
      celula.setValue(false);
      registrou = true;
    }
  }
  if (registrou) SpreadsheetApp.getUi().alert('âœ… Registro salvo! [v' + VERSION + ']');
  else           SpreadsheetApp.getUi().alert('âš ï¸ Nenhum serviÃ§o selecionado! [v' + VERSION + ']');
}

function detectarCategoria(descricao) {
  var d = (descricao || '').toLowerCase();
  if (/sal[aÃ¡]rio|funcionÃ¡rio|funcionario|pagamento.*func|colaborador/.test(d))             return 'SalÃ¡rios';
  if (/produto|insumo|sab[aÃ£]o|detergente|esponja|luva|pano|microfibra|shampoo|cera|polish|limpador|material/.test(d)) return 'Produtos/Insumos';
  if (/ferramenta|equipamento|m[Ã¡a]quina|compressor|pistola|mangu[ei]ra|carrinho|estante|prateleira|aquisi[cÃ§][aÃ£]o/.test(d)) return 'Ferramentas/Equipamentos';
  if (/transporte|combust[iÃ­]vel|gasolina|[aÃ¡]lcool|etanol|uber|corrida|[oÃ´]nibus|passagem/.test(d)) return 'Transporte';
  if (/[aÃ¡]gua|luz|energia|internet|aluguel|conta|mensalidade|plano|lavanderia/.test(d))    return 'Utilidades';
  if (/comida|lanche|alimenta[cÃ§][aÃ£]o|refei[cÃ§][aÃ£]o|caf[eÃ©]|marmita|mercado|supermercado/.test(d)) return 'Comida';
  if (/taxa|boleto|imposto|das|mei|nota|fiscal|tributo|multa|juro|parcela|financiamento|alvar[aÃ¡]/.test(d)) return 'Taxas e Boletos';
  return 'Outros';
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  doGet
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function doGet(e) {
  var p        = e && e.parameter ? e.parameter : {};
  var callback = p.callback || '';
  var result   = {};
  var actionLock = null;
  try {
    var ss     = SpreadsheetApp.openById(SHEET_ID);
    var action = p.action || 'ping';
    if (actionPrecisaLock_(action)) actionLock = obterLockEscrita_(action);

    if (action === 'cadastroVip') {
      return renderCadastroVipForm_(p);

    } else if (action === 'salvarCadastroVip' && p.form === '1') {
      return renderCadastroVipObrigado_(salvarCadastroVip_(ss, p));

    } else if (action === 'aceiteOs') {
      return renderAceiteOsForm_(ss, p);

    } else if (action === 'confirmarAceiteOs' && p.form === '1') {
      return renderAceiteOsObrigado_(confirmarAceiteOs_(ss, p));

    } else if (action === 'ping') {
      result = { ok: true, version: VERSION, timezone: ss.getSpreadsheetTimeZone() };

    } else if (action === 'salvar') {
      var lanc = getLancamentosSheet_(ss);
      if (!lanc) throw new Error('Aba LANÃ‡AMENTOS nÃ£o encontrada');
      var svcs    = (p.svcs || '').split('|');
      var vals    = (p.vals || '').split('|');
      var agora   = new Date();
      var dataStr = Utilities.formatDate(agora, FUSO, 'dd/MM/yyyy');
      var horaStr = Utilities.formatDate(agora, FUSO, 'HH:mm');
      for (var i = 0; i < svcs.length; i++) {
        if (!svcs[i]) continue;
        var dados = lanc.getRange('C10:C2000').getValues();
        var linha = 10;
        for (var j = 0; j < dados.length; j++) {
          if (dados[j][0] !== '') { linha = 10 + j + 1; } else { break; }
        }
        lanc.getRange(linha, 2).setValue(linha - 9);
        lanc.getRange(linha, 3).setValue(svcs[i]);
        lanc.getRange(linha, 4).setValue(dataStr);
        lanc.getRange(linha, 5).setValue(horaStr);
        lanc.getRange(linha, 6).setValue(1);
        lanc.getRange(linha, 7).setValue(parseFloat(vals[i] || 0));
        lanc.getRange(linha, 7).setNumberFormat('R$ #,##0.00');
      }
      result = { ok: true, version: VERSION };

    } else if (action === 'listar') {
      var lanc = getLancamentosSheet_(ss);
      if (!lanc) throw new Error('Aba LANÃ‡AMENTOS nÃ£o encontrada');
      var rows  = getLancamentosListaValues_(lanc);
      var items = [];
      for (var i = 0; i < rows.length; i++) {
        if (!rows[i][1]) break;
        var svcLista = String(rows[i][1] || '');
        var canceladoLanc = /^CANCELADO\b/i.test(svcLista);
        items.push({ row: 10 + i, num: rows[i][0], svc: svcLista, data: fmtData_(rows[i][2]), hora: fmtHora_(rows[i][3]), qtd: rows[i][4], val: rows[i][5], clienteId: String(rows[i][7] || ''), cancelado: canceladoLanc });
      }
      result = { ok: true, version: VERSION, items: items.reverse() };

    } else if (action === 'editarLancamento') {
      var lancEdit = getLancamentosSheet_(ss);
      if (!lancEdit) throw new Error('Aba LANÃ‡AMENTOS nÃ£o encontrada');
      var rowLanc = parseInt(p.row || 0, 10);
      if (rowLanc < 10 || rowLanc > 2000) throw new Error('Linha de lanÃ§amento invÃ¡lida');
      var svcEdit = String(p.svc || '').trim();
      var valEdit = parseFloat(p.val || 0);
      var dataEdit = String(p.data || '').trim();
      if (!svcEdit) throw new Error('ServiÃ§o obrigatÃ³rio');
      if (!dataEdit) throw new Error('Data obrigatÃ³ria');
      if (!(valEdit >= 0)) throw new Error('Valor invÃ¡lido');
      lancEdit.getRange(rowLanc, 3).setValue(svcEdit);
      lancEdit.getRange(rowLanc, 4).setValue(dataEdit);
      lancEdit.getRange(rowLanc, 7).setValue(valEdit).setNumberFormat('R$ #,##0.00');
      registrarLogSistema_('OPERACAO', 'editarLancamento', 'OK', 'LanÃ§amento editado', { row: rowLanc, svc: svcEdit, valor: valEdit, data: dataEdit });
      result = { ok: true, version: VERSION, row: rowLanc };

    } else if (action === 'cancelarLancamento') {
      var lancCancel = getLancamentosSheet_(ss);
      if (!lancCancel) throw new Error('Aba LANÃ‡AMENTOS nÃ£o encontrada');
      var rowLancCancel = parseInt(p.row || 0, 10);
      if (rowLancCancel < 10 || rowLancCancel > 2000) throw new Error('Linha de lanÃ§amento invÃ¡lida');
      var svcOriginal = String(lancCancel.getRange(rowLancCancel, 3).getValue() || '');
      if (!/^CANCELADO\b/i.test(svcOriginal)) lancCancel.getRange(rowLancCancel, 3).setValue('CANCELADO - ' + svcOriginal);
      lancCancel.getRange(rowLancCancel, 7).setValue(0).setNumberFormat('R$ #,##0.00');
      registrarLogSistema_('OPERACAO', 'cancelarLancamento', 'OK', 'LanÃ§amento cancelado', { row: rowLancCancel, svcOriginal: svcOriginal });
      result = { ok: true, version: VERSION, row: rowLancCancel };

    } else if (action === 'salvarCusto') {
      var custos    = ss.getSheetByName(SHEET_CUSTOS);
      if (!custos) throw new Error('Aba CUSTOS nÃ£o encontrada');
      var descricao = p.desc || '';
      var valor     = parseFloat(p.val || 0);
      var dataParam = p.data || '';
      var categoria = detectarCategoria(descricao);
      var agora     = new Date();
      var horaStr   = Utilities.formatDate(agora, FUSO, 'HH:mm');
      var dadosCusto = custos.getRange('B10:B2000').getValues();
      var linhaCusto = 10;
      for (var i = 0; i < dadosCusto.length; i++) {
        if (dadosCusto[i][0] !== '') { linhaCusto = 10 + i + 1; } else { break; }
      }
      custos.getRange(linhaCusto, 1).setValue(linhaCusto - 9);
      custos.getRange(linhaCusto, 2).setValue(dataParam);
      custos.getRange(linhaCusto, 3).setValue(horaStr);
      custos.getRange(linhaCusto, 4).setValue(descricao);
      custos.getRange(linhaCusto, 5).setValue(categoria);
      custos.getRange(linhaCusto, 6).setValue(valor);
      custos.getRange(linhaCusto, 6).setNumberFormat('R$ #,##0.00');
      result = { ok: true, version: VERSION, categoria: categoria };

    } else if (action === 'listarCustos') {
      var custos = ss.getSheetByName(SHEET_CUSTOS);
      if (!custos) throw new Error('Aba CUSTOS nÃ£o encontrada');
      var rows  = getCustosListaValues_(custos);
      var items = [];
      for (var i = 0; i < rows.length; i++) {
        if (!rows[i][1]) break;
        var descLista = String(rows[i][3] || '');
        var canceladoCusto = /^CANCELADO\b/i.test(descLista);
        items.push({ row: 10 + i, num: rows[i][0], data: fmtData_(rows[i][1]), hora: fmtHora_(rows[i][2]), desc: descLista, cat: String(rows[i][4]), val: rows[i][5], cancelado: canceladoCusto });
      }
      result = { ok: true, version: VERSION, items: items.reverse() };

    } else if (action === 'editarCusto') {
      var custosEdit = ss.getSheetByName(SHEET_CUSTOS);
      if (!custosEdit) throw new Error('Aba CUSTOS nÃ£o encontrada');
      var rowCusto = parseInt(p.row || 0, 10);
      if (rowCusto < 10 || rowCusto > 2000) throw new Error('Linha de custo invÃ¡lida');
      var descEdit = String(p.desc || '').trim();
      var valCustoEdit = parseFloat(p.val || 0);
      var dataCustoEdit = String(p.data || '').trim();
      var catEdit = String(p.cat || detectarCategoria(descEdit));
      if (!descEdit) throw new Error('DescriÃ§Ã£o obrigatÃ³ria');
      if (!dataCustoEdit) throw new Error('Data obrigatÃ³ria');
      if (!(valCustoEdit >= 0)) throw new Error('Valor invÃ¡lido');
      custosEdit.getRange(rowCusto, 2).setValue(dataCustoEdit);
      custosEdit.getRange(rowCusto, 4).setValue(descEdit);
      custosEdit.getRange(rowCusto, 5).setValue(catEdit);
      custosEdit.getRange(rowCusto, 6).setValue(valCustoEdit).setNumberFormat('R$ #,##0.00');
      registrarLogSistema_('OPERACAO', 'editarCusto', 'OK', 'Custo editado', { row: rowCusto, desc: descEdit, categoria: catEdit, valor: valCustoEdit });
      result = { ok: true, version: VERSION, row: rowCusto, categoria: catEdit };

    } else if (action === 'cancelarCusto') {
      var custosCancel = ss.getSheetByName(SHEET_CUSTOS);
      if (!custosCancel) throw new Error('Aba CUSTOS nÃ£o encontrada');
      var rowCustoCancel = parseInt(p.row || 0, 10);
      if (rowCustoCancel < 10 || rowCustoCancel > 2000) throw new Error('Linha de custo invÃ¡lida');
      var descOriginal = String(custosCancel.getRange(rowCustoCancel, 4).getValue() || '');
      if (!/^CANCELADO\b/i.test(descOriginal)) custosCancel.getRange(rowCustoCancel, 4).setValue('CANCELADO - ' + descOriginal);
      custosCancel.getRange(rowCustoCancel, 6).setValue(0).setNumberFormat('R$ #,##0.00');
      registrarLogSistema_('OPERACAO', 'cancelarCusto', 'OK', 'Custo cancelado', { row: rowCustoCancel, descOriginal: descOriginal });
      result = { ok: true, version: VERSION, row: rowCustoCancel };

    } else if (action === 'listarClientes') {
      var clientes = getOrCreateClientesSheet(ss);
      var rows     = getClientesListaValues_(clientes);
      var phoneCounts = {};
      for (var i = 0; i < rows.length; i++) {
        if (!rows[i][0]) break;
        var tel = String(rows[i][4]).replace(/\D/g, '');
        if (tel) phoneCounts[tel] = (phoneCounts[tel] || 0) + 1;
      }
      var beneficiosVip = {};
      var aceitesOs = {};
      var relacionamentoMap = {};
      try { relacionamentoMap = listarRelacionamentoMap_(ss); } catch(eRel) { relacionamentoMap = {}; }
      try { aceitesOs = listarAceitesOsMap_(ss); } catch(eAceite) { aceitesOs = {}; }
      try {
        var ben = getOrCreateBeneficiosVipSheet(ss);
        var benRows = ben.getRange(2,1,Math.max(1,ben.getLastRow()-1),16).getValues();
        for (var b = 0; b < benRows.length; b++) {
          if (!benRows[b][1]) continue;
          beneficiosVip[String(benRows[b][1])] = {
            aplicado: String(benRows[b][6] || '') === 'SIM',
            motivo: String(benRows[b][7] || ''),
            servicoBase: String(benRows[b][8] || ''),
            valorBase: parseFloat(benRows[b][9] || 0) || 0,
            percentual: parseFloat(benRows[b][10] || 0) || VIP_ANIVERSARIO_PERCENTUAL,
            teto: parseFloat(benRows[b][11] || 0) || VIP_ANIVERSARIO_TETO,
            desconto: parseFloat(benRows[b][12] || 0) || 0,
            totalAntes: parseFloat(benRows[b][13] || 0) || 0,
            totalDepois: parseFloat(benRows[b][14] || 0) || 0,
            aniversarioHoje: String(benRows[b][7] || '').toLowerCase().indexOf('hoje') >= 0
          };
        }
      } catch(eBen) {}
      var phoneOrder = {};
      var items      = [];
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        if (!r[0]) break;
        var tel = String(r[4]).replace(/\D/g, '');
        phoneOrder[tel] = (phoneOrder[tel] || 0) + 1;
        var servicos = [];
        try { servicos = JSON.parse(String(r[7] || '[]')); } catch(ee) { servicos = []; }
        var observacoes = [];
        try { observacoes = JSON.parse(String(r[8] || '[]')); } catch(ee) { observacoes = []; }
        var pastaUrl = String(r[6]);
        items.push({
          num: r[0], data: fmtData_(r[1]), hora: fmtHora_(r[2]),
          nome: String(r[3]), tel: String(r[4]), qtd: r[5], pasta: pastaUrl,
          servicos: servicos, observacoes: observacoes,
          status: String(r[9] || 'Em andamento'),
          total: parseFloat(r[10]) || 0,
          dataPagamento: fmtData_(r[11]) || '',
          desconto: parseFloat(r[12]) || 0,
          relacionamento: relacionamentoMap[telDigits_(r[4])] || null,
          beneficioVip: beneficiosVip[String(r[0])] || null,
          aceite: aceitesOs[String(r[0])] || { status: 'PENDENTE', url: aceiteOsUrl_(r[0]) },
          encerradoEm: String(r[13] || ''),
          tempoEncerradoMin: r[14] === '' ? '' : parseInt(r[14], 10),
          prazoMin: r[15] === '' ? '' : parseInt(r[15], 10),
          numVisita: phoneOrder[tel], totalVisitas: phoneCounts[tel] || 1
        });
      }
      result = { ok: true, version: VERSION, items: items.reverse() };

    } else if (action === 'listarFotosCliente') {
      var clientesFotos = getOrCreateClientesSheet(ss);
      var rowsFotos = getClientesListaValues_(clientesFotos);
      var telBusca = telDigits_(p.tel || p.telefone || '');
      var pastaBusca = String(p.pasta || '');
      var fotosItems = [];
      for (var f = 0; f < rowsFotos.length; f++) {
        var rf = rowsFotos[f];
        if (!rf[0]) break;
        var mesmoTel = telBusca && telDigits_(rf[4]) === telBusca;
        var mesmaPasta = pastaBusca && String(rf[6] || '') === pastaBusca;
        if (!mesmoTel && !mesmaPasta) continue;
        var fotosOs = listarFotosCliente_(String(rf[6] || ''), 10);
        for (var ff = 0; ff < fotosOs.length; ff++) {
          fotosOs[ff].os = rf[0];
          fotosOs[ff].data = fmtData_(rf[1]);
          fotosOs[ff].hora = fmtHora_(rf[2]);
          fotosOs[ff].pasta = String(rf[6] || '');
          fotosItems.push(fotosOs[ff]);
        }
      }
      result = { ok: true, version: VERSION, items: fotosItems.slice(0, 60) };

    } else if (action === 'atualizarStatus') {
      var clientes    = getOrCreateClientesSheet(ss);
      var numCliente  = parseInt(p.num || 0);
      var novoStatus  = p.status || 'Em andamento';
      var allNums     = getClientesOsColValues_(clientes);
      var linhaAlvo   = -1;
      for (var i = 0; i < allNums.length; i++) {
        if (allNums[i][0] == numCliente) { linhaAlvo = 10 + i; break; }
      }
      if (linhaAlvo === -1) throw new Error('Cliente #' + numCliente + ' nÃ£o encontrado');
      clientes.getRange(linhaAlvo, 10).setValue(novoStatus);
      if (novoStatus === 'Entregue') {
        var dataPag = p.dataPagamento || Utilities.formatDate(new Date(), FUSO, 'dd/MM/yyyy');
        clientes.getRange(linhaAlvo, 12).setValue(dataPag);
      }
      if (novoStatus === 'Pronto' || novoStatus === 'Entregue' || novoStatus === 'Cancelado') {
        clientes.getRange(linhaAlvo, 14).setValue(String(p.encerradoEm || Utilities.formatDate(new Date(), FUSO, 'dd/MM/yyyy HH:mm')));
        clientes.getRange(linhaAlvo, 15).setValue(p.tempoMin === '' ? '' : parseInt(p.tempoMin || 0, 10));
        clientes.getRange(linhaAlvo, 16).setValue(p.prazoMin === '' ? '' : parseInt(p.prazoMin || 0, 10));
      } else {
        clientes.getRange(linhaAlvo, 14, 1, 3).clearContent();
      }
      result = { ok: true, version: VERSION, num: numCliente, status: novoStatus };

    } else if (action === 'editarCliente') {
      var clientesEdit = getOrCreateClientesSheet(ss);
      var numClienteEdit = parseInt(p.num || 0, 10);
      var numsEdit = getClientesOsColValues_(clientesEdit);
      var linhaClienteEdit = -1;
      for (var i = 0; i < numsEdit.length; i++) {
        if (numsEdit[i][0] == numClienteEdit) { linhaClienteEdit = 10 + i; break; }
      }
      if (linhaClienteEdit === -1) throw new Error('Cliente #' + numClienteEdit + ' nÃ£o encontrado');
      var nomeEdit = String(p.nome || '').trim();
      var telEdit = String(p.tel || '').trim();
      var qtdEdit = parseInt(p.qtd || 1, 10) || 1;
      var totalEdit = parseFloat(p.total || 0);
      var descontoEdit = parseFloat(p.desconto || 0);
      var statusEdit = String(p.status || 'Em andamento');
      if (!nomeEdit) throw new Error('Nome obrigatÃ³rio');
      if (!telEdit) throw new Error('Telefone obrigatÃ³rio');
      clientesEdit.getRange(linhaClienteEdit, 4).setValue(nomeEdit);
      clientesEdit.getRange(linhaClienteEdit, 5).setValue(telEdit);
      clientesEdit.getRange(linhaClienteEdit, 6).setValue(qtdEdit);
      clientesEdit.getRange(linhaClienteEdit, 10).setValue(statusEdit);
      clientesEdit.getRange(linhaClienteEdit, 11).setValue(totalEdit).setNumberFormat('R$ #,##0.00');
      clientesEdit.getRange(linhaClienteEdit, 13).setValue(descontoEdit).setNumberFormat('R$ #,##0.00');
      registrarLogSistema_('CLIENTE', 'editarCliente', 'OK', 'Cliente editado', { os: numClienteEdit, nome: nomeEdit, telefone: telEdit, status: statusEdit });
      result = { ok: true, version: VERSION, num: numClienteEdit };

    } else if (action === 'cancelarCliente') {
      var clientesCancel = getOrCreateClientesSheet(ss);
      var numClienteCancel = parseInt(p.num || 0, 10);
      var numsCancel = getClientesOsColValues_(clientesCancel);
      var linhaClienteCancel = -1;
      for (var i = 0; i < numsCancel.length; i++) {
        if (numsCancel[i][0] == numClienteCancel) { linhaClienteCancel = 10 + i; break; }
      }
      if (linhaClienteCancel === -1) throw new Error('Cliente #' + numClienteCancel + ' nÃ£o encontrado');
      clientesCancel.getRange(linhaClienteCancel, 10).setValue('Cancelado');
      clientesCancel.getRange(linhaClienteCancel, 14).setValue(String(p.encerradoEm || Utilities.formatDate(new Date(), FUSO, 'dd/MM/yyyy HH:mm')));
      clientesCancel.getRange(linhaClienteCancel, 15).setValue(p.tempoMin === '' ? '' : parseInt(p.tempoMin || 0, 10));
      clientesCancel.getRange(linhaClienteCancel, 16).setValue(p.prazoMin === '' ? '' : parseInt(p.prazoMin || 0, 10));
      registrarLogSistema_('CLIENTE', 'cancelarCliente', 'OK', 'Cliente cancelado', { os: numClienteCancel });
      result = { ok: true, version: VERSION, num: numClienteCancel, status: 'Cancelado' };

    } else if (action === 'gerarOsPdf') {
      result = gerarOsPdf_(ss, parseInt(p.num || 0, 10));

    // â”€â”€ NOVO v3.17: Enviar relatÃ³rio pelo app mobile â”€â”€
    } else if (action === 'enviarRelatorio') {
      try {
        enviarRelatorioMensal();
        result = { ok: true, version: VERSION, msg: 'RelatÃ³rio enviado com sucesso' };
      } catch(errEnv) {
        // [v3.20 LOG] Registra falha do envio de relatÃ³rio acionado pelo app.
        registrarLogSistema_('RELATORIO', 'doGet?action=enviarRelatorio', 'ERRO', errEnv.toString(), { action: action });
        result = { ok: false, error: errEnv.toString(), version: VERSION };
      }

    // â”€â”€ NOVO v3.17: KPIs admin calculados server-side â”€â”€
    } else if (action === 'buscarKpisAdmin') {
      result = buscarKpisAdmin_(ss);

    // â”€â”€ NOVO v3.22: Logs recentes para Painel Admin â”€â”€
    } else if (action === 'listarLogsAdmin') {
      result = listarLogsAdmin_(ss, p.limite);

    } else if (action === 'salvarCadastroVip') {
      result = salvarCadastroVip_(ss, p);

    } else if (action === 'confirmarAceiteOs') {
      result = confirmarAceiteOs_(ss, p);

    } else if (action === 'repararLancamentosClientesHoje') {
      result = repararLancamentosClientesHoje_(ss);

    } else if (action === 'importarJulho2026') {
      result = importarJulho2026_(ss, p.pin);

    // â”€â”€ NOVO v3.21: Telemetria leve do frontend/PWA â”€â”€
    } else if (action === 'registrarEventoFrontend') {
      result = registrarEventoFrontend_(p);

    // â”€â”€ NOVO v3.19: DiagnÃ³stico operacional â”€â”€
    } else if (action === 'diagnosticoSistema') {
      result = diagnosticoSistema_(ss);
      // [v3.20 LOG] Registra execuÃ§Ã£o do diagnÃ³stico para rastreabilidade operacional.
      registrarLogSistema_('DIAGNOSTICO', 'doGet?action=diagnosticoSistema', result.ok ? 'OK' : 'ALERTA', 'DiagnÃ³stico executado', result.resumo || result.error || null);

    } else {
      result = { ok: true, version: VERSION };
    }

  } catch (err) {
    // [v3.20 LOG] Registra erro nÃ£o tratado do backend HTTP.
    registrarLogSistema_('ERRO', 'doGet', 'ERRO', err.toString(), { action: (typeof action !== 'undefined' ? action : '') });
    result = { ok: false, error: err.toString(), version: VERSION };
  } finally {
    if (actionLock) {
      try { actionLock.releaseLock(); } catch(eLock) {}
    }
  }

  var json = JSON.stringify(result);
  if (callback) {
    return ContentService.createTextOutput(callback + '(' + json + ')').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  NOVO v3.17: buscarKpisAdmin â€” KPIs server-side
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function buscarKpisAdmin_(ss) {
  try {
    var LN  = getLancamentosSheet_(ss);
    var CST = ss.getSheetByName(SHEET_CUSTOS);
    if (!LN)  throw new Error('Aba LANÃ‡AMENTOS nÃ£o encontrada');
    if (!CST) throw new Error('Aba CUSTOS nÃ£o encontrada');

    var agora    = new Date();
    var hojeKey  = Utilities.formatDate(agora, FUSO, 'dd/MM/yyyy');
    var mesAtual = parseInt(Utilities.formatDate(agora, FUSO, 'M'), 10);
    var anoAtual = parseInt(Utilities.formatDate(agora, FUSO, 'yyyy'), 10);

    var lLast = LN.getLastRow();
    var recHoje = 0, atHoje = 0, recMes = 0, atMes = 0;

    if (lLast >= DATA_ROW_START) {
      var lDados = LN.getRange(DATA_ROW_START, 3, numLinhasDados_(LN, 3), 5).getValues();
      for (var i = 0; i < lDados.length; i++) {
        var row = lDados[i];
        if (!row[0]) break;

        // [v3.18 CORREÃ‡ÃƒO]
        // A data em LANÃ‡AMENTOS pode vir como objeto Date do Google Sheets,
        // nÃ£o apenas texto dd/MM/yyyy. A versÃ£o v3.17 convertia tudo para String,
        // fazendo parseDateParts_ falhar e podendo retornar KPIs zerados.
        var dataBruta = row[1];
        var dp        = kpiDateParts_(dataBruta);
        var dataKey   = kpiDateKey_(dataBruta);
        var val       = kpiNumber_(row[4]);
        var qtdAt     = kpiQtdAtendimento_(row[0], row[3], val);

        if (!dp || val <= 0 || qtdAt <= 0) continue;

        if (dataKey === hojeKey) {
          recHoje += val;
          atHoje += qtdAt;
        }

        if (dp.mes === mesAtual && dp.ano === anoAtual) {
          recMes += val;
          atMes += qtdAt;
        }
      }
    }

    var cLast = CST.getLastRow();
    var cusHoje = 0, cusMes = 0;

    if (cLast >= DATA_ROW_START) {
      var cDados = CST.getRange(DATA_ROW_START, 1, numLinhasDados_(CST, 2), 6).getValues();
      for (var j = 0; j < cDados.length; j++) {
        var crow = cDados[j];
        if (!crow[1]) break;

        // [v3.18 CORREÃ‡ÃƒO]
        // Mesma proteÃ§Ã£o aplicada aos custos: aceita Date real do Sheets
        // ou texto dd/MM/yyyy sem zerar os KPIs por erro de conversÃ£o.
        var cDataBruta = crow[1];
        var cdp        = kpiDateParts_(cDataBruta);
        var cDataKey   = kpiDateKey_(cDataBruta);
        var cVal       = kpiNumber_(crow[5]);

        if (!cdp || cVal <= 0) continue;

        if (cDataKey === hojeKey) {
          cusHoje += cVal;
        }

        if (cdp.mes === mesAtual && cdp.ano === anoAtual) {
          cusMes += cVal;
        }
      }
    }

    var resultado = recMes - cusMes;
    var margem    = recMes > 0 ? parseFloat((resultado / recMes * 100).toFixed(1)) : 0;
    var ticket    = atMes  > 0 ? parseFloat((recMes / atMes).toFixed(2)) : 0;

    return {
      ok: true,
      version: VERSION,
      recHoje: recHoje,
      cusHoje: cusHoje,
      recMes: recMes,
      cusMes: cusMes,
      atHoje: atHoje,
      atMes: atMes,
      resultado: resultado,
      margem: margem,
      ticket: ticket,
      fonte: 'server-side-v3.45'
    };

  } catch(err) {
    return { ok: false, error: err.toString(), version: VERSION };
  }
}

// [v3.18 NOVO]
// Helper especÃ­fico dos KPIs Admin. Mantido separado para nÃ£o alterar parseDateParts_(),
// que jÃ¡ Ã© usado por outras rotinas antigas do sistema.
function kpiDateParts_(d) {
  if (!d) return null;

  if (d instanceof Date) {
    // [v3.45] Usa o mesmo fuso operacional do fmtData_/frontend.
    var s = Utilities.formatDate(d, FUSO, 'dd/MM/yyyy');
    var m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) return null;
    return {
      dia: parseInt(m[1], 10),
      mes: parseInt(m[2], 10),
      ano: parseInt(m[3], 10)
    };
  }

  var s = String(d).trim();
  var m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    return {
      dia: parseInt(m[1], 10),
      mes: parseInt(m[2], 10),
      ano: parseInt(m[3], 10)
    };
  }

  return null;
}

// [v3.18 NOVO]
// Normaliza data para chave dd/MM/yyyy em comparaÃ§Ãµes de hoje.
function kpiDateKey_(d) {
  var dp = kpiDateParts_(d);
  if (!dp) return '';
  return pad2_(dp.dia) + '/' + pad2_(dp.mes) + '/' + dp.ano;
}

// [v3.18 NOVO]
// Converte valores numÃ©ricos vindos como nÃºmero, "R$ 1.234,56" ou "1234.56".
function kpiNumber_(v) {
  if (typeof v === 'number') return v;
  if (!v) return 0;

  var s = String(v).trim();
  if (!s) return 0;

  s = s.replace(/R\$/g, '').replace(/\s/g, '');

  if (s.indexOf(',') >= 0) {
    s = s.replace(/\./g, '').replace(',', '.');
  }

  var n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

// [v3.45 NOVO] Contagem de atendimentos alinhada ao frontend (QTD, ignora cancelado/desconto).
function kpiQtdAtendimento_(svc, qtd, val) {
  var nome = String(svc || '');
  if (/^CANCELADO\b/i.test(nome) || /^Desconto$/i.test(nome)) return 0;
  if (!(parseFloat(val || 0) > 0)) return 0;
  var q = parseInt(qtd || 1, 10);
  return q > 0 ? q : 1;
}
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  doPost â€” fotos â†’ Drive â†’ CLIENTES (+ lanÃ§amentos automÃ¡ticos)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function doPost(e) {
  var postLock = null;
  try {
    var ss   = SpreadsheetApp.openById(SHEET_ID);
    postLock = obterLockEscrita_('doPost');
    var data = JSON.parse(e.postData.contents);
    var nome             = data.nome        || 'Cliente';
    var telefone         = data.telefone    || '';
    var qtd              = parseInt(data.qtd || 0);
    var fotos            = data.fotos       || [];
    var fotoRefs         = data.fotoRefs    || [];
    var servicos         = data.servicos    || [];
    var observacoes      = data.observacoes || [];
    var criarLancamentos = data.criarLancamentos === true;
    var total            = parseFloat(data.total || 0);
    var desconto         = parseFloat(data.desconto || 0);
    var totalRecebido    = total - desconto;
    var clientesSheet    = getOrCreateClientesSheet(ss);
    var lancamentosSheet = null;
    if (criarLancamentos && servicos.length > 0) {
      lancamentosSheet = getLancamentosSheet_(ss);
      if (!lancamentosSheet) throw new Error('Aba LANCAMENTOS nao encontrada. Cadastro nao gravado para evitar atendimento sem lancamento.');
    }
    var agora       = new Date();
    var dataStr     = Utilities.formatDate(agora, FUSO, 'dd/MM/yyyy');
    var horaStr     = Utilities.formatDate(agora, FUSO, 'HH:mm');
    var dataHoraStr = Utilities.formatDate(agora, FUSO, 'ddMMyyyy_HHmm');
    var folderIter    = DriveApp.getFoldersByName('ZapClin_Clientes');
    var parent        = folderIter.hasNext() ? folderIter.next() : DriveApp.createFolder('ZapClin_Clientes');
    var safeName      = nome.replace(/[^a-zA-Z0-9\u00C0-\u024F\s]/g,'').trim().replace(/\s+/g,'_');
    var clienteFolder = parent.createFolder(safeName + '_' + dataHoraStr);
    var totalFotos = Math.max(fotos.length, fotoRefs.length, qtd || 0);
    for (var i = 0; i < totalFotos; i++) {
      var b64 = fotos[i] || '';
      if (b64.indexOf(',') !== -1) b64 = b64.split(',')[1];
      if (b64) {
        var blob = Utilities.newBlob(Utilities.base64Decode(b64), 'image/jpeg', 'capacete_' + (i+1) + '.jpg');
        clienteFolder.createFile(blob);
        continue;
      }
      var ref = fotoRefs[i] || null;
      var refId = '';
      if (typeof ref === 'string') refId = ref;
      else if (ref && ref.id) refId = String(ref.id);
      if (refId) {
        try {
          var origem = DriveApp.getFileById(refId);
          origem.makeCopy('capacete_' + (i+1) + '_referencia_' + origem.getName(), clienteFolder);
        } catch(eCopy) {
          throw new Error('Nao foi possivel copiar a foto anterior do capacete ' + (i+1) + ': ' + eCopy.toString());
        }
      }
    }
    clienteFolder.addEditor('milena.nunes.lc@gmail.com');
    var folderUrl = clienteFolder.getUrl();
    var clientes = clientesSheet;
    var visitaInfo = calcularVisitaCliente_(clientes, telefone);
    var exist    = clientes.getRange('A10:A2000').getValues();
    var linha    = 10;
    for (var j = 0; j < exist.length; j++) {
      if (exist[j][0] !== '') { linha = 10 + j + 1; } else { break; }
    }
    clientes.getRange(linha, 1).setValue(linha - 9);
    clientes.getRange(linha, 2).setValue(dataStr);
    clientes.getRange(linha, 3).setValue(horaStr);
    clientes.getRange(linha, 4).setValue(nome);
    clientes.getRange(linha, 5).setValue(telefone);
    clientes.getRange(linha, 6).setValue(qtd);
    clientes.getRange(linha, 7).setValue(folderUrl);
    clientes.getRange(linha, 8).setValue(JSON.stringify(servicos));
    clientes.getRange(linha, 9).setValue(JSON.stringify(observacoes));
    clientes.getRange(linha, 10).setValue('Em andamento');
    clientes.getRange(linha, 11).setValue(totalRecebido);
    clientes.getRange(linha, 11).setNumberFormat('R$ #,##0.00');
    clientes.getRange(linha, 12).setValue('');
    clientes.getRange(linha, 13).setValue(desconto);
    clientes.getRange(linha, 13).setNumberFormat('R$ #,##0.00');
    if (criarLancamentos && servicos.length > 0) {
      var lanc = lancamentosSheet || getLancamentosSheet_(ss);
      if (!lanc) throw new Error('Aba LANCAMENTOS nao encontrada apos cadastro');
      for (var k = 0; k < servicos.length; k++) {
        var svc = servicos[k];
        if (!svc) continue;
        var preco  = precoServicoOs_(svc);
        var dadosL = lanc.getRange('C10:C2000').getValues();
        var linhaL = 10;
        for (var jj = 0; jj < dadosL.length; jj++) {
          if (dadosL[jj][0] !== '') { linhaL = 10 + jj + 1; } else { break; }
        }
        lanc.getRange(linhaL, 2).setValue(linhaL - 9);
        lanc.getRange(linhaL, 3).setValue(svc);
        lanc.getRange(linhaL, 4).setValue(dataStr);
        lanc.getRange(linhaL, 5).setValue(horaStr);
        lanc.getRange(linhaL, 6).setValue(1);
        lanc.getRange(linhaL, 7).setValue(preco);
        lanc.getRange(linhaL, 7).setNumberFormat('R$ #,##0.00');
        lanc.getRange(linhaL, 9).setValue(linha - 9);
      }
      if (desconto > 0) {
        var dadosDesc = lanc.getRange('C10:C2000').getValues();
        var linhaDesc = 10;
        for (var dd = 0; dd < dadosDesc.length; dd++) {
          if (dadosDesc[dd][0] !== '') { linhaDesc = 10 + dd + 1; } else { break; }
        }
        lanc.getRange(linhaDesc, 2).setValue(linhaDesc - 9);
        lanc.getRange(linhaDesc, 3).setValue('Desconto');
        lanc.getRange(linhaDesc, 4).setValue(dataStr);
        lanc.getRange(linhaDesc, 5).setValue(horaStr);
        lanc.getRange(linhaDesc, 6).setValue(1);
        lanc.getRange(linhaDesc, 7).setValue(-desconto);
        lanc.getRange(linhaDesc, 7).setNumberFormat('R$ #,##0.00');
        lanc.getRange(linhaDesc, 9).setValue(linha - 9);
      }
    }
    var beneficioVip = null;
    if (!(desconto > 0)) {
      beneficioVip = aplicarBeneficioVipNaLinha_(ss, clientes, linha, lancamentosSheet || getLancamentosSheet_(ss), criarLancamentos);
      if (beneficioVip && beneficioVip.aplicado) {
        desconto = beneficioVip.desconto;
        totalRecebido = beneficioVip.totalDepois;
      }
    }
    var okPayload = {
      ok: true, version: VERSION,
      clienteId: linha - 9, folderUrl: folderUrl,
      status: 'Em andamento', total: totalRecebido, desconto: desconto,
      beneficioVip: beneficioVip && beneficioVip.aplicado ? beneficioVip : null,
      numVisita: visitaInfo.numVisita,
      totalVisitas: visitaInfo.totalVisitas,
      clienteVipUrl: cadastroVipUrl_(nome, telefone),
      aceiteUrl: aceiteOsUrl_(linha - 9),
      lancamentosCriados: criarLancamentos ? servicos.filter(function(s){return s;}).length : 0
    };
    if (postLock) {
      try { postLock.releaseLock(); } catch(eLockOk) {}
      postLock = null;
    }
    return ContentService.createTextOutput(JSON.stringify(okPayload)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    if (postLock) {
      try { postLock.releaseLock(); } catch(eLockErr) {}
      postLock = null;
    }
    return ContentService.createTextOutput(JSON.stringify({
      ok: false, error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  ATUALIZAR KPIs
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function atualizarKPIs() {
  var ss   = SpreadsheetApp.openById(SHEET_ID);
  var LN   = getLancamentosSheet_(ss);
  var DASH = getDashboardSheet_(ss);
  if (!DASH) { Logger.log('Aba DASHBOARD nÃ£o encontrada'); return; }
  var hoje    = new Date();
  var mes     = hoje.getMonth() + 1;
  var ano     = hoje.getFullYear();
  var diaHoje = hoje.getDate();
  var fatTotal = 0, fatHoje = 0, fatMes = 0, atendMes = 0, atendHoje = 0;
  var fatPorDia = {}, atendPorDia = {};
  var ultima = LN.getLastRow();
  if (ultima >= 10) {
    var dados = LN.getRange(10, 3, ultima - 9, 5).getValues();
    for (var i = 0; i < dados.length; i++) {
      var row = dados[i];
      if (!row[0]) break;
      var d   = row[1];
      var val = parseFloat(row[4]) || 0;
      if (!d || !val) continue;
      var dp = parseDateParts_(d);
      if (!dp) continue;
      fatTotal += val;
      if (dp.mes === mes && dp.ano === ano) {
        fatMes += val; atendMes++;
        if (dp.dia === diaHoje) { fatHoje += val; atendHoje++; }
        fatPorDia[dp.dia]   = (fatPorDia[dp.dia]   || 0) + val;
        atendPorDia[dp.dia] = (atendPorDia[dp.dia] || 0) + 1;
      }
    }
  }
  var diasKeys = Object.keys(fatPorDia);
  var numDias  = diasKeys.length || 1;
  var ticket   = atendMes > 0 ? fatMes / atendMes : 0;
  var mediaDia = fatMes / numDias;
  var svcsDia  = atendMes / numDias;
  var melhorVal = 0, melhorLabel = '';
  for (var k = 0; k < diasKeys.length; k++) {
    var dk = diasKeys[k];
    if (fatPorDia[dk] > melhorVal) {
      melhorVal   = fatPorDia[dk];
      melhorLabel = pad2_(dk) + '/' + pad2_(mes) + '  Â·  ' + atendPorDia[dk] + ' svcs';
    }
  }
  if (!melhorLabel) melhorLabel = 'Sem dados';
  var MESES = ['','Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  var META_TICKET = 40; var META_SVCS = 12;
  var pctTicket = Math.min(Math.round(ticket / META_TICKET * 100), 100);
  var pctSvcs   = Math.min(Math.round(svcsDia / META_SVCS * 100), 100);
  var cards = [
    { label:'FATURAMENTO TOTAL', value:'R$ '+milhar_(fatTotal), sub1:'desde o inicio', sub2:'', cor:'#00e676', row:8 },
    { label:'HOJE', value:'R$ '+milhar_(fatHoje), sub1:Utilities.formatDate(hoje,FUSO,'dd/MM/yyyy'), sub2:'', cor:'#00e5ff', row:8 },
    { label:'MES ATUAL', value:'R$ '+milhar_(fatMes), sub1:MESES[mes]+'/'+ano, sub2:atendMes+' servicos no mes', cor:'#448aff', row:8 },
    { label:'TOTAL ATENDIMENTOS', value:String(atendMes), sub1:'servicos â€” mes atual', sub2:numDias+' dias com vendas', cor:'#ffea00', row:8 },
    { label:'TICKET MEDIO', value:'R$ '+ticket.toFixed(2).replace('.',','), sub1:'meta: R$ '+META_TICKET+',00', sub2:pctTicket+'% da meta', cor:'#ff9100', row:14 },
    { label:'MEDIA DIARIA', value:'R$ '+milhar_(mediaDia), sub1:numDias+' dias operados', sub2:'faturamento/dia', cor:'#ab47bc', row:14 },
    { label:'ATENDIMENTOS HOJE', value:String(atendHoje), sub1:Utilities.formatDate(hoje,FUSO,'dd/MM/yyyy'), sub2:atendHoje>=META_SVCS?'âœ“ meta atingida':(META_SVCS-atendHoje)+' para a meta', cor:'#26c6da', row:14 },
    { label:'MELHOR DIA DO MES', value:'R$ '+milhar_(melhorVal), sub1:melhorLabel, sub2:'', cor:'#ff5252', row:14 }
  ];
  var BG_DARK='#0a0a0f'; var BG_CARD='#16161f'; var MUTED='#6b6b8a';
  DASH.getRange(8,1,13,13).clearContent().clearFormat().setBackground(BG_DARK);
  var alturasBloco={0:4,1:20,2:38,3:18,4:16};
  for (var off in alturasBloco) {
    DASH.setRowHeight(8+parseInt(off),alturasBloco[off]);
    DASH.setRowHeight(14+parseInt(off),alturasBloco[off]);
  }
  DASH.setRowHeight(13,10); DASH.setRowHeight(20,8);
  for (var c=1;c<=12;c++) DASH.setColumnWidth(c,78);
  DASH.setColumnWidth(13,10);
  var cardCols=[1,4,7,10];
  for (var idx=0;idx<cards.length;idx++) {
    var card=cards[idx]; var col=cardCols[idx%4]; var R=card.row; var W=3;
    DASH.getRange(R,col,5,W).setBackground(BG_CARD);
    merge_(DASH.getRange(R,col,1,W)).setBackground(card.cor);
    merge_(DASH.getRange(R+1,col,1,W)).setBackground(BG_CARD).setValue(card.label).setFontColor(MUTED).setFontSize(8).setFontWeight('normal').setVerticalAlignment('bottom').setHorizontalAlignment('left');
    merge_(DASH.getRange(R+2,col,1,W)).setBackground(BG_CARD).setValue(card.value).setFontColor(card.cor).setFontSize(17).setFontWeight('bold').setVerticalAlignment('middle').setHorizontalAlignment('left');
    merge_(DASH.getRange(R+3,col,1,W)).setBackground(BG_CARD).setValue(card.sub1).setFontColor(MUTED).setFontSize(8).setFontWeight('normal').setVerticalAlignment('top').setHorizontalAlignment('left');
    merge_(DASH.getRange(R+4,col,1,W)).setBackground(BG_CARD).setValue(card.sub2||'').setFontColor(card.cor).setFontSize(8).setFontWeight(card.sub2?'bold':'normal').setVerticalAlignment('middle').setHorizontalAlignment('right');
  }
  DASH.getRange(13,1,1,13).setBackground(BG_DARK);
  SpreadsheetApp.flush();
  Logger.log('KPIs atualizados! [v'+VERSION+']');
}

function merge_(range) { try { range.merge(); } catch(e) {} return range; }
function pad2_(n) { return String(n).length===1?'0'+String(n):String(n); }
function milhar_(n) { var v=Math.round(parseFloat(n)||0); if(v>=1000) return (v/1000).toFixed(1).replace('.',',')+' k'; return String(v); }
function parseDateParts_(d) {
  if (!d) return null;
  if (d instanceof Date) return { dia:d.getDate(), mes:d.getMonth()+1, ano:d.getFullYear() };
  var s=String(d).trim(); var m=s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return { dia:parseInt(m[1]), mes:parseInt(m[2]), ano:parseInt(m[3]) };
  return null;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  FORMATAR ABA LANÃ‡AMENTOS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function formatarAbaLancamentos() {
  var ss=SpreadsheetApp.openById(SHEET_ID); var s=getLancamentosSheet_(ss);
  if (!s) { SpreadsheetApp.getUi().alert('Aba nÃ£o encontrada'); return; }
  s.getRange(1,1,10,s.getMaxColumns()).breakApart(); s.clearFormats();
  s.setColumnWidth(1,10);s.setColumnWidth(2,50);s.setColumnWidth(3,220);
  s.setColumnWidth(4,110);s.setColumnWidth(5,80);s.setColumnWidth(6,60);
  s.setColumnWidth(7,110);s.setColumnWidth(8,1);s.setColumnWidth(9,90);
  s.setRowHeight(3,45);
  s.getRange('A3:I3').merge().setValue('âš¡ ZapClin â€” LanÃ§amentos de ServiÃ§os').setBackground('#0d0d0d').setFontColor('#00e5ff').setFontSize(14).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  s.setRowHeight(6,38);
  s.getRange('A6:I6').merge().setValue('ðŸ“Š  HISTÃ“RICO DE LANÃ‡AMENTOS').setBackground('#006064').setFontColor('#ffffff').setFontSize(11).setFontWeight('bold').setVerticalAlignment('middle');
  s.setRowHeight(8,35);
  s.getRange('A8:G8').setBackground('#1a1a1a').setFontColor('#00e5ff').setFontSize(10).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  s.getRange('B8').setValue('#'); s.getRange('C8').setValue('SERVIÃ‡O').setHorizontalAlignment('left');
  s.getRange('D8').setValue('DATA'); s.getRange('E8').setValue('HORA'); s.getRange('F8').setValue('QTD'); s.getRange('G8').setValue('VALOR (R$)');
  s.getRange('H8').setBackground('#0a0a0a');
  s.getRange('I8').setValue('ðŸ”— CLIENTE').setBackground('#1a1a1a').setFontColor('#ab47bc').setFontSize(10).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  s.getRange('A9:I9').setBackground('#0d0d0d'); s.setRowHeight(9,6);
  s.getRange('A10:G600').setFontColor('#e0e0e0').setFontSize(10);
  s.getRange('H10:H600').setBackground('#0a0a0a').setFontColor('#0a0a0a');
  s.getRange('I10:I600').setFontColor('#ab47bc').setFontSize(10).setFontWeight('bold').setHorizontalAlignment('center');
  for (var i=10;i<=600;i++) { var bg=(i%2===0)?'#161616':'#111111'; s.getRange(i,1,1,7).setBackground(bg); s.getRange('I'+i).setBackground(bg); s.setRowHeight(i,30); }
  s.getRange('B10:B600').setHorizontalAlignment('center').setFontColor('#555577');
  s.getRange('C10:C600').setHorizontalAlignment('left').setFontColor('#e0e0e0');
  s.getRange('D10:D600').setHorizontalAlignment('center').setNumberFormat('dd/MM/yyyy');
  s.getRange('E10:E600').setHorizontalAlignment('center');
  s.getRange('F10:F600').setHorizontalAlignment('center').setFontColor('#aaaacc');
  s.getRange('G10:G600').setHorizontalAlignment('right').setFontColor('#00e5ff').setFontWeight('bold').setNumberFormat('R$ #,##0.00');
  s.setFrozenRows(8); SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('âœ… Aba LANÃ‡AMENTOS formatada! [v'+VERSION+']');
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  FORMATAR ABA CUSTOS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function formatarAbaCustos() {
  var ss=SpreadsheetApp.openById(SHEET_ID); var s=ss.getSheetByName(SHEET_CUSTOS);
  s.clearFormats();
  s.setColumnWidth(1,50);s.setColumnWidth(2,110);s.setColumnWidth(3,80);s.setColumnWidth(4,260);s.setColumnWidth(5,160);s.setColumnWidth(6,110);
  s.getRange('A3:F3').merge().setValue('âš¡ ZapClin â€” Controle de Custos').setBackground('#0d0d0d').setFontColor('#ff9100').setFontSize(14).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  s.setRowHeight(3,45);
  s.getRange('A6:F6').merge().setValue('ðŸ’¸  HISTÃ“RICO DE CUSTOS').setBackground('#e65100').setFontColor('#ffffff').setFontSize(11).setFontWeight('bold').setVerticalAlignment('middle');
  s.setRowHeight(6,38);
  s.getRange('A8:F8').setValues([['#','DATA','HORA','DESCRIÃ‡ÃƒO','CATEGORIA','VALOR (R$)']]).setBackground('#1a1a1a').setFontColor('#ff9100').setFontSize(10).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  s.setRowHeight(8,35);
  for (var i=10;i<=600;i++) { var bg=(i%2===0)?'#161616':'#111111'; s.getRange('A'+i+':F'+i).setBackground(bg).setFontColor('#e0e0e0').setFontSize(10); s.getRange('F'+i).setHorizontalAlignment('right').setFontColor('#ff9100').setNumberFormat('R$ #,##0.00'); s.setRowHeight(i,30); }
  s.setFrozenRows(8);
  SpreadsheetApp.getUi().alert('âœ… Aba CUSTOS formatada! [v'+VERSION+']');
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  FORMATAR ABA CLIENTES
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function formatarAbaClientes() {
  var ss=SpreadsheetApp.openById(SHEET_ID); var s=getOrCreateClientesSheet(ss);
  s.getRange(1,1,10,s.getMaxColumns()).breakApart(); s.clearFormats();
  s.setColumnWidth(1,50);s.setColumnWidth(2,110);s.setColumnWidth(3,80);s.setColumnWidth(4,180);s.setColumnWidth(5,130);s.setColumnWidth(6,70);
  s.setColumnWidth(7,200);s.setColumnWidth(8,250);s.setColumnWidth(9,200);s.setColumnWidth(10,130);s.setColumnWidth(11,110);s.setColumnWidth(12,120);s.setColumnWidth(13,100);
  s.setRowHeight(3,45);
  s.getRange('A3:P3').merge().setValue('âš¡ ZapClin â€” Cadastro de Clientes').setBackground('#0d0d0d').setFontColor('#00e5ff').setFontSize(14).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  s.setRowHeight(6,38);
  s.getRange('A6:P6').merge().setValue('ðŸ‘¥  HISTÃ“RICO DE CLIENTES').setBackground('#0d47a1').setFontColor('#ffffff').setFontSize(11).setFontWeight('bold').setVerticalAlignment('middle');
  s.setRowHeight(8,35);
  s.getRange('A8:P8').setValues([['#','DATA','HORA','NOME','TELEFONE','CAPS','PASTA DRIVE','SERVIÃ‡OS','OBSERVAÃ‡Ã•ES','STATUS','TOTAL','DATA PAG.','DESCONTO','ENCERRADO EM','TEMPO MIN','PRAZO MIN']]).setBackground('#1a1a1a').setFontColor('#00e5ff').setFontSize(10).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  s.getRange('A9:P9').setBackground('#0d0d0d'); s.setRowHeight(9,6);
  s.getRange('A10:P600').setFontColor('#e0e0e0').setFontSize(10);
  for (var i=10;i<=600;i++) { s.getRange(i,1,1,13).setBackground((i%2===0)?'#161616':'#111111'); s.setRowHeight(i,30); }
  s.getRange('A10:A600').setHorizontalAlignment('center').setFontColor('#666666');
  s.getRange('B10:C600').setHorizontalAlignment('center');
  s.getRange('F10:F600').setHorizontalAlignment('center').setFontColor('#00e5ff').setFontWeight('bold');
  s.getRange('J10:J600').setHorizontalAlignment('center').setFontWeight('bold');
  s.getRange('K10:K600').setHorizontalAlignment('right').setFontColor('#00e676').setFontWeight('bold').setNumberFormat('R$ #,##0.00');
  s.getRange('L10:L600').setHorizontalAlignment('center').setFontColor('#448aff').setNumberFormat('dd/MM/yyyy');
  s.getRange('M10:M600').setHorizontalAlignment('right').setFontColor('#ff9100').setNumberFormat('R$ #,##0.00');
  s.getRange('N10:N600').setHorizontalAlignment('center').setFontColor('#ab47bc');
  s.getRange('O10:P600').setHorizontalAlignment('center').setFontColor('#ffea00').setNumberFormat('0');
  s.setFrozenRows(8); SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('âœ… Aba CLIENTES formatada! [v'+VERSION+']');
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  EMAIL
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
var SHEET_EMAIL      = 'EMAIL';
var EMAIL_FINANCEIRO = 'financeiro@goldenshoppingcalhau.com.br';
var EMAIL_COPIA      = 'antonio.luis.vieira.nj@gmail.com';
var MESES_NOMES_     = ['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
var DIAS_SEMANA_     = ['Domingo','Segunda-feira','Terca-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sabado'];
var PRECOS_SERVICOS_REL_ = {
  'Higieniza\u00e7\u00e3o R\u00e1pida':15,
  'Higieniza\u00e7\u00e3o Essencial':18,
  'Higieniza\u00e7\u00e3o Profunda':23,
  'Limpeza + Higieniza\u00e7\u00e3o':30,
  'Higieniza\u00e7\u00e3o + Lavagem':45,
  'Revitaliza\u00e7\u00e3o Premium':70,
  'Limpeza + Hig. R\u00e1pida':18,
  'Limpeza + Hig. Essencial':21,
  'Limpeza + Hig. Profunda':30,
  'Revitaliza\u00e7\u00e3o':70
};
var BASES_OFICIAIS_GOLDEN_ = {
  '04/2026': { receita: 9199, atend: 277, fonte: 'PDF oficial Golden Abril/2026' }
};

function fmtBRL2_(v) {
  var n=parseFloat(v)||0; var parts=n.toFixed(2).split('.');
  parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.'); return 'R$ '+parts.join(',');
}

function _obterOuCriarPasta_(nome,pai) {
  var iter=pai?pai.getFoldersByName(nome):DriveApp.getFoldersByName(nome);
  if (iter.hasNext()) return iter.next();
  return pai?pai.createFolder(nome):DriveApp.createFolder(nome);
}

function _qtdRelatorio_(svc,qtd) {
  return /^CANCELADO\b/i.test(String(svc||'')) || /^Desconto$/i.test(String(svc||'')) ? 0 : (parseInt(qtd || 1, 10) > 0 ? parseInt(qtd || 1, 10) : 1);
}

function _lancamentoConsolidadoRel_(svc,qtd,val) {
  var nome = String(svc || '');
  var q = _qtdRelatorio_(nome, qtd);
  var v = parseFloat(val || 0) || 0;
  if (/^Faturamento oficial Golden/i.test(nome) || /consolid/i.test(nome)) return true;
  if (!PRECOS_SERVICOS_REL_[nome] || q <= 1) return false;
  return Math.abs((v / q) - PRECOS_SERVICOS_REL_[nome]) > 0.75;
}

function _resumoMesRel_(mesRef,anoRef) {
  var ss=SpreadsheetApp.openById(SHEET_ID); var LN=getLancamentosSheet_(ss);
  var ultima=LN.getLastRow(); var totalReceita=0,totalServicos=0;
  if (ultima>=10) {
    var dados=LN.getRange(10,3,ultima-9,5).getValues();
    for (var i=0;i<dados.length;i++) {
      var row=dados[i]; if (!row[0]) break;
      var svc=String(row[0]); var d=row[1]; var qtd=row[3]; var val=parseFloat(row[4])||0;
      var dp=parseDateParts_(d); if (!dp||dp.mes!==mesRef||dp.ano!==anoRef) continue;
      totalReceita+=val; totalServicos+=_qtdRelatorio_(svc,qtd);
    }
  }
  return {receita:totalReceita, atend:totalServicos, fonte:'Planilha'};
}

function _baseComparativaRel_(mesRef,anoRef,apurado) {
  var key=pad2_(mesRef)+'/'+anoRef;
  var oficial=BASES_OFICIAIS_GOLDEN_[key];
  if (!oficial) return apurado;
  var rec=parseFloat(apurado.receita||0)||0;
  var at=parseFloat(apurado.atend||0)||0;
  return (rec<oficial.receita*0.98 || at<oficial.atend*0.98) ? oficial : apurado;
}

function _carregarDadosMes_(mesRef,anoRef) {
  var ss=SpreadsheetApp.openById(SHEET_ID); var LN=getLancamentosSheet_(ss);
  var ultima=LN.getLastRow(); var porDia={},porSvc={},totalReceita=0,totalServicos=0,linhasConsolidadas=0;
  if (ultima>=10) {
    var dados=LN.getRange(10,3,ultima-9,5).getValues();
    for (var i=0;i<dados.length;i++) {
      var row=dados[i]; if (!row[0]) break;
      var d=row[1];var qtd=parseInt(row[3]||1,10);var val=parseFloat(row[4])||0;var svc=String(row[0]);
      if (!d||!val||!svc) continue;
      var dp=parseDateParts_(d); if (!dp||dp.mes!==mesRef||dp.ano!==anoRef) continue;
      var qtdRel=_qtdRelatorio_(svc,qtd);
      var consolidado=_lancamentoConsolidadoRel_(svc,qtdRel,val);
      var svcRel=consolidado?'Base historica consolidada':svc;
      if (consolidado) linhasConsolidadas++;
      totalReceita+=val;totalServicos+=qtdRel;
      if (!porDia[dp.dia]) porDia[dp.dia]={qtd:0,val:0};
      porDia[dp.dia].qtd+=qtdRel;porDia[dp.dia].val+=val;
      if (!porSvc[svcRel]) porSvc[svcRel]={qtd:0,val:0,consolidado:consolidado};
      porSvc[svcRel].qtd+=qtdRel;porSvc[svcRel].val+=val;
      porSvc[svcRel].consolidado=porSvc[svcRel].consolidado||consolidado;
    }
  }
  var prevMes=mesRef-1,prevAno=anoRef;
  if (prevMes===0) { prevMes=12; prevAno--; }
  var prev=_baseComparativaRel_(prevMes,prevAno,_resumoMesRel_(prevMes,prevAno));
  var evolReceita=prev.receita>0?(totalReceita-prev.receita)/prev.receita*100:null;
  var evolAtend=prev.atend>0?(totalServicos-prev.atend)/prev.atend*100:null;
  return {porDia:porDia,porSvc:porSvc,totalReceita:totalReceita,totalServicos:totalServicos,
    diasOperados:Object.keys(porDia).length,ticketMedio:totalServicos>0?totalReceita/totalServicos:0,
    prevReceita:prev.receita,prevAtend:prev.atend,prevFonte:prev.fonte,evolReceita:evolReceita,evolAtend:evolAtend,
    baseConsolidada:linhasConsolidadas>0,linhasConsolidadas:linhasConsolidadas};
}

function _htmlDiaria_(porDia,mesRef,anoRef) {
  var diasOrd=Object.keys(porDia).map(Number).sort(function(a,b){return a-b;});
  var acum=0,html='';
  for (var k=0;k<diasOrd.length;k++) {
    var dia=diasOrd[k];var dd=porDia[dia];var nomeDia=DIAS_SEMANA_[new Date(anoRef,mesRef-1,dia).getDay()];
    acum+=dd.val; var bg=k%2===0?'#f7f9fc':'#ffffff';
    html+='<tr style="background:'+bg+'">'
      +'<td style="padding:8px 12px;border-bottom:1px solid #e8ecf0">'+pad2_(dia)+'/'+pad2_(mesRef)+'/'+anoRef+'</td>'
      +'<td style="padding:8px 12px;border-bottom:1px solid #e8ecf0;color:#666">'+nomeDia+'</td>'
      +'<td style="padding:8px 12px;border-bottom:1px solid #e8ecf0;text-align:center;font-weight:600">'+dd.qtd+'</td>'
      +'<td style="padding:8px 12px;border-bottom:1px solid #e8ecf0;text-align:right;font-weight:600;color:#0C447C;white-space:nowrap">'+fmtBRL2_(dd.val)+'</td>'
      +'<td style="padding:8px 12px;border-bottom:1px solid #e8ecf0;text-align:right;color:#999;white-space:nowrap">'+fmtBRL2_(acum)+'</td>'
      +'</tr>';
  }
  return html;
}

function _htmlSvcs_(porSvc,totalReceita) {
  var svcsOrd=Object.keys(porSvc).sort(function(a,b){return porSvc[b].val-porSvc[a].val;});
  var html='';
  for (var s2=0;s2<svcsOrd.length;s2++) {
    var nm=svcsOrd[s2];var sd=porSvc[nm];
    var pctS=totalReceita>0?(sd.val/totalReceita*100).toFixed(1):'0';
    var unit=sd.consolidado?sd.val/sd.qtd:(PRECOS_SERVICOS_REL_[nm]||Math.round(sd.val/sd.qtd)); var bg2=s2%2===0?'#f7f9fc':'#ffffff';
    html+='<tr style="background:'+bg2+'">'
      +'<td style="padding:8px 12px;border-bottom:1px solid #e8ecf0">'+nm+'</td>'
      +'<td style="padding:8px 12px;border-bottom:1px solid #e8ecf0;text-align:center">'+sd.qtd+'</td>'
      +'<td style="padding:8px 12px;border-bottom:1px solid #e8ecf0;text-align:right;color:#666">'+fmtBRL2_(unit)+'</td>'
      +'<td style="padding:8px 12px;border-bottom:1px solid #e8ecf0;text-align:right;font-weight:600;color:#0C447C;white-space:nowrap">'+fmtBRL2_(sd.val)+'</td>'
      +'<td style="padding:8px 12px;border-bottom:1px solid #e8ecf0;text-align:right;color:#888;white-space:nowrap;min-width:55px">'+pctS+'%</td>'
      +'</tr>';
  }
  return html;
}

function _evolTxtRel_(v) {
  return v===null || v===undefined ? 'sem base anterior' : ((v>=0?'+':'') + v.toFixed(1).replace('.',',') + '%');
}

function _mesRefOficialRel_(d) {
  return d && (d.prevReceita === 0 || d.prevReceita === null || d.prevReceita === undefined) && (d.prevAtend === 0 || d.prevAtend === null || d.prevAtend === undefined);
}

function gerarHtmlRelatorioGoldenV2_(mesNome, anoRef, mesVencNome, anoVenc, vencimento,
    dataEnvio, horaEnvio, d, aluguel, pct) {
  var diaria=_htmlDiaria_(d.porDia,MESES_NOMES_.indexOf(mesNome)+1,anoRef);
  var svcs=_htmlSvcs_(d.porSvc,d.totalReceita);
  var evolClasse=d.evolReceita!==null && d.evolReceita>=0?'#087f5b':'#b42318';
  var mesReferencia=_mesRefOficialRel_(d);
  var evolReceitaTxt=mesReferencia?'Mes de referencia':_evolTxtRel_(d.evolReceita);
  var evolAtendTxt=mesReferencia?'Mes de referencia':_evolTxtRel_(d.evolAtend);
  var prevReceitaTxt=mesReferencia?'Base inicial oficial':fmtBRL2_(d.prevReceita);
  var prevAtendTxt=mesReferencia?'Base inicial oficial':(d.prevAtend+' atend. · '+d.prevFonte);
  var leitura=mesReferencia
    ? 'Abril/2026 passa a ser a base oficial de referencia para acompanhar a evolucao da operacao nos proximos meses.'
    : (d.evolReceita===null
    ? 'A leitura de evolucao sera exibida quando houver mes anterior consolidado para comparacao.'
    : (d.evolReceita>=0
      ? 'A operacao demonstra crescimento frente ao mes anterior, gerando receita proporcional ao shopping e fortalecendo o fluxo de servicos recorrentes no ponto.'
      : 'A comparacao mensal indica queda pontual; o relatorio mantem rastreabilidade para orientar acoes comerciais e recuperar fluxo.'));
  var gov=d.baseConsolidada
    ? '<div class="governance"><strong>Governanca da base:</strong> este periodo foi conciliado a partir do PDF oficial ja enviado ao Golden. Os totais de faturamento, atendimentos e aluguel sao preservados; linhas sem abertura segura de preco unitario ficam agrupadas como base historica consolidada.</div>'
    : '';
  var compTitulo=d.baseConsolidada?'Composicao auditavel do faturamento':'Composicao do faturamento por servico';
  var evolucaoHtml=mesReferencia
    ? '<div class="sec">Base de referencia historica</div><div class="reference-box"><strong>Abril/2026 consolidado como base oficial.</strong><br>Este relatorio preserva exatamente os totais ja enviados ao Golden e passa a ser o ponto de partida para medir evolucao de receita, atendimentos e aluguel nos proximos meses.</div>'+gov
    : '<div class="sec">Evolucao do negocio</div><div class="evolution"><div class="evo-cell"><div class="evo-label">Receita vs mes anterior</div><div class="evo-val" style="color:'+evolClasse+'">'+evolReceitaTxt+'</div><div class="evo-sub">'+prevReceitaTxt+'</div></div><div class="evo-cell"><div class="evo-label">Atendimentos vs mes anterior</div><div class="evo-val" style="color:#0c447c">'+evolAtendTxt+'</div><div class="evo-sub">'+prevAtendTxt+'</div></div><div class="evo-note">'+leitura+'</div></div><div class="business"><strong>Leitura para o Golden:</strong> '+leitura+'</div>'+gov;
  var estilos='<style>@page{size:A4 portrait;margin:0}body{margin:0;background:#fff;color:#1a1a2e;font-family:Arial,Helvetica,sans-serif}.page{width:794px;min-height:1123px;margin:0 auto;padding:28px 30px;box-sizing:border-box}.header{background:#0c447c;border-bottom:4px solid #378add;padding:18px 20px 16px;display:table;width:100%;box-sizing:border-box;color:#b5d4f4}.hleft{display:table-cell;vertical-align:bottom}.hright{display:table-cell;text-align:right;vertical-align:bottom;font-size:13px;line-height:1.45}.brand{font-size:13px;font-weight:bold;color:#85b7eb;letter-spacing:.04em;margin-bottom:7px}.title{font-size:25px;font-weight:bold;color:#fff;line-height:1.1;margin-bottom:7px}.meta{font-size:13px;line-height:1.45}.sec{font-size:16px;font-weight:bold;color:#0c447c;margin:16px 0 7px;text-transform:uppercase}.summary{background:#e6f1fb;border-top:1px solid #b5d4f4;border-bottom:4px solid #378add;display:table;width:100%;box-sizing:border-box}.kpi{display:table-cell;padding:10px 12px;min-height:76px;vertical-align:middle}.kpi.center{text-align:center}.kpi.due{border-left:4px solid #378add}.kpi-label{font-size:12px;color:#185fa5;margin-bottom:6px}.kpi-val{font-size:16px;font-weight:bold;color:#042c53;line-height:1.08}.kpi.due .kpi-val{font-size:17px;color:#0c447c}.kpi-sub{font-size:11px;color:#185fa5;margin-top:5px}.evolution{display:table;width:100%;background:#f7fbff;border:1px solid #b5d4f4;border-bottom:3px solid #378add;box-sizing:border-box}.evo-cell{display:table-cell;padding:10px 12px;border-right:1px solid #cfe0f2;vertical-align:middle}.evo-note{display:table-cell;padding:10px 12px;font-size:12px;line-height:1.35;color:#22324a;vertical-align:middle}.evo-label{font-size:11px;color:#185fa5;font-weight:bold;text-transform:uppercase;letter-spacing:.03em;margin-bottom:5px}.evo-val{font-size:16px;font-weight:bold;line-height:1.1;color:#0c447c}.evo-sub{font-size:11px;color:#52627a;margin-top:6px}.business{margin-top:8px;background:#f7fbff;border:1px solid #b5d4f4;border-left:4px solid #378add;color:#22324a;padding:10px 12px;font-size:12px;line-height:1.35}.governance{margin-top:10px;background:#fff8e6;border:1px solid #f3c466;border-left:4px solid #d99000;color:#392b10;padding:9px 11px;font-size:11px;line-height:1.35}.reference-box{background:#f7fbff;border:1px solid #b5d4f4;border-left:4px solid #378add;color:#22324a;padding:12px 14px;font-size:12px;line-height:1.4;page-break-inside:avoid}table{width:100%;border-collapse:collapse;font-size:13px;page-break-inside:auto}tr{page-break-inside:avoid;page-break-after:auto}thead{display:table-header-group}th{background:#0c447c;color:#e6f1fb;text-align:left;padding:9px 10px;font-weight:bold;border:1px solid #0b3b6e}td{padding:8px 10px;border:1px solid #cfe0f2;color:#1a1a2e}.right{text-align:right}.center{text-align:center}.total td{background:#e6f1fb;font-weight:bold;color:#042c53}.rent{background:#e6f1fb;border:2px solid #378add;page-break-inside:avoid}.avoid-break{page-break-inside:avoid}.footer{background:#f7f9fc;border-top:1px solid #dde3ee;margin-top:12px;padding:12px 14px;display:table;width:100%;box-sizing:border-box;color:#555;font-size:11px;line-height:1.45;page-break-inside:avoid}.foot-left{display:table-cell}.foot-right{display:table-cell;text-align:right;color:#777}</style>';
  return '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">'+estilos+'</head><body><article class="page">'+
    '<div class="header"><div class="hleft"><div class="brand">ZAPCLIN HIGIENIZACAO DE CAPACETES</div><div class="title">Relatorio de Faturamento Mensal</div><div class="meta">'+mesNome+' de '+anoRef+' &nbsp; · &nbsp; Golden Shopping Calhau &nbsp; · &nbsp; Sao Luis, MA<br>Emitido em: '+dataEnvio+' as '+horaEnvio+'</div></div><div class="hright">Ref. contrato de locacao<br>Golden Shopping Calhau</div></div>'+
    '<div class="sec">Resumo financeiro do mes</div><div class="summary"><div class="kpi"><div class="kpi-label">Faturamento bruto</div><div class="kpi-val">'+fmtBRL2_(d.totalReceita)+'</div></div><div class="kpi center"><div class="kpi-label">Dias operados</div><div class="kpi-val">'+d.diasOperados+' dias</div></div><div class="kpi center"><div class="kpi-label">Total de atendimentos</div><div class="kpi-val">'+d.totalServicos+'</div></div><div class="kpi due"><div class="kpi-label">Aluguel devido ('+pct+'%)</div><div class="kpi-val">'+fmtBRL2_(aluguel)+'</div><div class="kpi-sub">vence '+vencimento+'</div></div></div>'+
    evolucaoHtml+
    '<div class="sec">Movimentacao diaria — '+mesNome.toUpperCase()+' '+anoRef+'</div><table><thead><tr><th>Data</th><th>Dia da semana</th><th class="center">Atend.</th><th class="right">Faturamento</th><th class="right">Acumulado</th></tr></thead><tbody>'+diaria+'<tr class="total"><td colspan="2">Total do mes</td><td class="center">'+d.totalServicos+'</td><td class="right">'+fmtBRL2_(d.totalReceita)+'</td><td></td></tr></tbody></table>'+
    '<div class="avoid-break"><div class="sec">'+compTitulo+'</div><table><thead><tr><th>Servico</th><th class="center">Qtd.</th><th class="right">Unit.</th><th class="right">Total</th><th class="right">%</th></tr></thead><tbody>'+svcs+'<tr class="total"><td>Total</td><td class="center">'+d.totalServicos+'</td><td></td><td class="right">'+fmtBRL2_(d.totalReceita)+'</td><td class="right">'+(d.totalReceita>0?'100%':'0%')+'</td></tr></tbody></table></div>'+
    '<div class="avoid-break"><div class="sec">Demonstrativo de aluguel — '+mesVencNome.toUpperCase()+'/'+anoVenc+'</div><table class="rent"><tbody><tr><td>Base de calculo</td><td>Faturamento bruto '+mesNome+'/'+anoRef+'</td><td class="right">'+fmtBRL2_(d.totalReceita)+'</td></tr><tr><td>Percentual contratual</td><td>Aluguel proporcional</td><td class="right">'+pct+'%</td></tr><tr class="total"><td>Valor do aluguel</td><td>'+fmtBRL2_(d.totalReceita)+' x '+pct+'%</td><td class="right">'+fmtBRL2_(aluguel)+'</td></tr><tr><td>Data de vencimento</td><td></td><td class="right">'+vencimento+'</td></tr></tbody></table></div>'+
    '<div class="footer"><div class="foot-left"><strong>Antonio Luis Vieira</strong><br>ZapClin Higienizacao de Capacetes<br>Golden Shopping Calhau · Sao Luis, MA<br><span style="color:#378add">antonio.luis.vieira.nj@gmail.com</span></div><div class="foot-right">Relatorio gerado automaticamente pelo<br><strong>Sistema ZapClin v'+VERSION+'</strong><br>Enviado em '+dataEnvio+' as '+horaEnvio+'</div></div>'+
    '</article></body></html>';
}


// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  GERAR E SALVAR PDF NO DRIVE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function gerarESalvarPDF_(mesRef, mesNome, anoRef, agora, d, aluguel, pct, diaVenc) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var mesVenc    = agora.getMonth() + 1;
  var anoVenc    = agora.getFullYear();
  var vencimento = pad2_(diaVenc) + '/' + pad2_(mesVenc) + '/' + anoVenc;
  var mesVencNome = MESES_NOMES_[mesVenc - 1];
  var dataEnvio  = Utilities.formatDate(agora, FUSO, 'dd/MM/yyyy');
  var horaEnvio  = Utilities.formatDate(agora, FUSO, 'HH:mm');
  var htmlV2 = gerarHtmlRelatorioGoldenV2_(mesNome, anoRef, mesVencNome, anoVenc, vencimento, dataEnvio, horaEnvio, d, aluguel, pct);
  var nomePDFV2 = 'ZapClin_Relatorio_' + mesNome + '_' + anoRef + '.pdf';
  var pdfBlobV2 = Utilities.newBlob(htmlV2, 'text/html', nomePDFV2.replace('.pdf', '.html')).getAs(MimeType.PDF).setName(nomePDFV2);
  var raizV2 = _obterOuCriarPasta_('ZapClin_Relatorios', null);
  var pastaV2 = _obterOuCriarPasta_(String(anoRef), raizV2);
  var itV2 = pastaV2.getFilesByName(nomePDFV2);
  while (itV2.hasNext()) itV2.next().setTrashed(true);
  var pdfFileV2 = pastaV2.createFile(pdfBlobV2);
  registrarLogSistema_('PDF', 'gerarESalvarPDF_', 'OK', 'PDF Golden v2 gerado e salvo no Drive', { nome: nomePDFV2, url: pdfFileV2.getUrl(), mes: mesNome, ano: anoRef, versao: VERSION });
  return pdfFileV2;
  var PRECOS_UNIT = {
    'Higieniza\u00e7\u00e3o R\u00e1pida':15,'Higieniza\u00e7\u00e3o Essencial':18,
    'Higieniza\u00e7\u00e3o Profunda':23,'Limpeza + Higieniza\u00e7\u00e3o':30,
    'Higieniza\u00e7\u00e3o + Lavagem':45,'Revitaliza\u00e7\u00e3o Premium':70,
    'Limpeza + Hig. R\u00e1pida':18,'Limpeza + Hig. Essencial':21,
    'Limpeza + Hig. Profunda':30,'Revitaliza\u00e7\u00e3o':70
  };
  var tempName = 'PDF_RELATORIO_TEMP';
  var oldTemp  = ss.getSheetByName(tempName);
  if (oldTemp) ss.deleteSheet(oldTemp);
  var sh = ss.insertSheet(tempName);
  sh.setColumnWidth(1, 8);  sh.setColumnWidth(2, 165); sh.setColumnWidth(3, 90);
  sh.setColumnWidth(4, 80); sh.setColumnWidth(5, 105); sh.setColumnWidth(6, 105);
  sh.setColumnWidth(7, 60); sh.setColumnWidth(8, 8);
  function c_(r, c1, c2, val, bg, fg, sz, bold, align, fmt) {
    var rng = sh.getRange(r, c1, 1, c2 - c1 + 1);
    if (c2 > c1) { try { rng.merge(); } catch(e) {} }
    rng.setBackground(bg || '#FFFFFF').setFontColor(fg || '#1a1a2e').setFontSize(sz || 9)
      .setFontWeight(bold ? 'bold' : 'normal').setHorizontalAlignment(align || 'left')
      .setVerticalAlignment('middle').setFontFamily('Arial');
    if (val !== null && val !== undefined) rng.setValue(val);
    if (fmt) rng.setNumberFormat(fmt);
    return rng;
  }
  var curRow = 1;
  function nr(h) { sh.setRowHeight(curRow, h || 22); var r = curRow; curRow++; return r; }
  c_(curRow,1,8,'','#0C447C'); nr(8);
  c_(curRow,2,7,'ZAPCLIN HIGIENIZA\u00c7\u00c3O DE CAPACETES','#0C447C','#85B7EB',9,true,'left');
  c_(curRow,1,1,'','#0C447C'); c_(curRow,8,8,'','#0C447C'); nr(20);
  c_(curRow,2,7,'Relat\u00f3rio de Faturamento Mensal','#0C447C','#E6F1FB',17,true,'left');
  c_(curRow,1,1,'','#0C447C'); c_(curRow,8,8,'','#0C447C'); nr(30);
  c_(curRow,2,7,mesNome+' de '+anoRef+'   \u00b7   Golden Shopping Calhau   \u00b7   S\u00e3o Lu\u00eds, MA','#0C447C','#85B7EB',10,false,'left');
  c_(curRow,1,1,'','#0C447C'); c_(curRow,8,8,'','#0C447C'); nr(18);
  c_(curRow,2,4,'Emitido em: '+dataEnvio+' \u00e0s '+horaEnvio,'#0C447C','#B5D4F4',9,false,'left');
  c_(curRow,5,7,'Ref. contrato de loca\u00e7\u00e3o  \u00b7  Golden Shopping Calhau','#0C447C','#B5D4F4',9,false,'right');
  c_(curRow,1,1,'','#0C447C'); c_(curRow,8,8,'','#0C447C'); nr(18);
  c_(curRow,1,8,'','#0C447C'); nr(10);
  c_(curRow,1,8,'','#378ADD'); nr(4);
  c_(curRow,1,8,'','#FFFFFF'); nr(8);
  c_(curRow,2,7,'RESUMO FINANCEIRO DO M\u00caS','#E6F1FB','#185FA5',9,true,'left');
  c_(curRow,1,1,'','#E6F1FB'); c_(curRow,8,8,'','#E6F1FB');
  sh.getRange(curRow,1,1,8).setBorder(null,null,true,null,false,false,'#B5D4F4',SpreadsheetApp.BorderStyle.SOLID); nr(20);
  c_(curRow,2,2,'Faturamento bruto','#E6F1FB','#185FA5',8,false); c_(curRow,3,3,'Dias operados','#E6F1FB','#185FA5',8,false);
  c_(curRow,4,5,'Total de atendimentos','#E6F1FB','#185FA5',8,false); c_(curRow,6,7,'Aluguel devido ('+pct+'%)','#E6F1FB','#185FA5',8,true,'left');
  c_(curRow,1,1,'','#E6F1FB'); c_(curRow,8,8,'','#E6F1FB'); nr(14);
  c_(curRow,2,2,d.totalReceita,'#E6F1FB','#042C53',15,true,'left','R$ #,##0.00');
  c_(curRow,3,3,d.diasOperados+' dias','#E6F1FB','#042C53',13,true,'left');
  c_(curRow,4,5,d.totalServicos,'#E6F1FB','#042C53',13,true,'center');
  c_(curRow,6,7,aluguel,'#E6F1FB','#0C447C',18,true,'left','R$ #,##0.00');
  sh.getRange(curRow,6).setBorder(null,true,null,null,false,false,'#378ADD',SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  c_(curRow,1,1,'','#E6F1FB'); c_(curRow,8,8,'','#E6F1FB'); nr(28);
  c_(curRow,6,7,'vence '+vencimento,'#E6F1FB','#185FA5',8,false,'left');
  c_(curRow,1,1,'','#E6F1FB'); c_(curRow,2,5,'','#E6F1FB'); c_(curRow,8,8,'','#E6F1FB'); nr(14);
  c_(curRow,1,8,'','#378ADD'); nr(4);
  c_(curRow,1,8,'','#FFFFFF'); nr(10);
  c_(curRow,2,7,'MOVIMENTA\u00c7\u00c3O DI\u00c1RIA \u2014 '+mesNome.toUpperCase()+' '+anoRef,'#FFFFFF','#333333',9,true);
  c_(curRow,1,1,'','#FFFFFF'); c_(curRow,8,8,'','#FFFFFF'); nr(16);
  c_(curRow,2,2,'Data','#0C447C','#E6F1FB',9,true,'center'); c_(curRow,3,3,'Dia da semana','#0C447C','#E6F1FB',9,true,'left');
  c_(curRow,4,4,'Atend.','#0C447C','#E6F1FB',9,true,'center'); c_(curRow,5,5,'Faturamento','#0C447C','#E6F1FB',9,true,'right');
  c_(curRow,6,6,'Acumulado','#0C447C','#E6F1FB',9,true,'right'); c_(curRow,7,7,'','#0C447C','#E6F1FB',9,true,'right');
  c_(curRow,1,1,'','#0C447C'); c_(curRow,8,8,'','#0C447C'); nr(24);
  var diasOrd = Object.keys(d.porDia).map(Number).sort(function(a,b){return a-b;});
  var acum = 0;
  for (var ki = 0; ki < diasOrd.length; ki++) {
    var dia = diasOrd[ki]; var dd2 = d.porDia[dia]; acum += dd2.val;
    var bgD = ki % 2 === 0 ? '#F7F9FC' : '#FFFFFF';
    c_(curRow,2,2,pad2_(dia)+'/'+pad2_(mesRef)+'/'+anoRef,bgD,'#1a1a2e',9,false,'center');
    c_(curRow,3,3,DIAS_SEMANA_[new Date(anoRef,mesRef-1,dia).getDay()],bgD,'#666666',9,false,'left');
    c_(curRow,4,4,dd2.qtd,bgD,'#1a1a2e',9,true,'center'); c_(curRow,5,5,dd2.val,bgD,'#0C447C',9,true,'right','R$ #,##0.00');
    c_(curRow,6,6,acum,bgD,'#888888',9,false,'right','R$ #,##0.00'); c_(curRow,7,7,'',bgD,'#888888',9,false,'right');
    c_(curRow,1,1,'',bgD); c_(curRow,8,8,'',bgD); nr(22);
  }
  c_(curRow,2,3,'Total do m\u00eas','#E6F1FB','#042C53',9,true,'left'); c_(curRow,4,4,d.totalServicos,'#E6F1FB','#042C53',9,true,'center');
  c_(curRow,5,5,d.totalReceita,'#E6F1FB','#0C447C',11,true,'right','R$ #,##0.00'); c_(curRow,6,7,'','#E6F1FB','#042C53',9,true,'right');
  c_(curRow,1,1,'','#E6F1FB'); c_(curRow,8,8,'','#E6F1FB'); nr(24);
  c_(curRow,1,8,'','#FFFFFF'); nr(10);
  c_(curRow,2,7,'COMPOSI\u00c7\u00c3O DO FATURAMENTO POR SERVI\u00c7O','#FFFFFF','#333333',9,true);
  c_(curRow,1,1,'','#FFFFFF'); c_(curRow,8,8,'','#FFFFFF'); nr(16);
  c_(curRow,2,2,'Servi\u00e7o','#0C447C','#E6F1FB',9,true,'left'); c_(curRow,3,3,'Qtd.','#0C447C','#E6F1FB',9,true,'center');
  c_(curRow,4,4,'Unit.','#0C447C','#E6F1FB',9,true,'right'); c_(curRow,5,5,'Total','#0C447C','#E6F1FB',9,true,'right');
  c_(curRow,6,6,'%','#0C447C','#E6F1FB',9,true,'center'); c_(curRow,7,7,'','#0C447C','#E6F1FB',9,true,'right');
  c_(curRow,1,1,'','#0C447C'); c_(curRow,8,8,'','#0C447C'); nr(24);
  var svcsOrd2 = Object.keys(d.porSvc).sort(function(a,b){return d.porSvc[b].val-d.porSvc[a].val;});
  for (var si = 0; si < svcsOrd2.length; si++) {
    var nm = svcsOrd2[si]; var sd = d.porSvc[nm];
    var pctS = d.totalReceita > 0 ? (sd.val/d.totalReceita*100).toFixed(1)+'%' : '0%';
    var unit = PRECOS_UNIT[nm] || Math.round(sd.val/sd.qtd);
    var bgS = si % 2 === 0 ? '#F7F9FC' : '#FFFFFF';
    c_(curRow,2,2,nm,bgS,'#1a1a2e',9,false,'left'); c_(curRow,3,3,sd.qtd,bgS,'#1a1a2e',9,false,'center');
    c_(curRow,4,4,unit,bgS,'#666666',9,false,'right','R$ #,##0.00'); c_(curRow,5,5,sd.val,bgS,'#0C447C',9,true,'right','R$ #,##0.00');
    c_(curRow,6,6,pctS,bgS,'#888888',9,false,'center'); c_(curRow,7,7,'',bgS,'#888888',9,false);
    c_(curRow,1,1,'',bgS); c_(curRow,8,8,'',bgS); nr(22);
  }
  c_(curRow,2,2,'Total','#E6F1FB','#042C53',9,true,'left'); c_(curRow,3,3,d.totalServicos,'#E6F1FB','#042C53',9,true,'center');
  c_(curRow,4,4,'','#E6F1FB','#042C53',9,true,'right'); c_(curRow,5,5,d.totalReceita,'#E6F1FB','#0C447C',11,true,'right','R$ #,##0.00');
  c_(curRow,6,6,'100%','#E6F1FB','#042C53',9,true,'center'); c_(curRow,7,7,'','#E6F1FB','#042C53',9,true);
  c_(curRow,1,1,'','#E6F1FB'); c_(curRow,8,8,'','#E6F1FB'); nr(24);
  c_(curRow,1,8,'','#FFFFFF'); nr(10);
  c_(curRow,2,7,'DEMONSTRATIVO DE ALUGUEL \u2014 '+mesVencNome.toUpperCase()+'/'+anoVenc,'#0C447C','#E6F1FB',9,true,'left');
  c_(curRow,1,1,'','#0C447C'); c_(curRow,8,8,'','#0C447C'); nr(24);
  var alugRows2 = [
    ['Base de c\u00e1lculo (faturamento bruto '+mesNome+'/'+anoRef+')', d.totalReceita, 'R$ #,##0.00', false],
    ['Percentual contratual', pct+'%', null, false],
    ['Valor do aluguel', aluguel, 'R$ #,##0.00', true],
    ['Data de vencimento', vencimento, null, false]
  ];
  for (var ai = 0; ai < alugRows2.length; ai++) {
    var isBold2 = alugRows2[ai][3];
    var fgL2 = isBold2 ? '#042C53' : '#185FA5'; var fgR2 = isBold2 ? '#0C447C' : '#042C53'; var sz2 = isBold2 ? 11 : 9;
    c_(curRow,2,5,alugRows2[ai][0],'#E6F1FB',fgL2,sz2,isBold2,'left');
    c_(curRow,6,7,alugRows2[ai][1],'#E6F1FB',fgR2,sz2,isBold2,'right',alugRows2[ai][2]);
    c_(curRow,1,1,'','#E6F1FB'); c_(curRow,8,8,'','#E6F1FB');
    if (ai < alugRows2.length-1) sh.getRange(curRow,1,1,8).setBorder(null,null,true,null,false,false,'#B5D4F4',SpreadsheetApp.BorderStyle.SOLID);
    nr(ai===2?26:20);
  }
  c_(curRow,1,8,'','#FFFFFF'); nr(10);
  c_(curRow,1,8,'','#F7F9FC');
  sh.getRange(curRow,1,1,8).setBorder(true,null,null,null,false,false,'#dde3ee',SpreadsheetApp.BorderStyle.SOLID); nr(4);
  c_(curRow,2,4,'Ant\u00f4nio Lu\u00eds Vieira  \u00b7  ZapClin Higieniza\u00e7\u00e3o de Capacetes','#F7F9FC','#333333',9,true,'left');
  c_(curRow,5,7,'Relat\u00f3rio gerado automaticamente pelo Sistema ZapClin v'+VERSION,'#F7F9FC','#999999',8,false,'right');
  c_(curRow,1,1,'','#F7F9FC'); c_(curRow,8,8,'','#F7F9FC'); nr(16);
  c_(curRow,2,4,'Golden Shopping Calhau  \u00b7  S\u00e3o Lu\u00eds, MA','#F7F9FC','#555555',9,false,'left');
  c_(curRow,5,7,'Enviado em '+dataEnvio+' \u00e0s '+horaEnvio,'#F7F9FC','#999999',8,false,'right');
  c_(curRow,1,1,'','#F7F9FC'); c_(curRow,8,8,'','#F7F9FC'); nr(14);
  c_(curRow,2,4,'antonio.luis.vieira.nj@gmail.com','#F7F9FC','#378ADD',9,false,'left');
  c_(curRow,5,7,'','#F7F9FC'); c_(curRow,1,1,'','#F7F9FC'); c_(curRow,8,8,'','#F7F9FC'); nr(14);
  c_(curRow,1,8,'','#F7F9FC'); nr(8);
  SpreadsheetApp.flush();
  var token2 = ScriptApp.getOAuthToken();
  var gid    = sh.getSheetId();
  var pdfUrl = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/export'
    + '?format=pdf&gid=' + gid
    + '&size=A4&portrait=true&fitw=true&fith=false'
    + '&top_margin=0.20&bottom_margin=0.20&left_margin=0.20&right_margin=0.20'
    + '&gridlines=false&printtitle=false&sheetnames=false&pagenumbers=false&attachment=false';
  var pdfResp = UrlFetchApp.fetch(pdfUrl, { headers:{'Authorization':'Bearer ' + token2} });
  var pdfBlob = pdfResp.getBlob();
  ss.deleteSheet(sh);
  var raiz    = _obterOuCriarPasta_('ZapClin_Relatorios', null);
  var pasta   = _obterOuCriarPasta_(String(anoRef), raiz);
  var nomePDF = 'ZapClin_Relatorio_' + mesNome + '_' + anoRef + '.pdf';
  var it      = pasta.getFilesByName(nomePDF);
  while (it.hasNext()) it.next().setTrashed(true);
  pdfBlob.setName(nomePDF);
  var pdfFile = pasta.createFile(pdfBlob);
  Logger.log('PDF salvo: ' + pdfFile.getUrl());
  // [v3.20 LOG] Registra geraÃ§Ã£o de PDF sem alterar o processo de emissÃ£o.
  registrarLogSistema_('PDF', 'gerarESalvarPDF_', 'OK', 'PDF gerado e salvo no Drive', { nome: nomePDF, url: pdfFile.getUrl(), mes: mesNome, ano: anoRef });
  return pdfFile;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  GERAR HTML DO EMAIL
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function gerarHtmlRelatorio_(mesNome, anoRef, mesVencNome, anoVenc, vencimento,
    dataEnvio, horaEnvio, totalReceita, totalServicos, diasOperados,
    ticketMedio, aluguel, pct, tabelaDiaria, tabelaSvcs) {
  var estilos = '<style>body{font-family:Arial,Helvetica,sans-serif;background:#f0f2f5;margin:0;padding:24px;color:#1a1a2e}.wrap{max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #dde3ee;border-radius:4px;overflow:hidden}table{width:100%;border-collapse:collapse}th{background:#0C447C;color:#E6F1FB;padding:10px 14px;text-align:left;font-size:12px;letter-spacing:.04em}.sec{padding:24px 32px}.sec-title{font-size:11px;font-weight:bold;color:#444;letter-spacing:.08em;margin-bottom:12px;border-bottom:1px solid #e8ecf0;padding-bottom:8px}.tag{display:inline-block;background:#E6F1FB;color:#185FA5;font-size:11px;font-weight:bold;padding:3px 10px;border-radius:20px}</style>';
  var header = '<div style="background:#0C447C;padding:28px 32px 22px"><div style="color:#85B7EB;font-size:11px;font-weight:bold;letter-spacing:.1em;margin-bottom:8px">ZAPCLIN HIGIENIZACAO DE CAPACETES</div><div style="color:#E6F1FB;font-size:22px;font-weight:bold;margin-bottom:4px">Relatorio de Faturamento Mensal</div><div style="color:#85B7EB;font-size:14px;margin-bottom:16px">' + mesNome + ' de ' + anoRef + ' &nbsp;\u00b7&nbsp; Golden Shopping Calhau &nbsp;\u00b7&nbsp; Sao Luis, MA</div><table><tr><td style="color:#B5D4F4;font-size:12px">Emitido em: <strong style="color:#E6F1FB">' + dataEnvio + '</strong> as <strong style="color:#E6F1FB">' + horaEnvio + '</strong></td><td style="text-align:right;color:#B5D4F4;font-size:12px">Ref. contrato de locacao &nbsp;\u00b7&nbsp; Aluguel proporcional ao faturamento</td></tr></table></div>';
  var resumo = '<div style="background:#E6F1FB;border-bottom:3px solid #378ADD;padding:20px 32px"><div class="sec-title" style="color:#185FA5;border-color:#B5D4F4">RESUMO FINANCEIRO DO MES</div><table><tr><td style="padding:0;width:22%"><div style="font-size:11px;color:#185FA5">Faturamento bruto</div><div style="font-size:22px;font-weight:bold;color:#042C53">' + fmtBRL2_(totalReceita) + '</div></td><td style="padding:0;width:18%"><div style="font-size:11px;color:#185FA5">Dias operados</div><div style="font-size:20px;font-weight:bold;color:#042C53">' + diasOperados + ' dias</div></td><td style="padding:0;width:18%"><div style="font-size:11px;color:#185FA5">Atendimentos</div><div style="font-size:20px;font-weight:bold;color:#042C53">' + totalServicos + '</div></td><td style="padding:0;width:18%"><div style="font-size:11px;color:#185FA5">Ticket medio</div><div style="font-size:20px;font-weight:bold;color:#042C53">' + fmtBRL2_(ticketMedio) + '</div></td><td style="padding:0 0 0 20px;border-left:3px solid #378ADD;width:24%"><div style="font-size:11px;color:#185FA5;font-weight:bold">ALUGUEL DEVIDO (' + pct + '%)</div><div style="font-size:24px;font-weight:bold;color:#0C447C">' + fmtBRL2_(aluguel) + '</div><div style="font-size:11px;color:#185FA5">Vence em ' + vencimento + '</div></td></tr></table></div>';
  var secDiaria = '<div class="sec"><div class="sec-title">MOVIMENTACAO DIARIA \u2014 ' + mesNome.toUpperCase() + ' ' + anoRef + '</div><table><thead><tr><th style="width:110px">Data</th><th style="width:140px">Dia da semana</th><th style="width:80px;text-align:center">Atend.</th><th style="text-align:right">Faturamento</th><th style="text-align:right">Acumulado</th></tr></thead><tbody>' + tabelaDiaria + '<tr style="background:#E6F1FB"><td colspan="2" style="padding:10px 14px;font-weight:bold;color:#042C53">Total do mes</td><td style="padding:10px 14px;text-align:center;font-weight:bold;color:#042C53">' + totalServicos + '</td><td style="padding:10px 14px;text-align:right;font-weight:bold;color:#0C447C;font-size:15px">' + fmtBRL2_(totalReceita) + '</td><td></td></tr></tbody></table></div>';
  var secSvcs = '<div class="sec" style="padding-top:4px"><div class="sec-title">COMPOSICAO DO FATURAMENTO POR SERVICO</div><table><thead><tr><th>Servico</th><th style="width:70px;text-align:center">Qtd.</th><th style="width:100px;text-align:right">Unit.</th><th style="width:120px;text-align:right">Total</th><th style="width:60px;text-align:right">%</th></tr></thead><tbody>' + tabelaSvcs + '<tr style="background:#E6F1FB"><td style="padding:10px 14px;font-weight:bold;color:#042C53">Total</td><td style="padding:10px 14px;text-align:center;font-weight:bold;color:#042C53">' + totalServicos + '</td><td></td><td style="padding:10px 14px;text-align:right;font-weight:bold;color:#0C447C;font-size:15px">' + fmtBRL2_(totalReceita) + '</td><td style="padding:10px 14px;text-align:right;font-weight:bold;color:#042C53">100%</td></tr></tbody></table></div>';
  var secAluguel = '<div style="margin:8px 32px 24px;background:#E6F1FB;border:2px solid #378ADD;border-radius:4px;padding:20px 24px"><div style="font-size:11px;font-weight:bold;color:#185FA5;letter-spacing:.08em;margin-bottom:14px">DEMONSTRATIVO DE ALUGUEL \u2014 ' + mesVencNome.toUpperCase() + '/' + anoVenc + '</div><table><tr><td style="padding:5px 0;color:#185FA5">Base de calculo <span class="tag">Faturamento bruto ' + mesNome + '/' + anoRef + '</span></td><td style="text-align:right;font-weight:bold;color:#042C53;font-size:15px">' + fmtBRL2_(totalReceita) + '</td></tr><tr><td style="padding:5px 0;color:#185FA5">Percentual contratual</td><td style="text-align:right;font-weight:bold;color:#042C53">' + pct + '%</td></tr><tr style="border-top:1px solid #B5D4F4"><td style="padding:12px 0 4px;font-weight:bold;color:#042C53;font-size:16px">Valor do aluguel</td><td style="text-align:right;font-weight:bold;color:#0C447C;font-size:24px;padding-top:8px">' + fmtBRL2_(aluguel) + '</td></tr><tr><td style="color:#185FA5;font-size:12px">Data de vencimento</td><td style="text-align:right;font-weight:bold;color:#185FA5;font-size:13px">' + vencimento + '</td></tr></table></div>';
  var rodape = '<div style="background:#f7f9fc;border-top:1px solid #dde3ee;padding:18px 32px"><table><tr><td style="font-size:12px;color:#555"><strong style="color:#1a1a2e;font-size:13px">Antonio Luis Vieira</strong><br>ZapClin Higienizacao de Capacetes<br>Golden Shopping Calhau \u00b7 Sao Luis, MA<br><span style="color:#378ADD">antonio.luis.vieira.nj@gmail.com</span></td><td style="text-align:right;font-size:11px;color:#999">Relatorio gerado automaticamente pelo<br><strong style="color:#555">Sistema ZapClin v' + VERSION + '</strong><br>Enviado em ' + dataEnvio + ' as ' + horaEnvio + '</td></tr></table></div>';
  return '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">' + estilos + '</head><body><div class="wrap">' + header + resumo + secDiaria + secSvcs + secAluguel + rodape + '</div></body></html>';
}

function enviarRelatorioMensal() {
  try {
  var ss=SpreadsheetApp.openById(SHEET_ID); var emailSheet=ss.getSheetByName(SHEET_EMAIL);
  var para=emailSheet?String(emailSheet.getRange('C9').getValue()).trim():EMAIL_FINANCEIRO;
  var cc=emailSheet?String(emailSheet.getRange('C10').getValue()).trim():EMAIL_COPIA;
  var pct=emailSheet?parseFloat(emailSheet.getRange('C11').getValue()):10;
  var diaVenc=emailSheet?parseInt(emailSheet.getRange('C12').getValue()):10;
  var agora=new Date(); var mesRef=agora.getMonth(); var anoRef=agora.getFullYear();
  if (mesRef===0) { mesRef=12; anoRef--; }
  var d=_carregarDadosMes_(mesRef,anoRef); var aluguel=d.totalReceita*(pct/100);
  var mesNome=MESES_NOMES_[mesRef-1];
  var mesVenc=agora.getMonth()+1; var anoVenc=agora.getFullYear();
  var vencimento=pad2_(diaVenc)+'/'+pad2_(mesVenc)+'/'+anoVenc;
  var mesVencNome=MESES_NOMES_[mesVenc-1];
  var dataEnvio=Utilities.formatDate(agora,FUSO,'dd/MM/yyyy');
  var horaEnvio=Utilities.formatDate(agora,FUSO,'HH:mm');
  var html=gerarHtmlRelatorioGoldenV2_(mesNome,anoRef,mesVencNome,anoVenc,vencimento,dataEnvio,horaEnvio,d,aluguel,pct);
  var assunto='ZapClin \u2014 Relatorio de Faturamento '+mesNome+'/'+anoRef+' | Aluguel: '+fmtBRL2_(aluguel);
  var pdfFile=gerarESalvarPDF_(mesRef,mesNome,anoRef,agora,d,aluguel,pct,diaVenc);
  MailApp.sendEmail({to:para,cc:cc,subject:assunto,htmlBody:html,name:'ZapClin \u2014 Sistema de Gestao',attachments:[pdfFile.getBlob().setName('ZapClin_Relatorio_'+mesNome+'_'+anoRef+'.pdf')]});
  if (emailSheet) {
    var logVals=emailSheet.getRange('B20:B65').getValues(); var logLinha=20;
    for (var ll=0;ll<logVals.length;ll++) { if (!logVals[ll][0]) { logLinha=20+ll; break; } }
    emailSheet.getRange(logLinha,2).setValue(dataEnvio+' '+horaEnvio);
    emailSheet.getRange(logLinha,3).setValue(mesNome); emailSheet.getRange(logLinha,4).setValue(anoRef);
    emailSheet.getRange(logLinha,5).setValue(d.totalReceita).setNumberFormat('R$ #,##0.00');
    emailSheet.getRange(logLinha,6).setValue(aluguel).setNumberFormat('R$ #,##0.00');
    emailSheet.getRange(logLinha,7).setValue('\u2705 Enviado').setFontColor('#00e676').setFontWeight('bold');
    emailSheet.getRange(logLinha,8).setValue(para);
    emailSheet.getRange(logLinha,9).setValue(pdfFile.getUrl()).setFontColor('#448aff');
    SpreadsheetApp.flush();
  }
  Logger.log('Relatorio enviado + PDF salvo. Aluguel: '+fmtBRL2_(aluguel));
  try { SpreadsheetApp.getUi().alert('\u2705 Relatorio enviado!\n\nPara: '+para+'\nAluguel: '+fmtBRL2_(aluguel)); } catch(e) {}

    // [v3.20 LOG] Registra sucesso de envio mensal quando a funÃ§Ã£o roda por trigger ou manualmente.
    registrarLogSistema_('RELATORIO', 'enviarRelatorioMensal', 'OK', 'RelatÃ³rio enviado, PDF salvo e e-mail disparado', { para: para, cc: cc, mes: mesNome, ano: anoRef, faturamento: d.totalReceita, aluguel: aluguel, pdf: pdfFile.getUrl() });
  } catch(errRelatorio) {
    // [v3.20 LOG] Registra falha crÃ­tica do relatÃ³rio e relanÃ§a o erro para o Apps Script mostrar no histÃ³rico.
    registrarLogSistema_('RELATORIO', 'enviarRelatorioMensal', 'ERRO', errRelatorio.toString(), null);
    throw errRelatorio;
  }
}

function testarEnvioEmail() {
  var agora=new Date(); var mesRef=agora.getMonth(); var anoRef=agora.getFullYear();
  if (mesRef===0) { mesRef=12; anoRef--; }
  var d=_carregarDadosMes_(mesRef,anoRef); var aluguel=d.totalReceita*0.10;
  var mesNome=MESES_NOMES_[mesRef-1]; var mesVenc=agora.getMonth()+1; var anoVenc=agora.getFullYear();
  var vencimento='10/'+pad2_(mesVenc)+'/'+anoVenc; var mesVencNome=MESES_NOMES_[mesVenc-1];
  var dataEnvio=Utilities.formatDate(agora,FUSO,'dd/MM/yyyy'); var horaEnvio=Utilities.formatDate(agora,FUSO,'HH:mm');
  var html=gerarHtmlRelatorioGoldenV2_(mesNome,anoRef,mesVencNome,anoVenc,vencimento,dataEnvio,horaEnvio,d,aluguel,10);
  var assunto='[TESTE] ZapClin \u2014 Relatorio '+mesNome+'/'+anoRef+' | Aluguel: '+fmtBRL2_(aluguel);
  var pdfFile=gerarESalvarPDF_(mesRef,mesNome,anoRef,agora,d,aluguel,10,10);
  MailApp.sendEmail({to:'ribocg@gmail.com',subject:assunto,htmlBody:html,name:'ZapClin \u2014 Teste de Relatorio',attachments:[pdfFile.getBlob().setName('TESTE_ZapClin_Relatorio_'+mesNome+'_'+anoRef+'.pdf')]});
  Logger.log('Teste de relatorio enviado para ribocg@gmail.com. PDF: '+pdfFile.getUrl()+' | Faturamento: '+fmtBRL2_(d.totalReceita)+' | Aluguel: '+fmtBRL2_(aluguel));
  try {
    registrarLogSistema_('RELATORIO', 'testarEnvioEmail', 'OK', 'Teste de relatorio enviado sem destinatario Golden', { para:'ribocg@gmail.com', mes:mesNome, ano:anoRef, faturamento:d.totalReceita, aluguel:aluguel, pdf:pdfFile.getUrl(), versao:VERSION });
  } catch(eLogTeste) {}
  return { ok:true, version:VERSION, para:'ribocg@gmail.com', pdf:pdfFile.getUrl(), faturamento:d.totalReceita, aluguel:aluguel };
}

function criarTriggerRelatorio() {
  var triggers=ScriptApp.getProjectTriggers();
  for (var i=0;i<triggers.length;i++) { if (triggers[i].getHandlerFunction()==='enviarRelatorioMensal') ScriptApp.deleteTrigger(triggers[i]); }
  ScriptApp.newTrigger('enviarRelatorioMensal').timeBased().onMonthDay(1).atHour(8).inTimezone('America/Sao_Paulo').create();
  SpreadsheetApp.getUi().alert('\u2705 Trigger ativado!\n\nEnvio automatico todo dia 1\u00ba as 08h00 (Brasilia).\nPara desativar: deletarTriggerRelatorio()');
}

function deletarTriggerRelatorio() {
  var triggers=ScriptApp.getProjectTriggers(); var removidos=0;
  for (var i=0;i<triggers.length;i++) { if (triggers[i].getHandlerFunction()==='enviarRelatorioMensal') { ScriptApp.deleteTrigger(triggers[i]); removidos++; } }
  SpreadsheetApp.getUi().alert(removidos>0?'\u2705 Trigger removido!':'\u26a0\ufe0f Nenhum trigger encontrado.');
}

function pegarID() { SpreadsheetApp.getUi().alert(SpreadsheetApp.getActiveSpreadsheet().getId()); }

function criarTriggerKPIs() {
  var triggers=ScriptApp.getProjectTriggers();
  for (var i=0;i<triggers.length;i++) { if (triggers[i].getHandlerFunction()==='atualizarKPIs') ScriptApp.deleteTrigger(triggers[i]); }
  ScriptApp.newTrigger('atualizarKPIs').timeBased().everyMinutes(15).create();
  atualizarKPIs();
  SpreadsheetApp.getUi().alert('\u2705 Trigger criado!\n\nO dashboard vai se atualizar automaticamente a cada hora.\n\nKPIs atualizados agora! [v'+VERSION+']');
}

function deletarTriggerKPIs() {
  var triggers=ScriptApp.getProjectTriggers(); var removidos=0;
  for (var i=0;i<triggers.length;i++) { if (triggers[i].getHandlerFunction()==='atualizarKPIs') { ScriptApp.deleteTrigger(triggers[i]); removidos++; } }
  SpreadsheetApp.getUi().alert(removidos>0?'\u2705 Trigger removido! Dashboard nÃ£o atualiza mais automaticamente.':'\u26a0\ufe0f Nenhum trigger encontrado.');
}


// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  CRIAR ABA EMAIL
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function criarAbaEmail() {
  var ss  = SpreadsheetApp.openById(SHEET_ID);
  var old = ss.getSheetByName(SHEET_EMAIL);
  if (old) ss.deleteSheet(old);
  var s = ss.insertSheet(SHEET_EMAIL);
  s.setColumnWidth(1,20);  s.setColumnWidth(2,180); s.setColumnWidth(3,250);
  s.setColumnWidth(4,80);  s.setColumnWidth(5,120); s.setColumnWidth(6,120);
  s.setColumnWidth(7,110); s.setColumnWidth(8,200); s.setColumnWidth(9,200);
  s.setRowHeight(3,45);
  s.getRange('A3:I3').merge().setValue('\u26a1 ZapClin \u2014 Relatorio de Aluguel \u00b7 Golden Shopping Calhau').setBackground('#0d0d0d').setFontColor('#00e5ff').setFontSize(13).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  s.setRowHeight(6,36);
  s.getRange('A6:I6').merge().setValue('\ud83d\udce7  CONFIGURACAO DO ENVIO AUTOMATICO').setBackground('#1a237e').setFontColor('#ffffff').setFontSize(11).setFontWeight('bold').setVerticalAlignment('middle');
  s.setRowHeight(8,30);
  s.getRange('A8:I8').setBackground('#1a1a1a');
  s.getRange('B8').setValue('PARAMETRO').setFontColor('#00e5ff').setFontSize(9).setFontWeight('bold');
  s.getRange('C8').setValue('VALOR (editavel)').setFontColor('#00e5ff').setFontSize(9).setFontWeight('bold');
  var configs = [
    ['Destinatario (Para)', EMAIL_FINANCEIRO],
    ['Copia (CC)', EMAIL_COPIA],
    ['% Aluguel sobre faturamento', '10'],
    ['Dia do vencimento do boleto', '10']
  ];
  for (var i = 0; i < configs.length; i++) {
    var r = 9 + i;
    s.setRowHeight(r,28);
    s.getRange('A'+r+':I'+r).setBackground((i%2===0)?'#161616':'#111111');
    s.getRange('B'+r).setValue(configs[i][0]).setFontColor('#aaaacc').setFontSize(10);
    s.getRange('C'+r).setValue(configs[i][1]).setFontColor('#00e5ff').setFontSize(10).setFontWeight('bold');
  }
  s.setRowHeight(14,32);
  s.getRange('A14:I14').merge().setValue('\u25b6  ENVIO MANUAL: Extensoes \u2192 Apps Script \u2192 enviarRelatorioMensal() \u2192 Executar').setBackground('#0d2b0d').setFontColor('#00e676').setFontSize(10).setVerticalAlignment('middle');
  s.setRowHeight(15,28);
  s.getRange('A15:I15').merge().setValue('\u23f0  AUTOMATICO: executar criarTriggerRelatorio() \u2192 todo dia 1\u00ba do mes as 08h00 (Brasilia)').setBackground('#0d1a2b').setFontColor('#448aff').setFontSize(10).setVerticalAlignment('middle');
  s.setRowHeight(16,28);
  s.getRange('A16:I16').merge().setValue('\ud83e\uddea  TESTE: executar testarEnvioEmail() \u2192 envia para ribocg@gmail.com + salva PDF no Drive').setBackground('#1a100d').setFontColor('#ff9100').setFontSize(10).setVerticalAlignment('middle');
  s.setRowHeight(18,36);
  s.getRange('A18:I18').merge().setValue('\ud83d\udccb  HISTORICO DE ENVIOS').setBackground('#311b0d').setFontColor('#ff9100').setFontSize(11).setFontWeight('bold').setVerticalAlignment('middle');
  s.setRowHeight(19,30);
  s.getRange('A19:I19').setBackground('#1a1a1a');
  var logH = ['DATA ENVIO','MES REF.','ANO','FATURAMENTO','ALUGUEL (10%)','STATUS','DESTINATARIO','PDF DRIVE'];
  for (var h = 0; h < logH.length; h++) {
    s.getRange(19, 2+h).setValue(logH[h]).setFontColor('#ff9100').setFontSize(9).setFontWeight('bold').setHorizontalAlignment('center');
  }
  for (var rr = 20; rr <= 65; rr++) {
    s.getRange('A'+rr+':I'+rr).setBackground((rr%2===0)?'#161616':'#111111').setFontColor('#e0e0e0').setFontSize(10);
    s.setRowHeight(rr, 26);
    s.getRange('E'+rr).setNumberFormat('R$ #,##0.00').setHorizontalAlignment('right').setFontColor('#00e5ff');
    s.getRange('F'+rr).setNumberFormat('R$ #,##0.00').setHorizontalAlignment('right').setFontColor('#00e676');
    s.getRange('G'+rr).setHorizontalAlignment('center');
    s.getRange('I'+rr).setFontColor('#448aff');
  }
  s.setFrozenRows(9);
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('\u2705 Aba EMAIL criada!\n\n\u2022 Parametros: linhas 9-12\n\u2022 Teste: testarEnvioEmail()\n\u2022 Automatico: criarTriggerRelatorio()');
}

function corrigirTodoDashboard() {
  var ss=SpreadsheetApp.openById(SHEET_ID); var DASH=getDashboardSheet_(ss);
  if (!DASH) { SpreadsheetApp.getUi().alert('Aba DASHBOARD nÃ£o encontrada'); return; }
  var maxRow=DASH.getLastRow(); var maxCol=DASH.getLastColumn();
  var allFormulas=DASH.getRange(1,1,maxRow,maxCol).getFormulas(); var countFixed=0;
  for (var r=0;r<allFormulas.length;r++) {
    for (var c=0;c<allFormulas[r].length;c++) {
      var f=allFormulas[r][c]; if (!f) continue;
      var newF=f.replace(/C10:C17/g,'C10:C600').replace(/D10:D17/g,'D10:D600').replace(/E10:E17/g,'E10:E600').replace(/G10:G17/g,'G10:G600');
      if (newF!==f) { DASH.getRange(r+1,c+1).setFormula(newF); countFixed++; }
    }
  }
  SpreadsheetApp.flush(); atualizarKPIs();
  SpreadsheetApp.getUi().alert('âœ… Dashboard corrigido!\n\nâ€¢ '+countFixed+' ranges expandidos\nâ€¢ KPIs atualizados');
}

function corrigirRanges() { corrigirTodoDashboard(); }
function restaurarDashboard() { corrigirTodoDashboard(); }

function limparDashboardAntigo() {
  var ss=SpreadsheetApp.openById(SHEET_ID); var dash=getDashboardSheet_(ss);
  if (!dash) { SpreadsheetApp.getUi().alert('Aba DASHBOARD nÃ£o encontrada.'); return; }
  var charts=dash.getCharts(); charts.forEach(function(c){dash.removeChart(c);});
  var lastRow=dash.getMaxRows();
  if (lastRow>=70) dash.getRange(70,1,lastRow-69,dash.getMaxColumns()).clearContent().clearFormat();
  SpreadsheetApp.getUi().alert('âœ… DASHBOARD limpo!\nâ€¢ '+charts.length+' grafico(s) removido(s)\n\nExecute criarAnalise() agora.');
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  CORRIGIR DIAS DO MÃŠS (versÃ£o Ãºnica â€” duplicata removida no v3.17)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function corrigirDiasMes() {
  var ss=SpreadsheetApp.openById(SHEET_ID); var dash=getDashboardSheet_(ss);
  if (!dash) { SpreadsheetApp.getUi().alert('Aba DASHBOARD nao encontrada'); return; }
  var LN = "'" + SHEET_LANCAMENTOS + "'";
  dash.getRange(56,2).setFormula('=IFERROR(DATE(YEAR(TODAY()),MONTH(TODAY()),1),"")');
  dash.getRange(56,3).setFormula("=IFERROR(COUNTIF("+LN+"!D10:D1200,DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)");
  dash.getRange(56,4).setFormula("=IFERROR(SUMIF("+LN+"!D10:D1200,DATE(YEAR(TODAY()),MONTH(TODAY()),1),"+LN+"!G10:G1200),0)");
  dash.getRange(56,5).setFormula('=IF(C56>=20,"PICO",IF(C56>=15,"BOM",IF(C56>=10,"Normal","-")))');
  dash.getRange(56,2,1,4).copyTo(dash.getRange(57,2,30,4));
  for (var d=2;d<=31;d++) {
    var r=55+d;
    dash.getRange(r,2).setFormula('=IFERROR(DATE(YEAR(TODAY()),MONTH(TODAY()),'+d+'),"")');
    dash.getRange(r,3).setFormula("=IFERROR(COUNTIF("+LN+"!D10:D1200,DATE(YEAR(TODAY()),MONTH(TODAY()),"+d+")),0)");
    dash.getRange(r,4).setFormula("=IFERROR(SUMIF("+LN+"!D10:D1200,DATE(YEAR(TODAY()),MONTH(TODAY()),"+d+"),"+LN+"!G10:G1200),0)");
  }
  for (var r=56;r<=86;r++) {
    var bg=(r%2===0)?'#161616':'#111111';
    dash.getRange(r,1,1,6).setBackground(bg); dash.setRowHeight(r,30);
    dash.getRange(r,2).setNumberFormat('dd/MM/yyyy').setFontColor('#e0e0e0').setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle').setFontSize(10);
    dash.getRange(r,3).setFontColor('#00e5ff').setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle').setFontSize(10);
    dash.getRange(r,4).setNumberFormat('R$ #,##0.00').setFontColor('#00e676').setFontWeight('bold').setHorizontalAlignment('right').setVerticalAlignment('middle').setFontSize(10);
    dash.getRange(r,5).setFontColor('#e0e0e0').setHorizontalAlignment('center').setVerticalAlignment('middle').setFontSize(10);
  }
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('âœ… Dias do Mes corrigido!\n\n31 dias configurados\nStatus: >=20 PICO | >=15 BOM | >=10 Normal');
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  CRIAR ABA ANALISE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function criarAnalise() {
  var ss  = SpreadsheetApp.openById(SHEET_ID);
  var LN  = "'" + SHEET_LANCAMENTOS + "'";
  var MF  = '$B$2';
  var AF  = '$D$2';
  var DC  = 25;
  ['Analise','AnÃ¡lise'].forEach(function(nm){
    var s = ss.getSheetByName(nm); if (s) ss.deleteSheet(s);
  });
  var dash = ss.insertSheet('Analise');
  var needCols = DC + 15;
  if (dash.getMaxColumns() < needCols) {
    dash.insertColumnsAfter(dash.getMaxColumns(), needCols - dash.getMaxColumns());
  }
  function colL(n){ var s=''; while(n>0){ n--; s=String.fromCharCode(65+(n%26))+s; n=Math.floor(n/26); } return s; }
  var CAT_COL = colL(DC + 12);
  dash.setColumnWidth(1,120); dash.setColumnWidth(2,80); dash.setColumnWidth(3,120);
  dash.setColumnWidth(4,100); dash.setColumnWidth(5,60);
  for (var cc = 6; cc <= 22; cc++) dash.setColumnWidth(cc, 80);
  var now = new Date();
  var mesIdx = now.getMonth(); var anoAtual = now.getFullYear(); var mesNum = mesIdx + 1;
  var ML = ['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  dash.setRowHeight(1, 54);
  dash.getRange(1,1,1,22).merge().setValue('ZapClin  |  Analise de Desempenho').setBackground('#050510').setFontColor('#00e5ff').setFontSize(18).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  dash.setRowHeight(2, 48); dash.getRange(2,1,1,22).setBackground('#0a0a1a');
  dash.getRange(2,1).setValue('FILTRAR:').setFontColor('#3a3a5a').setFontSize(9).setFontWeight('bold').setHorizontalAlignment('right').setVerticalAlignment('middle');
  dash.getRange(2,2).setValue(mesNum).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['1','2','3','4','5','6','7','8','9','10','11','12'],true).setAllowInvalid(true).build()).setBackground('#0d47a1').setFontColor('#ffffff').setFontSize(18).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  dash.getRange(2,3).setValue(ML[mesIdx]).setBackground('#0a0a1a').setFontColor('#00e5ff').setFontSize(14).setFontWeight('bold').setVerticalAlignment('middle');
  dash.getRange(2,4).setValue(anoAtual).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['2025','2026','2027','2028'],true).setAllowInvalid(true).build()).setBackground('#1a237e').setFontColor('#ffffff').setFontSize(16).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  dash.getRange(2,5).setValue('/'+anoAtual).setBackground('#0a0a1a').setFontColor('#3a3a5a').setFontSize(11).setVerticalAlignment('middle');
  dash.setRowHeight(3, 6); dash.getRange(3,1,1,22).setBackground('#0a0a1a');
  dash.setRowHeight(4, 18); dash.setRowHeight(5, 44); dash.setRowHeight(6, 8); dash.setRowHeight(7, 6);
  dash.getRange(4,1,3,22).setBackground('#0d0d20');
  dash.getRange(4,1,1,4).merge().setValue('RECEITA DO MES').setBackground('#0d0d20').setFontColor('#00c853').setFontSize(8).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  dash.getRange(5,1,1,4).merge().setFormula('=SUMPRODUCT((MONTH('+LN+'!D$10:D$500)='+MF+')*(YEAR('+LN+'!D$10:D$500)='+AF+')*'+LN+'!G$10:G$500)').setBackground('#0d0d20').setFontColor('#00e676').setFontSize(22).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle').setNumberFormat('"R$ "#,##0.00');
  dash.getRange(4,1,1,4).setBorder(true,true,false,true,false,false,'#00e676',SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  dash.getRange(4,5,1,4).merge().setValue('CUSTOS DO MES').setBackground('#0d0d20').setFontColor('#ff4444').setFontSize(8).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  dash.getRange(5,5,1,4).merge().setFormula('=SUMPRODUCT((MONTH(CUSTOS!B$10:B$500)='+MF+')*(YEAR(CUSTOS!B$10:B$500)='+AF+')*CUSTOS!F$10:F$500)').setBackground('#0d0d20').setFontColor('#ff4444').setFontSize(22).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle').setNumberFormat('"R$ "#,##0.00');
  dash.getRange(4,5,1,4).setBorder(true,true,false,true,false,false,'#ff4444',SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  dash.getRange(4,9,1,4).merge().setValue('LUCRO DO MES').setBackground('#0d0d20').setFontColor('#ffea00').setFontSize(8).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  dash.getRange(5,9,1,4).merge().setFormula('=SUMPRODUCT((MONTH('+LN+'!D$10:D$500)='+MF+')*(YEAR('+LN+'!D$10:D$500)='+AF+')*'+LN+'!G$10:G$500)-SUMPRODUCT((MONTH(CUSTOS!B$10:B$500)='+MF+')*(YEAR(CUSTOS!B$10:B$500)='+AF+')*CUSTOS!F$10:F$500)').setBackground('#0d0d20').setFontColor('#ffea00').setFontSize(22).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle').setNumberFormat('"R$ "#,##0.00');
  dash.getRange(4,9,1,4).setBorder(true,true,false,true,false,false,'#ffea00',SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  dash.getRange(4,13,1,4).merge().setValue('ATENDIMENTOS').setBackground('#0d0d20').setFontColor('#00e5ff').setFontSize(8).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  dash.getRange(5,13,1,4).merge().setFormula('=SUMPRODUCT((MONTH('+LN+'!D$10:D$500)='+MF+')*(YEAR('+LN+'!D$10:D$500)='+AF+'))').setBackground('#0d0d20').setFontColor('#00e5ff').setFontSize(22).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle').setNumberFormat('0" serv."');
  dash.getRange(4,13,1,4).setBorder(true,true,false,true,false,false,'#00e5ff',SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  dash.getRange(8,1,50,22).setBackground('#0a0a18');
  dash.getRange(5,DC+0).setValue('Dia'); dash.getRange(5,DC+1).setValue('Atendimentos'); dash.getRange(5,DC+2).setValue('Receita (R$)');
  for (var d = 1; d <= 31; d++) {
    var r = 5 + d;
    dash.getRange(r,DC+0).setValue(d);
    dash.getRange(r,DC+1).setFormula('=SUMPRODUCT((MONTH('+LN+'!D$10:D$500)='+MF+')*(YEAR('+LN+'!D$10:D$500)='+AF+')*(DAY('+LN+'!D$10:D$500)='+d+'))');
    dash.getRange(r,DC+2).setFormula('=SUMPRODUCT((MONTH('+LN+'!D$10:D$500)='+MF+')*(YEAR('+LN+'!D$10:D$500)='+AF+')*(DAY('+LN+'!D$10:D$500)='+d+')*'+LN+'!G$10:G$500)');
    dash.getRange(r,DC+2).setNumberFormat('#,##0.00');
  }
  dash.getRange(5,DC+4).setValue('Dia'); dash.getRange(5,DC+5).setValue('Custo (R$)');
  for (var d = 1; d <= 31; d++) {
    var r = 5 + d;
    dash.getRange(r,DC+4).setValue(d);
    dash.getRange(r,DC+5).setFormula('=SUMPRODUCT((MONTH(CUSTOS!B$10:B$500)='+MF+')*(YEAR(CUSTOS!B$10:B$500)='+AF+')*(DAY(CUSTOS!B$10:B$500)='+d+')*CUSTOS!F$10:F$500)');
    dash.getRange(r,DC+5).setNumberFormat('#,##0.00');
  }
  var SVCS = ['Higieniza\u00e7\u00e3o R\u00e1pida','Higieniza\u00e7\u00e3o Essencial','Higieniza\u00e7\u00e3o Profunda',
              'Limpeza + Higieniza\u00e7\u00e3o','Higieniza\u00e7\u00e3o + Lavagem','Revitaliza\u00e7\u00e3o Premium',
              'Limpeza + Hig. R\u00e1pida','Limpeza + Hig. Essencial','Limpeza + Hig. Profunda','Revitaliza\u00e7\u00e3o'];
  dash.getRange(5,DC+8).setValue('Servico'); dash.getRange(5,DC+9).setValue('Execucoes'); dash.getRange(5,DC+10).setValue('Receita (R$)');
  for (var s = 0; s < SVCS.length; s++) {
    var r = 6 + s;
    dash.getRange(r,DC+8).setValue(SVCS[s]);
    dash.getRange(r,DC+9).setFormula('=SUMPRODUCT((MONTH('+LN+'!D$10:D$500)='+MF+')*(YEAR('+LN+'!D$10:D$500)='+AF+')*('+LN+'!C$10:C$500="'+SVCS[s]+'"))');
    dash.getRange(r,DC+10).setFormula('=SUMPRODUCT((MONTH('+LN+'!D$10:D$500)='+MF+')*(YEAR('+LN+'!D$10:D$500)='+AF+')*('+LN+'!C$10:C$500="'+SVCS[s]+'")*'+LN+'!G$10:G$500)');
    dash.getRange(r,DC+10).setNumberFormat('#,##0.00');
  }
  var CATS = ['SalÃ¡rios','Produtos/Insumos','Ferramentas/Equipamentos','Transporte','Utilidades','Comida','Taxas e Boletos','Outros'];
  dash.getRange(5,DC+12).setValue('Categoria'); dash.getRange(5,DC+13).setValue('Total (R$)');
  for (var c = 0; c < CATS.length; c++) {
    var r = 6 + c;
    dash.getRange(r,DC+12).setValue(CATS[c]);
    dash.getRange(r,DC+13).setFormula('=SUMPRODUCT((MONTH(CUSTOS!B$10:B$500)='+MF+')*(YEAR(CUSTOS!B$10:B$500)='+AF+')*(CUSTOS!E$10:E$500='+CAT_COL+r+')*CUSTOS!F$10:F$500)');
    dash.getRange(r,DC+13).setNumberFormat('#,##0.00');
  }
  SpreadsheetApp.flush();
  dash.insertChart(dash.newChart().setChartType(Charts.ChartType.COMBO).addRange(dash.getRange(5,DC+0,33,3)).setOption('title','Atendimentos e Receita por Dia').setOption('titleTextStyle',{fontSize:13,bold:true,color:'#e0e0ff'}).setOption('backgroundColor',{fill:'#0c0c1e'}).setOption('seriesType','bars').setOption('focusTarget','category').setOption('legend',{position:'bottom',textStyle:{color:'#8080b0',fontSize:10}}).setOption('hAxis',{title:'Dia',textStyle:{color:'#5050a0'},titleTextStyle:{color:'#5050a0'},gridlines:{color:'#141428'},baselineColor:'#202040'}).setOption('vAxes',{0:{title:'Atendimentos',textStyle:{color:'#00b8d4'},titleTextStyle:{color:'#00b8d4'},gridlines:{color:'#141428'},minValue:0,format:'0'},1:{title:'Receita',textStyle:{color:'#00c853'},titleTextStyle:{color:'#00c853'},gridlines:{count:0},minValue:0,format:'#,##0'}}).setOption('series',{0:{type:'bars',color:'#0288d1',targetAxisIndex:0,labelInLegend:'Atendimentos'},1:{type:'line',color:'#00e676',targetAxisIndex:1,lineWidth:3,pointSize:5,labelInLegend:'Receita (R$)'}}).setOption('width',720).setOption('height',400).setPosition(8,1,8,5).build());
  dash.insertChart(dash.newChart().setChartType(Charts.ChartType.LINE).addRange(dash.getRange(5,DC+4,33,2)).setOption('title','Custos por Dia').setOption('titleTextStyle',{fontSize:13,bold:true,color:'#e0e0ff'}).setOption('backgroundColor',{fill:'#0c0c1e'}).setOption('focusTarget','category').setOption('legend',{position:'bottom',textStyle:{color:'#8080b0',fontSize:10}}).setOption('hAxis',{title:'Dia',textStyle:{color:'#5050a0'},titleTextStyle:{color:'#5050a0'},gridlines:{color:'#141428'},baselineColor:'#202040'}).setOption('vAxis',{title:'Custo (R$)',textStyle:{color:'#ff6060'},titleTextStyle:{color:'#ff6060'},gridlines:{color:'#141428'},minValue:0,format:'#,##0'}).setOption('series',{0:{color:'#ff4444',pointSize:4,lineWidth:3,labelInLegend:'Custo (R$)'}}).setOption('curveType','function').setOption('width',720).setOption('height',400).setPosition(8,10,8,5).build());
  dash.insertChart(dash.newChart().setChartType(Charts.ChartType.COLUMN).addRange(dash.getRange(6,DC+8,SVCS.length,3)).setOption('title','Execucoes e Receita por Servico').setOption('titleTextStyle',{fontSize:13,bold:true,color:'#e0e0ff'}).setOption('backgroundColor',{fill:'#0c0c1e'}).setOption('focusTarget','category').setOption('useFirstColumnAsDomain',true).setOption('legend',{position:'bottom',textStyle:{color:'#8080b0',fontSize:10}}).setOption('hAxis',{textStyle:{color:'#5050a0',fontSize:9},gridlines:{color:'#141428'},baselineColor:'#202040',slantedText:true,slantedTextAngle:30}).setOption('vAxes',{0:{title:'Execucoes',textStyle:{color:'#00b8d4'},titleTextStyle:{color:'#00b8d4'},gridlines:{color:'#141428'},minValue:0,format:'0'},1:{title:'Receita (R$)',textStyle:{color:'#00c853'},titleTextStyle:{color:'#00c853'},gridlines:{count:0},minValue:0,format:'#,##0'}}).setOption('series',{0:{color:'#0288d1',targetAxisIndex:0,labelInLegend:'Execucoes'},1:{color:'#00e676',targetAxisIndex:1,labelInLegend:'Receita (R$)'}}).setOption('width',720).setOption('height',400).setPosition(30,1,8,5).build());
  dash.insertChart(dash.newChart().setChartType(Charts.ChartType.BAR).addRange(dash.getRange(6,DC+12,8,2)).setOption('title','Custos por Categoria').setOption('titleTextStyle',{fontSize:13,bold:true,color:'#e0e0ff'}).setOption('backgroundColor',{fill:'#0c0c1e'}).setOption('focusTarget','category').setOption('useFirstColumnAsDomain',true).setOption('legend',{position:'none'}).setOption('hAxis',{title:'Total (R$)',textStyle:{color:'#5050a0'},titleTextStyle:{color:'#ff8040'},gridlines:{color:'#141428'},baselineColor:'#202040',minValue:0,format:'#,##0'}).setOption('vAxis',{textStyle:{color:'#ccccdd',fontSize:10}}).setOption('series',{0:{color:'#ff6d00',labelInLegend:'Total (R$)'}}).setOption('width',720).setOption('height',400).setPosition(30,10,8,5).build());
  SpreadsheetApp.getUi().alert('Dashboard criado! Mude B2 (mes) e D2 (ano) para filtrar. [v'+VERSION+']');
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  NOVO v3.19: DiagnÃ³stico operacional somente leitura
//  Objetivo: verificar saÃºde do sistema sem alterar planilha/Drive/Gmail/triggers.
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function diagnosticoSistema_(ss) {
  var inicio = new Date();
  var checks = [];

  function addCheck(nome, ok, detalhe, extra) {
    checks.push({
      nome: nome,
      ok: ok === true,
      detalhe: detalhe || '',
      extra: extra || null
    });
  }

  function safeLastRow(sheet) {
    try { return sheet ? sheet.getLastRow() : 0; } catch(e) { return 0; }
  }

  function safeGetA1(sheet, a1) {
    try { return sheet ? sheet.getRange(a1).getValue() : ''; } catch(e) { return ''; }
  }

  try {
    // [v3.19 NOVO] DiagnÃ³stico bÃ¡sico da planilha ativa do sistema.
    var rangesStatus = null;
    addCheck('Spreadsheet aberta', !!ss, 'ID configurado: ' + SHEET_ID);

    var obrigatorias = [
      SHEET_REGISTRAR,
      SHEET_LANCAMENTOS,
      SHEET_CUSTOS,
      SHEET_CLIENTES,
      SHEET_DASHBOARD,
      SHEET_EMAIL
    ];

    var sheetsStatus = {};
    for (var i = 0; i < obrigatorias.length; i++) {
      var nomeAba = obrigatorias[i];
      var sh = ss.getSheetByName(nomeAba);
      sheetsStatus[nomeAba] = {
        existe: !!sh,
        lastRow: safeLastRow(sh)
      };
      addCheck('Aba obrigatÃ³ria: ' + nomeAba, !!sh, sh ? ('Encontrada Â· lastRow=' + safeLastRow(sh)) : 'NÃ£o encontrada');
    }

    var lanc = getLancamentosSheet_(ss);
    var custos = ss.getSheetByName(SHEET_CUSTOS);
    var clientes = ss.getSheetByName(SHEET_CLIENTES);
    var emailSheet = ss.getSheetByName(SHEET_EMAIL);

    // [v3.19 NOVO] VerificaÃ§Ã£o de linhas crÃ­ticas sem editar dados.
    addCheck('LANÃ‡AMENTOS estrutura mÃ­nima', !!lanc && safeLastRow(lanc) >= 8, 'Esperado cabeÃ§alho atÃ© linha 8 e dados a partir da linha 10');
    addCheck('CUSTOS estrutura mÃ­nima', !!custos && safeLastRow(custos) >= 8, 'Esperado cabeÃ§alho atÃ© linha 8 e dados a partir da linha 10');
    addCheck('CLIENTES estrutura mÃ­nima', !!clientes && safeLastRow(clientes) >= 8, 'Esperado cabeÃ§alho atÃ© linha 8 e dados a partir da linha 10');

    // [v3.45 Fase 2] Auditoria de ranges dinamicos — detecta risco de truncamento legado (linha 600).
    var rangesStatus = {
      dataRowStart: DATA_ROW_START,
      dataRowMax: DATA_ROW_MAX,
      fuso: FUSO,
      lancamentos: { lastRow: safeLastRow(lanc), linhasLidas: 0 },
      custos: { lastRow: safeLastRow(custos), linhasLidas: 0 },
      clientes: { lastRow: safeLastRow(clientes), linhasLidas: 0 }
    };
    try {
      if (lanc) rangesStatus.lancamentos.linhasLidas = numLinhasDados_(lanc, 2);
      if (custos) rangesStatus.custos.linhasLidas = numLinhasDados_(custos, 2);
      if (clientes) rangesStatus.clientes.linhasLidas = numLinhasDados_(clientes, 1);
      addCheck('Ranges dinamicos v3.45', true, 'DATA_ROW_MAX=' + DATA_ROW_MAX + ' · LANCAMENTOS lastRow=' + rangesStatus.lancamentos.lastRow + ' · lidas=' + rangesStatus.lancamentos.linhasLidas, rangesStatus);
      var riscoTrunc600 = rangesStatus.lancamentos.lastRow > 600;
      // lastRow>600 so e risco com range fixo legado (B10:I600). Com DATA_ROW_MAX dinamico, operacao OK.
      var truncOk = !riscoTrunc600 || DATA_ROW_MAX >= 2000;
      addCheck('Risco truncamento legado (600)', truncOk, truncOk
        ? (riscoTrunc600 ? ('lastRow=' + rangesStatus.lancamentos.lastRow + ' — OK com DATA_ROW_MAX=' + DATA_ROW_MAX) : 'lastRow <= 600')
        : ('lastRow=' + rangesStatus.lancamentos.lastRow + ' — exige GAS v3.45+ com ranges dinamicos'));
      if (rangesStatus.lancamentos.lastRow > DATA_ROW_MAX) {
        addCheck('Capacidade planilha', false, 'lastRow=' + rangesStatus.lancamentos.lastRow + ' excede DATA_ROW_MAX=' + DATA_ROW_MAX);
      } else {
        addCheck('Capacidade planilha', true, 'lastRow dentro de DATA_ROW_MAX');
      }
    } catch(eRange) {
      addCheck('Ranges dinamicos v3.45', false, eRange.toString());
    }

    // [v3.19 NOVO] ParÃ¢metros do relatÃ³rio mensal na aba EMAIL.
    var emailConfig = {
      para: emailSheet ? String(safeGetA1(emailSheet, 'C9') || '').trim() : '',
      cc: emailSheet ? String(safeGetA1(emailSheet, 'C10') || '').trim() : '',
      percentual: emailSheet ? safeGetA1(emailSheet, 'C11') : '',
      vencimento: emailSheet ? safeGetA1(emailSheet, 'C12') : ''
    };
    addCheck('EMAIL C9 destinatÃ¡rio', !!emailConfig.para, emailConfig.para || 'Vazio');
    addCheck('EMAIL C11 percentual', !isNaN(parseFloat(emailConfig.percentual)), 'Valor: ' + emailConfig.percentual);
    addCheck('EMAIL C12 dia vencimento', !isNaN(parseInt(emailConfig.vencimento, 10)), 'Valor: ' + emailConfig.vencimento);

    // [v3.19 NOVO] Triggers instalados no projeto.
    var triggers = [];
    try {
      var projectTriggers = ScriptApp.getProjectTriggers();
      for (var t = 0; t < projectTriggers.length; t++) {
        triggers.push({
          handler: projectTriggers[t].getHandlerFunction(),
          eventType: String(projectTriggers[t].getEventType()),
          source: String(projectTriggers[t].getTriggerSource())
        });
      }
      addCheck('Triggers acessÃ­veis', true, triggers.length + ' trigger(s) encontrado(s)', triggers);
      var temKpi = triggers.some(function(tr){ return tr.handler === 'atualizarKPIs'; });
      var temRelatorio = triggers.some(function(tr){ return tr.handler === 'enviarRelatorioMensal'; });
      addCheck('Trigger atualizarKPIs', temKpi, temKpi ? 'Encontrado' : 'NÃ£o encontrado');
      addCheck('Trigger enviarRelatorioMensal', temRelatorio, temRelatorio ? 'Encontrado' : 'NÃ£o encontrado');
    } catch(eTrig) {
      addCheck('Triggers acessÃ­veis', false, eTrig.toString());
    }

    // [v3.19 NOVO] Drive: apenas verifica existÃªncia da pasta, sem criar/alterar.
    var driveStatus = { pastaRelatoriosExiste: false, pastaClientesExiste: false };
    try {
      driveStatus.pastaRelatoriosExiste = DriveApp.getFoldersByName('ZapClin_Relatorios').hasNext();
      driveStatus.pastaClientesExiste = DriveApp.getFoldersByName('ZapClin_Clientes').hasNext();
      addCheck('Drive pasta ZapClin_Relatorios', driveStatus.pastaRelatoriosExiste, driveStatus.pastaRelatoriosExiste ? 'Encontrada' : 'NÃ£o encontrada');
      addCheck('Drive pasta ZapClin_Clientes', driveStatus.pastaClientesExiste, driveStatus.pastaClientesExiste ? 'Encontrada' : 'NÃ£o encontrada');
    } catch(eDrive) {
      addCheck('Drive acessÃ­vel', false, eDrive.toString());
    }

    // [v3.19 NOVO] Gmail/MailApp: checa quota sem enviar e-mail.
    var mailQuota = null;
    try {
      mailQuota = MailApp.getRemainingDailyQuota();
      addCheck('Gmail/MailApp quota', true, 'Quota restante: ' + mailQuota);
    } catch(eMail) {
      addCheck('Gmail/MailApp quota', false, eMail.toString());
    }

    // [v3.19 NOVO] URL do Web App/deployment, quando disponÃ­vel.
    var serviceUrl = '';
    try {
      serviceUrl = ScriptApp.getService().getUrl();
      addCheck('Deployment URL', !!serviceUrl, serviceUrl || 'URL nÃ£o disponÃ­vel neste contexto');
    } catch(eUrl) {
      addCheck('Deployment URL', false, eUrl.toString());
    }

    // [v3.19 NOVO] Teste leve do KPI server-side sem gravar dados.
    var kpiResumo = null;
    try {
      kpiResumo = buscarKpisAdmin_(ss);
      addCheck('buscarKpisAdmin_', !!(kpiResumo && kpiResumo.ok), kpiResumo && kpiResumo.ok ? 'OK' : JSON.stringify(kpiResumo));
    } catch(eKpi) {
      addCheck('buscarKpisAdmin_', false, eKpi.toString());
    }

    // [v3.20 NOVO] Verifica/cria a estrutura de LOGS para garantir observabilidade ativa.
    var logsStatus = null;
    try {
      var logsSheet = getOrCreateLogsSheet_(ss);
      logsStatus = { existe: !!logsSheet, lastRow: safeLastRow(logsSheet) };
      addCheck('LOGS operacional', !!logsSheet, logsSheet ? ('Encontrada Â· lastRow=' + safeLastRow(logsSheet)) : 'NÃ£o encontrada');
    } catch(eLogs) {
      addCheck('LOGS operacional', false, eLogs.toString());
    }

    var duracaoMs = new Date().getTime() - inicio.getTime();
    var falhas = checks.filter(function(c){ return !c.ok; });

    return {
      ok: falhas.length === 0,
      version: VERSION,
      fonte: 'diagnosticoSistema-v3.46',
      timestamp: Utilities.formatDate(new Date(), FUSO, 'dd/MM/yyyy HH:mm:ss'),
      duracaoMs: duracaoMs,
      resumo: {
        totalChecks: checks.length,
        ok: checks.length - falhas.length,
        falhas: falhas.length
      },
      checks: checks,
      sheets: sheetsStatus,
      rangesStatus: rangesStatus,
      emailConfig: emailConfig,
      triggers: triggers,
      driveStatus: driveStatus,
      logsStatus: logsStatus,
      mailQuota: mailQuota,
      deploymentUrl: serviceUrl,
      kpiResumo: kpiResumo
    };

  } catch(err) {
    return {
      ok: false,
      version: VERSION,
      fonte: 'diagnosticoSistema-v3.46',
      error: err.toString(),
      timestamp: Utilities.formatDate(new Date(), FUSO, 'dd/MM/yyyy HH:mm:ss'),
      checks: checks
    };
  }
}



