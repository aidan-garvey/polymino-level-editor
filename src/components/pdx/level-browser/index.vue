<template>
  <pdx-dialog v-model="modelValue">
    <pdx-dialog-title-bar title="Level Browser" />

    <div class="pdx-level-browser">
      <div class="pdx-level-browser__files">
        <pdx-level-browser-list
          :levels
          :input-file-name="fileName"
          @select="name => fileName = name"
          @activate="activateLevel"
        />

        <pdx-level-browser-input
          v-model="fileName"
          @keyup.enter="() => activateLevel(fileName)"
        />
        <pdx-level-browser-save-buttons
          v-if="mode === 'save'"
          :levels
          :file-name="fileName"
          @save="saveLevel"
          @save-to-disk="saveToDisk"
        />
        <pdx-level-browser-open-buttons
          v-else-if="mode === 'open'"
          :levels="levels"
          :file-name="fileName"
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

      <pdx-level-browser-file-info
        :dialog-open="modelValue"
        :editor
        :level-storage
        :file-name
        @level-renamed="onLevelRenamed"
        @level-deleted="onLevelDeleted"
      />
    </div>
  </pdx-dialog>
</template>

<script setup lang="ts">
import type { LevelStorage, SavedLevelDict } from '@/types/Storage/LevelStorage'
import { Editor } from '@/types/Editor'
import { isSavedLevel } from '@/types/Saved/SavedLevel'
import { parseOrDefault } from '@/utils/parseOrDefault'
import { useDialog } from '@/use/dialog'
import { fileNameValid, NameResult } from '@/utils/fileName'

const modelValue = defineModel<boolean>({ required: true })
const editor = defineModel<Editor>('editor', { required: true })

const props = defineProps<{
  levelStorage: LevelStorage
  mode: 'open' | 'save'
}>()

const { showConfirmation, showAlert } = useDialog()

const fileInputRef = useTemplateRef('fileInputRef')

const levels = ref<SavedLevelDict | null>(null)

const fileName = ref('')

const openLevel = (name: string) => {
  const level = props.levelStorage.load(name)
  if (level) {
    editor.value = new Editor(level)
    modelValue.value = false
  }
}

const saveLevel = (name: string) => {
  let exhaustive: never
  const result = fileNameValid(name, props.levelStorage)

  switch (result) {
    case NameResult.EMPTY:
      showAlert('File name cannot be empty')
      break
    case NameResult.INVALID_CHARS:
      showAlert('File name contains invalid characters')
      break
    case NameResult.UNTRIMMED:
      showAlert('File name cannot begin or end with spaces')
      break
    case NameResult.MATCHES_EXISTING:
      showConfirmation(
        'Are you sure you want to overwrite this level?',
        confirmSaveLevel
      )
      break
    case NameResult.SAFE:
      confirmSaveLevel()
      break
    default:
      exhaustive = result
      showAlert(`Error: unexpected issue with file name, code: ${exhaustive}`)
      break
  }
}

const confirmSaveLevel = () => {
  try {
    props.levelStorage.saveAs(editor.value.saveForLocalStorage(), fileName.value)
    modelValue.value = false
  } catch (error) {
    console.error(error)
    // TODO: detect the error type and show a more specific message, e.g. tell
    // user they need to delete levels to make room
    showAlert('Failed to save level')
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
  props.levelStorage.download(editor.value.saveForDownload())
  modelValue.value = false
}

const openFromDisk = () => {
  fileInputRef.value?.click()
}

const onFileChange = async () => {
  const file = fileInputRef.value?.files?.[0]
  if (file) {
    const content = parseOrDefault(await file.text())
    if (isSavedLevel(content)) {
      editor.value = new Editor(content)
      modelValue.value = false
    } else {
      showAlert('Invalid level file')
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

const updateLevels = () => {
  levels.value = props.levelStorage.getSavedLevels()
}

const onLevelRenamed = (newName: string) => {
  fileName.value = newName
  updateLevels()
}

const onLevelDeleted = () => {
  fileName.value = ''
  updateLevels()
}

watch(modelValue, open => {
  if (open) {
    updateLevels()
  }
})
</script>

<style lang="scss">
.pdx-level-browser {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 8px;
  padding: 4px;

  &__files {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
}
</style>
