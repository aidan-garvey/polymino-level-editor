import {
  type DialogManagerMethods,
  injectDialogManager
} from '@/components/pdx/dialog/inject'
import { notNull } from '@/utils/notNull'

/**
 * Wraps the current dialog manager to reduce boilerplate.
 */
export const useDialog = (): DialogManagerMethods => {
  const dialogManager = notNull(inject(injectDialogManager))

  return {
    showConfirmation(...args) {
      dialogManager.value?.showConfirmation(...args)
    },
    showAlert(...args) {
      dialogManager.value?.showAlert(...args)
    },
  }
}

