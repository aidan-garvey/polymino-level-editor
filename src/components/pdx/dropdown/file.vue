<template>
  <pdx-dropdown
    ref="dropdown"
    name="File"
    @open="emit('open')"
  >
    <pdx-dropdown-item
      label="New"
      @click="newLevel"
    />
    <pdx-dropdown-item
      label="Open"
      hotkey="Ctrl+O"
      @click="openLevel"
    />
    <pdx-dropdown-item
      label="Save"
      hotkey="Ctrl+S"
      @click="saveLevel"
    />
    <pdx-dropdown-item
      label="Save as"
      hotkey="Ctrl+Shift+S"
      @click="saveLevelAs"
    />
    <pdx-dropdown-item
      label="Save to disk"
      hotkey="Ctrl+D"
      @click="downloadLevel"
    />
    <pdx-dropdown-item
      label="Export"
      hotkey="Ctrl+E"
      @click="exportLevel"
    />
  </pdx-dropdown>

  <pdx-level-browser
    v-model="showLevelBrowser"
    v-model:editor="editor"
    :level-storage
    :mode="levelBrowserMode"
  />
</template>

<script setup lang="ts">
import type { LevelStorage } from '@/types/Storage/LevelStorage'
import { Editor } from '@/types/Editor'
import { useDialog } from '@/use/dialog'

const editor = defineModel<Editor>('editor', { required: true })

const props = defineProps<{
  levelStorage: LevelStorage
}>()

const emit = defineEmits<{
  open: []
}>()

const dropdown = useTemplateRef('dropdown')

const { showConfirmation } = useDialog()

const showLevelBrowser = ref(false)
const levelBrowserMode = ref<'open' | 'save'>('open')

const newLevel = () => {
  // TODO: track unsaved changes so we can skip this for levels which are
  // unmodified since last save
  showConfirmation(
    'Are you sure you want to start a new level?\n' +
    'Any unsaved progress will be lost.',
    confirmNewLevel
  )
}

const confirmNewLevel = () => {
  editor.value = new Editor()
  props.levelStorage.currentLevelName.value = null
}

const openLevel = () => {
  // TODO: if there are unsaved changes, ask if user wants to save them first
  levelBrowserMode.value = 'open'
  showLevelBrowser.value = true
}

const saveLevel = () => {
  if (!props.levelStorage.currentLevelName.value) {
    saveLevelAs()
  } else {
    props.levelStorage.save(editor.value.save())
  }
}

const saveLevelAs = () => {
  levelBrowserMode.value = 'save'
  showLevelBrowser.value = true
}

const downloadLevel = () => {
  props.levelStorage.download(editor.value.save())
}

const exportLevel = () => {
  props.levelStorage.export(editor.value.export())
}

defineExpose({
  open: () => dropdown.value?.open(),
  close: () => dropdown.value?.close(),
})
</script>
