import { describe, expect, it } from 'vitest'
import { cn } from '../../app/lib/utils'

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('merges conflicting tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('ignores falsy values', () => {
    expect(cn('base', false && 'x', undefined, 'end')).toBe('base end')
  })
})
