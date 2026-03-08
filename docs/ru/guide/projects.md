# Проекты

Проекты позволяют организовать OAuth-клиентов, управлять участниками и контролировать доступ.

## Обзор

Проект — это контейнер для:
- **OAuth-клиентов** — у каждого проекта свои клиенты
- **Участников** — с ролями (owner, admin, member)
- **Кастомных разрешений** — тонкая настройка доступа
- **Приглашений** — приглашайте коллег по email

## Типы проектов

| Тип | Описание | Присоединение |
|-----|----------|---------------|
| **Публичный** | Виден всем | Любой может вступить |
| **Приватный** | Виден только участникам | Только по приглашению |

## Роли

| Роль | Управление участниками | Управление настройками | Управление клиентами | Удаление проекта |
|------|----------------------|----------------------|---------------------|------------------|
| **Owner** | Да | Да | Да | Да |
| **Admin** | Ограниченно | Да | Да | Нет |
| **Member** | Нет | Нет | Нет | Нет |

У каждого проекта ровно один **owner**. Владение можно передать другому участнику.

### Правила редактирования участников

| Действующий \ Цель | Owner | Admin | Member | Сам себя |
|---|---|---|---|---|
| **Owner** | — | роль + разрешения | роль + разрешения | только разрешения |
| **Admin** | ✗ | ✗ | только разрешения | только разрешения |
| **Member** | ✗ | ✗ | ✗ | ✗ |

::: warning
- Никто не может изменить роль владельца
- Пользователи не могут изменить свою собственную роль
- Админы могут редактировать только разрешения обычных участников и свои собственные
:::

## Создание проекта

```bash
curl -X POST https://api.hitkey.io/projects/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Моё приложение",
    "description": "Описание приложения",
    "is_public": true
  }'
```

`slug` генерируется автоматически из имени и не может быть указан вручную.

## OAuth-клиенты проекта

```bash
curl -X POST https://api.hitkey.io/projects/my-app/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "OAuth клиент",
    "redirect_uri": "https://myapp.com/callback"
  }'
```

## Управление командой

### Добавить участника

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

Участники добавляются по email. Можно сразу назначить разрешения.

### Изменить роль

```bash
curl -X PATCH https://api.hitkey.io/projects/my-app/members/MEMBER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

### Передать владение

```bash
curl -X POST https://api.hitkey.io/projects/my-app/transfer-ownership \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"new_owner_id": "new-owner-uuid"}'
```

## Кастомные разрешения

```bash
curl -X POST https://api.hitkey.io/projects/my-app/permissions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "can_deploy",
    "display_name": "Can Deploy",
    "description": "Разрешить деплой",
    "is_default": false
  }'
```

## Приглашения

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
Приглашения истекают через **7 дней**. Опциональный `redirect_url` включается в ответ при принятии приглашения.
:::

Подробнее: [API приглашений](/ru/api/invites).
