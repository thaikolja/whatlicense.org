<template>
  <div class="w-full min-w-0">
    <!-- Screen-level transition: intro ↔ quiz ↔ empty result -->
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
          class="text-center pt-16 sm:pt-24 pb-16 px-2"
      >
        <div
            class="inline-block w-10 h-10 border-4 border-tan border-t-transparent rounded-full animate-spin mb-6"
            aria-hidden="true"
        />
        <h1 class="text-2xl sm:text-4xl text-espresso mb-4">
          Finding the perfect license...
        </h1>
        <p class="text-muted mb-8 text-sm sm:text-base">
          Please wait while we match your answers.
        </p>
      </div>

      <div
          v-else-if="currentScreen === 'result' && !matching && noMatch"
          key="no-match"
          class="text-center pt-16 sm:pt-24 pb-16 max-w-xl mx-auto px-2"
      >
        <h1 class="text-2xl sm:text-4xl text-espresso mb-4">
          {{ catalogEmpty ? 'Could not load licenses' : 'No clear match' }}
        </h1>
        <p class="text-muted mb-8 text-sm sm:text-base leading-relaxed">
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
          class="btn px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold uppercase tracking-wide text-sm min-h-11"
          @click="onStart"
        >
          Start over
        </button>
      </div>
    </Transition>
  </div>
</template>

<script
    setup
    lang="ts"
>
/**
 * Homepage wizard — SSG renders intro; licenses hydrate from Content/useAsyncData.
 */
import { useWizard } from '~/composables/useWizard'
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

const matching = ref(false)
const noMatch  = ref(false)
const catalogEmpty = computed(() => allLicenses.value.length === 0)

const onStart = () => {
  matching.value = false
  noMatch.value = false
  startWizard()
}

// ... run during setup so SSG/CSR share the same useAsyncData payload
await fetchLicenses()

const handleNext = async () => {
  nextStep()
  if (currentScreen.value === 'result') {
    matching.value = true
    noMatch.value = false

    // ... tiny beat so the matching UI paints before navigation
    await new Promise(r => setTimeout(r, 80))

    const matchedLicense = matchLicense(collectedTags.value)
    if (matchedLicense) {
      const path = (matchedLicense as { path?: string }).path || matchedLicense.id || ''
      const slug = path.split('/').pop() || matchedLicense.spdx.toLowerCase()
      await navigateTo(`/licenses/${slug}?calc=1`)
    } else {
      matching.value = false
      noMatch.value = true
    }
  }
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
  transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.screen-enter-from {
  opacity:   0;
  transform: translateY(0.75rem);
}

.screen-leave-to {
  opacity:   0;
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
