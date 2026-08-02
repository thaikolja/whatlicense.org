/**
 * E2E: homepage smoke via @nuxt/test-utils (dev server).
 *
 * Casual notes use //above important lines in app code;
 * tests stay readable with a file-level JSDoc only where dense.
 */
import { describe, expect, it } from 'vitest'
import { $fetch, setup }        from '@nuxt/test-utils/e2e'
import { fileURLToPath }        from 'node:url'

//test suite for 'example e2e test'
describe('example e2e test', async () => {
  //spin up Nuxt in-process (dev + node-server, not CF static)
  await setup({
    rootDir: fileURLToPath(new URL('../..', import.meta.url)),
    //cloudflare_pages_static is deploy-only; e2e needs a real Node server
    dev:     true,
    nuxtConfig: {
      nitro: {
        preset: 'node-server'
      }
    }
  })

  //renders the index page
  it('renders the index page', async () => {
    //hit the homepage and check key marketing copy
    const html = await $fetch('/')
    expect(html).toContain('What license')
    expect(html).toContain('do I need?')
    expect(html).toContain('Start Wizard')
  })
})
