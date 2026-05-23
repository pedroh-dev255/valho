# Valho Frontend

Este repositório contém o frontend do sistema **Valho** desenvolvido com **Next.js 16** e **React 19** usando App Router.

## Visão geral

A aplicação é uma interface administrativa com:
- autenticação via token armazenado em cookie
- proteção de páginas com `AuthGuard`
- chamadas de API proxyadas para um backend externo
- navegação lateral com submenu e suporte a tema claro/escuro
- notificações globais com `react-hot-toast`

## Páginas principais

- `/` - dashboard principal (home)
- `/login` - login do usuário
- `/redefinir-senha` - solicitar redefinição de senha
- `/redefinir-senha/confirmacao?token=...` - confirmar nova senha
- `/financeiro` - área de financeiro (placeholder)
- `/estoque` - área de estoque (placeholder)
- `/configuracoes` - página geral de configuração (placeholder)
- `/configuracoes/usuarios` - gerenciamento de usuários
- `/configuracoes/usuarios/convites` - página de convites pendentes (placeholder)
- `/configuracoes/permissoes` - permissões (placeholder)

## Funcionalidades atuais

- login com email e senha
- logout via API
- validação de sessão por token em cookie
- redefinição de senha por e-mail
- dashboard que busca dados de backend
- gerenciamento de usuários com convite
- sidebar com navegação hierárquica e marcação de rota ativa

## Rotas de API internas

### Autenticação
- `app/api/login/route.js` - POST `/api/login`
  - proxy para `${process.env.API_URL}/auth/login`
  - envia `email` e `password`
  - salva cookie `token`
- `app/api/logout/route.js` - POST `/api/logout`
  - proxy para `${process.env.API_URL}/auth/logout`
  - remove cookie `token`
- `app/api/validate-token/route.js` - GET `/api/validate-token`
  - proxy para `${process.env.API_URL}/auth/validate`
  - valida token de sessão do cookie

### Redefinição de senha
- `app/api/resetpass/route.js` - POST `/api/resetpass`
  - proxy para `${process.env.API_URL}/auth/reset-password`
- `app/api/resetpass/confirm/route.js` - POST `/api/resetpass/confirm`
  - proxy para `${process.env.API_URL}/auth/confirm-reset`

### Dashboard e configurações
- `app/api/data/home/route.js` - GET `/api/data/home`
  - proxy para `${process.env.API_URL}/api/data/dashboard`
- `app/api/configs/route.js` - GET `/api/configs`
  - proxy para `${process.env.API_URL}/api/config/`
- `app/api/configs/users/route.js` - GET `/api/configs/users`
  - proxy para `${process.env.API_URL}/api/config/users`
- `app/api/configs/users/invite/route.js` - POST `/api/configs/users/invite`
  - proxy para `${process.env.API_URL}/api/config/users/invite`

### Proxy
- `app/api/_proxy.js` adiciona sempre:
  - `Content-Type: application/json`
  - `appToken: process.env.APP_TOKEN`
  - `x-client-ip`

## Autenticação e proteção de rotas

- `app/Providers.jsx` envolve o app com `ToastProvider` e `AuthGuard`
- `app/_components/AuthGuard.jsx` valida token para rotas protegidas
- rotas públicas: `/login`, `/redefinir-senha`, `/redefinir-senha/confirmação`
- usuários autenticados são redirecionados automaticamente para `/`
- usuários não autenticados são redirecionados para `/login`

## Estrutura do projeto

- `app/layout.jsx` - configura layout global, fontes e providers
- `app/page.jsx` - dashboard principal e carregamento de dados
- `app/Providers.jsx` - providers globais de toast e autenticação
- `app/_components/Sidebar.tsx` - sidebar com navegação, tema e logout
- `app/_components/AuthGuard.jsx` - proteção de rotas
- `app/_components/ToastProvider.jsx` - configuração global do `react-hot-toast`
- `app/api/` - rotas de API do frontend que proxyam para o backend real
- `app/login/`, `app/redefinir-senha/`, `app/configuracoes/`, `app/financeiro/`, `app/estoque/` - páginas do frontend

## Scripts disponíveis

- `npm run dev` - executa a aplicação em modo de desenvolvimento
- `npm run build` - gera a versão de produção
- `npm run start` - inicia o servidor de produção
- `npm run lint` - executa o ESLint

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Acesse no navegador:

```text
http://localhost:4000
```

## Variáveis de ambiente

Defina pelo menos:
- `API_URL` - URL base do backend real
- `APP_TOKEN` - token de aplicação usado nas chamadas proxy

## Observações

- `Financeiro`, `Estoque`, `Configurações`, `Convites Pendentes` e `Permissões` ainda exibem conteúdo placeholder
- `Usuarios` faz fetch de `/api/configs/users` e suporta convite de novo usuário
- o dashboard consome dados de `/api/data/home`

## Dependências principais

- `next` - framework React moderno
- `react` / `react-dom` - bibliotecas de UI
- `lucide-react` - ícones SVG
- `react-hot-toast` - notificações
- `framer-motion` - animações
- `tailwindcss` - estilos utilitários
