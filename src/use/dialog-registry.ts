/**
 * Global registry of pdx-dialog instances. Each one registers itself when it
 * opens and deregisters itself when it closes, allowing other parts of the code
 * to know if any dialogs are open, e.g. to disable editor hotkeys.
 */
const dialogRegistry = new Set<symbol>()

/**
 * Registers a new unique symbol in the dialog registry and returns it.
 */
export const registerSelf = () => {
  const sym = Symbol('pdx-dialog')
  dialogRegistry.add(sym)
  return sym
}

/**
 * Removes the given symbol from the dialog registry. If it wasn't already in
 * the registry, this is a no-op.
 */
export const deregisterSelf = (sym: symbol) => {
  dialogRegistry.delete(sym)
}

export const hasOpenDialogs = () => {
  return dialogRegistry.size > 0
}
