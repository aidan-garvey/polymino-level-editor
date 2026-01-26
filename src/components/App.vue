<template>
  <pdx-editor />
</template>

<style lang="css">
/**
 * Import style sheets here instead of in other component style tags to prevent
 * the same style rules from being imported multiple times. Reduces noise when
 * looking at styles in your browser's devtools.
 */
@import './color.scss';
@import './typography.scss';
@import './pdx/tool-selector.scss';
@import './pdx/junk-selector.scss';
@import './pdx/side-panel.scss';

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

#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow-y: hidden;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

select {
  outline: none;
  background: #000;
  color: #fff;
  padding: 4px;
  width: fit-content;
}
</style>
