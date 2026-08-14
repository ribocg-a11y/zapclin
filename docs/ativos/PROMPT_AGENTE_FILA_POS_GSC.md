# PROMPT COMPLETO — Agente ZapClin (fila pós-GSC)

**Cole este prompt inteiro** no agente do repo **`ribocg-a11y/zapclin`**, branch preferencial: `cursor/seo-avancado-entity-c633` (ou `main` se já tiver merge).

**Contexto já concluído (NÃO refazer):**
- Landings PAA publicadas no domínio via repo `zapclinslz` (commit live `4dafda1`)
- HTTP 200 nas 7 páginas + sitemap com 7 `<loc>`
- IndexNow 200 (api.indexnow.org + Bing)
- GSC: indexação solicitada para as 5 URLs novas (evidência humana 11/08/2026):
  1. `/preco-higienizacao-capacete-sao-luis/`
  2. `/quanto-tempo-higienizar-capacete/`
  3. `/como-higienizar-capacete/`
  4. `/higienizacao-vs-lavagem-capacete/`
  5. `/higienizacao-capacete-calhau-golden-shopping/`

**Domínio live:** https://www.zapclinslz.com/  
**Pacote sync canônico:** `site/zapclinslz-sync/`  
**Plano:** `docs/ativos/PLANO_SEO_ROBUSTO_2026-08.md`  
**GAS canônico (não alterar):** `AppsScript_v3.45_ATUAL.gs`  
**Deploy GAS:** nunca `clasp deploy` / nunca criar Deploy ID novo.

---

## Regras gerais do agente

1. Executar as tarefas **na ordem P1 → P2 → …**. Não pular.
2. Ao terminar cada Pn: registrar evidência (comando, HTTP, trecho de doc, link GitHub).
3. Commit + push na branch de trabalho ao fechar cada bloco útil (ou um commit único bem descrito no fim, se preferir — mas **não deixe só local**).
4. Em **toda resposta ao humano**: incluir **links GitHub blob + raw** de cada artefato novo/alterado.
5. Terminar respostas com: `Mudança no AppScript: não` + `AppsScript_v3.45_ATUAL.gs`.
6. **Não** solicitar indexação de novo no GSC; **não** spam IndexNow; **não** inventar AggregateRating/reviews; **não** alterar PWA operacional (`sw.js`, `zc-*.js` de balcão) neste prompt; **não** mudar PIN admin.
7. Trabalho no repo `zapclinslz` só via **prompt de sync** (este agente não pusha lá, salvo se o humano disser que este agente tem acesso — por padrão: gerar prompt + pacote).

---

## P1 — Atualizar estado / handoff (obrigatório)

### Objetivo
Deixar documentado que Fase B (publish + IndexNow + GSC 5/5) está feita e qual é o próximo passo humano.

### Processo
1. Ler: `docs/ativos/HANDOFF_NOVO_CHAT.md`, `docs/ativos/PLANO_SEO_ROBUSTO_2026-08.md`, `docs/ativos/SEO_AVANCADO_ENTITY.md`.
2. Atualizar `HANDOFF_NOVO_CHAT.md`:
   - Data de atualização = hoje (UTC).
   - Seção “Próximo passo” deve refletir: GSC 5/5 solicitado; aguardando indexação; próximo humano = Fase C item 1 (Instagram).
   - Registrar commit live `4dafda1` e branch/PR SEO `cursor/seo-avancado-entity-c633` / PR #15.
3. Atualizar `PLANO_SEO_ROBUSTO_2026-08.md`:
   - Marcar Fase B como ✅ (publish + IndexNow + GSC solicitado).
   - Manter Fase C como pendente humana.
4. Atualizar `SEO_AVANCADO_ENTITY.md` com uma linha de validação 11/08: live 7 URLs + GSC fila.
5. Commit mensagem sugerida: `docs: GSC 5/5 solicitado — Fase B SEO fechada`.

### Evidência
- Links blob dos 3 docs atualizados.
- Trecho da tabela “Próximo passo” do handoff.

---

## P2 — Baseline de monitoramento SERP/HTTP

### Objetivo
Registrar estado **antes** da indexação completa, para comparar em 2–7 dias.

### Processo
1. Garantir `scripts/seo/monitor-serp.sh` executável.
2. Rodar: `bash scripts/seo/monitor-serp.sh docs/ativos/_serp_monitor_baseline_2026-08-11.txt`
3. Verificar HTTP 200 das 7 landings + sitemap (7 locs).
4. Salvar o arquivo de saída no repo **somente se** não contiver dados sensíveis (é ok: status HTTP + títulos DDG).
5. Criar/atualizar `docs/ativos/SEO_MONITOR_LOG.md` com:
   - data/hora UTC
   - contagem sitemap
   - status HTTP resumido
   - notas DDG (brand + serviço) se o script trouxe
   - lembrete: Google SERP real = humano no celular (VM pode CAPTCHA)
6. Commit: `chore(seo): baseline monitor pós-GSC 11/08`.

### Evidência
- Link do log + do baseline txt (se commitado).
- Contagem: `sitemap locs = 7` e amostra de HTTP 200.

### Não fazer
- Não interpretar “ainda não indexou” como falha.
- Não reenviar IndexNow neste passo (já foi 200).

---

## P3 — Auditoria NAP / schema (consistência)

### Objetivo
Garantir que Name / Address / Phone / URL estão idênticos no pacote sync e na lista de citações.

### NAP canônico
- Name: ZapClin  
- Address: Av. dos Holandeses, 200 — Golden Shopping Calhau, Quiosque 01, Calhau, São Luís - MA, CEP 65071-380  
- Phone: (98) 98147-9616 / `+5598981479616`  
- Site: https://www.zapclinslz.com/  
- IG: https://www.instagram.com/zapclinhigienizacao/  
- WhatsApp: https://wa.me/5598981479616  

### Processo
1. Abrir `docs/ativos/CITACOES_NAP_SAO_LUIS.md` e conferir tabela NAP.
2. Grep em `site/zapclinslz-sync/**` por telefone, CEP, Holandeses, 98147, Instagram.
3. Conferir JSON-LD da home + landings (telephone, address, sameAs).
4. Se achar divergência: corrigir no pacote `site/zapclinslz-sync/` **e** espelhar docs.
5. Se corrigiu HTML live-path: gerar/atualizar prompt curto de sync `docs/ativos/PROMPT_SYNC_NAP_FIX.md` (só se houver diff real).
6. Se estiver 100% consistente: documentar “NAP OK — sem patch” em `SEO_MONITOR_LOG.md` ou handoff.

### Evidência
- Tabela “campo → encontrado em X arquivos → OK/DIFF”.
- Links de qualquer patch + prompt sync (se houver).

---

## P4 — Pacote Fase C pronto para o humano (Instagram primeiro)

### Objetivo
O humano não precisa pensar: recebe **1 ação clara** + textos prontos.

### Processo
1. Ler `docs/ativos/PACK_INSTAGRAM_REELS_SEO.md`.
2. Criar `docs/ativos/FASE_C_PASSO_1_INSTAGRAM.md` contendo:
   - Checklist bio IG (texto exato para colar na bio)
   - Link do site oficial
   - WhatsApp
   - Frase de cidade obrigatória
   - **Reel #01 completo** (gancho, roteiro 15s, texto na tela, legenda final, hashtags)
   - Evidência que o humano deve mandar de volta (print da bio + link do Reel publicado)
3. Criar `docs/ativos/PROMPT_HUMANO_FASE_C.md` com a fila humana em ordem:
   1) Bio IG  
   2) Publicar Reel 01  
   3) Pedir 3 avaliações GBP  
   4) 1 post GBP  
   5) Mensagem pronta para Golden Shopping (pedir link)  
   6) 2 citações NAP P0 da lista  
   — cada item com “o que fazer / onde / evidência / não fazer”.
4. Commit: `docs(seo): Fase C passo 1 Instagram + fila humana`.

### Evidência
- Links blob + **raw** dos dois docs.
- Na resposta final ao humano: colar o conteúdo de `FASE_C_PASSO_1_INSTAGRAM.md` (ou raw) para cópia imediata.

---

## P5 — Preparar prompt de sync (só se P3 gerou patch)

### Objetivo
Se houve correção NAP/HTML, o outro agente (`zapclinslz`) publica sem ambiguidade.

### Processo
1. Se P3 = sem diff → escrever no handoff “P5 N/A”.
2. Se P3 = com diff → escrever `PROMPT_SYNC_NAP_FIX.md` com:
   - arquivos exatos a copiar
   - URLs a validar HTTP 200
   - IndexNow só das URLs alteradas
   - evidência esperada do agente `zapclinslz`
3. Entregar raw link ao humano.

---

## P6 — Checklist de espera Google (sem ação repetida)

### Objetivo
Evitar ansiedade operacional e spam.

### Processo
1. Criar `docs/ativos/CHECKLIST_ESPERA_INDEXACAO.md` com:
   - O que já foi pedido (lista 5 URLs)
   - O que NÃO repetir (solicitar indexação de novo / IndexNow diário)
   - Quando rechecar (sugerido: +48h e +7 dias)
   - Como o humano valida (`site:www.zapclinslz.com` no celular; inspeção GSC de 1 URL)
   - Evidência mínima para “destravar” próximo ciclo técnico
2. Commit junto com P4 se possível.

### Evidência
- Link blob + raw do checklist.

---

## P7 — (Opcional, só se sobrar tempo e P1–P6 ok) Melhorias cirúrgicas de conteúdo

### Só fazer se as anteriores estiverem ✅
1. Revisar titles/H1 das 5 landings vs query alvo (sem keyword stuffing).
2. Garantir 2–3 links internos cruzados entre landings (já devem existir).
3. Se melhorar HTML: atualizar sync package + prompt sync dedicado + **não** publicar sozinho no `zapclinslz`.
4. Não criar 10 páginas novas neste ciclo.

---

## Ordem de commits sugerida

1. `docs: GSC 5/5 — Fecha Fase B no handoff/plano` (P1)  
2. `chore(seo): baseline monitor pós-GSC` (P2)  
3. `fix(seo): NAP consistency` **ou** `docs(seo): NAP audit OK` (P3)  
4. `docs(seo): Fase C passo 1 + fila humana + checklist espera` (P4+P6)  
5. Sync prompt se necessário (P5)  

Push: `git push -u origin <branch>`  
Atualizar PR #15 se a branch for `cursor/seo-avancado-entity-c633`.

---

## Formato da resposta final ao humano (obrigatório)

1. Resumo em 5–8 linhas: o que foi feito (P1…Pn).  
2. Tabela: tarefa → status → link GitHub.  
3. **Próxima ação humana única** (deve ser: ajustar bio IG / publicar Reel 01 — com link raw).  
4. O que esperar do Google (sem prazo falso; “horas a dias”).  
5. `Mudança no AppScript: não` · `AppsScript_v3.45_ATUAL.gs`

---

## Fora de escopo deste prompt

- Postar no Instagram / falar com Golden / pedir review (humano)
- Alterar Apps Script / planilha / PIN
- `clasp deploy`
- Homologação PWA balcão / Pacote Z.7 (outra thread)
- Comprar backlinks / fake reviews / cloaking
