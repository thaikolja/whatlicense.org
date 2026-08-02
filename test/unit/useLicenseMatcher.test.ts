import { describe, expect, it, vi, afterEach } from 'vitest'
import type { License } from '../../app/types'
import { useLicenseMatcher } from '../../app/composables/useLicenseMatcher'
import { FIXTURE_LICENSES, makeLicense } from '../fixtures/licenses'

describe('useLicenseMatcher', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns null when no licenses are loaded', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { matchLicense } = useLicenseMatcher()

    expect(matchLicense([ 'permissive' ])).toBeNull()
    expect(warn).toHaveBeenCalled()
  })

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

  it('prefers AGPL when user wants network copyleft', () => {
    const { allLicenses, matchLicense } = useLicenseMatcher()
    allLicenses.value = FIXTURE_LICENSES

    const match = matchLicense([
      'copyleft',
      'commercial-ok',
      'patent-grant',
      'comprehensive',
      'network-copyleft'
    ])
    expect(match?.spdx).toBe('AGPL-3.0-or-later')
  })

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

  it('treats missing traits as empty and still returns a candidate', () => {
    const { allLicenses, matchLicense } = useLicenseMatcher()
    const emptyTraitsLicense = {
      ...FIXTURE_LICENSES[0],
      spdx:   'EMPTY',
      traits: undefined
    } as unknown as License

    allLicenses.value = [ emptyTraitsLicense ]

    const match = matchLicense([ 'permissive' ])
    expect(match?.spdx).toBe('EMPTY')
  })

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

  it('does not overwrite licenses when default-style fetch returns empty data', async () => {
    // Simulate Content path returning no value via inject
    const { allLicenses, fetchLicenses } = useLicenseMatcher({
      fetchAll: async () => []
    })
    allLicenses.value = FIXTURE_LICENSES
    await fetchLicenses()
    expect(allLicenses.value).toEqual([])
  })
})

