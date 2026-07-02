# Catálogo de Serviços — Junho/2026

Atualização conforme flyer ZapClin (higienização de capacetes).

## Serviços ativos (6)

| Serviço | Tempo | Preço | Indicação |
|---------|-------|-------|-----------|
| Higienização Rápida | 8 min | R$ 15 | Capacetes não higienizados toda semana |
| Higienização Essencial | 10 min | R$ 18 | Capacetes não higienizados toda semana |
| Higienização Profunda | 12 min | R$ 23 | Capacetes não higienizados por 1 mês |
| Limpeza + Higienização | 20 min | R$ 30 | Capacetes higienizados toda semana |
| Higienização + Lavagem | 45 min | R$ 45 | Lavagem profunda interna/externa |
| Revitalização Premium | 4 h | R$ 70 | Serviço premium completo |

## Nomes legados (histórico)

Lançamentos antigos mantêm os nomes originais na planilha. O sistema resolve preço e SLA via aliases:

- `Limpeza + Hig. Rápida` / `Essencial` / `Profunda` → preços e tempos antigos
- `Revitalização` → R$ 70, SLA 24 h (pedidos históricos)
- Novos pedidos usam `Revitalização Premium` com SLA de 4 h

## Arquivos impactados

| Camada | Arquivo | O que muda |
|--------|---------|------------|
| Frontend | `zc-globals.js` | `SERVICES`, `SERVICE_TIMES`, `LEGACY_SERVICE_ALIASES` |
| Frontend | `zc-whatsapp.js` | `precoServico_()` com fallback legado |
| Frontend | `index.html` | Cards com descrição, cores do donut, insights |
| Backend | `AppsScript_v3.45_ATUAL.gs` v3.46 | `PRECOS`, tempos OS, PDF, dashboard `SVCS`, `salvarRegistro` |
| PWA | `sw.js` | Bump de cache |

## Fluxos afetados

1. **Registrar** — seleção e preço dos 6 serviços
2. **Cadastro OS / CRM** — dropdown de serviços por capacete
3. **Operação** — SLA (`tempoServicoMin_` / `prazoClienteMin_`)
4. **WhatsApp** — valor na mensagem de boas-vindas
5. **Dashboard / Vendas** — ranking e donut (inclui cores para nomes legados)
6. **PDF Golden / relatório** — `PRECOS_SERVICOS_REL_` e validação de unitário
7. **Aba REGISTRAR (planilha)** — `salvarRegistro()` espera 6 checkboxes nas linhas 12, 15, 18, 21, 24, 27

## Ação humana pós-deploy

- Redeploy GAS v3.46 no Apps Script
- Ajustar aba **REGISTRAR** da planilha: 6 serviços com checkboxes alinhados às novas linhas
- Merge PR e validar smoke na loja

## Versões

- Frontend: **v4.30.0**
- Backend: **v3.46**
