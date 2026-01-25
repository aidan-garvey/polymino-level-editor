import type { JunkShape } from '@/types/JunkShape'
import type { JunkEffect } from '@/types/JunkEffect'
import { BlockColor } from '@/types/BlockColor'

export class Junk {
  constructor(
    public readonly shape: JunkShape,
    public color = BlockColor.GRAY,
    public bottomRow = 0,
    public leftColumn = 0,
    public activeEffect: JunkEffect | null = null,
  ) {}
}
