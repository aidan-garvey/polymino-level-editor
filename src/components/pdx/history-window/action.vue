<template>
  <div
    ref="actionRef"
    class="pdx-history-window-action"
    :class="`pdx-history-window-action--${kind}`"
    :style="{
      '--item-height': `${ITEM_HEIGHT}px`,
    }"
  >
    <div class="pdx-history-window-action__text">
      {{ actionDesc }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Action, ActionKind } from '@/types/History/Action'
import { ITEM_HEIGHT } from '@/components/pdx/history-window/consts'

const props = defineProps<{
  action: Action
  kind: 'past' | 'last' | 'future'
}>()

const actionRef = useTemplateRef('actionRef')

const actionDesc = computed<string>(() => {
  switch (props.action.kind) {
    case ActionKind.NEW_LEVEL:
      return 'New level'
    case ActionKind.OPEN_LEVEL:
      return 'Open level'
    case ActionKind.BRUSH:
      return 'Brush'
    case ActionKind.MOVE_JUNK:
      return 'Move junk'
    case ActionKind.COPY_JUNK:
      return 'Copy junk'
    case ActionKind.EDIT_JUNK:
      return 'Edit junk'
    case ActionKind.DELETE_JUNK:
      return 'Delete junk'
    case ActionKind.LEVEL_NAME:
      return 'Level name'
    case ActionKind.GAME_RNG_SEED:
      return 'Level RNG seed'
    case ActionKind.BASE_LAYER_SEED:
      return 'Base layer seed'
    case ActionKind.BASE_LAYER_ROWS:
      return 'Base layer rows'
    case ActionKind.BANNED_COLOR:
      return 'Banned color'
  }
})

watch([() => props.kind, () => props.action], ([kind]) => {
  if (kind === 'last') {
    actionRef.value?.scrollIntoView({
      behavior: 'instant',
      block: 'nearest',
    })
  }
}, { immediate: true })
</script>

<style lang="scss">
.pdx-history-window-action {
  height: var(--item-height);
  padding: 0 4px;

  display: flex;
  flex-direction: row;
  align-items: center;

  cursor: pointer;

  &:not(:last-child) {
    border-bottom: 1px solid #555;
    height: calc(var(--item-height) + 1px);
  }

  &--past {
    background: #000;
    &:hover {
      background: #444;
    }
  }
  &--last {
    background: #00c;
    &:hover {
      background: #33f;
    }
  }
  &--future {
    background: #222;
    &:hover {
      background: #555;
    }
  }

  &__text {
    font-size: 13px;
    line-height: 1;
    font-style: italic;
    padding-bottom: 3px;
  }
}
</style>
