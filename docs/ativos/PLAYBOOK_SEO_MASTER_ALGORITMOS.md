# Playbook Master — Engenharia de sinais + algoritmos (ZapClin)

**Nível:** avançado · **Escopo:** marketing `www.zapclinslz.com` + distribuição social  
**Não é:** checklist de bio, “pedir indexação de novo”, truque mágico de algoritmo fechado.

Google / Instagram / Bing **não expõem** o ranqueador. O que um time master faz é **engenharia de sinais + automação + medição** — código que altera o que o ranqueador *pode* observar, com loops de feedback.

---

## Tese operacional

| Camada | O que o algoritmo “vê” | O que nós programamos |
|--------|------------------------|------------------------|
| Recuperação | URLs crawláveis, sitemap, IndexNow, links | Factory + freshness pipeline |
| Relevância | Conteúdo × intenção × entidade | Query graph + cobertura + schema |
| Autoridade local | NAP, citações, GBP, backlinks, reviews | Citation crawler + outreach pack |
| Engajamento | CTR, dwell (proxy), social | Title CTR lab + Reel signal scorer |
| Entidade | `@graph`, sameAs, co-ocorrência | Entity reinforcement |

---

## Pacote de ações MASTER (prioridade)

### M1 — Internal PageRank + injeção de links (código)
**Impacto:** redistribui “juice” para landings de serviço (hoje Cap Box ganha no social; no site, a home pode monopolizar autoridade).  
**Motor:** `scripts/seo/engine/internal_pagerank.py`  
**Saída:** ranking de URLs + edges fracos + patch sugerido de links internos.  
**Algoritmo:** PageRank amortecido (d=0.85) no grafo de âncoras do pacote sync.

### M2 — Query–Intent Graph + coverage score
**Impacto:** decide *o que* construir depois com matemática, não feeling.  
**Motor:** `scripts/seo/engine/query_graph.json` + `coverage.py`  
**Saída:** score 0–100 por cluster (local, preço, tempo, vs, bairro, odor…).  
**Regra:** só gera landing se `coverage < limiar` **e** `intent_value ≥ limiar` **e** passa anti-doorway (conteúdo mínimo + FAQ real).

### M3 — Schema CI / entity lint
**Impacto:** rich results e consistência de entidade (telefone, CEP, sameAs).  
**Motor:** `scripts/seo/engine/schema_lint.py`  
**Saída:** exit code ≠ 0 se JSON-LD quebrado / NAP drift / Offer sem preço.  
**Uso:** gate antes de sync para `zapclinslz`.

### M4 — Freshness → IndexNow diferencial
**Impacto:** crawl budget inteligente (só URL cujo hash mudou).  
**Motor:** `scripts/seo/engine/freshness.py`  
**Saída:** manifesto de hashes + ping IndexNow só do delta.  
**Anti-spam:** cooldown + max N URLs/dia.

### M5 — SERP / competitor gap scorer
**Impacto:** quantifica por que Cap Box IG / Golden / GuiaPJ vencem cada query.  
**Motor:** `scripts/seo/engine/serp_gap.py`  
**Saída:** matriz query × tipo de resultado (IG, Maps, site, diretório) + gap score.  
**Nota:** Google CAPTCHA em datacenter → DDG/Bing HTML + evidência humana celular.

### M6 — Title/Meta CTR lab (bandit simples)
**Impacto:** títulos que mudam CTR mudam ranking indireto.  
**Motor:** `scripts/seo/engine/ctr_lab.py`  
**Algoritmo:** gerar 5 variantes por URL; score heurístico (tamanho, número, geo, poder); rotacionar `title`/`og:title` com log A/B (GSC depois).

### M7 — Reel / social signal scorer (proxy do algoritmo IG)
**Impacto:** não “hackeia” IG; **otimiza proxies** (hook 3s, densidade geo, CTA, loop).  
**Motor:** `scripts/seo/engine/social_signal_score.py`  
**Saída:** score 0–100 + gaps no roteiro/legenda antes de renderizar MP4.

### M8 — Programmatic local modifiers (bairros) com quality gate
**Impacto:** captura “perto de mim” / bairro sem doorway farm.  
**Algoritmo:** seed bairros SLZ × serviço; gera página **só se** distância/relevância ao Calhau + conteúdo único ≥ N tokens + 1 FAQ local.  
**Código:** `scripts/seo/engine/local_modifier_factory.py` (gera no sync; publish via agente `zapclinslz`).

### M9 — Entity collision defense (`zapclin.com` ≠ ZapClin SLZ)
**Impacto:** desambiguação de marca.  
**Ações código:** `alternateName`, texto “ZapClin São Luís / MA”, sameAs estrito, evitar brand genérico só “ZapClin” em titles sem geo.

### M10 — Observabilidade contínua
**Impacto:** fecha o loop.  
**Motor:** `scripts/seo/engine/run_master.py` → `docs/ativos/SEO_MASTER_REPORT.md` + JSON.  
**Cadência:** a cada mudança de sync ou +48h.

---

## O que NÃO fazer (mesmo sendo “avançado”)
- Cloaking, doorway farms, fake reviews, link schemes pagos opacos  
- Spam IndexNow/GSC  
- Afirmar controle do algoritmo do Google/IG  
- Alterar PWA/GAS neste pacote  

---

## Ordem de execução do agente (só código)

1. Rodar `python3 scripts/seo/engine/run_master.py`  
2. Aplicar patches de links internos se PageRank indicar buracos (M1)  
3. Se coverage gap alto: gerar 1–2 landings via factory (M2/M8) — max qualidade  
4. Schema lint OK → freshness IndexNow se live já tiver as URLs  
5. Atualizar `SEO_MASTER_REPORT.md` + push branch SEO  
6. Entregar links blob/raw + **próxima ação humana de alto impacto** (não bio): ex. backlink Golden OU 10 reviews GBP com script de pedido  

---

## Próxima alavanca humana (alto impacto, não iniciante)

| Prioridade | Ação | Por quê mexe no algoritmo |
|------------|------|---------------------------|
| H1 | Backlink na lista de lojas do Golden | Autoridade local / co-citação |
| H2 | Rajada de reviews GBP reais (pedido sistemático pós-OS) | Local pack ranking |
| H3 | Reels com score M7 ≥ 80 + geo tag | Descoberta social → Google |

Código deste playbook: `scripts/seo/engine/`  
Prompt agente: `PROMPT_AGENTE_MASTER_ALGORITMOS.md`
