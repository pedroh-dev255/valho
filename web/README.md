# Valho Frontend

Este repositório contém o frontend do sistema **Valho** desenvolvido com **Next.js 16** e **React 19**.

## Visão geral

O frontend é construído com a estrutura de pastas `app/`, usando rotas do Next.js e APIs internas para autenticação, login, logout, redefinição de senha e validação de token.

### Principais páginas

- `/` - página principal do painel do Valho
- `/login` - página de login do usuário
- `/redefinir-senha` - página para solicitar redefinição de senha
- `/redefinir-senha/confirmacao` - confirmação do pedido de redefinição de senha

### Rotas de API internas

- `app/api/login/route.js` - autenticação de login
- `app/api/logout/route.js` - logout do usuário
- `app/api/resetpass/route.js` - envio de solicitação de redefinição de senha
- `app/api/resetpass/confirm/route.js` - confirmação de troca de senha
- `app/api/validate-token/route.js` - validação de token de sessão
- `app/api/_proxy.js` - proxy interno para chamadas de API adicionais

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

> O frontend está configurado para rodar na porta `4000`.

## Scripts disponíveis

- `npm run dev` - executa a aplicação em modo de desenvolvimento
- `npm run build` - gera a versão de produção
- `npm run start` - inicia o servidor da versão de produção
- `npm run lint` - analisa o código com ESLint

## Estrutura do projeto

- `app/` - pasta principal de páginas e componentes do Next.js
- `app/layout.jsx` - layout global da aplicação
- `app/page.jsx` - página inicial do app
- `app/Providers.jsx` - providers e contexto global
- `app/globals.css` - estilos globais do frontend
- `app/_components/` - componentes reutilizáveis como `AuthGuard` e `ToastProvider`
- `app/api/` - rotas de API do backend de autenticação e senha
- `app/login/`, `app/redefinir-senha/` - páginas de fluxo de autenticação

## Dependências importantes

- `next` - framework React para SSR e rotas modernas
- `react` / `react-dom` - bibliotecas principais de UI
- `lucide-react` - ícones para a interface
- `react-hot-toast` - notificações UI
- `tailwindcss` - estilização de componentes

## Notas para desenvolvimento

- Use `app/_components/AuthGuard.jsx` para proteger rotas que exigem autenticação.
- Execute `npm run lint` antes de commitar para garantir qualidade de código.
- Altere as rotas e lógica de autenticação dentro de `app/api/*` conforme a integração com o backend.

## Contato

Este README documenta apenas o frontend do sistema Valho.
Para detalhes do backend ou integração adicional, consulte a documentação do serviço de API correspondente.
