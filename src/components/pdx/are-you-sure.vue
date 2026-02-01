<template>
  <pdx-dialog v-model="modelValue">
    <div class="pdx-are-you-sure">
      <div class="pdx-are-you-sure__message">
        <slot>
          {{ message }}
        </slot>
      </div>
      <div class="pdx-are-you-sure__buttons">
        <button type="button" @click="cancel">Cancel</button>
        <button type="button" @click="confirm">Confirm</button>
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
  confirm: []
  cancel: []
}>()

const confirm = () => {
  modelValue.value = false
  emit('confirm')
}

const cancel = () => {
  modelValue.value = false
  emit('cancel')
}
</script>

<style lang="scss">
.pdx-are-you-sure {
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 20px;
  max-width: 350px;

  &__message, &__buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
}
</style>
