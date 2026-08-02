#!/usr/bin/env bun
/**
 * Enumerate every reachable wizard path, match against content/licenses,
 * and store results in a SQLite DB for inspection / regression.
 *
 *   bun scripts/wizard-path-matrix.mjs
 *   bun scripts/wizard-path-matrix.mjs --db /tmp/wizard-paths.sqlite
 *
 * Exit 1 if any path is approximate or has no recommendation.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Database } from 'bun:sqlite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// Dynamic import of TS modules via Bun
const { QUIZ_QUESTIONS, getActiveQuestions, collectTagsFromAnswers } = await import(
  path.join(root, 'app/data/questions.ts')
)
const { matchLicense } = await import(path.join(root, 'app/utils/matchLicense.ts'))

function loadCatalog() {
  const dir = path.join(root, 'content/licenses')
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
        .filter(Boolean)
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
      }
    })
}

function allReachablePaths() {
  const paths = []
  function walk(answers) {
    const active = getActiveQuestions(QUIZ_QUESTIONS, answers)
    if (answers.length >= active.length) {
      const map = {}
      active.forEach((q, i) => {
        map[q.id] = answers[i]
      })
      paths.push({ answers: [ ...answers ], map, ids: active.map(q => q.id) })
      return
    }
    walk([ ...answers, 0 ])
    walk([ ...answers, 1 ])
  }
  walk([])
  return paths
}

const dbArg = process.argv.indexOf('--db')
const dbPath =
  dbArg >= 0 && process.argv[dbArg + 1]
    ? process.argv[dbArg + 1]
    : path.join(root, 'tmp/wizard-path-matrix.sqlite')

fs.mkdirSync(path.dirname(dbPath), { recursive: true })
if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath)

const catalog = loadCatalog()
const paths = allReachablePaths()
const db = new Database(dbPath)

db.run(`
  CREATE TABLE paths (
    id INTEGER PRIMARY KEY,
    path_json TEXT NOT NULL,
    answers_json TEXT NOT NULL,
    question_ids TEXT NOT NULL,
    tags_json TEXT NOT NULL,
    spdx TEXT,
    score REAL,
    is_approximate INTEGER NOT NULL,
    ok INTEGER NOT NULL
  )
`)

const insert = db.prepare(`
  INSERT INTO paths (path_json, answers_json, question_ids, tags_json, spdx, score, is_approximate, ok)
  VALUES ($path, $answers, $ids, $tags, $spdx, $score, $approx, $ok)
`)

let failures = 0
const rows = []

for (const p of paths) {
  const active = getActiveQuestions(QUIZ_QUESTIONS, p.answers)
  const tags = collectTagsFromAnswers(active, p.answers)
  const result = matchLicense(tags, catalog)
  const ok = Boolean(result.license) && !result.isApproximate
  if (!ok) failures++

  const row = {
    path: p.map,
    answers: p.answers,
    ids: p.ids,
    tags,
    spdx: result.license?.spdx ?? null,
    score: Number.isFinite(result.score) ? result.score : null,
    approx: result.isApproximate,
    ok
  }
  rows.push(row)

  insert.run({
    $path: JSON.stringify(p.map),
    $answers: JSON.stringify(p.answers),
    $ids: p.ids.join(','),
    $tags: JSON.stringify(tags),
    $spdx: row.spdx,
    $score: row.score,
    $approx: result.isApproximate ? 1 : 0,
    $ok: ok ? 1 : 0
  })
}

// summary table to stdout
console.log(`Wizard path matrix → ${dbPath}`)
console.log(`Catalog licenses: ${catalog.length}`)
console.log(`Reachable paths:  ${paths.length}`)
console.log(`Failures:         ${failures}`)
console.log('')
console.log('path_json'.padEnd(72), 'spdx'.padEnd(22), 'ok')
for (const r of rows) {
  console.log(
    JSON.stringify(r.path).padEnd(72),
    String(r.spdx ?? '—').padEnd(22),
    r.ok ? '✓' : '✗'
  )
}

// quick group counts
const bySpdx = db
  .query('SELECT spdx, COUNT(*) AS n FROM paths GROUP BY spdx ORDER BY n DESC')
  .all()
console.log('\nRecommendations by SPDX:')
for (const g of bySpdx) {
  console.log(`  ${g.spdx}: ${g.n}`)
}

db.close()
process.exit(failures > 0 ? 1 : 0)
