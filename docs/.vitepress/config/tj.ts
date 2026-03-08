import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const tj: LocaleSpecificConfig<DefaultTheme.Config> = {
  lang: 'tg-TJ',
  themeConfig: {
    nav: [
      { text: 'Роҳнамо', link: '/tj/guide/introduction' },
      { text: 'API', link: '/tj/api/' },
      { text: 'Мисолҳо', link: '/tj/examples/curl' },
    ],

    sidebar: {
      '/tj/guide/': [
        {
          text: 'Оғоз',
          items: [
            { text: 'Муқаддима', link: '/tj/guide/introduction' },
            { text: 'Оғози зуд', link: '/tj/guide/quick-start' },
          ],
        },
        {
          text: 'Мафҳумҳои асосӣ',
          items: [
            { text: 'OAuth2 Flow', link: '/tj/guide/oauth-flow' },
            { text: 'Ҳувияти HitKey', link: '/tj/guide/identity' },
            { text: 'Намудҳои токен', link: '/tj/guide/tokens' },
            { text: 'Scopes ва Claims', link: '/tj/guide/scopes' },
          ],
        },
        {
          text: 'Имконотҳо',
          items: [
            { text: 'Лоиҳаҳо', link: '/tj/guide/projects' },
            { text: 'Бақайдгирӣ', link: '/tj/guide/registration' },
            { text: 'Аутентификатсияи 2FA', link: '/tj/guide/2fa' },
            { text: 'Рамзҳои хато', link: '/tj/guide/errors' },
          ],
        },
      ],
      '/tj/api/': [
        {
          text: 'API',
          items: [
            { text: 'Шарҳ', link: '/tj/api/' },
            { text: 'OAuth', link: '/tj/api/oauth' },
            { text: 'Auth', link: '/tj/api/auth' },
            { text: 'Лоиҳаҳо', link: '/tj/api/projects' },
            { text: 'Даъватномаҳо', link: '/tj/api/invites' },
          ],
        },
      ],
      '/tj/examples/': [
        {
          text: 'Мисолҳо',
          items: [
            { text: 'curl', link: '/tj/examples/curl' },
            { text: 'Node.js', link: '/tj/examples/node' },
            { text: 'Nuxt', link: '/tj/examples/nuxt' },
          ],
        },
      ],
    },

    editLink: {
      pattern: 'https://github.com/hitkey-io/hitkey-docs/edit/master/docs/:path',
      text: 'Дар GitHub таҳрир кунед',
    },

    footer: {
      message: 'HitKey Service License.',
      copyright: 'Copyright © 2026–present HitKey',
    },

    docFooter: { prev: 'Қаблӣ', next: 'Оянда' },
    outline: { label: 'Мундариҷа' },
    lastUpdated: { text: 'Навсозӣ' },
    returnToTopLabel: 'Ба боло',
    sidebarMenuLabel: 'Меню',
    darkModeSwitchLabel: 'Мавзуъ',
  },
}
