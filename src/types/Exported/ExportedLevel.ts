import type { ExportedCellGrid } from '@/types/Exported/ExportedCellGrid'

/**
 * Finalized, exported level data. Does not store the information required to
 * fully restore the editor's working state when the level was exported.
 */
export interface ExportedLevel extends ExportedCellGrid {
  // will contain fields other than the initial cell grid's blocks & junk such
  // as the RNG seed, objective details, etc.
  // maybe even a customized junk queue where the puzzle setter can specify the
  // junk pieces that can be dropped, if that's a thing that'd be fun
  readonly name: string
  readonly seed: number
}
