<template>
  <div
    class="pdx-icon"
    :class="{
      'pdx-icon--filled': fill,
    }"
    :style="{
      height: `${size}px`,
      width: `${size}px`
    }"
  >
    <span
      :style="{
        fontSize: `${size}px`
      }"
    >
      {{ name }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  size: number | string
  fill?: boolean
}>()
</script>

<style lang="scss">
.pdx-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  font-family: 'Material Symbols Sharp';
  font-weight: 300;

  transition: font-variation-settings 0.1s ease-out;
  font-variation-settings: 'FILL' 0;
  &.pdx-icon--filled {
    font-variation-settings: 'FILL' 1;
  }
}
</style>
