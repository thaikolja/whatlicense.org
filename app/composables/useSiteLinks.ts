/**
 * Canonical public outbound links for the shell, donate CTAs, and legal pages.
 *
 * Defaults live in `nuxt.config.ts` runtimeConfig; env vars may override.
 * Always prefer this helper over reading `runtimeConfig.public.links` raw so
 * mailto normalization and fallbacks stay consistent.
 */

/** Shape of monetization / social / contact URLs. */
export interface SiteLinks {
  /** PayPal (or similar) donation URL. */
  paypal: string
  /** Public GitHub repository. */
  github: string
  /** X / Twitter profile (may be empty). */
  twitter: string
  /** Full `mailto:…` contact URL. */
  email: string
  /** Optional TermsFeed affiliate (legacy). */
  termsFeed: string
}

/** Production defaults when env vars are missing (SSG / local / tests). */
const DEFAULTS: SiteLinks = {
  paypal:    'https://paypal.me/thaikolja/10',
  github:    'https://github.com/thaikolja/whatlicense.org',
  twitter:   'https://twitter.com/whatlicenseorg',
  email:     'mailto:kolja.nolte@gmail.com',
  termsFeed: 'https://www.termsfeed.com/?ref=whatlicense'
}

/**
 * Ensure contact links are usable as `href` values.
 * Bare addresses become `mailto:`; empty falls back to default.
 */
function normalizeEmail(raw: string | undefined, fallback: string): string {
  // empty or whitespace → default mailto
  const value = (raw ?? '').trim()
  if (!value) return fallback
  // already a mail URL
  if (value.startsWith('mailto:')) return value
  // bare address from env (common misconfig)
  if (value.includes('@') && !value.includes('://')) {
    return `mailto:${value}`
  }
  return value
}

/**
 * Prefer configured URL; fall back when env left the field empty.
 */
function pickUrl(raw: string | undefined, fallback: string): string {
  const value = (raw ?? '').trim()
  return value || fallback
}

/**
 * Resolved site links for any component.
 *
 * @example
 * ```ts
 * const { paypal, email } = useSiteLinks()
 * ```
 */
export function useSiteLinks(): SiteLinks {
  // Nuxt auto-import; may throw outside Nuxt (unit tests inject via nuxt)
  let publicLinks: Partial<SiteLinks> = {}
  try {
    const config = useRuntimeConfig()
    publicLinks = (config.public?.links ?? {}) as Partial<SiteLinks>
  } catch {
    // outside Nuxt — pure defaults
    publicLinks = {}
  }

  return {
    paypal:    pickUrl(publicLinks.paypal, DEFAULTS.paypal),
    github:    pickUrl(publicLinks.github, DEFAULTS.github),
    twitter:   pickUrl(publicLinks.twitter, DEFAULTS.twitter),
    email:     normalizeEmail(publicLinks.email, DEFAULTS.email),
    termsFeed: pickUrl(publicLinks.termsFeed, DEFAULTS.termsFeed)
  }
}
