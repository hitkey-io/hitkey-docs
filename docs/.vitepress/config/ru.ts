import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const ru: LocaleSpecificConfig<DefaultTheme.Config> = {
  lang: 'ru-RU',
  themeConfig: {
    nav: [
      { text: 'Руководство', link: '/ru/guide/introduction' },
      { text: 'API', link: '/ru/api/' },
      { text: 'Примеры', link: '/ru/examples/curl' },
    ],

    sidebar: {
      '/ru/guide/': [
        {
          text: 'Начало работы',
          items: [
            { text: 'Введение', link: '/ru/guide/introduction' },
            { text: 'Быстрый старт', link: '/ru/guide/quick-start' },
          ],
        },
        {
          text: 'Основные концепции',
          items: [
            { text: 'OAuth2 Flow', link: '/ru/guide/oauth-flow' },
            { text: 'Идентичность HitKey', link: '/ru/guide/identity' },
            { text: 'Типы токенов', link: '/ru/guide/tokens' },
            { text: 'Scopes и Claims', link: '/ru/guide/scopes' },
          ],
        },
        {
          text: 'Функции',
          items: [
            { text: 'Проекты', link: '/ru/guide/projects' },
            { text: 'Регистрация', link: '/ru/guide/registration' },
            { text: 'Двухфакторная авт.', link: '/ru/guide/2fa' },
            { text: 'Коды ошибок', link: '/ru/guide/errors' },
          ],
        },
      ],
      '/ru/api/': [
        {
          text: 'API',
          items: [
            { text: 'Обзор', link: '/ru/api/' },
            { text: 'OAuth', link: '/ru/api/oauth' },
            { text: 'Auth', link: '/ru/api/auth' },
            { text: 'Проекты', link: '/ru/api/projects' },
            { text: 'Приглашения', link: '/ru/api/invites' },
          ],
        },
      ],
      '/ru/examples/': [
        {
          text: 'Примеры',
          items: [
            { text: 'curl', link: '/ru/examples/curl' },
            { text: 'Node.js', link: '/ru/examples/node' },
            { text: 'Nuxt', link: '/ru/examples/nuxt' },
          ],
        },
      ],
    },

    editLink: {
      pattern: 'https://github.com/hitkey-io/hitkey-docs/edit/master/docs/:path',
      text: 'Редактировать на GitHub',
    },

    footer: {
      message: 'HitKey Service License.',
      copyright: 'Copyright © 2026–present HitKey',
    },

    docFooter: {
      prev: 'Предыдущая',
      next: 'Следующая',
    },

    outline: { label: 'Содержание' },
    lastUpdated: { text: 'Обновлено' },
    returnToTopLabel: 'Наверх',
    sidebarMenuLabel: 'Меню',
    darkModeSwitchLabel: 'Тема',
  },
}
