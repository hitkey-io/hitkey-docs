# Ejemplo con Node.js / Express

Una integración completa de OAuth2 con HitKey usando Node.js y Express.

## Configuración

```bash
npm init -y
npm install express cookie-session
```

## Código del Servidor

```javascript
const express = require('express')
const crypto = require('crypto')
const session = require('cookie-session')

const app = express()
app.use(express.json())
app.use(session({
  name: 'session',
  keys: [crypto.randomBytes(32).toString('hex')],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

const HITKEY_API = 'https://api.hitkey.io'
const HITKEY_AUTH = 'https://hitkey.io'
const CLIENT_ID = process.env.HITKEY_CLIENT_ID
const CLIENT_SECRET = process.env.HITKEY_CLIENT_SECRET
const REDIRECT_URI = 'http://localhost:3000/callback'

// Paso 1: Redirigir a HitKey
app.get('/login', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex')
  req.session.oauthState = state

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    state: state,
    scope: 'openid profile email'
  })

  res.redirect(`${HITKEY_AUTH}/?${params}`)
})

// Paso 2: Manejar callback
app.get('/callback', async (req, res) => {
  const { code, state } = req.query

  // Verificar state
  if (state !== req.session.oauthState) {
    return res.status(400).json({ error: 'Invalid state parameter' })
  }
  delete req.session.oauthState

  // Intercambiar código por tokens
  const tokenRes = await fetch(`${HITKEY_API}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI
    })
  })

  if (!tokenRes.ok) {
    return res.status(400).json({ error: 'Token exchange failed' })
  }

  const tokens = await tokenRes.json()

  // Obtener información del usuario
  const userinfoRes = await fetch(`${HITKEY_API}/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  })

  const userinfo = await userinfoRes.json()

  // Almacenar en sesión
  req.session.user = {
    hitkeyId: userinfo.sub,  // ¡Usa sub como identificador estable!
    email: userinfo.email,
    name: userinfo.display_name || userinfo.name
  }
  req.session.tokens = {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + tokens.expires_in * 1000
  }

  res.redirect('/profile')
})

// Ruta protegida
app.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login')
  }
  res.json({ user: req.session.user })
})

// Cerrar sesión
app.get('/logout', (req, res) => {
  req.session = null
  res.redirect('/')
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
```

## Helper de Actualización de Tokens

```javascript
async function getValidToken(session) {
  if (Date.now() < session.tokens.expiresAt - 60000) {
    return session.tokens.accessToken
  }

  // Actualizar el token
  const res = await fetch(`${HITKEY_API}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: session.tokens.refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    })
  })

  if (!res.ok) {
    throw new Error('Token refresh failed')
  }

  const tokens = await res.json()
  session.tokens = {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + tokens.expires_in * 1000
  }

  return tokens.access_token
}
```

## Integración con Base de Datos

```javascript
// Usando sub (¡no email!) como identificador de usuario
async function findOrCreateUser(userinfo) {
  let user = await db.users.findOne({
    where: { hitkey_user_id: userinfo.sub }
  })

  if (!user) {
    user = await db.users.create({
      hitkey_user_id: userinfo.sub,
      email: userinfo.email,
      display_name: userinfo.display_name
    })
  } else {
    // Actualizar campos en caché en cada inicio de sesión
    await user.update({
      email: userinfo.email,
      display_name: userinfo.display_name
    })
  }

  return user
}
```

## Variables de Entorno

```bash
HITKEY_CLIENT_ID=your_client_id
HITKEY_CLIENT_SECRET=your_client_secret
```
