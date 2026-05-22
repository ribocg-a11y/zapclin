# ZapClin

PWA operacional para gerenciamento da ZapClin Higienizacao de Capacetes.

## Estado Atual

- Frontend GitHub Pages: `v4.13.0`
- Service Worker/PWA: `v4.13.0`
- Backend Apps Script: `v3.27`
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

1. `Fase 23A` - iniciada em v4.13.0 com tokens visuais, hierarquia operacional, skeleton/loading, toasts e feedback visual.
2. `Fase 23B` - dashboard executivo com receita, margem e comparativo semanal.
3. `Fase 23C` - operacao e SLA com tempo medio por servico, percentual dentro do prazo e horarios de pico.
4. `Fase 23D` - historico do cliente, recorrencia e mensagens personalizadas.
5. `Fase 23E` - automacoes e relatorios diario/mensal estrategicos.
6. `Fase 24` - aceite/assinatura simples usando a base de OS/PDF.

## Regra De Evolucao

Nao reescrever do zero. Toda mudanca deve ser incremental, versionada, validada e acompanhada de atualizacao do `sw.js` quando alterar o frontend.
