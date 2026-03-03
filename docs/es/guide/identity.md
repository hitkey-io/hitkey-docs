# Identidad HitKey

Entender cómo HitKey identifica a los usuarios es **fundamental** para una integración correcta.

## El Principio Central

> **HitKey = una persona, no un email.**

Una persona puede tener muchas direcciones de email. Los emails cambian — las personas cambian de proveedor, las empresas renombran dominios, los usuarios añaden emails personales y de trabajo. Pero la **persona** sigue siendo la misma.

## `sub` — El Identificador Estable

Cuando llamas a `/oauth/userinfo`, la respuesta incluye un claim `sub`:

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com"
}
```

El campo `sub` es:
- Un **UUID** — universalmente único, nunca reutilizado
- **Inmutable** — nunca cambia para un usuario dado
- El **único** identificador que debes almacenar como clave foránea

## Nunca Uses Email como Clave Primaria

Los emails en HitKey son:
- **Mutables** — los usuarios pueden cambiar su email predeterminado en cualquier momento
- **Múltiples** — un usuario puede tener 5, 10 o más emails verificados
- **En caché** — el campo `email` en userinfo refleja el predeterminado actual, que puede cambiar

Si usas `email` como identificador de usuario, crearás cuentas duplicadas cuando un usuario cambie su email.

## Patrón de Integración Correcto

### Esquema de tu base de datos

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hitkey_user_id UUID NOT NULL UNIQUE, -- sub de /oauth/userinfo
  email TEXT,                           -- en caché, actualizado en cada inicio de sesión
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### En cada inicio de sesión OAuth

```javascript
const userinfo = await fetch('https://api.hitkey.io/oauth/userinfo', {
  headers: { Authorization: `Bearer ${accessToken}` }
}).then(r => r.json())

// Buscar o crear por sub — NUNCA por email
let user = await db.users.findBy('hitkey_user_id', userinfo.sub)

if (!user) {
  user = await db.users.create({
    hitkey_user_id: userinfo.sub,
    email: userinfo.email,
    display_name: userinfo.display_name
  })
} else {
  // Actualizar campos en caché en cada inicio de sesión
  await user.update({
    email: userinfo.email,
    display_name: userinfo.display_name
  })
}
```

::: danger Error común
```javascript
// INCORRECTO — creará duplicados cuando el email cambie
let user = await db.users.findBy('email', userinfo.email)
```
:::

## Soporte Multi-Email

Los usuarios de HitKey pueden tener múltiples direcciones de email verificadas:

- **Email predeterminado** — devuelto en `userinfo.email`
- **Emails adicionales** — gestionados a través del panel de HitKey
- **Verificación** — cada email se verifica de forma independiente

Cuando un usuario cambia su email predeterminado, la siguiente llamada a `/oauth/userinfo` devolverá el nuevo. Tu aplicación debe actualizar su copia en caché.

## Estructura de Nombres

HitKey soporta formatos de nombre internacionales:

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| `name` | Nombre completo formateado | "John Doe" |
| `given_name` | Nombre(s) de pila | "John" |
| `family_name` | Apellido(s) | "Doe" |
| `display_name` | Nombre preferido para mostrar | "John" |

Los nombres pueden estructurarse tanto para convenciones occidentales ("John Doe") como orientales ("Doe John") mediante la configuración `preferred_order` del usuario.

## Resumen

| Correcto | Incorrecto |
|----------|------------|
| Usar `sub` como clave foránea | Usar `email` como clave única |
| Añadir constraint `UNIQUE` en `hitkey_user_id` | Asumir que el email es estable |
| Actualizar el email en caché en cada inicio de sesión | Omitir la llamada a userinfo |
| Manejar campos opcionales ausentes | Requerir todos los campos de nombre |
