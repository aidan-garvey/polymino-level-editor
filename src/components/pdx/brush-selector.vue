<template>
  <div
    ref="pdxBrushSelectorRef"
    class="pdx-brush-selector pdx-tool-selector"
    :class="{
      'pdx-tool-selector--left': isLeft,
      'pdx-tool-selector--right': isRight,
    }"
    @pointerdown="e => editor.selectBrush(e, state, color)"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @contextmenu.prevent
  >
    <img
      :src="imageSrc"
      width="8"
      height="8"
    />
  </div>
</template>

<script setup lang="ts">
import type { BlockColor } from '@/types/BlockColor'
import type { Editor } from '@/types/Editor'
import { ToolKind } from '@/types/Tool'
import { BlockState } from '@/types/BlockState'
import { JunkBlockType } from '@/types/JunkBlockType'
import { junkBlockPathSuffixes } from '@/consts/junk'
import { blockColorNames, blockColorTitles } from '@/consts/block'
import { useTooltip } from '@/use/tooltip'

const props = defineProps<{
  editor: Editor
  state: BlockState.NORMAL | BlockState.JUNK
  color: BlockColor
}>()

const pdxBrushSelectorRef = useTemplateRef('pdxBrushSelectorRef')

const imageSrc = computed(() => {
  const color = blockColorNames[props.color]
  if (props.state === BlockState.NORMAL) {
    return `assets/blocks/${color}.png`
  } else if (props.state === BlockState.JUNK) {
    const suffix = junkBlockPathSuffixes[JunkBlockType.SINGLE]
    return `assets/junk/${color}${suffix}.png`
  } else {
    return 'assets/empty.png'
  }
})

const tooltipText = computed(() => {
  const state = props.state === BlockState.NORMAL ? 'block' : 'junk'
  return `${blockColorTitles[props.color]} ${state}`
})

const { onPointerEnter, onPointerLeave } = useTooltip(
  tooltipText,
  tooltipText,
  pdxBrushSelectorRef
)

const isLeft = computed(() => {
  return props.editor.leftTool.value.kind === ToolKind.BRUSH
    && props.editor.leftTool.value.brushColor === props.color
    && props.editor.leftTool.value.brushState === props.state
})
const isRight = computed(() => {
  return props.editor.rightTool.value.kind === ToolKind.BRUSH
    && props.editor.rightTool.value.brushColor === props.color
    && props.editor.rightTool.value.brushState === props.state
})
</script>

<style lang="scss">
.pdx-brush-selector {
  img {
    display: block;
    object-fit: cover;
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
  }
}
</style>
