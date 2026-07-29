import { isSomeKind } from '@/utils/isSomeKind'

/**
 * These enum values are human-readable so they can be used as-is in the UI.
 */
export enum GoalKind {
  HIGH_SCORE = 'High score',
  TARGET_SCORE = 'Target score',
  DESTROY_ALL_BLOCKS = 'Destroy all blocks',
  DESTROY_ALL_JUNK = 'Destroy all junk',
  DESTROY_EVERYTHING = 'Destroy EVERYTHING',
  DESTROY_TARGETS = 'Destroy target junk',
  LINE_EM_UP = "Line 'em Up",
}

/**
 * The goal is to get the highest score possible. Play continues until one of
 * the loss conditions is met, or it is no longer possible to make any more
 * matches.
 */
export interface GoalHighScore {
  kind: GoalKind.HIGH_SCORE
}

const isGoalHighScore = (data: unknown): data is GoalHighScore => {
  return isSomeKind(data)
    && data.kind === GoalKind.HIGH_SCORE
}

/**
 * The player must beat a predetermined score to pass the level.
 */
export interface GoalTargetScore {
  kind: GoalKind.TARGET_SCORE
  target: number
}

const isGoalTargetScore = (data: unknown): data is GoalTargetScore => {
  return isSomeKind(data)
    && data.kind === GoalKind.TARGET_SCORE
    && 'target' in data
    && typeof data.target === 'number'
}

/**
 * All non-junk blocks must be destroyed, including any which are created by
 * shattered junk pieces.
 */
export interface GoalDestroyAllBlocks {
  kind: GoalKind.DESTROY_ALL_BLOCKS
}

const isGoalDestroyAllBlocks = (data: unknown): data is GoalDestroyAllBlocks => {
  return isSomeKind(data)
    && data.kind === GoalKind.DESTROY_ALL_BLOCKS
}

/**
 * All junk pieces must be destroyed.
 */
export interface GoalDestroyAllJunk {
  kind: GoalKind.DESTROY_ALL_JUNK
}

const isGoalDestroyAllJunk = (data: unknown): data is GoalDestroyAllJunk => {
  return isSomeKind(data)
    && data.kind === GoalKind.DESTROY_ALL_JUNK
}

/**
 * All blocks and junk must be destroyed.
 */
export interface GoalDestroyEverything {
  kind: GoalKind.DESTROY_EVERYTHING
}

const isGoalDestroyEverything = (data: unknown): data is GoalDestroyEverything => {
  return isSomeKind(data)
    && data.kind === GoalKind.DESTROY_EVERYTHING
}

/**
 * One or more target junk pieces must be destroyed, identified by their ID.
 * When saved/exported as JSON data, the ID is swapped out for the position of
 * an arbitrary block belonging to the piece, since junk IDs are not exported.
 * We don't necessarily use the piece's (bottomRow, leftColumn) position, in
 * case we were to add shapes with an empty cell at that position in the future.
 * Using IDs within the editor is worth the extra save/load complexity because
 * it's much easier to keep the targets in a valid state when the board is
 * modified.
 */
export interface GoalDestroyTargets {
  kind: GoalKind.DESTROY_TARGETS
  targetIds: Set<number>
}

const isGoalDestroyTargets = (data: unknown): data is GoalDestroyTargets => {
  return isSomeKind(data)
    && data.kind === GoalKind.DESTROY_TARGETS
    && 'targetIds' in data
    && data.targetIds instanceof Set
    && Array.from(data.targetIds).every(t => typeof t === 'number')
}

/**
 * To win the level, destroy `collatCount` junk pieces with a single projectile.
 * Basically the collat/hat trick/tetrad tricks as a puzzle goal.
 */
export interface GoalLineEmUp {
  kind: GoalKind.LINE_EM_UP
  collatCount: number
}

const isGoalLineEmUp = (data: unknown): data is GoalLineEmUp => {
  return isSomeKind(data)
    && data.kind === GoalKind.LINE_EM_UP
    && 'collatCount' in data
    && typeof data.collatCount === 'number'
}

export type Goal =
  | GoalHighScore
  | GoalTargetScore
  | GoalDestroyAllBlocks
  | GoalDestroyAllJunk
  | GoalDestroyEverything
  | GoalDestroyTargets
  | GoalLineEmUp

export const isGoal = (data: unknown): data is Goal => {
  return isGoalHighScore(data)
    || isGoalTargetScore(data)
    || isGoalDestroyAllBlocks(data)
    || isGoalDestroyAllJunk(data)
    || isGoalDestroyEverything(data)
    || isGoalDestroyTargets(data)
    || isGoalLineEmUp(data)
}
