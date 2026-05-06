import type { CellGrid } from '@/types/CellGrid'

export interface Layer {
  readonly board: CellGrid
  setNormalModeOpacity: () => void
  setNextColorModeOpacity: () => void
}
