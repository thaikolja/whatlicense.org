import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import LicenseOverview from '~/components/LicenseOverview.vue'
import { makeLicense } from '../fixtures/licenses'

describe('LicenseOverview', () => {
  it('renders three flip cards with license conditions', async () => {
    const license = makeLicense({
      spdx:   'MIT',
      traits: [ 'permissive' ],
      permissions: [
        { label: 'Commercial use', example: 'Sell it.' }
      ],
      conditions: [
        { label: 'Include notice', example: 'Keep the license.' }
      ],
      limitations: [
        { label: 'No warranty', example: 'As-is.' }
      ]
    })

    const wrapper = await mountSuspended(LicenseOverview, {
      props: { license }
    })

    expect(wrapper.text()).toContain('License Overview')
    expect(wrapper.text()).toContain('Permissions')
    expect(wrapper.text()).toContain('Conditions')
    expect(wrapper.text()).toContain('Limitations')
    expect(wrapper.text()).toContain('Commercial use')
    expect(wrapper.text()).toContain('Include notice')
    expect(wrapper.text()).toContain('No warranty')
  })
})
