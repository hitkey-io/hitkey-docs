# Projects Endpoints

All project endpoints are under `/projects`.

## Create Project

```
POST /projects/
```

**Authentication:** Required

**Request Body:**

```json
{
  "name": "My App",
  "description": "My awesome application",
  "is_public": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Project name |
| `description` | string | No | Project description |
| `is_public` | boolean | No | Public or private (default: false) |

::: info
The `slug` is always auto-generated from the project name and cannot be specified in the request body.
:::

**Response `201`:**

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

## List Projects

```
GET /projects/
```

**Authentication:** Required

Returns all projects the user is a member of.

---

## Get Project

```
GET /projects/:slug
```

**Authentication:** Required

---

## Update Project

```
PATCH /projects/:slug
```

**Authentication:** Required (owner or admin)

**Request Body** (all optional):

```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "is_public": false
}
```

---

## Delete Project

```
DELETE /projects/:slug
```

**Authentication:** Required (owner only)

---

## Join Project

Join a public project.

```
POST /projects/:slug/join
```

**Authentication:** Required

::: info
Only works for public projects. For private projects, use invites.
:::

---

## Leave Project

```
DELETE /projects/:slug/leave
```

**Authentication:** Required

::: warning
The project owner cannot leave. Transfer ownership first.
:::

---

## List Members

```
GET /projects/:slug/members
```

**Authentication:** Required (project member)

**Response `200`:**

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

## Add Member

```
POST /projects/:slug/members
```

**Authentication:** Required (owner or admin)

**Request Body:**

```json
{
  "email": "user@example.com",
  "role": "member",
  "permissions": ["can_deploy"]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Email of the user to add |
| `role` | `"admin"` \| `"member"` | No | Role (default: member) |
| `permissions` | string[] | No | Array of permission keys |

---

## Update Member

```
PATCH /projects/:slug/members/:memberId
```

**Authentication:** Required (owner or admin)

**Request Body:**

```json
{
  "role": "admin",
  "permissions": ["can_deploy", "can_edit"]
}
```

::: info
Permissions use string keys (e.g., `"can_deploy"`, `"editor"`), not UUIDs.
:::

---

## Remove Member

```
DELETE /projects/:slug/members/:memberId
```

**Authentication:** Required (owner or admin)

---

## Transfer Ownership

```
POST /projects/:slug/transfer-ownership
```

**Authentication:** Required (owner only)

**Request Body:**

```json
{
  "new_owner_id": "new-owner-uuid"
}
```

The current owner becomes an admin after transfer.

---

## Permissions

### List Permissions

```
GET /projects/:slug/permissions
```

### Create Permission

```
POST /projects/:slug/permissions
```

**Request Body:**

```json
{
  "key": "can_deploy",
  "display_name": "Can Deploy",
  "description": "Allow deployment to production",
  "is_default": false
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | string | Yes | Unique permission identifier |
| `display_name` | string | Yes | Human-readable name |
| `description` | string | No | Permission description |
| `is_default` | boolean | No | Whether assigned to new members by default (default: false) |

### Update Permission

```
PATCH /projects/:slug/permissions/:permissionId
```

### Delete Permission

```
DELETE /projects/:slug/permissions/:permissionId
```

---

## Project OAuth Clients

### Create Client

```
POST /projects/:slug/clients
```

**Request Body:**

```json
{
  "name": "My App OAuth Client",
  "redirect_uri": "https://myapp.com/callback"
}
```

### List Clients

```
GET /projects/:slug/clients
```

---

## Project Invites

### List Invites

```
GET /projects/:slug/invites
```

### Create Invite

```
POST /projects/:slug/invites
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "role": "member",
  "redirect_url": "https://myapp.com/welcome"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Email of the user to invite |
| `role` | `"admin"` \| `"member"` | No | Role (default: member) |
| `redirect_url` | string | No | URL to redirect after accepting |

::: info
Invites expire after **7 days**.
:::

### Cancel Invite

```
DELETE /projects/:slug/invites/:inviteId
```
