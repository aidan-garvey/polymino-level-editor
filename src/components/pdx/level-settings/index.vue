<template>
  <div class="pdx-side-panel pdx-level-settings">
    <pdx-tooltip />

    <div class="text-title text-center">
      Level Settings
    </div>

    <pdx-input-text
      v-model="levelName"
      label="Level name"
      :tooltip="'Name of the level in-game,\nseparate from the file name'"
      :allowed-chars="VALID_CHARS"
      :max-length="NAME_MAX_LEN"
      @focus="() => editor.history.startLevelName()"
      @blur="() => editor.history.endLevelName()"
    />

    <pdx-input-number
      v-model="rngSeed"
      label="RNG seed"
      tooltip="Value to initialize RNG after the level loads"
      :min="0"
      @focus="() => editor.history.startRngSeed()"
      @blur="() => editor.history.endRngSeed()"
    />

    <div class="text-title text-center">
      Base Layer Settings
    </div>

    <pdx-input-number
      v-model="baseLayerSeed"
      label="RNG seed"
      :tooltip="'RNG seed used to generate the base layer\'s\ncontent, does not affect in-game RNG'"
      :min="0"
      @focus="() => editor.history.startBaseLayerSeed()"
      @blur="() => editor.history.endBaseLayerSeed()"
    />

    <pdx-input-number
      v-model="baseLayerRows"
      label="Rows"
      tooltip="How many rows to use for the base layer"
      :min="0"
      :max="24"
      @focus="() => editor.history.startBaseLayerRows()"
      @blur="() => editor.history.endBaseLayerRows()"
    />

    <pdx-level-settings-banned-color
      :editor
    />
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import { provideTooltipRefs } from '@/use/tooltip'
import { NAME_MAX_LEN, VALID_CHARS } from '@/consts/level'

const props = defineProps<{
  editor: Editor
}>()

provideTooltipRefs()

const levelName = computed({
  get: () => props.editor.getLevelName(),
  set: name => props.editor.setLevelName(name),
})

const rngSeed = computed({
  get: () => props.editor.getRngSeed(),
  set: seed => props.editor.setRngSeed(seed),
})

const baseLayerSeed = computed({
  get: () => props.editor.baseLayer.getSeed(),
  set: val => props.editor.setBaseLayerSeed(val),
})

const baseLayerRows = computed({
  get: () => props.editor.baseLayer.getRows(),
  set: val => props.editor.setBaseLayerRows(val),
})
</script>

<style lang="scss">
.pdx-level-settings {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
