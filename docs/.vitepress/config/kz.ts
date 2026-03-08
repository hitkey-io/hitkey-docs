import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const kz: LocaleSpecificConfig<DefaultTheme.Config> = {
  lang: 'kk-KZ',
  themeConfig: {
    nav: [
      { text: 'Нұсқаулық', link: '/kz/guide/introduction' },
      { text: 'API', link: '/kz/api/' },
      { text: 'Мысалдар', link: '/kz/examples/curl' },
    ],

    sidebar: {
      '/kz/guide/': [
        {
          text: 'Бастау',
          items: [
            { text: 'Кіріспе', link: '/kz/guide/introduction' },
            { text: 'Жылдам бастау', link: '/kz/guide/quick-start' },
          ],
        },
        {
          text: 'Негізгі түсініктер',
          items: [
            { text: 'OAuth2 Flow', link: '/kz/guide/oauth-flow' },
            { text: 'HitKey сәйкестігі', link: '/kz/guide/identity' },
            { text: 'Токен түрлері', link: '/kz/guide/tokens' },
            { text: 'Scopes және Claims', link: '/kz/guide/scopes' },
          ],
        },
        {
          text: 'Мүмкіндіктер',
          items: [
            { text: 'Жобалар', link: '/kz/guide/projects' },
            { text: 'Тіркелу', link: '/kz/guide/registration' },
            { text: 'Екі факторлы аут.', link: '/kz/guide/2fa' },
            { text: 'Қате кодтары', link: '/kz/guide/errors' },
          ],
        },
      ],
      '/kz/api/': [
        {
          text: 'API',
          items: [
            { text: 'Шолу', link: '/kz/api/' },
            { text: 'OAuth', link: '/kz/api/oauth' },
            { text: 'Auth', link: '/kz/api/auth' },
            { text: 'Жобалар', link: '/kz/api/projects' },
            { text: 'Шақырулар', link: '/kz/api/invites' },
          ],
        },
      ],
      '/kz/examples/': [
        {
          text: 'Мысалдар',
          items: [
            { text: 'curl', link: '/kz/examples/curl' },
            { text: 'Node.js', link: '/kz/examples/node' },
            { text: 'Nuxt', link: '/kz/examples/nuxt' },
          ],
        },
      ],
    },

    editLink: {
      pattern: 'https://github.com/hitkey-io/hitkey-docs/edit/master/docs/:path',
      text: 'GitHub-та өңдеу',
    },

    footer: {
      message: 'HitKey Service License.',
      copyright: 'Copyright © 2026–present HitKey',
    },

    docFooter: { prev: 'Алдыңғы', next: 'Келесі' },
    outline: { label: 'Мазмұны' },
    lastUpdated: { text: 'Жаңартылды' },
    returnToTopLabel: 'Жоғарыға',
    sidebarMenuLabel: 'Мәзір',
    darkModeSwitchLabel: 'Тақырып',
  },
}
