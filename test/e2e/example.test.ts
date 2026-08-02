import { describe, expect, it } from 'vitest'
import { $fetch, setup }        from '@nuxt/test-utils/e2e'
import { fileURLToPath }        from 'node:url'

describe('example e2e test', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('../..', import.meta.url)),
    // Dev server + Node Nitro — cloudflare_pages_static is for deploy only
    dev:     true,
    nuxtConfig: {
      nitro: {
        preset: 'node-server'
      }
    }
  })

  it('renders the index page', async () => {
    const html = await $fetch('/')
    expect(html).toContain('What license')
    expect(html).toContain('do I need?')
    expect(html).toContain('Smart License Wizard')
  })
})
