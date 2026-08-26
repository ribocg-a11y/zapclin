# Prompt de abertura — novo agente ZapClin

**Cole o bloco abaixo** na primeira mensagem.  
**Environment:** `zapclin` · **Repo:** `ribocg-a11y/zapclin`

---

```
Vamos dar continuidade ao projeto ZapClin.

Você é o próximo Cloud Agent. Leia os docs — não invente estado.

## Leitura obrigatória (nesta ordem) antes de código
1. docs/ativos/HANDOFF_NOVO_CHAT.md
2. docs/ativos/ESTADO_ATUAL.md
3. docs/ativos/ERROS_PWA_2026-07-14.md
4. docs/ativos/MAPA_ERROS_FALHAS_EVENTOS_2026-08.md
5. docs/ativos/REGRAS_DE_PUBLICACAO_SEGURA.md
6. docs/ativos/ACESSOS_E_AUTORIZACOES.md
7. docs/ativos/PLANO_PRIORIDADES_2026-06.md
8. docs/ativos/AMBIENTE_CLOUD_ZAPCLIN.md
9. AGENTS.md

Resuma em 8–12 linhas (FE/SW/GAS ping, PRs abertas, humano vs agente) e só então trabalhe.

## Premissas P0
- GAS: AppsScript_v3.45_ATUAL.gs · Deploy ID único · nunca clasp deploy.
- Produção 14/08: FE/SW v4.34.0 · GAS arquivo e ping 3.52.
- Escritas browser→GAS = GET + query string.
- Sem secrets no git. Planilha só com pedido explícito (Environment zapclin).
- Site live = zapclinslz; ops/docs/PWA = zapclin. Confirmar git remote antes de push.
- WhatsApp zona crítica. PIN 1321 — não alterar sem pedido.
- Incidente PWA 14/07: não repetir SW/cache.
- Terminar com: Mudança no AppScript: sim|não + caminho do .gs.

## Estado herdado (14/08/2026 — limpo)
- PRs abertas: nenhuma.
- Z.7 feito (zc-operacao + zc-crm). Próximo código: Z.9 zc-app.css, ou NET-TIMEOUT (fila OS/status) se o humano pedir.
- SEO motor + Reels 01–03 + playbooks em main. Não reinventar SEO. Humano: Golden Shopping (docs/ativos/ALAVANCAS_HUMANAS_ALTO_IMPACTO.md). GSC bairros: não re-spam.
- Seed LANÇAMENTOS 01–25/08 já na planilha (26/08). OAuth Environment está `invalid_grant` — humano precisa re-auth.
- Loja reportou lentidão/erros ao salvar OS e encerrar: internet ruim (NET-TIMEOUT). Cadastro OS+fotos NÃO tem fila offline.

## Git
- Branch cursor/<nome>-c633 a partir de main.
- Commit + push; PR via ManagePullRequest. Base: main.

Comece pela leitura e pelo resumo.
```

---

## Links

- PWA: https://ribocg-a11y.github.io/zapclin/?force=v4.34.0  
- Site: https://www.zapclinslz.com/  
- Ping GAS: https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec?path=ping  
