# Идентичность HitKey

Понимание идентификации пользователей в HitKey **критически важно** для корректной интеграции.

## Главный принцип

> **HitKey = человек, а не email.**

У человека может быть множество email-адресов. Email меняются — люди переходят к другим провайдерам, компании переименовывают домены, пользователи добавляют личные и рабочие адреса. Но **человек** остаётся тем же.

## `sub` — Стабильный идентификатор

При вызове `/oauth/userinfo` ответ содержит claim `sub`:

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com"
}
```

Поле `sub`:
- **UUID** — универсально уникальный, никогда не переиспользуется
- **Неизменяемый** — никогда не меняется для данного пользователя
- **Единственный** идентификатор, который стоит хранить как foreign key

## Никогда не используйте email как primary key

Email в HitKey:
- **Изменяемый** — пользователи могут сменить основной email в любой момент
- **Множественный** — у одного пользователя может быть 5, 10 и более верифицированных email
- **Кешированный** — поле `email` в userinfo отражает текущий основной, который может измениться

Если вы используете `email` как идентификатор, вы создадите дубликаты аккаунтов при смене email пользователем.

## Правильный паттерн интеграции

### Схема вашей БД

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hitkey_user_id UUID NOT NULL UNIQUE, -- sub из /oauth/userinfo
  email TEXT,                           -- кеш, обновляется при каждом входе
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### При каждом OAuth-логине

```javascript
const userinfo = await fetch('https://api.hitkey.io/oauth/userinfo', {
  headers: { Authorization: `Bearer ${accessToken}` }
}).then(r => r.json())

// Ищем по sub — НИКОГДА по email
let user = await db.users.findBy('hitkey_user_id', userinfo.sub)

if (!user) {
  user = await db.users.create({
    hitkey_user_id: userinfo.sub,
    email: userinfo.email,
    display_name: userinfo.display_name
  })
} else {
  // Обновляем кешированные поля при каждом входе
  await user.update({
    email: userinfo.email,
    display_name: userinfo.display_name
  })
}
```

::: danger Типичная ошибка
```javascript
// НЕПРАВИЛЬНО — создаст дубликаты при смене email
let user = await db.users.findBy('email', userinfo.email)
```
:::

## Поддержка множественных email

Пользователи HitKey могут иметь несколько верифицированных email-адресов:

- **Основной email** — возвращается в `userinfo.email`
- **Дополнительные email** — управляются через кабинет HitKey
- **Верификация** — каждый email верифицируется отдельно

Когда пользователь меняет основной email, следующий вызов `/oauth/userinfo` вернёт новый. Ваше приложение должно обновить свою копию.

## Структура имён

HitKey поддерживает международные форматы имён:

| Поле | Описание | Пример |
|------|----------|--------|
| `name` | Полное форматированное имя | "John Doe" |
| `given_name` | Личное имя/имена | "John" |
| `family_name` | Фамилия | "Doe" |
| `display_name` | Предпочтительное отображаемое имя | "John" |

## Итого

| Делайте | Не делайте |
|---------|------------|
| Используйте `sub` как foreign key | Используйте `email` как уникальный ключ |
| Добавьте `UNIQUE` на `hitkey_user_id` | Считайте email стабильным |
| Обновляйте кеш email при каждом входе | Пропускайте вызов userinfo |
| Обрабатывайте отсутствующие optional поля | Требуйте все поля имени |
