import { CellGrid } from '@/types/CellGrid'
import { BOARD_WIDTH, BOARD_HEIGHT } from '@/consts/board'
import { getJunkDragFormat, getJunkDragDimensions, getJunkDragData } from '@/types/JunkDrag'
import { Junk } from '@/types/Junk'
import { junkShapeDimensions } from '@/consts/junk'

export class JunkLayer {
  readonly junkBlocks: CellGrid
  readonly nextBlocks: CellGrid

  constructor() {
    this.junkBlocks = new CellGrid(BOARD_WIDTH, BOARD_HEIGHT)
    this.nextBlocks = new CellGrid(BOARD_WIDTH, BOARD_HEIGHT)
  }

  onCellDragOver(event: DragEvent, row: number, col: number): void {
    const format = getJunkDragFormat(event)
    if (!format)
      return

    const [width, height] = getJunkDragDimensions(format)
    if (this.junkBlocks.canPlaceJunk(row, col, width, height)) {
      event.preventDefault()
    }
  }

  onCellDrop(event: DragEvent, row: number, col: number): void {
    const data = getJunkDragData(event)
    if (!data)
      return

    const [width, height] = junkShapeDimensions[data.shape]
    if (!this.junkBlocks.canPlaceJunk(row, col, width, height))
      return

    event.preventDefault()

    this.junkBlocks.placeJunk(new Junk(
      data.shape,
      data.color,
      row,
      col,
      data.effect
    ))
  }
}
