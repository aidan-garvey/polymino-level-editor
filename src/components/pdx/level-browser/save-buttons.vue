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
      @click="onSave"
    >
      Save
    </button>

    <pdx-are-you-sure
      v-model="saveConfirm"
      message="Are you sure you want to overwrite this level?"
      @confirm="() => emit('save', props.levelName)"
    />
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

const saveConfirm = ref(false)

const validNamePattern = /^[a-zA-Z0-9 ._-]+$/

const onSave = () => {
  if (props.levelName.trim() === '') {
    // TODO: use a component for this
    window.alert('Level name cannot be empty')
  } else if (!validNamePattern.test(props.levelName)) {
    // TODO: use a component for this
    window.alert('Level name contains invalid characters')
  } else {
    emit('save', props.levelName)
  }
}
</script>

<style lang="scss">
.pdx-level-browser-save-buttons {
  display: flex;
  flex-direction: row;
  gap: 4px;
  justify-content: space-between;
}
</style>
