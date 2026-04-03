<template>
  <div class="app-top">
    <pdx-menu-bar
      v-model:editor="editor"
      :level-storage
    />
  </div>
  <div class="app-middle">
    <pdx-editor :editor />
    <pdx-history-window :editor />
  </div>
  <div class="app-bottom">
    <pdx-status-bar :editor />
  </div>
  <pdx-dialog-manager
    ref="dialogManager"
  />
</template>

<script setup lang="ts">
import { Editor } from '@/types/Editor'
import { LevelStorage } from '@/types/Storage/LevelStorage'
import { injectDialogManager } from './pdx/dialog/inject'

const editor = shallowRef(new Editor())
const levelStorage = new LevelStorage()

const dialogManager = useTemplateRef('dialogManager')
provide(injectDialogManager, dialogManager)

const onBeforeUnload = (e: BeforeUnloadEvent): void => {
  e.preventDefault()
}

watchEffect(() => {
  if (editor.value.history.hasUnsavedChanges()) {
    window.addEventListener('beforeunload', onBeforeUnload)
  } else {
    window.removeEventListener('beforeunload', onBeforeUnload)
  }
})

const noStorageMsg = `Browser storage is unavailable. It may be disabled in \
your browser's settings. You will still be able to download and upload your \
levels to and from your device, but will not be able to save them in-app.`

onMounted(() => {
  if (!levelStorage.isStorageAvailable()) {
    dialogManager.value?.showAlert(noStorageMsg)
  }
})
</script>

<style lang="scss">
/**
 * Import style sheets here instead of in other component style tags to prevent
 * the same style rules from being imported multiple times. Reduces noise when
 * looking at styles in your browser's devtools.
 */
@use './color';
@use './typography';
@use './button';
@use './pdx/tool-selector';
@use './pdx/junk-selector';
@use './pdx/side-panel';
@use './pdx/dialog/common';
@use './stacking';

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #000;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}

// This component's div element
#app {
  width: 100dvw;
  height: 100dvh;
  display: flex;
  overflow-y: hidden;
  flex-direction: column;
  justify-content: center;

  .app-top, .app-bottom {
    flex: none;
    // Since .app-middle can be wider than #app (which will make it scroll),
    // ensure the menu/status bars always span the whole screen
    position: sticky;
    left: 0;
    // Make the menu bar's dropdowns appear above anything in .app-middle
    z-index: stacking.$top-bottom-bars;
  }

  .app-middle {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // required to prevent any editor panels from being clipped or squished
    // below their minimum width
    min-width: fit-content;

    // So draggable windows in the editor can use `position: absolute`
    position: relative;
  }
}

select {
  outline: none;
  background: #000;
  color: #fff;
  padding: 4px;
  width: fit-content;
}
</style>
