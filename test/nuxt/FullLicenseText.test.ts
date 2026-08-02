import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FullLicenseText from '~/components/FullLicenseText.vue'
import { makeLicense } from '../fixtures/licenses'

describe('FullLicenseText', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'isSecureContext', {
      value:        true,
      configurable: true
    })
    Object.defineProperty(navigator, 'clipboard', {
      value:        { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true
    })
  })

  it('shows fallback when body is missing', async () => {
    const license = makeLicense({
      spdx:   'MIT',
      traits: [ 'permissive' ]
    })

    const wrapper = await mountSuspended(FullLicenseText, {
      props: { license },
      global: {
        stubs: {
          ContentRenderer: true,
          CopyButton:      true
        }
      }
    })

    expect(wrapper.text()).toContain('Full License Text')
    expect(wrapper.text()).toContain('License text not found.')
  })

  it('renders ContentRenderer when body is present', async () => {
    const license = {
      ...makeLicense({
        spdx:   'MIT',
        traits: [ 'permissive' ]
      }),
      body: {
        type:     'minimark',
        value:    [ [ 'p', {}, 'MIT License body' ] ],
        children: [ { type: 'text', value: 'MIT License body' } ]
      }
    }

    const wrapper = await mountSuspended(FullLicenseText, {
      props: { license: license as never },
      global: {
        stubs: {
          ContentRenderer: {
            template: '<div class="body-stub">{{ value }}</div>',
            props:    [ 'value' ]
          },
          CopyButton: true
        }
      }
    })

    expect(wrapper.find('.body-stub').exists()).toBe(true)
  })
})
