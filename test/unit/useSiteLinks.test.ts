/**
 * Unit: site link defaults and email normalization.
 */
import { describe, expect, it } from 'vitest'
import { useSiteLinks } from '../../app/composables/useSiteLinks'

// ... outside Nuxt, useSiteLinks falls back to built-in defaults
describe('useSiteLinks', () => {
  it('returns production defaults when runtimeConfig is unavailable', () => {
    const links = useSiteLinks()

    expect(links.github).toContain('github.com')
    expect(links.paypal).toContain('paypal.me')
    expect(links.email).toMatch(/^mailto:/)
  })
})
