/**
 * Unit: branching wizard navigation + tags.
 *
 * Casual notes use //above important lines in app code;
 * tests stay readable with a file-level JSDoc only where dense.
 */
import { describe, expect, it } from 'vitest'
import { useWizard } from '../../app/composables/useWizard'

//test suite for 'useWizard'
describe('useWizard', () => {
  //starts on intro with empty answers
  it('starts on intro with empty answers', () => {
    const wizard = useWizard()

    expect(wizard.currentScreen.value).toBe('intro')
    expect(wizard.currentStep.value).toBe(0)
    expect(wizard.answers.value).toEqual([])
    // Before answering share, only 3 base questions are active
    expect(wizard.totalSteps.value).toBe(3)
    expect(wizard.canAdvance.value).toBe(false)
  })

  //moves intro → quiz → through steps → result (permissive path, 3 steps)
  it('moves intro → quiz → through steps → result (permissive path, 3 steps)', () => {
    const wizard = useWizard()

    wizard.startWizard()
    expect(wizard.currentScreen.value).toBe('quiz')
    expect(wizard.answers.value).toEqual([])

    // Q1 permissive
    wizard.selectOption(1)
    expect(wizard.totalSteps.value).toBe(3)
    wizard.nextStep()

    // Q2 commercial
    wizard.selectOption(0)
    wizard.nextStep()

    // Q3 patents
    wizard.selectOption(1)
    wizard.nextStep()

    expect(wizard.currentScreen.value).toBe('result')
  })

  //unlocks scope and network when copyleft is chosen (5 steps)
  it('unlocks scope and network when copyleft is chosen (5 steps)', () => {
    const wizard = useWizard()
    wizard.startWizard()

    wizard.selectOption(0) // copyleft
    expect(wizard.totalSteps.value).toBe(5)

    for (let i = 0; i < 5; i++) {
      wizard.currentStep.value = i
      wizard.selectOption(0)
      wizard.nextStep()
    }

    expect(wizard.currentScreen.value).toBe('result')
    // Strong path keeps family + strength tags
    expect(wizard.collectedTags.value).toContain('copyleft')
    expect(wizard.collectedTags.value).toContain('strong-copyleft')
    expect(wizard.collectedTags.value).toContain('network-copyleft')
  })

  //weak path collected tags drop bare copyleft
  it('weak path collected tags drop bare copyleft', () => {
    const wizard = useWizard()
    wizard.startWizard()
    const choices = [ 0, 0, 0, 1, 1 ] // copyleft, commercial, patents, weak, no-network
    for (let i = 0; i < choices.length; i++) {
      wizard.currentStep.value = i
      wizard.selectOption(choices[i]!)
      if (i < choices.length - 1) wizard.nextStep()
    }
    expect(wizard.collectedTags.value).toContain('weak-copyleft')
    expect(wizard.collectedTags.value).not.toContain('copyleft')
  })


  //prevStep returns to intro from first quiz step
  it('prevStep returns to intro from first quiz step', () => {
    const wizard = useWizard()
    wizard.startWizard()
    wizard.prevStep()
    expect(wizard.currentScreen.value).toBe('intro')
  })

  //prevStep decrements step when not first
  it('prevStep decrements step when not first', () => {
    const wizard = useWizard()
    wizard.startWizard()
    wizard.selectOption(1)
    wizard.nextStep()
    expect(wizard.currentStep.value).toBe(1)
    wizard.prevStep()
    expect(wizard.currentStep.value).toBe(0)
  })

  //resetWizard clears state
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

  //collectedTags flattens option tags from answers
  it('collectedTags flattens option tags from answers', () => {
    const wizard = useWizard()
    wizard.startWizard()

    // permissive path
    wizard.selectOption(1)
    wizard.nextStep()
    wizard.selectOption(0)
    wizard.nextStep()
    wizard.selectOption(1)

    const tags = wizard.collectedTags.value
    expect(tags).toContain('permissive')
    expect(tags).toContain('commercial-ok')
    expect(tags).toContain('no-patent')
    expect(tags).not.toContain('copyleft')
    expect(tags).not.toContain('strong-copyleft')
  })

  //auto-selects first options when debugAutoSelect is true
  it('auto-selects first options when debugAutoSelect is true', () => {
    const wizard = useWizard({ debugAutoSelect: true })
    wizard.startWizard()

    // Option 0 on share = copyleft → 5 steps filled with 0
    expect(wizard.answers.value).toEqual([ 0, 0, 0, 0, 0 ])
    expect(wizard.totalSteps.value).toBe(5)
  })

  //leaves answers empty when debugAutoSelect is false
  it('leaves answers empty when debugAutoSelect is false', () => {
    const wizard = useWizard({ debugAutoSelect: false })
    wizard.startWizard()
    expect(wizard.answers.value).toEqual([])
  })

  //changing share answer drops later answers
  it('changing share answer drops later answers', () => {
    const wizard = useWizard()
    wizard.startWizard()
    wizard.selectOption(0) // copyleft
    wizard.nextStep()
    wizard.selectOption(0)
    wizard.nextStep()
    wizard.selectOption(0)
    expect(wizard.answers.value.length).toBe(3)

    wizard.currentStep.value = 0
    wizard.selectOption(1) // switch to permissive
    expect(wizard.answers.value).toEqual([ 1 ])
    expect(wizard.totalSteps.value).toBe(3)
  })

  //Back then Next preserves later answers when selection is unchanged
  it('Back then Next preserves later answers when selection is unchanged', () => {
    const wizard = useWizard()
    wizard.startWizard()
    for (let i = 0; i < 5; i++) {
      wizard.currentStep.value = i
      wizard.selectOption(0)
      if (i < 4) wizard.nextStep()
    }
    expect(wizard.answers.value).toEqual([ 0, 0, 0, 0, 0 ])

    wizard.prevStep()
    wizard.prevStep()
    expect(wizard.currentStep.value).toBe(2)
    expect(wizard.answers.value).toEqual([ 0, 0, 0, 0, 0 ])

    wizard.nextStep()
    expect(wizard.currentStep.value).toBe(3)
    expect(wizard.answers.value).toEqual([ 0, 0, 0, 0, 0 ])
  })

  //re-selecting the same option after Back keeps later answers
  it('re-selecting the same option after Back keeps later answers', () => {
    const wizard = useWizard()
    wizard.startWizard()
    for (let i = 0; i < 5; i++) {
      wizard.currentStep.value = i
      wizard.selectOption(0)
      if (i < 4) wizard.nextStep()
    }
    wizard.currentStep.value = 1
    wizard.selectOption(0) // same as already selected
    expect(wizard.answers.value).toEqual([ 0, 0, 0, 0, 0 ])
  })
})


