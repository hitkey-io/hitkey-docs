# Scopes y Claims

Los scopes controlan a qué datos puede acceder tu aplicación. Solicita solo lo que necesitas.

## Scopes Disponibles

| Scope | Descripción | Claims devueltos |
|-------|-------------|------------------|
| `openid` | Obligatorio. Identifica al usuario. | `sub`, `id` |
| `profile` | Nombre del usuario y preferencias de visualización. | `name`, `given_name`, `family_name`, `display_name`, `preferred_username`, `native_script`, `preferred_order` |
| `email` | Dirección de email del usuario. | `email` |
| `project:read` | Acceso de lectura a la membresía del proyecto. | `project` (objeto con rol y permisos) |

## Solicitar Scopes

Pasa los scopes como una cadena separada por espacios en la URL de autorización:

```
https://hitkey.io/?client_id=...&scope=openid+profile+email&...
```

O codificado en URL:

```
scope=openid%20profile%20email
```

::: warning Scope por defecto
Si no se especifica ningún scope, se devuelven TODOS los claims (equivalente a solicitar todos los scopes). Para restringir la respuesta, especifica siempre los scopes explícitamente.
:::

## Referencia de Claims

### Scope `openid`

| Claim | Tipo | Descripción |
|-------|------|-------------|
| `sub` | string (UUID) | Identificador único e inmutable del usuario |
| `id` | string (UUID) | Mismo valor que `sub` (siempre incluido) |

### Scope `profile`

| Claim | Tipo | Descripción |
|-------|------|-------------|
| `name` | string | Nombre completo formateado |
| `given_name` | string \| null | Nombre(s) de pila |
| `family_name` | string \| null | Apellido(s) |
| `display_name` | string \| null | Nombre preferido para mostrar |
| `preferred_username` | string \| null | Nombre de usuario único (estándar OIDC) |
| `native_script` | string \| null | Nombre en escritura nativa |
| `preferred_order` | `"western"` \| `"eastern"` \| null | Preferencia de orden de visualización del nombre |

### Scope `email`

| Claim | Tipo | Descripción |
|-------|------|-------------|
| `email` | string | Dirección de email predeterminada del usuario |

::: info
El campo `email_verified` **no** es devuelto por `/oauth/userinfo`. Solo se incluye la dirección de email.
:::

### Scope `project:read`

Se utiliza con clientes OAuth vinculados a un proyecto. Devuelve la membresía del usuario en el proyecto del cliente.

| Claim | Tipo | Descripción |
|-------|------|-------------|
| `project.project_id` | string (UUID) | ID del proyecto |
| `project.project_name` | string | Nombre del proyecto |
| `project.project_slug` | string | Slug del proyecto |
| `project.role` | string | Rol del usuario en el proyecto |
| `project.permissions` | string[] | Array de claves de permisos |

::: info
El scope `project:read` solo devuelve datos cuando el cliente OAuth pertenece a un proyecto. Para clientes sin proyecto, este scope se ignora.
:::

## Filtrado de Scopes

HitKey filtra los scopes solicitados a solo aquellos que soporta. Si solicitas un scope desconocido, se ignora silenciosamente — no se devuelve ningún error.

```
Solicitados:  openid profile email custom_scope
Concedidos:   openid profile email
```

## Ejemplo: Mínimo vs Completo

**Mínimo** — solo identificar al usuario:
```
scope=openid
```

Devuelve:
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Completo** — identificar + perfil + email:
```
scope=openid+profile+email
```

Devuelve:
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
