import { ref, computed }                                  from 'vue'
import type { HeaderFormState, CommentLanguage, License } from '~/types'
import { formatComment }                                  from '~/utils/commentStyles'

export function useHeaderGenerator(license: MaybeRefOrGetter<License | null>) {
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

  const generateRawLines = (lic: License | null): string[] => {
    const lines: string[] = []

    if (formState.value.projectName) {
      lines.push(formState.value.projectName, '')
    }
    if (formState.value.description) {
      lines.push(`@description     ${formState.value.description}`)
    }
    if (formState.value.authorName) {
      const emailPart = formState.value.email ? ` <${formState.value.email}>`: ''
      lines.push(`@author          ${formState.value.authorName}${emailPart}`)

      const currentYear = new Date().getFullYear()
      lines.push(`@copyright       ${currentYear} (C) ${formState.value.authorName}`)
    }
    if (formState.value.website) {
      lines.push(`@see             ${formState.value.website}`)
    }

    if (lic && lic.headerStatement) {
      lines.push('')
      lines.push(...lic.headerStatement.split('\n'))
    }

    formState.value.customProperties.forEach(p => {
      const key = p.key.trim()
      if (key!=='') {
        const val = p.value ? ` ${p.value}`: ''
        lines.push(`@${key}${val}`)
      }
    })

    return lines
  }

  const generatedHeaderCode = computed(() => {
    const lic      = toValue(license)
    const rawLines = generateRawLines(lic)

    if (formState.value.excludeComments) {
      return rawLines.join('\n')
    }
    
    return formatComment(formState.value.language, rawLines)
  })

  return {
    formState,
    generatedHeaderCode,
    generateRawLines
  }
}
