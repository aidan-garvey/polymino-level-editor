<template>
  <pdx-dialog v-model="modelValue">
    <pdx-dialog-title-bar
      :title
      @close="cancel"
    />

    <div class="pdx-dialog-common">
      <div class="pdx-dialog-common__message">
        <pdx-input-text
          v-model="inputText"
          :label="inputLabel"
          :allowed-chars
          :max-length
        />
      </div>

      <div class="pdx-dialog-common__buttons">
        <button
          type="button"
          @click="cancel"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="confirm"
        >
          Confirm
        </button>
      </div>
    </div>
  </pdx-dialog>
</template>

<script setup lang="ts">
const modelValue = defineModel<boolean>({ required: true })

const props = defineProps<{
  title: string
  inputLabel: string
  allowedChars?: RegExp
  maxLength?: number
  initialValue?: string
}>()

const emit = defineEmits<{
  confirm: [inputText: string]
  cancel: []
}>()

const inputText = ref(props.initialValue ?? '')

const confirm = () => {
  modelValue.value = false
  emit('confirm', inputText.value)
}

const cancel = () => {
  modelValue.value = false
  emit('cancel')
}
</script>
