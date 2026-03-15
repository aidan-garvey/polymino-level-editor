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
      @focus="e => emit('focus', e)"
      @blur="e => emit('blur', e)"
    />
  </pdx-input-wrapper>
</template>

<script setup lang="ts">
import type { PdxInputProps, PdxInputEmits } from './types'

const modelValue = defineModel<string>({ required: true })

interface PdxInputTextProps extends PdxInputProps {
  allowedChars?: RegExp
  maxLength?: number
}

const props = defineProps<PdxInputTextProps>()

const emit = defineEmits<PdxInputEmits>()

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
