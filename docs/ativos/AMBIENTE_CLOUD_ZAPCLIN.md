# Ambiente Cloud Cursor — `zapclin`

**Atualizado:** 31/08/2026

## Para quê

Permitir que Cloud Agents escrevam na planilha ZapClin via OAuth **sem** colar secrets no chat e **sem** depender de `token.json` local inválido.

## Como abrir o próximo agente

**Preferido agora (31/08):** Cursor **Desktop** na pasta `C:\Users\riboc\Documents\Codex\zapclin-repo` — ver [`HANDOFF_NOVO_CHAT.md`](HANDOFF_NOVO_CHAT.md) §0. Token = `token.json` no PC.

**Cloud** (só se for nuvem de novo):

1. Cursor → Cloud Agent / Background Agent.  
2. Selecionar **Environment: `zapclin`** (não “default” vazio).  
3. Repo padrão: **`ribocg-a11y/zapclin`**.  
4. Colar o prompt de [`PROMPT_ABERTURA_NOVO_AGENTE.md`](PROMPT_ABERTURA_NOVO_AGENTE.md) (há um bloco focado no Desktop; adapte se for Cloud).

Se o Environment não estiver selecionado, seeds Sheets vão falhar com `invalid_grant` / missing env.

## Secrets esperados (já salvos no Environment)

| Variável | Uso |
|----------|-----|
| `GOOGLE_CLIENT_ID` | OAuth Desktop / installed app |
| `GOOGLE_CLIENT_SECRET` | OAuth |
| `GOOGLE_REFRESH_TOKEN` | Refresh sem browser |

Scripts em `scripts/oauth-sheets/` devem preferir env vars quando presentes (padrão dos seeds ago/2026).

## Regras

- **Nunca** commitar secrets, `token.json`, ou dumps de env.  
- **Nunca** republicar secrets no chat.  
- Escrita na planilha de produção **só** com pedido explícito do humano.  
- Se `invalid_grant` voltar: humano re-roda `npm run auth` no desktop e atualiza `GOOGLE_REFRESH_TOKEN` no Environment.  
- Rotacionar client secret/refresh se houve exposição em chat (sessão 14/08).

## Relação com desktop

| Onde | Token |
|------|-------|
| PC do sócio | `%USERPROFILE%\.config\google-api\` + `OAUTH_PLANILHA_DESKTOP.md` |
| Cloud Agent | Environment `zapclin` secrets |

Infra OAuth compartilhada ZapClin/Movi: ver `MAPA_PASTAS_LOCAL.md` (não misturar clones de app).

## Smoke sugerido (agente com Environment)

```bash
# só com pedido do humano
node scripts/oauth-sheets/<script-readonly-ou-seed>.js
```

Confirmar planilha ID: `1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug`.
