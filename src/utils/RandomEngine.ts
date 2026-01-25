export interface RandomEngine {
  gen(): number
  getState(): number
}

/**
 * TS implementation of C++'s std::linear_congruential_engine.
 * It uses BigInts internally to ensure all computations are done with integers.
 */
export class LinearCongruentialEngine implements RandomEngine {
  private readonly multiplier: bigint
  private readonly increment: bigint
  private readonly modulus: bigint

  private state: bigint

  constructor(
    multiplier: number,
    increment: number,
    modulus: number,
    seed: number,
  ) {
    this.modulus = BigInt(modulus)
    this.multiplier = BigInt(multiplier)
    this.increment = BigInt(increment)
    this.state = BigInt(seed)
  }

  gen(): number {
    this.state = (this.multiplier * this.state + this.increment) % this.modulus
    return Number(this.state)
  }

  getState(): number {
    return Number(this.state)
  }
}

/**
 * Specialization of LinearCongruentialEngine which uses the same parameters as
 * C++'s std::minstd_rand.
 */
export const MinstdRand = (seed: number) => new LinearCongruentialEngine(
  48271, // multiplier
  0, // increment
  2147483647, // modulus
  seed,
)
