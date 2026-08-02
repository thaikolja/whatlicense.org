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
          class="btn"
      >
        Go Back Home
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

const isCalc             = route.query.calc === '1'
const minLoadingFinished = ref(!isCalc)

onMounted(() => {
  if (isCalc) {
    setTimeout(() => {
      minLoadingFinished.value = true
      const router             = useRouter()
      router.replace({ query: { ...route.query, calc: undefined } })
    }, 2000)
  }
})

const { data: license, status } = useAsyncData(`license-${slug}`, async () => {
  const result = await queryCollection('licenses').path(`/licenses/${slug}`).first()
  if (!result) return null
  return result as unknown as License
}, { lazy: true })

const showResult = computed(() => {
  return status.value === 'success' && minLoadingFinished.value && !!license.value
})

const isPending = computed(() => {
  return status.value === 'pending' || !minLoadingFinished.value
})

useSeoMeta({
  title:       () => license.value ? `${license.value.name} (${license.value.spdx}) - whatlicense.org` : 'Finding License...',
  description: () => license.value ? `Get the ${license.value.name} text and generate a custom license header for your project.` : 'Loading license details...'
})
</script>
