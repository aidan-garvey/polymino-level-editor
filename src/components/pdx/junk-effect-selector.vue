<template>
  <div
    ref="pdxJunkEffectSelectorRef"
    class="pdx-junk-effect-selector pdx-tool-selector"
    :class="{
      'pdx-tool-selector--left': isBrush && isLeft,
      'pdx-tool-selector--right': isBrush && isRight,
    }"
    @pointerdown="e => emit('pointerdown', e)"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @contextmenu.prevent
  >
    <div
      v-if="imageSrc"
      class="pdx-junk-effect-selector__image-container"
    >
      <img
        :src="imageSrc"
        width="16"
        height="16"
      />
      <img
        v-if="overlaySrc"
        :src="overlaySrc"
        width="16"
        height="16"
      />
    </div>
    <pdx-icon
      v-else
      :name="iconName"
      size="28"
      :fill="isLeft || isRight"
    />
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import type { JunkEffect } from '@/types/JunkEffect'
import { ToolKind } from '@/types/Tool'
import { JunkBlock } from '@/types/Block'
import { Junk } from '@/types/Junk'
import { JunkShape } from '@/types/JunkShape'
import { JunkBlockType } from '@/types/JunkBlockType'
import { BlockColor } from '@/types/BlockColor'
import { BlockState } from '@/types/BlockState'
import { junkEffectIcons, junkEffectNames } from '@/consts/effects'
import { useTooltip } from '@/use/tooltip'

const props = defineProps<{
  editor: Editor
  effect: JunkEffect
  isBrush?: boolean
}>()

const emit = defineEmits<{
  pointerdown: [PointerEvent]
}>()

const pdxJunkEffectSelectorRef = useTemplateRef('pdxJunkEffectSelectorRef')

const junk = computed(() => {
  return new Junk(JunkShape.RECT_1X1, BlockColor.GRAY, 0, 0, props.effect)
})

const block = computed(() => {
  return new JunkBlock(junk.value, JunkBlockType.SINGLE)
})

const imageSrc = computed<string>(() => {
  return block.value.getImageSrc()
})

const overlaySrc = computed<string | null>(() => {
  return block.value.getOverlaySrc()
})

const iconName = computed(() => {
  return junkEffectIcons[props.effect]
})

const tooltipText = computed(() => {
  return junkEffectNames[props.effect]
})

const { onPointerEnter, onPointerLeave } = useTooltip(
  computed(() => props.effect),
  tooltipText,
  pdxJunkEffectSelectorRef
)

const isLeft = computed(() => {
  return props.editor.leftTool.value.kind === ToolKind.BRUSH
    && props.editor.leftTool.value.brushState === BlockState.JUNK
    && props.editor.leftTool.value.brushEffect === props.effect
})
const isRight = computed(() => {
  return props.editor.rightTool.value.kind === ToolKind.BRUSH
    && props.editor.rightTool.value.brushState === BlockState.JUNK
    && props.editor.rightTool.value.brushEffect === props.effect
})
</script>

<style lang="scss">
.pdx-junk-effect-selector {
  &__image-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  img {
    display: block;
    object-fit: cover;
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
