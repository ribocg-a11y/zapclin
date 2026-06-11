# Plano de equiparação — Movi Kids × ZapClin

**Data:** 11/06/2026  
**Objetivo:** Comparar organização, arquitetura e capacidades dos dois sistemas e definir um roteiro prático para **equiparar padrões de engenharia e gestão**, sem fundir operações distintas (locação vs higienização).

**Premissa:** Os negócios permanecem separados. A equiparação busca **mesma maturidade de código, QA, documentação e camada holding/financeira** — não um único app operacional.

---

## 1. Visão executiva

| Dimensão | Movi Kids | ZapClin | Direção da equiparação |
|----------|-----------|---------|-------------------------|
| Maturidade de engenharia | Alta (modular, testes, AGENTS) | Média (monolito, QA pontual) | **ZapClin → padrão Movi** |
| Maturidade operacional CRM | Média (retorno 7–14 dias, RESPONSAVEIS) | Alta (VIP, aceite OS, fotos, SLA) | **Movi ← recursos ZapClin onde couber** |
| Gestão executiva | Alta (cockpit, payback, folha, alertas) | Média-alta (dashboard, Golden, fechamento) | **ZapClin ← cockpit Movi** |
| Holding / financeiro consolidado | Parcial (`financeiro/` + FASE 11 pendente) | Isolado (lido pelo Movi) | **Compartilhado — FASE 11 Movi** |
| Deploy e governança | Protocolo formal (HANDOFF, pre-push) | ROADMAP + QA v4.19 | **ZapClin ← protocolo Movi** |

**Integração já existente:** `movikids/financeiro/` e `FinanceiroGeral.gs` leem a planilha ZapClin (`1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug`). A FASE 11 do Movi prevê embed/SSO da holding no app principal.

---

## 2. Mapa dos repositórios

### 2.1 Movi Kids

| Item | Valor |
|------|-------|
| Repo | `ribocg-a11y/movikids` |
| URL | https://ribocg-a11y.github.io/movikids/ |
| Frontend | **v1.8.14** — 22 módulos `mk-*.js`, CSS separado |
| Backend GAS | **v1.5.81** — `MOVIKIDS_Code_v1.5.32_AUTH_OPERADORES_SOBRE_v1.5.31.gs` (~5.700 linhas) |
| Planilha | `1ULMUx8AqZkZ75Ed0iRK_lQWc3I7YV9Itfoe-1JY5618` |
| Deploy GAS | `AKfycbwakQ-_aWsF5lFGLsiwB5UvJ4AlpW88krSv8daPeMvULwX5FOIdMhGVgdGd0G35270Y` |
| Arquivos no repo | ~254 (docs, scripts, testes, financeiro, portal) |

**Organização destacada:**

```
movikids/
├── mk-*.js              # Pacote M — frontend modular
├── index.html           # shell sem JS inline
├── MOVIKIDS_Code_*.gs   # backend único canônico
├── docs/ativos/         # HANDOFF, PLANO_FASES, ESTADO_ATUAL, protocolos
├── docs/referencia/     # auditorias, DNA, incidentes
├── scripts/testes/      # ~30 testes PowerShell readonly/regressão
├── scripts/pre-push-check.ps1
├── financeiro/          # dashboard holding Movi + ZapClin
├── gas/FinanceiroGeral.gs
├── acompanhar.html      # portal responsável
└── AGENTS.md            # onboarding agentes
```

### 2.2 ZapClin

| Item | Valor |
|------|-------|
| Repo | `ribocg-a11y/zapclin` |
| URL | https://ribocg-a11y.github.io/zapclin/ |
| Frontend | **v4.27.5** (branch fix) / main ainda v4.x anterior — monolito `index.html` (~4.900 linhas) |
| Backend GAS | **v3.45** (fix ranges) / produção ainda **v3.44** |
| Planilha | `1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug` |
| Deploy GAS | `AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec` |
| Arquivos no repo | ~15 (PWA enxuto) |

**Organização atual:**

```
zapclin/
├── index.html           # UI + lógica + estilos (monolito)
├── sw.js, manifest.json
├── AppsScript_v3.45_ATUAL.gs
├── ROADMAP_FASE23.md
├── AUDITORIA_QA_v4.19.1.md
├── RELATORIO_BASE_E_VISUAL_v4.14.1.md
└── APPSCRIPT_DEPLOY.md  # (branch fix)
```

---

## 3. Comparativo por camada

### 3.1 Frontend

| Critério | Movi Kids | ZapClin |
|----------|-----------|---------|
| Arquitetura | Modular (`mk-boot`, `mk-api`, `mk-admin`…) | Monolito single-file |
| Versionamento | `mk-version.js` + cache bust | Constante `APP_VERSION` inline |
| Design system | `mk-design.css`, DNA documentado | Fase 23A tokens neon/escuro |
| PWA / SW | Sim | Sim |
| Sync tempo real | Firebase RTDB + poll + BroadcastChannel | Poll/refresh local |
| Portal externo | `acompanhar.html` (cronômetro locação) | Clube VIP público (cadastro) |
| Auth UI | Operador + admin PIN + portal tel. | Admin PIN; operação aberta |

### 3.2 Backend (Google Apps Script)

| Critério | Movi Kids | ZapClin |
|----------|-----------|---------|
| Tamanho | ~5.700 linhas | ~2.600 linhas |
| Auth | Operadores, sessão, admin 1416 | Multioperador LockService; admin PIN |
| Ranges planilha | Dinâmicos (helpers `ultimaLinha*`) | Fixos B10:I600 até v3.44 → **v3.45 corrige** |
| Fuso / KPI | `America/Sao_Paulo`, QTD explícita | v3.45 alinha Admin com frontend |
| SMS | Gateway + auditoria + incidentes I15–I23 | WhatsApp manual (copiar/colar) |
| CRM backend | RESPONSAVEIS, retorno, relacionamento | VIP, benefícios, aceite OS, fotos Drive |
| Folha / payback | Folha CLT, payback investimento | Não aplicável ao negócio |
| Holding | `controleFinanceiro`, leitura cruzada | Exportado via planilha para Movi |

### 3.3 Dados (planilhas)

| Aba / conceito | Movi Kids | ZapClin |
|----------------|-----------|---------|
| Operação | LOCAÇÕES, ITENS, frota | LANÇAMENTOS, CLIENTES |
| Pessoas | RESPONSAVEIS, operadores | CLIENTES, operadores |
| Financeiro | CUSTOS, investimento, folha | CUSTOS, fechamento diário |
| CRM | Relacionamento, tags | BENEFÍCIOS VIP, aceites OS |
| Mídia | Fotos locação | Fotos Drive por OS |
| Config | CONFIG planilha | CONFIG + logs |

### 3.4 QA, docs e operação de deploy

| Critério | Movi Kids | ZapClin |
|----------|-----------|---------|
| Onboarding agente | `AGENTS.md` + HANDOFF | README + ROADMAP |
| Testes automatizados | ~30 scripts `.ps1` | QA manual documentado |
| Pre-push | `pre-push-check.ps1` + githook | Não |
| Protocolo diagnóstico | `PROTOCOLO_DIAGNOSTICO_E_TESTES.md` | Diagnóstico parcial no Admin |
| Publicação segura | `REGRAS_DE_PUBLICACAO_SEGURA.md` | Implícito no ROADMAP |
| Incidentes | I15–I23 catalogados | Hotfixes v3.29–v3.32 no ROADMAP |
| Deploy GAS | Nova versão Web, nunca clasp deploy | Mesma regra (manual) |

---

## 4. Matriz de funcionalidades (o que cada um tem)

Legenda: ✅ maduro · 🟡 parcial · ❌ ausente · ➖ não aplicável ao negócio

| Funcionalidade | Movi | ZapClin | Equiparar? |
|----------------|------|---------|------------|
| Balcão / fila operacional | ✅ locação | ✅ higienização | Manter separado |
| Portal cliente | ✅ acompanhar | 🟡 Clube VIP | Opcional cruzado |
| Auth operador + admin | ✅ | ❌ (só admin PIN) | **Zap ← Movi** |
| Firebase sync | ✅ | ❌ | **Zap ← Movi** (P2) |
| SMS automatizado | ✅ | ❌ | **Zap ← Movi** se contratar gateway |
| CRM recorrência | 🟡 | ✅ Relacionamento | **Movi ← Zap** (FASE 10) |
| Clube VIP / benefícios | ❌ | ✅ | **Movi ← Zap** se fizer sentido |
| Aceite digital OS | ❌ | ✅ | **Movi ← Zap** (contratos locação) |
| Fotos Drive estruturadas | 🟡 | ✅ | **Movi ← Zap** padrão pasta |
| SLA por serviço | 🟡 ocupação | ✅ Revitalização 24h etc | Compartilhar **padrão**, não regras |
| Dashboard executivo | ✅ cockpit narrativo | ✅ Fase 23B | **Zap ← Movi** narrativa |
| Alertas / semáforos | ✅ FASE 8 | 🟡 SLA fila | **Zap ← Movi** |
| Payback / investimento | ✅ | ❌ | ➖ |
| Folha CLT | ✅ | ➖ | ➖ |
| Fechamento diário | 🟡 | ✅ Fase 27 | **Movi ← Zap** fechamento caixa |
| Relatório Golden PDF | 🟡 | ✅ | Compartilhar template |
| Holding consolidada | 🟡 financeiro/ | ❌ no app | **FASE 11 Movi** |
| Testes readonly CI | ✅ | ❌ | **Zap ← Movi** |
| Ranges dinâmicos GAS | ✅ | 🟡 v3.45 | **Zap** concluir deploy |

---

## 5. O que NÃO equiparar

Evitar scope creep e regressão operacional:

1. **Unificar balcão** — fluxos de locação (timer, itens, devolução) ≠ fila de higienização (OS, pronto, SLA).
2. **Um único `.gs`** — backends distintos; compartilhar **helpers** (ranges, fuso, KPI, diagnóstico), não merge total.
3. **Copiar folha CLT / payback** para ZapClin — métricas de locação de brinquedos, não higienização.
4. **Copiar frota/ocupação Firebase** literalmente — ZapClin pode usar Firebase para **fila ao vivo**, não modelo de locação.
5. **POST JSON no browser** — regra Movi I15 vale para **ambos**.

---

## 6. Plano de equiparação em fases

### Fase 0 — Estabilização imediata (ZapClin)

**Status:** em PR #1 (`cursor/fix-listar-range-kpis-f0f3`)

| ID | Entrega | Responsável |
|----|---------|-------------|
| 0.1 | Deploy GAS **v3.45** (ranges dinâmicos, KPI Admin = Home) | Humano (editor Google) |
| 0.2 | Merge + GitHub Pages **v4.27.5** | Humano (merge PR) |
| 0.3 | Validar ping `"version":"3.45"` e paridade Home/Admin | Agente + humano |
| 0.4 | Atualizar `gas-endpoint.json` no Movi se referenciar versão ZapClin | Movi repo |

**Critério de saída:** KPIs do dia idênticos em Home e Admin; sem truncamento linha 600.

---

### Fase 1 — Governança ZapClin (espelhar Movi) ✅ repo 11/06/2026

**Esforço:** modular docs + scripts, sem mudar UX operacional.

| ID | Entrega | Status |
|----|---------|--------|
| 1.1 | `AGENTS.md` ZapClin | ✅ |
| 1.2 | `docs/ativos/HANDOFF_NOVO_CHAT.md` | ✅ |
| 1.3 | `docs/ativos/ESTADO_ATUAL.md` | ✅ |
| 1.4 | `docs/ativos/REGRAS_DE_PUBLICACAO_SEGURA.md` | ✅ |
| 1.5 | `docs/ativos/ACESSOS_E_AUTORIZACOES.md` | ✅ |
| 1.6 | `scripts/pre-push-check.ps1` | ✅ |
| 1.7 | `scripts/testes/TESTE_PING_READONLY.ps1` | ✅ |
| 1.8 | `scripts/testes/TESTE_KPI_PARIDADE_READONLY.ps1` | ✅ |
| 1.9 | `docs/INDICE.md` + `PLANO_PRIORIDADES_2026-06.md` | ✅ |

**Critério de saída:** agente retoma ZapClin só lendo 4 docs + pre-push verde — **atingido no repo**; falta merge PR e uso rotineiro.

---

### Fase 2 — Backend compartilhado (padrões GAS)

**Esforço:** extrair padrões, não biblioteca npm.

| ID | Entrega | Onde |
|----|---------|------|
| 2.1 | Helpers `ultimaLinhaDados_`, ranges dinâmicos | Zap ✅ v3.45; auditar Movi |
| 2.2 | Fuso `America/Sao_Paulo` + QTD em todos KPIs server-side | Ambos |
| 2.3 | Action `diagnosticoSistema` padronizada (versão, abas, lastRow) | Zap ← protocolo Movi |
| 2.4 | Documento `MAPA_CODIGO_ARQUITETURA.md` por repo | Cada repo |

---

### Fase 3 — Frontend ZapClin: Pacote Z (modularização)

**Esforço:** alto; fazer incremental como Movi Pacote M.

| ID | Entrega | Módulos sugeridos |
|----|---------|-------------------|
| 3.1 | Extrair `zc-version.js`, `zc-api.js`, `zc-core.js` | Boot + API |
| 3.2 | Extrair telas: home, registrar, clientes, operação, admin | Paridade funcional |
| 3.3 | CSS em `zc-app.css` + tokens Fase 23 | Já existe conceito |
| 3.4 | `index.html` shell < 200 linhas | Meta Movi |
| 3.5 | Cache bust + SW alinhado | `mk-cache-bust` pattern |

**Critério de saída:** diff operacional isolado por arquivo; deploy FE sem tocar GAS.

---

### Fase 4 — Auth e multioperador ZapClin

| ID | Entrega | Referência Movi |
|----|---------|-----------------|
| 4.1 | Login operador (nome + PIN) antes do balcão | `mk-auth.js` |
| 4.2 | Admin PIN separado (manter PIN atual ou migrar 1416 — decisão sócio) | `mk-admin.js` |
| 4.3 | Auditoria por operador em LANÇAMENTOS | Coluna operador |
| 4.4 | Sessão idle / lock | `mk-sessao.js` pattern |

---

### Fase 5 — Gestão executiva ZapClin ← Movi

| ID | Entrega | Referência |
|----|---------|------------|
| 5.1 | Cockpit topo: 5 KPIs + narrativa 3–5 frases | Movi FASE 6 |
| 5.2 | KPIs leading: ticket médio, R$/hora operação | Movi FASE 7 |
| 5.3 | Alertas semáforo (meta dia, margem, atraso SLA) | Movi FASE 8 |
| 5.4 | DNA visual admin (hero + blocos colapsáveis) | Movi FASE 9 |
| 5.5 | Testes readonly por fase | `TESTE_FASE6_*` etc |

**Versão alvo ZapClin sugerida:** FE v4.30+ · GAS v3.50+ (incremental).

---

### Fase 6 — CRM e fidelização cruzada

| Direção | Entrega |
|---------|---------|
| **Movi ← ZapClin** | Página Relacionamento com segmentos VIP, benefícios auditados, campanha recorrência (FASE 10 Movi) |
| **ZapClin ← Movi** | Export síntese CRM, filtros cohort no Histórico |
| **Compartilhado** | Modelo de dados `BENEFÍCIOS` / tags reutilizável |

---

### Fase 7 — Holding unificada (Movi FASE 11)

**Owner:** Movi Kids (ZapClin fornece dados via planilha + eventual API read-only).

| ID | Entrega |
|----|---------|
| 7.1 | Embed `financeiro/` ou iframe SSO no sidebar Movi admin |
| 7.2 | KPI consolidado Movi + ZapClin no cockpit Movi |
| 7.3 | Link "Holding" no ZapClin Admin → financeiro (até embed inverso) |
| 7.4 | PDF executivo consolidado (P3 backlog Movi) |
| 7.5 | Sync automático (`SYNC_FINANCEIRO_AUTO.ps1` já existe) |

**Critério de saída:** sócio vê receita total holding em um lugar (Movi admin).

---

### Fase 8 — Tempo real e confiabilidade (opcional P2)

| ID | Entrega | Onde |
|----|---------|------|
| 8.1 | Firebase fila operação ao vivo | ZapClin operação |
| 8.2 | Live BI ocupação | Movi FASE 13 (já planejado) |
| 8.3 | BroadcastChannel entre abas | Zap ← Movi |

---

## 7. Roadmap integrado (sequência recomendada)

```
[AGORA]
  Fase 0 ZapClin v3.45/v4.27.5 ──► deploy + validação KPI
        ↓
  Fase 1 Governança ZapClin (docs + testes ping)
        ↓
  Fase 2 Padrões GAS (diagnóstico, fuso, ranges)
        ↓
┌───────┴────────┐
Fase 3 Pacote Z   Fase 7 Holding (Movi FASE 11) ← pode paralelizar
(modular FE)            ↓
        ↓           Embed financeiro no Movi
Fase 4 Auth operador
        ↓
Fase 5 Cockpit ZapClin ← Movi FASE 6–9
        ↓
Fase 6 CRM cruzado (Movi FASE 10 + Zap Relacionamento)
        ↓
Fase 8 Firebase (opcional)
```

**Paralelismo seguro:** Fase 0–2 ZapClin + Fase 7 Movi (holding) não conflitam.

---

## 8. Matriz de prioridade (P0 / P1 / P2)

| P | Item | Sistema | Impacto |
|---|------|---------|---------|
| **P0** | Deploy v3.45 + paridade KPI | ZapClin | Corrige decisão errada do dia |
| **P0** | AGENTS + HANDOFF + ESTADO_ATUAL | ZapClin | Retomada projeto |
| **P1** | pre-push + testes readonly | ZapClin | Evita regressão |
| **P1** | FASE 11 Holding embed | Movi | Visão sócio |
| **P1** | Cockpit narrativo Admin | ZapClin | Equipara gestão |
| **P2** | Pacote Z modular | ZapClin | Manutenibilidade |
| **P2** | Auth operador | ZapClin | Auditoria |
| **P2** | CRM LTV Movi + VIP patterns | Movi | Receita recorrente |
| **P3** | Firebase live fila Zap | ZapClin | UX operação |

---

## 9. Checklist de equiparação (definição de "pronto")

Considerar os sistemas **equiparados em maturidade** quando:

- [ ] Ambos têm `AGENTS.md`, HANDOFF, ESTADO_ATUAL, regras de publicação
- [ ] Ambos têm pre-push + ≥5 testes readonly automatizados
- [ ] GAS: ranges dinâmicos, fuso SP, KPI server-side = frontend
- [ ] Admin: cockpit 5 KPIs + narrativa + alertas semáforo
- [ ] Auth: operador + admin auditável
- [ ] Holding visível no Movi admin (FASE 11)
- [ ] ZapClin frontend modular (≥8 arquivos JS, shell enxuto)
- [ ] Documento de arquitetura atualizado em cada repo
- [ ] Nenhum truncamento silencioso de planilha (diagnóstico expõe lastRow)

**Não exigido para "equiparado":** mesmo código, mesma planilha, mesmas abas operacionais.

---

## 10. Ações imediatas (próxima sessão)

### ZapClin

1. Merge PR #1 e publicar Pages v4.27.5
2. Colar `AppsScript_v3.45_ATUAL.gs` no editor → Nova versão Web
3. Confirmar ping `"version":"3.45"`
4. Abrir Home e Admin no mesmo dia → mesmo número de serviços e R$

### Movi Kids

1. Retomar homologação v1.8.13+ / v1.5.80+
2. Priorizar **FASE 11 Holding** no plano 6–15
3. Alinhar `gas-endpoint.json` e docs se citarem versão ZapClin antiga

### Compartilhado

1. Decisão sócio: PIN admin unificado (1416) ou manter separados
2. Decisão sócio: SMS gateway no ZapClin ou manter WhatsApp manual
3. Agendar sprint Fase 1 governança ZapClin (1–2 dias agente)

---

## 11. Referências

| Documento | Repo |
|-----------|------|
| `PLANO_FASES_6_15_COCKPIT_EXECUTIVO_2026-06.md` | movikids |
| `AGENTS.md`, `HANDOFF_NOVO_CHAT.md` | movikids |
| `financeiro/`, `FinanceiroGeral.gs` | movikids |
| `ROADMAP_FASE23.md` | zapclin |
| `APPSCRIPT_DEPLOY.md` | zapclin (branch fix) |
| PR #1 fix KPI | zapclin |

---

*Documento gerado para planejamento estratégico. Revisar após deploy v3.45 e conclusão Movi FASE 11.*
