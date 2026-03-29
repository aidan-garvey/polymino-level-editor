import type { SavedLevel } from '@/types/Saved/SavedLevel'
import type { ExportedLevel } from '@/types/Exported/ExportedLevel'
import { CellGrid } from '@/types/CellGrid'
import { BaseLayer } from '@/types/Layer/BaseLayer'
import { BOARD_HEIGHT, BOARD_WIDTH } from '@/consts/board'

/**
 * Generates an ExportedLevel from a SavedLevel. This is a lossy operation.
 */
export const exportSavedLevel = (level: SavedLevel): ExportedLevel => {
  const combined = new CellGrid(BOARD_WIDTH, BOARD_HEIGHT, false)
  const base = BaseLayer.fromSaved(level.baseLayer)
  const brush = CellGrid.fromExported(level.brushLayer, false)
  const junk = CellGrid.fromExported(level.junkLayer, false)
  base.board.overlayOnto(combined)
  brush.overlayOnto(combined)
  junk.overlayOnto(combined)
  return {
    ...combined.export(),
    name: level.name,
    seed: level.seed,
  }
}
