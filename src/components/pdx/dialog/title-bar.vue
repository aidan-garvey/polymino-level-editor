<template>
  <div class="pdx-dialog-title-bar">
    <div class="text-title">
      {{ title }}
    </div>
    <div
      class="pdx-dialog-title-bar__close pdx-button"
      tabindex="0"
      @click="dialogOpen = false"
    >
      <pdx-icon name="close" size="20" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { injectDialogOpen } from './inject'
import { notNull } from '@/utils/notNull'

const props = defineProps<{
  title: string
}>()

const dialogOpen = notNull(inject(injectDialogOpen))
</script>

<style lang="scss">
.pdx-dialog-title-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding-left: 6px;

  &__close {
    background: #400;
    padding: 4px;

    transition: background-color 0.1s ease-out;

    &:hover {
      background: #a00;
    }

    &:active, &:focus-visible {
      background: #700;
    }
  }
}
</style>
