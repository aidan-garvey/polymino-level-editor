<template>
  <div class="pdx-level-settings-targets text-detail">
    <span>{{ label }}</span>

    <div
      v-for="junk in junkPieces"
      class="pdx-level-settings-targets__item"
      :class="{
        'pdx-level-settings-targets__item--active': editor.selectedJunk.value === junk,
      }"
      @click="editor.selectJunk(junk)"
    >
      <!-- Live preview of junk piece's top-left corner -->
      <pdx-block
        v-bind="getTopLeft(junk)"
        :grid="editor.junkLayer.board"
        disable-drag
      />

      <!-- Same position format as the status bar (with "Column" shortened) -->
      <span class="pdx-level-settings-targets__pos">
        (Row, Col) = ({{ junk.bottomRow }}, {{ junk.leftColumn }})
      </span>

      <pdx-space />

      <!-- Button to unmark target -->
      <button type="button"
        class="pdx-level-settings-targets__delete"
        @click="emit('unmark', junk)"
      >
        <pdx-icon name="close" size="12" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import type { Junk } from '@/types/Junk'
import { BlockState } from '@/types/BlockState'

const props = defineProps<{
  editor: Editor
  /** What should the pieces in this list be referred to as? E.g. "Targets". */
  label: string
  /** Ids of the target junk pieces. */
  junkIds: Iterable<number>
}>()

const emit = defineEmits<{
  unmark: [Junk]
}>()

/**
 * Junk pieces referenced by props.junkIds, sorted from top to bottom then left
 * to right, so order in the UI matches the reading order in the board.
 */
const junkPieces = computed(() => {
  return Array.from(props.junkIds)
    .map(id => props.editor.junkLayer.board.getJunkById(id))
    .filter(j => j !== null)
    .sort((junkA, junkB) => {
      if (junkA.bottomRow !== junkB.bottomRow) {
        return junkB.bottomRow - junkA.bottomRow
      } else {
        return junkA.leftColumn - junkB.leftColumn
      }
    })
})

/**
 * Returns the (row, col) position of the top-left corner of the given junk
 * piece. For pieces which aren't rectangular, this is defined as the leftmost
 * block in the top row. This allows us to render a consistent live preview of
 * each target piece, naturally getting the right color and junk effect.
 */
const getTopLeft = (j: Junk): { row: number, col: number } => {
  const row = j.bottomRow + j.height - 1
  for (let x = 0; x < j.width; ++x) {
    const col = x + j.leftColumn
    const block = props.editor.junkLayer.board.getBlock(row, col)
    if (block.state === BlockState.JUNK && block.junk === j)
      return { row, col }
  }
  throw new Error('targets.vue: expected piece to be in junk layer')
}
</script>

<style lang="scss">
.pdx-level-settings-targets {
  --block-size: 14px;

  display: flex;
  flex-direction: column;

  &__item {
    display: flex;
    align-items: center;
    gap: 2px;

    line-height: 1;
    padding: 3px;
    cursor: pointer;

    &:hover {
      background-color: #333;
    }

    &--active {
      background-color: #222;
    }
  }

  // Since the coords are wrapped in parens, they dangle below the baseline.
  // Nudging the text up by 1px makes it look more vertically aligned.
  &__pos {
    transform: translateY(-1px);
  }

  &__delete {
    padding: 0;
    width: 14px;
    height: 14px;
  }
}
</style>
