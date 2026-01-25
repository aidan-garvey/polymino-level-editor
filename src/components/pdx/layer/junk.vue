<template>
  <div>
    <pdx-cell-grid
      :grid="editor.junkLayer.junkBlocks"
      @cell-pointer-down="(...args) => editor.onCellPointerDown(...args)"
      @cell-pointer-enter="(...args) => editor.onCellPointerEnter(...args)"
      @cell-drag-over="(...args) => editor.junkLayer.onCellDragOver(...args)"
      @cell-drop="(...args) => editor.junkLayer.onCellDrop(...args)"
    />
    <pdx-cell-grid
      :grid="editor.junkLayer.nextBlocks"
      @cell-pointer-down="(...args) => editor.onCellPointerDown(...args)"
      @cell-pointer-enter="(...args) => editor.onCellPointerEnter(...args)"
      @cell-drag-over="(...args) => editor.junkLayer.onCellDragOver(...args)"
      @cell-drop="(...args) => editor.junkLayer.onCellDrop(...args)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'

const props = defineProps<{
  editor: Editor
}>()
</script>
