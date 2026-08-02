/**
 * Nuxt: CopyButton label + copied state.
 *
 * Casual notes use //above important lines in app code;
 * tests stay readable with a file-level JSDoc only where dense.
 */
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CopyButton from '~/components/CopyButton.vue'

//test suite for 'CopyButton'
describe('CopyButton', () => {
  //setup before each case
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

  //cleanup after each case
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  //renders default label and custom label
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

  //shows Copied! after click
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
