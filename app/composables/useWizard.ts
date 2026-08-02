import { ref, computed } from 'vue'
import {
  QUIZ_QUESTIONS,
  getActiveQuestions,
  collectTagsFromAnswers
}                        from '~/data/questions'
import type { WizardScreen, LicenseTrait } from '~/types'

export interface UseWizardOptions {
  /** Overrides runtimeConfig.public.debugAutoSelect (useful in tests). */
  debugAutoSelect?: boolean
}

export function useWizard(options: UseWizardOptions = {}) {
  const currentScreen = ref<WizardScreen>('intro')
  const currentStep = ref(0)
  /** Answers aligned with the active question sequence. */
  const answers     = ref<number[]>([])

  const resolveDebugAutoSelect = (): boolean => {
    if (typeof options.debugAutoSelect === 'boolean') {
      return options.debugAutoSelect
    }
    try {
      return Boolean(useRuntimeConfig().public?.debugAutoSelect)
    } catch {
      return false
    }
  }

  /**
   * Active questions depend on answers so far (copyleft unlocks scope + network).
   */
  const activeQuestions = computed(() => getActiveQuestions(QUIZ_QUESTIONS, answers.value))

  const totalSteps = computed(() => activeQuestions.value.length)

  const currentQuestion = computed(() => activeQuestions.value[currentStep.value])

  const canAdvance = computed(() => answers.value[currentStep.value] !== undefined)

  const collectedTags = computed<LicenseTrait[]>(() =>
      collectTagsFromAnswers(activeQuestions.value, answers.value)
  )

  const startWizard = () => {
    currentScreen.value = 'quiz'
    currentStep.value = 0

    if (resolveDebugAutoSelect()) {
      // Walk active path selecting option 0 each time (may unlock copyleft steps)
      answers.value = []
      let guard     = 0
      while (guard++ < 10) {
        const active = getActiveQuestions(QUIZ_QUESTIONS, answers.value)
        if (answers.value.length >= active.length) break
        answers.value = [ ...answers.value, 0 ]
      }
      currentStep.value = 0
    } else {
      answers.value = []
    }
  }

  const selectOption = (optionIndex: number) => {
    // Same option again after Back — keep later answers; only re-select changes truncate
    if (answers.value[currentStep.value] === optionIndex) {
      return
    }
    const next              = answers.value.slice(0, currentStep.value)
    next[currentStep.value] = optionIndex
    // Drop answers after this step (branch may change)
    answers.value           = next
  }

  const nextStep = () => {
    const active = getActiveQuestions(QUIZ_QUESTIONS, answers.value)
    if (currentStep.value < active.length - 1) {
      // Do not slice answers here — selectOption already truncates when the user
      // re-selects. Truncating on every Next would wipe later steps after Back→Next.
      currentStep.value++
    } else {
      currentScreen.value = 'result'
    }
  }

  const prevStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    } else {
      currentScreen.value = 'intro'
    }
  }

  const resetWizard = () => {
    currentScreen.value = 'intro'
    currentStep.value = 0
    answers.value     = []
  }

  return {
    currentScreen,
    currentStep,
    answers,
    startWizard,
    selectOption,
    nextStep,
    prevStep,
    resetWizard,
    totalSteps,
    currentQuestion,
    canAdvance,
    collectedTags,
    activeQuestions
  }
}
