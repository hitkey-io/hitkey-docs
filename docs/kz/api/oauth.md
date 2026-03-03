# OAuth эндпоинттері

Барлық OAuth эндпоинттері `/oauth` астында.

## Authorize

OAuth2 ағыны үшін авторизация кодын алу.

```
GET /oauth/authorize
```

**Аутентификация:** Қажет (Bearer токен)

**Сұраныс параметрлері:**

| Параметр | Түрі | Міндетті | Сипаттама |
|----------|------|----------|-----------|
| `client_id` | string | Иә | OAuth клиент ID |
| `redirect_uri` | string | Иә | Тіркелген URI-мен сәйкес келуі тиіс |
| `response_type` | string | Иә | `code` болуы тиіс |
| `state` | string | Жоқ | CSRF қорғанысына арналған жол |
| `scope` | string | Жоқ | Бос орынмен бөлінген scopes |

**Жауап `200`:**

```json
{
  "redirect_url": "https://myapp.com/callback?code=AUTH_CODE&state=STATE"
}
```

::: info
Бұл эндпоинт redirect URL бар JSON жауап қайтарады — HTTP redirect жасамайды. Пайдаланушыны бағыттау фронтендтің жауапкершілігі.
:::

**Қателер:**

| Статус | Код | Сипаттама |
|--------|-----|-----------|
| 400 | — | `"Invalid client_id"` |
| 400 | — | `"redirect_uri doesn't match"` |
| 401 | — | Аутентификацияланбаған |
| 403 | `NOT_PROJECT_MEMBER` | Клиент жабық жобаға тиесілі және пайдаланушы мүше емес |

::: warning OAuth қателері
OAuth қате жауаптары құрылымдалған қате кодтарының орнына адамға оқылатын қате хабарламаларын қайтарады:
```json
{
  "error": "Invalid client_id"
}
```
:::

---

## Token

Авторизация кодын токендерге айырбастау немесе бар токенді жаңарту.

```
POST /oauth/token
```

**Аутентификация:** Жоқ (ашық эндпоинт)

### Authorization Code айырбастау

**Сұраныс денесі:**

```json
{
  "grant_type": "authorization_code",
  "code": "AUTH_CODE",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "redirect_uri": "https://myapp.com/callback"
}
```

**Жауап `200`:**

```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "dGhpcyBpcyBh...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "openid profile email"
}
```

### Refresh Token

**Сұраныс денесі:**

```json
{
  "grant_type": "refresh_token",
  "refresh_token": "CURRENT_REFRESH_TOKEN",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET"
}
```

**Жауап `200`:** Authorization Code айырбастаумен бірдей формат.

::: info Токен ротациясы жоқ
OAuth жаңарту refresh токенді **ротацияламайды** — сол refresh токен жарамды болып қалады. Тек access токен жаңартылады. Refresh токендердің:
- **30 күндік жылжымалы терезесі** — әр пайдаланғанда қалпына келеді
- **90 күндік абсолютті шегі** — пайдаланылуына қарамастан максималды мерзімі
:::

::: tip API мен OAuth жаңарту айырмашылығы
Бұл API токенді жаңартудан (`POST /auth/token/refresh`) ерекшеленеді, ол refresh токенді **ротациялайды**. Толық ақпарат үшін [Токен түрлері](/kz/guide/tokens) қараңыз.
:::

**Қателер:**

| Статус | Сипаттама |
|--------|-----------|
| 400 | `"Invalid or expired authorization code"` |
| 400 | `"Invalid client_id"` |
| 400 | `"redirect_uri doesn't match"` |

::: warning
OAuth токен қателері құрылымдалған қате кодтарының орнына адамға оқылатын хабарламаларды қайтарады.
:::

---

## User Info

Аутентификацияланған пайдаланушының профилін OAuth access токен арқылы алу. OIDC-үйлесімді.

```
GET /oauth/userinfo
```

**Аутентификация:** Bearer токен (OAuth access токен)

**Жауап `200`:**

Жауап берілген scopes-қа байланысты. `id` өрісі (`sub`-пен бірдей мән) әрқашан `sub`-пен қатар қосылады.

**Scope `openid`** (әрқашан қосылады):

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Scope `profile`** қосады:

```json
{
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "display_name": "John Doe",
  "preferred_username": "johndoe",
  "native_script": null,
  "preferred_order": "western"
}
```

**Scope `email`** қосады:

```json
{
  "email": "user@example.com"
}
```

::: info
`email_verified` өрісі бұл эндпоинтпен қайтарылмайды. `email` scope-пен тек `email` қосылады.
:::

**Scope `project:read`** қосады (клиентте projectId болған кезде):

```json
{
  "project": {
    "project_id": "uuid",
    "project_name": "My App",
    "project_slug": "my-app",
    "role": "member",
    "permissions": ["can_deploy", "can_edit"]
  }
}
```

**Толық мысал** (scopes: `openid profile email`):

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "display_name": "John Doe",
  "preferred_username": "johndoe",
  "native_script": null,
  "preferred_order": "western"
}
```

**Қателер:**

| Статус | Сипаттама |
|--------|-----------|
| 401 | Жарамсыз немесе мерзімі аяқталған access токен |

---

## Клиент жасау

Жаңа OAuth клиент қосымшасын жасау.

```
POST /oauth/clients
```

**Аутентификация:** Қажет (Bearer токен)

**Сұраныс денесі:**

```json
{
  "name": "My Application",
  "redirect_uri": "https://myapp.com/callback"
}
```

**Жауап `201`:**

```json
{
  "client_id": "38bf5617511df9957e69aad4d4f4c5c3",
  "client_secret": "e466ab329b66210c36617831e5b8cbc1...",
  "name": "My Application",
  "redirect_uri": "https://myapp.com/callback"
}
```

::: warning
`client_secret` тек жасалған кезде бір рет қайтарылады. Оны қауіпсіз сақтаңыз.
:::

---

## Клиенттер тізімі

Аутентификацияланған пайдаланушыға тиесілі OAuth клиенттер тізімін алу.

```
GET /oauth/clients
```

**Аутентификация:** Қажет (Bearer токен)

**Жауап `200`:**

```json
[
  {
    "id": "uuid",
    "name": "My Application",
    "clientId": "38bf5617511df9957e69aad4d4f4c5c3",
    "redirectUri": "https://myapp.com/callback",
    "userId": "user-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

::: info
`client_secret` тізім жауаптарына қосылмайды. Тізім жауаптары camelCase өріс атауларын (Lucid ORM сериализациясы) пайдаланатынын ескеріңіз, ал жасау жауабы snake_case пайдаланады.
:::
