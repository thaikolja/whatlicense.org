/**
 * Map a license record to the URL slug under /licenses/:slug.
 */

/** Minimal fields used for slug resolution. */
export interface LicenseSlugSource {
  id?: string
  spdx?: string
  /** Nuxt Content path when present (e.g. /licenses/mit). */
  path?: string
}

/**
 * Prefer Content path segment, then id filename, then lowercased SPDX.
 */
export function licenseToSlug(license: LicenseSlugSource): string {
  // Content path: /licenses/mit → mit
  if (license.path) {
    const segment = license.path.split('/').filter(Boolean).pop()
    if (segment) return segment
  }

  // id often looks like licenses/mit.md or mit.md
  if (license.id) {
    const base = license.id
      .replace(/^licenses\//, '')
      .replace(/\.md$/i, '')
    if (base) return base
  }

  // last resort: SPDX lowercased (GPL-3.0-or-later stays readable)
  return (license.spdx || 'unknown').toLowerCase()
}
