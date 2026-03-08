# Жобалар эндпоинттері

Барлық жоба эндпоинттері `/projects` астында.

## Жоба жасау

```
POST /projects/
```

**Аутентификация:** Қажет

**Сұраныс денесі:**

```json
{
  "name": "My App",
  "description": "My awesome application",
  "is_public": true
}
```

| Өріс | Түрі | Міндетті | Сипаттама |
|------|------|----------|-----------|
| `name` | string | Иә | Жоба атауы |
| `description` | string | Жоқ | Жоба сипаттамасы |
| `is_public` | boolean | Жоқ | Ашық немесе жабық (әдепкі: false) |

::: info
`slug` әрқашан жоба атауынан автоматты генерацияланады және сұраныс денесінде көрсету мүмкін емес.
:::

**Жауап `201`:**

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

## Жобалар тізімі

```
GET /projects/
```

**Аутентификация:** Қажет

Пайдаланушы мүше болып табылатын барлық жобаларды қайтарады.

---

## Жобаны алу

```
GET /projects/:slug
```

**Аутентификация:** Қажет

---

## Жобаны жаңарту

```
PATCH /projects/:slug
```

**Аутентификация:** Қажет (owner немесе admin)

**Сұраныс денесі** (барлығы қосымша):

```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "is_public": false
}
```

---

## Жобаны жою

```
DELETE /projects/:slug
```

**Аутентификация:** Қажет (тек owner)

---

## Жобаға қосылу

Ашық жобаға қосылу.

```
POST /projects/:slug/join
```

**Аутентификация:** Қажет

::: info
Тек ашық жобалар үшін жұмыс істейді. Жабық жобалар үшін шақыруларды пайдаланыңыз.
:::

---

## Жобадан шығу

```
DELETE /projects/:slug/leave
```

**Аутентификация:** Қажет

::: warning
Жоба иесі шыға алмайды. Алдымен иелікті беріңіз.
:::

---

## Мүшелер тізімі

```
GET /projects/:slug/members
```

**Аутентификация:** Қажет (жоба мүшесі)

**Жауап `200`:**

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

## Мүше қосу

```
POST /projects/:slug/members
```

**Аутентификация:** Қажет (owner немесе admin)

**Сұраныс денесі:**

```json
{
  "email": "user@example.com",
  "role": "member",
  "permissions": ["can_deploy"]
}
```

| Өріс | Түрі | Міндетті | Сипаттама |
|------|------|----------|-----------|
| `email` | string | Иә | Қосылатын пайдаланушының email-і |
| `role` | `"admin"` \| `"member"` | Жоқ | Рөл (әдепкі: member) |
| `permissions` | string[] | Жоқ | Рұқсат кілттерінің массиві |

---

## Мүшені жаңарту

```
PATCH /projects/:slug/members/:memberId
```

**Аутентификация:** Қажет (owner немесе admin)

**Сұраныс денесі:**

```json
{
  "role": "admin",
  "permissions": ["can_deploy", "can_edit"]
}
```

::: info
Рұқсаттар UUID-лар емес, жол кілттерін пайдаланады (мысалы, `"can_deploy"`, `"editor"`).
:::

::: warning Қолжетімділікті бақылау
- **Owner** кез келген мүшенің рөлі мен рұқсаттарын өзгерте алады (өзі үшін — тек рұқсаттар)
- **Admin** тек қарапайым мүшелердің және өзінің рұқсаттарын өңдей алады
- Ешкім өз рөлін немесе иесінің рөлін өзгерте алмайды
:::

**Қате жауаптары:**

| HTTP | Қате | Сипаттама |
|------|------|-----------|
| 403 | `ADMIN_CANNOT_EDIT_ADMIN` | Админ басқа админнің рұқсаттарын өңдей алмайды |
| 403 | Cannot change your own role | Пайдаланушылар өз рөлін өзгерте алмайды |
| 400 | Cannot change owner role | Иесінің рөлін өзгерту мүмкін емес |
| 403 | Only owner can assign admin role | Тек иесі мүшелерді админге көтере алады |

---

## Мүшені алып тастау

```
DELETE /projects/:slug/members/:memberId
```

**Аутентификация:** Қажет (owner немесе admin)

---

## Иелікті беру

```
POST /projects/:slug/transfer-ownership
```

**Аутентификация:** Қажет (тек owner)

**Сұраныс денесі:**

```json
{
  "new_owner_id": "new-owner-uuid"
}
```

Ағымдағы иесі беруден кейін admin болады.

---

## Рұқсаттар

### Рұқсаттар тізімі

```
GET /projects/:slug/permissions
```

### Рұқсат жасау

```
POST /projects/:slug/permissions
```

**Сұраныс денесі:**

```json
{
  "key": "can_deploy",
  "display_name": "Can Deploy",
  "description": "Allow deployment to production",
  "is_default": false
}
```

| Өріс | Түрі | Міндетті | Сипаттама |
|------|------|----------|-----------|
| `key` | string | Иә | Бірегей рұқсат идентификаторы |
| `display_name` | string | Иә | Адамға оқылатын атау |
| `description` | string | Жоқ | Рұқсат сипаттамасы |
| `is_default` | boolean | Жоқ | Жаңа мүшелерге әдепкі бойынша тағайындалсын ба (әдепкі: false) |

### Рұқсатты жаңарту

```
PATCH /projects/:slug/permissions/:permissionId
```

### Рұқсатты жою

```
DELETE /projects/:slug/permissions/:permissionId
```

---

## Жоба OAuth клиенттері

### Клиент жасау

```
POST /projects/:slug/clients
```

**Сұраныс денесі:**

```json
{
  "name": "My App OAuth Client",
  "redirect_uri": "https://myapp.com/callback"
}
```

### Клиенттер тізімі

```
GET /projects/:slug/clients
```

---

## Жоба шақырулары

### Шақырулар тізімі

```
GET /projects/:slug/invites
```

### Шақыру жасау

```
POST /projects/:slug/invites
```

**Сұраныс денесі:**

```json
{
  "email": "user@example.com",
  "role": "member",
  "redirect_url": "https://myapp.com/welcome"
}
```

| Өріс | Түрі | Міндетті | Сипаттама |
|------|------|----------|-----------|
| `email` | string | Иә | Шақырылатын пайдаланушының email-і |
| `role` | `"admin"` \| `"member"` | Жоқ | Рөл (әдепкі: member) |
| `redirect_url` | string | Жоқ | Қабылдағаннан кейін бағыттау URL-і |

::: info
Шақырулардың мерзімі **7 күннен** кейін аяқталады.
:::

### Шақыруды болдырмау

```
DELETE /projects/:slug/invites/:inviteId
```
