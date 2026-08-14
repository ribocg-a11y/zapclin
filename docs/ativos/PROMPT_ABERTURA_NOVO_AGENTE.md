# Prompt de abertura — novo agente ZapClin

**Cole tudo abaixo** na primeira mensagem do novo Cloud Agent.  
**Environment Cursor:** selecione **`zapclin`** (secrets Google OAuth).  
**Repo:** `ribocg-a11y/zapclin` (não abrir só `zapclinslz` se a tarefa for ops/docs/PWA).

---

```
Vamos dar continuidade ao projeto ZapClin.

Você é o próximo Cloud Agent. Faça handoff limpo a partir dos docs — não invente estado.

## Leitura obrigatória (nesta ordem) antes de qualquer código
1. docs/ativos/HANDOFF_NOVO_CHAT.md
2. docs/ativos/ESTADO_ATUAL.md
3. docs/ativos/ERROS_PWA_2026-07-14.md
4. docs/ativos/MAPA_ERROS_FALHAS_EVENTOS_2026-08.md
5. docs/ativos/REGRAS_DE_PUBLICACAO_SEGURA.md
6. docs/ativos/ACESSOS_E_AUTORIZACOES.md
7. docs/ativos/PLANO_PRIORIDADES_2026-06.md
8. docs/ativos/AMBIENTE_CLOUD_ZAPCLIN.md
9. AGENTS.md (raiz)

Depois: resuma em 8–12 linhas (produção FE/SW/GAS ping, PRs abertos, próximo passo humano vs agente) e só então proponha/execute o próximo passo.

## Premissas P0
- GAS canônico: AppsScript_v3.45_ATUAL.gs — Deploy ID único (nunca clasp deploy / nunca novo Deploy ID).
- FE/SW em main: v4.33.9; GAS arquivo 3.52; ping produção ainda 3.51 até humano publicar.
- Escritas browser→GAS = GET + query string.
- Nunca commit de segredos. Planilha só com pedido explícito (exceto se eu pedir seed nesta sessão).
- Site live = repo zapclinslz; docs/scripts ops = zapclin. Não push no remoto errado.
- WhatsApp = zona crítica. PIN admin 1321 — não alterar sem pedido explícito.
- Incidente PWA 14/07: não repetir erros de SW/cache.
- Sempre terminar resposta com: Mudança no AppScript: sim|não + caminho do .gs.

## Estado que você herda (14/08/2026)
- SEO live + motor em scripts/seo/engine/; PR #15 draft.
- Bairros: GSC 5/5 já solicitado — não re-spam; medir site: / GSC.
- Próximo humano SEO de alto impacto: backlink Golden Shopping (texto em docs/ativos/seo/ALAVANCAS_HUMANAS_ALTO_IMPACTO.md).
- LANÇAMENTOS ago 01–13 já gravados OK; script em PR #16.
- Cloud Environment zapclin tem GOOGLE_CLIENT_ID / SECRET / REFRESH_TOKEN.
- Pacote Z: próximo módulo Z.7 (zc-operacao + zc-crm).

## Branch / git
- Trabalhe em branch cursor/<nome>-c633 a partir de main.
- Commit + push; PR via ManagePullRequest (não gh write).
- Base PR: main.

Comece pela leitura e pelo resumo. Não peça esclarecimentos óbvios cobertos pelos docs.
```

---

## Links úteis após merge

- Handoff: `docs/ativos/HANDOFF_NOVO_CHAT.md`  
- Environment: `docs/ativos/AMBIENTE_CLOUD_ZAPCLIN.md`  
- Produção PWA: https://ribocg-a11y.github.io/zapclin/  
- Site: https://www.zapclinslz.com/  
