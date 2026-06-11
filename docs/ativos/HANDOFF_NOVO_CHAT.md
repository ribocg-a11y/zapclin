# ZapClin — Handoff para novo chat (ativo)

**Atualizado:** 11/06/2026 (FE **v4.27.4** · GAS repo **v3.44** · fix **v3.45** em PR #1)  
**Função:** único ponto de entrada para qualquer assistente continuar o projeto sem perder contexto.

**GitHub:** `ribocg-a11y/zapclin` · branch `main`

---

## Modelo operacional

| Papel | Aparelho | Quem | Uso típico |
|-------|----------|------|------------|
| **Gestão / dev** | Computador (Cursor) | Sócio/dev | Código, GAS, deploy, testes `.ps1` |
| **Operação** | Celular/tablet na loja | Operadores | Cadastro OS, fila, status, WhatsApp |

**Regras para o agente:**

1. Homologação real de balcão exige **aparelho na loja** — o agente valida ping/HTTP no PC.
2. Vários operadores simultâneos — backend usa LockService (v3.36); não quebrar travas.
3. Admin PIN **1321** — não confundir com PIN Movi (1416).

---

## Como abrir um chat novo

### Opção A — mensagem mínima

```
Vamos dar continuidade ao projeto ZapClin.
```

### O que o agente faz sozinho

- Ler: este arquivo → `PLANO_PRIORIDADES` → `ESTADO_ATUAL` → `REGRAS` → `ACESSOS`
- Informar versões FE/GAS e status do ping produção
- **Toda resposta:** `Mudança no AppScript: sim|não` + link/caminho `.gs` canônico

---

## Produção (verificar sempre no início)

| Camada | Versão repo | Verificação |
|--------|-------------|-------------|
| **Frontend** | **v4.27.4** | `APP_VERSION` em `index.html` · `?force=v4.27.4` |
| **Service Worker** | **v4.27.4** | `ZAPCLIN_SW_VERSION` em `sw.js` |
| **Apps Script (código)** | **v3.44** (main) / **v3.45** (PR #1) | Nova versão Web manual |
| **Apps Script (ping)** | alvo **3.45** após deploy | Ping abaixo |

**Deploy ID GAS:** `AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg`

**Planilha:** `1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug`

**Ping GAS:**  
https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec?action=ping

**GitHub Pages:** https://ribocg-a11y.github.io/zapclin/

---

## Ordem de leitura (obrigatória)

| # | Documento | Para quê |
|---|-----------|----------|
| 1 | **Este arquivo** | Contexto, regras, próximo passo |
| 2 | `PLANO_PRIORIDADES_2026-06.md` | Checklist vivo |
| 3 | `ESTADO_ATUAL.md` | Versões, links, arquivos canônicos |
| 4 | `REGRAS_DE_PUBLICACAO_SEGURA.md` | Travas antes de commit/push/deploy |
| 5 | `ACESSOS_E_AUTORIZACOES.md` | Agente vs humano |
| 6 | `../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md` | Roadmap Movi × ZapClin |
| 7 | `../INDICE.md` | Mapa completo |

### Por tarefa

| Tarefa | Ler |
|--------|-----|
| Deploy GAS | `../../APPSCRIPT_DEPLOY.md` (branch fix) · header do `.gs` |
| Roadmap funcional | `../../ROADMAP_FASE23.md` |
| QA | `../../AUDITORIA_QA_v4.19.1.md` |
| Teste ping/KPI | `../../scripts/testes/TESTE_PING_READONLY.ps1` |
| Equiparação Movi | `../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md` |

---

## Próximo passo (11/06/2026)

| # | Ação | Quem |
|---|------|------|
| 1 | Merge PR #1 + deploy GAS **v3.45** + validar Home = Admin | **Você** (GAS + merge) |
| 2 | Confirmar ping `"version":"3.45"` | Agente + você |
| 3 | Rodar `TESTE_KPI_PARIDADE_READONLY.ps1` — deve passar sem divergência | Agente (PC) |
| 4 | Fase 2 equiparação — padrões GAS (`diagnosticoSistema` padronizado) | Backlog |
| 5 | Fase 3 — modularizar frontend (Pacote Z) | Backlog |

### Incidente conhecido (Home vs Admin)

**Causa:** `listar` lia só `B10:I600`; planilha com `lastRow > 600` truncava dados no frontend enquanto Admin (`buscarKpisAdmin`) lia tudo.

**Fix:** v3.45 ranges dinâmicos + KPI Admin soma **QTD** + fuso `America/Sao_Paulo`.

---

## Comportamento esperado do agente

| # | Ação |
|---|------|
| 1 | Reconhecer continuidade — ler docs ativos |
| 2 | Antes de push: `scripts/pre-push-check.ps1` |
| 3 | Responder com versões, fase ativa, próximo passo, quem faz o quê |
| 4 | Ao encerrar: atualizar este arquivo se algo mudou |
| 5 | Mudanças cirúrgicas — não reescrever monolito sem pedido |

---

## Integração Movi Kids

- Planilha ZapClin é lida pelo **Financeiro Geral** no repo `ribocg-a11y/movikids`
- Equiparação ≠ merge de código — ver `PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md`
- Holding unificada = **FASE 11 Movi** (embed financeiro no admin Movi)
