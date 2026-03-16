<template>
  <div class="pdx-menu-bar">
    <pdx-dropdown-file
      ref="fileDropdown"
      v-model:editor="editor"
      :level-storage
      @open="closeEditDropdown"
    />
    <pdx-dropdown-edit
      ref="editDropdown"
      :editor
      @open="closeFileDropdown"
    />
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import type { LevelStorage } from '@/types/Storage/LevelStorage'

const editor = defineModel<Editor>('editor', { required: true })

defineProps<{
  levelStorage: LevelStorage
}>()

const fileDropdown = useTemplateRef('fileDropdown')
const editDropdown = useTemplateRef('editDropdown')

const closeEditDropdown = () => {
  editDropdown.value?.close()
}

const closeFileDropdown = () => {
  fileDropdown.value?.close()
}
</script>

<style lang="scss">
.pdx-menu-bar {
  background: #222;
  border-bottom: 1px solid #444;

  display: flex;
  flex-direction: row;
}
</style>
