<template>
  <main class="container-wide flex-1 flex flex-col z-10 pb-12 animate-fade-up">
    <header class="text-center pt-16 pb-16 max-w-3xl mx-auto">
      <p class="eyebrow-sm mb-4">
        {{ isApproximate ? 'Best available match' : 'Your Perfect Match' }}
      </p>
      <h1 class="text-6xl md:text-8xl mb-8 text-espresso font-bold tracking-tighter">
        {{ license.spdx }}
      </h1>
      <p
        v-if="isApproximate"
        class="text-sm text-tan font-bold mb-4 max-w-xl mx-auto"
      >
        No license met every hard constraint — this is the closest catalog fit. Read the notes below.
      </p>
      <p class="text-xl text-body mb-8">
        {{ license.whyThisLicense }}
      </p>

      <!-- trait bullets + score + runners-up from matcher (query or props) -->
      <MatchInsights
        v-if="insightsReasons.length || insightsRunners.length"
        class="mb-10"
        title="Why this license"
        :reasons="insightsReasons"
        :score="insightsScore"
        :runners-up="insightsRunners"
      />

      <!-- optional support ask after a successful match -->
      <aside class="donation-banner">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
            <span class="text-xl">☕</span>
          </div>
          <div class="text-left">
            <p class="text-sm font-bold text-charcoal">
              Did this tool save time?
            </p>
            <p class="text-xs text-muted">
              Support the project with a coffee to keep it running.
            </p>
          </div>
        </div>
        <a
          :href="links.paypal"
          target="_blank"
          rel="noopener noreferrer"
          class="cta-donate"
        >
          Donate via PayPal
        </a>
      </aside>
    </header>

    <section aria-labelledby="overview-heading">
      <h2
        id="overview-heading"
        class="sr-only"
      >
        License Overview
      </h2>
      <LicenseOverview :license="license" />
    </section>

    <section aria-labelledby="header-generator-heading">
      <h2
        id="header-generator-heading"
        class="sr-only"
      >
        File Header Generator
      </h2>
      <LazyFileHeaderGenerator :license="license" />
    </section>

    <section aria-labelledby="full-text-heading">
      <h2
        id="full-text-heading"
        class="sr-only"
      >
        Full License Text
      </h2>
      <LazyFullLicenseText :license="license" />
    </section>
  </main>
</template>

<script setup lang="ts">
/**
 * Post-match dashboard: SPDX hero, match insights, overview, header tool, full text.
 */
import type { License } from '~/types'
import { useSiteLinks } from '~/composables/useSiteLinks'
import type { RankedLicense } from '~/utils/matchLicense'

const props = defineProps<{
  license: License
  /** Optional match score from wizard. */
  matchScore?: number
  /** Optional why-bullets from wizard. */
  matchReasons?: string[]
  /** Optional runners-up (minimal ranked shape). */
  runnersUp?: RankedLicense[]
}>()

// shared donate URL (same source as shell footer)
const links = useSiteLinks()

const route = useRoute()

/** Parse JSON query params safely. */
function parseQueryJson<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== 'string' || !raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

// reasons: props > query > derive from license traits alone
const insightsReasons = computed(() => {
  if (props.matchReasons?.length) return props.matchReasons
  const fromQuery = parseQueryJson<string[]>(route.query.reasons, [])
  if (fromQuery.length) return fromQuery
  // fallback: license.whyThisLicense already shown; trait overlap needs user tags (skip)
  return []
})

const insightsScore = computed(() => {
  if (typeof props.matchScore === 'number') return props.matchScore
  const q = route.query.score
  if (typeof q === 'string' && q !== '') return Number(q)
  return undefined
})

/** Soft-fallback recommendation from the wizard (not a perfect gate match). */
const isApproximate = computed(() => {
  return route.query.approximate === '1' || route.query.approximate === 'true'
})

const insightsRunners = computed<RankedLicense[]>(() => {
  if (props.runnersUp?.length) return props.runnersUp
  // query carries slim { spdx, score, slug } — map to RankedLicense-ish for links
  type Slim = { spdx: string, score: number, slug: string }
  const slim = parseQueryJson<Slim[]>(route.query.runners, [])
  return slim.map(s => ({
    score: s.score,
    license: {
      id:              s.slug,
      spdx:            s.spdx,
      name:            s.spdx,
      subtitle:        '',
      whyThisLicense:  '',
      url:             '',
      traits:          [],
      permissions:     [],
      conditions:      [],
      limitations:     [],
      headerStatement: '',
      path:            `/licenses/${s.slug}`
    } as License & { path: string }
  }))
})

</script>
