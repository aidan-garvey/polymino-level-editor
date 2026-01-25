<template>
  <pdx-editor />
</template>

<style lang="css">
@import './variables.scss';
@import './pdx/tool-selector.scss';
@import './pdx/junk-builder/selector.scss';

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

.text-center {
  text-align: center;
}

.text-body {
  font-size: 16px;
  line-height: 20px;
}

.text-detail {
  font-size: 14px;
  line-height: 20px;
  color: #ccc;
}

select {
  outline: none;
  background: #000;
  color: #fff;
  padding: 4px;
  width: fit-content;
}
</style>
