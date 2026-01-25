import type { BlockColor } from '@/types/BlockColor'
import type { RandomEngine } from '@/utils/RandomEngine'
import { MinstdRand } from '@/utils/RandomEngine'

const colorEngine = MinstdRand(Math.round(Date.now()))

/**
 * Returns a random non-gray color using the given PRNG engine.
 */
export function randomColor(engine: RandomEngine): BlockColor

/**
 * Returns a random non-gray color using a global PRNG engine.
 */
export function randomColor(): BlockColor

export function randomColor(engine?: RandomEngine): BlockColor {
  return (engine ?? colorEngine).gen() % 8
}
