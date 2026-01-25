<template>
  <div
    ref="itemRef"
    class="pdx-junk-builder-selector-item"
    :class="{
      'pdx-junk-builder-selector-item--selected': isSelected,
    }"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @click="onClick"
  >
    <pdx-block
      :grid="grid"
      :row="row"
      :col="col"
    />
  </div>
</template>

<script setup lang="ts">
import type { CellGrid } from '@/types/CellGrid'
import { useTooltip } from '@/use/tooltip'

const props = defineProps<{
  grid: CellGrid
  row: number
  col: number
  /** Acts as the tooltip text and name */
  tooltip: string
  isSelected: boolean
  onClick: () => void
}>()

const itemRef = useTemplateRef('itemRef')

const tooltipText = computed(() => {
  return props.tooltip
})

const { onPointerEnter, onPointerLeave } = useTooltip(
  tooltipText,
  tooltipText,
  itemRef
)
</script>

<style lang="scss">
.pdx-junk-builder-selector-item {
  padding: 8px;
  cursor: pointer;

  &--selected {
    box-shadow: inset 0 0 3px 3px #111;
    background: radial-gradient(
      closest-side at center,
      oklch(var(--lch-yellow)) 0%,
      oklch(var(--lch-yellow) / 0) 100%
    );
  }
}
</style>
