import { JunkShape } from '@/types/JunkShape'
import { JunkEffect } from '@/types/JunkEffect'
import { BlockColor } from '@/types/BlockColor'

export interface ExportedJunk {
  readonly shape: JunkShape
  readonly color: BlockColor
  readonly bottomRow: number
  readonly leftColumn: number
  readonly activeEffect?: JunkEffect
}

export const isExportedJunk = (data: unknown): data is ExportedJunk => {
  return typeof data === 'object'
    && data !== null
    && 'shape' in data
    && typeof data.shape === typeof JunkShape.RECT_1X1
    && 'color' in data
    && typeof data.color === typeof BlockColor.BLUE
    && 'bottomRow' in data
    && typeof data.bottomRow === 'number'
    && 'leftColumn' in data
    && typeof data.leftColumn === 'number'
    && (
      !('activeEffect' in data)
      || data.activeEffect === undefined
      || typeof data.activeEffect === typeof JunkEffect.Armored
    )
}
