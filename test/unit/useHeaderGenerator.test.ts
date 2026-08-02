import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useHeaderGenerator } from '../../app/composables/useHeaderGenerator'
import { makeLicense } from '../fixtures/licenses'

const mit = makeLicense({
  spdx:   'MIT',
  traits: [ 'permissive' ],
  headerStatement: 'Released under the MIT License.\nSee: https://opensource.org/licenses/MIT'
})

describe('useHeaderGenerator', () => {
  it('builds raw lines from form fields and license statement', () => {
    const license = ref(mit)
    const { formState, generateRawLines } = useHeaderGenerator(license)

    formState.value.projectName = 'MyLib'
    formState.value.description = 'A library'
    formState.value.authorName = 'Ada'
    formState.value.email = 'ada@example.com'
    formState.value.website = 'https://example.com'
    formState.value.customProperties = [
      { key: 'version', value: '1.0.0' },
      { key: '  ', value: 'ignored' }
    ]

    const lines = generateRawLines(mit)
    const year = new Date().getFullYear()

    expect(lines[0]).toBe('MyLib')
    expect(lines).toContain('@description     A library')
    expect(lines).toContain('@author          Ada <ada@example.com>')
    expect(lines).toContain(`@copyright       ${year} (C) Ada`)
    expect(lines).toContain('@see             https://example.com')
    expect(lines).toContain('Released under the MIT License.')
    expect(lines).toContain('@version 1.0.0')
    expect(lines.some(l => l.includes('ignored'))).toBe(false)
  })

  it('omits email wrapper when email is empty', () => {
    const { formState, generateRawLines } = useHeaderGenerator(ref(mit))
    formState.value.authorName = 'Ada'

    const lines = generateRawLines(mit)
    expect(lines).toContain('@author          Ada')
    expect(lines.some(l => l.includes('<'))).toBe(false)
  })

  it('wraps output in language comments by default', () => {
    const { formState, generatedHeaderCode } = useHeaderGenerator(ref(mit))
    formState.value.projectName = 'MyLib'
    formState.value.language = 'php'

    expect(generatedHeaderCode.value.startsWith('/**')).toBe(true)
    expect(generatedHeaderCode.value).toContain('MyLib')
  })

  it('returns raw lines when excludeComments is true', () => {
    const { formState, generatedHeaderCode } = useHeaderGenerator(ref(mit))
    formState.value.projectName = 'MyLib'
    formState.value.excludeComments = true

    expect(generatedHeaderCode.value).toContain('MyLib')
    expect(generatedHeaderCode.value).toContain('Released under the MIT License.')
    expect(generatedHeaderCode.value).not.toMatch(/^\/\*\*/ )
  })

  it('uses python hash comments when language is python', () => {
    const { formState, generatedHeaderCode } = useHeaderGenerator(ref(mit))
    formState.value.projectName = 'MyLib'
    formState.value.language = 'python'

    expect(generatedHeaderCode.value.startsWith('#')).toBe(true)
  })

  it('handles null license without header statement', () => {
    const { formState, generateRawLines } = useHeaderGenerator(ref(null))
    formState.value.projectName = 'OnlyName'

    expect(generateRawLines(null)).toEqual([ 'OnlyName', '' ])
  })

  it('skips custom properties with empty keys but keeps keys with empty values', () => {
    const { formState, generateRawLines } = useHeaderGenerator(ref(null))
    formState.value.customProperties = [
      { key: 'version', value: '' },
      { key: '', value: 'orphan' }
    ]

    const lines = generateRawLines(null)
    expect(lines).toContain('@version')
    expect(lines.some(l => l.includes('orphan'))).toBe(false)
  })
})
