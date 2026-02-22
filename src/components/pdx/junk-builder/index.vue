<template>
  <div class="pdx-side-panel pdx-junk-builder">
    <pdx-tooltip />

    <div class="text-title text-center">
      Junk Builder
    </div>

    <select
      ref="shapeSelector"
      class="pdx-junk-builder__shape-selector"
      name="junk-shape"
      :value="editor.junkBuilder.getJunkShape()"
      @change="onShapeChange"
    >
      <template
        v-for="shape in JunkShape"
        :key="shape"
      >
        <!-- 1x1 junk is for the brush layer, we want interaction with them to
        be consistent so we won't let them be placed in the junk layer -->
        <option
          v-if="shape !== JunkShape.RECT_1X1"
          :value="shape"
        >
          {{ shape }}
        </option>
      </template>
    </select>

    <pdx-junk-builder-canvas
      :editor
    />

    <div class="text-detail text-center">
      Color
    </div>

    <pdx-junk-color-selector
      :editor
      :isSelected="color => editor.junkBuilder.getColor() === color"
      :onClick="color => editor.junkBuilder.setColor(color)"
    />

    <div class="text-detail text-center">
      Effect
    </div>

    <pdx-junk-effect-selector
      :editor
      :isSelected="effect => editor.junkBuilder.getEffect() === effect"
      :onClick="effect => editor.junkBuilder.setEffect(effect)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import { JunkShape } from '@/types/JunkShape'
import { provideTooltipRefs } from '@/use/tooltip'

const props = defineProps<{
  editor: Editor
}>()

const shapeSelector = useTemplateRef('shapeSelector')

provideTooltipRefs()

const onShapeChange = () => {
  const shape = shapeSelector.value?.value
  if (shape && shape in JunkShape) {
    props.editor.junkBuilder.setJunkShape(shape as JunkShape)
  }
}
</script>

<style lang="scss">
.pdx-junk-builder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
</style>
