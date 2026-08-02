<template>
  <div>
    <LazyIntroScreen
        v-if="currentScreen === 'intro'"
        @start="onStart"
    />

    <LazyQuizWizard
        v-if="currentScreen === 'quiz' && currentQuestion"
        :question="currentQuestion"
        :current-step="currentStep"
        :total-steps="totalSteps"
        :answers="answers"
        :can-advance="canAdvance"
        @select="selectOption"
        @next="handleNext"
        @prev="prevStep"
    />

    <div
        v-if="currentScreen === 'result' && matching"
        class="text-center pt-24 pb-16"
    >
      <h1 class="text-4xl text-espresso mb-4">Finding the perfect license...</h1>
      <p class="text-muted mb-8">Please wait while we match your answers.</p>
    </div>

    <div
        v-if="currentScreen === 'result' && !matching && noMatch"
        class="text-center pt-24 pb-16 max-w-xl mx-auto"
    >
      <h1 class="text-4xl text-espresso mb-4">
        {{ catalogEmpty ? 'Could not load licenses' : 'No clear match' }}
      </h1>
      <p class="text-muted mb-8">
        <template v-if="catalogEmpty">
          We could not load the license catalog. Check your connection and try again.
        </template>
        <template v-else>
          Your answers do not map cleanly to a single license in our catalog (for example weak copyleft with
          network/SaaS requirements, or copyleft with non-commercial only). Try adjusting share-alike, commercial use,
          or network options.
        </template>
      </p>
      <button
          type="button"
          class="btn px-10 py-4 rounded-full font-bold uppercase tracking-wide text-sm"
          @click="onStart"
      >
        Start over
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWizard }         from '~/composables/useWizard'
import { useLicenseMatcher } from '~/composables/useLicenseMatcher'

const {
        currentScreen,
        currentStep,
        answers,
        startWizard,
        selectOption,
        nextStep,
        prevStep,
        totalSteps,
        currentQuestion,
        canAdvance,
        collectedTags
      } = useWizard()

const { allLicenses, fetchLicenses, matchLicense } = useLicenseMatcher()

const matching     = ref(false)
const noMatch      = ref(false)
const catalogEmpty = computed(() => allLicenses.value.length === 0)

const onStart = () => {
  matching.value = false
  noMatch.value  = false
  startWizard()
}

// Fetch all licenses on mount
await fetchLicenses()

const handleNext = async () => {
  nextStep()
  if (currentScreen.value === 'result') {
    matching.value = true
    noMatch.value  = false

    const matchedLicense = matchLicense(collectedTags.value)
    if (matchedLicense) {
      const path = (matchedLicense as { path?: string }).path || matchedLicense.id || ''
      const slug = path.split('/').pop() || matchedLicense.spdx.toLowerCase()

      await navigateTo(`/licenses/${slug}?calc=1`)
    } else {
      matching.value = false
      noMatch.value  = true
    }
  }
}
</script>
