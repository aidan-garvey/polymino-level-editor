import { type SavedBaseLayer, isSavedBaseLayer } from '@/types/Saved/SavedBaseLayer'
import { type ExportedCellGrid, isExportedCellGrid } from '@/types/Exported/ExportedCellGrid'

export interface SavedLevel {
  readonly name: string
  readonly baseLayer: SavedBaseLayer
  readonly brushLayer: ExportedCellGrid
  readonly junkLayer: ExportedCellGrid
  readonly seed: number
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
