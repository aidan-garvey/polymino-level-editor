import type { TemplateRef } from 'vue'

export interface DialogManagerMethods {
  showConfirmation(
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
  ): void

  showAlert(message: string, onClose?: () => void): void
}

/**
 * To allow the pdx-dialog-title-bar component to close any dialog it's in, the
 * dialog provides this reference to its modelValue.
 */
export const injectDialogOpen = Symbol('dialogOpen') as InjectionKey<Ref<boolean>>

/**
 * Reference to the global dialog manager.
 */
export const injectDialogManager = Symbol('dialogManager') as InjectionKey<TemplateRef<DialogManagerMethods>>
