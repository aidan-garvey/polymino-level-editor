<template>
  <div class="pdx-level-browser-open-buttons">
    <button
      type="button"
      @click="emit('openFromDisk')"
    >
      Load from disk
    </button>
    <button
      v-if="levels"
      type="button"
      :disabled="!levelMatches"
      @click="emit('open', levelName)"
    >
      Open
    </button>
  </div>
</template>

<script setup lang="ts">
import type { SavedLevelDict } from '@/types/Storage/LevelStorage'

const props = defineProps<{
  levelName: string
  levels: SavedLevelDict | null
}>()

const emit = defineEmits<{
  open: [name: string]
  openFromDisk: []
}>()

const levelMatches = computed(() => {
  return !!props.levels
    && Object.keys(props.levels).some(level => level === props.levelName)
})
</script>

<style lang="scss">
.pdx-level-browser-open-buttons {
  display: flex;
  flex-direction: row;
  gap: 4px;
  justify-content: space-between;
}
</style>
