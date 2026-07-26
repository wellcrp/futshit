# SDD - PRD (Resumo de Produto)

## 1. Visão Geral

Este documento descreve, em nível de produto (alto nível para stakeholders), um sistema web simples para registrar e contabilizar a presença de jogadores em partidas de futebol society realizadas aos sábados. O sistema gera um ranking de jogadores por pontos (1 ponto por presença/lesão; 0 por ausência).

## 2. Objetivos
- Registrar listas de presença por data.
- Agregar presenças e apresentar ranking ordenado por pontos.
- Fornecer um painel administrativo simples para adicionar listas.

## 3. Público-alvo
- Organizadores dos jogos (stakeholders não técnicos).
- Equipe de desenvolvimento para implementação inicial.

## 4. Escopo
- Inclui: página pública com ranking e painel administrativo para submissão de listas.
- Exclui: autenticação, controle de permissões avançado, integração com sistemas externos.

## 5. Requisitos Funcionais (alto nível)
- RF1: Registrar uma lista de jogadores para uma data.
- RF2: Persistir cada lista em `jogadoresEscalados.json` com os campos `data` e `lista`.
- RF3: Agregar todas as entradas e calcular pontuação por jogador.
- RF4: Exibir ranking ordenado decrescentemente por pontos no site público.
- RF5: Tratar nomes duplicados corretamente (mesmo nome → mesma entidade).

## 6. Requisitos Não Funcionais
- RNF1: Simplicidade e usabilidade.
- RNF2: Implementação local com dependências mínimas.
- RNF3: Armazenamento em arquivo JSON acessível apenas ao servidor.

## 7. Arquitetura (alto nível)
- Frontend: páginas estáticas (`/index.html` público; `/admin/index.html`).
- Backend: Node.js com TypeScript, API REST mínima.
- Persistência: arquivo `jogadoresEscalados.json` no servidor.

## 8. Modelo de Dados (alto nível)
- Estrutura do arquivo JSON: array de objetos

```json
[
  {
    "data": "YYYY-MM-DD",
    "lista": ["Dalton","Igor","Anelis"]
  }
]
```

Derivado em memória:
- jogador: { nome: string, pontos: number, presencas: number }

## 9. Interfaces / Endpoints (alto nível)
- POST `/api/jogos` — corpo: `{ data: "YYYY-MM-DD", listaTexto: "1 Dalton\n2 Igor\n..." }` — registra um jogo.
- GET `/api/ranking` — retorna array `{ nome, pontos, presencas }` ordenado por `pontos` desc.

## 10. Regras de Negócio
- Cada aparição de um nome em uma lista = +1 ponto.
- Lesão durante partida conta como presença (1 ponto).
- Comparação de nomes case-insensitive e trim.
- Jogadores indesejados: remoção manual do JSON (futuro requisito: moderação).

## 11. Fluxos Principais
- Inserir lista: admin → preencher `date` + `textarea` → enviar → API grava → ranking atualizado.
- Visualizar ranking: frontend consulta `/api/ranking` e mostra tabela.

## 12. Critérios de Aceitação / Testes (alto nível)
- Teste 1: Ao inserir 12 nomes, cada um recebe +1 ponto.
- Teste 2: Inserir a mesma pessoa em datas diferentes incrementa pontos cumulativos.
- Teste 3: Variações de maiúsculas/minúsculas são equivalentes.
- Teste 4: Ranking exibido em ordem decrescente de pontos.

## 13. Entregáveis
- Documento SDD (este arquivo).
- Estrutura mínima do projeto (backend TypeScript, endpoints, páginas estáticas, `jogadoresEscalados.json`).

## 14. Próximos Passos
- Aprovar o SDD PRD.
- Gerar o esqueleto do projeto TypeScript (feito em paralelo — ver `sdd-tecnologie`).
