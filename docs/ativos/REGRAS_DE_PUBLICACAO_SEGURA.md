# ZapClin — Regras de publicação segura

**Data:** 14/07/2026 (atualizado pós-incidente PWA)  
**Origem:** adaptado do protocolo Movi Kids para operação real ZapClin (multioperador, WhatsApp, planilha compartilhada).

Este documento é trava operacional. Nenhuma mudança futura deve ser publicada sem passar por estas regras.

**Incidente 14/07/2026:** ler obrigatoriamente [`ERROS_PWA_2026-07-14.md`](ERROS_PWA_2026-07-14.md) antes de mexer em Dashboard, `sw.js` ou versionamento.

---

## Regra 0 — Operação primeiro

Nenhuma melhoria visual ou gerencial pode deixar cadastro, fila, WhatsApp ou status mais lentos ou menos confiáveis.

---

## Regra 1 — Declarar escopo antes de mexer

Antes de qualquer pacote, declarar:

- prioridade: `P0`, `P1`, `P2` ou `P3`;
- problema exato;
- arquivos que podem ser alterados;
- arquivos intocados;
- impacto na operação (multioperador?);
- rollback previsto.

Se o pacote for só frontend, **não** mexer em Apps Script, planilha ou triggers.

---

## Regra 2 — Checklist obrigatório antes de publicar

Antes de commit/push:

- [ ] `scripts/pre-push-check.ps1` ok (ou `-SkipNetworkTests` se offline);
- [ ] `APP_VERSION` em `zc-version.js` / `index.html` alinhado com `ZAPCLIN_SW_VERSION` em `sw.js`;
- [ ] caches `STATIC_CACHE` / `RUNTIME_CACHE` em `sw.js` atualizados com a versão;
- [ ] **`node --check` no script inline do `index.html` que contém `goTo`/`init`** (gate anti-SyntaxError);
- [ ] `zc-version.js` preserva `WEB_APP`, `BACKEND_MIN_VERSION` e demais constantes;
- [ ] Service Worker **continua registrado** (não deixar só `unregister` de recovery);
- [ ] Apps Script declarado como alterado ou não;
- [ ] WhatsApp declarado como alterado ou não;
- [ ] URL `?force=VERSAO` informada após deploy FE;
- [ ] rollback e arquivo anterior identificados.

---

## Regra 3 — WhatsApp é zona crítica

Qualquer alteração em:

- abertura `wa.me` / `api.whatsapp.com`;
- mensagens por status (recebimento, pronto, retirada);
- normalização de telefone Brasil (`55 + DDD + número`);
- cópia para área de transferência antes de abrir app;

deve ser tratada como **risco operacional alto**.

### Validação mínima

- `98 9242-8208` → `5598992428208` (nono dígito celular);
- `98 99242-8208` → `5598992428208` (não duplicar 9);
- Telefone inválido → bloquear envio;
- Tablet/celular: fallback se app WhatsApp não abrir.

---

## Regra 4 — Cache e atualização automática

Toda mudança de frontend deve:

- subir `APP_VERSION` em `zc-version.js` (e marcações do `index.html`);
- subir `ZAPCLIN_SW_VERSION` e nomes de cache em `sw.js`;
- informar URL com `?force=VERSAO` (ex.: `https://ribocg-a11y.github.io/zapclin/?force=v4.33.3`);
- nunca publicar `index.html` novo com `sw.js` antigo;
- manter o toast padrão do SW: **“Nova versão disponível. Atualizando…”** + **“Sistema atualizado para …”**;
- **não** inventar banner full-screen de versão; **não** desligar o SW como atalho de hotfix.

---

## Regra 5 — Separar frontend de backend

| Pacote | Pode alterar | Não alterar |
|--------|--------------|-------------|
| Só FE | `index.html`, `sw.js`, CSS inline | `.gs`, planilha |
| Só GAS | `AppsScript_vX.XX_ATUAL.gs` | FE (salvo `BACKEND_MIN_VERSION`) |
| Full stack | Ambos + docs | Deploy ID GAS |

Quando GAS mudar:

1. Renomear/atualizar arquivo `.gs` na raiz;
2. **Nova versão Web** no mesmo Deploy ID (humano);
3. Validar ping `"version":"X.XX"`;
4. Atualizar `ESTADO_ATUAL.md` e `HANDOFF`.

---

## Regra 6 — Escritas GAS no browser

- Escritas críticas = **GET** com query string via `apiGet()` — nunca POST JSON no PWA.
- Multioperador: manter LockService (v3.36) em ações de escrita.
- Após salvar: reconciliação v4.26 (`buscarLancamentos` etc.).

---

## Regra 7 — Planilha e ranges

- Nunca usar range fixo que ignore `lastRow` (incidente linha 600 — fix v3.45).
- KPI Admin deve usar mesma regra que Home: soma **QTD**, fuso `America/Sao_Paulo`.
- Lançamentos cancelados não entram em faturamento.

---

## Regra 8 — Admin PIN

- PIN atual operacional: **1321** (definido em `ADMIN_CONFIG` no frontend).
- Não alterar PIN, bloqueio ou tentativas máximas sem pedido explícito do sócio.
- Frontend é público no GitHub Pages — PIN é controle operacional, não segurança bancária.

---

## Regra 9 — Testes mínimos por tipo de mudança

| Mudança | Teste |
|---------|-------|
| Qualquer push | `pre-push-check.ps1` |
| GAS / KPI | `TESTE_PING_READONLY.ps1` + `TESTE_KPI_PARIDADE_READONLY.ps1` |
| WhatsApp | Matriz §3 manual no celular |
| CRM / fotos | Cadastro teste + ficha Relacionamento |
| Admin | Painel PIN + diagnóstico + fechamento diário |

---

## Regra 10 — Resumo ao encerrar sessão

Toda resposta do agente termina com:

```
Mudança no AppScript: sim|não
Arquivo: AppsScript_vX.XX_ATUAL.gs
Download: (link raw GitHub se aplicável)
Próximo passo humano: (Nova versão Web? merge? tablet?)
```

---

## Regra 11 — Travas pós-incidente PWA (14/07/2026)

Derivadas de [`ERROS_PWA_2026-07-14.md`](ERROS_PWA_2026-07-14.md). Violação = não publicar.

1. **Sintaxe:** nunca mergear `index.html` com SyntaxError no app inline.
2. **Inserção de código:** funções novas *antes* das existentes; jamais “trocar só a assinatura”.
3. **SW:** nunca fallback HTML→JS; nunca deixar SW permanentemente desligado após recovery.
4. **Update:** só o fluxo oficial (`SW` + toast + `?force=`); proibido boot forçado a cada bump.
5. **UI recovery:** proibido overlay full-screen que só some via `init()`.
6. **Valores:** tipografia de dinheiro = Inter (`--font-data`), não Syne.
7. **Charts SVG:** largura = card (sem letterbox).
8. **Escopo:** feature de Dashboard ≠ redesenhar versionamento/PWA na mesma entrega sem pedido.
9. **Restauro:** último commit com JS válido (`node --check`), não a última feature.
10. **Registro:** qualquer novo incidente PWA atualiza `ERROS_PWA_*.md` no mesmo PR.

---

## Rollback rápido

| Camada | Ação |
|--------|------|
| Frontend | Reverter commit + `?force=versao-anterior` |
| GAS | Nova versão Web apontando para código anterior no editor |
| Planilha | Restaurar aba via histórico Google Sheets (humano) |
