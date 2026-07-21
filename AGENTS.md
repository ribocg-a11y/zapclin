# ZapClin — Instruções para agentes (Cursor / Codex)

PWA operacional de higienização de capacetes — balcão multioperador, CRM, Painel Admin (PIN).

**Repo GitHub:** `ribocg-a11y/zapclin` · branch `main`  
**URL produção:** https://ribocg-a11y.github.io/zapclin/

## Mensagem mínima do usuário

Esta frase **basta** para retomar o projeto:

> Vamos dar continuidade ao projeto ZapClin.

**O agente deve:** ler os 4 docs abaixo → resumir produção + próximo passo → só então trabalhar.

## Antes de qualquer trabalho

Leia **nesta ordem**:

1. [`docs/ativos/HANDOFF_NOVO_CHAT.md`](docs/ativos/HANDOFF_NOVO_CHAT.md) — contexto, produção, próximo passo
2. [`docs/ativos/ESTADO_ATUAL.md`](docs/ativos/ESTADO_ATUAL.md) — versões e links
3. [`docs/ativos/ERROS_PWA_2026-07-14.md`](docs/ativos/ERROS_PWA_2026-07-14.md) — **incidente 14/07 — 14 erros mapeados; não repetir**
4. [`docs/ativos/REGRAS_DE_PUBLICACAO_SEGURA.md`](docs/ativos/REGRAS_DE_PUBLICACAO_SEGURA.md) — antes de publicar (inclui §11)
5. [`docs/ativos/ACESSOS_E_AUTORIZACOES.md`](docs/ativos/ACESSOS_E_AUTORIZACOES.md) — papéis, PIN admin, agente vs humano
6. [`docs/ativos/PLANO_PRIORIDADES_2026-06.md`](docs/ativos/PLANO_PRIORIDADES_2026-06.md) — o que fazer agora
7. [`docs/MAPA_PASTAS_LOCAL.md`](docs/MAPA_PASTAS_LOCAL.md) — pastas no C: (não misturar com Movi)

**Clone canônico:** `C:\Users\riboc\Documents\Codex\zapclin-repo`  
Planejamento Movi × ZapClin: [`docs/PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md`](docs/PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md)  
Fluxos: [`docs/FLUXOS_OPERACIONAIS.md`](docs/FLUXOS_OPERACIONAIS.md) · Índice: [`docs/INDICE.md`](docs/INDICE.md)

## Agente vs você (resumo)

| Eu (agente) sozinho | Só com seu pedido | Só você |
|---------------------|-------------------|---------|
| Ler docs, editar código, ping GAS, testes `.ps1` | `git commit`, `git push` | Nova versão Web GAS no editor Google |
| Validar versões no repo | Mudanças em `api()` / planilha prod | Homologação no celular/tablet da loja |
| Preparar `.gs` para download | Merge de PR | Script Properties / triggers no GAS |

**Nunca:** `clasp deploy` (criar novo Deploy ID), commit de segredos, alterar PIN admin sem pedido explícito.

Detalhe: [`ACESSOS_E_AUTORIZACOES.md`](docs/ativos/ACESSOS_E_AUTORIZACOES.md)

## Papéis no app (resumo)

| Papel | Entrada |
|-------|---------|
| Operador balcão | App aberto (sem login operador hoje — Fase 4 equiparação) |
| Admin | PIN **1321** |
| Cliente VIP | Formulário público Clube VIP |
| Cliente aceite OS | Link na mensagem de recebimento |

## Produção atual (repo main — verificar ping)

| Camada | Versão repo | Ping produção |
|--------|-------------|---------------|
| Frontend | **v4.33.6** | GitHub Pages |
| Service Worker | **v4.33.6** | `sw.js` |
| GAS (código repo) | **v3.51** (arquivo `AppsScript_v3.45_ATUAL.gs`) | Nova versão Web pendente |
| GAS (ping) | **3.50** (alvo **3.51**) | ✅ produção |

**Deploy ID GAS (único — nunca criar outro):**  
`AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg`

**GAS canônico:** `AppsScript_v3.45_ATUAL.gs` (conteúdo v3.51)

Fonte de verdade: header do `.gs`, `APP_VERSION` em `zc-version.js`, `ZAPCLIN_SW_VERSION` em `sw.js`, ping GAS.

## Código canônico

- **GAS:** `AppsScript_v3.45_ATUAL.gs`
- **Frontend:** `index.html` + `zc-*.js` (Pacote Z — ver `PACOTE_Z_MODULARIZACAO.md`)
- **PWA:** `sw.js`, `manifest.json`
- **Testes:** `scripts/testes/`
- **CI local:** `scripts/pre-push-check.ps1` — rodar antes de push (Windows)

## Regras P0

- Escritas GAS no browser = **GET** com query string (mesmo padrão Movi I15)
- GAS: **Nova versão** no mesmo Deploy ID — nunca `clasp deploy`
- Multioperador: LockService v3.36 — não remover travas sem análise
- WhatsApp = zona crítica — ver `REGRAS_DE_PUBLICACAO_SEGURA.md` §3

## Estado do projeto (21/07/2026)

- **Produção alvo:** FE/SW **v4.33.6** · GAS **3.51** (ping ainda 3.50 até Nova versão Web)
- **Incidente 14/07:** documentado — não repetir erros de SW/cache
- **Pacote Z:** Z.6 ✅ (`zc-registrar` + `zc-clientes`); **próximo:** Z.7 operação + CRM
- **OAuth planilha:** write validado; scripts em `scripts/oauth-sheets/`
- **Próximo humano:** `?force=v4.33.6` após merge

## Ao encerrar sessão

Atualizar `HANDOFF_NOVO_CHAT.md`, checklist em `PLANO_PRIORIDADES`, e `ESTADO_ATUAL.md` se versões mudaram.

**Sempre terminar resposta com:** `Mudança no AppScript: sim|não` + caminho/link do `.gs` canônico.
