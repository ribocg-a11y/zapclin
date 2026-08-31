# ZapClin — Acessos e autorizações

**Data:** 14/08/2026 (atualizado Environment Cloud)

Quem pode fazer o quê — app, infraestrutura, agente vs humano.

---

## 1. Papéis no app

| Papel | Como entra | O que vê |
|-------|------------|----------|
| **Operador balcão** | Usuário + PIN do turno | Home, Registrar, Clientes, Operação, CRM (só a loja dele) |
| **Supervisor** | Usuário + PIN | Igual ao operador + Custos da loja |
| **ADM** | `antonio` + PIN **1321** | As duas lojas, Painel, cadastro de equipe |
| **Cliente VIP** | Link formulário público | Cadastro Clube VIP |
| **Cliente aceite** | Link na OS | Confirma aceite digital |

**Backlog feito (v4.36 / GAS 3.55):** auth operador (nome + PIN) com carimbo de turno. Live após Nova versão GAS + merge.

---

## 2. Infraestrutura

| Recurso | ID / URL | Quem administra |
|---------|----------|-----------------|
| Planilha | `1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug` | Sócio (Google account) |
| GAS Web App | Deploy ID `AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg` | Sócio |
| GitHub Pages (PWA) | `ribocg-a11y/zapclin` | Merge na `main` |
| Site marketing | `ribocg-a11y/zapclinslz` · https://www.zapclinslz.com/ | Merge nesse repo |
| Drive (fotos OS) | Pastas por cliente/OS | GAS + operadores |
| Gmail (Golden PDF) | Conta configurada no GAS | Sócio |
| Cursor Environment | nome **`zapclin`** | Sócio + agentes com Environment |

---

## 3. Agente vs humano

| Agente (Cursor/Codex) | Com pedido explícito | Só humano |
|------------------------|----------------------|-----------|
| Ler/editar código repo | `git commit` / `git push` | Nova versão Web no editor GAS |
| Ping GAS readonly | Merge PR | Script Properties / triggers |
| Rodar testes `.ps1` / `node --check` | Escrita na planilha (OAuth Environment ou GAS+PIN) | Homologação física na loja |
| Preparar `.gs` para colar | Alterar PIN admin | Login Google / re-auth OAuth Desktop |
| Criar/atualizar docs | Deploy Pages (via merge) | Compartilhar planilha com terceiros |
| SEO docs / scripts em `zapclin` | Push live em `zapclinslz` | GSC, Golden backlink, posts IG |

**Nunca pelo agente:**

- `clasp deploy` (criar novo deployment);
- Publicar segredos no git;
- POST JSON no browser contra GAS;
- Alterar PIN admin sem pedido explícito;
- Re-spam GSC/IndexNow em URLs já solicitadas.

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

**Escrita pontual (Cloud):** Environment Cursor **`zapclin`** com:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`

Detalhe: [`AMBIENTE_CLOUD_ZAPCLIN.md`](AMBIENTE_CLOUD_ZAPCLIN.md).

**OAuth Desktop (PC sócio):** scripts em `scripts/oauth-sheets/`; token em `%USERPROFILE%\.config\google-api\`. Ver `OAUTH_PLANILHA_DESKTOP.md` e `MAPA_PASTAS_LOCAL.md`.

**Regra:** escrita em produção **só com pedido explícito** do humano.

Sem OAuth: agente usa ping GAS + exportações manuais que o usuário colar.

---

## 6. PIN e dados sensíveis

- PIN admin **1321** está no frontend público — controle operacional de balcão.
- Não commitar: tokens OAuth, senhas Gmail, chaves API, refresh tokens.
- Logs Admin (`listarLogsAdmin`) podem conter telefones — tratar como dado operacional.
- Se secrets vazarem no chat: rotacionar no Google Cloud + atualizar Environment.

---

## 7. Dois repositórios (protocolo anti-403)

| Repo | Uso |
|------|-----|
| `ribocg-a11y/zapclin` | PWA, GAS arquivo, scripts, docs ops, SEO playbooks |
| `ribocg-a11y/zapclinslz` | Site marketing **live** |

Antes de `git push`: confirmar `git remote -v`. Falha clássica: trabalhar em `zapclinslz` e tentar push em `zapclin` → 403.
