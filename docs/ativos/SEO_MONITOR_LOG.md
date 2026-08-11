# SEO monitor log — ZapClin

## Baseline 2026-08-11 15:12 UTC

| Check | Resultado |
|-------|-----------|
| Sitemap `<loc>` | **7** |
| HTTP landings + home + sitemap + llms + robots | **200** em todas |
| Live publish | `zapclinslz` commit `4dafda1` |
| IndexNow | 200 (já feito no publish) |
| GSC 5 landings novas | fila prioritária (humano 11/08) |
| DDG parse no script | falhou grep lookbehind nesta VM (não bloqueia) |
| NAP audit (P3) | **OK — sem patch** (`+5598981479616`, CEP, Holandeses, IG) |

Arquivo bruto: [`_serp_monitor_baseline_2026-08-11.txt`](_serp_monitor_baseline_2026-08-11.txt)

**Nota:** SERP Google real = humano no celular (VM costuma CAPTCHA).

### Próximo monitor
- +48h / +7d: rerodar `bash scripts/seo/monitor-serp.sh` e anexar entrada aqui.

## Update 2026-08-11 ~21h UTC

- Live enrich: `zapclinslz` `13d4493` (FAQ×5 bairros)
- `site:` humano ~7 URLs indexadas (share Google) — bairros ainda fora
- Próximo humano: GSC 5 bairros (`GSC_PEDIDO_BAIRROS.md`)
- Reel #02 gerado (odor/motoboy)

## Ciclo pós-GSC bairros (11/08 ~22h UTC)

- GSC 5 bairros: ✅ humano
- Live PageRank links em `/quanto-tempo/`: `zapclinslz` `2a0bcb3` · IndexNow 200
- HTTP bairros 200 · sitemap 12
- Reel #03 Calhau gerado
- Próximo humano: Golden backlink
