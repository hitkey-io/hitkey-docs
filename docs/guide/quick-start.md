# Quick Start

Integrate HitKey OAuth2 into your application in 5 minutes.

## Prerequisites

- A HitKey account ([sign up](https://hitkey.io))
- An OAuth client (created via [dashboard](https://hitkey.io) or [API](/api/oauth#create-client))

## 1. Create an OAuth Client

You need a `client_id`, `client_secret`, and a registered `redirect_uri`.

**Via API:**

```bash
curl -X POST https://api.hitkey.io/oauth/clients \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My App",
    "redirect_uri": "https://myapp.com/callback"
  }'
```

Response:

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
Store the `client_secret` securely — it's only shown once.
:::

## 2. Redirect to HitKey

Send users to HitKey's authorization page:

```
https://hitkey.io/?client_id=YOUR_CLIENT_ID&redirect_uri=https://myapp.com/callback&response_type=code&state=RANDOM_STATE&scope=openid+profile+email
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `client_id` | Yes | Your OAuth client ID |
| `redirect_uri` | Yes | Must match the registered URI |
| `response_type` | Yes | Always `code` |
| `state` | Yes | Random string for CSRF protection |
| `scope` | No | Space-separated: `openid`, `profile`, `email`, `project:read` |

The user logs in (or registers) and authorizes your app. HitKey redirects back:

```
https://myapp.com/callback?code=AUTH_CODE&state=RANDOM_STATE
```

## 3. Exchange Code for Tokens

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

## 4. Get User Info

```bash
curl https://api.hitkey.io/oauth/userinfo \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

Response:

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

::: tip Key principle
Always use `sub` (UUID) as the stable user identifier in your database — never `email`. See [HitKey Identity](/guide/identity) for details.
:::

## 5. Refresh Tokens

Access tokens expire after 1 hour. Use the refresh token to get a new pair:

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

## Next Steps

- [OAuth2 Flow in detail](/guide/oauth-flow) — full sequence diagrams
- [Scopes & Claims](/guide/scopes) — what data you can request
- [API Reference](/api/oauth) — all OAuth endpoints
- [curl examples](/examples/curl) — complete flow walkthrough
