# Auth Endpoints

All authentication endpoints are under `/auth`.

## Login

Authenticate with email and password.

```
POST /auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response `200`:**

```json
{
  "type": "bearer",
  "token": "hitkey_...",
  "refresh_token": "a1b2c3d4e5f6...",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "John Doe"
  }
}
```

**2FA Challenge Response `202`:**

If the user has 2FA enabled, login returns a challenge instead:

```json
{
  "totp_required": true,
  "challenge_token": "a1b2c3d4e5f6..."
}
```

Complete the challenge with `POST /auth/2fa/verify`.

**Errors:**

| Status | Code | Description |
|--------|------|-------------|
| 401 | `INVALID_CREDENTIALS` | Wrong email or password |
| 401 | `EMAIL_NOT_VERIFIED` | Email not yet verified |

---

## Logout

Invalidate the current token.

```
POST /auth/logout
```

**Authentication:** Required

**Response `200`:**

```json
{
  "message": "Logged out successfully"
}
```

---

## Current User

Get the authenticated user's profile.

```
GET /auth/me
```

**Authentication:** Required

**Response `200`:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "surname": "Doe",
  "givenNames": "John",
  "displayName": "John Doe",
  "nativeScript": null,
  "preferredOrder": "western",
  "username": "johndoe",
  "emailVerified": true,
  "totpEnabled": false,
  "emails": [
    {
      "id": "email-uuid",
      "email": "user@example.com",
      "isDefault": true,
      "isVerified": true
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Update Profile

Update the current user's profile.

```
PATCH /auth/profile
```

**Authentication:** Required

**Request Body** (all fields optional):

```json
{
  "surname": "Smith",
  "givenNames": "Jane",
  "displayName": "Jane Smith",
  "nativeScript": "ジェーン",
  "preferredOrder": "western",
  "username": "janesmith"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `surname` | string \| null | Family name |
| `givenNames` | string \| null | Given name(s) |
| `displayName` | string \| null | Preferred display name |
| `nativeScript` | string \| null | Name in native script |
| `preferredOrder` | `"western"` \| `"eastern"` \| null | Name display order |
| `username` | string \| null | Unique username (3-30 chars, alphanumeric + underscore) |

**Errors:**

| Status | Code | Description |
|--------|------|-------------|
| 400 | `USERNAME_INVALID` | Invalid username format |
| 400 | `USERNAME_RESERVED` | Username is reserved |
| 409 | `USERNAME_TAKEN` | Username already in use |

---

## Token Refresh

Refresh an API Bearer token.

```
POST /auth/token/refresh
```

**Request Body:**

```json
{
  "refresh_token": "a1b2c3d4e5f6..."
}
```

**Response `200`:**

```json
{
  "type": "bearer",
  "token": "hitkey_...",
  "refresh_token": "new_hex_token...",
  "expires_in": 3600
}
```

::: info Token rotation
API token refresh rotates the refresh token — each use returns a new refresh token and invalidates the old one. Always store the new refresh token from the response.
:::

---

## Password Reset

### Request Reset

```
POST /auth/password/forgot
```

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response `200`:**

```json
{
  "message": "If this email exists, a reset link has been sent"
}
```

### Complete Reset

```
POST /auth/password/reset
```

**Request Body:**

```json
{
  "token": "RESET_TOKEN",
  "password": "new_password"
}
```

::: info
Reset tokens expire after **15 minutes**.
:::

**Errors:**

| Status | Code | Description |
|--------|------|-------------|
| 400 | `INVALID_TOKEN` | Token is invalid |
| 400 | `TOKEN_EXPIRED` | Token has expired |

---

## 2FA (TOTP)

### Setup

Get the TOTP secret and QR code URI for authenticator app setup.

```
GET /auth/2fa/setup
```

**Authentication:** Required

**Response `200`:**

```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCodeUrl": "otpauth://totp/HitKey:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=HitKey"
}
```

### Enable

Enable 2FA after verifying a TOTP code.

```
POST /auth/2fa/enable
```

**Authentication:** Required

**Request Body:**

```json
{
  "code": "123456"
}
```

### Disable

Disable 2FA with a valid TOTP code.

```
POST /auth/2fa/disable
```

**Authentication:** Required

**Request Body:**

```json
{
  "code": "123456"
}
```

### Verify (Login Challenge)

Complete 2FA challenge during login.

```
POST /auth/2fa/verify
```

**Request Body:**

```json
{
  "challenge_token": "a1b2c3d4e5f6...",
  "code": "123456"
}
```

**Response `200`:** Same as login response (token + refresh_token + expires_in + user).

**Errors:**

| Status | Code | Description |
|--------|------|-------------|
| 400 | `INVALID_CODE` | Wrong TOTP code |
| 400 | `SETUP_NOT_INITIATED` | 2FA not configured |
| 400 | `NOT_ENABLED` | Not enabled (disable) |
| 400 | `INVALID_TOKEN` | Invalid challenge token |
