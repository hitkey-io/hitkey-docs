# Жылдам бастау

HitKey OAuth2-ді қосымшаңызға 5 минутта интеграциялаңыз.

## Алғышарттар

- HitKey аккаунты ([тіркелу](https://hitkey.io))
- OAuth клиент ([бақылау тақтасы](https://hitkey.io) немесе [API](/kz/api/oauth#create-client) арқылы жасалған)

## 1. OAuth клиент жасау

Сізге `client_id`, `client_secret` және тіркелген `redirect_uri` қажет.

**API арқылы:**

```bash
curl -X POST https://api.hitkey.io/oauth/clients \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My App",
    "redirect_uri": "https://myapp.com/callback"
  }'
```

Жауап:

```json
{
  "id": "uuid",
  "name": "My App",
  "client_id": "38bf5617511df9957e69aad4d4f4c5c3",
  "client_secret": "e466ab329b66210c36617831e5b8cbc1...",
  "redirect_uri": "https://myapp.com/callback"
}
```

::: warning
`client_secret`-ті қауіпсіз сақтаңыз — ол тек бір рет көрсетіледі.
:::

## 2. HitKey-ге бағыттау

Пайдаланушыларды HitKey авторизация бетіне жіберіңіз:

```
https://hitkey.io/?client_id=YOUR_CLIENT_ID&redirect_uri=https://myapp.com/callback&response_type=code&state=RANDOM_STATE&scope=openid+profile+email
```

| Параметр | Міндетті | Сипаттама |
|----------|----------|-----------|
| `client_id` | Иә | Сіздің OAuth клиент ID |
| `redirect_uri` | Иә | Тіркелген URI-мен сәйкес келуі тиіс |
| `response_type` | Иә | Әрқашан `code` |
| `state` | Иә | CSRF қорғанысына арналған кездейсоқ жол |
| `scope` | Жоқ | Бос орынмен бөлінген: `openid`, `profile`, `email`, `project:read` |

Пайдаланушы кіреді (немесе тіркеледі) және сіздің қосымшаңызды авторизациялайды. HitKey кері бағыттайды:

```
https://myapp.com/callback?code=AUTH_CODE&state=RANDOM_STATE
```

## 3. Кодты токендерге айырбастау

```bash
curl -X POST https://api.hitkey.io/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "authorization_code",
    "code": "AUTH_CODE",
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "redirect_uri": "https://myapp.com/callback"
  }'
```

Жауап:

```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "dGhpcyBpcyBh...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "openid profile email"
}
```

## 4. Пайдаланушы ақпаратын алу

```bash
curl https://api.hitkey.io/oauth/userinfo \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

Жауап:

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "email_verified": true,
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "display_name": "John Doe"
}
```

::: tip Негізгі қағида
Деректер қорында тұрақты пайдаланушы идентификаторы ретінде әрқашан `sub` (UUID) пайдаланыңыз — ешқашан `email` емес. Толық ақпарат үшін [HitKey сәйкестік](/kz/guide/identity) бетін қараңыз.
:::

## 5. Токендерді жаңарту

Access токендер 1 сағаттан кейін аяқталады. Жаңа жұпты алу үшін refresh токенді пайдаланыңыз:

```bash
curl -X POST https://api.hitkey.io/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "refresh_token",
    "refresh_token": "dGhpcyBpcyBh...",
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET"
  }'
```

## Келесі қадамдар

- [OAuth2 Flow толығырақ](/kz/guide/oauth-flow) — толық реттілік диаграммалары
- [Scopes & Claims](/kz/guide/scopes) — қандай деректерді сұрауға болады
- [API анықтамасы](/kz/api/oauth) — барлық OAuth эндпоинттері
- [curl мысалдары](/kz/examples/curl) — толық ағынды қадамдап өту
