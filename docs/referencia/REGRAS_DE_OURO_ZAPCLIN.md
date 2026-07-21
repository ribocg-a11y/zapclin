# Regras De Ouro Do Projeto ZapClin

1. Nunca reescrever o sistema do zero.
2. Nunca mexer no baseline funcionando sem necessidade clara.
3. Nunca remover funcionalidade existente sem autorizacao explicita.
4. Toda mudanca deve ser pequena, localizada, rastreavel e reversivel.
5. O sistema esta em producao: nenhuma atualizacao pode impedir atendimento.
6. Antes de alterar uma funcao, descobrir quais telas e abas dependem dela.
7. Toda mudanca em dados financeiros precisa bater com a planilha e com o relatorio.
8. Toda mudanca em status precisa atualizar Clientes, Operacao, Vendas, Relatorio, Historico e Logs quando aplicavel.
9. Apps Script deve ser validado antes de pedir ao usuario para substituir.
10. Frontend deve subir versao e service worker quando houver alteracao no app.
11. Evitar duplicidade de dados, principalmente em abril/2026, que foi conciliado pelo PDF oficial do Golden.
12. Mensagens WhatsApp devem manter clareza, rastreabilidade e links corretos.
13. Testes devem cobrir fluxo real, nao apenas sintaxe.
14. Se houver risco de quebrar algo funcionando, parar e propor alternativa incremental.

