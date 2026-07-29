import type { Goal } from '@/types/Rules/Goal'
import type { LossConditionKind, LossConditionRecord } from '@/types/Rules/LossCondition'
import type { ExportedRules, JunkIdGetter, JunkPositionGetter } from '@/types/Exported/ExportedRules'
import { GoalKind } from '@/types/Rules/Goal'
import { getDefaultLossConditions } from '@/types/Rules/LossCondition'
import { exportGoal, restoreGoal } from '@/types/Exported/ExportedRules'
import { safeClone } from '@/utils/safeClone'

export class Rules {
  /**
   * If true, the level will end as soon as the goal is achieved. If false, the
   * player can continue playing afterwards to try to get a high score. Ignored
   * when `GoalKind` is `HIGH_SCORE`, as that goal revolves around getting a
   * high score by definition.
   */
  readonly endOnWin = ref(false)

  /**
   * Determines how the player beats the level.
   */
  readonly goal = ref<Goal>({ kind: GoalKind.HIGH_SCORE })

  /**
   * Additional loss conditions to provide constraints on the game, each can be
   * toggled on or off and might have extra properties to configure.
   */
  readonly lossConditions = ref<LossConditionRecord>(getDefaultLossConditions())

  /** Typed accessor for a single loss condition's props. */
  lossCondition<K extends LossConditionKind>(kind: K): LossConditionRecord[K] {
    return this.lossConditions.value[kind]
  }

  /**
   * Switch the goal to the given kind, setting any kind-specific properties to
   * their defaults. If the goal is already the given kind, this function
   * doesn't do anything, so we don't overwrite any kind-specific properties.
   */
  setGoalKind(kind: GoalKind): void {
    if (kind === this.goal.value.kind) {
      return
    }
    switch (kind) {
      case GoalKind.TARGET_SCORE:
        this.goal.value = { kind, target: 0 }
        break
      case GoalKind.DESTROY_TARGETS:
        this.goal.value = { kind, targetIds: new Set() }
        break
      case GoalKind.LINE_EM_UP:
        this.goal.value = { kind, collatCount: 1 }
        break
      default:
        // Will be a TS error if a new goal is added with specific properties
        this.goal.value = { kind }
        break
    }
  }

  /** Set the target score (only applies to the `TARGET_SCORE` goal). */
  setTargetScore(target: number): void {
    if (this.goal.value.kind === GoalKind.TARGET_SCORE) {
      this.goal.value.target = target
    }
  }

  /** Set the collat count (only applies to the `LINE_EM_UP` goal). */
  setCollatCount(collatCount: number): void {
    if (this.goal.value.kind === GoalKind.LINE_EM_UP) {
      this.goal.value.collatCount = collatCount
    }
  }

  /**
   * IDs of the junk pieces marked as targets. Empty unless the goal is
   * `DESTROY_TARGETS`.
   */
  get targetIds(): ReadonlySet<number> {
    const goal = this.goal.value
    return goal.kind === GoalKind.DESTROY_TARGETS ? goal.targetIds : new Set()
  }

  isTarget(id: number): boolean {
    const goal = this.goal.value
    return goal.kind === GoalKind.DESTROY_TARGETS && goal.targetIds.has(id)
  }

  markTarget(id: number): void {
    const goal = this.goal.value
    if (goal.kind === GoalKind.DESTROY_TARGETS) {
      goal.targetIds.add(id)
    }
  }

  unmarkTarget(id: number): void {
    const goal = this.goal.value
    if (goal.kind === GoalKind.DESTROY_TARGETS) {
      goal.targetIds.delete(id)
    }
  }

  toggleTarget(id: number): void {
    const goal = this.goal.value
    if (goal.kind !== GoalKind.DESTROY_TARGETS) {
      return
    }
    if (goal.targetIds.has(id)) {
      goal.targetIds.delete(id)
    } else {
      goal.targetIds.add(id)
    }
  }

  /**
   * Serialize to the compact exported format. Junk IDs are swapped for board
   * positions via `idToPos`, since IDs aren't saved.
   */
  export(idToPos: JunkPositionGetter): ExportedRules {
    return {
      endOnWin: this.endOnWin.value,
      goal: exportGoal(this.goal.value, idToPos),
      lossConditions: safeClone(this.lossConditions.value),
    }
  }

  /**
   * Overwrite this instance's state in place from exported data. `posToId` maps
   * saved target positions back to the current board's junk IDs.
   */
  restore(data: ExportedRules, posToId: JunkIdGetter): void {
    this.endOnWin.value = data.endOnWin
    this.goal.value = restoreGoal(data.goal, posToId)
    this.lossConditions.value = safeClone(data.lossConditions)
  }

  static fromExported(data: ExportedRules, posToId: JunkIdGetter): Rules {
    const rules = new Rules()
    rules.restore(data, posToId)
    return rules
  }
}
