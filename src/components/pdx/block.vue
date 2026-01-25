<template>
  <div
    class="pdx-block"
    :style="{
      opacity: getOpacity(row, col),
      visibility: shouldShow(row, col) ? 'visible' : 'hidden'
    }"
    @pointerdown="e => emit('cellPointerDown', e, row, col)"
    @pointerenter="e => emit('cellPointerEnter', e, row, col)"
    @contextmenu.prevent
    @dragover="e => emit('cellDragOver', e, row, col)"
    @drop="e => emit('cellDrop', e, row, col)"
  >
    <img
      :src="imageSrc"
      height="8"
      width="8"
      :style="imageFlip"
      draggable="false"
    />
    <img
      v-if="overlaySrc"
      :src="overlaySrc"
      height="8"
      width="8"
      :style="overlayFlip"
      draggable="false"
    />
  </div>
</template>

<script setup lang="ts">
import type { CellGrid } from '@/types/CellGrid'
import { BlockState } from '@/types/BlockState'
import { JunkEffect } from '@/types/JunkEffect'

const props = withDefaults(defineProps<{
  row: number
  col: number
  grid: CellGrid
  shouldShow?: (row: number, col: number) => boolean
  getOpacity?: (row: number, col: number) => number
}>(), {
  shouldShow: () => true,
  getOpacity: () => 1,
})

const emit = defineEmits<{
  cellPointerDown: [event: PointerEvent, row: number, col: number]
  cellPointerEnter: [event: PointerEvent, row: number, col: number]
  cellDragOver: [event: DragEvent, row: number, col: number]
  cellDrop: [event: DragEvent, row: number, col: number]
}>()

const cell = computed(() => props.grid.getBlock(props.row, props.col))

const imageSrc = computed(() => cell.value.getImageSrc())

const overlaySrc = computed(() => cell.value.getOverlaySrc())

const imageFlip = computed(() => {
  const [hflip, vflip] = cell.value.getImageFlip()
  return {
    transform: `scaleX(${hflip ? -1 : 1}) scaleY(${vflip ? -1 : 1})`
  }
})

const overlayFlip = computed(() => {
  let [hflip, vflip] = cell.value.getImageFlip()
  if (cell.value.state !== BlockState.JUNK) {
    [hflip, vflip] = [false, false]
  } else if (cell.value.junk.activeEffect !== JunkEffect.BombProof) {
    [hflip, vflip] = [false, false]
  }
  return {
    transform: `scaleX(${hflip ? -1 : 1}) scaleY(${vflip ? -1 : 1})`
  }
})
</script>

<style lang="scss">
.pdx-block {
  width: var(--block-size);
  height: var(--block-size);
  position: relative;

  img {
    display: block;
    width: var(--block-size);
    height: var(--block-size);
    image-rendering: pixelated;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
