# Пример на Nuxt 3/4

Интеграция HitKey OAuth2 в Nuxt-приложение с использованием серверных роутов и composables.

Полный код с комментариями — в [английской версии](/examples/nuxt).

## Ключевые моменты

### Серверный роут: инициация OAuth

```typescript
// server/api/auth/login.get.ts
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const state = crypto.randomUUID()

  setCookie(event, 'oauth_state', state, {
    httpOnly: true, secure: true, sameSite: 'lax', maxAge: 600
  })

  const params = new URLSearchParams({
    client_id: config.public.hitkeyClientId,
    redirect_uri: config.public.hitkeyRedirectUri,
    response_type: 'code',
    state,
    scope: 'openid profile email'
  })

  return sendRedirect(event, `${config.public.hitkeyAuthUrl}/?${params}`)
})
```

### Composable

```typescript
// composables/useAuth.ts
export function useAuth() {
  const user = useState('user', () => null)

  async function fetchUser() {
    try { user.value = await $fetch('/api/auth/me') }
    catch { user.value = null }
  }

  function login() {
    navigateTo('/api/auth/login', { external: true })
  }

  return { user, fetchUser, login }
}
```

### Страница

```vue
<script setup lang="ts">
const { user, fetchUser, login } = useAuth()
onMounted(() => fetchUser())
</script>

<template>
  <div>
    <div v-if="user">
      <p>Добро пожаловать, {{ user.name }}!</p>
    </div>
    <button v-else @click="login">
      Войти через HitKey
    </button>
  </div>
</template>
```

## Важно

- **Обмен токенов на сервере** — `client_secret` никогда не попадает в браузер
- **Проверка state** — защита от CSRF через cookie `oauth_state`
- **`sub` как идентификатор** — всегда используйте `userinfo.sub`, никогда `email`
