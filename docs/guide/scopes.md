# Scopes & Claims

Scopes control what data your application can access. Request only what you need.

## Available Scopes

| Scope | Description | Claims returned |
|-------|-------------|-----------------|
| `openid` | Required. Identifies the user. | `sub`, `id` |
| `profile` | User's name and display preferences. | `name`, `given_name`, `family_name`, `display_name`, `preferred_username`, `native_script`, `preferred_order` |
| `email` | User's email address. | `email` |
| `project:read` | Read access to project membership. | `project` (object with role and permissions) |

## Requesting Scopes

Pass scopes as a space-separated string in the authorization URL:

```
https://hitkey.io/?client_id=...&scope=openid+profile+email&...
```

Or URL-encoded:

```
scope=openid%20profile%20email
```

::: warning Default scope
If no scope is specified, all claims are returned (equivalent to requesting all scopes). To restrict the response, always specify scopes explicitly.
:::

## Claims Reference

### `openid` scope

| Claim | Type | Description |
|-------|------|-------------|
| `sub` | string (UUID) | Unique, immutable user identifier |
| `id` | string (UUID) | Same value as `sub` (always included) |

### `profile` scope

| Claim | Type | Description |
|-------|------|-------------|
| `name` | string | Full formatted name |
| `given_name` | string \| null | First/given name(s) |
| `family_name` | string \| null | Last/family name |
| `display_name` | string \| null | User's preferred display name |
| `preferred_username` | string \| null | Unique username (OIDC standard) |
| `native_script` | string \| null | Name in native script |
| `preferred_order` | `"western"` \| `"eastern"` \| null | Name display order preference |

### `email` scope

| Claim | Type | Description |
|-------|------|-------------|
| `email` | string | User's default email address |

::: info
The `email_verified` field is **not** returned by `/oauth/userinfo`. Only the email address is included.
:::

### `project:read` scope

Used with project-scoped OAuth clients. Returns the user's membership in the client's project.

| Claim | Type | Description |
|-------|------|-------------|
| `project.project_id` | string (UUID) | Project ID |
| `project.project_name` | string | Project name |
| `project.project_slug` | string | Project slug |
| `project.role` | string | User's role in the project |
| `project.permissions` | string[] | Array of permission keys |

::: info
The `project:read` scope only returns data when the OAuth client belongs to a project. For clients without a project, this scope is ignored.
:::

## Scope Filtering

HitKey filters requested scopes to only those it supports. If you request an unknown scope, it's silently ignored — no error is returned.

```
Requested:  openid profile email custom_scope
Granted:    openid profile email
```

## Example: Minimal vs Full

**Minimal** — just identify the user:
```
scope=openid
```

Returns:
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Full** — identify + profile + email:
```
scope=openid+profile+email
```

Returns:
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "display_name": "John Doe",
  "preferred_username": "johndoe",
  "native_script": null,
  "preferred_order": "western",
  "email": "user@example.com"
}
```
