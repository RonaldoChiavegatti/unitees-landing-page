# Unitees - Plataforma de Camisetas Universitárias Personalizadas

<div align="center">
  <img src="public/placeholder.svg?height=200&width=200" alt="Unitees Logo" width="200" />
</div>

## 📋 Sobre o Projeto

Unitees é uma plataforma web que permite aos estudantes universitários criarem, personalizarem e comprarem camisetas universitárias facilmente. A plataforma conecta estudantes diretamente com gráficas locais, oferecendo uma experiência completa de design a entrega.

### Principais Funcionalidades

- ✏️ **Editor Intuitivo**: Interface estilo Canva para criação de designs personalizados
- 🔄 **Conexão com Gráficas**: Integração direta com gráficas locais parceiras
- 🛒 **Checkout Simplificado**: Processo de compra rápido e descomplicado
- 💬 **Chat com Gráficas**: Comunicação direta para negociação e personalização
- 🔍 **Explorar Designs**: Galeria de designs populares e inspirações

## 🚀 Tecnologias Utilizadas

- **Next.js 15**: Framework React com renderização no servidor
- **React 19**: Biblioteca para construção de interfaces
- **TypeScript**: Tipagem estática para maior segurança e produtividade
- **Tailwind CSS**: Framework CSS utilitário para design responsivo
- **shadcn/ui**: Componentes de UI acessíveis e customizáveis
- **Firebase** *(em implementação futura)*: Banco de dados, armazenamento e autenticação
- **Zustand**: Gerenciamento de estado global

## 🛠️ Setup e Instalação

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou pnpm (recomendamos pnpm para melhor performance)

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/unitees-landing-page.git
   cd unitees-landing-page
   ```

2. Instale as dependências:
   ```bash
   pnpm install
   # ou
   npm install
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   pnpm dev
   # ou
   npm run dev
   ```

4. Acesse `http://localhost:3000` no seu navegador.

## 📁 Estrutura do Projeto

```
unitees-landing-page/
├── app/                      # Rotas e páginas da aplicação
│   ├── cadastro/             # Página de cadastro
│   ├── carrinho/             # Página do carrinho
│   ├── checkout/             # Fluxo de checkout
│   ├── como-funciona/        # Explicação do serviço
│   ├── confirmacao/          # Confirmação de pedido
│   ├── editor/               # Editor de camisetas
│   ├── explorar/             # Explorar gráficas e designs
│   ├── grafica/              # Detalhes de gráficas parceiras
│   ├── login/                # Autenticação
│   ├── produto/              # Visualização de produto
│   ├── layout.tsx            # Layout compartilhado
│   └── page.tsx              # Página inicial
├── components/               # Componentes reutilizáveis
│   ├── ui/                   # Componentes de UI base
│   └── ...                   # Outros componentes
├── hooks/                    # Hooks personalizados
├── lib/                      # Funções utilitárias
├── public/                   # Ativos estáticos
└── styles/                   # Estilos globais
```

## 🔄 Fluxo de Trabalho

1. **Criação de Design**: Usuários acessam o editor para criar designs personalizados
2. **Exploração de Gráficas**: Seleção de gráficas parceiras com base em localização e preço
3. **Negociação**: Chat direto com a gráfica para ajustes e orçamentos
4. **Checkout**: Finalização do pedido, pagamento e acompanhamento
5. **Entrega**: Recebimento do produto físico

## 🔮 Roadmap de Funcionalidades Futuras

- **Backend completo com Firebase**:
  - Autenticação de usuários
  - Banco de dados para designs e perfis
  - Storage para uploads de imagens
  - Funções serverless para processamento
- **Perfil de Gráficas**: Dashboard para gráficas gerenciarem pedidos
- **Integração de Pagamentos**: Processamento de pagamentos na plataforma
- **App Mobile**: Versão nativa para dispositivos móveis
- **Analytics e Relatórios**: Métricas para usuários e gráficas

## 📝 Licença

Este projeto está sob a licença [MIT](LICENSE).

## 📞 Contato

Para mais informações ou dúvidas, entre em contato através do email: seu-email@exemplo.com 