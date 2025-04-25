# 🔥 Guia de Implementação do Firebase

Este documento descreve o plano de implementação do Firebase como backend para o projeto Unitees. Esta integração está planejada para ser desenvolvida em uma fase futura do projeto.

## 🎯 Visão Geral

O Firebase será utilizado como plataforma backend completa, fornecendo:
- Autenticação de usuários
- Banco de dados NoSQL
- Armazenamento de arquivos
- Funções serverless
- Hospedagem (para APIs)
- Analytics e monitoramento

## 📋 Pré-requisitos

1. Conta Google
2. Projeto Firebase criado
3. Plano Blaze (pay-as-you-go) para usar todas as funcionalidades

## 🔑 Configuração Inicial

### 1. Criar Projeto no Firebase Console

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em "Adicionar projeto"
3. Nomeie como "unitees-app" (ou nome similar disponível)
4. Siga as etapas de configuração (ative Google Analytics)

### 2. Adicionar Firebase ao Projeto Next.js

```bash
# Instalar o SDK do Firebase
npm install firebase

# Instalar ferramentas de desenvolvimento (opcional)
npm install -D firebase-tools
```

### 3. Criar Arquivo de Configuração

Em `lib/firebase.ts`:

```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Inicializar Firebase apenas uma vez
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Exportar serviços
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const functions = getFunctions(firebaseApp);

export default firebaseApp;
```

### 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## 👤 Implementação da Autenticação

### 1. Habilitar Métodos de Autenticação no Firebase Console

- Email/senha
- Google
- Facebook (opcional)

### 2. Criar Hook de Autenticação

Em `hooks/useAuth.ts`:

```typescript
import { useState, useEffect, createContext, useContext } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        logout,
        signInWithGoogle,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### 3. Adicionar Provider ao Layout Principal

Em `app/layout.tsx`:

```typescript
import { AuthProvider } from '@/hooks/useAuth';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

## 📁 Implementação do Firestore

### 1. Criar Estrutura de Dados

Coleções planejadas:
- users
- designs
- printers
- orders
- chats

### 2. Regras de Segurança

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários só podem ler/escrever seus próprios dados
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Designs podem ser lidos por todos, mas editados apenas pelo criador
    match /designs/{designId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.ownerId;
    }
    
    // Regras para gráficas, pedidos e chats
    // ... (a ser detalhado na implementação)
  }
}
```

### 3. Criar Hooks para CRUD

Exemplo para coleção `designs`:

```typescript
import { useState, useEffect } from 'react';
import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, 
  query, where, orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';
import { Design } from '@/types/design';

export const useDesigns = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Buscar designs do usuário
  const fetchUserDesigns = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const q = query(
        collection(db, 'designs'),
        where('ownerId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const designsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Design[];
      
      setDesigns(designsData);
    } catch (error) {
      console.error('Erro ao buscar designs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Criar novo design
  const createDesign = async (designData: Omit<Design, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    try {
      const docRef = await addDoc(collection(db, 'designs'), {
        ...designData,
        ownerId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar design:', error);
      throw error;
    }
  };

  // Implementar outras funções (updateDesign, deleteDesign, etc)
  // ...

  return {
    designs,
    loading,
    fetchUserDesigns,
    createDesign,
    // outras funções
  };
};
```

## 📦 Implementação do Storage

### 1. Estrutura de Pastas

```
/users/{userId}/designs/{designId}/images/
/users/{userId}/profile/
/printers/{printerId}/logo/
```

### 2. Regras de Segurança

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Arquivos de usuário só podem ser acessados pelo próprio usuário
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId 
                   && request.resource.size < 5 * 1024 * 1024 
                   && request.resource.contentType.matches('image/.*');
    }
    
    // Imagens públicas podem ser lidas por todos
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Funções para Upload/Download

```typescript
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { useAuth } from './useAuth';

export const useStorage = () => {
  const { user } = useAuth();

  // Upload de imagem
  const uploadImage = async (file: File, path: string) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    try {
      const fileRef = ref(storage, path);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  };

  // Upload de imagem de design
  const uploadDesignImage = async (designId: string, file: File) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    const path = `users/${user.uid}/designs/${designId}/images/${file.name}`;
    return uploadImage(file, path);
  };

  // Deletar arquivo
  const deleteFile = async (path: string) => {
    try {
      const fileRef = ref(storage, path);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      throw error;
    }
  };

  return {
    uploadImage,
    uploadDesignImage,
    deleteFile
  };
};
```

## ⚡ Cloud Functions (Planejadas)

Funções serverless para processamento no backend:

### 1. Principais Funções Planejadas

- Processamento de pagamentos
- Notificações para usuários e gráficas
- Geração de PDFs de orçamentos
- Processamento de imagens (redimensionamento, otimização)
- Webhooks para integração com outros serviços

### 2. Exemplo de Estrutura

```
functions/
├── src/
│   ├── auth/
│   │   └── onCreate.ts       # Ações após criação de usuário
│   │   └── onWrite.ts        # Processamento após edição de design
│   ├── orders/
│   │   ├── onCreate.ts       # Processamento de novos pedidos
│   │   └── onStatusChange.ts # Notificações de mudança de status
│   └── index.ts              # Ponto de entrada
├── package.json
└── tsconfig.json
```

### 3. Exemplo de Função

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// Função executada quando um novo pedido é criado
export const onOrderCreate = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    const orderId = context.params.orderId;
    
    try {
      // Notificar a gráfica sobre o novo pedido
      await db.collection('notifications').add({
        recipientId: order.printerId,
        type: 'new_order',
        title: 'Novo Pedido Recebido',
        message: `Você recebeu um novo pedido #${orderId}`,
        orderId,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Adicionar registro de histórico do pedido
      await db.collection('orders').doc(orderId).collection('history').add({
        status: 'created',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        message: 'Pedido criado com sucesso'
      });
      
      // Outras ações como envio de email, etc.
      // ...
      
      return true;
    } catch (error) {
      console.error('Erro ao processar novo pedido:', error);
      throw error;
    }
  });
```

## 🧪 Testes

### Testes Unitários para Integração com Firebase

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '@/hooks/useAuth';
import { useDesigns } from '@/hooks/useDesigns';
import { AuthProvider } from '@/hooks/useAuth';

// Mock do Firebase
jest.mock('@/lib/firebase', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    // ...
  },
  db: {
    collection: jest.fn(),
    doc: jest.fn(),
    // ...
  },
  // ...
}));

describe('Firebase Authentication', () => {
  it('should sign in user', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.signIn('test@example.com', 'password');
    });

    // Verificar se a função foi chamada com os parâmetros corretos
    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password'
    );
  });
  
  // Outros testes...
});
```

## 📊 Analytics e Monitoramento

### Firebase Analytics

```typescript
import { getAnalytics, logEvent } from 'firebase/analytics';
import { useEffect } from 'react';
import firebaseApp from '@/lib/firebase';

export const useAnalytics = () => {
  let analytics: ReturnType<typeof getAnalytics> | null = null;
  
  useEffect(() => {
    // Inicializar analytics apenas no cliente
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(firebaseApp);
    }
  }, []);
  
  const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  };
  
  return { trackEvent };
};
```

## 📱 Considerações para Versão Mobile

Para futuras versões nativas, considere:

1. React Native com Firebase SDK
2. Autenticação persistente
3. Armazenamento offline (Firestore offline persistence)
4. Push notifications via Firebase Cloud Messaging (FCM)

## 💰 Estimativa de Custos

Firebase opera no modelo freemium com o Plano Blaze (pay-as-you-go):

- **Autenticação**: Primeiros 50K/mês gratuitos
- **Firestore**: 1GB armazenamento + 50K leituras + 20K escritas/dia gratuitos
- **Storage**: 5GB + 1GB transferência/dia gratuitos
- **Functions**: 2M invocações/mês gratuitas

Estimativa mensal para projeto inicial (acima do tier gratuito):
- **Projeto pequeno**: $20-50/mês
- **Projeto médio**: $100-200/mês
- **Projeto grande**: $300+/mês 