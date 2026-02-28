<template>
  <div class="pdx-level-browser-list">
    <!-- TODO: message if local storage isn't available -->
    <!-- TODO: message if no levels are saved -->
    <!-- TODO: buttons for deleting and renaming levels -->
    <div
      v-for="level in levelList"
      :key="level.name"
      class="pdx-level-browser-list__item pdx-interactive"
      :class="{
        'pdx-level-browser-list__item--selected': level.name === inputFileName,
      }"
      tabindex="0"
      @click="emit('select', level.name)"
      @keydown.enter="emit('activate', level.name)"
      @dblclick="emit('activate', level.name)"
    >
      <div class="pdx-level-browser-list__item__name text-body">
        {{ level.name }}
      </div>
      <div class="pdx-level-browser-list__item__date text-detail">
        {{ level.date }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SavedLevelDict } from '@/types/Storage/LevelStorage'

const props = defineProps<{
  levels: SavedLevelDict | null
  /** String in the file name input */
  inputFileName: string
}>()

const emit = defineEmits<{
  select: [name: string]
  activate: [name: string]
}>()

const fmt = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
})

const levelList = computed(() => {
  if (!props.levels) {
    return []
  } else {
    return Object.entries(props.levels)
      .sort((a, b) => {
        const dateA = new Date(a[1].lastModified)
        const dateB = new Date(b[1].lastModified)
        return dateB.getTime() - dateA.getTime()
      })
      .map(([name, level]) => ({
        name,
        date: fmt.format(new Date(level.lastModified)),
      }))
  }
})
</script>

<style lang="scss">
.pdx-level-browser-list {
  display: grid;
  grid-template-columns: minmax(175px, 1fr) 175px;

  &__item {
    display: grid;
    grid-column: 1 / span 2;
    grid-template-columns: subgrid;

    &:nth-child(even) {
      background: #111;
    }
    &--selected {
      background: #333 !important;
    }

    &--selected &__name {
      color: #ff0;
    }

    &__date {
      text-align: right;
    }
  }
}
</style>
