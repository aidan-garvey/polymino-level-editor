<template>
  <div
    ref="optionRef"
    class="pdx-radio-option"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <!--
    Vue ensures only one radio button with the given modelValue is selected, but
    `name` is still needed for keyboard navigation
    -->
    <input type="radio"
      v-model="modelValue"
      :id="id"
      :name="groupName"
      :value="option"
    />
    <label
      :for="id"
      class="pdx-radio-group__label text-detail"
    >
      {{ option }}
    </label>
  </div>
</template>

<script setup lang="ts" generic="T extends string">
import { useTooltip } from '@/use/tooltip'

const modelValue = defineModel<T>({ required: true })

const props = defineProps<{
  option: T
  groupName: string
  tooltip?: string
}>()

const optionRef = useTemplateRef('optionRef')

const id = computed(() => `${props.groupName}-${props.option}`)

const tooltipText = computed(() => props.tooltip ?? '')

const {
  onPointerEnter,
  onPointerLeave,
} = useTooltip(
  id,
  tooltipText,
  optionRef,
)
</script>

<style lang="scss">
.pdx-radio-option {
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
