<template>
  <div class="pdx-side-panel pdx-level-settings">
    <pdx-tooltip />

    <div class="text-title text-center">
      Level Settings
    </div>

    <pdx-input-text
      v-model="editor.levelName.value"
      label="Level name"
      :tooltip="'Name of the level in-game,\nseparate from the file name'"
      :allowed-chars="VALID_CHARS"
      :max-length="NAME_MAX_LEN"
    />

    <pdx-input-number
      v-model="editor.seed.value"
      label="RNG seed"
      tooltip="Value to initialize RNG after the level loads"
      :min="0"
    />

    <div class="text-title text-center">
      Base Layer Settings
    </div>

    <pdx-input-number
      v-model="baseLayerSeed"
      label="RNG seed"
      :tooltip="'RNG seed used to generate the base layer\'s\ncontent, does not affect in-game RNG'"
      :min="0"
    />

    <pdx-input-number
      v-model="baseLayerRows"
      label="Rows"
      tooltip="How many rows to use for the base layer"
      :min="0"
      :max="24"
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

const baseLayerSeed = computed({
  get: () => props.editor.baseLayer.getSeed(),
  set: val => props.editor.baseLayer.setSeed(val),
})

const baseLayerRows = computed({
  get: () => props.editor.baseLayer.getRows(),
  set: val => props.editor.baseLayer.setRows(val),
})
</script>

<style lang="scss">
.pdx-level-settings {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
