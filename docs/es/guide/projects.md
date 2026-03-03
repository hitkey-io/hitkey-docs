# Proyectos

Los proyectos te permiten organizar clientes OAuth, gestionar miembros del equipo y controlar el acceso — todo delimitado a una única aplicación o servicio.

## Visión General

Un proyecto es un contenedor para:
- **Clientes OAuth** — cada proyecto puede tener sus propios clientes OAuth
- **Miembros del equipo** — con roles (owner, admin, member)
- **Permisos personalizados** — control de acceso granular
- **Invitaciones** — invitar colaboradores por email

## Tipos de Proyecto

| Tipo | Descripción | Unirse |
|------|-------------|--------|
| **Public** | Visible para todos los usuarios | Cualquiera puede unirse |
| **Private** | Visible solo para miembros | Solo por invitación |

## Roles

| Rol | Gestionar miembros | Gestionar configuración | Gestionar clientes | Eliminar proyecto |
|-----|--------------------|-----------------------|--------------------|-------------------|
| **Owner** | Sí | Sí | Sí | Sí |
| **Admin** | Sí | Sí | Sí | No |
| **Member** | No | No | No | No |

Cada proyecto tiene exactamente un **owner**. La propiedad puede transferirse a otro miembro.

## Crear un Proyecto

```bash
curl -X POST https://api.hitkey.io/projects/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My App",
    "description": "My awesome application",
    "is_public": true
  }'
```

El `slug` se genera automáticamente a partir del nombre y no puede especificarse manualmente.

## Clientes OAuth del Proyecto

Cada proyecto puede tener sus propios clientes OAuth. Cuando un usuario se autoriza a través de un cliente vinculado a un proyecto, el scope `project:read` proporciona acceso a su membresía en ese proyecto.

```bash
# Crear un cliente OAuth para un proyecto
curl -X POST https://api.hitkey.io/projects/my-app/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My App OAuth",
    "redirect_uri": "https://myapp.com/callback"
  }'
```

## Gestión del Equipo

### Añadir un miembro

```bash
curl -X POST https://api.hitkey.io/projects/my-app/members \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "role": "member",
    "permissions": ["can_deploy"]
  }'
```

Los miembros se añaden por dirección de email. Opcionalmente puedes asignar permisos al mismo tiempo.

### Actualizar rol de miembro

```bash
curl -X PATCH https://api.hitkey.io/projects/my-app/members/MEMBER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }'
```

### Transferir propiedad

```bash
curl -X POST https://api.hitkey.io/projects/my-app/transfer-ownership \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "new_owner_id": "new-owner-uuid"
  }'
```

## Permisos Personalizados

Los proyectos soportan permisos personalizados que pueden asignarse a los miembros:

```bash
# Crear un permiso
curl -X POST https://api.hitkey.io/projects/my-app/permissions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "can_deploy",
    "display_name": "Can Deploy",
    "description": "Allow deployment",
    "is_default": false
  }'
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `key` | string | Sí | Identificador único del permiso |
| `display_name` | string | Sí | Nombre legible |
| `description` | string | No | Descripción del permiso |
| `is_default` | boolean | No | Asignar a nuevos miembros por defecto |

## Invitaciones

Invita usuarios a tu proyecto por email:

```bash
curl -X POST https://api.hitkey.io/projects/my-app/invites \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "colleague@example.com",
    "role": "member",
    "redirect_url": "https://myapp.com/welcome"
  }'
```

::: info
Las invitaciones expiran después de **7 días**. El `redirect_url` opcional se incluye en la respuesta de aceptación para que el cliente redirija al usuario después de aceptar.
:::

El usuario invitado recibe un email con un enlace. Puede aceptar:
1. Haciendo clic en el enlace (requiere autenticación)
2. Llamando a `POST /invites/:token/accept`

Consulta la [API de Invitaciones](/es/api/invites) para más detalles.
