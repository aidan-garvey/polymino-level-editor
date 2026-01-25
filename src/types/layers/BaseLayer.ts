import type { BlockColor } from '@/types/BlockColor'
import { NormalBlock } from '@/types/Block'
import { CellGrid } from '@/types/CellGrid'
import { MinstdRand } from '@/utils/RandomEngine'
import { BOARD_HEIGHT, BOARD_WIDTH } from '@/consts/board'
import { randomColor } from '@/utils/randomColor'

/**
 * The base layer consists of an initial CellGrid filled with random blocks.
 */
export class BaseLayer {
  readonly board: CellGrid

  /**
   * RNG seed used to populate the initial board.
   */
  private seed: number

  /**
   * How many rows of blocks to add to the base layer.
   */
  private rows: number

  private bannedColor?: BlockColor

  constructor(
    seed = Math.round(performance.now()),
    rows = BOARD_HEIGHT
  ) {
    this.board = new CellGrid(BOARD_WIDTH, BOARD_HEIGHT, false)
    this.board.blockOpacity.value = 0.25
    this.seed = seed
    this.rows = rows
    this.generateGrid()
  }

  getSeed(): number {
    return this.seed
  }
  setSeed(seed: number): void {
    this.seed = seed
    this.generateGrid()
  }

  getRows(): number {
    return this.rows
  }
  setRows(rows: number): void {
    this.rows = rows
    this.generateGrid()
  }

  getBannedColor(): BlockColor | undefined {
    return this.bannedColor
  }
  setBannedColor(color?: BlockColor): void {
    this.bannedColor = color
    this.generateGrid()
  }

  /**
   * Regenerates the grid when one of the layer's parameters is changed. Always
   * generates a full board of blocks so the final state of the random engine is
   * consistent, then reduces the number of filled rows to this.initialRows.
   */
  private generateGrid(): void {
    const engine = MinstdRand(this.seed)

    for (let row = 0; row < this.rows; ++row) {
      for (let col = 0; col < BOARD_WIDTH; ++col) {
        let color = randomColor(engine)
        while (color === this.bannedColor) {
          color = randomColor(engine)
        }
        this.board.placeBlock(row, col, new NormalBlock(color))
      }
    }
    for (let row = this.rows; row < BOARD_HEIGHT; ++row) {
      for (let col = 0; col < BOARD_WIDTH; ++col) {
        this.board.removeBlock(row, col)
      }
    }
  }
}
