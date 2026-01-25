<template>
  <Teleport to="body">
    <div
      v-if="tooltipItemName"
      class="pdx-tooltip"
      :style="{
        top: `${top}`,
        right: `${right}`,
        height: `${tooltipTriggerHeight}px`,
        padding: `0 ${padding}`,
        fontSize: `${FONT_SIZE}px`,
        lineHeight: `${FONT_SIZE}px`,
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

const padding = computed(() => {
  return `${(tooltipTriggerHeight.value - FONT_SIZE) / 2}px`
})

const {
  top: containerTop,
  left: containerLeft,
} = useElementBounding(useParentElement())

const top = computed(() => {
  return `${containerTop.value + tooltipOffsetY.value}px`
})

const right = computed(() => {
  // add 1 so the borders overlap
  return `calc(100% - ${containerLeft.value + 1}px)`
})
</script>

<style lang="scss">
.pdx-tooltip {
  z-index: 68000;
  position: absolute;

  white-space: nowrap;
  text-align: right;

  background: #111;
  border: 1px solid #fff;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
