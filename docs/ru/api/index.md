# API

## Базовый URL

| Окружение | URL |
|-----------|-----|
| Продакшен | `https://api.hitkey.io` |

## Аутентификация

Большинство эндпоинтов требуют аутентификации через Bearer токен:

```
Authorization: Bearer YOUR_TOKEN
```

Два типа токенов:
- **API Bearer токены** — из `POST /auth/login` (прямой доступ к API)
- **OAuth access-токены** — из `POST /oauth/token` (партнёрские интеграции)

Подробнее: [Типы токенов](/ru/guide/tokens).

## Формат ответов

Все ответы в JSON. Успешные ответы возвращают данные напрямую. Ошибки возвращаются в формате:

```json
{
  "error": "Описание ошибки",
  "code": "ERROR_CODE"
}
```

Ошибки валидации AdonisJS (HTTP 422) используют формат массива:

```json
{
  "errors": [
    {
      "message": "Ошибка валидации",
      "rule": "required",
      "field": "email"
    }
  ]
}
```

## Интерактивная документация

Swagger UI доступен по адресу:

| Окружение | URL |
|-----------|-----|
| Продакшен | `https://api.hitkey.io/docs` |

OpenAPI спецификация: `/swagger.json`.

## Обзор эндпоинтов

### OAuth (`/oauth`)

| Метод | Эндпоинт | Auth | Описание |
|-------|----------|------|----------|
| `GET` | `/oauth/authorize` | Да | Получение authorization code |
| `POST` | `/oauth/token` | Нет | Обмен кода / обновление токена |
| `GET` | `/oauth/userinfo` | OAuth | Профиль пользователя (OIDC) |
| `POST` | `/oauth/clients` | Да | Создание OAuth-клиента |
| `GET` | `/oauth/clients` | Да | Список OAuth-клиентов |

### Auth (`/auth`)

| Метод | Эндпоинт | Auth | Описание |
|-------|----------|------|----------|
| `POST` | `/auth/register/start` | Нет | Начало регистрации |
| `POST` | `/auth/register/verify` | Нет | Верификация кода |
| `POST` | `/auth/register/password` | Нет | Установка пароля |
| `POST` | `/auth/register/resend` | Нет | Повторная отправка кода |
| `POST` | `/auth/register/with-invite` | Нет | Регистрация по приглашению |
| `POST` | `/auth/login` | Нет | Вход |
| `POST` | `/auth/logout` | Да | Выход |
| `GET` | `/auth/me` | Да | Текущий пользователь |
| `PATCH` | `/auth/profile` | Да | Обновление профиля |
| `POST` | `/auth/token/refresh` | Нет | Обновление API токена |
| `POST` | `/auth/password/forgot` | Нет | Запрос сброса пароля |
| `POST` | `/auth/password/reset` | Нет | Завершение сброса пароля |

### Пользователи (`/users`)

| Метод | Эндпоинт | Auth | Описание |
|-------|----------|------|----------|
| `GET` | `/users/search` | Да | Поиск пользователей по email/имени/username |

Параметры поиска: `q` (строка поиска), `project_slug` (опционально). Возвращает максимум 10 результатов.

### Проекты (`/projects`)

| Метод | Эндпоинт | Auth | Описание |
|-------|----------|------|----------|
| `POST` | `/projects/` | Да | Создать проект |
| `GET` | `/projects/` | Да | Список проектов |
| `GET` | `/projects/:slug` | Да | Получить проект |
| `PATCH` | `/projects/:slug` | Да | Обновить проект |
| `DELETE` | `/projects/:slug` | Да | Удалить проект |

### Приглашения (`/invites`)

| Метод | Эндпоинт | Auth | Описание |
|-------|----------|------|----------|
| `GET` | `/invites/:token` | Нет | Просмотр приглашения |
| `POST` | `/invites/:token/accept` | Да | Принять приглашение |

Полный список — в Swagger UI: `https://api.hitkey.io/docs`
