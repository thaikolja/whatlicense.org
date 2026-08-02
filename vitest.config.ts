import path from 'node:path'
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

const rootDir = process.cwd()
const simpleAnalyticsStub = path.resolve(rootDir, 'test/mocks/simple-analytics-vue.ts')
const appRoot = path.resolve(rootDir, 'app')

/**
 * Shared path aliases for unit tests (`~/`, `@/`) and the Simple Analytics stub.
 * Applied at the root config; each project uses `extends: true` to inherit them.
 *
 * Uses `path.resolve` + `process.cwd()` instead of `import.meta.url` so editors
 * that typecheck this file with older `--module` settings do not raise TS1343.
 */
const sharedAlias = {
  '~':                    appRoot,
  '@':                    appRoot,
  'simple-analytics-vue': simpleAnalyticsStub
}

const nuxtProject = await defineVitestProject({
  test: {
    name:               'nuxt',
    include:            [ 'test/nuxt/**/*.{test,spec}.ts' ],
    environment:        'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom'
      }
    }
  }
})

export default defineConfig({
  resolve: {
    alias: sharedAlias
  },
  test: {
    coverage: {
      provider:         'v8',
      reporter:         [ 'text', 'text-summary', 'html', 'lcov' ],
      reportsDirectory: './coverage',
      include: [
        'app/**/*.{ts,vue,js}'
      ],
      exclude: [
        '**/*.{test,spec}.ts',
        'test/**',
        'app/components/ui/**',
        'app/plugins/**',
        'app/assets/**',
        'app/types/**',
        // Page shells depend on content/async data; covered lightly via e2e
        'app/pages/**',
        'node_modules/**',
        '.nuxt/**',
        'dist/**',
        'coverage/**'
      ],
      thresholds: {
        lines:      50,
        functions:  40,
        branches:   40,
        statements: 50
      }
    },
    projects: [
      {
        extends: true,
        test:    {
          name:        'unit',
          include:     [ 'test/unit/**/*.{test,spec}.ts' ],
          environment: 'node'
        }
      },
      {
        ...nuxtProject,
        extends: true
      },
      {
        extends: true,
        test:    {
          name:        'e2e',
          include:     [ 'test/e2e/**/*.{test,spec}.ts' ],
          environment: 'node',
          // e2e boots a real Nuxt server; allow longer startup
          testTimeout: 120_000,
          hookTimeout: 120_000
        }
      }
    ]
  }
})
