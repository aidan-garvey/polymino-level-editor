import type { JunkDragData } from '@/types/JunkDrag'
import type { ExportedCellGrid } from '@/types/Exported/ExportedCellGrid'
import type { Layer } from '@/types/Layer/Layer'
import type { BlockColor } from '@/types/BlockColor'
import { CellGrid } from '@/types/CellGrid'
import { BOARD_WIDTH, BOARD_HEIGHT } from '@/consts/board'
import { getJunkDragFormat, getJunkDragDimensions, getJunkDragData } from '@/types/JunkDrag'
import { Junk } from '@/types/Junk'
import { BlockState } from '@/types/BlockState'
import { junkShapeDimensions } from '@/consts/junk'

export class JunkLayer implements Layer {
  readonly board: CellGrid

  constructor(board?: CellGrid) {
    this.board = board ?? new CellGrid(BOARD_WIDTH, BOARD_HEIGHT, true)
    this.setNormalModeOpacity()
  }

  restore(data: ExportedCellGrid): void {
    this.board.restore(data)
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

  paintNextColor(color: BlockColor, row: number, col: number): void {
    const block = this.board.getBlock(row, col)
    if (block.state === BlockState.JUNK) {
      block.nextColor = color
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

  setNormalModeOpacity() {
    // There should never be normal blocks in the junk layer, but if there were,
    // we'd want to see the bug instead of hiding it
    this.board.blockOpacity.value = 1
    this.board.junkOpacity.value = 1
    this.board.nextColorOpacity.value = 0
  }
  setNextColorModeOpacity() {
    this.board.blockOpacity.value = 1
    this.board.junkOpacity.value = 0.5
    this.board.nextColorOpacity.value = 1
  }
}
