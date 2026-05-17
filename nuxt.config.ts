//noinspection JSUnusedGlobalSymbols

/**
 * Nuxt 4 configuration for whatlicense.org.
 *
 * @description  Registers all required modules (Tailwind, Google Fonts, SEO,
 *               ESLint, Content) and defines global application metadata.
 * @see          https://nuxt.com/docs/api/configuration/nuxt-config
 */
import { readdirSync }   from 'fs'
import { join }          from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: false },

  modules: [
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxtjs/seo',
    '@nuxt/eslint',
    '@nuxt/content'
  ],

  /* ------------------------------------------------------------------ */
  /*  CSS                                                                */
  /* ------------------------------------------------------------------ */
  css: [ '~/assets/css/main.css' ],

  ogImage: {
    enabled: false
  },

  /* ------------------------------------------------------------------ */
  /*  SEO defaults                                                       */
  /* ------------------------------------------------------------------ */
  site: {
    url:           'https://whatlicense.org',
    name:          'whatlicense.org',
    description:   'Find out "what license do I need" for your code. Use our open-source license header generator to get perfect recommendations and file headers instantly.',
    defaultLocale: 'en'
  },

  app: {
    head: {
      titleTemplate: '%s | whatlicense.org',
      title:         'Find the Perfect License for Your Code',
      htmlAttrs:     { lang: 'en' },
      meta:          [
        { name: 'theme-color', content: '#fdfaf6' }
      ]
    }
  },


  /* ------------------------------------------------------------------ */
  /*  TypeScript                                                         */
  /* ------------------------------------------------------------------ */
  typescript: {
    strict:    true,
    typeCheck: false
  },

  runtimeConfig: {
    public: {
      debugAutoSelect: process.env.NUXT_PUBLIC_DEBUG_AUTO_SELECT==='true',
      links:           {
        paypal:    'https://paypal.me/thaikolja/10',
        termsFeed: 'https://www.termsfeed.com/?ref=whatlicense',
        github:    'https://github.com/thaikolja/whatlicense.org',
        twitter:   'https://twitter.com/whatlicenseorg',
        email:     'mailto:kolja.nolte@gmail.com'
      }
    }
  },

  vite: {
    build:        {
      sourcemap:     false,
      minify:        'terser',
      terserOptions: {
        compress: {
          drop_console:  true,
          drop_debugger: true,
          pure_funcs:    [ 'console.log', 'console.info' ]
        }
      }
    },
    optimizeDeps: {
      include: [
        'highlight.js/lib/core',
        'highlight.js/lib/languages/javascript',
        'highlight.js/lib/languages/python',
        'highlight.js/lib/languages/php',
        'highlight.js/lib/languages/ruby',
        'highlight.js/lib/languages/xml',
        'highlight.js/lib/languages/css',
        '@unhead/schema-org/vue'
      ]
    }
  },

  content: {
    /* database: {
     type: 'sqlite'
     }, */
    build: {
      markdown: {
        highlight: false
      }
    }
  },

  nitro: {
    preset:    'cloudflare_pages_static',
    prerender: {
      crawlLinks: true,
      routes:     readdirSync(join(__dirname, 'content', 'licenses'))
                  .filter(f => f.endsWith('.md'))
                  .map(f => `/licenses/${f.replace(/\.md$/, '')}`)
    }
  }
})
