<template>
  <div class="pdx-side-panel pdx-editor-brushes">
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
      <pdx-icon-tool-selector
        :editor="editor"
        :selected-predicate="pickerPredicate"
        icon-name="colorize"
        tooltip="Picker"
        @pointerdown="e => editor.selectPicker(e)"
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
      <pdx-junk-effect-brush-selector
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
import { normalBlockColors, junkBlockColors } from '@/consts/block'
import { junkEffects } from '@/types/JunkEffect'
import { ToolKind } from '@/types/Tool'
import { provideTooltipRefs } from '@/use/tooltip'

const props = defineProps<{
  editor: Editor
}>()

provideTooltipRefs()

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

const pickerPredicate = (tool: Tool) => {
  return tool.kind === ToolKind.PICKER
}
</script>

<style lang="scss">
.pdx-editor-brushes {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
