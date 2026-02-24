<!--
Provides common style and functionality for multiple input variants. Each input
variant uses this wrapper and is responsible for inserting and controlling an
<input> element in this component's default slot.
-->
<template>
  <div
    ref="inputRef"
    class="pdx-input-wrapper text-body"
    :style="{
      flexDirection: inlineLabel ? 'row' : 'column',
    }"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <label
      :for="id"
      :class="{
        'text-detail': !inlineLabel,
      }"
    >
      {{ label }}
    </label>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import type { PdxInputProps } from './types'
import { useTooltip } from '@/use/tooltip'

interface PdxInputWrapperProps extends PdxInputProps {
  /**
   * The input's "id" attribute, used as the label's "for" attribute.
   */
  id: string
}

const props = defineProps<PdxInputWrapperProps>()

const inputRef = useTemplateRef('inputRef')

const tooltipText = computed(() => props.tooltip ?? '')

const {
  onPointerEnter,
  onPointerLeave
} = useTooltip(
  props.id,
  tooltipText,
  inputRef
)
</script>

<style lang="scss">
.pdx-input-wrapper {
  display: flex;
  flex-direction: row;
  column-gap: 4px;
  align-items: stretch;

  label {
    flex: 0;
    white-space: nowrap;
  }

  input {
    flex: 1;

    appearance: none;
    outline: none;
    background: #111;
    border: 1px solid #444;
    border-radius: 0;
    color: #fff;

    transition: border-color ease-out 0.05s;

    &:focus {
      border-color: #fff;
    }
  }
}
</style>
