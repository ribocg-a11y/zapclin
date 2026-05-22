# ZapClin - Auditoria da base e visual v4.14.1

Data da auditoria: 22/05/2026

Arquivo analisado: `C:\Users\riboc\Downloads\ZapClin_Sistema_Gerenciamento (26).xlsx`

## Resultado executivo

- Backend ao vivo respondeu `v3.30`.
- `listarClientes` ao vivo retorna os atendimentos recentes, incluindo revitalizacoes de 22/05/2026.
- `listar` ao vivo retorna os lancamentos de revitalizacao correspondentes.
- A planilha exportada tem estrutura principal compativel com o sistema: `REGISTRAR`, `LOGS`, `LANCAMENTOS`, `CLIENTES`, `CUSTOS`, `DASHBOARD`, `EMAIL` e `GUIA DE USO`.
- A aba `RELACIONAMENTO` ainda nao existe no arquivo exportado. O backend cria essa aba sob demanda quando o cadastro VIP for usado.
- O problema visual confirmado foi fonte numerica antiga ainda aplicada em classes que ficaram fora do bloco de padronizacao.

## Base de dados

### CLIENTES

- Linhas com dados: 205
- Status: 201 Entregue, 3 Pronto, 1 Em andamento
- Ativos no arquivo exportado: 4
- Receita em cadastro: R$ 7.431,00
- Sem nome ou telefone: 0
- Observacao: registros antigos entregues nao possuem campos de SLA preenchidos porque foram criados antes da fase de controle de permanencia.

### LANCAMENTOS

- Linhas com dados: 354
- Com ID de cliente: 203
- Sem ID de cliente: 151, historico anterior ao vinculo automatico por OS
- Receita em lancamentos: R$ 10.130,00
- IDs de cliente orfaos: 0
- Servicos mais frequentes:
  - Limpeza + Hig. Profunda: 228
  - Limpeza + Hig. Essencial: 53
  - Limpeza + Hig. Rapida: 24
  - Revitalizacao: 16

### CUSTOS

- Linhas com dados: 44
- Total: R$ 9.206,35
- Sem descricao ou valor: 0

## API ao vivo

Verificacao feita no Web App ativo:

- `ping`: OK, backend `v3.30`
- `listarClientes`: OK, retorna OS 204, 206 e 207 de 22/05/2026 com Revitalizacao
- `listar`: OK, retorna lancamentos 353, 355 e 356 de Revitalizacao em 22/05/2026

Conclusao: a revitalizacao nao esta ausente do backend atual. Se a tela nao mostrou, a causa mais provavel foi cache/localStorage ou leitura antes da publicacao v3.30.

## Correcao visual v4.14.1

Padronizadas as classes numericas que ainda usavam `Syne`:

- KPIs gerais, Dashboard, Historico, Operacao, Vendas, CRM e Relatorio
- Valores monetarios, rankings, OS, tempos, badges, totais e datas compactas
- Fonte de dados mantida em `Inter` com numeros tabulares

Nenhuma regra de negocio, cadastro, status, WhatsApp ou escrita no backend foi alterada nesta correcao.
