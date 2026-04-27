# Plano de Testes Manuais — Estufa da Varanda Web

## Preparação

1. Iniciar API Flask.
2. Confirmar base URL no `.env`.
3. Rodar o front:

```bash
npm run dev
```

4. Abrir:

```txt
http://127.0.0.1:5173
```

## Testes de Auth

### Login válido

- Acessar `/login`.
- Informar e-mail e senha válidos.
- Confirmar redirecionamento para `/app`.
- Confirmar nome do usuário no topo/sidebar.

Resultado esperado:

- Login funciona.
- Tokens são salvos pelo storage central.
- `/auth/me` retorna usuário.

### Login inválido

- Informar senha errada.
- Confirmar mensagem amigável.

Resultado esperado:

- Não entra no app.
- Exibe erro.
- Não quebra tela.

### Refresh

- Fazer login.
- Recarregar `/app`.
- Confirmar que a sessão é restaurada.

Resultado esperado:

- App usa refresh token.
- Chama `/auth/me`.
- Mantém usuário autenticado.

### Logout

- Clicar em sair.
- Confirmar redirecionamento para `/login`.
- Tentar acessar `/app`.

Resultado esperado:

- Sessão local limpa.
- `/app` volta para login.

## Testes de Plantas

### Criar planta

- Acessar `/app/plants/new`.
- Informar nome.
- Opcionalmente preencher status, local e cidade.
- Salvar.

Resultado esperado:

- Redireciona para detalhe da planta criada.

### Listar plantas

- Acessar `/app/plants`.
- Confirmar card da planta.

Resultado esperado:

- Lista carrega.
- Paginação aparece se houver registros.

### Filtros

- Buscar por nome.
- Filtrar por status.
- Incluir arquivadas.

Resultado esperado:

- Query params mudam.
- Lista atualiza.

### Editar planta

- Abrir detalhe.
- Clicar em editar.
- Alterar apelido/status.
- Salvar.

Resultado esperado:

- Volta para detalhe.
- Dados atualizados aparecem.

### Arquivar planta

- Abrir detalhe.
- Clicar em arquivar.
- Confirmar.

Resultado esperado:

- Planta deixa de aparecer na listagem principal.
- Aparece se `include_archived=true`.

## Testes de Regas

### Criar rega

- Abrir planta.
- Acessar Regas.
- Informar data/hora.
- Informar quantidade opcional.
- Salvar.

Resultado esperado:

- Histórico atualiza.
- Resumo tenta recarregar.

### Paginação de regas

- Criar registros suficientes.
- Navegar entre páginas.

Resultado esperado:

- Page query param atualiza.
- Lista muda.

## Testes de Eventos

### Criar evento

- Abrir Eventos.
- Usar `observation`.
- Informar título e descrição.
- Opcionalmente preencher metadata JSON válido.

Resultado esperado:

- Evento aparece no histórico.

### Metadata inválido

- Informar JSON quebrado.

Resultado esperado:

- Submit bloqueado pelo front.

## Testes de Espécies

- Acessar `/app/species`.
- Buscar espécie.
- Marcar/desmarcar apenas ativas.
- Selecionar espécie.

Resultado esperado:

- Lista atualiza.
- Painel de detalhe carrega.

## Testes de Clima

- Abrir planta.
- Acessar Clima.
- Trocar limite.
- Atualizar.

Resultado esperado:

- Histórico climático carrega ou mostra vazio.
- Resumo climático carrega ou mostra vazio.

## Testes de Notificações

- Acessar `/app/notifications`.
- Filtrar por status.
- Marcar como lida.
- Descartar.

Resultado esperado:

- Lista atualiza.
- Status muda.

## Testes de Fotos

### Upload

- Abrir Fotos.
- Selecionar imagem.
- Preencher legenda.
- Enviar.

Resultado esperado:

- Foto aparece na lista.

### Download

- Clicar em abrir.

Resultado esperado:

- Blob abre em nova aba.

### Delete

- Clicar em excluir.
- Confirmar.

Resultado esperado:

- Foto some da lista.

## Testes de IA

- Abrir IA.
- Enviar pergunta.
- Ver resposta.

Resultado esperado:

- Resposta aparece no painel.
- Conversas recarregam, se a API registrar.

## Testes de Admin

### Usuário comum

- Login com usuário comum.
- Confirmar que Admin não aparece no menu.
- Tentar acessar `/app/admin/users`.

Resultado esperado:

- Tela mostra bloqueio visual.
- API também deve negar.

### Usuário admin

- Login com admin.
- Abrir Admin > Usuários.
- Criar usuário.
- Ativar/desativar usuário.
- Resetar senha.
- Revogar sessões.
- Abrir tentativas de login.

Resultado esperado:

- Todas as ações retornam sucesso ou erro amigável.
