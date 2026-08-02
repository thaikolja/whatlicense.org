import type { License } from '../../app/types'

const emptyConditions = [] as const

/** Minimal licenses for matcher / header tests. */
export function makeLicense(
  overrides: Partial<License> & Pick<License, 'spdx' | 'traits'>
): License {
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

export const FIXTURE_LICENSES: License[] = [
  makeLicense({
    spdx:        'MIT',
    traits:      [ 'permissive', 'commercial-ok', 'no-patent', 'simple', 'no-network' ],
    popularity:  100,
    headerStatement: 'Released under the MIT License.\nSee: https://opensource.org/licenses/MIT'
  }),
  makeLicense({
    spdx:       'GPL-3.0-or-later',
    traits:     [ 'copyleft', 'commercial-ok', 'no-patent', 'comprehensive', 'no-network' ],
    popularity: 70
  }),
  makeLicense({
    spdx:       'AGPL-3.0-or-later',
    traits:     [ 'copyleft', 'commercial-ok', 'patent-grant', 'comprehensive', 'network-copyleft' ],
    popularity: 40
  }),
  makeLicense({
    spdx:       'CC-BY-NC-4.0',
    traits:     [ 'permissive', 'non-commercial', 'no-patent', 'simple', 'no-network' ],
    popularity: 20
  }),
  makeLicense({
    spdx:       'Apache-2.0',
    traits:     [ 'permissive', 'commercial-ok', 'patent-grant', 'comprehensive', 'no-network' ],
    popularity: 90
  }),
  // Same traits as MIT but lower popularity — for tie-break tests
  makeLicense({
    spdx:       'ISC',
    traits:     [ 'permissive', 'commercial-ok', 'no-patent', 'simple', 'no-network' ],
    popularity: 50
  })
]
