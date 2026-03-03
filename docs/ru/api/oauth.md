# OAuth эндпоинты

Все OAuth-эндпоинты находятся под `/oauth`.

## Authorize

Получение authorization code для OAuth2-flow.

```
GET /oauth/authorize
```

**Аутентификация:** Обязательна (Bearer токен)

**Query-параметры:**

| Параметр | Тип | Обязателен | Описание |
|----------|-----|------------|----------|
| `client_id` | string | Да | ID OAuth-клиента |
| `redirect_uri` | string | Да | Должен совпадать с зарегистрированным |
| `response_type` | string | Да | Должен быть `code` |
| `state` | string | Нет | Строка для защиты от CSRF |
| `scope` | string | Нет | Scopes через пробел |

**Ответ `200`:**

```json
{
  "redirect_url": "https://myapp.com/callback?code=AUTH_CODE&state=STATE"
}
```

::: info
Этот эндпоинт возвращает JSON с redirect URL — он не выполняет HTTP-редирект. Фронтенд отвечает за перенаправление пользователя.
:::

**Ошибки:**

| Статус | Описание |
|--------|----------|
| 400 | `"Invalid client_id"` |
| 400 | `"redirect_uri doesn't match"` |
| 401 | Не аутентифицирован |
| 403 | `NOT_PROJECT_MEMBER` — клиент принадлежит приватному проекту, пользователь не участник |

---

## Token

Обмен authorization code на токены или обновление существующего токена.

```
POST /oauth/token
```

### Обмен Authorization Code

```json
{
  "grant_type": "authorization_code",
  "code": "AUTH_CODE",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "redirect_uri": "https://myapp.com/callback"
}
```

**Ответ `200`:**

```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "dGhpcyBpcyBh...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "openid profile email"
}
```

### Обновление токена

```json
{
  "grant_type": "refresh_token",
  "refresh_token": "CURRENT_REFRESH_TOKEN",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET"
}
```

::: info Без ротации
OAuth-обновление **не ротирует** refresh-токен — тот же refresh-токен остаётся действительным. Обновляется только access-токен. Скользящее окно: **30 дней**. Абсолютный лимит: **90 дней**.
:::

---

## User Info

Получение профиля через OAuth access-токен. OIDC-совместимый.

```
GET /oauth/userinfo
```

**Аутентификация:** Bearer токен (OAuth access token)

Ответ зависит от предоставленных scopes:

- **`openid`**: `sub`, `id`
- **`profile`**: `name`, `given_name`, `family_name`, `display_name`, `preferred_username`, `native_script`, `preferred_order`
- **`email`**: `email`
- **`project:read`**: `project` (объект с ролью и разрешениями)

::: info
Поле `email_verified` **не возвращается** этим эндпоинтом. Поле `id` (равное `sub`) всегда включено.
:::

---

## Создание клиента

```
POST /oauth/clients
```

**Аутентификация:** Обязательна

```json
{
  "name": "Моё приложение",
  "redirect_uri": "https://myapp.com/callback"
}
```

**Ответ `201`:**

```json
{
  "client_id": "38bf5617511df9957e69aad4d4f4c5c3",
  "client_secret": "e466ab329b66210c36617831e5b8cbc1...",
  "name": "Моё приложение",
  "redirect_uri": "https://myapp.com/callback"
}
```

::: warning
`client_secret` возвращается только один раз при создании.
:::

---

## Список клиентов

```
GET /oauth/clients
```

**Аутентификация:** Обязательна

Возвращает список OAuth-клиентов текущего пользователя (без `client_secret`). Ответ использует camelCase (сериализация Lucid ORM): `clientId`, `redirectUri`, `createdAt`.
