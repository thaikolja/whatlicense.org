<template>
  <UModal v-model="localIsOpen" prevent-close>
    <UCard :ui="{ background: 'bg-[#fdfaf6]', ring: 'ring-1 ring-[#ebdccc]', divide: 'divide-y divide-[#ebdccc]' }" class="p-4 rounded-3xl">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="serif text-2xl font-bold text-[#433a31] mb-2">Custom Properties</h3>
            <p class="text-sm text-[#827263]">Add your own @ properties to the file header.</p>
          </div>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
        </div>
      </template>

      <div class="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        <div v-for="(prop, index) in localProperties" :key="index" class="flex gap-2">
          <div class="relative w-1/3">
            <span class="absolute left-3 top-2 text-[#827263] font-mono text-sm z-10">@</span>
            <UInput v-model="prop.key" placeholder="key" class="font-mono" :ui="{ icon: { leading: { pointer: '' } } }">
              <template #leading>
                <div class="w-3"></div>
              </template>
            </UInput>
          </div>
          <UInput v-model="prop.value" placeholder="value" class="flex-1" />
          <UButton
              color="red" variant="ghost" icon="i-heroicons-trash" @click="removeProperty(index)" class="shrink-0" />
        </div>
        <div v-if="localProperties.length === 0" class="text-center py-4 text-[#827263] text-sm italic">
          No custom properties yet.
        </div>
      </div>

      <UButton
          color="gray" variant="outline" block icon="i-heroicons-plus" class="py-3 rounded-xl border-dashed border-[#b59b84] text-[#b59b84] hover:bg-[#f9f5f0] mb-6" @click="addProperty">
        Add Property
      </UButton>

      <template #footer>
        <UButton
            block class="btn py-3 rounded-xl font-bold uppercase tracking-wide bg-[#433a31] text-white hover:bg-[#26211c]" @click="save">
          Save Properties
        </UButton>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
  import { ref, watch }          from 'vue'
  import type { CustomProperty } from '~/types'

  const props = defineProps<{
    isOpen: boolean
    properties: CustomProperty[]
  }>()

  const emit = defineEmits<{
    (e: 'close'): void
    (e: 'update', props: CustomProperty[]): void
  }>()

  const localIsOpen     = ref(props.isOpen)
  const localProperties = ref<CustomProperty[]>([])

  watch(() => props.isOpen, (newVal) => {
    localIsOpen.value = newVal
    if (newVal) {
      // deep copy
      localProperties.value = JSON.parse(JSON.stringify(props.properties))
    }
  })

  watch(localIsOpen, (newVal) => {
    if (!newVal && props.isOpen) {
      emit('close')
    }
  })

  const closeModal = () => {
    localIsOpen.value = false
    emit('close')
  }

  const addProperty = () => {
    localProperties.value.push({ key: '', value: '' })
  }

  const removeProperty = (index: number) => {
    localProperties.value.splice(index, 1)
  }

  const save = () => {
    // filter out completely empty ones
    const filtered = localProperties.value.filter(p => p.key.trim()!=='' || p.value.trim()!=='')
    emit('update', filtered)
    closeModal()
  }
</script>

<style scoped>
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background:    rgba(181, 155, 132, 0.3);
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(181, 155, 132, 0.5);
  }
</style>
