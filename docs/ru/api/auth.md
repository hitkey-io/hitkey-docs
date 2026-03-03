# Auth эндпоинты

Все эндпоинты аутентификации находятся под `/auth`.

## Вход

```
POST /auth/login
```

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Ответ `200`:**

```json
{
  "type": "bearer",
  "token": "hitkey_...",
  "refresh_token": "a1b2c3d4e5f6...",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "John Doe"
  }
}
```

При включённой 2FA (**ответ `202`**):

```json
{
  "totp_required": true,
  "challenge_token": "a1b2c3d4e5f6..."
}
```

**Ошибки:**

| Статус | Код | Описание |
|--------|-----|----------|
| 401 | `INVALID_CREDENTIALS` | Неверный email или пароль |
| 401 | `EMAIL_NOT_VERIFIED` | Email ещё не верифицирован |

---

## Выход

```
POST /auth/logout
```

**Аутентификация:** Обязательна

---

## Текущий пользователь

```
GET /auth/me
```

**Аутентификация:** Обязательна

**Ответ `200`:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "surname": "Doe",
  "givenNames": "John",
  "displayName": "John Doe",
  "nativeScript": null,
  "preferredOrder": "western",
  "username": "johndoe",
  "emailVerified": true,
  "totpEnabled": false,
  "emails": [
    {
      "id": "email-uuid",
      "email": "user@example.com",
      "isDefault": true,
      "isVerified": true
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Обновление профиля

```
PATCH /auth/profile
```

**Аутентификация:** Обязательна

Поля (все опциональны): `surname`, `givenNames`, `displayName`, `nativeScript`, `preferredOrder`, `username`.

**Ошибки:**

| Статус | Код | Описание |
|--------|-----|----------|
| 400 | `USERNAME_INVALID` | Неверный формат username |
| 400 | `USERNAME_RESERVED` | Username зарезервирован |
| 409 | `USERNAME_TAKEN` | Username уже занят |

---

## Обновление токена

```
POST /auth/token/refresh
```

```json
{
  "refresh_token": "a1b2c3d4e5f6..."
}
```

**Ответ `200`:**

```json
{
  "type": "bearer",
  "token": "hitkey_...",
  "refresh_token": "new_hex_token...",
  "expires_in": 3600
}
```

::: info Ротация токенов
API-обновление ротирует refresh-токен — каждое использование возвращает новый refresh-токен и аннулирует старый.
:::

---

## Сброс пароля

### Запрос сброса

```
POST /auth/password/forgot
```

```json
{
  "email": "user@example.com"
}
```

### Завершение сброса

```
POST /auth/password/reset
```

```json
{
  "token": "RESET_TOKEN",
  "password": "new_password"
}
```

::: info
Токены сброса истекают через **15 минут**.
:::

---

## 2FA (TOTP)

### Настройка

```
GET /auth/2fa/setup
```

**Ответ:**

```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCodeUrl": "otpauth://totp/HitKey:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=HitKey"
}
```

### Включение

```
POST /auth/2fa/enable
```

### Отключение

```
POST /auth/2fa/disable
```

### Верификация (при входе)

```
POST /auth/2fa/verify
```

```json
{
  "challenge_token": "a1b2c3d4e5f6...",
  "code": "123456"
}
```

**Ответ `200`:** Тот же формат, что и ответ при входе (token + refresh_token + expires_in + user).

**Ошибки:**

| Статус | Код | Описание |
|--------|-----|----------|
| 400 | `INVALID_CODE` | Неверный TOTP-код |
| 400 | `SETUP_NOT_INITIATED` | 2FA не настроена |
| 400 | `NOT_ENABLED` | 2FA не включена |
| 400 | `INVALID_TOKEN` | Недействительный challenge token |

Подробнее: [Двухфакторная аутентификация](/ru/guide/2fa).
