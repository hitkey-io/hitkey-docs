# Referencia de la API

## URL Base

| Entorno | URL |
|---------|-----|
| Producción | `https://api.hitkey.io` |

## Autenticación

La mayoría de los endpoints requieren autenticación mediante Bearer token:

```
Authorization: Bearer YOUR_TOKEN
```

Se utilizan dos tipos de tokens:
- **Tokens Bearer de la API** — de `POST /auth/login` (para acceso directo a la API)
- **Tokens de acceso OAuth** — de `POST /oauth/token` (para integraciones de partners)

Consulta [Tipos de Tokens](/es/guide/tokens) para más detalles.

## Formato de Respuesta

Todas las respuestas son JSON. Las respuestas exitosas devuelven los datos directamente:

```json
{
  "id": "uuid",
  "name": "Example"
}
```

Las respuestas de error usan este formato principal:

```json
{
  "error": "Human-readable message",
  "code": "ERROR_CODE"
}
```

Los errores de validación de AdonisJS (HTTP 422) usan un formato de array:

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

## Documentación Interactiva

Una interfaz Swagger UI está disponible en:

| Entorno | URL |
|---------|-----|
| Producción | `https://api.hitkey.io/docs` |

La especificación OpenAPI se puede obtener en `/swagger.json`.

## Resumen de Endpoints

### OAuth (`/oauth`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/oauth/authorize` | Sí | Obtener código de autorización |
| `POST` | `/oauth/token` | No | Intercambiar código / refresh token |
| `GET` | `/oauth/userinfo` | OAuth | Obtener perfil del usuario (OIDC) |
| `POST` | `/oauth/clients` | Sí | Crear cliente OAuth |
| `GET` | `/oauth/clients` | Sí | Listar tus clientes OAuth |

### Auth (`/auth`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `POST` | `/auth/register/start` | No | Iniciar registro |
| `POST` | `/auth/register/verify` | No | Verificar código de email |
| `POST` | `/auth/register/password` | No | Establecer contraseña (inicio de sesión automático) |
| `POST` | `/auth/register/resend` | No | Reenviar código de verificación |
| `POST` | `/auth/register/with-invite` | No | Registrarse mediante invitación de proyecto |
| `POST` | `/auth/login` | No | Iniciar sesión |
| `POST` | `/auth/logout` | Sí | Cerrar sesión |
| `GET` | `/auth/me` | Sí | Usuario actual |
| `PATCH` | `/auth/profile` | Sí | Actualizar perfil |
| `POST` | `/auth/token/refresh` | No | Actualizar token de la API |
| `POST` | `/auth/password/forgot` | No | Solicitar restablecimiento de contraseña |
| `POST` | `/auth/password/reset` | No | Completar restablecimiento de contraseña |

### 2FA (`/auth/2fa`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/auth/2fa/setup` | Sí | Obtener configuración TOTP (código QR) |
| `POST` | `/auth/2fa/enable` | Sí | Habilitar 2FA |
| `POST` | `/auth/2fa/disable` | Sí | Deshabilitar 2FA |
| `POST` | `/auth/2fa/verify` | No | Verificar TOTP durante inicio de sesión |

### Emails (`/auth/emails`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/auth/emails/` | Sí | Listar todos los emails |
| `POST` | `/auth/emails/` | Sí | Añadir email |
| `POST` | `/auth/emails/verify` | Sí | Verificar email añadido |
| `POST` | `/auth/emails/resend` | Sí | Reenviar verificación |
| `PATCH` | `/auth/emails/:id/default` | Sí | Establecer email predeterminado |
| `DELETE` | `/auth/emails/:id` | Sí | Eliminar email |

### Usuarios (`/users`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/users/search` | Sí | Buscar usuarios por email/nombre/username |

**Parámetros de búsqueda:**

| Parámetro | Tipo | Obligatorio | Descripción |
|-----------|------|-------------|-------------|
| `q` | string | Sí | Término de búsqueda (email, nombre o username) |
| `project_slug` | string | No | Filtrar por contexto de proyecto |

Devuelve un máximo de 10 usuarios coincidentes.

### Proyectos (`/projects`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `POST` | `/projects/` | Sí | Crear proyecto |
| `GET` | `/projects/` | Sí | Listar proyectos |
| `GET` | `/projects/:slug` | Sí | Obtener proyecto |
| `PATCH` | `/projects/:slug` | Sí | Actualizar proyecto |
| `DELETE` | `/projects/:slug` | Sí | Eliminar proyecto |
| `POST` | `/projects/:slug/join` | Sí | Unirse a un proyecto |
| `DELETE` | `/projects/:slug/leave` | Sí | Abandonar proyecto |

### Miembros del Proyecto (`/projects/:slug/members`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/projects/:slug/members` | Sí | Listar miembros |
| `POST` | `/projects/:slug/members` | Sí | Añadir miembro |
| `PATCH` | `/projects/:slug/members/:id` | Sí | Actualizar miembro |
| `DELETE` | `/projects/:slug/members/:id` | Sí | Eliminar miembro |
| `POST` | `/projects/:slug/transfer-ownership` | Sí | Transferir propiedad |

### Invitaciones (`/invites`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/invites/:token` | No | Ver invitación |
| `POST` | `/invites/:token/accept` | Sí | Aceptar invitación |

### Salud

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/health` | No | Comprobación de salud |
| `GET` | `/docs` | No | Swagger UI |
| `GET` | `/swagger.json` | No | Especificación OpenAPI |
