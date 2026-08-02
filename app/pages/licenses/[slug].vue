<template>
  <ResultDashboard
    v-if="showResult"
    :license="license!"
  />
  <div
    v-else-if="isPending"
    class="state-center"
  >
    <div class="animate-fade-up">
      <div
        class="spinner mb-6"
        aria-hidden="true"
      />
      <p class="text-xl text-muted font-medium italic serif tracking-wide">
        Matching your perfect license...
      </p>
      <p class="eyebrow-muted mt-2 opacity-60">
        Scanning 25+ open source licenses
      </p>
    </div>
  </div>
  <div
    v-else
    class="state-center"
  >
    <div class="max-w-md mx-auto">
      <h1 class="text-4xl font-bold text-espresso mb-4">
        License not found
      </h1>
      <p class="text-body text-lg mb-8">
        The specific license details could not be found. It may have been moved or renamed.
      </p>
      <NuxtLink
        to="/"
        class="cta"
      >
        Go Back Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Per-license page — loads one Content document by slug.
 */
import { contentPageToLicense } from '~/utils/mapLicense'

const route = useRoute()
const slug = route.params.slug as string

// calc=1 from wizard: brief loading animation before showing result
const isCalc = route.query.calc === '1'
const minLoadingFinished = ref(!isCalc)

onMounted(() => {
  if (isCalc) {
    setTimeout(() => {
      minLoadingFinished.value = true
      // drop calc so refresh doesn’t re-spin; keep score/reasons/runners
      const router = useRouter()
      const { calc: _drop, ...rest } = route.query
      router.replace({ query: rest })
    }, 2000)
  }
})

const { data: license, status } = useAsyncData(`license-${slug}`, async () => {
  // Content path is always /licenses/<slug>
  const result = await queryCollection('licenses').path(`/licenses/${slug}`).first()
  if (!result) return null
  return contentPageToLicense(result as Record<string, unknown>)
}, { lazy: true })

const showResult = computed(() => {
  return status.value === 'success' && minLoadingFinished.value && !!license.value
})

const isPending = computed(() => {
  return status.value === 'pending' || !minLoadingFinished.value
})

useSeoMeta({
  title: () =>
    license.value
      ? `${license.value.name} (${license.value.spdx}) - whatlicense.org`
      : 'Finding License...',
  description: () =>
    license.value
      ? `Get the ${license.value.name} text and generate a custom license header for your project.`
      : 'Loading license details...'
})
</script>
