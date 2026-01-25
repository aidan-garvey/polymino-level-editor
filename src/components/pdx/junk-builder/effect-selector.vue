<template>
  <div class="pdx-junk-builder-effect-selector pdx-junk-builder-selector">
    <template
      v-for="(row, rowIndex) in effectRows"
      :key="rowIndex"
    >
      <template
        v-for="(effect, colIndex) in row"
        :key="colIndex"
      >
        <pdx-block
          :grid="grid"
          :row="rowIndex"
          :col="colIndex"
          @click="editor.junkBuilder.setEffect(effect)"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import { CellGrid } from '@/types/CellGrid'
import { BlockColor } from '@/types/BlockColor'
import { JunkEffect } from '@/types/JunkEffect'
import { Junk } from '@/types/Junk'
import { JunkShape } from '@/types/JunkShape'

const {
  Armored,
  BombProof,
  Blocker,
  Heavy,
  ExplodingJunk,
} = JunkEffect

const effectRows = [
  [null, Armored, BombProof],
  [Blocker, Heavy, ExplodingJunk],
] as const

const props = defineProps<{
  editor: Editor
}>()

const grid = new CellGrid(3, 2)
for (const row of [0, 1] as const) {
  for (const col of [0, 1, 2] as const) {
    const junk = new Junk(
      JunkShape.RECT_1X1,
      BlockColor.GRAY,
      row,
      col,
      effectRows[row][col]
    )
    grid.placeJunk(junk)
  }
}
</script>

<style lang="scss">
.pdx-junk-builder-effect-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
</style>
