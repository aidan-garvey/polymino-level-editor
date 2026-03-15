<template>
  <div class="pdx-dropdown-item"
    @click="emit('click')"
  >
    <span class="pdx-dropdown-item__label">
      {{ label }}
    </span>
    <span
      v-if="hotkey"
      class="pdx-dropdown-item__hotkey"
    >
      {{ hotkey }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { makeKeyCombo } from '@/utils/hotkey'

const props = defineProps<{
  label: string
  hotkey?: string
}>()

const emit = defineEmits<{
  click: []
}>()

if (props.hotkey) {
  useEventListener('keydown', makeKeyCombo(props.hotkey, () => emit('click')))
}
</script>

<style lang="scss">
.pdx-dropdown-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  gap: 10px;
  padding: 3px 6px;
  min-width: 175px;
  font-size: 14px;

  cursor: pointer;

  &:hover {
    background-color: #444;
  }
  &:hover &__label {
    color: #ff0;
  }

  &__hotkey {
    color: #999;
  }
}
</style>
