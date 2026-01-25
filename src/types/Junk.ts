import type { JunkShape } from '@/types/JunkShape'
import type { JunkEffect } from '@/types/JunkEffect'
import { BlockColor } from '@/types/BlockColor'
import { junkShapeDimensions } from '@/consts/junk'

export class Junk {
  private static ID = 0

  public readonly id: number
  public readonly width: number
  public readonly height: number

  constructor(
    public readonly shape: JunkShape,
    public color = BlockColor.GRAY,
    public bottomRow = 0,
    public leftColumn = 0,
    public activeEffect: JunkEffect | null = null,
  ) {
    this.id = Junk.ID++
    ;[this.width, this.height] = junkShapeDimensions[shape]
  }
}
