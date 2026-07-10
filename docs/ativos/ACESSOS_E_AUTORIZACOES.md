# ZapClin — Acessos e autorizações

**Data:** 11/06/2026

Quem pode fazer o quê — app, infraestrutura, agente vs humano.

---

## 1. Papéis no app

| Papel | Como entra | O que vê |
|-------|------------|----------|
| **Operador balcão** | App aberto (sem login hoje) | Home, Registrar, Clientes, Operação, CRM |
| **Admin** | PIN **1321** | Dashboard, Vendas, Relatório, Histórico, Custos, Admin |
| **Cliente VIP** | Link formulário público | Cadastro Clube VIP |
| **Cliente aceite** | Link na OS | Confirma aceite digital |

**Backlog Fase 4:** auth operador (nome + PIN) como no Movi Kids.

---

## 2. Infraestrutura

| Recurso | ID / URL | Quem administra |
|---------|----------|-----------------|
| Planilha | `1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug` | Sócio (Google account) |
| GAS Web App | Deploy ID `AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg` | Sócio |
| GitHub Pages | `ribocg-a11y/zapclin` | Merge na `main` |
| Drive (fotos OS) | Pastas por cliente/OS | GAS + operadores |
| Gmail (Golden PDF) | Conta configurada no GAS | Sócio |

---

## 3. Agente vs humano

| Agente (Cursor/Codex) | Com pedido explícito | Só humano |
|------------------------|----------------------|-----------|
| Ler/editar código repo | `git commit` / `git push` | Nova versão Web no editor GAS |
| Ping GAS readonly | Merge PR | Script Properties / triggers |
| Rodar testes `.ps1` | Escrita na planilha via GAS action + PIN (v3.47+) | Login Google planilha (OAuth MCP) |
| Preparar `.gs` para colar | Alterar PIN admin | Homologação física na loja |
| Criar/atualizar docs | Deploy GitHub Pages (via merge) | Compartilhar planilha com terceiros |

**Nunca pelo agente:**

- `clasp deploy` (criar novo deployment);
- Publicar segredos (PIN em repo público já existe no FE — não piorar);
- POST JSON no browser contra GAS.

---

## 4. Integração Movi Kids

| Item | Detalhe |
|------|---------|
| Leitura ZapClin | Movi `financeiro/` + `FinanceiroGeral.gs` |
| Escrita ZapClin via Movi | **Não** — negócios separados |
| Holding | FASE 11 Movi — embed financeiro |

Agente Movi **não** deve alterar GAS ZapClin sem coordenação; agente ZapClin **não** altera planilha Movi.

---

## 5. Acesso planilha (agente)

**Leitura:** GAS Web App (`listar`, `ping`, `diagnosticoSistema`).

**Escrita pontual:** concluída via importação jul/2026 (v3.47, removida em v3.48). Operação normal segue pelo app/PWA.

**Opcional (Cursor desktop):** MCP `google-drive-sheets-auth` — leitura/escrita direta se configurado no PC do sócio.

Sem OAuth: agente usa ping GAS + exportações manuais que o usuário colar.

---

## 6. PIN e dados sensíveis

- PIN admin **1321** está no frontend público — controle operacional de balcão.
- Não commitar: tokens OAuth, senhas Gmail, chaves API.
- Logs Admin (`listarLogsAdmin`) podem conter telefones — tratar como dado operacional.
