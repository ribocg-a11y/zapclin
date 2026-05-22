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

Status: iniciada em `v4.13.1`.

- Criados tokens semanticos de cor no frontend.
- Reduzida a saturacao constante do neon sem perder identidade ZapClin.
- Padronizados estados visuais: sucesso/pronto, atencao e erro/atraso.
- Melhorada a leitura de OS, valor, tempo, status e SLA.
- Criados skeleton/loading para listas operacionais.
- Melhorados toasts para mostrar acao, resultado e proximo passo.
- Adicionado feedback visual ao mudar status operacional.
- Revisada fonte numerica para KPIs e valores.
- Corrigido formato BRL com separador de milhar no padrao brasileiro.

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

Hotfix backend `v3.29`:

- Corrigida busca robusta das abas com emoji/acentos para evitar erro `getRange` de aba nula.
- Adicionada acao `repararLancamentosClientesHoje` para recuperar atendimentos gravados em CLIENTES sem lancamento financeiro.

Hotfix backend `v3.30`:

- Valida CLIENTES e LANCAMENTOS antes de gravar cadastro com fotos.
- Evita cadastro parcial quando a criacao de lancamentos falhar.
- Mantem a regra de baseline: correcao cirurgica, sem alterar fluxo visual do frontend.

## Fase 23B - Dashboard Executivo

- Receita por dia.
- Servicos mais vendidos.
- Margem: vendas menos custos.
- Comparativo semana atual vs semana anterior.

## Fase 23C - Operacao E SLA

- Tempo medio por servico.
- Percentual dentro do SLA.
- Ranking de horarios de pico.
- Alertas de atraso e proximidade do prazo.

## Fase 23D2 - Cliente E Recorrencia Avancada

- Historico do cliente.
- Total gasto.
- Servicos anteriores.
- Mensagem diferente para cliente recorrente.
- Tags de campanha, preferencias, aniversario e consentimento.
- Automacao futura de disparos de aniversario e campanhas sazonais.

## Fase 23E - Automacoes E Relatorios

- WhatsApp guiado por status.
- Relatorio diario resumido.
- Relatorio mensal com leitura estrategica.
- Sugestao de horario de retirada.

## Fase 24 - Aceite/Assinatura Simples

Adicionar aceite digital leve ou registro de confirmacao usando a base de OS/PDF ja criada.
