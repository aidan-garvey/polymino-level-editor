import type { Tool } from '@/types/Tool'
import { BOARD_HEIGHT, BOARD_WIDTH } from '@/consts/board'
import { BlockState } from '@/types/BlockState'
import { CellGrid } from '@/types/CellGrid'
import { NormalBlock } from '@/types/Block'
import { Junk } from '@/types/Junk'
import { JunkShape } from '@/types/JunkShape'

export class BrushLayer {
  readonly board: CellGrid

  constructor() {
    this.board = new CellGrid(BOARD_WIDTH, BOARD_HEIGHT, false)
  }

  applyBrush(tool: Tool, row: number, col: number): void {
    switch (tool.brushState) {
      case BlockState.EMPTY:
        this.board.removeBlock(row, col)
        break
      case BlockState.NORMAL:
        if (tool.brushColor !== null) {
          this.board.placeBlock(row, col, new NormalBlock(tool.brushColor))
        }
        break
      case BlockState.JUNK:
        if (tool.brushColor !== null) {
          this.board.placeJunk(new Junk(
            JunkShape.RECT_1X1,
            tool.brushColor,
            row,
            col,
            tool.brushEffect
          ))
        } else {
          this.board.applyJunkEffect(row, col, tool.brushEffect)
        }
        break
    }
  }
}
