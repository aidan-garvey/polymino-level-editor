<template>
  <div class="pdx-junk-effect-selector pdx-junk-builder-selector">
    <template
      v-for="(row, rowIndex) in effectRows"
      :key="rowIndex"
    >
      <pdx-junk-selector-item
        v-for="(effect, colIndex) in row"
        :key="colIndex"
        :grid="grid"
        :row="rowIndex"
        :col="colIndex"
        :tooltip="effect ? junkEffectNames[effect] : 'None'"
        :isSelected="isSelected(effect)"
        :onClick="() => onClick(effect)"
      />
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
import { junkEffectNames } from '@/consts/effects'

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
  isSelected: (effect: JunkEffect | null) => boolean
  onClick: (effect: JunkEffect | null) => void
}>()

const grid = new CellGrid(3, 2, false)
for (const row of [0, 1] as const) {
  for (const col of [0, 1, 2] as const) {
    const junk = new Junk(JunkShape.RECT_1X1, BlockColor.GRAY, row, col, effectRows[row][col])
    grid.placeJunk(junk)
  }
}
</script>

<style lang="scss">
.pdx-junk-effect-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
</style>
