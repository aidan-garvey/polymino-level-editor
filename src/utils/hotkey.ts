/**
 * Given the label for a hotkey where each key that needs to be pressed
 * simultaneously is separated by a '+', and an action to perform when the key
 * combination is pressed, return an event handler that calls preventDefault on
 * the event and invokes the given callback when the key combination is pressed.
 */
export const makeHotkey = (
  hotkeyLabel: string,
  action: (e: KeyboardEvent) => void,
): ((e: KeyboardEvent) => void) => {
  const parts = hotkeyLabel.split('+').map(s => s.toLowerCase().trim())

  let alt = false
  let ctrl = false
  let shift = false
  let letter = ''

  const a = 'a'.charCodeAt(0)
  const z = 'z'.charCodeAt(0)

  for (const key of parts) {
    const code = key.charCodeAt(0)
    if (key.length === 1 && code >= a && code <= z) {
      letter = key
    } else switch (key) {
      case 'alt':
        alt = true
        break
      case 'ctrl':
        ctrl = true
        break
      case 'shift':
        shift = true
        break
      default:
        throw new TypeError(`Unrecognized key ${key}`)
    }
  }

  if (letter.length !== 1) {
    throw new TypeError('No letter provided for hotkey')
  }

  return (e: KeyboardEvent) => {
    if (e.altKey === alt
      && e.ctrlKey === ctrl
      && e.shiftKey === shift
      && e.key.toLowerCase() === letter
    ) {
      e.preventDefault()
      e.stopPropagation()
      action(e)
    }
  }
}
