import { injectTooltipItemName, injectTooltipOffsetY, injectTooltipText, injectTooltipTriggerHeight } from '@/consts/inject'
import { notNull } from '@/utils/notNull'

export const useTooltip = (
  name: ComputedRef<string>,
  tooltip: ComputedRef<string>,
  triggerRef: Readonly<ShallowRef<HTMLElement | null>>,
) => {
  const tooltipOffsetY = notNull(inject(injectTooltipOffsetY))
  const tooltipTriggerHeight = notNull(inject(injectTooltipTriggerHeight))
  const tooltipItemName = notNull(inject(injectTooltipItemName))
  const tooltipText = notNull(inject(injectTooltipText))

  const onPointerEnter = () => {
    if (triggerRef.value) {
      tooltipOffsetY.value = triggerRef.value.offsetTop
      tooltipTriggerHeight.value = triggerRef.value.offsetHeight
      tooltipItemName.value = name.value
      tooltipText.value = tooltip.value
    }
  }

  const onPointerLeave = () => {
    if (tooltipItemName.value === name.value) {
      tooltipItemName.value = null
    }
  }

  return {
    onPointerEnter,
    onPointerLeave,
  }
}
