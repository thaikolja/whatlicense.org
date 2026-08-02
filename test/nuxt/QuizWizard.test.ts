import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import QuizWizard from '~/components/QuizWizard.vue'
import { QUIZ_QUESTIONS } from '~/data/questions'

describe('QuizWizard', () => {
  const question = QUIZ_QUESTIONS[0]

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

  it('emits select and next', async () => {
    const wrapper = await mountSuspended(QuizWizard, {
      props: {
        question,
        currentStep: 0,
        totalSteps:  QUIZ_QUESTIONS.length,
        answers:     [ 0 ],
        canAdvance:  true
      }
    })

    const cards = wrapper.findAll('.opt-card')
    expect(cards.length).toBe(2)
    await cards[0].trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual([ 0 ])

    const next = wrapper.findAll('button').find(b => b.text().includes('Next Step'))
    await next!.trigger('click')
    expect(wrapper.emitted('next')).toHaveLength(1)
  })

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
