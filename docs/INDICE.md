# ZapClin — Índice de documentação

**Atualizado:** 21/07/2026

---

## Entrada (ler primeiro)

| Documento | Descrição |
|-----------|-----------|
| [`../AGENTS.md`](../AGENTS.md) | Instruções para agentes |
| [`ativos/HANDOFF_NOVO_CHAT.md`](ativos/HANDOFF_NOVO_CHAT.md) | Handoff ativo |
| [`ativos/ESTADO_ATUAL.md`](ativos/ESTADO_ATUAL.md) | Versões e links |
| [`ativos/ERROS_PWA_2026-07-14.md`](ativos/ERROS_PWA_2026-07-14.md) | **14 erros do incidente PWA — proibido repetir** |
| [`ativos/REGRAS_DE_PUBLICACAO_SEGURA.md`](ativos/REGRAS_DE_PUBLICACAO_SEGURA.md) | Travas deploy (+ §11) |
| [`ativos/PLANO_PRIORIDADES_2026-06.md`](ativos/PLANO_PRIORIDADES_2026-06.md) | Checklist vivo |
| [`MAPA_PASTAS_LOCAL.md`](MAPA_PASTAS_LOCAL.md) | Pastas no C: × canônico × Movi |
| [`FLUXOS_OPERACIONAIS.md`](FLUXOS_OPERACIONAIS.md) | Diagramas de fluxos |
| [`ativos/MAPA_CODIGO_ARQUITETURA.md`](ativos/MAPA_CODIGO_ARQUITETURA.md) | Anatomia código |
| [`ativos/PROTOCOLO_DIAGNOSTICO_E_TESTES.md`](ativos/PROTOCOLO_DIAGNOSTICO_E_TESTES.md) | Protocolo testes Z0–Z6 |
| [`ativos/PACOTE_Z_MODULARIZACAO.md`](ativos/PACOTE_Z_MODULARIZACAO.md) | Modularização frontend |
| [`ativos/OAUTH_PLANILHA_DESKTOP.md`](ativos/OAUTH_PLANILHA_DESKTOP.md) | Escrita planilha via OAuth |

---

## Planejamento

| Documento | Descrição |
|-----------|-----------|
| [`PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md`](PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md) | Equiparação Movi × ZapClin (8 fases) |
| [`../ROADMAP_FASE23.md`](../ROADMAP_FASE23.md) | Roadmap funcional ZapClin |
| [`../AUDITORIA_QA_v4.19.1.md`](../AUDITORIA_QA_v4.19.1.md) | Gate QA |
| [`../RELATORIO_BASE_E_VISUAL_v4.14.1.md`](../RELATORIO_BASE_E_VISUAL_v4.14.1.md) | Base visual |

---

## Referência / histórico

| Documento | Descrição |
|-----------|-----------|
| [`referencia/REGRAS_DE_OURO_ZAPCLIN.md`](referencia/REGRAS_DE_OURO_ZAPCLIN.md) | Princípios originais |
| [`referencia/README.md`](referencia/README.md) | O que é “referência” |

---

## Deploy e código

| Documento / artefato | Descrição |
|----------------------|-----------|
| [`../README.md`](../README.md) | Visão geral repo |
| [`../APPSCRIPT_DEPLOY.md`](../APPSCRIPT_DEPLOY.md) | Deploy GAS |
| `AppsScript_v3.45_ATUAL.gs` | Backend canônico (conteúdo **v3.50**) |
| `index.html` + `zc-*.js` | Frontend Pacote Z (parcial) |
| `sw.js` | Service Worker |

---

## Scripts e testes

| Script | Descrição |
|--------|-----------|
| [`../scripts/pre-push-check.ps1`](../scripts/pre-push-check.ps1) | Gate antes de push |
| [`../scripts/oauth-sheets/`](../scripts/oauth-sheets/) | OAuth read/write planilha |
| [`../scripts/planilha/`](../scripts/planilha/) | Utilitários Sheets ZapClin |
| [`../scripts/testes/`](../scripts/testes/) | Testes readonly `.ps1` |

---

## Repo irmão (separado)

| Repo | Relação |
|------|---------|
| [`ribocg-a11y/movikids`](https://github.com/ribocg-a11y/movikids) | Holding financeiro · referência governança — **código em outra pasta** |
| `google-drive-sheets-auth` | Infra OAuth compartilhada (não é o app) |
