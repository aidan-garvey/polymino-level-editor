<template>
  <pdx-cell-grid
    class="pdx-layer-base"
    :editor
    :grid="editor.baseLayer.board"
    :should-show
    @cell-pointer-down="(...args) => editor.brushCellPointerDown(...args)"
    @cell-pointer-enter="(...args) => editor.brushCellPointerEnter(...args)"
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

<style lang="scss">
.pdx-layer-base {
  // Always use a consistent background color so translucent blocks don't look
  // different in next-color mode.
  background-color: #000;
}
</style>
