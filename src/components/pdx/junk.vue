<template>
  <div
    ref="junkRef"
    class="pdx-junk"
    :style="{
      gridRow,
      gridColumn,
    }"
    :draggable="grid.draggableJunk"
    @dragstart="onDragStart"
  >
    <pdx-block
      v-for="(pos, index) of blockPositions"
      :key="index"
      :grid
      :row="pos.cellGridRow"
      :col="pos.cellGridCol"
      :style="{
        gridRow: pos.cssGridRow,
        gridColumn: pos.cssGridCol,
      }"
      @cell-pointer-down="(...args) => emit('cellPointerDown', ...args)"
      @cell-pointer-enter="(...args) => emit('cellPointerEnter', ...args)"
      @cell-drag-over="(...args) => emit('cellDragOver', ...args)"
      @cell-drop="(...args) => emit('cellDrop', ...args)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Junk } from '@/types/Junk'
import type { CellGrid } from '@/types/CellGrid'
import type { Editor } from '@/types/Editor'
import { BlockState } from '@/types/BlockState'
import { setJunkDragData } from '@/types/JunkDrag'

type BlockPosition = {
  /** 0-based index relative to the bottom of the board */
  cellGridRow: number
  /** 0-based index relative to the left of the board */
  cellGridCol: number
  /** 1-based index relative to the top of the junk piece */
  cssGridRow: number
  /** 1-based index relative to the left of the junk piece */
  cssGridCol: number
}

// each block's flex row number is grid.height - block.row
// so we find the CSS row number of the top row in the junk piece, then pass
// that as the initial row and the height of the junk piece as the row span

const props = defineProps<{
  junk: Junk
  grid: CellGrid
  editor: Editor
}>()

// Junk needs to bubble all events since it can be in the brush and junk layers,
// e.g. blocking brush-related events prevents you from painting over 1x1 junk
// blocks in the brush layer.
const emit = defineEmits<{
  cellPointerDown: [event: PointerEvent, row: number, col: number]
  cellPointerEnter: [event: PointerEvent, row: number, col: number]
  cellDragOver: [event: DragEvent, row: number, col: number]
  cellDrop: [event: DragEvent, row: number, col: number]
}>()

const junkRef = useTemplateRef('junkRef')

const gridRow = computed(() => {
  const bottomRow = props.grid.height - props.junk.bottomRow
  const topRow = bottomRow - props.junk.height + 1
  return `${topRow} / span ${props.junk.height}`
})

const gridColumn = computed(() => {
  return `${props.junk.leftColumn + 1} / span ${props.junk.width}`
})

const blockPositions = computed<BlockPosition[]>(() => {
  const result: BlockPosition[] = []

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

const setDragImage = (event: DragEvent) => {
  const dt = event.dataTransfer
  const element = junkRef.value
  if (!dt || !element)
    return

  const imageWidth = element.offsetWidth
  const imageHeight = element.offsetHeight

  const blockSize = imageWidth / props.junk.width

  dt.setDragImage(element, blockSize / 2, imageHeight - blockSize / 2)
}

const onDragStart = (event: DragEvent) => {
  if (!props.grid.draggableJunk)
    return

  props.editor.isDragging = true
  setDragImage(event)
  setJunkDragData(event, props.junk)
}
</script>

<style lang="scss">
.pdx-junk {
  display: grid;
  grid-template-rows: subgrid;
  grid-template-columns: subgrid;
  // allows stacking in the grid
  z-index: 1;
  // don't block events in lower layers, can rely on bubbling from child
  // elements to trigger dragstart on the junk piece
  pointer-events: none;
}
</style>
