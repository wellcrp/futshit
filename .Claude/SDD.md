# Documento de Arquitetura e Design de Software (SDD)

## 1. Visão Geral do Projeto

O site "Cardoso & Muscelli Advogados" é um site institucional para um escritório de advocacia especializado em direito imobiliário, civil, família e sucessões.

O objetivo principal é:
- apresentar o escritório como referência em advocacia especializada;
- fornecer informações sobre serviços;
- oferecer contato direto com o escritório;
- garantir boa indexação em mecanismos de busca com boas práticas de SEO e acessibilidade.

## 2. Requisitos Principais

### Requisitos Funcionais
- Exibir o conteúdo institucional do escritório.
- Mostrar informações de contato e localização.
- Disponibilizar formulário de contato operacional.
- Navegação clara entre seções relevantes do site.

### Requisitos Não Funcionais
- Padrões HTML5 semânticos.
- Uso mínimo de recursos externos e sem plugins desnecessários.
- Compatibilidade responsiva móvel e desktop.
- SEO otimizado para busca orgânica.
- Segurança e proteção de dados sensíveis.
- Tratamento de erros nos formulários.

## 3. Arquitetura de Informação

### Estrutura de conteúdo principal
- `index.html`
  - Header / Navegação principal
  - Seção "Quem Somos"
  - Seção "Serviços"
  - Seção "Localização"
  - Footer com contatos e redes sociais
- `pages/contato/contato.html`
  - Formulário de contato
  - Informações de contato do escritório
  - Mapa incorporado

### Recursos estáticos
- `css/style/style.css`
- `css/index.css`
- `css/posts/posts.css`
- `css/style/style.css`
- `javascript/script.js`
- `pages/contato/contato.js`

## 4. Melhores Práticas HTML5 e SEO

### SEO e indexação
- Usar `lang="pt-BR"` no elemento `<html>`.
- Definir `<meta charset="UTF-8">` e `<meta name="viewport">`.
- Incluir `<title>` descritivo e exclusivo.
- Incluir `<meta name="description" content="...">` para cada página.
- Usar cabeçalhos hierárquicos (`<h1>`, `<h2>`, `<h3>`).
- Usar texto alternativo claro nas imagens (`alt`).
- Reduzir dependência de recursos externos apenas ao necessário.
- Validar performance e acessibilidade.

### HTML semântico
- Usar `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`.
- Evitar wrappers desnecessários.
- Usar listas semânticas para navegação e itens de serviços.
- Usar `<button>` em ações e `<a>` somente para navegação.

## 5. Segurança e privacidade

### Entrada de usuário e tratamento de formulários
- O formulário de contato deve validar localmente e ser validado no servidor.
- Os campos exigidos são: nome, e-mail e mensagem.
- Usar `type="email"` e `type="tel"` adequados.
- Limpar valores e prevenir envios duplicados.
- Exibir mensagens de sucesso e erro ao usuário.

### Proteção de dados sensíveis
- Não expor chaves ou tokens no front-end.
- Se usar serviços terceiros (EmailJS), as chaves devem ser mantidas em backend seguro ou variáveis não expostas.
- Toda informação sensível deve ficar fora do site estático e fora do controle de versão.
- Aplicar criptografia apenas em servidores ou backends confiáveis quando dados precisarem ser armazenados ou transmitidos.

## 6. Boas práticas de JavaScript

- Não usar bibliotecas externas desnecessárias.
- Manter scripts pequenos, claros e sem efeitos colaterais globais.
- Usar `addEventListener` e evitar `onclick` inline.
- Tratar exceções com `try/catch` em chamadas assíncronas.
- Garantir que o JS só execute quando o DOM estiver pronto para evitar erros.
- Usar `defer` em scripts, se possível.

## 7. Regras de desenvolvimento e risco proibido

### Diretivas do projeto
- Proibido: programação de risco.
- Proibido: codificação mal feita.
- Proibido: desenvolver somente o necessário nada além do necessário.
- Obrigatório: seguir melhores práticas.
- Obrigatório: criptografar informações sensíveis em todo o site.
- Obrigatório: tratamento de erros em ações de formulários.
- Obrigatório: não importar plugins desnecessários.

### Critérios de qualidade
- Código legível, organizado e modular.
- Comentários apenas quando agregam valor.
- Controle de versão limpo e sem segredos no repositório.
- Documentação clara do projeto e decisões de arquitetura.

## 8. Sugestões de melhorias futuras

- Implementar backend seguro para envio de formulários com autenticação e logs.
- Adicionar sitemap.xml e robots.txt para melhor indexação.
- Criar página de política de privacidade e termos de uso.
- Validar SEO com Lighthouse e monitorar desempenho.
- Considerar uso de imagens otimizadas e lazy loading.
