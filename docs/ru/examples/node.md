# Пример на Node.js / Express

Полная интеграция HitKey OAuth2 с использованием Node.js и Express.

Полный код с комментариями — в [английской версии](/examples/node).

## Ключевые моменты

```javascript
// 1. Редирект на HitKey
app.get('/login', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex')
  req.session.oauthState = state

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    state,
    scope: 'openid profile email'
  })

  res.redirect(`${HITKEY_AUTH}/?${params}`)
})

// 2. Обработка callback
app.get('/callback', async (req, res) => {
  // Проверка state
  if (req.query.state !== req.session.oauthState) {
    return res.status(400).json({ error: 'Invalid state' })
  }

  // Обмен кода на токены
  const tokens = await fetch(`${HITKEY_API}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code: req.query.code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI
    })
  }).then(r => r.json())

  // Получение профиля — используйте sub, не email!
  const userinfo = await fetch(`${HITKEY_API}/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  }).then(r => r.json())

  req.session.user = {
    hitkeyId: userinfo.sub,
    email: userinfo.email,
    name: userinfo.display_name
  }

  res.redirect('/profile')
})
```

## Важно

- `client_secret` — только на бэкенде, никогда на фронтенде
- `state` — генерируйте, сохраняйте в сессии, проверяйте
- `sub` — единственный стабильный идентификатор пользователя
