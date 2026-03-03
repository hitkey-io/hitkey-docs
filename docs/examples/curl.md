# curl Examples

Complete OAuth2 flow walkthrough using curl.

## Prerequisites

Replace these placeholders with your actual values:

```bash
API_URL="https://api.hitkey.io"
CLIENT_ID="your_client_id"
CLIENT_SECRET="your_client_secret"
REDIRECT_URI="https://myapp.com/callback"
```

## Full OAuth2 Flow

### Step 1: Login to get a Bearer token

First, authenticate to get a Bearer token (this simulates what HitKey's frontend does):

```bash
curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Response:

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

Save the token:

```bash
TOKEN="hitkey_abc123..."
```

### Step 2: Get authorization code

```bash
curl -s "$API_URL/oauth/authorize?\
client_id=$CLIENT_ID&\
redirect_uri=$REDIRECT_URI&\
response_type=code&\
state=random_state_123&\
scope=openid+profile+email" \
  -H "Authorization: Bearer $TOKEN"
```

Response:

```json
{
  "redirect_url": "https://myapp.com/callback?code=AUTH_CODE_HERE&state=random_state_123"
}
```

Extract the code from the redirect URL:

```bash
AUTH_CODE="AUTH_CODE_HERE"
```

### Step 3: Exchange code for tokens

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

Response:

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

### Step 4: Get user info

```bash
curl -s "$API_URL/oauth/userinfo" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Response:

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

### Step 5: Refresh tokens

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

## Other Useful Endpoints

### Create an OAuth client

```bash
curl -s -X POST "$API_URL/oauth/clients" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My New App",
    "redirect_uri": "https://myapp.com/callback"
  }'
```

### Get current user profile

```bash
curl -s "$API_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN"
```

### Update profile

```bash
curl -s -X PATCH "$API_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Johnny",
    "username": "johnny_dev"
  }'
```

### List your emails

```bash
curl -s "$API_URL/auth/emails/" \
  -H "Authorization: Bearer $TOKEN"
```

## Automated Test Script

Here's a complete script that runs the full OAuth2 flow:

```bash
#!/bin/bash
set -e

API_URL="https://api.hitkey.io"
CLIENT_ID="your_client_id"
CLIENT_SECRET="your_client_secret"
REDIRECT_URI="https://myapp.com/callback"
EMAIL="user@example.com"
PASSWORD="password123"

echo "1. Logging in..."
LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
TOKEN=$(echo "$LOGIN" | jq -r '.token')
echo "   Token: ${TOKEN:0:20}..."

echo "2. Getting authorization code..."
AUTH=$(curl -s "$API_URL/oauth/authorize?client_id=$CLIENT_ID&redirect_uri=$REDIRECT_URI&response_type=code&state=test123&scope=openid+profile+email" \
  -H "Authorization: Bearer $TOKEN")
REDIRECT_URL=$(echo "$AUTH" | jq -r '.redirect_url')
AUTH_CODE=$(echo "$REDIRECT_URL" | grep -o 'code=[^&]*' | cut -d= -f2)
echo "   Code: ${AUTH_CODE:0:20}..."

echo "3. Exchanging code for tokens..."
TOKENS=$(curl -s -X POST "$API_URL/oauth/token" \
  -H "Content-Type: application/json" \
  -d "{\"grant_type\":\"authorization_code\",\"code\":\"$AUTH_CODE\",\"client_id\":\"$CLIENT_ID\",\"client_secret\":\"$CLIENT_SECRET\",\"redirect_uri\":\"$REDIRECT_URI\"}")
ACCESS_TOKEN=$(echo "$TOKENS" | jq -r '.access_token')
echo "   Access token: ${ACCESS_TOKEN:0:20}..."

echo "4. Getting user info..."
USERINFO=$(curl -s "$API_URL/oauth/userinfo" \
  -H "Authorization: Bearer $ACCESS_TOKEN")
echo "   Sub: $(echo "$USERINFO" | jq -r '.sub')"
echo "   Email: $(echo "$USERINFO" | jq -r '.email')"
echo "   Name: $(echo "$USERINFO" | jq -r '.name')"

echo "Done!"
```
