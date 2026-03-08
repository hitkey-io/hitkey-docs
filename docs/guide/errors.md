# Error Codes

HitKey returns structured error responses. This page lists all error codes by category.

## Response Format

Most error responses follow this structure:

```json
{
  "error": "Human-readable description",
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

## Authentication Errors

| Code | HTTP | Description |
|------|------|-------------|
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `EMAIL_NOT_VERIFIED` | 401 | Email not yet verified |

## 2FA Errors

| Code | HTTP | Description |
|------|------|-------------|
| `INVALID_CODE` | 400 | Wrong TOTP code |
| `SETUP_NOT_INITIATED` | 400 | 2FA not configured for this user |
| `NOT_ENABLED` | 400 | 2FA is not enabled (cannot disable) |
| `INVALID_TOKEN` | 400 | Challenge token is invalid or expired |

## Email Management Errors

| Code | HTTP | Description |
|------|------|-------------|
| `EMAIL_ALREADY_IN_USE` | 400 | Email is registered to another account |
| `INVALID_CODE` | 400 | Wrong verification code |
| `CODE_EXPIRED` | 400 | Verification code has expired |
| `TOO_MANY_ATTEMPTS` | 400 | Maximum verification attempts exceeded |
| `EMAIL_NOT_FOUND` | 404 | Email not associated with this account |
| `EMAIL_NOT_VERIFIED` | 400 | Email is not yet verified |
| `ONLY_VERIFIED_EMAIL` | 400 | Cannot delete the only verified email address |

## Profile Errors

| Code | HTTP | Description |
|------|------|-------------|
| `USERNAME_INVALID` | 400 | Username format is invalid |
| `USERNAME_RESERVED` | 400 | Username is reserved by the system |
| `USERNAME_TAKEN` | 409 | Username is already in use |

## Registration Errors

| Code | HTTP | Description |
|------|------|-------------|
| `EMAIL_ALREADY_VERIFIED` | 400 | This email is already verified |
| `INVALID_CODE` | 400 | Wrong verification code |
| `TOO_MANY_ATTEMPTS` | 400 | Maximum attempts exceeded (request a new code) |
| `CODE_EXPIRED` | 400 | Verification code has expired |
| `NO_CODE` | 400 | No pending verification for this email |

## Password Reset Errors

| Code | HTTP | Description |
|------|------|-------------|
| `INVALID_TOKEN` | 400 | Reset token is invalid |
| `TOKEN_EXPIRED` | 400 | Reset token has expired |

## OAuth Errors

OAuth endpoints return human-readable error messages rather than structured error codes:

```json
{
  "error": "Invalid client_id"
}
```

Common error messages:

| Message | HTTP | Description |
|---------|------|-------------|
| `"Invalid client_id"` | 400 | Unknown client_id |
| `"redirect_uri doesn't match"` | 400 | redirect_uri doesn't match registered URI |
| `"Invalid or expired authorization code"` | 400 | Code has already been used or expired |

## Project Errors

| Code | HTTP | Description |
|------|------|-------------|
| `NOT_PROJECT_MEMBER` | 403 | User is not a member of the project |
| `ALREADY_MEMBER` | 400 | User is already a project member |
| `CANNOT_TRANSFER_TO_SELF` | 400 | Cannot transfer ownership to yourself |
| `INVITE_ALREADY_EXISTS` | 400 | An invite for this email already exists |
| `INVITE_NOT_FOUND` | 404 | Invite not found |
| `INVITE_EXPIRED` | 400 | Invite has expired |
| `EMAIL_MISMATCH` | 400 | User's email doesn't match invite email |
| `ADMIN_CANNOT_EDIT_ADMIN` | 403 | Admin cannot edit other admin's permissions |

## HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 201 | Created |
| 202 | Accepted (2FA challenge) |
| 400 | Bad request / validation error |
| 401 | Not authenticated |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not found |
| 409 | Conflict (e.g., username taken) |
| 422 | Unprocessable entity (validation) |
| 429 | Too many requests |
| 500 | Internal server error |
