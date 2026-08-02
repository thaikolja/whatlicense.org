//noinspection JSUnusedGlobalSymbols

/**
 * Nuxt 4 configuration for whatlicense.org.
 *
 * Modules (shadcn, Icon, Fonts, SEO, ESLint, Content), Tailwind via Vite,
 * static Cloudflare Pages preset, and public runtime links.
 *
 * @see https://nuxt.com/docs/api/configuration/nuxt-config
 */
import { readdirSync }   from 'fs'
import { join }          from 'path'
import { fileURLToPath } from 'url'
import tailwindcss       from '@tailwindcss/vite'

// ... resolve project root for prerender route scanning
const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineNuxtConfig({
  // ... pin runtime behavior to this date
  compatibilityDate: '2025-07-15',

  // ... keep DevTools off in the default config
  devtools: { enabled: false },

  // ... order mostly doesn’t matter; icon before shadcn is fine
  modules: [
    '@nuxt/icon',
    'shadcn-nuxt',
    '@nuxt/fonts',
    '@nuxtjs/seo',
    '@nuxt/eslint',
    '@nuxt/content'
  ],

  // ... where CLI-generated UI primitives live
  shadcn: {
    prefix:       '',
    componentDir: './app/components/ui'
  },

  /**
   * Fully local icons — no Iconify API / remote server bundle.
   * Static Cloudflare Pages has no icon API endpoint, so all icons
   * used in the app are embedded in the client bundle from @iconify-json/*.
   */
  icon: {
    // ... never hit the public Iconify API
    provider:      'none',
    fallbackToApi: false,
    serverBundle:  false,
    clientBundle:  {
      // ... also scan source for icon names
      scan:        true,
      sizeLimitKb: 256,
      // ... explicit list so header/footer icons always ship
      icons: [
        'mdi:paypal',
        'mdi:github',
        'mdi:twitter',
        'mdi:envelope'
      ]
    }
  },

  // ... global CSS entry (Tailwind + brand tokens)
  css: [ '~/assets/css/main.css' ],

  // ... OG image module stays off
  ogImage: {
    enabled: false
  },

  // ... site-wide SEO defaults
  site: {
    url:           'https://whatlicense.org',
    name:          'whatlicense.org',
    description:   'Find out "what license do I need" for your code. Use our open-source license header generator to get perfect recommendations and file headers instantly.',
    defaultLocale: 'en'
  },

  // ... document head defaults
  app: {
    head: {
      titleTemplate: '%s | whatlicense.org',
      title:         'Find the Perfect License for Your Code',
      htmlAttrs:     { lang: 'en' },
      meta:          [
        // ... cream brand theme color
        { name: 'theme-color', content: '#fdfaf6' }
      ]
    }
  },

  // ... strict TS without blocking builds on typecheck
  typescript: {
    strict:    true,
    typeCheck: false
  },

  // ... public env + monetization / social links
  runtimeConfig: {
    public: {
      // ... debug: auto-pick option 0 for every quiz step
      debugAutoSelect: process.env.NUXT_PUBLIC_DEBUG_AUTO_SELECT === 'true',
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
    // ... Tailwind v4 as a Vite plugin (no Nuxt UI)
    plugins: [
      tailwindcss()
    ],
    build:   {
      // ... smaller prod bundles
      sourcemap:     false,
      minify:        'terser',
      terserOptions: {
        compress: {
          // ... strip console noise in prod
          drop_console:  true,
          drop_debugger: true,
          pure_funcs:    [ 'console.log', 'console.info' ]
        }
      }
    },
    // ... pre-bundle highlight.js langs used by the header preview
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
    // ... keep markdown highlight off; we use highlight.js in the UI
    build: {
      markdown: {
        highlight: false
      }
    }
  },

  nitro: {
    // ... default deploy target is Cloudflare Pages static
    preset:    'cloudflare_pages_static',
    prerender: {
      // ... also crawl links discovered from pages
      crawlLinks: true,
      // ... explicit /licenses/<slug> for every markdown file
      routes: readdirSync(join(__dirname, 'content', 'licenses'))
              .filter(f => f.endsWith('.md'))
              .map(f => `/licenses/${f.replace(/\.md$/, '')}`)
    }
  }
})
