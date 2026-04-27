import { ref, computed }                   from 'vue'
import { QUIZ_QUESTIONS }                  from '~/data/questions'
import type { WizardScreen, LicenseTrait } from '~/types'

export function useWizard() {
  const currentScreen = ref<WizardScreen>('intro')
  const currentStep   = ref(0)
  const answers       = ref<number[]>([])

  const startWizard = () => {
    currentScreen.value = 'quiz'
    currentStep.value   = 0
    answers.value       = []
  }

  const selectOption = (optionIndex: number) => {
    answers.value[currentStep.value] = optionIndex
  }

  const nextStep = () => {
    if (currentStep.value < QUIZ_QUESTIONS.length - 1) {
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
    currentStep.value   = 0
    answers.value       = []
  }

  const totalSteps = QUIZ_QUESTIONS.length

  const currentQuestion = computed(() => QUIZ_QUESTIONS[currentStep.value])

  const canAdvance = computed(() => answers.value[currentStep.value]!==undefined)

  const collectedTags = computed<LicenseTrait[]>(() => {
    const tags: LicenseTrait[] = []
    answers.value.forEach((answerIndex, questionIndex) => {
      const option = QUIZ_QUESTIONS[questionIndex].options[answerIndex]
      if (option && option.tags) {
        tags.push(...option.tags)
      }
    })
    return tags
  })

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
    collectedTags
  }
}
