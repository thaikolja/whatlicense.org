import { describe, expect, it } from 'vitest'
import { useHeaderValidator } from '../../app/composables/useHeaderValidator'

describe('useHeaderValidator', () => {
  const { validateHtmlLines } = useHeaderValidator()

  it('leaves valid annotations untouched', () => {
    const html = [
      '/**',
      ' * @author Ada',
      ' * @description Cool lib',
      ' */'
    ].join('\n')

    expect(validateHtmlLines(html, [])).toBe(html)
  })

  it('marks unknown annotations with error-line spans', () => {
    const html = ' * @unknownTag value'
    const result = validateHtmlLines(html, [])

    expect(result).toContain('class="error-line"')
    expect(result).toContain('@unknownTag')
  })

  it('accepts custom property keys as valid annotations', () => {
    const html = ' * @myCustom 1.0.0'
    const result = validateHtmlLines(html, [ 'myCustom' ])

    expect(result).not.toContain('error-line')
    expect(result).toBe(html)
  })

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
