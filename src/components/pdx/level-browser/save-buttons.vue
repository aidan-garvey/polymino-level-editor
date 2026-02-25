<template>
  <div class="pdx-level-browser-save-buttons">
    <button
      type="button"
      @click="emit('saveToDisk')"
    >
      Save to disk
    </button>
    <button
      v-if="levels"
      type="button"
      @click="emit('save', levelName)"
    >
      Save
    </button>
  </div>
</template>

<script setup lang="ts">
import type { SavedLevelDict } from '@/types/Storage/LevelStorage'

const props = defineProps<{
  levels: SavedLevelDict | null
  levelName: string
}>()

const emit = defineEmits<{
  save: [name: string]
  saveToDisk: []
}>()
</script>

<style lang="scss">
.pdx-level-browser-save-buttons {
  display: flex;
  flex-direction: row;
  gap: 4px;
  justify-content: space-between;
}
</style>
