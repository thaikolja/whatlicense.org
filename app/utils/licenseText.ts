/**
 * Helpers to turn Nuxt Content / minimark license bodies into plain text
 * for the “copy full license” clipboard path.
 */

/**
 * Walk a Nuxt Content / minimark AST (or plain string) and return plain text.
 */
export function extractLicenseText(node: unknown): string {
  // nothing to walk
  if (!node) return ''
  // already a string — done
  if (typeof node === 'string') return node

  // array of sibling nodes
  if (Array.isArray(node)) {
    return node.map(extractLicenseText).join('')
  }

  // numbers/bools etc. aren’t useful here
  if (typeof node !== 'object') return ''

  // treat as a loosely typed AST node
  const record = node as {
    type?: string
    value?: string
    tag?: string
    children?: unknown
  }

  // leaf text node
  if (record.type === 'text') {
    return record.value || ''
  }

  // element with kids — recurse, maybe add paragraph spacing
  if (record.children) {
    let text = extractLicenseText(record.children)
    if ([ 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li' ].includes(record.tag || '')) {
      // block tags get a blank line after them for readability
      text += '\n\n'
    }
    return text
  }

  // unknown shape
  return ''
}

/**
 * Normalize a license `body` field (string or AST) into clipboard plain text.
 */
export function licenseBodyToPlainText(body: unknown): string {
  // empty body → empty string
  if (!body) return ''
  // already plain
  if (typeof body === 'string') return body
  // AST: walk children (or the node itself) and trim
  const record = body as { children?: unknown }
  return extractLicenseText(record.children || body).trim()
}
