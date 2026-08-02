/**
 * Shared license fixtures for matcher / header unit tests.
 */
import type { License } from '../../app/types'

// ... empty condition lists reused by makeLicense defaults
const emptyConditions = [] as const

/**
 * Build a minimal {@link License} with sensible defaults + overrides.
 * You must pass at least `spdx` and `traits`.
 */
export function makeLicense(
  overrides: Partial<License> & Pick<License, 'spdx' | 'traits'>
): License {
  // ... fill required fields, then let overrides win
  return {
    id:              `licenses/${overrides.spdx.toLowerCase()}`,
    name:            overrides.spdx,
    subtitle:        '',
    whyThisLicense:  '',
    url:             `https://example.com/${overrides.spdx}`,
    permissions:     emptyConditions,
    conditions:      emptyConditions,
    limitations:     emptyConditions,
    headerStatement: `Released under ${overrides.spdx}.`,
    popularity:      0,
    ...overrides
  }
}

/** Catalog slice used by matcher unit tests (covers main trait combos). */
export const FIXTURE_LICENSES: License[] = [
  // ... classic permissive simple
  makeLicense({
    spdx:        'MIT',
    traits:      [ 'permissive', 'commercial-ok', 'no-patent', 'simple', 'no-network' ],
    popularity:  100,
    headerStatement: 'Released under the MIT License.\nSee: https://opensource.org/licenses/MIT'
  }),
  // ... strong copyleft + patents, no network
  makeLicense({
    spdx:       'GPL-3.0-or-later',
    traits:     [ 'copyleft', 'strong-copyleft', 'commercial-ok', 'patent-grant', 'comprehensive', 'no-network' ],
    popularity: 95
  }),
  // ... strong + network (AGPL)
  makeLicense({
    spdx:   'AGPL-3.0-or-later',
    traits: [ 'copyleft', 'strong-copyleft', 'commercial-ok', 'patent-grant', 'comprehensive', 'network-copyleft' ],
    popularity: 70
  }),
  // ... weak / file-level copyleft
  makeLicense({
    spdx:       'MPL-2.0',
    traits:     [ 'weak-copyleft', 'commercial-ok', 'patent-grant', 'comprehensive', 'no-network' ],
    popularity: 75
  }),
  // ... non-commercial (CC)
  makeLicense({
    spdx:       'CC-BY-NC-4.0',
    traits:     [ 'permissive', 'non-commercial', 'no-patent', 'simple', 'no-network' ],
    popularity: 20
  }),
  // ... permissive + patent grant
  makeLicense({
    spdx:       'Apache-2.0',
    traits:     [ 'permissive', 'commercial-ok', 'patent-grant', 'comprehensive', 'no-network' ],
    popularity: 90
  }),
  // ... same traits as MIT but lower popularity — for tie-break tests
  makeLicense({
    spdx:       'ISC',
    traits:     [ 'permissive', 'commercial-ok', 'no-patent', 'simple', 'no-network' ],
    popularity: 50
  })
]
