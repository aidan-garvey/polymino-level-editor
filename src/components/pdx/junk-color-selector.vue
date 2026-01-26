<template>
  <div class="pdx-junk-color-selector pdx-junk-selector">
    <template
      v-for="(row, rowIndex) in colorRows"
      :key="rowIndex"
    >
      <pdx-junk-selector-item
        v-for="(color, colIndex) in row"
        :key="colIndex"
        :grid="grid"
        :row="rowIndex"
        :col="colIndex"
        :tooltip="blockColorTitles[color]"
        :isSelected="isSelected(color)"
        :onClick="() => onClick(color)"
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
  isSelected: (color: BlockColor) => boolean
  onClick: (color: BlockColor) => void
}>()

const grid = new CellGrid(3, 3, false)
for (const row of [0, 1, 2] as const) {
  for (const col of [0, 1, 2] as const) {
    const junk = new Junk(JunkShape.RECT_1X1, colorRows[row][col], row, col)
    grid.placeJunk(junk)
  }
}
</script>

<style lang="scss">
.pdx-junk-color-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
</style>
