<template>
  <div
    ref="toolSelectorRef"
    class="pdx-tool-selector"
    :class="{
      'pdx-tool-selector--left': leftSelected,
      'pdx-tool-selector--right': rightSelected,
    }"
    @pointerdown="emit('pointerdown', $event)"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @contextmenu.prevent
  >
    <pdx-icon
      :name="iconName"
      size="28"
      :fill="leftSelected || rightSelected"
    />
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@/types/Editor'
import type { Tool } from '@/types/Tool'
import { useTooltip } from '@/use/tooltip'

const props = defineProps<{
  editor: Editor
  iconName: string
  tooltip: string
  selectedPredicate: (tool: Tool) => boolean
}>()

const emit = defineEmits<{
  pointerdown: [PointerEvent]
}>()

const toolSelectorRef = useTemplateRef('toolSelectorRef')

const { onPointerEnter, onPointerLeave } = useTooltip(
  computed(() => props.iconName),
  computed(() => props.tooltip),
  toolSelectorRef
)

const leftSelected = computed(() => {
  return props.selectedPredicate(props.editor.leftTool.value)
})
const rightSelected = computed(() => {
  return props.selectedPredicate(props.editor.rightTool.value)
})
</script>
