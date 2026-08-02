import { ref } from 'vue'
import type { License, LicenseTrait } from '~/types'
import { matchLicense as pureMatch } from '~/utils/matchLicense'

export interface UseLicenseMatcherOptions {
  /** Inject licenses loader (tests / non-Nuxt). Default uses Nuxt Content. */
  fetchAll?: () => Promise<License[]>
}

export function useLicenseMatcher(options: UseLicenseMatcherOptions = {}) {
  const allLicenses = ref<License[]>([])

  const fetchLicenses = async () => {
    try {
      if (options.fetchAll) {
        allLicenses.value = await options.fetchAll()
        return
      }
      const { data } = await useAsyncData('licenses', () => queryCollection('licenses').all())
      if (data.value) {
        allLicenses.value = data.value as unknown as License[]
      }
    } catch (e) {
      console.error('Failed to load licenses', e)
    }
  }

  const matchLicense = (userTags: LicenseTrait[]): License | null => {
    if (!allLicenses.value.length) {
      console.warn('Matcher: No licenses loaded to match against.')
      return null
    }

    if (import.meta.dev) {
      console.log('Matcher: User selected tags:', userTags)
    }

    const { license, score } = pureMatch(userTags, allLicenses.value)

    if (import.meta.dev) {
      console.log('Matcher: Best match found:', license?.spdx, 'score:', score)
    }

    return license
  }

  return {
    allLicenses,
    fetchLicenses,
    matchLicense
  }
}
