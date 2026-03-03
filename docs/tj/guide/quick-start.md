# Оғози зуд

OAuth2 HitKey-ро ба барномаи худ дар 5 дақиқа ҳамгиро кунед.

## Пешшартҳо

- Ҳисоби HitKey ([бақайдгирӣ](https://hitkey.io))
- OAuth client (тавассути [панел](https://hitkey.io) ё [API](/tj/api/oauth#create-client) сохта мешавад)

## 1. Сохтани OAuth Client

Ба шумо `client_id`, `client_secret` ва `redirect_uri`-и бақайдшуда лозим аст.

**Тавассути API:**

```bash
curl -X POST https://api.hitkey.io/oauth/clients \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My App",
    "redirect_uri": "https://myapp.com/callback"
  }'
```

Ҷавоб:

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
`client_secret`-ро бехатар нигоҳ доред — он танҳо як маротиба нишон дода мешавад.
:::

## 2. Равона кардан ба HitKey

Корбаронро ба саҳифаи авторизатсияи HitKey равона кунед:

```
https://hitkey.io/?client_id=YOUR_CLIENT_ID&redirect_uri=https://myapp.com/callback&response_type=code&state=RANDOM_STATE&scope=openid+profile+email
```

| Параметр | Ҳатмӣ | Тавсиф |
|----------|-------|--------|
| `client_id` | Ҳа | ID-и OAuth client-и шумо |
| `redirect_uri` | Ҳа | Бояд бо URI-и бақайдшуда мувофиқ бошад |
| `response_type` | Ҳа | Ҳамеша `code` |
| `state` | Ҳа | Сатри тасодуфӣ барои ҳифозат аз CSRF |
| `scope` | Не | Бо фосила ҷудо шуда: `openid`, `profile`, `email`, `project:read` |

Корбар ворид мешавад (ё бақайд мегирад) ва барномаи шуморо иҷозат медиҳад. HitKey бозгашт медиҳад:

```
https://myapp.com/callback?code=AUTH_CODE&state=RANDOM_STATE
```

## 3. Иваз кардани Code ба Token-ҳо

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

Ҷавоб:

```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "dGhpcyBpcyBh...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "openid profile email"
}
```

## 4. Гирифтани маълумоти корбар

```bash
curl https://api.hitkey.io/oauth/userinfo \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

Ҷавоб:

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

::: tip Принсипи асосӣ
Ҳамеша `sub` (UUID)-ро ҳамчун идентификатори устувори корбар дар базаи маълумоти худ истифода баред — ҳеҷ гоҳ `email`-ро не. Барои тафсилот [Ҳувияти HitKey](/tj/guide/identity)-ро бубинед.
:::

## 5. Навсозии Token-ҳо

Access token-ҳо пас аз 1 соат беэътибор мешаванд. Refresh token-ро барои гирифтани ҷуфти нав истифода баред:

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

## Қадамҳои навбатӣ

- [Ҷараёни OAuth2 ба таfсил](/tj/guide/oauth-flow) — диаграммаҳои пурраи ҷараён
- [Scopes ва Claims](/tj/guide/scopes) — кадом маълумотро дархост карда метавонед
- [Маълумотномаи API](/tj/api/oauth) — ҳамаи нуқтаҳои OAuth
- [Мисолҳои curl](/tj/examples/curl) — дастури пурраи ҷараён
