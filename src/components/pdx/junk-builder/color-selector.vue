<template>
  <div class="pdx-junk-builder-color-selector pdx-junk-builder-selector">
    <template
      v-for="(row, rowIndex) in colorRows"
      :key="rowIndex"
    >
      <pdx-junk-builder-selector-item
        v-for="(color, colIndex) in row"
        :key="colIndex"
        :grid="grid"
        :row="rowIndex"
        :col="colIndex"
        :tooltip="blockColorTitles[color]"
        :isSelected="editor.junkBuilder.getColor() === color"
        :onClick="() => editor.junkBuilder.setColor(color)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import { CellGrid } from '@/types/CellGrid'
import { BlockColor } from '@/types/BlockColor'
import { Junk } from '@/types/Junk'
import { JunkShape } from '@/types/JunkShape'
import { blockColorTitles } from '@/consts/block'

const {
  BLUE,
  RED,
  GREEN,
  YELLOW,
  ORANGE,
  PINK,
  VIOLET,
  TEAL,
  GRAY,
} = BlockColor

const colorRows = [
  [GRAY, BLUE, RED],
  [GREEN, YELLOW, ORANGE],
  [PINK, VIOLET, TEAL],
] as const

const props = defineProps<{
  editor: Editor
}>()

const grid = new CellGrid(3, 3)
for (const row of [0, 1, 2] as const) {
  for (const col of [0, 1, 2] as const) {
    const junk = new Junk(JunkShape.RECT_1X1, colorRows[row][col], row, col)
    grid.placeJunk(junk)
  }
}
</script>

<style lang="scss">
.pdx-junk-builder-color-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
</style>
