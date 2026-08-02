/**
 * Map Nuxt Content license pages into the app {@link License} type.
 */
import type { ConditionItem, License, LicenseTrait } from '~/types'

/** Loose Content page shape we care about. */
export type ContentLicensePage = {
  id?: string
  path?: string
  spdx?: string
  name?: string
  subtitle?: string
  whyThisLicense?: string
  url?: string
  traits?: string[]
  permissions?: ConditionItem[]
  conditions?: ConditionItem[]
  limitations?: ConditionItem[]
  headerStatement?: string
  popularity?: number
  body?: unknown
  [key: string]: unknown
}

/**
 * Cast Content frontmatter into a typed License (body kept as extra field).
 */
export function contentPageToLicense(page: ContentLicensePage): License & { path?: string, body?: unknown } {
  return {
    id:              page.id || page.path || page.spdx || 'unknown',
    spdx:            page.spdx || 'UNKNOWN',
    name:            page.name || page.spdx || 'Unknown license',
    subtitle:        page.subtitle || '',
    whyThisLicense:  page.whyThisLicense || '',
    url:             page.url || '',
    traits:          (page.traits || []) as LicenseTrait[],
    permissions:     page.permissions || [],
    conditions:      page.conditions || [],
    limitations:     page.limitations || [],
    headerStatement: page.headerStatement || '',
    popularity:      page.popularity ?? 0,
    path:            page.path,
    body:            page.body
  }
}
