# Testes Automatizados - Unitees

Este diretório contém testes automatizados para o projeto Unitees. A estrutura de testes foi organizada para acompanhar a estrutura do projeto, permitindo uma fácil navegação e manutenção.

## Estrutura

```
tests/
├── api/                  # Testes das rotas de API
│   ├── auth/             # Testes de autenticação
│   ├── designs/          # Testes de designs
│   ├── email/            # Testes de envio de emails
│   ├── orders/           # Testes de pedidos
│   └── upload/           # Testes de upload de arquivos
└── README.md             # Este arquivo
```

## Tecnologias

Os testes são implementados usando:

- Jest: Framework de testes
- Testing Library: Para testes de componentes React (será implementado futuramente)
- SuperTest: Para testes de API

## Executando os Testes

Você pode executar os testes usando os seguintes comandos:

```bash
# Executar todos os testes
npm test

# Executar testes sem verificação de cobertura
npm run test:no-coverage

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar testes com cobertura para CI
npm run test:ci
```

## Cobertura

O projeto tem como meta uma cobertura mínima de:

- 60% das linhas
- 60% das branches
- 60% das funções

A cobertura é verificada automaticamente ao executar `npm test` ou `npm run test:ci`.

## Mocks

Os seguintes serviços são mockados durante os testes:

- Firebase Admin (auth, firestore, storage)
- Serviço de Email
- API externa (Resend)
- NextResponse e NextRequest

## Adicionando Novos Testes

Ao adicionar novos testes, siga estas diretrizes:

1. Mantenha a estrutura de diretórios espelhando a estrutura do código
2. Nomeie os arquivos de teste com o padrão `.test.ts` ou `.test.tsx`
3. Use mocks apropriados para serviços externos
4. Teste casos de sucesso e de erro
5. Verifique a cobertura localmente antes de enviar PR

## Execução em CI

Os testes são executados automaticamente no pipeline CI para garantir que novas alterações não quebrem o código existente. 