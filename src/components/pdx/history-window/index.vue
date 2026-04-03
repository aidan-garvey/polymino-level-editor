<template>
  <div
    class="pdx-history-window"
    ref="windowRef"
    :style="windowStyle"
  >
    <div class="text-detail pdx-history-window__title">
      History
    </div>
    <div
      class="pdx-history-window__content"
      :style="{
        maxHeight: `${contentMaxHeight}px`,
      }"
    >
      <pdx-history-window-action
        v-for="(action, index) in pastActions"
        :key="index"
        :action
        kind="past"
        @click="() => editor.history.undoTo(action.id)"
      />
      <pdx-history-window-action
        v-if="lastAction"
        :action="lastAction"
        kind="last"
      />
      <pdx-history-window-action
        v-for="(action, index) in futureActions"
        :key="index"
        :action
        kind="future"
        @click="() => editor.history.redoTo(action.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import { ITEM_HEIGHT, MAX_ITEMS } from '@/components/pdx/history-window/consts'

const props = defineProps<{
  editor: Editor
}>()

const windowRef = useTemplateRef('windowRef')

const { style: windowStyle } = useDraggable(windowRef, {
  initialValue: { x: 8, y: 8 },
  containerElement: useParentElement(),
  exact: true,
  preventDefault: true,
})

const pastActions = computed(() => {
  return props.editor.history.undoActions.value.slice(0, -1)
})
const lastAction = computed(() => {
  return props.editor.history.undoActions.value.at(-1)
})
const futureActions = computed(() => {
  return props.editor.history.redoActions.value
})

const contentMaxHeight = computed(() => {
  const itemsWithBorders = MAX_ITEMS - 1
  const borderedItemH = ITEM_HEIGHT + 1
  // +2 because of the content's own 1px borders
  return itemsWithBorders * borderedItemH + ITEM_HEIGHT + 2
})
</script>

<style lang="scss">
@use '../../stacking';

.pdx-history-window {
  position: absolute;
  z-index: stacking.$history-window;

  background: #111;
  border: 1px solid #fff;
  padding: 4px;

  cursor: move;

  &__title {
    // since we use `exact: true` for useDraggable, this is needed to drag the
    // window by dragging the title
    pointer-events: none;
  }

  &__content {
    border: 1px solid #fff;
    overflow-y: scroll;
    min-width: 128px;
  }
}
</style>
