# ZapClin - Fase 23 Antecipada

## Design System + Inteligencia Gerencial + Automacoes

Esta fase foi antecipada para organizar a evolucao visual, gerencial e automatizada do ZapClin antes de novas telas isoladas.

## Principios

- Operacao primeiro: nenhuma melhoria visual pode deixar cadastro, fila, WhatsApp ou status mais lentos.
- Visual escuro/neon com menor saturacao constante.
- Verde apenas para sucesso/pronto.
- Laranja apenas para atencao/risco.
- Vermelho apenas para atraso, erro ou cancelamento.
- Numeros, OS, status e tempo precisam ser entendidos em ate 1 segundo.
- Animacoes devem confirmar acao, nao decorar a tela.
- Graficos precisam responder perguntas de decisao.

## Fase 23A - Tokens Visuais E Hierarquia

Status: concluida em `v4.15.0`.

- Criados tokens semanticos de cor no frontend.
- Reduzida a saturacao constante do neon sem perder identidade ZapClin.
- Padronizados estados visuais: sucesso/pronto, atencao e erro/atraso.
- Melhorada a leitura de OS, valor, tempo, status e SLA.
- Criados skeleton/loading para listas operacionais.
- Melhorados toasts para mostrar acao, resultado e proximo passo.
- Adicionado feedback visual ao mudar status operacional.
- Revisada fonte numerica para KPIs e valores.
- Corrigido formato BRL com separador de milhar no padrao brasileiro.
- Reforco v4.14.1: fonte numerica aplicada em todas as telas onde ainda havia classes antigas, sem mudar fluxo operacional.
- Hotfix v4.14.2/v3.31: Revitalizacao passa a ter SLA de 24h/1440min, mantendo soma por capacete e congelamento ao marcar Pronto.
- Reforco v4.15.0: acabamento visual operacional perceptivel com superficies mais limpas, sidebar mais silenciosa, cards e KPIs com hierarquia mais forte, formularios com foco claro, Operacao/CRM/clientes com estados semanticos e responsividade mais polida.

## Fase 23D1 - Relacionamento E Fidelidade

Status: antecipada em `v4.14.0`.

- Criada pagina Relacionamento para gerir recorrencia sem poluir o cadastro.
- Restaurado indicador de visita no card do cliente.
- Consolidacao por telefone para identificar clientes unicos, recorrentes, VIP e 30+ dias.
- Mensagem de manutencao para estimular retorno apos 30 dias.
- Campanha VIP para clientes com frequencia ou valor historico maior.
- Cadastro publico Clube VIP para coletar aniversario e preferencias.
- Link do Clube VIP entra apenas na mensagem de recebimento da primeira visita.
- Mensagem de pronto inclui link de avaliacao Google.
- Hotfix v4.14.3/v3.32: beneficio de aniversario passa a ser auditado, aplicado somente apos cadastro VIP confirmado, em OS aberta, sobre um unico servico de menor valor, com teto de R$ 15 e registro na aba `BENEFICIOS VIP`.

Hotfix backend `v3.29`:

- Corrigida busca robusta das abas com emoji/acentos para evitar erro `getRange` de aba nula.
- Adicionada acao `repararLancamentosClientesHoje` para recuperar atendimentos gravados em CLIENTES sem lancamento financeiro.

Hotfix backend `v3.30`:

- Valida CLIENTES e LANCAMENTOS antes de gravar cadastro com fotos.
- Evita cadastro parcial quando a criacao de lancamentos falhar.
- Mantem a regra de baseline: correcao cirurgica, sem alterar fluxo visual do frontend.

## Fase 23B - Dashboard Executivo

Status: concluida em `v4.16.0`.

- Receita por dia.
- Servicos mais vendidos.
- Margem: vendas menos custos.
- Comparativo semana atual vs semana anterior.
- Melhor dia do mes.
- Leitura estrategica com insights de tendencia, ticket, servico lider e margem.
- Analises consideram apenas lancamentos validos, ignorando cancelados.

## Fase 23C - Operacao E SLA

Status: concluida em `v4.17.0`.

- Tempo medio por servico.
- Percentual dentro do SLA.
- Ranking de horarios de pico.
- Alertas de atraso e proximidade do prazo.
- Leitura fica na propria Fila de Producao para apoiar decisao operacional sem abrir relatorio.

## Fase 23D2 - Cliente E Recorrencia Avancada

Status: concluida em `v4.18.0`.

- Historico do cliente.
- Total gasto.
- Servicos anteriores.
- Mensagem diferente para cliente recorrente.
- Tags de campanha, preferencias, aniversario e consentimento.
- Automacao futura de disparos de aniversario e campanhas sazonais.
- Perfil comercial fica na pagina Relacionamento para preservar o cadastro operacional limpo.

## Fase 23E - Automacoes E Relatorios

Status: concluida em `v4.19.0`.

- WhatsApp guiado por status.
- Relatorio diario resumido.
- Relatorio mensal com leitura estrategica.
- Sugestao de horario de retirada.
- Resumo diario copiavel no Painel Admin, sem alterar backend.
- Leitura estrategica mensal dentro da pagina Relatorio, conectando receita, margem, ticket, top servico e maior custo.

## Gate QA - Auditoria Controlada

Status: concluida em `v4.19.1`.

- Criado ambiente de testes local para validar frontend, service worker, Apps Script e planilha exportada sem alterar dados reais.
- Validadas rotas/paginas, acoes de API, mensagens WhatsApp, SLA, Clube VIP, CRM, Operacao, Relatorio e renders principais.
- Executado stress test com 600 clientes, 1000 lancamentos e 300 custos no harness de frontend.
- Corrigida regressao visual do Clube VIP no card do cliente, exibindo destaque e total antes/depois.
- Removidas sobreposicoes antigas de `renderClienteList` e `atualizarTimers` para reduzir risco de regressao.
- Mantida observacao tecnica: ainda nao ha tempo real pleno; o app atualiza ao abrir pagina/acao/cache. Polling central ou invalidacao global fica como melhoria futura.

## Fase 23F - Ficha CRM E Nova OS Recorrente

Status: concluida em `v4.20.0` com backend `v3.33`.

- Relacionamento passa a abrir ficha completa do cliente ao clicar no card.
- A ficha mostra aniversario, e-mail, modelo/capacete, origem, consentimento, cadastro VIP, total gasto, ticket medio e historico operacional.
- Dados do cadastro VIP deixam de ficar apenas na planilha e passam a ser retornados em `listarClientes` para uso no app.
- Adicionada busca por nome, telefone, OS e servico dentro da pagina Relacionamento.
- Adicionada Nova OS rapida a partir de cliente conhecido, gerando novo atendimento e lancamentos sem preencher nome/telefone novamente.
- Mantida alternativa de cadastro com fotos pre-preenchido quando a OS exigir documentacao visual.

## Fase 23G - Retorno Assistido Com Fotos

Status: entregue em `v4.21.0` com backend `v3.34`.

- A Nova OS do Relacionamento deixa de ser apenas rapida e passa a ser assistida.
- A ficha do cliente exibe fotos anteriores retornadas pelo Drive.
- O operador pode reutilizar uma foto anterior como referencia ou cadastrar foto nova obrigatoria por capacete.
- Ao reutilizar foto, o backend copia a imagem para a nova pasta da OS, mantendo rastreabilidade.
- Servicos e condicoes usam a mesma base operacional do cadastro completo.
- WhatsApp de recebimento passa a reconhecer cliente recorrente, citar dias desde a ultima visita e incentivar cadastro VIP se ainda estiver pendente.
- O fluxo segue para Operacao, mantendo controle de SLA, Pronto, Entregue e mensagem padrao de pronto.
- Reforco `v4.21.1`: nova OS e mudancas de status passam a redesenhar imediatamente as telas dependentes, incluindo Clientes, Vendas, Relacionamento, Operacao, Historico e Home.
- Hotfix `v4.21.2/v3.35`: fotos anteriores deixam de ser carregadas junto com todos os clientes. A ficha/Nova OS do Relacionamento chama `listarFotosCliente` sob demanda, reduzindo lentidao e deixando claro quando o Drive ainda esta carregando. O polling vivo foi encurtado para alinhar aparelhos sem fechar o app.
- Hotfix `v4.21.3`: comparativo semanal do Dashboard passa a usar semana operacional brasileira, de segunda a domingo, e compara contra a semana civil anterior.
- Hotfix `v4.21.4`: Relacionamento passa a iniciar em `Todos`, com filtros na ordem Todos, Manutencao 30+, Recorrentes, VIP, Primeira visita e 60+ dias; a carteira ativa fica em ordem alfabetica.
- Hotfix `v3.36`: backend adiciona `LockService` nas escritas criticas para proteger cadastro com fotos/Nova OS, status, custos, edicoes, cancelamentos, VIP e lancamentos simples em uso simultaneo por varios operadores.
- Hotfix `v3.37`: formulario publico do Clube VIP passa a usar layout mobile-first em tela cheia no celular, com campos e botao maiores para evitar zoom manual.

## Fase 24 - Aceite/Assinatura Simples

Status: iniciada em `v4.22.0` com backend `v3.38`; hotfix visual `v4.22.1` atualiza favicons e icones PWA/Apple com a logo oficial.

- Usa aceite por botao, sem assinatura desenhada.
- Gera link publico por OS via Apps Script.
- Inclui link de aceite na mensagem de recebimento enviada pelo WhatsApp.
- Registra aceite confirmado na aba `ACEITES OS` com data/hora, OS, cliente, telefone, total, servicos, observacoes e versao.
- Retorna status do aceite no `listarClientes` para exibir `Aceite pendente` ou `Aceite confirmado` no card.
- Mantem fluxo rapido de cadastro, Relacionamento e Operacao sem exigir etapa extra antes de registrar o atendimento.
