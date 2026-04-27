# Checklist de Produção — Estufa da Varanda Web

## Ambiente

- [ ] Definir `VITE_API_BASE_URL` de produção.
- [ ] Definir `VITE_APP_NAME`.
- [ ] Garantir HTTPS.
- [ ] Garantir que a API Flask esteja acessível pelo domínio do front.
- [ ] Revisar CORS da API.
- [ ] Confirmar que o healthcheck da API responde em `/api/v1/health`.

## Build

- [ ] Rodar `npm install`.
- [ ] Rodar `npm run typecheck`.
- [ ] Rodar `npm run test:run`.
- [ ] Rodar `npm run build`.
- [ ] Validar `npm run preview`.

## Segurança

- [ ] Não commitar `.env`.
- [ ] Não commitar senha real.
- [ ] Não commitar access token.
- [ ] Não commitar refresh token.
- [ ] Não commitar collection Postman com credenciais reais.
- [ ] Não logar tokens no console.
- [ ] Não salvar senha em storage.
- [ ] Revisar política de storage de tokens.
- [ ] Planejar migração futura para cookie HTTP-only, Secure e SameSite, se a API permitir.
- [ ] Confirmar que logout limpa sessão local mesmo se a API falhar.
- [ ] Confirmar que erro `401` tenta refresh automático.
- [ ] Confirmar que refresh inválido limpa sessão e volta para login.

## Navegação

- [ ] `/login` abre sem sessão.
- [ ] `/forgot-password` abre sem sessão.
- [ ] `/reset-password` abre sem sessão.
- [ ] `/app` exige autenticação.
- [ ] Usuário autenticado não fica preso em tela pública.
- [ ] Usuário comum não vê menu Admin.
- [ ] Usuário comum não acessa telas Admin.
- [ ] Usuário admin vê menu Admin.

## Funcionalidades

### Auth

- [ ] Login funciona.
- [ ] Refresh funciona.
- [ ] Logout funciona.
- [ ] `/auth/me` retorna usuário.
- [ ] Forgot password exibe mensagem genérica.
- [ ] Reset password valida token, senha e confirmação.

### Plantas

- [ ] Listagem carrega.
- [ ] Busca funciona.
- [ ] Filtro por status funciona.
- [ ] Incluir arquivadas funciona.
- [ ] Criação funciona.
- [ ] Detalhe funciona.
- [ ] Edição funciona.
- [ ] Arquivamento funciona.

### Regas

- [ ] Histórico carrega.
- [ ] Resumo carrega.
- [ ] Criar rega funciona.
- [ ] Paginação funciona.

### Eventos

- [ ] Histórico carrega.
- [ ] Criar evento funciona.
- [ ] Filtro por tipo funciona.
- [ ] Metadata JSON válido é aceito.
- [ ] Metadata JSON inválido bloqueia submit.

### Espécies

- [ ] Listagem carrega.
- [ ] Busca funciona.
- [ ] Filtro `active_only` funciona.
- [ ] Detalhe carrega.

### Clima

- [ ] Resumo climático carrega.
- [ ] Histórico por planta carrega.
- [ ] Troca de limite funciona.

### Notificações

- [ ] Listagem carrega.
- [ ] Filtro por status funciona.
- [ ] Marcar como lida funciona.
- [ ] Descartar funciona.

### Fotos

- [ ] Listagem carrega.
- [ ] Upload multipart funciona.
- [ ] Download abre blob protegido.
- [ ] Delete funciona.

### IA

- [ ] Pergunta funciona.
- [ ] Resposta renderiza.
- [ ] Conversas carregam.

### Admin

- [ ] Listagem de usuários carrega.
- [ ] Busca de usuários funciona.
- [ ] Criar usuário funciona.
- [ ] Ativar usuário funciona.
- [ ] Desativar usuário funciona.
- [ ] Resetar senha funciona.
- [ ] Revogar sessões funciona.
- [ ] Tentativas de login carregam.

## SPA / Infra

- [ ] Servidor estático faz fallback para `index.html`.
- [ ] Cache de assets estáticos configurado.
- [ ] HTML principal não fica cacheado agressivamente.
- [ ] Headers de segurança revisados.
- [ ] Logs de servidor não registram tokens.

## Pós-deploy

- [ ] Testar login em aba anônima.
- [ ] Testar refresh após expiração do access token.
- [ ] Testar logout.
- [ ] Testar recarregar página em rota interna.
- [ ] Testar upload de foto real.
- [ ] Testar usuário comum.
- [ ] Testar usuário admin.
