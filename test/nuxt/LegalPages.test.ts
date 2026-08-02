/**
 * Nuxt: Privacy Policy and Terms of Service pages.
 */
import { describe, expect, it } from 'vitest'
import { mountSuspended }       from '@nuxt/test-utils/runtime'
import PrivacyPolicy            from '~/pages/privacy-policy.vue'
import TermsOfService           from '~/pages/terms-of-service.vue'

// ... test suite for legal pages
describe('legal pages', () => {
  // ... Privacy Policy shows project-specific privacy claims
  it('renders Privacy Policy with client-side matching claims', async () => {
    const wrapper = await mountSuspended(PrivacyPolicy)

    expect(wrapper.text()).toContain('Privacy Policy')
    expect(wrapper.text()).toContain('in your browser')
    expect(wrapper.text()).toContain('Simple Analytics')
    expect(wrapper.text()).toContain('Effective date')
    expect(wrapper.text()).toContain('Back to wizard')
  })

  // ... Terms of Service disclaim legal advice
  it('renders Terms of Service with not-legal-advice disclaimer', async () => {
    const wrapper = await mountSuspended(TermsOfService)

    expect(wrapper.text()).toContain('Terms of Service')
    expect(wrapper.text()).toContain('not legal advice')
    expect(wrapper.text()).toContain('AS IS')
    expect(wrapper.text()).toContain('MIT License')
    expect(wrapper.text()).toContain('Privacy Policy')
  })
})
