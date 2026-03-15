import type { SavedLevel } from '@/types/Saved/SavedLevel'
import type { Tool } from '@/types/Tool'
import type { MouseButton } from '@/consts/mouse'

export enum ActionKind {
  NEW_LEVEL,
  OPEN_LEVEL,
  BRUSH,
  MOVE_JUNK,
  COPY_JUNK,
  EDIT_JUNK,
  DELETE_JUNK,
  LEVEL_NAME,
  GAME_RNG_SEED,
  BASE_LAYER_SEED,
  BASE_LAYER_ROWS,
  BANNED_COLOR,
}

export interface DataAction {
  readonly id: number
  readonly kind:
    | ActionKind.NEW_LEVEL
    | ActionKind.OPEN_LEVEL
}

export interface BrushAction {
  readonly id: number
  readonly kind: ActionKind.BRUSH
  readonly tool: Tool
  readonly button: MouseButton
}

export interface JunkAction {
  readonly id: number
  readonly kind:
    | ActionKind.MOVE_JUNK
    | ActionKind.COPY_JUNK
    | ActionKind.EDIT_JUNK
    | ActionKind.DELETE_JUNK
}

export interface SettingsAction {
  readonly id: number
  readonly kind:
    | ActionKind.LEVEL_NAME
    | ActionKind.GAME_RNG_SEED
    | ActionKind.BASE_LAYER_SEED
    | ActionKind.BASE_LAYER_ROWS
    | ActionKind.BANNED_COLOR
}

export type Action =
  | DataAction
  | BrushAction
  | JunkAction
  | SettingsAction

export interface PendingAction {
  readonly action: Action
  readonly before: SavedLevel
}

export interface CompletedAction {
  readonly action: Action
  readonly before: SavedLevel
  readonly after: SavedLevel
}
