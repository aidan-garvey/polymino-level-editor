import { type ExportedBlock, isExportedBlock } from '@/types/Exported/ExportedBlock'
import { type ExportedJunk, isExportedJunk } from '@/types/Exported/ExportedJunk'

export interface ExportedCellGrid {
  readonly cells: ExportedBlock[][]
  readonly junkPieces: ExportedJunk[]
}

export const isExportedCellGrid = (data: unknown): data is ExportedCellGrid => {
  return typeof data === 'object'
    && data !== null
    && 'cells' in data
    && Array.isArray(data.cells)
    && data.cells.every(row => {
      return Array.isArray(row)
        && row.every(isExportedBlock)
    })
    && 'junkPieces' in data
    && Array.isArray(data.junkPieces)
    && data.junkPieces.every(isExportedJunk)
}
