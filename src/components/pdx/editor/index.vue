<template>
  <div
    class="pdx-editor"
    :style="{
      '--board-rows': BOARD_HEIGHT,
      '--board-cols': BOARD_WIDTH,
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
      <pdx-level-settings :editor />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import { BOARD_HEIGHT, BOARD_WIDTH } from '@/consts/board'
import { ToolKind } from '@/types/Tool'

const props = defineProps<{
  editor: Editor
}>()

const cursorStyle = computed(() => {
  switch (props.editor.leftTool.value.kind) {
    case ToolKind.BRUSH:
    case ToolKind.PICKER:
      return { cursor: 'crosshair' }
    case ToolKind.SELECT:
      return {}
  }
})
</script>

<style lang="scss">
.pdx-editor {
  // menu and status bars are ~54px, horizontal scrollbar is ~15px on Windows,
  // plus some extra wiggle room to make it feel comfortable
  --board-height: min(90dvh, 100dvh - 128px);
  --block-size: calc(var(--board-height) / var(--board-rows));
  --board-width: calc(var(--block-size) * var(--board-cols));

  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 16px;
  height: var(--board-height);
  width: 100%;

  &__left, &__right {
    flex: 1;

    display: flex;
    flex-direction: row;
    gap: 16px;
    height: var(--board-height);
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
    height: var(--board-height);
    width: var(--board-width);
  }
}
</style>
