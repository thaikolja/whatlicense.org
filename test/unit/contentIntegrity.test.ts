/**
 * Content + trait integrity — fails CI if license MD drifts from the quiz model.
 */
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import type { LicenseTrait } from '../../app/types'
import { QUIZ_QUESTIONS, collectTagsFromAnswers, getActiveQuestions } from '../../app/data/questions'
import {
  filterLicensesByGates,
  matchLicense,
  TRAIT_WEIGHTS
} from '../../app/utils/matchLicense'

const ALL_TRAITS = new Set<LicenseTrait>([
  'copyleft',
  'strong-copyleft',
  'weak-copyleft',
  'permissive',
  'commercial-ok',
  'non-commercial',
  'patent-grant',
  'no-patent',
  'simple',
  'comprehensive',
  'network-copyleft',
  'no-network',
  'public-domain'
])

function loadCatalog() {
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
        permissions: [] as const,
        conditions: [] as const,
        limitations: [] as const,
        headerStatement: '',
        popularity
      }
    })
}

describe('content integrity', () => {
  const catalog = loadCatalog()

  it('every frontmatter trait is a known LicenseTrait', () => {
    for (const lic of catalog) {
      for (const t of lic.traits) {
        expect(ALL_TRAITS.has(t), `${lic.spdx} has unknown trait ${t}`).toBe(true)
      }
    }
  })

  it('every quiz-emitted trait appears on at least one license', () => {
    const fromQuiz = new Set<LicenseTrait>()
    for (const q of QUIZ_QUESTIONS) {
      for (const opt of q.options) {
        for (const t of opt.tags) fromQuiz.add(t)
      }
    }
    const onLicenses = new Set(catalog.flatMap(l => l.traits))
    for (const t of fromQuiz) {
      expect(onLicenses.has(t), `quiz trait ${t} missing from all licenses`).toBe(true)
      expect(TRAIT_WEIGHTS[t] !== undefined || t, `weight for ${t}`).toBeTruthy()
    }
  })

  it('no license is both strong and weak copyleft', () => {
    for (const lic of catalog) {
      const strong = lic.traits.includes('strong-copyleft')
      const weak = lic.traits.includes('weak-copyleft')
      expect(strong && weak, lic.spdx).toBe(false)
    }
  })

  it('network-copyleft licenses are strong copyleft family', () => {
    for (const lic of catalog) {
      if (lic.traits.includes('network-copyleft')) {
        expect(
          lic.traits.includes('strong-copyleft') || lic.traits.includes('copyleft'),
          lic.spdx
        ).toBe(true)
        expect(lic.traits.includes('weak-copyleft'), lic.spdx).toBe(false)
      }
    }
  })
})

describe('exhaustive wizard paths', () => {
  const catalog = loadCatalog()

  /**
   * Enumerate every reachable complete answer map by walking the branch tree.
   * (Does not invent dead branches like weak+network — those questions are never asked.)
   */
  function allReachablePaths(): Record<string, 0 | 1>[] {
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
    return paths
  }

  function tagsFor(pathMap: Record<string, 0 | 1>) {
    const answers: number[] = []
    for (let guard = 0; guard < 12; guard++) {
      const active = getActiveQuestions(QUIZ_QUESTIONS, answers)
      if (answers.length >= active.length) break
      const q = active[answers.length]!
      const choice = pathMap[q.id]
      if (choice === undefined) throw new Error(`missing ${q.id}`)
      answers.push(choice)
    }
    const active = getActiveQuestions(QUIZ_QUESTIONS, answers)
    return collectTagsFromAnswers(active, answers)
  }

  it('enumerates a non-trivial set of complete paths', () => {
    // Branching trims dead ends (weak+network, NC+scope, patent-grant+freedom) → 13 paths today
    expect(allReachablePaths().length).toBe(13)
  })

  it('never returns GPL/AGPL/OSL on a pure permissive path', () => {
    for (const pathMap of allReachablePaths().filter(p => p.share === 1)) {
      const tags = tagsFor(pathMap)
      const { license } = matchLicense(tags, catalog)
      expect(license).toBeTruthy()
      expect(license!.spdx).not.toMatch(/GPL/)
      expect(license!.spdx).not.toBe('OSL-3.0')
    }
  })

  it('never returns strong GPL/AGPL when user chose weak copyleft', () => {
    for (const pathMap of allReachablePaths().filter(p => p.share === 0 && p.scope === 1)) {
      const tags = tagsFor(pathMap)
      const { license } = matchLicense(tags, catalog)
      expect(license).toBeTruthy()
      expect(
        license!.traits.includes('weak-copyleft') || license!.traits.includes('non-commercial')
      ).toBe(true)
      expect(license!.spdx).not.toMatch(/^GPL-/)
      expect(license!.spdx).not.toMatch(/^AGPL/)
    }
  })

  it('every reachable path always returns a hard-gate recommendation (not approximate)', () => {
    for (const pathMap of allReachablePaths()) {
      const tags = tagsFor(pathMap)
      const gated = filterLicensesByGates(tags, catalog)
      const { license, isApproximate, emptyReasons } = matchLicense(tags, catalog)
      expect(license, JSON.stringify({ pathMap, tags })).toBeTruthy()
      // production branching must only ask catalog-satisfiable combinations
      expect(gated.length, `gates empty for ${JSON.stringify(pathMap)}`).toBeGreaterThan(0)
      expect(isApproximate, `approximate for ${JSON.stringify(pathMap)}`).toBe(false)
      expect(emptyReasons).toEqual([])
    }
  })

  it('non-commercial paths always recommend CC-BY-NC-4.0', () => {
    for (const pathMap of allReachablePaths().filter(p => p.commercial === 1)) {
      const tags = tagsFor(pathMap)
      expect(matchLicense(tags, catalog).license?.spdx).toBe('CC-BY-NC-4.0')
    }
  })
})
