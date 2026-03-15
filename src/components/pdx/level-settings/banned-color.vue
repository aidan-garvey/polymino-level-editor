<template>
  <div
    ref="tooltipTrigger"
    class="pdx-level-settings-banned-color"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <label
      :for="id"
      class="text-detail"
    >
      Banned color
    </label>
    <select
      ref="colorSelector"
      :id
      :value="editor.baseLayer.getBannedColor() ?? ''"
      @change="onColorChange"
    >
      <option value="">
        None
      </option>
      <template
        v-for="color of normalBlockColors"
        :key="color"
      >
        <option :value="color">
          {{ blockColorTitles[color] }}
        </option>
      </template>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import { BlockColor } from '@/types/BlockColor'
import { blockColorTitles, normalBlockColors } from '@/consts/block'
import { useTooltip } from '@/use/tooltip'

const props = defineProps<{
  editor: Editor
}>()

const id = useId()

const tooltipTrigger = useTemplateRef('tooltipTrigger')
const colorSelector = useTemplateRef('colorSelector')

const {
  onPointerEnter,
  onPointerLeave
} = useTooltip(
  id,
  'Choose a color which will not appear in the base layer',
  tooltipTrigger
)

const onColorChange = () => {
  const color = Number.parseInt(colorSelector.value?.value ?? '', 10)
  const oldColor = props.editor.baseLayer.getBannedColor()
  const before = props.editor.save()

  if (color in BlockColor && color !== BlockColor.GRAY) {
    if (oldColor !== color) {
      props.editor.baseLayer.setBannedColor(color)
      props.editor.history.pushSetBannedColor(before)
    }
  } else {
    if (oldColor !== undefined) {
      props.editor.baseLayer.setBannedColor()
      props.editor.history.pushSetBannedColor(before)
    }
  }
}
</script>

<style lang="scss">
.pdx-level-settings-banned-color {
  text-align: center;
}
</style>
