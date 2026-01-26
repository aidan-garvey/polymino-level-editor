export interface JunkBlockPosition {
  /** 0-based index relative to the bottom of the board */
  cellGridRow: number
  /** 0-based index relative to the left of the board */
  cellGridCol: number
  /** 1-based index relative to the top of the junk piece */
  cssGridRow: number
  /** 1-based index relative to the left of the junk piece */
  cssGridCol: number
}
