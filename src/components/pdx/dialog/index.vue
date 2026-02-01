<template>
  <dialog
    ref="dialogRef"
    class="pdx-dialog"
    :closedby
    @close="modelValue = false"
  >
    <slot></slot>
  </dialog>
</template>

<script setup lang="ts">
import { injectDialogOpen } from './inject'

const modelValue = defineModel<boolean>({ required: true })

const props = withDefaults(defineProps<{
  closedby?: 'any' | 'closerequest' | 'none'
}>(), {
  closedby: 'any'
})

provide(injectDialogOpen, modelValue)

const dialogRef = useTemplateRef('dialogRef')

const toggle = (show: boolean) => {
  if (show) {
    dialogRef.value?.showModal()
  } else {
    dialogRef.value?.close()
  }
}

watch(modelValue, show => toggle(show))
watch(dialogRef, () => toggle(modelValue.value))
</script>

<style lang="scss">
.pdx-dialog {
  border: 1px solid #fff;
  border-radius: 0;
  outline: none;

  background: #000;
  color: #fff;
  padding: 0;

  &::backdrop {
    background: transparent;
  }
}
</style>
