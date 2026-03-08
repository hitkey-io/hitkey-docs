# Лоиҳаҳо

Лоиҳаҳо ба шумо имконият медиҳанд OAuth clients-ро ташкил диҳед, аъзоёни дастаро идора кунед ва дастрасиро назорат кунед — ҳама дар доираи як барнома ё хидмат.

## Шарҳи умумӣ

Лоиҳа контейнер аст барои:
- **OAuth clients** — ҳар лоиҳа метавонад OAuth clients-и худро дошта бошад
- **Аъзоёни даста** — бо нақшҳо (owner, admin, member)
- **Иҷозатҳои фардӣ** — назорати нозуки дастрасӣ
- **Даъватномаҳо** — ҳамкоронро тавассути email даъват кунед

## Намудҳои лоиҳа

| Намуд | Тавсиф | Пайвастан |
|-------|--------|-----------|
| **Public** | Ба ҳамаи корбарон намоён | Ҳар кас метавонад пайвандад |
| **Private** | Танҳо ба аъзоён намоён | Танҳо бо даъватнома |

## Нақшҳо

| Нақш | Идораи аъзоён | Идораи танзимот | Идораи clients | Нест кардани лоиҳа |
|------|---------------|-----------------|----------------|---------------------|
| **Owner** | Ҳа | Ҳа | Ҳа | Ҳа |
| **Admin** | Маҳдуд | Ҳа | Ҳа | Не |
| **Member** | Не | Не | Не | Не |

Ҳар лоиҳа дақиқан як **owner** дорад. Моликиятро ба аъзои дигар интиқол додан мумкин аст.

### Қоидаҳои таҳрири аъзоён

| Иҷрокунанда \ Мақсад | Owner | Admin | Member | Худ |
|---|---|---|---|---|
| **Owner** | — | нақш + иҷозатҳо | нақш + иҷозатҳо | танҳо иҷозатҳо |
| **Admin** | ✗ | ✗ | танҳо иҷозатҳо | танҳо иҷозатҳо |
| **Member** | ✗ | ✗ | ✗ | ✗ |

::: warning
- Ҳеҷ кас наметавонад нақши соҳибро иваз кунад
- Корбарон наметавонанд нақши худро иваз кунанд
- Админҳо танҳо иҷозатҳои аъзоёни оддӣ ва худро таҳрир карда метавонанд
:::

## Сохтани лоиҳа

```bash
curl -X POST https://api.hitkey.io/projects/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My App",
    "description": "My awesome application",
    "is_public": true
  }'
```

`slug` аз ном худкор сохта мешавад ва дастӣ муайян карда намешавад.

## OAuth Clients дар доираи лоиҳа

Ҳар лоиҳа метавонад OAuth clients-и худро дошта бошад. Вақте ки корбар тавассути client-и дар доираи лоиҳа авторизатсия мекунад, scope-и `project:read` дастрасиро ба маълумоти узвияти ӯ дар он лоиҳа медиҳад.

```bash
# Create an OAuth client for a project
curl -X POST https://api.hitkey.io/projects/my-app/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My App OAuth",
    "redirect_uri": "https://myapp.com/callback"
  }'
```

## Идоракунии даста

### Илова кардани аъзо

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

Аъзоён тавассути суроғаи email илова мешаванд. Шумо инчунин метавонед ҳамзамон иҷозатҳо таъин кунед.

### Навсозии нақши аъзо

```bash
curl -X PATCH https://api.hitkey.io/projects/my-app/members/MEMBER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }'
```

### Интиқоли моликият

```bash
curl -X POST https://api.hitkey.io/projects/my-app/transfer-ownership \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "new_owner_id": "new-owner-uuid"
  }'
```

## Иҷозатҳои фардӣ

Лоиҳаҳо иҷозатҳои фардиро дастгирӣ мекунанд, ки ба аъзоён таъин карда мешаванд:

```bash
# Create a permission
curl -X POST https://api.hitkey.io/projects/my-app/permissions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "can_deploy",
    "display_name": "Can Deploy",
    "description": "Allow deployment",
    "is_default": false
  }'
```

| Майдон | Намуд | Ҳатмӣ | Тавсиф |
|--------|-------|-------|--------|
| `key` | string | Ҳа | Идентификатори ягонаи иҷозат |
| `display_name` | string | Ҳа | Номи хоношаванда барои одам |
| `description` | string | Не | Тавсифи иҷозат |
| `is_default` | boolean | Не | Ба аъзоёни нав пешфарз таъин мешавад |

## Даъватномаҳо

Корбаронро тавассути email ба лоиҳаи худ даъват кунед:

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
Мӯҳлати даъватномаҳо пас аз **7 рӯз** ба охир мерасад. `redirect_url`-и ихтиёрӣ дар ҷавоби қабул дохил карда мешавад, то client корбарро пас аз қабул равона кунад.
:::

Корбари даъватшуда email бо истинод мегирад. Ӯ метавонад қабул кунад тавассути:
1. Зер кардани истинод (тасдиқи ҳувият лозим аст)
2. Даъвати `POST /invites/:token/accept`

Барои тафсилот [API-и даъватномаҳо](/tj/api/invites)-ро бубинед.
