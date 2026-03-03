# Tipos de Tokens

HitKey utiliza varios tipos de tokens. Entender la diferencia es importante para una integración correcta.

## Tokens OAuth2

Se emiten a través del flujo OAuth2 y se utilizan para acceder a la API de HitKey en nombre de un usuario.

### Access Token

| Propiedad | Valor |
|-----------|-------|
| Duración | 1 hora |
| Uso | Encabezado `Authorization: Bearer <token>` |
| Endpoint | `/oauth/userinfo` |
| Se obtiene mediante | `/oauth/token` (intercambio de código o refresh) |

Los access tokens son de corta duración. Cuando uno expira, usa el refresh token para obtener uno nuevo.

### Refresh Token

| Propiedad | Valor |
|-----------|-------|
| Ventana deslizante | 30 días (se reinicia en cada uso) |
| Límite absoluto | 90 días (duración máxima) |
| Uso | `POST /oauth/token` con `grant_type=refresh_token` |
| Rotación | **No** — el mismo refresh token sigue siendo válido |

::: info
Los refresh tokens OAuth **no se rotan** — el mismo refresh token puede reutilizarse hasta que expire. Solo se actualiza el access token.

Esto es diferente del refresh de token Bearer de la API (`POST /auth/token/refresh`), que **sí** rota el refresh token.
:::

### Código de Autorización

| Propiedad | Valor |
|-----------|-------|
| Duración | 10 minutos |
| Uso | Un solo uso, se intercambia por access + refresh token |
| Flujo | Se recibe mediante redirección tras la autorización del usuario |

## Tokens Bearer de la API

Son los tokens de autenticación internos de HitKey, utilizados para acceso directo a la API (no OAuth2).

| Propiedad | Valor |
|-----------|-------|
| Se emite mediante | `POST /auth/login` |
| Prefijo | `hitkey_` |
| Uso | Encabezado `Authorization: Bearer <token>` |
| Endpoints | Todos los `/auth/*`, `/projects/*`, `/oauth/clients` |
| Refresh | `POST /auth/token/refresh` — **rota** el refresh token |

::: info Cuándo usar cada uno
- **Tokens OAuth2** — cuando tu aplicación accede a HitKey en nombre de un usuario (la integración estándar de partner)
- **Tokens Bearer de la API** — cuando un usuario interactúa con HitKey directamente (el panel de HitKey los usa)

Como desarrollador partner, trabajarás principalmente con tokens OAuth2.
:::

## Mejores Prácticas de Almacenamiento de Tokens

| Token | Dónde almacenar | Notas |
|-------|-----------------|-------|
| Access token | Memoria o almacenamiento seguro | De corta duración, se puede volver a obtener |
| Refresh token | Almacenamiento seguro del servidor | Nunca exponer al frontend |
| Client secret | Variable de entorno | Nunca en código o frontend |

## Seguridad de Tokens

- Los **códigos de autorización** se hashean (SHA-256) antes de almacenarse — la API almacena solo el hash
- Los **access y refresh tokens** también se almacenan como hashes
- Los **tokens en texto plano** se devuelven solo una vez en el momento de la creación
- El intercambio de tokens requiere tanto `client_id` como `client_secret`
