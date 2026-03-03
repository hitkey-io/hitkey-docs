# Нуқтаҳои ниҳоии лоиҳаҳо

Ҳамаи нуқтаҳои ниҳоии лоиҳаҳо дар зери `/projects` ҳастанд.

## Сохтани лоиҳа

```
POST /projects/
```

**Тасдиқи ҳувият:** Ҳатмӣ

**Бадани дархост:**

```json
{
  "name": "My App",
  "description": "My awesome application",
  "is_public": true
}
```

| Майдон | Намуд | Ҳатмӣ | Тавсиф |
|--------|-------|-------|--------|
| `name` | string | Ҳа | Номи лоиҳа |
| `description` | string | Не | Тавсифи лоиҳа |
| `is_public` | boolean | Не | Оммавӣ ё хусусӣ (пешфарз: false) |

::: info
`slug` ҳамеша аз номи лоиҳа худкор сохта мешавад ва дар бадани дархост муайян карда намешавад.
:::

**Ҷавоби `201`:**

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

## Рӯйхати лоиҳаҳо

```
GET /projects/
```

**Тасдиқи ҳувият:** Ҳатмӣ

Ҳамаи лоиҳаҳоеро бармегардонад, ки корбар аъзои онҳост.

---

## Гирифтани лоиҳа

```
GET /projects/:slug
```

**Тасдиқи ҳувият:** Ҳатмӣ

---

## Навсозии лоиҳа

```
PATCH /projects/:slug
```

**Тасдиқи ҳувият:** Ҳатмӣ (owner ё admin)

**Бадани дархост** (ҳама ихтиёрӣ):

```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "is_public": false
}
```

---

## Нест кардани лоиҳа

```
DELETE /projects/:slug
```

**Тасдиқи ҳувият:** Ҳатмӣ (танҳо owner)

---

## Пайвастан ба лоиҳа

Пайвастан ба лоиҳаи оммавӣ.

```
POST /projects/:slug/join
```

**Тасдиқи ҳувият:** Ҳатмӣ

::: info
Танҳо барои лоиҳаҳои оммавӣ кор мекунад. Барои лоиҳаҳои хусусӣ, аз даъватномаҳо истифода баред.
:::

---

## Тарк кардани лоиҳа

```
DELETE /projects/:slug/leave
```

**Тасдиқи ҳувият:** Ҳатмӣ

::: warning
Соҳиби лоиҳа наметавонад тарк кунад. Аввал моликиятро интиқол диҳед.
:::

---

## Рӯйхати аъзоён

```
GET /projects/:slug/members
```

**Тасдиқи ҳувият:** Ҳатмӣ (аъзои лоиҳа)

**Ҷавоби `200`:**

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

## Илова кардани аъзо

```
POST /projects/:slug/members
```

**Тасдиқи ҳувият:** Ҳатмӣ (owner ё admin)

**Бадани дархост:**

```json
{
  "email": "user@example.com",
  "role": "member",
  "permissions": ["can_deploy"]
}
```

| Майдон | Намуд | Ҳатмӣ | Тавсиф |
|--------|-------|-------|--------|
| `email` | string | Ҳа | Email-и корбар барои илова кардан |
| `role` | `"admin"` \| `"member"` | Не | Нақш (пешфарз: member) |
| `permissions` | string[] | Не | Массиви калидҳои иҷозат |

---

## Навсозии аъзо

```
PATCH /projects/:slug/members/:memberId
```

**Тасдиқи ҳувият:** Ҳатмӣ (owner ё admin)

**Бадани дархост:**

```json
{
  "role": "admin",
  "permissions": ["can_deploy", "can_edit"]
}
```

::: info
Иҷозатҳо калидҳои сатрӣ истифода мебаранд (масалан, `"can_deploy"`, `"editor"`), на UUID-ҳо.
:::

---

## Хориҷ кардани аъзо

```
DELETE /projects/:slug/members/:memberId
```

**Тасдиқи ҳувият:** Ҳатмӣ (owner ё admin)

---

## Интиқоли моликият

```
POST /projects/:slug/transfer-ownership
```

**Тасдиқи ҳувият:** Ҳатмӣ (танҳо owner)

**Бадани дархост:**

```json
{
  "new_owner_id": "new-owner-uuid"
}
```

Соҳиби ҷорӣ пас аз интиқол admin мешавад.

---

## Иҷозатҳо

### Рӯйхати иҷозатҳо

```
GET /projects/:slug/permissions
```

### Сохтани иҷозат

```
POST /projects/:slug/permissions
```

**Бадани дархост:**

```json
{
  "key": "can_deploy",
  "display_name": "Can Deploy",
  "description": "Allow deployment to production",
  "is_default": false
}
```

| Майдон | Намуд | Ҳатмӣ | Тавсиф |
|--------|-------|-------|--------|
| `key` | string | Ҳа | Идентификатори ягонаи иҷозат |
| `display_name` | string | Ҳа | Номи хоношаванда барои одам |
| `description` | string | Не | Тавсифи иҷозат |
| `is_default` | boolean | Не | Оё ба аъзоёни нав пешфарз таъин мешавад (пешфарз: false) |

### Навсозии иҷозат

```
PATCH /projects/:slug/permissions/:permissionId
```

### Нест кардани иҷозат

```
DELETE /projects/:slug/permissions/:permissionId
```

---

## OAuth Clients-и лоиҳа

### Сохтани Client

```
POST /projects/:slug/clients
```

**Бадани дархост:**

```json
{
  "name": "My App OAuth Client",
  "redirect_uri": "https://myapp.com/callback"
}
```

### Рӯйхати Client-ҳо

```
GET /projects/:slug/clients
```

---

## Даъватномаҳои лоиҳа

### Рӯйхати даъватномаҳо

```
GET /projects/:slug/invites
```

### Сохтани даъватнома

```
POST /projects/:slug/invites
```

**Бадани дархост:**

```json
{
  "email": "user@example.com",
  "role": "member",
  "redirect_url": "https://myapp.com/welcome"
}
```

| Майдон | Намуд | Ҳатмӣ | Тавсиф |
|--------|-------|-------|--------|
| `email` | string | Ҳа | Email-и корбар барои даъват |
| `role` | `"admin"` \| `"member"` | Не | Нақш (пешфарз: member) |
| `redirect_url` | string | Не | URL барои равона кардан пас аз қабул |

::: info
Мӯҳлати даъватномаҳо пас аз **7 рӯз** ба охир мерасад.
:::

### Бекор кардани даъватнома

```
DELETE /projects/:slug/invites/:inviteId
```
