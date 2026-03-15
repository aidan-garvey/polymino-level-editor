import type { Tool } from '@/types/Tool'
import type { Editor } from '@/types/Editor'
import type { MouseButton } from '@/consts/mouse'
import type { SavedLevel } from '@/types/Saved/SavedLevel'
import type {
  Action,
  CompletedAction,
  PendingAction,
  DataAction,
  JunkAction,
  SettingsAction,
} from '@/types/History/Action'
import { ActionKind } from '@/types/History/Action'

/**
 * Maintains record history of editor actions, enabling undo/redo functionality.
 */
export class History {
  private readonly undoStack = reactive<CompletedAction[]>([])
  private readonly redoStack = reactive<CompletedAction[]>([])

  private readonly pending = ref<PendingAction | null>(null)

  private readonly editor: Editor

  private nextId = 0

  /**
   * Public view of undoable actions, oldest to newest.
   * Includes the pending action, if any.
   */
  readonly undoActions = computed<Action[]>(() => {
    const result = this.undoStack.map(a => a.action)
    if (this.pending.value)
      result.push(this.pending.value.action)
    return result
  })

  /**
   * Public view of redoable actions, oldest to newest.
   */
  readonly redoActions = computed<Action[]>(() => {
    return this.redoStack.map(a => a.action).reverse()
  })

  private pushDataAction(kind: DataAction['kind'], data: SavedLevel): void {
    this.undoStack.push({
      action: {
        id: ++this.nextId,
        kind,
      },
      before: data,
      after: data,
    })
  }

  private pushSimpleAction(
    kind: (JunkAction | SettingsAction)['kind'],
    before: SavedLevel
  ): void {
    this.finishAction()
    this.undoStack.push({
      action: {
        id: ++this.nextId,
        kind,
      },
      before,
      after: this.editor.save(),
    })
  }

  private startSettingsAction(kind: SettingsAction['kind']): void {
    if (this.pending.value?.action.kind !== kind) {
      this.finishAction()
      this.pending.value = {
        action: {
          id: ++this.nextId,
          kind,
        },
        before: this.editor.save(),
      }
    }
  }

  private endSettingsAction<T>(
    kind: SettingsAction['kind'],
    getOldValue: (lvl: SavedLevel) => T,
    newValue: T
  ): void {
    if (this.pending.value?.action.kind === kind) {
      if (getOldValue(this.pending.value.before) !== newValue) {
        this.finishAction()
      } else {
        this.abortAction()
      }
    }
  }

  /**
   * Push the pending action (if one exists) onto the undo stack. Returns true
   * if there was an action to push, or false otherwise.
   */
  private pushPending(): boolean {
    if (this.pending.value) {
      this.undoStack.push({
        ...this.pending.value,
        after: this.editor.save(),
      })
      this.pending.value = null
      return true
    } else {
      return false
    }
  }

  /**
   * Push the pending action onto the undo stack, and clear the redo stack if
   * there was a pending action to push.
   */
  private finishAction(): void {
    if (this.pushPending())
      this.redoStack.length = 0
  }

  private abortAction(): void {
    this.pending.value = null
  }

  private matchesPendingBrush(tool: Tool, button: MouseButton): boolean {
    const compareBrushes = (a: Tool, b: Tool) => {
      return a.kind === b.kind
        && a.brushState === b.brushState
        && a.brushColor === b.brushColor
        && a.brushEffect === b.brushEffect
    }

    return !!this.pending.value
      && this.pending.value.action.kind === ActionKind.BRUSH
      && this.pending.value.action.button === button
      && compareBrushes(this.pending.value.action.tool, tool)
  }

  constructor(editor: Editor, isNewLevel: boolean) {
    this.editor = editor
    const dataActionKind = isNewLevel
      ? ActionKind.NEW_LEVEL
      : ActionKind.OPEN_LEVEL
    this.pushDataAction(dataActionKind, editor.save())
  }

  startBrush(tool: Tool, button: MouseButton): void {
    this.finishAction()
    this.pending.value = {
      action: {
        id: ++this.nextId,
        kind: ActionKind.BRUSH,
        tool,
        button,
      },
      before: this.editor.save(),
    }
  }

  /**
   * If the action indentified by the given parameters is a continuation of the
   * current action, this method does nothing. Otherwise, a new brush action is
   * started.
   */
  continueBrush(tool: Tool, button: MouseButton): void {
    if (!this.matchesPendingBrush(tool, button)) {
      this.startBrush(tool, button)
    }
  }

  pushMoveJunk(before: SavedLevel): void {
    this.pushSimpleAction(ActionKind.MOVE_JUNK, before)
  }

  pushCopyJunk(before: SavedLevel): void {
    this.pushSimpleAction(ActionKind.COPY_JUNK, before)
  }

  pushEditJunk(before: SavedLevel): void {
    this.pushSimpleAction(ActionKind.EDIT_JUNK, before)
  }

  pushDeleteJunk(before: SavedLevel): void {
    this.pushSimpleAction(ActionKind.DELETE_JUNK, before)
  }

  startLevelName(): void {
    this.startSettingsAction(ActionKind.LEVEL_NAME)
  }

  endLevelName(): void {
    this.endSettingsAction(
      ActionKind.LEVEL_NAME,
      lvl => lvl.name,
      this.editor.levelName.value
    )
  }

  startRngSeed(): void {
    this.startSettingsAction(ActionKind.GAME_RNG_SEED)
  }

  endRngSeed(): void {
    this.endSettingsAction(
      ActionKind.GAME_RNG_SEED,
      lvl => lvl.seed,
      this.editor.seed.value
    )
  }

  startBaseLayerSeed(): void {
    this.startSettingsAction(ActionKind.BASE_LAYER_SEED)
  }

  endBaseLayerSeed(): void {
    this.endSettingsAction(
      ActionKind.BASE_LAYER_SEED,
      lvl => lvl.baseLayer.seed,
      this.editor.baseLayer.getSeed()
    )
  }

  startBaseLayerRows(): void {
    this.startSettingsAction(ActionKind.BASE_LAYER_ROWS)
  }

  endBaseLayerRows(): void {
    this.endSettingsAction(
      ActionKind.BASE_LAYER_ROWS,
      lvl => lvl.baseLayer.rows,
      this.editor.baseLayer.getRows()
    )
  }

  pushSetBannedColor(before: SavedLevel): void {
    this.pushSimpleAction(ActionKind.BANNED_COLOR, before)
  }

  undo(): void {
    // this.pushPending()
    // TODO: should be able to delete pushPending as a separate method if the
    // logic for conditionally clearing the redo stack works for everything
    this.finishAction()

    const undone = this.undoStack.at(-1)
    // Don't allow undoing the file action at the beginning
    if (undone && this.undoStack.length > 1) {
      this.undoStack.pop()
      this.redoStack.push(undone)
      this.editor.restore(undone.before)
    }
  }

  redo(): void {
    const redone = this.redoStack.pop()
    if (redone) {
      this.undoStack.push(redone)
      this.editor.restore(redone.after)
    }
  }

  /**
   * Undo actions until the one with the given ID is the last action performed.
   * This results in the specified action being at the top of the undo stack.
   */
  undoTo(id: number): void {
    // this.pushPending()
    // TODO: should be able to delete pushPending as a separate method if the
    // logic for conditionally clearing the redo stack works for everything
    this.finishAction()

    // make sure the action with that ID is in the undo stack
    if (!this.undoStack.find(a => a.action.id === id)) {
      console.warn(`Could not find action with ID ${id} in undo stack`)
      return
    }
    // roll back until it's last on the undo stack
    while (this.undoStack.length
      && this.undoStack.at(-1)?.action.id !== id
    ) {
      this.undo()
    }
  }

  /**
   * Redo actions until the one with the given ID is the last action performed.
   * This results in the specified action being at the top of the undo stack.
   */
  redoTo(id: number): void {
    // make sure the action with that ID is in the redo stack
    if (!this.redoStack.find(a => a.action.id === id)) {
      console.warn(`Could not find action with ID ${id} in redo stack`)
      return
    }
    // roll forwards until it's on the undo stack
    while (this.redoStack.length
      && this.undoStack.at(-1)?.action.id !== id
    ) {
      this.redo()
    }
  }
}
