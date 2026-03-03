# OAuth Endpoints

All OAuth endpoints are under `/oauth`.

## Authorize

Get an authorization code for the OAuth2 flow.

```
GET /oauth/authorize
```

**Authentication:** Required (Bearer token)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | OAuth client ID |
| `redirect_uri` | string | Yes | Must match registered URI |
| `response_type` | string | Yes | Must be `code` |
| `state` | string | No | CSRF protection string |
| `scope` | string | No | Space-separated scopes |

**Response `200`:**

```json
{
  "redirect_url": "https://myapp.com/callback?code=AUTH_CODE&state=STATE"
}
```

::: info
This endpoint returns a JSON response with the redirect URL — it does not perform an HTTP redirect. The frontend is responsible for redirecting the user.
:::

**Errors:**

| Status | Code | Description |
|--------|------|-------------|
| 400 | — | `"Invalid client_id"` |
| 400 | — | `"redirect_uri doesn't match"` |
| 401 | — | Not authenticated |
| 403 | `NOT_PROJECT_MEMBER` | Client belongs to a private project and user isn't a member |

::: warning OAuth errors
OAuth error responses return human-readable error messages, not structured error codes:
```json
{
  "error": "Invalid client_id"
}
```
:::

---

## Token

Exchange an authorization code for tokens, or refresh an existing token.

```
POST /oauth/token
```

**Authentication:** None (public endpoint)

### Authorization Code Exchange

**Request Body:**

```json
{
  "grant_type": "authorization_code",
  "code": "AUTH_CODE",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "redirect_uri": "https://myapp.com/callback"
}
```

**Response `200`:**

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

**Request Body:**

```json
{
  "grant_type": "refresh_token",
  "refresh_token": "CURRENT_REFRESH_TOKEN",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET"
}
```

**Response `200`:** Same format as authorization code exchange.

::: info No token rotation
OAuth refresh does **not** rotate the refresh token — the same refresh token remains valid. Only the access token is refreshed. Refresh tokens have:
- **30-day sliding window** — resets on each use
- **90-day absolute cap** — maximum lifetime regardless of usage
:::

::: tip API vs OAuth refresh
This is different from the API token refresh (`POST /auth/token/refresh`), which **does** rotate the refresh token. See [Token Types](/guide/tokens) for details.
:::

**Errors:**

| Status | Description |
|--------|-------------|
| 400 | `"Invalid or expired authorization code"` |
| 400 | `"Invalid client_id"` |
| 400 | `"redirect_uri doesn't match"` |

::: warning
OAuth token errors return human-readable messages, not structured error codes.
:::

---

## User Info

Get the authenticated user's profile via OAuth access token. OIDC-compatible.

```
GET /oauth/userinfo
```

**Authentication:** Bearer token (OAuth access token)

**Response `200`:**

The response depends on the granted scopes. The `id` field (same value as `sub`) is always included alongside `sub`.

**Scope `openid`** (always included):

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Scope `profile`** adds:

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

**Scope `email`** adds:

```json
{
  "email": "user@example.com"
}
```

::: info
The `email_verified` field is not returned by this endpoint. Only `email` is included with the `email` scope.
:::

**Scope `project:read`** adds (when client has a projectId):

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

**Full example** (scopes: `openid profile email`):

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

**Errors:**

| Status | Description |
|--------|-------------|
| 401 | Invalid or expired access token |

---

## Create Client

Create a new OAuth client application.

```
POST /oauth/clients
```

**Authentication:** Required (Bearer token)

**Request Body:**

```json
{
  "name": "My Application",
  "redirect_uri": "https://myapp.com/callback"
}
```

**Response `201`:**

```json
{
  "client_id": "38bf5617511df9957e69aad4d4f4c5c3",
  "client_secret": "e466ab329b66210c36617831e5b8cbc1...",
  "name": "My Application",
  "redirect_uri": "https://myapp.com/callback"
}
```

::: warning
The `client_secret` is only returned once at creation time. Store it securely.
:::

---

## List Clients

List OAuth clients owned by the authenticated user.

```
GET /oauth/clients
```

**Authentication:** Required (Bearer token)

**Response `200`:**

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
The `client_secret` is not included in list responses. Note that list responses use camelCase field names (Lucid ORM serialization), while create response uses snake_case.
:::
