/**
 * Nuxt: quiz wizard progress + next/back + auto-advance.
 */
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import QuizWizard from '~/components/QuizWizard.vue'
import { QUIZ_QUESTIONS } from '~/data/questions'

// ... test suite for 'QuizWizard'
describe('QuizWizard', () => {
  const question = QUIZ_QUESTIONS[0]

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // ... renders question text and both options
  it('renders question text and both options', async () => {
    const wrapper = await mountSuspended(QuizWizard, {
      props: {
        question,
        currentStep: 0,
        totalSteps:  QUIZ_QUESTIONS.length,
        answers:     [],
        canAdvance:  false
      }
    })

    expect(wrapper.text()).toContain(question.question)
    expect(wrapper.text()).toContain(question.options[0].title)
    expect(wrapper.text()).toContain(question.options[1].title)
    expect(wrapper.text()).toContain('Question')
    expect(wrapper.text()).toContain('Next Step')
  })

  // ... emits select then auto-emits next after the transition delay
  it('emits select and auto-advances next after selecting an option', async () => {
    const wrapper = await mountSuspended(QuizWizard, {
      props: {
        question,
        currentStep: 0,
        totalSteps:  QUIZ_QUESTIONS.length,
        answers: [],
        canAdvance:  true
      }
    })

    const cards = wrapper.findAll('.opt-card')
    expect(cards.length).toBe(2)
    await cards[0].trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual([ 0 ])
    expect(wrapper.emitted('next')).toBeFalsy()

    await vi.advanceTimersByTimeAsync(420)
    expect(wrapper.emitted('next')).toHaveLength(1)
  })

  // ... Next button still works
  it('emits next from the Next Step button', async () => {
    const wrapper = await mountSuspended(QuizWizard, {
      props: {
        question,
        currentStep: 0,
        totalSteps:  QUIZ_QUESTIONS.length,
        answers:     [ 0 ],
        canAdvance:  true
      }
    })

    const next = wrapper.findAll('button').find(b => b.text().includes('Next Step'))
    await next!.trigger('click')
    // rAF may be needed; flush timers
    await vi.advanceTimersByTimeAsync(50)
    expect(wrapper.emitted('next')?.length).toBeGreaterThanOrEqual(1)
  })

  // ... shows Back and emits prev when not on first step
  it('shows Back and emits prev when not on first step', async () => {
    const wrapper = await mountSuspended(QuizWizard, {
      props: {
        question:    QUIZ_QUESTIONS[1],
        currentStep: 1,
        totalSteps:  QUIZ_QUESTIONS.length,
        answers:     [ 0, 1 ],
        canAdvance:  true
      }
    })

    const back = wrapper.findAll('button').find(b => b.text().includes('Back'))
    expect(back).toBeTruthy()
    await back!.trigger('click')
    expect(wrapper.emitted('prev')).toHaveLength(1)
  })
})
