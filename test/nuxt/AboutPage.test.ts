/**
 * Nuxt: About page story + CTAs.
 */
import { describe, expect, it } from 'vitest'
import { mountSuspended }       from '@nuxt/test-utils/runtime'
import AboutPage                from '~/pages/about.vue'

// ... test suite for About page
describe('About page', () => {
  // ... renders manifesto, privacy angle, and wizard CTA
  it('renders creative about content and key CTAs', async () => {
    const wrapper = await mountSuspended(AboutPage)

    expect(wrapper.text()).toContain('Licenses are poetry')
    expect(wrapper.text()).toContain('whatlicense.org')
    expect(wrapper.text()).toContain('Honest empty results')
    expect(wrapper.text()).toContain('Kolja Nolte')
    expect(wrapper.text()).toContain('Start the wizard')
    expect(wrapper.text()).toContain('not legal advice')
    expect(wrapper.html()).toContain('/privacy-policy')
    expect(wrapper.html()).toContain('/terms-of-service')
  })
})
