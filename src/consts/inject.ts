const makeKey = <T>(name: string): InjectionKey<T> => {
  return Symbol(name) as InjectionKey<T>
}

export const injectTooltipOffsetY = makeKey<Ref<number>>('tooltipOffsetY')
export const injectTooltipTriggerHeight = makeKey<Ref<number>>('tooltipTriggerHeight')

/**
 * An identifier for the tooltip item which must be unique among all other items
 * in the tooltip's parent element.
 */
export const injectTooltipItemName = makeKey<Ref<string | null>>('tooltipItemName')

export const injectTooltipText = makeKey<Ref<string>>('tooltipText')
