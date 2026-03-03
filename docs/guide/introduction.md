# Introduction

## What is HitKey?

HitKey is an **OAuth2 identity platform**. It lets your users sign in with a single HitKey account across all partner applications — similar to "Sign in with Google", but designed for the HitKey ecosystem.

As a developer, you integrate HitKey into your app via standard OAuth2 Authorization Code flow. HitKey handles:

- **User registration** (3-step email verification)
- **Authentication** (login, 2FA)
- **User profile management** (names, emails, settings)
- **Authorization** (scopes, project-level permissions)

Your app only needs to:
1. Redirect users to HitKey for login
2. Exchange the authorization code for tokens
3. Call `/oauth/userinfo` to get the user's profile

## Key Concepts

### Identity, not email

HitKey identifies **people**, not email addresses. The stable identifier is `sub` (a UUID) — never use `email` as a unique key. [Learn more](/guide/identity).

### OAuth2 Authorization Code Flow

HitKey uses the most secure OAuth2 flow for server-side apps. Your backend exchanges an authorization code for access and refresh tokens. [See the full flow](/guide/oauth-flow).

### Scopes

Request only the data you need: `openid` (required), `profile` (names), `email` (email address), `project:read` (project membership). [Scope reference](/guide/scopes).

### Projects

Organize your OAuth clients under projects. Add team members with roles (owner, admin, member) and custom permissions. [Project docs](/guide/projects).

## Architecture

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Your App   │────▶│  HitKey Frontend │────▶│  HitKey API  │
│  (Client)   │◀────│  (Login UI)      │◀────│  (OAuth2)    │
└─────────────┘     └─────────────────┘     └──────────────┘
```

- **HitKey API** (`api.hitkey.io`) — OAuth2 server, user management, project management
- **HitKey Frontend** (`hitkey.io`) — Login/registration UI, user dashboard
- **Your App** — redirects users to HitKey, exchanges codes for tokens

## Getting Started

Ready to integrate? Start with the [Quick Start guide](/guide/quick-start) — you'll have a working OAuth2 flow in 5 minutes.
