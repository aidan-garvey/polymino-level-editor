<template>
  <div
    v-if="editor.selectedJunk"
    class="pdx-side-panel pdx-junk-editor"
  >
    <pdx-tooltip />

    <div class="text-title text-center">
      Junk Editor
    </div>

    <!-- FIXME: this implies that the selected junk is always in the junk layer,
    which is true in practice, but not enforced (or communicated clearly) in the
    code -->
    <pdx-junk-editor-piece-view
      v-if="editor.selectedJunk.value"
      :junk="editor.selectedJunk.value"
      :grid="editor.junkLayer.board"
    />

    <div class="text-detail text-center">
      Color
    </div>

    <pdx-junk-color-selector
      :editor
      :isSelected="color => editor.selectedJunk.value?.color === color"
      :onClick="onColorClick"
    />

    <div class="text-detail text-center">
      Effect
    </div>

    <pdx-junk-effect-selector
      :editor
      :isSelected="effect => editor.selectedJunk.value?.activeEffect === effect"
      :onClick="onEffectClick"
    />
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import type { BlockColor } from '@/types/BlockColor'
import type { JunkEffect } from '@/types/JunkEffect'
import { provideTooltipRefs } from '@/use/tooltip'

const props = defineProps<{
  editor: Editor
}>()

provideTooltipRefs()

const onColorClick = (color: BlockColor) => {
  if (!props.editor.selectedJunk.value)
    return

  props.editor.selectedJunk.value.color = color
}

const onEffectClick = (effect: JunkEffect | null) => {
  if (!props.editor.selectedJunk.value)
    return

  props.editor.selectedJunk.value.activeEffect = effect
}
</script>

<style lang="scss">
.pdx-junk-editor {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
</style>
