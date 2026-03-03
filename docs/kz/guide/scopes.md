# Scopes & Claims

Scopes сіздің қосымшаңыз қандай деректерге қол жеткізе алатынын басқарады. Тек қажеттісін сұраңыз.

## Қолжетімді scopes

| Scope | Сипаттама | Қайтарылатын claims |
|-------|-----------|---------------------|
| `openid` | Міндетті. Пайдаланушыны анықтайды. | `sub`, `id` |
| `profile` | Пайдаланушының аты мен көрсету параметрлері. | `name`, `given_name`, `family_name`, `display_name`, `preferred_username`, `native_script`, `preferred_order` |
| `email` | Пайдаланушының электрондық пошта мекенжайы. | `email` |
| `project:read` | Жоба мүшелігіне оқу рұқсаты. | `project` (рөл мен рұқсаттары бар объект) |

## Scopes сұрау

Авторизация URL-інде бос орынмен бөлінген жол ретінде scopes жіберіңіз:

```
https://hitkey.io/?client_id=...&scope=openid+profile+email&...
```

Немесе URL-кодталған:

```
scope=openid%20profile%20email
```

::: warning Әдепкі scope
Егер scope көрсетілмесе, барлық claims қайтарылады (барлық scopes сұрағанмен бірдей). Жауапты шектеу үшін әрқашан scopes-ты нақты көрсетіңіз.
:::

## Claims анықтамасы

### `openid` scope

| Claim | Түрі | Сипаттама |
|-------|------|-----------|
| `sub` | string (UUID) | Бірегей, өзгермейтін пайдаланушы идентификаторы |
| `id` | string (UUID) | `sub`-пен бірдей мән (әрқашан қосылады) |

### `profile` scope

| Claim | Түрі | Сипаттама |
|-------|------|-----------|
| `name` | string | Толық пішімделген ат |
| `given_name` | string \| null | Аты |
| `family_name` | string \| null | Тегі |
| `display_name` | string \| null | Пайдаланушының қалаған көрсетілетін аты |
| `preferred_username` | string \| null | Бірегей пайдаланушы аты (OIDC стандарты) |
| `native_script` | string \| null | Ана жазуындағы ат |
| `preferred_order` | `"western"` \| `"eastern"` \| null | Атты көрсету ретінің қалауы |

### `email` scope

| Claim | Түрі | Сипаттама |
|-------|------|-----------|
| `email` | string | Пайдаланушының әдепкі электрондық пошта мекенжайы |

::: info
`email_verified` өрісі `/oauth/userinfo` арқылы **қайтарылмайды**. Тек электрондық пошта мекенжайы қосылады.
:::

### `project:read` scope

Жоба бойынша OAuth клиенттерімен пайдаланылады. Клиент жобасындағы пайдаланушы мүшелігін қайтарады.

| Claim | Түрі | Сипаттама |
|-------|------|-----------|
| `project.project_id` | string (UUID) | Жоба ID |
| `project.project_name` | string | Жоба атауы |
| `project.project_slug` | string | Жоба slug-ы |
| `project.role` | string | Жобадағы пайдаланушы рөлі |
| `project.permissions` | string[] | Рұқсат кілттерінің массиві |

::: info
`project:read` scope тек OAuth клиент жобаға тиесілі болғанда деректер қайтарады. Жобасы жоқ клиенттер үшін бұл scope елемеледі.
:::

## Scope сүзгілеу

HitKey сұралған scopes-ты тек қолдайтындарына сүзеді. Белгісіз scope сұрасаңыз, ол тыныш елемеледі — қате қайтарылмайды.

```
Сұралған:  openid profile email custom_scope
Берілген:  openid profile email
```

## Мысал: Минималды мен толық

**Минималды** — тек пайдаланушыны анықтау:
```
scope=openid
```

Қайтарады:
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Толық** — анықтау + профиль + email:
```
scope=openid+profile+email
```

Қайтарады:
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
