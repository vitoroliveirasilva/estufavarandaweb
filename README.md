# Estufa da Varanda Web

Site web do projeto **Estufa da Varanda**, criado para consumir a API Flask desenvolvida.

A aplicação foi estruturada com React, TypeScript, Vite, React Router, TanStack Query, Axios, React Hook Form, Zod, Tailwind CSS, shadcn/ui, Lucide React e date-fns.

## Objetivo

Oferecer uma interface web para:

- autenticação com JWT;
- gerenciamento de plantas;
- histórico de regas;
- eventos e cuidados;
- fotos;
- clima;
- notificações;
- perguntas para IA;
- administração de usuários.

A API Flask continua sendo a fonte única das regras de negócio. O front trata navegação, formulários, cache, estado de tela, experiência do usuário e chamadas HTTP.

## Requisitos

- Node.js 18.18 ou superior.
- npm 9 ou superior.
- API Flask rodando.
- Arquivo `.env` configurado.

## Configuração

Crie o arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
VITE_APP_NAME=Estufa da Varanda
VITE_API_TIMEOUT_MS=15000
```

Nunca versione arquivos `.env` reais. Apenas o `.env.example` deve ir para o Git.

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Acesse:

```txt
http://127.0.0.1:5173
```

Para expor o Vite na rede local, use:

```bash
npm run dev:host
```

## Build

```bash
npm run build
```

## Preview local do build

```bash
npm run preview
```

## Testes

Executar testes em modo watch:

```bash
npm test
```

Executar testes uma vez:

```bash
npm run test:run
```

Executar typecheck, testes e build:

```bash
npm run check
```

## Estrutura principal esperada

```txt
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   ├── providers.tsx
│   └── queryClient.ts
│
├── core/
│   ├── api/
│   ├── auth/
│   └── config/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── plants/
│   ├── watering/
│   ├── events/
│   ├── photos/
│   ├── species/
│   ├── climate/
│   ├── notifications/
│   ├── ai/
│   └── admin/
│
├── shared/
│   ├── components/
│   ├── constants/
│   ├── layouts/
│   └── utils/
│
├── test/
├── main.tsx
└── index.css
```

## Fluxo de autenticação

1. O usuário acessa o site.
2. O app verifica se há refresh token salvo.
3. Se não houver refresh token, envia para `/login`.
4. Se houver, chama `POST /auth/refresh`.
5. Se o refresh funcionar, salva os novos tokens e chama `GET /auth/me`.
6. Toda request protegida envia `Authorization: Bearer {accessToken}`.
7. Se uma request retornar `401`, o interceptor tenta renovar a sessão.
8. Se renovar, repete a request original.
9. Se falhar, limpa a sessão local e volta para login.
10. Logout chama `POST /auth/logout` e limpa sessão local mesmo se a API falhar.

## Segurança dos tokens

No MVP, os tokens são salvos em `localStorage` por meio de `tokenStorage.ts`.

Essa estratégia simplifica o desenvolvimento, mas em produção a alternativa mais segura é migrar para cookie HTTP-only, Secure e SameSite, caso a API seja ajustada para esse fluxo.

Enquanto a API retornar JWT no corpo da resposta:

- não logar access token;
- não logar refresh token;
- não salvar senha;
- não colocar tokens no código;
- não commitar `.env`;
- não exportar collection Postman com credenciais reais.

## Endpoints usados

### Auth

```txt
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/me
POST /auth/forgot-password
POST /auth/reset-password
```

### Plantas

```txt
GET    /plants
POST   /plants
GET    /plants/{plantId}
PATCH  /plants/{plantId}
DELETE /plants/{plantId}
```

### Regas

```txt
GET  /plants/{plantId}/watering-logs
POST /plants/{plantId}/watering-logs
GET  /plants/{plantId}/watering-summary
```

### Eventos

```txt
GET  /plants/{plantId}/events
POST /plants/{plantId}/events
```

### Espécies

```txt
GET /species
GET /species/{speciesId}
```

### Clima

```txt
GET /plants/{plantId}/climate
GET /climate/summary
```

### Notificações

```txt
GET   /notifications
PATCH /notifications/{notificationId}/read
PATCH /notifications/{notificationId}/discard
```

### Fotos

```txt
GET    /plants/{plantId}/photos
POST   /plants/{plantId}/photos
DELETE /plants/{plantId}/photos/{photoId}
GET    /plants/{plantId}/photos/{photoId}/download
```

### IA

```txt
POST /plants/{plantId}/ai/ask
GET  /plants/{plantId}/ai/conversations
```

### Admin

```txt
GET   /admin/users
POST  /admin/users
PATCH /admin/users/{userId}
PATCH /admin/users/{userId}/activate
PATCH /admin/users/{userId}/deactivate
POST  /admin/users/{userId}/reset-password
POST  /admin/users/{userId}/revoke-sessions
GET   /admin/login-attempts
```

## Fluxo recomendado antes de subir alteração

```bash
npm run check
```
