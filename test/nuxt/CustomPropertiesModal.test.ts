/**
 * Nuxt: custom @property modal open/save/delete.
 *
 * Casual notes use // ... above important lines in app code;
 * tests stay readable with a file-level JSDoc only where dense.
 */
import { describe, expect, it, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { nextTick } from 'vue'
import CustomPropertiesModal from '~/components/CustomPropertiesModal.vue'

// ... test suite for 'CustomPropertiesModal'
describe('CustomPropertiesModal', () => {
  // ... cleanup after each case
  afterEach(() => {
    document.body.innerHTML = ''
  })

  // ... is hidden when closed
  it('is hidden when closed', async () => {
    await mountSuspended(CustomPropertiesModal, {
      props: {
        isOpen:     false,
        properties: []
      },
      attachTo: document.body
    })

    await nextTick()
    expect(document.body.querySelector('.modal-container')).toBeNull()
  })

  // ... opens, adds a property, and emits update on save
  it('opens, adds a property, and emits update on save', async () => {
    const wrapper = await mountSuspended(CustomPropertiesModal, {
      props: {
        isOpen:     true,
        properties: []
      },
      attachTo: document.body
    })

    await nextTick()
    // ... empty state copy
    expect(document.body.textContent).toContain('Custom Properties')
    expect(document.body.textContent).toContain('No custom properties yet.')

    // ... add a blank row
    const addBtn = Array.from(document.body.querySelectorAll('button'))
      .find(b => b.textContent?.includes('Add Property'))
    addBtn?.click()
    await nextTick()

    const inputs = document.body.querySelectorAll('input')
    expect(inputs.length).toBeGreaterThanOrEqual(2)

    // ... fill key/value via native input events (Vue v-model)
    const keyInput = inputs[0] as HTMLInputElement
    const valInput = inputs[1] as HTMLInputElement
    keyInput.value = 'version'
    keyInput.dispatchEvent(new Event('input'))
    valInput.value = '1.0.0'
    valInput.dispatchEvent(new Event('input'))
    await nextTick()

    // ... save and assert the update payload
    const saveBtn = Array.from(document.body.querySelectorAll('button'))
      .find(b => b.textContent?.includes('Save Properties'))
    saveBtn?.click()
    await nextTick()

    expect(wrapper.emitted('update')?.[0]?.[0]).toEqual([
      { key: 'version', value: '1.0.0' }
    ])
  })

  // ... emits close when the close control is used
  it('emits close when the close control is used', async () => {
    const wrapper = await mountSuspended(CustomPropertiesModal, {
      props: {
        isOpen:     true,
        properties: [ { key: 'since', value: '2024' } ]
      },
      attachTo: document.body
    })

    await nextTick()
    const closeBtn = document.body.querySelector('.btn-icon') as HTMLButtonElement | null
    expect(closeBtn).toBeTruthy()
    closeBtn!.click()
    await nextTick()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  // ... removes a property row
  it('removes a property row', async () => {
    await mountSuspended(CustomPropertiesModal, {
      props: {
        isOpen:     true,
        properties: [
          { key: 'version', value: '1' },
          { key: 'since', value: '2024' }
        ]
      },
      attachTo: document.body
    })

    // Open watch only copies on isOpen change — force re-open via prop update is hard;
    // add then delete instead.
    await nextTick()

    // Seed via add if open-copy did not run (initial open uses empty localProperties)
    // Trigger open path by clicking add twice then delete one
    const addBtn = Array.from(document.body.querySelectorAll('button'))
      .find(b => b.textContent?.includes('Add Property'))
    addBtn?.click()
    addBtn?.click()
    await nextTick()

    const deletes = document.body.querySelectorAll('.btn-delete')
    expect(deletes.length).toBeGreaterThan(0)
    ;(deletes[0] as HTMLButtonElement).click()
    await nextTick()

    expect(document.body.querySelectorAll('.btn-delete').length).toBe(deletes.length - 1)
  })

  // ... closes when backdrop is clicked
  it('closes when backdrop is clicked', async () => {
    const wrapper = await mountSuspended(CustomPropertiesModal, {
      props: {
        isOpen:     true,
        properties: []
      },
      attachTo: document.body
    })

    await nextTick()
    const backdrop = document.body.querySelector('.fixed.inset-0.z-\\[100\\]') as HTMLElement | null
      || document.body.querySelector('[class*="backdrop-blur"]') as HTMLElement | null
    expect(backdrop).toBeTruthy()
    backdrop!.click()
    await nextTick()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  // ... deep-copies properties when opening via isOpen watch
  it('deep-copies properties when opening via isOpen watch', async () => {
    const wrapper = await mountSuspended(CustomPropertiesModal, {
      props: {
        isOpen:     false,
        properties: [ { key: 'seed', value: '1' } ]
      },
      attachTo: document.body
    })

    await nextTick()
    expect(document.body.querySelector('.modal-container')).toBeNull()

    await wrapper.setProps({ isOpen: true })
    await nextTick()

    expect(document.body.textContent).toContain('Custom Properties')
    const keyInput = document.body.querySelector('input') as HTMLInputElement | null
    expect(keyInput?.value).toBe('seed')
  })
})

