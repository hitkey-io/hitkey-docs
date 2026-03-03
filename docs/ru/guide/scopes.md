# Scopes и Claims

Scopes контролируют, к каким данным может получить доступ ваше приложение. Запрашивайте только то, что нужно.

## Доступные scopes

| Scope | Описание | Возвращаемые claims |
|-------|----------|---------------------|
| `openid` | Обязательный. Идентификация пользователя. | `sub`, `id` |
| `profile` | Имя и настройки отображения. | `name`, `given_name`, `family_name`, `display_name`, `preferred_username`, `native_script`, `preferred_order` |
| `email` | Email-адрес пользователя. | `email` |
| `project:read` | Доступ к членству в проекте. | `project` (объект с ролью и разрешениями) |

## Запрос scopes

Передайте scopes через пробел в URL авторизации:

```
https://hitkey.io/?client_id=...&scope=openid+profile+email&...
```

::: warning Scope по умолчанию
Если scope не указан, возвращаются все claims (эквивалентно запросу всех scopes). Для ограничения ответа всегда указывайте scopes явно.
:::

## Справочник claims

### Scope `openid`

| Claim | Тип | Описание |
|-------|-----|----------|
| `sub` | string (UUID) | Уникальный, неизменяемый идентификатор |
| `id` | string (UUID) | То же значение, что и `sub` (всегда включён) |

### Scope `profile`

| Claim | Тип | Описание |
|-------|-----|----------|
| `name` | string | Полное форматированное имя |
| `given_name` | string \| null | Личное имя/имена |
| `family_name` | string \| null | Фамилия |
| `display_name` | string \| null | Предпочтительное отображаемое имя |
| `preferred_username` | string \| null | Уникальный username (OIDC стандарт) |
| `native_script` | string \| null | Имя на родном языке |
| `preferred_order` | `"western"` \| `"eastern"` \| null | Порядок отображения имени |

### Scope `email`

| Claim | Тип | Описание |
|-------|-----|----------|
| `email` | string | Основной email пользователя |

::: info
Поле `email_verified` **не возвращается** эндпоинтом `/oauth/userinfo`. Включается только email-адрес.
:::

### Scope `project:read`

Используется с project-scoped OAuth-клиентами. Возвращает информацию о членстве пользователя в проекте клиента.

| Claim | Тип | Описание |
|-------|-----|----------|
| `project.project_id` | string (UUID) | ID проекта |
| `project.project_name` | string | Название проекта |
| `project.project_slug` | string | Slug проекта |
| `project.role` | string | Роль пользователя в проекте |
| `project.permissions` | string[] | Массив ключей разрешений |

::: info
Scope `project:read` возвращает данные только когда OAuth-клиент привязан к проекту. Для клиентов без проекта этот scope игнорируется.
:::

## Фильтрация scopes

HitKey фильтрует запрошенные scopes. Неизвестные scopes молча игнорируются:

```
Запрошено: openid profile email custom_scope
Предоставлено: openid profile email
```

## Пример: минимальный vs полный

**Минимальный** — только идентификация:
```
scope=openid
```

Возвращает:
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Полный** — идентификация + профиль + email:
```
scope=openid+profile+email
```

Возвращает:
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "display_name": "John Doe",
  "preferred_username": "johndoe",
  "native_script": null,
  "preferred_order": "western",
  "email": "user@example.com"
}
```
