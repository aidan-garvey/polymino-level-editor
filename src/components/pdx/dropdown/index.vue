<template>
  <div class="pdx-dropdown">
    <div class="pdx-dropdown__button"
      @click.stop="toggleDropdown"
    >
      {{ name }}
    </div>
    <div
      v-show="open"
      class="pdx-dropdown__list"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
}>()

const emit = defineEmits<{
  open: []
}>()

const open = ref(false)

// Clicking anywhere that doesn't use stopPropagation (i.e. anywhere other than
// "File", including the dropdown buttons) will close the dropdown.
useEventListener('click', () => { open.value = false })

watch(open, (isOpen) => {
  if (isOpen) {
    emit('open')
  }
})

const toggleDropdown = () => {
  open.value = !open.value
}

defineExpose({
  open: () => { open.value = true },
  close: () => { open.value = false },
})
</script>

<style lang="scss">
.pdx-dropdown {
  position: relative;

  &__button {
    display: inline-block;
    padding: 2px 10px;
    padding-bottom: 3px;
    cursor: pointer;
    user-select: none;

    &:hover {
      background: #333;
      color: #ff0;
    }
  }

  &__list {
    position: absolute;
    background-color: #222;
    border: 1px solid #444;
    z-index: 2000;
  }
  &:first-child &__list {
    border-left: none;
  }
}
</style>
