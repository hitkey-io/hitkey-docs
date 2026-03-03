import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const en: LocaleSpecificConfig<DefaultTheme.Config> = {
  lang: 'en-US',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'API Reference', link: '/api/' },
      { text: 'Examples', link: '/examples/curl' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'OAuth2 Flow', link: '/guide/oauth-flow' },
            { text: 'HitKey Identity', link: '/guide/identity' },
            { text: 'Token Types', link: '/guide/tokens' },
            { text: 'Scopes & Claims', link: '/guide/scopes' },
          ],
        },
        {
          text: 'Features',
          items: [
            { text: 'Projects', link: '/guide/projects' },
            { text: 'Registration', link: '/guide/registration' },
            { text: 'Two-Factor Auth', link: '/guide/2fa' },
            { text: 'Error Codes', link: '/guide/errors' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'OAuth', link: '/api/oauth' },
            { text: 'Auth', link: '/api/auth' },
            { text: 'Projects', link: '/api/projects' },
            { text: 'Invites', link: '/api/invites' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'curl', link: '/examples/curl' },
            { text: 'Node.js', link: '/examples/node' },
            { text: 'Nuxt', link: '/examples/nuxt' },
          ],
        },
      ],
    },

    editLink: {
      pattern: 'https://github.com/hitkeygroup/hitkey-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'HitKey Service License.',
      copyright: 'Copyright © 2026–present HitKey',
    },
  },
}
