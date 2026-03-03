# Примеры curl

Полный пошаговый OAuth2-flow с использованием curl.

## Подготовка

```bash
API_URL="https://api.hitkey.io"
CLIENT_ID="your_client_id"
CLIENT_SECRET="your_client_secret"
REDIRECT_URI="https://myapp.com/callback"
```

## Полный OAuth2-flow

### Шаг 1: Авторизация

```bash
curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Ответ:

```json
{
  "type": "bearer",
  "token": "hitkey_abc123...",
  "refresh_token": "a1b2c3d4e5f6...",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "John Doe"
  }
}
```

### Шаг 2: Получение authorization code

```bash
curl -s "$API_URL/oauth/authorize?\
client_id=$CLIENT_ID&\
redirect_uri=$REDIRECT_URI&\
response_type=code&\
state=random_state_123&\
scope=openid+profile+email" \
  -H "Authorization: Bearer $TOKEN"
```

### Шаг 3: Обмен кода на токены

```bash
curl -s -X POST "$API_URL/oauth/token" \
  -H "Content-Type: application/json" \
  -d "{
    \"grant_type\": \"authorization_code\",
    \"code\": \"$AUTH_CODE\",
    \"client_id\": \"$CLIENT_ID\",
    \"client_secret\": \"$CLIENT_SECRET\",
    \"redirect_uri\": \"$REDIRECT_URI\"
  }"
```

### Шаг 4: Получение информации о пользователе

```bash
curl -s "$API_URL/oauth/userinfo" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Ответ:

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "display_name": "John Doe",
  "preferred_username": "johndoe"
}
```

### Шаг 5: Обновление токенов

```bash
curl -s -X POST "$API_URL/oauth/token" \
  -H "Content-Type: application/json" \
  -d "{
    \"grant_type\": \"refresh_token\",
    \"refresh_token\": \"$REFRESH_TOKEN\",
    \"client_id\": \"$CLIENT_ID\",
    \"client_secret\": \"$CLIENT_SECRET\"
  }"
```

## Другие полезные запросы

### Создание OAuth-клиента

```bash
curl -s -X POST "$API_URL/oauth/clients" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Новое приложение",
    "redirect_uri": "https://myapp.com/callback"
  }'
```

### Профиль текущего пользователя

```bash
curl -s "$API_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN"
```

### Обновление профиля

```bash
curl -s -X PATCH "$API_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"displayName": "Новое имя"}'
```

Полный автоматизированный скрипт — в [английской версии](/examples/curl#automated-test-script).
