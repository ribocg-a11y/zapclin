# PROMPT — Agente ZapClin: próximo ciclo (pós-GSC bairros)

**Cole este prompt inteiro** no agente do repo **`ribocg-a11y/zapclin`**, branch **`cursor/seo-avancado-entity-c633`** (PR #15).

Execute **todas** as ações abaixo. Você decide a ordem. Não peça “qual item prefere”. Ao final: commit + push + links blob/raw. Se push falhar (403), diga isso com clareza e deixe patches em artifact — o humano abre agente `zapclin` com write.

---

## Contexto (não refazer do zero)

- Live: https://www.zapclinslz.com/ · enrich bairros `zapclinslz` **`13d4493`** · sitemap **12** URLs
- Sync canônico: `site/zapclinslz-sync/`
- Humano já fez: GSC das **5 URLs de bairro** solicitadas + o que foi pedido antes (IndexNow/sync/GSC PAA)
- Evidência `site:` anterior (~7 URLs): https://share.google/eL4I3ONW11M7hS0Kd — bairros eram o gap
- GAS: `AppsScript_v3.45_ATUAL.gs` — **não alterar** · nunca `clasp deploy`
- Escopo: marketing SEO / `site/` / `scripts/seo/` / `docs/ativos/` — **não** PWA balcão / PIN / planilha

---

## A1 — Documentar evidência humana

1. Atualizar `docs/ativos/HANDOFF_NOVO_CHAT.md`:
   - GSC 5 bairros = solicitado (humano)
   - Próximo = ciclo técnico abaixo + alavancas Golden/reviews se ainda pendentes
2. Atualizar `docs/ativos/SEO_MONITOR_LOG.md` e `docs/ativos/GSC_PEDIDO_BAIRROS.md` (marcar feito).
3. Se existir `ALAVANCAS_HUMANAS_ALTO_IMPACTO.md`, marcar item GSC como ✅.

---

## A2 — Revalidar indexação dos bairros

1. HTTP 200 nas 5 URLs de bairro + sitemap (12 locs).
2. Best-effort: probes públicos / anotar se ainda dependem de `site:` humano.
3. **Não** re-spam IndexNow/GSC nas URLs já pedidas, salvo se HTTP ≠ 200 ou página sumiu.
4. Registrar resultado em `SEO_MONITOR_LOG.md`.

URLs:
- https://www.zapclinslz.com/higienizacao-capacete-renascenca-sao-luis/
- https://www.zapclinslz.com/higienizacao-capacete-cohama-sao-luis/
- https://www.zapclinslz.com/higienizacao-capacete-ponta-d-areia-sao-luis/
- https://www.zapclinslz.com/higienizacao-capacete-sao-francisco-sao-luis/
- https://www.zapclinslz.com/higienizacao-capacete-turu-sao-luis/

---

## A3 — Motor master completo

```bash
python3 scripts/seo/engine/run_master.py
python3 scripts/seo/engine/apply_master_patches.py
python3 scripts/seo/engine/schema_lint.py   # exit 0
python3 scripts/seo/engine/run_master.py
bash scripts/seo/monitor-serp.sh docs/ativos/_serp_monitor_$(date -u +%Y%m%d).txt
```

Atualizar `docs/ativos/SEO_MASTER_REPORT.md`.

Aplicar só patches com critério:
- PageRank: links faltando para money pages / bairros
- CTR: title lift ≥ 8 com geo+brand preservados
- Factory: **só** se `gap_priority` alto e quality gate passar (não farm)

---

## A4 — Delta sync `zapclinslz` (se houver mudança real)

Se `site/zapclinslz-sync/` mudou:
1. Escrever `docs/ativos/PROMPT_SYNC_DELTA_ATUAL.md` (arquivos + URLs + IndexNow só do delta).
2. Na resposta final: links blob/raw + **texto completo** do prompt para o humano colar no agente **`zapclinslz`**.
3. Se este run tiver write no `zapclinslz`, pode aplicar e reportar commit SHA + HTTP + IndexNow.

---

## A5 — Reel #03 (marketing / sinal social)

1. Tema **diferente** de #01 (8 min) e #02 (odor): ex. Calhau/Golden landmark, higienização vs lavagem, ou chuva/secagem.
2. `social_signal_score` ≥ **80** (meta 100).
3. Render 9:16 · 1080×1920 · ~15–20s → `docs/ativos/marketing-ig/zapclin-reel-03-*`
4. Legenda `.txt` + poster.
5. Entregar links:
   - blob da pasta
   - **raw/download** do MP4 (`github.com/.../raw/...` — não só blob)
   - raw da legenda

---

## A6 — CTR / meta nas páginas com lift residual

1. Rodar `ctr_lab.py`.
2. Aplicar candidatos com lift ≥ 8 (ou documentar “nenhum lift≥8”).
3. Alinhar `og:title` / description quando title mudar.
4. Incluir no sync delta se live divergir.

---

## A7 — Entidade / NAP / colisão

1. Lint NAP (tel, CEP, Holandeses, IG, site).
2. Manter desambiguação vs `zapclin.com` (JáPedeAí) sem ataque.
3. `schema_lint` exit 0.

---

## A8 — Pacote humano restante (só texto, se ainda aberto)

Atualizar `ALAVANCAS_HUMANAS_ALTO_IMPACTO.md`:
- Golden backlink (texto pronto)
- Review GBP pós-OS (texto pronto)
- O que não repetir (GSC/IndexNow nas já pedidas)

Na resposta final: **uma** ação humana restante (a de maior impacto ainda aberta). Se GSC bairros já ✅, priorizar Golden **ou** reviews — não os dois na mesma frase como “faça tudo”.

---

## A9 — Git / PR

1. Commit + `git push -u origin cursor/seo-avancado-entity-c633`
2. Atualizar PR #15 se necessário
3. Toda resposta com links blob + raw

---

## Formato da resposta final

1. O que rodou / mudou (curto)
2. Tabela: ação → status → link
3. Prompt sync `zapclinslz` (se houver) — completo ou raw
4. Links Reel #03 (raw MP4 + legenda)
5. **Uma** ação humana agora
6. `Mudança no AppScript: não` · `AppsScript_v3.45_ATUAL.gs`

---

## Proibido

- `clasp deploy` / novo Deploy ID
- Alterar PIN / PWA operacional / WhatsApp de OS
- Fake reviews / cloaking / doorway sem quality gate
- Spam IndexNow/GSC em massa
- Parar no meio pedindo escolha de item
