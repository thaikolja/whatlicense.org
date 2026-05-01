/*
 * Copyright (C) 2024-2025 YANAWA.io
 * https://cookies.yanawa.io
 * info@cookies.yanawa.io
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * You are free to use, share, and adapt this work for non-commercial purposes, provided that you:
 * - Give appropriate credit to the original author.
 * - Provide a link to the license.
 * - Distribute your contributions under the same license.
 *
 * For more information, visit: https://creativecommons.org/licenses/by-nc-sa/4.0/
 *
 * @author    Kolja Nolte
 * @email     kolja.nolte@gmail.com
 * @license   CC BY-NC-SA 4.0
 * @date      2024-2025
 * @package   YANAWA.io Cookies
 * @website   https://cookies.yanawa.io
 */

// Import the SimpleAnalytics plugin for Vue
import SimpleAnalytics from 'simple-analytics-vue'

/**
 * Nuxt plugin to integrate SimpleAnalytics for tracking.
 * The plugin is only enabled in production environments.
 *
 * @param nuxtApp - The Nuxt application instance
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(SimpleAnalytics, {
    // Skip analytics in non-production environments
    skip: process.env.NODE_ENV!=='production'
  })
})
