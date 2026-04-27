# Revisão de Segurança — Estufa da Varanda Web

## Decisões atuais

### Tokens

O MVP usa JWT com:

- access token;
- refresh token;
- storage centralizado em `tokenStorage.ts`;
- interceptor Axios para `Authorization: Bearer`;
- refresh automático em `401`.

Os tokens ficam em `localStorage` neste MVP.

Isso é aceitável para desenvolvimento e validação inicial, mas não é a melhor opção para produção exposta à internet.

## Risco principal do localStorage

Tokens em `localStorage` podem ser lidos por JavaScript se houver XSS.

Mitigações atuais:

- não usar `dangerouslySetInnerHTML`;
- não logar tokens;
- não espalhar storage pelo app;
- centralizar em `tokenStorage.ts`;
- sanitizar mensagens exibidas;
- não executar HTML vindo da API.

Melhoria recomendada:

- migrar refresh token para cookie HTTP-only;
- cookie com `Secure`;
- cookie com `SameSite=Lax` ou `Strict`;
- access token curto em memória;
- endpoint de refresh baseado em cookie.

## Dados sensíveis

Nunca versionar:

- `.env`;
- senha real;
- access token;
- refresh token;
- chave privada;
- certificado;
- secrets;
- collection Postman com credenciais reais.

A collection usada em desenvolvimento deve trocar dados reais por placeholders.

Exemplo seguro:

```json
{
  "email": "usuario@example.com",
  "password": "SENHA_AQUI"
}
```

## Autenticação

Regras implementadas:

- rotas protegidas usam `RequireAuth`;
- rotas públicas usam `PublicOnlyRoute`;
- refresh automático fica no interceptor;
- falha de refresh limpa sessão;
- logout limpa sessão local mesmo se request falhar;
- `GET /auth/me` define o usuário atual.

## Autorização

A autorização real continua sendo responsabilidade da API.

No front:

- menu Admin aparece apenas para `is_admin = true`;
- páginas admin têm bloqueio visual se `is_admin !== true`.

Importante:

- esse bloqueio visual não substitui validação na API;
- endpoints admin devem continuar protegidos no backend.

## Upload de fotos

Riscos:

- arquivo malicioso;
- arquivo grande;
- MIME incorreto;
- consumo de storage.

Responsabilidades esperadas da API:

- validar extensão;
- validar MIME;
- limitar tamanho;
- armazenar fora da pasta pública;
- servir download por rota autenticada;
- evitar path traversal;
- remover metadados sensíveis se necessário.

No front:

- `accept="image/*"` ajuda UX, mas não é segurança real;
- upload usa `multipart/form-data`;
- download usa blob autenticado.

## IA

Riscos:

- envio de dados sensíveis em perguntas;
- prompt injection;
- resposta variável;
- resposta com conteúdo inseguro.

Mitigações no front:

- renderização como texto;
- não executar HTML retornado;
- resposta renderizada de forma tolerante;
- sem `dangerouslySetInnerHTML`.

Responsabilidades esperadas da API:

- filtrar contexto enviado;
- validar permissão da planta;
- limitar tamanho da pergunta;
- registrar auditoria se necessário.

## Erros

O parser central transforma erros em mensagens amigáveis:

- sem internet;
- timeout;
- validação;
- não autenticado;
- sem permissão;
- não encontrado;
- erro interno;
- inesperado.

Evitar exibir stack trace ou payload sensível da API.

## Headers recomendados no servidor do front

Quando publicar os assets estáticos, configurar:

```txt
Content-Security-Policy
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy
Strict-Transport-Security
```

A CSP deve ser ajustada conforme domínio da API e hospedagem.

Exemplo inicial, precisa ajuste:

```txt
default-src 'self';
connect-src 'self' https://api.com;
img-src 'self' blob: data:;
style-src 'self' 'unsafe-inline';
script-src 'self';
font-src 'self';
```
