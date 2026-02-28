import type { JunkDragData } from '@/types/JunkDrag'
import { CellGrid } from '@/types/CellGrid'
import { BOARD_WIDTH, BOARD_HEIGHT } from '@/consts/board'
import { getJunkDragFormat, getJunkDragDimensions, getJunkDragData } from '@/types/JunkDrag'
import { Junk } from '@/types/Junk'
import { junkShapeDimensions } from '@/consts/junk'

export class JunkLayer {
  readonly board: CellGrid

  constructor(board?: CellGrid) {
    this.board = board ?? new CellGrid(BOARD_WIDTH, BOARD_HEIGHT, true)
  }

  onCellDragOver(event: DragEvent, row: number, col: number): void {
    const format = getJunkDragFormat(event)
    if (!format || !event.dataTransfer)
      return

    const [width, height] = getJunkDragDimensions(format)
    if (this.board.canPlaceJunk(row, col, width, height)) {
      event.preventDefault()
      // Holding shift copies junk, otherwise it gets moved
      if (event.shiftKey) {
        event.dataTransfer.dropEffect = 'copy'
      } else {
        event.dataTransfer.dropEffect = 'move'
      }
    }
  }

  onCellDrop(event: DragEvent, row: number, col: number): Junk | null {
    const data = getJunkDragData(event)
    if (!data)
      return null

    const [width, height] = junkShapeDimensions[data.shape]
    if (!this.board.canPlaceJunk(row, col, width, height))
      return null

    event.preventDefault()

    const existing = this.board.getJunkById(data.id)

    // Holding shift copies junk, otherwise it gets moved if it isn't coming
    // from another cell grid
    if (!existing || event.shiftKey) {
      return this.placeJunk(data, row, col)
    } else {
      return this.board.moveJunk(existing, row, col)
    }
  }

  private placeJunk(data: JunkDragData, row: number, col: number): Junk {
    return this.board.placeJunk(new Junk(
      data.shape,
      data.color,
      row,
      col,
      data.effect
    ))
  }
}
