import { ref } from 'vue'
import type { License, LicenseTrait } from '~/types'

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
      // using queryCollection from nuxt/content
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

    let bestMatch: License | null = null
    let highestScore              = -1

    // Define trait weights if needed, or just count
    // Essential traits that should be prioritized
    const weights: Record<string, number> = {
      'copyleft':         2,
      'permissive':       2,
      'network-copyleft': 2,
      'non-commercial':   3 // Very important differentiator
    }

    for (const license of allLicenses.value) {
      const traits = license.traits || []
      let score = 0

      // We'll use a more advanced scoring:
      // +Weight for matches
      // -Weight for direct contradictions (e.g. user wants copyleft, license is permissive)

      // Calculate score
      for (const tag of userTags) {
        if (traits.includes(tag)) {
          score += weights[tag] || 1
        }
      }

      // Penalize for fundamental mismatches
      const mismatches = [
        [ 'copyleft', 'permissive' ],
        [ 'commercial-ok', 'non-commercial' ],
        [ 'patent-grant', 'no-patent' ],
        [ 'network-copyleft', 'no-network' ]
      ]

      for (const [ t1, t2 ] of mismatches) {
        if (userTags.includes(t1 as any) && traits.includes(t2 as any)) score -= 2
        if (userTags.includes(t2 as any) && traits.includes(t1 as any)) score -= 2
      }

      if (import.meta.dev) {
        console.log(`Matcher: Checking ${license.spdx}, Score: ${score}`)
      }

      if (score > highestScore) {
        highestScore = score
        bestMatch    = license
      } else if (score===highestScore && bestMatch) {
        // Tie breaker: popularity
        if ((license.popularity || 0) > (bestMatch.popularity || 0)) {
          bestMatch = license
        }
      }
    }

    if (import.meta.dev) {
      console.log('Matcher: Best match found:', bestMatch?.spdx)
    }
    return bestMatch
  }

  return {
    allLicenses,
    fetchLicenses,
    matchLicense
  }
}
