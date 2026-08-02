import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import QuizOptionCard from '~/components/QuizOptionCard.vue'
import type { QuizOption } from '~/types'

const option: QuizOption = {
  title:   'Permissive',
  desc:    'Others can use your code freely.',
  example: 'A company embeds your library.',
  tags:    [ 'permissive' ]
}

describe('QuizOptionCard', () => {
  it('renders option title, description, and example', async () => {
    const wrapper = await mountSuspended(QuizOptionCard, {
      props: { option, selected: false }
    })

    expect(wrapper.text()).toContain('Permissive')
    expect(wrapper.text()).toContain('Others can use your code freely.')
    expect(wrapper.text()).toContain('A company embeds your library.')
    expect(wrapper.classes()).not.toContain('selected')
  })

  it('applies selected class and emits select on click', async () => {
    const wrapper = await mountSuspended(QuizOptionCard, {
      props: { option, selected: true }
    })

    expect(wrapper.classes()).toContain('selected')
    await wrapper.trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(1)
  })
})
