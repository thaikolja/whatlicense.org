<template>
  <div class="w-full min-w-0">
    <Transition
      name="screen"
      mode="out-in"
    >
      <LazyIntroScreen
        v-if="currentScreen === 'intro'"
        key="intro"
        @start="onStart"
      />

      <LazyQuizWizard
        v-else-if="currentScreen === 'quiz' && currentQuestion"
        key="quiz"
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
        v-else-if="currentScreen === 'result' && matching"
        key="matching"
        class="state-center px-2"
      >
        <div
          class="spinner mb-6"
          aria-hidden="true"
        />
        <h1 class="text-2xl sm:text-4xl text-espresso mb-4">
          Finding the perfect license...
        </h1>
        <p class="text-body mb-8 text-sm sm:text-base">
          Please wait while we match your answers.
        </p>
      </div>

      <div
        v-else-if="currentScreen === 'result' && !matching && catalogEmpty"
        key="catalog-empty"
        class="state-center max-w-xl mx-auto px-2"
      >
        <h1 class="text-2xl sm:text-4xl text-espresso mb-4">
          Could not load licenses
        </h1>
        <p class="text-body mb-8 text-sm sm:text-base">
          We could not load the license catalog. Check your connection and try again.
        </p>
        <button
          type="button"
          class="cta"
          @click="onStart"
        >
          Start over
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
/**
 * Homepage wizard — every completed path navigates to a license recommendation.
 */
import { useWizard } from '~/composables/useWizard'
import { useLicenseMatcher } from '~/composables/useLicenseMatcher'
import { licenseToSlug } from '~/utils/licenseSlug'

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

const { allLicenses, fetchLicenses, matchResult } = useLicenseMatcher()

const matching = ref(false)
const catalogEmpty = computed(() => allLicenses.value.length === 0)

const onStart = () => {
  matching.value = false
  startWizard()
}

await fetchLicenses()

/**
 * Advance quiz; on final step always recommend a license (gated or approximate).
 */
const handleNext = async () => {
  nextStep()
  if (currentScreen.value !== 'result') return

  matching.value = true
  await new Promise(r => setTimeout(r, 80))

  if (catalogEmpty.value) {
    matching.value = false
    return
  }

  // always returns a license when catalog is loaded
  const result = matchResult(collectedTags.value)
  if (!result.license) {
    matching.value = false
    return
  }

  const slug = licenseToSlug(
    result.license as { path?: string, id?: string, spdx?: string }
  )
  const reasons = encodeURIComponent(JSON.stringify(result.matchReasons.slice(0, 10)))
  const runners = encodeURIComponent(
    JSON.stringify(
      result.runnersUp.map(r => ({
        spdx:  r.license.spdx,
        score: r.score,
        slug:  licenseToSlug(r.license as { path?: string, id?: string, spdx?: string })
      }))
    )
  )

  await navigateTo({
    path:  `/licenses/${slug}`,
    query: {
      calc:         '1',
      score:        String(result.score),
      reasons,
      runners,
      approximate:  result.isApproximate ? '1' : undefined
    }
  })
}

useSeoMeta({
  title: 'Find the Perfect License for Your Code',
  description:
    'Answer a short branching quiz and get an open-source license recommendation plus a custom file header — private, in your browser.'
})
</script>

<style scoped>
.screen-enter-active,
.screen-leave-active {
  transition:
    opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.screen-enter-from {
  opacity: 0;
  transform: translateY(0.75rem);
}

.screen-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}

@media (prefers-reduced-motion: reduce) {
  .screen-enter-active,
  .screen-leave-active {
    transition-duration: 0.01ms;
  }

  .screen-enter-from,
  .screen-leave-to {
    transform: none;
  }
}
</style>
