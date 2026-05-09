import type { Tool } from '@/types/Tool'
import type { ExportedCellGrid } from '@/types/Exported/ExportedCellGrid'
import type { Layer } from '@/types/Layer/Layer'
import type { BlockColor } from '@/types/BlockColor'
import { BOARD_HEIGHT, BOARD_WIDTH } from '@/consts/board'
import { BlockState } from '@/types/BlockState'
import { CellGrid } from '@/types/CellGrid'
import { NormalBlock } from '@/types/Block'
import { Junk } from '@/types/Junk'
import { JunkShape } from '@/types/JunkShape'

export class BrushLayer implements Layer {
  readonly board: CellGrid

  constructor(board?: CellGrid) {
    this.board = board ?? new CellGrid(BOARD_WIDTH, BOARD_HEIGHT, false)
    this.setNormalModeOpacity()
  }

  restore(data: ExportedCellGrid): void {
    this.board.restore(data)
  }

  paintNextColor(color: BlockColor, row: number, col: number): void {
    const block = this.board.getBlock(row, col)
    if (block.state === BlockState.JUNK) {
      block.nextColor = color
    }
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

  setNormalModeOpacity() {
    this.board.blockOpacity.value = 1
    this.board.junkOpacity.value = 1
    this.board.nextColorOpacity.value = 0
  }
  setNextColorModeOpacity() {
    this.board.blockOpacity.value = 0.75
    this.board.junkOpacity.value = 0.5
    this.board.nextColorOpacity.value = 1
  }
}
