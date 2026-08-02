/**
 * Nuxt: smoke mount for @nuxt/test-utils wiring.
 *
 * Casual notes use //above important lines in app code;
 * tests stay readable with a file-level JSDoc only where dense.
 */
import { describe, expect, it } from 'vitest'
import { mountSuspended }       from '@nuxt/test-utils/runtime'
import { defineComponent, h }   from 'vue'

//test suite for 'component test example'
describe('component test example', () => {
  //can mount components
  it('can mount components', async () => {
    const TestComponent = defineComponent({
      setup() {
        return () => h('div', 'Hello Nuxt!')
      }
    })

    const component = await mountSuspended(TestComponent)

    expect(component.text()).toBe('Hello Nuxt!')
  })
})
