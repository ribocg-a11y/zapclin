# ZapClin — Arquitetura multi-unidade

**Data:** 31/08/2026  
**Status:** implementado no branch `cursor/auth-turnos-v436` (FE v4.36.0 / GAS 3.55). Live após Nova versão GAS + merge.  
**Não apaga dados atuais.** Golden recebe `UNIDADE=golden` em todas as linhas existentes.

**Mockup ao vivo (teste):** https://ribocg-a11y.github.io/zapclin/rede.html  
**Canvas (leitura visual):** abrir no Cursor ao lado do chat.

---

## 1. O problema

Hoje o ZapClin é **uma loja** (Golden Shopping Calhau): um PWA, um GAS, uma planilha, PIN admin **1321**, operador **sem login**.

Você vai abrir **Rio Anil** e depois mais lojas. Precisa:

1. Quem opera uma unidade **não entra** na outra.
2. Você (HQ) vê **todas** numa tela: caixa, operação, KPIs.
3. Clique na loja = o sistema de hoje, filtrado só nela.
4. Cadastro de usuário com **perfil** (só lança vs vê financeiro do dia vs HQ).
5. Crescer sem copiar o app a cada loja.

Isso é a **Fase 4** (auth operador) + **Fase 5** (cockpit) do [`PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md`](../PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md), agora com **tenant = unidade**.

---

## 2. Comparação (o que o mercado faz × o que cabe no ZapClin)

| Modelo | Quem usa | Isolamento | HQ numa tela | Cabe no ZapClin agora |
|--------|----------|------------|--------------|------------------------|
| **Um app por loja** (URL/planilha/GAS distintos) | Franquia com donos separados | Forte | Não — vira Excel | **Não.** Novo Deploy ID é proibido; WhatsApp/PIN duplicam. |
| **Três portas Movi** (balcão / colaboradores / admin) | Um tablet, uma loja, três apps | Por *função*, não por loja | Não | **Não copiar literal.** Serve ao Movi; aqui o risco é o operador trocar de porta e ver a outra loja. |
| **Shared schema + `unidade_id`** (Toast/Square/redes POS; SaaS retail) | Mesmo dono, N lojas | Login + filtro no servidor | Sim | **Sim — recomendado.** Um PWA, um GAS, uma planilha. |
| **Postgres + RLS** | Dezenas de lojas, auditoria dura | Motor do banco | Sim | Destino se a rede crescer muito. **Não** é o 1º passo (perderíamos a planilha que o Movi já lê). |

**Decisão:** um sistema, coluna `UNIDADE` em toda linha operacional, sessão com unidade **fixa no cadastro do usuário** (o cliente não escolhe loja na URL).

---

## 3. Entrada (em vez das três portas)

**Não** colocar Golden e Rio Anil como dois cartões clicáveis no tablet da loja.

Fluxo profissional:

1. Tela inicial única: marca ZapClin + **usuário + PIN** (4–6 dígitos).
2. GAS valida hash, devolve sessão `{perfil, unidadeId}` — unidade **não** vem do browser.
3. Perfil **HQ** → cockpit consolidado.
4. Qualquer outro perfil → balcão **só daquela unidade**.

O Movi inspira o *cuidado visual* da porta (calma, uma escolha). A *regra* é identidade primeiro, como qualquer POS de rede.

### Senha na planilha?

**Não em texto.** Frontend é público (GitHub Pages). Aba `USUARIOS` com senha = vazamento.

- PIN curto (padrão de balcão no Brasil).
- Hash SHA-256 + sal no GAS (`Script Properties` ou coluna `PIN_HASH`).
- Login **não** via query string GET (logs). Action `loginOperador` com o mesmo cuidado das escritas atuais.
- Bloqueio após N tentativas (já existe no PIN admin).
- PIN **1321** permanece como fallback HQ até a migração terminar — **não** misturar com PIN de operador.

Você configura no cadastro: nome, PIN, **perfil**, **unidade** (ou “todas” se HQ).

---

## 4. Papéis (configuráveis)

| Código | Nome na UI | Unidade | Lança OS / status | Vê caixa e KPI do dia | Vê outras lojas |
|--------|------------|---------|-------------------|------------------------|-----------------|
| `operador` | Operador balcão | 1 | Sim | Não | Não |
| `supervisor` | Responsável da loja | 1 | Sim | Custos e operação da loja | Não |
| `adm` | Administração (sócio) | todas | Sim | Todas, uma tela | Sim |

Novos perfis = linha de permissões, não fork do app.

---

## 5. Dados (zero perda)

**Uma planilha** (`1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug`).

Abas novas:

- `UNIDADES` — `id`, `nome`, `slug`, `whatsapp`, `ativa`  
  Linhas iniciais: `golden` (Golden Shopping Calhau), `rio-anil`.
- `USUARIOS` — `id`, `nome`, `pin_hash`, `perfil`, `unidade_id`, `ativo`

Coluna `UNIDADE` (ou `UNIDADE_ID`) em `CLIENTES`, `📊 LANÇAMENTOS`, `CUSTOS` (e logs se fizer sentido).

**Migração:** todas as linhas existentes ← `golden`. OS, seed 01–25/08, fotos Drive, aceite: intactos. Rio Anil nasce vazia.

OS: manter numeração **global** (mais simples no HQ). Exibir `GOLDEN-293` só na UI se quiser. Prefixo por loja é fase posterior.

Filtro **no GAS**, não só no JS: `listar`, `salvar`, `atualizarStatus`, KPIs. O tablet não pode pedir `unidade=anil` e ver Anil se a sessão é Golden.

LockService: manter, passando a incluir a unidade no nome da trava.

WhatsApp: número **por unidade** na aba `UNIDADES` (zona crítica — não misturar chips).

Movi `FinanceiroGeral.gs`: continua lendo a mesma planilha; depois agrupa por `UNIDADE`.

---

## 6. Cockpit HQ (uma tela)

Quatro blocos na **mesma** página. Valores = os de hoje, **por loja** + linha **Rede**.

| Bloco | Macro (HQ) | Detalhe (clique na loja) |
|-------|------------|---------------------------|
| Operação | OS abertas, atrasos SLA, prontos | Fila Operação atual |
| Financeiro | Receita hoje/mês, ticket, resultado | Dashboard + fechamento |
| Custos | Custo dia/mês, margem | Aba Custos |
| Gráficos | Barras Golden × Anil (hoje e 7 dias) | Projeção / vendas da loja |

Não inventar métrica nova no 1º corte. Só **repetir e lado a lado**.

---

## 7. O que não fazer

1. Segundo PWA / segundo Deploy ID / `clasp deploy`.
2. `?loja=` na URL como controle de acesso.
3. Senha em texto na planilha ou PIN de operador no `zc-admin.js` público como fonte da verdade.
4. Apagar ou “zerar” histórico Golden para “começar Anil”.
5. POST JSON no browser (regra I15 / escritas GET).
6. Unificar ZapClin com o balcão Movi.

---

## 8. Fases de implementação (só com pedido)

| Fase | Entrega | Quebra o balcão Golden? |
|------|---------|-------------------------|
| **U0** | Abas + coluna `UNIDADE=golden` | Não (app ignora a coluna) |
| **U1** | Login PIN + sessão (Fase 4) | Sim, no dia do corte: tablet passa a exigir usuário |
| **U2** | GAS filtra por unidade da sessão | Não se só Golden tiver usuários |
| **U3** | Cockpit HQ | Não |
| **U4** | Cadastro de usuários no Admin HQ; 3ª loja = linha em `UNIDADES` | Não |

**Humano no corte U1:** cadastrar operadores Golden **antes** de ligar o login obrigatório, senão o tablet da loja trava.

GAS: **Nova versão** no Deploy ID atual. FE bump (`v4.36+` sugerido) + `?force=`.

---

## 9. Diagnóstico agora

Produção live ainda **uma unidade sem login** (v4.35.0 / GAS 3.54). Código de login/unidade está no branch `cursor/auth-turnos-v436`.

Mudança no AppScript deste arquivo: não (só doc).
