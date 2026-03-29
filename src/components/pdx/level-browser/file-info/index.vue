<template>
  <div class="pdx-level-browser-file-info">
    <div class="text-detail">
      <template v-if="levelName">
        {{ levelName }}
      </template>
      <template v-else>
        &nbsp;
      </template>
    </div>

    <div class="pdx-level-browser-file-info__preview">
      <!--
      Put the cell grid in a container w/ fixed size, because cell grids use
      absolute positioning
      -->
      <div
        :style="{
          '--block-size': `${PREVIEW_BLOCK_SIZE}px`,
          width: `${PREVIEW_WIDTH}px`,
          height: `${PREVIEW_HEIGHT}px`,
          position: 'relative',
        }"
      >
        <pdx-cell-grid
          v-if="currentGrid"
          :editor
          :grid="currentGrid"
        />
      </div>

      <button
        type="button"
        :disabled="!selectedLevel"
        @click="onRename"
      >
        Rename
      </button>

      <button
        type="button"
        :disabled="!selectedLevel"
        @click="onDelete"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import type { LevelStorage } from '@/types/Storage/LevelStorage'
import type { SavedLevel } from '@/types/Saved/SavedLevel'
import { CellGrid } from '@/types/CellGrid'
import { exportSavedLevel } from '@/utils/export'
import { BOARD_WIDTH, BOARD_HEIGHT } from '@/consts/board'
import { useDialog } from '@/use/dialog'
import { fileNameValid, NameResult } from '@/utils/fileName'

const props = defineProps<{
  /** True if the level browser is open */
  dialogOpen: boolean
  editor: Editor
  levelStorage: LevelStorage
  fileName: string
}>()

const emit = defineEmits<{
  levelRenamed: [newName: string]
  levelDeleted: []
}>()

const PREVIEW_BLOCK_SIZE = 8
const PREVIEW_WIDTH = PREVIEW_BLOCK_SIZE * BOARD_WIDTH
const PREVIEW_HEIGHT = PREVIEW_BLOCK_SIZE * BOARD_HEIGHT

const { showAlert, showConfirmation, showInputDialog } = useDialog()

/**
 * The currently selected file in the browser, or null if one isn't selected.
 */
const selectedLevel = ref<SavedLevel | null>(null)

// Need to reload when the selected level changes, or when the dialog is opened
// (in case the user has saved changes to the active level before opening).
watch([() => props.fileName, () => props.dialogOpen], () => {
  selectedLevel.value = props.levelStorage.loadPreview(props.fileName)
}, { immediate: true })

const currentGrid = computed<CellGrid | null>(() => {
  if (selectedLevel.value) {
    const exported = exportSavedLevel(selectedLevel.value)
    return CellGrid.fromExported(exported, false)
  } else {
    return null
  }
})

const levelName = computed<string | null>(() => {
  if (selectedLevel.value) {
    return selectedLevel.value.name
  } else {
    return null
  }
})

const onRename = () => {
  const commitRename = (input: string) => {
    try {
      props.levelStorage.rename(props.fileName, input)
      emit('levelRenamed', input)
    } catch (error) {
      console.error(error)
      // TODO: detect the error type and show a more specific message, e.g. tell
      // the user they need to delete levels to make room
      showAlert('Failed to rename level')
    }
  }

  const onConfirm = (input: string) => {
    let exhaustive: never
    const result = fileNameValid(input, props.levelStorage)

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
          'A file with that name already exists. Are you sure you want to overwrite it?',
          () => commitRename(input)
        )
        break
      case NameResult.SAFE:
        commitRename(input)
        break
      default:
        exhaustive = result
        showAlert(`Error: unexpected issue with file name, code: ${exhaustive}`)
        break
    }
  }

  showInputDialog('Rename file', 'File name', onConfirm, undefined, {
    initialValue: props.fileName
  })
}

const onDelete = () => {
  showConfirmation('Are you sure you want to delete this level?', () => {
    props.levelStorage.delete(props.fileName)
    emit('levelDeleted')
  })
}
</script>

<style lang="scss">
.pdx-level-browser-file-info {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__preview {
    padding: 4px;
    border: 1px solid #aaa;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
  }
}
</style>
