<template>
  <div
    ref="checkboxRef"
    class="pdx-checkbox"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <input type="checkbox"
      v-model="modelValue"
      :id
    />
    <label
      :for="id"
      class="text-detail"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { useTooltip } from '@/use/tooltip'

const modelValue = defineModel<boolean>({ required: true })

const props = defineProps<{
  label: string
  tooltip?: string
}>()

const id = useId()

const checkboxRef = useTemplateRef('checkboxRef')

const tooltipText = computed(() => props.tooltip ?? '')

const {
  onPointerEnter,
  onPointerLeave,
} = useTooltip(
  id,
  tooltipText,
  checkboxRef,
)
</script>

<style lang="scss">
.pdx-checkbox {
  display: flex;
  align-items: center;

  input {
    margin: 0;
  }
  label {
    // Use padding on the label instead of gap on the parent, because the gap
    // wouldn't be clickable
    padding-left: 4px;
    user-select: none;
  }
}
</style>
