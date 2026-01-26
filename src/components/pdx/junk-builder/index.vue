<template>
  <div class="pdx-side-panel pdx-junk-builder">
    <pdx-tooltip />

    <div class="text-title text-center">
      Junk Builder
    </div>

    <select
      ref="pdxJunkBuilderShapeSelectorRef"
      class="pdx-junk-builder__shape-selector"
      name="junk-shape"
      :value="editor.junkBuilder.getJunkShape()"
      @change="onShapeChange"
    >
      <option
        v-for="shape in JunkShape"
        :key="shape"
        :value="shape"
      >
        {{ shape }}
      </option>
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
import { injectTooltipOffsetY, injectTooltipTriggerHeight, injectTooltipText, injectTooltipItemName } from '@/consts/inject'

const props = defineProps<{
  editor: Editor
}>()

const pdxJunkBuilderShapeSelectorRef = useTemplateRef('pdxJunkBuilderShapeSelectorRef')

const tooltipOffsetY = ref(0)
provide(injectTooltipOffsetY, tooltipOffsetY)

const tooltipTriggerHeight = ref(0)
provide(injectTooltipTriggerHeight, tooltipTriggerHeight)

const tooltipText = ref('')
provide(injectTooltipText, tooltipText)

const tooltipItemName = ref<string | null>(null)
provide(injectTooltipItemName, tooltipItemName)

const onShapeChange = () => {
  const shape = pdxJunkBuilderShapeSelectorRef.value?.value
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
