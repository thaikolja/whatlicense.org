import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import App from '~/app.vue'

describe('app.vue shell', () => {
  it('renders branding, nav icons, and footer links', async () => {
    const wrapper = await mountSuspended(App, {
      global: {
        stubs: {
          NuxtPage:  true,
          NuxtLink:  {
            props:    [ 'to' ],
            template: '<a :href="to"><slot /></a>'
          },
          Icon: {
            props:    [ 'name' ],
            template: '<span class="icon-stub">{{ name }}</span>'
          }
        }
      }
    })

    expect(wrapper.text()).toContain('whatlicense')
    expect(wrapper.text()).toContain('.org')
    expect(wrapper.text()).toContain('About')
    expect(wrapper.text()).toContain('Privacy')
    expect(wrapper.text()).toContain('Terms')
    expect(wrapper.text()).toContain('Support')
    expect(wrapper.text()).toContain('GitHub')
    expect(wrapper.text()).toMatch(/©\s*\d{4}\s*whatlicense\.org/)

    // Social icons rendered (header)
    expect(wrapper.html()).toContain('mdi:paypal')
    expect(wrapper.html()).toContain('mdi:github')
    expect(wrapper.html()).toContain('mdi:envelope')
    // Email must use links.email (mailto:…), never mailto:undefined
    expect(wrapper.html()).toContain('mailto:kolja.nolte@gmail.com')
    expect(wrapper.html()).not.toContain('mailto:undefined')
  })
})


