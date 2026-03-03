# Ejemplo con Nuxt 3/4

Integra HitKey OAuth2 en una aplicación Nuxt usando rutas del servidor y composables.

## Configuración

```bash
npx nuxi init my-app
cd my-app
```

Añade las variables de entorno a `.env`:

```bash
HITKEY_API_URL=https://api.hitkey.io
HITKEY_AUTH_URL=https://hitkey.io
HITKEY_CLIENT_ID=your_client_id
HITKEY_CLIENT_SECRET=your_client_secret
HITKEY_REDIRECT_URI=http://localhost:3000/auth/callback
```

Configura en `nuxt.config.ts`:

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

## Rutas del Servidor

### `server/api/auth/login.get.ts` — Iniciar OAuth

```typescript
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const state = crypto.randomUUID()

  // Almacenar state en una cookie
  setCookie(event, 'oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600 // 10 minutos
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

### `server/api/auth/callback.get.ts` — Manejar Callback

```typescript
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const storedState = getCookie(event, 'oauth_state')

  // Verificar state
  if (query.state !== storedState) {
    throw createError({ statusCode: 400, message: 'Invalid state' })
  }
  deleteCookie(event, 'oauth_state')

  // Intercambiar código por tokens
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

  // Obtener información del usuario
  const userinfo = await $fetch(`${config.public.hitkeyApiUrl}/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  })

  // Almacenar sesión (usa tu estrategia de sesión preferida)
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
    maxAge: 60 * 60 * 24 * 30 // 30 días
  })

  return sendRedirect(event, '/dashboard')
})
```

### `server/api/auth/me.get.ts` — Usuario Actual

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

## Composable del Frontend

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

## Ejemplo de Página

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
      <p>Bienvenido, {{ user.name }}!</p>
      <p>Email: {{ user.email }}</p>
    </div>
    <button v-else @click="login">
      Iniciar sesión con HitKey
    </button>
  </div>
</template>
```

## Puntos Clave

- **Intercambio de tokens del lado del servidor** — `client_secret` nunca llega al navegador
- **Verificación de state** — protección CSRF mediante cookie `oauth_state`
- **`sub` como identificador** — usa siempre `userinfo.sub`, nunca `email`
- **Actualización de tokens** — implementa un middleware del servidor para actualizar automáticamente los tokens expirados
