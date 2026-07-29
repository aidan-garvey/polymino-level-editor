<template>
  <div
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

    <pdx-space />

    <button
      type="button"
      ref="targetButton"
      class="pdx-junk-editor__button"
      :disabled="!editor.selectedJunk.value || editor.getGoalKind() !== GoalKind.DESTROY_TARGETS"
      @click="onToggleTarget"
      @pointerenter="onTargetEnter"
      @pointerleave="onTargetLeave"
    >
      {{ editor.isSelectedJunkATarget() ? 'Unmark' : 'Mark' }} target
    </button>

    <button
      type="button"
      class="pdx-junk-editor__button"
      :disabled="!editor.selectedJunk.value"
      @click="onDelete"
    >
      Delete
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import type { BlockColor } from '@/types/BlockColor'
import type { JunkEffect } from '@/types/JunkEffect'
import { provideTooltipRefs, useTooltip } from '@/use/tooltip'
import { makeHotkey } from '@/utils/hotkey'
import { GoalKind } from '@/types/Rules/Goal'

const props = defineProps<{
  editor: Editor
}>()

provideTooltipRefs()

const targetButton = useTemplateRef('targetButton')

const targetTooltip = computed(() => {
  if (!props.editor.selectedJunk.value) {
    return 'No junk piece is selected'
  } else if (props.editor.getGoalKind() === GoalKind.DESTROY_TARGETS) {
    return `Toggle this piece as a target for the "${GoalKind.DESTROY_TARGETS}" goal`
  } else {
    return `Requires the "${GoalKind.DESTROY_TARGETS}" goal to be active`
  }
})

const {
  onPointerEnter: onTargetEnter,
  onPointerLeave: onTargetLeave,
} = useTooltip(
  'targetButton',
  targetTooltip,
  targetButton,
)

const onColorClick = (color: BlockColor) => {
  props.editor.setSelectedJunkColor(color)
}

const onEffectClick = (effect: JunkEffect | null) => {
  props.editor.setSelectedJunkEffect(effect)
}

const onToggleTarget = () => {
  props.editor.toggleTargetSelectedJunk()
}

const onDelete = () => {
  props.editor.deleteSelectedJunk()
}

useEventListener('keyup', makeHotkey(onDelete, 'delete', 'backspace'))
</script>

<style lang="scss">
.pdx-junk-editor {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  &__button {
    width: 100%;
  }
}
</style>
