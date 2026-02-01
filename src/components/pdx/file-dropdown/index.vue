<template>
  <div class="pdx-dropdown">
    <div class="pdx-dropdown__button"
      @click.stop="open = !open"
    >
      File
    </div>
    <div
      v-show="open"
      class="pdx-dropdown__list"
    >
      <pdx-file-dropdown-item
        label="New"
        @click="newLevel"
      />
      <pdx-file-dropdown-item
        label="Open"
        hotkey="Ctrl+O"
        @click="openLevel"
      />
      <pdx-file-dropdown-item
        label="Save"
        hotkey="Ctrl+S"
        @click="saveLevel"
      />
      <pdx-file-dropdown-item
        label="Save as"
        hotkey="Ctrl+Shift+S"
        @click="saveLevelAs"
      />
      <pdx-file-dropdown-item
        label="Save to disk"
        hotkey="Ctrl+D"
        @click="downloadLevel"
      />
      <pdx-file-dropdown-item
        label="Export"
        hotkey="Ctrl+E"
        @click="exportLevel"
      />
    </div>

    <pdx-are-you-sure
      v-model="newLevelConfirm"
      @confirm="confirmNewLevel"
    >
      Are you sure you want to start a new level?
      <br />
      Any unsaved progress will be lost.
    </pdx-are-you-sure>

    <pdx-level-browser
      v-model="showLevelBrowser"
      v-model:editor="editor"
      :level-storage
      :mode="levelBrowserMode"
    />
  </div>
</template>

<script setup lang="ts">
import type { LevelStorage } from '@/types/Storage/LevelStorage'
import { Editor } from '@/types/Editor'

const editor = defineModel<Editor>('editor', { required: true })

const props = defineProps<{
  levelStorage: LevelStorage
}>()

const open = ref(false)

const newLevelConfirm = ref(false)

const showLevelBrowser = ref(false)
const levelBrowserMode = ref<'open' | 'save'>('open')

// Clicking anywhere that doesn't use stopPropagation (i.e. anywhere other than
// "File", including the dropdown buttons) will close the dropdown.
useEventListener('click', () => { open.value = false })

const newLevel = () => {
  // TODO: track unsaved changes so we can skip this for levels which are
  // unmodified since last save
  newLevelConfirm.value = true
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
</script>

<style lang="scss">
.pdx-dropdown {
  position: relative;

  &__button {
    display: inline-block;
    padding: 2px 10px;
    padding-bottom: 3px;
    cursor: pointer;
    user-select: none;

    &:hover {
      background: #333;
      color: #ff0;
    }
  }

  &__list {
    position: absolute;
    background-color: #222;
    border: 1px solid #444;
    border-left: none;
    z-index: 2000;
  }
}
</style>
