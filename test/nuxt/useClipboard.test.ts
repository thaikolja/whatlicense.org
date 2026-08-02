/**
 * Nuxt: clipboard secure path + fallbacks.
 *
 * Casual notes use // ... above important lines in app code;
 * tests stay readable with a file-level JSDoc only where dense.
 */
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { useClipboard } from '~/composables/useClipboard'

// ... test suite for 'useClipboard'
describe('useClipboard', () => {
  // ... setup before each case
  beforeEach(() => {
    vi.useFakeTimers()
  })

  // ... cleanup after each case
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // ... copies via navigator.clipboard in a secure context
  it('copies via navigator.clipboard in a secure context', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(globalThis, 'isSecureContext', {
      value:      true,
      configurable: true
    })
    Object.defineProperty(navigator, 'clipboard', {
      value:        { writeText },
      configurable: true
    })

    const { copy, isCopied } = useClipboard()
    await copy('hello')

    expect(writeText).toHaveBeenCalledWith('hello')
    expect(isCopied.value).toBe(true)

    vi.advanceTimersByTime(2000)
    expect(isCopied.value).toBe(false)
  })

  // ... falls back to execCommand when clipboard API is unavailable
  it('falls back to execCommand when clipboard API is unavailable', async () => {
    Object.defineProperty(globalThis, 'isSecureContext', {
      value:        false,
      configurable: true
    })
    Object.defineProperty(navigator, 'clipboard', {
      value:        undefined,
      configurable: true
    })

    const execCommand = vi.fn().mockReturnValue(true)
    document.execCommand = execCommand as typeof document.execCommand

    const { copy, isCopied } = useClipboard()
    await copy('fallback-text')

    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(isCopied.value).toBe(true)
  })

  // ... swallows errors from the secure clipboard path
  it('swallows errors from the secure clipboard path', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    Object.defineProperty(globalThis, 'isSecureContext', {
      value:        true,
      configurable: true
    })
    Object.defineProperty(navigator, 'clipboard', {
      value:        { writeText },
      configurable: true
    })

    const { copy, isCopied } = useClipboard()
    await copy('nope')

    expect(isCopied.value).toBe(false)
    expect(error).toHaveBeenCalled()
  })

  // ... logs when fallback execCommand throws
  it('logs when fallback execCommand throws', async () => {
    Object.defineProperty(globalThis, 'isSecureContext', {
      value:        false,
      configurable: true
    })
    Object.defineProperty(navigator, 'clipboard', {
      value:        undefined,
      configurable: true
    })

    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    document.execCommand = vi.fn(() => {
      throw new Error('exec failed')
    }) as typeof document.execCommand

    const { copy, isCopied } = useClipboard()
    await copy('fallback-fail')

    // outer try still sets copied after inner catch
    expect(error).toHaveBeenCalled()
    expect(isCopied.value).toBe(true)
  })
})

