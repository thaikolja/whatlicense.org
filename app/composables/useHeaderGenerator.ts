/**
 * Builds file-header lines from form state + the matched license boilerplate.
 */
import { ref, computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { HeaderFormState, License } from '~/types'
import { formatComment }                 from '~/utils/commentStyles'

/**
 * Reactive form + generators for the file header customizer.
 *
 * @param license - Ref / getter / plain value of the current license (or null)
 */
export function useHeaderGenerator(license: MaybeRefOrGetter<License | null>) {
  // empty form defaults (php is the historical default language)
  const formState = ref<HeaderFormState>({
    projectName:      '',
    description:      '',
    authorName:       '',
    email:            '',
    website:          '',
    language:         'php',
    customProperties: [],
    excludeComments:  false
  })

  /**
   * Raw header lines (no comment wrappers yet).
   */
  const generateRawLines = (lic: License | null): string[] => {
    const lines: string[] = []

    // title block
    if (formState.value.projectName) {
      lines.push(formState.value.projectName, '')
    }
    // optional description tag
    if (formState.value.description) {
      lines.push(`@description     ${formState.value.description}`)
    }
    // author (+ email) and copyright year
    if (formState.value.authorName) {
      const emailPart = formState.value.email ? ` <${formState.value.email}>` : ''
      lines.push(`@author          ${formState.value.authorName}${emailPart}`)

      // stamp current calendar year
      const currentYear = new Date().getFullYear()
      lines.push(`@copyright       ${currentYear} (C) ${formState.value.authorName}`)
    }
    // optional project URL
    if (formState.value.website) {
      lines.push(`@see             ${formState.value.website}`)
    }

    // license boilerplate from content frontmatter
    if (lic && lic.headerStatement) {
      lines.push('')
      lines.push(...lic.headerStatement.split('\n'))
    }

    // user-defined @keys (skip empty keys)
    formState.value.customProperties.forEach(p => {
      const key = p.key.trim()
      if (key !== '') {
        const val = p.value ? ` ${p.value}` : ''
        lines.push(`@${key}${val}`)
      }
    })

    return lines
  }

  // full preview string (commented or raw)
  const generatedHeaderCode = computed(() => {
    // unwrap ref/getter/value
    const lic = toValue(license)
    const rawLines = generateRawLines(lic)

    // user asked for bare tags only
    if (formState.value.excludeComments) {
      return rawLines.join('\n')
    }

    // wrap for selected language
    return formatComment(formState.value.language, rawLines)
  })

  // public API
  return {
    formState,
    generatedHeaderCode,
    generateRawLines
  }
}
