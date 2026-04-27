<template>
  <ResultDashboard v-if="license" :license="license" />
  <div v-else-if="status === 'pending'" class="flex-1 flex flex-col items-center justify-center py-32">
    <div class="text-center">
      <div class="inline-block w-12 h-12 border-4 border-tan border-t-transparent rounded-full animate-spin mb-6"></div>
      <p class="text-xl text-muted font-medium">Matching your perfect license...</p>
    </div>
  </div>
  <div v-else class="flex-1 flex flex-col items-center justify-center py-32">
    <div class="text-center max-w-md mx-auto">
      <h1 class="text-4xl font-bold text-espresso mb-4">License not found</h1>
      <p class="text-muted mb-8 text-lg">We couldn't find the specific license details. It may have been moved or
        renamed.
      </p>
      <NuxtLink to="/" class="btn px-10 py-4 rounded-full font-bold">Go Back Home</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { License } from '~/types'

  const route = useRoute()
  const slug  = route.params.slug as string

  const { data: license, status } = await useAsyncData(`license-${slug}`, async () => {
    const result = await queryCollection('licenses').path(`/licenses/${slug}`).first()
    if (!result) return null
    return result as unknown as License
  })

  // SEO
  useSeoMeta({
    title:       license.value ? `${license.value.spdx} - whatlicense.io`: 'License Not Found',
    description: license.value?.subtitle || 'License details'
  })
</script>
