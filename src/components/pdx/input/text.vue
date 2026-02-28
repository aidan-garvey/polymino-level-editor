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

interface PdxInputTextProps extends PdxInputProps {
  allowedChars?: RegExp
  maxLength?: number
}

const props = defineProps<PdxInputTextProps>()

const id = useId()

watch(modelValue, () => {
  if (props.allowedChars) {
    modelValue.value = modelValue.value
      .split('')
      .filter(c => props.allowedChars?.test(c))
      .join('')
  }
  if (typeof props.maxLength === 'number') {
    modelValue.value = modelValue.value.slice(0, props.maxLength)
  }
})
</script>
