# Эндпоинты проектов

Все эндпоинты проектов находятся под `/projects`.

## CRUD проектов

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `POST` | `/projects/` | Создать проект |
| `GET` | `/projects/` | Список проектов |
| `GET` | `/projects/:slug` | Получить проект |
| `PATCH` | `/projects/:slug` | Обновить проект |
| `DELETE` | `/projects/:slug` | Удалить проект (только owner) |

### Создание

```json
{
  "name": "Моё приложение",
  "description": "Описание",
  "is_public": true
}
```

::: info
`slug` всегда генерируется автоматически из имени проекта и не может быть указан в запросе.
:::

## Членство

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `POST` | `/projects/:slug/join` | Вступить (публичные) |
| `DELETE` | `/projects/:slug/leave` | Покинуть |

## Участники

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `GET` | `/projects/:slug/members` | Список участников |
| `POST` | `/projects/:slug/members` | Добавить участника |
| `PATCH` | `/projects/:slug/members/:id` | Обновить роль |
| `DELETE` | `/projects/:slug/members/:id` | Удалить участника |
| `POST` | `/projects/:slug/transfer-ownership` | Передать владение |

### Добавление участника

```json
{
  "email": "user@example.com",
  "role": "member",
  "permissions": ["can_deploy"]
}
```

Участники добавляются по email. Разрешения используют строковые ключи (например, `"can_deploy"`), а не UUID.

### Передача владения

```json
{
  "new_owner_id": "new-owner-uuid"
}
```

## Разрешения

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `GET` | `/projects/:slug/permissions` | Список разрешений |
| `POST` | `/projects/:slug/permissions` | Создать разрешение |
| `PATCH` | `/projects/:slug/permissions/:id` | Обновить |
| `DELETE` | `/projects/:slug/permissions/:id` | Удалить |

### Создание разрешения

```json
{
  "key": "can_deploy",
  "display_name": "Can Deploy",
  "description": "Разрешить деплой",
  "is_default": false
}
```

## OAuth-клиенты проекта

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `POST` | `/projects/:slug/clients` | Создать клиент |
| `GET` | `/projects/:slug/clients` | Список клиентов |

## Приглашения проекта

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `GET` | `/projects/:slug/invites` | Список приглашений |
| `POST` | `/projects/:slug/invites` | Создать приглашение |
| `DELETE` | `/projects/:slug/invites/:id` | Отменить приглашение |

### Создание приглашения

```json
{
  "email": "user@example.com",
  "role": "member",
  "redirect_url": "https://myapp.com/welcome"
}
```

::: info
Приглашения истекают через **7 дней**.
:::

Подробнее: [Проекты](/ru/guide/projects).
