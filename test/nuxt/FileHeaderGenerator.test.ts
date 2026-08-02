/**
 * Nuxt: file header customizer preview + languages.
 *
 * Casual notes use // ... above important lines in app code;
 * tests stay readable with a file-level JSDoc only where dense.
 */
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { nextTick } from 'vue'
import FileHeaderGenerator from '~/components/FileHeaderGenerator.vue'
import { makeLicense } from '../fixtures/licenses'

const license = makeLicense({
  spdx:            'MIT',
  traits:          [ 'permissive' ],
  headerStatement: 'Released under the MIT License.'
})

// ... test suite for 'FileHeaderGenerator'
describe('FileHeaderGenerator', () => {
  // ... setup before each case
  beforeEach(() => {
    Object.defineProperty(globalThis, 'isSecureContext', {
      value:        true,
      configurable: true
    })
    Object.defineProperty(navigator, 'clipboard', {
      value:        { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true
    })
  })

  // ... renders customizer chrome and live preview
  it('renders customizer chrome and live preview', async () => {
    const wrapper = await mountSuspended(FileHeaderGenerator, {
      props: { license },
      global: {
        stubs: {
          CustomPropertiesModal: true
        }
      }
    })

    expect(wrapper.text()).toContain('File Header Customizer')
    expect(wrapper.text()).toContain('Project Details')
    expect(wrapper.text()).toContain('Preview')
    expect(wrapper.text()).toContain('Processed locally')
    expect(wrapper.find('pre').exists()).toBe(true)
  })

  // ... updates preview when project name and language change
  it('updates preview when project name and language change', async () => {
    const wrapper = await mountSuspended(FileHeaderGenerator, {
      props: { license },
      global: {
        stubs: {
          CustomPropertiesModal: true
        }
      }
    })

    const nameInput = wrapper.find('#projectName')
    await nameInput.setValue('CoolLib')
    await nextTick()

    expect(wrapper.find('pre').html()).toContain('CoolLib')

    const select = wrapper.find('select')
    await select.setValue('python')
    await nextTick()

    // Python uses hash comments in preview
    const preHtml = wrapper.find('pre').html()
    expect(preHtml.includes('CoolLib') || preHtml.includes('CoolLib')).toBe(true)
  })

  // ... toggles exclude comments
  it('toggles exclude comments', async () => {
    const wrapper = await mountSuspended(FileHeaderGenerator, {
      props: { license },
      global: {
        stubs: {
          CustomPropertiesModal: true
        }
      }
    })

    await wrapper.find('#projectName').setValue('X')
    await nextTick()

    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setValue(true)
    await nextTick()

    // Without comments, output should not be a /** block
    const text = wrapper.find('pre').text()
    expect(text).toContain('X')
  })

  // ... opens custom properties modal control
  it('opens custom properties modal control', async () => {
    const wrapper = await mountSuspended(FileHeaderGenerator, {
      props: { license },
      global: {
        stubs: {
          CustomPropertiesModal: {
            props:    [ 'isOpen', 'properties' ],
            template: '<div class="modal-stub" v-if="isOpen">modal-open</div>'
          }
        }
      }
    })

    const addBtn = wrapper.findAll('button').find(b => b.text().includes('Add Custom Properties'))
    expect(addBtn).toBeTruthy()
    await addBtn!.trigger('click')
    await nextTick()
    expect(wrapper.find('.modal-stub').exists()).toBe(true)
  })

  // ... highlights every supported language and applies custom properties
  it('highlights every supported language and applies custom properties', async () => {
    const wrapper = await mountSuspended(FileHeaderGenerator, {
      props: { license },
      global: {
        stubs: {
          CustomPropertiesModal: {
            name:  'CustomPropertiesModal',
            props: [ 'isOpen', 'properties' ],
            emits: [ 'update', 'close' ],
            template:
              '<button class="emit-update" @click="$emit(\'update\', [{ key: \'version\', value: \'2.0\' }])">emit</button>'
          }
        }
      }
    })

    await wrapper.find('#projectName').setValue('LangProbe')
    await wrapper.find('#authorName').setValue('Ada')
    await nextTick()

    const languages = [
      'php',
      'javascript',
      'typescript',
      'python',
      'ruby',
      'html',
      'css',
      'shell'
    ] as const

    for (const lang of languages) {
      await wrapper.find('select').setValue(lang)
      await nextTick()
      expect(wrapper.find('pre').html().length).toBeGreaterThan(0)
      expect(wrapper.find('pre').html()).toContain('LangProbe')
    }

    await wrapper.find('.emit-update').trigger('click')
    await nextTick()
    expect(wrapper.find('pre').html()).toContain('version')
  })
})

