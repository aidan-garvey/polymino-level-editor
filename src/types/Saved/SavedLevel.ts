import type { SavedBaseLayer } from '@/types/Saved/SavedBaseLayer'
import type { ExportedCellGrid } from '@/types/Exported/ExportedCellGrid'
import { isSavedBaseLayer, savedBaseLayersEqual } from '@/types/Saved/SavedBaseLayer'
import { isExportedCellGrid, exportedCellGridsEqual } from '@/types/Exported/ExportedCellGrid'

export interface SavedLevel {
  readonly name: string
  readonly baseLayer: SavedBaseLayer
  readonly brushLayer: ExportedCellGrid
  readonly junkLayer: ExportedCellGrid
  readonly seed: number
  /**
   * Metadata used to display how long ago levels were modified in the UI and
   * sort saved levels.
   */
  readonly lastModified: ReturnType<typeof Date.prototype.toISOString>
}

export const isSavedLevel = (data: unknown): data is SavedLevel => {
  return typeof data === 'object'
    && data !== null
    && 'name' in data
    && typeof data.name === 'string'
    && 'baseLayer' in data
    && isSavedBaseLayer(data.baseLayer)
    && 'brushLayer' in data
    && isExportedCellGrid(data.brushLayer)
    && 'junkLayer' in data
    && isExportedCellGrid(data.junkLayer)
    && 'seed' in data
    && typeof data.seed === 'number'
    && 'lastModified' in data
    && typeof data.lastModified === 'string'
}

/**
 * Return true if the two saved levels are equal **ignoring `lastModified`.**
 * `lastModified` is ignored because it is metadata which doesn't affect the
 * level itself. This function's purpose is to compare the actual state of each
 * given level, not metadata.
 */
export const savedLevelsEqual = (a: SavedLevel, b: SavedLevel) => {
  return a.name === b.name
    && savedBaseLayersEqual(a.baseLayer, b.baseLayer)
    && exportedCellGridsEqual(a.brushLayer, b.brushLayer)
    && exportedCellGridsEqual(a.junkLayer, b.junkLayer)
    && a.seed === b.seed
}
