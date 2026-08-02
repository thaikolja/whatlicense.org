<template>
  <main class="container-wide flex-1 flex flex-col z-10 pb-12 animate-fade-up">
    <header class="text-center pt-16 pb-16 max-w-3xl mx-auto">
      <p class="eyebrow-sm mb-4">
        Your Perfect Match
      </p>
      <h1 class="text-6xl md:text-8xl mb-8 text-espresso font-bold tracking-tighter">
        {{ license.spdx }}
      </h1>
      <p class="text-xl text-body mb-8">
        {{ license.whyThisLicense }}
      </p>

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
 * Post-match dashboard: SPDX hero, overview, header tool, full text.
 */
import type { License } from '~/types'
import { useSiteLinks } from '~/composables/useSiteLinks'

defineProps<{
  license: License
}>()

// shared donate URL (same source as shell footer)
const links = useSiteLinks()
</script>
