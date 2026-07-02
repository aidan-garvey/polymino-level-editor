<template>
  <div
    class="pdx-base-layer-slider"
    :style="{
      '--thumb-width': `${THUMB_WIDTH}px`,
      '--track-width': `${TRACK_WIDTH}px`,
    }"
  >
    <div
      ref="sliderTrack"
      class="pdx-base-layer-slider__track"
      @pointerdown="onTrackPointerDown"
    >
    </div>
    <div
      ref="sliderThumb"
      class="pdx-base-layer-slider__thumb"
      :style="{
        top: `${thumbCssTop}px`,
        transform: `translateY(-${THUMB_HEIGHT / 2}px)`
      }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @lostpointercapture="onLostCapture"
    >
      <div class="pdx-base-layer-slider__thumb-details"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import { BOARD_HEIGHT } from '@/consts/board'

const props = defineProps<{
  editor: Editor
}>()

const THUMB_WIDTH = 32
const THUMB_HEIGHT = 16
const TRACK_WIDTH = 16

const sliderTrack = useTemplateRef('sliderTrack')
const sliderThumb = useTemplateRef('sliderThumb')

const pointerId = ref<number | undefined>()

const thumbRow = ref(props.editor.baseLayer.getRows())
const thumbCssTop = ref(0)

watch(thumbRow, () => {
  // Route drags through the editor's setter so the history action survives
  // being consumed mid-drag (e.g. by undoing). When the change is external
  // (undo, opening a level) the editor already has the value and writing it
  // back would wrongly create a history action, so only write while dragging.
  if (pointerId.value !== undefined) {
    props.editor.setBaseLayerRows(thumbRow.value)
  }
})

/**
 * When a new level is opened (editor gets replaced), set the slider thumb
 * position based on the new level's base layer.
 */
watch(() => props.editor.baseLayer.getRows(), () => {
  thumbRow.value = props.editor.baseLayer.getRows()
  updateThumbTop()
})

const onPointerDown = (event: PointerEvent) => {
  if (!sliderThumb.value)
    return

  event.preventDefault()
  pointerId.value = event.pointerId
  sliderThumb.value.setPointerCapture(event.pointerId)
  // Have to start/end this action on direct pointer interaction, so it isn't
  // tracked when we update the slider based on external changes
  props.editor.history.startBaseLayerRows()
}

// When the track is clicked outside of the thumb, call onPointerDown to start
// pointer capture and the history action, then call onPointerMove to make the
// thumb jump to the cursor.
const onTrackPointerDown = (event: PointerEvent) => {
  onPointerDown(event)
  onPointerMove(event)
}

const onPointerMove = (event: PointerEvent) => {
  if (!sliderThumb.value || !sliderTrack.value || event.pointerId !== pointerId.value)
    return

  const mouseY = event.clientY
  const {
    height: trackHeight,
    top: trackTop
  } = sliderTrack.value.getBoundingClientRect()

  thumbCssTop.value = Math.max(0, Math.min(trackHeight, mouseY - trackTop))
  const negativeRows = Math.round(thumbCssTop.value * BOARD_HEIGHT / trackHeight)
  thumbRow.value = Math.max(0, Math.min(BOARD_HEIGHT, BOARD_HEIGHT - negativeRows))
}

const onLostCapture = () => {
  pointerId.value = undefined
  updateThumbTop()
  // Have to start/end this action on direct pointer interaction, so it isn't
  // tracked when we update the slider based on external changes
  props.editor.history.endBaseLayerRows()
}

const updateThumbTop = () => {
  if (!sliderTrack.value)
    return

  const trackHeight = sliderTrack.value.getBoundingClientRect().height
  thumbCssTop.value = trackHeight * (1 - thumbRow.value / BOARD_HEIGHT)
}
</script>

<style lang="scss">
.pdx-base-layer-slider {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100%;
  width: var(--thumb-width);

  &__track {
    height: 100%;
    width: var(--track-width);
    background: #111;
    border: 1px solid #333;
  }

  &__thumb {
    position: absolute;
    height: var(--track-width);
    width: var(--thumb-width);
    background: #333;
    border: 1px solid #fff;
    padding: 4px;
    cursor: ns-resize;
  }

  &__thumb-details {
    border-top: 1px solid #fff;
    border-bottom: 1px solid #fff;
    height: 100%;
    width: 100%;
  }
}
</style>
