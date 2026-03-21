import { Animation } from '@/types/Animation/Animation'
import { type Keyframe, KfCallback } from '@/types/Animation/Keyframe'

type KfCallbackFactory = (delay: number) => KfCallback

// This can be overloaded for additional keyframe types
function makeKfFactory(duration: number, callback: () => void): KfCallbackFactory

function makeKfFactory(duration: number, callback: () => void) {
  return (delay: number) => new KfCallback(duration, delay, callback)
}

type KfFactoryArgs = Parameters<typeof makeKfFactory>

export const makeAnimation = (args: KfFactoryArgs[]): Animation => {
  const frames: Keyframe[] = []
  let nextDelay = 0
  for (const a of args) {
    const next = makeKfFactory(...a)(nextDelay)
    nextDelay += next.endTime
    frames.push(next)
  }
  return new Animation(frames)
}
