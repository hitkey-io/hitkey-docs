import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const es: LocaleSpecificConfig<DefaultTheme.Config> = {
  lang: 'es-ES',
  themeConfig: {
    nav: [
      { text: 'Guía', link: '/es/guide/introduction' },
      { text: 'API', link: '/es/api/' },
      { text: 'Ejemplos', link: '/es/examples/curl' },
    ],

    sidebar: {
      '/es/guide/': [
        {
          text: 'Primeros pasos',
          items: [
            { text: 'Introducción', link: '/es/guide/introduction' },
            { text: 'Inicio rápido', link: '/es/guide/quick-start' },
          ],
        },
        {
          text: 'Conceptos clave',
          items: [
            { text: 'OAuth2 Flow', link: '/es/guide/oauth-flow' },
            { text: 'Identidad HitKey', link: '/es/guide/identity' },
            { text: 'Tipos de tokens', link: '/es/guide/tokens' },
            { text: 'Scopes y Claims', link: '/es/guide/scopes' },
          ],
        },
        {
          text: 'Funciones',
          items: [
            { text: 'Proyectos', link: '/es/guide/projects' },
            { text: 'Registro', link: '/es/guide/registration' },
            { text: 'Auth. de dos factores', link: '/es/guide/2fa' },
            { text: 'Códigos de error', link: '/es/guide/errors' },
          ],
        },
      ],
      '/es/api/': [
        {
          text: 'API',
          items: [
            { text: 'Descripción general', link: '/es/api/' },
            { text: 'OAuth', link: '/es/api/oauth' },
            { text: 'Auth', link: '/es/api/auth' },
            { text: 'Proyectos', link: '/es/api/projects' },
            { text: 'Invitaciones', link: '/es/api/invites' },
          ],
        },
      ],
      '/es/examples/': [
        {
          text: 'Ejemplos',
          items: [
            { text: 'curl', link: '/es/examples/curl' },
            { text: 'Node.js', link: '/es/examples/node' },
            { text: 'Nuxt', link: '/es/examples/nuxt' },
          ],
        },
      ],
    },

    editLink: {
      pattern: 'https://github.com/hitkeygroup/hitkey-docs/edit/main/docs/:path',
      text: 'Editar en GitHub',
    },

    footer: {
      message: 'HitKey Service License.',
      copyright: 'Copyright © 2026–present HitKey',
    },

    docFooter: { prev: 'Anterior', next: 'Siguiente' },
    outline: { label: 'Contenido' },
    lastUpdated: { text: 'Actualizado' },
    returnToTopLabel: 'Arriba',
    sidebarMenuLabel: 'Menú',
    darkModeSwitchLabel: 'Tema',
  },
}
