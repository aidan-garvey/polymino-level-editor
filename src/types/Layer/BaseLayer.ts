import type { BlockColor } from '@/types/BlockColor'
import type { SavedBaseLayer } from '@/types/Saved/SavedBaseLayer'
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
   * RNG seed used to populate the initial board. This is only used in the
   * editor; when levels are exported, all cell grids are combined and exported
   * in their entirety.
   */
  private readonly seed: Ref<number>

  /**
   * How many rows of blocks to add to the base layer.
   */
  private readonly rows: Ref<number>

  private bannedColor?: BlockColor

  constructor(
    seed = Math.round(performance.now()),
    rows = BOARD_HEIGHT
  ) {
    this.board = new CellGrid(BOARD_WIDTH, BOARD_HEIGHT, false)
    this.board.blockOpacity.value = 0.25
    this.seed = ref(seed)
    this.rows = ref(rows)
    this.generateGrid()
  }

  static fromSaved(data: SavedBaseLayer): BaseLayer {
    const result = new BaseLayer(data.seed, data.rows)
    result.setBannedColor(data.bannedColor)
    return result
  }

  save(): SavedBaseLayer {
    return {
      rows: this.rows.value,
      seed: this.seed.value,
      bannedColor: this.bannedColor
    }
  }

  getSeed(): number {
    return this.seed.value
  }
  setSeed(seed: number): void {
    this.seed.value = seed
    this.generateGrid()
  }

  getRows(): number {
    return this.rows.value
  }
  setRows(rows: number): void {
    this.rows.value = rows
    this.generateGrid()
  }

  getBannedColor(): BlockColor | undefined {
    return this.bannedColor
  }
  setBannedColor(color?: BlockColor): void {
    this.bannedColor = color
    this.generateGrid()
  }

  private getColor(row: number, col: number): BlockColor | null {
    const block = this.board.getBlock(row, col)
    return block.color
  }

  private isVerticalMatch(row: number, col: number, color: BlockColor) {
    return row >= 2
      && this.getColor(row - 1, col) === color
      && this.getColor(row - 2, col) === color
  }

  private isHorizontalMatch(row: number, col: number, color: BlockColor) {
    return col >= 2
      && this.getColor(row, col - 1) === color
      && this.getColor(row, col - 2) === color
  }

  /**
   * Regenerates the grid when one of the layer's parameters is changed. Always
   * generates a full board of blocks so the final state of the random engine is
   * consistent, then reduces the number of filled rows to this.initialRows.
   */
  private generateGrid(): void {
    const engine = MinstdRand(this.seed.value)

    for (let row = 0; row < this.rows.value; ++row) {
      for (let col = 0; col < BOARD_WIDTH; ++col) {
        let color = randomColor(engine)
        while (color === this.bannedColor
          || this.isVerticalMatch(row, col, color)
          || this.isHorizontalMatch(row, col, color)
        ) {
          color = randomColor(engine)
        }
        this.board.placeBlock(row, col, new NormalBlock(color))
      }
    }
    for (let row = this.rows.value; row < BOARD_HEIGHT; ++row) {
      for (let col = 0; col < BOARD_WIDTH; ++col) {
        this.board.removeBlock(row, col)
      }
    }
  }
}
