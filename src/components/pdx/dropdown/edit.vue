<template>
  <pdx-dropdown
    ref="dropdown"
    name="Edit"
    @open="emit('open')"
  >
    <pdx-dropdown-item
      label="Undo"
      hotkey="Ctrl+Z"
      @click="undo"
    />
    <pdx-dropdown-item
      label="Redo"
      hotkey="Ctrl+Shift+Z"
      @click="redo"
    />
  </pdx-dropdown>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'

const props = defineProps<{
  editor: Editor
}>()

const emit = defineEmits<{
  open: []
}>()

const dropdown = useTemplateRef('dropdown')

const undo = () => {
  props.editor.history.undo()
}

const redo = () => {
  props.editor.history.redo()
}

defineExpose({
  open: () => dropdown.value?.open(),
  close: () => dropdown.value?.close(),
})
</script>
