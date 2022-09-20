export default {
  title: 'Maylor',
  description: 'Football Data.',
  head: [
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'icon', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#b91d47' }],
    ['meta', { name: 'msapplication-TileColor', content: '#b91d47' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
  ],
  themeConfig: {
    logo: '/logo.png',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/JMaylor/' },
    ],

    sidebar: [
      {
        text: 'Database',
        items: [
          { text: 'Schema', link: '/database/schema' },
        ]
      },
      {
        text: 'API',
        items: [
          { text: 'Getting Started', link: '/api/getting-started' },
        ]
      },
      {
        text: 'Credits',
        items: [
          { text: 'Thanks', link: '/credits/thanks' },
        ]
      },
    ],

    footer: {
      message: 'Made by Joe Maylor.',
    },

    editLink: {
      pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    }
  }
}