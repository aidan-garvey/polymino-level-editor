<template>
  <pdx-input-wrapper
    :id
    :label
    :inline-label
    :tooltip
  >
    <input
      type="text"
      v-model="modelValue"
      :id
    />
  </pdx-input-wrapper>
</template>

<script setup lang="ts">
import type { PdxInputProps } from './types'

const modelValue = defineModel<string>({ required: true })

const props = defineProps<PdxInputProps>()

const id = useId()
</script>
