<template>
  <div class="pdx-status-bar text-subtitle">
    <span>
      {{ editor.levelName.value }}
    </span>
    <div style="flex-grow: 1;"></div>
    <span
      v-if="hasUnsavedChanges"
    >
      Unsaved changes
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

watch(
  [hasUnsavedChanges, () => props.editor.levelName.value],
  ([unsaved, levelName]) => {
    const windowTitle = `${unsaved ? '* ' : ''}${levelName}`
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
  padding: 2px 8px;
}
</style>
