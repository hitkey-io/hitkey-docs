import type { UserConfig } from 'vitepress'

export const shared: UserConfig = {
  title: 'HitKey',
  description: 'HitKey Developer Documentation — OAuth2 identity platform for your applications',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#0f172b' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hitkey-io' },
    ],

    search: {
      provider: 'local',
    },
  },

  lastUpdated: true,
  cleanUrls: true,
}
