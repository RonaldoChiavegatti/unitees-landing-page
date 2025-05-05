# 🔥 Configuração do Firebase

Este documento detalha os passos necessários para finalizar a configuração do Firebase no projeto Unitees.

## 📋 Pré-requisitos

1. Conta Google
2. Criar projeto no [Firebase Console](https://console.firebase.google.com)
3. Plano Spark (gratuito) é suficiente para todas as funcionalidades que vamos utilizar

## 🔑 Configuração do Projeto

### 1. Criar Projeto no Firebase Console

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em "Adicionar projeto"
3. Nomeie o projeto como "unitees-app" (ou nome disponível similar)
4. Configure o Google Analytics (recomendado)
5. Aguarde a criação do projeto

### 2. Obter Credenciais do Projeto

1. No console do Firebase, vá para "Configurações do Projeto" > "Configurações Gerais"
2. Role até a seção "Seus apps" e clique no ícone da web </> para adicionar um app da web
3. Registre o app com o nome "Unitees Web"
4. Copie o objeto `firebaseConfig` que será exibido

### 3. Configurar Variáveis de Ambiente

Preencha o arquivo `.env.local` na raiz do projeto com as credenciais obtidas:

```
NEXT_PUBLIC_FIREBASE_API_KEY=seu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=seu-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=seu-measurement-id
```

## 🔐 Configuração da Autenticação

### 1. Habilitar Métodos de Autenticação

1. No console do Firebase, vá para "Authentication" > "Sign-in method"
2. Habilite os seguintes métodos:
   - Email/Senha
   - Google

### 2. Configuração específica para autenticação com Google

1. Quando você habilitar o método Google, clique no botão "Configurar" (ícone de lápis)
2. Na janela de configuração:
   - Verifique se o e-mail de suporte está correto (email usado por você)
   - Ative a opção "Ativar" para o método de login do Google
   - Assegure-se que o "ID do cliente da Web" esteja preenchido corretamente
   - Adicione seu nome do projeto (como Unitees) nos nomes de projetos mostrados ao usuário
   - Clique em "Salvar"

### 3. Configurar Domínios Autorizados

1. Na mesma tela de "Sign-in method", role até "Domínios autorizados"
2. Adicione:
   - `localhost`
   - Seu domínio de produção (quando tiver)
   - Também adicione `127.0.0.1` para testes locais

### 4. Teste de autenticação

1. Acesse: `http://localhost:3000/firebase-test` em seu navegador
2. Verifique se o status mostra "Firebase configurado"
3. Clique no botão "Testar Login com Google"
4. Você deve ser redirecionado para a tela de login do Google
5. Após o login, você deve voltar para a página e ver "Usuário logado: [seu-email]"

## 📁 Configuração do Firestore

### 1. Criar Banco de Dados

1. No console do Firebase, vá para "Firestore Database"
2. Clique em "Criar banco de dados"
3. Comece em modo de teste para desenvolvimento
4. Selecione a região mais próxima de seus usuários

### 2. Configurar Regras de Segurança

1. Vá para a aba "Regras" do Firestore
2. Substitua as regras pelo conteúdo do arquivo `firestore.rules` deste projeto

## 🗃️ Configuração do Storage

### 1. Configurar Storage

1. No console do Firebase, vá para "Storage"
2. Clique em "Começar"
3. Comece em modo de teste para desenvolvimento
4. Selecione a região mais próxima de seus usuários

### 2. Configurar Regras de Segurança

1. Vá para a aba "Regras" do Storage
2. Substitua as regras pelo conteúdo do arquivo `storage.rules` deste projeto

## 🧪 Testar a Configuração

Para testar se o Firebase está configurado corretamente:

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse a página de teste:
   ```
   http://localhost:3000/firebase-test
   ```

3. Tente as seguintes ações:
   - Verificar o status do Firebase (deve mostrar "Firebase configurado")
   - Fazer login com Google
   - Verificar se o login foi bem-sucedido

## 🔍 Depuração

Se encontrar problemas:

1. Verifique o console do navegador (F12 > Console)
2. Verifique as regras de segurança
3. Verifique as credenciais no arquivo `.env.local`
4. Consulte os logs no console do Firebase

## 📚 Próximos Passos

Após a configuração inicial:

1. Desenvolver middleware de proteção de rotas
2. Implementar recuperação de senha
3. Configurar verificação de email
4. Configurar Firebase Analytics (opcional)

> **Nota**: Decidimos não usar Cloud Functions no projeto, pois podemos implementar a lógica de backend necessária usando API Routes do Next.js ou como processamento no lado do cliente quando apropriado. Isso simplifica a arquitetura e permite que continuemos utilizando o plano gratuito do Firebase.

---

## 📖 Documentação

- [Documentação do Firebase](https://firebase.google.com/docs)
- [Firebase com Next.js](https://firebase.google.com/docs/web/setup)
- [Firestore](https://firebase.google.com/docs/firestore)
- [Authentication](https://firebase.google.com/docs/auth)
- [Storage](https://firebase.google.com/docs/storage) 