# PROMPT ÚNICO — Agente ZapClin: FAÇA TUDO QUE DER

**Cole este prompt inteiro** no agente do repo **`ribocg-a11y/zapclin`**, branch **`cursor/seo-avancado-entity-c633`** (PR #15).

Você decide a ordem. Execute **todas** as ações abaixo que ainda não estiverem feitas ou que precisem atualizar. Não peça permissão item a item. Não entregue checklist de iniciante como “trabalho”. Ao final: commit + push + links blob/raw + o que falta humano.

---

## Contexto (já feito — NÃO refazer do zero)

- Domínio live: https://www.zapclinslz.com/
- Sync MASTER live: commit `zapclinslz` **`4d0da50`** (12 URLs sitemap, IndexNow 200)
- Fonte pacote: `site/zapclinslz-sync/` · tip `zapclin` ~`4f69e59`+
- GSC: 5 landings PAA já solicitadas antes; bairros novos podem ainda não estar na fila
- **Evidência SERP (humano, share Google):** `site:www.zapclinslz.com` já lista home + como + tempo + vs + São Luís + preço + Calhau. **Bairros (Renascença/Cohama/Ponta d’Areia/São Francisco/Turu) ainda NÃO aparecem nesse `site:`** → priorizar indexação/descoberta deles.
- GAS canônico: `AppsScript_v3.45_ATUAL.gs` — **não alterar** · nunca `clasp deploy`
- Escopo: marketing SEO/site/scripts/docs — **não** PWA balcão / PIN / planilha prod

---

## BLOCO A — Documentar evidência + estado

1. Atualizar `docs/ativos/HANDOFF_NOVO_CHAT.md` e `SEO_MONITOR_LOG.md` / `SEO_MASTER_REPORT.md` com:
   - live `4d0da50`
   - `site:` Google já mostra ~7 URLs (listar quais)
   - bairros ainda fora do `site:` → próximo foco técnico
2. Registrar link da evidência: `https://share.google/eL4I3ONW11M7hS0Kd`

---

## BLOCO B — Motor master (algoritmos)

Rodar e aplicar o que faltar:

```bash
python3 scripts/seo/engine/run_master.py
python3 scripts/seo/engine/apply_master_patches.py
python3 scripts/seo/engine/schema_lint.py   # exit 0 obrigatório
python3 scripts/seo/engine/run_master.py
```

Inclui: PageRank, coverage/gaps, schema lint, freshness, CTR lab, social scorer, SERP gap, factory.

Se houver patches (titles lift≥8, links, conteúdo): atualizar `site/zapclinslz-sync/` + sitemap + llms.

---

## BLOCO C — Indexação das URLs de bairro (preparar + sync se preciso)

URLs que precisam entrar no Google (ainda sumidas no `site:`):

1. https://www.zapclinslz.com/higienizacao-capacete-renascenca-sao-luis/
2. https://www.zapclinslz.com/higienizacao-capacete-cohama-sao-luis/
3. https://www.zapclinslz.com/higienizacao-capacete-ponta-d-areia-sao-luis/
4. https://www.zapclinslz.com/higienizacao-capacete-sao-francisco-sao-luis/
5. https://www.zapclinslz.com/higienizacao-capacete-turu-sao-luis/

Ações do agente:
1. Validar HTTP 200 live em cada uma.
2. Criar `docs/ativos/GSC_PEDIDO_BAIRROS.md` com as 5 URLs + instrução de 1 linha: “GSC → Inspeção → Solicitar indexação”.
3. Re-ping IndexNow **só dessas 5** (não spam geral) via `scripts/seo/notify-indexnow.sh` com args das 5 URLs.
4. Se conteúdo thin / schema fraco: enriquecer no sync (FAQ extra, ângulo único, links) **antes** de pedir sync de novo.

---

## BLOCO D — Enriquecer landings de bairro (anti-thin)

Para cada página de bairro no sync:
- Subir densidade útil (sem keyword stuffing): como chegar do bairro, tempos, preços, CTA WhatsApp, 3–5 FAQs reais, links cruzados para preço/tempo/Calhau/home.
- Manter quality gate (geo + preço + processo profissional).
- Schema FAQ/Service ok (`schema_lint` exit 0).
- Atualizar `PROMPT_SYNC_*` delta se HTML mudou.

---

## BLOCO E — Sync para `zapclinslz` (se houver delta novo)

Se alterou `site/zapclinslz-sync/`:
1. Escrever/atualizar `docs/ativos/PROMPT_SYNC_DELTA_ATUAL.md` (arquivos exatos + URLs + IndexNow delta).
2. Na resposta final ao humano: colar o prompt completo + links blob/raw para ele colar no agente **`zapclinslz`**.
3. Este agente **não** pusha `zapclinslz` (salvo se tiver acesso explícito neste run).

---

## BLOCO F — Marketing / algoritmo social (código + assets)

1. Rodar `social_signal_score` — só publicar roteiros com score ≥ 80.
2. Gerar **Reel #02** (9:16, ~15–20s, 1080×1920) tema diferente do #01 (ex.: odor / motoboy / Calhau landmark) com `scripts/seo/render-reel-01.py` adaptado ou novo `render-reel-02.py`.
3. Salvar em `docs/ativos/marketing-ig/` + legenda `.txt` + README.
4. Commit + links de download blob/raw.

---

## BLOCO G — CTR / titles / meta

1. Rodar `ctr_lab.py`.
2. Aplicar titles com lift ≥ 8 preservando ZapClin + São Luís/Calhau.
3. Alinhar `og:title` / meta description quando o title mudar.
4. Se live divergir: incluir no prompt de sync.

---

## BLOCO H — Entidade / NAP / colisão de marca

1. Auditoria NAP (tel, CEP, Holandeses, IG, site) no sync vs `CITACOES_NAP_SAO_LUIS.md`.
2. Reforçar desambiguação vs `zapclin.com` (JáPedeAí) onde fizer sentido (texto/FAQ) — sem atacar marca terceira.
3. `sameAs` coerente (IG + domínio oficial).

---

## BLOCO I — Observabilidade

1. `bash scripts/seo/monitor-serp.sh docs/ativos/_serp_monitor_$(date -u +%Y%m%d).txt`
2. Atualizar `SEO_MONITOR_LOG.md` com HTTP, sitemap count, notas.
3. Comparar com baseline 11/08 e com o `site:` (7 URLs humanas vs 12 no sitemap).

---

## BLOCO J — Pacote humano de alto impacto (só preparar textos — não executar contas)

Criar/atualizar um único doc `docs/ativos/ALAVANCAS_HUMANAS_ALTO_IMPACTO.md` com textos prontos:
1. Pedido de backlink Golden Shopping (lista de lojas)
2. Script curto de pedido de review GBP pós-OS (WhatsApp)
3. Lista GSC das 5 URLs de bairro (copiar/colar)
4. O que NÃO fazer (re-spam IndexNow/GSC nas URLs já indexadas do `site:`)

---

## BLOCO K — Git / PR

1. Commit(s) claros na branch `cursor/seo-avancado-entity-c633`
2. `git push -u origin cursor/seo-avancado-entity-c633`
3. Atualizar descrição do PR #15 se necessário
4. Toda resposta: **links blob + raw** de cada artefato novo

---

## Resposta final obrigatória (formato)

1. O que rodou / o que mudou (lista curta)
2. Tabela: ação → status → link
3. Prompt de sync `zapclinslz` (se houver delta) — texto completo ou raw
4. **Uma** ação humana agora (a de maior impacto entre: GSC 5 bairros | Golden | reviews)
5. `Mudança no AppScript: não` · `AppsScript_v3.45_ATUAL.gs`

---

## Proibido

- `clasp deploy` / novo Deploy ID GAS
- Alterar PIN admin / PWA operacional / WhatsApp operacional de OS
- Fake reviews / cloaking / doorway farm sem quality gate
- Spam IndexNow/GSC em massa nas URLs já no `site:`
- Parar no meio pedindo “qual item prefere” — execute o pacote
