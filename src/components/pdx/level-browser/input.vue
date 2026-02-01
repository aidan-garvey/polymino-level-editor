<template>
  <div class="pdx-level-browser-input text-body">
    <span>Level name:</span>
    <input type="text"
      v-model="levelName"
    />
  </div>
</template>

<script setup lang="ts">
const levelName = defineModel<string>({ required: true })
</script>

<style lang="scss">
.pdx-level-browser-input {
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  justify-content: flex-end;

  input {
    appearance: none;
    outline: none;
    background: #111;
    border: 1px solid #444;
    border-radius: 0;
    color: #fff;

    &:focus {
      border-color: #fff;
    }
  }
}
</style>
