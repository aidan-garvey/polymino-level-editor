<template>
  <div class="pdx-editor-brushes">
    <pdx-tooltip />

    <div class="text-title text-center">
      Brushes
    </div>

    <div class="pdx-editor-brushes__section">
      <pdx-icon-tool-selector
        :editor="editor"
        :selected-predicate="selectPredicate"
        icon-name="arrow_selector_tool"
        tooltip="Select (no brush)"
        @pointerdown="e => editor.chooseSelectTool(e)"
      />
      <pdx-icon-tool-selector
        :editor="editor"
        :selected-predicate="erasePredicate"
        icon-name="ink_eraser"
        tooltip="Erase"
        @pointerdown="e => editor.selectBrush(e, BlockState.EMPTY, BlockColor.GRAY)"
      />
    </div>

    <div class="text-detail text-center">
      Blocks
    </div>

    <div class="pdx-editor-brushes__section">
      <pdx-brush-selector
        v-for="color in normalBlockColors"
        :key="color"
        :state="BlockState.NORMAL"
        :color="color"
        :editor="editor"
      />
    </div>

    <div class="text-detail text-center">
      Junk
    </div>

    <div class="pdx-editor-brushes__section">
      <pdx-brush-selector
        v-for="color in junkBlockColors"
        :key="color"
        :state="BlockState.JUNK"
        :color="color"
        :editor="editor"
      />
      <pdx-icon-tool-selector
        :editor="editor"
        :selected-predicate="effectOnlyPredicate"
        icon-name="star"
        tooltip="Effect only"
        @pointerdown="e => editor.selectBrush(e, BlockState.JUNK, null)"
      />
    </div>

    <div class="text-detail text-center">
      Effects
    </div>

    <div class="pdx-editor-brushes__section">
      <pdx-junk-effect-selector
        v-for="effect in junkEffects"
        :key="effect"
        :effect="effect"
        :editor="editor"
        is-brush
        @pointerdown="e => editor.selectEffect(e, effect)"
      />
      <pdx-icon-tool-selector
        :editor="editor"
        :selected-predicate="noEffectPredicate"
        icon-name="block"
        tooltip="No effect"
        @pointerdown="e => editor.selectEffect(e, null)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import type { Tool } from '@/types/Tool'
import { BlockState } from '@/types/BlockState'
import { BlockColor } from '@/types/BlockColor'
import { normalBlockColors, junkBlockColors } from '@/types/BlockColor'
import { junkEffects } from '@/types/JunkEffect'
import { ToolKind } from '@/types/Tool'
import { injectTooltipOffsetY, injectTooltipText, injectTooltipItemName, injectTooltipTriggerHeight } from '@/consts/inject'

const props = defineProps<{
  editor: Editor
}>()

// Written by the brush selectors, read by the tooltip
const tooltipOffsetY = ref(0)
provide(injectTooltipOffsetY, tooltipOffsetY)

const tooltipTriggerHeight = ref(0)
provide(injectTooltipTriggerHeight, tooltipTriggerHeight)

const tooltipText = ref('')
provide(injectTooltipText, tooltipText)

const tooltipItemName = ref<string | null>(null)
provide(injectTooltipItemName, tooltipItemName)

const selectPredicate = (tool: Tool) => {
  return tool.kind === ToolKind.SELECT
}

const erasePredicate = (tool: Tool) => {
  return tool.kind === ToolKind.BRUSH
    && tool.brushState === BlockState.EMPTY
}

const effectOnlyPredicate = (tool: Tool) => {
  return tool.kind === ToolKind.BRUSH
    && tool.brushState === BlockState.JUNK
    && tool.brushColor === null
}

const noEffectPredicate = (tool: Tool) => {
  return tool.kind === ToolKind.BRUSH
    && tool.brushState === BlockState.JUNK
    && tool.brushEffect === null
}
</script>

<style lang="scss">
.pdx-editor-brushes {
  border: 1px solid #fff;
  background: #111;
  padding: 8px;

  display: flex;
  flex-direction: column;
  gap: 4px;

  position: relative;

  height: 100%;
  overflow-y: auto;

  &__section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
