import fs                                                             from 'node:fs'
import path                                                           from 'node:path'
import { describe, expect, it }                                       from 'vitest'
import type { License, LicenseTrait }                                 from '../../app/types'
import { QUIZ_QUESTIONS, getActiveQuestions, collectTagsFromAnswers } from '../../app/data/questions'
import { matchLicense }                                               from '../../app/utils/matchLicense'

/** Parse license traits from content frontmatter (Node, no Nuxt). */
function loadLicensesFromContent(): License[] {
  const dir = path.resolve(process.cwd(), 'content/licenses')
  return fs.readdirSync(dir)
  .filter(f => f.endsWith('.md'))
  .map((file) => {
    const text       = fs.readFileSync(path.join(dir, file), 'utf8')
    const spdx       = text.match(/^spdx:\s*(.+)$/m)?.[1]?.trim() || file
    const popularity = Number(text.match(/^popularity:\s*(\d+)/m)?.[1] || 0)
    const traitsRaw  = text.match(/^traits:\s*\[([^\]]*)\]/m)?.[1] || ''
    const traits     = traitsRaw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean) as LicenseTrait[]
    return {
      id:              file,
      spdx,
      name:            spdx,
      subtitle:        '',
      whyThisLicense:  '',
      url:             '',
      traits,
      permissions:     [],
      conditions:      [],
      limitations:     [],
      headerStatement: '',
      popularity
    } satisfies License
  })
}

/**
 * Simulate answering option indices for a path.
 * `optionById` maps question id → 0|1. Scope/network only apply when share=copyleft.
 */
function tagsForPath(optionById: Record<string, 0 | 1>): LicenseTrait[] {
  const answers: number[] = []
  // Build answers by walking active questions
  for (let guard = 0; guard < 10; guard++) {
    const active = getActiveQuestions(QUIZ_QUESTIONS, answers)
    if (answers.length >= active.length) break
    const q      = active[answers.length]
    const choice = optionById[q.id]
    if (choice === undefined) {
      throw new Error(`Missing answer for question ${q.id}`)
    }
    answers.push(choice)
  }
  const active = getActiveQuestions(QUIZ_QUESTIONS, answers)
  return collectTagsFromAnswers(active, answers)
}

function winner(optionById: Record<string, 0 | 1>): string | null {
  const licenses = loadLicensesFromContent()
  const tags     = tagsForPath(optionById)
  return matchLicense(tags, licenses).license?.spdx ?? null
}

describe('wizard answer alignment (golden matrix)', () => {
  it('permissive + commercial + simple → MIT', () => {
    expect(winner({
      share:      1,
      commercial: 0,
      patents:    1
    })).toBe('MIT')
  })

  it('permissive + commercial + patents → Apache-2.0', () => {
    expect(winner({
      share:      1,
      commercial: 0,
      patents:    0
    })).toBe('Apache-2.0')
  })

  it('strong copyleft + commercial + patents + no network → GPL-3.0-or-later', () => {
    expect(winner({
      share:      0,
      commercial: 0,
      patents:    0,
      scope:      0,
      network:    1
    })).toBe('GPL-3.0-or-later')
  })

  it('strong copyleft + commercial + simple + no network → GPL-2.0-or-later', () => {
    expect(winner({
      share:      0,
      commercial: 0,
      patents:    1,
      scope:      0,
      network:    1
    })).toBe('GPL-2.0-or-later')
  })

  it('strong copyleft + patents + network → AGPL-3.0-or-later', () => {
    expect(winner({
      share:      0,
      commercial: 0,
      patents:    0,
      scope:      0,
      network:    0
    })).toBe('AGPL-3.0-or-later')
  })

  it('weak copyleft + patents + no network → MPL-2.0 (or other weak+patent)', () => {
    const spdx = winner({
      share:      0,
      commercial: 0,
      patents:    0,
      scope:      1,
      network:    1
    })
    expect([ 'MPL-2.0', 'LGPL-3.0-or-later', 'EPL-2.0', 'CDDL-1.0' ]).toContain(spdx)
  })

  it('weak copyleft + simple + no network → LGPL-2.1-or-later family', () => {
    const spdx = winner({
      share:      0,
      commercial: 0,
      patents:    1,
      scope:      1,
      network:    1
    })
    expect([ 'LGPL-2.1-or-later', 'MPL-2.0', 'MS-RL' ]).toContain(spdx)
    // Must not be strong GPL
    expect(spdx).not.toMatch(/^GPL/)
    expect(spdx).not.toMatch(/^AGPL/)
  })

  it('non-commercial → CC-BY-NC-4.0', () => {
    expect(winner({
      share:      1,
      commercial: 1,
      patents:    1
    })).toBe('CC-BY-NC-4.0')
  })

  it('permissive path never returns AGPL/GPL', () => {
    for (const patents of [ 0, 1 ] as const) {
      for (const commercial of [ 0, 1 ] as const) {
        const spdx = winner({ share: 1, commercial, patents })
        expect(spdx).toBeTruthy()
        expect(spdx).not.toMatch(/GPL/)
        expect(spdx).not.toBe('OSL-3.0')
        if (commercial === 1) {
          expect(spdx).toBe('CC-BY-NC-4.0')
        }
      }
    }
  })


  it('getActiveQuestions: permissive has 3 steps; copyleft has 5', () => {
    expect(getActiveQuestions(QUIZ_QUESTIONS, []).map(q => q.id)).toEqual([
      'share', 'commercial', 'patents'
    ])
    // After answering copyleft on share
    expect(getActiveQuestions(QUIZ_QUESTIONS, [ 0 ]).map(q => q.id)).toEqual([
      'share', 'commercial', 'patents', 'scope', 'network'
    ])
    // After answering permissive on share
    expect(getActiveQuestions(QUIZ_QUESTIONS, [ 1 ]).map(q => q.id)).toEqual([
      'share', 'commercial', 'patents'
    ])
  })

  it('weak copyleft + network has no catalog match (never invent AGPL)', () => {
    const spdx = winner({
      share:      0,
      commercial: 0,
      patents:    0,
      scope:      1, // weak
      network:    0  // network-copyleft
    })
    expect(spdx).toBeNull()
  })

  it('copyleft + non-commercial has no catalog match (never invent GPL)', () => {
    const spdx = winner({
      share:      0,
      commercial: 1, // non-commercial
      patents:    0,
      scope:      0,
      network:    1
    })
    expect(spdx).toBeNull()
  })


  it('weak path tags drop bare copyleft', () => {
    const tags = tagsForPath({
      share:      0,
      commercial: 0,
      patents:    0,
      scope:      1,
      network:    1
    })
    expect(tags).toContain('weak-copyleft')
    expect(tags).not.toContain('copyleft')
  })
})

