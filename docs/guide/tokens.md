# Token Types

HitKey uses several types of tokens. Understanding the difference is important for a correct integration.

## OAuth2 Tokens

These are issued through the OAuth2 flow and used to access HitKey's API on behalf of a user.

### Access Token

| Property | Value |
|----------|-------|
| Lifetime | 1 hour |
| Usage | `Authorization: Bearer <token>` header |
| Endpoint | `/oauth/userinfo` |
| Obtainable via | `/oauth/token` (code exchange or refresh) |

Access tokens are short-lived. When one expires, use the refresh token to get a new one.

### Refresh Token

| Property | Value |
|----------|-------|
| Sliding window | 30 days (resets on each use) |
| Absolute cap | 90 days (maximum lifetime) |
| Usage | `POST /oauth/token` with `grant_type=refresh_token` |
| Rotation | **No** — the same refresh token remains valid |

::: info
OAuth refresh tokens are **not rotated** — the same refresh token can be reused until it expires. Only the access token is refreshed.

This is different from API Bearer token refresh (`POST /auth/token/refresh`), which **does** rotate the refresh token.
:::

### Authorization Code

| Property | Value |
|----------|-------|
| Lifetime | 10 minutes |
| Usage | Single-use, exchanged for access + refresh token |
| Flow | Received via redirect after user authorization |

## API Bearer Tokens

These are HitKey's internal authentication tokens, used for direct API access (not OAuth2).

| Property | Value |
|----------|-------|
| Issued via | `POST /auth/login` |
| Prefix | `hitkey_` |
| Usage | `Authorization: Bearer <token>` header |
| Endpoints | All `/auth/*`, `/projects/*`, `/oauth/clients` |
| Refresh | `POST /auth/token/refresh` — **rotates** refresh token |

::: info When to use which
- **OAuth2 tokens** — when your app accesses HitKey on behalf of a user (the standard partner integration)
- **API Bearer tokens** — when a user interacts with HitKey directly (the HitKey dashboard uses these)

As a partner developer, you'll primarily work with OAuth2 tokens.
:::

## Token Storage Best Practices

| Token | Store where | Notes |
|-------|-------------|-------|
| Access token | Memory or secure storage | Short-lived, ok to refetch |
| Refresh token | Server-side secure storage | Never expose to frontend |
| Client secret | Environment variable | Never in code or frontend |

## Token Security

- **Authorization codes** are hashed (SHA-256) before storage — the API stores only the hash
- **Access and refresh tokens** are also stored as hashes
- **Plaintext tokens** are returned only once at creation time
- Token exchange requires both `client_id` and `client_secret`
