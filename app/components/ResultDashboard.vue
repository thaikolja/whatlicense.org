<template>
  <div class="w-full max-w-6xl mx-auto flex-1 flex flex-col z-10 pb-12">
    <!-- Top Title -->
    <div class="text-center pt-16 pb-16 max-w-3xl mx-auto">
      <p class="text-sm tracking-widest uppercase font-bold text-tan mb-4">Your Perfect Match</p>
      <h1 class="text-6xl md:text-8xl mb-8 text-espresso font-bold tracking-tighter">{{ license.spdx }}</h1>
      <p class="text-xl text-muted leading-relaxed">
        {{ license.whyThisLicense }}
      </p>
    </div>

    <!-- Overview Section -->
    <LicenseOverview :license="license" />

    <!-- File Header Section -->
    <FileHeaderGenerator :license="license" />

    <!-- Full Text Section -->
    <FullLicenseText :license="license" />
  </div>
</template>

<script setup lang="ts">
  import type { License } from '~/types'

  defineProps<{
    license: License
  }>()
</script>
