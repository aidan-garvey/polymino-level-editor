<!-- Global dialog manager to facilitate using dialogs programatically -->
<template>
  <template
    v-for="conf of confirmations"
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
    v-for="alert of alerts"
    :key="alert.id"
  >
    <pdx-alert
      model-value
      :message="alert.message"
      @close="alert.onClose"
    />
  </template>
</template>

<script setup lang="ts">
import type { DialogManagerMethods } from './inject'

type Confirmation = {
  id: number
  message: string
  onConfirm: () => void
  onCancel: () => void
}

type Alert = {
  id: number
  message: string
  onClose: () => void
}

let nextId = 0
const confirmations = ref<Confirmation[]>([])
const alerts = ref<Alert[]>([])

const removeDialog = (id: number) => {
  for (const arr of [confirmations.value, alerts.value]) {
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

defineExpose<DialogManagerMethods>({
  showConfirmation,
  showAlert,
})
</script>
