/**
 * Unit: composable wrapper around pure matcher.
 *
 * Casual notes use // ... above important lines in app code;
 * tests stay readable with a file-level JSDoc only where dense.
 */
import { describe, expect, it, vi, afterEach } from 'vitest'
import type { License } from '../../app/types'
import { useLicenseMatcher } from '../../app/composables/useLicenseMatcher'
import { FIXTURE_LICENSES, makeLicense } from '../fixtures/licenses'

// ... test suite for 'useLicenseMatcher'
describe('useLicenseMatcher', () => {
  // ... cleanup after each case
  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ... returns null when no licenses are loaded
  it('returns null when no licenses are loaded', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { matchLicense } = useLicenseMatcher()

    expect(matchLicense([ 'permissive' ])).toBeNull()
    expect(warn).toHaveBeenCalled()
  })

  // ... prefers permissive licenses for permissive user tags
  it('prefers permissive licenses for permissive user tags', () => {
    const { allLicenses, matchLicense } = useLicenseMatcher()
    allLicenses.value = FIXTURE_LICENSES

    const match = matchLicense([
      'permissive',
      'commercial-ok',
      'no-patent',
      'simple',
      'no-network'
    ])
    expect(match?.spdx).toBe('MIT')
  })

  // ... prefers AGPL when user wants network copyleft
  it('prefers AGPL when user wants network copyleft', () => {
    const { allLicenses, matchLicense } = useLicenseMatcher()
    allLicenses.value = FIXTURE_LICENSES

    const match = matchLicense([
      'copyleft',
      'strong-copyleft',
      'commercial-ok',
      'patent-grant',
      'comprehensive',
      'network-copyleft'
    ])
    expect(match?.spdx).toBe('AGPL-3.0-or-later')
  })


  // ... penalizes non-commercial licenses when user wants commercial use
  it('penalizes non-commercial licenses when user wants commercial use', () => {
    const { allLicenses, matchLicense } = useLicenseMatcher()
    allLicenses.value = FIXTURE_LICENSES

    const match = matchLicense([
      'permissive',
      'commercial-ok',
      'no-patent',
      'simple',
      'no-network'
    ])
    expect(match?.spdx).not.toBe('CC-BY-NC-4.0')
  })

  // ... breaks ties using higher popularity
  it('breaks ties using higher popularity', () => {
    const { allLicenses, matchLicense } = useLicenseMatcher()
    allLicenses.value = FIXTURE_LICENSES.filter(
      l => l.spdx === 'MIT' || l.spdx === 'ISC'
    )

    const match = matchLicense([
      'permissive',
      'commercial-ok',
      'no-patent',
      'simple',
      'no-network'
    ])
    expect(match?.spdx).toBe('MIT')
  })

  // ... returns null when the only license fails hard gates
  it('returns null when the only license fails hard gates', () => {
    const { allLicenses, matchLicense } = useLicenseMatcher()
    const emptyTraitsLicense = {
      ...FIXTURE_LICENSES[0],
      spdx:   'EMPTY',
      traits: undefined
    } as unknown as License

    allLicenses.value = [ emptyTraitsLicense ]

    // No traits → not permissive under gates → no match
    expect(matchLicense([ 'permissive' ])).toBeNull()
  })


  // ... prefers Apache when patent grant is requested with permissive tags
  it('prefers Apache when patent grant is requested with permissive tags', () => {
    const { allLicenses, matchLicense } = useLicenseMatcher()
    allLicenses.value = FIXTURE_LICENSES

    const match = matchLicense([
      'permissive',
      'commercial-ok',
      'patent-grant',
      'comprehensive',
      'no-network'
    ])
    expect(match?.spdx).toBe('Apache-2.0')
  })

  // ... loads licenses via injected fetchAll
  it('loads licenses via injected fetchAll', async () => {
    const fetchAll = vi.fn().mockResolvedValue(FIXTURE_LICENSES)
    const { allLicenses, fetchLicenses, matchLicense } = useLicenseMatcher({
      fetchAll
    })

    await fetchLicenses()

    expect(fetchAll).toHaveBeenCalledOnce()
    expect(allLicenses.value).toHaveLength(FIXTURE_LICENSES.length)
    expect(matchLicense([ 'permissive', 'commercial-ok', 'no-patent', 'simple', 'no-network' ])?.spdx).toBe('MIT')
  })

  // ... logs and keeps empty list when fetchAll fails
  it('logs and keeps empty list when fetchAll fails', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { allLicenses, fetchLicenses } = useLicenseMatcher({
      fetchAll: async () => {
        throw new Error('network down')
      }
    })

    await fetchLicenses()

    expect(allLicenses.value).toEqual([])
    expect(error).toHaveBeenCalled()
  })

  // ... keeps lower-popularity license when scores tie and challenger is not more popular
  it('keeps lower-popularity license when scores tie and challenger is not more popular', () => {
    const { allLicenses, matchLicense } = useLicenseMatcher()
    allLicenses.value = [
      makeLicense({
        spdx:       'FIRST',
        traits:     [ 'permissive' ],
        popularity: 10
      }),
      makeLicense({
        spdx:       'SECOND',
        traits:     [ 'permissive' ],
        popularity: 5
      })
    ]

    expect(matchLicense([ 'permissive' ])?.spdx).toBe('FIRST')
  })

  // ... penalizes both directions of trait contradictions
  it('penalizes both directions of trait contradictions', () => {
    const { allLicenses, matchLicense } = useLicenseMatcher()
    allLicenses.value = [
      makeLicense({
        spdx:       'COPYLEFT',
        traits:     [ 'copyleft', 'commercial-ok' ],
        popularity: 10
      }),
      makeLicense({
        spdx:       'PERM',
        traits:     [ 'permissive', 'commercial-ok' ],
        popularity: 10
      })
    ]

    // User wants permissive — copyleft license is penalized
    expect(matchLicense([ 'permissive' ])?.spdx).toBe('PERM')
    // User wants copyleft — permissive license is penalized
    expect(matchLicense([ 'copyleft' ])?.spdx).toBe('COPYLEFT')
  })

  // ... does not overwrite licenses when default-style fetch returns empty data
  it('does not overwrite licenses when default-style fetch returns empty data', async () => {
    // Simulate Content path returning no value via inject
    const { allLicenses, fetchLicenses } = useLicenseMatcher({
      fetchAll: async () => []
    })
    allLicenses.value = FIXTURE_LICENSES
    await fetchLicenses()
    expect(allLicenses.value).toEqual([])
  })

  // ... returns null when hard gates eliminate every license
  it('returns null when hard gates eliminate every license', () => {
    const { allLicenses, matchLicense } = useLicenseMatcher()
    allLicenses.value                   = FIXTURE_LICENSES

    // Weak + network: no fixture has both
    expect(matchLicense([
      'weak-copyleft',
      'commercial-ok',
      'patent-grant',
      'network-copyleft'
    ])).toBeNull()
  })
})


