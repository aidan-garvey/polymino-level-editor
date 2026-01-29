<template>
  <div
    class="pdx-editor"
    :style="{
      '--board-height': BOARD_HEIGHT,
      '--board-width': BOARD_WIDTH,
    }"
  >
    <div class="pdx-editor__left">
      <pdx-junk-builder :editor />
      <pdx-editor-brushes :editor />
    </div>
    <div
      class="pdx-editor__board"
      :style="cursorStyle"
    >
      <pdx-layer-base :editor />
      <pdx-layer-brush :editor />
      <pdx-layer-junk :editor />
      <pdx-board-overlay :editor />
    </div>
    <div class="pdx-editor__right">
      <pdx-base-layer-slider :editor />
      <pdx-junk-editor :editor />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@/types/Editor'
import { BOARD_HEIGHT, BOARD_WIDTH } from '@/consts/board'
import { ToolKind } from '@/types/Tool'

const editor = new Editor()

const cursorStyle = computed(() => {
  switch (editor.leftTool.value.kind) {
    case ToolKind.BRUSH:
      return { cursor: 'crosshair' }
    case ToolKind.SELECT:
      return {}
  }
})
</script>

<style lang="scss">
.pdx-editor {
  --board-height-px: 90vh;
  --block-size: calc(var(--board-height-px) / var(--board-height));
  --board-width-px: calc(var(--block-size) * var(--board-width));

  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 16px;
  height: var(--board-height-px);
  width: 100%;

  &__left, &__right {
    flex: 1;

    display: flex;
    flex-direction: row;
    gap: 16px;
    height: var(--board-height-px);
    align-items: stretch;
  }

  &__left {
    justify-content: flex-end;
  }
  &__right {
    justify-content: flex-start;
  }

  &__board {
    position: relative;
    // Needs to have explicit size since its children use absolute positioning
    height: var(--board-height-px);
    width: var(--board-width-px);
  }
}
</style>
