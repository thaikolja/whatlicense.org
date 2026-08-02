/**
 * Highlights invalid @annotations in generated header HTML (preview).
 */

/**
 * Builds a validator that knows stock JSDoc-ish tags + user custom keys.
 */
export function useHeaderValidator() {
  // ... tags we always treat as legit
  const VALID_ANNOTATIONS = new Set([
    'author', 'copyright', 'license', 'see', 'version',
    'description', 'param', 'return', 'throws', 'deprecated',
    'since', 'link', 'api'
  ])

  /**
   * Scan highlighted HTML line-by-line; wrap unknown @tags in error styling.
   *
   * @param htmlCode   - HTML string from highlight.js
   * @param customKeys - extra allowed keys from the modal (without @)
   */
  const validateHtmlLines = (htmlCode: string, customKeys: string[]): string => {
    // ... merge stock + custom keys
    const allValid = new Set([ ...VALID_ANNOTATIONS, ...customKeys ])
    // ... one line at a time
    const htmlLines = htmlCode.split('\n')

    for (let i = 0; i < htmlLines.length; i++) {
      // ... first @word on the line, if any
      const match = htmlLines[i].match(/@([a-zA-Z0-9_]+)/)
      if (match && !allValid.has(match[1])) {
        // ... mark the whole line so the preview can underline it
        htmlLines[i] = `<span class="error-line">${htmlLines[i]}</span>`
      }
    }

    return htmlLines.join('\n')
  }

  // ... public API
  return {
    validateHtmlLines
  }
}
