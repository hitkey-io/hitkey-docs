# Introducción

## ¿Qué es HitKey?

HitKey es una **plataforma de identidad OAuth2**. Permite a tus usuarios iniciar sesión con una única cuenta de HitKey en todas las aplicaciones asociadas — similar a "Iniciar sesión con Google", pero diseñado para el ecosistema HitKey.

Como desarrollador, integras HitKey en tu aplicación mediante el flujo estándar OAuth2 Authorization Code. HitKey se encarga de:

- **Registro de usuarios** (verificación de email en 3 pasos)
- **Autenticación** (inicio de sesión, 2FA)
- **Gestión de perfiles de usuario** (nombres, emails, configuraciones)
- **Autorización** (scopes, permisos a nivel de proyecto)

Tu aplicación solo necesita:
1. Redirigir a los usuarios a HitKey para iniciar sesión
2. Intercambiar el código de autorización por tokens
3. Llamar a `/oauth/userinfo` para obtener el perfil del usuario

## Conceptos Clave

### Identidad, no email

HitKey identifica **personas**, no direcciones de email. El identificador estable es `sub` (un UUID) — nunca uses `email` como clave única. [Más información](/es/guide/identity).

### Flujo de Código de Autorización OAuth2

HitKey utiliza el flujo OAuth2 más seguro para aplicaciones del lado del servidor. Tu backend intercambia un código de autorización por tokens de acceso y de actualización. [Ver el flujo completo](/es/guide/oauth-flow).

### Scopes

Solicita solo los datos que necesitas: `openid` (obligatorio), `profile` (nombres), `email` (dirección de email), `project:read` (membresía de proyecto). [Referencia de scopes](/es/guide/scopes).

### Proyectos

Organiza tus clientes OAuth dentro de proyectos. Añade miembros de equipo con roles (owner, admin, member) y permisos personalizados. [Documentación de proyectos](/es/guide/projects).

## Arquitectura

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Tu App     │────▶│  HitKey Frontend │────▶│  HitKey API  │
│  (Cliente)  │◀────│  (Login UI)      │◀────│  (OAuth2)    │
└─────────────┘     └─────────────────┘     └──────────────┘
```

- **HitKey API** (`api.hitkey.io`) — Servidor OAuth2, gestión de usuarios, gestión de proyectos
- **HitKey Frontend** (`hitkey.io`) — UI de inicio de sesión/registro, panel de usuario
- **Tu App** — redirige a los usuarios a HitKey, intercambia códigos por tokens

## Primeros Pasos

¿Listo para integrar? Comienza con la [guía de Inicio Rápido](/es/guide/quick-start) — tendrás un flujo OAuth2 funcionando en 5 minutos.
