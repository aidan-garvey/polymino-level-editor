<template>
  <div class="pdx-junk-builder">
    <pdx-tooltip />

    <div class="text-body text-center">
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

    <pdx-junk-builder-color-selector
      :editor
    />

    <div class="text-detail text-center">
      Effect
    </div>

    <pdx-junk-builder-effect-selector
      :editor
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
  border: 1px solid #fff;
  background: #111;
  padding: 8px;

  // So we can use offsetTop on tooltip targets
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  height: 100%;
  overflow-y: auto;
}
</style>
