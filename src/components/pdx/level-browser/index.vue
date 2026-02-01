<template>
  <pdx-dialog v-model="modelValue">
    <pdx-dialog-title-bar title="Level Browser" />

    <div class="pdx-level-browser">
      <pdx-level-browser-list
        :levels
        :input-level-name="levelName"
        @select="name => levelName = name"
        @activate="activateLevel"
      />

      <pdx-level-browser-input
        v-model="levelName"
      />
      <pdx-level-browser-save-buttons
        v-if="mode === 'save'"
        :levels
        :level-name="levelName"
        @save="saveLevel"
        @save-to-disk="saveToDisk"
      />
      <pdx-level-browser-open-buttons
        v-else-if="mode === 'open'"
        :levels="levels"
        :level-name="levelName"
        @open="openLevel"
        @open-from-disk="openFromDisk"
      />

      <input type="file"
        v-if="mode === 'open'"
        hidden
        ref="fileInputRef"
        accept=".json"
        @change="onFileChange"
      />
    </div>
  </pdx-dialog>
</template>

<script setup lang="ts">
import type { LevelStorage, SavedLevelDict } from '@/types/Storage/LevelStorage'
import { Editor } from '@/types/Editor'
import { isSavedLevel } from '@/types/Saved/SavedLevel'

const modelValue = defineModel<boolean>({ required: true })
const editor = defineModel<Editor>('editor', { required: true })

const props = defineProps<{
  levelStorage: LevelStorage
  mode: 'open' | 'save'
}>()

const fileInputRef = useTemplateRef('fileInputRef')

const levels = ref<SavedLevelDict | null>(null)

const levelName = ref('')

const openLevel = (name: string) => {
  const level = props.levelStorage.loadLevel(name)
  if (level) {
    editor.value = new Editor(level)
    modelValue.value = false
  }
}

const saveLevel = (name: string) => {
  try {
    props.levelStorage.saveAs(editor.value.save(), name)
    modelValue.value = false
  } catch (error) {
    console.error(error)
    // TODO: use a component for this, detect the error type and show a more
    // specific message, e.g. tell user they need to delete levels to make room
    window.alert('Failed to save level')
  }
}

const activateLevel = (name: string) => {
  if (props.mode === 'open') {
    openLevel(name)
  } else {
    saveLevel(name)
  }
}

const saveToDisk = () => {
  props.levelStorage.download(editor.value.save())
  modelValue.value = false
}

const openFromDisk = () => {
  fileInputRef.value?.click()
}

const onFileChange = async () => {
  const file = fileInputRef.value?.files?.[0]
  if (file) {
    const content = JSON.parse(await file.text())
    if (isSavedLevel(content)) {
      editor.value = new Editor(content)
      modelValue.value = false
    } else {
      // TODO: use a component for this, have a way to update outdated levels
      window.alert('Invalid level file')
    }
  } else {
    console.error('No file selected')
  }
  // Clear the file input so if the user uploads the same file again, the change
  // event will fire
  if (fileInputRef.value) {
    // the only value we're allowed to set for an input element from a script is
    // an empty string
    fileInputRef.value.value = ''
  }
}

watch(modelValue, open => {
  if (open) {
    levels.value = props.levelStorage.getSavedLevels()
  }
})
</script>

<style lang="scss">
.pdx-level-browser {
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
