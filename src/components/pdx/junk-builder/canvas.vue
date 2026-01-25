<template>
  <div
    ref="pdxJunkBuilderCanvasRef"
    class="pdx-junk-builder-canvas"
    :style="{
      width: `calc(${editor.junkBuilder.grid.value.width} * var(--block-size))`,
      height: `calc(${editor.junkBuilder.grid.value.height} * var(--block-size))`,
    }"
    draggable="true"
    @dragstart="onDragStart"
  >
    <pdx-cell-grid
      :grid="editor.junkBuilder.grid.value"
    />
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'

const props = defineProps<{
  editor: Editor
}>()

const pdxJunkBuilderCanvasRef = useTemplateRef('pdxJunkBuilderCanvasRef')

const grid = computed(() => props.editor.junkBuilder.grid.value)

const setDragImage = (event: DragEvent) => {
  const dt = event.dataTransfer
  const element = pdxJunkBuilderCanvasRef.value
  if (!dt || !element)
    return

  const imageWidth = element.offsetWidth
  const imageHeight = element.offsetHeight

  const blockSize = imageWidth / grid.value.width

  dt.setDragImage(element, blockSize / 2, imageHeight - blockSize / 2)
}

const onDragStart = (event: DragEvent) => {
  setDragImage(event)
  props.editor.junkBuilder.setDragData(event)
}
</script>

<style lang="scss">
.pdx-junk-builder-canvas {
  position: relative;
}
</style>
