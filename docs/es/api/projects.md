# Endpoints de Proyectos

Todos los endpoints de proyectos están bajo `/projects`.

## Crear Proyecto

```
POST /projects/
```

**Autenticación:** Requerida

**Cuerpo de la solicitud:**

```json
{
  "name": "My App",
  "description": "My awesome application",
  "is_public": true
}
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `name` | string | Sí | Nombre del proyecto |
| `description` | string | No | Descripción del proyecto |
| `is_public` | boolean | No | Público o privado (por defecto: false) |

::: info
El `slug` siempre se genera automáticamente a partir del nombre del proyecto y no puede especificarse en el cuerpo de la solicitud.
:::

**Respuesta `201`:**

```json
{
  "id": "uuid",
  "name": "My App",
  "slug": "my-app",
  "description": "My awesome application",
  "is_public": true,
  "owner_id": "user-uuid",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

---

## Listar Proyectos

```
GET /projects/
```

**Autenticación:** Requerida

Devuelve todos los proyectos de los que el usuario es miembro.

---

## Obtener Proyecto

```
GET /projects/:slug
```

**Autenticación:** Requerida

---

## Actualizar Proyecto

```
PATCH /projects/:slug
```

**Autenticación:** Requerida (owner o admin)

**Cuerpo de la solicitud** (todos opcionales):

```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "is_public": false
}
```

---

## Eliminar Proyecto

```
DELETE /projects/:slug
```

**Autenticación:** Requerida (solo owner)

---

## Unirse a un Proyecto

Unirse a un proyecto público.

```
POST /projects/:slug/join
```

**Autenticación:** Requerida

::: info
Solo funciona para proyectos públicos. Para proyectos privados, usa invitaciones.
:::

---

## Abandonar Proyecto

```
DELETE /projects/:slug/leave
```

**Autenticación:** Requerida

::: warning
El owner del proyecto no puede abandonarlo. Transfiere la propiedad primero.
:::

---

## Listar Miembros

```
GET /projects/:slug/members
```

**Autenticación:** Requerida (miembro del proyecto)

**Respuesta `200`:**

```json
[
  {
    "id": "member-uuid",
    "user_id": "user-uuid",
    "role": "owner",
    "user": {
      "id": "user-uuid",
      "email": "owner@example.com",
      "display_name": "Project Owner"
    },
    "permissions": [],
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Añadir Miembro

```
POST /projects/:slug/members
```

**Autenticación:** Requerida (owner o admin)

**Cuerpo de la solicitud:**

```json
{
  "email": "user@example.com",
  "role": "member",
  "permissions": ["can_deploy"]
}
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `email` | string | Sí | Email del usuario a añadir |
| `role` | `"admin"` \| `"member"` | No | Rol (por defecto: member) |
| `permissions` | string[] | No | Array de claves de permisos |

---

## Actualizar Miembro

```
PATCH /projects/:slug/members/:memberId
```

**Autenticación:** Requerida (owner o admin)

**Cuerpo de la solicitud:**

```json
{
  "role": "admin",
  "permissions": ["can_deploy", "can_edit"]
}
```

::: info
Los permisos usan claves de tipo string (p. ej., `"can_deploy"`, `"editor"`), no UUIDs.
:::

---

## Eliminar Miembro

```
DELETE /projects/:slug/members/:memberId
```

**Autenticación:** Requerida (owner o admin)

---

## Transferir Propiedad

```
POST /projects/:slug/transfer-ownership
```

**Autenticación:** Requerida (solo owner)

**Cuerpo de la solicitud:**

```json
{
  "new_owner_id": "new-owner-uuid"
}
```

El owner actual se convierte en admin después de la transferencia.

---

## Permisos

### Listar Permisos

```
GET /projects/:slug/permissions
```

### Crear Permiso

```
POST /projects/:slug/permissions
```

**Cuerpo de la solicitud:**

```json
{
  "key": "can_deploy",
  "display_name": "Can Deploy",
  "description": "Allow deployment to production",
  "is_default": false
}
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `key` | string | Sí | Identificador único del permiso |
| `display_name` | string | Sí | Nombre legible |
| `description` | string | No | Descripción del permiso |
| `is_default` | boolean | No | Si se asigna a nuevos miembros por defecto (por defecto: false) |

### Actualizar Permiso

```
PATCH /projects/:slug/permissions/:permissionId
```

### Eliminar Permiso

```
DELETE /projects/:slug/permissions/:permissionId
```

---

## Clientes OAuth del Proyecto

### Crear Cliente

```
POST /projects/:slug/clients
```

**Cuerpo de la solicitud:**

```json
{
  "name": "My App OAuth Client",
  "redirect_uri": "https://myapp.com/callback"
}
```

### Listar Clientes

```
GET /projects/:slug/clients
```

---

## Invitaciones del Proyecto

### Listar Invitaciones

```
GET /projects/:slug/invites
```

### Crear Invitación

```
POST /projects/:slug/invites
```

**Cuerpo de la solicitud:**

```json
{
  "email": "user@example.com",
  "role": "member",
  "redirect_url": "https://myapp.com/welcome"
}
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `email` | string | Sí | Email del usuario a invitar |
| `role` | `"admin"` \| `"member"` | No | Rol (por defecto: member) |
| `redirect_url` | string | No | URL de redirección después de aceptar |

::: info
Las invitaciones expiran después de **7 días**.
:::

### Cancelar Invitación

```
DELETE /projects/:slug/invites/:inviteId
```
