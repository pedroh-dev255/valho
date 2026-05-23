# Valho API Documentation

## Visão Geral

A API do Valho é uma aplicação backend em Node.js/Express para gestão de usuários, permissões, convites e envio de e-mails.

Principais tecnologias:
- Express (server)
- MySQL (persistência)
- Redis (cache de sessões e permissões)
- JWT (autenticação)
- Nodemailer (envio de e-mail)

## Estrutura do Projeto

- `src/server.js` - inicializa conexões com MySQL e Redis, sincroniza permissões e sobe o servidor.
- `src/app.js` - configura middlewares e registra rotas públicas e protegidas.
- `src/routes/` - define rotas (`authRoute`, `dashRoute`, `configRoute`).
- `src/controllers/` - controladores que tratam requisições e respostas.
- `src/services/` - lógica de negócio (autenticação, convites, permissões, e-mail).
- `src/configs/` - configurações (MySQL, Redis, Mail, lista de permissões).
- `src/middlewares/` - middlewares de autenticação, permissão e logging.

## Scripts

- `npm run dev` - inicia o servidor com `nodemon` (`src/server.js`).
- `npm start` - inicia com `node src/server.js`.

## Endpoints Principais

Observações gerais:
- Rotas protegidas exigem header `Authorization: Bearer <token>`.
- O `login` retorna um objeto `user` contendo `token` (JWT) e dados básicos.

Auth
- `POST /auth/login`
  - body: `{ email, password }`
  - resposta: `{ success, message, user }` (user contém `token`).
- `POST /auth/register`
  - body: `{ name, invite, email, password }`
  - registra usuário usando um `invite` válido (token gerado por `createInvite`).
- `POST /auth/logout` (protegido)
  - invalida sessão do usuário em Redis.
- `POST /auth/reset-password`
  - body: `{ email }` — gera token de redefinição (válido 1 hora) e envia e-mail.
- `POST /auth/confirm-reset`
  - body: `{ token, password }` — confirma e altera a senha.
- `POST /auth/validate` (protegido)
  - valida token JWT atual.

Dashboard
- `GET /api/data/dashboard` (protegido + permissão `dashboard.view`)
  - retorna dados fictícios do dashboard (cards, stockAlerts, activities).

Config / Usuários
- `GET /api/config` (protegido + permissão `config.view`)
  - retorna configurações simples (ex.: theme, language).
- `GET /api/config/users` (protegido + permissão `users.view`)
  - lista usuários da instituição do `req.user`.
- `POST /api/config/users/invite` (protegido + permissão `users.invite`)
  - body: `{ email }` — cria convite, registra em `invites` e envia e-mail com link: `${FRONTEND_URL}/register?invite=<token>`.

Outros
- `POST /api/security` (protegido + permissionMiddleware("users.")) — rota exemplo que exige permissão.
- `GET /health` — verifica health da API. Retorna `{ status: 'ok' }`.

## Fluxos importantes

- Convite: `userService.createInvite()` gera token aleatório, insere em `invites` e envia e-mail com link para registro. Se envio de e-mail falhar, a transação é revertida.
- Registro: `authController.register` valida `invite` (status e validade) antes de criar usuário; após criar, chama `useInvite()` para marcar como `accepted`.
- Redefinição de senha: `userService.resetPassword()` atualiza `reset_token` e `reset_token_expires_at` (1 hora) e envia e-mail com link.
- Sessões: `authService` cria sessão em Redis com chave `session:user:<id>` e TTL configurável (`SESSION_TTL`, padrão 300s).
- Permissões: `permissionSyncService.syncPermissions()` sincroniza a lista `src/configs/permissions.js` com a tabela `permissions` no DB ao subir o servidor. Permissões do usuário são calculadas a partir de roles+role_permissions e cacheadas em Redis com TTL `PERM_CACHE_TTL`.

## Variáveis de Ambiente

Variáveis usadas pelo projeto (observadas no código):

- `PORT` (padrão `3000`)
- MySQL: `DB_HOST`, `DB_PORT` (padrão 3306), `DB_USER`, `DB_PASS`, `DB_NAME`
- Redis: `REDIS_HOST`, `REDIS_PORT`
- JWT: `JWT_SECRET`, `JWT_EXPIRES_IN` (ex.: `24h`)
- Mail: `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS` (o transporte usa `port: 465` e `secure: true`)
- Frontend: `FRONTEND_URL` (usado em links de convite/reset)
- Cache / Sessão: `PERM_CACHE_TTL` (segundos, opcional), `SESSION_TTL` (segundos, opcional)

### Exemplo mínimo de `.env`

```env
# General
PORT=3000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3001

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=valho_db

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Email (SMTP)
MAIL_HOST=smtp.exemplo.com
MAIL_USER=usuario@exemplo.com
MAIL_PASS=senhaDoSMTP
```

## Como Executar

1. Instale dependências:

```bash
npm install
```

2. Crie e configure o arquivo `.env` (veja variáveis acima).

3. Inicie em modo desenvolvimento (recomendado durante desenvolvimento):

```bash
npm run dev
```

4. Inicie em produção / execução normal:

```bash
npm start
```

## Observações e recomendações

- Ao subir o servidor, o processo tenta conectar ao MySQL e ao Redis; se uma conexão falhar, o processo encerra com erro.
- As permissões são sincronizadas automaticamente com a tabela `permissions` ao iniciar — ver `src/configs/permissions.js`.
- Tokens de redefinição têm validade de 1 hora (implementado em `userService.resetPassword`).
- As funções que enviam e-mail chamam `transporter.verify()` antes de enviar para garantir que o transporte SMTP está operacional.
- O template de e-mail está em `src/configs/mailer.js` e inclui botão com link para o frontend.


