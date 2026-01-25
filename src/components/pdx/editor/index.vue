<template>
  <div
    class="pdx-editor"
    :style="{
      '--board-height': BOARD_HEIGHT,
      '--board-width': BOARD_WIDTH,
    }"
  >
    <pdx-junk-builder
      v-if="editor"
      :editor
    />
    <pdx-editor-brushes
      v-if="editor"
      :editor
    />
    <div
      v-if="editor"
      class="pdx-editor__board"
    >
      <pdx-layer-base :editor />
      <pdx-layer-brush :editor />
      <pdx-layer-junk :editor />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@/types/Editor'
import { BOARD_HEIGHT, BOARD_WIDTH } from '@/consts/board'

const editor = new Editor()
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

  &__board {
    position: relative;
    // Needs to have explicit size since its children use absolute positioning
    height: var(--board-height-px);
    width: var(--board-width-px);
  }
}
</style>
