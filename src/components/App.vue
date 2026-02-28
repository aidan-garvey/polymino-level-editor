<template>
  <div class="app-top">
    <pdx-menu-bar
      v-model:editor="editor"
      :level-storage
    />
  </div>
  <div class="app-middle">
    <pdx-editor :editor />
  </div>
  <div class="app-bottom">

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
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow-y: hidden;
  flex-direction: column;
  justify-content: center;

  .app-top, .app-bottom {
    flex: 0;
  }

  .app-middle {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
