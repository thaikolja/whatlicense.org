/**
 * Tiny slug helper for stable DOM ids (icons, aria hooks).
 */

/** Branded string so slugs are not mixed with arbitrary strings by accident. */
export type Slug = string & { readonly __brand: 'Slug' }

/**
 * Lowercase, hyphenated slug from a display name.
 *
 * @example useSlug('E-Mail') → 'e-mail'
 */
export function useSlug(str: string): Slug {
  // trim → lower → non-alnum to hyphen → strip edge hyphens
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') as Slug
}
