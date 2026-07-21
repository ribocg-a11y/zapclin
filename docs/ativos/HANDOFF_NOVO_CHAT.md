# ZapClin — Handoff para novo chat (ativo)

**Atualizado:** 21/07/2026 (FE **v4.33.3** · GAS ping **3.50** · org pastas + OAuth)  
**Função:** único ponto de entrada para qualquer assistente continuar o projeto sem perder contexto.

**GitHub:** `ribocg-a11y/zapclin` · branch `main` (trabalho local: `cursor/organizacao-local-zapclin-f0f3`)  
**Clone canônico:** `C:\Users\riboc\Documents\Codex\zapclin-repo`

---

## Modelo operacional

| Papel | Aparelho | Quem | Uso típico |
|-------|----------|------|------------|
| **Gestão / dev** | Computador (Cursor) | Sócio/dev | Código, GAS, deploy, testes `.ps1`, OAuth |
| **Operação** | Celular/tablet na loja | Operadores | Cadastro OS, fila, status, WhatsApp |

**Regras para o agente:**

1. Homologação real de balcão exige **aparelho na loja** — o agente valida ping/HTTP no PC.
2. Vários operadores simultâneos — backend usa LockService (v3.36); não quebrar travas.
3. Admin PIN **1321** — não confundir com PIN Movi (1416).
4. **Antes de mexer em SW/Dashboard/versão:** ler `ERROS_PWA_2026-07-14.md` + `REGRAS` §11.
5. **Pasta canônica só:** `zapclin-repo` — ver `docs/MAPA_PASTAS_LOCAL.md`. Não editar Continuidade/Downloads.

---

## Como abrir um chat novo

### Opção A — mensagem mínima

```
Vamos dar continuidade ao projeto ZapClin.
```

### O que o agente faz sozinho

- Ler: este arquivo → `ESTADO_ATUAL` → `ERROS_PWA_2026-07-14` → `REGRAS` → `ACESSOS` → `PLANO_PRIORIDADES`
- Conferir pasta = `zapclin-repo` e ping produção
- **Toda resposta:** `Mudança no AppScript: sim|não` + link/caminho `.gs` canônico

---

## Produção (verificar sempre no início)

| Camada | Versão | Verificação |
|--------|--------|-------------|
| **Frontend** | **v4.33.3** | `zc-version.js` · `?force=v4.33.3` |
| **Service Worker** | **v4.33.3** | ativo · toast de update padrão |
| **Apps Script (ping)** | **3.50** | ping abaixo |
| **Apps Script (arquivo)** | `AppsScript_v3.45_ATUAL.gs` | conteúdo v3.50 |
| **OAuth planilha** | Desktop OK | `scripts/oauth-sheets/test-zapclin-write.js` |

**Deploy ID GAS:** `AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg`

**Planilha:** `1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug`

**Ping GAS:**  
https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec?action=ping

**GitHub Pages:** https://ribocg-a11y.github.io/zapclin/?force=v4.33.3

---

## Ordem de leitura (obrigatória)

| # | Documento | Para quê |
|---|-----------|----------|
| 1 | **Este arquivo** | Contexto, regras, próximo passo |
| 2 | `ESTADO_ATUAL.md` | Versões, links, arquivos canônicos |
| 3 | `ERROS_PWA_2026-07-14.md` | **14 erros mapeados — não repetir** |
| 4 | `REGRAS_DE_PUBLICACAO_SEGURA.md` | Travas (§11 pós-incidente) |
| 5 | `ACESSOS_E_AUTORIZACOES.md` | Agente vs humano |
| 6 | `PLANO_PRIORIDADES_2026-06.md` | Checklist vivo |
| 7 | `../MAPA_PASTAS_LOCAL.md` | Onde está cada pasta no C: |
| 8 | `../FLUXOS_OPERACIONAIS.md` | Diagramas de fluxo |
| 9 | `../INDICE.md` | Mapa completo |

### Por tarefa

| Tarefa | Ler |
|--------|-----|
| Deploy GAS | `../../APPSCRIPT_DEPLOY.md` · header do `.gs` |
| Dashboard / SW / versão | `ERROS_PWA_2026-07-14.md` + Regra 11 |
| Teste ping/KPI | `PROTOCOLO_DIAGNOSTICO_E_TESTES.md` |
| Arquitetura | `MAPA_CODIGO_ARQUITETURA.md` |
| Planilha via OAuth | `OAUTH_PLANILHA_DESKTOP.md` |
| Modularização FE | `PACOTE_Z_MODULARIZACAO.md` |

---

## Incidente 14/07/2026 (resumo)

- Projeção v4.32.0 introduziu SyntaxError → navegação morta.
- Hotfixes de SW pioraram (HTML→JS, banner, SW off, boot forçado).
- Restauro estável: base v4.31.1 → projeção republicada com gate → **v4.33.3**.
- **14 erros** registrados em `ERROS_PWA_2026-07-14.md` e travados na Regra 11.

---

## Próximo passo (21/07/2026)

| # | Ação | Quem |
|---|------|------|
| 1 | Homologar loja: `?force=v4.33.3` + Dashboard projeção | **Você** |
| 2 | Commit/push desta organização + merge OAuth (PR #6 / branch org) | Você + agente (se pedir) |
| 3 | **Próximo código:** Pacote Z.5 — `zc-nav.js` + `zc-home.js` | Agente (após homologação) |
| 4 | Não reintroduzir erros do incidente 14/07 | Agente |

---

## Comportamento esperado do agente

| # | Ação |
|---|------|
| 1 | Reconhecer continuidade — ler docs ativos **incluindo erros 14/07** |
| 2 | Antes de push FE: checklist Regra 2 + `node --check` no app inline |
| 3 | Responder com versões, próximo passo, quem faz o quê |
| 4 | Ao encerrar: atualizar este arquivo + `ESTADO_ATUAL` se algo mudou |
| 5 | Mudanças cirúrgicas — não redesenhar fluxo de update no meio de feature visual |
| 6 | ZapClin e Movi = **repos/pastas separados**; OAuth é infra compartilhada |

---

## Integração Movi Kids

- Planilha ZapClin é lida pelo **Financeiro Geral** no repo `ribocg-a11y/movikids`
- Equiparação ≠ merge de código — ver `PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md`
- Holding unificada = **FASE 11 Movi**
