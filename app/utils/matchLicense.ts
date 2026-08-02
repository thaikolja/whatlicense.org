import type { License, LicenseTrait } from '~/types'

/** Trait weights for soft scoring (after hard gates). */
export const TRAIT_WEIGHTS: Readonly<Partial<Record<LicenseTrait, number>>> = {
  'copyleft':         3,
  'strong-copyleft':  3,
  'weak-copyleft':    3,
  'permissive':       3,
  'network-copyleft': 3,
  'non-commercial':   4,
  'commercial-ok':    2,
  'patent-grant':     2,
  'no-patent':        2,
  'comprehensive':    1,
  'simple':           1,
  'no-network':       1,
  'public-domain':    1
}

/** Pairs of traits that contradict each other. */
export const TRAIT_MISMATCHES: ReadonlyArray<readonly [ LicenseTrait, LicenseTrait ]> = [
  [ 'copyleft', 'permissive' ],
  [ 'strong-copyleft', 'permissive' ],
  [ 'weak-copyleft', 'permissive' ],
  [ 'strong-copyleft', 'weak-copyleft' ],
  [ 'copyleft', 'weak-copyleft' ],
  [ 'commercial-ok', 'non-commercial' ],
  [ 'patent-grant', 'no-patent' ],
  [ 'network-copyleft', 'no-network' ]
]

export function dedupeTraits(tags: readonly LicenseTrait[]): LicenseTrait[] {
  return [ ...new Set(tags) ]
}

function has(tags: readonly LicenseTrait[], t: LicenseTrait): boolean {
  return tags.includes(t)
}

function isStrongCopyleftLicense(traits: readonly LicenseTrait[]): boolean {
  return has(traits, 'strong-copyleft') || (
      has(traits, 'copyleft') && !has(traits, 'weak-copyleft')
  )
}

function isWeakCopyleftLicense(traits: readonly LicenseTrait[]): boolean {
  return has(traits, 'weak-copyleft') && !has(traits, 'strong-copyleft')
}

function isCopyleftFamily(traits: readonly LicenseTrait[]): boolean {
  return (
      has(traits, 'copyleft') ||
      has(traits, 'strong-copyleft') ||
      has(traits, 'weak-copyleft')
  )
}

function isPermissiveLicense(traits: readonly LicenseTrait[]): boolean {
  return has(traits, 'permissive') && !isCopyleftFamily(traits)
}

/**
 * Hard gates: drop licenses that fundamentally contradict the user's answers.
 * Returns an empty array when nothing survives — callers must not invent a match
 * by soft-scoring the full catalog (that reintroduces contradicted families).
 */
export function filterLicensesByGates(
    userTags: readonly LicenseTrait[],
    licenses: readonly License[]
): License[] {
  const tags = dedupeTraits(userTags)
  if (!licenses.length) return []

  return licenses.filter((license) => {
    const traits = license.traits || []

    // Commercial intent
    if (has(tags, 'non-commercial') && !has(traits, 'non-commercial')) {
      return false
    }
    if (has(tags, 'commercial-ok') && has(traits, 'non-commercial')) {
      return false
    }

    // Sharing philosophy
    if (has(tags, 'permissive') && !isPermissiveLicense(traits)) {
      return false
    }

    if (has(tags, 'weak-copyleft')) {
      if (!isWeakCopyleftLicense(traits)) return false
    } else if (has(tags, 'strong-copyleft')) {
      if (!isStrongCopyleftLicense(traits)) return false
    } else if (has(tags, 'copyleft')) {
      // Q1 copyleft without scope yet — any copyleft family
      if (!isCopyleftFamily(traits)) return false
    }

    // Network / SaaS
    if (has(tags, 'network-copyleft') && !has(traits, 'network-copyleft')) {
      return false
    }
    if (has(tags, 'no-network') && has(traits, 'network-copyleft') && !has(traits, 'no-network')) {
      // AGPL-style only network-copyleft → exclude when user wants standard distribution
      return false
    }

    // Patents: hard-filter only when commercial intent is not the sole niche constraint.
    // Our only non-commercial license (CC-BY-NC) is no-patent; prefer matching NC over null.
    if (
        has(tags, 'patent-grant') &&
        has(traits, 'no-patent') &&
        !has(traits, 'patent-grant') &&
        !has(tags, 'non-commercial')
    ) {
      return false
    }

    return true
  })
}

/**
 * Soft score for one license against user tags (higher is better).
 */
export function scoreLicense(
    userTags: readonly LicenseTrait[],
    license: Pick<License, 'traits'>
): number {
  const tags   = dedupeTraits(userTags)
  const traits = license.traits || []
  let score    = 0

  for (const tag of tags) {
    if (traits.includes(tag)) {
      score += TRAIT_WEIGHTS[tag] ?? 1
    }
  }

  for (const [ t1, t2 ] of TRAIT_MISMATCHES) {
    if (has(tags, t1) && has(traits, t2)) score -= 3
    if (has(tags, t2) && has(traits, t1)) score -= 3
  }

  return score
}

export interface MatchResult {
  license: License | null
  score: number
}

/**
 * Pick the best license for the given user tags.
 */
export function matchLicense(
    userTags: readonly LicenseTrait[],
    licenses: readonly License[]
): MatchResult {
  if (!licenses.length) {
    return { license: null, score: -Infinity }
  }

  const candidates = filterLicensesByGates(userTags, licenses)
  if (!candidates.length) {
    return { license: null, score: -Infinity }
  }

  let best: License | null = null
  let bestScore            = -Infinity

  for (const license of candidates) {
    const score = scoreLicense(userTags, license)
    if (score > bestScore) {
      bestScore = score
      best      = license
    } else if (score === bestScore && best) {
      if ((license.popularity || 0) > (best.popularity || 0)) {
        best = license
      }
    }
  }

  return { license: best, score: bestScore }
}
