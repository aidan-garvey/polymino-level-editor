export abstract class Keyframe {
  /** Keyframe duration */
  private readonly duration: number
  /** Delay before keyframe starts in the animation */
  private readonly delay: number
  /**
   * True if the keyframe finished in the last call to advance(), tracking this
   * lets us ensure the keyframe doesn't affect anything after it is finished.
   */
  protected finished: boolean

  constructor(duration: number, delay: number) {
    this.duration = duration
    this.delay = delay
    this.finished = false
  }

  public get startTime() {
    return this.delay
  }
  public get endTime() {
    return this.delay + this.duration
  }

  /**
   * Advances the keyframe to the given position, returning true if the keyframe
   * is finished playing.
   */
  abstract advance(timestamp: number): boolean

  /**
   * Resets the state of the keyframe, allowing it to be replayed.
   */
  reset(): void {
    this.finished = false
  }
}

export class KfCallback extends Keyframe {
  private readonly callback: () => void

  constructor(duration: number, delay: number, callback: () => void) {
    super(duration, delay)
    this.callback = callback
  }

  override advance(timestamp: number): boolean {
    if (this.finished) {
      return true
    }

    if (timestamp >= this.endTime) {
      this.callback()
      this.finished = true
      return true
    } else {
      return false
    }
  }
}
