/**
 * Runners-up, empty reasons, public-domain gate.
 */
import { describe, expect, it } from 'vitest'
import { matchLicense, explainEmptyMatch } from '../../app/utils/matchLicense'
import { FIXTURE_LICENSES, makeLicense } from '../fixtures/licenses'

describe('matchLicense extras', () => {
  it('returns runners-up under the same hard gates', () => {
    const result = matchLicense(
      [ 'permissive', 'commercial-ok', 'no-patent', 'simple', 'no-network' ],
      FIXTURE_LICENSES
    )
    expect(result.license?.spdx).toBe('MIT')
    expect(result.runnersUp.length).toBeGreaterThan(0)
    expect(result.runnersUp[0]!.score).toBeLessThanOrEqual(result.score)
    expect(result.matchReasons.length).toBeGreaterThan(0)
    expect(result.emptyReasons).toEqual([])
  })

  it('weak + network has no hard-gate hit → approximate closest recommendation', () => {
    const result = matchLicense(
      [ 'weak-copyleft', 'commercial-ok', 'patent-grant', 'network-copyleft' ],
      FIXTURE_LICENSES
    )
    // production: always recommend something when catalog is non-empty
    expect(result.license).toBeTruthy()
    expect(result.isApproximate).toBe(true)
    expect(result.emptyReasons.some(r => r.toLowerCase().includes('weak'))).toBe(true)
    expect(result.closest.length).toBeGreaterThan(0)
    // still never invent a perfect hard match that does not exist
    expect(result.license!.traits.includes('network-copyleft') && result.license!.traits.includes('weak-copyleft')).toBe(false)
  })

  it('public-domain tag prefers public-domain licenses', () => {
    const catalog = [
      ...FIXTURE_LICENSES,
      makeLicense({
        spdx:       '0BSD',
        traits:     [ 'public-domain', 'permissive', 'commercial-ok', 'no-patent', 'simple', 'no-network' ],
        popularity: 40
      })
    ]
    const result = matchLicense(
      [ 'permissive', 'commercial-ok', 'no-patent', 'simple', 'public-domain', 'no-network' ],
      catalog
    )
    expect(result.license?.spdx).toBe('0BSD')
  })

  it('explainEmptyMatch covers copyleft + non-commercial', () => {
    const reasons = explainEmptyMatch([ 'copyleft', 'strong-copyleft', 'non-commercial' ])
    expect(reasons.join(' ').toLowerCase()).toMatch(/non-commercial|share-alike|cc-by-nc/)
  })
})
