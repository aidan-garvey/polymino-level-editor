/**
 * Base props shared by all pdx-input components.
 */
export interface PdxInputProps {
  label: string
  inlineLabel?: boolean
  /**
   * If specified, this component will display the given text as a tooltip when
   * hovered over.
   */
  tooltip?: string
}
