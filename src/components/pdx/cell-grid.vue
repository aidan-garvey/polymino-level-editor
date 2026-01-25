<template>
  <div
    class="cell-grid"
    :style="{
      gridTemplateColumns: cssGridCols
    }"
  >
    <template
      v-for="yDown in grid.height"
      :key="yDown"
    >
      <pdx-block
        v-for="x in grid.width"
        :key="x"
        :grid
        :row="grid.height - yDown"
        :col="x - 1"
        :should-show="shouldShow"
        :get-opacity="getOpacity"
        @cell-pointer-down="(...args) => emit('cellPointerDown', ...args)"
        @cell-pointer-enter="(...args) => emit('cellPointerEnter', ...args)"
        @cell-drag-over="(...args) => emit('cellDragOver', ...args)"
        @cell-drop="(...args) => emit('cellDrop', ...args)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CellGrid } from '@/types/CellGrid'

const props = withDefaults(defineProps<{
  grid: CellGrid
  shouldShow?: (row: number, col: number) => boolean
  getOpacity?: (row: number, col: number) => number
}>(), {
  shouldShow: () => true,
  getOpacity: () => 1,
})

const emit = defineEmits<{
  cellPointerDown: [event: PointerEvent, row: number, col: number]
  cellPointerEnter: [event: PointerEvent, row: number, col: number]
  cellDragOver: [event: DragEvent, row: number, col: number]
  cellDrop: [event: DragEvent, row: number, col: number]
}>()

const cssGridCols = computed(() => `repeat(${props.grid.width}, 1fr)`)
</script>

<style lang="scss">
.cell-grid {
  display: grid;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
