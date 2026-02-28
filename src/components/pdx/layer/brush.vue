<template>
  <pdx-cell-grid
    :editor
    :grid="editor.brushLayer.board"
    :should-show
    @cell-pointer-down="(...args) => editor.onCellPointerDown(...args)"
    @cell-pointer-enter="(...args) => editor.onCellPointerEnter(...args)"
    @cell-drag-over="(...args) => editor.junkLayer.onCellDragOver(...args)"
    @cell-drop="(...args) => editor.onCellDrop(...args)"
  />
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import { BlockState } from '@/types/BlockState'

// This component needs to handle dragover and drop because the junk layer hides
// empty cells and disables pointer events on them.

const props = defineProps<{
  editor: Editor
}>()

const shouldShow = (row: number, col: number) => {
  const junkBlock = props.editor.junkLayer.board.getBlock(row, col)
  return junkBlock.state === BlockState.EMPTY
}
</script>
