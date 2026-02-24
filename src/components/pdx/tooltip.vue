<template>
  <Teleport to="body">
    <div
      class="pdx-tooltip"
      :style="{
        top: `${top}`,
        right: `${right}`,
        minHeight: `${tooltipTriggerHeight}px`,
        padding: `4px ${hPadding}`,
        fontSize: `${FONT_SIZE}px`,
        lineHeight: `${FONT_SIZE}px`,
        ...displayStyle
      }"
    >
      {{ tooltipText }}
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { injectTooltipItemName, injectTooltipOffsetY, injectTooltipText, injectTooltipTriggerHeight } from '@/consts/inject'
import { notNull } from '@/utils/notNull'

const FONT_SIZE = 16

const tooltipItemName = notNull(inject(injectTooltipItemName))
const tooltipOffsetY = notNull(inject(injectTooltipOffsetY))
const tooltipTriggerHeight = notNull(inject(injectTooltipTriggerHeight))
const tooltipText = notNull(inject(injectTooltipText))

const hPadding = computed(() => {
  return `${(tooltipTriggerHeight.value - FONT_SIZE) / 2}px`
})

const container = useParentElement()

const top = ref('0px')
const right = ref('0px')
const displayStyle = computed(() => {
  if (!tooltipItemName.value) {
    return {
      display: 'none',
      opacity: 0
    }
  } else {
    return {}
  }
})

watch(tooltipItemName, () => {
  const rect = container.value?.getBoundingClientRect()
  if (!container.value || !rect)
    return

  if (getComputedStyle(container.value).position === 'static')
    console.warn('Tooltip parent is not positioned, positions may be incorrect')

  const containerTop = rect.top
  const containerLeft = rect.left
  top.value = `${containerTop + tooltipOffsetY.value}px`
  // add 1 so the borders overlap
  right.value = `calc(100% - ${containerLeft + 1}px)`
})
</script>

<style lang="scss">
.pdx-tooltip {
  z-index: 1000;
  position: absolute;

  white-space: pre-line;
  text-align: center;

  background: #111;
  border: 1px solid #fff;

  display: flex;
  align-items: center;
  justify-content: center;

  // Won't work on Firefox, but it's just aesthetic
  transition:
    opacity 0.2s ease-out,
    display 0.2s ease-out;

  transition-behavior: allow-discrete;
  @starting-style {
    opacity: 0;
  }
}
</style>
