/**
 * Wizard state machine: intro → branching quiz → result.
 * Copyleft on “share” unlocks scope + network steps.
 */
import { ref, computed } from 'vue'
import {
  QUIZ_QUESTIONS,
  getActiveQuestions,
  collectTagsFromAnswers
}                        from '~/data/questions'
import type { WizardScreen, LicenseTrait } from '~/types'

/** Optional overrides for tests (skip real runtimeConfig). */
export interface UseWizardOptions {
  /** Overrides runtimeConfig.public.debugAutoSelect (useful in tests). */
  debugAutoSelect?: boolean
}

/**
 * Reactive wizard controller used by the homepage.
 */
export function useWizard(options: UseWizardOptions = {}) {
  // which full-screen phase we’re on
  const currentScreen = ref<WizardScreen>('intro')
  // index into the *active* question list
  const currentStep = ref(0)
  // answers aligned with active questions (not the full catalog)
  const answers     = ref<number[]>([])

  /** Resolve debug auto-select from options or Nuxt runtime config. */
  const resolveDebugAutoSelect = (): boolean => {
    if (typeof options.debugAutoSelect === 'boolean') {
      return options.debugAutoSelect
    }
    try {
      // Nuxt auto-import; may throw outside Nuxt
      return Boolean(useRuntimeConfig().public?.debugAutoSelect)
    } catch {
      return false
    }
  }

  /**
   * Active questions depend on answers so far (copyleft unlocks scope + network).
   */
  const activeQuestions = computed(() => getActiveQuestions(QUIZ_QUESTIONS, answers.value))

  // progress bar length follows the branch
  const totalSteps = computed(() => activeQuestions.value.length)

  // question card content for the current step
  const currentQuestion = computed(() => activeQuestions.value[currentStep.value])

  // Next stays disabled until this step has a pick
  const canAdvance = computed(() => answers.value[currentStep.value] !== undefined)

  // tags fed into the matcher
  const collectedTags = computed<LicenseTrait[]>(() =>
      collectTagsFromAnswers(activeQuestions.value, answers.value)
  )

  /** Leave intro and (optionally) pre-fill answers in debug mode. */
  const startWizard = () => {
    currentScreen.value = 'quiz'
    currentStep.value = 0

    if (resolveDebugAutoSelect()) {
      // walk the path picking option 0 each time (unlocks copyleft steps)
      answers.value = []
      let guard = 0
      while (guard++ < 10) {
        const active = getActiveQuestions(QUIZ_QUESTIONS, answers.value)
        if (answers.value.length >= active.length) break
        answers.value = [ ...answers.value, 0 ]
      }
      currentStep.value = 0
    } else {
      // normal users start clean
      answers.value = []
    }
  }

  /** Record a pick for the current step; re-picks clear later answers. */
  const selectOption = (optionIndex: number) => {
    // same option again after Back — keep later answers
    if (answers.value[currentStep.value] === optionIndex) {
      return
    }
    // truncate after this step so branch changes don’t leave stale scope/network answers
    const next    = answers.value.slice(0, currentStep.value)
    next[currentStep.value] = optionIndex
    answers.value = next
  }

  /** Advance one step, or go to result when finished. */
  const nextStep = () => {
    // recompute active list in case branch just changed
    const active = getActiveQuestions(QUIZ_QUESTIONS, answers.value)
    if (currentStep.value < active.length - 1) {
      // do not slice answers here — that broke Back→Next
      currentStep.value++
    } else {
      // quiz complete
      currentScreen.value = 'result'
    }
  }

  /** Go back one step, or return to intro from the first question. */
  const prevStep = () => {
    if (currentStep.value > 0) {
      // just step back; keep answers so re-picks work
      currentStep.value--
    } else {
      // first question → landing
      currentScreen.value = 'intro'
    }
  }

  /** Full reset to landing. */
  const resetWizard = () => {
    // wipe everything back to day one
    currentScreen.value = 'intro'
    currentStep.value = 0
    answers.value     = []
  }

  // public API for the homepage wizard
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
