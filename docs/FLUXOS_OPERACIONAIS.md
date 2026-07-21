# ZapClin — Fluxos operacionais

**Atualizado:** 21/07/2026  
**Produção:** FE **v4.33.3** · GAS **3.50**  
**Complementa:** `MAPA_CODIGO_ARQUITETURA.md`, `PROTOCOLO_DIAGNOSTICO_E_TESTES.md`

---

## 1. Visão geral (sistema)

```mermaid
flowchart LR
  subgraph Loja["Loja — operadores"]
    FE["PWA index.html + zc-*.js"]
  end
  subgraph Google["Google"]
    GAS["Apps Script v3.50"]
    SH["Planilha ZapClin"]
    DR["Drive fotos OS"]
  end
  subgraph Cliente["Cliente"]
    VIP["Form Clube VIP"]
    ACE["Link aceite OS"]
    WA["WhatsApp manual"]
  end
  FE -->|"apiGet GET/JSONP"| GAS
  GAS --> SH
  GAS --> DR
  FE --> WA
  VIP --> GAS
  ACE --> GAS
```

---

## 2. Fluxo balcão — OS / status

```mermaid
flowchart TD
  A[Cliente no balcão] --> B[Cadastro / Nova OS]
  B --> C[Fotos Drive opcional]
  C --> D[Status: Recebido]
  D --> E[Em higienização]
  E --> F{Pronto?}
  F -->|Sim| G[WhatsApp cliente]
  G --> H[Entrega / Finalizado]
  F -->|Não| E
  H --> I[Aceite digital opcional]
```

**Zonas:** Z2 operação · WhatsApp = zona crítica (não automatizar envio sem pedido).

---

## 3. Fluxo financeiro — lançamento e KPI

```mermaid
flowchart TD
  L[LANÇAMENTOS aba] --> LIST["listar / listarCustos"]
  L --> KPI["buscarKpisAdmin"]
  LIST --> HOME[Home / Vendas]
  KPI --> ADM[Painel Admin]
  HOME -.->|devem bater no dia| ADM
  L --> GOLD[Relatório Golden PDF]
  L --> FECH[Fechamento diário]
```

**Regra:** ranges dinâmicos (desde v3.45) — não truncar em linha 600.

---

## 4. Fluxo Admin (PIN 1321)

```mermaid
flowchart TD
  P[PIN 1321] --> A[Painel Admin]
  A --> K[KPIs servidor]
  A --> F[Fechamento diário]
  A --> C[Consistência / diagnóstico]
  A --> H[Histórico de custos]
  A --> D[Dashboard + projeção mês]
```

---

## 5. Fluxo PWA / versão (oficial pós-14/07)

```mermaid
flowchart TD
  SW[sw.js vX.Y.Z] -->|nova versão| T1[Toast: Nova versão disponível]
  T1 --> R[Reload]
  R --> T2[Toast: Sistema atualizado para vX.Y.Z]
  F["?force=vX.Y.Z"] --> R2[Replace limpo]
```

**Proibido (incidente 14/07):** SW off permanente, banner full-screen, servir HTML no lugar de `zc-*.js`, boot forçado a cada bump. Ver `ERROS_PWA_2026-07-14.md`.

---

## 6. Fluxo OAuth Desktop → planilha

```mermaid
flowchart LR
  AG[Agente Cursor local] --> SCR["scripts/oauth-sheets/*.js"]
  SCR --> TOK["~/.config/google-api/token.json"]
  TOK --> API[Google Sheets API]
  API --> SH[Planilha ZapClin]
```

Smoke seguro: aba `OAUTH_SMOKE` (`test-zapclin-write.js`).  
Doc: `OAUTH_PLANILHA_DESKTOP.md`.

---

## 7. Mapa protocolo Z0–Z6

| ID | Fluxo | Auto | Loja |
|----|-------|------|------|
| Z0 | Ping / diagnóstico | `.ps1` | — |
| Z1 | KPI Home = Admin | `.ps1` | Confirmar UI |
| Z2 | Fila OS / status | Parcial | Sim |
| Z3 | CRM / VIP / fotos | Parcial | Sim |
| Z4 | Aceite OS | Parcial | Sim |
| Z5 | WhatsApp textos/links | Manual | Sim |
| Z6 | Golden / fechamento | Manual | Sim |

Detalhe: `PROTOCOLO_DIAGNOSTICO_E_TESTES.md`.
