# PROMPT MASTER — Agente ZapClin (algoritmos + engenharia de sinais)

Cole no agente do repo **`ribocg-a11y/zapclin`**, branch `cursor/seo-avancado-entity-c633`.

## Missão
Executar o **Playbook Master** (`docs/ativos/PLAYBOOK_SEO_MASTER_ALGORITMOS.md`): ações de alto impacto com código (PageRank, coverage, schema CI, freshness, SERP gap, CTR lab, social scorer, factory de bairros). **Proibido** voltar a checklists de iniciante (bio, “pedir indexação de novo”) como entrega principal.

## Pipeline obrigatório
```bash
python3 scripts/seo/engine/run_master.py
python3 scripts/seo/engine/apply_master_patches.py
python3 scripts/seo/engine/run_master.py
python3 scripts/seo/engine/schema_lint.py   # exit 0
```

## Depois
1. Commit + push na branch SEO; atualizar PR #15.
2. Se factory criou páginas / titles / links: gerar `PROMPT_SYNC_MASTER_DELTA.md` com arquivos exatos para o agente `zapclinslz`.
3. Resposta ao humano: links blob/raw do report + delta sync + **uma** alavanca humana H1/H2 (Golden backlink ou reviews GBP sistemáticos) — sem tutorial de bio.
4. `Mudança no AppScript: não` · `AppsScript_v3.45_ATUAL.gs`

## Fora de escopo
clasp deploy · fake reviews · spam IndexNow · PWA balcão · PIN
