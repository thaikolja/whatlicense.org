export function useHeaderValidator() {
  const VALID_ANNOTATIONS = new Set([
    'author', 'copyright', 'license', 'see', 'version',
    'description', 'param', 'return', 'throws', 'deprecated',
    'since', 'link', 'api'
  ])

  const validateHtmlLines = (htmlCode: string, customKeys: string[]): string => {
    const allValid  = new Set([ ...VALID_ANNOTATIONS, ...customKeys ])
    const htmlLines = htmlCode.split('\n')

    for (let i = 0; i < htmlLines.length; i++) {
      const match = htmlLines[i].match(/@([a-zA-Z0-9_]+)/)
      if (match && !allValid.has(match[1])) {
        // Wrap the entire line in error styling if annotation is invalid
        htmlLines[i] = `<span class="error-line">${htmlLines[i]}</span>`
      }
    }

    return htmlLines.join('\n')
  }

  return {
    validateHtmlLines
  }
}
