import { BlockColor } from "@/types/BlockColor"
import { JunkEffect } from "@/types/JunkEffect"
import { JunkShape } from "@/types/JunkShape"

export type JunkDragFormat = `pdx/junk:${number}:${number}`

const junkDragPattern = /^pdx\/junk:(\d+):(\d+)$/

export const isJunkDragFormat = (format: string): format is JunkDragFormat => {
  return junkDragPattern.test(format)
}

/**
 * If the event's data transfer has a JunkDragFormat type, return it.
 * Otherwise, return null.
 */
export const getJunkDragFormat = (event: DragEvent): JunkDragFormat | null => {
  for (const type of event.dataTransfer?.types || []) {
    if (isJunkDragFormat(type))
      return type
  }
  return null
}

export const getJunkDragDimensions = (format: JunkDragFormat): [number, number] => {
  const match = format.match(junkDragPattern)
  if (!match || !match[1] || !match[2])
    throw new TypeError(`Invalid junk drag format: ${format}`)
  return [parseInt(match[1], 10), parseInt(match[2], 10)]
}

export interface JunkDragData {
  shape: JunkShape
  color: BlockColor
  effect: JunkEffect | null
}

export const isJunkDragData = (data: unknown): data is JunkDragData => {
  return typeof data === 'object'
    && data !== null
    && 'shape' in data
    && typeof data.shape === typeof JunkShape.RECT_1X1
    && 'color' in data
    && typeof data.color === typeof BlockColor.GRAY
    && 'effect' in data
    && (data.effect === null || typeof data.effect === typeof JunkEffect.Heavy)
}

export const getJunkDragData = (event: DragEvent): JunkDragData | null => {
  const format = getJunkDragFormat(event)
  if (!format || !event.dataTransfer)
    return null

  const data = JSON.parse(event.dataTransfer.getData(format))

  return isJunkDragData(data) ? data : null
}
