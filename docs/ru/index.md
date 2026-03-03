---
layout: home

hero:
  name: HitKey
  text: Документация для разработчиков
  tagline: OAuth2 платформа идентификации. Интегрируйте один раз — авторизуйте повсюду.
  actions:
    - theme: brand
      text: Быстрый старт
      link: /ru/guide/quick-start
    - theme: alt
      text: API
      link: /ru/api/

features:
  - title: OAuth2 Authorization Code Flow
    details: Стандартный Authorization Code Flow с безопасным обменом токенов и ротацией refresh.
    link: /ru/guide/oauth-flow
  - title: Идентичность, а не email
    details: Стабильный UUID-идентификатор (sub). Email меняется — человек остаётся тем же.
    link: /ru/guide/identity
  - title: Scopes и Claims
    details: Запрашивайте только нужное — openid, profile, email, project:read.
    link: /ru/guide/scopes
  - title: Доступ на уровне проектов
    details: OAuth-клиенты, роли, разрешения и приглашения — всё в рамках проекта.
    link: /ru/guide/projects
---
