import { describe, expect, it } from 'vitest'
import { useWizard } from '../../app/composables/useWizard'
import { QUIZ_QUESTIONS } from '../../app/data/questions'

describe('useWizard', () => {
  it('starts on intro with empty answers', () => {
    const wizard = useWizard()

    expect(wizard.currentScreen.value).toBe('intro')
    expect(wizard.currentStep.value).toBe(0)
    expect(wizard.answers.value).toEqual([])
    expect(wizard.totalSteps).toBe(QUIZ_QUESTIONS.length)
    expect(wizard.canAdvance.value).toBe(false)
  })

  it('moves intro → quiz → through steps → result', () => {
    const wizard = useWizard()

    wizard.startWizard()
    expect(wizard.currentScreen.value).toBe('quiz')
    expect(wizard.answers.value).toEqual([])

    for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
      expect(wizard.canAdvance.value).toBe(false)
      wizard.selectOption(0)
      expect(wizard.canAdvance.value).toBe(true)
      wizard.nextStep()
    }

    expect(wizard.currentScreen.value).toBe('result')
  })

  it('prevStep returns to intro from first quiz step', () => {
    const wizard = useWizard()
    wizard.startWizard()
    wizard.prevStep()
    expect(wizard.currentScreen.value).toBe('intro')
  })

  it('prevStep decrements step when not first', () => {
    const wizard = useWizard()
    wizard.startWizard()
    wizard.selectOption(1)
    wizard.nextStep()
    expect(wizard.currentStep.value).toBe(1)
    wizard.prevStep()
    expect(wizard.currentStep.value).toBe(0)
  })

  it('resetWizard clears state', () => {
    const wizard = useWizard()
    wizard.startWizard()
    wizard.selectOption(0)
    wizard.nextStep()
    wizard.resetWizard()

    expect(wizard.currentScreen.value).toBe('intro')
    expect(wizard.currentStep.value).toBe(0)
    expect(wizard.answers.value).toEqual([])
  })

  it('collectedTags flattens option tags from answers', () => {
    const wizard = useWizard()
    wizard.startWizard()

    for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
      wizard.currentStep.value = i
      wizard.selectOption(0)
    }

    const tags = wizard.collectedTags.value
    expect(tags).toContain('copyleft')
    expect(tags).toContain('commercial-ok')
    expect(tags.length).toBeGreaterThan(QUIZ_QUESTIONS.length - 1)
  })

  it('auto-selects first options when debugAutoSelect is true', () => {
    const wizard = useWizard({ debugAutoSelect: true })
    wizard.startWizard()

    expect(wizard.answers.value).toEqual(
      new Array(QUIZ_QUESTIONS.length).fill(0)
    )
  })

  it('leaves answers empty when debugAutoSelect is false', () => {
    const wizard = useWizard({ debugAutoSelect: false })
    wizard.startWizard()
    expect(wizard.answers.value).toEqual([])
  })
})
