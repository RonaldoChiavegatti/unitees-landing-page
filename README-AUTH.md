# 🔥 Autenticação com Firebase - Unitees

Este documento descreve a implementação da autenticação com Firebase no projeto Unitees.

## 📋 Visão Geral

A autenticação foi implementada usando o Firebase Authentication integrado com o Firestore para armazenar os dados dos perfis de usuário. O sistema suporta:

- Login com email/senha
- Login com Google
- Cadastro de novos usuários
- Recuperação de senha
- Verificação de email

## 🔧 Arquivos Principais

- **lib/firebase.ts**: Configuração do Firebase SDK no cliente
- **lib/firebase-admin.ts**: Configuração do Firebase Admin SDK para uso no servidor
- **lib/firebase-auth.ts**: Implementação da store de autenticação usando Zustand
- **lib/firebase-utils.ts**: Funções utilitárias para trabalhar com o Firebase
- **components/auth/auth-provider.tsx**: Provedor de autenticação que mantém o estado sincronizado
- **components/auth/login-form.tsx**: Formulário de login com suporte a email/senha e Google
- **components/auth/signup-form.tsx**: Formulário de cadastro com suporte a email/senha e Google
- **components/auth/reset-password-form.tsx**: Formulário para solicitar recuperação de senha
- **app/verificacao-email/page.tsx**: Página para verificação de email
- **app/resetar-senha/page.tsx**: Página para redefinir a senha
- **app/api/auth/verify-email/route.ts**: API para redirecionamento de verificação de email

## 🔄 Fluxo de Autenticação

### Login com Email/Senha

1. O usuário insere email e senha no formulário de login
2. A função `login` do `useAuthStore` é chamada
3. O Firebase autentica o usuário
4. Os dados do perfil são recuperados do Firestore
5. O estado de autenticação é atualizado

### Login com Google

1. O usuário clica no botão "Entrar com Google"
2. O Firebase abre um popup para autenticação com Google
3. Após autenticação bem-sucedida, verifica-se se o usuário já existe no Firestore
4. Se não existir, cria-se um novo perfil com os dados básicos do Google
5. O estado de autenticação é atualizado

### Cadastro de Usuário

1. O usuário preenche o formulário de cadastro
2. A função `signup` do `useAuthStore` é chamada
3. O Firebase cria uma nova conta
4. Um email de verificação é enviado
5. Um perfil é criado no Firestore
6. O estado de autenticação é atualizado

### Recuperação de Senha

1. O usuário informa o email na página de recuperação de senha
2. O Firebase envia um email com um link de redefinição
3. O usuário clica no link e é redirecionado para a página de redefinição
4. O código OOB do link é validado
5. O usuário define uma nova senha
6. O Firebase atualiza a senha

### Verificação de Email

1. Após o cadastro, o usuário recebe um email de verificação
2. Ao clicar no link, o usuário é redirecionado para a página de verificação
3. O código OOB do link é validado
4. O email é marcado como verificado no Firebase

## 🚀 Uso

### Importando o Store de Autenticação

```typescript
import { useAuthStore } from "@/lib/firebase-auth";

// Em um componente
const { user, isAuthenticated, login, logout } = useAuthStore();
```

### Protegendo Rotas

Para proteger páginas que requerem autenticação, você pode criar um componente de wrapper:

```typescript
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/firebase-auth";
import { useRouter } from "next/navigation";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
}
```

## ⚙️ Configuração

Para configurar o Firebase, siga os passos:

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Habilite a autenticação com Email/Senha e Google
3. Crie um banco de dados Firestore
4. Obtenha as credenciais do projeto
5. Crie um arquivo `.env.local` na raiz do projeto com as variáveis:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Para Firebase Admin (APIs do servidor)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
```

## 📚 Documentação

Para mais informações, consulte a documentação oficial do Firebase:

- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) 