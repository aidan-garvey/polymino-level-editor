import type { Goal } from '@/types/Rules/Goal'
import type { LossConditionProps, LossConditionRecord } from '@/types/Rules/LossCondition'
import { LossConditionKind, isLossConditionRecord } from '@/types/Rules/LossCondition'
import { GoalKind, isGoal } from '@/types/Rules/Goal'
import { isSomeKind } from '@/utils/isSomeKind'
import { safeClone } from '@/utils/safeClone'

/**
 * GoalDestroyTargets is the only goal we need to represent differently in
 * exported/saved levels, since junk IDs are never saved.
 */
interface ExportedDestroyTargets {
  kind: GoalKind.DESTROY_TARGETS
  /**
   * Each entry is the position of an arbitrary block belonging to a target
   * piece, used to re-identify that piece on load (or across undo/redo
   * operations). It isn't necessarily the piece's (bottomRow, leftColumn)
   * position, to account for future shapes with an empty bottom-left cell.
   */
  targetPositions: [row: number, column: number][]
}

const isNumberPair = (data: unknown): data is [number, number] => {
  return Array.isArray(data)
    && data.length === 2
    && typeof data[0] === 'number'
    && typeof data[1] === 'number'
}

const isExportedDestroyTargets = (data: unknown): data is ExportedDestroyTargets => {
  return isSomeKind(data)
    && data.kind === GoalKind.DESTROY_TARGETS
    && 'targetPositions' in data
    && Array.isArray(data.targetPositions)
    && data.targetPositions.every(isNumberPair)
}

export type ExportedGoal =
  | Exclude<Goal, { kind: GoalKind.DESTROY_TARGETS }>
  | ExportedDestroyTargets

const isExportedGoal = (data: unknown): data is ExportedGoal => {
  if (isExportedDestroyTargets(data))
    return true
  else
    return isGoal(data) && data.kind !== GoalKind.DESTROY_TARGETS
}

/**
 * Returns the position of an _arbitrary_ block belonging to the junk piece with
 * the given ID in the junk layer, or null if there is no such piece. We ignore
 * the brush layer because it would create ambiguity if there was a piece
 * occupying the same cell in each layer.
 */
export type JunkPositionGetter = (id: number) => [number, number] | null

/**
 * Checks the junk layer for a junk piece at the given position, returning its
 * ID. We ignore the brush layer for the same reason described above for
 * {@link JunkPositionGetter}.
 */
export type JunkIdGetter = (row: number, col: number) => number | null

export const exportGoal = (goal: Goal, idToPos: JunkPositionGetter): ExportedGoal => {
  if (goal.kind === GoalKind.DESTROY_TARGETS) {
    return {
      kind: goal.kind,
      targetPositions: Array.from(goal.targetIds)
        .map(idToPos)
        .filter(p => p !== null)
        // Sort positions to make equality comparisons simpler.
        .sort(([r1, c1], [r2, c2]) => r1 - r2 || c1 - c2),
    }
  } else {
    // Copy so the editor doesn't reference the same object as the snapshot.
    return safeClone(goal)
  }
}

export const restoreGoal = (goal: ExportedGoal, posToId: JunkIdGetter): Goal => {
  if (goal.kind === GoalKind.DESTROY_TARGETS) {
    return {
      kind: goal.kind,
      targetIds: new Set(goal.targetPositions
        .map(([r, c]) => posToId(r, c))
        .filter(i => i !== null)
      ),
    }
  } else {
    // Copy so the editor doesn't reference the same object as the snapshot.
    return safeClone(goal)
  }
}

export interface ExportedRules {
  endOnWin: boolean
  goal: ExportedGoal
  /**
   * We save loss conditions in the same format as the editor so undo/redo
   * doesn't drop type-specific configuration from disabled conditions.
   */
  lossConditions: LossConditionRecord
}

export const isExportedRules = (data: unknown): data is ExportedRules => {
  return typeof data === 'object'
    && data !== null
    && 'endOnWin' in data
    && typeof data.endOnWin === 'boolean'
    && 'goal' in data
    && isExportedGoal(data.goal)
    && 'lossConditions' in data
    && isLossConditionRecord(data.lossConditions)
}

/**
 * Compares two exported goals for equality. DESTROY_TARGETS positions are
 * compared elementwise, relying on the sorting behavior in exportGoal.
 */
const goalsEqual = (a: ExportedGoal, b: ExportedGoal): boolean => {
  switch (a.kind) {
    case GoalKind.HIGH_SCORE:
    case GoalKind.DESTROY_ALL_BLOCKS:
    case GoalKind.DESTROY_ALL_JUNK:
    case GoalKind.DESTROY_EVERYTHING:
      return a.kind === b.kind

    case GoalKind.TARGET_SCORE:
      return a.kind === b.kind
        && a.target === b.target

    case GoalKind.DESTROY_TARGETS:
      return a.kind === b.kind
        && a.targetPositions.length === b.targetPositions.length
        && a.targetPositions.every(([r, c], i) => {
          return r === b.targetPositions[i]?.[0]
            && c === b.targetPositions[i]?.[1]
        })

    case GoalKind.LINE_EM_UP:
      return a.kind === b.kind
        && a.collatCount === b.collatCount

    default:
      // @ts-expect-error This branch should be unreachable, so TS narrows `a`'s
      // type to `never`. However, we accessed `a.kind` at the start of the
      // switch statement, so we can access it here too.
      throw new TypeError(`Unhandled goal kind: ${a.kind}`)
  }
}

const lossConditionsEqual = (a: LossConditionProps, b: LossConditionProps) => {
  // All kinds have this, don't need to check it in each individual case
  if (a.enabled !== b.enabled)
    return false

  switch (a.kind) {
    case LossConditionKind.COMBO_BROKEN:
      return a.kind === b.kind

    case LossConditionKind.MAX_MOVES:
      return a.kind === b.kind
        && a.maxMoves === b.maxMoves

    case LossConditionKind.CANT_MATCH_COLOR:
      return a.kind === b.kind
        && a.banishedColor === b.banishedColor

    default:
      // @ts-expect-error This branch should be unreachable, so TS narrows `a`'s
      // type to `never`. However, we accessed `a.kind` at the start of the
      // switch statement, so we can access it here too.
      throw new TypeError(`Unhandled loss condition kind: ${a.kind}`)
  }
}

/**
 * Return true if two sets of exported rules are equivalent. Used to detect
 * whether a rules edit actually changed anything (e.g. for ignoring no-ops in
 * History.ts, and unsaved-changes tracking).
 */
export const exportedRulesEqual = (a: ExportedRules, b: ExportedRules): boolean => {
  return a.endOnWin === b.endOnWin
    && goalsEqual(a.goal, b.goal)
    && Object.values(LossConditionKind).every(kind => {
      return lossConditionsEqual(a.lossConditions[kind], b.lossConditions[kind])
    })
}
