# Нуқтаҳои ниҳоии Auth

Ҳамаи нуқтаҳои ниҳоии тасдиқи ҳувият дар зери `/auth` ҳастанд.

## Даромадан

Тасдиқ бо email ва парол.

```
POST /auth/login
```

**Бадани дархост:**

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Ҷавоби `200`:**

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

**Ҷавоби challenge-и 2FA `202`:**

Агар корбар 2FA-ро фаъол карда бошад, даромадан ба ҷои token challenge бармегардонад:

```json
{
  "totp_required": true,
  "challenge_token": "a1b2c3d4e5f6..."
}
```

Challenge-ро бо `POST /auth/2fa/verify` анҷом диҳед.

**Хатогиҳо:**

| Ҳолат | Рамз | Тавсиф |
|-------|------|--------|
| 401 | `INVALID_CREDENTIALS` | Email ё парол нодуруст |
| 401 | `EMAIL_NOT_VERIFIED` | Email ҳанӯз тасдиқ нашудааст |

---

## Баромадан

Беэътибор кардани token-и ҷорӣ.

```
POST /auth/logout
```

**Тасдиқи ҳувият:** Ҳатмӣ

**Ҷавоби `200`:**

```json
{
  "message": "Logged out successfully"
}
```

---

## Корбари ҷорӣ

Гирифтани профили корбари тасдиқшуда.

```
GET /auth/me
```

**Тасдиқи ҳувият:** Ҳатмӣ

**Ҷавоби `200`:**

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

## Навсозии профил

Навсозии профили корбари ҷорӣ.

```
PATCH /auth/profile
```

**Тасдиқи ҳувият:** Ҳатмӣ

**Бадани дархост** (ҳамаи майдонҳо ихтиёрӣ):

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

| Майдон | Намуд | Тавсиф |
|--------|-------|--------|
| `surname` | string \| null | Насаб |
| `givenNames` | string \| null | Ном(ҳо)-и шахсӣ |
| `displayName` | string \| null | Номи интихобӣ барои намоиш |
| `nativeScript` | string \| null | Ном дар хатти модарӣ |
| `preferredOrder` | `"western"` \| `"eastern"` \| null | Тартиби намоиши ном |
| `username` | string \| null | Номи корбарии ягона (3-30 аломат, ҳарфу рақам + зерхат) |

**Хатогиҳо:**

| Ҳолат | Рамз | Тавсиф |
|-------|------|--------|
| 400 | `USERNAME_INVALID` | Формати номи корбарӣ нодуруст |
| 400 | `USERNAME_RESERVED` | Номи корбарӣ захира шудааст |
| 409 | `USERNAME_TAKEN` | Номи корбарӣ аллакай истифода мешавад |

---

## Навсозии Token

Навсозии token-и Bearer-и API.

```
POST /auth/token/refresh
```

**Бадани дархост:**

```json
{
  "refresh_token": "a1b2c3d4e5f6..."
}
```

**Ҷавоби `200`:**

```json
{
  "type": "bearer",
  "token": "hitkey_...",
  "refresh_token": "new_hex_token...",
  "expires_in": 3600
}
```

::: info Ротатсияи token
Навсозии token-и API refresh token-ро ротатсия мекунад — ҳар истифода refresh token-и нав бармегардонад ва кӯҳнаро беэътибор мекунад. Ҳамеша refresh token-и навро аз ҷавоб нигоҳ доред.
:::

---

## Барқарорсозии парол

### Дархости барқарорсозӣ

```
POST /auth/password/forgot
```

**Бадани дархост:**

```json
{
  "email": "user@example.com"
}
```

**Ҷавоби `200`:**

```json
{
  "message": "If this email exists, a reset link has been sent"
}
```

### Анҷоми барқарорсозӣ

```
POST /auth/password/reset
```

**Бадани дархост:**

```json
{
  "token": "RESET_TOKEN",
  "password": "new_password"
}
```

::: info
Мӯҳлати token-ҳои барқарорсозӣ пас аз **15 дақиқа** ба охир мерасад.
:::

**Хатогиҳо:**

| Ҳолат | Рамз | Тавсиф |
|-------|------|--------|
| 400 | `INVALID_TOKEN` | Token беэътибор аст |
| 400 | `TOKEN_EXPIRED` | Мӯҳлати token гузаштааст |

---

## 2FA (TOTP)

### Танзим

Гирифтани рамзи махфии TOTP ва URI-и QR code барои танзими барномаи authenticator.

```
GET /auth/2fa/setup
```

**Тасдиқи ҳувият:** Ҳатмӣ

**Ҷавоби `200`:**

```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCodeUrl": "otpauth://totp/HitKey:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=HitKey"
}
```

### Фаъол кардан

Фаъол кардани 2FA пас аз тасдиқи рамзи TOTP.

```
POST /auth/2fa/enable
```

**Тасдиқи ҳувият:** Ҳатмӣ

**Бадани дархост:**

```json
{
  "code": "123456"
}
```

### Ғайрифаъол кардан

Ғайрифаъол кардани 2FA бо рамзи дурусти TOTP.

```
POST /auth/2fa/disable
```

**Тасдиқи ҳувият:** Ҳатмӣ

**Бадани дархост:**

```json
{
  "code": "123456"
}
```

### Тасдиқ (Challenge-и даромадан)

Анҷоми challenge-и 2FA ҳангоми даромадан.

```
POST /auth/2fa/verify
```

**Бадани дархост:**

```json
{
  "challenge_token": "a1b2c3d4e5f6...",
  "code": "123456"
}
```

**Ҷавоби `200`:** Ҳамон формат, ки дар ҷавоби даромадан (token + refresh_token + expires_in + user).

**Хатогиҳо:**

| Ҳолат | Рамз | Тавсиф |
|-------|------|--------|
| 400 | `INVALID_CODE` | Рамзи TOTP нодуруст |
| 400 | `SETUP_NOT_INITIATED` | 2FA танзим нашудааст |
| 400 | `NOT_ENABLED` | Фаъол нест (ғайрифаъол кардан) |
| 400 | `INVALID_TOKEN` | Challenge token беэътибор |
