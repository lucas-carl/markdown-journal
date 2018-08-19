module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Markdown Journal by Lucas Carl',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Online markdown editor' }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
    ]
  },

  css: [
    { src: '~assets/style.scss', lang: 'scss' }
  ],

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#5c5ce6' },

  env: {
    baseUrl: process.env.BASE_URL || 'https://markdown.lucascarl.com/'
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },

    vendor: ['axios', 'marked']
  },

  mode: 'spa'
}
