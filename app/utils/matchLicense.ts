/**
 * Pure license matching: hard gates + weighted score + popularity tie-break.
 * No Vue / Nuxt here — easy to unit test and reuse from the composable.
 */
import type { License, LicenseTrait } from '~/types'

/** How much each trait is worth when it matches. */
export const TRAIT_WEIGHTS: Readonly<Partial<Record<LicenseTrait, number>>> = {
  // ... family tags dominate the score
  'copyleft':         3,
  'strong-copyleft':  3,
  'weak-copyleft':    3,
  'permissive':       3,
  'network-copyleft': 3,
  // ... non-commercial is rare and decisive
  'non-commercial': 4,
  'commercial-ok':  2,
  'patent-grant':   2,
  'no-patent':      2,
  // ... style tags are softer signals
  'comprehensive': 1,
  'simple':        1,
  'no-network':    1,
  'public-domain': 1
}

/** Trait pairs that should never both “fit” the same pick. */
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

/**
 * Drops duplicate tags so scoring doesn’t double-count.
 */
export function dedupeTraits(tags: readonly LicenseTrait[]): LicenseTrait[] {
  // ... Set keeps order of first occurrence in modern engines
  return [ ...new Set(tags) ]
}

/** Tiny helper: is this tag in the list? */
function has(tags: readonly LicenseTrait[], t: LicenseTrait): boolean {
  return tags.includes(t)
}

/** GPL-style: strong-copyleft flag, or legacy copyleft without weak. */
function isStrongCopyleftLicense(traits: readonly LicenseTrait[]): boolean {
  return has(traits, 'strong-copyleft') || (
      has(traits, 'copyleft') && !has(traits, 'weak-copyleft')
  )
}

/** MPL/LGPL-style: weak only, no strong flag. */
function isWeakCopyleftLicense(traits: readonly LicenseTrait[]): boolean {
  return has(traits, 'weak-copyleft') && !has(traits, 'strong-copyleft')
}

/** Any copyleft flavor at all. */
function isCopyleftFamily(traits: readonly LicenseTrait[]): boolean {
  return (
      has(traits, 'copyleft') ||
      has(traits, 'strong-copyleft') ||
      has(traits, 'weak-copyleft')
  )
}

/** Permissive and not secretly copyleft. */
function isPermissiveLicense(traits: readonly LicenseTrait[]): boolean {
  return has(traits, 'permissive') && !isCopyleftFamily(traits)
}

/**
 * Hard gates: kick out licenses that contradict the user.
 * Empty result means “no honest match” — don’t soft-score the whole catalog.
 */
export function filterLicensesByGates(
    userTags: readonly LicenseTrait[],
    licenses: readonly License[]
): License[] {
  // ... normalize first so gate logic is predictable
  const tags = dedupeTraits(userTags)
  if (!licenses.length) return []

  // ... keep only licenses that survive every constraint
  return licenses.filter((license) => {
    const traits = license.traits || []

    // ... commercial intent
    if (has(tags, 'non-commercial') && !has(traits, 'non-commercial')) {
      return false
    }
    if (has(tags, 'commercial-ok') && has(traits, 'non-commercial')) {
      return false
    }

    // ... sharing philosophy
    if (has(tags, 'permissive') && !isPermissiveLicense(traits)) {
      return false
    }

    if (has(tags, 'weak-copyleft')) {
      // ... user wants file-level / weak copyleft only
      if (!isWeakCopyleftLicense(traits)) return false
    } else if (has(tags, 'strong-copyleft')) {
      // ... user wants project-wide strong copyleft
      if (!isStrongCopyleftLicense(traits)) return false
    } else if (has(tags, 'copyleft')) {
      // ... Q1 copyleft without scope yet — any copyleft family is fine
      if (!isCopyleftFamily(traits)) return false
    }

    // ... network / SaaS
    if (has(tags, 'network-copyleft') && !has(traits, 'network-copyleft')) {
      return false
    }
    if (has(tags, 'no-network') && has(traits, 'network-copyleft') && !has(traits, 'no-network')) {
      // ... AGPL-only network trait → out when user wants standard distribution
      return false
    }

    // ... patents: skip hard reject under non-commercial (CC-BY-NC is no-patent)
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
  // ... normalize user tags first
  const tags   = dedupeTraits(userTags)
  // ... license may be missing traits in bad data
  const traits = license.traits || []
  let score    = 0

  // ... add points for overlapping traits
  for (const tag of tags) {
    if (traits.includes(tag)) {
      // ... unknown tags still count a little
      score += TRAIT_WEIGHTS[tag] ?? 1
    }
  }

  // ... subtract when user wants A and license is B (opposites)
  for (const [ t1, t2 ] of TRAIT_MISMATCHES) {
    if (has(tags, t1) && has(traits, t2)) score -= 3
    if (has(tags, t2) && has(traits, t1)) score -= 3
  }

  return score
}

/** Result of a full match run. */
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
  // ... empty catalog → no match
  if (!licenses.length) {
    return { license: null, score: -Infinity }
  }

  // ... gate first so we never “invent” a contradicted winner
  const candidates = filterLicensesByGates(userTags, licenses)
  if (!candidates.length) {
    // ... honest empty: better than a wrong soft pick
    return { license: null, score: -Infinity }
  }

  let best: License | null = null
  let bestScore            = -Infinity

  // ... score survivors and break ties with popularity
  for (const license of candidates) {
    const score = scoreLicense(userTags, license)
    if (score > bestScore) {
      // ... new leader
      bestScore = score
      best      = license
    } else if (score === bestScore && best) {
      // ... same score → higher popularity wins
      if ((license.popularity || 0) > (best.popularity || 0)) {
        best = license
      }
    }
  }

  return { license: best, score: bestScore }
}
