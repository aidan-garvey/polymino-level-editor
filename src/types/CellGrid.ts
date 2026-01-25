import type { Junk } from '@/types/Junk'
import type { Block, NormalBlock } from '@/types/Block'
import type { JunkEffect } from '@/types/JunkEffect'
import { EmptyBlock, JunkBlock } from '@/types/Block'
import { JunkBlockType } from '@/types/JunkBlockType'
import { junkShapeBlocks, junkShapeDimensions } from '@/consts/junk'
import { BlockState } from '@/types/BlockState'

export class CellGrid {
  readonly width: number
  readonly height: number
  private readonly cells: Ref<Block>[][]
  private readonly junkPieces: Ref<Junk[]>

  readonly draggableJunk: boolean

  readonly blockOpacity = ref(1)
  readonly junkOpacity = ref(1)
  readonly nextColorOpacity = ref(0)

  constructor(
    width: number,
    height: number,
    draggableJunk: boolean,
  ) {
    this.width = width
    this.height = height
    this.draggableJunk = draggableJunk
    this.cells = Array(height).fill(null).map(() => {
      return Array(width).fill(null).map(() => ref(new EmptyBlock()))
    })
    this.junkPieces = ref([])
  }

  private checkPosition(
    row: number,
    col: number,
    width = 1,
    height = 1,
  ): void {
    if (row < 0
      || row + height > this.height
      || col < 0
      || col + width > this.width
    ) {
      throw new Error(
        `Invalid position (row, col) = (${row}, ${col})` +
        `for ${width}x${height} object`
      )
    }
  }

  private expectedCellError(row: number, col: number): Error {
    return new Error(
      `${this.width}x${this.height} CellGrid has no cell at` +
      `(row, col) = (${row}, ${col})`
    )
  }

  junkBlockPositions(junk: Junk): [number, number][] {
    const [width, height] = junkShapeDimensions[junk.shape]
    const positions: [number, number][] = []

    for (let row = 0; row < height; ++row) {
      const y = junk.bottomRow + row
      if (y < 0 || y >= this.height)
        continue

      for (let col = 0; col < width; ++col) {
        const x = junk.leftColumn + col
        if (x < 0 || x >= this.width)
          continue

        const block = this.getBlock(y, x)
        if (block.state === BlockState.JUNK && block.junk === junk) {
          positions.push([y, x])
        }
      }
    }

    return positions
  }

  getBlock(row: number, col: number): Block {
    this.checkPosition(row, col)
    const cell = this.cells[row]?.[col]
    if (cell) {
      return cell.value
    } else {
      throw this.expectedCellError(row, col)
    }
  }

  removeBlock(y: number, x: number): void {
    const block = this.getBlock(y, x)
    if (block.state === BlockState.JUNK) {
      this.removeJunk(block.junk)
    } else {
      this.placeBlockUnchecked(y, x, new EmptyBlock())
    }
  }

  removeJunk(junk: Junk): void {
    for (const [y, x] of this.junkBlockPositions(junk))
      this.placeBlockUnchecked(y, x, new EmptyBlock())

    const junkIndex = this.junkPieces.value.indexOf(junk)
    if (junkIndex !== -1)
      this.junkPieces.value.splice(junkIndex, 1)
  }

  removeJunkById(id: number): void {
    for (const junk of this.junkPieces.value) {
      if (junk.id === id) {
        this.removeJunk(junk)
        return
      }
    }
  }

  /**
   * The main reason this is separate from placeBlock is so only NormalBlocks
   * can be placed directly in the grid by external code.
   */
  private placeBlockUnchecked(y: number, x: number, block: Block): void {
    if (this.cells[y]?.[x]) {
      this.cells[y][x].value = block
    } else {
      throw this.expectedCellError(y, x)
    }
  }

  canPlaceJunk(row: number, col: number, width: number, height: number): boolean {
    try {
      this.checkPosition(row, col, width, height)
      return true
    } catch {
      return false
    }
  }

  placeBlock(y: number, x: number, block: NormalBlock): void {
    this.checkPosition(y, x)
    this.removeBlock(y, x)
    this.placeBlockUnchecked(y, x, block)
  }

  placeJunk(junk: Junk): void {
    const [width, height] = junkShapeDimensions[junk.shape]
    this.checkPosition(junk.bottomRow, junk.leftColumn, width, height)

    const blockTypes = junkShapeBlocks[junk.shape]
    let blockIndex = 0

    for (let row = 0; row < height; ++row) {
      const junkY = row + junk.bottomRow

      for (let col = 0; col < width; ++col) {
        const junkX = col + junk.leftColumn

        const blockType = blockTypes[blockIndex++]
        if (blockType === undefined)
          throw new Error(`Junk shape ${junk.shape} has too few blocks`)
        else if (blockType === JunkBlockType.EMPTY)
          continue

        this.removeBlock(junkY, junkX)
        this.placeBlockUnchecked(junkY, junkX, new JunkBlock(junk, blockType))
      }
    }
    this.junkPieces.value.push(junk)
  }

  applyJunkEffect(y: number, x: number, effect: JunkEffect | null): void {
    const cell = this.getBlock(y, x)
    if (cell.state === BlockState.JUNK) {
      cell.junk.activeEffect = effect
    }
  }

  getJunk(): Junk[] {
    return this.junkPieces.value
  }
}
