# Overview do Fluxo de Alteração

Este documento descreve o fluxo de trabalho do projeto dentro do diretório `.Claude`, com foco em desenvolvimento web seguro e simples.

## 1. Inicialização da tarefa

### Pasta de início: `.Claude/spec-work`
- O desenvolvedor cria o arquivo `tarefa.txt` com a descrição completa da alteração desejada.
- Este arquivo deve conter o escopo, os objetivos e quaisquer requisitos de segurança ou validação.

### Pré-execução obrigatória: atualizar `AGENTS.md` ou gerar `agents.md` específico
- Antes de qualquer execução de agentes, verifique se o arquivo `AGENTS.md` (na raiz do repositório) está atualizado e reflete as diretivas do projeto.
- Se o projeto possuir um diretório `src/` com artefatos recentes (novo esqueleto, novas linguagens, frameworks ou dependências), gere ou atualize um arquivo `agents.md` baseado nesses artefatos contendo:
	- Resumo do escopo do projeto e tecnologias usadas (ex.: Node.js + TypeScript, bibliotecas, pasta `public/`).
	- Regras e restrições específicas derivadas do código em `src/` (por exemplo: nome do serviço, porta padrão, localização do arquivo de dados, políticas de segurança).
	- Instruções sobre onde o agente deve aplicar mudanças (arquivos permitidos/fora de escopo).
- O agente responsável pela preparação deve criar/atualizar `AGENTS.md` ou `agents.md` antes de prosseguir para `sdd-prd` / `sdd-impl`.


### Agent chamado: `sdd-tarefa`
- Converte `spec-work/tarefa.txt` em `spec-work/tarefa.md`.
- Mantém o conteúdo organizado para análise.

## 2. Análise de requisitos e escopo

### Agent chamado: `sdd-prd`
- Lê `spec-work/tarefa.md`.
- Verifica as instruções em `.Claude/skill/skill.md`, `.Claude/memory/memory.md` e `AGENTS.md`.
- Confirma se a tarefa está alinhada com desenvolvimento web, segurança e boas práticas.
- Solicita esclarecimentos quando necessário.

## 3. Verificação de HTML e padronização

### Agent chamado: `sdd-html`
- Avalia a estrutura HTML5, semântica, acessibilidade e uso de Bootstrap quando apropriado.
- Recomenda ajustes simples e compatíveis com o projeto.

## 4. Verificação de estabilidade e riscos

### Agent chamado: `sdd-breakcheck`
- Avalia riscos de quebra e inconsistências antes da implementação.
- Confere dependências, referências de arquivos e impacto em formulários e scripts.

## 5. Implementação

### Agent chamado: `sdd-impl`
- Implementa a tarefa com foco em JavaScript, HTML5, segurança e manutenção.
- Usa as diretrizes de `.Claude/skill/skill.md`, `.Claude/memory/memory.md` e `AGENTS.md`.
- Entrega mudanças simples, seguras e sem excesso de complexidade.

## 6. Fluxo recomendado

1. Criar ou atualizar `.Claude/spec-work/tarefa.txt`
2. Executar `sdd-tarefa`
3. Executar `sdd-prd`
4. Executar `sdd-html`
5. Executar `sdd-breakcheck`
6. Executar `sdd-impl`

## 7. Diretrizes adicionais

- Não adicionar plugins ou dependências desnecessárias.
- Priorizar código limpo, seguro e com validação apropriada.
- Proteger informações sensíveis e evitar exposição de segredos no front-end.
- Tratar erros de formulários e fornecer feedback claro ao usuário.
