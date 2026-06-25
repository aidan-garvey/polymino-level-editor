/**
 * Junk piece modifiers originally from Junk Attack. Certain ones which exist in
 * Junk Attack aren't enabled in the puzzle editor because they don't make sense
 * in this mode.
 * @see https://polymino.net/wiki/junkatk/Junk%20Effects
 */
export enum JunkEffect {
  /**
   * Can only be destroyed by bombs. In Puzzle Mode this means it can only be
   * destroyed by junk with the ExplodingJunk modifier.
   */
  Armored = 'bomb_only',

  /**
   * Cannot be destroyed by bombs. In Puzzle Mode this means it cannot be
   * destroyed by junk with the ExplodingJunk modifier.
   */
  BombProof = 'bomb_proof',

  /**
   * Destroys any projectile it touches. However, if the projectile is the right
   * color to shatter the junk piece, the junk piece will still be shattered
   * when it destroys the projectile.
   */
  Blocker = 'blocker',

  /**
   * Cannot be destroyed by bombs or projectiles. The only way to destroy it is
   * to get the bottom row of the piece to a certain height in the board.
   * Currently this is hard-coded at row 2 (0-indexed) like it is in Junk
   * Attack, but this may be configurable for Puzzle Mode in the future.
   */
  Heavy = 'heavy',

  /**
   * When destroyed, each block temporarily covers its manhattan neighbors in
   * black ink. Pointless in Puzzle Mode where there's no time constraint and
   * the player can just wait it out.
   */
  // InkBombs = 'ink_bombs',

  /**
   * When destroyed, each block explodes, destroying its manhattan neighbors
   * (unless they're immune to bombs, i.e. bomb-proof or heavy junk).
   */
  ExplodingJunk = 'exploding',

  /**
   * When destroyed, each block launches a projectile in a random direction.
   * This one may be introduced into Puzzle Mode in the future, but it'll have
   * to be reworked to be more deterministic first, like being able to control
   * the projectile direction in the editor.
   */
  // Projectiles = 'projectiles',

  /**
   * Lightning round of effects which only make sense in Junk Attack where they
   * can be applied mid-game, and in Puzzle Mode it's obvious that you can just
   * use the level editor's tools instead:
   */
  // Fragment = 'fragment', // each block becomes 1x1 junk, use a junk brush
  // Shatter = 'shatter', // shatters junk normally, use a block brush
  // GrayJunk = 'all_gray', // turns junk gray, use the junk editor
  // GrayToColored = 'gray_to_color', // gray junk -> colored, use junk editor
  // AllOneColor = 'one_color', // multiple pieces -> one color, use junk editor
}
