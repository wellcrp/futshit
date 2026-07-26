# agents.md — Resumo gerado automaticamente a partir de `src/`

## Resumo do projeto (extraído de `src/`)
- Tecnologias: Node.js + TypeScript, Express.
- Estrutura-chave:
  - `src/index.ts` — servidor Express com endpoints REST mínimos.
  - `src/public/` — páginas estáticas: `index.html` (ranking) e `admin/index.html` (formulário de submissão).
  - `src/data/jogadoresEscalados.json` — arquivo de persistência (JSON) localizado em `src/data`.

## Endpoints importantes
- `POST /api/jogos` — aceita `{ data: "YYYY-MM-DD", listaTexto: "..." }` e persiste a entrada.
- `GET /api/ranking` — retorna ranking agregado `{ nome, pontos, presencas }` ordenado por pontos.

## Execução (sugestão)
- Recomendado adicionar um `package.json` na raiz do repositório com scripts:
  - `dev`: `ts-node-dev --respawn --transpile-only src/index.ts`
  - `build` / `start` conforme necessidade.

## Regras e restrições para agentes
- Permitir que agentes modifiquem somente arquivos dentro de `src/` e `AGENTS.md`/`.Claude/agents.md` a menos que outra permissão seja explicitada.
- Evitar alterações em arquivos fora do escopo (ex.: arquivos de configuração de IDE, histórico, credenciais).
- Quando for alterar o `data/jogadoresEscalados.json`, criar backup antes da escrita.

## Pontos de atenção (segurança/operacional)
- Não incluir segredos em arquivos de frontend.
- Tratar nomes de jogadores com normalização (trim + case-insensitive).
- Validação mínima: `data` válida e `listaTexto` não vazia.

## Sugestão de workflow antes de executar mudanças
1. Atualizar este `agents.md` caso haja mudanças na estrutura de `src/`.
2. Garantir que `package.json` e `tsconfig.json` estejam na raiz (se necessário) antes de rodar scripts.
3. Executar passos de teste manual: adicionar entrada via `/admin/`, verificar `/api/ranking` e página pública.
