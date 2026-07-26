
# futshit

Este repositório contém um esqueleto de backend em Node.js + TypeScript dentro de `src/` que serve páginas estáticas e duas APIs simples.

## Pré-requisitos
- Node.js (v14+) e `npm` instalados.
- Terminal aberto na raiz do repositório: `e:\CodeBox\IA\futshit`.

## Instalação (uma vez)

```bash
# na raiz do repositório
npm install
```

Observação: este repositório já contém `package.json` e `tsconfig.json` na raiz. Se você preferir criar do zero, use os comandos e o `tsconfig.json` descritos abaixo.

## Rodar em modo desenvolvimento

```bash
npm run dev
```

O comando `dev` usa `ts-node-dev` para recarregar automaticamente ao salvar.

## Build e execução para produção

```bash
npm run build
npm start
```

## Arquivos importantes
- `.gitignore` — ignora `.claude`, `node_modules`, `dist`, e arquivos temporários.
- `src/index.ts` — servidor Express com endpoints `POST /api/jogos` e `GET /api/ranking`.
- `src/public/index.html` — página pública (ranking).
- `src/public/admin/index.html` — painel administrativo (submissão de listas).
- `src/data/jogadoresEscalados.json` — arquivo JSON usado para persistência (inicialmente `[]`).

## Endpoints
- `GET /api/ranking` — retorna o ranking agregado.
- `POST /api/jogos` — aceita `{ data: "YYYY-MM-DD", listaTexto: "..." }` e persiste a entrada.

## URL de administração e credenciais
- A tela de login do admin está disponível em `http://localhost:3000/login`.
- Credenciais atuais:
  - Usuário: `futi`
  - Senha: `futi12QW!@qw`

## Caso precise criar os manifestos manualmente

Se por algum motivo você não quiser usar os arquivos já presentes, crie `tsconfig.json` com o conteúdo abaixo e adicione os scripts ao `package.json` conforme mostrado.

`tsconfig.json` sugerido:

```json
{
	"compilerOptions": {
		"target": "ES2020",
		"module": "commonjs",
		"outDir": "dist",
		"rootDir": "src",
		"strict": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true
	}
}
```

Adicionar scripts ao `package.json` (exemplo):

```json
"scripts": {
	"build": "tsc",
	"start": "node dist/index.js",
	"dev": "ts-node-dev --respawn --transpile-only src/index.ts"
}
```

## Testes manuais rápidos

1. Abra `http://localhost:3000/admin/` e submeta uma lista de jogadores (uma por linha).
2. Verifique `http://localhost:3000/` ou `GET /api/ranking` para confirmar as pontuações.

## Observações e segurança
- Faça backup do arquivo `src/data/jogadoresEscalados.json` antes de operações em massa.
- Não exponha segredos no front-end.

