/**
 * Client-only Simple Analytics plugin.
 * Skipped outside production so local/dev traffic doesn’t pollute stats.
 */
import SimpleAnalytics from 'simple-analytics-vue'

export default defineNuxtPlugin((nuxtApp) => {
  // register the Vue plugin with env-based skip
  nuxtApp.vueApp.use(SimpleAnalytics, {
    // only track real prod hits
    skip:   process.env.NODE_ENV !== 'production',
    domain: 'counter.whatlicense.org'
  })
})
