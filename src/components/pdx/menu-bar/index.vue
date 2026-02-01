<template>
  <div class="pdx-menu-bar">
    <pdx-file-dropdown
      v-model:editor="editor"
      :level-storage
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
</script>

<style lang="scss">
.pdx-menu-bar {
  background: #222;
  border-bottom: 1px solid #444;
}
</style>
