<template>
  <pdx-dialog v-model="modelValue">
    <div class="pdx-dialog-common">
      <div class="pdx-dialog-common__message">
        <slot>
          {{ message }}
        </slot>
      </div>
      <div class="pdx-dialog-common__buttons">
        <button type="button" @click="close">Close</button>
      </div>
    </div>
  </pdx-dialog>
</template>

<script setup lang="ts">
const modelValue = defineModel<boolean>({ required: true })

const props = defineProps<{
  message?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const close = () => {
  modelValue.value = false
  emit('close')
}
</script>
