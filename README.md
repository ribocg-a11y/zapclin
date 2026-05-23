# ZapClin

PWA operacional para gerenciamento da ZapClin Higienizacao de Capacetes.

## Estado Atual

- Frontend GitHub Pages: `v4.18.0`
- Service Worker/PWA: `v4.18.0`
- Backend Apps Script: `v3.32` pronto para reimplantacao
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
9. `Fase 23E` - automacoes e relatorios diario/mensal estrategicos.
10. `Fase 24` - aceite/assinatura simples usando a base de OS/PDF.

## Regra De Evolucao

Nao reescrever do zero. Toda mudanca deve ser incremental, versionada, validada e acompanhada de atualizacao do `sw.js` quando alterar o frontend.
