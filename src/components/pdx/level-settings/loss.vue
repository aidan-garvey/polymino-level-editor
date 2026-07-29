<template>
  <pdx-checkbox
    v-model="comboBrokenEnabled"
    :label="LossConditionKind.COMBO_BROKEN"
    :tooltip="LOSS_CONDITION_INFO[LossConditionKind.COMBO_BROKEN]"
  />
  <pdx-checkbox
    v-model="maxMovesEnabled"
    :label="LossConditionKind.MAX_MOVES"
    :tooltip="LOSS_CONDITION_INFO[LossConditionKind.MAX_MOVES]"
  />
  <!-- Minimum is 0 to allow auto levels, just for fun :-) -->
  <pdx-input-number
    v-if="maxMovesEnabled"
    v-model="maxMovesCount"
    :tooltip='`Number of moves for the "${LossConditionKind.MAX_MOVES}" rule`'
    :min="0"
    @focus="() => editor.history.startEditLossCondition()"
    @blur="() => editor.history.endEditLossCondition()"
  />
  <pdx-checkbox
    v-model="cantMatchColorEnabled"
    :label="LossConditionKind.CANT_MATCH_COLOR"
    :tooltip="LOSS_CONDITION_INFO[LossConditionKind.CANT_MATCH_COLOR]"
  />
  <div v-if="cantMatchColorEnabled">
    <label
      :for="cantMatchColorId"
      class="text-detail"
    >
      Color
    </label>
    <select
      :id="cantMatchColorId"
      v-model="banishedColor"
    >
      <option
        v-for="color in Object.values(BlockColor).filter(v => typeof v === 'number')"
        :key="color"
        :value="color"
      >
        {{ blockColorTitles[color] }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import { LossConditionKind } from '@/types/Rules/LossCondition'
import { BlockColor } from '@/types/BlockColor'
import { blockColorTitles } from '@/consts/block'

const props = defineProps<{
  editor: Editor
}>()

// Writable models for the discrete toggles/selects, which route through the
// editor so each change records an undo entry.
const makeEnabledModel = (kind: LossConditionKind) => computed({
  get: () => props.editor.rules.lossCondition(kind).enabled,
  set: enabled => props.editor.toggleLossCondition(kind, enabled),
})

const comboBrokenEnabled = makeEnabledModel(LossConditionKind.COMBO_BROKEN)
const maxMovesEnabled = makeEnabledModel(LossConditionKind.MAX_MOVES)
const cantMatchColorEnabled = makeEnabledModel(LossConditionKind.CANT_MATCH_COLOR)

const banishedColor = computed({
  get: () => props.editor
    .rules
    .lossCondition(LossConditionKind.CANT_MATCH_COLOR)
    .banishedColor,
  set: color => props.editor.setBanishedColor(color),
})

const maxMovesCount = computed({
  get: () => props.editor
    .rules
    .lossCondition(LossConditionKind.MAX_MOVES)
    .maxMoves,
  set: v => props.editor.setMaxMoves(v),
})

const cantMatchColorId = useId()

const LOSS_CONDITION_INFO: Record<LossConditionKind, string> = {
  [LossConditionKind.COMBO_BROKEN]: 'Once the player makes a match,\nbreaking '
    + 'their combo will fail the level.',
  [LossConditionKind.MAX_MOVES]: 'The level ends after a certain number of '
    + 'moves.',
  [LossConditionKind.CANT_MATCH_COLOR]: 'Making matches with a certain color '
    + 'is VERBOTEN.\nDestroying blocks of that color by other means is A-okay.',
}
</script>
