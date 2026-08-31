# Mapa de erros, falhas, bugs e eventos — ago/2026

**Atualizado:** 31/08/2026  
**Complementa (não substitui):** [`ERROS_PWA_2026-07-14.md`](ERROS_PWA_2026-07-14.md)

Usar este arquivo no handoff de novo agente para não repetir falhas operacionais de Cloud/SEO/OAuth.

---

## A) Incidente PWA 14/07/2026 (histórico — obrigatório)

- **14 erros** de SW/cache/versionamento/API documentados em `ERROS_PWA_2026-07-14.md`.
- Regra 11 em `REGRAS_DE_PUBLICACAO_SEGURA.md`.
- **Status:** documentado · produção estabilizada · **não repetir padrões** (unregister sem register, cache desalinhado, SyntaxError em `goTo`/`init`, etc.).

---

## B) Falhas recorrentes de agentes Cloud (jul–ago/2026)

| ID | Sintoma | Causa | Mitigação (protocolo) |
|----|---------|-------|------------------------|
| **CLOUD-403** | `git push` 403 para `zapclin` | Agente clonou / trabalhou em **`zapclinslz`** e tentou push no remoto errado | Confirmar `git remote -v` = `ribocg-a11y/zapclin` para ops/docs/PWA. Site live = `zapclinslz` só com sync consciente. |
| **OAUTH-GRANT** | `invalid_grant` nos seeds | Refresh token Environment expirado (app OAuth em **Testing** ~7 dias) | Desktop: `npm run auth` em `google-drive-sheets-auth` + `npm test`. Copiar **só** `refresh_token` para secret `GOOGLE_REFRESH_TOKEN` (nunca no chat). Agente **local no C:** usa `token.json` e não precisa do Environment. Opcional: publicar consent OAuth em Production. |
| **SECRET-CHAT** | Credenciais coladas no chat | Contorno de OAuth na sessão | Secrets vão para Environment; **nunca** commit; rotacionar quando possível. |
| **SERP-CAPTCHA** | Scrape Google SERP falha | Anti-bot | Não depender de scrape; humano usa GSC / `site:`; IndexNow só para URLs novas/alteradas. |
| **GSC-RESPAM** | Re-solicitar indexação em loop | Impaciência pós-GSC | Bairros: **5/5 já solicitado** (ago/2026). Aguardar. Não re-spam. |
| **GAS-CLASP** | Novo Deploy ID / URL quebra app | `clasp deploy` ou “Novo implantar” | **Proibido.** Só “Gerenciar implantações → Nova versão” no ID canônico. |
| **REPO-MIX** | Diff Movi × ZapClin | Pastas C: misturadas | `MAPA_PASTAS_LOCAL.md` — clones separados. |
| **ENV-MISS** | Cloud Agent sem secrets Sheets | Run iniciada **antes** de linkar Environment | Novo agente: selecionar Environment **`zapclin`** ao criar. |
| **LOJA-STALE** | Chip diz Rio Anil, Home ainda mostra números do Golden | `_calcStatsHome` sem filtro + `refreshDados` ignorava troca se já estava buscando + array vazio caía no `localStorage` da outra loja | v4.36.6: filtrar na hora; ADM lista a rede e recorta na tela; ignorar fetch atrasado |

---

## C) Eventos relevantes (linha do tempo)

| Data | Evento | Resultado |
|------|--------|-----------|
| 14/07/2026 | Incidente PWA loja | 14 erros mapeados; regras §11 |
| 21/07/2026 | Pacote Z.5–Z.6; OAuth smoke | FE até 4.33.x; write Sheets OK |
| 29/07/2026 | Fix Projeção Fechamento | v4.33.8 |
| ago/2026 | SEO entity + PAA + IndexNow + motor | Live `zapclinslz`; docs PR #15 |
| ago/2026 | GSC bairros 5/5 solicitado | Aguardar indexação `site:` |
| ago/2026 | Reels 01–03 gerados | `docs/ativos/marketing-ig/` |
| 14/08/2026 | Seed LANÇAMENTOS 01–13/08 | 13 dias OK · PR #16 |
| 26/08/2026 | Seed LANÇAMENTOS 01–25/08 | 25 dias OK · PR #24 · via GAS · OS 346/347 preservadas |
| 26/08/2026 | Re-auth OAuth Desktop | `npm run auth` + `npm test` OK · `GOOGLE_REFRESH_TOKEN` colado no Environment |
| 31/08/2026 | Chip Rio Anil com números do Golden na Home | Fix FE **v4.36.6** (filtro na hora + fetch com geração) |
| 14/08/2026 | Environment Cloud `zapclin` | Secrets OAuth salvos |
| 14/08/2026 | Handoff transição | Este pacote de docs |
| 14/08/2026 | PR #18 Z.7 merged → **v4.34.0** | Operação/CRM módulos |
| 14/08/2026 | Loja: lentidão + erros salvar/encerrar | Correlacionado a internet fraca (**NET-TIMEOUT**) |
| 14/08/2026 | Humano redeploy GAS → ping **3.52** | ✅ alinhado com arquivo |
| 14/08/2026 | PRs draft zeradas (#20 SEO + closes) | 0 PRs abertas |

**Commits live SEO (referência `zapclinslz`):** `4dafda1` (PAA), `13d4493` (bairro FAQ), `2a0bcb3` (PageRank `/quanto-tempo/`).

---

## D) Bugs / débitos conhecidos (não são “novos”)

| Item | Nota | Prioridade |
|------|------|------------|
| Ping GAS **3.55** = arquivo **3.55** | live 31/08 | ✅ |
| Pacote Z.7 | `zc-operacao` + `zc-crm` em v4.34.0 | ✅ |
| Pacote Z.9 | `zc-app.css` v4.35.0 — PR #22 | ✅ |
| Login de turno | v4.36.0 + GAS 3.55 — PR **#26** MERGED | ✅ |
| Auth operador ausente | Fase 4 equiparação | P2 |
| Cockpit narrativo ausente | Fase 5 | P2 |
| Indexação parcial site | bairros em fila GSC | P1 humano/aguardar |
| Backlink Golden Shopping | `ALAVANCAS_HUMANAS_ALTO_IMPACTO.md` | P1 humano |
| NET-TIMEOUT OS/status | sem fila offline para cadastro/fotos | P2 sob pedido |
| Aceite no WhatsApp (celular) | Pages + GAS 3.54; falta teste humano | P0 humano |
| PR #24 seed+handoff | **MERGED** 31/08 | ✅ |

---

## E) Processos que falharam → processo corrigido

1. **Seed planilha no Cloud sem token** → Environment + secrets + script `seed-lancamentos-*.js`.  
2. **SEO docs só no live repo** → manter playbooks em `zapclin` (PR #15) e sync pontual para `zapclinslz`.  
3. **Agente “continua SEO” sem métrica** → coverage/PageRank/schema lint primeiro; humano Golden.  
4. **Handoff desatualizado (v4.33.8 / 29/07)** → este mapa + `HANDOFF_NOVO_CHAT.md` 14/08.

---

## F) Checklist anti-regressão (novo agente)

- [ ] Li `ERROS_PWA_2026-07-14.md` se for tocar SW/versão/Dashboard  
- [ ] Confirmei remoto git antes de push  
- [ ] Confirmei Environment se for Sheets  
- [ ] Não vou `clasp deploy`  
- [ ] Não vou re-IndexNow em URLs já pedidas  
- [ ] Não vou alterar PIN / WhatsApp sem escopo declarado  
- [ ] Vou atualizar HANDOFF ao encerrar  

---

## G) Onde reportar novo incidente

1. Entrada nova neste arquivo (tabela B ou C).  
2. Se for PWA/SW: acrescentar nota em `ERROS_PWA_*` ou doc irmão datado.  
3. Atualizar `HANDOFF_NOVO_CHAT.md` §5.
