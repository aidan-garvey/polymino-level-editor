<template>
  <div
    ref="pdxJunkBuilderCanvasRef"
    class="pdx-junk-builder-canvas"
    :style="{
      width: `calc(${editor.junkBuilder.grid.value.width} * var(--block-size))`,
      height: `calc(${editor.junkBuilder.grid.value.height} * var(--block-size))`,
    }"
  >
    <pdx-cell-grid
      :editor
      :grid="editor.junkBuilder.grid.value"
    />
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'

const props = defineProps<{
  editor: Editor
}>()
</script>

<style lang="scss">
.pdx-junk-builder-canvas {
  position: relative;
}
</style>
