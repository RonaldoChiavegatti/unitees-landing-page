# 🏗️ Arquitetura do Projeto Unitees

## Visão Geral

A Unitees é construída como uma aplicação web moderna utilizando o framework Next.js, que permite renderização tanto no servidor quanto no cliente, garantindo performance e SEO otimizados. O projeto utiliza o sistema de roteamento baseado em arquivos do Next.js 15, com o App Router que proporciona uma experiência de desenvolvimento intuitiva.

## Camadas da Aplicação

### 1. Interface do Usuário (Frontend)
- **Framework:** Next.js 15
- **Biblioteca de UI:** React 19
- **Estilização:** Tailwind CSS + shadcn/ui
- **Estado Local:** React Hooks (useState, useReducer)
- **Estado Global:** Zustand

### 2. Backend (Planejado para Implementação Futura)
- **Plataforma:** Firebase
- **Autenticação:** Firebase Authentication
- **Banco de Dados:** Firestore
- **Armazenamento:** Firebase Storage
- **Funções:** Firebase Cloud Functions

## Fluxo de Dados

```
┌───────────────────┐       ┌───────────────────┐
│                   │       │                   │
│   Cliente/Browser │◄─────►│  Next.js Server   │
│                   │       │                   │
└───────────────────┘       └─────────┬─────────┘
                                      │
                                      │ (Futuramente)
                                      ▼
                            ┌───────────────────┐
                            │                   │
                            │     Firebase      │
                            │                   │
                            └───────────────────┘
```

## Estrutura de Componentes

A arquitetura de componentes segue uma abordagem modular, dividida em:

1. **Componentes de Página:** Representam páginas completas (em `app/`)
2. **Componentes de Layout:** Definem estruturas de layout reutilizáveis
3. **Componentes de UI:** Elementos de interface fundamentais (shadcn/ui)
4. **Componentes de Domínio:** Específicos ao domínio da aplicação (ex: editor de camisetas)

```
Components
│
├── UI (shadcn/ui)
│   ├── Button
│   ├── Dialog
│   ├── Input
│   └── ...
│
├── Layout
│   ├── Header
│   ├── Footer
│   └── ...
│
└── Domain
    ├── Editor
    │   ├── Canvas
    │   ├── ToolPanel
    │   └── ...
    ├── ProductDisplay
    └── ...
```

## Integração com Firebase (Planejada)

### Autenticação

```
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│               │       │               │       │               │
│  Formulário   │──────►│  Auth Hooks   │──────►│   Firebase    │
│  Login/Signup │       │               │       │   Auth API    │
│               │       │               │       │               │
└───────────────┘       └───────────────┘       └───────────────┘
```

- **Métodos de Autenticação:** Email/senha, Google, Facebook
- **Persistência:** Local Storage para manter sessões
- **Proteção de Rotas:** Middleware do Next.js para rotas privadas

### Banco de Dados

```
┌───────────────┐       ┌───────────────┐
│               │       │               │
│ Componentes   │◄─────►│   Firestore   │
│ com React     │       │   Database    │
│ Query Hooks   │       │               │
└───────────────┘       └───────────────┘
```

#### Coleções Planejadas:

- `users`: Informações dos usuários
- `designs`: Designs criados pelos usuários
- `printers`: Dados das gráficas parceiras
- `orders`: Pedidos realizados
- `chats`: Conversas entre usuários e gráficas

### Armazenamento

```
┌───────────────┐       ┌───────────────┐
│               │       │               │
│  Upload de    │──────►│   Firebase    │
│  Imagens      │       │   Storage     │
│               │       │               │
└───────────────┘       └───────────────┘
```

- **Estrutura:** `/users/{userId}/images/`
- **Uploads:** Imagens de design, logos, etc.
- **Segurança:** Regras de acesso baseadas em usuário

## Modelagem de Dados (Planejada)

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  university?: string;
  savedDesigns: string[];  // IDs dos designs salvos
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Design
```typescript
interface Design {
  id: string;
  name: string;
  ownerId: string;
  layers: Layer[];
  previewUrl: string;
  isPublic: boolean;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Layer {
  id: string;
  type: 'text' | 'image' | 'shape';
  content: any;  // Depende do tipo
  position: { x: number, y: number };
  dimensions: { width: number, height: number };
  rotation: number;
  zIndex: number;
}
```

### Printer (Gráfica)
```typescript
interface Printer {
  id: string;
  name: string;
  address: Address;
  logo: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  services: Service[];
  rating: number;
  reviews: Review[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Service {
  name: string;
  description: string;
  basePrice: number;
  estimatedDays: number;
}
```

### Order
```typescript
interface Order {
  id: string;
  userId: string;
  printerId: string;
  designId: string;
  status: 'pending' | 'confirmed' | 'in_production' | 'shipped' | 'delivered' | 'cancelled';
  quantity: number;
  size: string;
  color: string;
  totalPrice: number;
  deliveryAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Padrões de Código

1. **Componentes:** Utilizando funções React com TypeScript para tipagem estática
2. **Hooks Personalizados:** Para lógica reutilizável
3. **Context API:** Para estados compartilhados em árvores de componentes específicas
4. **Zustand:** Para gerenciamento de estado global mais complexo

## Considerações de Segurança (Planos Futuros)

1. **Autenticação:** Autenticação multi-fator via Firebase Auth
2. **Autorização:** Regras de segurança do Firebase para controle de acesso
3. **Validação de Entrada:** Zod para validação de formulários e dados
4. **CORS:** Configurado via Next.js API Routes
5. **Segurança de Conteúdo:** Políticas de segurança de conteúdo (CSP)

## Escalabilidade e Performance

1. **Lazy Loading:** Para componentes e rotas
2. **Caching:** Utilizando SWR para dados e Next.js para páginas
3. **Otimização de Imagens:** Componente Image do Next.js
4. **Code Splitting:** Automático pelo Next.js
5. **Firebase Scaling:** Planos de uso adequados ao crescimento

## Estratégia de Deploy (Planejada)

1. **Frontend:** Vercel (otimizado para Next.js)
2. **Backend:** Firebase (Hosting, Functions, etc.)
3. **CI/CD:** GitHub Actions para automação de deploy
4. **Monitoramento:** Firebase Performance Monitoring

## Ciclo de Desenvolvimento

1. **Desenvolvimento Local:** `npm run dev`
2. **Testes:** Jest para testes unitários, Cypress para E2E
3. **Build:** `npm run build`
4. **Preview:** `npm run start`
5. **Deploy:** Integração contínua via GitHub 