<template>
  <pdx-cell-grid
    :editor
    :grid="editor.junkLayer.board"
    :should-show
    @cell-drag-over="(...args) => editor.junkLayer.onCellDragOver(...args)"
    @cell-drop="(...args) => editor.onCellDrop(...args)"
    @junk-clicked="(...args) => editor.selectJunk(...args)"
  />
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import { BlockState } from '@/types/BlockState'

const props = defineProps<{
  editor: Editor
}>()

// Prevent empty cells from rendering, so the brush layer gets pointerdown and
// pointerenter events which we won't handle.
const shouldShow = (row: number, col: number) => {
  const block = props.editor.junkLayer.board.getBlock(row, col)
  return block.state !== BlockState.EMPTY
}
</script>
