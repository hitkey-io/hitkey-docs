# Nuxt 3/4 Example

Integrate HitKey OAuth2 into a Nuxt application using server routes and composables.

## Setup

```bash
npx nuxi init my-app
cd my-app
```

Add environment variables to `.env`:

```bash
HITKEY_API_URL=https://api.hitkey.io
HITKEY_AUTH_URL=https://hitkey.io
HITKEY_CLIENT_ID=your_client_id
HITKEY_CLIENT_SECRET=your_client_secret
HITKEY_REDIRECT_URI=http://localhost:3000/auth/callback
```

Configure in `nuxt.config.ts`:

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

## Server Routes

### `server/api/auth/login.get.ts` — Initiate OAuth

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

### `server/api/auth/callback.get.ts` — Handle Callback

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

### `server/api/auth/me.get.ts` — Current User

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

## Frontend Composable

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

## Page Example

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

## Key Points

- **Server-side token exchange** — `client_secret` never reaches the browser
- **State verification** — CSRF protection via `oauth_state` cookie
- **`sub` as identifier** — always use `userinfo.sub`, never `email`
- **Token refresh** — implement a server middleware to auto-refresh expired tokens
