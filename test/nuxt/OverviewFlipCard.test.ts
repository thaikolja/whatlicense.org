import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import OverviewFlipCard from '~/components/OverviewFlipCard.vue'

const items = [
  { label: 'Commercial use', example: 'Sell products with this code.' },
  { label: 'Modification', example: 'Change the code.' }
]

describe('OverviewFlipCard', () => {
  it('renders category labels and flips to examples', async () => {
    const wrapper = await mountSuspended(OverviewFlipCard, {
      props: {
        category:   'Permissions',
        items,
        colorTheme: 'green'
      }
    })

    expect(wrapper.text()).toContain('Permissions')
    expect(wrapper.text()).toContain('Commercial use')
    expect(wrapper.classes()).not.toContain('flipped')

    const exampleBtn = wrapper.findAll('button').find(b => b.text().includes('Example'))
    await exampleBtn!.trigger('click')
    expect(wrapper.classes()).toContain('flipped')
    expect(wrapper.text()).toContain('Sell products with this code.')

    const backBtn = wrapper.findAll('button').find(b => b.text().includes('Back'))
    await backBtn!.trigger('click')
    expect(wrapper.classes()).not.toContain('flipped')
  })

  it('supports conditions and limitations themes', async () => {
    const conditions = await mountSuspended(OverviewFlipCard, {
      props: {
        category:   'Conditions',
        items,
        colorTheme: 'blue'
      }
    })
    expect(conditions.text()).toContain('Conditions')

    const limitations = await mountSuspended(OverviewFlipCard, {
      props: {
        category:   'Limitations',
        items:      [ { label: 'Liability', example: 'No liability.' } ],
        colorTheme: 'red'
      }
    })
    expect(limitations.text()).toContain('Limitations')
    expect(limitations.text()).toContain('Liability')
  })
})
