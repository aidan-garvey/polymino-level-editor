<template>
  <pdx-radio-group
    v-model="goalKind"
    label="Goal"
    :options="Object.values(GoalKind)"
    :tooltips="GOAL_INFO"
  />

  <pdx-checkbox
    v-if="goalKind !== GoalKind.HIGH_SCORE"
    v-model="endOnWin"
    label="End on win"
    :tooltip="END_ON_WIN_INFO"
  />

  <pdx-input-number
    v-if="goalKind === GoalKind.TARGET_SCORE"
    v-model="targetScore"
    label="Target score"
    tooltip="The score to beat to win the level."
    :min="0"
    @focus="() => editor.history.startEditGoal()"
    @blur="() => editor.history.endEditGoal()"
  />

  <pdx-level-settings-targets
    v-else-if="goalKind === GoalKind.DESTROY_TARGETS"
    :editor
    label="Targets"
    :junk-ids="targetIds"
    @unmark="j => editor.removeTarget(j)"
  />

  <pdx-input-number
    v-else-if="goalKind === GoalKind.LINE_EM_UP"
    v-model="collatCount"
    label="Collat count"
    tooltip="How many junk pieces to shatter with one match to win."
    :min="1"
    @focus="() => editor.history.startEditGoal()"
    @blur="() => editor.history.endEditGoal()"
  />
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import { GoalKind } from '@/types/Rules/Goal'

const props = defineProps<{
  editor: Editor
}>()

const goalKind = computed({
  get: () => props.editor.getGoalKind(),
  set: k => props.editor.setGoalKind(k),
})

const endOnWin = computed({
  get: () => props.editor.rules.endOnWin.value,
  set: v => props.editor.setEndOnWin(v),
})

const targetScore = computed({
  get: () => {
    const goal = props.editor.rules.goal.value
    return goal.kind === GoalKind.TARGET_SCORE ? goal.target : 0
  },
  set: v => props.editor.setTargetScore(v),
})

const targetIds = computed(() => props.editor.rules.targetIds)

const collatCount = computed({
  get: () => {
    const goal = props.editor.rules.goal.value
    return goal.kind === GoalKind.LINE_EM_UP ? goal.collatCount : 0
  },
  set: c => props.editor.setCollatCount(c),
})

const GOAL_INFO: Record<GoalKind, string> = {
  [GoalKind.HIGH_SCORE]: 'Get the highest score possible. The level only ends '
    + 'if a\nloss condition is met, or no more matches can be made.',
  [GoalKind.TARGET_SCORE]: 'The player must beat a predetermined score to pass '
    + 'the level.',
  [GoalKind.DESTROY_ALL_BLOCKS]: 'All non-junk blocks must be destroyed, '
    + 'including\nany which are created from shattered junk pieces.',
  [GoalKind.DESTROY_ALL_JUNK]: 'All junk pieces must be destroyed.',
  [GoalKind.DESTROY_EVERYTHING]: 'All blocks and junk must be destroyed.',
  [GoalKind.DESTROY_TARGETS]: 'The target junk piece(s) must be destroyed.',
  [GoalKind.LINE_EM_UP]: 'Destroy a certain number of junk pieces with a '
    + 'single projectile.',
}

const END_ON_WIN_INFO = 'If enabled, the level will end as soon as the goal is '
  + 'achieved.\nOtherwise, the player can keep going to get a high score.'
</script>
