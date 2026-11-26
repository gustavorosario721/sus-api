# Login com Google — HealthData Brasil

## Arquitetura

O Google atua somente como provedor de identidade OAuth 2.0. O navegador inicia o fluxo pelo Supabase Auth:

```js
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: window.location.origin }
});
```

A aplicação não recebe nem persiste o Client Secret do Google. O Supabase gerencia a troca OAuth, a sessão e os tokens de autenticação.

## 1. Criar o cliente OAuth no Google

1. Abra o [Google Cloud Console — Clients](https://console.cloud.google.com/auth/clients).
2. Crie um OAuth Client ID do tipo **Web application**.
3. Em **Authorized JavaScript origins**, adicione:
   - URL de produção da aplicação;
   - URL de Preview que será utilizada nos testes, se aplicável;
   - `http://localhost:5173` para desenvolvimento local.
4. Em **Authorized redirect URIs**, adicione exatamente o callback exibido em Supabase → Authentication → Sign In / Providers → Google. O formato usual é:

   `https://<project-ref>.supabase.co/auth/v1/callback`

5. Guarde o Client ID e o Client Secret para cadastrá-los no Supabase.

## 2. Habilitar o provedor no Supabase

1. Abra o projeto dedicado ao HealthData Brasil.
2. Acesse **Authentication → Sign In / Providers → Google**.
3. Habilite Google e informe Client ID e Client Secret.
4. Salve a configuração.
5. Em **Authentication → URL Configuration**, defina a Site URL de produção.
6. Adicione à Redirect URLs allow list a origem de produção, a origem de Preview autorizada e `http://localhost:5173` para desenvolvimento.

A origem enviada pelo frontend é `window.location.origin`. Não use curingas amplos na lista de redirecionamento; prefira as URLs exatas dos ambientes utilizados.

## 3. Variáveis de ambiente

O frontend precisa somente das variáveis públicas já utilizadas pelo cliente Supabase:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

O Client ID e o Client Secret do Google são configurados no provedor Google do Supabase, não no Vercel e não no frontend. As credenciais privadas do Supabase usadas pelo backend permanecem em variáveis sem prefixo `VITE_`.

## 4. Teste de aceite

- Com Supabase configurado, o botão **Continuar com Google** redireciona para o consentimento Google.
- Após consentimento, o navegador retorna à origem autorizada da aplicação.
- A sessão é recuperada por `supabase.auth.getSession()` e `onAuthStateChange()`.
- A conta aparece no cabeçalho e consegue acessar favoritos, filtros e visualizações protegidas por RLS.
- O logout encerra a sessão Supabase.
- Testar em duas contas distintas para confirmar que dados salvos não atravessam usuários.

## Referências oficiais

- [Supabase — Sign in with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase — Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
- [Google Auth Platform](https://console.cloud.google.com/auth/overview)
