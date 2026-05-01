<template>
  <div>
    <LazyIntroScreen v-if="currentScreen === 'intro'" @start="startWizard" />

    <LazyQuizWizard
        v-if="currentScreen === 'quiz' && currentQuestion" :question="currentQuestion" :current-step="currentStep" :total-steps="totalSteps" :answers="answers" :can-advance="canAdvance" @select="selectOption" @next="handleNext" @prev="prevStep" />

    <div v-if="currentScreen === 'result'" class="text-center pt-24 pb-16">
      <h1 class="text-4xl text-espresso mb-4">Finding the perfect license...</h1>
      <p class="text-muted mb-8">Please wait while we match your answers.</p>
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

  const { fetchLicenses, matchLicense } = useLicenseMatcher()

  // Fetch all licenses on mount
  await fetchLicenses()

  const handleNext = async () => {
    nextStep()
    if (currentScreen.value==='result') {
      const matchedLicense = matchLicense(collectedTags.value)
      if (matchedLicense) {
        // In Nuxt Content v3, the object often has a 'path' property
        // Let's try to extract the slug from path, id, or spdx
        const path = (matchedLicense as any).path || matchedLicense.id || ''
        const slug = path.split('/').pop() || matchedLicense.spdx.toLowerCase()

        await navigateTo(`/licenses/${slug}?calc=1`)
      } else {
        // No match found
        currentScreen.value = 'result' // Stay on result screen but show "no match"
      }
    }
  }
</script>
