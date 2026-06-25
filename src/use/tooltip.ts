import { injectTooltipItemName, injectTooltipOffsetY, injectTooltipText, injectTooltipTriggerHeight } from '@/consts/inject'

export const useTooltip = (
  name: MaybeRef<string>,
  tooltip: MaybeRef<string>,
  triggerRef: Readonly<ShallowRef<HTMLElement | null>>,
) => {
  const tooltipOffsetY = toRef(injectLocal(injectTooltipOffsetY, undefined))
  const tooltipTriggerHeight = toRef(injectLocal(injectTooltipTriggerHeight, undefined))
  const tooltipItemName = toRef(injectLocal(injectTooltipItemName, undefined))
  const tooltipText = toRef(injectLocal(injectTooltipText, undefined))

  const onPointerEnter = () => {
    if (triggerRef.value) {
      tooltipOffsetY.value = triggerRef.value.offsetTop
      tooltipTriggerHeight.value = triggerRef.value.offsetHeight
      tooltipItemName.value = unref(name)
      tooltipText.value = unref(tooltip)
    }
  }

  const onPointerLeave = () => {
    if (tooltipItemName.value === unref(name)) {
      tooltipItemName.value = null
    }
  }

  return {
    onPointerEnter,
    onPointerLeave,
  }
}

/**
 * Creates and provides refs for tooltips. Uses VueUse's provideLocal so
 * useTooltip can be used in the same component which calls this.
 */
export const provideTooltipRefs = () => {
  const tooltipOffsetY = ref(0)
  provideLocal(injectTooltipOffsetY, tooltipOffsetY)

  const tooltipTriggerHeight = ref(0)
  provideLocal(injectTooltipTriggerHeight, tooltipTriggerHeight)

  const tooltipText = ref('')
  provideLocal(injectTooltipText, tooltipText)

  const tooltipItemName = ref<string | null>(null)
  provideLocal(injectTooltipItemName, tooltipItemName)
}
