# Мисоли Nuxt 3/4

Ҳамгиросозии OAuth2 HitKey ба барномаи Nuxt бо истифодаи маршрутҳои серверӣ ва composable-ҳо.

## Танзим

```bash
npx nuxi init my-app
cd my-app
```

Тағйирёбандаҳои муҳитро ба `.env` илова кунед:

```bash
HITKEY_API_URL=https://api.hitkey.io
HITKEY_AUTH_URL=https://hitkey.io
HITKEY_CLIENT_ID=your_client_id
HITKEY_CLIENT_SECRET=your_client_secret
HITKEY_REDIRECT_URI=http://localhost:3000/auth/callback
```

Дар `nuxt.config.ts` танзим кунед:

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

## Маршрутҳои серверӣ

### `server/api/auth/login.get.ts` — Оғози OAuth

```typescript
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const state = crypto.randomUUID()

  // Store state in a cookie
  setCookie(event, 'oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600 // 10 minutes
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

### `server/api/auth/callback.get.ts` — Коркарди Callback

```typescript
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const storedState = getCookie(event, 'oauth_state')

  // Verify state
  if (query.state !== storedState) {
    throw createError({ statusCode: 400, message: 'Invalid state' })
  }
  deleteCookie(event, 'oauth_state')

  // Exchange code for tokens
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

  // Get user info
  const userinfo = await $fetch(`${config.public.hitkeyApiUrl}/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  })

  // Store session (use your preferred session strategy)
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
    maxAge: 60 * 60 * 24 * 30 // 30 days
  })

  return sendRedirect(event, '/dashboard')
})
```

### `server/api/auth/me.get.ts` — Корбари ҷорӣ

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

## Composable-и Frontend

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

## Мисоли саҳифа

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
      <p>Welcome, {{ user.name }}!</p>
      <p>Email: {{ user.email }}</p>
    </div>
    <button v-else @click="login">
      Sign in with HitKey
    </button>
  </div>
</template>
```

## Нуқтаҳои асосӣ

- **Мубодилаи token дар тарафи сервер** — `client_secret` ҳеҷ гоҳ ба браузер намерасад
- **Тасдиқи state** — ҳифозат аз CSRF тавассути cookie-и `oauth_state`
- **`sub` ҳамчун идентификатор** — ҳамеша `userinfo.sub` истифода баред, ҳеҷ гоҳ `email` не
- **Навсозии token** — middleware-и серверӣ барои навсозии худкори token-ҳои беэътиборшуда татбиқ кунед
