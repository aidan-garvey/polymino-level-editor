<!-- This component basically just exists to group the rules stuff tighter -->
<template>
  <div class="pdx-level-settings-rules">
    <div class="text-title text-center">
      Rules
    </div>

    <pdx-level-settings-goal
      :editor
    />

    <div class="text-detail">
      Extra rules
    </div>

    <pdx-level-settings-loss
      :editor
    />
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'

defineProps<{
  editor: Editor
}>()
</script>

<style lang="scss">
.pdx-level-settings-rules {
  display: flex;
  flex-direction: column;
  gap: 4px;

  div.text-title.text-center {
    line-height: 1;
  }
}
</style>
