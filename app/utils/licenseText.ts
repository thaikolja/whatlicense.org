/**
 * Walk a Nuxt Content / minimark AST (or plain string) and return plain text
 * suitable for clipboard copy of a license body.
 */
export function extractLicenseText(node: unknown): string {
  if (!node) return ''
  if (typeof node === 'string') return node

  if (Array.isArray(node)) {
    return node.map(extractLicenseText).join('')
  }

  if (typeof node !== 'object') return ''

  const record = node as {
    type?: string
    value?: string
    tag?: string
    children?: unknown
  }

  if (record.type === 'text') {
    return record.value || ''
  }

  if (record.children) {
    let text = extractLicenseText(record.children)
    if ([ 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li' ].includes(record.tag || '')) {
      text += '\n\n'
    }
    return text
  }

  return ''
}

/**
 * Normalize a license `body` field (string or AST) into clipboard plain text.
 */
export function licenseBodyToPlainText(body: unknown): string {
  if (!body) return ''
  if (typeof body === 'string') return body
  const record = body as { children?: unknown }
  return extractLicenseText(record.children || body).trim()
}
