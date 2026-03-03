# Projects

Projects let you organize OAuth clients, manage team members, and control access — all scoped to a single application or service.

## Overview

A project is a container for:
- **OAuth clients** — each project can have its own OAuth clients
- **Team members** — with roles (owner, admin, member)
- **Custom permissions** — fine-grained access control
- **Invites** — invite collaborators by email

## Project Types

| Type | Description | Join |
|------|-------------|------|
| **Public** | Visible to all users | Anyone can join |
| **Private** | Visible only to members | Invite-only |

## Roles

| Role | Manage members | Manage settings | Manage clients | Delete project |
|------|---------------|-----------------|----------------|----------------|
| **Owner** | Yes | Yes | Yes | Yes |
| **Admin** | Yes | Yes | Yes | No |
| **Member** | No | No | No | No |

Each project has exactly one **owner**. Ownership can be transferred to another member.

## Create a Project

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

The `slug` is auto-generated from the name and cannot be specified manually.

## Project-Scoped OAuth Clients

Each project can have its own OAuth clients. When a user authorizes via a project-scoped client, the `project:read` scope provides access to their membership in that project.

```bash
# Create an OAuth client for a project
curl -X POST https://api.hitkey.io/projects/my-app/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My App OAuth",
    "redirect_uri": "https://myapp.com/callback"
  }'
```

## Team Management

### Add a member

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

Members are added by email address. You can optionally assign permissions at the same time.

### Update member role

```bash
curl -X PATCH https://api.hitkey.io/projects/my-app/members/MEMBER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }'
```

### Transfer ownership

```bash
curl -X POST https://api.hitkey.io/projects/my-app/transfer-ownership \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "new_owner_id": "new-owner-uuid"
  }'
```

## Custom Permissions

Projects support custom permissions that can be assigned to members:

```bash
# Create a permission
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

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | string | Yes | Unique permission identifier |
| `display_name` | string | Yes | Human-readable name |
| `description` | string | No | Permission description |
| `is_default` | boolean | No | Assign to new members by default |

## Invites

Invite users to your project by email:

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
Invites expire after **7 days**. The optional `redirect_url` is included in the accept response for the client to redirect the user after accepting.
:::

The invited user receives an email with a link. They can accept by:
1. Clicking the link (requires authentication)
2. Calling `POST /invites/:token/accept`

See [Invites API](/api/invites) for details.
