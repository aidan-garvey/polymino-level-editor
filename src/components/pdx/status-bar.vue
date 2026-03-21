<template>
  <div class="pdx-status-bar text-subtitle">
    <span>
      {{ contextInfo }}
    </span>
    <div style="flex-grow: 1;"></div>
    <span>
      {{ savedStatus }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'

const props = defineProps<{
  editor: Editor
}>()

const hasUnsavedChanges = computed(() => {
  return props.editor.history.hasUnsavedChanges()
})

const savedStatus = computed(() => {
  return hasUnsavedChanges.value
    ? 'Unsaved changes'
    : 'Changes saved'
})

const contextInfo = computed(() => {
  if (props.editor.isDragging.value) {
    return 'Hold Shift to copy'
  } else if (props.editor.mouseCoordinates.value) {
    const { row, col } = props.editor.mouseCoordinates.value
    return `(Row, Column) = (${row}, ${col})`
  } else {
    return `${props.editor.levelName.value}${hasUnsavedChanges.value ? ' \u25cf' : ''}`
  }
})

watch(
  [hasUnsavedChanges, () => props.editor.levelName.value],
  ([unsaved, levelName]) => {
    // U+25CF = filled circle
    const windowTitle = `${unsaved ? '\u25cf ' : ''}${levelName}`
    document.title = `${windowTitle} | Polymino Level Editor`
  },
  { immediate: true }
)
</script>

<style lang="scss">
.pdx-status-bar {
  display: flex;
  flex-direction: row;
  align-items: center;

  background: #222;
  border-top: 1px solid #444;
  padding: 2px 8px 4px;
}
</style>
