# ZapClin — Mapa de pastas no PC (C:)

**Atualizado:** 21/07/2026  
**Regra:** um só lugar canônico para código e docs ativos. O resto é **arquivo histórico** ou **infra compartilhada**.

---

## 1. Canônico (trabalhar só aqui)

| Caminho | Papel |
|---------|-------|
| `C:\Users\riboc\Documents\Codex\zapclin-repo` | Clone Git `ribocg-a11y/zapclin` — **fonte da verdade** |
| Workspace Cursor | Este repo |
| GitHub | https://github.com/ribocg-a11y/zapclin |
| Produção FE | https://ribocg-a11y.github.io/zapclin/ |

**Não** usar `C:\Users\riboc\Documents\Codex\zapclin` (só um `.gs` solto — ver §3).

---

## 2. Separação ZapClin × Movi Kids

| Projeto | Pasta canônica | Repo |
|---------|----------------|------|
| **ZapClin** | `...\Codex\zapclin-repo` | `ribocg-a11y/zapclin` |
| **Movi Kids** | `...\Codex\2026-05-30\...\movikids-github` (ou clone movikids) | `ribocg-a11y/movikids` |
| **OAuth Google** (infra compartilhada) | `C:\Users\riboc\Projects\google-drive-sheets-auth` | local — token Desktop |

**Integração permitida (não é mistura de código):**

- Planilha ZapClin é **lida** pelo Financeiro Geral do Movi.
- Equiparação de **padrões** (docs, testes, Pacote Z) — ver `PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md`.
- Token OAuth em `%USERPROFILE%\.config\google-api\` serve **aos dois** (conta Google do sócio).

**Scripts ZapClin de planilha** ficam em `zapclin-repo/scripts/` — não em scripts `*-movikids.js`.

---

## 3. Pastas no disco — o que fazer com cada uma

| Caminho | Status | Ação |
|---------|--------|------|
| `...\Codex\zapclin-repo` | ✅ **CANÔNICO** | Editar, commit, push |
| `...\Codex\zapclin` | ⚠ órfão (1 arquivo `.gs`) | Ignorar; ver `LEIA_ISTO.txt` |
| `...\Codex\ZapClin_Continuidade_2026-05-25` | 📦 arquivo mai/2026 (FE v4.27.4) | Só consulta histórica |
| `...\Codex\2026-05-21\files-mentioned-by-the-user-zapclin` | 📦 dumps de chat | Não deployar |
| `...\Codex\2026-05-25\files-mentioned-by-the-user-zapclin` | 📦 dumps de chat | Não deployar |
| `%TEMP%\zapclin-oauth-sheets` | ⚠ rascunho | Preferir `zapclin-repo/scripts/oauth-sheets/` |
| `...\Projects\google-drive-sheets-auth` | 🔧 OAuth compartilhado | Auth + token; scripts ZapClin no repo ZapClin |
| `Downloads\*ZapClin*` | 📦 downloads soltos | Não é fonte de verdade |

---

## 4. Estrutura do repositório canônico

```
zapclin-repo/
├── AGENTS.md
├── index.html, sw.js, zc-*.js, reparar.html   ← PWA produção
├── AppsScript_v3.45_ATUAL.gs                 ← GAS (conteúdo v3.50)
├── APPSCRIPT_DEPLOY.md
├── docs/
│   ├── INDICE.md
│   ├── MAPA_PASTAS_LOCAL.md                  ← este arquivo
│   ├── FLUXOS_OPERACIONAIS.md
│   ├── PLANO_EQUIPARACAO_MOVI_ZAPCLIN.md
│   ├── ativos/                               ← handoff, regras, protocolo (vivos)
│   └── referencia/                           ← regras de ouro, histórico
├── scripts/
│   ├── pre-push-check.ps1
│   ├── oauth-sheets/                         ← leitura/escrita planilha (Desktop)
│   ├── planilha/                             ← utilitários Sheets (ex.: investimento)
│   └── testes/                               ← *.ps1 readonly
└── githooks/
```

---

## 5. OAuth planilha — onde rodar

```powershell
cd C:\Users\riboc\Projects\google-drive-sheets-auth   # node_modules + token
node C:\Users\riboc\Documents\Codex\zapclin-repo\scripts\oauth-sheets\test-zapclin-write.js
```

Doc: `docs/ativos/OAUTH_PLANILHA_DESKTOP.md`

---

## 6. Checklist anti-mistura

- [ ] Código ZapClin só em `zapclin-repo`
- [ ] Código Movi só no repo Movi
- [ ] Nenhum `mk-*.js` no ZapClin; nenhum `zc-*.js` no Movi
- [ ] Scripts `*-movikids.js` ≠ scripts ZapClin
- [ ] Docs ativos só em `zapclin-repo/docs/ativos/`
- [ ] Pacotes Continuidade / Downloads = arquivo, não deploy
