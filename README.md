# ZapClin

PWA operacional para gerenciamento da ZapClin Higienizacao de Capacetes.

## Continuidade do projeto (agentes e dev)

Leia primeiro: [`AGENTS.md`](AGENTS.md) → [`docs/ativos/HANDOFF_NOVO_CHAT.md`](docs/ativos/HANDOFF_NOVO_CHAT.md)

| Doc | Uso |
|-----|-----|
| [`docs/INDICE.md`](docs/INDICE.md) | Mapa de documentação |
| [`docs/MAPA_PASTAS_LOCAL.md`](docs/MAPA_PASTAS_LOCAL.md) | Pastas no C: × Movi |
| [`docs/FLUXOS_OPERACIONAIS.md`](docs/FLUXOS_OPERACIONAIS.md) | Diagramas de fluxo |
| [`docs/PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md`](docs/PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md) | Equiparação com Movi Kids |
| [`scripts/pre-push-check.ps1`](scripts/pre-push-check.ps1) | Gate antes de `git push` |
| [`scripts/oauth-sheets/`](scripts/oauth-sheets/) | OAuth leitura/escrita planilha |

## Estado Atual

- Frontend / SW GitHub Pages: **v4.33.4**
- Backend Apps Script (ping): **3.50** (`AppsScript_v3.45_ATUAL.gs`)
- Clone canônico: `C:\Users\riboc\Documents\Codex\zapclin-repo`
- URL: https://ribocg-a11y.github.io/zapclin/?force=v4.33.4
- Pastas no PC: [`docs/MAPA_PASTAS_LOCAL.md`](docs/MAPA_PASTAS_LOCAL.md)
- Fluxos: [`docs/FLUXOS_OPERACIONAIS.md`](docs/FLUXOS_OPERACIONAIS.md)

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
13. `Fase 24` - concluida em v4.23.0/v3.38 com aceite simples por botao vinculado a OS, link na mensagem de recebimento, status no card, registro auditavel na aba `ACEITES OS` e painel administrativo de pendencias/confirmacoes. Hotfix v4.22.1 atualiza favicons e icones PWA/Apple com a logo oficial ZapClin.
14. `Fase 25A` - iniciada em v4.24.0 com visualizacao do relatorio oficial Golden dentro da pagina Relatorio, antes do envio por e-mail, e opcao de imprimir/salvar PDF da previa.
   - Ajuste v4.24.1: reduz fonte dos valores no resumo financeiro para leitura mais institucional.
   - Ajuste v4.24.2/v3.39: prepara historico oficial de abril conciliado com PDF do Golden, respeita coluna `QTD` em lancamentos consolidados e adiciona leitura de evolucao mes contra mes.
   - Ajuste v4.24.3: corrige evolucao para usar abril oficial do PDF quando a planilha ainda estiver parcial, evitando comparativos inflados; reduz mais a fonte numerica do preview.
   - Ajuste v4.24.4: substitui Abril pela base oficial do PDF na planilha exportada e ajusta Relatorio/Dashboard/Vendas para contar atendimentos pela coluna `QTD`, nao por quantidade de linhas.
   - Ajuste v4.24.5: reforca o aceite digital na mensagem de recebimento com link destacado para a tela onde o cliente toca no botao de confirmacao.
15. `Fase 25B` - concluida em v4.25.0 com Relatorio Golden v2: leitura oficial mais institucional, bloco de evolucao do negocio, nota de governanca para base historica consolidada e protecao contra composicao por servico falsa quando a importacao vem agregada do PDF.
16. `Fase 25C` - backend preparado em v3.40 para enviar e salvar no Drive o Relatorio Golden v2, alinhando o PDF oficial/e-mail ao preview validado no app. Hotfix v3.41 remove alerta UI do teste para permitir execucao segura pelo editor. Hotfix v3.42 melhora texto de mes de referencia e acabamento de base consolidada no PDF. Hotfix v3.43 troca comparativo sem base anterior por bloco de base de referencia historica.
17. `Fase 26` - iniciada em v4.26.0 com reconciliacao curta apos escritas criticas no frontend, usando refresh forcado depois de salvar servico, custo, cadastro, status e edicoes. Hotfix v4.26.1 unifica as regras de fila ativa entre Home, Clientes e Operacao; hotfix v4.26.2 restaura a Home para contar atendimentos reais do dia pela aba LANCAMENTOS; hotfix v4.26.3 explicita que lancamento avulso e valido, conta no faturamento/Home/Vendas, mas nao entra em Clientes/Operacao. Backend v3.44 passa a devolver o vinculo CLIENTE/OS na action listar para essa leitura. Hotfix v4.26.4 adiciona diagnostico de consistencia no Painel Admin para mostrar servicos do dia, OS ativas, lancamentos vinculados, avulsos e pendencia de reimplantacao v3.44. Hotfix v4.26.5 adiciona diagnostico backend manual no Admin, usando `diagnosticoSistema` para checar planilha, triggers, Drive, Gmail, logs e deployment. Hotfix v4.26.6 adiciona saude da sincronizacao local, com pendencias offline, idade da fila, conexao e atalho seguro para sincronizar.
18. `Fase 27` - iniciada em v4.27.0 com fechamento diario no Painel Admin. O checklist cruza LANCAMENTOS, CLIENTES/OS, aceites, custos e fila offline local, gera pendencias acionaveis e permite copiar um resumo de encerramento sem alterar backend ou dados operacionais. Hotfix v4.27.1 adiciona no Dashboard um grafico semanal combinado, com receita e quantidade de atendimentos por Semana 01 a 05 do mes selecionado. Hotfix v4.27.2 melhora a leitura no celular com resumo semanal em linhas e corrige o donut de servicos para a legenda cobrir todas as fatias. Hotfix v4.27.3 substitui o canvas semanal por cards interativos com hover/click, usando fonte padrao do ZapClin e painel de leitura por semana. Hotfix v4.27.4 corrige as semanas para calendario operacional de segunda a domingo, com primeira e ultima semana parciais dentro do mes.

## Regra De Evolucao

Nao reescrever do zero. Toda mudanca deve ser incremental, versionada, validada e acompanhada de atualizacao do `sw.js` quando alterar o frontend.
