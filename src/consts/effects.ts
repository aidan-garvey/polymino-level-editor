import { JunkEffect } from '@/types/JunkEffect'
import { JunkBlockType } from '@/types/JunkBlockType'

export const junkEffectNames: Record<JunkEffect, string> = {
  [JunkEffect.Armored]: 'Armored',
  [JunkEffect.BombProof]: 'Bomb-proof',
  [JunkEffect.Blocker]: 'Blocker',
  [JunkEffect.Heavy]: 'Heavy',
  [JunkEffect.ExplodingJunk]: 'Explosive',
}

// fallbacks if an image isn't available, should only be used temporarily when
// implementing new effects
export const junkEffectIcons: Record<JunkEffect, string> = {
  [JunkEffect.Armored]: 'shield',
  [JunkEffect.BombProof]: 'bomb',
  [JunkEffect.Blocker]: 'block',
  [JunkEffect.Heavy]: 'arrow_downward',
  [JunkEffect.ExplodingJunk]: 'explosion',
}

export const overlayBlockPathSuffixes: Record<JunkBlockType, string> = {
  [JunkBlockType.EMPTY]:         '',
  [JunkBlockType.CENTER]:        'center',
  [JunkBlockType.CORNER_IN_TL]:  'cornerInTL',
  [JunkBlockType.CORNER_IN_TR]:  'cornerInTR',
  [JunkBlockType.CORNER_IN_BL]:  'cornerInBL',
  [JunkBlockType.CORNER_IN_BR]:  'cornerInBR',
  [JunkBlockType.CORNER_OUT_TL]: 'cornerOutTL',
  [JunkBlockType.CORNER_OUT_TR]: 'cornerOutTR',
  [JunkBlockType.CORNER_OUT_BL]: 'cornerOutBL',
  [JunkBlockType.CORNER_OUT_BR]: 'cornerOutBR',
  [JunkBlockType.EDGE_TOP]:      'edgeTop',
  [JunkBlockType.EDGE_BOTTOM]:   'edgeBottom',
  [JunkBlockType.EDGE_LEFT]:     'edgeLeft',
  [JunkBlockType.EDGE_RIGHT]:    'edgeRight',
  [JunkBlockType.SINGLE]:        'single',
  [JunkBlockType.ROW_LEFT]:      'rowLeft',
  [JunkBlockType.ROW_MID]:       'rowMid',
  [JunkBlockType.ROW_RIGHT]:     'rowRight',
}
