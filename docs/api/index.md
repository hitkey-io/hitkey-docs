# API Reference

## Base URL

| Environment | URL |
|-------------|-----|
| Production | `https://api.hitkey.io` |

## Authentication

Most endpoints require authentication via Bearer token:

```
Authorization: Bearer YOUR_TOKEN
```

Two types of tokens are used:
- **API Bearer tokens** — from `POST /auth/login` (for direct API access)
- **OAuth access tokens** — from `POST /oauth/token` (for partner integrations)

See [Token Types](/guide/tokens) for details.

## Response Format

All responses are JSON. Successful responses return the data directly:

```json
{
  "id": "uuid",
  "name": "Example"
}
```

Error responses use this primary format:

```json
{
  "error": "Human-readable message",
  "code": "ERROR_CODE"
}
```

AdonisJS validation errors (HTTP 422) use an array format:

```json
{
  "errors": [
    {
      "message": "Validation failed",
      "rule": "required",
      "field": "email"
    }
  ]
}
```

## Interactive Documentation

A Swagger UI is available at:

| Environment | URL |
|-------------|-----|
| Production | `https://api.hitkey.io/docs` |

The OpenAPI spec can be fetched at `/swagger.json`.

## Endpoints Overview

### OAuth (`/oauth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/oauth/authorize` | Yes | Get authorization code |
| `POST` | `/oauth/token` | No | Exchange code / refresh token |
| `GET` | `/oauth/userinfo` | OAuth | Get user profile (OIDC) |
| `POST` | `/oauth/clients` | Yes | Create OAuth client |
| `GET` | `/oauth/clients` | Yes | List your OAuth clients |

### Auth (`/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register/start` | No | Start registration |
| `POST` | `/auth/register/verify` | No | Verify email code |
| `POST` | `/auth/register/password` | No | Set password (auto-login) |
| `POST` | `/auth/register/resend` | No | Resend verification code |
| `POST` | `/auth/register/with-invite` | No | Register via project invite |
| `POST` | `/auth/login` | No | Login |
| `POST` | `/auth/logout` | Yes | Logout |
| `GET` | `/auth/me` | Yes | Current user |
| `PATCH` | `/auth/profile` | Yes | Update profile |
| `POST` | `/auth/token/refresh` | No | Refresh API token |
| `POST` | `/auth/password/forgot` | No | Request password reset |
| `POST` | `/auth/password/reset` | No | Complete password reset |

### 2FA (`/auth/2fa`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/auth/2fa/setup` | Yes | Get TOTP setup (QR code) |
| `POST` | `/auth/2fa/enable` | Yes | Enable 2FA |
| `POST` | `/auth/2fa/disable` | Yes | Disable 2FA |
| `POST` | `/auth/2fa/verify` | No | Verify TOTP during login |

### Emails (`/auth/emails`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/auth/emails/` | Yes | List all emails |
| `POST` | `/auth/emails/` | Yes | Add email |
| `POST` | `/auth/emails/verify` | Yes | Verify added email |
| `POST` | `/auth/emails/resend` | Yes | Resend verification |
| `PATCH` | `/auth/emails/:id/default` | Yes | Set default email |
| `DELETE` | `/auth/emails/:id` | Yes | Delete email |

### Users (`/users`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/users/search` | Yes | Search users by email/name/username |

**Search parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search term (email, name, or username) |
| `project_slug` | string | No | Filter by project context |

Returns a maximum of 10 matching users.

### Projects (`/projects`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/projects/` | Yes | Create project |
| `GET` | `/projects/` | Yes | List projects |
| `GET` | `/projects/:slug` | Yes | Get project |
| `PATCH` | `/projects/:slug` | Yes | Update project |
| `DELETE` | `/projects/:slug` | Yes | Delete project |
| `POST` | `/projects/:slug/join` | Yes | Join project |
| `DELETE` | `/projects/:slug/leave` | Yes | Leave project |

### Project Members (`/projects/:slug/members`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/projects/:slug/members` | Yes | List members |
| `POST` | `/projects/:slug/members` | Yes | Add member |
| `PATCH` | `/projects/:slug/members/:id` | Yes | Update member |
| `DELETE` | `/projects/:slug/members/:id` | Yes | Remove member |
| `POST` | `/projects/:slug/transfer-ownership` | Yes | Transfer ownership |

### Invites (`/invites`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/invites/:token` | No | View invite |
| `POST` | `/invites/:token/accept` | Yes | Accept invite |

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | No | Health check |
| `GET` | `/docs` | No | Swagger UI |
| `GET` | `/swagger.json` | No | OpenAPI spec |
