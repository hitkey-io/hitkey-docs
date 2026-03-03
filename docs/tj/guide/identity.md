# Ҳувияти HitKey

Фаҳмидани тарзи муайянкунии корбарон аз ҷониби HitKey барои ҳамгиросозии дуруст **муҳим** аст.

## Принсипи асосӣ

> **HitKey = шахс, на email.**

Як шахс метавонад бисёр суроғаҳои email дошта бошад. Email-ҳо тағйир меёбанд — одамон провайдерро иваз мекунанд, ширкатҳо доменро ном мегузоранд, корбарон email-ҳои шахсӣ ва корӣ илова мекунанд. Вале **шахс** ҳамон шахс мемонад.

## `sub` — Идентификатори устувор

Ҳангоми даъвати `/oauth/userinfo`, ҷавоб claim-и `sub`-ро дар бар мегирад:

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com"
}
```

Майдони `sub`:
- **UUID** аст — беназири ҷаҳонӣ, ҳеҷ гоҳ такрор намешавад
- **Тағйирнопазир** аст — барои корбари муайян ҳеҷ гоҳ тағйир намеёбад
- **Ягона** идентификаторест, ки бояд ҳамчун foreign key нигоҳ доред

## Ҳеҷ гоҳ email-ро ҳамчун калиди асосӣ истифода набаред

Email-ҳо дар HitKey:
- **Тағйирпазиранд** — корбарон метавонанд email-и пешфарзи худро дар ҳар вақт тағйир диҳанд
- **Сершуморанд** — як корбар метавонад 5, 10 ё зиёдтар email-ҳои тасдиқшуда дошта бошад
- **Кешшудаанд** — майдони `email` дар userinfo email-и пешфарзи ҷориро инъикос мекунад, ки метавонад тағйир ёбад

Агар шумо `email`-ро ҳамчун идентификатори корбар истифода баред, ҳангоми тағйири email аз ҷониби корбар ҳисобҳои такрорӣ эҷод мешаванд.

## Намунаи дурусти ҳамгиросозӣ

### Схемаи базаи маълумоти шумо

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hitkey_user_id UUID NOT NULL UNIQUE, -- sub from /oauth/userinfo
  email TEXT,                           -- cached, updated on each login
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Дар ҳар даромадани OAuth

```javascript
const userinfo = await fetch('https://api.hitkey.io/oauth/userinfo', {
  headers: { Authorization: `Bearer ${accessToken}` }
}).then(r => r.json())

// Find or create by sub — NEVER by email
let user = await db.users.findBy('hitkey_user_id', userinfo.sub)

if (!user) {
  user = await db.users.create({
    hitkey_user_id: userinfo.sub,
    email: userinfo.email,
    display_name: userinfo.display_name
  })
} else {
  // Update cached fields on every login
  await user.update({
    email: userinfo.email,
    display_name: userinfo.display_name
  })
}
```

::: danger Хатои маъмулӣ
```javascript
// WRONG — will create duplicates when email changes
let user = await db.users.findBy('email', userinfo.email)
```
:::

## Дастгирии бисёр email

Корбарони HitKey метавонанд якчанд суроғаи email-и тасдиқшуда дошта бошанд:

- **Email-и пешфарз** — дар `userinfo.email` бармегардад
- **Email-ҳои иловагӣ** — тавассути панели HitKey идора мешаванд
- **Тасдиқ** — ҳар email мустақилона тасдиқ мешавад

Ҳангоми тағйири email-и пешфарз аз ҷониби корбар, даъвати навбатии `/oauth/userinfo` email-и навро бармегардонад. Барномаи шумо бояд нусхаи кешшудаашро навсозӣ кунад.

## Сохтори ном

HitKey форматҳои байналмилалии номро дастгирӣ мекунад:

| Майдон | Тавсиф | Мисол |
|--------|--------|-------|
| `name` | Номи пурраи форматшуда | "John Doe" |
| `given_name` | Ном(ҳо)-и шахсӣ | "John" |
| `family_name` | Насаб | "Doe" |
| `display_name` | Номи интихобии корбар барои намоиш | "John" |

Номҳо метавонанд ҳам барои анъанаҳои ғарбӣ ("John Doe") ва ҳам шарқӣ ("Doe John") тавассути танзими `preferred_order`-и корбар сохта шаванд.

## Хулоса

| Дуруст | Нодуруст |
|--------|----------|
| `sub`-ро ҳамчун foreign key истифода баред | `email`-ро ҳамчун калиди ягона истифода набаред |
| Ба `hitkey_user_id` маҳдудияти `UNIQUE` илова кунед | Фикр накунед, ки email устувор аст |
| Email-и кешшударо дар ҳар даромадан навсозӣ кунед | Даъвати userinfo-ро нагузаронед |
| Майдонҳои ихтиёрии холиро идора кунед | Ҳамаи майдонҳои номро талаб накунед |
