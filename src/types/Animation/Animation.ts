import type { Keyframe } from '@/types/Animation/Keyframe'

export class Animation {
  private readonly keyframes: Keyframe[]
  /** Index of the current keyframe */
  private index = 0
  /**
   * Store the return value of requestAnimationFrame so we can halt playing
   * animations.
   */
  private animFrameReq: number | null = null
  /**
   * Stores the timestamp at the start of the animation to track elapsed time.
   */
  private animationStart: number | null = null

  constructor(keyframes: Keyframe[]) {
    this.keyframes = keyframes
  }

  play() {
    this.reset()
    this.animFrameReq = requestAnimationFrame(t => this.advance(t))
  }

  stop() {
    if (this.animFrameReq !== null) {
      cancelAnimationFrame(this.animFrameReq)
    }
  }

  private reset() {
    this.animationStart = null
    for (const k of this.keyframes) {
      k.reset()
    }
  }

  private advance(timestamp: number) {
    if (this.animationStart === null) {
      this.animationStart = timestamp
    }

    const t = timestamp - this.animationStart
    while (this.index < this.keyframes.length) {
      const curr = this.keyframes[this.index]
      if (!curr || curr.advance(t)) {
        ++this.index
      } else {
        break
      }
    }
    if (this.index < this.keyframes.length) {
      this.animFrameReq = requestAnimationFrame(time => this.advance(time))
    }
  }
}
