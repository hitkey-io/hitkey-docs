# Ejemplos con curl

Recorrido completo del flujo OAuth2 usando curl.

## Requisitos Previos

Reemplaza estos marcadores de posición con tus valores reales:

```bash
API_URL="https://api.hitkey.io"
CLIENT_ID="your_client_id"
CLIENT_SECRET="your_client_secret"
REDIRECT_URI="https://myapp.com/callback"
```

## Flujo OAuth2 Completo

### Paso 1: Iniciar sesión para obtener un Bearer token

Primero, autentícate para obtener un Bearer token (esto simula lo que hace el frontend de HitKey):

```bash
curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Respuesta:

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

Guarda el token:

```bash
TOKEN="hitkey_abc123..."
```

### Paso 2: Obtener código de autorización

```bash
curl -s "$API_URL/oauth/authorize?\
client_id=$CLIENT_ID&\
redirect_uri=$REDIRECT_URI&\
response_type=code&\
state=random_state_123&\
scope=openid+profile+email" \
  -H "Authorization: Bearer $TOKEN"
```

Respuesta:

```json
{
  "redirect_url": "https://myapp.com/callback?code=AUTH_CODE_HERE&state=random_state_123"
}
```

Extrae el código de la URL de redirección:

```bash
AUTH_CODE="AUTH_CODE_HERE"
```

### Paso 3: Intercambiar código por tokens

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

Respuesta:

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

### Paso 4: Obtener información del usuario

```bash
curl -s "$API_URL/oauth/userinfo" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Respuesta:

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

### Paso 5: Actualizar tokens

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

## Otros Endpoints Útiles

### Crear un cliente OAuth

```bash
curl -s -X POST "$API_URL/oauth/clients" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My New App",
    "redirect_uri": "https://myapp.com/callback"
  }'
```

### Obtener perfil del usuario actual

```bash
curl -s "$API_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN"
```

### Actualizar perfil

```bash
curl -s -X PATCH "$API_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Johnny",
    "username": "johnny_dev"
  }'
```

### Listar tus emails

```bash
curl -s "$API_URL/auth/emails/" \
  -H "Authorization: Bearer $TOKEN"
```

## Script de Prueba Automatizado

Aquí tienes un script completo que ejecuta el flujo OAuth2 completo:

```bash
#!/bin/bash
set -e

API_URL="https://api.hitkey.io"
CLIENT_ID="your_client_id"
CLIENT_SECRET="your_client_secret"
REDIRECT_URI="https://myapp.com/callback"
EMAIL="user@example.com"
PASSWORD="password123"

echo "1. Iniciando sesión..."
LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
TOKEN=$(echo "$LOGIN" | jq -r '.token')
echo "   Token: ${TOKEN:0:20}..."

echo "2. Obteniendo código de autorización..."
AUTH=$(curl -s "$API_URL/oauth/authorize?client_id=$CLIENT_ID&redirect_uri=$REDIRECT_URI&response_type=code&state=test123&scope=openid+profile+email" \
  -H "Authorization: Bearer $TOKEN")
REDIRECT_URL=$(echo "$AUTH" | jq -r '.redirect_url')
AUTH_CODE=$(echo "$REDIRECT_URL" | grep -o 'code=[^&]*' | cut -d= -f2)
echo "   Code: ${AUTH_CODE:0:20}..."

echo "3. Intercambiando código por tokens..."
TOKENS=$(curl -s -X POST "$API_URL/oauth/token" \
  -H "Content-Type: application/json" \
  -d "{\"grant_type\":\"authorization_code\",\"code\":\"$AUTH_CODE\",\"client_id\":\"$CLIENT_ID\",\"client_secret\":\"$CLIENT_SECRET\",\"redirect_uri\":\"$REDIRECT_URI\"}")
ACCESS_TOKEN=$(echo "$TOKENS" | jq -r '.access_token')
echo "   Access token: ${ACCESS_TOKEN:0:20}..."

echo "4. Obteniendo información del usuario..."
USERINFO=$(curl -s "$API_URL/oauth/userinfo" \
  -H "Authorization: Bearer $ACCESS_TOKEN")
echo "   Sub: $(echo "$USERINFO" | jq -r '.sub')"
echo "   Email: $(echo "$USERINFO" | jq -r '.email')"
echo "   Name: $(echo "$USERINFO" | jq -r '.name')"

echo "¡Hecho!"
```
