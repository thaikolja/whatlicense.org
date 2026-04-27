/**
 * Nuxt 4 configuration for whatlicense.io.
 *
 * @description  Registers all required modules (Tailwind, Google Fonts, SEO,
 *               ESLint, Content) and defines global application metadata.
 * @see          https://nuxt.com/docs/api/configuration/nuxt-config
 */
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: false },

  modules: [
    '@nuxt/ui',
    '@nuxtjs/google-fonts',
    '@nuxtjs/seo',
    '@nuxt/eslint',
    '@nuxt/content'
  ],

  /* ------------------------------------------------------------------ */
  /*  CSS                                                                */
  /* ------------------------------------------------------------------ */
  css: [ '~/assets/css/main.css' ],

  /* ------------------------------------------------------------------ */
  /*  Google Fonts                                                       */
  /* ------------------------------------------------------------------ */
  googleFonts: {
    families: {
      'Playfair Display': {
        wght: [ 400, 600, 700 ],
        ital: [ 400, 600 ]
      },
      'Karla':            {
        wght: [ 400, 500, 600, 700 ]
      }
    },
    display:  'swap',
    preload:  true
  },

  /* ------------------------------------------------------------------ */
  /*  SEO defaults                                                       */
  /* ------------------------------------------------------------------ */
  site: {
    url:           'https://whatlicense.io',
    name:          'whatlicense.io',
    description:   'Find the perfect open-source license for your project. Answer a few simple questions and get an instant recommendation with ready-to-use file headers.',
    defaultLocale: 'en'
  },

  app: {
    head: {
      title:     'whatlicense.io — Find the Perfect License for Your Code',
      htmlAttrs: { lang: 'en' },
      meta:      [
        { name: 'theme-color', content: '#fdfaf6' }
      ]
    }
  },

  /* ------------------------------------------------------------------ */
  /*  Content (license texts via SQLite)                                 */
  /* ------------------------------------------------------------------ */
  content: {
    build: {
      markdown: {
        highlight: false
      }
    }
  },


  /* ------------------------------------------------------------------ */
  /*  TypeScript                                                         */
  /* ------------------------------------------------------------------ */
  typescript: {
    strict:    true,
    typeCheck: false
  }
})
