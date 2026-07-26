# Agent `sdd-tarefa`

## Propósito
Converter o arquivo `tarefa.txt` da pasta `spec-work` em `tarefa.md`, preservando a descrição completa das necessidades de alteração do projeto.

## Comportamento esperado
- Ler `spec-work/tarefa.txt`.
- Gerar `spec-work/tarefa.md` com o mesmo conteúdo formatado em Markdown.
- Manter a estrutura e a ordem das informações originais.
- Se `tarefa.txt` não existir, informar ao desenvolvedor que o arquivo precisa ser criado.

## Uso
1. Desenvolvedor cria `spec-work/tarefa.txt`.
2. Executa o agent `sdd-tarefa`.
3. O agent cria ou atualiza `spec-work/tarefa.md`.
