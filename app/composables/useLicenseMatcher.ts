/**
 * Nuxt-facing wrapper: load licenses, then run pure matchLicense scoring.
 */
import { ref }                       from 'vue'
import type { License, LicenseTrait } from '~/types'
import { matchLicense as pureMatch } from '~/utils/matchLicense'

/** Optional test hooks so unit tests don’t need Nuxt Content. */
export interface UseLicenseMatcherOptions {
  /** Inject licenses loader (tests / non-Nuxt). Default uses Nuxt Content. */
  fetchAll?: () => Promise<License[]>
}

/**
 * Holds the license catalog and exposes fetch + match helpers.
 */
export function useLicenseMatcher(options: UseLicenseMatcherOptions = {}) {
  // catalog in memory after fetch
  const allLicenses = ref<License[]>([])

  /**
   * Load all licenses (injected fetcher or Nuxt Content).
   * Call from setup so useAsyncData participates in SSG payload.
   */
  const fetchLicenses = async () => {
    try {
      if (options.fetchAll) {
        // ... test / custom path
        allLicenses.value = await options.fetchAll()
        return
      }
      // ... stable key → shared between generate + client hydration
      const { data } = await useAsyncData(
          'licenses-catalog',
          () => queryCollection('licenses').all(),
          {
            // ... licenses rarely change per deploy; keep default server/cache behavior
            default: () => []
          }
      )
      if (data.value?.length) {
        // ... Content pages aren’t typed as License — cast is intentional
        allLicenses.value = data.value as unknown as License[]
      }
    } catch (e) {
      // ... keep empty catalog; UI can show “could not load”
      console.error('Failed to load licenses', e)
    }
  }

  /**
   * Score tags against the loaded catalog; null if nothing honest matches.
   */
  const matchLicense = (userTags: LicenseTrait[]): License | null => {
    if (!allLicenses.value.length) {
      // nothing loaded yet (or load failed)
      console.warn('Matcher: No licenses loaded to match against.')
      return null
    }

    if (import.meta.dev) {
      // noisy but handy when tuning traits
      console.log('Matcher: User selected tags:', userTags)
    }

    // pure gates + score live in matchLicense.ts
    const { license, score } = pureMatch(userTags, allLicenses.value)

    if (import.meta.dev) {
      console.log('Matcher: Best match found:', license?.spdx, 'score:', score)
    }

    return license
  }

  // public API
  return {
    allLicenses,
    fetchLicenses,
    matchLicense
  }
}
