/**
 * Unit: invalid @tag highlighting.
 *
 * Casual notes use // ... above important lines in app code;
 * tests stay readable with a file-level JSDoc only where dense.
 */
import { describe, expect, it } from 'vitest'
import { useHeaderValidator } from '../../app/composables/useHeaderValidator'

// ... test suite for 'useHeaderValidator'
describe('useHeaderValidator', () => {
  const { validateHtmlLines } = useHeaderValidator()

  // ... leaves valid annotations untouched
  it('leaves valid annotations untouched', () => {
    const html = [
      '/**',
      ' * @author Ada',
      ' * @description Cool lib',
      ' */'
    ].join('\n')

    expect(validateHtmlLines(html, [])).toBe(html)
  })

  // ... marks unknown annotations with error-line spans
  it('marks unknown annotations with error-line spans', () => {
    const html = ' * @unknownTag value'
    const result = validateHtmlLines(html, [])

    expect(result).toContain('class="error-line"')
    expect(result).toContain('@unknownTag')
  })

  // ... accepts custom property keys as valid annotations
  it('accepts custom property keys as valid annotations', () => {
    const html = ' * @myCustom 1.0.0'
    const result = validateHtmlLines(html, [ 'myCustom' ])

    expect(result).not.toContain('error-line')
    expect(result).toBe(html)
  })

  // ... validates each line independently
  it('validates each line independently', () => {
    const html = [
      ' * @author Ada',
      ' * @bogus x',
      ' * @version 1'
    ].join('\n')

    const result = validateHtmlLines(html, [])
    const lines = result.split('\n')

    expect(lines[0]).not.toContain('error-line')
    expect(lines[1]).toContain('error-line')
    expect(lines[2]).not.toContain('error-line')
  })
})
