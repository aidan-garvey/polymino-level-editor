import { BlockColor } from '@/types/BlockColor'
import { isSomeKind } from '@/utils/isSomeKind'

/**
 * Additional rules that will force a loss if broken. Human-readable for the
 * same reason that GoalKind values are (they can be used in the UI as-is).
 * Note that the game always checks for soft-locks where no more matches can be
 * formed in Puzzle Mode, so there isn't a toggleable loss condition for it.
 */
export enum LossConditionKind {
  COMBO_BROKEN = 'Combo broken',
  MAX_MOVES = 'Max moves',
  CANT_MATCH_COLOR = "Can't match color",
}

/**
 * Helper for loss condition type guards, to check for the `enabled` flag.
 */
const hasEnabledFlag = (data: object): data is { enabled: boolean } => {
  return 'enabled' in data
    && typeof data.enabled === 'boolean'
}

/**
 * After the player begins a combo, if they lose their combo at any time, they
 * fail the level.
 */
export interface ComboBrokenProps {
  kind: LossConditionKind.COMBO_BROKEN
  enabled: boolean
}

const isComboBrokenProps = (data: unknown): data is ComboBrokenProps => {
  return isSomeKind(data)
    && data.kind === LossConditionKind.COMBO_BROKEN
    && hasEnabledFlag(data)
}

/**
 * The player must beat the level in the specified number of moves or less.
 */
export interface MaxMovesProps {
  kind: LossConditionKind.MAX_MOVES
  enabled: boolean
  maxMoves: number
}

const isMaxMovesProps = (data: unknown): data is MaxMovesProps => {
  return isSomeKind(data)
    && data.kind === LossConditionKind.MAX_MOVES
    && hasEnabledFlag(data)
    && 'maxMoves' in data
    && typeof data.maxMoves === 'number'
}

/**
 * The player can't make any matches using the specified color. Indirectly
 * destroying blocks of this color without matching them is still allowed.
 */
export interface NoMatchColorProps {
  kind: LossConditionKind.CANT_MATCH_COLOR
  enabled: boolean
  banishedColor: BlockColor
}

const isNoMatchColorProps = (data: unknown): data is NoMatchColorProps => {
  return isSomeKind(data)
    && data.kind === LossConditionKind.CANT_MATCH_COLOR
    && hasEnabledFlag(data)
    && 'banishedColor' in data
    && typeof data.banishedColor === 'number'
}

export type LossConditionProps =
  | ComboBrokenProps
  | MaxMovesProps
  | NoMatchColorProps

// Will result in a TS error if any of the LossConditionProps members are
// missing the `enabled` property.
type _AssertLossConditionsAllHaveEnabled = Pick<LossConditionProps, 'enabled'>

export const isLossConditionProps = (data: unknown): data is LossConditionProps => {
  return isComboBrokenProps(data)
    || isMaxMovesProps(data)
    || isNoMatchColorProps(data)
}

export type LossConditionRecord = {
  [K in LossConditionKind]: Extract<LossConditionProps, { kind: K }>
}

/**
 * Helper for isLossConditionRecord, narrows objects to Records so we can look
 * up LossConditionKind keys on them.
 */
const isRecord = (data: unknown): data is Record<string, unknown> => {
  return typeof data === 'object'
    && data !== null
}

export const isLossConditionRecord = (data: unknown): data is LossConditionRecord => {
  return isRecord(data)
    && Object.values(LossConditionKind).every(kind => {
      const value = data[kind]
      return isLossConditionProps(value) && value.kind === kind
    })
}

export const getDefaultLossConditions = (): LossConditionRecord => ({
  [LossConditionKind.COMBO_BROKEN]: {
    kind: LossConditionKind.COMBO_BROKEN,
    enabled: false,
  },
  [LossConditionKind.MAX_MOVES]: {
    kind: LossConditionKind.MAX_MOVES,
    enabled: false,
    maxMoves: 10,
  },
  [LossConditionKind.CANT_MATCH_COLOR]: {
    kind: LossConditionKind.CANT_MATCH_COLOR,
    enabled: false,
    banishedColor: BlockColor.BLUE,
  },
})
