# Эндпоинты приглашений

## Просмотр приглашения

Получение информации о приглашении по токену. Публичный эндпоинт.

```
GET /invites/:token
```

**Ответ `200`:**

```json
{
  "id": "invite-uuid",
  "email": "user@example.com",
  "role": "member",
  "project": {
    "name": "My App",
    "slug": "my-app"
  },
  "invitedBy": {
    "displayName": "Владелец проекта"
  },
  "expiresAt": "2024-01-15T00:00:00.000Z",
  "is_expired": false
}
```

---

## Принятие приглашения

```
POST /invites/:token/accept
```

**Аутентификация:** Обязательна

**Ответ `200`:**

```json
{
  "project_slug": "my-app",
  "redirect_url": "https://myapp.com/welcome"
}
```

**Ошибки:**

| Статус | Код | Описание |
|--------|-----|----------|
| 400 | `INVITE_EXPIRED` | Приглашение истекло |
| 400 | `EMAIL_MISMATCH` | Несовпадение email |
| 400 | `ALREADY_MEMBER` | Уже участник проекта |
| 404 | `INVITE_NOT_FOUND` | Приглашение не найдено |

---

## Регистрация по приглашению

Новые пользователи могут зарегистрироваться через приглашение:

```
POST /auth/register/with-invite
```

```json
{
  "invite_token": "INVITE_TOKEN",
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Ответ `200`:**

```json
{
  "token": "hitkey_...",
  "refresh_token": "a1b2c3d4e5f6...",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "User"
  },
  "project_slug": "my-app",
  "redirect_url": "https://myapp.com/welcome"
}
```

Создаёт аккаунт и принимает приглашение в один шаг.
