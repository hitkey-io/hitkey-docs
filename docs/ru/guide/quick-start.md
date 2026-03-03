# Быстрый старт

Интегрируйте HitKey OAuth2 в ваше приложение за 5 минут.

## Предварительные требования

- Аккаунт HitKey ([зарегистрироваться](https://hitkey.io))
- OAuth-клиент (создайте через [кабинет](https://hitkey.io) или [API](/ru/api/oauth#создание-клиента))

## 1. Создайте OAuth-клиент

Вам нужны `client_id`, `client_secret` и зарегистрированный `redirect_uri`.

**Через API:**

```bash
curl -X POST https://api.hitkey.io/oauth/clients \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Моё приложение",
    "redirect_uri": "https://myapp.com/callback"
  }'
```

::: warning
Сохраните `client_secret` в безопасном месте — он показывается только один раз.
:::

## 2. Перенаправьте на HitKey

Отправьте пользователей на страницу авторизации HitKey:

```
https://hitkey.io/?client_id=YOUR_CLIENT_ID&redirect_uri=https://myapp.com/callback&response_type=code&state=RANDOM_STATE&scope=openid+profile+email
```

| Параметр | Обязателен | Описание |
|----------|------------|----------|
| `client_id` | Да | ID вашего OAuth-клиента |
| `redirect_uri` | Да | Должен совпадать с зарегистрированным |
| `response_type` | Да | Всегда `code` |
| `state` | Да | Случайная строка для защиты от CSRF |
| `scope` | Нет | Через пробел: `openid`, `profile`, `email`, `project:read` |

Пользователь входит (или регистрируется) и авторизует ваше приложение. HitKey редиректит обратно:

```
https://myapp.com/callback?code=AUTH_CODE&state=RANDOM_STATE
```

## 3. Обменяйте код на токены

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

Ответ:

```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "dGhpcyBpcyBh...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "openid profile email"
}
```

## 4. Получите информацию о пользователе

```bash
curl https://api.hitkey.io/oauth/userinfo \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

Ответ:

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

::: tip Ключевой принцип
Всегда используйте `sub` (UUID) как стабильный идентификатор пользователя в вашей БД — никогда не `email`. Подробнее: [Идентичность HitKey](/ru/guide/identity).
:::

## 5. Обновление токенов

Access-токены истекают через 1 час. Используйте refresh-токен для получения новой пары:

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

## Следующие шаги

- [OAuth2 Flow подробно](/ru/guide/oauth-flow) — полные диаграммы последовательности
- [Scopes и Claims](/ru/guide/scopes) — какие данные можно запрашивать
- [API OAuth](/ru/api/oauth) — все OAuth-эндпоинты
- [Примеры curl](/ru/examples/curl) — полный пошаговый flow
