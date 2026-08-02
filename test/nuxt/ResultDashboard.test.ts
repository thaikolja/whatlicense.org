/**
 * Nuxt: result dashboard SPDX + why text.
 *
 * Casual notes use // ... above important lines in app code;
 * tests stay readable with a file-level JSDoc only where dense.
 */
import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ResultDashboard from '~/components/ResultDashboard.vue'
import { makeLicense } from '../fixtures/licenses'

// ... test suite for 'ResultDashboard'
describe('ResultDashboard', () => {
  // ... shows SPDX and whyThisLicense
  it('shows SPDX and whyThisLicense', async () => {
    const license = makeLicense({
      spdx:           'MIT',
      traits:         [ 'permissive' ],
      whyThisLicense: 'You want maximum freedom.'
    })

    const wrapper = await mountSuspended(ResultDashboard, {
      props: { license },
      global: {
        stubs: {
          LicenseOverview:       true,
          LazyFileHeaderGenerator: true,
          LazyFullLicenseText:   true,
          FileHeaderGenerator:   true,
          FullLicenseText:       true
        }
      }
    })

    expect(wrapper.text()).toContain('Your Perfect Match')
    expect(wrapper.text()).toContain('MIT')
    expect(wrapper.text()).toContain('You want maximum freedom.')
    expect(wrapper.text()).toContain('Donate via PayPal')
  })
})
