// Ones which don't make sense for puzzle mode are commented out
export enum JunkEffect {
  Armored = 'bomb_only',
  BombProof = 'bomb_proof',
  Blocker = 'blocker',
  Heavy = 'heavy',
  // InkBombs = 'ink_bombs',
  ExplodingJunk = 'exploding',
  // Projectiles = 'projectiles',
  // Fragment = 'fragment',
  // Shatter = 'shatter',
  // GrayJunk = 'all_gray',
  // GrayToColored = 'gray_to_color',
  // AllOneColor = 'one_color',
}

export const junkEffects = Object.values(JunkEffect)
