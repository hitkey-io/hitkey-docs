# curl мысалдары

curl арқылы толық OAuth2 ағынын қадамдап өту.

## Алғышарттар

Мына толтырғыштарды нақты мәндеріңізбен ауыстырыңыз:

```bash
API_URL="https://api.hitkey.io"
CLIENT_ID="your_client_id"
CLIENT_SECRET="your_client_secret"
REDIRECT_URI="https://myapp.com/callback"
```

## Толық OAuth2 ағыны

### 1-қадам: Bearer токен алу үшін кіру

Алдымен Bearer токен алу үшін аутентификациялаңыз (бұл HitKey фронтендінің іс-әрекетін имитациялайды):

```bash
curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Жауап:

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

Токенді сақтаңыз:

```bash
TOKEN="hitkey_abc123..."
```

### 2-қадам: Авторизация кодын алу

```bash
curl -s "$API_URL/oauth/authorize?\
client_id=$CLIENT_ID&\
redirect_uri=$REDIRECT_URI&\
response_type=code&\
state=random_state_123&\
scope=openid+profile+email" \
  -H "Authorization: Bearer $TOKEN"
```

Жауап:

```json
{
  "redirect_url": "https://myapp.com/callback?code=AUTH_CODE_HERE&state=random_state_123"
}
```

Redirect URL-ден кодты шығарыңыз:

```bash
AUTH_CODE="AUTH_CODE_HERE"
```

### 3-қадам: Кодты токендерге айырбастау

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

```bash
ACCESS_TOKEN="eyJhbGciOi..."
REFRESH_TOKEN="dGhpcyBpcyBh..."
```

### 4-қадам: Пайдаланушы ақпаратын алу

```bash
curl -s "$API_URL/oauth/userinfo" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Жауап:

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

### 5-қадам: Токендерді жаңарту

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

## Басқа пайдалы эндпоинттер

### OAuth клиент жасау

```bash
curl -s -X POST "$API_URL/oauth/clients" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My New App",
    "redirect_uri": "https://myapp.com/callback"
  }'
```

### Ағымдағы пайдаланушы профилін алу

```bash
curl -s "$API_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN"
```

### Профильді жаңарту

```bash
curl -s -X PATCH "$API_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Johnny",
    "username": "johnny_dev"
  }'
```

### Email-дер тізімін алу

```bash
curl -s "$API_URL/auth/emails/" \
  -H "Authorization: Bearer $TOKEN"
```

## Автоматтандырылған тест скрипті

Міне толық OAuth2 ағынын орындайтын скрипт:

```bash
#!/bin/bash
set -e

API_URL="https://api.hitkey.io"
CLIENT_ID="your_client_id"
CLIENT_SECRET="your_client_secret"
REDIRECT_URI="https://myapp.com/callback"
EMAIL="user@example.com"
PASSWORD="password123"

echo "1. Кіру..."
LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
TOKEN=$(echo "$LOGIN" | jq -r '.token')
echo "   Токен: ${TOKEN:0:20}..."

echo "2. Авторизация кодын алу..."
AUTH=$(curl -s "$API_URL/oauth/authorize?client_id=$CLIENT_ID&redirect_uri=$REDIRECT_URI&response_type=code&state=test123&scope=openid+profile+email" \
  -H "Authorization: Bearer $TOKEN")
REDIRECT_URL=$(echo "$AUTH" | jq -r '.redirect_url')
AUTH_CODE=$(echo "$REDIRECT_URL" | grep -o 'code=[^&]*' | cut -d= -f2)
echo "   Код: ${AUTH_CODE:0:20}..."

echo "3. Кодты токендерге айырбастау..."
TOKENS=$(curl -s -X POST "$API_URL/oauth/token" \
  -H "Content-Type: application/json" \
  -d "{\"grant_type\":\"authorization_code\",\"code\":\"$AUTH_CODE\",\"client_id\":\"$CLIENT_ID\",\"client_secret\":\"$CLIENT_SECRET\",\"redirect_uri\":\"$REDIRECT_URI\"}")
ACCESS_TOKEN=$(echo "$TOKENS" | jq -r '.access_token')
echo "   Access токен: ${ACCESS_TOKEN:0:20}..."

echo "4. Пайдаланушы ақпаратын алу..."
USERINFO=$(curl -s "$API_URL/oauth/userinfo" \
  -H "Authorization: Bearer $ACCESS_TOKEN")
echo "   Sub: $(echo "$USERINFO" | jq -r '.sub')"
echo "   Email: $(echo "$USERINFO" | jq -r '.email')"
echo "   Ат: $(echo "$USERINFO" | jq -r '.name')"

echo "Дайын!"
```
