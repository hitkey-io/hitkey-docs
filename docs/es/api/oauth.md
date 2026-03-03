# Endpoints OAuth

Todos los endpoints OAuth están bajo `/oauth`.

## Authorize

Obtiene un código de autorización para el flujo OAuth2.

```
GET /oauth/authorize
```

**Autenticación:** Requerida (Bearer token)

**Parámetros de consulta:**

| Parámetro | Tipo | Obligatorio | Descripción |
|-----------|------|-------------|-------------|
| `client_id` | string | Sí | ID del cliente OAuth |
| `redirect_uri` | string | Sí | Debe coincidir con la URI registrada |
| `response_type` | string | Sí | Debe ser `code` |
| `state` | string | No | Cadena de protección CSRF |
| `scope` | string | No | Scopes separados por espacio |

**Respuesta `200`:**

```json
{
  "redirect_url": "https://myapp.com/callback?code=AUTH_CODE&state=STATE"
}
```

::: info
Este endpoint devuelve una respuesta JSON con la URL de redirección — no realiza una redirección HTTP. El frontend es responsable de redirigir al usuario.
:::

**Errores:**

| Estado | Código | Descripción |
|--------|--------|-------------|
| 400 | — | `"Invalid client_id"` |
| 400 | — | `"redirect_uri doesn't match"` |
| 401 | — | No autenticado |
| 403 | `NOT_PROJECT_MEMBER` | El cliente pertenece a un proyecto privado y el usuario no es miembro |

::: warning Errores OAuth
Las respuestas de error OAuth devuelven mensajes legibles, no códigos de error estructurados:
```json
{
  "error": "Invalid client_id"
}
```
:::

---

## Token

Intercambia un código de autorización por tokens, o actualiza un token existente.

```
POST /oauth/token
```

**Autenticación:** Ninguna (endpoint público)

### Intercambio de Código de Autorización

**Cuerpo de la solicitud:**

```json
{
  "grant_type": "authorization_code",
  "code": "AUTH_CODE",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "redirect_uri": "https://myapp.com/callback"
}
```

**Respuesta `200`:**

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

**Cuerpo de la solicitud:**

```json
{
  "grant_type": "refresh_token",
  "refresh_token": "CURRENT_REFRESH_TOKEN",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET"
}
```

**Respuesta `200`:** Mismo formato que el intercambio de código de autorización.

::: info Sin rotación de tokens
El refresh de OAuth **no** rota el refresh token — el mismo refresh token sigue siendo válido. Solo se actualiza el access token. Los refresh tokens tienen:
- **Ventana deslizante de 30 días** — se reinicia en cada uso
- **Límite absoluto de 90 días** — duración máxima independientemente del uso
:::

::: tip API vs OAuth refresh
Esto es diferente del refresh de token de la API (`POST /auth/token/refresh`), que **sí** rota el refresh token. Consulta [Tipos de Tokens](/es/guide/tokens) para más detalles.
:::

**Errores:**

| Estado | Descripción |
|--------|-------------|
| 400 | `"Invalid or expired authorization code"` |
| 400 | `"Invalid client_id"` |
| 400 | `"redirect_uri doesn't match"` |

::: warning
Los errores de token OAuth devuelven mensajes legibles, no códigos de error estructurados.
:::

---

## User Info

Obtiene el perfil del usuario autenticado mediante access token OAuth. Compatible con OIDC.

```
GET /oauth/userinfo
```

**Autenticación:** Bearer token (access token OAuth)

**Respuesta `200`:**

La respuesta depende de los scopes concedidos. El campo `id` (mismo valor que `sub`) siempre se incluye junto con `sub`.

**Scope `openid`** (siempre incluido):

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Scope `profile`** añade:

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

**Scope `email`** añade:

```json
{
  "email": "user@example.com"
}
```

::: info
El campo `email_verified` no es devuelto por este endpoint. Solo se incluye `email` con el scope `email`.
:::

**Scope `project:read`** añade (cuando el cliente tiene un projectId):

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

**Ejemplo completo** (scopes: `openid profile email`):

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

**Errores:**

| Estado | Descripción |
|--------|-------------|
| 401 | Access token inválido o expirado |

---

## Crear Cliente

Crea una nueva aplicación cliente OAuth.

```
POST /oauth/clients
```

**Autenticación:** Requerida (Bearer token)

**Cuerpo de la solicitud:**

```json
{
  "name": "My Application",
  "redirect_uri": "https://myapp.com/callback"
}
```

**Respuesta `201`:**

```json
{
  "client_id": "38bf5617511df9957e69aad4d4f4c5c3",
  "client_secret": "e466ab329b66210c36617831e5b8cbc1...",
  "name": "My Application",
  "redirect_uri": "https://myapp.com/callback"
}
```

::: warning
El `client_secret` solo se devuelve una vez en el momento de la creación. Almacénalo de forma segura.
:::

---

## Listar Clientes

Lista los clientes OAuth del usuario autenticado.

```
GET /oauth/clients
```

**Autenticación:** Requerida (Bearer token)

**Respuesta `200`:**

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
El `client_secret` no se incluye en las respuestas de listado. Ten en cuenta que las respuestas de listado usan nombres de campos en camelCase (serialización de Lucid ORM), mientras que la respuesta de creación usa snake_case.
:::
