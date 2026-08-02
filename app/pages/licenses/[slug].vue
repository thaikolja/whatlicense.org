<template>
  <ResultDashboard
      v-if="showResult"
      :license="license!"
  />
  <div
      v-else-if="isPending"
      class="flex-1 flex flex-col items-center justify-center py-32"
  >
    <div class="text-center animate-fade-up">
      <div class="inline-block w-12 h-12 border-4 border-tan border-t-transparent rounded-full animate-spin mb-6"></div>
      <p class="text-xl text-muted font-medium italic serif tracking-wide">Matching your perfect license...</p>
      <p class="text-xs text-muted/60 mt-2 uppercase tracking-widest font-bold">Scanning 25+ open source licenses</p>
    </div>
  </div>
  <div
      v-else
      class="flex-1 flex flex-col items-center justify-center py-32"
  >
    <div class="text-center max-w-md mx-auto">
      <h1 class="text-4xl font-bold text-espresso mb-4">License not found</h1>
      <p class="text-muted mb-8 text-lg">The specific license details could not be found. It may have been moved or
        renamed.
      </p>
      <NuxtLink
          to="/"
          class="btn px-10 py-4 rounded-full font-bold"
      >Go Back Home
      </NuxtLink>
    </div>
  </div>
</template>

<script
    setup
    lang="ts"
>
import type { License } from '~/types'

const route = useRoute()
const slug  = route.params.slug as string

// Minimum loading time for "effect" only if coming from the wizard (calc=1)
const isCalc             = route.query.calc === '1'
const minLoadingFinished = ref(!isCalc)

onMounted(() => {
  if (isCalc) {
    setTimeout(() => {
      minLoadingFinished.value = true
      // Clean up the URL so reloads don't show the animation again
      const router             = useRouter()
      router.replace({ query: { ...route.query, calc: undefined } })
    }, 2000)
  }
})

// We fetch the data as fast as possible, but 'lazy' ensures we navigate immediately
const { data: license, status } = useAsyncData(`license-${slug}`, async () => {
  const result = await queryCollection('licenses').path(`/licenses/${slug}`).first()
  if (!result) return null
  return result as unknown as License
}, { lazy: true })

// Show result only when data is loaded AND the minimum 2s have passed
const showResult = computed(() => {
  return status.value === 'success' && minLoadingFinished.value && !!license.value
})

const isPending = computed(() => {
  return status.value === 'pending' || !minLoadingFinished.value
})

// SEO
useSeoMeta({
  title:       () => license.value ? `${license.value.name} (${license.value.spdx}) - whatlicense.org` : 'Finding License...',
  description: () => license.value ? `Get the ${license.value.name} text and generate a custom license header for your project.` : 'Loading license details...'
})
</script>
