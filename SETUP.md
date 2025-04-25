# 🛠️ Guia de Configuração do Ambiente de Desenvolvimento

Este guia detalha como configurar seu ambiente de desenvolvimento para trabalhar no projeto Unitees.

## 📋 Requisitos

- **Node.js**: versão 18.0.0 ou superior
- **npm**, **yarn** ou **pnpm** (recomendamos pnpm por sua eficiência)
- **Git**: para controle de versão
- **Editor de código**: recomendamos Visual Studio Code com extensões para React/Next.js

## 🚀 Configuração Inicial

### 1. Clone do Repositório

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/unitees-landing-page.git

# Entre na pasta do projeto
cd unitees-landing-page
```

### 2. Instalação das Dependências

Com pnpm (recomendado):
```bash
# Instale o pnpm globalmente se ainda não tiver
npm install -g pnpm

# Instale as dependências
pnpm install
```

Com npm:
```bash
npm install
```

Com yarn:
```bash
yarn
```

### 3. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```
# Exemplo de .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> **Nota**: Quando a integração do Firebase for implementada, as variáveis de ambiente relacionadas deverão ser adicionadas conforme documentado em FIREBASE-SETUP.md.

### 4. Executando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
pnpm dev
# ou
npm run dev
# ou
yarn dev
```

O servidor estará disponível em [http://localhost:3000](http://localhost:3000).

## 📦 Scripts Disponíveis

O projeto inclui os seguintes scripts:

- `dev`: Inicia o servidor de desenvolvimento
- `build`: Cria a versão de produção
- `start`: Inicia o servidor de produção após o build
- `lint`: Executa o linter para verificar problemas no código

```bash
# Exemplo:
pnpm build
pnpm start
```

## 🧩 Extensões Recomendadas para VS Code

Para melhorar sua experiência de desenvolvimento, recomendamos as seguintes extensões:

- **ESLint**: Para linting de código
- **Prettier**: Para formatação consistente
- **Tailwind CSS IntelliSense**: Para autocomplete de classes Tailwind
- **PostCSS Language Support**: Para suporte a arquivos PostCSS
- **JavaScript and TypeScript Nightly**: Suporte aprimorado para TypeScript
- **Jest Runner**: Para executar testes facilmente

## 🔄 Fluxo de Trabalho Git

Recomendamos seguir este fluxo de trabalho:

1. **Branches**: 
   - `main`: Branch principal, sempre estável
   - `develop`: Branch de desenvolvimento
   - `feature/nome-da-feature`: Para novas funcionalidades
   - `fix/nome-do-fix`: Para correções de bugs

2. **Commits**:
   - Use mensagens claras e descritivas
   - Formato recomendado: `tipo: descrição curta`
   - Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

3. **Pull Requests**:
   - Descreva claramente as mudanças
   - Vincule issues relacionadas
   - Solicite revisão de código

## 📚 Estrutura de Pastas

```
unitees-landing-page/
├── app/                     # Rotas e páginas da aplicação
├── components/              # Componentes reutilizáveis
│   ├── ui/                  # Componentes de UI base
│   └── ...                  # Outros componentes
├── hooks/                   # Hooks personalizados
├── lib/                     # Funções utilitárias e configurações
├── public/                  # Arquivos estáticos
├── styles/                  # Estilos globais e temas
├── .env.local               # Variáveis de ambiente local
├── next.config.mjs          # Configuração do Next.js
├── package.json             # Dependências e scripts
├── postcss.config.mjs       # Configuração do PostCSS
├── tailwind.config.ts       # Configuração do Tailwind CSS
└── tsconfig.json            # Configuração do TypeScript
```

## 🎨 Trabalhando com Componentes UI

O projeto utiliza [shadcn/ui](https://ui.shadcn.com/) para componentes de UI. Para adicionar novos componentes:

```bash
# Exemplo: adicionar o componente Button
npx shadcn-ui@latest add button
```

## 📱 Adaptação para Dispositivos Móveis

O projeto é responsivo por natureza usando Tailwind CSS. Dicas para desenvolvimento:

- Utilize a classe `container` para layouts consistentes
- Desenvolva com abordagem "mobile-first"
- Utilize os breakpoints padrão do Tailwind:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

## 🔍 Debugging

Para depuração eficiente:

1. **No navegador**:
   - Use as ferramentas de desenvolvedor do Chrome/Firefox
   - Extensão React DevTools para inspecionar componentes

2. **No VS Code**:
   - Adicione configurações ao `.vscode/launch.json` para debug integrado
   - Use a extensão "JavaScript Debugger" para breakpoints

Exemplo de configuração para `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

## 🧪 Testes (Plano Futuro)

O projeto planeja implementar:

- **Testes Unitários**: com Jest
- **Testes de Componentes**: com React Testing Library
- **Testes E2E**: com Cypress

## 🔐 Boas Práticas

1. **Segurança**:
   - Nunca comite arquivos `.env` ou credenciais
   - Valide todas as entradas de usuário

2. **Performance**:
   - Otimize imagens antes de adicioná-las
   - Utilize lazy loading para componentes e rotas
   - Minimize o uso de bibliotecas pesadas

3. **Estilização**:
   - Mantenha consistência com os padrões de design
   - Utilize as utilidades do Tailwind para responsividade
   - Crie componentes reutilizáveis para padrões repetitivos

4. **Acessibilidade**:
   - Utilize os componentes acessíveis do shadcn/ui
   - Garanta contraste adequado
   - Inclua texto alternativo em imagens

## 🆘 Solução de Problemas Comuns

### Erro na instalação de dependências

```bash
# Limpe o cache do npm
npm cache clean --force

# Ou se estiver usando pnpm
pnpm store prune
```

### Problemas com Next.js

```bash
# Limpe a pasta .next
rm -rf .next

# Reconstrua o projeto
pnpm build
```

### Erros com ESLint ou TypeScript

```bash
# Verificar e corrigir problemas de linting
pnpm lint --fix

# Verificar tipos TypeScript
pnpm tsc --noEmit
```

## 📞 Suporte

Se encontrar problemas ou tiver dúvidas:
- Abra uma issue no GitHub
- Contate a equipe de desenvolvimento via email

---

Este guia será atualizado conforme o projeto evolui. Contribuições são bem-vindas! 