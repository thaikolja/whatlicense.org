import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CopyButton from '~/components/CopyButton.vue'

describe('CopyButton', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(globalThis, 'isSecureContext', {
      value:        true,
      configurable: true
    })
    Object.defineProperty(navigator, 'clipboard', {
      value:        { writeText },
      configurable: true
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders default label and custom label', async () => {
    const defaultBtn = await mountSuspended(CopyButton, {
      props: { text: 'copy-me' }
    })
    expect(defaultBtn.text()).toContain('Copy')

    const customBtn = await mountSuspended(CopyButton, {
      props: { text: 'copy-me', label: 'Copy code' }
    })
    expect(customBtn.text()).toContain('Copy code')
  })

  it('shows Copied! after click', async () => {
    const wrapper = await mountSuspended(CopyButton, {
      props: { text: 'hello world' }
    })

    await wrapper.trigger('click')
    // allow clipboard promise + vue tick
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Copied!')
    })
  })
})
