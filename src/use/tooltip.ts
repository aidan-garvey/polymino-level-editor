import { injectTooltipItemName, injectTooltipOffsetY, injectTooltipText, injectTooltipTriggerHeight } from '@/consts/inject'

export const useTooltip = (
  name: MaybeRef<string>,
  tooltip: MaybeRef<string>,
  triggerRef: Readonly<ShallowRef<HTMLElement | null>>,
) => {
  const tooltipOffsetY = toRef(inject(injectTooltipOffsetY, undefined))
  const tooltipTriggerHeight = toRef(inject(injectTooltipTriggerHeight, undefined))
  const tooltipItemName = toRef(inject(injectTooltipItemName, undefined))
  const tooltipText = toRef(inject(injectTooltipText, undefined))

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
 * Creates and provides refs for tooltips.
 */
export const provideTooltipRefs = () => {
  const tooltipOffsetY = ref(0)
  provide(injectTooltipOffsetY, tooltipOffsetY)

  const tooltipTriggerHeight = ref(0)
  provide(injectTooltipTriggerHeight, tooltipTriggerHeight)

  const tooltipText = ref('')
  provide(injectTooltipText, tooltipText)

  const tooltipItemName = ref<string | null>(null)
  provide(injectTooltipItemName, tooltipItemName)
}
