# Нуқтаҳои ниҳоии OAuth

Ҳамаи нуқтаҳои ниҳоии OAuth дар зери `/oauth` ҳастанд.

## Authorize

Гирифтани authorization code барои ҷараёни OAuth2.

```
GET /oauth/authorize
```

**Тасдиқи ҳувият:** Ҳатмӣ (Bearer token)

**Параметрҳои Query:**

| Параметр | Намуд | Ҳатмӣ | Тавсиф |
|----------|-------|-------|--------|
| `client_id` | string | Ҳа | ID-и OAuth client |
| `redirect_uri` | string | Ҳа | Бояд бо URI-и бақайдшуда мувофиқ бошад |
| `response_type` | string | Ҳа | Бояд `code` бошад |
| `state` | string | Не | Сатри ҳифозат аз CSRF |
| `scope` | string | Не | Scope-ҳо бо фосила ҷудо шуда |

**Ҷавоби `200`:**

```json
{
  "redirect_url": "https://myapp.com/callback?code=AUTH_CODE&state=STATE"
}
```

::: info
Ин нуқтаи ниҳоӣ ҷавоби JSON бо URL-и redirect бармегардонад — он HTTP redirect иҷро намекунад. Frontend масъули равона кардани корбар аст.
:::

**Хатогиҳо:**

| Ҳолат | Рамз | Тавсиф |
|-------|------|--------|
| 400 | — | `"Invalid client_id"` |
| 400 | — | `"redirect_uri doesn't match"` |
| 401 | — | Тасдиқ нашудааст |
| 403 | `NOT_PROJECT_MEMBER` | Client ба лоиҳаи хусусӣ тааллуқ дорад ва корбар аъзо нест |

::: warning Хатоҳои OAuth
Ҷавобҳои хатои OAuth паёмҳои хоношавандаи одамиро бармегардонанд, на рамзҳои хатои сохторманд:
```json
{
  "error": "Invalid client_id"
}
```
:::

---

## Token

Мубодилаи authorization code ба token-ҳо, ё навсозии token-и мавҷуда.

```
POST /oauth/token
```

**Тасдиқи ҳувият:** Не (нуқтаи ниҳоии оммавӣ)

### Мубодилаи Authorization Code

**Бадани дархост:**

```json
{
  "grant_type": "authorization_code",
  "code": "AUTH_CODE",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "redirect_uri": "https://myapp.com/callback"
}
```

**Ҷавоби `200`:**

```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "dGhpcyBpcyBh...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "openid profile email"
}
```

### Refresh Token

**Бадани дархост:**

```json
{
  "grant_type": "refresh_token",
  "refresh_token": "CURRENT_REFRESH_TOKEN",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET"
}
```

**Ҷавоби `200`:** Ҳамон формат, ки дар мубодилаи authorization code.

::: info Бе ротатсияи token
Навсозии OAuth refresh token-ро **ротатсия намекунад** — ҳамон refresh token эътибор мемонад. Танҳо access token навсозӣ мешавад. Refresh token-ҳо доранд:
- **Равзанаи лағжандаи 30-рӯза** — дар ҳар истифода аз нав танзим мешавад
- **Ҳадди мутлақи 90-рӯза** — ҳадди максималии мӯҳлат новобаста аз истифода
:::

::: tip API ва OAuth refresh
Ин аз навсозии token-и API (`POST /auth/token/refresh`) фарқ мекунад, ки refresh token-ро **ротатсия мекунад**. Барои тафсилот [Намудҳои Token](/tj/guide/tokens)-ро бубинед.
:::

**Хатогиҳо:**

| Ҳолат | Тавсиф |
|-------|--------|
| 400 | `"Invalid or expired authorization code"` |
| 400 | `"Invalid client_id"` |
| 400 | `"redirect_uri doesn't match"` |

::: warning
Хатоҳои token-и OAuth паёмҳои хоношавандаи одамиро бармегардонанд, на рамзҳои хатои сохторманд.
:::

---

## User Info

Гирифтани профили корбари тасдиқшуда тавассути OAuth access token. Мувофиқи OIDC.

```
GET /oauth/userinfo
```

**Тасдиқи ҳувият:** Bearer token (OAuth access token)

**Ҷавоби `200`:**

Ҷавоб ба scope-ҳои додашуда вобаста аст. Майдони `id` (ҳамон қимат бо `sub`) ҳамеша дар баробари `sub` дохил карда мешавад.

**Scope-и `openid`** (ҳамеша дохил аст):

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Scope-и `profile`** илова мекунад:

```json
{
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "display_name": "John Doe",
  "preferred_username": "johndoe",
  "native_script": null,
  "preferred_order": "western"
}
```

**Scope-и `email`** илова мекунад:

```json
{
  "email": "user@example.com"
}
```

::: info
Майдони `email_verified` аз ин нуқтаи ниҳоӣ баргардонида намешавад. Танҳо `email` бо scope-и `email` дохил карда мешавад.
:::

**Scope-и `project:read`** илова мекунад (вақте ки client projectId дорад):

```json
{
  "project": {
    "project_id": "uuid",
    "project_name": "My App",
    "project_slug": "my-app",
    "role": "member",
    "permissions": ["can_deploy", "can_edit"]
  }
}
```

**Мисоли пурра** (scope-ҳо: `openid profile email`):

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "display_name": "John Doe",
  "preferred_username": "johndoe",
  "native_script": null,
  "preferred_order": "western"
}
```

**Хатогиҳо:**

| Ҳолат | Тавсиф |
|-------|--------|
| 401 | Access token беэътибор ё мӯҳлаташ гузашта |

---

## Сохтани Client

Сохтани барномаи нави OAuth client.

```
POST /oauth/clients
```

**Тасдиқи ҳувият:** Ҳатмӣ (Bearer token)

**Бадани дархост:**

```json
{
  "name": "My Application",
  "redirect_uri": "https://myapp.com/callback"
}
```

**Ҷавоби `201`:**

```json
{
  "client_id": "38bf5617511df9957e69aad4d4f4c5c3",
  "client_secret": "e466ab329b66210c36617831e5b8cbc1...",
  "name": "My Application",
  "redirect_uri": "https://myapp.com/callback"
}
```

::: warning
`client_secret` танҳо як маротиба ҳангоми сохтан баргардонида мешавад. Онро бехатар нигоҳ доред.
:::

---

## Рӯйхати Client-ҳо

Рӯйхати OAuth client-ҳои корбари тасдиқшуда.

```
GET /oauth/clients
```

**Тасдиқи ҳувият:** Ҳатмӣ (Bearer token)

**Ҷавоби `200`:**

```json
[
  {
    "id": "uuid",
    "name": "My Application",
    "clientId": "38bf5617511df9957e69aad4d4f4c5c3",
    "redirectUri": "https://myapp.com/callback",
    "userId": "user-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

::: info
`client_secret` дар ҷавобҳои рӯйхат дохил нест. Дар назар доред, ки ҷавобҳои рӯйхат номҳои майдонҳои camelCase (сериализатсияи Lucid ORM) истифода мебаранд, дар ҳоле ки ҷавоби сохтан snake_case истифода мекунад.
:::
