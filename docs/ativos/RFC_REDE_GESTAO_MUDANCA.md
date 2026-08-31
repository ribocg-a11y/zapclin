# RFC — Rede ZapClin: levantamento, contrato e gestão de mudança

**Status:** aberto — **não implementar produto** até o sócio marcar o lote  
**Data:** 31/08/2026  
**Varredura:** planilha live (OAuth leitura) + GAS arquivo 3.56 + PWA v4.36.2  
**Canvas:** abrir ao lado do chat `zapclin-gestao-mudanca-rede.canvas.tsx`

Não há aba “Rio Anil”. Há **uma planilha**, cadastro em `UNIDADES` e coluna `UNIDADE` nas abas operacionais.

---

## 1. Por que paramos

A v4.36.2 colocou chips Rede/Golden/Anil e o cockpit **sem**:

- RFC / matriz de impacto por tela
- auditoria de backfill `UNIDADE`
- caminho óbvio para **cadastrar operadores**
- Painel rotulado como **soma da rede**
- treinamento (ADKAR: *knowledge*)

Isso viola gestão de mudança (ITIL RFC + rollback; ADKAR; Kotter: visão antes de “nova cara”).

**Regra desta RFC:** código de produto só depois do lote L1 aprovado. Este arquivo + canvas = L0.

---

## 2. Arquitetura que vale (e a que não vale)

O quadro de API Gateway / microsserviços / database-per-service / Cloud Native **não** é o ZapClin. Deploy ID único é P0.

| Camada do artigo | No ZapClin | Regra |
|------------------|------------|-------|
| Gateway | PWA Pages + `apiGet` JSONP → **um** Web App GAS | Sem segundo Deploy ID, sem `clasp deploy` |
| Negócio | Monolito GAS (`doGet`) + JS | Filtro de loja **no servidor** (`unidadeVisivel_`) |
| Dados | **Uma** planilha, *shared schema*, coluna `UNIDADE` | Proibido aba/planilha por loja |
| Nuvem | Pages + GAS + Drive + Gmail | Rollback = versão FE anterior; GAS = Nova versão no mesmo ID |

Crescer = mais **linhas** e mais **usuários**, não k8s.

---

## 3. Fato da planilha live (31/08)

Planilha `ZapClin_Sistema_Gerenciamento` — **16 abas**. Entre elas: `UNIDADES`, `USUARIOS`, `CLIENTES`, `📊 LANÇAMENTOS`, `CUSTOS`. **Não** existe sheet Rio Anil.

| Aba | O que vimos |
|-----|-------------|
| `UNIDADES` | `golden` + `anil` (Rio Anil Shopping). WhatsApp Anil **vazio** |
| `USUARIOS` | Só `antonio` / perfil `adm` / `UNIDADE_ID` vazio. **Nenhum operador** |
| `CLIENTES` | Cabeçalho Q/R `UNIDADE` + `OPERADOR` |
| `LANÇAMENTOS` | Cabeçalho J/K `UNIDADE` + `OPERADOR`; amostra de dados **sem** valor na coluna |
| `CUSTOS` | Cabeçalho G/H `UNIDADE` + `OPERADOR`; amostra **sem** valor na coluna |
| `RELACIONAMENTO`, `ACEITES OS`, `LOGS` | **Sem** coluna de loja |
| `📈 DASHBOARD` (Sheets) | Fórmulas da planilha inteira — não é o Painel do PWA |

Linha operacional com `UNIDADE` vazio o GAS trata como **golden**. Rio Anil está **catalogada e sem movimento**.

Script de backfill (dry-run): `scripts/oauth-sheets/bootstrap-unidades-usuarios.js` — **não gravar** sem pedido.

---

## 4. Onde cadastrar operadores (já existe — mal sinalizado)

**PWA:** login ADM → botão **Painel** no rodapé da lateral → rolar até **Equipe e turnos** (`#zcUsersAdmin` em `page-admin`).

**Planilha:** aba `USUARIOS` (PIN em hash, nunca texto).

Furo de UX: na Home **Rede** o card Painel some (`homeBalcaoBlock` hidden). Sobrou só o rodapé. Por isso parece que “não tem página”.

---

## 5. Contrato de tela (Rede vs uma loja)

| Superfície | Rede (ADM) | Uma loja | Furo atual |
|------------|------------|----------|------------|
| Home | Soma + cartões para entrar | Balcão | Card Painel some |
| **Painel KPIs** | **Soma das unidades** + rótulo Rede + breakdown | Só a loja | Não diz “soma”; chip Golden antigo mascara a Rede |
| Dashboard / Vendas / Relatório | Soma; depois breakdown | Só a loja | Sem comparativo lado a lado |
| Operação / Clientes | Consulta as duas | Só a loja | Relacionamento sem UNIDADE |
| Registrar / OS / custo | **Bloqueado** até escolher loja | Grava na loja | GAS em Rede gravaria golden |
| Equipe | Cadastra qualquer loja | Idem | Enterrado; 0 operadores |
| WhatsApp | Número da loja da OS | Número da unidade | Anil sem número |

O Painel em Rede **deve** somar. Isso entra no lote L1, não foi feito nesta RFC.

---

## 6. Gestão de mudança — checklist (não pular de novo)

Antes de qualquer merge de produto:

1. **RFC** neste arquivo (impacto, fora de escopo, rollback)
2. **Matriz de tela** atualizada
3. **Dados:** dry-run OAuth se for mexer em coluna
4. **ADKAR:** uma frase de “onde clicar” para Antonio e para o tablet da loja
5. **Rollback:** versão FE anterior + `?force=`
6. **Humano GAS:** só Nova versão no mesmo Deploy ID
7. **Pós:** ping, Pages `APP_VERSION`, um smoke de login

Fora de escopo deste RFC (L3+): nova cara, redesign celular/desktop, microsserviços, segundo PWA, GSC.

---

## 7. Lotes (só avançar com “pode o L1”)

### L0 — agora (organização)

- [x] Varredura planilha + código
- [x] Este RFC + canvas
- [ ] Sócio: ler e dizer **pode L1** ou ajustar o contrato

### L0 humano (você)

- [ ] Colar GAS **3.56** no editor (ping ainda 3.55)
- [ ] Não criar aba Rio Anil

### L1 — correção do contrato (código, depois do ok)

1. Atalho **Equipe** visível na Home Rede (não esconder Painel)
2. Painel em Rede: KPIs = **soma**, título Rede, duas linhas Golden / Anil
3. Auditoria/backfill `UNIDADE` vazia = golden (dry-run primeiro)
4. Você cadastra os dois operadores no Painel (golden)

### L2 — fechar furos de modelo

- Matriz nas demais telas admin
- WhatsApp Anil na aba `UNIDADES`
- `UNIDADE` em RELACIONAMENTO / ACEITES / LOGS (sem aba nova)

### L3 — UX / layout / responsivo

- Só com dados e equipe estáveis

---

## 8. Rollback

FE: `main` anterior + `?force=v4.36.1` se o SW travar.  
GAS: não criar Deploy ID. Reverter código no editor = colar versão anterior.  
Planilha: não apagar OS; backfill só preenche vazio.

Mudança no AppScript deste arquivo: não.
