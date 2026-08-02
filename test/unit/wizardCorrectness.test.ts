/**
 * Three end-to-end checks: walk useWizard like a user, then match
 * collected tags against the real content/licenses catalog.
 *
 * If any of these fail, the wizard is lying about outcomes.
 */
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import type { License, LicenseTrait } from '../../app/types'
import { useWizard } from '../../app/composables/useWizard'
import { matchLicense } from '../../app/utils/matchLicense'

/** Load SPDX + traits + popularity from content frontmatter (Node, no Nuxt). */
function loadLicensesFromContent(): License[] {
  const dir = path.resolve(process.cwd(), 'content/licenses')
  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map((file) => {
      const text = fs.readFileSync(path.join(dir, file), 'utf8')
      const spdx = text.match(/^spdx:\s*(.+)$/m)?.[1]?.trim() || file
      const popularity = Number(text.match(/^popularity:\s*(\d+)/m)?.[1] || 0)
      const traitsRaw = text.match(/^traits:\s*\[([^\]]*)\]/m)?.[1] || ''
      const traits = traitsRaw
        .split(',')
        .map(s => s.trim())
        .filter(Boolean) as LicenseTrait[]
      return {
        id: file,
        spdx,
        name: spdx,
        subtitle: '',
        whyThisLicense: '',
        url: '',
        traits,
        permissions: [],
        conditions: [],
        limitations: [],
        headerStatement: '',
        popularity
      } satisfies License
    })
}

/**
 * Click through the wizard: for each step, select option index, then Next.
 * Returns tags the matcher would see at the result screen.
 */
function playWizard(choices: number[]): LicenseTrait[] {
  const wizard = useWizard({ debugAutoSelect: false })
  wizard.startWizard()

  for (let i = 0; i < choices.length; i++) {
    // always answer the current step (active list may grow after copyleft)
    wizard.currentStep.value = i
    wizard.selectOption(choices[i]!)
    wizard.nextStep()
  }

  expect(wizard.currentScreen.value).toBe('result')
  return wizard.collectedTags.value
}

/** Tags → best SPDX from the real catalog. */
function matchSpdx(tags: LicenseTrait[]): string | null {
  return matchLicense(tags, loadLicensesFromContent()).license?.spdx ?? null
}

describe('wizard correctness (3 path checks)', () => {
  it('1) permissive + commercial + simple + notice → MIT', () => {
    // share=permissive(1), commercial=ok(0), patents=simple(1), freedom=notice(1)
    const tags = playWizard([1, 0, 1, 1])

    expect(tags).toContain('permissive')
    expect(tags).toContain('commercial-ok')
    expect(tags).toContain('no-patent')
    expect(tags).not.toContain('copyleft')
    expect(tags).not.toContain('strong-copyleft')
    expect(tags).not.toContain('network-copyleft')
    expect(tags).not.toContain('public-domain')

    expect(matchSpdx(tags)).toBe('MIT')
  })

  it('2) strong copyleft + patents + network → AGPL-3.0-or-later', () => {
    // share=copyleft(0), commercial=ok(0), patents=grant(0), scope=strong(0), network=yes(0)
    const tags = playWizard([0, 0, 0, 0, 0])

    expect(tags).toContain('copyleft')
    expect(tags).toContain('strong-copyleft')
    expect(tags).toContain('network-copyleft')
    expect(tags).toContain('patent-grant')
    expect(tags).not.toContain('weak-copyleft')
    expect(tags).not.toContain('permissive')

    expect(matchSpdx(tags)).toBe('AGPL-3.0-or-later')
  })

  it('3) weak copyleft + patents → weak family (never GPL/AGPL; network step skipped)', () => {
    // share=copyleft(0), commercial=ok(0), patents=grant(0), scope=weak(1) — no network Q
    const tags = playWizard([ 0, 0, 0, 1 ])

    // weak path must not still look like strong GPL
    expect(tags).toContain('weak-copyleft')
    expect(tags).not.toContain('copyleft')
    expect(tags).not.toContain('strong-copyleft')
    expect(tags).toContain('patent-grant')
    expect(tags).toContain('no-network')
    expect(tags).not.toContain('network-copyleft')

    const spdx = matchSpdx(tags)
    expect(spdx).toBeTruthy()
    expect([ 'MPL-2.0', 'LGPL-3.0-or-later', 'EPL-2.0', 'CDDL-1.0' ]).toContain(spdx)
    expect(spdx).not.toMatch(/^GPL/)
    expect(spdx).not.toMatch(/^AGPL/)
  })
})
