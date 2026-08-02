import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IntroScreen from '~/components/IntroScreen.vue'

describe('IntroScreen', () => {
  it('renders headline and emits start', async () => {
    const wrapper = await mountSuspended(IntroScreen)

    expect(wrapper.text()).toContain('What license')
    expect(wrapper.text()).toContain('do I need?')
    expect(wrapper.text()).toContain('Smart License Wizard')

    const startBtn = wrapper.findAll('button').find(b => b.text().includes('Start Wizard'))
    expect(startBtn).toBeTruthy()
    await startBtn!.trigger('click')
    expect(wrapper.emitted('start')).toHaveLength(1)
  })
})
