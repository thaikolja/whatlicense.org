import { ref, computed }              from 'vue'
import type { License, LicenseTrait } from '~/types'

export function useLicenseMatcher() {
  const allLicenses = ref<License[]>([])

  const fetchLicenses = async () => {
    // using queryCollection from nuxt/content
    try {
      const { data } = await useAsyncData('licenses', () => queryCollection('licenses').all())
      if (data.value) {
        allLicenses.value = data.value as unknown as License[]
      }
    } catch (e) {
      console.error('Failed to load licenses', e)
    }
  }

  const matchLicense = (userTags: LicenseTrait[]): License | null => {
    if (!allLicenses.value.length) return null

    let bestMatch: License | null = null
    let highestScore              = -1

    for (const license of allLicenses.value) {
      const traits = license.traits || []

      // Calculate score based on matching tags
      let score = 0
      for (const tag of userTags) {
        if (traits.includes(tag)) {
          score++
        }
      }

      // Exact or best match ranking. Tie-breaker is popularity.
      if (score > highestScore) {
        highestScore = score
        bestMatch    = license
      } else if (score===highestScore && bestMatch) {
        // Tie breaker: popularity (assuming popularity is stored, higher is better)
        const currentPop = (license as any).popularity || 0
        const bestPop    = (bestMatch as any).popularity || 0
        if (currentPop > bestPop) {
          bestMatch = license
        }
      }
    }

    return bestMatch
  }

  return {
    allLicenses,
    fetchLicenses,
    matchLicense
  }
}
