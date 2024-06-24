<h1 align="center">🧴 boticario-essences-api </h1>

## Descrição

Uma API Gateway para acessar dados das essências do Grupo Boticário, implementando políticas de controle de acesso volumétrico, cache e autenticação avançada com JWT.

## Instalação

pnpm: https://pnpm.io/installation

```bash
$ git clone https://github.com/ca-ayumi/boticario-essences-api.git
$ cd boticario-essences-api
$ pnpm install
```

## Setup

Criar o arquivo .env e .env.test com as credenciais.

## Rodando a aplicação

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

```

## 📝 Qualidade

```bash
# unit tests
$ pnpm run test

# test coverage
$ pnpm run test:cov
```

## 🗒️ Documentação

- https://tech-hub.raizen.com/catalog/default/api/raizen-power-ops-api-data-process/definition#/

## 📌 Tecnologias

- [NestJS](https://nestjs.com/) - Framework para NodeJS
- [Axios](https://axios-http.com/ptbr/docs/intro) - Cliente HTTP baseado em Promises para fazer requisições no Node.js e navegadores.
- [Jest](https://jestjs.io/pt-BR/) - Framework de testes
- [ESLint](https://eslint.org/) - Análise e limpeza de código fonte
- [Prettier](https://prettier.io/) - Formatador de código fonte
- [Swagger](https://swagger.io/) - Framework para processo de documentação
- [Cache-Manager](https://docs.nestjs.com/techniques/caching) - Biblioteca de cache para gerenciar e otimizar a recuperação de dados
- [JWT](https://jwt.io/) - Tokens Web JSON para autenticação
- [Throttler](https://docs.nestjs.com/security/rate-limiting) - Middleware para limitar a taxa de requisições