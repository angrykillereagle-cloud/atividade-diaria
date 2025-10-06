# Registro de Atividades (App local)

Aplicativo simples em HTML/JS para registrar atividades com:
- Tabela com colunas: DATA / HORA DE INÍCIO / ATIVIDADE EXECUTADA / HORA DE ENCERRAMENTO / OBSERVAÇÕES
- Botão para iniciar atividade
- Botão para encerrar atividade
- Gerar relatório por período
- Imprimir relatório

Os dados são salvos no `localStorage` do navegador (apenas no computador local).

Como usar:
- Abra `index.html` em qualquer navegador moderno.
- Preencha o campo "Atividade" e clique em "Iniciar Atividade".
- Quando terminar, clique em "Encerrar Atividade".
- Para gerar relatório, selecione as datas e clique em "Gerar Relatório". Em seguida use "Imprimir Relatório".

Arquivos no repositório:
- index.html — interface e estrutura
- style.css — estilos
- app.js — lógica do aplicativo
- start.sh / start.bat — scripts para abrir `index.html` (Linux/Mac e Windows)
- README.md — este arquivo
