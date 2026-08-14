# Mapa de erros, falhas, bugs e eventos — ago/2026

**Atualizado:** 14/08/2026  
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
| **OAUTH-GRANT** | `invalid_grant` nos seeds | `token.json` local expirado / revogado | Usar **Environment Cursor `zapclin`** com `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`. Re-auth local só no desktop do humano. |
| **SECRET-CHAT** | Credenciais coladas no chat | Contorno de OAuth na sessão | Secrets vão para Environment; **nunca** commit; rotacionar quando possível. |
| **SERP-CAPTCHA** | Scrape Google SERP falha | Anti-bot | Não depender de scrape; humano usa GSC / `site:`; IndexNow só para URLs novas/alteradas. |
| **GSC-RESPAM** | Re-solicitar indexação em loop | Impaciência pós-GSC | Bairros: **5/5 já solicitado** (ago/2026). Aguardar. Não re-spam. |
| **GAS-CLASP** | Novo Deploy ID / URL quebra app | `clasp deploy` ou “Novo implantar” | **Proibido.** Só “Gerenciar implantações → Nova versão” no ID canônico. |
| **REPO-MIX** | Diff Movi × ZapClin | Pastas C: misturadas | `MAPA_PASTAS_LOCAL.md` — clones separados. |
| **ENV-MISS** | Cloud Agent sem secrets Sheets | Run iniciada **antes** de linkar Environment | Novo agente: selecionar Environment **`zapclin`** ao criar. |
| **NET-TIMEOUT** | Erro ao salvar OS / encerrar (Pronto/Entregue); app lento | Cadastro OS+fotos = POST obrigatório; status = `apiGet` ~10s; SW cache **não** substitui escrita no GAS/Drive | Esperado em internet ruim. Mitigar: Wi-Fi estável; não fechar app no meio do upload; olhar toast “salvo localmente”; futuro: fila offline para OS/status. |

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
| 14/08/2026 | Environment Cloud `zapclin` | Secrets OAuth salvos |
| 14/08/2026 | Handoff transição | Este pacote de docs |
| 14/08/2026 | PR #18 Z.7 merged → **v4.34.0** | Operação/CRM módulos |
| 14/08/2026 | Loja: lentidão + erros salvar/encerrar | Correlacionado a internet fraca (**NET-TIMEOUT**) |

**Commits live SEO (referência `zapclinslz`):** `4dafda1` (PAA), `13d4493` (bairro FAQ), `2a0bcb3` (PageRank `/quanto-tempo/`).

---

## D) Bugs / débitos conhecidos (não são “novos”)

| Item | Nota | Prioridade |
|------|------|------------|
| Ping GAS **3.51** vs arquivo **3.52** | Humano: Nova versão Web | P0 humano |
| Pacote Z.7 pendente | `zc-operacao` + `zc-crm` | P2 agente |
| Auth operador ausente | Fase 4 equiparação | P2 |
| Cockpit narrativo ausente | Fase 5 | P2 |
| Indexação parcial site | ~7 URLs em `site:` amostra; bairros em fila GSC | P1 humano/aguardar |
| Backlink Golden Shopping | Texto pronto; falta ação humana | P1 humano |
| PRs draft acumulados | #14 #15 #16 #1 | Consolidar com pedido |

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
