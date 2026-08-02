import { describe, expect, it } from 'vitest'
import { extractLicenseText, licenseBodyToPlainText } from '../../app/utils/licenseText'

describe('extractLicenseText', () => {
  it('returns empty string for nullish values', () => {
    expect(extractLicenseText(null)).toBe('')
    expect(extractLicenseText(undefined)).toBe('')
  })

  it('returns strings as-is', () => {
    expect(extractLicenseText('MIT License')).toBe('MIT License')
  })

  it('joins arrays of nodes', () => {
    expect(extractLicenseText([ 'a', 'b' ])).toBe('ab')
  })

  it('reads text nodes', () => {
    expect(extractLicenseText({ type: 'text', value: 'Hello' })).toBe('Hello')
    expect(extractLicenseText({ type: 'text' })).toBe('')
  })

  it('walks element children and adds newlines for block tags', () => {
    const node = {
      tag:      'p',
      children: [ { type: 'text', value: 'Paragraph' } ]
    }
    expect(extractLicenseText(node)).toBe('Paragraph\n\n')
  })

  it('walks nested structures', () => {
    const node = {
      children: [
        {
          tag:      'h1',
          children: [ { type: 'text', value: 'Title' } ]
        },
        {
          tag:      'p',
          children: [ { type: 'text', value: 'Body' } ]
        }
      ]
    }
    expect(extractLicenseText(node)).toBe('Title\n\nBody\n\n')
  })

  it('returns empty for unknown non-object shapes', () => {
    expect(extractLicenseText(42)).toBe('')
  })

  it('returns empty for objects without text type or children', () => {
    expect(extractLicenseText({ type: 'element', tag: 'br' })).toBe('')
  })

  it('does not append newlines for non-block tags with children', () => {
    const node = {
      tag:      'span',
      children: [ { type: 'text', value: 'inline' } ]
    }
    expect(extractLicenseText(node)).toBe('inline')
  })
})


describe('licenseBodyToPlainText', () => {
  it('handles missing body', () => {
    expect(licenseBodyToPlainText(null)).toBe('')
  })

  it('returns string bodies directly', () => {
    expect(licenseBodyToPlainText('plain body')).toBe('plain body')
  })

  it('walks AST bodies and trims', () => {
    const body = {
      children: [
        {
          tag:      'p',
          children: [ { type: 'text', value: '  License text  ' } ]
        }
      ]
    }
    expect(licenseBodyToPlainText(body)).toBe('License text')
  })
})
