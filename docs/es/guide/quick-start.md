# Inicio Rápido

Integra HitKey OAuth2 en tu aplicación en 5 minutos.

## Requisitos Previos

- Una cuenta de HitKey ([regístrate](https://hitkey.io))
- Un cliente OAuth (creado a través del [panel](https://hitkey.io) o la [API](/es/api/oauth#create-client))

## 1. Crear un Cliente OAuth

Necesitas un `client_id`, `client_secret` y una `redirect_uri` registrada.

**Vía API:**

```bash
curl -X POST https://api.hitkey.io/oauth/clients \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My App",
    "redirect_uri": "https://myapp.com/callback"
  }'
```

Respuesta:

```json
{
  "id": "uuid",
  "name": "My App",
  "client_id": "38bf5617511df9957e69aad4d4f4c5c3",
  "client_secret": "e466ab329b66210c36617831e5b8cbc1...",
  "redirect_uri": "https://myapp.com/callback"
}
```

::: warning
Almacena el `client_secret` de forma segura — solo se muestra una vez.
:::

## 2. Redirigir a HitKey

Envía a los usuarios a la página de autorización de HitKey:

```
https://hitkey.io/?client_id=YOUR_CLIENT_ID&redirect_uri=https://myapp.com/callback&response_type=code&state=RANDOM_STATE&scope=openid+profile+email
```

| Parámetro | Obligatorio | Descripción |
|-----------|-------------|-------------|
| `client_id` | Sí | Tu ID de cliente OAuth |
| `redirect_uri` | Sí | Debe coincidir con la URI registrada |
| `response_type` | Sí | Siempre `code` |
| `state` | Sí | Cadena aleatoria para protección CSRF |
| `scope` | No | Separados por espacio: `openid`, `profile`, `email`, `project:read` |

El usuario inicia sesión (o se registra) y autoriza tu aplicación. HitKey redirige de vuelta:

```
https://myapp.com/callback?code=AUTH_CODE&state=RANDOM_STATE
```

## 3. Intercambiar Código por Tokens

```bash
curl -X POST https://api.hitkey.io/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "authorization_code",
    "code": "AUTH_CODE",
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "redirect_uri": "https://myapp.com/callback"
  }'
```

Respuesta:

```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "dGhpcyBpcyBh...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "openid profile email"
}
```

## 4. Obtener Información del Usuario

```bash
curl https://api.hitkey.io/oauth/userinfo \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

Respuesta:

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "email_verified": true,
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "display_name": "John Doe"
}
```

::: tip Principio clave
Usa siempre `sub` (UUID) como identificador estable del usuario en tu base de datos — nunca `email`. Consulta [Identidad HitKey](/es/guide/identity) para más detalles.
:::

## 5. Actualizar Tokens

Los tokens de acceso expiran después de 1 hora. Usa el refresh token para obtener un nuevo par:

```bash
curl -X POST https://api.hitkey.io/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "refresh_token",
    "refresh_token": "dGhpcyBpcyBh...",
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET"
  }'
```

## Siguientes Pasos

- [Flujo OAuth2 en detalle](/es/guide/oauth-flow) — diagramas de secuencia completos
- [Scopes y Claims](/es/guide/scopes) — qué datos puedes solicitar
- [Referencia de la API](/es/api/oauth) — todos los endpoints OAuth
- [Ejemplos con curl](/es/examples/curl) — recorrido completo del flujo
