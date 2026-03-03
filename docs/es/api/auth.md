# Endpoints de Auth

Todos los endpoints de autenticación están bajo `/auth`.

## Login

Autenticarse con email y contraseña.

```
POST /auth/login
```

**Cuerpo de la solicitud:**

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Respuesta `200`:**

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

**Respuesta de desafío 2FA `202`:**

Si el usuario tiene 2FA habilitado, el login devuelve un desafío:

```json
{
  "totp_required": true,
  "challenge_token": "a1b2c3d4e5f6..."
}
```

Completa el desafío con `POST /auth/2fa/verify`.

**Errores:**

| Estado | Código | Descripción |
|--------|--------|-------------|
| 401 | `INVALID_CREDENTIALS` | Email o contraseña incorrectos |
| 401 | `EMAIL_NOT_VERIFIED` | Email aún no verificado |

---

## Logout

Invalida el token actual.

```
POST /auth/logout
```

**Autenticación:** Requerida

**Respuesta `200`:**

```json
{
  "message": "Logged out successfully"
}
```

---

## Usuario Actual

Obtiene el perfil del usuario autenticado.

```
GET /auth/me
```

**Autenticación:** Requerida

**Respuesta `200`:**

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

## Actualizar Perfil

Actualiza el perfil del usuario actual.

```
PATCH /auth/profile
```

**Autenticación:** Requerida

**Cuerpo de la solicitud** (todos los campos opcionales):

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

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `surname` | string \| null | Apellido |
| `givenNames` | string \| null | Nombre(s) de pila |
| `displayName` | string \| null | Nombre preferido para mostrar |
| `nativeScript` | string \| null | Nombre en escritura nativa |
| `preferredOrder` | `"western"` \| `"eastern"` \| null | Orden de visualización del nombre |
| `username` | string \| null | Nombre de usuario único (3-30 caracteres, alfanumérico + guion bajo) |

**Errores:**

| Estado | Código | Descripción |
|--------|--------|-------------|
| 400 | `USERNAME_INVALID` | Formato de nombre de usuario inválido |
| 400 | `USERNAME_RESERVED` | Nombre de usuario reservado |
| 409 | `USERNAME_TAKEN` | Nombre de usuario ya en uso |

---

## Actualización de Token

Actualiza un token Bearer de la API.

```
POST /auth/token/refresh
```

**Cuerpo de la solicitud:**

```json
{
  "refresh_token": "a1b2c3d4e5f6..."
}
```

**Respuesta `200`:**

```json
{
  "type": "bearer",
  "token": "hitkey_...",
  "refresh_token": "new_hex_token...",
  "expires_in": 3600
}
```

::: info Rotación de tokens
La actualización de tokens de la API rota el refresh token — cada uso devuelve un nuevo refresh token e invalida el anterior. Almacena siempre el nuevo refresh token de la respuesta.
:::

---

## Restablecimiento de Contraseña

### Solicitar Restablecimiento

```
POST /auth/password/forgot
```

**Cuerpo de la solicitud:**

```json
{
  "email": "user@example.com"
}
```

**Respuesta `200`:**

```json
{
  "message": "If this email exists, a reset link has been sent"
}
```

### Completar Restablecimiento

```
POST /auth/password/reset
```

**Cuerpo de la solicitud:**

```json
{
  "token": "RESET_TOKEN",
  "password": "new_password"
}
```

::: info
Los tokens de restablecimiento expiran después de **15 minutos**.
:::

**Errores:**

| Estado | Código | Descripción |
|--------|--------|-------------|
| 400 | `INVALID_TOKEN` | Token inválido |
| 400 | `TOKEN_EXPIRED` | Token expirado |

---

## 2FA (TOTP)

### Configuración

Obtiene el secreto TOTP y la URI del código QR para configurar la aplicación autenticadora.

```
GET /auth/2fa/setup
```

**Autenticación:** Requerida

**Respuesta `200`:**

```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCodeUrl": "otpauth://totp/HitKey:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=HitKey"
}
```

### Habilitar

Habilita 2FA después de verificar un código TOTP.

```
POST /auth/2fa/enable
```

**Autenticación:** Requerida

**Cuerpo de la solicitud:**

```json
{
  "code": "123456"
}
```

### Deshabilitar

Deshabilita 2FA con un código TOTP válido.

```
POST /auth/2fa/disable
```

**Autenticación:** Requerida

**Cuerpo de la solicitud:**

```json
{
  "code": "123456"
}
```

### Verificar (Desafío de Login)

Completa el desafío 2FA durante el inicio de sesión.

```
POST /auth/2fa/verify
```

**Cuerpo de la solicitud:**

```json
{
  "challenge_token": "a1b2c3d4e5f6...",
  "code": "123456"
}
```

**Respuesta `200`:** Mismo formato que la respuesta de login (token + refresh_token + expires_in + user).

**Errores:**

| Estado | Código | Descripción |
|--------|--------|-------------|
| 400 | `INVALID_CODE` | Código TOTP incorrecto |
| 400 | `SETUP_NOT_INITIATED` | 2FA no configurado |
| 400 | `NOT_ENABLED` | No habilitado (deshabilitar) |
| 400 | `INVALID_TOKEN` | Token de desafío inválido |
