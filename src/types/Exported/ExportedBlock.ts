import { BlockState } from '@/types/BlockState'
import { BlockColor } from '@/types/BlockColor'

export interface ExportedEmptyBlock {
  readonly state: BlockState.EMPTY
}

export interface ExportedNormalBlock {
  readonly state: BlockState.NORMAL
  readonly color: BlockColor
}

// Unlike transmitting entire game states when a spectator joins in multiplayer,
// a nice assumption we can make is that each junk piece on the board will be
// fully intact, and thus we can derive which blocks belong to it based on its
// position and shape, instead of storing info in each block to identify its
// piece.
export interface ExportedJunkBlock {
  readonly state: BlockState.JUNK
  readonly color: BlockColor
  readonly nextColor: BlockColor
}

export type ExportedBlock =
  | ExportedEmptyBlock
  | ExportedNormalBlock
  | ExportedJunkBlock

export const isExportedBlock = (data: unknown): data is ExportedBlock => {
  if (typeof data !== 'object' || data === null || !('state' in data)) {
    return false
  }
  switch (data.state) {
    // biome-ignore lint/suspicious/noFallthroughSwitchClause: deliberate
    case BlockState.JUNK:
      if (!('nextColor' in data)
        || typeof data.nextColor !== typeof BlockColor.BLUE
      ) {
        return false
      }
    // biome-ignore lint/suspicious/noFallthroughSwitchClause: deliberate
    case BlockState.NORMAL:
      if (!('color' in data)
        || typeof data.color !== typeof BlockColor.BLUE
      ) {
        return false
      }
    case BlockState.EMPTY:
      return true
    default:
      return false
  }
}
