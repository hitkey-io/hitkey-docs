# HitKey Identity

Understanding how HitKey identifies users is **critical** for a correct integration.

## The Core Principle

> **HitKey = a person, not an email.**

A person can have many email addresses. Emails change — people switch providers, companies rename domains, users add personal and work emails. But the **person** stays the same.

## `sub` — The Stable Identifier

When you call `/oauth/userinfo`, the response includes a `sub` claim:

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com"
}
```

The `sub` field is:
- A **UUID** — universally unique, never reused
- **Immutable** — it never changes for a given user
- The **only** identifier you should store as a foreign key

## Never Use Email as a Primary Key

Emails in HitKey are:
- **Mutable** — users can change their default email at any time
- **Multiple** — one user can have 5, 10, or more verified emails
- **Cached** — the `email` field in userinfo reflects the current default, which may change

If you use `email` as your user identifier, you'll create duplicate accounts when a user changes their email.

## Correct Integration Pattern

### Your database schema

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hitkey_user_id UUID NOT NULL UNIQUE, -- sub from /oauth/userinfo
  email TEXT,                           -- cached, updated on each login
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### On each OAuth login

```javascript
const userinfo = await fetch('https://api.hitkey.io/oauth/userinfo', {
  headers: { Authorization: `Bearer ${accessToken}` }
}).then(r => r.json())

// Find or create by sub — NEVER by email
let user = await db.users.findBy('hitkey_user_id', userinfo.sub)

if (!user) {
  user = await db.users.create({
    hitkey_user_id: userinfo.sub,
    email: userinfo.email,
    display_name: userinfo.display_name
  })
} else {
  // Update cached fields on every login
  await user.update({
    email: userinfo.email,
    display_name: userinfo.display_name
  })
}
```

::: danger Common mistake
```javascript
// WRONG — will create duplicates when email changes
let user = await db.users.findBy('email', userinfo.email)
```
:::

## Multi-Email Support

HitKey users can have multiple verified email addresses:

- **Default email** — returned in `userinfo.email`
- **Additional emails** — managed through the HitKey dashboard
- **Verification** — each email is independently verified

When a user changes their default email, the next `/oauth/userinfo` call will return the new one. Your app should update its cached copy.

## Name Structure

HitKey supports international name formats:

| Field | Description | Example |
|-------|-------------|---------|
| `name` | Full formatted name | "John Doe" |
| `given_name` | Personal/first name(s) | "John" |
| `family_name` | Surname/last name | "Doe" |
| `display_name` | User's preferred display name | "John" |

Names can be structured for both Western ("John Doe") and Eastern ("Doe John") conventions via the user's `preferred_order` setting.

## Summary

| Do | Don't |
|----|-------|
| Use `sub` as your foreign key | Use `email` as a unique key |
| Add `UNIQUE` constraint on `hitkey_user_id` | Assume email is stable |
| Update cached email on each login | Skip the userinfo call |
| Handle missing optional fields | Require all name fields |
