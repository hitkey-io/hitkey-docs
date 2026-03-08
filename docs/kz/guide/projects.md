# Жобалар

Жобалар OAuth клиенттерін ұйымдастыруға, топ мүшелерін басқаруға және қолжетімділікті бақылауға мүмкіндік береді — барлығы бір қосымша немесе сервис шеңберінде.

## Шолу

Жоба мыналарды қамтитын контейнер:
- **OAuth клиенттері** — әр жобаның өзінің OAuth клиенттері болуы мүмкін
- **Топ мүшелері** — рөлдермен (owner, admin, member)
- **Реттелетін рұқсаттар** — нақты қолжетімділікті бақылау
- **Шақырулар** — серіктестерді электрондық пошта арқылы шақыру

## Жоба түрлері

| Түрі | Сипаттама | Қосылу |
|------|-----------|--------|
| **Public** | Барлық пайдаланушыларға көрінеді | Кез келген адам қосыла алады |
| **Private** | Тек мүшелерге көрінеді | Тек шақыру арқылы |

## Рөлдер

| Рөл | Мүшелерді басқару | Параметрлерді басқару | Клиенттерді басқару | Жобаны жою |
|-----|-------------------|----------------------|---------------------|------------|
| **Owner** | Иә | Иә | Иә | Иә |
| **Admin** | Шектеулі | Иә | Иә | Жоқ |
| **Member** | Жоқ | Жоқ | Жоқ | Жоқ |

Әр жобада нақты бір **owner** бар. Иелікті басқа мүшеге беруге болады.

### Мүшені өңдеу ережелері

| Әрекетші \ Мақсат | Owner | Admin | Member | Өзі |
|---|---|---|---|---|
| **Owner** | — | рөл + рұқсаттар | рөл + рұқсаттар | тек рұқсаттар |
| **Admin** | ✗ | ✗ | тек рұқсаттар | тек рұқсаттар |
| **Member** | ✗ | ✗ | ✗ | ✗ |

::: warning
- Ешкім иесінің рөлін өзгерте алмайды
- Пайдаланушылар өз рөлін өзгерте алмайды
- Админдер тек қарапайым мүшелердің және өздерінің рұқсаттарын өңдей алады
:::

## Жоба жасау

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

`slug` атаудан автоматты түрде генерацияланады және қолмен көрсету мүмкін емес.

## Жоба бойынша OAuth клиенттері

Әр жобаның өзінің OAuth клиенттері болуы мүмкін. Пайдаланушы жоба бойынша клиент арқылы авторизацияланғанда, `project:read` scope сол жобадағы мүшелік ақпаратына қолжетімділік береді.

```bash
# Жоба үшін OAuth клиент жасау
curl -X POST https://api.hitkey.io/projects/my-app/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My App OAuth",
    "redirect_uri": "https://myapp.com/callback"
  }'
```

## Топты басқару

### Мүше қосу

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

Мүшелер email мекенжайы арқылы қосылады. Қосымша ретінде бір уақытта рұқсаттар тағайындауға болады.

### Мүше рөлін жаңарту

```bash
curl -X PATCH https://api.hitkey.io/projects/my-app/members/MEMBER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }'
```

### Иелікті беру

```bash
curl -X POST https://api.hitkey.io/projects/my-app/transfer-ownership \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "new_owner_id": "new-owner-uuid"
  }'
```

## Реттелетін рұқсаттар

Жобалар мүшелерге тағайындалатын реттелетін рұқсаттарды қолдайды:

```bash
# Рұқсат жасау
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

| Өріс | Түрі | Міндетті | Сипаттама |
|------|------|----------|-----------|
| `key` | string | Иә | Бірегей рұқсат идентификаторы |
| `display_name` | string | Иә | Адамға оқылатын атау |
| `description` | string | Жоқ | Рұқсат сипаттамасы |
| `is_default` | boolean | Жоқ | Жаңа мүшелерге әдепкі бойынша тағайындау |

## Шақырулар

Электрондық пошта арқылы пайдаланушыларды жобаңызға шақырыңыз:

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
Шақырулардың мерзімі **7 күннен** кейін аяқталады. Қосымша `redirect_url` клиентке қабылдағаннан кейін пайдаланушыны бағыттау үшін қабылдау жауабына қосылады.
:::

Шақырылған пайдаланушы сілтемесі бар электрондық хат алады. Қабылдау жолдары:
1. Сілтемені басу (аутентификация қажет)
2. `POST /invites/:token/accept` шақыру

Толық ақпарат үшін [Шақырулар API](/kz/api/invites) қараңыз.
