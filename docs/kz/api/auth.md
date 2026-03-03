# Auth эндпоинттері

Барлық аутентификация эндпоинттері `/auth` астында.

## Кіру

Email және құпия сөзбен аутентификациялау.

```
POST /auth/login
```

**Сұраныс денесі:**

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Жауап `200`:**

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

**2FA сынақ жауабы `202`:**

Егер пайдаланушыда 2FA қосылған болса, кіру сынақ қайтарады:

```json
{
  "totp_required": true,
  "challenge_token": "a1b2c3d4e5f6..."
}
```

Сынақты `POST /auth/2fa/verify` арқылы аяқтаңыз.

**Қателер:**

| Статус | Код | Сипаттама |
|--------|-----|-----------|
| 401 | `INVALID_CREDENTIALS` | Қате email немесе құпия сөз |
| 401 | `EMAIL_NOT_VERIFIED` | Email әлі верификацияланбаған |

---

## Шығу

Ағымдағы токенді жарамсыз ету.

```
POST /auth/logout
```

**Аутентификация:** Қажет

**Жауап `200`:**

```json
{
  "message": "Logged out successfully"
}
```

---

## Ағымдағы пайдаланушы

Аутентификацияланған пайдаланушының профилін алу.

```
GET /auth/me
```

**Аутентификация:** Қажет

**Жауап `200`:**

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

## Профильді жаңарту

Ағымдағы пайдаланушының профилін жаңарту.

```
PATCH /auth/profile
```

**Аутентификация:** Қажет

**Сұраныс денесі** (барлық өрістер қосымша):

```json
{
  "surname": "Smith",
  "givenNames": "Jane",
  "displayName": "Jane Smith",
  "nativeScript": "ジェーン",
  "preferredOrder": "western",
  "username": "janesmith"
}
```

| Өріс | Түрі | Сипаттама |
|------|------|-----------|
| `surname` | string \| null | Тегі |
| `givenNames` | string \| null | Аты (аттары) |
| `displayName` | string \| null | Қалаған көрсетілетін ат |
| `nativeScript` | string \| null | Ана жазуындағы ат |
| `preferredOrder` | `"western"` \| `"eastern"` \| null | Атты көрсету реті |
| `username` | string \| null | Бірегей пайдаланушы аты (3-30 таңба, әріптік-сандық + астын сызу) |

**Қателер:**

| Статус | Код | Сипаттама |
|--------|-----|-----------|
| 400 | `USERNAME_INVALID` | Пайдаланушы аты форматы жарамсыз |
| 400 | `USERNAME_RESERVED` | Пайдаланушы аты резервтелген |
| 409 | `USERNAME_TAKEN` | Пайдаланушы аты бұрыннан пайдаланылуда |

---

## Токенді жаңарту

API Bearer токенді жаңарту.

```
POST /auth/token/refresh
```

**Сұраныс денесі:**

```json
{
  "refresh_token": "a1b2c3d4e5f6..."
}
```

**Жауап `200`:**

```json
{
  "type": "bearer",
  "token": "hitkey_...",
  "refresh_token": "new_hex_token...",
  "expires_in": 3600
}
```

::: info Токен ротациясы
API токенді жаңарту refresh токенді ротациялайды — әр пайдалану жаңа refresh токен қайтарып, ескісін жарамсыз етеді. Жауаптан алынған жаңа refresh токенді әрқашан сақтаңыз.
:::

---

## Құпия сөзді қалпына келтіру

### Қалпына келтіру сұрау

```
POST /auth/password/forgot
```

**Сұраныс денесі:**

```json
{
  "email": "user@example.com"
}
```

**Жауап `200`:**

```json
{
  "message": "If this email exists, a reset link has been sent"
}
```

### Қалпына келтіруді аяқтау

```
POST /auth/password/reset
```

**Сұраныс денесі:**

```json
{
  "token": "RESET_TOKEN",
  "password": "new_password"
}
```

::: info
Қалпына келтіру токендерінің мерзімі **15 минуттан** кейін аяқталады.
:::

**Қателер:**

| Статус | Код | Сипаттама |
|--------|-----|-----------|
| 400 | `INVALID_TOKEN` | Токен жарамсыз |
| 400 | `TOKEN_EXPIRED` | Токен мерзімі аяқталған |

---

## 2FA (TOTP)

### Орнату

Аутентификатор қосымшасын орнату үшін TOTP құпиясы мен QR код URI-ін алу.

```
GET /auth/2fa/setup
```

**Аутентификация:** Қажет

**Жауап `200`:**

```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCodeUrl": "otpauth://totp/HitKey:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=HitKey"
}
```

### Қосу

TOTP кодын тексергеннен кейін 2FA-ны қосу.

```
POST /auth/2fa/enable
```

**Аутентификация:** Қажет

**Сұраныс денесі:**

```json
{
  "code": "123456"
}
```

### Өшіру

Жарамды TOTP коды арқылы 2FA-ны өшіру.

```
POST /auth/2fa/disable
```

**Аутентификация:** Қажет

**Сұраныс денесі:**

```json
{
  "code": "123456"
}
```

### Тексеру (кіру сынағы)

Кіру кезіндегі 2FA сынағын аяқтау.

```
POST /auth/2fa/verify
```

**Сұраныс денесі:**

```json
{
  "challenge_token": "a1b2c3d4e5f6...",
  "code": "123456"
}
```

**Жауап `200`:** Кіру жауабымен бірдей (token + refresh_token + expires_in + user).

**Қателер:**

| Статус | Код | Сипаттама |
|--------|-----|-----------|
| 400 | `INVALID_CODE` | Қате TOTP коды |
| 400 | `SETUP_NOT_INITIATED` | 2FA конфигурацияланбаған |
| 400 | `NOT_ENABLED` | Қосылмаған (өшіру) |
| 400 | `INVALID_TOKEN` | Сынақ токені жарамсыз |
