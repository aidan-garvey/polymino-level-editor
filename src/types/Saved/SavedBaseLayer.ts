import { BlockColor } from '@/types/BlockColor'

export interface SavedBaseLayer {
  readonly seed: number
  readonly rows: number
  readonly bannedColor?: BlockColor
}

export const isSavedBaseLayer = (data: unknown): data is SavedBaseLayer => {
  return typeof data === 'object'
    && data !== null
    && 'seed' in data
    && typeof data.seed === 'number'
    && 'rows' in data
    && typeof data.rows === 'number'
    && (
      !('bannedColor' in data)
      || data.bannedColor === undefined
      || typeof data.bannedColor === typeof BlockColor.BLUE
    )
}

export const savedBaseLayersEqual = (
  a: SavedBaseLayer,
  b: SavedBaseLayer,
) => {
  return a.seed === b.seed
    && a.rows === b.rows
    && a.bannedColor === b.bannedColor
}
