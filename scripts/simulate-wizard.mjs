#!/usr/bin/env node
/**
 * Thin CLI wrapper — prefer Vitest for truth; this shell runs the same pure modules via Bun.
 *
 *   bun scripts/simulate-wizard.mjs
 *   node --import tsx scripts/simulate-wizard.mjs   # if needed
 *
 * Prefer: bun run test -- test/unit/wizardAlignment.test.ts test/unit/contentIntegrity.test.ts
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const r = spawnSync(
  'node',
  [
    path.join(root, 'node_modules/vitest/vitest.mjs'),
    'run',
    'test/unit/wizardAlignment.test.ts',
    'test/unit/wizardCorrectness.test.ts',
    'test/unit/contentIntegrity.test.ts'
  ],
  { cwd: root, stdio: 'inherit' }
)
process.exit(r.status ?? 1)
