# Valho API Documentation

## Visão Geral

A API do Valho é uma aplicação backend em Node.js/Express para gestão de usuários, permissões, convites e envios de e-mail.

O sistema usa:
- Express para o servidor HTTP
- MySQL para persistência de dados
- Redis para cache de permissões
- JWT para autenticação
- Nodemailer para envio de e-mail

## Estrutura do Projeto

- `src/server.js` - inicializa conexões com MySQL, Redis e sincroniza permissões antes de subir o servidor.
- `src/app.js` - configura middleware, rotas e endpoints principais.
- `src/routes/` - define rotas de autenticação e usuários.
- `src/controllers/` - contém as regras de controle de fluxo para cada rota.
- `src/services/` - implementação da lógica de negócio, incluindo autenticação, convite e permissões.
- `src/configs/` - configurações de banco de dados, Redis, e-mail e permissões.
- `src/middlewares/` - middlewares de autenticação, autorização e logging.

## Funcionalidades Disponíveis

### Autenticação
- `POST /auth/login` - realiza login de usuário com email e senha.
- `POST /auth/register` - registra novo usuário mediante convite válido.
- `POST /auth/reset-password` - inicia o fluxo de redefinição de senha para um e-mail cadastrado.
- `POST /auth/confirm-reset` - confirma a redefinição de senha com token e nova senha.
- `POST /auth/validate` - valida token JWT ativo.

### Usuário
- `POST /api/users/invite` - envia convite por e-mail para um novo usuário entrar na mesma instituição.

### Recursos Adicionais
- `GET /health` - verifica se a API está online.
- `POST /api/security` - exemplo de rota protegida por autenticação e permissão `users.`.
- `POST /api/mail` - envia um e-mail formatado usando o serviço de mail.

## Regras de Segurança

### Validação de Registro
- `name`, `invite`, `email` e `password` são obrigatórios.
- Senha deve ter:
  - no mínimo 8 caracteres
  - ao menos um número
  - ao menos uma letra maiúscula
  - ao menos um caractere especial

### Autenticação
- O middleware `authMiddleware` valida o JWT em `Authorization: Bearer <token>`.
- Usuário autenticado é carregado em `req.user`.

### Permissões
- O middleware `permissionMiddleware(permission)` busca permissões do usuário em cache Redis e valida acesso.
- Permissões são definidas em `src/configs/permissions.js` e sincronizadas no banco na inicialização.

## Banco de Dados e Cache

### MySQL
- Conexão via `src/configs/db.js`.
- A API lê e escreve dados de usuários, convites, instituições e permissões.

### Redis
- Usado para cache de permissões do usuário em `src/configs/redis.js`.
- `permissionService` controla cache com TTL configurável em `PERM_CACHE_TTL`.

## Envio de E-mail

- `src/configs/mailer.js` monta um template HTML de e-mail para convites e envia usando SMTP.
- `src/services/mailerService.js` expõe `sendEmailService()`.

## Rotas Principais

### Autenticação
- `POST /auth/login`
  - body: `{ email, password }`
- `POST /auth/register`
  - body: `{ name, invite, email, password }`
- `POST /auth/reset-password`
  - body: `{ email }`
- `POST /auth/confirm-reset`
  - body: `{ token, newPassword }`
- `POST /auth/validate`
  - header: `Authorization: Bearer <token>`
  - resposta: validação de token JWT

### Usuários
- `POST /api/users/invite`
  - header: `Authorization: Bearer <token>`
  - body: `{ email }`
  - permissão necessária: `users.invite`

### Segurança e Mail
- `POST /api/security`
  - header: `Authorization: Bearer <token>`
  - permissão necessária: `users.`
- `POST /api/mail`
  - header: `Authorization: Bearer <token>`
  - body: `{ to, subject, title, body, link }`

## Variáveis de Ambiente

A API depende das seguintes variáveis de ambiente:

- `PORT` - porta do servidor (padrão `3000`)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
- `REDIS_HOST`, `REDIS_PORT`
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS`
- `FRONTEND_URL`
- `PERM_CACHE_TTL` (opcional)

### Exemplo de `.env`

```env
#GENERAL
PORT=3000
JWT_SECRET="your_jwt_secret_key"
JWT_EXPIRES_IN="24h"
FRONTEND_URL=http://localhost:3001

#MYSQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=valho_db

#REDIS
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

#EMAIL
MAIL_HOST=smtp.gmail.com
MAIL_USER=example@gmail.com
MAIL_PASS=ExamplePassword123
```

## Como Executar

1. Instale dependências:
```bash
npm install
```
2. Configure o `.env` com as variáveis necessárias.
3. Inicie em modo desenvolvimento:
```bash
npm run dev
```
4. Ou inicie o servidor normalmente:
```bash
npm start
```

## Observações

- A sincronização de permissões é feita automaticamente ao inicializar o servidor.
- Logs são gerados em `src/logs/` e arquivos mais antigos que 7 dias são limpos automaticamente.
- O envio de convites cria registros em `invites` e envia e-mail com link de registro.

