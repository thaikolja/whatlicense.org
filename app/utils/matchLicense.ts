/**
 * Pure license matching: hard gates + weighted score + popularity tie-break.
 * No Vue / Nuxt — unit-testable and reused by the composable + simulate script.
 */
import type { License, LicenseTrait } from '~/types'

/** How much each trait is worth when it matches. */
export const TRAIT_WEIGHTS: Readonly<Partial<Record<LicenseTrait, number>>> = {
  // family tags dominate the score
  'copyleft':         3,
  'strong-copyleft':  3,
  'weak-copyleft':    3,
  'permissive':       3,
  'network-copyleft': 3,
  // rare / decisive
  'non-commercial':   4,
  'public-domain':    4,
  'commercial-ok':    2,
  'patent-grant':     2,
  'no-patent':        2,
  // softer style signals
  'comprehensive':    1,
  'simple':           1,
  'no-network':       1
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

/** Human labels for “why this match” bullets. */
export const TRAIT_LABELS: Readonly<Partial<Record<LicenseTrait, string>>> = {
  'copyleft':         'Share-alike / copyleft',
  'strong-copyleft':  'Strong (project-wide) copyleft',
  'weak-copyleft':    'Weak / file-level copyleft',
  'permissive':       'Permissive reuse',
  'network-copyleft': 'Network / SaaS copyleft (AGPL-style)',
  'no-network':       'Standard distribution-only copyleft',
  'commercial-ok':    'Commercial use allowed',
  'non-commercial':   'Non-commercial only',
  'patent-grant':     'Explicit patent grant',
  'no-patent':        'No patent grant language (simpler text)',
  'simple':           'Short / simple license text',
  'comprehensive':    'More comprehensive legal text',
  'public-domain':    'Public-domain style dedication'
}

/**
 * Drops duplicate tags so scoring doesn’t double-count.
 */
export function dedupeTraits(tags: readonly LicenseTrait[]): LicenseTrait[] {
  return [ ...new Set(tags) ]
}

/** Tiny helper: is this tag in the list? */
function has(tags: readonly LicenseTrait[], t: LicenseTrait): boolean {
  return tags.includes(t)
}

/** GPL-style: strong-copyleft flag, or legacy copyleft without weak. */
export function isStrongCopyleftLicense(traits: readonly LicenseTrait[]): boolean {
  return has(traits, 'strong-copyleft') || (
    has(traits, 'copyleft') && !has(traits, 'weak-copyleft')
  )
}

/** MPL/LGPL-style: weak only, no strong flag. */
export function isWeakCopyleftLicense(traits: readonly LicenseTrait[]): boolean {
  return has(traits, 'weak-copyleft') && !has(traits, 'strong-copyleft')
}

/** Any copyleft flavor at all. */
export function isCopyleftFamily(traits: readonly LicenseTrait[]): boolean {
  return (
    has(traits, 'copyleft') ||
    has(traits, 'strong-copyleft') ||
    has(traits, 'weak-copyleft')
  )
}

/** Permissive and not secretly copyleft. */
export function isPermissiveLicense(traits: readonly LicenseTrait[]): boolean {
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
  const tags = dedupeTraits(userTags)
  if (!licenses.length) return []

  return licenses.filter((license) => {
    const traits = license.traits || []

    // commercial intent
    if (has(tags, 'non-commercial') && !has(traits, 'non-commercial')) {
      return false
    }
    if (has(tags, 'commercial-ok') && has(traits, 'non-commercial')) {
      return false
    }

    // sharing philosophy
    if (has(tags, 'permissive') && !isPermissiveLicense(traits)) {
      return false
    }

    if (has(tags, 'weak-copyleft')) {
      if (!isWeakCopyleftLicense(traits)) return false
    } else if (has(tags, 'strong-copyleft')) {
      if (!isStrongCopyleftLicense(traits)) return false
    } else if (has(tags, 'copyleft')) {
      if (!isCopyleftFamily(traits)) return false
    }

    // public-domain style (0BSD / CC0 / Unlicense)
    if (has(tags, 'public-domain') && !has(traits, 'public-domain')) {
      return false
    }

    // network / SaaS
    if (has(tags, 'network-copyleft') && !has(traits, 'network-copyleft')) {
      return false
    }
    if (has(tags, 'no-network') && has(traits, 'network-copyleft') && !has(traits, 'no-network')) {
      return false
    }

    // patents: skip hard reject under non-commercial (CC-BY-NC is no-patent)
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
  const tags = dedupeTraits(userTags)
  const traits = license.traits || []
  let score = 0

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

/** One ranked candidate (best or runner-up). */
export interface RankedLicense {
  license: License
  score: number
}

/** Result of a full match run (best + context for UI). */
export interface MatchResult {
  /**
   * Best recommendation — always set when the catalog is non-empty.
   * Prefer gated winners; otherwise closest soft match (see `isApproximate`).
   */
  license: License | null
  /** Score of the best match (−Infinity if catalog empty). */
  score: number
  /** Next-best matches (gated, or remaining closest when approximate). */
  runnersUp: RankedLicense[]
  /** Why this license fits (trait bullets + any compromise notes). */
  matchReasons: string[]
  /** Why hard gates failed (still shown when we soft-fallback). */
  emptyReasons: string[]
  /** Soft suggestions list (same as runners when approximate). */
  closest: RankedLicense[]
  /**
   * True when no license passed hard gates and we recommended the closest fit.
   * UI should label this as a best-available compromise.
   */
  isApproximate: boolean
}

/**
 * Rank all licenses that pass gates (score desc, popularity desc).
 */
export function rankLicenses(
  userTags: readonly LicenseTrait[],
  licenses: readonly License[]
): RankedLicense[] {
  const candidates = filterLicensesByGates(userTags, licenses)
  return candidates
    .map(license => ({
      license,
      score: scoreLicense(userTags, license)
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return (b.license.popularity || 0) - (a.license.popularity || 0)
    })
}

/**
 * Soft rank without hard gates — only for “closest imperfect” UI when empty.
 */
export function rankClosest(
  userTags: readonly LicenseTrait[],
  licenses: readonly License[],
  limit = 3
): RankedLicense[] {
  return [ ...licenses ]
    .map(license => ({
      license,
      score: scoreLicense(userTags, license)
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return (b.license.popularity || 0) - (a.license.popularity || 0)
    })
    .slice(0, limit)
}

/**
 * Plain-English bullets for why a license matches user tags.
 */
export function explainMatch(
  userTags: readonly LicenseTrait[],
  license: Pick<License, 'traits' | 'spdx' | 'name'>
): string[] {
  const tags = dedupeTraits(userTags)
  const traits = license.traits || []
  const reasons: string[] = []

  for (const tag of tags) {
    if (traits.includes(tag) && TRAIT_LABELS[tag]) {
      reasons.push(TRAIT_LABELS[tag]!)
    }
  }

  if (!reasons.length) {
    reasons.push(`Best overall fit among licenses that pass hard constraints (${license.spdx}).`)
  }

  return reasons
}

/**
 * Why no license survived the gates (honest empty).
 */
export function explainEmptyMatch(userTags: readonly LicenseTrait[]): string[] {
  const tags = dedupeTraits(userTags)
  const reasons: string[] = []

  if (has(tags, 'weak-copyleft') && has(tags, 'network-copyleft')) {
    reasons.push(
      'No license in our catalog is both weak/file-level copyleft and network/SaaS copyleft.'
    )
    reasons.push(
      'Closest ideas: AGPL (strong + network) or MPL/LGPL (weak, distribution-only).'
    )
  }

  if (has(tags, 'copyleft') || has(tags, 'strong-copyleft') || has(tags, 'weak-copyleft')) {
    if (has(tags, 'non-commercial')) {
      reasons.push(
        'We only list one non-commercial license (CC-BY-NC-4.0), and it is not share-alike copyleft.'
      )
      reasons.push(
        'Closest ideas: CC-BY-NC for non-commercial, or GPL/AGPL if you can allow commercial use.'
      )
    }
  }

  if (has(tags, 'public-domain') && has(tags, 'patent-grant')) {
    reasons.push(
      'Public-domain style licenses in our set do not include patent grants.'
    )
  }

  if (!reasons.length) {
    reasons.push(
      'No license in the catalog satisfies every hard constraint from your answers.'
    )
    reasons.push(
      'Try changing share-alike vs permissive, commercial use, patents, scope, or network options.'
    )
  }

  return reasons
}

/**
 * Pick the best license for the given user tags.
 * With a non-empty catalog this **always** returns a license (gated or approximate).
 */
export function matchLicense(
  userTags: readonly LicenseTrait[],
  licenses: readonly License[],
  runnersUpCount = 3
): MatchResult {
  if (!licenses.length) {
    return {
      license:       null,
      score:         -Infinity,
      runnersUp:     [],
      matchReasons:  [],
      emptyReasons:  [ 'License catalog is empty or failed to load.' ],
      closest:       [],
      isApproximate: false
    }
  }

  // prefer honest gated winners
  const ranked = rankLicenses(userTags, licenses)

  if (!ranked.length) {
    // production fallback: never leave the user without a recommendation
    const closest = rankClosest(userTags, licenses, runnersUpCount + 1)
    const best = closest[0]!
    const emptyReasons = explainEmptyMatch(userTags)
    return {
      license:   best.license,
      score:     best.score,
      runnersUp: closest.slice(1, runnersUpCount + 1),
      matchReasons: [
        ...emptyReasons,
        `Best available recommendation: ${best.license.spdx} (closest fit, not a perfect hard-gate match).`,
        ...explainMatch(userTags, best.license)
      ],
      emptyReasons,
      closest:       closest.slice(0, runnersUpCount),
      isApproximate: true
    }
  }

  const [ best, ...rest ] = ranked
  return {
    license:       best!.license,
    score:         best!.score,
    runnersUp:     rest.slice(0, runnersUpCount),
    matchReasons:  explainMatch(userTags, best!.license),
    emptyReasons:  [],
    closest:       [],
    isApproximate: false
  }
}
