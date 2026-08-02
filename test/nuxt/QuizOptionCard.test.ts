/**
 * Nuxt: quiz option card select emit.
 *
 * Casual notes use // ... above important lines in app code;
 * tests stay readable with a file-level JSDoc only where dense.
 */
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

// ... test suite for 'QuizOptionCard'
describe('QuizOptionCard', () => {
  // ... renders option title, description, and example
  it('renders option title, description, and example', async () => {
    const wrapper = await mountSuspended(QuizOptionCard, {
      props: { option, selected: false }
    })

    expect(wrapper.text()).toContain('Permissive')
    expect(wrapper.text()).toContain('Others can use your code freely.')
    expect(wrapper.text()).toContain('A company embeds your library.')
    expect(wrapper.classes()).not.toContain('selected')
  })

  // ... applies selected class and emits select on click
  it('applies selected class and emits select on click', async () => {
    const wrapper = await mountSuspended(QuizOptionCard, {
      props: { option, selected: true }
    })

    expect(wrapper.classes()).toContain('selected')
    await wrapper.trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(1)
  })

  // ... is a real button for a11y
  it('renders as a button with aria-pressed', async () => {
    const wrapper = await mountSuspended(QuizOptionCard, {
      props: { option, selected: false }
    })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('aria-pressed')).toBe('false')
  })
})
