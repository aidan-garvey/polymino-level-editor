<template>
  <div class="pdx-level-browser-input">
    <pdx-input-text
      v-model="fileName"
      label="File name:"
      inline-label
    />
  </div>
</template>

<script setup lang="ts">
const fileName = defineModel<string>({ required: true })
</script>

<style lang="scss">
.pdx-level-browser-input {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
</style>
