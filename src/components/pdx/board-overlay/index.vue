<template>
  <div
    class="pdx-board-overlay"
    :style="{
      ...gridStyle,
    }"
  >
    <template
      v-for="yDown in BOARD_HEIGHT"
      :key="yDown"
    >
      <div
        v-for="x in BOARD_WIDTH"
        :key="x"
        class="pdx-board-overlay__cell"
        :class="{
          'pdx-board-overlay__cell--selected': isSelectedJunk(x, yDown),
        }"
      >
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import { BOARD_HEIGHT, BOARD_WIDTH } from '@/consts/board'

const props = defineProps<{
  editor: Editor
}>()

const gridStyle = computed(() => {
  return {
    gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
    gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
  }
})

const toGridCoords = (x: number, y: number): [number, number] => {
  return [
    BOARD_HEIGHT - y,
    x - 1,
  ]
}

const isSelectedJunk = (x: number, y: number): boolean => {
  const [row, col] = toGridCoords(x, y)
  const selected = props.editor.selectedJunk.value
  if (!selected)
    return false

  const positions = props.editor.junkLayer.board.junkBlockPositions(selected)
  for (const [junkY, junkX] of positions) {
    if (junkY === row && junkX === col)
      return true
  }
  return false
}
</script>

<style lang="scss">
.pdx-board-overlay {
  display: grid;
  position: absolute;
  top: 0;
  left: 0;
  width: var(--board-width-px);
  height: var(--board-height-px);
  pointer-events: none;

  // so it displays over junk pieces
  z-index: 10;

  &__cell {
    border: 1px solid rgba(255, 255, 255, 0.1);

    &--selected {
      background: rgba(255, 255, 255, 0.25);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);
    }
  }
}
</style>
