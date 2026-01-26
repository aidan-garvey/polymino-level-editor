<!-- Non-interactive view of a junk piece -->
<template>
  <div
    class="pdx-junk-editor-piece-view"
    :style="gridStyle"
  >
    <!-- TODO: need to tell the block not to show the drag cursor -->
    <pdx-block
      v-for="(pos, index) in blockPositions"
      :key="index"
      :grid
      :row="pos.cellGridRow"
      :col="pos.cellGridCol"
      :style="{
        gridRow: pos.cssGridRow,
        gridColumn: pos.cssGridCol,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { Junk } from '@/types/Junk'
import type { JunkBlockPosition } from '@/types/JunkBlockPosition'
import type { CellGrid } from '@/types/CellGrid'
import { BlockState } from '@/types/BlockState'

const props = defineProps<{
  junk: Junk
  grid: CellGrid
}>()

const gridStyle = computed<CSSProperties>(() => {
  return {
    width: `calc(${props.junk.width} * var(--block-size))`,
    height: `calc(${props.junk.height} * var(--block-size))`,
    gridTemplateColumns: `repeat(${props.junk.width}, 1fr)`,
    gridTemplateRows: `repeat(${props.junk.height}, 1fr)`,
  }
})

// I tried extracting this into a composable by passing `grid` and `junk` to a
// function which returned an identical `computed`, but it didn't work for some
// reason, I guess it must be related to the specific properties in each object
// which are reactive. Copy-paste it is :-(
const blockPositions = computed<JunkBlockPosition[]>(() => {
  const result: JunkBlockPosition[] = []

  for (const [row, col] of props.grid.junkBlockPositions(props.junk)) {
    const cell = props.grid.getBlock(row, col)
    if (cell.state === BlockState.JUNK) {
      const vOffset = row - props.junk.bottomRow
      result.push({
        cellGridRow: row,
        cellGridCol: col,
        cssGridRow: props.junk.height - vOffset,
        cssGridCol: col - props.junk.leftColumn + 1,
      })
    }
  }

  return result
})
</script>

<style lang="scss">
.pdx-junk-editor-piece-view {
  display: grid;
}
</style>
