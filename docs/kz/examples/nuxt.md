# Nuxt 3/4 мысалы

Сервер маршруттары мен composable-дарды пайдаланып HitKey OAuth2-ді Nuxt қосымшасына интеграциялау.

## Орнату

```bash
npx nuxi init my-app
cd my-app
```

`.env` файлына орта айнымалыларын қосыңыз:

```bash
HITKEY_API_URL=https://api.hitkey.io
HITKEY_AUTH_URL=https://hitkey.io
HITKEY_CLIENT_ID=your_client_id
HITKEY_CLIENT_SECRET=your_client_secret
HITKEY_REDIRECT_URI=http://localhost:3000/auth/callback
```

`nuxt.config.ts`-те конфигурациялаңыз:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    hitkeyClientSecret: process.env.HITKEY_CLIENT_SECRET,
    public: {
      hitkeyAuthUrl: process.env.HITKEY_AUTH_URL,
      hitkeyClientId: process.env.HITKEY_CLIENT_ID,
      hitkeyRedirectUri: process.env.HITKEY_REDIRECT_URI,
    }
  }
})
```

## Сервер маршруттары

### `server/api/auth/login.get.ts` — OAuth бастау

```typescript
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const state = crypto.randomUUID()

  // State-ті cookie-де сақтау
  setCookie(event, 'oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600 // 10 минут
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

### `server/api/auth/callback.get.ts` — Callback-ті өңдеу

```typescript
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const storedState = getCookie(event, 'oauth_state')

  // State тексеру
  if (query.state !== storedState) {
    throw createError({ statusCode: 400, message: 'Invalid state' })
  }
  deleteCookie(event, 'oauth_state')

  // Кодты токендерге айырбастау
  const tokens = await $fetch(`${config.public.hitkeyApiUrl}/oauth/token`, {
    method: 'POST',
    body: {
      grant_type: 'authorization_code',
      code: query.code,
      client_id: config.public.hitkeyClientId,
      client_secret: config.hitkeyClientSecret,
      redirect_uri: config.public.hitkeyRedirectUri
    }
  })

  // Пайдаланушы ақпаратын алу
  const userinfo = await $fetch(`${config.public.hitkeyApiUrl}/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  })

  // Сессияны сақтау (қалаған сессия стратегияңызды пайдаланыңыз)
  setCookie(event, 'session', JSON.stringify({
    user: {
      hitkeyId: userinfo.sub,
      email: userinfo.email,
      name: userinfo.display_name
    },
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + tokens.expires_in * 1000
  }), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30 // 30 күн
  })

  return sendRedirect(event, '/dashboard')
})
```

### `server/api/auth/me.get.ts` — Ағымдағы пайдаланушы

```typescript
export default defineEventHandler((event) => {
  const sessionCookie = getCookie(event, 'session')
  if (!sessionCookie) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const session = JSON.parse(sessionCookie)
  return session.user
})
```

## Фронтенд composable

### `composables/useAuth.ts`

```typescript
export function useAuth() {
  const user = useState<{ hitkeyId: string; email: string; name: string } | null>('user', () => null)

  async function fetchUser() {
    try {
      user.value = await $fetch('/api/auth/me')
    } catch {
      user.value = null
    }
  }

  function login() {
    navigateTo('/api/auth/login', { external: true })
  }

  function logout() {
    user.value = null
    navigateTo('/api/auth/logout', { external: true })
  }

  return { user, fetchUser, login, logout }
}
```

## Бет мысалы

### `pages/index.vue`

```vue
<script setup lang="ts">
const { user, fetchUser, login } = useAuth()

onMounted(() => {
  fetchUser()
})
</script>

<template>
  <div>
    <div v-if="user">
      <p>Қош келдіңіз, {{ user.name }}!</p>
      <p>Email: {{ user.email }}</p>
    </div>
    <button v-else @click="login">
      HitKey арқылы кіру
    </button>
  </div>
</template>
```

## Негізгі мәселелер

- **Сервер жағындағы токен айырбастау** — `client_secret` ешқашан браузерге жетпейді
- **State тексеру** — `oauth_state` cookie арқылы CSRF қорғанысы
- **Идентификатор ретінде `sub`** — әрқашан `userinfo.sub` пайдаланыңыз, ешқашан `email` емес
- **Токенді жаңарту** — мерзімі аяқталған токендерді автоматты жаңарту үшін сервер middleware іске асырыңыз
