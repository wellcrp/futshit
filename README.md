
# Futshit

Sistema para controlar escala de jogadores, ranking e aproveitamento em partidas de futebol society.

## Visão geral

Este projeto usa Node.js + TypeScript + Express para:
- armazenar partidas em um arquivo JSON;
- calcular o ranking por presença;
- exibir a quantidade de jogos por jogador;
- calcular o percentual de aproveitamento em relação ao total de partidas registradas;
- permitir cadastro e edição de escalas pelo painel administrativo.

## Funcionalidades

- Ranking público em página web
- Colunas:
  - posição
  - jogador
  - botão para ver o jogo
  - pontos
  - quantidade de jogos
  - aproveitamento em %
- Total de partidas no sistema
- Campo do último jogo registrado
- Painel administrativo para adicionar e editar partidas
- Persistência dos dados em `src/data/jogadoresEscalados.json`
- Login simples para acesso ao painel administrativo
- API REST para leitura e gravação de dados

## Estrutura do projeto

```text
futshit/
├── src/
│   ├── data/
│   │   └── jogadoresEscalados.json
│   ├── public/
│   │   ├── index.html
│   │   └── admin/
│   │       └── index.html
│   └── index.ts
├── scripts/
│   └── copy-static.js
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
└── dist/   # gerado pelo build
```

## Pré-requisitos

- Node.js 18+ recomendado
- npm
- Git (opcional, para versionamento)

## Instalação

Na raiz do projeto:

```bash
npm install
```

## Como executar em desenvolvimento

```bash
npm run dev
```

O servidor fica disponível em:

- http://localhost:3000

O modo de desenvolvimento usa `ts-node-dev` e recarrega automaticamente quando os arquivos são alterados.

## Como executar em produção

Primeiro gere a build:

```bash
npm run build
```

Depois inicie o servidor:

```bash
npm start
```

A aplicação roda em:

- http://localhost:8080

Se a variável de ambiente `PORT` estiver definida, o servidor usa esse valor em vez da porta padrão.

## Acesso ao painel administrativo

No navegador, acesse:

- http://localhost:3000/admin/
- ou http://localhost:8080/admin/

A autenticação do painel é feita no backend e as credenciais ficam configuradas no próprio servidor. Não exponha credenciais em arquivos públicos ou repositórios compartilhados.

## Uso do sistema

### 1. Cadastrar uma partida

No painel administrativo:
- informe a data;
- informe o campo;
- cole a lista de jogadores, um por linha.

O sistema salva a informação em `src/data/jogadoresEscalados.json`.

### 2. Ver o ranking

A página inicial exibe o ranking e calcula:
- pontos por presença;
- quantidade de jogos por jogador;
- aproveitamento percentual = (quantidade de jogos / total de partidas) × 100.

### 3. Editar dados

O administrador também pode:
- editar uma partida existente;
- alterar o campo;
- alterar a lista de jogadores.

## API disponível

### `GET /api/jogos`
Retorna todas as partidas cadastradas.

### `POST /api/jogos`
Cria uma nova partida.

Body esperado:

```json
{
  "data": "2026-08-15",
  "campo": "Bordon",
  "listaTexto": "Jogador A\nJogador B\nJogador C"
}
```

### `PUT /api/jogos/:data`
Atualiza uma partida existente pela data.

### `GET /api/ranking`
Retorna o ranking calculado com:
- `nome`
- `pontos`
- `qtdeJogos`
- `aproveitamento`

## Arquivo de dados

O arquivo persistente é:

```text
src/data/jogadoresEscalados.json
```

Ele guarda as partidas no formato:

```json
[
  {
    "data": "2026-07-18",
    "campo": "Bordon",
    "lista": [
      "Dalton",
      "Igor",
      "Thiago"
    ]
  }
]
```

## Segurança

- mantenha o arquivo de dados protegido;
- não publique segredos no repositório;
- não exponha credenciais em páginas públicas;
- faça backup do JSON antes de operações em massa.

## Deploy

Para publicar em plataformas como Railway, Render ou VPS:

```bash
npm install
npm run build
npm start
```

Configure a variável de ambiente `PORT` conforme a plataforma e use o ambiente de produção com `NODE_ENV=production` quando necessário.

## Observação

O arquivo `dist/` é gerado na build e pode ser ignorado em controle de versão quando necessário, conforme o `.gitignore` do projeto.

