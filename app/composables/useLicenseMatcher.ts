/**
 * Nuxt-facing wrapper: load licenses, then run pure matchLicense scoring.
 *
 * Pure gates/score live in `~/utils/matchLicense` for unit tests without Nuxt.
 */
import { ref } from 'vue'
import type { License, LicenseTrait } from '~/types'
import {
  matchLicense as pureMatch,
  type MatchResult
} from '~/utils/matchLicense'
import { contentPageToLicense } from '~/utils/mapLicense'

/** Optional test hooks so unit tests don’t need Nuxt Content. */
export interface UseLicenseMatcherOptions {
  /** Inject licenses loader (tests / non-Nuxt). Default uses Nuxt Content. */
  fetchAll?: () => Promise<License[]>
}

/**
 * Holds the license catalog and exposes fetch + match helpers.
 */
export function useLicenseMatcher(options: UseLicenseMatcherOptions = {}) {
  // catalog in memory after fetch (empty until fetchLicenses succeeds)
  const allLicenses = ref<License[]>([])

  /**
   * Load all licenses (injected fetcher or Nuxt Content).
   * Call from setup so useAsyncData participates in SSG payload.
   */
  const fetchLicenses = async () => {
    try {
      if (options.fetchAll) {
        // test / custom path — skip Content
        allLicenses.value = await options.fetchAll()
        return
      }
      // stable key → shared between generate + client hydration
      const { data } = await useAsyncData(
        'licenses-catalog',
        () => queryCollection('licenses').all(),
        { default: () => [] }
      )
      if (data.value?.length) {
        // map Content pages into typed License records
        allLicenses.value = data.value.map(page =>
          contentPageToLicense(page as Record<string, unknown>)
        )
      }
    } catch (e) {
      // keep empty catalog; UI can show “could not load”
      console.error('Failed to load licenses', e)
    }
  }

  /**
   * Full match result (best, runners-up, empty reasons, closest).
   */
  const matchResult = (userTags: LicenseTrait[]): MatchResult => {
    if (!allLicenses.value.length) {
      console.warn('Matcher: No licenses loaded to match against.')
      return pureMatch(userTags, [])
    }

    if (import.meta.dev) {
      console.log('Matcher: User selected tags:', userTags)
    }

    const result = pureMatch(userTags, allLicenses.value)

    if (import.meta.dev) {
      console.log(
        'Matcher: Best match:',
        result.license?.spdx,
        'score:',
        result.score,
        'runners-up:',
        result.runnersUp.map(r => r.license.spdx)
      )
    }

    return result
  }

  /**
   * Convenience: just the best license (or null).
   */
  const matchLicense = (userTags: LicenseTrait[]): License | null => {
    return matchResult(userTags).license
  }

  return {
    allLicenses,
    fetchLicenses,
    matchLicense,
    matchResult
  }
}
