/**
 * Unit: license AST → plain text helpers.
 *
 * Casual notes use //above important lines in app code;
 * tests stay readable with a file-level JSDoc only where dense.
 */
import { describe, expect, it } from 'vitest'
import { extractLicenseText, licenseBodyToPlainText } from '../../app/utils/licenseText'

//test suite for 'extractLicenseText'
describe('extractLicenseText', () => {
  //returns empty string for nullish values
  it('returns empty string for nullish values', () => {
    expect(extractLicenseText(null)).toBe('')
    expect(extractLicenseText(undefined)).toBe('')
  })

  //returns strings as-is
  it('returns strings as-is', () => {
    expect(extractLicenseText('MIT License')).toBe('MIT License')
  })

  //joins arrays of nodes
  it('joins arrays of nodes', () => {
    expect(extractLicenseText([ 'a', 'b' ])).toBe('ab')
  })

  //reads text nodes
  it('reads text nodes', () => {
    expect(extractLicenseText({ type: 'text', value: 'Hello' })).toBe('Hello')
    expect(extractLicenseText({ type: 'text' })).toBe('')
  })

  //walks element children and adds newlines for block tags
  it('walks element children and adds newlines for block tags', () => {
    const node = {
      tag:      'p',
      children: [ { type: 'text', value: 'Paragraph' } ]
    }
    expect(extractLicenseText(node)).toBe('Paragraph\n\n')
  })

  //walks nested structures
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

  //returns empty for unknown non-object shapes
  it('returns empty for unknown non-object shapes', () => {
    expect(extractLicenseText(42)).toBe('')
  })

  //returns empty for objects without text type or children
  it('returns empty for objects without text type or children', () => {
    expect(extractLicenseText({ type: 'element', tag: 'br' })).toBe('')
  })

  //does not append newlines for non-block tags with children
  it('does not append newlines for non-block tags with children', () => {
    const node = {
      tag:      'span',
      children: [ { type: 'text', value: 'inline' } ]
    }
    expect(extractLicenseText(node)).toBe('inline')
  })
})


//test suite for 'licenseBodyToPlainText'
describe('licenseBodyToPlainText', () => {
  //handles missing body
  it('handles missing body', () => {
    expect(licenseBodyToPlainText(null)).toBe('')
  })

  //returns string bodies directly
  it('returns string bodies directly', () => {
    expect(licenseBodyToPlainText('plain body')).toBe('plain body')
  })

  //walks AST bodies and trims
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
