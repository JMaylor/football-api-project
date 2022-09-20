export default {
  title: 'Maylor',
  description: 'Football Data.',
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