# Маълумотномаи API

## URL-и асосӣ

| Муҳит | URL |
|-------|-----|
| Production | `https://api.hitkey.io` |

## Тасдиқи ҳувият

Аксари нуқтаҳои ниҳоӣ тасдиқи ҳувият тавассути Bearer token талаб мекунанд:

```
Authorization: Bearer YOUR_TOKEN
```

Ду намуди token истифода мешавад:
- **Token-ҳои Bearer-и API** — аз `POST /auth/login` (барои дастрасии мустақими API)
- **Token-ҳои дастрасии OAuth** — аз `POST /oauth/token` (барои ҳамгиросозиҳои шарикон)

Барои тафсилот [Намудҳои Token](/tj/guide/tokens)-ро бубинед.

## Формати ҷавоб

Ҳамаи ҷавобҳо JSON ҳастанд. Ҷавобҳои муваффақ маълумотро мустақиман бармегардонанд:

```json
{
  "id": "uuid",
  "name": "Example"
}
```

Ҷавобҳои хато аз ин формати асосӣ истифода мебаранд:

```json
{
  "error": "Human-readable message",
  "code": "ERROR_CODE"
}
```

Хатоҳои тасдиқи AdonisJS (HTTP 422) формати массив истифода мебаранд:

```json
{
  "errors": [
    {
      "message": "Validation failed",
      "rule": "required",
      "field": "email"
    }
  ]
}
```

## Ҳуҷҷатҳои интерактивӣ

Swagger UI дар ин суроғаҳо дастрас аст:

| Муҳит | URL |
|-------|-----|
| Production | `https://api.hitkey.io/docs` |

Спесификатсияи OpenAPI дар `/swagger.json` дастрас аст.

## Шарҳи нуқтаҳои ниҳоӣ

### OAuth (`/oauth`)

| Метод | Нуқтаи ниҳоӣ | Тасдиқ | Тавсиф |
|-------|--------------|--------|--------|
| `GET` | `/oauth/authorize` | Ҳа | Гирифтани authorization code |
| `POST` | `/oauth/token` | Не | Мубодилаи code / навсозии token |
| `GET` | `/oauth/userinfo` | OAuth | Гирифтани профили корбар (OIDC) |
| `POST` | `/oauth/clients` | Ҳа | Сохтани OAuth client |
| `GET` | `/oauth/clients` | Ҳа | Рӯйхати OAuth client-ҳои шумо |

### Auth (`/auth`)

| Метод | Нуқтаи ниҳоӣ | Тасдиқ | Тавсиф |
|-------|--------------|--------|--------|
| `POST` | `/auth/register/start` | Не | Оғози бақайдгирӣ |
| `POST` | `/auth/register/verify` | Не | Тасдиқи рамзи email |
| `POST` | `/auth/register/password` | Не | Гузоштани парол (даромади худкор) |
| `POST` | `/auth/register/resend` | Не | Аз нав фиристодани рамзи тасдиқ |
| `POST` | `/auth/register/with-invite` | Не | Бақайдгирӣ тавассути даъватномаи лоиҳа |
| `POST` | `/auth/login` | Не | Даромадан |
| `POST` | `/auth/logout` | Ҳа | Баромадан |
| `GET` | `/auth/me` | Ҳа | Корбари ҷорӣ |
| `PATCH` | `/auth/profile` | Ҳа | Навсозии профил |
| `POST` | `/auth/token/refresh` | Не | Навсозии token-и API |
| `POST` | `/auth/password/forgot` | Не | Дархости барқарорсозии парол |
| `POST` | `/auth/password/reset` | Не | Анҷоми барқарорсозии парол |

### 2FA (`/auth/2fa`)

| Метод | Нуқтаи ниҳоӣ | Тасдиқ | Тавсиф |
|-------|--------------|--------|--------|
| `GET` | `/auth/2fa/setup` | Ҳа | Гирифтани танзими TOTP (QR code) |
| `POST` | `/auth/2fa/enable` | Ҳа | Фаъол кардани 2FA |
| `POST` | `/auth/2fa/disable` | Ҳа | Ғайрифаъол кардани 2FA |
| `POST` | `/auth/2fa/verify` | Не | Тасдиқи TOTP ҳангоми даромадан |

### Email-ҳо (`/auth/emails`)

| Метод | Нуқтаи ниҳоӣ | Тасдиқ | Тавсиф |
|-------|--------------|--------|--------|
| `GET` | `/auth/emails/` | Ҳа | Рӯйхати ҳамаи email-ҳо |
| `POST` | `/auth/emails/` | Ҳа | Илова кардани email |
| `POST` | `/auth/emails/verify` | Ҳа | Тасдиқи email-и иловашуда |
| `POST` | `/auth/emails/resend` | Ҳа | Аз нав фиристодани тасдиқ |
| `PATCH` | `/auth/emails/:id/default` | Ҳа | Гузоштани email-и пешфарз |
| `DELETE` | `/auth/emails/:id` | Ҳа | Нест кардани email |

### Корбарон (`/users`)

| Метод | Нуқтаи ниҳоӣ | Тасдиқ | Тавсиф |
|-------|--------------|--------|--------|
| `GET` | `/users/search` | Ҳа | Ҷустуҷӯи корбарон аз рӯи email/ном/номи корбарӣ |

**Параметрҳои ҷустуҷӯ:**

| Параметр | Намуд | Ҳатмӣ | Тавсиф |
|----------|-------|-------|--------|
| `q` | string | Ҳа | Калимаи ҷустуҷӯ (email, ном ё номи корбарӣ) |
| `project_slug` | string | Не | Филтр аз рӯи контексти лоиҳа |

Ҳадди аксар 10 корбари мувофиқро бармегардонад.

### Лоиҳаҳо (`/projects`)

| Метод | Нуқтаи ниҳоӣ | Тасдиқ | Тавсиф |
|-------|--------------|--------|--------|
| `POST` | `/projects/` | Ҳа | Сохтани лоиҳа |
| `GET` | `/projects/` | Ҳа | Рӯйхати лоиҳаҳо |
| `GET` | `/projects/:slug` | Ҳа | Гирифтани лоиҳа |
| `PATCH` | `/projects/:slug` | Ҳа | Навсозии лоиҳа |
| `DELETE` | `/projects/:slug` | Ҳа | Нест кардани лоиҳа |
| `POST` | `/projects/:slug/join` | Ҳа | Пайвастан ба лоиҳа |
| `DELETE` | `/projects/:slug/leave` | Ҳа | Тарк кардани лоиҳа |

### Аъзоёни лоиҳа (`/projects/:slug/members`)

| Метод | Нуқтаи ниҳоӣ | Тасдиқ | Тавсиф |
|-------|--------------|--------|--------|
| `GET` | `/projects/:slug/members` | Ҳа | Рӯйхати аъзоён |
| `POST` | `/projects/:slug/members` | Ҳа | Илова кардани аъзо |
| `PATCH` | `/projects/:slug/members/:id` | Ҳа | Навсозии аъзо |
| `DELETE` | `/projects/:slug/members/:id` | Ҳа | Хориҷ кардани аъзо |
| `POST` | `/projects/:slug/transfer-ownership` | Ҳа | Интиқоли моликият |

### Даъватномаҳо (`/invites`)

| Метод | Нуқтаи ниҳоӣ | Тасдиқ | Тавсиф |
|-------|--------------|--------|--------|
| `GET` | `/invites/:token` | Не | Дидани даъватнома |
| `POST` | `/invites/:token/accept` | Ҳа | Қабули даъватнома |

### Саломатӣ

| Метод | Нуқтаи ниҳоӣ | Тасдиқ | Тавсиф |
|-------|--------------|--------|--------|
| `GET` | `/health` | Не | Санҷиши саломатӣ |
| `GET` | `/docs` | Не | Swagger UI |
| `GET` | `/swagger.json` | Не | Спесификатсияи OpenAPI |
