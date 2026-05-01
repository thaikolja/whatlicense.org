<template>
  <div class="w-full max-w-6xl mx-auto flex-1 flex flex-col z-10 pb-12 animate-fade-up">
    <!-- Top Title -->
    <div class="text-center pt-16 pb-16 max-w-3xl mx-auto">
      <p class="text-sm tracking-widest uppercase font-bold text-tan mb-4">Your Perfect Match</p>
      <h1 class="text-6xl md:text-8xl mb-8 text-espresso font-bold tracking-tighter">{{ license.spdx }}</h1>
      <p class="text-xl text-muted leading-relaxed mb-8">
        {{ license.whyThisLicense }}
      </p>

      <!-- Monetization: Subtle Donation Request -->
      <div class="inline-flex flex-col sm:flex-row items-center gap-4 bg-cream-dark/50 border border-border rounded-2xl p-4 transition-colors hover:bg-cream-dark">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
            <span class="text-xl">☕</span>
          </div>
          <div class="text-left">
            <p class="text-sm font-bold text-charcoal">Did this tool save time?</p>
            <p class="text-xs text-muted">Support the project with a coffee to keep it running.</p>
          </div>
        </div>
        <a :href="config.public.links.paypal" target="_blank" class="shrink-0 bg-tan hover:bg-tan/90 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-colors shadow-sm">
          Donate via PayPal </a>
      </div>
    </div>

    <!-- Overview Section -->
    <LicenseOverview :license="license" />

    <!-- File Header Section -->
    <LazyFileHeaderGenerator :license="license" />

    <!-- Full Text Section -->
    <LazyFullLicenseText :license="license" />
  </div>
</template>

<script setup lang="ts">
  import type { License } from '~/types'

  defineProps<{
    license: License
  }>()

  const config = useRuntimeConfig()
</script>
