# ZapClin — Instruções para agentes (Cursor / Codex)

PWA operacional de higienização de capacetes — balcão multioperador, CRM, Painel Admin (PIN) + site marketing.

**Repo ops:** `ribocg-a11y/zapclin` · branch `main`  
**Repo site live:** `ribocg-a11y/zapclinslz` · https://www.zapclinslz.com/  
**URL PWA produção:** https://ribocg-a11y.github.io/zapclin/  
**Cloud Environment (Sheets):** `zapclin`

## Mensagem mínima do usuário

Esta frase **basta** para retomar o projeto:

> Vamos dar continuidade ao projeto ZapClin.

**O agente deve:** ler os docs abaixo → resumir produção + próximo passo → só então trabalhar.

## Antes de qualquer trabalho

Leia **nesta ordem**:

1. [`docs/ativos/HANDOFF_NOVO_CHAT.md`](docs/ativos/HANDOFF_NOVO_CHAT.md) — contexto, produção, próximo passo  
2. [`docs/ativos/ESTADO_ATUAL.md`](docs/ativos/ESTADO_ATUAL.md) — versões e links  
3. [`docs/ativos/ERROS_PWA_2026-07-14.md`](docs/ativos/ERROS_PWA_2026-07-14.md) — incidente 14/07 — 14 erros; não repetir  
4. [`docs/ativos/MAPA_ERROS_FALHAS_EVENTOS_2026-08.md`](docs/ativos/MAPA_ERROS_FALHAS_EVENTOS_2026-08.md) — falhas Cloud/SEO/OAuth  
5. [`docs/ativos/REGRAS_DE_PUBLICACAO_SEGURA.md`](docs/ativos/REGRAS_DE_PUBLICACAO_SEGURA.md) — §11 + §12  
6. [`docs/ativos/ACESSOS_E_AUTORIZACOES.md`](docs/ativos/ACESSOS_E_AUTORIZACOES.md) — papéis, PIN, Environment  
7. [`docs/ativos/PLANO_PRIORIDADES_2026-06.md`](docs/ativos/PLANO_PRIORIDADES_2026-06.md) — checklist  
8. [`docs/ativos/AMBIENTE_CLOUD_ZAPCLIN.md`](docs/ativos/AMBIENTE_CLOUD_ZAPCLIN.md) — secrets Sheets  
9. [`docs/MAPA_PASTAS_LOCAL.md`](docs/MAPA_PASTAS_LOCAL.md) — pastas no C: (não misturar com Movi)

**Prompt pronto:** [`docs/ativos/PROMPT_ABERTURA_NOVO_AGENTE.md`](docs/ativos/PROMPT_ABERTURA_NOVO_AGENTE.md)

**Clone canônico:** `C:\Users\riboc\Documents\Codex\zapclin-repo`  
Planejamento Movi × ZapClin: [`docs/PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md`](docs/PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md)  
Fluxos: [`docs/FLUXOS_OPERACIONAIS.md`](docs/FLUXOS_OPERACIONAIS.md) · Índice: [`docs/INDICE.md`](docs/INDICE.md)

## Agente vs você (resumo)

| Eu (agente) sozinho | Só com seu pedido | Só você |
|---------------------|-------------------|---------|
| Ler docs, editar código, ping GAS, testes | `git commit`, `git push` | Nova versão Web GAS no editor Google |
| Validar versões no repo | Mudanças em `api()` / planilha prod | Homologação no celular/tablet da loja |
| Preparar `.gs` para download | Merge de PR | Script Properties / triggers no GAS |
| Docs SEO / motor em `zapclin` | Push live `zapclinslz` | GSC, Golden backlink, posts IG |

**Nunca:** `clasp deploy` (criar novo Deploy ID), commit de segredos, alterar PIN admin sem pedido explícito, push no remoto errado.

## Papéis no app (resumo)

| Papel | Entrada |
|-------|---------|
| Operador balcão | App aberto (sem login operador hoje — Fase 4 equiparação) |
| Admin | PIN **1321** |
| Cliente VIP | Formulário público Clube VIP |
| Cliente aceite OS | Link na mensagem de recebimento |

## Produção atual (repo main — verificar ping)

| Camada | Versão repo | Ping / live |
|--------|-------------|-------------|
| Frontend | **v4.35.0** | GitHub Pages (após merge #22) |
| Service Worker | **v4.35.0** | `sw.js` |
| GAS (código repo) | **v3.54** (`AppsScript_v3.45_ATUAL.gs`) | arquivo |
| GAS (ping) | **3.54** ✅ | |
| Site marketing | `zapclinslz` | https://www.zapclinslz.com/ ✅ |

**Deploy ID GAS (único — nunca criar outro):**  
`AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg`

**GAS canônico:** `AppsScript_v3.45_ATUAL.gs` (conteúdo v3.54)

Fonte de verdade: header do `.gs`, `APP_VERSION` em `zc-version.js`, `ZAPCLIN_SW_VERSION` em `sw.js`, ping GAS.

## Código canônico

- **GAS:** `AppsScript_v3.45_ATUAL.gs`
- **Frontend:** `index.html` + `zc-*.js` (Pacote Z — ver `PACOTE_Z_MODULARIZACAO.md`)
- **PWA:** `sw.js`, `manifest.json`
- **OAuth Sheets:** `scripts/oauth-sheets/`
- **SEO engine:** `scripts/seo/engine/`
- **Testes:** `scripts/testes/`
- **CI local:** `scripts/pre-push-check.ps1` — rodar antes de push (Windows)

## Regras P0

- Escritas GAS no browser = **GET** com query string (mesmo padrão Movi I15)
- GAS: **Nova versão** no mesmo Deploy ID — nunca `clasp deploy`
- Multioperador: LockService v3.36 — não remover travas sem análise
- WhatsApp = zona crítica — ver `REGRAS_DE_PUBLICACAO_SEGURA.md` §3
- Dois repos + Environment — ver regras §12 e `AMBIENTE_CLOUD_ZAPCLIN.md`
- Escritas críticas (OS+fotos, status) **dependem de internet** — timeout ~10–15s; ver `MAPA_ERROS`

## Estado do projeto (31/08/2026)

- **Produção:** FE/SW **v4.35.0** (PR #22) · GAS **3.54** (arquivo + ping ✅)
- **Incidente 14/07:** documentado — não repetir erros de SW/cache
- **Pacote Z:** Z.9 ✅ (`zc-app.css`); **próximo:** Z.10 `zc-boot.js` (só com pedido)
- **OAuth Desktop:** re-auth 26/08 ✅ (`token.json` no C:) · Environment refresh colado, Cloud novo não testou
- **Planilha:** seed LANÇAMENTOS **01–25/08** ✅
- **SEO:** motor + Reels + playbooks em `main` (não reinventar); humano = Golden Shopping
- **PRs:** #22 Z.9 (esta branch) · **#24 MERGED**
- **Próximo humano:** merge #22 + smoke `?force=v4.35.0` · aceite no WhatsApp · Golden
- **Próximo agente:** Z.10 ou NET-TIMEOUT só com pedido

## Ao encerrar sessão

Atualizar `HANDOFF_NOVO_CHAT.md`, checklist em `PLANO_PRIORIDADES`, `ESTADO_ATUAL.md` se versões mudaram, e `MAPA_ERROS_FALHAS_EVENTOS_2026-08.md` se houver incidente novo.

**Sempre terminar resposta com:** `Mudança no AppScript: sim|não` + caminho/link do `.gs` canônico.
