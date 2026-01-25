<template>
  <pdx-cell-grid
    :editor
    :grid="editor.baseLayer.board"
    :should-show
    @cell-pointer-down="(...args) => editor.onCellPointerDown(...args)"
    @cell-pointer-enter="(...args) => editor.onCellPointerEnter(...args)"
  />
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import { BlockState } from '@/types/BlockState'

const props = defineProps<{
  editor: Editor
}>()

const shouldShow = (row: number, col: number) => {
  const brushBlock = props.editor.brushLayer.board.getBlock(row, col)
  const junkBlock = props.editor.junkLayer.board.getBlock(row, col)

  if (brushBlock.state !== BlockState.EMPTY
    || junkBlock.state !== BlockState.EMPTY
  ) {
    return false
  } else {
    return true
  }
}
</script>
