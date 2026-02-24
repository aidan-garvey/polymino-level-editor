<template>
  <pdx-input-wrapper
    :id
    :label
    :inline-label
    :tooltip
  >
    <input
      type="number"
      v-model.number="boundedValue"
      :id
      :min
      :max
    />
  </pdx-input-wrapper>
</template>

<script setup lang="ts">
import type { PdxInputProps } from './types'

const modelValue = defineModel<number>({ required: true })

interface PdxInputNumberProps extends PdxInputProps {
  min?: number
  max?: number
}

const props = withDefaults(defineProps<PdxInputNumberProps>(), {
  min: -Infinity,
  max: Infinity,
})

const id = useId()

/**
 * Use a proxy for modelValue so we can ensure that an out-of-bounds value is
 * never written to it.
 */
const boundedValue = computed<number>({
  get: () => modelValue.value,
  set: val => {
    modelValue.value = Math.max(props.min, Math.min(props.max, val))
  }
})
</script>
