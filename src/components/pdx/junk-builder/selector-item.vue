<template>
  <div
    ref="itemRef"
    class="pdx-junk-builder-selector-item"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <pdx-block
      :grid="grid"
      :row="row"
      :col="col"
      @click="onClick"
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
  padding: 4px;
}
</style>
