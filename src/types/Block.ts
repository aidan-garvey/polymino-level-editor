import type { BlockColor } from '@/types/BlockColor'
import type { Junk } from '@/types/Junk'
import type { JunkBlockType } from '@/types/JunkBlockType'
import type {
  ExportedBlock,
  ExportedEmptyBlock,
  ExportedNormalBlock,
  ExportedJunkBlock
} from '@/types/Exported/ExportedBlock'
import { BlockState } from '@/types/BlockState'
import { JunkEffect } from '@/types/JunkEffect'
import { blockColorNames } from '@/consts/block'
import { junkBlockPathSuffixes, junkFlipMap } from '@/consts/junk'
import { overlayBlockPathSuffixes } from '@/consts/effects'
import { randomColor } from '@/utils/randomColor'

interface IBlock {
  export(): ExportedBlock
  getImageSrc(): string
  getOverlaySrc(): string | null
  getImageFlip(): [boolean, boolean]
}

export class EmptyBlock implements IBlock {
  readonly state: BlockState.EMPTY = BlockState.EMPTY

  // Here so checking the color on any block doesn't cause a TS error due to the
  // property possibly not existing, but the value might be null unless we check
  // its state first.
  readonly color: null = null

  export(): ExportedEmptyBlock {
    return {
      state: this.state
    }
  }

  getImageSrc(): string {
    return 'assets/empty.png'
  }
  getOverlaySrc(): string | null {
    return null
  }
  getImageFlip(): [boolean, boolean] {
    return [false, false]
  }
}

export class NormalBlock implements IBlock {
  readonly state: BlockState.NORMAL = BlockState.NORMAL

  readonly color: BlockColor

  constructor(
    color: BlockColor,
  ) {
    this.color = color
  }

  export(): ExportedNormalBlock {
    return {
      state: this.state,
      color: this.color
    }
  }

  getImageSrc(): string {
    const colorName = blockColorNames[this.color]
    return `assets/blocks/${colorName}.png`
  }
  getOverlaySrc(): string | null {
    return null
  }
  getImageFlip(): [boolean, boolean] {
    return [false, false]
  }
}

export class JunkBlock implements IBlock {
  readonly state: BlockState.JUNK = BlockState.JUNK

  /**
   * Reference to the junk piece that this block belongs to
   */
  readonly junk: Junk
  readonly junkBlockType: JunkBlockType
  nextColor: BlockColor

  public get color(): BlockColor {
    return this.junk.color
  }

  constructor(
    junk: Junk,
    junkBlockType: JunkBlockType,
    nextColor: BlockColor = randomColor(),
  ) {
    this.junk = junk
    this.junkBlockType = junkBlockType
    this.nextColor = nextColor
  }

  export(): ExportedJunkBlock {
    return {
      state: this.state,
      color: this.color,
      nextColor: this.nextColor
    }
  }

  getImageSrc(): string {
    const colorName = this.junk.activeEffect === JunkEffect.Heavy
      ? 'black'
      : blockColorNames[this.color]
    const suffix = junkBlockPathSuffixes[this.junkBlockType]
    return `assets/junk/${colorName}${suffix}.png`
  }

  getOverlaySrc(): string | null {
    const overlaySuffix = overlayBlockPathSuffixes[this.junkBlockType]
    let blockSuffix = junkBlockPathSuffixes[this.junkBlockType]
    if (!blockSuffix[0])
      throw new Error('Block suffix is empty')
    blockSuffix = blockSuffix[0].toLowerCase() + blockSuffix.slice(1)

    switch (this.junk.activeEffect) {
      case JunkEffect.Armored:
        return `assets/effects/bombonly/${overlaySuffix}.png`
      case JunkEffect.BombProof:
        return `assets/effects/bombproof/${blockSuffix}.png`
      case JunkEffect.Blocker:
        return 'assets/effects/blocker.png'
      case JunkEffect.ExplodingJunk:
        return 'assets/effects/exploding.png'
      case JunkEffect.Heavy:
        return 'assets/effects/heavy.webp'
      case null:
        return null
    }
  }

  getImageFlip(): [boolean, boolean] {
    return junkFlipMap[this.junkBlockType]
  }

  getNextImageSrc(): string {
    const colorName = blockColorNames[this.nextColor]
    return `assets/blocks/${colorName}.png`
  }
}

export type Block = EmptyBlock | NormalBlock | JunkBlock
