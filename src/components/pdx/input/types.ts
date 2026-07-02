/**
 * Base props shared by all pdx-input components.
 */
export interface PdxInputProps {
  /**
   * Label is optional in case the content above contextually acts as a label.
   */
  label?: string
  inlineLabel?: boolean
  /**
   * If specified, this component will display the given text as a tooltip when
   * hovered over.
   */
  tooltip?: string
}

export interface PdxInputEmits {
  focus: [FocusEvent]
  blur: [FocusEvent]
}
