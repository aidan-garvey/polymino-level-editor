import type { JunkShape } from '@/types/JunkShape'
import type { JunkEffect } from '@/types/JunkEffect'
import type { ExportedJunk } from '@/types/Exported/ExportedJunk'
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

  export(): ExportedJunk {
    return {
      shape: this.shape,
      color: this.color,
      bottomRow: this.bottomRow,
      leftColumn: this.leftColumn,
      activeEffect: this.activeEffect ?? undefined
    }
  }

  static fromExported(exported: ExportedJunk | Junk): Junk {
    return new Junk(
      exported.shape,
      exported.color,
      exported.bottomRow,
      exported.leftColumn,
      exported.activeEffect
    )
  }
}
