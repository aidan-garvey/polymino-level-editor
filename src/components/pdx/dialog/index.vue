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
import { registerSelf, deregisterSelf } from '@/use/dialog-registry'

const modelValue = defineModel<boolean>({ required: true })

const props = withDefaults(defineProps<{
  closedby?: 'any' | 'closerequest' | 'none'
}>(), {
  closedby: 'any'
})

// We won't be registered until we call registerSelf, but calling deregisterSelf
// with an unknown symbol is a no-op, so this saves us the hassle of null checks
let dialogId = Symbol()

provide(injectDialogOpen, modelValue)

const dialogRef = useTemplateRef('dialogRef')

const toggle = (show: boolean) => {
  if (show) {
    deregisterSelf(dialogId)
    dialogId = registerSelf()
    dialogRef.value?.showModal()
  } else {
    deregisterSelf(dialogId)
    dialogRef.value?.close()
  }
}

watch(modelValue, show => toggle(show))
watch(dialogRef, () => toggle(modelValue.value))

// Always ensure we deregister ourself before the symbol falls out of scope
onScopeDispose(() => {
  deregisterSelf(dialogId)
})
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
