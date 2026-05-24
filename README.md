# ZapClin

PWA operacional para gerenciamento da ZapClin Higienizacao de Capacetes.

## Estado Atual

- Frontend GitHub Pages: `v4.22.1`
- Service Worker/PWA: `v4.22.1`
- Backend Apps Script: `v3.38` pronto para reimplantacao
- URL: https://ribocg-a11y.github.io/zapclin/

## Fase Antecipada

A frente **Design System + Inteligencia Gerencial + Automacoes** foi antecipada para organizar as proximas evolucoes antes de novas telas soltas.

### Direcao

- Manter identidade escura/neon da ZapClin com menor saturacao constante.
- Usar verde apenas para sucesso/pronto, laranja para atencao e vermelho para atraso/erro.
- Criar tokens semanticos de cor para padronizar as telas.
- Melhorar leitura rapida de OS, valor, tempo, status e SLA.
- Evoluir graficos gerenciais: receita por dia, servicos mais vendidos, margem, SLA, horarios de pico e comparativo semanal.
- Adicionar microanimacoes leves, skeleton/loading e toasts mais claros.
- Evoluir automacoes: WhatsApp por status, alertas de atraso, relatorio diario, sugestao de retirada e mensagens para clientes recorrentes.

## Roadmap Reorganizado

1. `Fase 23A` - concluida em v4.15.0 com tokens visuais, hierarquia operacional, skeleton/loading, toasts, feedback visual, fonte numerica revisada, BRL com separador de milhar e acabamento visual perceptivel em cards, KPIs, formularios, listas, Operacao, CRM e mobile.
   - Reforco v4.14.1: padronizacao da fonte numerica em Historico, Vendas, Operacao, CRM, Dashboard, Relatorio e cards operacionais.
2. `Hotfix v4.14.3/v3.32` - adiciona beneficio Clube VIP/aniversario auditado: 30% em 1 servico, menor valor, teto R$ 15, somente com cadastro confirmado e OS aberta.
3. `Hotfix v4.14.2/v3.31` - corrige SLA da Revitalizacao para 24h/1440min no frontend e no backend.
4. `Fase 23D1` - antecipada em v4.14.0 com Relacionamento/CRM, recorrencia, manutencao 30+ dias, campanhas VIP, cadastro de aniversario e link de avaliacao Google.
5. `Hotfix v3.30` - valida CLIENTES/LANCAMENTOS antes do cadastro com fotos para evitar cliente sem atendimento/lancamento.
6. `Fase 23B` - concluida em v4.16.0 com dashboard executivo, receita, margem, comparativo semanal, melhor dia do mes e leitura estrategica.
7. `Fase 23C` - concluida em v4.17.0 com Operacao e SLA: tempo medio por servico, percentual dentro do prazo, ranking de horarios de pico e alertas de proximidade/atraso.
8. `Fase 23D2` - concluida em v4.18.0 com historico comercial do cliente, total gasto, ticket medio, servicos anteriores, tags e mensagem para cliente recorrente.
9. `Fase 23E` - concluida em v4.19.0 com resumo diario copiavel, leitura mensal estrategica, WhatsApp guiado por status e sugestao de retirada.
10. `Gate QA v4.19.1` - auditoria controlada antes da proxima fase: sintaxe, rotas, acoes frontend/backend, base exportada, rastreabilidade, SLA, WhatsApp, Clube VIP, stress de 600 clientes e limpeza de sobreposicoes antigas.
11. `Fase 23F` - concluida em v4.20.0/v3.33 com ficha CRM completa na aba Relacionamento e criacao de nova OS rapida para cliente recorrente.
12. `Fase 23G` - pacote em v4.21.0/v3.34: Nova OS assistida no Relacionamento, galeria de fotos anteriores, reutilizacao/copia de foto do Drive, foto nova obrigatoria quando necessario e WhatsApp personalizado para retorno.
   - Reforco v4.21.1: sincronizacao imediata entre Relacionamento, Clientes, Vendas, Operacao, Historico e Home apos nova OS/status, reduzindo dependencia de refresh manual.
   - Hotfix v4.21.2/v3.35: fotos de capacetes passam a carregar sob demanda ao abrir ficha/Nova OS, removendo peso do carregamento geral de clientes; sincronizacao viva reduzida para alinhar aparelhos em uso sem exigir fechar o app.
   - Hotfix v4.21.3: Dashboard passa a calcular comparativo semanal de segunda a domingo, comparando sempre contra a semana civil anterior.
   - Hotfix v4.21.4: Relacionamento passa a abrir em Todos, com filtros reorganizados e carteira ordenada alfabeticamente.
   - Hotfix v3.36: Apps Script passa a usar trava transacional nas escritas criticas para evitar colisao de linhas quando varios operadores gravam ao mesmo tempo.
   - Hotfix v3.37: formulario publico do Clube VIP passa a ser mobile-first, ocupando a tela inteira no celular com campos maiores e melhor area de toque.
13. `Fase 24` - iniciada em v4.22.0/v3.38 com aceite simples por botao vinculado a OS, link na mensagem de recebimento, status no card e registro auditavel na aba `ACEITES OS`. Hotfix v4.22.1 atualiza favicons e icones PWA/Apple com a logo oficial ZapClin.

## Regra De Evolucao

Nao reescrever do zero. Toda mudanca deve ser incremental, versionada, validada e acompanhada de atualizacao do `sw.js` quando alterar o frontend.
