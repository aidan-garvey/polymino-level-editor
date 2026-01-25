import type { BlockColor } from '@/types/BlockColor'
import type { RandomEngine } from '@/utils/RandomEngine'
import { MinstdRand } from '@/utils/RandomEngine'

/**
 * Returns a random non-gray color using the given PRNG engine.
 */
export function randomColor(engine: RandomEngine): BlockColor

/**
 * Returns a random non-gray color using Math.random to seed a new PRNG engine.
 */
export function randomColor(): BlockColor

export function randomColor(engine?: RandomEngine): BlockColor {
  engine ??= MinstdRand(Math.round(performance.now()))
  return engine.gen() % 8
}
