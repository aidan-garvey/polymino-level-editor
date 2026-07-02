import type { Tool } from '@/types/Tool'
import type { Editor } from '@/types/Editor'
import type { MouseButton } from '@/consts/mouse'
import { savedLevelsEqual, type SavedLevel } from '@/types/Saved/SavedLevel'
import type {
  Action,
  CompletedAction,
  PendingAction,
  DataAction,
  JunkAction,
  SettingsAction,
} from '@/types/History/Action'
import { ActionKind } from '@/types/History/Action'
import { notNull } from '@/utils/notNull'

const captured = Symbol('captured')

/**
 * Forces the Editor to call `captureBefore` before it can call one of the
 * public `pushX` methods. See {@link History#captureBefore} for more info.
 */
interface CapturedLevel extends SavedLevel {
  [captured]: true
}

/**
 * Maintains record history of editor actions, enabling undo/redo functionality.
 */
export class History {
  /**
   * Maximum stack entries to store before we start discarding the oldest ones.
   */
  private static readonly STACK_LIMIT = 128

  private readonly undoStack = reactive<CompletedAction[]>([])
  private readonly redoStack = reactive<CompletedAction[]>([])

  private readonly pending = ref<PendingAction | null>(null)

  private readonly editor: Editor

  private nextId = 0

  /**
   * The ID of the action that was most recent on the stack when the level was
   * last saved. Used to detect if there are unsaved changes.
   */
  private readonly lastSavedId: Ref<number>

  /**
   * Public view of undoable actions, oldest to newest.
   * Does not include the pending action, as the pending action may be silently
   * discarded if it did not result in any change once it is finished.
   */
  readonly undoActions = computed<Action[]>(() => {
    return this.undoStack.map(a => a.action)
  })

  /**
   * Public view of redoable actions, oldest to newest.
   */
  readonly redoActions = computed<Action[]>(() => {
    return this.redoStack.map(a => a.action).reverse()
  })

  /**
   * Pushes the initial NEW_LEVEL/OPEN_LEVEL action onto the stack when this
   * object is constructed.
   */
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
    before: CapturedLevel
  ): void {
    const after = this.editor.saveForHistory()
    // Skip no-ops so they don't flood the history (e.g. repeatedly applying the
    // same color to a junk piece).
    if (savedLevelsEqual(before, after))
      return

    this.pushPending()
    this.undoStack.push({
      action: {
        id: ++this.nextId,
        kind,
      },
      before,
      after,
    })
    // Need to clear this ourselves in case pushPending didn't.
    this.redoStack.length = 0
    this.trimStack()
  }

  /**
   * Create a pending settings action of the given kind, unless a matching one
   * already exists. The public `continueX` methods reuse this no-op behavior to
   * recreate a pending that was consumed mid-edit (e.g. by undo/redo/save
   * while the input stayed focused), so later edits are still recorded.
   */
  private startSettingsAction(kind: SettingsAction['kind']): void {
    if (this.pending.value?.action.kind !== kind) {
      this.pushPending()
      this.pending.value = {
        action: {
          id: ++this.nextId,
          kind,
        },
        before: this.editor.saveForHistory(),
      }
    }
  }

  /**
   * Finish a pending settings action, relying on `pushPending`'s
   * `savedLevelsEqual` check to discard the edit if nothing actually changed.
   */
  private endSettingsAction(kind: SettingsAction['kind']): void {
    if (this.pending.value?.action.kind === kind) {
      this.pushPending()
    }
  }

  /**
   * Push the pending action onto the undo stack if one exists and its `before`
   * state is different from the editor's current state. If an action is pushed,
   * the redo stack will be cleared. Otherwise, the pending action will just be
   * discarded.
   *
   * This should be called before undoing or redoing an action, when a new
   * pending action is about to be created, and when an entire action is about
   * to be pushed onto the undo stack (bypassing this.pending).
   */
  private pushPending(): void {
    if (this.pending.value) {
      const currState = this.editor.saveForHistory()

      if (savedLevelsEqual(this.pending.value.before, currState)) {
        this.pending.value = null
        return
      }

      this.undoStack.push({
        ...this.pending.value,
        after: currState,
      })
      this.pending.value = null
      this.redoStack.length = 0
      this.trimStack()
    }
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

  /**
   * Ensures the undo stack is no larger than STACK_LIMIT.
   */
  private trimStack() {
    // Note that we don't care about the size of the redo stack, as every action
    // added to the redo stack was removed from the undo stack, and if we add
    // more actions to the undo stack, we clear the redo stack.
    while (this.undoStack.length > History.STACK_LIMIT) {
      this.undoStack.shift()
    }
  }

  constructor(editor: Editor, isNewLevel: boolean) {
    this.editor = editor
    const dataActionKind = isNewLevel
      ? ActionKind.NEW_LEVEL
      : ActionKind.OPEN_LEVEL
    this.pushDataAction(dataActionKind, editor.saveForHistory())
    this.lastSavedId = ref(notNull(this.undoStack.at(-1)?.action.id))
  }

  startBrush(tool: Tool, button: MouseButton): void {
    this.pushPending()
    this.pending.value = {
      action: {
        id: ++this.nextId,
        kind: ActionKind.BRUSH,
        tool,
        button,
      },
      before: this.editor.saveForHistory(),
    }
  }

  /**
   * If the action identified by the given parameters is a continuation of the
   * current action, this method does nothing. Otherwise, a new brush action is
   * started.
   */
  continueBrush(tool: Tool, button: MouseButton): void {
    if (!this.matchesPendingBrush(tool, button)) {
      this.startBrush(tool, button)
    }
  }

  endBrush(): void {
    if (this.pending.value?.action.kind === ActionKind.BRUSH) {
      this.pushPending()
    }
  }

  /**
   * Flush any pending action, then return a snapshot of the editor's current
   * state. Simple actions (no separate start and end) must capture their
   * `before` state with this rather than `Editor.saveForHistory`. This is to
   * encourage callers to flush the pending action before applying a change and
   * calling a `pushX` method. If an action was still pending when the editor
   * made a change, and a `pushX` method was only called afterwards, the pending
   * action would be committed with an `after` state that includes the change,
   * so redoing it would fast forward too far.
   */
  captureBefore(): CapturedLevel {
    this.pushPending()
    return {
      ...this.editor.saveForHistory(),
      [captured]: true,
    }
  }

  pushMoveJunk(before: CapturedLevel): void {
    this.pushSimpleAction(ActionKind.MOVE_JUNK, before)
  }

  pushCopyJunk(before: CapturedLevel): void {
    this.pushSimpleAction(ActionKind.COPY_JUNK, before)
  }

  pushEditJunk(before: CapturedLevel): void {
    this.pushSimpleAction(ActionKind.EDIT_JUNK, before)
  }

  pushDeleteJunk(before: CapturedLevel): void {
    this.pushSimpleAction(ActionKind.DELETE_JUNK, before)
  }

  startLevelName(): void {
    this.startSettingsAction(ActionKind.LEVEL_NAME)
  }

  continueLevelName(): void {
    this.startSettingsAction(ActionKind.LEVEL_NAME)
  }

  endLevelName(): void {
    this.endSettingsAction(ActionKind.LEVEL_NAME)
  }

  startRngSeed(): void {
    this.startSettingsAction(ActionKind.GAME_RNG_SEED)
  }

  continueRngSeed(): void {
    this.startSettingsAction(ActionKind.GAME_RNG_SEED)
  }

  endRngSeed(): void {
    this.endSettingsAction(ActionKind.GAME_RNG_SEED)
  }

  startBaseLayerSeed(): void {
    this.startSettingsAction(ActionKind.BASE_LAYER_SEED)
  }

  continueBaseLayerSeed(): void {
    this.startSettingsAction(ActionKind.BASE_LAYER_SEED)
  }

  endBaseLayerSeed(): void {
    this.endSettingsAction(ActionKind.BASE_LAYER_SEED)
  }

  startBaseLayerRows(): void {
    this.startSettingsAction(ActionKind.BASE_LAYER_ROWS)
  }

  continueBaseLayerRows(): void {
    this.startSettingsAction(ActionKind.BASE_LAYER_ROWS)
  }

  endBaseLayerRows(): void {
    this.endSettingsAction(ActionKind.BASE_LAYER_ROWS)
  }

  pushSetBannedColor(before: CapturedLevel): void {
    this.pushSimpleAction(ActionKind.BANNED_COLOR, before)
  }

  undo(): void {
    this.pushPending()

    const undone = this.undoStack.at(-1)
    // Don't allow undoing the first action, there should always be at least one
    // entry in the history window (which is why we push a file action on
    // construction)
    if (undone && this.undoStack.length > 1) {
      this.undoStack.pop()
      this.redoStack.push(undone)
      this.editor.jumpToHistory(undone.before)
    }
  }

  redo(): void {
    this.pushPending()

    const redone = this.redoStack.pop()
    if (redone) {
      this.undoStack.push(redone)
      this.editor.jumpToHistory(redone.after)
    }
  }

  /**
   * Undo actions until the one with the given ID is the last action performed.
   * This results in the specified action being at the top of the undo stack.
   */
  undoTo(id: number): void {
    this.pushPending()

    // make sure the action with that ID is in the undo stack
    if (!this.undoStack.find(a => a.action.id === id)) {
      console.warn(`Could not find action with ID ${id} in undo stack`)
      return
    }
    // roll back until it's last on the undo stack, but don't allow popping the
    // last thing on the undo stack
    while (this.undoStack.length > 1
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
    this.pushPending()

    // make sure the action with that ID is in the redo stack
    if (!this.redoStack.find(a => a.action.id === id)) {
      console.warn(`Could not find action with ID ${id} in redo stack`)
      return
    }
    // roll forwards until it's on the undo stack
    while (this.redoStack.length > 0
      && this.undoStack.at(-1)?.action.id !== id
    ) {
      this.redo()
    }
  }

  onLevelSaved(): void {
    this.pushPending()
    this.lastSavedId.value = this.undoStack.at(-1)?.action.id ?? -1
  }

  hasUnsavedChanges(): boolean {
    const lastAction = this.pending.value ?? this.undoStack.at(-1)
    // The case where lastAction is undefined has no meaning because we always
    // push a NEW_LEVEL or OPEN_LEVEL action when we're created, and don't allow
    // undoing the last action on the stack.
    return lastAction?.action.id !== this.lastSavedId.value
  }
}
