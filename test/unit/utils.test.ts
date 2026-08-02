/**
 * Unit: cn() class merge helper.
 *
 * Casual notes use //above important lines in app code;
 * tests stay readable with a file-level JSDoc only where dense.
 */
import { describe, expect, it } from 'vitest'
import { cn } from '../../app/lib/utils'

//test suite for 'cn'
describe('cn', () => {
  //joins class names
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  //merges conflicting tailwind classes
  it('merges conflicting tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  //ignores falsy values (evaluated at runtime, not a constant)
  it('ignores falsy values', () => {
    const falsy: string | false = false
    expect(cn('base', falsy && 'x', undefined, 'end')).toBe('base end')
  })
})
