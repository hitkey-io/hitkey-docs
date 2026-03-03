# Scopes ва Claims

Scopes идора мекунанд, ки барномаи шумо ба кадом маълумот дастрасӣ дорад. Танҳо чизи заруриро дархост кунед.

## Scope-ҳои дастрас

| Scope | Тавсиф | Claims-и баргардонидашаванда |
|-------|--------|------------------------------|
| `openid` | Ҳатмӣ. Корбарро муайян мекунад. | `sub`, `id` |
| `profile` | Ном ва танзимоти намоиши корбар. | `name`, `given_name`, `family_name`, `display_name`, `preferred_username`, `native_script`, `preferred_order` |
| `email` | Суроғаи email-и корбар. | `email` |
| `project:read` | Дастрасии хониш ба узвият дар лоиҳа. | `project` (объекти дорои нақш ва иҷозатҳо) |

## Дархости Scopes

Scope-ҳоро ҳамчун сатри бо фосила ҷудошуда дар URL-и авторизатсия диҳед:

```
https://hitkey.io/?client_id=...&scope=openid+profile+email&...
```

Ё бо URL-encoding:

```
scope=openid%20profile%20email
```

::: warning Scope-и пешфарз
Агар scope муайян нашуда бошад, ҳамаи claims баргардонида мешаванд (баробар бо дархости ҳамаи scope-ҳо). Барои маҳдуд кардани ҷавоб, ҳамеша scope-ҳоро аниқ муайян кунед.
:::

## Маълумотномаи Claims

### Scope-и `openid`

| Claim | Намуд | Тавсиф |
|-------|-------|--------|
| `sub` | string (UUID) | Идентификатори ягона ва тағйирнопазири корбар |
| `id` | string (UUID) | Ҳамон қимат бо `sub` (ҳамеша дохил аст) |

### Scope-и `profile`

| Claim | Намуд | Тавсиф |
|-------|-------|--------|
| `name` | string | Номи пурраи форматшуда |
| `given_name` | string \| null | Ном(ҳо)-и шахсӣ |
| `family_name` | string \| null | Насаб |
| `display_name` | string \| null | Номи интихобии корбар барои намоиш |
| `preferred_username` | string \| null | Номи корбарии ягона (стандарти OIDC) |
| `native_script` | string \| null | Ном дар хатти модарӣ |
| `preferred_order` | `"western"` \| `"eastern"` \| null | Тартиби интихобии намоиши ном |

### Scope-и `email`

| Claim | Намуд | Тавсиф |
|-------|-------|--------|
| `email` | string | Суроғаи email-и пешфарзи корбар |

::: info
Майдони `email_verified` аз `/oauth/userinfo` **баргардонида намешавад**. Танҳо суроғаи email дохил карда мешавад.
:::

### Scope-и `project:read`

Бо OAuth clients-и дар доираи лоиҳа истифода мешавад. Узвияти корбарро дар лоиҳаи client бармегардонад.

| Claim | Намуд | Тавсиф |
|-------|-------|--------|
| `project.project_id` | string (UUID) | ID-и лоиҳа |
| `project.project_name` | string | Номи лоиҳа |
| `project.project_slug` | string | Slug-и лоиҳа |
| `project.role` | string | Нақши корбар дар лоиҳа |
| `project.permissions` | string[] | Массиви калидҳои иҷозат |

::: info
Scope-и `project:read` танҳо вақте маълумот бармегардонад, ки OAuth client ба лоиҳа тааллуқ дошта бошад. Барои client-ҳое, ки лоиҳа надоранд, ин scope нодида гирифта мешавад.
:::

## Филтри Scope-ҳо

HitKey scope-ҳои дархостшударо танҳо ба онҳое, ки дастгирӣ мекунад, филтр мекунад. Агар шумо scope-и нашинохтаро дархост кунед, он бесадо нодида гирифта мешавад — хатогӣ баргардонида намешавад.

```
Дархостшуда:  openid profile email custom_scope
Додашуда:     openid profile email
```

## Мисол: Ҳадди ақал ва Пурра

**Ҳадди ақал** — танҳо муайянкунии корбар:
```
scope=openid
```

Бармегардонад:
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Пурра** — муайянкунӣ + профил + email:
```
scope=openid+profile+email
```

Бармегардонад:
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
