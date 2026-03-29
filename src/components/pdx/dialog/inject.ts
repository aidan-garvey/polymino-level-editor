import type { ModelRef, TemplateRef } from 'vue'

export interface InputDialogOptions {
  allowedChars?: RegExp
  maxLength?: number
  initialValue?: string
}

export interface DialogManagerMethods {
  showConfirmation: (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
  ) => void

  showAlert: (message: string, onClose?: () => void) => void

  showInputDialog: (
    title: string,
    label: string,
    onConfirm: (inputText: string) => void,
    onCancel?: () => void,
    options?: InputDialogOptions,
  ) => void
}

/**
 * To allow the pdx-dialog-title-bar component to close any dialog it's in, the
 * dialog provides this reference to its modelValue.
 */
export const injectDialogOpen: InjectionKey<ModelRef<boolean>>
  = Symbol('dialogOpen')

/**
 * Reference to the global dialog manager.
 */
export const injectDialogManager: InjectionKey<TemplateRef<DialogManagerMethods>>
  = Symbol('dialogManager')
