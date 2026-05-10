import type { ExportedBlock } from '@/types/Exported/ExportedBlock'
import type { ExportedJunk } from '@/types/Exported/ExportedJunk'
import { isExportedBlock, exportedBlocksEqual } from '@/types/Exported/ExportedBlock'
import { isExportedJunk, exportedJunkEqual } from '@/types/Exported/ExportedJunk'

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

export const exportedCellGridsEqual = (
  a: ExportedCellGrid,
  b: ExportedCellGrid,
) => {
  if (a.cells.length !== b.cells.length)
    return false

  for (let rowIndex = 0; rowIndex < a.cells.length; ++rowIndex) {
    const rowA = a.cells[rowIndex]
    const rowB = b.cells[rowIndex]

    if (!rowA || !rowB || rowA.length !== rowB.length) {
      return false
    }

    for (let blockIndex = 0; blockIndex < rowA.length; ++blockIndex) {
      const blockA = rowA[blockIndex]
      const blockB = rowB[blockIndex]

      if (!blockA || !blockB || !exportedBlocksEqual(blockA, blockB)) {
        return false
      }
    }
  }

  if (a.junkPieces.length !== b.junkPieces.length)
    return false

  for (let junkIndex = 0; junkIndex < a.junkPieces.length; ++junkIndex) {
    const junkA = a.junkPieces[junkIndex]
    const junkB = b.junkPieces[junkIndex]

    if (!junkA || !junkB || !exportedJunkEqual(junkA, junkB)) {
      return false
    }
  }

  return true
}
