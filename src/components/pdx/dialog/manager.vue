<!-- Global dialog manager to facilitate using dialogs programatically -->
<template>
  <template
    v-for="conf in confirmations"
    :key="conf.id"
  >
    <pdx-are-you-sure
      model-value
      :message="conf.message"
      @confirm="conf.onConfirm"
      @cancel="conf.onCancel"
    />
  </template>
  <template
    v-for="alert in alerts"
    :key="alert.id"
  >
    <pdx-alert
      model-value
      :message="alert.message"
      @close="alert.onClose"
    />
  </template>
  <template
    v-for="input in inputDialogs"
    :key="input.id"
  >
    <pdx-input-dialog
      model-value
      v-bind="input.options"
      :title="input.title"
      :input-label="input.label"
      @confirm="input.onConfirm"
      @cancel="input.onCancel"
    />
  </template>
</template>

<script setup lang="ts">
import type { DialogManagerMethods, InputDialogOptions } from './inject'

interface Confirmation {
  id: number
  message: string
  onConfirm: () => void
  onCancel: () => void
}

interface Alert {
  id: number
  message: string
  onClose: () => void
}

interface InputDialog {
  id: number
  title: string
  label: string
  onConfirm: (input: string) => void
  onCancel: () => void
  options: InputDialogOptions
}

let nextId = 0
const confirmations = ref<Confirmation[]>([])
const alerts = ref<Alert[]>([])
const inputDialogs = ref<InputDialog[]>([])

const removeDialog = (id: number) => {
  for (const arr of [confirmations.value, alerts.value, inputDialogs.value]) {
    const index = arr.findIndex(d => d.id === id)
    if (index !== -1) {
      arr.splice(index, 1)
    }
  }
}

const wrapHandler = (
  handler: VoidFunction | undefined,
  id: number
): VoidFunction => {
  if (handler) {
    return () => {
      handler()
      removeDialog(id)
    }
  } else {
    return () => removeDialog(id)
  }
}

const showConfirmation = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  const id = nextId++
  confirmations.value.push({
    id,
    message,
    onConfirm: wrapHandler(onConfirm, id),
    onCancel: wrapHandler(onCancel, id),
  })
}

const showAlert = (
  message: string,
  onClose?: () => void
) => {
  const id = nextId++
  alerts.value.push({
    id,
    message,
    onClose: wrapHandler(onClose, id),
  })
}

const showInputDialog = (
  title: string,
  label: string,
  onConfirm: (inputText: string) => void,
  onCancel?: () => void,
  options: InputDialogOptions = {}
) => {
  const id = nextId++

  const confirmWrapper = (input: string) => {
    onConfirm(input)
    removeDialog(id)
  }

  inputDialogs.value.push({
    id,
    title,
    label,
    onConfirm: confirmWrapper,
    onCancel: wrapHandler(onCancel, id),
    options,
  })
}

defineExpose<DialogManagerMethods>({
  showConfirmation,
  showAlert,
  showInputDialog,
})
</script>
