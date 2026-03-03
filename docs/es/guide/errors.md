# Códigos de Error

HitKey devuelve respuestas de error estructuradas. Esta página lista todos los códigos de error por categoría.

## Formato de Respuesta

La mayoría de las respuestas de error siguen esta estructura:

```json
{
  "error": "Human-readable description",
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

## Errores de Autenticación

| Código | HTTP | Descripción |
|--------|------|-------------|
| `INVALID_CREDENTIALS` | 401 | Email o contraseña incorrectos |
| `EMAIL_NOT_VERIFIED` | 401 | Email aún no verificado |

## Errores de 2FA

| Código | HTTP | Descripción |
|--------|------|-------------|
| `INVALID_CODE` | 400 | Código TOTP incorrecto |
| `SETUP_NOT_INITIATED` | 400 | 2FA no configurado para este usuario |
| `NOT_ENABLED` | 400 | 2FA no está habilitado (no se puede deshabilitar) |
| `INVALID_TOKEN` | 400 | Token de desafío inválido o expirado |

## Errores de Gestión de Email

| Código | HTTP | Descripción |
|--------|------|-------------|
| `EMAIL_ALREADY_IN_USE` | 400 | El email está registrado en otra cuenta |
| `INVALID_CODE` | 400 | Código de verificación incorrecto |
| `CODE_EXPIRED` | 400 | El código de verificación ha expirado |
| `TOO_MANY_ATTEMPTS` | 400 | Se excedió el máximo de intentos de verificación |
| `EMAIL_NOT_FOUND` | 404 | Email no asociado con esta cuenta |
| `EMAIL_NOT_VERIFIED` | 400 | El email aún no está verificado |
| `ONLY_VERIFIED_EMAIL` | 400 | No se puede eliminar la única dirección de email verificada |

## Errores de Perfil

| Código | HTTP | Descripción |
|--------|------|-------------|
| `USERNAME_INVALID` | 400 | Formato de nombre de usuario inválido |
| `USERNAME_RESERVED` | 400 | Nombre de usuario reservado por el sistema |
| `USERNAME_TAKEN` | 409 | Nombre de usuario ya en uso |

## Errores de Registro

| Código | HTTP | Descripción |
|--------|------|-------------|
| `EMAIL_ALREADY_VERIFIED` | 400 | Este email ya está verificado |
| `INVALID_CODE` | 400 | Código de verificación incorrecto |
| `TOO_MANY_ATTEMPTS` | 400 | Máximo de intentos excedido (solicita un nuevo código) |
| `CODE_EXPIRED` | 400 | El código de verificación ha expirado |
| `NO_CODE` | 400 | No hay verificación pendiente para este email |

## Errores de Restablecimiento de Contraseña

| Código | HTTP | Descripción |
|--------|------|-------------|
| `INVALID_TOKEN` | 400 | Token de restablecimiento inválido |
| `TOKEN_EXPIRED` | 400 | Token de restablecimiento expirado |

## Errores OAuth

Los endpoints OAuth devuelven mensajes de error legibles en lugar de códigos de error estructurados:

```json
{
  "error": "Invalid client_id"
}
```

Mensajes de error comunes:

| Mensaje | HTTP | Descripción |
|---------|------|-------------|
| `"Invalid client_id"` | 400 | client_id desconocido |
| `"redirect_uri doesn't match"` | 400 | redirect_uri no coincide con la URI registrada |
| `"Invalid or expired authorization code"` | 400 | El código ya fue utilizado o ha expirado |

## Errores de Proyecto

| Código | HTTP | Descripción |
|--------|------|-------------|
| `NOT_PROJECT_MEMBER` | 403 | El usuario no es miembro del proyecto |
| `ALREADY_MEMBER` | 400 | El usuario ya es miembro del proyecto |
| `CANNOT_TRANSFER_TO_SELF` | 400 | No se puede transferir la propiedad a uno mismo |
| `INVITE_ALREADY_EXISTS` | 400 | Ya existe una invitación para este email |
| `INVITE_NOT_FOUND` | 404 | Invitación no encontrada |
| `INVITE_EXPIRED` | 400 | La invitación ha expirado |
| `EMAIL_MISMATCH` | 400 | El email del usuario no coincide con el de la invitación |

## Códigos de Estado HTTP

| Estado | Significado |
|--------|------------|
| 200 | Éxito |
| 201 | Creado |
| 202 | Aceptado (desafío 2FA) |
| 400 | Solicitud incorrecta / error de validación |
| 401 | No autenticado |
| 403 | Prohibido (permisos insuficientes) |
| 404 | No encontrado |
| 409 | Conflicto (p. ej., username ya en uso) |
| 422 | Entidad no procesable (validación) |
| 429 | Demasiadas solicitudes |
| 500 | Error interno del servidor |
