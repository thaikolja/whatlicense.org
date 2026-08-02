/**
 * Vitest multi-project config: unit (node), nuxt (happy-dom), e2e (real server).
 * Aliases use path.resolve (not import.meta) to avoid TS1343 in some editors.
 */
import path from 'node:path'
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

//project root (where you ran vitest from)
const rootDir = process.cwd()
//stub for broken CJS simple-analytics under Vitest
const simpleAnalyticsStub = path.resolve(rootDir, 'test/mocks/simple-analytics-vue.ts')
//Nuxt app root for ~/ and @/ imports in unit tests
const appRoot = path.resolve(rootDir, 'app')

/**
 * Shared path aliases for unit tests (`~/`, `@/`) and the Simple Analytics stub.
 * Applied at the root config; each project uses `extends: true` to inherit them.
 */
const sharedAlias = {
  '~':                    appRoot,
  '@':                    appRoot,
  'simple-analytics-vue': simpleAnalyticsStub
}

//Nuxt env project (async factory from @nuxt/test-utils)
const nuxtProject = await defineVitestProject({
  test: {
    name:               'nuxt',
    include:            [ 'test/nuxt/**/*.{test,spec}.ts' ],
    environment:        'nuxt',
    environmentOptions: {
      nuxt: {
        //lightweight DOM for component mounts
        domEnvironment: 'happy-dom'
      }
    }
  }
})

export default defineConfig({
  //root aliases inherited via extends: true
  resolve: {
    alias: sharedAlias
  },
  test: {
    //coverage only on app logic (not pages/ui chrome)
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
        //pages are mostly e2e territory
        'app/pages/**',
        'node_modules/**',
        '.nuxt/**',
        'dist/**',
        'coverage/**'
      ],
      //floor so coverage doesn’t silently collapse
      thresholds: {
        lines:      50,
        functions:  40,
        branches:   40,
        statements: 50
      }
    },
    projects: [
      //pure logic, no Nuxt
      {
        extends: true,
        test:    {
          name:        'unit',
          include:     [ 'test/unit/**/*.{test,spec}.ts' ],
          environment: 'node'
        }
      },
      //component / composable tests with Nuxt runtime
      {
        ...nuxtProject,
        extends: true
      },
      //boots a real Nuxt server
      {
        extends: true,
        test:    {
          name:        'e2e',
          include:     [ 'test/e2e/**/*.{test,spec}.ts' ],
          environment: 'node',
          //cold start can be slow
          testTimeout: 120_000,
          hookTimeout: 120_000
        }
      }
    ]
  }
})
