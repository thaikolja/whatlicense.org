/**
 * Unit: golden matrix — answers must match licenses.
 *
 * Casual notes use //above important lines in app code;
 * tests stay readable with a file-level JSDoc only where dense.
 */
import fs                                                             from 'node:fs'
import path                                                           from 'node:path'
import { describe, expect, it }                                       from 'vitest'
import type { License, LicenseTrait }                                 from '../../app/types'
import { QUIZ_QUESTIONS, getActiveQuestions, collectTagsFromAnswers } from '../../app/data/questions'
import { matchLicense }                                               from '../../app/utils/matchLicense'

/** Parse license traits from content frontmatter (Node, no Nuxt). */
function loadLicensesFromContent(): License[] {
  //real markdown catalog on disk
  const dir = path.resolve(process.cwd(), 'content/licenses')
  return fs.readdirSync(dir)
  //only license pages
  .filter(f => f.endsWith('.md'))
  .map((file) => {
    //crude frontmatter scrape (good enough for traits + popularity)
    const text       = fs.readFileSync(path.join(dir, file), 'utf8')
    const spdx       = text.match(/^spdx:\s*(.+)$/m)?.[1]?.trim() || file
    const popularity = Number(text.match(/^popularity:\s*(\d+)/m)?.[1] || 0)
    const traitsRaw  = text.match(/^traits:\s*\[([^\]]*)\]/m)?.[1] || ''
    const traits     = traitsRaw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean) as LicenseTrait[]
    //stub the rest of License so matchLicense is happy
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
  //walk active questions and fill answers in order
  for (let guard = 0; guard < 10; guard++) {
    const active = getActiveQuestions(QUIZ_QUESTIONS, answers)
    if (answers.length >= active.length) break
    const q      = active[answers.length]
    const choice = optionById[q.id]
    if (choice === undefined) {
      //fail loud if the path map is incomplete
      throw new Error(`Missing answer for question ${q.id}`)
    }
    answers.push(choice)
  }
  //tags from the final branch-aware list
  const active = getActiveQuestions(QUIZ_QUESTIONS, answers)
  return collectTagsFromAnswers(active, answers)
}

/** Run path → tags → matchLicense; return SPDX or null. */
function winner(optionById: Record<string, 0 | 1>): string | null {
  //load real catalog each call (cheap enough for unit tests)
  const licenses = loadLicensesFromContent()
  const tags     = tagsForPath(optionById)
  return matchLicense(tags, licenses).license?.spdx ?? null
}

//test suite for 'wizard answer alignment (golden matrix)'
describe('wizard answer alignment (golden matrix)', () => {
  //permissive + commercial + simple + notice → MIT
  it('permissive + commercial + simple + notice → MIT', () => {
    expect(winner({
      share:      1,
      commercial: 0,
      patents:    1,
      freedom:    1
    })).toBe('MIT')
  })

  //permissive + commercial + patents + notice → Apache-2.0
  it('permissive + commercial + patents + notice → Apache-2.0', () => {
    expect(winner({
      share:      1,
      commercial: 0,
      patents:    0,
      freedom:    1
    })).toBe('Apache-2.0')
  })

  //permissive + commercial + simple + public-domain → 0BSD / CC0 / Unlicense family
  it('permissive + public-domain → public-domain family', () => {
    const spdx = winner({
      share:      1,
      commercial: 0,
      patents:    1,
      freedom:    0
    })
    expect([ '0BSD', 'CC0-1.0', 'Unlicense' ]).toContain(spdx)
  })

  //strong copyleft + commercial + patents + no network → GPL-3.0-or-later
  it('strong copyleft + commercial + patents + no network → GPL-3.0-or-later', () => {
    expect(winner({
      share:      0,
      commercial: 0,
      patents:    0,
      scope:      0,
      network:    1
    })).toBe('GPL-3.0-or-later')
  })

  //strong copyleft + commercial + simple + no network → GPL-2.0-or-later
  it('strong copyleft + commercial + simple + no network → GPL-2.0-or-later', () => {
    expect(winner({
      share:      0,
      commercial: 0,
      patents:    1,
      scope:      0,
      network:    1
    })).toBe('GPL-2.0-or-later')
  })

  //strong copyleft + patents + network → AGPL-3.0-or-later
  it('strong copyleft + patents + network → AGPL-3.0-or-later', () => {
    expect(winner({
      share:      0,
      commercial: 0,
      patents:    0,
      scope:      0,
      network:    0
    })).toBe('AGPL-3.0-or-later')
  })

  //weak copyleft + patents + no network → MPL-2.0 (or other weak+patent)
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

  //weak copyleft + simple + no network → LGPL-2.1-or-later family
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

  //non-commercial → CC-BY-NC-4.0 (freedom step skipped)
  it('non-commercial → CC-BY-NC-4.0', () => {
    expect(winner({
      share:      1,
      commercial: 1,
      patents:    1
    })).toBe('CC-BY-NC-4.0')
  })

  //permissive path never returns AGPL/GPL
  it('permissive path never returns AGPL/GPL', () => {
    for (const patents of [ 0, 1 ] as const) {
      for (const commercial of [ 0, 1 ] as const) {
        const path: Record<string, 0 | 1> = { share: 1, commercial, patents }
        // commercial path includes freedom notice by default
        if (commercial === 0) path.freedom = 1
        const spdx = winner(path)
        expect(spdx).toBeTruthy()
        expect(spdx).not.toMatch(/GPL/)
        expect(spdx).not.toBe('OSL-3.0')
        if (commercial === 1) {
          expect(spdx).toBe('CC-BY-NC-4.0')
        }
      }
    }
  })

  // getActiveQuestions: branch lengths (network only after strong; NC ends at 3)
  it('getActiveQuestions: strong 5; weak 4; permissive commercial 4; patent-grant 3; NC 3', () => {
    expect(getActiveQuestions(QUIZ_QUESTIONS, []).map(q => q.id)).toEqual([
      'share', 'commercial', 'patents'
    ])
    // copyleft alone unlocks scope, not network (needs strong first)
    expect(getActiveQuestions(QUIZ_QUESTIONS, [ 0 ]).map(q => q.id)).toEqual([
      'share', 'commercial', 'patents', 'scope'
    ])
    // strong scope unlocks network
    expect(getActiveQuestions(QUIZ_QUESTIONS, [ 0, 0, 0, 0 ]).map(q => q.id)).toEqual([
      'share', 'commercial', 'patents', 'scope', 'network'
    ])
    // weak scope never unlocks network
    expect(getActiveQuestions(QUIZ_QUESTIONS, [ 0, 0, 0, 1 ]).map(q => q.id)).toEqual([
      'share', 'commercial', 'patents', 'scope'
    ])
    // permissive + commercial-ok unlocks freedom (until patent-grant is chosen)
    expect(getActiveQuestions(QUIZ_QUESTIONS, [ 1, 0 ]).map(q => q.id)).toEqual([
      'share', 'commercial', 'patents', 'freedom'
    ])
    // patent-grant skips freedom (PD licenses lack patents)
    expect(getActiveQuestions(QUIZ_QUESTIONS, [ 1, 0, 0 ]).map(q => q.id)).toEqual([
      'share', 'commercial', 'patents'
    ])
    // non-commercial skips freedom + scope + network
    expect(getActiveQuestions(QUIZ_QUESTIONS, [ 0, 1 ]).map(q => q.id)).toEqual([
      'share', 'commercial', 'patents'
    ])
    expect(getActiveQuestions(QUIZ_QUESTIONS, [ 1, 1 ]).map(q => q.id)).toEqual([
      'share', 'commercial', 'patents'
    ])
  })

  // weak path never asks network — still recommends weak family, never AGPL
  it('weak copyleft never surfaces network question; recommends weak family', () => {
    const tags = tagsForPath({
      share:      0,
      commercial: 0,
      patents:    0,
      scope:      1
    })
    expect(tags).toContain('weak-copyleft')
    expect(tags).toContain('no-network')
    expect(tags).not.toContain('network-copyleft')
    const spdx = winner({
      share:      0,
      commercial: 0,
      patents:    0,
      scope:      1
    })
    expect([ 'MPL-2.0', 'LGPL-3.0-or-later', 'EPL-2.0', 'CDDL-1.0' ]).toContain(spdx)
    expect(spdx).not.toMatch(/^AGPL/)
  })

  // copyleft + non-commercial: scope/network skipped → CC-BY-NC (only NC in catalog)
  it('copyleft + non-commercial → CC-BY-NC-4.0 (scope/network skipped)', () => {
    expect(winner({
      share:      0,
      commercial: 1,
      patents:    0
    })).toBe('CC-BY-NC-4.0')
  })

  // weak path tags drop bare copyleft
  it('weak path tags drop bare copyleft', () => {
    const tags = tagsForPath({
      share:      0,
      commercial: 0,
      patents:    0,
      scope:      1
    })
    expect(tags).toContain('weak-copyleft')
    expect(tags).not.toContain('copyleft')
  })

  // every reachable path always returns a real license (production guarantee)
  it('every complete wizard path returns a non-null recommendation', () => {
    const licenses = loadLicensesFromContent()
    const paths: Record<string, 0 | 1>[] = []

    function walk(answers: number[]) {
      const active = getActiveQuestions(QUIZ_QUESTIONS, answers)
      if (answers.length >= active.length) {
        const map: Record<string, 0 | 1> = {}
        active.forEach((q, i) => {
          map[q.id] = answers[i] as 0 | 1
        })
        paths.push(map)
        return
      }
      walk([ ...answers, 0 ])
      walk([ ...answers, 1 ])
    }
    walk([])

    expect(paths.length).toBeGreaterThan(10)
    for (const pathMap of paths) {
      const tags = tagsForPath(pathMap)
      const result = matchLicense(tags, licenses)
      expect(result.license, JSON.stringify(pathMap)).toBeTruthy()
      expect(result.isApproximate, `approximate for ${JSON.stringify(pathMap)}`).toBe(false)
    }
  })
})

